import {
  Bell,
  Bird,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Clipboard,
  Cloud,
  ExternalLink,
  Flame,
  Gamepad2,
  Heart,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Play,
  Plus,
  RadioTower,
  RotateCw,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
  UploadCloud,
  UserPlus,
  Users,
  Wifi,
  Zap
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthScreen } from "./AuthScreen";
import { getProfileFromAuthUser, supabase, supabaseAuthConfigured } from "./auth";
import {
  challenges,
  demoProfile,
  initialClips,
  initialFriends,
  initialSightings,
  rarityPoints,
  recommendations
} from "./data";
import {
  cameraProviders,
  defaultCameraSync,
  getCameraProvider,
  syncStatusLabel
} from "./cameraSync";
import {
  fetchCameraAccountState,
  getSyncStatusForConnectionRequest,
  requestBirdCorrection,
  requestBirdIntelligenceAnalysis,
  requestCameraConnectionRequest,
  requestCameraDeviceRegistration,
  requestCameraRelayManifest,
  requestCameraSyncSession,
  requestDemoCameraClipIngest,
  requestDemoRelayUpload
} from "./cameraApi";
import { CameraRelayPanel } from "./CameraRelayPanel";
import { CameraSyncWizard } from "./CameraSyncWizard";
import type {
  BirdIntelligenceAnalysis,
  BirdManualCorrection,
  CameraAccountState,
  CameraClipIngestResult,
  CameraConnectionRequest,
  CameraDeviceRegistrationResult,
  CameraPrivacyMode,
  CameraProviderId,
  CameraRelayManifest,
  CameraRelayUploadResult,
  CameraReviewRecord,
  CameraSyncSession,
  CameraSyncState,
  Clip,
  Friend,
  Rarity,
  Sighting,
  UserProfile
} from "./types";

const storageKey = "flock-birdwatch-state";
const rarityOptions: Rarity[] = ["Common", "Uncommon", "Rare", "Legendary"];
type CameraAccountLoadStatus = "loading" | "ready" | "offline";
type BirdReviewActionStatus = "idle" | "analyzing" | "correcting";

type AppState = {
  profile: UserProfile;
  friends: Friend[];
  clips: Clip[];
  sightings: Sighting[];
  cameraSync: CameraSyncState;
  lastSyncSession?: CameraSyncSession;
  lastConnectionRequest?: CameraConnectionRequest;
  lastDeviceRegistration?: CameraDeviceRegistrationResult;
  lastRelayManifest?: CameraRelayManifest;
  lastIngestResult?: CameraClipIngestResult;
  lastRelayUpload?: CameraRelayUploadResult;
  lastBirdAnalysis?: BirdIntelligenceAnalysis;
  lastBirdCorrection?: BirdManualCorrection;
};

function getInitialState(): AppState {
  return {
    profile: demoProfile,
    friends: initialFriends,
    clips: initialClips,
    sightings: initialSightings,
    cameraSync: defaultCameraSync
  };
}

function loadState(): AppState {
  const fallback = getInitialState();
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return fallback;

  try {
    const parsed = JSON.parse(stored) as Partial<AppState>;
    return {
      profile: { ...fallback.profile, ...(parsed.profile ?? {}) },
      friends: parsed.friends ?? fallback.friends,
      clips: parsed.clips ?? fallback.clips,
      sightings: parsed.sightings ?? fallback.sightings,
      cameraSync: { ...fallback.cameraSync, ...(parsed.cameraSync ?? {}) },
      lastSyncSession: parsed.lastSyncSession,
      lastConnectionRequest: parsed.lastConnectionRequest,
      lastDeviceRegistration: parsed.lastDeviceRegistration,
      lastRelayManifest: parsed.lastRelayManifest,
      lastIngestResult: parsed.lastIngestResult,
      lastRelayUpload: parsed.lastRelayUpload,
      lastBirdAnalysis: parsed.lastBirdAnalysis,
      lastBirdCorrection: parsed.lastBirdCorrection
    };
  } catch {
    return fallback;
  }
}

function saveState(nextState: AppState) {
  window.localStorage.setItem(storageKey, JSON.stringify(nextState));
}

