import type { CameraProvider, CameraSyncState, CameraSyncStatus } from "./types";

export const defaultCameraSync: CameraSyncState = {
  providerId: "birdfy",
  status: "not-started",
  approvalLabel: "Choose camera",
  privacyMode: "private",
  motionUploadsEnabled: true
};

export const cameraProviders: CameraProvider[] = [
  {
    id: "birdfy",
    name: "Birdfy / Netvue",
    category: "Bird camera",
    phase: "partner-export",
    connectionLabel: "Approval or export path",
    primaryAction: "Request Birdfy sync",
    syncSummary:
      "Birdfy records motion clips in its own cloud and supports app-based live viewing and sharing. Flock should start with a guided approval/export path while pursuing partner access.",
    motionFlow:
      "Birdfy detects motion, records a Moment clip, then Flock imports user-approved clips through partner access, share/export, or a future official connector.",
    limitations: [
      "No public developer API is currently documented for direct account sync.",
      "Do not ask users for Birdfy passwords inside Flock.",
      "Use partner access, user-approved export, or share/import until official API access exists."
    ],
    supportsMotionClips: true,
    requiresOAuth: false,
    requiresLocalRelay: false,
    docsUrl: "https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/"
  },
  {
    id: "bird-buddy",
    name: "Bird Buddy",
    category: "Bird camera",
    phase: "partner-export",
    connectionLabel: "Partner/export path",
    primaryAction: "Prepare Bird Buddy import",
    syncSummary:
      "Bird Buddy is highly relevant for birders, but the safe path is partner access or user-approved media export rather than private app automation.",
    motionFlow:
      "Bird Buddy captures postcards or videos; Flock imports user-approved clips and attaches verification/scoring metadata after upload.",
    limitations: [
      "Commercial use and app automation require Bird Buddy permission.",
      "Do not scrape the mobile app or reverse engineer private APIs.",
      "Start with manual import and partnership outreach."
    ],
    supportsMotionClips: true,
    requiresOAuth: false,
    requiresLocalRelay: false,
    docsUrl: "https://mybirdbuddy.com/app-eula/"
  },
  {
    id: "ring",
    name: "Ring",
    category: "Security camera",
    phase: "official-cloud",
    connectionLabel: "Official account link",
    primaryAction: "Connect Ring account",
    syncSummary:
      "Ring has official developer APIs for account linking, motion events, live video, clips, and webhooks, with certification requirements before broad production use.",
    motionFlow:
      "Ring sends a signed motion webhook, Flock requests the associated media through official scopes, then creates a private clip pending bird review.",
    limitations: [
      "Requires Ring developer registration and certification for production.",
      "Requires secure OAuth, webhook signature validation, and server-side token storage.",
      "Media may include required Ring watermarking."
    ],
    supportsMotionClips: true,
    requiresOAuth: true,
    requiresLocalRelay: false,
    docsUrl: "https://developer.ring.com/"
  },
  {
    id: "nest",
    name: "Google Nest Cam",
    category: "Security camera",
    phase: "official-cloud",
    connectionLabel: "Google Device Access",
    primaryAction: "Connect Google Nest",
    syncSummary:
      "Nest camera support should use Google Smart Device Management / Device Access for camera events and WebRTC live stream access where available.",
    motionFlow:
      "Nest emits camera motion events through Device Access; Flock maps the event to a private clip or live-review flow using official camera traits.",
    limitations: [
      "Requires Google project setup, OAuth scopes, and Device Access enrollment.",
      "Supported stream formats depend on camera model and migration state.",
      "Server-side token handling is required."
    ],
    supportsMotionClips: true,
    requiresOAuth: true,
    requiresLocalRelay: false,
    docsUrl: "https://developers.google.com/nest/device-access/api/camera-wired"
  },
  {
    id: "reolink",
    name: "Reolink",
    category: "RTSP / ONVIF",
    phase: "local-relay",
    connectionLabel: "Local relay required",
    primaryAction: "Set up local relay",
    syncSummary:
      "Reolink is a strong first standards-based target because many models expose RTSP/ONVIF for local-network video and events.",
    motionFlow:
      "A Flock relay on the user's network watches RTSP/ONVIF events, extracts motion clips, and uploads only approved clip assets/metadata to Flock.",
    limitations: [
      "Vercel cannot directly reach a private LAN camera stream.",
      "Camera credentials must stay in the local relay or server-side secret store.",
      "Battery/LTE model support varies."
    ],
    supportsMotionClips: true,
    requiresOAuth: false,
    requiresLocalRelay: true,
    docsUrl: "https://support.reolink.com/hc/en-us/articles/900000617826/"
  },
  {
    id: "tapo",
    name: "Tapo",
    category: "RTSP / ONVIF",
    phase: "local-relay",
    connectionLabel: "Local relay required",
    primaryAction: "Set up local relay",
    syncSummary:
      "Tapo cameras commonly support RTSP/ONVIF on the local network, making them practical for a privacy-first relay connector.",
    motionFlow:
      "The local relay connects to the Tapo stream, watches for motion windows, uploads clips to Flock, and never exposes camera credentials in the browser.",
    limitations: [
      "Requires local network access and a camera account configured in the vendor app.",
      "Some battery/solar models have support caveats.",
      "Live stream and motion capture must run outside Vercel."
    ],
    supportsMotionClips: true,
    requiresOAuth: false,
    requiresLocalRelay: true,
    docsUrl: "https://www.tapo.com/us/faq/34/"
  },
  {
    id: "wyze",
    name: "Wyze supported RTSP models",
    category: "RTSP / model-specific",
    phase: "local-relay",
    connectionLabel: "Model check required",
    primaryAction: "Check Wyze model",
    syncSummary:
      "Wyze support should be explicit and model-specific because RTSP availability changes by device and firmware.",
    motionFlow:
      "If the user's Wyze model supports RTSP, the local relay treats it like other standards-based cameras and uploads motion clips to Flock.",
    limitations: [
      "Do not claim universal Wyze support.",
      "Unsupported models should fall back to manual upload.",
      "Local relay is required for supported RTSP streams."
    ],
    supportsMotionClips: true,
    requiresOAuth: false,
    requiresLocalRelay: true,
    docsUrl: "https://forums.wyze.com/t/wyze-firmware-updates-2-2-2026/340669"
  },
  {
    id: "manual-upload",
    name: "Manual upload",
    category: "Fallback",
    phase: "manual",
    connectionLabel: "Works now",
    primaryAction: "Upload a clip",
    syncSummary:
      "Manual upload keeps Flock useful for every camera while vendor-specific sync paths are built and certified.",
    motionFlow:
      "The user uploads a clip, marks the camera source, and Flock runs the same bird review/scoring pipeline as synced camera clips.",
    limitations: ["Not automatic yet.", "User must choose clips to upload.", "Best fallback for unsupported camera ecosystems."],
    supportsMotionClips: false,
    requiresOAuth: false,
    requiresLocalRelay: false,
    docsUrl: "docs/camera-ingestion-design.md"
  }
];

export const syncStatusLabel: Record<CameraSyncStatus, string> = {
  "not-started": "Ready to configure",
  "needs-approval": "Approval path queued",
  "waiting-on-provider": "Awaiting official account link",
  "relay-required": "Local relay required",
  synced: "Sync enabled"
};

export function getCameraProvider(providerId: CameraSyncState["providerId"]) {
  return cameraProviders.find((provider) => provider.id === providerId) ?? cameraProviders[0];
}

export function getNextSyncStatus(provider: CameraProvider): CameraSyncStatus {
  if (provider.phase === "manual") return "synced";
  if (provider.requiresLocalRelay) return "relay-required";
  if (provider.requiresOAuth) return "waiting-on-provider";
  return "needs-approval";
}
