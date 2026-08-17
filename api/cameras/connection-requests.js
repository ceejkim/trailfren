const providers = {
  birdfy: { id: "birdfy", name: "Birdfy / Netvue", mode: "partner-request" },
  "bird-buddy": { id: "bird-buddy", name: "Bird Buddy", mode: "partner-request" },
  ring: { id: "ring", name: "Ring", mode: "official-oauth" },
  nest: { id: "nest", name: "Google Nest Cam", mode: "official-oauth" },
  reolink: { id: "reolink", name: "Reolink", mode: "local-relay" },
  tapo: { id: "tapo", name: "Tapo", mode: "local-relay" },
  wyze: { id: "wyze", name: "Wyze supported RTSP models", mode: "local-relay" },
  "manual-upload": { id: "manual-upload", name: "Manual upload", mode: "manual-upload" }
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
        throw new Error(`Sensitive field '${key}' is not accepted by this demo endpoint.`);
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
}

function getProvider(providerId) {
  if (typeof providerId !== "string" || !providers[providerId]) {
    throw new Error("A supported providerId is required.");
  }
  return providers[providerId];
}

function getStatus(mode) {
  if (mode === "official-oauth") return "oauth-started";
  if (mode === "local-relay") return "relay-required";
  if (mode === "partner-request") return "partner-review";
  return "manual-ready";
}

function getCallbackPath(mode, providerId) {
  if (mode === "official-oauth") return `/api/cameras/${providerId}/oauth/callback`;
  if (mode === "local-relay") return `/api/cameras/${providerId}/relay/connect`;
  if (mode === "partner-request") return `/api/cameras/${providerId}/partner-request`;
  return "/api/cameras/manual-upload";
}

function getNextStep(mode, providerName) {
  if (mode === "official-oauth") return `Start official ${providerName} account linking and keep tokens server-side only.`;
  if (mode === "local-relay") return `Install a local Flock relay before any private ${providerName} camera stream can upload clips.`;
  if (mode === "partner-request") return `Queue a ${providerName} partner/export request and keep manual import available until official access exists.`;
  return "Open manual upload and run clips through private review before scoring.";
}

function getPrivacyMode(value) {
  if (value === "friends" || value === "league") return value;
  return "private";
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
    const provider = getProvider(body.providerId);
    const mode = provider.mode;
    const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
    const privacyMode = getPrivacyMode(body.privacyMode);
    const motionUploadsEnabled = body.motionUploadsEnabled !== false;

    return response.status(201).json({
      connectionRequest: {
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
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create camera connection request.";
    return response.status(400).json({ error: message });
  }
}
