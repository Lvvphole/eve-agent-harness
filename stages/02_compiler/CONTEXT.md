# Stage 02: Proposal Compiler and Sealing

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/proposal-contract.md`
- Layer 4: schema-valid proposal bytes and frozen source identity

## Process

1. Stage A: define proposal/DAG types and strict schemas.
2. Stage C: falsify cycles, span breaches, dangling references, malformed
   lowering rules, canonical-byte mutation, and signature tampering.
3. Freeze the oracle and capture intended red evidence.
4. Stage B: implement span checking, deterministic lowering/topological sort,
   canonical JSON, SHA-256, and supervisor-only Ed25519 sealing.
5. Never expose private signing material to an agent.

## Outputs

- `src/types/proposals.ts`
- `src/types/dag.ts`
- `src/schemas/proposals.ts`
- `src/schemas/dag.ts`
- `tests/compiler.test.ts`
- `src/engine/span-checker.ts`
- `src/engine/compiler.ts`
- `src/engine/sealer.ts`
- canonical `dag.json` and detached `dag.sig`

## Exit

A valid supervisor signature and all pre-code predicates are required before
`PRE_CODE_READY`.
