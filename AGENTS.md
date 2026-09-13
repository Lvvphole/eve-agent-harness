# eve-agent-harness

## Project

Standalone zero-trust supervisor for untrusted target repositories. Agents may
propose and implement bounded changes; they never hold readiness, sealing,
acceptance, protected-state, or merge authority.

## Instruction loading

- `CLAUDE.md` contains exactly `@AGENTS.md`.
- Read root `CONTEXT.md`; the supervisor-supplied `stage_id` selects exactly one stage.
- Never infer a stage from prose. Load only context named by the selected stage.
- Repository `read`, `grep`, and `write` operations are default-deny under `references/routing-policy.md`.
- Nested `AGENTS.md` files are forbidden.

## Package boundaries

- `src/types/`: Stage A TypeScript data contracts only; no runtime logic.
- `src/schemas/`: Stage A Zod boundary schemas; object schemas use `.strict()`.
- `tests/`: Stage C adversarial oracles.
- `src/engine/`: Stage B engines and state evaluators.
- Cross-layer circular dependencies are forbidden.

## Development contract

- Each delivery unit must change fewer than 200 non-lockfile lines, counting
  additions plus deletions.
- Behavior-bearing work follows `Stage A -> Stage C -> Stage B`.
- Stage C must fail for the intended reason before Stage B and its bytes must be
  frozen before implementation.
- Do not invent fields, paths, authorities, tools, operations, or aliases.
- Architectural boundary violations, schema weakening, test weakening,
  authority expansion, sandbox escape, or evidence tampering trigger One-Strike
  Reset. Do not repair a terminal branch.
- Tactical implementation errors have at most two bounded repair iterations.

## Commands

- Install: `npm ci`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm run test`
- Format: `npm run format:check`

Use non-interactive flags. A green command proves only that command's gate.

## Code style

Follow `references/engineering-rules.md`. Required baseline: strict TypeScript,
no explicit `any`, no type/non-null assertions, explicit exported function
types, readonly Stage A data, exhaustive unions, and deterministic behavior.

## Testing

Use Vitest adversarial oracles. Do not skip/focus tests, mock supervisor trust
primitives, or use tautological assertions. Preserve red/green lineage and
machine receipts defined in `references/verification-policy.md`.

## Security

Follow `references/security-boundaries.md`.

Workers never access supervisor secrets/state, target Git metadata/workflows,
host volumes, Docker socket, or unauthorized target paths. SCOUT is read-only;
PLAN may emit only `.proposals/*.json`; IMPLEMENT requires `PRE_CODE_READY`
and is limited to authorized candidate paths and sandboxed tools.

## Completion

Agent prose is not evidence. Agents do not declare readiness, acceptance, or
completion. Deterministic supervisor evidence establishes candidate state; only
the human operator may merge a candidate into a target main branch.
