# Stage 05: Verification and Candidate Export

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/05_exporter.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: frozen base tree, candidate tree, sealed DAG, verifier evidence

## Process

1. Stage A: define export, diff, patch, and receipt contracts.
2. Stage C: falsify LOC-cap bypass, unauthorized paths, protected-test changes,
   binary surprises, and patch tampering.
3. Stage B: diff, bound, independently verify, rehash, and package the candidate.

## Outputs

- exporter types/schema;
- exporter adversarial oracle;
- exporter engine;
- canonical patch and `DELIVERY.txt`.

## Exit

Export does not grant merge authority.
