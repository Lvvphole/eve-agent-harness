# Stage 00: Bootstrap

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/proposal-contract.md`

## Process

1. Establish the ICM document hierarchy and root governance.
2. Configure strict TypeScript, Zod, Vitest, ESLint, and Prettier.
3. Preserve the < 200 LOC micro-envelope per delivery unit.
4. Do not create Stage B engine behavior.
5. Do not create signing keys or production credentials.

## Outputs

- `../../AGENTS.md`
- `../../CLAUDE.md` containing only `@AGENTS.md`
- `../../CONTEXT.md`
- Layer 2 stage contracts under `../`
- `../../package.json`
- `../../tsconfig.json`
- `../../vitest.config.ts`
- `../../eslint.config.mjs`
- formatting and ignore configuration

## Exit

Route next to `../01_readiness/CONTEXT.md`. No engine implementation is
authorized by this stage.
