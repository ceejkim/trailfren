import { rarityPoints } from "./data";
import type {
  CameraClipIngestRequest,
  CameraClipIngestResult,
  CameraConnectionMode,
  CameraConnectionRequest,
  CameraConnectionStatus,
  CameraPrivacyMode,
  CameraProvider,
  CameraSyncStatus
} from "./types";

function createId(prefix: string) {
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${randomPart}`;
}

async function postJson<T>(path: string, payload: unknown): Promise<T | null> {
  if (typeof fetch !== "function") return null;

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
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

function getCallbackPath(mode: CameraConnectionMode, provider: CameraProvider) {
  if (mode === "official-oauth") return `/api/cameras/${provider.id}/oauth/callback`;
  if (mode === "local-relay") return `/api/cameras/${provider.id}/relay/connect`;
  if (mode === "partner-request") return `/api/cameras/${provider.id}/partner-request`;
  return `/api/cameras/manual-upload`;
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

export function getSyncStatusForConnectionRequest(request: CameraConnectionRequest): CameraSyncStatus {
  if (request.status === "oauth-started") return "waiting-on-provider";
  if (request.status === "relay-required") return "relay-required";
  if (request.status === "partner-review") return "needs-approval";
  return "synced";
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
