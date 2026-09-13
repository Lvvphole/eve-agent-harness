# Stage 06: Local-First Persistence

## Inputs

- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: deterministic supervisor events and previous ledger head

## Process

1. Stage A: define event, hash-chain, replay, and remote-row contracts.
2. Stage C: falsify mutation, deletion, reorder, forged linkage, truncation, and
   nondeterministic replay.
3. Stage B: append/fsync locally before state visibility; replicate to Supabase
   asynchronously and idempotently.

## Outputs

- persistence types/schema;
- persistence adversarial oracle;
- persistence engine;
- append-only JSONL ledger and ledger-head receipt.

## Exit

Remote persistence never becomes control-plane authority.
