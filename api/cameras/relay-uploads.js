const providers = {
  birdfy: { id: "birdfy", name: "Birdfy / Netvue" },
  "bird-buddy": { id: "bird-buddy", name: "Bird Buddy" },
  ring: { id: "ring", name: "Ring" },
  nest: { id: "nest", name: "Google Nest Cam" },
  reolink: { id: "reolink", name: "Reolink" },
  tapo: { id: "tapo", name: "Tapo" },
  wyze: { id: "wyze", name: "Wyze supported RTSP models" },
  "manual-upload": { id: "manual-upload", name: "Manual upload" }
};

const rarityPoints = {
  Common: 10,
  Uncommon: 25,
  Rare: 60,
  Legendary: 150
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

function getHeader(request, name) {
  const value = request.headers?.[name.toLowerCase()] ?? request.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
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

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function requireDemoSignature(request, body) {
  const signature = getHeader(request, "x-flock-relay-signature");
  if (typeof signature !== "string" || !signature.trim()) {
    return "Relay upload signature is required.";
  }

  const expectedPrefix = `demo-${body.deviceId}-${body.motionEventId}`;
  if (!signature.startsWith(expectedPrefix)) {
    return "Relay upload signature did not match the demo device and motion event.";
  }

  return null;
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
    const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user";
    const deviceId = typeof body.deviceId === "string" && body.deviceId.trim() ? body.deviceId : "device-demo";
    const relayId = typeof body.relayId === "string" && body.relayId.trim() ? body.relayId : "relay-demo";
    const motionEventId = typeof body.motionEventId === "string" && body.motionEventId.trim() ? body.motionEventId : createId("motion");
    const signatureError = requireDemoSignature(request, { deviceId, motionEventId });

    if (signatureError) {
      return response.status(401).json({ error: signatureError, status: "signature-required" });
    }

    const privacyMode = getPrivacyMode(body.privacyMode);
    const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : 14;
    const cameraName = typeof body.cameraName === "string" && body.cameraName.trim() ? body.cameraName : `${provider.name} feeder`;
    const thumbnailUrl =
      typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()
        ? body.thumbnailUrl
        : "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1000&q=80";
    const bird = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Tufted titmouse" : "Northern cardinal";
    const rarity = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Uncommon" : "Uncommon";
    const points = rarityPoints[rarity];

    return response.status(202).json({
      relayUpload: {
        uploadId: createId("upload"),
        status: "needs-review",
        deviceId,
        relayId,
        motionEventId,
        acceptedAt: new Date().toISOString(),
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
        reviewMessage: `Accepted signed relay upload ${motionEventId} from ${cameraName} for private ${privacyMode} review.`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to accept relay upload.";
    return response.status(400).json({ error: message });
  }
}
