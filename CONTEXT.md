# Workspace Router

This file is Layer 1 routing only. It cannot expand authority from `AGENTS.md`.

## Load Order

For every task, load context in this order:

1. `CLAUDE.md` -> `@AGENTS.md`.
2. This root `CONTEXT.md`.
3. Exactly one matching `stages/<stage>/CONTEXT.md`.
4. Only the Layer 3 references listed by that stage.
5. Only the Layer 4 working artifacts listed by that stage.

Do not preload unrelated stages, references, proposals, logs, or supervisor state.

## Stage Router

| Task | Route |
|---|---|
| Repository bootstrap, governance layout, package/toolchain configuration | `stages/00_bootstrap/CONTEXT.md` |
| Authority binding, TaskEnvelope, readiness states, mode routing | `stages/01_readiness/CONTEXT.md` |
| Proposal contracts, spans, lowering, DAG compilation, sealing | `stages/02_compiler/CONTEXT.md` |
| Source snapshot, scrub rules, symlink checks, tree receipts | `stages/03_workspace/CONTEXT.md` |
| Docker confinement, network denial, tools, revocation, oscillation | `stages/04_sandbox/CONTEXT.md` |
| Diff bounds, verification, candidate packaging, delivery receipts | `stages/05_exporter/CONTEXT.md` |
| Local JSONL ledger, replay, tamper detection, Supabase replication | `stages/06_persistence/CONTEXT.md` |
| Bounded subagent context, recursion, observation reduction | `stages/07_subagents/CONTEXT.md` |

## Stage Progression

Behavior-bearing stages use the frozen development order:

`Stage A contracts -> Stage C adversarial oracle -> Stage B engine`.

A Stage B route is invalid until the corresponding Stage C red evidence exists
and the oracle bytes are frozen.

## Layer Semantics

- Layer 0: global identity and governance through `AGENTS.md`.
- Layer 1: this router.
- Layer 2: one stage contract.
- Layer 3: stable `references/` constraints selected by the stage.
- Layer 4: per-run working artifacts selected by the stage.

Layer 4 does not imply universal worker visibility. Security boundaries in
`AGENTS.md` always override routing.

## Routing Failure

If no row matches the task, stop as `BLOCKED`. Do not invent a stage, path,
schema field, tool, or authority.
