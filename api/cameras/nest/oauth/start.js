import { createProviderAdapterAction } from "../../../../server/camera-provider-adapters.js";

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = createProviderAdapterAction("nest", "oauth-start", request.query ?? {});
    return response.status(result.httpStatus).json({ adapterAction: result.adapterAction });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
