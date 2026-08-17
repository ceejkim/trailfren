type CameraProviderId =
  | "birdfy"
  | "bird-buddy"
  | "ring"
  | "nest"
  | "reolink"
  | "tapo"
  | "wyze"
  | "manual-upload";

type CameraPrivacyMode = "private" | "friends" | "league";

type CameraConnectionMode = "partner-request" | "official-oauth" | "local-relay" | "manual-upload";

type CameraConnectionStatus = "queued" | "oauth-started" | "relay-required" | "partner-review" | "manual-ready";

type CameraClipIngestStatus = "received" | "processing" | "needs-review" | "ready";

type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";

type ProviderConfig = {
  id: CameraProviderId;
  name: string;
  mode: CameraConnectionMode;
};

type CameraConnectionRequest = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  mode: CameraConnectionMode;
  status: CameraConnectionStatus;
  requestedAt: string;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  nextStep: string;
  callbackPath: string;
};

type CameraClipIngestRequest = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  deviceId: string;
  cameraName: string;
  capturedAt: string;
  durationSeconds: number;
  motionEventId?: string;
  thumbnailUrl?: string;
  clipUrl?: string;
  privacyMode: CameraPrivacyMode;
};

type Clip = {
  id: string;
  cameraName: string;
  bird: string;
  rarity: Rarity;
  location: string;
  capturedAt: string;
  imageUrl: string;
  duration: string;
  confidence: number;
  motionOnly: boolean;
  owner: string;
  points: number;
  reactions: number;
  comments: Array<{ id: string; author: string; body: string; createdAt: string }>;
};

type Sighting = {
  id: string;
  bird: string;
  rarity: Rarity;
  location: string;
  source: string;
  loggedAt: string;
  points: number;
};

type CameraClipIngestResult = {
  ingestId: string;
  status: CameraClipIngestStatus;
  clip: Clip;
  sighting: Sighting;
  reviewMessage: string;
};

type CameraDeviceStatus = {
  deviceId: string;
  providerId: CameraProviderId;
  providerName: string;
  status: "awaiting-setup" | "waiting-on-provider" | "relay-required" | "ready-for-ingest";
  lastConnectionRequestId?: string;
  lastIngestId?: string;
  lastSeenAt?: string;
  nextStep: string;
};

type CameraStore = {
  connections: CameraConnectionRequest[];
  ingests: CameraClipIngestResult[];
  devices: Record<string, CameraDeviceStatus>;
};

declare global {
  var __flockCameraStore: CameraStore | undefined;
}

const providers: Record<CameraProviderId, ProviderConfig> = {
  birdfy: { id: "birdfy", name: "Birdfy / Netvue", mode: "partner-request" },
  "bird-buddy": { id: "bird-buddy", name: "Bird Buddy", mode: "partner-request" },
  ring: { id: "ring", name: "Ring", mode: "official-oauth" },
  nest: { id: "nest", name: "Google Nest Cam", mode: "official-oauth" },
  reolink: { id: "reolink", name: "Reolink", mode: "local-relay" },
  tapo: { id: "tapo", name: "Tapo", mode: "local-relay" },
  wyze: { id: "wyze", name: "Wyze supported RTSP models", mode: "local-relay" },
  "manual-upload": { id: "manual-upload", name: "Manual upload", mode: "manual-upload" }
};

const rarityPoints: Record<Rarity, number> = {
  Common: 10,
  Uncommon: 25,
  Rare: 60,
  Legendary: 150
};

function getStore() {
  globalThis.__flockCameraStore ??= { connections: [], ingests: [], devices: {} };
  return globalThis.__flockCameraStore;
}

