# Auth Production Checklist

Updated: August 23, 2026

## Goal

Trailfren login is code-ready for Supabase Auth, but production login is not real
until Supabase providers, Vercel environment variables, and deployed redirect
URLs are configured and verified.

## Required Vercel Variables

Browser-exposed auth variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_AUTH_REDIRECT_URL`

Server auth variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `FLOCK_REQUIRE_AUTH=true`

Camera state and relay variables:

- `FLOCK_CAMERA_STORE_REST_URL` or `KV_REST_API_URL`
- `FLOCK_CAMERA_STORE_REST_TOKEN` or `KV_REST_API_TOKEN`
- `FLOCK_CAMERA_STORE_NAMESPACE`
- `FLOCK_RELAY_SIGNING_SECRET`

Private clip storage gate:

- `FLOCK_CLIP_STORAGE_BUCKET`

Do not put server-only tokens in `VITE_` variables. Anything prefixed with
`VITE_` is available to the browser.

## Supabase Dashboard Setup

1. Set the production Site URL to the deployed Vercel URL.
2. Add local, preview, and production redirect URLs to the Supabase allowlist.
3. Enable Google OAuth for Gmail sign-in.
4. Enable Apple OAuth.
5. Enable phone OTP with an SMS provider.
6. Set rate limits appropriate for a small beta.
7. Enable CAPTCHA or equivalent abuse protection before inviting beta users.
8. Confirm provider display names and legal/privacy links are production-safe.

## Verification

Run these after Vercel redeploys:

- `GET /api/cameras/account-state` without a bearer token returns `401`.
- Google/Gmail login redirects back to Trailfren and loads the signed-in app.
- Apple login redirects back to Trailfren and loads the signed-in app.
- Phone OTP sends a code and verifies a session.
- Signed `GET /api/cameras/account-state` returns:
  - `account.authenticated: true`
  - `account.authMode: supabase-auth`
  - `readiness.checks` includes auth, storage, relay, clip storage, and field-test gates
- A mismatched `userId` in body/query/header returns `403`.
- An expired or malformed bearer token returns an auth error.

## Stop Gates

Do not invite beta users until:

- Supabase provider login has been tested on the deployed URL.
- `FLOCK_REQUIRE_AUTH=true` is set in Vercel preview and production.
- Unsigned camera account reads/writes return `401`.
- Private clips are not publicly exposed by default.
- The privacy and deletion rules in `docs/privacy-sharing-beta-rules.md` are accepted.
