import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { createId, getHeader } from "./camera-sync-architecture.js";
import { getVerifiedSupabaseUser } from "./supabase-auth.js";

const STORE_VERSION = 3;
const COLLECTIONS = [
  "syncSessions",
  "connectionRequests",
  "devices",
  "relayEnrollments",
  "relayManifests",
  "relayUploads",
  "clipIngests",
  "reviewItems",
  "birdAnalyses",
  "birdCorrections"
];
const DEFAULT_LOCAL_STORE_PATH = ".flock-camera-store.local.json";
const DEFAULT_CLOUD_NAMESPACE = "flock:camera-sync-state:v1";

let volatileState = createEmptyState();

function createEmptyState() {
  return {
    version: STORE_VERSION,
    accounts: {},
    updatedAt: null
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeState(value) {
  const state = value && typeof value === "object" ? value : createEmptyState();
  if (!state.accounts || typeof state.accounts !== "object") state.accounts = {};
  state.version = STORE_VERSION;
  for (const account of Object.values(state.accounts)) {
    ensureAccountCollections(account);
  }
  return state;
}

function ensureAccountCollections(account) {
  for (const collection of COLLECTIONS) {
    if (!account[collection] || typeof account[collection] !== "object") {
      account[collection] = {};
    }
  }
}

function getOrCreateAccount(state, userId) {
  if (!state.accounts[userId]) {
    state.accounts[userId] = { userId, createdAt: new Date().toISOString() };
  }
  ensureAccountCollections(state.accounts[userId]);
  return state.accounts[userId];
}

function clean(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function envFlag(name) {
  const value = clean(process.env[name]);
  return value ? ["1", "true", "yes", "on"].includes(value.toLowerCase()) : false;
}

export function isCameraAuthRequired() {
  return envFlag("FLOCK_REQUIRE_AUTH") || clean(process.env.FLOCK_AUTH_MODE)?.toLowerCase() === "supabase";
}

export function getCameraAccountErrorStatus(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/claim does not match|ownership claims do not match/i.test(message)) return 403;
  if (/auth|authorization|bearer|session|signature/i.test(message)) return 401;
  return 400;
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getQueryUserId(request) {
  if (request.query?.userId) return clean(first(request.query.userId));
  const query = request.url?.split("?")[1];
  if (!query) return undefined;
  return clean(new URLSearchParams(query).get("userId"));
}

export async function getCameraAccountContext(request, body = {}) {
  const headerUserId = clean(getHeader(request, "x-flock-user-id"));
  const bodyUserId = clean(body.userId);
  const queryUserId = getQueryUserId(request);
  const claimedIds = [headerUserId, bodyUserId, queryUserId].filter(Boolean);
  const authenticatedUser = await getVerifiedSupabaseUser(request);

  if (authenticatedUser) {
    const mismatchedClaim = claimedIds.find((claim) => claim !== authenticatedUser.id);

    if (mismatchedClaim) {
      throw new Error("Authenticated camera account claim does not match the signed-in user.");
    }

    return {
      userId: authenticatedUser.id,
      authMode: "supabase-auth",
      authenticated: true,
      hardGate: null
    };
  }

  if (isCameraAuthRequired()) {
    throw new Error("Supabase authentication is required for camera account access.");
  }

  const userId = headerUserId || bodyUserId || queryUserId || "demo-user";
  const mismatchedClaim = claimedIds.find((claim) => claim !== userId);

  if (mismatchedClaim) {
    throw new Error("Camera account ownership claims do not match.");
  }

  const sessionSecret = process.env.FLOCK_SESSION_SIGNING_SECRET;
  if (!sessionSecret) {
    return {
      userId,
      authMode: "demo-unsigned",
      authenticated: false,
      hardGate: "Set FLOCK_SESSION_SIGNING_SECRET or attach a real auth provider before production account data."
    };
  }

  if (!headerUserId) {
    throw new Error("Signed camera account session requires x-flock-user-id.");
  }

  const signature = clean(getHeader(request, "x-flock-session-signature"));
  if (!signature) {
    throw new Error("Signed camera account session is required.");
  }

  const expected = createHmac("sha256", sessionSecret).update(userId).digest("hex");
  if (!safeEqual(signature, expected)) {
    throw new Error("Camera account session signature is invalid.");
  }

  return {
    userId,
    authMode: "server-signed",
    authenticated: true,
    hardGate: null
  };
}

export function getCameraStoreConfig() {
  const url = clean(process.env.FLOCK_CAMERA_STORE_REST_URL) || clean(process.env.KV_REST_API_URL) || clean(process.env.UPSTASH_REDIS_REST_URL);
  const token =
    clean(process.env.FLOCK_CAMERA_STORE_REST_TOKEN) || clean(process.env.KV_REST_API_TOKEN) || clean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (url && token) {
    return {
      mode: "cloud-rest",
      durable: true,
      url,
      token,
      namespace: clean(process.env.FLOCK_CAMERA_STORE_NAMESPACE) || DEFAULT_CLOUD_NAMESPACE
    };
  }

  if (process.env.FLOCK_CAMERA_STORE_FILE || process.env.NODE_ENV !== "production") {
    return {
      mode: "local-json",
      durable: true,
      filePath: resolve(process.env.FLOCK_CAMERA_STORE_FILE || DEFAULT_LOCAL_STORE_PATH)
    };
  }

  return {
    mode: "volatile-memory",
    durable: false
  };
}

export function describeCameraPersistence(collection, accountContext) {
  const config = getCameraStoreConfig();
  return {
    mode: config.mode,
    durable: config.durable,
    collection,
    ownerId: accountContext.userId,
    authMode: accountContext.authMode,
    dataBoundary: "account-owned-camera-sync-state",
    next: getPersistenceNextStep(config, accountContext)
  };
}

function getPersistenceNextStep(config, accountContext) {
  if (!config.durable) {
    return "Configure FLOCK_CAMERA_STORE_REST_URL and FLOCK_CAMERA_STORE_REST_TOKEN before relying on Vercel function persistence.";
  }
  if (!accountContext.authenticated) {
    return "Attach real auth or set FLOCK_SESSION_SIGNING_SECRET before storing production user camera data.";
  }
  return "Ready for production relay secrets, OAuth token storage, and clip asset storage after those gates are approved.";
}

export async function persistCameraSyncSession(request, body, syncSession) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("syncSessions", account);
  const record = { ...syncSession, userId: account.userId, storage };

  await mutateAccount(account.userId, (accountState) => {
    accountState.syncSessions[record.id] = record;
  });

  return record;
}

export async function persistCameraConnectionRequest(request, body, connectionRequest) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("connectionRequests", account);
  const record = { ...connectionRequest, userId: account.userId, storage };

  await mutateAccount(account.userId, (accountState) => {
    accountState.connectionRequests[record.id] = record;
  });

  return record;
}

export async function persistCameraDeviceRegistration(request, body, registrationResult) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("devices", account);
  const device = { ...registrationResult.device, ownerId: account.userId, storage };
  const relay = registrationResult.relay
    ? {
        ...registrationResult.relay,
        ownerId: account.userId,
        enrolledAt: registrationResult.relay.enrolledAt || new Date().toISOString(),
        storage: describeCameraPersistence("relayEnrollments", account)
      }
    : undefined;

  await mutateAccount(account.userId, (accountState) => {
    accountState.devices[device.id] = device;
    if (relay) accountState.relayEnrollments[relay.relayId] = relay;
  });

  return { ...registrationResult, device, relay, storage };
}

