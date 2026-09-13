# Stage 05_exporter: Verification and Candidate Export

## Repository Access

The only repository path authority for this stage is
`../../references/routes/05_exporter.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/05_exporter.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: frozen base tree
- Layer 4: candidate tree
- Layer 4: sealed DAG
- Layer 4: verifier evidence

## Process

1. Stage A: define export, diff, patch, and receipt contracts.
2. Stage C: falsify LOC-cap bypass, unauthorized paths, protected-test changes, binary surprises, and patch tampering.
3. Stage B: diff, bound, independently verify, rehash, and package the candidate.

## Outputs

- `src/types/exporter.ts`
- `src/schemas/exporter.ts`
- `tests/exporter.test.ts`
- `src/engine/exporter.ts`

## Exit

Export does not grant merge authority.
