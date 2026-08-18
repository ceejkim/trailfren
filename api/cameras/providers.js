import { cameraProviderRegistry, commonCameraWatchlist } from "../../server/camera-sync-architecture.js";
import { listCameraProviderAdapters } from "../../server/camera-provider-adapters.js";

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  return response.status(200).json({
    providers: Object.values(cameraProviderRegistry).sort((left, right) => left.marketPriority - right.marketPriority),
    adapters: listCameraProviderAdapters(),
    watchlist: commonCameraWatchlist,
    architecture: {
      adapterContracts: "/api/cameras/provider-adapters",
      localRelay: "RTSP/ONVIF cameras upload signed motion clips from a user-owned relay on the local network.",
      officialCloud: "Ring/Nest-style cameras use official OAuth, webhooks, and server-side token storage after approval.",
      partnerExport: "Bird-native cameras without public APIs use partner access, user-approved export, share import, email import, or manual upload.",
      manualFallback: "Every camera ecosystem can still feed private review through manual clip upload."
    }
  });
}
