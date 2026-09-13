# Stage 01: Readiness

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/01_readiness.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 3: `../../references/proposal-contract.md`
- Layer 4: human-authorized TaskEnvelope and frozen target source identity

## Process

1. Stage A: define readiness types and strict schemas.
2. Stage C: falsify forged authority, missing roots, stale source identity, and
   unauthorized transitions; freeze the red oracle.
3. Stage B: implement the pure readiness evaluator.
4. Capture green evidence only against the frozen oracle.

## Outputs

- `src/types/readiness.ts`
- `src/schemas/readiness.ts`
- `tests/readiness.test.ts`
- `src/engine/readiness.ts`
- red/green machine evidence

## Exit

Route to Stage 02 only after the readiness gate succeeds.