export async function persistCameraRelayManifest(request, body, relayManifest) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("relayManifests", account);
  const record = {
    ...relayManifest,
    ownerId: account.userId,
    storage
  };

  await mutateAccount(account.userId, (accountState) => {
    accountState.relayManifests[record.id] = record;
  });

  return record;
}

export async function persistCameraRelayUpload(request, body, relayUpload) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("relayUploads", account);
  const reviewRecord = createReviewRecord({
    ownerId: account.userId,
    source: "relay-upload",
    providerId: body.providerId,
    deviceId: relayUpload.deviceId,
    relayId: relayUpload.relayId,
    uploadId: relayUpload.uploadId,
    clipId: relayUpload.clip.id,
    sightingId: relayUpload.sighting.id,
    privacyMode: body.privacyMode,
    reviewMessage: relayUpload.reviewMessage
  });
  const record = { ...relayUpload, userId: account.userId, storage, reviewRecord };

  await mutateAccount(account.userId, (accountState) => {
    accountState.relayUploads[record.uploadId] = record;
    accountState.reviewItems[reviewRecord.id] = reviewRecord;
    const device = accountState.devices[record.deviceId];
    if (device) {
      device.lastSeenAt = record.acceptedAt;
      device.connectionStatus = "connected";
    }
  });

  return record;
}

export async function persistCameraClipIngest(request, body, ingestResult) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("clipIngests", account);
  const reviewRecord = createReviewRecord({
    ownerId: account.userId,
    source: "clip-ingest",
    providerId: body.providerId,
    deviceId: body.deviceId,
    relayId: body.relayId,
    uploadId: ingestResult.ingestId,
    clipId: ingestResult.clip.id,
    sightingId: ingestResult.sighting.id,
    privacyMode: body.privacyMode,
    reviewMessage: ingestResult.reviewMessage
  });
  const record = { ...ingestResult, userId: account.userId, storage, reviewRecord };

  await mutateAccount(account.userId, (accountState) => {
    accountState.clipIngests[record.ingestId] = record;
    accountState.reviewItems[reviewRecord.id] = reviewRecord;
  });

  return record;
}

