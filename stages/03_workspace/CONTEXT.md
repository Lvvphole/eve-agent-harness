# Stage 03: Detached Workspace

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
2. Stage C: falsify Git metadata leakage, escaping symlinks, source drift,
   aliasing, and receipt mutation.
3. Stage B: materialize inspection/implementation views from the same source and
   compute a deterministic tree receipt.

## Outputs

- workspace types/schema;
- workspace adversarial oracle;
- workspace engine;
- `tree_hash.receipt`.

## Exit

Route to Stage 04 only when the scrubbed tree matches the sealed source.
