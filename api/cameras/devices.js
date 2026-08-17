const providers = {
  birdfy: { id: "birdfy", name: "Birdfy / Netvue", phase: "partner-export" },
  "bird-buddy": { id: "bird-buddy", name: "Bird Buddy", phase: "partner-export" },
  ring: { id: "ring", name: "Ring", phase: "official-cloud" },
  nest: { id: "nest", name: "Google Nest Cam", phase: "official-cloud" },
  reolink: { id: "reolink", name: "Reolink", phase: "local-relay" },
  tapo: { id: "tapo", name: "Tapo", phase: "local-relay" },
  wyze: { id: "wyze", name: "Wyze supported RTSP models", phase: "local-relay" },
  "manual-upload": { id: "manual-upload", name: "Manual upload", phase: "manual" }
};

function createId(prefix) {
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${randomPart}`;
}

function getBody(request) {
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

function rejectSecretFields(payload) {
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
      if (value && typeof value === "object") stack.push(value);
    }
  }
}

function rejectUnredactedEndpoint(value) {
  if (typeof value !== "string" || !value.trim()) return;
  const looksLikePrivateEndpoint = value.includes("://") || value.includes("@");
  if (looksLikePrivateEndpoint && !value.includes("[redacted]")) {
    throw new Error("Only redacted endpoint labels are accepted. Keep real RTSP/ONVIF URLs inside the local relay.");
  }
}

function getProvider(providerId) {
  if (typeof providerId !== "string" || !providers[providerId]) {
    throw new Error("A supported providerId is required.");
  }
  return providers[providerId];
}

function getPrivacyMode(value) {
  if (value === "friends" || value === "league") return value;
  return "private";
}

function getConnectionStatus(provider) {
  if (provider.phase === "local-relay") return "needs-relay";
  if (provider.phase === "official-cloud") return "needs-oauth";
  if (provider.phase === "partner-export") return "partner-review";
  return "manual-ready";
}

function getTransport(provider) {
  if (provider.phase === "local-relay") return "rtsp";
  if (provider.phase === "official-cloud") return "cloud-oauth";
  if (provider.phase === "partner-export") return "partner-export";
  return "manual-upload";
}

function getReviewMessage(provider) {
  if (provider.phase === "local-relay") {
    return `Registered ${provider.name} as a local-relay device. Camera credentials stay in the relay, and only signed motion uploads reach Flock.`;
  }
  if (provider.phase === "official-cloud") {
    return `Prepared ${provider.name} device ownership record for official account linking. Tokens must be stored server-side after approval.`;
  }
  if (provider.phase === "partner-export") {
    return `Prepared ${provider.name} import record. Flock will use user-approved exports or partner access, not private app credentials.`;
  }
  return "Prepared manual upload source for private review and scoring.";
}

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    rejectUnredactedEndpoint(body.redactedEndpoint);

    const provider = getProvider(body.providerId);
    const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
    const displayName = typeof body.displayName === "string" && body.displayName.trim() ? body.displayName : `${provider.name} feeder`;
    const locationLabel = typeof body.locationLabel === "string" && body.locationLabel.trim() ? body.locationLabel : "Private backyard";
    const privacyMode = getPrivacyMode(body.privacyMode);
    const motionOnly = body.motionUploadsEnabled !== false;
    const deviceId = createId("device");
    const relayId = provider.phase === "local-relay" ? createId("relay") : undefined;
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
      redactedEndpoint: provider.phase === "local-relay" ? body.redactedEndpoint || "rtsp://[redacted]@camera.local/stream" : undefined,
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
          signingKeyStatus: "demo-required",
          instructions: [
            "Run the relay on the same local network as the camera.",
            "Keep RTSP/ONVIF credentials inside the relay, not in the browser.",
            "Upload only signed motion metadata, thumbnails, and clips to Flock."
          ]
        }
      : undefined;

    return response.status(201).json({
      registrationResult: {
        device,
        relay,
        reviewMessage: getReviewMessage(provider)
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register camera device.";
    return response.status(400).json({ error: message });
  }
}
