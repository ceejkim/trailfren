import { createConnectionRequest, getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistCameraConnectionRequest } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    const connectionRequest = await persistCameraConnectionRequest(request, body, createConnectionRequest(body));
    return response.status(201).json({ connectionRequest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create camera connection request.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
