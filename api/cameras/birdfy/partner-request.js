import { createProviderAdapterAction } from "../../../server/camera-provider-adapters.js";
import { getBody } from "../../../server/camera-sync-architecture.js";

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = createProviderAdapterAction("birdfy", "partner-request", getBody(request));
    return response.status(result.httpStatus).json({ adapterAction: result.adapterAction });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
