# Route 02_compiler: Proposal Compiler and Sealing

## Repository Access

The only repository path authority for this route is
`../../references/routes/02_compiler.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/02_compiler.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 3: `../../references/proposal-contract.md`
- Layer 4: proposal bytes
- Layer 4: frozen source identity

## Process

1. Stage A: define proposal/DAG types and strict schemas.
2. Stage C: falsify cycles, span breaches, dangling references, lowering mutations, canonical-byte changes, and signature tampering.
3. Stage B: implement span checks, deterministic DAG lowering, canonical JSON, SHA-256, and supervisor-only Ed25519 sealing.

## Outputs

- `src/types/proposals.ts`
- `src/types/dag.ts`
- `src/schemas/proposals.ts`
- `src/schemas/dag.ts`
- `tests/compiler.test.ts`
- `src/engine/span-checker.ts`
- `src/engine/compiler.ts`
- `src/engine/sealer.ts`

## Exit

`PRE_CODE_READY` requires every pre-code predicate and signature gate to pass.
