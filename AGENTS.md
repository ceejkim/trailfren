# Trailfren Agent Guide

This is the repo-level operating map for Codex sessions working on Trailfren.
Keep it short, keep work scoped, and read deeper docs only when the task needs
them.

## Product North Star

Trailfren, still named Flock/BirdWatch in parts of the codebase, is a bird
camera social MVP for a first beta of about 50 users. The core loop is:

- connect or represent bird cameras safely
- surface motion-triggered bird clips
- let friends react, comment, and share sightings
- turn activity into feeder power, rarity scoring, and weekly leagues

Professional, trustworthy, simple, and friendly beats clever or broad.

## Start Here

Before editing, gather only the context needed for the current slice:

- `git status --short --branch`
- `rg --files`
- relevant source files under `src/`, `server/`, and `api/`
- `README.md` for current local setup and MVP scope
- `docs/mvp-readiness-gaps.md` for beta blockers

Use `npm run build` for code changes and `npm run smoke:camera` for camera,
auth, API, or persistence changes.

## Low-Token Workflow

- Prefer one narrow, shippable slice over broad refactors.
- Read the smallest useful set of files, then implement.
- Reuse existing types, route shapes, styles, and docs structure.
- Add tests or smoke coverage when behavior, auth, persistence, or API contracts
  change.
- Update docs only when the change affects setup, security, architecture, or
  beta readiness.
- Do not commit project-local skill files such as `.agents/` or
  `skills-lock.json` unless Charles explicitly asks.
- Keep this file compact; if it grows, move detail into a purpose-specific doc.

## Specialist Docs

Consult one specialist brief only when it materially helps:

- `docs/agents/build-captain.md` for daily build-slice execution.
- `docs/agents/camera-integration-architect.md` for camera APIs, relay design,
  provider constraints, or media ingestion.
- `docs/agents/privacy-safety-gatekeeper.md` for auth, sharing, privacy, vendor
  access, camera credentials, or security gates.
- `docs/agents/qa-release-verifier.md` for release readiness, regression risk,
  and verification plans.
- `docs/agents/product-loop-pm.md` for onboarding, social loops, leagues, and MVP
  coherence.
- `docs/agents/partnerships-research-scout.md` for vendor programs, official
  API paths, and partner/export workflows.

The index is `docs/agents/README.md`.

## Design And Product

- Follow `docs/brand-guidelines.md` for palette, tone, layout, and component
  feel.
- Keep operational UI dense, clear, and usable; avoid landing-page composition
  when building app workflows.
- Preserve intuitive defaults: privacy-first camera sharing, clear provider
  gates, and visible beta-readiness status.

## Auth, Privacy, And Camera Gates

- Do not store camera vendor passwords, raw private feed URLs, or unnecessary
  secrets.
- Do not scrape, reverse engineer, bypass vendor limits, or imply unofficial
  camera access is production-ready.
- Production auth should rely on Supabase bearer-token verification and
  `FLOCK_REQUIRE_AUTH=true`.
- Account-owned camera data must stay scoped to the verified Supabase user.
- Private clip media requires explicit storage, signed URL, retention, and
  deletion decisions before real beta use.
- Paid services, vendor credentials, production secrets, and security-sensitive
  integrations require Charles's approval.
- For any Supabase Postgres, schema, migration, RLS, index, or query work, load
  `supabase-postgres-best-practices` first and read only the specific reference
  files needed for the current change.

## Key References

- `docs/camera-production-readiness.md` for Vercel/Supabase/storage env vars and
  production verification.
- `docs/camera-sync-architecture.md` for account-owned sync boundaries.
- `docs/camera-sync-persistence.md` for persistence modes.
- `docs/camera-provider-adapters.md` and `docs/camera-integrations.md` for
  vendor constraints.
- `docs/bird-intelligence-pipeline.md` for clip review and species scoring.
- `docs/autonomous-build-plan.md` for the broader month-one build lane.

## Git And Delivery

- Work from the current branch unless Charles asks for a new one.
- Keep unrelated local changes intact.
- Commit only the intended files.
- Report changed files, checks run, commit SHA when committed, and any blocked
  beta-readiness item.
