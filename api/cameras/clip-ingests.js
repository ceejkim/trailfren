import { createClipIngestResult, getBody, rejectPublicClipMedia, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistCameraClipIngest } from "../../server/camera-sync-store.js";

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
    const ingestResult = await persistCameraClipIngest(request, body, createClipIngestResult(body));
    return response.status(201).json({ ingestResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to ingest camera clip.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
