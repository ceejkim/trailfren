import { getCameraDeviceStatus } from "../../../server/cameraStore";

type QueryValue = string | string[] | undefined;

type ApiRequest = {
  method?: string;
  query?: Record<string, QueryValue>;
  url?: string;
};

type ApiResponse = {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): ApiResponse;
  json(data: unknown): void;
};

function first(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getDeviceId(request: ApiRequest) {
  const routeDeviceId = first(request.query?.deviceId);
  if (routeDeviceId) return routeDeviceId;

  const pathname = request.url?.split("?")[0] ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const camerasIndex = segments.indexOf("cameras");
  return camerasIndex >= 0 ? segments[camerasIndex + 1] ?? "demo-device" : "demo-device";
}

export default function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const deviceId = getDeviceId(request);
  const providerId = first(request.query?.providerId);

  return response.status(200).json({ device: getCameraDeviceStatus(deviceId, providerId) });
}
