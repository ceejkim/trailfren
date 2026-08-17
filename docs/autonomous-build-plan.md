# Flock / BirdWatch Autonomous Build Plan

Updated: August 17, 2026

## Current State

- GitHub repo: `ceejkim/trailfren`
- Canonical branch: `main`
- Automation working branch: `work`
- Merged MVP PR: `https://github.com/ceejkim/trailfren/pull/3`
- Merged docs/agent PR: `https://github.com/ceejkim/trailfren/pull/10`
- Merged camera sync UX PR: `https://github.com/ceejkim/trailfren/pull/11`
- Merged camera connection/ingest contract PR: `https://github.com/ceejkim/trailfren/pull/12`
- Merged stateless camera API PR: `https://github.com/ceejkim/trailfren/pull/13`
- Merged camera API runtime fixes: `https://github.com/ceejkim/trailfren/pull/14` and `https://github.com/ceejkim/trailfren/pull/15`
- Merged camera device relay upload PR: `https://github.com/ceejkim/trailfren/pull/17`
- Merged camera account sync wizard PR: `https://github.com/ceejkim/trailfren/pull/19`
- Merged camera sync backend architecture PR: `https://github.com/ceejkim/trailfren/pull/20`
- Merged account-scoped camera sync persistence PR: `https://github.com/ceejkim/trailfren/pull/22`
- Latest shipped slice: shared camera sync backend architecture, provider discovery, one-tap sync sessions, device registration, relay signature verification, account-scoped camera persistence, and frontend account-state reconciliation
- Current working slice: durable cloud store/auth provider configuration and production readiness gates
- GitHub tracking issues:
  - Day 1: `https://github.com/ceejkim/trailfren/issues/4`
  - Day 2: `https://github.com/ceejkim/trailfren/issues/5`
  - Day 3: `https://github.com/ceejkim/trailfren/issues/6`
  - Day 4: `https://github.com/ceejkim/trailfren/issues/7`
  - Day 5: `https://github.com/ceejkim/trailfren/issues/8`
- Deployment path: GitHub is synced to Vercel
- Automation: `Flock daily camera integration build lane`
- Schedule: Monday-Friday at 9:00 AM local time for 5 runs
- Canonical project docs:
  - `docs/camera-integrations.md`
  - `docs/camera-ingestion-design.md`
  - `docs/camera-sync-ux.md`
  - `docs/camera-account-sync-wizard.md`
  - `docs/camera-sync-architecture.md`
  - `docs/camera-sync-persistence.md`
  - `docs/camera-production-readiness.md`
  - `docs/agents/README.md`

## What Is Done

- Rebuilt and merged the Flock/BirdWatch MVP into the Trailfren GitHub repo.
- Verified the MVP previously with `npm run build` and browser smoke testing.
- Created an active daily automation against the registered `BirdWatch` Git project.
- Updated the automation to use GitHub as the canonical source of truth.
- Updated the automation to include Vercel deployment awareness.
- Updated the automation to avoid approval prompts during unattended work except for hard gates.
- Created five GitHub tracking issues for the daily build plan.
- Added Day 1 camera integration matrix seed to issue #4.
- Added Day 2 real camera ingestion architecture seed to issue #5.
- Merged the autonomous build docs and agent briefs into `main`.
- Added camera provider selection, privacy defaults, and provider-specific approval CTAs.
- Added connection request and clip ingest TypeScript contracts.
- Added live-tested Vercel routes for connection requests, clip ingest previews, and generic device status.
- Added account-scoped Vercel routes for device registration, relay uploads, sync-session orchestration, account state, and review records.
- Added the account-aware Camera Sync wizard for selecting a camera and pressing one provider-specific sync/approval action.
- Added a shared backend camera sync architecture core for provider capabilities, common camera identification, sync sessions, device registration, relay signatures, and safe secret rejection.
- Added account-state reconciliation so the frontend can restore persisted camera records after reload.
- Added `npm run smoke:camera` for repeatable camera API persistence verification.
- Added a Device Relay panel for account-bound local relay registration and signed relay upload previews.
- Verified the live API rejects sensitive fields such as `password`.

