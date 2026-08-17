import {
  cameraProviderRegistry,
  createId,
  getPrivacyMode,
  rejectSecretFields
} from "./camera-sync-architecture.js";

const env = (name, label, scope = "server-only") => ({ name, label, scope });

export const cameraProviderSourceAudit = [
  {
    providerId: "ring",
    sourceUrl: "https://developer.amazon.com/docs/ring/api-documentation.html",
    verifiedFact:
      "Ring has an official partner API path for OAuth account linking, events, webhooks, live video, and clips."
  },
  {
    providerId: "nest",
    sourceUrl: "https://developers.google.com/nest/device-access/api/camera-wired",
    verifiedFact:
      "Nest Device Access supports camera motion/person events and WebRTC streams for supported migrated camera models."
  },
  {
    providerId: "reolink",
    sourceUrl: "https://support.reolink.com/articles/900000617826-Which-Reolink-Products-Support-CGI-RTSP-ONVIF/",
    verifiedFact: "Reolink documents CGI, RTSP, and ONVIF support by product family and model."
  },
  {
    providerId: "tapo",
    sourceUrl: "https://www.tp-link.com/us/support/faq/2680/",
    verifiedFact: "TP-Link documents RTSP and ONVIF support for many Tapo wired cameras with local-network setup."
  },
  {
    providerId: "wyze",
    sourceUrl: "https://support.wyze.com/hc/en-us/articles/360026245231-Wyze-Cam-RTSP",
    verifiedFact:
      "Wyze RTSP support is firmware and model specific, with no universal current-model promise."
  },
  {
    providerId: "birdfy",
    sourceUrl: "https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/",
    verifiedFact:
      "Birdfy describes app-managed motion clips and cloud storage; no public developer API is documented there."
  },
  {
    providerId: "bird-buddy",
    sourceUrl: "https://support.mybirdbuddy.com/hc/en-us/articles/9175854254865-Postcards-Collecting-Photos-and-Videos",
    verifiedFact: "Bird Buddy postcards contain user-owned photos and videos that can be shared or exported by the user."
  }
];

