import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { createId, createPerRelaySignature, getHeader } from "./camera-sync-architecture.js";
import { getVerifiedSupabaseUser, isSupabaseAuthConfigured } from "./supabase-auth.js";

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

function assertPrivateMediaOwnership(body, account) {
  const prefix = `owners/${account.userId}/devices/`;
  for (const field of ["clipObjectKey", "thumbnailObjectKey"]) {
    const key = clean(body[field]);
    if (key && !key.startsWith(prefix)) {
      throw new Error(`${field} must belong to the verified camera account.`);
    }
  }
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

export function getCameraMvpReadiness(accountContext) {
  const config = getCameraStoreConfig();
  const authEnforced = isCameraAuthRequired();
  const supabaseConfigured = isSupabaseAuthConfigured();
  const relaySigningConfigured = Boolean(clean(process.env.FLOCK_RELAY_SIGNING_SECRET));
  const privateClipStorageConfigured = Boolean(clean(process.env.FLOCK_CLIP_STORAGE_BUCKET));
  const checks = [
    {
      id: "supabase-auth",
      label: "Supabase auth enforced",
      status: supabaseConfigured && authEnforced && accountContext.authMode === "supabase-auth" ? "pass" : "blocked",
      detail:
        supabaseConfigured && authEnforced
          ? "Camera account routes require verified bearer tokens."
          : "Configure Supabase env vars and FLOCK_REQUIRE_AUTH=true.",
      next: "Verify Google, Apple, and phone OTP round trips against the deployed Vercel URL."
    },
    {
      id: "durable-camera-store",
      label: "Durable camera state",
      status: config.durable ? "pass" : "blocked",
      detail: config.durable
        ? `Camera state is using ${config.mode}.`
        : "Production functions are using volatile memory.",
      next: "Set REST/KV store env vars, then migrate the beta store to owner-scoped records."
    },
    {
      id: "owner-scoped-records",
      label: "Owner-scoped record store",
      status: "attention",
      detail: "The current durable path stores one namespaced camera JSON document.",
      next: "Move camera records into Supabase Postgres with owner_id columns and row-level security before broad beta."
    },
    {
      id: "relay-signing",
      label: "Production relay signing",
      status: relaySigningConfigured ? "pass" : "attention",
      detail: relaySigningConfigured
        ? "Relay uploads require server HMAC signatures."
        : "Relay uploads can still use demo-prefix signatures.",
      next: "Set FLOCK_RELAY_SIGNING_SECRET before accepting real local relay uploads."
    },
    {
      id: "private-clip-storage",
      label: "Private clip storage",
      status: privateClipStorageConfigured ? "pass" : "blocked",
      detail: privateClipStorageConfigured
        ? "A private clip storage bucket is configured."
        : "Clip media storage is not configured yet.",
      next: "Choose the storage bucket, signed URL policy, retention window, and deletion behavior."
    },
    {
      id: "vendor-field-tests",
      label: "Real camera field tests",
      status: "attention",
      detail: "Birdfy, Bird Buddy, Reolink, Tapo, Wyze, Ring, and Nest paths still need real-device proof.",
      next: "Run the camera field-test plan and attach outcomes to the MVP readiness gaps doc."
    }
  ];
  const blockers = checks.filter((check) => check.status === "blocked").map((check) => check.label);
  const attention = checks.filter((check) => check.status === "attention").map((check) => check.label);
  const fieldTestReady =
    supabaseConfigured && authEnforced && accountContext.authMode === "supabase-auth" && config.durable && relaySigningConfigured;
  const betaInfraReady = blockers.length === 0 && attention.length === 0;
  const status = betaInfraReady ? "beta-infra-ready" : fieldTestReady ? "field-test-ready" : "mvp-blocked";

  return {
    status,
    summary:
      status === "beta-infra-ready"
        ? "Auth, durable state, relay signing, and private clip storage are configured; real camera proof is the next gate."
        : status === "field-test-ready"
          ? "Core auth, state, and relay signing are ready for controlled field tests; review the remaining beta gates before inviting users."
          : "MVP beta is still blocked by configuration or infrastructure gaps.",
    blockers,
    attention,
    checks
  };
}

function getPersistenceNextStep(config, accountContext) {
  if (!config.durable) {
    return "Configure FLOCK_CAMERA_STORE_REST_URL and FLOCK_CAMERA_STORE_REST_TOKEN before relying on Vercel function persistence.";
  }
  if (!accountContext.authenticated) {
    return "Attach real auth or set FLOCK_SESSION_SIGNING_SECRET before storing production user camera data.";
  }
  return "Durable account state is available; migrate to owner-scoped records with RLS before broad beta.";
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
        credentialVersion: 1,
        credentialIssuedAt: new Date().toISOString(),
        storage: describeCameraPersistence("relayEnrollments", account)
      }
    : undefined;

  await mutateAccount(account.userId, (accountState) => {
    accountState.devices[device.id] = device;
    if (relay) accountState.relayEnrollments[relay.relayId] = relay;
  });

  return {
    ...registrationResult,
    device,
    relay,
    storage,
    relayCredential: relay && process.env.FLOCK_RELAY_SIGNING_SECRET ? createRelayCredential(relay) : undefined
  };
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

export async function persistCameraRelayUpload(request, body, relayUpload, verifiedRelayAccount) {
  const account = verifiedRelayAccount || (await getCameraAccountContext(request, body));
  assertPrivateMediaOwnership(body, account);
  const storage = describeCameraPersistence("relayUploads", account);
  const result = await mutateAccount(account.userId, (accountState) => {
    const device = accountState.devices[relayUpload.deviceId];
    if (!device) throw new Error("Register this camera device before accepting relay uploads.");
    if (device.providerId !== body.providerId) throw new Error("Relay upload provider must match the registered device.");
    if (!device.relayId || device.relayId !== relayUpload.relayId) {
      throw new Error("Relay upload relayId must match the registered device relay.");
    }

    const existing = Object.values(accountState.relayUploads).find(
      (upload) =>
        upload.deviceId === relayUpload.deviceId &&
        upload.relayId === relayUpload.relayId &&
        upload.motionEventId === relayUpload.motionEventId
    );
    if (existing) return { record: existing, idempotent: true };

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
    accountState.relayUploads[record.uploadId] = record;
    accountState.reviewItems[reviewRecord.id] = reviewRecord;
    device.lastSeenAt = record.acceptedAt;
    device.connectionStatus = "connected";
    return { record, idempotent: false };
  });

  return result;
}

function createRelayCredential(relay) {
  return {
    relayId: relay.relayId,
    version: relay.credentialVersion,
    signingKey: deriveRelaySigningKey(relay.relayId, relay.credentialVersion),
    delivery: "shown-once-at-enrollment-or-rotation",
    storage: "keep-inside-user-relay"
  };
}

function deriveRelaySigningKey(relayId, version) {
  const rootSecret = clean(process.env.FLOCK_RELAY_SIGNING_SECRET);
  if (!rootSecret) throw new Error("FLOCK_RELAY_SIGNING_SECRET is required to issue per-relay credentials.");
  return createHmac("sha256", rootSecret).update(`relay-key.${relayId}.${version}`).digest("base64url");
}

export async function verifyRelayUploadSignature(body, signature) {
  if (!signature) throw new Error("Relay upload signature is required.");
  const state = await loadState();
  for (const accountState of Object.values(state.accounts)) {
    const device = accountState.devices[body.deviceId];
    const relay = accountState.relayEnrollments[body.relayId];
    if (!device || !relay || device.relayId !== body.relayId || relay.deviceId !== body.deviceId) continue;
    if (device.providerId !== body.providerId) throw new Error("Relay upload provider must match the registered device.");
    if (relay.revokedAt) throw new Error("Relay enrollment is revoked. Rotate or re-enroll this local relay.");

    const expected = createPerRelaySignature(deriveRelaySigningKey(relay.relayId, relay.credentialVersion || 1), body);
    if (!safeEqual(signature, expected)) throw new Error("Relay upload signature did not match this enrolled relay key.");
    return { userId: accountState.userId, authMode: "relay-key", authenticated: true, hardGate: null };
  }
  throw new Error("Register this camera device and relay before accepting relay uploads.");
}

export async function rotateCameraRelayCredential(request, body) {
  const account = await getCameraAccountContext(request, body);
  const relayId = clean(body.relayId);
  const deviceId = clean(body.deviceId);
  if (!relayId || !deviceId) throw new Error("deviceId and relayId are required to rotate a relay credential.");

  return mutateAccount(account.userId, (accountState) => {
    const device = accountState.devices[deviceId];
    const relay = accountState.relayEnrollments[relayId];
    if (!device || !relay || device.relayId !== relayId || relay.deviceId !== deviceId) {
      throw new Error("Relay credential rotation requires the account-owned registered device and relay.");
    }
    if (!clean(process.env.FLOCK_RELAY_SIGNING_SECRET)) {
      throw new Error("FLOCK_RELAY_SIGNING_SECRET is required before relay credentials can be rotated.");
    }
    relay.credentialVersion = (relay.credentialVersion || 1) + 1;
    relay.credentialIssuedAt = new Date().toISOString();
    relay.rotatedAt = relay.credentialIssuedAt;
    return { relayCredential: createRelayCredential(relay), rotation: "previous-key-revoked" };
  });
}

export async function persistCameraClipIngest(request, body, ingestResult) {
  const account = await getCameraAccountContext(request, body);
  assertPrivateMediaOwnership(body, account);
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
    readiness: getCameraMvpReadiness(account),
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
  const result = mutator(accountState);
  state.updatedAt = new Date().toISOString();
  await saveState(state);
  return result;
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
