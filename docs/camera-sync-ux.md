# Camera Sync User Flow

Updated: August 17, 2026

## Product Promise

A user should be able to create a Flock account, choose the camera they own, approve the safest available connection path, and have bird-triggered motion clips appear privately in BirdWatch/Flock for review, scoring, and sharing.

## UX Flow

1. Create or sign in to Flock.
2. Open Cameras.
3. Confirm the account shown in the Camera Sync wizard.
4. Select camera provider.
5. Click the single provider-specific sync or approval button.
6. Flock creates a sync session and routes the user to the correct connection path:
   - Official account link for Ring and Nest.
   - Local relay setup for RTSP/ONVIF cameras such as Reolink, Tapo, and supported Wyze models.
   - Partner/export/share/import path for Birdfy and Bird Buddy until official developer access exists.
   - Manual upload fallback for every provider.
7. Register a camera device record owned by the user's account.
8. New clips default to private.
9. Motion-triggered clips enter the bird review pipeline before scoring or sharing.

## Implemented Front-End Boundary

The current app now has:

- Provider selection in the Cameras tab.
- A one-tap Camera Sync wizard that shows account, provider path, privacy default, motion upload preference, and setup status.
- A provider-specific sync/approval CTA.
- A `CameraSyncSession` contract created by the wizard sync action.
- A `CameraConnectionRequest` contract created by the sync button.
- Callback paths for official OAuth, local relay, partner/export request, and manual upload modes.
- A next-step message for each integration mode.
- A device relay panel that registers an account-bound camera device record.
- A relay enrollment preview for local RTSP/ONVIF cameras.
- A signed relay upload preview that creates a private clip and sighting pending review.
- Best-effort POST calls from the browser boundary to the deployed camera API routes.
- Persistent local demo state for the latest request, device registration, relay upload, and latest ingest result.
- Account-state reconciliation from the server camera store after reload.
- Camera Sync wizard store status so preview/non-durable storage is visible.

This proves the user flow and API shape without collecting real camera credentials or pretending that unsupported vendor APIs exist.

## Implemented Back-End Boundary

The current backend boundary is implemented as Vercel functions with account-scoped camera persistence:

- `POST /api/cameras/connection-requests`
- `GET /api/cameras/providers`
- `POST /api/cameras/sync-sessions`
- `POST /api/cameras/devices`
- `POST /api/cameras/clip-ingests`
- `POST /api/cameras/relay-uploads`
- `GET /api/cameras/:deviceId/status`

The route files are self-contained JavaScript functions under `api/` so Vercel packages one clear runtime implementation for each endpoint. The routes persist account-scoped camera records through the server camera store, validate the supported provider, reject sensitive fields such as passwords, secrets, tokens, API keys, and refresh values, reject unredacted RTSP/ONVIF endpoints, and return safe objects that match the front-end contracts.

The relay upload endpoint requires the `x-flock-relay-signature` header in demo mode. Production signing must move to a server-held relay secret after real account persistence exists.

The sync-session endpoint is the orchestration surface for the simple account-to-camera wizard. It returns the safe next path for the selected provider, persists the session under the resolved account, and rejects secrets or private stream URLs.

The providers endpoint exposes the backend capability registry that identifies the first supported camera set and the next watchlist. This keeps the UI/provider copy anchored to the real sync architecture rather than a visual-only list.

This is the correct bridge between the mock app and a real integration system: it gives Vercel a deployable API surface while avoiding private-feed storage, credential collection, or vendor API claims that have not been approved.

## Integration Modes

### Official Cloud Account Link

Use for providers with official APIs and account linking.

Current targets:

- Ring
- Google Nest

Requirements:

- OAuth/account linking
- Server-side token storage
- Webhook endpoints
- Webhook signature validation
- Vendor certification or app review where required
- Vercel environment variables for client IDs/secrets/webhook keys

### Local Relay

Use for cameras with local RTSP/ONVIF support.

Current targets:

- Reolink
- Tapo
- Supported Wyze models

Requirements:

