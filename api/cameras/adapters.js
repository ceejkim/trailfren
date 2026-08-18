import {
  cameraProviderSourceAudit,
  createProviderAdapterAction,
  createWyzeModelCheck,
  getVercelCameraEnvChecklist,
  listCameraProviderAdapters
} from "../../server/camera-provider-adapters.js";
import { createRelayManifest, getBody, rejectSecretFields } from "../../server/camera-sync-architecture.js";
import { getStoredCameraDevice, persistCameraRelayManifest } from "../../server/camera-sync-store.js";

function adapterPath(request) {
  const path = request.query?.adapterPath;
  return Array.isArray(path) ? path.join("/") : path;
}

function methodNotAllowed(response, method) {
  response.setHeader("allow", method);
  return response.status(405).json({ error: "Method not allowed" });
}

function providerAdapterCatalog(response) {
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

function providerAction(response, providerId, action, input) {
  const result = createProviderAdapterAction(providerId, action, input);
  return response.status(result.httpStatus).json({ adapterAction: result.adapterAction });
}

async function relayManifest(request, response) {
  const body = getBody(request);
  rejectSecretFields(body);
  const storedDevice = await getStoredCameraDevice(request, body.deviceId, body);
  if (!storedDevice) throw new Error("Register this camera device before creating a relay manifest.");
  if (storedDevice.providerId !== body.providerId) throw new Error("Relay manifest provider must match the registered device.");
  if (!storedDevice.relayId || storedDevice.relayId !== body.relayId) {
    throw new Error("Relay manifest relayId must match the registered device relay.");
  }

  const manifestInput = {
    ...body,
    displayName: body.displayName || storedDevice.displayName,
    redactedEndpoint: body.redactedEndpoint || storedDevice.redactedEndpoint,
    privacyMode: body.privacyMode || storedDevice.privacyMode,
    motionUploadsEnabled: typeof body.motionUploadsEnabled === "boolean" ? body.motionUploadsEnabled : storedDevice.motionOnly
  };
  const manifest = await persistCameraRelayManifest(request, manifestInput, createRelayManifest(manifestInput));
  return response.status(201).json({ relayManifest: manifest });
}

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  try {
    switch (adapterPath(request)) {
      case "provider-adapters":
        return request.method === "GET" ? providerAdapterCatalog(response) : methodNotAllowed(response, "GET");
      case "ring/oauth/start":
        return request.method === "GET"
          ? providerAction(response, "ring", "oauth-start", request.query ?? {})
          : methodNotAllowed(response, "GET");
      case "ring/webhooks":
        return request.method === "POST"
          ? providerAction(response, "ring", "webhook", getBody(request))
          : methodNotAllowed(response, "POST");
      case "nest/oauth/start":
        return request.method === "GET"
          ? providerAction(response, "nest", "oauth-start", request.query ?? {})
          : methodNotAllowed(response, "GET");
      case "nest/events":
        return request.method === "POST"
          ? providerAction(response, "nest", "event", getBody(request))
          : methodNotAllowed(response, "POST");
      case "birdfy/partner-request":
        return request.method === "POST"
          ? providerAction(response, "birdfy", "partner-request", getBody(request))
          : methodNotAllowed(response, "POST");
      case "bird-buddy/partner-request":
        return request.method === "POST"
          ? providerAction(response, "bird-buddy", "partner-request", getBody(request))
          : methodNotAllowed(response, "POST");
      case "wyze/model-check": {
        if (request.method !== "POST") return methodNotAllowed(response, "POST");
        const result = createWyzeModelCheck(getBody(request));
        return response.status(result.httpStatus).json({ modelCheck: result.modelCheck });
      }
      case "relay-manifests":
        return request.method === "POST" ? await relayManifest(request, response) : methodNotAllowed(response, "POST");
      default:
        return response.status(404).json({ error: "Camera adapter route not found" });
    }
  } catch (error) {
    return response.status(400).json({ error: error instanceof Error ? error.message : "Unable to process camera adapter request." });
  }
}
