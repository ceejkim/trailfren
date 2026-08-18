import {
  cameraProviderSourceAudit,
  getVercelCameraEnvChecklist,
  listCameraProviderAdapters
} from "../../server/camera-provider-adapters.js";

export default function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  return response.status(200).json({
    adapters: listCameraProviderAdapters(),
    envChecklist: getVercelCameraEnvChecklist(),
    sourceAudit: cameraProviderSourceAudit,
    cloudPolicy: {
      canonicalSystem: "GitHub repository deploys to Vercel.",
      noPrivateCameraSecretsInBrowser: true,
      officialCloud: "Ring and Nest stay gated until vendor credentials, webhook validation, and review are complete.",
      localRelay:
        "Reolink, Tapo, and supported Wyze models use a user-owned relay near the camera; Vercel receives signed clip uploads only.",
      partnerExport:
        "Birdfy and Bird Buddy use partner access, user-approved export/share import, or manual upload until official APIs exist."
    }
  });
}
