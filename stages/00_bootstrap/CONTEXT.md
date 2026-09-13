# Route 00_bootstrap: Bootstrap

## Repository Access

The only repository path authority for this route is
`../../references/routes/00_bootstrap.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

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

- `AGENTS.md`
- `CLAUDE.md`
- `CONTEXT.md`
- `references/engineering-rules.md`
- `references/proposal-contract.md`
- `references/routing-policy.md`
- `references/security-boundaries.md`
- `references/verification-policy.md`
- `references/routes/global.json`
- `references/routes/00_bootstrap.json`
- `references/routes/01_readiness.json`
- `references/routes/02_compiler.json`
- `references/routes/03_workspace.json`
- `references/routes/04_sandbox.json`
- `references/routes/05_exporter.json`
- `references/routes/06_persistence.json`
- `references/routes/07_subagents.json`
- `stages/00_bootstrap/CONTEXT.md`
- `stages/01_readiness/CONTEXT.md`
- `stages/02_compiler/CONTEXT.md`
- `stages/03_workspace/CONTEXT.md`
- `stages/04_sandbox/CONTEXT.md`
- `stages/05_exporter/CONTEXT.md`
- `stages/06_persistence/CONTEXT.md`
- `stages/07_subagents/CONTEXT.md`
- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `.gitignore`

## Exit

Route to `01_readiness` only after bootstrap configuration is mechanically valid.
