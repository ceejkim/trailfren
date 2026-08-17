import { getProvider, getProviderNextStep } from "../../../server/camera-sync-architecture.js";
import { getStoredCameraDevice } from "../../../server/camera-sync-store.js";

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getDeviceId(request) {
  const routeDeviceId = first(request.query?.deviceId);
  if (routeDeviceId) return routeDeviceId;

  const pathname = request.url?.split("?")[0] ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const camerasIndex = segments.indexOf("cameras");
  return camerasIndex >= 0 ? segments[camerasIndex + 1] ?? "demo-device" : "demo-device";
}

function getDeviceStatus(mode) {
  if (mode === "official-oauth") return "waiting-on-provider";
  if (mode === "local-relay") return "relay-required";
  if (mode === "partner-request") return "awaiting-setup";
  return "ready-for-ingest";
}

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const deviceId = getDeviceId(request);
    const storedDevice = await getStoredCameraDevice(request, deviceId);
    const provider = storedDevice ? getProvider(storedDevice.providerId) : getProvider(first(request.query?.providerId) || "manual-upload");

    return response.status(200).json({
      device: {
        deviceId,
        providerId: provider.id,
        providerName: provider.name,
        status: storedDevice?.connectionStatus || getDeviceStatus(provider.mode),
        lastSeenAt: storedDevice?.lastSeenAt || new Date().toISOString(),
        nextStep: getProviderNextStep(provider),
        persisted: Boolean(storedDevice),
        storage: storedDevice?.storage
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read camera device status.";
    return response.status(400).json({ error: message });
  }
}
