import { createConnectionRequest, json, readJson } from "../../server/cameraStore";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, headers: { allow: "POST" } });
  }

  try {
    const body = await readJson(request);
    const connectionRequest = createConnectionRequest(body);
    return json({ connectionRequest }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create camera connection request.";
    return json({ error: message }, { status: 400 });
  }
}
