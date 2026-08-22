import { createBirdReviewAnalysis, getBirdIntelligencePlan } from "../../server/bird-intelligence-pipeline.js";
import { getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getCameraAccountErrorStatus, persistBirdAnalysis } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method === "GET") {
    return response.status(200).json({ plan: getBirdIntelligencePlan() });
  }

  if (request.method !== "POST") {
    response.setHeader("allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = getBody(request);
    rejectSecretFields(body);
    const analysis = await persistBirdAnalysis(request, body, createBirdReviewAnalysis(body));
    return response.status(202).json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze bird review item.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
