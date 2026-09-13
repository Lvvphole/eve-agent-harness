# Stage 01: Readiness

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/proposal-contract.md`
- Layer 4: human-authorized TaskEnvelope and frozen target source identity

## Process

1. Stage A: define readiness and authority types in `src/types/readiness.ts`.
2. Stage A: define strict Zod contracts in `src/schemas/readiness.ts`.
3. Stage C: build `tests/readiness.test.ts` to falsify forged authority,
   missing root documents, stale source identity, and unauthorized transitions.
4. Freeze the oracle bytes and capture `trace_red.log`.
5. Stage B: implement the pure evaluator in `src/engine/readiness.ts`.
6. Capture `trace_green.log` only after the frozen oracle passes.

## Outputs

- `src/types/readiness.ts`
- `src/schemas/readiness.ts`
- `tests/readiness.test.ts`
- `src/engine/readiness.ts`
- machine evidence for red/green lineage

## Exit

Readiness may route to Stage 02 only after its deterministic gate succeeds.
