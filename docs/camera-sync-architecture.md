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
- `server/camera-provider-adapters.js`
- `server/camera-sync-store.js`

It centralizes:

- common camera provider registry
- provider-specific adapter contracts
- Vercel environment variable checklist for hard camera integrations
- common camera watchlist
- sync session creation
- device registration creation
- sensitive-field rejection
- private RTSP/ONVIF endpoint rejection
- relay signature verification
- demo-prefix signatures when no server secret is configured
- HMAC relay signatures when `FLOCK_RELAY_SIGNING_SECRET` is configured
- account ownership context for camera records
- pluggable camera sync persistence for cloud REST stores, local development, and explicit volatile demos

Routes using this core:

- `GET /api/cameras/account-state`
- `GET /api/cameras/providers`
- `GET /api/cameras/provider-adapters`
- `POST /api/cameras/sync-sessions`
- `POST /api/cameras/connection-requests`
- `POST /api/cameras/devices`
- `POST /api/cameras/clip-ingests`
- `POST /api/cameras/relay-uploads`
- `GET /api/cameras/:deviceId/status`
- `GET /api/cameras/ring/oauth/start`
- `POST /api/cameras/ring/webhooks`
- `GET /api/cameras/nest/oauth/start`
- `POST /api/cameras/nest/events`
- `POST /api/cameras/birdfy/partner-request`
- `POST /api/cameras/bird-buddy/partner-request`
- `POST /api/cameras/wyze/model-check`

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

## Provider Adapter Layer

The adapter layer turns the provider registry into stable cloud contracts:

- official cloud adapters for Ring and Nest
- partner/export adapters for Birdfy and Bird Buddy
- local relay adapters for Reolink, Tapo, and supported Wyze models
- a Wyze model-check route before relay setup
- manual upload as the permanent fallback

These routes are intentionally honest placeholders where provider credentials, certification, or partner access are missing. They return gated statuses and missing environment-variable details instead of pretending a private camera cloud is connected.

See `docs/camera-provider-adapters.md` for the full contract.

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

The routes now persist account-owned camera records through `server/camera-sync-store.js`:

- `CameraSyncSession`
- `CameraConnectionRequest`
- `CameraDevice`
- `CameraRelayEnrollment`
- `CameraRelayUploadResult`
- `CameraClipIngestResult`
- `CameraReviewRecord`

Each record is stored under the resolved account owner. In demo mode, the owner comes from `userId`, `x-flock-user-id`, or `?userId=` and the response marks `authMode: demo-unsigned`. When `FLOCK_SESSION_SIGNING_SECRET` is configured, write/read requests must include `x-flock-user-id` and `x-flock-session-signature`, where the signature is an HMAC of the user id. This is the server-side auth seam; production should replace or wrap it with the real app auth provider before private camera data is stored.

Storage modes:

- `cloud-rest`: enabled by `FLOCK_CAMERA_STORE_REST_URL` plus `FLOCK_CAMERA_STORE_REST_TOKEN`, or compatible `KV_REST_API_URL`/`KV_REST_API_TOKEN` env vars. This is the deployable durable path for Vercel-style serverless functions.
- `local-json`: local development store in `.flock-camera-store.local.json`, ignored by Git.
- `volatile-memory`: production fallback when no cloud store is configured. Responses label this as non-durable so it cannot be confused with production persistence.

`GET /api/cameras/account-state` returns the account-owned sync sessions, requests, devices, relay enrollments, relay uploads, clip ingests, and review queue items for the resolved account.

See `docs/camera-sync-persistence.md` for deployment and verification details.

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

- Birdfy app/support materials describe app-managed camera footage and cloud storage features, but no public developer API path is documented: https://support.birdfy.com/help/birdfy-app/Introduction-BirdfyApp/
- Bird Buddy supports user-owned photo/video postcards and sharing/export-style workflows: https://support.mybirdbuddy.com/hc/en-us/articles/9175854254865-Postcards-Collecting-Photos-and-Videos
- Reolink documents CGI/RTSP/ONVIF support by camera model: https://support.reolink.com/articles/900000617826-Which-Reolink-Products-Support-CGI-RTSP-ONVIF/
- Tapo documents RTSP/ONVIF support for many wired models and model-specific caveats: https://www.tp-link.com/us/support/faq/2680/
- Wyze documents model-specific RTSP support: https://support.wyze.com/hc/en-us/articles/360026245231-Wyze-Cam-RTSP
- Ring publishes an official developer path for account authorization, events, webhooks, and video: https://developer.amazon.com/docs/ring/api-documentation.html
- Google Nest Device Access documents official camera events and stream traits for supported cameras: https://developers.google.com/nest/device-access/api/camera-wired
