import {
  createRelayUploadResult,
  getBody,
  getRelaySignatureError,
  rejectSecretFields
} from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistCameraRelayUpload } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);

    const deviceId = typeof body.deviceId === "string" && body.deviceId.trim() ? body.deviceId : "device-demo";
    const relayId = typeof body.relayId === "string" && body.relayId.trim() ? body.relayId : "relay-demo";
    const motionEventId =
      typeof body.motionEventId === "string" && body.motionEventId.trim() ? body.motionEventId : `motion-${Date.now()}`;
    const signatureError = getRelaySignatureError(request, { deviceId, relayId, motionEventId });

    if (signatureError) {
      return response.status(401).json({ error: signatureError, status: "signature-required" });
    }

    const relayUpload = await persistCameraRelayUpload(request, body, createRelayUploadResult({ ...body, deviceId, relayId, motionEventId }));
    return response.status(202).json({ relayUpload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to accept relay upload.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
