import { createDeviceRegistration, getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistCameraDeviceRegistration } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    const registrationResult = await persistCameraDeviceRegistration(request, body, createDeviceRegistration(body));
    return response.status(201).json({ registrationResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register camera device.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
