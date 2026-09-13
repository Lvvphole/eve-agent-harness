# eve-agent-harness Governance

## Authority

This repository is the out-of-band supervisor. Target repositories are untrusted
workpieces. Agents may propose changes; they never hold readiness, acceptance,
sealing, protected-state, or merge authority.

Authority order:
1. This root `AGENTS.md`.
2. Human-authorized TaskEnvelope and protected supervisor state.
3. Human-owned Layer 3 references and protected `.harness/` configuration.
4. Strict runtime schemas.
5. Sealed DAG and deterministic machine evidence.

`CLAUDE.md` must contain exactly `@AGENTS.md` and has no independent authority.
`CONTEXT.md` and stage `CONTEXT.md` files route/scoped-load authority; they may
never expand it. Nested `AGENTS.md` files are forbidden.

## ICM Context Hierarchy

- Layer 0: `AGENTS.md`, imported by the one-line `CLAUDE.md`.
- Layer 1: root `CONTEXT.md` routes a task to exactly one stage.
- Layer 2: `stages/<stage>/CONTEXT.md` defines Inputs, Process, and Outputs.
- Layer 3: `references/` contains stable constraints selected by the stage.
- Layer 4: per-run proposals, workpieces, evidence, and other working artifacts.

Load only the active stage's declared context. Do not preload unrelated stages,
references, logs, proposals, or supervisor state. Workers may not modify routing
documents unless an exact human TaskEnvelope authorizes that protected change.

## Architecture Contract

- `src/types/`: Stage A TypeScript interfaces/types only; zero runtime logic.
- `src/schemas/`: Stage A Zod boundary schemas; every object uses `.strict()`.
- `tests/`: Stage C adversarial oracles.
- `src/engine/`: Stage B functional engines and state evaluators.
- Cross-layer circular dependencies are forbidden.
- Delivery progression is strictly `A -> C -> B`.
- Each delivery unit changes fewer than 200 non-lockfile lines.
- Auto-generated lockfiles are excluded from the LOC ceiling.

## Micro-Envelope Contract

A candidate is invalid when added plus deleted non-lockfile lines is `>= 200`.
Binary changes fail closed unless a human-authorized contract explicitly permits
them. No agent may split one logical change to evade the ceiling.

## Zero Interface Speculation

Do not invent fields, paths, authorities, operations, stages, or aliases.
Canonical relative paths must not contain empty, `.`, `..`, NUL, drive-prefix,
or absolute-path segments. SHA-256 identities use `sha256:` plus 64 lowercase
hex digits. Unknown Zod object properties fail validation.

## Workpiece Boundary

A target repository is materialized into a scrubbed scratchpad without `.git`,
`.github`, workflow files, supervisor state, credentials, or host metadata.
SCOUT sees only authorized read-only source/AST content and frozen proposal
contracts. PLAN may emit only `.proposals/*.json`; the supervisor unlinks each
staged proposal immediately after reading its bytes.

Target writes are allowed only in IMPLEMENT mode, after `PRE_CODE_READY`, and
only inside `authorized_candidate_paths` in the isolated workpiece.

## Sensitive Paths

Workers have zero access to:
- `.harness/`, including private keys, lowering tables, static gates, registries;
- `.scratch/` and `logs/`;
- target `.git/`, `.github/`, workflows, or unauthorized target paths;
- `/var/run/docker.sock`, host volumes, secrets, or Git credentials.

## Human-Exclusive Authority

Only the human operator may:
- provision, rotate, or revoke `.harness/ed25519.key`;
- authorize One-Strike Reset overrides or branch termination decisions;
- modify authoritative `references/`, `.harness/lowering-table.json`, or
  `.harness/static-gate.json` except through an exact human-directed change;
- apply production Supabase migrations or credentials;
- resolve HITL pause/resume gates;
- merge exported candidate PRs into a target workpiece main branch.

Agents have zero authority over protected state, authority sets, test criteria,
or completion.

