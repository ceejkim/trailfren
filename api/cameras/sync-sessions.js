import { createSyncSession, getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    return response.status(202).json({ syncSession: createSyncSession(body) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create camera sync session.";
    return response.status(400).json({ error: message });
  }
}
