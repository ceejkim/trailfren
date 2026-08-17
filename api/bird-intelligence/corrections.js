import { createManualBirdCorrection } from "../../server/bird-intelligence-pipeline.js";
import { getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { persistBirdCorrection } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    const correction = await persistBirdCorrection(request, body, createManualBirdCorrection(body));
    return response.status(200).json({ correction });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save bird review correction.";
    return response.status(400).json({ error: message });
  }
}
