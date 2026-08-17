import { createWyzeModelCheck } from "../../../server/camera-provider-adapters.js";
import { getBody } from "../../../server/camera-sync-architecture.js";

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = createWyzeModelCheck(getBody(request));
    return response.status(result.httpStatus).json({ modelCheck: result.modelCheck });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
