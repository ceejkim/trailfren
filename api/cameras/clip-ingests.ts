import { createClipIngest } from "../../server/cameraStore";

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): ApiResponse;
  json(data: unknown): void;
};

function getBody(request: ApiRequest) {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body) as Record<string, unknown>;
    } catch {
      throw new Error("Request body must be valid JSON.");
    }
  }

  if (!request.body || typeof request.body !== "object") return {};
  return request.body as Record<string, unknown>;
}

export default function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ingestResult = createClipIngest(getBody(request));
    return response.status(201).json({ ingestResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to ingest camera clip.";
    return response.status(400).json({ error: message });
  }
}
