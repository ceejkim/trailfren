import { createHmac } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";

import birdCorrections from "../api/bird-intelligence/corrections.js";
import birdReviews from "../api/bird-intelligence/reviews.js";
import accountState from "../api/cameras/account-state.js";
import cameraAdapters from "../api/cameras/adapters.js";
import clipIngests from "../api/cameras/clip-ingests.js";
import connectionRequests from "../api/cameras/connection-requests.js";
import devices from "../api/cameras/devices.js";
import relayUploads from "../api/cameras/relay-uploads.js";
import syncSessions from "../api/cameras/sync-sessions.js";
import status from "../api/cameras/[deviceId]/status.js";

process.env.FLOCK_CAMERA_STORE_FILE = process.env.FLOCK_CAMERA_STORE_FILE || `/tmp/flock-camera-store-${process.pid}.json`;
delete process.env.FLOCK_CAMERA_STORE_REST_URL;
delete process.env.FLOCK_CAMERA_STORE_REST_TOKEN;
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
delete process.env.FLOCK_SESSION_SIGNING_SECRET;
delete process.env.FLOCK_RELAY_SIGNING_SECRET;
delete process.env.FLOCK_REQUIRE_AUTH;
delete process.env.FLOCK_AUTH_MODE;

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: undefined,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
}

async function call(handler, request) {
  const response = createResponse();
  await handler(request, response);
  return response;
}

function post(body, headers = {}) {
  return { method: "POST", body, headers, query: {}, url: "/api/cameras/test" };
}

function get(query, url = "/api/cameras/test") {
  return { method: "GET", body: {}, headers: {}, query, url };
}

function adapterGet(path, query = {}) {
  return get({ ...query, adapterPath: path }, `/api/cameras/${path}`);
}

function adapterPost(path, body) {
  return { ...post(body), query: { adapterPath: path }, url: `/api/cameras/${path}` };
}

