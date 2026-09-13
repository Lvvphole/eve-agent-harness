# Stage 06_persistence: Local-First Persistence

## Repository Access

The only repository path authority for this stage is
`../../references/routes/06_persistence.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/06_persistence.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: deterministic supervisor events
- Layer 4: previous ledger head

## Process

1. Stage A: define event, hash-chain, replay, and remote-row contracts.
2. Stage C: falsify mutation, deletion, reorder, forged linkage, truncation, and nondeterministic replay.
3. Stage B: append/fsync locally before state visibility; replicate to Supabase asynchronously and idempotently.

## Outputs

- `src/types/persistence.ts`
- `src/schemas/persistence.ts`
- `tests/persistence.test.ts`
- `src/engine/persistence.ts`

## Exit

Remote persistence never becomes control-plane authority.
