import { createClipIngest, json, readJson } from "../../server/cameraStore";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, headers: { allow: "POST" } });
  }

  try {
    const body = await readJson(request);
    const ingestResult = createClipIngest(body);
    return json({ ingestResult }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to ingest camera clip.";
    return json({ error: message }, { status: 400 });
  }
}