export const cameraProviderAdapters = {
  ring: {
    id: "ring-official-cloud-adapter",
    providerId: "ring",
    adapterKind: "official-cloud",
    readinessStatus: "vendor-setup-required",
    readinessLabel: "Official API setup required",
    deployBoundary: "vercel-api-route",
    routeBase: "/api/cameras/ring",
    routes: [
      {
        action: "oauth-start",
        method: "GET",
        path: "/api/cameras/ring/oauth/start",
        purpose: "Start official Ring account linking after app approval and OAuth configuration."
      },
      {
        action: "webhook",
        method: "POST",
        path: "/api/cameras/ring/webhooks",
        purpose: "Receive signed Ring motion notifications after webhook secret configuration."
      }
    ],
    capabilities: ["oauth-account-link", "motion-webhook", "historical-clip-import", "live-video-contract"],
    requiredEnv: [
      env("FLOCK_RING_CLIENT_ID", "Ring OAuth client id"),
      env("FLOCK_RING_CLIENT_SECRET", "Ring OAuth client secret"),
      env("FLOCK_RING_REDIRECT_URI", "Ring OAuth redirect URI"),
      env("FLOCK_RING_WEBHOOK_SECRET", "Ring webhook HMAC secret"),
      env("FLOCK_CAMERA_STORE_REST_URL", "Camera account store endpoint"),
      env("FLOCK_CAMERA_STORE_REST_TOKEN", "Camera account store server token")
    ],
    hardGates: [
      "Ring partner/developer setup and production approval.",
      "Server-side OAuth token storage.",
      "Signed webhook verification before accepting events.",
      "No direct browser calls to Ring OAuth or media APIs."
    ],
    safePath:
      "GitHub ships the Vercel route contracts now; real OAuth, webhooks, and clip import activate only after official Ring configuration is present.",
    sourceUrls: ["https://developer.amazon.com/docs/ring/api-documentation.html"]
  },
  nest: {
    id: "nest-device-access-adapter",
    providerId: "nest",
    adapterKind: "official-cloud",
    readinessStatus: "vendor-setup-required",
    readinessLabel: "Device Access setup required",
    deployBoundary: "vercel-api-route",
    routeBase: "/api/cameras/nest",
    routes: [
      {
        action: "oauth-start",
        method: "GET",
        path: "/api/cameras/nest/oauth/start",
        purpose: "Start Google OAuth after Device Access project setup."
      },
      {
        action: "event",
        method: "POST",
        path: "/api/cameras/nest/events",
        purpose: "Receive Device Access camera motion/person events through the approved event path."
      }
    ],
    capabilities: ["oauth-account-link", "camera-motion-event", "camera-person-event", "webrtc-live-stream-contract"],
    requiredEnv: [
      env("FLOCK_GOOGLE_CLIENT_ID", "Google OAuth client id"),
      env("FLOCK_GOOGLE_CLIENT_SECRET", "Google OAuth client secret"),
      env("FLOCK_NEST_REDIRECT_URI", "Google OAuth redirect URI"),
      env("FLOCK_NEST_DEVICE_ACCESS_PROJECT_ID", "Nest Device Access project id"),
      env("FLOCK_GOOGLE_PUBSUB_TOPIC", "Google Pub/Sub event topic"),
      env("FLOCK_CAMERA_STORE_REST_URL", "Camera account store endpoint"),
      env("FLOCK_CAMERA_STORE_REST_TOKEN", "Camera account store server token")
    ],
    hardGates: [
      "Google Device Access project setup and approved OAuth consent.",
      "Supported camera traits for the user's exact model.",
      "Server-side token storage and event validation.",
      "No private app scraping or undocumented Nest endpoints."
    ],
    safePath:
      "GitHub ships the Device Access route contracts now; real account linking, events, and streams activate only after Google configuration is present.",
    sourceUrls: ["https://developers.google.com/nest/device-access/api/camera-wired"]
  },
  birdfy: {
    id: "birdfy-partner-export-adapter",
    providerId: "birdfy",
    adapterKind: "partner-export",
    readinessStatus: "partner-or-export",
    readinessLabel: "Partner/export path",
    deployBoundary: "vercel-api-route",
    routeBase: "/api/cameras/birdfy",
    routes: [
      {
        action: "partner-request",
        method: "POST",
        path: "/api/cameras/birdfy/partner-request",
        purpose: "Queue partner access or user-approved export/import setup without collecting vendor passwords."
      }
    ],
    capabilities: ["user-approved-export", "share-import", "manual-upload-fallback"],
    requiredEnv: [
      env("FLOCK_CAMERA_STORE_REST_URL", "Camera account store endpoint", "optional-until-production"),
      env("FLOCK_CAMERA_STORE_REST_TOKEN", "Camera account store server token", "optional-until-production")
    ],
    hardGates: [
      "No public Birdfy developer API is documented.",
      "Do not collect Birdfy passwords.",
      "Automatic sync requires partner access or a user-approved export/share workflow."
    ],
    safePath:
      "Accept a cloud-side request record and guide the user to partner/export/share import while manual upload remains available.",
    sourceUrls: ["https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/"]
  },
  "bird-buddy": {
    id: "bird-buddy-partner-export-adapter",
    providerId: "bird-buddy",
    adapterKind: "partner-export",
    readinessStatus: "partner-or-export",
    readinessLabel: "Partner/export path",
    deployBoundary: "vercel-api-route",
    routeBase: "/api/cameras/bird-buddy",
    routes: [
      {
        action: "partner-request",
        method: "POST",
        path: "/api/cameras/bird-buddy/partner-request",
        purpose: "Queue partner access or user-approved postcard import setup without private app automation."
      }
    ],
    capabilities: ["postcard-import", "share-import", "manual-upload-fallback"],
    requiredEnv: [
      env("FLOCK_CAMERA_STORE_REST_URL", "Camera account store endpoint", "optional-until-production"),
      env("FLOCK_CAMERA_STORE_REST_TOKEN", "Camera account store server token", "optional-until-production")
    ],
    hardGates: [
      "Do not reverse engineer the Bird Buddy app or private APIs.",
      "Automatic sync requires partner access or explicit user-approved export/share permission.",
      "Commercial use must honor Bird Buddy terms and permissions."
    ],
    safePath:
      "Accept a cloud-side request record and guide the user to partner/export/share import while manual upload remains available.",
    sourceUrls: [
      "https://support.mybirdbuddy.com/hc/en-us/articles/9175854254865-Postcards-Collecting-Photos-and-Videos",
      "https://support.mybirdbuddy.com/hc/en-us/articles/4406551221521-Sharing-photos-and-videos"
    ]
  },
  reolink: {
    id: "reolink-local-relay-adapter",
    providerId: "reolink",
    adapterKind: "local-relay",
    readinessStatus: "relay-required",
    readinessLabel: "Local relay ready",
    deployBoundary: "local-relay-plus-vercel-upload",
    routeBase: "/api/cameras/devices",
    routes: [
      {
        action: "register-device",
        method: "POST",
        path: "/api/cameras/devices",
        purpose: "Register a redacted, user-owned device record for signed local relay uploads."
      },
      {
        action: "relay-upload",
        method: "POST",
        path: "/api/cameras/relay-uploads",
        purpose: "Accept signed clip metadata and review records from the local relay."
      }
    ],
    capabilities: ["rtsp", "onvif", "signed-relay-upload", "motion-window-import"],
    requiredEnv: [
      env("FLOCK_RELAY_SIGNING_SECRET", "Relay upload signing secret"),
      env("FLOCK_CLIP_STORAGE_BUCKET", "Private clip storage bucket", "server-only-production")
    ],
    hardGates: [
      "Real RTSP/ONVIF URLs and camera passwords stay inside the user's local relay.",
      "Vercel does not connect directly to private LAN cameras.",
      "Model support must be confirmed against Reolink's support matrix."
    ],
    safePath:
      "Use a user-owned local relay to read RTSP/ONVIF and upload only signed clip records to Vercel.",
    sourceUrls: ["https://support.reolink.com/articles/900000617826-Which-Reolink-Products-Support-CGI-RTSP-ONVIF/"]
  },
  tapo: {
    id: "tapo-local-relay-adapter",
    providerId: "tapo",
    adapterKind: "local-relay",
    readinessStatus: "relay-required",
    readinessLabel: "Local relay ready",
    deployBoundary: "local-relay-plus-vercel-upload",
    routeBase: "/api/cameras/devices",
    routes: [
      {
        action: "register-device",
        method: "POST",
        path: "/api/cameras/devices",
        purpose: "Register a redacted, user-owned device record for signed local relay uploads."
      },
      {
        action: "relay-upload",
        method: "POST",
        path: "/api/cameras/relay-uploads",
        purpose: "Accept signed clip metadata and review records from the local relay."
      }
    ],
    capabilities: ["rtsp", "onvif", "signed-relay-upload", "motion-window-import"],
    requiredEnv: [
      env("FLOCK_RELAY_SIGNING_SECRET", "Relay upload signing secret"),
      env("FLOCK_CLIP_STORAGE_BUCKET", "Private clip storage bucket", "server-only-production")
    ],
    hardGates: [
      "Real Tapo camera accounts and RTSP URLs stay inside the user's local relay.",
      "Vercel does not connect directly to private LAN cameras.",
      "Battery/solar model caveats must be checked before promising RTSP/ONVIF."
    ],
    safePath:
      "Use a user-owned local relay to read Tapo RTSP/ONVIF and upload only signed clip records to Vercel.",
    sourceUrls: ["https://www.tp-link.com/us/support/faq/2680/"]
  },
  wyze: {
    id: "wyze-rtsp-model-check-adapter",
    providerId: "wyze",
    adapterKind: "local-relay-model-check",
    readinessStatus: "model-check-required",
    readinessLabel: "RTSP model check",
    deployBoundary: "local-relay-plus-vercel-upload",
    routeBase: "/api/cameras/wyze",
    routes: [
      {
        action: "model-check",
        method: "POST",
        path: "/api/cameras/wyze/model-check",
        purpose: "Confirm whether a Wyze model is eligible for the local relay RTSP path."
      }
    ],
    capabilities: ["rtsp-model-check", "signed-relay-upload", "manual-upload-fallback"],
    requiredEnv: [
      env("FLOCK_RELAY_SIGNING_SECRET", "Relay upload signing secret", "server-only-production"),
      env("FLOCK_CLIP_STORAGE_BUCKET", "Private clip storage bucket", "server-only-production")
    ],
    hardGates: [
      "Only explicitly supported Wyze RTSP models can use the local relay path.",
      "Unsupported Wyze cameras fall back to manual upload.",
      "Do not claim universal Wyze camera support."
    ],
    safePath:
      "Run a model check before relay setup; supported RTSP models use signed relay uploads and all others fall back to manual upload.",
    sourceUrls: ["https://support.wyze.com/hc/en-us/articles/360026245231-Wyze-Cam-RTSP"]
  },
  "manual-upload": {
    id: "manual-upload-adapter",
    providerId: "manual-upload",
    adapterKind: "manual",
    readinessStatus: "available-now",
    readinessLabel: "Available now",
    deployBoundary: "vercel-api-route",
    routeBase: "/api/cameras/clip-ingests",
    routes: [
      {
        action: "manual-upload",
        method: "POST",
        path: "/api/cameras/clip-ingests",
        purpose: "Create a private review item from a user-uploaded clip."
      }
    ],
    capabilities: ["manual-upload", "private-review", "bird-intelligence-pipeline"],
    requiredEnv: [],
    hardGates: [],
    safePath: "Keep manual upload available for every camera ecosystem while richer sync paths mature.",
    sourceUrls: ["docs/camera-ingestion-design.md"]
  }
};