export async function persistBirdAnalysis(request, body, analysis) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("birdAnalyses", account);
  const record = { ...analysis, ownerId: account.userId, storage };

  await mutateAccount(account.userId, (accountState) => {
    accountState.birdAnalyses[record.id] = record;
    const reviewRecord = accountState.reviewItems[record.reviewItemId];
    if (reviewRecord) {
      reviewRecord.analysisId = record.id;
      reviewRecord.analysisStatus = record.status;
      reviewRecord.birdDetected = record.birdDetected;
      reviewRecord.confidence = record.confidence;
      reviewRecord.updatedAt = record.createdAt;
    }
  });

  return record;
}

export async function persistBirdCorrection(request, body, correction) {
  const account = await getCameraAccountContext(request, body);
  const storage = describeCameraPersistence("birdCorrections", account);
  const record = { ...correction, ownerId: account.userId, storage };

  await mutateAccount(account.userId, (accountState) => {
    accountState.birdCorrections[record.id] = record;

    const analysis = accountState.birdAnalyses[record.analysisId];
    if (analysis) {
      analysis.status = record.analysisStatus;
      analysis.birdDetected = record.birdDetected;
      analysis.needsManualReview = false;
      analysis.manualCorrection = record;
      analysis.selectedSpecies = record.species?.commonName ?? null;
      analysis.rarityScore = record.rarityScore;
      analysis.updatedAt = record.correctedAt;
    }

    const reviewRecord = accountState.reviewItems[record.reviewItemId];
    if (reviewRecord) {
      reviewRecord.status = record.reviewStatus;
      reviewRecord.analysisStatus = record.analysisStatus;
      reviewRecord.correctionId = record.id;
      reviewRecord.correctedSpecies = record.species?.commonName ?? null;
      reviewRecord.birdDetected = record.birdDetected;
      reviewRecord.updatedAt = record.correctedAt;
    }
  });

  return record;
}

export async function getCameraAccountState(request, body = {}) {
  const account = await getCameraAccountContext(request, body);
  const state = await loadState();
  const accountState = getOrCreateAccount(state, account.userId);

  return {
    account,
    storage: describeCameraPersistence("accountState", account),
    records: snapshotAccount(accountState)
  };
}

export async function getStoredCameraDevice(request, deviceId, body = {}) {
  const { account } = await getCameraAccountState(request, body);
  const state = await loadState();
  const accountState = getOrCreateAccount(state, account.userId);
  return accountState.devices[deviceId] || null;
}

function createReviewRecord({ ownerId, source, providerId, deviceId, relayId, uploadId, clipId, sightingId, privacyMode, reviewMessage }) {
  return {
    id: createId("review"),
    ownerId,
    source,
    providerId,
    deviceId,
    relayId,
    uploadId,
    clipId,
    sightingId,
    status: "needs-review",
    privacyMode: privacyMode === "friends" || privacyMode === "league" ? privacyMode : "private",
    reviewMessage,
    createdAt: new Date().toISOString()
  };
}

function snapshotAccount(accountState) {
  return Object.fromEntries(COLLECTIONS.map((collection) => [collection, Object.values(accountState[collection])]));
}

async function mutateAccount(userId, mutator) {
  const state = await loadState();
  const accountState = getOrCreateAccount(state, userId);
  mutator(accountState);
  state.updatedAt = new Date().toISOString();
  await saveState(state);
}

async function loadState() {
  const config = getCameraStoreConfig();
  if (config.mode === "cloud-rest") return loadCloudState(config);
  if (config.mode === "local-json") return loadLocalState(config);
  return clone(volatileState);
}

async function saveState(state) {
  const normalizedState = normalizeState(state);
  const config = getCameraStoreConfig();

  if (config.mode === "cloud-rest") {
    await saveCloudState(config, normalizedState);
    return;
  }

  if (config.mode === "local-json") {
    await saveLocalState(config, normalizedState);
    return;
  }

  volatileState = clone(normalizedState);
}

async function loadLocalState(config) {
  try {
    const raw = await readFile(config.filePath, "utf8");
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    if (error?.code === "ENOENT") return createEmptyState();
    throw error;
  }
}

async function saveLocalState(config, state) {
  await mkdir(dirname(config.filePath), { recursive: true });
  await writeFile(config.filePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

async function loadCloudState(config) {
  const result = await cloudCommand(config, ["GET", config.namespace]);
  if (!result) return createEmptyState();
  if (typeof result === "string") return normalizeState(JSON.parse(result));
  return normalizeState(result);
}

async function saveCloudState(config, state) {
  await cloudCommand(config, ["SET", config.namespace, JSON.stringify(state)]);
}

async function cloudCommand(config, command) {
  if (typeof fetch !== "function") {
    throw new Error("Cloud camera store requires fetch support in the server runtime.");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(command)
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Camera store command failed with HTTP ${response.status}.`);
  }

  return Object.prototype.hasOwnProperty.call(payload, "result") ? payload.result : payload;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
