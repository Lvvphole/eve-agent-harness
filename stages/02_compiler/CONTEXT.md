# Stage 02: Proposal Compiler and Sealing

## Inputs

- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 3: `../../references/proposal-contract.md`
- Layer 4: proposal bytes and frozen source identity

## Process

1. Stage A: define proposal/DAG types and strict schemas.
2. Stage C: falsify cycles, span breaches, dangling references, lowering
   mutations, canonical-byte changes, and signature tampering.
3. Stage B: implement span checks, deterministic DAG lowering, canonical JSON,
   SHA-256, and supervisor-only Ed25519 sealing.

## Outputs

- proposal/DAG types and schemas;
- compiler adversarial oracle;
- span checker, compiler, and sealer;
- canonical `dag.json` + detached `dag.sig`.

## Exit

`PRE_CODE_READY` requires every pre-code predicate and signature gate to pass.