export const wyzeRtspSupportedModels = [
  {
    canonicalName: "Wyze Cam v2",
    aliases: ["wyze cam v2", "wyzecam v2"]
  },
  {
    canonicalName: "Wyze Cam v3",
    aliases: ["wyze cam v3", "wyzecam v3"]
  },
  {
    canonicalName: "Wyze Cam Pan",
    aliases: ["wyze cam pan", "wyzecam pan"]
  }
];

function configured(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeModel(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function getAdapterMissingEnv(adapter, sourceEnv = process.env) {
  return adapter.requiredEnv
    .filter((item) => item.scope !== "optional-until-production")
    .filter((item) => !configured(sourceEnv[item.name]))
    .map((item) => item.name);
}

function resolveRoute(adapter, action) {
  return adapter.routes.find((route) => route.action === action) ?? adapter.routes[0];
}

function createActionRecord(providerId, action, body, route, status, httpStatus, extra = {}) {
  const provider = cameraProviderRegistry[providerId];
  const adapter = cameraProviderAdapters[providerId];
  const missingEnv = getAdapterMissingEnv(adapter);

  return {
    httpStatus,
    adapterAction: {
      id: createId("adapter"),
      providerId,
      providerName: provider.name,
      adapterId: adapter.id,
      adapterKind: adapter.adapterKind,
      readinessLabel: adapter.readinessLabel,
      action,
      route: route.path,
      method: route.method,
      status,
      userId: typeof body.userId === "string" && body.userId.trim() ? body.userId : "demo-user",
      privacyMode: getPrivacyMode(body.privacyMode),
      motionUploadsEnabled: body.motionUploadsEnabled !== false,
      missingEnv,
      hardGates: adapter.hardGates,
      safePath: adapter.safePath,
      nextStep: extra.nextStep ?? getNextAdapterStep(adapter, missingEnv),
      createdAt: new Date().toISOString(),
      ...extra
    }
  };
}

export function getNextAdapterStep(adapter, missingEnv = getAdapterMissingEnv(adapter)) {
  if (adapter.adapterKind === "official-cloud" && missingEnv.length > 0) {
    return `Configure ${missingEnv[0]} in Vercel before enabling this official cloud adapter.`;
  }

  if (adapter.adapterKind === "official-cloud") {
    return "Complete vendor review, then replace this route contract with real OAuth/event handling.";
  }

  if (adapter.adapterKind === "partner-export") {
    return "Queue partner outreach or user-approved export/share import; keep manual upload available.";
  }

  if (adapter.adapterKind.includes("local-relay")) {
    return "Install the local relay near the camera and upload only signed clips to the cloud API.";
  }

  return "Use manual upload and private review.";
}

export function getCameraProviderAdapter(providerId) {
  if (typeof providerId !== "string" || !cameraProviderAdapters[providerId]) {
    throw new Error("A supported camera provider adapter is required.");
  }
  return cameraProviderAdapters[providerId];
}

export function listCameraProviderAdapters() {
  return Object.values(cameraProviderAdapters).sort((left, right) => {
    return cameraProviderRegistry[left.providerId].marketPriority - cameraProviderRegistry[right.providerId].marketPriority;
  });
}

export function getVercelCameraEnvChecklist(sourceEnv = process.env) {
  const allRequirements = listCameraProviderAdapters().flatMap((adapter) => {
    return adapter.requiredEnv.map((item) => ({
      providerId: adapter.providerId,
      adapterId: adapter.id,
      name: item.name,
      label: item.label,
      scope: item.scope,
      configured: configured(sourceEnv[item.name])
    }));
  });

  const uniqueByName = new Map();
  for (const requirement of allRequirements) {
    const current = uniqueByName.get(requirement.name);
    uniqueByName.set(requirement.name, {
      ...requirement,
      providerIds: current ? [...new Set([...current.providerIds, requirement.providerId])] : [requirement.providerId]
    });
  }

  const requirements = [...uniqueByName.values()].sort((left, right) => left.name.localeCompare(right.name));
  return {
    requirements,
    missingRequired: requirements
      .filter((requirement) => requirement.scope !== "optional-until-production")
      .filter((requirement) => !requirement.configured)
      .map((requirement) => requirement.name),
    note: "Set these in Vercel project environment variables; never expose OAuth secrets or camera credentials in the browser."
  };
}

export function createProviderAdapterAction(providerId, action, body = {}) {
  rejectSecretFields(body);

  const adapter = getCameraProviderAdapter(providerId);
  const route = resolveRoute(adapter, action);
  const missingEnv = getAdapterMissingEnv(adapter);

  if (adapter.adapterKind === "official-cloud") {
    const status = missingEnv.length > 0 ? "configuration-required" : "vendor-review-required";
    return createActionRecord(providerId, action, body, route, status, 501, {
      oauthReady: false,
      webhookReady: false,
      streamReady: false
    });
  }

  if (adapter.adapterKind === "partner-export") {
    return createActionRecord(providerId, action, body, route, "partner-review-required", 202, {
      importModes: ["partner-access", "user-approved-export", "share-import", "manual-upload"],
      passwordCollection: "forbidden"
    });
  }

  if (adapter.adapterKind.includes("local-relay")) {
    return createActionRecord(providerId, action, body, route, "relay-required", 202, {
      cameraCredentialsBoundary: "local-relay-only",
      vercelLanAccess: "not-supported"
    });
  }

  return createActionRecord(providerId, action, body, route, "available-now", 200);
}

export function createWyzeModelCheck(body = {}) {
  rejectSecretFields(body);

  const adapter = getCameraProviderAdapter("wyze");
  const route = resolveRoute(adapter, "model-check");
  const normalized = normalizeModel(body.model);
  const matchedModel = wyzeRtspSupportedModels.find((model) => {
    return model.aliases.some((alias) => normalizeModel(alias) === normalized);
  });

  const status = matchedModel ? "supported-rtsp-model" : "unsupported-model";
  return {
    httpStatus: 200,
    modelCheck: {
      id: createId("wyze"),
      providerId: "wyze",
      providerName: cameraProviderRegistry.wyze.name,
      adapterId: adapter.id,
      adapterKind: adapter.adapterKind,
      action: "model-check",
      route: route.path,
      method: route.method,
      submittedModel: typeof body.model === "string" && body.model.trim() ? body.model.trim() : "unknown",
      status,
      localRelayEligible: Boolean(matchedModel),
      canonicalModel: matchedModel?.canonicalName ?? null,
      needsFirmwareConfirmation: Boolean(matchedModel),
      fallbackProviderId: matchedModel ? null : "manual-upload",
      nextStep: matchedModel
        ? "Confirm the RTSP firmware path, then register the camera through the local relay flow."
        : "Use manual upload unless the exact Wyze model has documented RTSP support.",
      hardGates: adapter.hardGates,
      sourceUrls: adapter.sourceUrls,
      createdAt: new Date().toISOString()
    }
  };
}