function getTime(record: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((cursor, key) => {
      if (!cursor || typeof cursor !== "object") return undefined;
      return (cursor as Record<string, unknown>)[key];
    }, record);

    if (value === "Just now") return Number.MAX_SAFE_INTEGER;
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function getLatest<T>(items: T[], paths: string[]): T | undefined {
  const sorted = items
    .map((item, index) => ({ item, index, time: getTime(item, paths) }))
    .sort((left, right) => left.time - right.time || left.index - right.index);
  return sorted[sorted.length - 1]?.item;
}

function getActionError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function mergeById<T extends { id: string }>(incoming: T[], existing: T[]) {
  const seen = new Set<string>();
  return [...incoming, ...existing].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getReviewClip(current: AppState, reviewItem?: CameraReviewRecord): Clip | undefined {
  if (!reviewItem) return undefined;
  if (current.lastRelayUpload?.reviewRecord?.id === reviewItem.id) return current.lastRelayUpload.clip;
  if (current.lastIngestResult?.reviewRecord?.id === reviewItem.id) return current.lastIngestResult.clip;
  return current.clips.find((clip) => clip.id === reviewItem.clipId);
}

function getReviewSighting(current: AppState, reviewItem?: CameraReviewRecord): Sighting | undefined {
  if (!reviewItem) return undefined;
  if (current.lastRelayUpload?.reviewRecord?.id === reviewItem.id) return current.lastRelayUpload.sighting;
  if (current.lastIngestResult?.reviewRecord?.id === reviewItem.id) return current.lastIngestResult.sighting;
  return current.sightings.find((sighting) => sighting.id === reviewItem.sightingId);
}

function getSyncStatusFromSession(session?: CameraSyncSession): CameraSyncState["status"] {
  if (!session) return "not-started";
  if (session.relayRequired) return "relay-required";
  if (session.oauthRequired) return "waiting-on-provider";
  if (session.partnerAccessRequired) return "needs-approval";
  return "synced";
}

function reconcileCameraAccountState(current: AppState, accountState: CameraAccountState): AppState {
  const records = accountState.records;
  const syncSession = getLatest(records.syncSessions, ["createdAt"]);
  const connectionRequest = getLatest(records.connectionRequests, ["requestedAt"]);
  const device = getLatest(records.devices, ["lastSeenAt", "registeredAt"]);
  const relay =
    device?.relayId && records.relayEnrollments.find((candidate) => candidate.relayId === device.relayId)
      ? records.relayEnrollments.find((candidate) => candidate.relayId === device.relayId)
      : getLatest(records.relayEnrollments, ["enrolledAt"]);
  const relayManifests = records.relayManifests ?? [];
  const relayManifest =
    relay?.relayId && relayManifests.find((candidate) => candidate.relayId === relay.relayId)
      ? relayManifests.find((candidate) => candidate.relayId === relay.relayId)
      : getLatest(relayManifests, ["generatedAt"]);
  const relayUpload = getLatest(records.relayUploads, ["acceptedAt"]);
  const clipIngest = getLatest(records.clipIngests, ["reviewRecord.createdAt"]);
  const birdAnalysis = getLatest(records.birdAnalyses ?? [], ["updatedAt", "createdAt"]);
  const birdCorrection = getLatest(records.birdCorrections ?? [], ["correctedAt"]);
  const providerId = syncSession?.providerId ?? connectionRequest?.providerId ?? device?.providerId ?? current.cameraSync.providerId;
  const provider = getCameraProvider(providerId);
  const hasAccountRecords =
    records.syncSessions.length +
      records.connectionRequests.length +
      records.devices.length +
      relayManifests.length +
      records.relayUploads.length +
      records.clipIngests.length >
    0;

  if (!hasAccountRecords) return current;

  const registration = device
    ? ({
        device,
        relay,
        storage: device.storage,
        reviewMessage: device.storage
          ? `Restored ${device.providerName} device from ${device.storage.mode} account storage.`
          : `Restored ${device.providerName} device from account storage.`
      } satisfies CameraDeviceRegistrationResult)
    : current.lastDeviceRegistration;

  const relayUploadTime = getTime(relayUpload, ["acceptedAt"]);
  const clipIngestTime = getTime(clipIngest, ["reviewRecord.createdAt"]);
  const lastIngestResult =
    relayUpload && relayUploadTime >= clipIngestTime
      ? ({
          ingestId: relayUpload.uploadId,
          userId: relayUpload.userId,
          status: "needs-review",
          clip: relayUpload.clip,
          sighting: relayUpload.sighting,
          reviewMessage: relayUpload.reviewMessage,
          storage: relayUpload.storage,
          reviewRecord: relayUpload.reviewRecord
        } satisfies CameraClipIngestResult)
      : clipIngest ?? current.lastIngestResult;

  const nextStatus =
    relayUpload || clipIngest || device?.connectionStatus === "connected"
      ? "synced"
      : connectionRequest
        ? getSyncStatusForConnectionRequest(connectionRequest)
        : getSyncStatusFromSession(syncSession);
  const latestIngestAt =
    relayUpload?.acceptedAt ?? clipIngest?.reviewRecord?.createdAt ?? device?.lastSeenAt ?? syncSession?.createdAt ?? current.cameraSync.latestIngestAt;
  const persistedClips = [...records.relayUploads.map((upload) => upload.clip), ...records.clipIngests.map((ingest) => ingest.clip)];
  const persistedSightings = [...records.relayUploads.map((upload) => upload.sighting), ...records.clipIngests.map((ingest) => ingest.sighting)];

  return {
    ...current,
    clips: mergeById(persistedClips, current.clips),
    sightings: mergeById(persistedSightings, current.sightings),
    cameraSync: {
      ...current.cameraSync,
      providerId,
      status: nextStatus,
      approvalLabel: provider.primaryAction,
      privacyMode: syncSession?.privacyMode ?? connectionRequest?.privacyMode ?? device?.privacyMode ?? current.cameraSync.privacyMode,
      motionUploadsEnabled: syncSession?.motionUploadsEnabled ?? connectionRequest?.motionUploadsEnabled ?? device?.motionOnly ?? current.cameraSync.motionUploadsEnabled,
      connectionRequestId: connectionRequest?.id ?? current.cameraSync.connectionRequestId,
      registeredDeviceId: device?.id ?? relayUpload?.deviceId ?? current.cameraSync.registeredDeviceId,
      relayId: relay?.relayId ?? device?.relayId ?? relayUpload?.relayId ?? current.cameraSync.relayId,
      relayUploadUrl: relay?.uploadUrl ?? current.cameraSync.relayUploadUrl,
      latestIngestId: clipIngest?.ingestId ?? current.cameraSync.latestIngestId,
      latestRelayUploadId: relayUpload?.uploadId ?? current.cameraSync.latestRelayUploadId,
      latestIngestAt,
      nextStep: connectionRequest?.nextStep ?? current.cameraSync.nextStep,
      lastSyncedAt: nextStatus === "synced" ? latestIngestAt : current.cameraSync.lastSyncedAt
    },
    lastSyncSession: syncSession ?? current.lastSyncSession,
    lastConnectionRequest: connectionRequest ?? current.lastConnectionRequest,
    lastDeviceRegistration: registration,
    lastRelayManifest: relayManifest ?? current.lastRelayManifest,
    lastIngestResult,
    lastRelayUpload: relayUpload ?? current.lastRelayUpload,
    lastBirdAnalysis: birdAnalysis ?? current.lastBirdAnalysis,
    lastBirdCorrection: birdCorrection ?? current.lastBirdCorrection
  };
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabaseAuthConfigured);
  const [demoPreview, setDemoPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [logDraft, setLogDraft] = useState({
    bird: "",
    rarity: "Common" as Rarity,
    location: demoProfile.location,
    source: "Manual log"
  });
  const [profileDraft, setProfileDraft] = useState({
    name: state.profile.name,
    location: state.profile.location,
    favoriteBird: state.profile.favoriteBird
  });
  const [motionOnly, setMotionOnly] = useState(true);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [cameraAccountState, setCameraAccountState] = useState<CameraAccountState | null>(null);
  const [cameraAccountStatus, setCameraAccountStatus] = useState<CameraAccountLoadStatus>("loading");
  const [birdReviewStatus, setBirdReviewStatus] = useState<BirdReviewActionStatus>("idle");
  const [cameraActionError, setCameraActionError] = useState("");

  const selectedProvider = getCameraProvider(state.cameraSync.providerId);
  const accountUserId = authSession?.user.id ?? state.profile.id;

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setAuthSession(data.session);
        setAuthReady(true);
      })
      .catch(() => {
        if (active) setAuthReady(true);
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthReady(true);
      if (session) setDemoPreview(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authSession?.user) return;

    const nextProfile = getProfileFromAuthUser(authSession.user, state.profile);
    const changed =
      nextProfile.id !== state.profile.id ||
      nextProfile.name !== state.profile.name ||
      nextProfile.handle !== state.profile.handle ||
      nextProfile.avatar !== state.profile.avatar;

    if (!changed) return;

    const nextState = { ...state, profile: nextProfile };
    setState(nextState);
    saveState(nextState);
    setProfileDraft({
      name: nextProfile.name,
      location: nextProfile.location,
      favoriteBird: nextProfile.favoriteBird
    });
  }, [authSession?.user]);

  function commit(next: AppState) {
    setState(next);
    saveState(next);
  }

  function applyCameraAccountState(accountState: CameraAccountState) {
    setCameraAccountState(accountState);
    setCameraAccountStatus("ready");
    setState((current) => {
      const next = reconcileCameraAccountState(current, accountState);
      saveState(next);
      return next;
    });
  }

  async function refreshCameraAccountState() {
    const accountState = await fetchCameraAccountState(accountUserId);
    if (!accountState) {
      setCameraAccountStatus("offline");
      return;
    }
    applyCameraAccountState(accountState);
  }

  useEffect(() => {
    let cancelled = false;
    setCameraAccountStatus("loading");

    fetchCameraAccountState(accountUserId)
      .then((accountState) => {
        if (cancelled) return;
        if (!accountState) {
          setCameraAccountStatus("offline");
          return;
        }
        applyCameraAccountState(accountState);
      })
      .catch(() => {
        if (!cancelled) setCameraAccountStatus("offline");
      });

    return () => {
      cancelled = true;
    };
  }, [accountUserId]);

  const leaderboard = useMemo(() => {
    const currentUser = {
      id: accountUserId,
      name: state.profile.name,
      handle: state.profile.handle,
      avatar: state.profile.avatar,
      location: state.profile.location,
      status: "following" as const,
      points: state.profile.points,
      clips: state.clips.filter((clip) => clip.owner === "Charlie").length
    };
    return [currentUser, ...state.friends].sort((a, b) => b.points - a.points);
  }, [state]);

  const totalClips = state.clips.length;
  const rareClips = state.clips.filter((clip) => clip.rarity === "Rare" || clip.rarity === "Legendary").length;
  const followingCount = state.friends.filter((friend) => friend.status === "following").length;
  const weeklyPoints = state.sightings.reduce((sum, sighting) => sum + sighting.points, 0);
  const connectedCameraCount = state.cameraSync.registeredDeviceId || state.cameraSync.status === "synced" ? 1 : 0;
  const fallbackReviewItems = [state.lastRelayUpload?.reviewRecord, state.lastIngestResult?.reviewRecord].filter(
    Boolean
  ) as CameraReviewRecord[];
  const reviewItems = cameraAccountState?.records.reviewItems?.length ? cameraAccountState.records.reviewItems : fallbackReviewItems;
  const birdAnalyses = state.lastBirdAnalysis
    ? mergeById(cameraAccountState?.records.birdAnalyses ?? [], [state.lastBirdAnalysis])
    : cameraAccountState?.records.birdAnalyses ?? [];
  const birdCorrections = state.lastBirdCorrection
    ? mergeById(cameraAccountState?.records.birdCorrections ?? [], [state.lastBirdCorrection])
    : cameraAccountState?.records.birdCorrections ?? [];
  const latestReviewItem = getLatest(reviewItems, ["updatedAt", "createdAt"]);
  const latestReviewClip = getReviewClip(state, latestReviewItem);
  const latestReviewSighting = getReviewSighting(state, latestReviewItem);
  const latestBirdAnalysis = getLatest(birdAnalyses, ["updatedAt", "createdAt"]) ?? state.lastBirdAnalysis;
  const latestBirdCorrection = getLatest(birdCorrections, ["correctedAt"]) ?? state.lastBirdCorrection;
  const latestSuggestion = latestBirdAnalysis?.speciesSuggestions[0];
  const pendingReviewCount = reviewItems.filter((item) => item.status === "needs-review").length;

  function addSighting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bird = logDraft.bird.trim();
    if (!bird) return;

    const points = rarityPoints[logDraft.rarity];
    const sighting: Sighting = {
      id: crypto.randomUUID(),
      bird,
      rarity: logDraft.rarity,
      location: logDraft.location.trim() || state.profile.location,
      source: logDraft.source.trim() || "Manual log",
      loggedAt: "Just now",
      points
    };

    const clip: Clip = {
      id: crypto.randomUUID(),
      cameraName: sighting.source,
      bird: sighting.bird,
      rarity: sighting.rarity,
      location: sighting.location,
      capturedAt: "Just now",
      imageUrl: "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&w=1000&q=80",
      duration: "00:12",
      confidence: 87,
      motionOnly,
      owner: "Charlie",
      points,
      reactions: 0,
      comments: []
    };

    commit({
      ...state,
      profile: { ...state.profile, points: state.profile.points + points, streak: state.profile.streak + 1 },
      sightings: [sighting, ...state.sightings],
      clips: [clip, ...state.clips]
    });

    setLogDraft({ ...logDraft, bird: "" });
    setActiveTab("feed");
  }

  function addComment(clipId: string) {
    const body = commentDrafts[clipId]?.trim();
    if (!body) return;

    commit({
      ...state,
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              comments: [
                ...clip.comments,
                {
                  id: crypto.randomUUID(),
                  author: state.profile.name.split(" ")[0],
                  body,
                  createdAt: "Just now"
                }
              ]
            }
          : clip
      )
    });
    setCommentDrafts({ ...commentDrafts, [clipId]: "" });
  }

  function reactToClip(clipId: string) {
    commit({
      ...state,
      clips: state.clips.map((clip) => (clip.id === clipId ? { ...clip, reactions: clip.reactions + 1 } : clip))
    });
  }

  function followFriend(friendId: string) {
    commit({
      ...state,
      friends: state.friends.map((friend) =>
        friend.id === friendId ? { ...friend, status: friend.status === "following" ? "pending" : "following" } : friend
      )
    });
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commit({
      ...state,
      profile: {
        ...state.profile,
        name: profileDraft.name.trim() || state.profile.name,
        location: profileDraft.location.trim() || state.profile.location,
        favoriteBird: profileDraft.favoriteBird.trim() || state.profile.favoriteBird
      }
    });
  }

  function selectCameraProvider(providerId: CameraProviderId) {
    const provider = getCameraProvider(providerId);
    commit({
      ...state,
      cameraSync: {
        ...state.cameraSync,
        providerId,
        status: "not-started",
        approvalLabel: provider.primaryAction,
        connectionRequestId: undefined,
        registeredDeviceId: undefined,
        relayId: undefined,
        relayUploadUrl: undefined,
        nextStep: undefined,
        latestIngestId: undefined,
        latestRelayUploadId: undefined,
        latestIngestAt: undefined,
        lastSyncedAt: undefined
      },
      lastSyncSession: undefined,
      lastConnectionRequest: undefined,
      lastDeviceRegistration: undefined,
      lastRelayManifest: undefined,
      lastIngestResult: undefined,
      lastRelayUpload: undefined,
      lastBirdAnalysis: undefined,
      lastBirdCorrection: undefined
    });
  }

  async function startCameraSync() {
    setCameraActionError("");
    try {
      const input = {
        userId: accountUserId,
        provider: selectedProvider,
        privacyMode: state.cameraSync.privacyMode,
        motionUploadsEnabled: state.cameraSync.motionUploadsEnabled
      };
      const [syncSession, connectionRequest] = await Promise.all([requestCameraSyncSession(input), requestCameraConnectionRequest(input)]);
      const nextStatus = getSyncStatusForConnectionRequest(connectionRequest);

      commit({
        ...state,
        cameraSync: {
          ...state.cameraSync,
          status: nextStatus,
          approvalLabel: selectedProvider.primaryAction,
          connectionRequestId: connectionRequest.id,
          nextStep: connectionRequest.nextStep,
          lastSyncedAt: nextStatus === "synced" ? "Just now" : state.cameraSync.lastSyncedAt
        },
        lastSyncSession: syncSession,
        lastConnectionRequest: connectionRequest
      });
      setActiveTab("cameras");
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
      setActiveTab("cameras");
    }
  }

  async function registerSelectedCameraDevice() {
    setCameraActionError("");
    try {
      const registration = await requestCameraDeviceRegistration({
        userId: accountUserId,
        provider: selectedProvider,
        privacyMode: state.cameraSync.privacyMode,
        motionUploadsEnabled: state.cameraSync.motionUploadsEnabled,
        locationLabel: state.profile.location
      });
      recordDeviceRegistration(registration);
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
    }
  }

  async function createRelayManifestForRegisteredDevice() {
    if (!state.lastDeviceRegistration?.relay) return;
    setCameraActionError("");
    try {
      const relayManifest = await requestCameraRelayManifest({
        userId: accountUserId,
        provider: selectedProvider,
        registration: state.lastDeviceRegistration,
        privacyMode: state.cameraSync.privacyMode,
        motionUploadsEnabled: state.cameraSync.motionUploadsEnabled
      });
      recordRelayManifest(relayManifest);
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
    }
  }

  async function previewSignedRelayUpload() {
    if (!state.lastDeviceRegistration?.device) return;
    setCameraActionError("");
    try {
      const relayUpload = await requestDemoRelayUpload({
        userId: accountUserId,
        provider: selectedProvider,
        device: state.lastDeviceRegistration.device,
        privacyMode: state.cameraSync.privacyMode
      });
      acceptRelayUpload(relayUpload);
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
    }
  }

  async function previewMotionUpload() {
    setCameraActionError("");
    try {
      const ingestResult = await requestDemoCameraClipIngest({
        userId: accountUserId,
        provider: selectedProvider,
        privacyMode: state.cameraSync.privacyMode
      });

      commit({
        ...state,
        clips: [ingestResult.clip, ...state.clips],
        sightings: [ingestResult.sighting, ...state.sightings],
        cameraSync: {
          ...state.cameraSync,
          status: "synced",
          latestIngestId: ingestResult.ingestId,
          latestIngestAt: "Just now",
          lastSyncedAt: "Just now"
        },
        lastIngestResult: ingestResult,
        lastBirdAnalysis: undefined,
        lastBirdCorrection: undefined
      });
      setActiveTab("feed");
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
    }
  }

  function recordDeviceRegistration(registration: CameraDeviceRegistrationResult) {
    commit({
      ...state,
      cameraSync: {
        ...state.cameraSync,
        registeredDeviceId: registration.device.id,
        relayId: registration.relay?.relayId,
        relayUploadUrl: registration.relay?.uploadUrl
      },
      lastDeviceRegistration: registration,
      lastRelayManifest: undefined,
      lastRelayUpload: undefined
    });
  }

  function recordRelayManifest(relayManifest: CameraRelayManifest) {
    commit({
      ...state,
      lastRelayManifest: relayManifest,
      cameraSync: {
        ...state.cameraSync,
        relayId: relayManifest.relayId,
        relayUploadUrl: relayManifest.cloudUpload.path,
        nextStep: "Relay manifest is ready for the local camera agent."
      }
    });
  }

  function acceptRelayUpload(relayUpload: CameraRelayUploadResult) {
    commit({
      ...state,
      clips: [relayUpload.clip, ...state.clips],
      sightings: [relayUpload.sighting, ...state.sightings],
      cameraSync: {
        ...state.cameraSync,
        status: "synced",
        registeredDeviceId: relayUpload.deviceId,
        relayId: relayUpload.relayId,
        latestRelayUploadId: relayUpload.uploadId,
        latestIngestAt: "Just now",
        lastSyncedAt: "Just now"
      },
      lastIngestResult: {
        ingestId: relayUpload.uploadId,
        status: "needs-review",
        clip: relayUpload.clip,
        sighting: relayUpload.sighting,
        reviewMessage: relayUpload.reviewMessage,
        reviewRecord: relayUpload.reviewRecord
      },
      lastRelayUpload: relayUpload,
      lastBirdAnalysis: undefined,
      lastBirdCorrection: undefined
    });
    setActiveTab("feed");
  }

  async function analyzeLatestBirdReview() {
    if (!latestReviewItem || !latestReviewClip) return;

    setBirdReviewStatus("analyzing");
    try {
      setCameraActionError("");
      const analysis = await requestBirdIntelligenceAnalysis({
        userId: accountUserId,
        reviewItem: latestReviewItem,
        providerId: latestReviewItem.providerId,
        clip: latestReviewClip,
        sighting: latestReviewSighting,
        privacyMode: latestReviewItem.privacyMode,
        source: latestReviewItem.source
      });

      commit({
        ...state,
        lastBirdAnalysis: analysis
      });
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
    } finally {
      setBirdReviewStatus("idle");
    }
  }

  async function applyBirdCorrection(action: "approve" | "correct-species" | "mark-no-bird", species?: string) {
    if (!latestBirdAnalysis) return;

    setBirdReviewStatus("correcting");
    try {
      setCameraActionError("");
      const correction = await requestBirdCorrection({
        userId: accountUserId,
        analysis: latestBirdAnalysis,
        action,
        species,
        locationLabel: latestReviewClip?.location ?? state.profile.location
      });
      const nextBird = correction.species?.commonName ?? "No bird detected";
      const nextRarity = correction.rarityScore.rarity ?? "Common";
      const nextPoints = correction.rarityScore.points;
      const nextAnalysis = {
        ...latestBirdAnalysis,
        status: "corrected" as const,
        birdDetected: correction.birdDetected,
        needsManualReview: false,
        selectedSpecies: correction.species?.commonName ?? null,
        confidence: correction.confidence,
        rarityScore: correction.rarityScore,
        manualCorrection: correction,
        updatedAt: correction.correctedAt
      };

      commit({
        ...state,
        clips: state.clips.map((clip) =>
          clip.id === latestBirdAnalysis.clipId
            ? {
                ...clip,
                bird: nextBird,
                rarity: nextRarity,
                points: nextPoints,
                confidence: correction.confidence
              }
            : clip
        ),
        sightings: state.sightings.map((sighting) =>
          sighting.id === latestBirdAnalysis.sightingId
            ? {
                ...sighting,
                bird: nextBird,
                rarity: nextRarity,
                points: nextPoints,
                loggedAt: correction.birdDetected ? "Reviewed" : "Rejected"
              }
            : sighting
        ),
        lastBirdAnalysis: nextAnalysis,
        lastBirdCorrection: correction
      });
      void refreshCameraAccountState();
    } catch (error) {
      setCameraActionError(getActionError(error));
    } finally {
      setBirdReviewStatus("idle");
    }
  }

  function setPrivacyMode(privacyMode: CameraPrivacyMode) {
    commit({ ...state, cameraSync: { ...state.cameraSync, privacyMode } });
  }

  function setMotionUploadsEnabled(motionUploadsEnabled: boolean) {
    commit({ ...state, cameraSync: { ...state.cameraSync, motionUploadsEnabled } });
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(state.profile.inviteCode);
    setCopiedInvite(true);
    window.setTimeout(() => setCopiedInvite(false), 1400);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setAuthSession(null);
    setDemoPreview(false);
  }

  if (!authReady || (!authSession && !demoPreview)) {
    return (
      <AuthScreen
        allowDemoPreview={!supabaseAuthConfigured || import.meta.env.DEV}
        authReady={authReady}
        onDemoPreview={() => setDemoPreview(true)}
      />
    );
  }

  const tabs = [
    { id: "feed", label: "Feed", icon: Bird },
    { id: "cameras", label: "Cameras", icon: RadioTower },
    { id: "league", label: "League", icon: Trophy },
    { id: "friends", label: "Friends", icon: Users },
    { id: "gear", label: "Gear", icon: ShoppingBag }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Bird size={22} />
          </div>
          <div>
            <strong>Flock</strong>
            <span>BirdWatch</span>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Primary">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={activeTab === tab.id ? "nav-tab active" : "nav-tab"}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                type="button"
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="camera-panel">
          <div className="section-heading compact">
            <RadioTower size={17} />
            <span>Camera Sync</span>
          </div>
          <label className="field-label" htmlFor="provider">
            Camera
          </label>
          <select
            id="provider"
            value={state.cameraSync.providerId}
            onChange={(event) => selectCameraProvider(event.target.value as CameraProviderId)}
          >
            {cameraProviders.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          <label className="toggle-row">
            <input checked={motionOnly} onChange={(event) => setMotionOnly(event.target.checked)} type="checkbox" />
            <span>Motion clips only</span>
          </label>
          <button className="sync-primary-button" onClick={startCameraSync} type="button">
            <RotateCw size={16} />
            {selectedProvider.primaryAction}
          </button>
          <div className="connection-status">
            <span className={`status-dot status-${state.cameraSync.status}`} />
            {syncStatusLabel[state.cameraSync.status]}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Backyard network</p>
            <h1>{state.profile.name.split(" ")[0]}'s Flock</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" title="Search clips" type="button">
              <Search size={18} />
            </button>
            <button className="icon-button" title="Notifications" type="button">
              <Bell size={18} />
            </button>
            {authSession && (
              <button className="icon-button" onClick={signOut} title="Sign out" type="button">
                <LogOut size={18} />
              </button>
            )}
            <button className="profile-chip" onClick={() => setActiveTab("friends")} type="button">
              <span>{state.profile.avatar}</span>
              <strong>{state.profile.handle}</strong>
            </button>
          </div>
        </header>

        {activeTab === "feed" && (
          <section className="metric-grid" aria-label="Flock metrics">
            <Metric icon={Camera} label="Motion clips" value={totalClips.toString()} tone="blue" />
            <Metric icon={RadioTower} label="Synced cameras" value={connectedCameraCount.toString()} tone="green" />
            <Metric icon={Sparkles} label="Rare hits" value={rareClips.toString()} tone="gold" />
            <Metric icon={Zap} label="Weekly points" value={weeklyPoints.toString()} tone="coral" />
          </section>
        )}

        {activeTab === "feed" && (
          <div className="dashboard-grid">
            <section className="feed-column" aria-label="Camera feed">
              <div className="section-heading">
                <Camera size={19} />
                <div>
                  <h2>Live Clips</h2>
                  <p>Motion-triggered sightings from your cameras and friends.</p>
                </div>
              </div>
              <div className="clip-list">
                {state.clips.map((clip) => (
                  <article className="clip-card" key={clip.id}>
                    <div className="clip-media">
                      <img alt={`${clip.bird} captured by ${clip.cameraName}`} src={clip.imageUrl} />
                      <button className="play-button" title={`Play ${clip.bird} clip`} type="button">
                        <Play size={22} fill="currentColor" />
                      </button>
                      <span className="clip-duration">{clip.duration}</span>
                    </div>
                    <div className="clip-body">
                      <div className="clip-title-row">
                        <div>
                          <h3>{clip.bird}</h3>
                          <p>
                            {clip.cameraName} - {clip.location}
                          </p>
                        </div>
                        <span className={`rarity rarity-${clip.rarity.toLowerCase()}`}>{clip.rarity}</span>
                      </div>
                      <div className="clip-meta">
                        <span>{clip.capturedAt}</span>
                        <span>{clip.confidence}% ID confidence</span>
                        <span>+{clip.points} pts</span>
                      </div>
                      <div className="clip-actions">
                        <button onClick={() => reactToClip(clip.id)} type="button">
                          <Heart size={17} />
                          {clip.reactions}
                        </button>
                        <button type="button">
                          <MessageCircle size={17} />
                          {clip.comments.length}
                        </button>
                        <button type="button">
                          <Share2 size={17} />
                          Share
                        </button>
                      </div>
                      <div className="comment-stack">
                        {clip.comments.map((comment) => (
                          <p key={comment.id}>
                            <strong>{comment.author}</strong> {comment.body}
                          </p>
                        ))}
                      </div>
                      <div className="comment-form">
                        <input
                          aria-label={`Comment on ${clip.bird}`}
                          onChange={(event) => setCommentDrafts({ ...commentDrafts, [clip.id]: event.target.value })}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") addComment(clip.id);
                          }}
                          placeholder="Comment"
                          value={commentDrafts[clip.id] ?? ""}
                        />
                        <button onClick={() => addComment(clip.id)} title="Send comment" type="button">
                          <Send size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="side-stack" aria-label="Logging and recommendations">
              <section className="panel">
                <div className="section-heading compact">
                  <Plus size={18} />
                  <span>Log Sighting</span>
                </div>
                <form className="log-form" onSubmit={addSighting}>
                  <label>
                    <span>Bird</span>
                    <input
                      onChange={(event) => setLogDraft({ ...logDraft, bird: event.target.value })}
                      placeholder="Species"
                      value={logDraft.bird}
                    />
                  </label>
                  <div className="form-grid">
                    <label>
                      <span>Rarity</span>
                      <select
                        onChange={(event) => setLogDraft({ ...logDraft, rarity: event.target.value as Rarity })}
                        value={logDraft.rarity}
                      >
                        {rarityOptions.map((rarity) => (
                          <option key={rarity}>{rarity}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Source</span>
                      <input
                        onChange={(event) => setLogDraft({ ...logDraft, source: event.target.value })}
                        value={logDraft.source}
                      />
                    </label>
                  </div>
                  <label>
                    <span>Location</span>
                    <input
                      onChange={(event) => setLogDraft({ ...logDraft, location: event.target.value })}
                      value={logDraft.location}
                    />
                  </label>
                  <button className="primary-button" type="submit">
                    <Plus size={17} />
                    Add to Flock
                  </button>
                </form>
              </section>

              <section className="panel">
                <div className="section-heading compact">
                  <Flame size={18} />
                  <span>Streak</span>
                </div>
                <div className="streak-row">
                  <strong>{state.profile.streak}</strong>
                  <span>active sighting days</span>
                </div>
                <div className="sighting-list">
                  {state.sightings.slice(0, 4).map((sighting) => (
                    <div className="sighting-item" key={sighting.id}>
                      <div>
                        <strong>{sighting.bird}</strong>
                        <span>{sighting.source}</span>
                      </div>
                      <em>+{sighting.points}</em>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        )}

        {activeTab === "cameras" && (
          <div className="camera-sync-grid">
            {cameraActionError && (
              <div className="camera-action-error" role="alert">
                <LockKeyhole size={17} />
                <span>{cameraActionError}</span>
              </div>
            )}

            <CameraSyncWizard
              userName={state.profile.name}
              userHandle={state.profile.handle}
              providers={cameraProviders}
              provider={selectedProvider}
              cameraSync={state.cameraSync}
              accountState={cameraAccountState}
              accountStatus={cameraAccountStatus}
              syncSession={state.lastSyncSession}
              connectionRequest={state.lastConnectionRequest}
              registration={state.lastDeviceRegistration}
              relayManifest={state.lastRelayManifest}
              ingestResult={state.lastIngestResult}
              relayUpload={state.lastRelayUpload}
              onProviderChange={selectCameraProvider}
              onPrivacyChange={setPrivacyMode}
              onMotionUploadsChange={setMotionUploadsEnabled}
              onStartConnection={startCameraSync}
              onRegisterDevice={registerSelectedCameraDevice}
              onCreateRelayManifest={createRelayManifestForRegisteredDevice}
              onPreviewMotionUpload={previewMotionUpload}
              onPreviewRelayUpload={previewSignedRelayUpload}
            />

            <details className="panel wide provider-details">
              <summary>
                <RadioTower size={20} />
                <span>
                  <strong>Connection options</strong>
                  <small>Compare the available camera paths</small>
                </span>
              </summary>
              <div className="provider-grid" aria-label="Camera connection options">
                {cameraProviders.map((provider) => (
                  <button
                    className={provider.id === state.cameraSync.providerId ? "provider-card selected" : "provider-card"}
                    key={provider.id}
                    onClick={() => selectCameraProvider(provider.id)}
                    type="button"
                  >
                    <span className="provider-category">{provider.category}</span>
                    <strong>{provider.name}</strong>
                    <p>{provider.syncSummary}</p>
                    <footer>
                      <span>{provider.connectionLabel}</span>
                      {provider.requiresLocalRelay ? <Wifi size={16} /> : provider.requiresOAuth ? <Cloud size={16} /> : <ShieldCheck size={16} />}
                    </footer>
                  </button>
                ))}
              </div>
            </details>

            <section className="panel sync-detail-panel">
              <div className="section-heading compact">
                <Cloud size={18} />
                <span>{selectedProvider.name}</span>
              </div>
              <div className={`sync-status-card status-${state.cameraSync.status}`}>
                <span>{syncStatusLabel[state.cameraSync.status]}</span>
                <strong>{selectedProvider.connectionLabel}</strong>
                <p>{selectedProvider.motionFlow}</p>
                {state.cameraSync.nextStep && <p className="sync-next-step">{state.cameraSync.nextStep}</p>}
              </div>
              <div className={`adapter-contract-strip adapter-${selectedProvider.adapterStatus}`}>
                <div>
                  <span>Adapter</span>
                  <strong>{selectedProvider.adapterStatusLabel}</strong>
                </div>
                <code>{selectedProvider.adapterPath}</code>
              </div>
              {selectedProvider.setupGates.length > 0 && (
                <div className="adapter-gate-list">
                  {selectedProvider.setupGates.slice(0, 3).map((gate) => (
                    <p key={gate}>
                      <ShieldCheck size={15} />
                      {gate}
                    </p>
                  ))}
                </div>
              )}
              <button className="primary-button" onClick={startCameraSync} type="button">
                <RotateCw size={17} />
                {selectedProvider.primaryAction}
              </button>
              {state.lastConnectionRequest && (
                <div className="request-record">
                  <strong>Request {state.lastConnectionRequest.id}</strong>
                  <span>{state.lastConnectionRequest.status}</span>
                  <span>{state.lastConnectionRequest.callbackPath}</span>
                </div>
              )}
              <label className="sync-control">
                <span>Default privacy</span>
                <select value={state.cameraSync.privacyMode} onChange={(event) => setPrivacyMode(event.target.value as CameraPrivacyMode)}>
                  <option value="private">Private</option>
                  <option value="friends">Friends</option>
                  <option value="league">League after review</option>
                </select>
              </label>
              <label className="toggle-row app-toggle">
                <input
                  checked={state.cameraSync.motionUploadsEnabled}
                  onChange={(event) => setMotionUploadsEnabled(event.target.checked)}
                  type="checkbox"
                />
                <span>Auto-upload motion clips after approval</span>
              </label>
              <a className="docs-link" href={selectedProvider.docsUrl} rel="noreferrer" target="_blank">
                Source notes
                <ExternalLink size={15} />
              </a>
              <div className="constraint-list">
                {selectedProvider.limitations.map((limitation) => (
                  <p key={limitation}>
                    <LockKeyhole size={15} />
                    {limitation}
                  </p>
                ))}
              </div>
            </section>

            <CameraRelayPanel
              userId={accountUserId}
              locationLabel={state.profile.location}
              provider={selectedProvider}
              privacyMode={state.cameraSync.privacyMode}
              motionUploadsEnabled={state.cameraSync.motionUploadsEnabled}
              registration={state.lastDeviceRegistration}
              relayManifest={state.lastRelayManifest}
              relayUpload={state.lastRelayUpload}
              onDeviceRegistered={recordDeviceRegistration}
              onCreateRelayManifest={createRelayManifestForRegisteredDevice}
              onRelayUploadAccepted={acceptRelayUpload}
              onError={setCameraActionError}
            />

            <section className="panel wide motion-pipeline-panel">
              <div className="section-heading">
                <UploadCloud size={20} />
                <div>
                  <h2>Motion Upload Pipeline</h2>
                  <p>Every provider lands in the same review queue before scoring or sharing.</p>
                </div>
              </div>
              <div className="sync-flow">
                <article>
                  <strong>1</strong>
                  <div>
                    <h3>Approve</h3>
                    <p>Account link, relay setup, partner export, or manual upload.</p>
                  </div>
                </article>
                <article>
                  <strong>2</strong>
                  <div>
                    <h3>Capture</h3>
                    <p>Motion events create private clip records with source and timing metadata.</p>
                  </div>
                </article>
                <article>
                  <strong>3</strong>
                  <div>
                    <h3>Review</h3>
                    <p>Bird detection, species confidence, and user correction happen before league points.</p>
                  </div>
                </article>
                <article>
                  <strong>4</strong>
                  <div>
                    <h3>Share</h3>
                    <p>Clips follow the privacy default and can be promoted to friends or leagues.</p>
                  </div>
                </article>
              </div>
              <div className="ingest-review-card">
                <div>
                  <strong>Mock ingest boundary</strong>
                  <p>Preview the exact clip-ingest contract that a vendor webhook, local relay, or export importer will call.</p>
                </div>
                <button className="secondary-button" disabled={!state.lastConnectionRequest} onClick={previewMotionUpload} type="button">
                  <UploadCloud size={17} />
                  Preview approved motion upload
                </button>
              </div>
              {state.lastIngestResult && (
                <div className="request-record ingest-record">
                  <strong>Ingest {state.lastIngestResult.ingestId}</strong>
                  <span>{state.lastIngestResult.status}</span>
                  <span>{state.lastIngestResult.reviewMessage}</span>
                </div>
              )}
              <div className="bird-review-queue">
                <div className="bird-review-header">
                  <div>
                    <strong>Bird Review Queue</strong>
                    <p>
                      {pendingReviewCount} pending / {reviewItems.length} total / {birdAnalyses.length} analyzed
                    </p>
                  </div>
                  <span className={`review-badge status-${latestBirdAnalysis?.status ?? "needs-review"}`}>
                    {latestBirdCorrection?.reviewStatus ?? latestBirdAnalysis?.status ?? "needs-review"}
                  </span>
                </div>
                <div className="bird-review-grid">
                  <div>
                    <span>Clip</span>
                    <strong>{latestReviewClip?.cameraName ?? "No clip queued"}</strong>
                    <p>{latestReviewItem?.reviewMessage ?? "No review item yet."}</p>
                  </div>
                  <div>
                    <span>Candidate</span>
                    <strong>{latestSuggestion?.commonName ?? latestBirdAnalysis?.selectedSpecies ?? "Waiting"}</strong>
                    <p>
                      {latestBirdAnalysis
                        ? `${latestBirdAnalysis.confidence}% confidence / ${latestBirdAnalysis.rarityScore.points} pts`
                        : "No analysis yet."}
                    </p>
                  </div>
                  <div>
                    <span>Correction</span>
                    <strong>{latestBirdCorrection?.species?.commonName ?? latestBirdCorrection?.reviewStatus ?? "Open"}</strong>
                    <p>{latestBirdCorrection?.notes ?? "No correction yet."}</p>
                  </div>
                </div>
                <div className="bird-review-actions">
                  <button
                    className="secondary-button"
                    disabled={!latestReviewItem || !latestReviewClip || birdReviewStatus !== "idle"}
                    onClick={analyzeLatestBirdReview}
                    type="button"
                  >
                    <Sparkles size={17} />
                    {birdReviewStatus === "analyzing" ? "Analyzing" : "Analyze latest clip"}
                  </button>
                  <button
                    className="secondary-button"
                    disabled={!latestBirdAnalysis || birdReviewStatus !== "idle"}
                    onClick={() => applyBirdCorrection("approve", latestSuggestion?.commonName ?? latestBirdAnalysis?.selectedSpecies ?? undefined)}
                    type="button"
                  >
                    <Check size={17} />
                    Approve ID
                  </button>
                  <button
                    className="secondary-button"
                    disabled={!latestBirdAnalysis || birdReviewStatus !== "idle"}
                    onClick={() => applyBirdCorrection("correct-species", "Northern cardinal")}
                    type="button"
                  >
                    Cardinal
                  </button>
                  <button
                    className="secondary-button"
                    disabled={!latestBirdAnalysis || birdReviewStatus !== "idle"}
                    onClick={() => applyBirdCorrection("mark-no-bird")}
                    type="button"
                  >
                    No bird
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "league" && (
          <div className="league-grid">
            <section className="panel wide">
              <div className="section-heading">
                <Trophy size={20} />
                <div>
                  <h2>Fantasy Flock League</h2>
                  <p>Points are weighted by rarity, verified motion clips, and streaks.</p>
                </div>
              </div>
              <div className="leaderboard">
                {leaderboard.map((member, index) => (
                  <div className="leader-row" key={member.id}>
                    <span className="rank">{index + 1}</span>
                    <span className="avatar">{member.avatar}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <span>
                        {member.handle} - {member.location}
                      </span>
                    </div>
                    <em>{member.points.toLocaleString()} pts</em>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-heading compact">
                <Gamepad2 size={18} />
                <span>Challenges</span>
              </div>
              <div className="challenge-list">
                {challenges.map((challenge) => (
                  <article className="challenge-card" key={challenge.id}>
                    <div>
                      <h3>{challenge.name}</h3>
                      <p>{challenge.metric}</p>
                    </div>
                    <div className="progress-track" aria-label={`${challenge.name} progress`}>
                      <span style={{ width: `${Math.min(100, (challenge.progress / challenge.goal) * 100)}%` }} />
                    </div>
                    <div className="challenge-footer">
                      <span>
                        {challenge.progress}/{challenge.goal}
                      </span>
                      <strong>+{challenge.reward}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "friends" && (
          <div className="friends-grid">
            <section className="panel">
              <div className="section-heading">
                <CircleUserRound size={20} />
                <div>
                  <h2>Profile</h2>
                  <p>Your public birding identity and home habitat.</p>
                </div>
              </div>
              <form className="profile-form" onSubmit={saveProfile}>
                <label>
                  <span>Name</span>
                  <input
                    onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })}
                    value={profileDraft.name}
                  />
                </label>
                <label>
                  <span>Location</span>
                  <input
                    onChange={(event) => setProfileDraft({ ...profileDraft, location: event.target.value })}
                    value={profileDraft.location}
                  />
                </label>
                <label>
                  <span>Favorite bird</span>
                  <input
                    onChange={(event) => setProfileDraft({ ...profileDraft, favoriteBird: event.target.value })}
                    value={profileDraft.favoriteBird}
                  />
                </label>
                <button className="primary-button" type="submit">
                  <Check size={17} />
                  Save Profile
                </button>
              </form>
              <div className="invite-box">
                <div>
                  <span>Invite code</span>
                  <strong>{state.profile.inviteCode}</strong>
                </div>
                <button onClick={copyInvite} title="Copy invite code" type="button">
                  {copiedInvite ? <Check size={18} /> : <Clipboard size={18} />}
                </button>
              </div>
            </section>

            <section className="panel wide">
              <div className="section-heading">
                <Users size={20} />
                <div>
                  <h2>Flock Network</h2>
                  <p>Follow friends, compare points, and discover nearby cameras.</p>
                </div>
              </div>
              <div className="friend-list">
                {state.friends.map((friend) => (
                  <article className="friend-card" key={friend.id}>
                    <span className="avatar">{friend.avatar}</span>
                    <div>
                      <h3>{friend.name}</h3>
                      <p>
                        {friend.handle} - {friend.location}
                      </p>
                      <span>{friend.clips} clips</span>
                    </div>
                    <button onClick={() => followFriend(friend.id)} type="button">
                      {friend.status === "following" ? <Check size={17} /> : <UserPlus size={17} />}
                      {friend.status === "following" ? "Following" : friend.status === "pending" ? "Pending" : "Follow"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "gear" && (
          <div className="gear-grid">
            <section className="panel wide">
              <div className="section-heading">
                <ShoppingBag size={20} />
                <div>
                  <h2>Habitat Recommendations</h2>
                  <p>Affiliate ideas driven by clip quality, species frequency, and friend performance.</p>
                </div>
              </div>
              <div className="recommendation-grid">
                {recommendations.map((recommendation) => (
                  <article className="recommendation-card" key={recommendation.id}>
                    <img alt={recommendation.title} src={recommendation.imageUrl} />
                    <div>
                      <span>{recommendation.category}</span>
                      <h3>{recommendation.title}</h3>
                      <p>{recommendation.reason}</p>
                    </div>
                    <footer>
                      <strong>{recommendation.price}</strong>
                      <button type="button">
                        {recommendation.matchScore}% match
                        <ChevronRight size={17} />
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-heading compact">
                <Settings size={18} />
                <span>Data Signals</span>
              </div>
              <div className="signal-list">
                <Signal label="Best feeder window" value="6:45-8:30 AM" />
                <Signal label="Top attraction" value="Sunflower mix" />
                <Signal label="Missed motion" value="14 clips" />
                <Signal label="Next species target" value="Blue jay" />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

type MetricProps = {
  icon: typeof Bird;
  label: string;
  value: string;
  tone: "blue" | "gold" | "green" | "coral";
};

function Metric({ icon: Icon, label, value, tone }: MetricProps) {
  return (
    <article className={`metric metric-${tone}`}>
      <span>
        <Icon size={19} />
      </span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </article>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="signal-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
