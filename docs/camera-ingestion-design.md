# Flock Real Camera Ingestion Design

Updated: August 16, 2026

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
   - motion event timestamp
   - clip duration
   - thumbnail or uploaded clip URL
   - optional frame samples for bird intelligence
6. Flock turns clip metadata into feed items.
7. Bird intelligence pipeline classifies/reviews clips.
8. League scoring uses verified sightings, not raw motion.

## Data Model Sketch

```ts
export type CameraDevice = {
  id: string;
  ownerId: string;
  providerId: CameraProviderId;
  displayName: string;
  locationLabel: string;
  privacyMode: CameraPrivacyMode;
  connectionStatus: "not-started" | "needs-relay" | "needs-oauth" | "connected" | "paused" | "error";
  lastSeenAt?: string;
};

export type CameraStreamConfig = {
  deviceId: string;
  transport: StreamTransport;
  relayId?: string;
  cloudAccountId?: string;
  redactedEndpoint?: string;
  motionOnly: boolean;
};

export type MotionEvent = {
  id: string;
  deviceId: string;
  startedAt: string;
  endedAt?: string;
  source: "onvif" | "camera-cloud" | "relay-motion" | "manual";
  confidence?: number;
};

export type CameraClipAsset = {
  id: string;
  deviceId: string;
  motionEventId?: string;
  status: "uploading" | "processing" | "ready" | "rejected" | "needs-review";
  thumbnailUrl?: string;
  clipUrl?: string;
  durationSeconds?: number;
  capturedAt: string;
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

Not allowed:

- RTSP usernames/passwords
- camera admin passwords
- Ring/Nest refresh tokens
- webhook secrets
- signed private media URLs meant to stay secret

## Local Relay MVP Boundary

The first implementation should create the interface, not a full always-on relay.

Suggested initial files:

- `src/integrations/camera/providers.ts`
- `src/integrations/camera/types.ts`
- `src/integrations/camera/relayContract.ts`
- `docs/local-camera-relay.md`

The relay contract should support:

- device registration
- connectivity test result
- motion event payload
- clip upload payload
- health heartbeat

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
  motionEventId: string;
  capturedAt: string;
  durationSeconds: number;
  thumbnailObjectKey?: string;
  clipObjectKey?: string;
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
