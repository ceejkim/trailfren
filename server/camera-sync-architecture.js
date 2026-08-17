import { createHmac, timingSafeEqual } from "node:crypto";

export const cameraProviderRegistry = {
  birdfy: {
    id: "birdfy",
    name: "Birdfy / Netvue",
    category: "Bird camera",
    marketPriority: 1,
    audience: "bird-native",
    mode: "partner-request",
    phase: "partner-export",
    approvalPath: "/api/cameras/birdfy/partner-request",
    adapterPath: "/api/cameras/birdfy/partner-request",
    adapterStatus: "partner-or-export",
    adapterStatusLabel: "Partner/export path",
    transports: ["partner-export", "share-import", "manual-upload"],
    triggerSource: "vendor-cloud-motion",
    uploadPath: "user-approved-export",
    credentialBoundary: "no-flock-passwords",
    requiresLocalRelay: false,
    requiresOAuth: false,
    requiresPartnerAccess: true,
    launchStatus: "partner-or-export",
    checklist: [
      "Do not collect Birdfy account passwords.",
      "Use user-approved exports, share links, email imports, or partner access.",
      "Keep manual upload available until official partner access exists."
    ],
    hardGates: ["Partner API or export access for automatic cloud sync."],
    sourceUrl: "https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/"
  },
  "bird-buddy": {
    id: "bird-buddy",
    name: "Bird Buddy",
    category: "Bird camera",
    marketPriority: 2,
    audience: "bird-native",
    mode: "partner-request",
    phase: "partner-export",
    approvalPath: "/api/cameras/bird-buddy/partner-request",
    adapterPath: "/api/cameras/bird-buddy/partner-request",
    adapterStatus: "partner-or-export",
    adapterStatusLabel: "Partner/export path",
    transports: ["partner-export", "share-import", "manual-upload"],
    triggerSource: "vendor-cloud-motion",
    uploadPath: "user-approved-export",
    credentialBoundary: "no-flock-passwords",
    requiresLocalRelay: false,
    requiresOAuth: false,
    requiresPartnerAccess: true,
    launchStatus: "partner-or-export",
    checklist: [
      "Do not collect Bird Buddy account passwords.",
      "Use user-approved exports, share links, email imports, or partner access.",
      "Keep manual upload available until official partner access exists."
    ],
    hardGates: ["Partner access or explicit export/import permission for automatic cloud sync."],
    sourceUrl: "https://support.mybirdbuddy.com/hc/en-us/articles/9175854254865-Postcards-Collecting-Photos-and-Videos"
  },
  reolink: {
    id: "reolink",
    name: "Reolink",
    category: "RTSP / ONVIF",
    marketPriority: 3,
    audience: "popular-local-camera",
    mode: "local-relay",
    phase: "local-relay",
    approvalPath: "/api/cameras/devices",
    adapterPath: "/api/cameras/devices",
    adapterStatus: "relay-required",
    adapterStatusLabel: "Local relay ready",
    transports: ["rtsp", "onvif"],
    triggerSource: "relay-motion-or-onvif",
    uploadPath: "signed-relay-upload",
    credentialBoundary: "relay-only",
    requiresLocalRelay: true,
    requiresOAuth: false,
    requiresPartnerAccess: false,
    launchStatus: "first-real-ingestion-target",
    checklist: [
      "Register a user-owned camera device record.",
      "Run the relay on the same local network as the camera.",
      "Accept only signed relay uploads from that device."
    ],
    hardGates: ["Real camera username/password must stay in the user-owned relay."],
    sourceUrl: "https://support.reolink.com/articles/900000617826-Which-Reolink-Products-Support-CGI-RTSP-ONVIF/"
  },
  tapo: {
    id: "tapo",
    name: "Tapo",
    category: "RTSP / ONVIF",
    marketPriority: 4,
    audience: "popular-local-camera",
    mode: "local-relay",
    phase: "local-relay",
    approvalPath: "/api/cameras/devices",
    adapterPath: "/api/cameras/devices",
    adapterStatus: "relay-required",
    adapterStatusLabel: "Local relay ready",
    transports: ["rtsp", "onvif"],
    triggerSource: "relay-motion-or-onvif",
    uploadPath: "signed-relay-upload",
    credentialBoundary: "relay-only",
    requiresLocalRelay: true,
    requiresOAuth: false,
    requiresPartnerAccess: false,
    launchStatus: "first-real-ingestion-target",
    checklist: [
      "Register a user-owned camera device record.",
      "Run the relay on the same local network as the camera.",
      "Accept only signed relay uploads from that device."
    ],
    hardGates: ["Real camera account and RTSP URL must stay in the user-owned relay."],
    sourceUrl: "https://www.tp-link.com/us/support/faq/2680/"
  },
  wyze: {
    id: "wyze",
    name: "Wyze supported RTSP models",
    category: "RTSP / model-specific",
    marketPriority: 5,
    audience: "popular-local-camera",
    mode: "local-relay",
    phase: "local-relay",
    approvalPath: "/api/cameras/devices",
    adapterPath: "/api/cameras/wyze/model-check",
    adapterStatus: "model-check-required",
    adapterStatusLabel: "RTSP model check",
    transports: ["rtsp"],
    triggerSource: "relay-motion",
    uploadPath: "signed-relay-upload",
    credentialBoundary: "relay-only",
    requiresLocalRelay: true,
    requiresOAuth: false,
    requiresPartnerAccess: false,
    launchStatus: "model-check-required",
    checklist: [
      "Confirm the user's Wyze model and firmware explicitly support RTSP.",
      "Run the relay on the same local network as the camera.",
      "Accept only signed relay uploads from that device."
    ],
    hardGates: ["Unsupported Wyze models fall back to manual upload."],
    sourceUrl: "https://support.wyze.com/hc/en-us/articles/360026245231-Wyze-Cam-RTSP"
  },
  ring: {
    id: "ring",
    name: "Ring",
    category: "Security camera",
    marketPriority: 6,
    audience: "popular-cloud-camera",
    mode: "official-oauth",
    phase: "official-cloud",
    approvalPath: "/api/cameras/ring/oauth/start",
    adapterPath: "/api/cameras/ring/oauth/start",
    adapterStatus: "vendor-setup-required",
    adapterStatusLabel: "Official API setup required",
    transports: ["vendor-webhook", "vendor-clip"],
    triggerSource: "vendor-motion-webhook",
    uploadPath: "official-cloud-import",
    credentialBoundary: "server-oauth-only",
    requiresLocalRelay: false,
    requiresOAuth: true,
    requiresPartnerAccess: false,
    launchStatus: "vendor-setup-required",
    checklist: [
      "Open the official Ring approval screen after developer setup.",
      "Store OAuth tokens server-side only.",
      "Accept motion webhooks only after signature verification."
    ],
    hardGates: ["Ring developer setup, OAuth credentials, webhook verification, and certification."],
    sourceUrl: "https://developer.amazon.com/docs/ring/api-documentation.html"
  },
  nest: {
    id: "nest",
    name: "Google Nest Cam",
    category: "Security camera",
    marketPriority: 7,
    audience: "popular-cloud-camera",
    mode: "official-oauth",
    phase: "official-cloud",
    approvalPath: "/api/cameras/nest/oauth/start",
    adapterPath: "/api/cameras/nest/oauth/start",
    adapterStatus: "vendor-setup-required",
    adapterStatusLabel: "Device Access setup required",
    transports: ["vendor-event", "webrtc"],
    triggerSource: "device-access-motion-event",
    uploadPath: "official-cloud-import",
    credentialBoundary: "server-oauth-only",
    requiresLocalRelay: false,
    requiresOAuth: true,
    requiresPartnerAccess: false,
    launchStatus: "vendor-setup-required",
    checklist: [
      "Open the Google Device Access approval screen after project setup.",
      "Store OAuth tokens server-side only.",
      "Accept motion events through official Device Access scopes."
    ],
    hardGates: ["Google Device Access setup, OAuth credentials, supported camera traits, and review."],
    sourceUrl: "https://developers.google.com/nest/device-access/api/camera-wired"
  },
  "manual-upload": {
    id: "manual-upload",
    name: "Manual upload",
    category: "Fallback",
    marketPriority: 99,
    audience: "universal",
    mode: "manual-upload",
    phase: "manual",
    approvalPath: "/api/cameras/clip-ingests",
    adapterPath: "/api/cameras/clip-ingests",
    adapterStatus: "available-now",
    adapterStatusLabel: "Available now",
    transports: ["manual-upload"],
    triggerSource: "user-upload",
    uploadPath: "manual-clip-review",
    credentialBoundary: "none",
    requiresLocalRelay: false,
    requiresOAuth: false,
    requiresPartnerAccess: false,
    launchStatus: "available-now",
    checklist: ["Open manual clip upload.", "Default clips to private review.", "Run the same bird scoring pipeline after review."],
    hardGates: [],
    sourceUrl: "docs/camera-ingestion-design.md"
  }
};

