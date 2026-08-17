# Camera Production Readiness

Updated: August 17, 2026

## Current Status

The camera sync system now has the product/API shape needed for a beta connection flow:

- camera provider registry and common camera set
- one-tap sync wizard
- account-owned sync sessions
- account-owned device and relay records
- relay upload and clip ingest records
- private review items before scoring or sharing
- frontend reconciliation from `GET /api/cameras/account-state`

The remaining production work is configuration and hard-gated integrations, not private API guessing.

## Required Environment Variables

Core account/store variables:

| Variable | Required For | Notes |
|---|---|---|
| `FLOCK_CAMERA_STORE_REST_URL` | durable camera sync storage | REST/Redis-compatible endpoint used by `server/camera-sync-store.js`. |
| `FLOCK_CAMERA_STORE_REST_TOKEN` | durable camera sync storage | Server-only token for the REST store. |
| `FLOCK_CAMERA_STORE_NAMESPACE` | optional storage namespace | Defaults to `flock:camera-sync-state:v1`. |
| `KV_REST_API_URL` | compatible durable store fallback | Supported for Vercel/Redis-style stores when project integration provides this name. |
| `KV_REST_API_TOKEN` | compatible durable store fallback | Supported for Vercel/Redis-style stores when project integration provides this name. |
| `FLOCK_SESSION_SIGNING_SECRET` | signed account ownership | Demo mode works without it, but production account data should require real auth or this server-side seam. |
| `FLOCK_RELAY_SIGNING_SECRET` | production relay HMAC upload verification | Replaces demo relay signatures. |

Future gated variables:

| Variable Group | Required For | Gate |
|---|---|---|
| Ring OAuth and webhook secrets | official Ring adapter | Requires developer setup and approval. |
| Google/Nest OAuth credentials | official Nest adapter | Requires Device Access project setup and approval. |
| Clip object storage credentials | private clip assets | Requires storage choice and privacy review. |
| Birdfy/Bird Buddy partner credentials | partner/export import | Requires partner/export permission. |

## Vercel Setup Notes

Vercel manages project environment variables outside source code and lets teams scope values by environment. For this app, the camera store and signing values must be server-only variables in the Vercel project settings, not browser-exposed `VITE_` variables.

Suggested production sequence:

1. Choose the production account/auth provider.
2. Add `FLOCK_SESSION_SIGNING_SECRET` only if the app is still using the server-signed seam before real auth.
3. Choose a REST/Redis-compatible store and add `FLOCK_CAMERA_STORE_REST_URL` plus `FLOCK_CAMERA_STORE_REST_TOKEN`, or connect a provider that supplies compatible `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
4. Add `FLOCK_RELAY_SIGNING_SECRET`.
5. Redeploy from GitHub/Vercel.
6. Verify production returns `storage.durable: true` from `GET /api/cameras/account-state`.

Official source anchors:

- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel environment variable CLI: https://vercel.com/docs/cli/env
- Redis on Vercel: https://vercel.com/docs/redis

## Verification Checklist

Before calling camera sync production-ready:

- `npm run build`
- `npm run smoke:camera`
- Live `GET /api/cameras/account-state?userId=<test>` returns `storage.durable: true`.
- A sync session survives browser reload.
- A device record survives browser reload.
- A relay upload creates a review item.
- `GET /api/cameras/:deviceId/status?userId=<test>` returns the persisted device.
- Cross-account reads do not expose another account's devices or uploads.
- Sensitive fields are rejected.
- Unredacted RTSP/ONVIF URLs are rejected.
- Demo relay signatures are disabled when `FLOCK_RELAY_SIGNING_SECRET` is set.

## Current Known Production Gap

The live Vercel app currently reports `storage.mode: volatile-memory` and `durable: false` until cloud store variables are configured. This is intentional and visible in API responses and the Camera Sync wizard so beta users are not misled.
