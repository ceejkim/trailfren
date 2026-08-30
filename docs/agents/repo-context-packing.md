# Repo Context Packing

## Purpose

Use Repomix only when a Trailfren task needs broad repository context: system
architecture review, security/privacy review, release-readiness review, or
onboarding a separate agent to a cross-cutting issue. Do not use it for normal
one-file or narrow feature work.

## Default Approach

Start with direct `rg` and file reads. If that produces repeated context misses
or too much back-and-forth, pack a scoped context bundle instead of the whole
repo.

Use one of these command shapes:

```bash
npx repomix@latest --include "AGENTS.md,README.md,docs/**/*.md,src/**/*.{ts,tsx},server/**/*.js,api/**/*.js" --ignore "node_modules,dist,.agents,skills-lock.json,.env*,*.local.json" --compress
```

```bash
rg --files src server api docs | npx repomix@latest --stdin --compress
```

Repomix writes `repomix-output.xml` by default. Review the CLI security output
before using or sharing the packed file.

## Guardrails

- Prefer `--include` or `--stdin` over whole-repo packing.
- Keep `.agents/`, `skills-lock.json`, `.env*`, local stores, and generated
  output out of packs.
- Treat Secretlint as a helpful filter, not proof that a pack contains no
  secrets.
- Delete generated packs when they are no longer needed.
- Do not commit Repomix output files.
- Do not add Repomix as a project dependency unless Charles explicitly approves
  a persistent tool dependency.

## When To Use

- Architecture map before a multi-file auth, camera, or persistence redesign.
- Privacy/security review of camera ingestion and sharing boundaries.
- Release-readiness review where docs, server routes, UI, and smoke tests all
  matter.
- Agent handoff when the receiving agent cannot inspect the local repo directly.

## When Not To Use

- Single-component UI edits.
- Small copy or styling changes.
- Narrow server route fixes where the relevant files are already known.
- Any task involving live secrets or private camera data.
