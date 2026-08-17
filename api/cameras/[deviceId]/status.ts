import { getCameraDeviceStatus, json } from "../../../server/cameraStore";

export default function handler(request: Request) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, { status: 405, headers: { allow: "GET" } });
  }

  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const camerasIndex = segments.indexOf("cameras");
  const deviceId = camerasIndex >= 0 ? segments[camerasIndex + 1] ?? "demo-device" : "demo-device";
  const providerId = url.searchParams.get("providerId");

  return json({ device: getCameraDeviceStatus(deviceId, providerId) });
}
