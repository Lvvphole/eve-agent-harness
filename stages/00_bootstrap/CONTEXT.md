# Stage 00: Bootstrap

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/00_bootstrap.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 3: `../../references/proposal-contract.md`

## Process

1. Maintain the root instruction/router hierarchy.
2. Configure the strict TypeScript/Zod/Vitest toolchain.
3. Preserve the < 200 LOC delivery bound.
4. Do not create Stage B engine behavior, signing keys, or production credentials.

## Outputs

- root instruction/router files;
- Layer 2 stage contracts;
- package, compiler, test, lint, format, and ignore configuration.

## Exit

Route to Stage 01 only after bootstrap configuration is mechanically valid.
