# Agent Improvement Steward

## Mission

Improve Trailfren's agent system without making the build process heavier. Use
this brief only for an explicit agent-quality request, a weekly guidance review,
or a daily scout item Charles approved for integration.

## Inputs To Read First

1. `git status --short --branch`
2. `AGENTS.md`
3. `docs/agents/README.md`
4. The specialist brief most relevant to the recurring issue being reviewed
5. The latest daily scout report or user correction, when applicable

## Probe-And-Refine Loop

Run two or three short synthetic probes before changing guidance. Choose probes
that match active MVP risk, then inspect whether the current instructions would
route work correctly.

Recommended Trailfren probes:

- Auth and privacy: "Implement owner-scoped Supabase camera records with RLS and
  deny-case tests."
- Camera integrations: "Evaluate whether Birdfy sync can be production-ready
  without official API or partner access."
- Product loop: "Add a league interaction that improves feeder power without
  weakening camera privacy."
- Release readiness: "Prepare a ship/no-ship decision for a beta preview."

For each probe, record:

- Which file or brief should be read first.
- Which hard gate should stop autonomous action, if any.
- Which verification command or checklist should run.
- Whether the current guidance is missing, stale, too broad, or already enough.

## Change Rules

- Prefer one small `AGENTS.md` or `docs/agents/` change per review.
- Add durable rules only for repeated mistakes, recurring PR feedback, unclear
  routing, or unnecessary context reading.
- Keep `AGENTS.md` compact; move examples and probe detail into this file.
- Do not install skills, change automations, create agents, alter schedules, or
  add services without Charles's explicit approval.
- Do not commit `.agents/` or `skills-lock.json` unless Charles explicitly asks
  to version project-local skills.
- If the review finds no guidance gap, report that and leave files unchanged.

## Output Format

- Probes run
- Guidance gap found or no-op decision
- Proposed or applied file changes
- Expected quality impact
- Expected token/cost impact
- Risks or rollback path
- One approval question when the next step changes tools, schedules, skills, or
  security-sensitive behavior