export const commonCameraWatchlist = [
  {
    id: "feathersnap",
    name: "FeatherSnap",
    category: "Bird camera",
    likelyPath: "partner-export",
    reason: "Bird-native smart feeder category; add after official access/export terms are confirmed."
  },
  {
    id: "green-feathers",
    name: "Green Feathers",
    category: "Bird box / nature camera",
    likelyPath: "local-relay",
    reason: "Common bird-box ecosystem; evaluate RTSP/ONVIF or NVR compatibility model by model."
  },
  {
    id: "eufy",
    name: "Eufy",
    category: "Security camera",
    likelyPath: "manual-or-official-only",
    reason: "Popular consumer camera ecosystem; avoid unofficial cloud access unless official integration is available."
  },
  {
    id: "arlo",
    name: "Arlo",
    category: "Security camera",
    likelyPath: "manual-or-official-only",
    reason: "Popular consumer camera ecosystem; requires official API/access review before automation."
  },
  {
    id: "blink",
    name: "Blink",
    category: "Security camera",
    likelyPath: "manual-or-official-only",
    reason: "Popular low-cost outdoor camera ecosystem; do not rely on private app automation."
  }
];

export const rarityPoints = {
  Common: 10,
  Uncommon: 25,
  Rare: 60,
  Legendary: 150
};

