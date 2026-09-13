# Repository Routing Policy

This policy governs every agent-initiated repository `read`, `grep`, and
`write`.

## Stage identity

The supervisor supplies exactly one `stage_id` in the TaskEnvelope. The agent
must not infer or change it. Root `CONTEXT.md` maps that exact ID to one stage
contract.

Missing, unknown, or conflicting stage identity is `BLOCKED`.

## Path authorization

The active stage loads:

- `references/routes/global.json`
- `references/routes/<stage_id>.json`

All repository paths are canonical relative POSIX paths.

An operation is allowed only when:

`valid_stage && canonical_path && !denied_path && match_count == 1`

where `match_count` is the number of explicit allow entries for the requested
operation and path.

- `match_count == 0`: `BLOCKED`
- `match_count > 1`: `BLOCKED`

No wildcard, implicit normalization, fallback route, closest-match rule, or
agent-selected path expansion is allowed.

## Read

A read requires the exact requested file path to appear once in
`read_exact` for the active stage.

Directory reads and recursive reads are blocked unless a future human-authorized
policy adds a distinct, mechanically validated rule type.

## Grep

A grep requires an explicit file path. Repo-wide grep, cwd-default grep, and
unspecified search roots are blocked.

The requested file must appear once in `grep_exact`.

## Write

A write requires the exact destination path to appear once in `write_exact`.
Creating a sibling file, alternate extension, temporary file, or renamed output
is blocked unless explicitly authorized.

## Sensitive paths

The global route file denies supervisor state, Git metadata, workflows, runtime
state, dependencies/build output, and secrets before stage rules are evaluated.
A stage cannot override a global denial.

## Mechanical enforcement

The repository is fail-closed until the routing gate is implemented and wired
ahead of filesystem tools. `npm run lint:routing` must remain non-zero until
that gate has passed Stage A -> Stage C -> Stage B and validates every route
file.

The future dispatcher must obtain an ALLOW decision from that gate before
exposing a repository read, grep, or write operation.
