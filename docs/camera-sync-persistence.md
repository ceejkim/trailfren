# Camera Sync Persistence

Updated: August 17, 2026

## Purpose

Camera sync has to survive reloads, serverless function instances, and future vendor callbacks. The persistence layer turns the previous stateless API contracts into account-owned records without collecting camera passwords, raw RTSP URLs, vendor refresh tokens, or private feed credentials.

## Implemented Files

- `server/camera-sync-store.js`
- `api/cameras/account-state.js`
- `scripts/smoke-camera-routes.mjs`
- `src/App.tsx`
- `src/CameraSyncWizard.tsx`
- `api/cameras/sync-sessions.js`
- `api/cameras/connection-requests.js`
- `api/cameras/devices.js`
- `api/cameras/clip-ingests.js`
- `api/cameras/relay-uploads.js`
- `api/cameras/[deviceId]/status.js`

## Stored Records

The store owns these account-scoped collections:

- `syncSessions`
- `connectionRequests`
- `devices`
- `relayEnrollments`
- `relayUploads`
- `clipIngests`
- `reviewItems`

Relay and clip uploads also create review records, so bird-triggered camera events land in a private review queue before they become scored sightings or shareable items.

## Frontend Reconciliation

The web app calls `GET /api/cameras/account-state?userId=<id>` when the app loads for the current demo account. When records exist, it restores:

- latest sync session
- latest connection request
- latest device and relay enrollment
- latest relay upload or clip ingest
- clip and sighting records from persisted uploads
- camera sync status, provider, relay ids, upload ids, and privacy defaults

The Camera Sync wizard also displays the account store state so a preview deployment cannot silently pretend volatile memory is durable.

## Account Ownership

Every read/write resolves an account context before saving camera state.

Demo mode:

- Used when `FLOCK_SESSION_SIGNING_SECRET` is absent.
- Accepts `userId`, `x-flock-user-id`, or `?userId=`.
- Labels responses with `authMode: demo-unsigned`.
- Suitable for local demos and preview testing only.

Signed server mode:

- Enabled by `FLOCK_SESSION_SIGNING_SECRET`.
- Requires `x-flock-user-id`.
- Requires `x-flock-session-signature`.
- Signature format: HMAC-SHA256 of the user id using `FLOCK_SESSION_SIGNING_SECRET`.
- Intended as the server-side seam that a real auth provider can replace or wrap.

Production auth should come from the app's real session provider before private clips, OAuth tokens, vendor webhooks, or paid services are attached.

## Store Modes

`cloud-rest`

- Enabled by `FLOCK_CAMERA_STORE_REST_URL` plus `FLOCK_CAMERA_STORE_REST_TOKEN`.
- Also accepts compatible `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars.
- Uses Redis-style REST commands with `["GET", namespace]` and `["SET", namespace, json]`.
- Namespace defaults to `flock:camera-sync-state:v1` and can be changed with `FLOCK_CAMERA_STORE_NAMESPACE`.

`local-json`

- Used for local development when no cloud store is configured.
- Writes `.flock-camera-store.local.json`.
- The file is ignored by Git.

`volatile-memory`

- Used in production when no cloud store is configured.
- Keeps demos working but is not durable across function instances.
- API responses label this mode and include the next deployment step.

## Verification Shape

A durable setup should prove:

- `npm run smoke:camera` passes locally.
- `POST /api/cameras/sync-sessions` creates an account-owned sync session.
- `POST /api/cameras/devices` creates an account-owned device and relay enrollment.
- `POST /api/cameras/relay-uploads` creates a relay upload plus a review item.
- `GET /api/cameras/account-state?userId=<id>` returns the saved records for that account only.
- `GET /api/cameras/:deviceId/status?userId=<id>` reflects the persisted device record.
- Sensitive fields such as `password`, `token`, `secret`, and unredacted RTSP/ONVIF URLs are rejected.
- A browser reload restores camera sync state from account-state instead of only from localStorage.

## Still Gated

- Real app auth provider selection and session minting.
- Cloud store credentials in Vercel.
- `FLOCK_RELAY_SIGNING_SECRET` for production relay HMAC verification.
- Private clip object storage.
- Ring/Nest OAuth credentials and webhook secrets.
- Birdfy/Bird Buddy partner or export access.
