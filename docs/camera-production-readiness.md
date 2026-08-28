# Camera Production Readiness

Updated: August 17, 2026

## Current Status

The camera sync system now has the product/API shape needed for a beta connection flow:

- camera provider registry and common camera set
- one-tap sync wizard
- account-owned sync sessions
- account-owned device and relay records
- account-owned relay manifests for local camera agents
- relay upload and clip ingest records
- private review items before scoring or sharing
- frontend reconciliation from `GET /api/cameras/account-state`
- provider adapter contracts exposed by `GET /api/cameras/provider-adapters`
- Ring/Nest gated OAuth and event/webhook route placeholders
- Birdfy/Bird Buddy partner/export request routes
- Wyze RTSP model-check route

The remaining production work is configuration and hard-gated integrations, not private API guessing.

## Required Environment Variables

Authentication variables:

| Variable | Required For | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | browser auth | Supabase project URL exposed to the Vite client. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser auth | Supabase publishable/anon key exposed to the Vite client. |
| `VITE_AUTH_REDIRECT_URL` | browser auth redirect | Canonical app URL used for OAuth redirects. Must be allowlisted in Supabase. |
| `SUPABASE_URL` | server auth | Supabase project URL used by Vercel functions to verify bearer tokens. Can match `VITE_SUPABASE_URL`. |
| `SUPABASE_PUBLISHABLE_KEY` | server auth | Supabase publishable/anon key used by Vercel functions for `auth.getUser(jwt)`. Can match `VITE_SUPABASE_PUBLISHABLE_KEY`. |
| `FLOCK_REQUIRE_AUTH` | camera account auth gate | Set to `true` for preview and production once Supabase variables are present. Missing bearer tokens then return `401` instead of demo fallback records. |

Core account/store variables:

| Variable | Required For | Notes |
|---|---|---|
| `FLOCK_CAMERA_STORE_REST_URL` | durable camera sync storage | REST/Redis-compatible endpoint used by `server/camera-sync-store.js`. |
| `FLOCK_CAMERA_STORE_REST_TOKEN` | durable camera sync storage | Server-only token for the REST store. |
| `FLOCK_CAMERA_STORE_NAMESPACE` | optional storage namespace | Defaults to `flock:camera-sync-state:v1`. |
| `KV_REST_API_URL` | compatible durable store fallback | Supported for Vercel/Redis-style stores when project integration provides this name. |
| `KV_REST_API_TOKEN` | compatible durable store fallback | Supported for Vercel/Redis-style stores when project integration provides this name. |
| `FLOCK_SESSION_SIGNING_SECRET` | signed account ownership fallback | Use only for non-Supabase server-signed test seams. Do not rely on it for the 50-user beta when Supabase auth is configured. |
| `FLOCK_RELAY_SIGNING_SECRET` | per-relay key derivation and upload verification | Server-only root material. It derives a distinct relay key at enrollment; the displayed relay key is never persisted or returned by manifests. |

Future gated variables:

| Variable | Required For | Gate |
|---|---|---|
| `FLOCK_RING_CLIENT_ID` | official Ring adapter | Requires developer setup and approval. |
| `FLOCK_RING_CLIENT_SECRET` | official Ring adapter | Server-only OAuth secret. |
| `FLOCK_RING_REDIRECT_URI` | official Ring adapter | Must match the Vercel callback URL registered with Ring. |
| `FLOCK_RING_WEBHOOK_SECRET` | official Ring adapter | Required before accepting Ring motion webhooks. |
| `FLOCK_GOOGLE_CLIENT_ID` | official Nest adapter | Requires Device Access project setup and approval. |
| `FLOCK_GOOGLE_CLIENT_SECRET` | official Nest adapter | Server-only OAuth secret. |
| `FLOCK_NEST_REDIRECT_URI` | official Nest adapter | Must match the Vercel callback URL registered with Google. |
| `FLOCK_NEST_DEVICE_ACCESS_PROJECT_ID` | official Nest adapter | Required for Device Access commands/events. |
| `FLOCK_GOOGLE_PUBSUB_TOPIC` | official Nest adapter | Required for production event ingestion. |
| `FLOCK_CLIP_STORAGE_BUCKET` | private clip assets | Requires storage choice and privacy review. |

