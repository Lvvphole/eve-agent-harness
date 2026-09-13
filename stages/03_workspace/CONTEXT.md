# Stage 03_workspace: Detached Workspace

## Repository Access

The only repository path authority for this stage is
`../../references/routes/03_workspace.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/03_workspace.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: sealed source snapshot identity

## Process

1. Stage A: define workspace, scrub, symlink, and receipt contracts.
2. Stage C: falsify Git metadata leakage, escaping symlinks, source drift, aliasing, and receipt mutation.
3. Stage B: materialize inspection/implementation views from one sealed source and compute a deterministic tree receipt.

## Outputs

- `src/types/workspace.ts`
- `src/schemas/workspace.ts`
- `tests/workspace.test.ts`
- `src/engine/workspace.ts`

## Exit

Route to `04_sandbox` only when the scrubbed tree matches the sealed source.
