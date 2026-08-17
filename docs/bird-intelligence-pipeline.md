# Bird Intelligence Pipeline

Updated: August 17, 2026

## Purpose

Camera sync creates raw motion events. The bird intelligence pipeline turns those motion events into reviewable bird records before points, friends, leagues, or public sharing use them.

This slice implements the product architecture and API boundary. It does not call a paid model or eBird yet because those require credentials, quality gates, and production data rules.

## Implemented Files

- `server/bird-intelligence-pipeline.js`
- `api/bird-intelligence/reviews.js`
- `api/bird-intelligence/corrections.js`
- `server/camera-sync-store.js`
- `src/cameraApi.ts`
- `src/App.tsx`
- `scripts/smoke-camera-routes.mjs`

## API Routes

`GET /api/bird-intelligence/reviews`

- Returns the adapter plan for frame extraction, bird/no-bird detection, species identification, eBird-ready rarity scoring, and manual review.

`POST /api/bird-intelligence/reviews`

- Accepts a camera review item plus clip metadata.
- Rejects secret-looking payloads.
- Creates a persisted `birdAnalyses` account record.
- Updates the related `reviewItems` record with `analysisId`, `analysisStatus`, confidence, and bird/no-bird state.

`POST /api/bird-intelligence/corrections`

- Accepts reviewer action: `approve`, `correct-species`, or `mark-no-bird`.
- Creates a persisted `birdCorrections` account record.
- Updates the analysis and review item to the corrected review state.

## Account Records

The camera account store now includes:

- `birdAnalyses`
- `birdCorrections`

These sit beside the existing camera records:

- `syncSessions`
- `connectionRequests`
- `devices`
- `relayEnrollments`
- `relayUploads`
- `clipIngests`
- `reviewItems`

## Adapter Contract

The adapter stack is intentionally swappable:

1. `frame-extractor`
   - Inputs: `clipUrl`, `thumbnailUrl`, `frameSampleUrls`
   - Output: representative frames and extraction status
   - Future runtime: relay, background worker, or media service

2. `bird-detector`
   - Inputs: frames plus motion metadata
   - Output: `birdDetected` and confidence
   - Future runtime: approved model provider or local relay inference

3. `species-identifier`
   - Inputs: bird frames, location hint, capture time
   - Output: ranked species suggestions
   - Future runtime: model provider with confidence thresholds

4. `rarity-scorer`
   - Inputs: species, region, date
   - Output: rarity, points, regional frequency
   - Future runtime: eBird API or approved data product

5. `manual-review`
   - Inputs: analysis id, review item id, reviewer action, species
   - Output: corrected status and scoring override
   - Implemented now

## eBird Boundary

Production rarity should use an eBird-backed regional scoring adapter after credentials and usage policy are configured.

Official source notes:

- eBird API 2.0 docs: https://documenter.getpostman.com/view/664302/S1ENwy59
- eBird Help Center says the API is for limited, recent, and summary outputs, and requires a unique personal API key.
- The eBird Basic Dataset is a separate download flow for raw observations and requires a logged-in project/request process.
- Sensitive species can be obscured in public outputs, so exact locations should not be exposed casually.

Required future env:

- `EBIRD_API_KEY`
- regional scoring policy
- sensitive species handling policy

## Frontend UX

The Cameras tab now includes a Bird Review Queue panel. It can:

- show latest queued review item
- analyze the latest clip
- show candidate species, confidence, and points
- approve the candidate ID
- correct to Northern cardinal
- mark an event as no-bird

Local Vite fallbacks generate matching review records so the same flow can be exercised without Vercel functions.

## Still Gated

- Private clip object storage
- Real frame extraction from uploaded media
- Model provider selection and credentials
- eBird API key and regional scoring policy
- Background worker queue
- Human review/admin permissions
- Automatic league scoring from only approved/corrected sightings