## Vercel Setup Notes

Vercel manages project environment variables outside source code and lets teams scope values by environment. For this app, the camera store and signing values must be server-only variables in the Vercel project settings, not browser-exposed `VITE_` variables.

Suggested production sequence:

1. Configure Supabase Auth providers for Google/Gmail, Apple, and phone OTP. Phone OTP requires an SMS provider and rate-limit/CAPTCHA settings before public beta.
2. In Supabase URL Configuration, set the production Site URL and allowlist local, preview, and production redirect URLs. Use exact production URLs; reserve wildcard patterns for local and Vercel previews.
3. Add the browser and server Supabase variables above in Vercel.
4. Set `FLOCK_REQUIRE_AUTH=true` in Vercel preview and production after the Supabase variables are present.
5. Choose a REST/Redis-compatible store and add `FLOCK_CAMERA_STORE_REST_URL` plus `FLOCK_CAMERA_STORE_REST_TOKEN`, or connect a provider that supplies compatible `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
6. Add `FLOCK_RELAY_SIGNING_SECRET`, then enroll each relay and store its one-time displayed signing key only in that local relay.
7. Redeploy from GitHub/Vercel.
8. Verify production returns `account.authenticated: true`, `authMode: supabase-auth`, and `storage.durable: true` from `GET /api/cameras/account-state` when called with a signed-in user's bearer token.
9. Verify unsigned requests to camera account routes return `401` when `FLOCK_REQUIRE_AUTH=true`.

Official source anchors:

- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel environment variable CLI: https://vercel.com/docs/cli/env
- Redis on Vercel: https://vercel.com/docs/redis
- Supabase `auth.getUser(jwt)` server verification: https://supabase.com/docs/reference/javascript/auth-getuser
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase phone login: https://supabase.com/docs/guides/auth/phone-login
- Supabase auth rate limits: https://supabase.com/docs/guides/auth/rate-limits

## Readiness Response

`GET /api/cameras/account-state` returns a `readiness` object with:

- `status`: `mvp-blocked`, `field-test-ready`, or `beta-infra-ready`
- `summary`: plain-language release state
- `blockers`: hard configuration or infrastructure blockers
- `attention`: important non-blocking gates
- `checks`: auth, storage, owner-scoped records, relay signing, private clip storage, and field-test checks

This is intentionally conservative. A preview can work while still reporting
that MVP beta is blocked.

## Verification Checklist

Before calling camera sync production-ready:

- `npm run build`
- `npm run smoke:camera`
- Google/Gmail sign-in redirects back to the app and loads the signed-in profile.
- Apple sign-in redirects back to the app and loads the signed-in profile.
- Phone OTP sends and verifies a code.
- Signed camera API requests derive account ownership from the verified Supabase user id.
- With `FLOCK_REQUIRE_AUTH=true`, missing bearer tokens return `401` and do not create fallback success records.
- Expired or invalid bearer tokens return an auth error and do not create fallback success records.
- Mismatched body/query user claims return `403` when they disagree with the verified Supabase user.
- `GET /api/cameras/provider-adapters` returns adapter contracts and the Vercel env checklist.
- Live `GET /api/cameras/account-state` with the signed-in user's bearer token returns `authMode: supabase-auth` and `storage.durable: true`.
- Live `GET /api/cameras/account-state` returns a `readiness` object with no unexpected blockers.
- A sync session survives browser reload.
- A device record survives browser reload.
- A relay manifest is created for local relay providers and survives browser reload.
- A relay upload creates a review item.
- `GET /api/cameras/:deviceId/status?userId=<test>` returns the persisted device.
- Cross-account reads do not expose another account's devices or uploads.
- Sensitive fields are rejected.
- Unredacted RTSP/ONVIF URLs are rejected.
- Demo relay signatures are disabled when `FLOCK_RELAY_SIGNING_SECRET` is set.
- A production relay upload uses a per-relay HMAC key, not the root secret. An authenticated device owner can rotate `/api/cameras/relay-credentials/rotate`; confirm it invalidates the prior key before a field test.

## Current Known Production Gap

The live Vercel app currently reports `storage.mode: volatile-memory` and `durable: false` until cloud store variables are configured. This is intentional and visible in API responses and the Camera Sync wizard so beta users are not misled.
