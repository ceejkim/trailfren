# Flock Real Camera Ingestion Design

Updated: August 17, 2026

## Architecture Decision

Flock should split camera ingestion into two planes:

1. **Cloud product plane**
   - Runs on Vercel or the deployed web app stack.
   - Owns users, friends, privacy settings, device records, clip metadata, sightings, comments, leagues, scoring, and vendor OAuth/webhook endpoints.

2. **Camera edge plane**
   - Runs near the camera when the camera is reachable only on a private local network.
   - Owns RTSP/ONVIF polling, motion events, frame extraction, temporary credentials, and clip upload.
   - Can later be a desktop helper, Home Assistant add-on, NAS container, Raspberry Pi service, or lightweight Node/Python relay.

This avoids pretending Vercel can directly open private home-network streams like `rtsp://192.168.x.x/...`.

## MVP Ingestion Flow

1. User selects camera provider.
2. App explains integration requirement:
   - Manual upload: available now.
   - RTSP/ONVIF: local relay required.
   - Ring/Nest: official cloud API setup required.
   - Bird Buddy/Birdfy: partner/export/share path.
3. User registers a device record.
4. For local cameras, the relay validates stream reachability locally.
5. Relay sends sanitized metadata to Flock:
   - device id
   - relay id
   - motion event id
   - motion event timestamp
   - clip duration
   - thumbnail or uploaded clip URL
   - optional frame samples for bird intelligence
6. Flock requires a relay upload signature before accepting the payload.
7. Flock turns clip metadata into private feed items.
8. Bird intelligence pipeline classifies/reviews clips.
9. League scoring uses verified sightings, not raw motion.

## Implemented Boundary

The current deployed boundary has stateless Vercel routes for:

- `POST /api/cameras/connection-requests`
- `POST /api/cameras/devices`
- `POST /api/cameras/clip-ingests`
- `POST /api/cameras/relay-uploads`
- `GET /api/cameras/:deviceId/status`

The front end has a Device Relay panel that registers a device record and previews a signed relay upload. The result is added to the local demo feed as a private, needs-review clip.

This is not durable account storage yet. It is the API and UX contract that durable storage and real relay signing should attach to.

## Data Model Sketch

```ts
export type CameraDevice = {
  id: string;
  ownerId: string;
  providerId: CameraProviderId;
  providerName: string;
  displayName: string;
  locationLabel: string;
  privacyMode: CameraPrivacyMode;
  connectionStatus: "needs-relay" | "needs-oauth" | "partner-review" | "manual-ready" | "connected" | "paused";
  transport: "rtsp" | "onvif" | "cloud-oauth" | "partner-export" | "manual-upload";
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

export type MotionEvent = {
  id: string;
  deviceId: string;
  startedAt: string;
  endedAt?: string;
  source: "onvif" | "camera-cloud" | "relay-motion" | "manual";
  confidence?: number;
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

## Credential Rule

Browser localStorage can store demo preferences, but not camera secrets.

Allowed:

- provider display choices
- privacy preference
- onboarding step
- redacted endpoint labels
- device id, relay id, and non-secret route URLs

Not allowed:

- RTSP usernames/passwords
- camera admin passwords
- Ring/Nest refresh tokens
- webhook secrets
- signed private media URLs meant to stay secret
- raw private LAN stream URLs

## Local Relay MVP Boundary

The first implementation creates the interface, not a full always-on relay.

Implemented files:

- `src/types.ts`
- `src/cameraApi.ts`
- `src/CameraRelayPanel.tsx`
- `api/cameras/devices.js`
- `api/cameras/relay-uploads.js`
- `docs/local-camera-relay.md`

The relay contract supports:

- device registration
- relay enrollment metadata
- signed motion event payload
- signed clip upload payload
- health status route shape

## Relay API Sketch

```ts
export type RelayHealth = {
  relayId: string;
  version: string;
  status: "online" | "degraded" | "offline";
  checkedAt: string;
};

export type RelayConnectivityTest = {
  deviceId: string;
  ok: boolean;
  transport: "rtsp" | "onvif";
  latencyMs?: number;
  errorCode?: "auth-failed" | "unreachable" | "unsupported" | "timeout";
  redactedEndpoint?: string;
};

export type RelayClipUpload = {
  deviceId: string;
  relayId: string;
  motionEventId: string;
  capturedAt: string;
  durationSeconds: number;
  thumbnailObjectKey?: string;
  clipObjectKey?: string;
  signatureHeader: "x-flock-relay-signature";
};
```

## UX Requirements

For RTSP/ONVIF setup, the UI should say:

- The camera must support RTSP or ONVIF.
- The camera and relay must be on the same local network.
- The web app will not store camera admin credentials.
- Flock will show clips only after the relay uploads motion clips or thumbnails.
- Users can pause ingestion at any time.

For Ring/Nest setup, the UI should say:

- Requires official account connection.
- The user controls permissions at the vendor.
- The app may receive events, clips, or streams only through official scopes.
- Availability depends on vendor review and API limits.

## Day 2 Definition Of Done

- Product UI can represent a real camera device without storing secrets.
- Type contracts exist for devices, streams, motion events, clips, and relay messages.
- Docs explain local relay limitations and deployment responsibilities.
- App builds.
- No private camera feed is connected yet.

## Remaining Day 2 Gap

The next non-blocked implementation should add durable authenticated persistence for device registrations and relay upload records. Real relay signing secrets, camera credentials, and private clip storage remain approval-gated.