## Current App Shape

The app is a compact Vite + React + TypeScript MVP with:

- Local demo profile/auth-like state
- Friend/follow/invite flows
- Motion-triggered clip feed
- Comments and reactions
- Manual bird sighting logging
- Rarity-based points
- Fantasy-style leaderboard and challenges
- Affiliate-style gear recommendations
- Camera provider onboarding for Birdfy/Netvue, Bird Buddy, Ring, Nest, Reolink, Tapo, supported Wyze, and manual upload
- One-tap account-aware camera sync wizard
- Camera sync session, connection request, device registration, relay upload, and clip ingest contracts
- Account-scoped API routes for camera sync sessions, connection requests, device registration, relay uploads, clip ingest previews, account state, and device status
- Shared server-side provider registry and camera sync architecture core
- Server-side camera sync store with cloud REST, local JSON, and explicit volatile fallback modes
- Frontend camera state reconciliation from `GET /api/cameras/account-state`
- Camera API smoke script for account/store/relay verification

The app does not yet have:

- Real authentication
- Production auth provider wiring
- Configured production cloud store credentials
- Production relay secret configuration
- Ring/Nest OAuth credentials or webhooks
- Bird Buddy/Birdfy partner/export workflows
- Vercel environment variable documentation for vendor credentials
- Production privacy controls for camera feeds
- Real camera feed access or private clip storage

## Operating Rules For Unattended Work

- Build one shippable vertical slice per run.
- Use GitHub as the authoritative source of truth.
- Prefer GitHub-native docs, issue, PR, and metadata updates where practical.
- Use local/worktree checkout only when code editing, package scripts, browser checks, or build verification require it.
- Sync local/worktree checkout from GitHub before editing.
- Commit and push completed slices to GitHub so Vercel can deploy from the repository.
- Read the minimum repo context needed.
- Do not request approval for sandbox/tool escalation.
- Do not invent workarounds when approval, credentials, paid services, or private camera access are required.
- When blocked, mark the item blocked and pivot to the highest-value non-blocked implementation, documentation, test, or product task.
- Prefer official and standards-based integrations only.
- Do not scrape, reverse engineer, bypass vendor limits, or harvest credentials.
- Do not expose private camera feeds without explicit user approval.
- Do not add paid services or sensitive credentials without explicit user approval.
- Report commit SHA, branch, checks, deployment status, blocked items, and next slice.

## Five Main Goals

### Day 1: Camera Integration Architecture

Goal: Turn the placeholder camera selector into a real integration architecture.

Status: Shipped.

Deliverables:

- Provider model for RTSP/ONVIF, Ring, Nest, Bird Buddy, Birdfy/Netvue, Wyze, Reolink, Tapo, and manual upload.
- Integration matrix documenting official capabilities, constraints, privacy risk, and launch phase.
- Camera/device/stream TypeScript contracts.
- Onboarding surface that separates "works now", "requires local network", "requires official cloud API", and "partner/export only".
- Vercel environment variable notes.

Definition of done:

- App still builds.
- No private feed handling is implemented prematurely.
- PR notes explain which cameras are first-class and why.

### Day 2: Real Camera Ingestion MVP

Goal: Add the first real ingestion path without overcommitting cloud complexity.

Status: In progress. Contracts, the one-tap wizard, shared provider architecture, account-scoped persistence boundary, frontend reconciliation, and live-tested API routes are in place; production auth/database configuration and production relay secret management are next.

Deliverables:

- Local RTSP/ONVIF connector skeleton.
- One-tap camera sync session boundary.
- Shared provider capability registry and relay signature architecture.
- Stream registration data model.
- Motion-event data flow.
- Clip metadata shape.
- Mockable clip capture boundary.
- Documentation for why Vercel cannot directly pull local LAN camera streams without an edge/local relay.

Definition of done:

- Demo flow can represent a real RTSP/ONVIF camera setup.
- The connector boundary can later be backed by FFmpeg, ONVIF events, or a local relay.
- No credentials are stored in browser localStorage.

### Day 3: Bird Intelligence Pipeline

Goal: Create the intelligence layer that makes camera footage useful.

