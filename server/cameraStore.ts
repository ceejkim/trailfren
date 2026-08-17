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
  lastSeenAt: string;
  nextStep: string;
};

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
  const headers = new Headers(init?.headers);
  headers.set("cache-control", "no-store");
  return Response.json(data, { ...init, headers });
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

  return {
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
  } satisfies CameraConnectionRequest;
}

export function createClipIngest(body: Record<string, unknown>) {
  rejectSecretFields(body);
  const provider = getProvider(body.providerId);
  const privacyMode = getPrivacyMode(body.privacyMode);
  const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : 18;
  const bird: string = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Tufted titmouse" : "Downy woodpecker";
  const rarity: Rarity = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Uncommon" : "Rare";
  const points = rarityPoints[rarity];
  const cameraName = typeof body.cameraName === "string" && body.cameraName.trim() ? body.cameraName : `${provider.name} feeder`;
  const thumbnailUrl =
    typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()
      ? body.thumbnailUrl
      : "https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1000&q=80";

  return {
    ingestId: createId("ingest"),
    status: "needs-review",
    clip: {
      id: createId("clip"),
      cameraName,
      bird,
      rarity,
      location: "Private backyard",
      capturedAt: "Just now",
      imageUrl: thumbnailUrl,
      duration: formatDuration(durationSeconds),
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
      source: cameraName,
      loggedAt: "Needs review",
      points
    },
    reviewMessage: `Received ${provider.name} motion clip as a private ${privacyMode} item pending bird review.`
  } satisfies CameraClipIngestResult;
}

export function getCameraDeviceStatus(deviceId: string, providerId?: string | null) {
  const provider = providerId && providerId in providers ? providers[providerId as CameraProviderId] : providers["manual-upload"];
  return {
    deviceId,
    providerId: provider.id,
    providerName: provider.name,
    status: getDeviceStatus(provider.mode),
    lastSeenAt: new Date().toISOString(),
    nextStep: getNextStep(provider.mode, provider.name)
  } satisfies CameraDeviceStatus;
}
