# Flock BirdWatch

Flock is a bird-camera social MVP for watching motion-triggered clips, logging sightings, following friends, and running fantasy-style birding challenges.

## MVP Scope

- Local demo authentication and profile state
- Friend requests, follow actions, and invite-code sharing
- Motion-only camera feed with comments and reactions
- Bird sighting logging with rarity-based points
- Flock league leaderboard and weekly challenges
- Affiliate-style gear and seed recommendations
- Birdfy-style camera connection panel for future integrations

## Autonomous Build Lane

The BirdWatch project is managed with GitHub as the canonical source of truth. The daily Codex automation works from the repo, uses the `work` branch for build slices, pushes completed changes to GitHub, and lets Vercel deploy from the repository.

Key planning docs:

- [Autonomous build plan](docs/autonomous-build-plan.md)
- [Camera integration matrix](docs/camera-integrations.md)
- [Camera ingestion design](docs/camera-ingestion-design.md)
- [Camera sync UX](docs/camera-sync-ux.md)
- [Camera account sync wizard](docs/camera-account-sync-wizard.md)
- [Camera sync architecture](docs/camera-sync-architecture.md)
- [Camera sync persistence](docs/camera-sync-persistence.md)
- [Camera provider adapters](docs/camera-provider-adapters.md)
- [Bird intelligence pipeline](docs/bird-intelligence-pipeline.md)
- [Camera production readiness](docs/camera-production-readiness.md)
- [Local camera relay handoff](docs/local-camera-relay.md)
- [Agent operating briefs](docs/agents/README.md)

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run smoke:camera
```