## Agent Modes

### SCOUT
Permitted: read-only filesystem exploration, AST visitors, symbol searches.
Revoked: writes, patching, bash, package installation, git, sealing.

### PLAN
Permitted: read-only inspection and creation of `.proposals/*.json` only.
Revoked: shell execution, compiler execution, patching, git, sealing.

### IMPLEMENT
Requires `PRE_CODE_READY` and a sealed DAG. Permitted: bounded `write_file` and
sandboxed `bash` inside authorized candidate paths. Forbidden: raw package
installs, network/socket access, git, host mounts, sealing, authority mutation,
or self-verification.

Mid-flight capability revocation terminates execution. Three consecutive
oscillating/repetitive tool invocations halt the node.

## Universal Agent Bans

No agent may:
- execute sealing commands or access signing keys;
- declare itself ready, complete, accepted, or passed;
- weaken, skip, focus, mock away, or rewrite an oracle to obtain green;
- write prose delivery summaries as evidence;
- mutate protected authority to repair implementation failures.

## One-Strike Reset

Architectural boundary violation, schema weakening/mutation, protected-state
mutation, test softening, authority expansion, sandbox escape, evidence
tampering, or LOC-cap bypass has repair budget zero.

On detection: terminate execution, mark the branch terminal, preserve exact
negative evidence, append the failure receipt, and await human branch-termination
authority before deletion/restart. Do not repair a terminal branch.

Tactical implementation errors have at most two bounded repair iterations.

## Sandbox Invariants

IMPLEMENT containers use a digest-pinned OCI image, deny-all network, non-root
execution, read-only system mounts, dropped capabilities, no-new-privileges,
and no Docker socket. Tool capability may only decrease during execution.

## Evidence Contract

Machine evidence, not model prose, determines state:
- `trace_red.log`: intended Stage C failure before Stage B.
- `trace_green.log`: Stage C pass after Stage B.
- `tree_hash.receipt`: deterministic scrubbed-workpiece SHA-256 manifest.
- `DELIVERY.txt`: machine-templated digest/signature receipt.
- `dag.json` plus raw-hex `dag.sig`.

TaskEnvelope identity: `<increment_id>-<stage>-<hash>`.
Candidate digest format: `^sha256:[a-f0-9]{64}$`.

## Stage C Anti-Reward-Hacking Rules

Forbidden: `test.skip`, `it.skip`, `describe.skip`, `test.only`, `it.only`.
Tests may not mock `crypto`, `fs`, `node:child_process`, or supervisor verifier
engines. Tautological assertions and vacuous truthiness/length checks fail lint.

A red oracle counts only when it fails for the intended falsification reason.
Freeze Stage C oracle bytes before Stage B; changing them requires reset.

## TypeScript Mechanical Rules

Canonical source: https://google.github.io/styleguide/tsguide.html
Frozen source SHA-256:
`f175e2dbbea31bc40a73e757bbea11f53ad1580bd5d6aa4d10288fa6505832bb`.

Mechanical AST gates enforce:
- zero type assertions, non-null assertions, and explicit `any`;
- `noImplicitAny` and explicit exported parameter/return types;
- readonly properties/arrays in Stage A type files;
- object-type nesting depth `<= 3`;
- finite termination bounds for recursive schemas;
- no untyped domain `throw`; use discriminated-union results;
- exhaustive union switches with `assertNever(x: never): never`;
- schema files contain boundary definitions only;
- type files contain data contracts only.

## Toolchain Gates

Required commands:
- install: `npm ci` (or human-approved `pnpm install --frozen-lockfile`);
- build: `npm run build`;
- lint: `npm run lint`;
- typecheck: `npm run typecheck`;
- test: `npm run test`;
- format: `npm run format:check`.

Use non-interactive flags. Deterministic decisions may not depend on wall-clock
time, randomness, filesystem enumeration order, or remote timing. A green
command proves only its own gate and never confers completion authority.
