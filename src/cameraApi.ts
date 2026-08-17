import { rarityPoints } from "./data";
import type {
  CameraAccountState,
  CameraClipIngestRequest,
  CameraClipIngestResult,
  CameraConnectionMode,
  CameraConnectionRequest,
  CameraConnectionStatus,
  CameraDevice,
  CameraDeviceConnectionStatus,
  CameraDeviceRegistrationResult,
  CameraPrivacyMode,
  CameraProvider,
  CameraRelayUploadRequest,
  CameraRelayUploadResult,
  CameraStreamTransport,
  CameraSyncSession,
  CameraSyncSessionStatus,
  CameraSyncStatus
} from "./types";

function createId(prefix: string) {
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${randomPart}`;
}

async function postJson<T>(path: string, payload: unknown, headers: Record<string, string> = {}): Promise<T | null> {
  if (typeof fetch !== "function") return null;

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function getJson<T>(path: string): Promise<T | null> {
  if (typeof fetch !== "function") return null;

  try {
    const response = await fetch(path, {
      method: "GET",
      headers: { "content-type": "application/json" }
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function getConnectionMode(provider: CameraProvider): CameraConnectionMode {
  if (provider.phase === "official-cloud") return "official-oauth";
  if (provider.phase === "local-relay") return "local-relay";
  if (provider.phase === "partner-export") return "partner-request";
  return "manual-upload";
}

function getConnectionStatus(mode: CameraConnectionMode): CameraConnectionStatus {
  if (mode === "official-oauth") return "oauth-started";
  if (mode === "local-relay") return "relay-required";
  if (mode === "partner-request") return "partner-review";
  return "manual-ready";
}

function getDeviceConnectionStatus(provider: CameraProvider): CameraDeviceConnectionStatus {
  if (provider.requiresLocalRelay) return "needs-relay";
  if (provider.requiresOAuth) return "needs-oauth";
  if (provider.phase === "partner-export") return "partner-review";
  return "manual-ready";
}

function getStreamTransport(provider: CameraProvider): CameraStreamTransport {
  if (provider.requiresLocalRelay) return "rtsp";
  if (provider.requiresOAuth) return "cloud-oauth";
  if (provider.phase === "partner-export") return "partner-export";
  return "manual-upload";
}

function getCallbackPath(mode: CameraConnectionMode, provider: CameraProvider) {
  if (mode === "official-oauth") return `/api/cameras/${provider.id}/oauth/callback`;
  if (mode === "local-relay") return `/api/cameras/${provider.id}/relay/connect`;
  if (mode === "partner-request") return `/api/cameras/${provider.id}/partner-request`;
  return `/api/cameras/manual-upload`;
}

function getApprovalPath(mode: CameraConnectionMode, provider: CameraProvider) {
  if (mode === "official-oauth") return `/api/cameras/${provider.id}/oauth/start`;
  if (mode === "local-relay") return "/api/cameras/devices";
  if (mode === "partner-request") return `/api/cameras/${provider.id}/partner-request`;
  return "/api/cameras/clip-ingests";
}

function getSessionStatus(mode: CameraConnectionMode): CameraSyncSessionStatus {
  if (mode === "official-oauth") return "approval-required";
  if (mode === "local-relay") return "device-registration-required";
  if (mode === "partner-request") return "export-approval-required";
  return "manual-ready";
}

function getSessionChecklist(mode: CameraConnectionMode) {
  if (mode === "official-oauth") {
    return [
      "Open the official vendor approval screen.",
      "Store OAuth tokens server-side only after credentials are configured.",
      "Accept motion webhooks only after signature verification."
    ];
  }
  if (mode === "local-relay") {
    return [
      "Register a user-owned camera device record.",
      "Run the relay on the same local network as the camera.",
      "Accept only signed relay uploads from that device."
    ];
  }
  if (mode === "partner-request") {
    return [
      "Do not collect vendor account passwords.",
      "Use user-approved exports, share links, email imports, or partner access.",
      "Keep manual upload available until official partner access exists."
    ];
  }
  return ["Open manual clip upload.", "Default clips to private review.", "Run the same bird scoring pipeline after review."];
}

function getNextStep(mode: CameraConnectionMode, provider: CameraProvider) {
  if (mode === "official-oauth") {
    return `Open the official ${provider.name} account approval flow, then store vendor tokens server-side only.`;
  }
  if (mode === "local-relay") {
    return `Install a Flock relay near the camera so RTSP/ONVIF motion clips can upload without exposing LAN credentials.`;
  }
  if (mode === "partner-request") {
    return `Queue a ${provider.name} partner/export request and keep manual import available until official access exists.`;
  }
  return "Open the manual upload flow and run the same private review pipeline as synced cameras.";
}

function getRegistrationMessage(provider: CameraProvider) {
  if (provider.requiresLocalRelay) {
    return `Registered ${provider.name} as a local-relay device. Camera credentials stay in the relay, and only signed motion uploads reach Flock.`;
  }
  if (provider.requiresOAuth) {
    return `Prepared ${provider.name} device ownership record for official account linking. Tokens must be stored server-side after approval.`;
  }
  if (provider.phase === "partner-export") {
    return `Prepared ${provider.name} import record. Flock will use user-approved exports or partner access, not private app credentials.`;
  }
  return "Prepared manual upload source for private review and scoring.";
}

export function getSyncStatusForConnectionRequest(request: CameraConnectionRequest): CameraSyncStatus {
  if (request.status === "oauth-started") return "waiting-on-provider";
  if (request.status === "relay-required") return "relay-required";
  if (request.status === "partner-review") return "needs-approval";
  return "synced";
}

export function fetchCameraAccountState(userId: string): Promise<CameraAccountState | null> {
  return getJson<CameraAccountState>(`/api/cameras/account-state?userId=${encodeURIComponent(userId)}`);
}

export function createCameraSyncSession(input: {
  userId: string;
  provider: CameraProvider;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
}): CameraSyncSession {
  const mode = getConnectionMode(input.provider);
  const now = new Date();
  const syncSession = {
    id: createId("sync"),
    userId: input.userId,
    providerId: input.provider.id,
    providerName: input.provider.name,
    mode,
    status: getSessionStatus(mode),
    approvalPath: getApprovalPath(mode, input.provider),
    privacyMode: input.privacyMode,
    motionUploadsEnabled: input.motionUploadsEnabled,
    deviceRegistrationRequired: mode === "local-relay",
    relayRequired: mode === "local-relay",
    oauthRequired: mode === "official-oauth",
    partnerAccessRequired: mode === "partner-request",
    checklist: getSessionChecklist(mode),
    createdAt: "Just now",
    expiresAt: new Date(now.getTime() + 1000 * 60 * 30).toISOString()
  } satisfies CameraSyncSession;

  void postJson<{ syncSession: CameraSyncSession }>("/api/cameras/sync-sessions", {
    userId: input.userId,
    providerId: input.provider.id,
    privacyMode: input.privacyMode,
    motionUploadsEnabled: input.motionUploadsEnabled
  });

  return syncSession;
}

export function createCameraConnectionRequest(input: {
  userId: string;
  provider: CameraProvider;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
}): CameraConnectionRequest {
  const mode = getConnectionMode(input.provider);
  const status = getConnectionStatus(mode);
  const connectionRequest = {
    id: createId("conn"),
    userId: input.userId,
    providerId: input.provider.id,
    providerName: input.provider.name,
    mode,
    status,
    requestedAt: "Just now",
    privacyMode: input.privacyMode,
    motionUploadsEnabled: input.motionUploadsEnabled,
    nextStep: getNextStep(mode, input.provider),
    callbackPath: getCallbackPath(mode, input.provider)
  } satisfies CameraConnectionRequest;

  void postJson<{ connectionRequest: CameraConnectionRequest }>("/api/cameras/connection-requests", {
    userId: input.userId,
    providerId: input.provider.id,
    privacyMode: input.privacyMode,
    motionUploadsEnabled: input.motionUploadsEnabled
  });

  return connectionRequest;
}

export function createCameraDeviceRegistration(input: {
  userId: string;
  provider: CameraProvider;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  locationLabel: string;
}): CameraDeviceRegistrationResult {
  const deviceId = createId("device");
  const relayId = input.provider.requiresLocalRelay ? createId("relay") : undefined;
  const device = {
    id: deviceId,
    ownerId: input.userId,
    providerId: input.provider.id,
    providerName: input.provider.name,
    displayName: `${input.provider.name} feeder`,
    locationLabel: input.locationLabel,
    privacyMode: input.privacyMode,
    connectionStatus: getDeviceConnectionStatus(input.provider),
    transport: getStreamTransport(input.provider),
    motionOnly: input.motionUploadsEnabled,
    redactedEndpoint: input.provider.requiresLocalRelay ? "rtsp://[redacted]@camera.local/stream" : undefined,
    relayId,
    registeredAt: "Just now"
  } satisfies CameraDevice;
  const relay = relayId
    ? {
        relayId,
        deviceId,
        uploadUrl: "/api/cameras/relay-uploads",
        healthUrl: `/api/cameras/${deviceId}/status`,
        signatureHeader: "x-flock-relay-signature" as const,
        signingKeyStatus: "demo-required" as const,
        instructions: [
          "Run the relay on the same local network as the camera.",
          "Keep RTSP/ONVIF credentials inside the relay, not in the browser.",
          "Upload only signed motion metadata, thumbnails, and clips to Flock."
        ]
      }
    : undefined;
  const registrationResult = {
    device,
    relay,
    reviewMessage: getRegistrationMessage(input.provider)
  } satisfies CameraDeviceRegistrationResult;

  void postJson<{ registrationResult: CameraDeviceRegistrationResult }>("/api/cameras/devices", {
    userId: input.userId,
    providerId: input.provider.id,
    displayName: device.displayName,
    locationLabel: input.locationLabel,
    privacyMode: input.privacyMode,
    motionUploadsEnabled: input.motionUploadsEnabled,
    redactedEndpoint: device.redactedEndpoint
  });

  return registrationResult;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function createDemoCameraClipIngest(input: {
  userId: string;
  provider: CameraProvider;
  privacyMode: CameraPrivacyMode;
}): CameraClipIngestResult {
  const bird = input.provider.id === "birdfy" || input.provider.id === "bird-buddy" ? "Tufted titmouse" : "Downy woodpecker";
  const rarity = input.provider.id === "birdfy" || input.provider.id === "bird-buddy" ? "Uncommon" : "Rare";
  const points = rarityPoints[rarity];
  const ingestRequest: CameraClipIngestRequest = {
    id: createId("ingest"),
    userId: input.userId,
    providerId: input.provider.id,
    providerName: input.provider.name,
    deviceId: `${input.provider.id}-demo-device`,
    cameraName: `${input.provider.name} feeder`,
    capturedAt: "Just now",
    durationSeconds: 18,
    motionEventId: createId("motion"),
    thumbnailUrl: "https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1000&q=80",
    privacyMode: input.privacyMode
  };

  const ingestResult = {
    ingestId: ingestRequest.id,
    status: "needs-review",
    clip: {
      id: createId("clip"),
      cameraName: ingestRequest.cameraName,
      bird,
      rarity,
      location: "Private backyard",
      capturedAt: ingestRequest.capturedAt,
      imageUrl: ingestRequest.thumbnailUrl ?? "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&w=1000&q=80",
      duration: formatDuration(ingestRequest.durationSeconds),
      confidence: 82,
      motionOnly: true,
      owner: "Charlie",
      points,
      reactions: 0,
      comments: []
    },
    sighting: {
      id: createId("sighting"),
      bird,
      rarity,
      location: "Private backyard",
      source: ingestRequest.cameraName,
      loggedAt: "Needs review",
      points
    },
    reviewMessage: `Received ${input.provider.name} motion clip as a private ${input.privacyMode} item pending bird review.`
  } satisfies CameraClipIngestResult;

  void postJson<{ ingestResult: CameraClipIngestResult }>("/api/cameras/clip-ingests", {
    userId: ingestRequest.userId,
    providerId: ingestRequest.providerId,
    providerName: ingestRequest.providerName,
    deviceId: ingestRequest.deviceId,
    cameraName: ingestRequest.cameraName,
    capturedAt: ingestRequest.capturedAt,
    durationSeconds: ingestRequest.durationSeconds,
    motionEventId: ingestRequest.motionEventId,
    thumbnailUrl: ingestRequest.thumbnailUrl,
    privacyMode: ingestRequest.privacyMode
  });

  return ingestResult;
}

export function createDemoRelayUpload(input: {
  userId: string;
  provider: CameraProvider;
  device: CameraDevice;
  privacyMode: CameraPrivacyMode;
}): CameraRelayUploadResult {
  const relayId = input.device.relayId ?? createId("relay");
  const motionEventId = createId("motion");
  const bird = "Northern cardinal";
  const rarity = "Uncommon";
  const points = rarityPoints[rarity];
  const relayUploadRequest = {
    userId: input.userId,
    providerId: input.provider.id,
    deviceId: input.device.id,
    relayId,
    motionEventId,
    capturedAt: "Just now",
    durationSeconds: 14,
    cameraName: input.device.displayName,
    thumbnailUrl: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1000&q=80",
    privacyMode: input.privacyMode
  } satisfies CameraRelayUploadRequest;
  const relayUpload = {
    uploadId: createId("upload"),
    status: "needs-review",
    deviceId: input.device.id,
    relayId,
    motionEventId,
    acceptedAt: "Just now",
    clip: {
      id: createId("clip"),
      cameraName: relayUploadRequest.cameraName,
      bird,
      rarity,
      location: input.device.locationLabel,
      capturedAt: relayUploadRequest.capturedAt,
      imageUrl: relayUploadRequest.thumbnailUrl ?? "https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1000&q=80",
      duration: formatDuration(relayUploadRequest.durationSeconds),
      confidence: 79,
      motionOnly: true,
      owner: "Charlie",
      points,
      reactions: 0,
      comments: []
    },
    sighting: {
      id: createId("sighting"),
      bird,
      rarity,
      location: input.device.locationLabel,
      source: relayUploadRequest.cameraName,
      loggedAt: "Needs review",
      points
    },
    reviewMessage: `Accepted signed relay upload ${motionEventId} from ${input.device.displayName} as a ${input.privacyMode} item pending review.`
  } satisfies CameraRelayUploadResult;

  void postJson<{ relayUpload: CameraRelayUploadResult }>(
    "/api/cameras/relay-uploads",
    relayUploadRequest,
    { "x-flock-relay-signature": `demo-${input.device.id}-${motionEventId}` }
  );

  return relayUpload;
}
