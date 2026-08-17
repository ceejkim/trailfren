import { createHmac } from "node:crypto";

import birdCorrections from "../api/bird-intelligence/corrections.js";
import birdReviews from "../api/bird-intelligence/reviews.js";
import accountState from "../api/cameras/account-state.js";
import birdBuddyPartnerRequest from "../api/cameras/bird-buddy/partner-request.js";
import birdfyPartnerRequest from "../api/cameras/birdfy/partner-request.js";
import clipIngests from "../api/cameras/clip-ingests.js";
import connectionRequests from "../api/cameras/connection-requests.js";
import devices from "../api/cameras/devices.js";
import nestEvents from "../api/cameras/nest/events.js";
import nestOAuthStart from "../api/cameras/nest/oauth/start.js";
import providerAdapters from "../api/cameras/provider-adapters.js";
import relayUploads from "../api/cameras/relay-uploads.js";
import ringOAuthStart from "../api/cameras/ring/oauth/start.js";
import ringWebhooks from "../api/cameras/ring/webhooks.js";
import syncSessions from "../api/cameras/sync-sessions.js";
import wyzeModelCheck from "../api/cameras/wyze/model-check.js";
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const userId = `camera-smoke-${Date.now()}`;
const sync = await call(syncSessions, post({ userId, providerId: "birdfy", privacyMode: "private" }));
const connection = await call(connectionRequests, post({ userId, providerId: "birdfy", privacyMode: "friends" }));
const registration = await call(
  devices,
  post({ userId, providerId: "reolink", privacyMode: "private", redactedEndpoint: "rtsp://[redacted]@camera.local/stream" })
);
const adapters = await call(providerAdapters, get({}, "/api/cameras/provider-adapters"));
const ringStart = await call(ringOAuthStart, get({ userId }, "/api/cameras/ring/oauth/start"));
const ringWebhook = await call(ringWebhooks, post({ userId, providerId: "ring", eventType: "motion" }));
const nestStart = await call(nestOAuthStart, get({ userId }, "/api/cameras/nest/oauth/start"));
const nestEvent = await call(nestEvents, post({ userId, providerId: "nest", eventType: "cameraMotion" }));
const birdfyPartner = await call(birdfyPartnerRequest, post({ userId, providerId: "birdfy", importMode: "share-import" }));
const birdBuddyPartner = await call(
  birdBuddyPartnerRequest,
  post({ userId, providerId: "bird-buddy", importMode: "postcard-export" })
);
const wyzeSupported = await call(wyzeModelCheck, post({ userId, model: "Wyze Cam v3" }));
const wyzeUnsupported = await call(wyzeModelCheck, post({ userId, model: "Wyze Cam Outdoor" }));

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
  adapters.payload.envChecklist.requirements.some((requirement) => requirement.name === "FLOCK_SESSION_SIGNING_SECRET"),
  "expected signed account ownership env checklist"
);
assert(
  adapters.payload.envChecklist.missingRequired.includes("FLOCK_SESSION_SIGNING_SECRET"),
  "expected unsigned preview mode to report account signing gate"
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
      durationSeconds: 12
    },
    { "x-flock-relay-signature": `demo-${device.id}-${motionEventId}` }
  )
);
const clipIngest = await call(
  clipIngests,
  post({ userId, providerId: "manual-upload", deviceId: device.id, cameraName: "Manual feeder", privacyMode: "league" })
);

assert(relayUpload.statusCode === 202, `expected relay upload 202, got ${relayUpload.statusCode}`);
assert(clipIngest.statusCode === 201, `expected clip ingest 201, got ${clipIngest.statusCode}`);

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
assert(account.payload.counts.syncSessions === 1, "expected one sync session");
assert(account.payload.counts.connectionRequests === 1, "expected one connection request");
assert(account.payload.counts.devices === 1, "expected one device");
assert(account.payload.counts.relayEnrollments === 1, "expected one relay enrollment");
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
const sensitiveAnalysis = await call(birdReviews, post({ userId, providerId: "reolink", reviewItemId: reviewItem.id, token: "nope" }));
const sensitivePartner = await call(birdfyPartnerRequest, post({ userId, providerId: "birdfy", password: "nope" }));

assert(sensitive.statusCode === 400, "expected sensitive field rejection");
assert(endpoint.statusCode === 400, "expected unredacted endpoint rejection");
assert(sensitiveAnalysis.statusCode === 400, "expected sensitive bird analysis rejection");
assert(sensitivePartner.statusCode === 400, "expected sensitive partner request rejection");

process.env.FLOCK_SESSION_SIGNING_SECRET = "test-session-secret";
const missingHeader = await call(syncSessions, post({ userId: "signed-user", providerId: "birdfy" }));
const signature = createHmac("sha256", process.env.FLOCK_SESSION_SIGNING_SECRET).update("signed-user").digest("hex");
const signed = await call(
  syncSessions,
  post({ providerId: "birdfy" }, { "x-flock-user-id": "signed-user", "x-flock-session-signature": signature })
);

assert(missingHeader.statusCode === 400, "expected signed mode to require x-flock-user-id");
assert(signed.statusCode === 202, `expected signed sync session 202, got ${signed.statusCode}`);
assert(signed.payload.syncSession.storage.authMode === "server-signed", "expected server-signed storage metadata");

console.log(
  JSON.stringify(
    {
      storeFile: process.env.FLOCK_CAMERA_STORE_FILE,
      counts: account.payload.counts,
      adapterContracts: adapters.payload.adapters.length,
      deviceStatus: deviceStatus.payload.device.status,
      birdAnalysisStatus: birdAnalysis.payload.analysis.status,
      birdCorrectionStatus: birdCorrection.payload.correction.reviewStatus,
      signedAuthMode: signed.payload.syncSession.storage.authMode
    },
    null,
    2
  )
);
