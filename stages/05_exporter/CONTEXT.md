# Stage 05: Verification and Candidate Export

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 4: frozen base tree, candidate tree, sealed DAG, verifier evidence

## Process

1. Stage A: define export, diff, patch, and delivery receipt contracts.
2. Stage C: falsify > 200 LOC diffs, large-deletion evasion, unauthorized
   paths, protected-test changes, binary surprises, and patch tampering.
3. Freeze the oracle and capture intended red evidence.
4. Stage B: freeze/hash candidate, diff against the sealed base, enforce
   authorized paths and LOC bounds, run independent verification, rehash, and
   emit a canonical candidate package.

## Outputs

- `src/types/exporter.ts`
- `src/schemas/exporter.ts`
- `tests/exporter.test.ts`
- `src/engine/exporter.ts`
- `DELIVERY.txt`
- canonical patch and candidate receipt

## Exit

Export never grants merge authority. Human approval remains required.