function withBearerToken(token) {
  return { authorization: `Bearer ${token}` };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function startSupabaseAuthStub(usersByToken) {
  const server = createServer((request, response) => {
    if (request.method !== "GET" || request.url !== "/auth/v1/user") {
      response.writeHead(404).end();
      return;
    }

    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    const user = token ? usersByToken[token] : undefined;
    response.setHeader("content-type", "application/json");
    if (!user) {
      response.writeHead(401).end(JSON.stringify({ message: "JWT expired" }));
      return;
    }
    response.writeHead(200).end(JSON.stringify(user));
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Unable to start Supabase Auth smoke stub.");

  return {
    url: `http://localhost:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  };
}

async function countApiFunctions(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const counts = await Promise.all(
    entries.map(async (entry) => {
      const location = new URL(entry.name, directory);
      if (entry.isDirectory()) return countApiFunctions(new URL(`${entry.name}/`, directory));
      return entry.isFile() && entry.name.endsWith(".js") ? 1 : 0;
    })
  );
  return counts.reduce((total, count) => total + count, 0);
}

const vercelConfig = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
const rewrites = new Map(vercelConfig.rewrites.map(({ source, destination }) => [source, destination]));
assert(
  rewrites.get("/api/cameras/ring/:path*") === "/api/cameras/adapters?adapterPath=ring/:path*",
  "expected Ring adapter rewrite"
);
assert(
  rewrites.get("/api/cameras/relay-manifests") === "/api/cameras/adapters?adapterPath=relay-manifests",
  "expected relay manifest rewrite"
);
assert(await countApiFunctions(new URL("../api/", import.meta.url)) <= 12, "expected Vercel Hobby-compatible function count");

const userId = `camera-smoke-${Date.now()}`;
const sync = await call(syncSessions, post({ userId, providerId: "birdfy", privacyMode: "private" }));
const connection = await call(connectionRequests, post({ userId, providerId: "birdfy", privacyMode: "friends" }));
const registration = await call(
  devices,
  post({ userId, providerId: "reolink", privacyMode: "private", redactedEndpoint: "rtsp://[redacted]@camera.local/stream" })
);
const adapters = await call(cameraAdapters, adapterGet("provider-adapters"));
const ringStart = await call(cameraAdapters, adapterGet("ring/oauth/start", { userId }));
const ringWebhook = await call(cameraAdapters, adapterPost("ring/webhooks", { userId, providerId: "ring", eventType: "motion" }));
const nestStart = await call(cameraAdapters, adapterGet("nest/oauth/start", { userId }));
const nestEvent = await call(cameraAdapters, adapterPost("nest/events", { userId, providerId: "nest", eventType: "cameraMotion" }));
const birdfyPartner = await call(cameraAdapters, adapterPost("birdfy/partner-request", { userId, providerId: "birdfy", importMode: "share-import" }));
const birdBuddyPartner = await call(
  cameraAdapters,
  adapterPost("bird-buddy/partner-request", { userId, providerId: "bird-buddy", importMode: "postcard-export" })
);
const wyzeSupported = await call(cameraAdapters, adapterPost("wyze/model-check", { userId, model: "Wyze Cam v3" }));
const wyzeUnsupported = await call(cameraAdapters, adapterPost("wyze/model-check", { userId, model: "Wyze Cam Outdoor" }));

assert(sync.statusCode === 202, `expected sync session 202, got ${sync.statusCode}`);
assert(connection.statusCode === 201, `expected connection request 201, got ${connection.statusCode}`);
assert(registration.statusCode === 201, `expected device registration 201, got ${registration.statusCode}`);
assert(adapters.statusCode === 200, `expected provider adapters 200, got ${adapters.statusCode}`);
assert(adapters.payload.adapters.length >= 8, "expected camera provider adapter contracts");
assert(
  adapters.payload.envChecklist.requirements.some((requirement) => requirement.name === "FLOCK_RING_CLIENT_ID"),
  "expected Ring env checklist"
);
assert(
  adapters.payload.envChecklist.requirements.some((requirement) => requirement.name === "FLOCK_REQUIRE_AUTH"),
  "expected auth-required env checklist"
);
assert(
  adapters.payload.envChecklist.missingRequired.includes("FLOCK_REQUIRE_AUTH"),
  "expected unsigned preview mode to report auth-required gate"
);
assert(ringStart.statusCode === 501, `expected gated Ring OAuth 501, got ${ringStart.statusCode}`);
assert(ringStart.payload.adapterAction.status.match(/configuration|required|vendor-review/), "expected gated Ring OAuth status");
assert(ringWebhook.statusCode === 501, `expected gated Ring webhook 501, got ${ringWebhook.statusCode}`);
assert(nestStart.statusCode === 501, `expected gated Nest OAuth 501, got ${nestStart.statusCode}`);
assert(nestEvent.statusCode === 501, `expected gated Nest event 501, got ${nestEvent.statusCode}`);
assert(birdfyPartner.statusCode === 202, `expected Birdfy partner request 202, got ${birdfyPartner.statusCode}`);
assert(birdfyPartner.payload.adapterAction.passwordCollection === "forbidden", "expected Birdfy password collection gate");
assert(birdBuddyPartner.statusCode === 202, `expected Bird Buddy partner request 202, got ${birdBuddyPartner.statusCode}`);
assert(wyzeSupported.payload.modelCheck.localRelayEligible === true, "expected Wyze Cam v3 RTSP eligibility");
assert(wyzeUnsupported.payload.modelCheck.localRelayEligible === false, "expected unsupported Wyze fallback");
assert(wyzeUnsupported.payload.modelCheck.fallbackProviderId === "manual-upload", "expected unsupported Wyze manual fallback");

const { device, relay } = registration.payload.registrationResult;
const relayManifest = await call(
  cameraAdapters,
  adapterPost("relay-manifests", {
    userId,
    providerId: "reolink",
    deviceId: device.id,
    relayId: relay.relayId,
    displayName: device.displayName,
    redactedEndpoint: device.redactedEndpoint,
    privacyMode: "private",
    motionUploadsEnabled: true
  })
);
const motionEventId = "motion-smoke";
const relayUpload = await call(
  relayUploads,
  post(
    {
      userId,
      providerId: "reolink",
      deviceId: device.id,
      relayId: relay.relayId,
      motionEventId,
      privacyMode: "private",
      durationSeconds: 12,
      clipObjectKey: `owners/${userId}/devices/${device.id}/clips/${motionEventId}.mp4`,
      thumbnailObjectKey: `owners/${userId}/devices/${device.id}/clips/${motionEventId}.jpg`
    },
    { "x-flock-relay-signature": `demo-${device.id}-${motionEventId}` }
  )
);
const clipIngest = await call(
  clipIngests,
  post({ userId, providerId: "manual-upload", deviceId: device.id, cameraName: "Manual feeder", privacyMode: "league" })
);

assert(relayManifest.statusCode === 201, `expected relay manifest 201, got ${relayManifest.statusCode}`);
assert(relayManifest.payload.relayManifest.cloudUpload.path === "/api/cameras/relay-uploads", "expected relay upload manifest path");
assert(relayManifest.payload.relayManifest.cloudUpload.optionalJsonFields.includes("clipObjectKey"), "expected private clip object-key contract");
assert(relayManifest.payload.relayManifest.localSecrets.boundary === "keep-inside-user-relay", "expected local-only relay secret boundary");
assert(!JSON.stringify(relayManifest.payload.relayManifest).includes("admin:pass"), "expected manifest to avoid camera credentials");
assert(relayUpload.statusCode === 202, `expected relay upload 202, got ${relayUpload.statusCode}`);
assert(relayUpload.payload.relayUpload.media.access === "signed-url-required", "expected signed-only media access contract");
assert(clipIngest.statusCode === 201, `expected clip ingest 201, got ${clipIngest.statusCode}`);

const replayedRelayUpload = await call(
  relayUploads,
  post(
    {
      userId,
      providerId: "reolink",
      deviceId: device.id,
      relayId: relay.relayId,
      motionEventId,
      privacyMode: "private",
      durationSeconds: 12
    },
    { "x-flock-relay-signature": `demo-${device.id}-${motionEventId}` }
  )
);
const unregisteredRelayUpload = await call(
  relayUploads,
  post(
    {
      userId,
      providerId: "reolink",
      deviceId: "device-not-registered",
      relayId: relay.relayId,
      motionEventId: "motion-unregistered",
      privacyMode: "private"
    },
    { "x-flock-relay-signature": "demo-device-not-registered-motion-unregistered" }
  )
);

assert(replayedRelayUpload.statusCode === 200, `expected replayed relay upload 200, got ${replayedRelayUpload.statusCode}`);
assert(replayedRelayUpload.payload.idempotent === true, "expected replayed relay upload to be idempotent");
assert(replayedRelayUpload.payload.relayUpload.uploadId === relayUpload.payload.relayUpload.uploadId, "expected replay to return original upload");
assert(unregisteredRelayUpload.statusCode === 400, "expected unregistered relay upload rejection");

const reviewItem = relayUpload.payload.relayUpload.reviewRecord;
const birdPlan = await call(birdReviews, get({}, "/api/bird-intelligence/reviews"));
const birdAnalysis = await call(
  birdReviews,
  post({
    userId,
    providerId: "reolink",
    reviewItemId: reviewItem.id,
    clipId: reviewItem.clipId,
    sightingId: reviewItem.sightingId,
    privacyMode: "private",
    source: reviewItem.source,
    clip: relayUpload.payload.relayUpload.clip,
    sighting: relayUpload.payload.relayUpload.sighting
  })
);
const birdCorrection = await call(
  birdCorrections,
  post({
    userId,
    analysisId: birdAnalysis.payload.analysis.id,
    reviewItemId: reviewItem.id,
    action: "correct-species",
    species: "Northern cardinal"
  })
);

assert(birdPlan.statusCode === 200, `expected bird intelligence plan 200, got ${birdPlan.statusCode}`);
assert(birdPlan.payload.plan.adapters.length >= 5, "expected bird intelligence adapter plan");
assert(birdAnalysis.statusCode === 202, `expected bird analysis 202, got ${birdAnalysis.statusCode}`);
assert(birdAnalysis.payload.analysis.speciesSuggestions.length > 0, "expected species suggestions");
assert(birdCorrection.statusCode === 200, `expected bird correction 200, got ${birdCorrection.statusCode}`);
assert(birdCorrection.payload.correction.reviewStatus === "approved", "expected approved correction");

const account = await call(accountState, get({ userId }, `/api/cameras/account-state?userId=${userId}`));
const deviceStatus = await call(status, get({ userId, deviceId: device.id, providerId: "reolink" }, `/api/cameras/${device.id}/status?userId=${userId}`));

assert(account.statusCode === 200, `expected account state 200, got ${account.statusCode}`);
assert(account.payload.readiness.status === "mvp-blocked", "expected local smoke readiness to report MVP blockers");
assert(
  account.payload.readiness.blockers.includes("Supabase auth enforced"),
  "expected local smoke readiness to report auth gate"
);
assert(
  account.payload.readiness.checks.some((check) => check.id === "private-clip-storage"),
  "expected account readiness to include private clip storage gate"
);
assert(account.payload.counts.syncSessions === 1, "expected one sync session");
assert(account.payload.counts.connectionRequests === 1, "expected one connection request");
assert(account.payload.counts.devices === 1, "expected one device");
assert(account.payload.counts.relayEnrollments === 1, "expected one relay enrollment");
assert(account.payload.counts.relayManifests === 1, "expected one relay manifest");
assert(account.payload.counts.relayUploads === 1, "expected one relay upload");
assert(account.payload.counts.clipIngests === 1, "expected one clip ingest");
assert(account.payload.counts.reviewItems === 2, "expected two review items");
assert(account.payload.counts.birdAnalyses === 1, "expected one bird analysis");
assert(account.payload.counts.birdCorrections === 1, "expected one bird correction");
assert(
  account.payload.records.reviewItems.find((item) => item.id === reviewItem.id)?.analysisStatus === "corrected",
  "expected corrected review item status"
);
assert(deviceStatus.payload.device.persisted === true, "expected persisted device status");
assert(deviceStatus.payload.device.status === "connected", "expected connected device after relay upload");

const sensitive = await call(syncSessions, post({ userId, providerId: "birdfy", password: "nope" }));
const endpoint = await call(devices, post({ userId, providerId: "reolink", redactedEndpoint: "rtsp://admin:pass@192.168.1.5/stream" }));
const manifestEndpoint = await call(
  cameraAdapters,
  adapterPost("relay-manifests", { userId, providerId: "reolink", deviceId: device.id, relayId: relay.relayId, redactedEndpoint: "rtsp://admin:pass@192.168.1.5/stream" })
);
const cloudManifest = await call(cameraAdapters, adapterPost("relay-manifests", { userId, providerId: "ring", deviceId: device.id, relayId: relay.relayId }));
const sensitiveAnalysis = await call(birdReviews, post({ userId, providerId: "reolink", reviewItemId: reviewItem.id, token: "nope" }));
const sensitivePartner = await call(cameraAdapters, adapterPost("birdfy/partner-request", { userId, providerId: "birdfy", password: "nope" }));
const publicClipUrl = await call(clipIngests, post({ userId, providerId: "manual-upload", deviceId: device.id, cameraName: "Manual feeder", clipUrl: "https://example.test/private.mp4", privacyMode: "private" }));

assert(sensitive.statusCode === 400, "expected sensitive field rejection");
assert(endpoint.statusCode === 400, "expected unredacted endpoint rejection");
assert(manifestEndpoint.statusCode === 400, "expected manifest unredacted endpoint rejection");
assert(cloudManifest.statusCode === 400, "expected relay manifest to reject non-relay provider");
assert(sensitiveAnalysis.statusCode === 400, "expected sensitive bird analysis rejection");
assert(sensitivePartner.statusCode === 400, "expected sensitive partner request rejection");
assert(publicClipUrl.statusCode === 400, "expected public clip URL rejection");

process.env.FLOCK_SESSION_SIGNING_SECRET = "test-session-secret";
const missingHeader = await call(syncSessions, post({ userId: "signed-user", providerId: "birdfy" }));
const signature = createHmac("sha256", process.env.FLOCK_SESSION_SIGNING_SECRET).update("signed-user").digest("hex");
const signed = await call(
  syncSessions,
  post({ providerId: "birdfy" }, { "x-flock-user-id": "signed-user", "x-flock-session-signature": signature })
);

assert(missingHeader.statusCode === 401, "expected signed mode to require x-flock-user-id");
assert(signed.statusCode === 202, `expected signed sync session 202, got ${signed.statusCode}`);
assert(signed.payload.syncSession.storage.authMode === "server-signed", "expected server-signed storage metadata");

process.env.FLOCK_REQUIRE_AUTH = "true";
const authRequired = await call(syncSessions, post({ userId: "unsigned-prod-user", providerId: "birdfy" }));
assert(authRequired.statusCode === 401, `expected auth-required mode to reject unsigned request, got ${authRequired.statusCode}`);

const authStub = await startSupabaseAuthStub({
  "token-owner-a": { id: "supabase-owner-a", email: "owner-a@example.test" },
  "token-owner-b": { id: "supabase-owner-b", email: "owner-b@example.test" }
});
process.env.SUPABASE_URL = authStub.url;
process.env.SUPABASE_PUBLISHABLE_KEY = "smoke-publishable-key";

try {
  const bearerOwnerA = withBearerToken("token-owner-a");
  const bearerOwnerB = withBearerToken("token-owner-b");
  const verifiedRegistration = await call(
    devices,
    post({ providerId: "reolink", privacyMode: "private", redactedEndpoint: "rtsp://[redacted]@camera.local/verified" }, bearerOwnerA)
  );
  const mismatchedClaim = await call(syncSessions, post({ userId: "supabase-owner-b", providerId: "birdfy" }, bearerOwnerA));
  const expiredSession = await call(syncSessions, post({ providerId: "birdfy" }, withBearerToken("expired-token")));
  const verifiedOwnerAState = await call(accountState, { ...get({}, "/api/cameras/account-state"), headers: bearerOwnerA });
  const ownerBState = await call(accountState, { ...get({}, "/api/cameras/account-state"), headers: bearerOwnerB });
  const ownerBRelayUpload = await call(
    relayUploads,
    post(
      {
        providerId: "reolink",
        deviceId: verifiedRegistration.payload.registrationResult.device.id,
        relayId: verifiedRegistration.payload.registrationResult.relay.relayId,
        motionEventId: "cross-account-motion",
        privacyMode: "private"
      },
      { ...bearerOwnerB, "x-flock-relay-signature": `demo-${verifiedRegistration.payload.registrationResult.device.id}-cross-account-motion` }
    )
  );

  assert(verifiedRegistration.statusCode === 201, `expected verified bearer registration 201, got ${verifiedRegistration.statusCode}`);
  assert(verifiedRegistration.payload.registrationResult.device.ownerId === "supabase-owner-a", "expected verified owner ID on device");
  assert(mismatchedClaim.statusCode === 403, `expected mismatched claim rejection 403, got ${mismatchedClaim.statusCode}`);
  assert(expiredSession.statusCode === 401, `expected expired bearer rejection 401, got ${expiredSession.statusCode}`);
  assert(verifiedOwnerAState.statusCode === 200, `expected verified owner state 200, got ${verifiedOwnerAState.statusCode}`);
  assert(verifiedOwnerAState.payload.counts.devices === 1, "expected verified owner to see their device");
  assert(ownerBState.statusCode === 200, `expected second verified owner state 200, got ${ownerBState.statusCode}`);
  assert(ownerBState.payload.counts.devices === 0, "expected cross-account device isolation");
  assert(ownerBRelayUpload.statusCode === 400, "expected cross-account relay upload rejection");
} finally {
  await authStub.close();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
}

delete process.env.FLOCK_REQUIRE_AUTH;

console.log(
  JSON.stringify(
    {
      storeFile: process.env.FLOCK_CAMERA_STORE_FILE,
      counts: account.payload.counts,
      adapterContracts: adapters.payload.adapters.length,
      relayManifestStatus: relayManifest.payload.relayManifest.status,
      deviceStatus: deviceStatus.payload.device.status,
      birdAnalysisStatus: birdAnalysis.payload.analysis.status,
      birdCorrectionStatus: birdCorrection.payload.correction.reviewStatus,
      signedAuthMode: signed.payload.syncSession.storage.authMode,
      authRequiredStatus: authRequired.statusCode,
      bearerAuthCoverage: "valid, expired, mismatched-claim, cross-account"
    },
    null,
    2
  )
);
