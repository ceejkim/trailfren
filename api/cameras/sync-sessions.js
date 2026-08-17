const providers = {
  birdfy: {
    id: "birdfy",
    name: "Birdfy / Netvue",
    mode: "partner-request",
    approvalPath: "/api/cameras/birdfy/partner-request"
  },
  "bird-buddy": {
    id: "bird-buddy",
    name: "Bird Buddy",
    mode: "partner-request",
    approvalPath: "/api/cameras/bird-buddy/partner-request"
  },
  ring: {
    id: "ring",
    name: "Ring",
    mode: "official-oauth",
    approvalPath: "/api/cameras/ring/oauth/start"
  },
  nest: {
    id: "nest",
    name: "Google Nest Cam",
    mode: "official-oauth",
    approvalPath: "/api/cameras/nest/oauth/start"
  },
  reolink: {
    id: "reolink",
    name: "Reolink",
    mode: "local-relay",
    approvalPath: "/api/cameras/devices"
  },
  tapo: {
    id: "tapo",
    name: "Tapo",
    mode: "local-relay",
    approvalPath: "/api/cameras/devices"
  },
  wyze: {
    id: "wyze",
    name: "Wyze supported RTSP models",
    mode: "local-relay",
    approvalPath: "/api/cameras/devices"
  },
  "manual-upload": {
    id: "manual-upload",
    name: "Manual upload",
    mode: "manual-upload",
    approvalPath: "/api/cameras/clip-ingests"
  }
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
      if (typeof value === "string" && /rtsp:\/\/|onvif:\/\//i.test(value)) {
        throw new Error("Private camera endpoints must stay inside the local relay.");
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

function getPrivacyMode(value) {
  if (value === "friends" || value === "league") return value;
  return "private";
}

function getStatus(provider) {
  if (provider.mode === "local-relay") return "device-registration-required";
  if (provider.mode === "official-oauth") return "approval-required";
  if (provider.mode === "partner-request") return "export-approval-required";
  return "manual-ready";
}

function getChecklist(provider) {
  if (provider.mode === "official-oauth") {
    return [
      "Open the official vendor approval screen.",
      "Store OAuth tokens server-side only after credentials are configured.",
      "Accept motion webhooks only after signature verification."
    ];
  }
  if (provider.mode === "local-relay") {
    return [
      "Register a user-owned camera device record.",
      "Run the relay on the same local network as the camera.",
      "Accept only signed relay uploads from that device."
    ];
  }
  if (provider.mode === "partner-request") {
    return [
      "Do not collect vendor account passwords.",
      "Use user-approved exports, share links, email imports, or partner access.",
      "Keep manual upload available until official partner access exists."
    ];
  }
  return ["Open manual clip upload.", "Default clips to private review.", "Run the same bird scoring pipeline after review."];
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
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 30);
    const session = {
      id: createId("sync"),
      userId: typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user",
      providerId: provider.id,
      providerName: provider.name,
      mode: provider.mode,
      status: getStatus(provider),
      approvalPath: provider.approvalPath,
      privacyMode: getPrivacyMode(body.privacyMode),
      motionUploadsEnabled: body.motionUploadsEnabled !== false,
      deviceRegistrationRequired: provider.mode === "local-relay",
      relayRequired: provider.mode === "local-relay",
      oauthRequired: provider.mode === "official-oauth",
      partnerAccessRequired: provider.mode === "partner-request",
      checklist: getChecklist(provider),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    return response.status(202).json({ syncSession: session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create camera sync session.";
    return response.status(400).json({ error: message });
  }
}
