# Flock / BirdWatch Autonomous Build Plan

Updated: August 16, 2026

## Current State

- GitHub repo: `ceejkim/trailfren`
- Active branch: `work`
- Local BirdWatch branch: `upload/flock-mvp`, tracking `origin/work`
- Latest pushed commit: `9f6c191` (`Build Flock bird camera social MVP`)
- Draft PR: `https://github.com/ceejkim/trailfren/pull/3`
- GitHub tracking issues:
  - Day 1: `https://github.com/ceejkim/trailfren/issues/4`
  - Day 2: `https://github.com/ceejkim/trailfren/issues/5`
  - Day 3: `https://github.com/ceejkim/trailfren/issues/6`
  - Day 4: `https://github.com/ceejkim/trailfren/issues/7`
  - Day 5: `https://github.com/ceejkim/trailfren/issues/8`
- Deployment path: GitHub is synced to Vercel
- Automation: `Flock daily camera integration build lane`
- Schedule: Monday-Friday at 9:00 AM local time for 5 runs
- Supporting deliverables in this task:
  - `flock_camera_integration_matrix.md`
  - `flock_camera_ingestion_design.md`

## What Is Done

- Rebuilt and pushed the Flock/BirdWatch MVP into the Trailfren GitHub repo.
- Created a draft PR against `main`.
- Confirmed the local repo is clean on the pushed branch.
- Verified the app previously with `npm run build` and browser smoke testing.
- Created an active daily automation against the registered `BirdWatch` Git project.
- Updated the automation to include Vercel deployment awareness.
- Updated the automation to avoid approval prompts during unattended work.
- Created five GitHub tracking issues for the daily build plan.
- Added Day 1 camera integration matrix seed to issue #4.
- Added Day 2 real camera ingestion architecture seed to issue #5.

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
- A placeholder camera provider selector

The app does not yet have:

- A backend
- Real authentication
- Real camera device persistence
- RTSP/ONVIF ingestion
- Ring/Nest OAuth or webhooks
- Bird Buddy/Birdfy partner/export workflows
- Vercel environment variable documentation
- Production privacy controls for camera feeds

## Operating Rules For Unattended Work

- Build one shippable vertical slice per run.
- Read the minimum repo context needed.
- Do not request approval for sandbox/tool escalation.
- Do not invent workarounds when approval, credentials, paid services, or private camera access are required.
- When blocked, mark the item blocked and pivot to the highest-value non-blocked implementation, documentation, test, or product task.
- Prefer official and standards-based integrations only.
- Do not scrape, reverse engineer, bypass vendor limits, or harvest credentials.
- Do not expose private camera feeds without explicit user approval.
- Do not add paid services or sensitive credentials without explicit user approval.
- Let GitHub trigger Vercel after each push.
- Report commit SHA, branch, checks, deployment status, blocked items, and next slice.

## Five Main Goals

### Day 1: Camera Integration Architecture

Goal: Turn the placeholder camera selector into a real integration architecture.

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

Deliverables:

- Local RTSP/ONVIF connector skeleton.
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

Deliverables:

- Frame extraction pipeline boundary.
- Bird/no-bird filter adapter interface.
- Species ID adapter interface.
- eBird rarity scoring boundary.
- Manual correction UX.
- Confidence, review status, and user override fields.
- Background-job notes for deployment.

Definition of done:

- The product can distinguish raw motion clips from verified bird sightings.
- Manual corrections can improve scoring and feed quality.
- Future model/provider swaps are possible without rewiring the app.

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
- Merging to `main` if that changes production behavior.

## Next Best Non-Blocked Tasks

If a future run cannot edit, push, deploy, or authenticate, it should still make progress by:

- Updating docs and integration matrices.
- Adding local TypeScript contracts.
- Building mockable adapter interfaces.
- Improving onboarding copy and state flows.
- Adding tests around scoring and provider selection.
- Creating PR notes with exact blocked items and next actions.

## Token Discipline

Daily runs should begin with only:

- `git status --short --branch`
- `git log -5 --oneline`
- `package.json`
- deployment config
- files directly related to the day objective

Broader scans should happen only when the build is blocked or the relevant code path is unclear.