Status: architecture boundary shipped locally on August 17, 2026. The next run should harden scoring permissions and background processing, not rebuild the basic contract.

Deliverables:

- Frame extraction pipeline boundary. Implemented as an adapter contract in `server/bird-intelligence-pipeline.js`.
- Bird/no-bird filter adapter interface. Implemented with deterministic fallback scoring and model-provider hard gate.
- Species ID adapter interface. Implemented with swappable suggestions and confidence fields.
- eBird rarity scoring boundary. Documented and wired as a future adapter requiring `EBIRD_API_KEY`.
- Manual correction UX. Implemented in the Cameras tab Bird Review Queue.
- Confidence, review status, and user override fields. Implemented in `birdAnalyses`, `birdCorrections`, and updated `reviewItems`.
- Background-job notes for deployment. Added to `docs/bird-intelligence-pipeline.md`.

Definition of done:

- The product can distinguish raw motion clips from reviewable bird candidates and no-bird events.
- Manual corrections can improve scoring and feed quality.
- Future model/provider swaps are possible without rewiring the app.

Remaining hard gates:

- Private clip object storage before real frame extraction.
- Model provider credentials and quality thresholds.
- eBird API key, regional scoring policy, and sensitive species handling.
- Background queue/runtime for larger media processing.

### Day 4: Hard Popular Camera Integrations

Goal: Add official adapter skeletons for the popular but challenging cameras.

Deliverables:

- Ring official API adapter skeleton with OAuth/webhook placeholders.
- Nest Device Access adapter skeleton with live stream/event placeholders.
- Bird Buddy partner/export/share workflow.
- Birdfy/Netvue partner/export path.
- Wyze RTSP-only support notes for supported models.
- Reolink/Tapo RTSP/ONVIF support notes.
- Vercel env var checklist for cloud API credentials.

Definition of done:

- Each vendor has an honest integration path.
- Anything requiring certification, partner access, credentials, or paid setup is clearly gated.
- Users are not misled into thinking unsupported private cloud APIs are available.

### Day 5: Beta-Ready Product Loop

Goal: Make the app credible as a beta product rather than a demo.

Deliverables:

- Camera onboarding wizard.
- Privacy controls for clips and live feeds.
- Friend sharing permissions.
- League scoring polish.
- Admin/review surface for flagged or low-confidence clips.
- Production readiness checklist.
- Final Vercel deployment verification report.

Definition of done:

- A beta user can understand how to connect a supported camera path.
- Private camera data is treated safely.
- The app has a clear public/preview deployment story.

## Camera Priority Ladder

1. RTSP/ONVIF standards path: Reolink, Tapo, supported Wyze models, and other open local-network cameras.
2. Official cloud APIs: Ring and Nest.
3. Bird-native partner/export paths: Bird Buddy and Birdfy/Netvue.
4. Manual upload/import fallback.

This keeps the app useful early while avoiding fragile or disallowed integrations.

## Approval-Gated Items

These should stay blocked until the user explicitly says yes:

- Adding camera usernames, passwords, refresh tokens, or API secrets.
- Connecting a real private camera feed.
- Publishing private clips publicly.
- Paying for API access, partner programs, hosting tiers, or model inference.
- Completing Ring/Nest developer certification flows.

## Next Best Non-Blocked Tasks

If a future run cannot edit, push, deploy, or authenticate, it should still make progress by:

- Connecting the camera persistence seam to the chosen production auth/database service.
- Adding signed relay upload contracts for RTSP/ONVIF clips.
- Updating docs and integration matrices.
- Adding local TypeScript contracts.
- Building mockable adapter interfaces.
- Improving onboarding copy and state flows.
- Adding tests around scoring and provider selection.
- Creating PR notes with exact blocked items and next actions.

## Token Discipline

Daily runs should begin with only:

- `README.md`
- `docs/autonomous-build-plan.md`
- the active daily GitHub issue
- `docs/agents/build-captain.md`
- exactly one specialist agent brief when needed
- package/deployment files only if code/build work requires them

Broader scans should happen only when the build is blocked or the relevant code path is unclear.
