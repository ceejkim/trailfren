import {
  createId,
  formatDuration,
  getBody,
  getPrivacyMode,
  getProvider,
  getRelaySignatureError,
  rarityPoints,
  rejectSecretFields
} from "../../server/camera-sync-architecture.js";

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
    const signatureError = getRelaySignatureError(request, { deviceId, relayId, motionEventId });

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
    const bird = provider.audience === "bird-native" ? "Tufted titmouse" : "Northern cardinal";
    const rarity = "Uncommon";
    const points = rarityPoints[rarity];

    return response.status(202).json({
      relayUpload: {
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
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to accept relay upload.";
    return response.status(400).json({ error: message });
  }
}