export function createId(prefix) {
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${randomPart}`;
}

export function getBody(request) {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      throw new Error("Request body must be valid JSON.");
    }
  }

  if (!request.body || typeof request.body !== "object") return {};
  return request.body;
}

export function getHeader(request, name) {
  const value = request.headers?.[name.toLowerCase()] ?? request.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}

export function rejectSecretFields(payload) {
  const forbidden = ["password", "secret", "token", "apikey", "api_key", "refresh"];
  const stack = [payload];

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item || typeof item !== "object") continue;
    for (const [key, value] of Object.entries(item)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z_]/g, "");
      if (forbidden.some((word) => normalizedKey.includes(word))) {
        throw new Error(`Sensitive field '${key}' is not accepted by this endpoint.`);
      }
      if (typeof value === "string" && /rtsp:\/\/|onvif:\/\//i.test(value) && !value.includes("[redacted]")) {
        throw new Error("Private camera endpoints must stay inside the local relay.");
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
}

export function rejectUnredactedEndpoint(value) {
  if (typeof value !== "string" || !value.trim()) return;
  const looksLikePrivateEndpoint = value.includes("://") || value.includes("@");
  if (looksLikePrivateEndpoint && !value.includes("[redacted]")) {
    throw new Error("Only redacted endpoint labels are accepted. Keep real RTSP/ONVIF URLs inside the local relay.");
  }
}

export function getProvider(providerId) {
  if (typeof providerId !== "string" || !cameraProviderRegistry[providerId]) {
    throw new Error("A supported providerId is required.");
  }
  return cameraProviderRegistry[providerId];
}

export function getPrivacyMode(value) {
  if (value === "friends" || value === "league") return value;
  return "private";
}

export function getConnectionStatus(provider) {
  if (provider.mode === "local-relay") return "needs-relay";
  if (provider.mode === "official-oauth") return "needs-oauth";
  if (provider.mode === "partner-request") return "partner-review";
  return "manual-ready";
}

export function getSyncSessionStatus(provider) {
  if (provider.mode === "local-relay") return "device-registration-required";
  if (provider.mode === "official-oauth") return "approval-required";
  if (provider.mode === "partner-request") return "export-approval-required";
  return "manual-ready";
}

export function getTransport(provider) {
  if (provider.mode === "local-relay") return provider.transports.includes("onvif") ? "onvif" : "rtsp";
  if (provider.mode === "official-oauth") return "cloud-oauth";
  if (provider.mode === "partner-request") return "partner-export";
  return "manual-upload";
}

export function getConnectionRequestStatus(provider) {
  if (provider.mode === "official-oauth") return "oauth-started";
  if (provider.mode === "local-relay") return "relay-required";
  if (provider.mode === "partner-request") return "partner-review";
  return "manual-ready";
}

export function getConnectionCallbackPath(provider) {
  if (provider.mode === "official-oauth") return `/api/cameras/${provider.id}/oauth/callback`;
  if (provider.mode === "local-relay") return `/api/cameras/${provider.id}/relay/connect`;
  if (provider.mode === "partner-request") return `/api/cameras/${provider.id}/partner-request`;
  return "/api/cameras/manual-upload";
}

export function getProviderNextStep(provider) {
  if (provider.mode === "official-oauth") return `Start official ${provider.name} account linking and keep tokens server-side only.`;
  if (provider.mode === "local-relay") return `Install a local Flock relay before any private ${provider.name} camera stream can upload clips.`;
  if (provider.mode === "partner-request") return `Queue a ${provider.name} partner/export request and keep manual import available until official access exists.`;
  return "Open manual upload and run clips through private review before scoring.";
}

export function createSyncSession(body) {
  const provider = getProvider(body.providerId);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 30);

  return {
    id: createId("sync"),
    userId: typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user",
    providerId: provider.id,
    providerName: provider.name,
    mode: provider.mode,
    status: getSyncSessionStatus(provider),
    approvalPath: provider.approvalPath,
    privacyMode: getPrivacyMode(body.privacyMode),
    motionUploadsEnabled: body.motionUploadsEnabled !== false,
    deviceRegistrationRequired: provider.requiresLocalRelay,
    relayRequired: provider.requiresLocalRelay,
    oauthRequired: provider.requiresOAuth,
    partnerAccessRequired: provider.requiresPartnerAccess,
    checklist: provider.checklist,
    architecture: {
      triggerSource: provider.triggerSource,
      uploadPath: provider.uploadPath,
      credentialBoundary: provider.credentialBoundary,
      transports: provider.transports,
      launchStatus: provider.launchStatus,
      adapterPath: provider.adapterPath,
      adapterStatus: provider.adapterStatus,
      adapterStatusLabel: provider.adapterStatusLabel,
      hardGates: provider.hardGates,
      sourceUrl: provider.sourceUrl
    },
    storage: {
      mode: "unpersisted-builder",
      next: "route handlers attach account-scoped persistence before returning sync sessions"
    },
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}

export function createConnectionRequest(body) {
  const provider = getProvider(body.providerId);
  return {
    id: createId("conn"),
    userId: typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user",
    providerId: provider.id,
    providerName: provider.name,
    mode: provider.mode,
    status: getConnectionRequestStatus(provider),
    requestedAt: new Date().toISOString(),
    privacyMode: getPrivacyMode(body.privacyMode),
    motionUploadsEnabled: body.motionUploadsEnabled !== false,
    nextStep: getProviderNextStep(provider),
    callbackPath: getConnectionCallbackPath(provider)
  };
}

export function createDeviceRegistration(body) {
  const provider = getProvider(body.providerId);
  rejectUnredactedEndpoint(body.redactedEndpoint);

  const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
  const displayName = typeof body.displayName === "string" && body.displayName.trim() ? body.displayName : `${provider.name} feeder`;
  const locationLabel = typeof body.locationLabel === "string" && body.locationLabel.trim() ? body.locationLabel : "Private backyard";
  const privacyMode = getPrivacyMode(body.privacyMode);
  const motionOnly = body.motionUploadsEnabled !== false;
  const deviceId = createId("device");
  const relayId = provider.requiresLocalRelay ? createId("relay") : undefined;
  const device = {
    id: deviceId,
    ownerId: userId,
    providerId: provider.id,
    providerName: provider.name,
    displayName,
    locationLabel,
    privacyMode,
    connectionStatus: getConnectionStatus(provider),
    transport: getTransport(provider),
    motionOnly,
    redactedEndpoint: provider.requiresLocalRelay ? body.redactedEndpoint || "rtsp://[redacted]@camera.local/stream" : undefined,
    relayId,
    registeredAt: new Date().toISOString()
  };
  const relay = relayId
    ? {
        relayId,
        deviceId,
        uploadUrl: "/api/cameras/relay-uploads",
        healthUrl: `/api/cameras/${deviceId}/status`,
        signatureHeader: "x-flock-relay-signature",
        signingKeyStatus: process.env.FLOCK_RELAY_SIGNING_SECRET ? "server-secret-required" : "demo-required",
        signatureFormat: process.env.FLOCK_RELAY_SIGNING_SECRET
          ? "sha256=<hmac(deviceId.relayId.motionEventId)>"
          : "demo-<deviceId>-<motionEventId>",
        instructions: provider.checklist
      }
    : undefined;

  return {
    device,
    relay,
    reviewMessage: getRegistrationMessage(provider)
  };
}

export function getRegistrationMessage(provider) {
  if (provider.mode === "local-relay") {
    return `Registered ${provider.name} as a local-relay device. Camera credentials stay in the relay, and only signed motion uploads reach Flock.`;
  }
  if (provider.mode === "official-oauth") {
    return `Prepared ${provider.name} device ownership record for official account linking. Tokens must be stored server-side after approval.`;
  }
  if (provider.mode === "partner-request") {
    return `Prepared ${provider.name} import record. Flock will use user-approved exports or partner access, not private app credentials.`;
  }
  return "Prepared manual upload source for private review and scoring.";
}

export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function createClipIngestResult(body) {
  const provider = getProvider(body.providerId);
  const privacyMode = getPrivacyMode(body.privacyMode);
  const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : 18;
  const bird = provider.audience === "bird-native" ? "Tufted titmouse" : "Downy woodpecker";
  const rarity = provider.audience === "bird-native" ? "Uncommon" : "Rare";
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
      capturedAt: body.capturedAt || "Just now",
      imageUrl: thumbnailUrl,
      duration: formatDuration(durationSeconds),
      confidence: 82,
      motionOnly: true,
      owner: typeof body.userId === "string" && body.userId.trim() ? body.userId : "Charlie",
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
  };
}

export function createRelayUploadResult(body) {
  const provider = getProvider(body.providerId);
  const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
  const deviceId = typeof body.deviceId === "string" && body.deviceId.trim() ? body.deviceId : "device-demo";
  const relayId = typeof body.relayId === "string" && body.relayId.trim() ? body.relayId : "relay-demo";
  const motionEventId = typeof body.motionEventId === "string" && body.motionEventId.trim() ? body.motionEventId : createId("motion");
  const privacyMode = getPrivacyMode(body.privacyMode);
  const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : 14;
  const cameraName = typeof body.cameraName === "string" && body.cameraName.trim() ? body.cameraName : `${provider.name} feeder`;
  const thumbnailUrl =
    typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()
      ? body.thumbnailUrl
      : "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1000&q=80";
  const bird = provider.audience === "bird-native" ? "Tufted titmouse" : "Northern cardinal";
  const rarity = "Uncommon";
  const points = rarityPoints[rarity];

  return {
    uploadId: createId("upload"),
    status: "needs-review",
    deviceId,
    relayId,
    motionEventId,
    acceptedAt: new Date().toISOString(),
    architecture: {
      triggerSource: provider.triggerSource,
      uploadPath: provider.uploadPath,
      credentialBoundary: provider.credentialBoundary,
      signatureMode: process.env.FLOCK_RELAY_SIGNING_SECRET ? "server-hmac" : "demo-prefix"
    },
    clip: {
      id: createId("clip"),
      cameraName,
      bird,
      rarity,
      location: "Private backyard",
      capturedAt: body.capturedAt || "Just now",
      imageUrl: thumbnailUrl,
      duration: formatDuration(durationSeconds),
      confidence: 79,
      motionOnly: true,
      owner: userId === "demo-user" ? "Charlie" : userId,
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
    reviewMessage: `Accepted signed relay upload ${motionEventId} from ${cameraName} as a ${privacyMode} item pending review.`
  };
}

export function getRelaySignatureError(request, body) {
  const signature = getHeader(request, "x-flock-relay-signature");
  if (typeof signature !== "string" || !signature.trim()) {
    return "Relay upload signature is required.";
  }

  if (process.env.FLOCK_RELAY_SIGNING_SECRET) {
    const payload = `${body.deviceId}.${body.relayId}.${body.motionEventId}`;
    const expected = `sha256=${createHmac("sha256", process.env.FLOCK_RELAY_SIGNING_SECRET).update(payload).digest("hex")}`;
    if (!safeEqual(signature, expected)) {
      return "Relay upload signature did not match the server-held relay signing secret.";
    }
    return null;
  }

  const expectedPrefix = `demo-${body.deviceId}-${body.motionEventId}`;
  if (!signature.startsWith(expectedPrefix)) {
    return "Relay upload signature did not match the demo device and motion event.";
  }

  return null;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
