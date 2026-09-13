# Route 01_readiness: Readiness

## Repository Access

The only repository path authority for this route is
`../../references/routes/01_readiness.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/01_readiness.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 3: `../../references/proposal-contract.md`
- Layer 4: human-authorized TaskEnvelope
- Layer 4: frozen target source identity

## Process

1. Stage A: define readiness/routing types and strict schemas.
2. Stage C: falsify forged authority, ambiguous/missing routes, stale source identity, unauthorized transitions, and unauthorized repository operations; freeze the red oracle.
3. Stage B: implement pure readiness and repository-operation authorization.
4. Capture green evidence only against frozen oracles.

## Outputs

- `src/types/readiness.ts`
- `src/schemas/readiness.ts`
- `tests/readiness.test.ts`
- `src/engine/readiness.ts`
- `src/types/routing.ts`
- `src/schemas/routing.ts`
- `tests/routing.test.ts`
- `src/engine/routing.ts`

## Exit

Route to `02_compiler` only after readiness and routing gates succeed.
