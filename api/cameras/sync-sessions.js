import { createSyncSession, getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistCameraSyncSession } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    const syncSession = await persistCameraSyncSession(request, body, createSyncSession(body));
    return response.status(202).json({ syncSession });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create camera sync session.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
