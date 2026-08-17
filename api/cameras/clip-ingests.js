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

function getPrivacyMode(value) {
  if (value === "friends" || value === "league") return value;
  return "private";
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
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
    const privacyMode = getPrivacyMode(body.privacyMode);
    const durationSeconds = typeof body.durationSeconds === "number" ? body.durationSeconds : 18;
    const bird = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Tufted titmouse" : "Downy woodpecker";
    const rarity = provider.id === "birdfy" || provider.id === "bird-buddy" ? "Uncommon" : "Rare";
    const points = rarityPoints[rarity];
    const cameraName = typeof body.cameraName === "string" && body.cameraName.trim() ? body.cameraName : `${provider.name} feeder`;
    const thumbnailUrl =
      typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()
        ? body.thumbnailUrl
        : "https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1000&q=80";

    return response.status(201).json({
      ingestResult: {
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
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to ingest camera clip.";
    return response.status(400).json({ error: message });
  }
}
