import { createRelayManifest, getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getStoredCameraDevice, persistCameraRelayManifest } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    const storedDevice = await getStoredCameraDevice(request, body.deviceId, body);
    if (!storedDevice) {
      throw new Error("Register this camera device before creating a relay manifest.");
    }
    if (storedDevice.providerId !== body.providerId) {
      throw new Error("Relay manifest provider must match the registered device.");
    }
    if (!storedDevice.relayId || storedDevice.relayId !== body.relayId) {
      throw new Error("Relay manifest relayId must match the registered device relay.");
    }

    const manifestInput = {
      ...body,
      displayName: body.displayName || storedDevice.displayName,
      redactedEndpoint: body.redactedEndpoint || storedDevice.redactedEndpoint,
      privacyMode: body.privacyMode || storedDevice.privacyMode,
      motionUploadsEnabled:
        typeof body.motionUploadsEnabled === "boolean" ? body.motionUploadsEnabled : storedDevice.motionOnly
    };
    const relayManifest = await persistCameraRelayManifest(request, manifestInput, createRelayManifest(manifestInput));
    return response.status(201).json({ relayManifest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create relay manifest.";
    return response.status(400).json({ error: message });
  }
}
