import {
  createRelayUploadResult,
  getDemoRelaySignatureError,
  getBody,
  getRelaySignature,
  rejectPublicClipMedia,
  rejectSecretFields
} from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistCameraRelayUpload, verifyRelayUploadSignature } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    rejectPublicClipMedia(body);

    const deviceId = typeof body.deviceId === "string" && body.deviceId.trim() ? body.deviceId : "device-demo";
    const relayId = typeof body.relayId === "string" && body.relayId.trim() ? body.relayId : "relay-demo";
    const motionEventId =
      typeof body.motionEventId === "string" && body.motionEventId.trim() ? body.motionEventId : `motion-${Date.now()}`;
    const signatureBody = { ...body, deviceId, relayId, motionEventId };
    const signature = getRelaySignature(request);
    const signatureError = process.env.FLOCK_RELAY_SIGNING_SECRET
      ? null
      : getDemoRelaySignatureError(signature, signatureBody);

    if (signatureError) {
      return response.status(401).json({ error: signatureError, status: "signature-required" });
    }

    const verifiedRelayAccount = process.env.FLOCK_RELAY_SIGNING_SECRET
      ? await verifyRelayUploadSignature(signatureBody, signature)
      : undefined;
    const relayUploadBody = verifiedRelayAccount ? { ...signatureBody, userId: verifiedRelayAccount.userId } : signatureBody;
    const { record: relayUpload, idempotent } = await persistCameraRelayUpload(
      request,
      body,
      createRelayUploadResult(relayUploadBody),
      verifiedRelayAccount
    );
    return response.status(idempotent ? 200 : 202).json({ relayUpload, idempotent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to accept relay upload.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
