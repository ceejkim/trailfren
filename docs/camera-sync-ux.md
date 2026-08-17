# Camera Sync User Flow

Updated: August 17, 2026

## Product Promise

A user should be able to create a Flock account, choose the camera they own, approve the safest available connection path, and have bird-triggered motion clips appear privately in BirdWatch/Flock for review, scoring, and sharing.

## UX Flow

1. Create or sign in to Flock.
2. Open Cameras.
3. Select camera provider.
4. Click the provider-specific sync button.
5. Flock routes the user to the correct connection path:
   - Official account link for Ring and Nest.
   - Local relay setup for RTSP/ONVIF cameras such as Reolink, Tapo, and supported Wyze models.
   - Partner/export/share/import path for Birdfy and Bird Buddy until official developer access exists.
   - Manual upload fallback for every provider.
6. New clips default to private.
7. Motion-triggered clips enter the bird review pipeline before scoring or sharing.

## Implemented Front-End Boundary

The current app now has:

- Provider selection in the Cameras tab.
- A provider-specific sync/approval CTA.
- A `CameraConnectionRequest` contract created by the sync button.
- Callback paths for official OAuth, local relay, partner/export request, and manual upload modes.
- A next-step message for each integration mode.
- A demo `CameraClipIngestRequest` flow that creates a private clip and sighting pending review.
- Best-effort POST calls from the browser boundary to the deployed camera API routes.
- Persistent local demo state for the latest request and latest ingest result.

This proves the user flow and API shape without collecting real camera credentials or pretending that unsupported vendor APIs exist.

## Implemented Back-End Boundary

The current backend boundary is implemented as stateless Vercel functions:

- `POST /api/cameras/connection-requests`
- `POST /api/cameras/clip-ingests`
- `GET /api/cameras/:deviceId/status`

The routes intentionally do not persist or list user camera records yet. They validate the supported provider, reject sensitive fields such as passwords, secrets, tokens, API keys, and refresh values, and return safe demo objects that match the front-end contracts.

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
- Provider-specific sync CTA
- Connection status
- Privacy default
- Motion auto-upload preference
- Provider limitations
- Shared motion upload pipeline
- Mock ingest preview for approved motion uploads

The current front-end does not collect secrets or connect to real cameras yet.

## Back-End Contract

Implemented in `src/types.ts`, `src/cameraApi.ts`, `server/cameraStore.ts`, and the root `api/` routes.

```ts
export type CameraConnectionRequest = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  mode: "partner-request" | "official-oauth" | "local-relay" | "manual-upload";
  status: "queued" | "oauth-started" | "relay-required" | "partner-review" | "manual-ready";
  requestedAt: string;
  privacyMode: CameraPrivacyMode;
  motionUploadsEnabled: boolean;
  nextStep: string;
  callbackPath: string;
};

export type CameraClipIngestRequest = {
  id: string;
  userId: string;
  providerId: CameraProviderId;
  providerName: string;
  deviceId: string;
  cameraName: string;
  capturedAt: string;
  durationSeconds: number;
  motionEventId?: string;
  thumbnailUrl?: string;
  clipUrl?: string;
  privacyMode: CameraPrivacyMode;
};
```

## Next Back-End Slice

Turn the stateless API boundary into authenticated durable state:

- Add account/auth ownership checks before any camera data is stored.
- Store camera device records, connection requests, and clip ingest records in a database.
- Add a signed relay upload contract for RTSP/ONVIF cameras.
- Add provider-specific OAuth handoff routes only after credentials and vendor setup are approved.
- Add loading/error UI that reconciles the front-end state with server responses.

The routes should still avoid real credentials until the user explicitly approves credentials/provider setup.

## Source Anchors

- Birdfy support describes motion detection, cloud-saved recorded clips, app settings, and third-party live streaming options: https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/
- Bird Buddy EULA restricts commercial use, reverse engineering, unauthorized access, and app redistribution while allowing user content sharing within terms: https://mybirdbuddy.com/app-eula/
- Ring Developer docs describe official account linking, motion events, webhooks, live video, clips, and certification requirements: https://developer.ring.com/
- Google Nest Device Access docs describe camera motion events and WebRTC live stream traits: https://developers.google.com/nest/device-access/api/camera-wired
- Vercel Node.js Functions support TypeScript functions in the root `api` directory: https://vercel.com/docs/functions/runtimes/node-js
