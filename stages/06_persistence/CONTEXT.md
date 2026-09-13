# Stage 06: Local-First Persistence

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 4: deterministic supervisor events and previous ledger head

## Process

1. Stage A: define append-only event, hash-chain, replay, and remote-row schemas.
2. Stage C: falsify mutation, deletion, reorder, duplicate sequence, forged
   previous hash, truncation, and nondeterministic replay.
3. Freeze the oracle and capture intended red evidence.
4. Stage B: canonicalize, hash, append, flush/fsync locally before state is
   visible.
5. Replicate to Supabase asynchronously and idempotently. Remote failure cannot
   block or overrule the local deterministic control plane.

## Outputs

- `src/types/persistence.ts`
- `src/schemas/persistence.ts`
- `tests/persistence.test.ts`
- `src/engine/persistence.ts`
- append-only local JSONL ledger and ledger-head receipt

## Exit

Production Supabase migrations and credentials remain human-exclusive.
