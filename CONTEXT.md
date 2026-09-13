# Workspace Router

Load context in this order:

1. `CLAUDE.md` -> `@AGENTS.md`.
2. This file.
3. Exactly one matching stage `CONTEXT.md`.
4. Only the Layer 3 references listed by that stage.
5. Only the Layer 4 working artifacts listed by that stage.

| Task | Stage |
|---|---|
| Governance, repository bootstrap, package/toolchain configuration | `stages/00_bootstrap/CONTEXT.md` |
| Authority binding, TaskEnvelope, readiness states, mode routing | `stages/01_readiness/CONTEXT.md` |
| Proposals, spans, lowering, DAG compilation, sealing | `stages/02_compiler/CONTEXT.md` |
| Source snapshot, scrub rules, symlinks, tree receipts | `stages/03_workspace/CONTEXT.md` |
| Container isolation, network/tool controls, revocation | `stages/04_sandbox/CONTEXT.md` |
| Diff bounds, verification, candidate export | `stages/05_exporter/CONTEXT.md` |
| Local ledger, replay, tamper detection, Supabase replication | `stages/06_persistence/CONTEXT.md` |
| Subagent context, recursion, observation reduction | `stages/07_subagents/CONTEXT.md` |

If no row matches, stop as `BLOCKED`. Do not invent a stage or load unrelated
references, proposals, logs, or supervisor state.