function createId(prefix: string) {
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${randomPart}`;
}

function getStatus(mode: CameraConnectionMode): CameraConnectionStatus {
  if (mode === "official-oauth") return "oauth-started";
  if (mode === "local-relay") return "relay-required";
  if (mode === "partner-request") return "partner-review";
  return "manual-ready";
}

function getDeviceStatus(mode: CameraConnectionMode): CameraDeviceStatus["status"] {
  if (mode === "official-oauth") return "waiting-on-provider";
  if (mode === "local-relay") return "relay-required";
  if (mode === "partner-request") return "awaiting-setup";
  return "ready-for-ingest";
}

function getCallbackPath(mode: CameraConnectionMode, providerId: CameraProviderId) {
  if (mode === "official-oauth") return `/api/cameras/${providerId}/oauth/callback`;
  if (mode === "local-relay") return `/api/cameras/${providerId}/relay/connect`;
  if (mode === "partner-request") return `/api/cameras/${providerId}/partner-request`;
  return "/api/cameras/manual-upload";
}

function getNextStep(mode: CameraConnectionMode, providerName: string) {
  if (mode === "official-oauth") return `Start official ${providerName} account linking and keep tokens server-side only.`;
  if (mode === "local-relay") return `Install a local Flock relay before any private ${providerName} camera stream can upload clips.`;
  if (mode === "partner-request") return `Queue a ${providerName} partner/export request and keep manual import available until official access exists.`;
  return "Open manual upload and run clips through private review before scoring.";
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function rejectSecretFields(payload: unknown) {
  const forbidden = ["password", "secret", "token", "apikey", "api_key", "refresh"];
  const stack = [payload];

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item || typeof item !== "object") continue;
    for (const [key, value] of Object.entries(item)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z_]/g, "");
      if (forbidden.some((word) => normalizedKey.includes(word))) {
        throw new Error(`Sensitive field '${key}' is not accepted by this demo endpoint.`);
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
}

function getProvider(providerId: unknown) {
  if (typeof providerId !== "string" || !(providerId in providers)) {
    throw new Error("A supported providerId is required.");
  }
  return providers[providerId as CameraProviderId];
}

function getPrivacyMode(value: unknown): CameraPrivacyMode {
  if (value === "friends" || value === "league") return value;
  return "private";
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    ...init,
    headers: {
      "cache-control": "no-store",
      ...(init?.headers ?? {})
    }
  });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

export function createConnectionRequest(body: Record<string, unknown>) {
  rejectSecretFields(body);
  const provider = getProvider(body.providerId);
  const mode = provider.mode;
  const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
  const privacyMode = getPrivacyMode(body.privacyMode);
  const motionUploadsEnabled = body.motionUploadsEnabled !== false;
  const deviceId = `${provider.id}-demo-device`;
  const request: CameraConnectionRequest = {
    id: createId("conn"),
    userId,
    providerId: provider.id,
    providerName: provider.name,
    mode,
    status: getStatus(mode),
    requestedAt: new Date().toISOString(),
    privacyMode,
    motionUploadsEnabled,
    nextStep: getNextStep(mode, provider.name),
    callbackPath: getCallbackPath(mode, provider.id)
  };

  const store = getStore();
  store.connections.unshift(request);
  store.devices[deviceId] = {
    deviceId,
    providerId: provider.id,
    providerName: provider.name,
    status: getDeviceStatus(mode),
    lastConnectionRequestId: request.id,
    lastSeenAt: request.requestedAt,
    nextStep: request.nextStep
  };

  return request;
}

export function createClipIngest(body: Record<string, unknown>) {
  rejectSecretFields(body);
  const provider = getProvider(body.providerId);
  const privacyMode = getPrivacyMode(body.privacyMode);
  const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
  const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : 18;
  const deviceId = typeof body.deviceId === "string" && body.deviceId.trim() ? body.deviceId : `${provider.id}-demo-device`;
  const bird: string = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Tufted titmouse" : "Downy woodpecker";
  const rarity: Rarity = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Uncommon" : "Rare";
  const points = rarityPoints[rarity];
  const capturedAt = new Date().toISOString();
  const request: CameraClipIngestRequest = {
    id: createId("ingest"),
    userId,
    providerId: provider.id,
    providerName: provider.name,
    deviceId,
    cameraName: typeof body.cameraName === "string" && body.cameraName.trim() ? body.cameraName : `${provider.name} feeder`,
    capturedAt,
    durationSeconds,
    motionEventId: createId("motion"),
    thumbnailUrl:
      typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()
        ? body.thumbnailUrl
        : "https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1000&q=80",
    privacyMode
  };
  const result: CameraClipIngestResult = {
    ingestId: request.id,
    status: "needs-review",
    clip: {
      id: createId("clip"),
      cameraName: request.cameraName,
      bird,
      rarity,
      location: "Private backyard",
      capturedAt: "Just now",
      imageUrl: request.thumbnailUrl ?? "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&w=1000&q=80",
      duration: formatDuration(request.durationSeconds),
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
      source: request.cameraName,
      loggedAt: "Needs review",
      points
    },
    reviewMessage: `Received ${provider.name} motion clip as a private ${privacyMode} item pending bird review.`
  };

  const store = getStore();
  store.ingests.unshift(result);
  store.devices[deviceId] = {
    ...(store.devices[deviceId] ?? {
      deviceId,
      providerId: provider.id,
      providerName: provider.name,
      nextStep: "Review the latest motion clip before scoring."
    }),
    status: "ready-for-ingest",
    lastIngestId: result.ingestId,
    lastSeenAt: capturedAt
  };

  return result;
}

export function listConnectionRequests() {
  return getStore().connections.slice(0, 20);
}

export function listClipIngests() {
  return getStore().ingests.slice(0, 20);
}

export function getCameraDeviceStatus(deviceId: string) {
  const store = getStore();
  return (
    store.devices[deviceId] ?? {
      deviceId,
      providerId: "manual-upload",
      providerName: "Manual upload",
      status: "awaiting-setup",
      nextStep: "Create a connection request before clips can be ingested."
    }
  );
}
