# Local Camera Relay Handoff

Updated: August 17, 2026

## Purpose

A Flock relay is the user-owned edge process that makes RTSP/ONVIF cameras usable without exposing a private home network to Vercel.

The relay runs near the camera, watches motion events, cuts or receives short clips, and uploads only sanitized clip metadata, thumbnails, or approved clip assets to Flock.

## Current Contract

The current app and API support a demo-safe relay contract:

1. User selects a local-relay provider such as Reolink, Tapo, or supported Wyze.
2. User registers a device record in the Cameras tab.
3. Flock returns a relay enrollment shape:
   - `relayId`
   - `deviceId`
   - `uploadUrl`
   - `healthUrl`
   - `signatureHeader`
   - `signingKeyStatus`
4. User creates a relay manifest for the registered device.
5. The relay uses that manifest to know the upload route, health route, signature format, required upload fields, and local-only credential boundary.
6. Relay sends a signed motion upload to `POST /api/cameras/relay-uploads`.
7. Flock creates a private, needs-review clip and sighting payload.

## API Routes

- `POST /api/cameras/devices`
  - Registers a demo-safe camera device shape.
  - Accepts provider, display name, location label, privacy mode, and motion preference.
  - Rejects password, secret, token, API key, refresh, and unredacted endpoint fields.

- `POST /api/cameras/relay-manifests`
  - Creates an account-owned relay manifest for Reolink, Tapo, and supported Wyze local relay flows.
  - Requires a registered `deviceId` and `relayId`.
  - Returns the upload route, health route, signature format, required JSON fields, sample payload, sample signature, and local-only camera credential boundary.
  - Rejects non-relay providers, password/secret/token fields, and unredacted RTSP/ONVIF endpoints.

- `POST /api/cameras/relay-uploads`
  - Requires `x-flock-relay-signature`.
  - Accepts sanitized motion upload metadata.
  - Returns a needs-review clip and sighting payload.

- `GET /api/cameras/:deviceId/status`
  - Returns a generic device status shape.
  - Does not list or expose stored user camera records.

## Local Responsibilities

The future relay owns:

- RTSP/ONVIF camera reachability checks.
- Camera credentials on the user's machine or trusted local device.
- Motion event polling or subscription.
- Clip trimming and thumbnail extraction.
- Upload retry and health reporting.

## Cloud Responsibilities

The Vercel app/API owns:

- Account-owned device records.
- Relay enrollment metadata.
- Account-owned relay manifests.
- Signed upload verification.
- Private clip metadata and review status.
- Bird intelligence and scoring after upload.

## Hard Gates

Do not implement these without explicit approval:

- Storing real camera usernames or passwords.
- Connecting a real private camera feed.
- Storing real relay signing secrets.
- Uploading private clip assets to production storage.
- Adding paid storage, queues, or inference services.

## Next Slice

Connect the camera store to production auth and durable cloud storage for:

- camera devices
- relay enrollments
- connection requests
- relay upload records
- clip review state

Then replace demo signatures with server-held relay signing secrets.
