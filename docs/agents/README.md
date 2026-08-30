# Flock Agent Briefs

These briefs define reusable roles for the Flock/BirdWatch automated build lane. They are not separate always-on processes by themselves; they are source-of-truth operating instructions that Codex automations, cloud tasks, or future Workspace Agents can read before doing work.

## Agents

- [Build Captain](build-captain.md): chooses the daily slice, commits/pushes, updates the PR, and reports deployment status.
- [Camera Integration Architect](camera-integration-architect.md): owns scalable camera architecture and vendor integration honesty.
- [Privacy & Safety Gatekeeper](privacy-safety-gatekeeper.md): blocks unsafe camera, credential, scraping, and sharing decisions.
- [QA / Release Verifier](qa-release-verifier.md): validates builds, UI smoke tests, deployment status, and release notes.
- [Product Loop PM](product-loop-pm.md): keeps onboarding, league scoring, sharing, and beta readiness coherent.
- [Partnerships / Research Scout](partnerships-research-scout.md): tracks camera vendor programs, official APIs, and partnership paths.
- [Agent Improvement Steward](agent-improvement-steward.md): reviews agent guidance with short MVP probes before changing `AGENTS.md` or specialist briefs.

## How To Use

Daily automation should start with the Build Captain brief, then consult only the specialist brief needed for that day's issue.

Token rule: read one specialist brief per run unless the work clearly crosses boundaries.
Use the Agent Improvement Steward only for explicit or weekly guidance reviews, not for normal feature work.

Source-of-truth docs:

- `docs/autonomous-build-plan.md`
- `docs/camera-integrations.md`
- `docs/camera-ingestion-design.md`
