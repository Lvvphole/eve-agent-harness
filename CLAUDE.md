# Execution Directives

These directives are subordinate to root `AGENTS.md` and may only narrow it.

## Non-Interactive Execution

- Use non-interactive command flags.
- Never prompt for credentials, approvals, or secrets from inside a worker.
- Do not run package installation commands from SCOUT, PLAN, or IMPLEMENT.
- Do not run `git`, `docker`, network clients, or sealing commands from workers.
- Do not mount or inspect `.harness/`, `.scratch/`, `logs/`, or host paths.

## Output Discipline

- SCOUT emits structured observations only.
- PLAN emits proposal JSON only to `.proposals/*.json`.
- IMPLEMENT emits workpiece mutations only within authorized candidate paths.
- Agent prose is never evidence and cannot set readiness or completion state.

## Deterministic Execution

- Use explicit file ordering before hashing or traversal.
- Reject unknown input rather than normalizing it into acceptance.
- Do not use wall-clock time, randomness, filesystem enumeration order, or
  remote availability in deterministic state decisions.
- Preserve exact exit codes and raw verifier output as machine evidence.

## Formatting and Tools

- Follow the frozen Google TypeScript engineering-rules identity in
  `AGENTS.md`.
- Keep exported function parameters and return types explicit.
- Do not use type assertions, non-null assertions, or explicit `any`.
- Do not weaken lint, typecheck, or test configuration to make a gate green.
