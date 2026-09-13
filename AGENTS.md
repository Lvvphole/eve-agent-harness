# eve-agent-harness Governance

## Authority

This repository is the out-of-band supervisor. Target repositories are untrusted
workpieces. Agents may propose changes; they never hold readiness, acceptance,
sealing, protected-state, or merge authority.

Authority order:
1. This root `AGENTS.md`.
2. Human-authorized TaskEnvelope and protected supervisor state.
3. Root `CLAUDE.md` execution directives.
4. `references/proposal-contract.md` and other human-authored references.
5. Strict runtime schemas.
6. Sealed DAG and deterministic machine evidence.

Nested `AGENTS.md` files are forbidden. Lower authority may restrict but never
expand higher authority.

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

Do not invent fields, paths, authorities, operations, or compatibility aliases.
All security-relevant strings are validated. Canonical relative paths must not
contain empty, `.`, `..`, NUL, drive-prefix, or absolute-path segments.
SHA-256 identities are lowercase hexadecimal with `sha256:` plus 64 hex digits.
Unknown Zod object properties fail validation.

## Workpiece Boundary

A target repository is materialized into a scrubbed scratchpad without `.git`,
`.github`, workflow files, supervisor state, credentials, or host metadata.
SCOUT sees only authorized read-only source/AST content and frozen proposal
contracts. PLAN may emit only `.proposals/*.json`. Proposal ingestion unlinks a
staged proposal immediately after supervisor read.

Target writes are allowed only in IMPLEMENT mode, only after `PRE_CODE_READY`,
and only inside `authorized_candidate_paths` in the isolated workpiece.

## Sensitive Paths

Workers have zero access to:
- `.harness/` private state, including `ed25519.key`, lowering tables, static
  gates, and verification registries.
- `.scratch/` and `logs/` supervisor sandboxes and quarantined traces.
- Target `.git/`, `.github/`, workflow files, or unauthorized target paths.
- `/var/run/docker.sock`, host volumes, supervisor secrets, or Git credentials.

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
sandboxed `bash` only within authorized candidate paths. Forbidden: raw package
installs, network/socket access, git operations, host mounts, sealing, authority
mutation, or self-verification.

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

On detection: terminate execution, mark branch terminal, preserve the exact
failure as negative evidence, append the failure receipt, delete the active
branch, restart from authorized `main`, and return to Stage A. Do not repair the
violated branch.

Tactical implementation errors have at most two bounded repair iterations.

## Sandbox Invariants

IMPLEMENT containers use a digest-pinned OCI image, deny-all network, non-root
execution, read-only system mounts, dropped capabilities, no-new-privileges,
and no Docker socket. Tool capability may only decrease during execution.

## Evidence Contract

Machine evidence, not model prose, determines state. Required artifacts include:
- `trace_red.log`: expected Stage C failure before Stage B.
- `trace_green.log`: Stage C pass after Stage B.
- `tree_hash.receipt`: deterministic scrubbed-workpiece SHA-256 manifest.
- `DELIVERY.txt`: machine-templated digest/signature receipt.
- `dag.json` plus raw-hex `dag.sig`.

TaskEnvelope identity: `<increment_id>-<stage>-<hash>`.
Candidate digest format: `^sha256:[a-f0-9]{64}$`.

## Stage C Anti-Reward-Hacking Rules

Forbidden Vitest members: `test.skip`, `it.skip`, `describe.skip`, `test.only`,
`it.only`. Tests may not mock `crypto`, `fs`, `node:child_process`, or supervisor
verification engines. Tautological assertions such as `toBeDefined()`,
generic truthiness, or vacuous length comparisons are rejected.

A red oracle counts only when it fails for the intended falsification reason.
Freeze Stage C oracle bytes before Stage B; changing them requires reset.

## TypeScript Mechanical Rules

Canonical source: https://google.github.io/styleguide/tsguide.html
Frozen source SHA-256: `f175e2dbbea31bc40a73e757bbea11f53ad1580bd5d6aa4d10288fa6505832bb`.

Mechanical AST gates must enforce:
- zero type assertions and zero non-null assertions;
- zero explicit `any`; `noImplicitAny` enabled;
- explicit parameter and return types on exported functions;
- readonly properties/arrays in Stage A type files;
- object-type nesting depth `<= 3`;
- bounded termination for recursive schemas;
- no untyped `throw`; fallible functions return discriminated unions;
- union switches use an `assertNever(x: never): never` default branch;
- schema files contain Zod boundary definitions only;
- type files contain data contracts only.

## Toolchain Gates

Required commands:
- install: `npm ci` (or `pnpm install --frozen-lockfile` after human-approved
  package-manager change);
- build: `npm run build`;
- lint: `npm run lint`;
- typecheck: `npm run typecheck`;
- test: `npm run test`;
- format: `npm run format:check`.

A green command is evidence only for the gate it executes. It does not confer
completion authority.
