# Workspace Router

The supervisor must supply exactly one `route_id` in the TaskEnvelope. Agents
must not infer, select, or change the stage from task prose.

| route_id | Context contract |
|---|---|
| `00_bootstrap` | `stages/00_bootstrap/CONTEXT.md` |
| `01_readiness` | `stages/01_readiness/CONTEXT.md` |
| `02_compiler` | `stages/02_compiler/CONTEXT.md` |
| `03_workspace` | `stages/03_workspace/CONTEXT.md` |
| `04_sandbox` | `stages/04_sandbox/CONTEXT.md` |
| `05_exporter` | `stages/05_exporter/CONTEXT.md` |
| `06_persistence` | `stages/06_persistence/CONTEXT.md` |
| `07_subagents` | `stages/07_subagents/CONTEXT.md` |

Load order:

1. `CLAUDE.md` -> `@AGENTS.md`.
2. This file.
3. The exact context contract mapped from `route_id`.
4. Only references and working artifacts named by that stage.

If `route_id` is absent, unknown, or conflicts with the loaded context route, stop as
`BLOCKED`.

Every repository `read`, `grep`, or `write` is separately authorized by
`references/routing-policy.md` and the active route file. Unlisted paths
are `BLOCKED`.
