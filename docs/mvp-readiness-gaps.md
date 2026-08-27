# MVP Readiness Gaps

Updated: August 27, 2026

## Current Progress

- GitHub remote is `ceejkim/trailfren`.
- The app now has a Supabase Auth login gate for Google/Gmail, Apple, and phone OTP.
- Browser and server Supabase environment variables are documented.
- Camera account APIs can now be put into Supabase-only mode with `FLOCK_REQUIRE_AUTH=true`, which rejects unsigned account reads/writes instead of falling back to demo `userId` claims.
- Vercel/runtime Node target is `22.x` to match current Supabase client requirements.
- Existing camera API contracts still pass `npm run smoke:camera`.
- Dependency audit is clean after the Vite 8 upgrade.
- `GET /api/cameras/account-state` now returns an explicit `readiness` summary for auth, durable storage, owner-scoped records, relay signing, private clip storage, and field-test gates.
- Production auth, data infrastructure, privacy, and camera field-test checklists now live in:
  - `docs/auth-production-checklist.md`
  - `docs/beta-data-infrastructure.md`
  - `docs/privacy-sharing-beta-rules.md`
  - `docs/camera-field-test-plan.md`

## Core Gaps Before MVP Beta

1. Configure Supabase Auth in production.
   - Add Google and Apple OAuth providers.
   - Configure phone OTP with an SMS provider, CAPTCHA, and rate limits.
   - Add allowed redirect URLs for local, preview, and production deployments.

2. Add production environment variables in Vercel.
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_AUTH_REDIRECT_URL`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `FLOCK_REQUIRE_AUTH=true`
   - durable camera store variables until the store is moved to Postgres records.

3. Replace blob-style camera persistence with per-owner records.
   - Current cloud REST storage writes one namespaced JSON document.
   - MVP should use owner-scoped records with row-level security and atomic writes.
   - Keep `GET /api/cameras/account-state` as the frontend aggregation boundary.
   - Use `docs/beta-data-infrastructure.md` as the target Supabase table/RLS plan.

4. Add private clip media storage.
   - Use private object storage keyed by owner, device, and motion event.
   - Store object keys instead of public clip URLs.
   - Add signed URL access, file size/MIME validation, retention, and deletion.
   - Accept no real beta clips until storage and deletion behavior are explicit.
   - Routes now reject public media URLs and retain only validated owner-scoped
     object keys marked `signed-url-required`; actual storage upload, signed URL,
     validation, retention, and deletion work is still blocked.

5. Harden relay ingestion before real cameras.
   - Replace global relay signing with per-relay revocable secrets.
   - Add replay protection and idempotency for `(deviceId, motionEventId)`.
   - Verify device ownership before accepting uploads.

6. Expand authenticated API coverage.
   - Signed-in users now carry bearer tokens to camera routes.
   - `FLOCK_REQUIRE_AUTH=true` prevents missing bearer tokens from creating demo fallback records.
   - Local camera smoke coverage verifies valid bearer ownership, expired-token rejection, mismatched-owner claims, and cross-account isolation through the camera API boundary.
   - Next step is a deployed Supabase bearer-token round trip using real beta accounts.

7. Finish deployment readiness.
   - Confirm Vercel runs Node 22 for the project.
   - Configure Supabase and storage env vars for preview and production.
   - Verify a production login round trip and `GET /api/cameras/account-state` with a real bearer token.
   - Confirm the account-state `readiness` response has no hard blockers except real camera field-test outcomes.

8. Keep vendor integrations gated.
   - Ring and Nest OAuth/webhooks still require official setup, credentials, and review.
   - Birdfy and Bird Buddy should stay on partner/export/share/import paths until official access exists.

9. Run real camera field tests.
   - Follow `docs/camera-field-test-plan.md`.
   - Capture provider, model, app/firmware version, what worked, what failed, battery/privacy concerns, and MVP decision.
