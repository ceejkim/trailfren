const providers = {
  birdfy: { id: "birdfy", name: "Birdfy / Netvue", mode: "partner-request" },
  "bird-buddy": { id: "bird-buddy", name: "Bird Buddy", mode: "partner-request" },
  ring: { id: "ring", name: "Ring", mode: "official-oauth" },
  nest: { id: "nest", name: "Google Nest Cam", mode: "official-oauth" },
  reolink: { id: "reolink", name: "Reolink", mode: "local-relay" },
  tapo: { id: "tapo", name: "Tapo", mode: "local-relay" },
  wyze: { id: "wyze", name: "Wyze supported RTSP models", mode: "local-relay" },
  "manual-upload": { id: "manual-upload", name: "Manual upload", mode: "manual-upload" }
};

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

function getNextStep(mode, providerName) {
  if (mode === "official-oauth") return `Start official ${providerName} account linking and keep tokens server-side only.`;
  if (mode === "local-relay") return `Install a local Flock relay before any private ${providerName} camera stream can upload clips.`;
  if (mode === "partner-request") return `Queue a ${providerName} partner/export request and keep manual import available until official access exists.`;
  return "Open manual upload and run clips through private review before scoring.";
}

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const deviceId = getDeviceId(request);
  const providerId = first(request.query?.providerId);
  const provider = providerId && providers[providerId] ? providers[providerId] : providers["manual-upload"];

  return response.status(200).json({
    device: {
      deviceId,
      providerId: provider.id,
      providerName: provider.name,
      status: getDeviceStatus(provider.mode),
      lastSeenAt: new Date().toISOString(),
      nextStep: getNextStep(provider.mode, provider.name)
    }
  });
}
