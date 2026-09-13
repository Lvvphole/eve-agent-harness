# Repository Routing Policy

This policy governs every agent-initiated repository `read`, `grep`, and
`write`.

## Stage identity

The supervisor supplies exactly one `route_id` in the TaskEnvelope. The agent
must not infer or change it. Root `CONTEXT.md` maps that exact ID to one context
contract.

Missing, unknown, or conflicting stage identity is `BLOCKED`.

## Path authorization

The active route loads:

- `references/routes/global.json`
- `references/routes/<route_id>.json`

All repository paths are canonical relative POSIX paths. No path is normalized
into acceptance.

For `read` and `grep`, ALLOW requires exactly one matching entry in the
corresponding `*_exact` list.

For `write`, the path must match exactly one of these disjoint sets:

- `write_exact`: ordinary stage output;
- `protected_write_exact`: governance/protected output that additionally
  requires an exact human-authorized protected path in the TaskEnvelope.

Any zero-match or multi-match result is `BLOCKED`.

## Read

A read requires the exact requested file path to appear once in
`read_exact`. Directory and recursive reads are blocked.

## Grep

A grep requires an explicit file path that appears once in `grep_exact`.
Repo-wide grep, cwd-default grep, and unspecified search roots are blocked.

## Write

A normal write requires the exact destination in `write_exact`.

A protected write requires:
1. the exact destination in `protected_write_exact`; and
2. the same exact path in the human-authorized protected-path set carried by the
   TaskEnvelope.

Creating sibling files, alternate extensions, temporary files, or renamed
outputs is blocked unless exactly authorized.

## Sensitive paths

`references/routes/global.json` denies supervisor state, Git metadata,
workflows, runtime state, dependencies/build output, and secrets before any
stage allow rule. A route cannot override a global denial.

## Two execution planes

This policy controls operations on the `eve-agent-harness` repository itself.
Target-workpiece permissions are a separate, additional boundary defined by
`security-boundaries.md` and the TaskEnvelope. Neither plane expands the other.

## Mechanical enforcement

The repository is fail-closed until the routing gate is implemented and wired
ahead of filesystem tools. `npm run lint:routing` must remain non-zero until
that gate has passed Stage A -> Stage C -> Stage B and validates every route
file.

The dispatcher must obtain ALLOW before exposing a repository read, grep, or
write operation.