- User-owned relay on the same network as the camera
- Camera credentials stored only in the relay or server-side secret store
- Clip upload contract from relay to Flock
- Health check and pause controls
- Clear user messaging that Vercel cannot directly access private LAN camera streams

### Partner / Export / Share Import

Use for bird-native cameras without a documented public developer API.

Current targets:

- Birdfy / Netvue
- Bird Buddy

Requirements:

- No password collection inside Flock
- No scraping or private API automation
- User-approved export/import, share link handling, email import, or partner access
- Partner outreach tracked separately from MVP development

### Manual Upload

Use as the universal fallback.

Requirements:

- Upload clip
- Choose camera/source
- Default privacy
- Bird review before scoring

## Front-End Contract

The current front-end exposes:

- Provider list
- Account-aware one-tap sync wizard
- Provider-specific sync CTA
- Sync session status
- Connection status
- Device registration
- Relay enrollment for local cameras
- Signed relay upload preview
- Privacy default
- Motion auto-upload preference
- Provider limitations
- Shared motion upload pipeline
- Mock ingest preview for approved motion uploads

The current front-end does not collect secrets or connect to real cameras yet.

## Back-End Contract

Implemented in `src/types.ts`, `src/cameraApi.ts`, and the self-contained JavaScript functions in the root `api/` routes.

```ts
export type CameraSyncSession = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  mode: CameraConnectionMode;
  status: "approval-required" | "device-registration-required" | "export-approval-required" | "manual-ready";
  approvalPath: string;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  deviceRegistrationRequired: boolean;
  relayRequired: boolean;
  oauthRequired: boolean;
  partnerAccessRequired: boolean;
  checklist: string[];
  createdAt: string;
  expiresAt: string;
};

export type CameraDevice = {
  id: string;
  ownerId: string;
  providerId: CameraProviderId;
  providerName: string;
  displayName: string;
  locationLabel: string;
  privacyMode: CameraPrivacyMode;
  connectionStatus: CameraDeviceConnectionStatus;
  transport: CameraStreamTransport;
  motionOnly: boolean;
  redactedEndpoint?: string;
  relayId?: string;
  registeredAt: string;
  lastSeenAt?: string;
};

export type CameraRelayEnrollment = {
  relayId: string;
  deviceId: string;
  uploadUrl: string;
  healthUrl: string;
  signatureHeader: "x-flock-relay-signature";
  signingKeyStatus: "demo-required" | "server-secret-required";
  instructions: string[];
};

export type CameraRelayUploadRequest = {
  userId: string;
  providerId: CameraProviderId;
  deviceId: string;
  relayId: string;
  motionEventId: string;
  capturedAt: string;
  durationSeconds: number;
  cameraName: string;
  thumbnailUrl?: string;
  clipUrl?: string;
  privacyMode: CameraPrivacyMode;
};
```

## Next Back-End Slice

Turn the account-scoped API boundary into production-authenticated durable state:

- Account ownership checks now wrap camera sync storage in `server/camera-sync-store.js`.
- Store camera device records, connection requests, relay enrollments, relay uploads, clip ingest records, and review items through the camera store.
- Persist sync sessions and reconcile them in the wizard after reload.
- Replace demo relay signatures with server-held relay signing secrets.
- Add provider-specific OAuth handoff routes only after credentials and vendor setup are approved.
- Continue improving loading/error UI around persisted server responses.

The routes should still avoid real credentials until the user explicitly approves credentials/provider setup.

## Source Anchors

- Birdfy support describes motion detection, cloud-saved recorded clips, app settings, and third-party live streaming options: https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/
- Bird Buddy EULA restricts commercial use, reverse engineering, unauthorized access, and app redistribution while allowing user content sharing within terms: https://mybirdbuddy.com/app-eula/
- Ring Developer docs describe official account linking, motion events, webhooks, live video, clips, and certification requirements: https://developer.amazon.com/docs/ring/api-documentation.html
- Google Nest Device Access docs describe camera motion events and WebRTC live stream traits: https://developers.google.com/nest/device-access/api/camera-wired
- Vercel Functions run from the root `api` directory and support JavaScript/TypeScript function files: https://vercel.com/docs/functions/runtimes/node-js
