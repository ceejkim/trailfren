# Camera Sync Architecture

Updated: August 17, 2026

## Architecture Goal

Flock should make camera sync feel simple to users while routing each camera through the safest technically real path:

1. User has a Flock account.
2. User chooses the camera ecosystem they own.
3. Flock creates a sync session from the provider capability registry.
4. The sync session chooses one of four paths:
   - local relay for RTSP/ONVIF cameras
   - official OAuth/webhook path for Ring/Nest-style cloud cameras
   - partner/export/share/import path for bird-native cameras without public APIs
   - manual upload fallback
5. Devices, relay enrollments, uploads, and review records become account-owned backend records.
6. Bird-triggered uploads enter private review before scoring or sharing.

## Implemented Server-Side Core

The shared server architecture lives in:

- `server/camera-sync-architecture.js`

It centralizes:

- common camera provider registry
- common camera watchlist
- sync session creation
- device registration creation
- sensitive-field rejection
- private RTSP/ONVIF endpoint rejection
- relay signature verification
- demo-prefix signatures when no server secret is configured
- HMAC relay signatures when `FLOCK_RELAY_SIGNING_SECRET` is configured

Routes using this core:

- `GET /api/cameras/providers`
- `POST /api/cameras/sync-sessions`
- `POST /api/cameras/devices`
- `POST /api/cameras/relay-uploads`

## Common Camera Set

The first supported set is:

| Provider | Sync Path | Why |
|---|---|---|
| Birdfy / Netvue | partner/export/share/import | Bird-native and popular, but no public developer API is documented. |
| Bird Buddy | partner/export/share/import | Bird-native and popular, but automation requires permission and terms-aware access. |
| Reolink | local relay | Strong standards-based RTSP/ONVIF target. |
| Tapo | local relay | Strong standards-based RTSP/ONVIF target for many wired models. |
| Wyze supported RTSP models | local relay | Popular, but model/firmware-specific. |
| Ring | official cloud OAuth/webhook | Popular and technically challenging; requires official setup and review. |
| Google Nest Cam | official Device Access | Popular and technically challenging; requires official setup and review. |
| Manual upload | fallback | Always works while automation matures. |

The watchlist is exposed by `GET /api/cameras/providers` and currently includes FeatherSnap, Green Feathers, Eufy, Arlo, and Blink. These should not be advertised as automatic sync until official access, export, RTSP/ONVIF, or another safe integration path is confirmed.

## Relay Signature Architecture

Relay uploads require `x-flock-relay-signature`.

Current modes:

- Demo mode, when `FLOCK_RELAY_SIGNING_SECRET` is absent:
  - accepts `demo-<deviceId>-<motionEventId>` prefix signatures
  - useful for Vercel-safe preview and local testing only
- Server HMAC mode, when `FLOCK_RELAY_SIGNING_SECRET` is set:
  - expects `sha256=<hmac(deviceId.relayId.motionEventId)>`
  - uses a server-held secret, never a browser secret
  - compares signatures with `timingSafeEqual`

This creates the real production seam for a user-owned relay without storing RTSP usernames, passwords, or stream URLs in Flock.

## Account-Owned Records

The current routes still return stateless records, but their shapes are the intended durable backend model:

- `CameraSyncSession`
- `CameraDevice`
- `CameraRelayEnrollment`
- `CameraRelayUploadResult`
- `CameraClipIngestResult`

The next backend slice should persist these behind authenticated account ownership. A database is required before the app can truly remember sync sessions/devices across Vercel instances.

## What Stays Gated

- Real camera usernames/passwords
- Unredacted RTSP/ONVIF URLs
- Ring/Nest OAuth credentials
- Vendor refresh tokens
- Private live feed access
- Private clip asset storage
- Paid vendor programs or model inference
- Scraping or private API reverse engineering

## Source Anchors

- Birdfy app/support materials describe app-managed camera footage and cloud/local storage features, but no public developer API path is documented.
- Bird Buddy terms require permission-aware use and rule out unauthorized automation.
- Reolink documents CGI/RTSP/ONVIF support by camera model.
- Tapo documents RTSP/ONVIF support for many wired models and model-specific caveats.
- Ring publishes an official developer path for account authorization, events, webhooks, and video.
- Google Nest Device Access documents official camera events and stream traits for supported cameras.
