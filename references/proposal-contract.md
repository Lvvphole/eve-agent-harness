# Proposal Contract

## Status

This file is authoritative human-owned governance. It defines the constraints
for future Stage A proposal schemas. It does not itself authorize PLAN or
IMPLEMENT execution.

## Boundary

A proposal is untrusted input crossing the PLAN-to-supervisor air gap in the
target-workpiece execution plane. This does not grant write authority in the
`eve-agent-harness` repository.

A PLAN proposal path must match exactly:

`^\.proposals\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}\.json# Proposal Contract

## Status

This file is authoritative human-owned governance. It defines the constraints
for future Stage A proposal schemas. It does not itself authorize PLAN or
IMPLEMENT execution.

## Boundary



Subdirectories, alternate extensions, path normalization, and additional writes
are rejected. The supervisor unlinks the staged file immediately after reading
its bytes, before validation or compilation.

## Required Properties of the Future Runtime Schema

The Stage A Zod schema must be `.strict()` and must bind, without aliases:
- the authorized increment and stage identity;
- the frozen target source identity;
- the authorized candidate path set;
- proposed operations and their exact target spans;
- dependencies required for deterministic DAG lowering;
- the human-authorized authority identity needed by the readiness gate.

Exact property names and shapes are frozen only when their Stage A schema is
implemented. Agents must not invent fields before that increment.

## Path Rules

Every proposed target-workpiece path must be canonical and relative. Reject paths containing:
- an absolute root;
- a drive prefix;
- NUL;
- empty segments;
- `.` or `..` segments;
- alternate spellings that normalize to a different accepted path.

## Scope Rules

- Every proposed path must be inside `authorized_candidate_paths`.
- Every proposed span must be within the authorized file/span envelope.
- Unknown operations fail closed.
- Missing lowering rules fail closed.
- A proposal cannot add capabilities, authorities, paths, or tools.
- A proposal cannot modify tests, governance, or verifier criteria unless the
  human TaskEnvelope explicitly authorizes that exact protected change.

## Size Rule

The compiled delivery unit must remain below 200 changed non-lockfile lines,
counting additions plus deletions. Binary changes fail closed unless a human
contract explicitly permits them.

## Identity Rules

Candidate digest format: `^sha256:[a-f0-9]{64}$`.
TaskEnvelope identity format: `<increment_id>-<stage>-<hash>`.
A sealed execution artifact is the exact canonical `dag.json` bytes paired with
raw-hex `dag.sig` produced by supervisor-held Ed25519 authority.

## Non-Authority

Schema validity is necessary but never sufficient for readiness. Only the
supervisor may derive readiness after independent span, authority, oracle, DAG,
and signature gates succeed.
