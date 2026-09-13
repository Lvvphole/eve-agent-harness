# Stage 03: Detached Workspace

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 4: the exact source snapshot identity sealed by earlier stages

## Process

1. Stage A: define workspace, scrub, symlink, and receipt contracts.
2. Stage C: falsify `.git` leakage, nested metadata, escaping symlinks,
   source drift, aliasing, and receipt mutation.
3. Freeze the oracle and capture intended red evidence.
4. Stage B: materialize read-only inspection and writable implementation views
   from the same sealed source snapshot.
5. Hash deterministic content/structure, never timestamps.

## Outputs

- `src/types/workspace.ts`
- `src/schemas/workspace.ts`
- `tests/workspace.test.ts`
- `src/engine/workspace.ts`
- `tree_hash.receipt`

## Exit

The workpiece may route to Stage 04 only when Git metadata is absent, all
symlinks are contained, and the tree receipt matches the sealed source.
