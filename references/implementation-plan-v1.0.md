# eve-agent-harness Implementation Plan v1.0
Status: FROZEN / APPROVED FOR EXECUTION  
Baseline: `main@ed6925cb5ac807b5c3dee8d7d13399b5b3aef711`  
Change rule: material architectural changes require a new plan version.

## 1. Goal
Build `eve-agent-harness` as a standalone out-of-band supervisor for untrusted target repositories. It controls source acquisition, routing, proposal compilation, readiness, sandboxing, verification, export, and local-first persistence. Agents never hold readiness, sealing, acceptance, protected-state, or merge authority.

## 2. Frozen invariants
1. Target workpieces are materialized without `.git`, `.github`, workflows, supervisor state, secrets, or host metadata.
2. Each delivery unit changes fewer than 200 non-lockfile lines, additions plus deletions.
3. Behavior-bearing work follows `Stage A -> Stage C -> Stage B`.
4. Security-relevant payloads use strict contracts; unknown fields, paths, operations, authorities, or capabilities fail closed.
5. Architecture bypass, schema/oracle weakening, authority expansion, sandbox escape, protected-state mutation, or evidence tampering triggers One-Strike Reset.
6. Exit codes, canonical bytes, hashes, and Ed25519 signatures are evidence; agent prose is not.
7. Local append-only JSONL state is authoritative; Supabase replication is asynchronous and non-blocking.
8. Every repository `read`, `grep`, or `write` requires an exact supervisor-supplied `route_id` and exact path ALLOW.

## 3. Package boundaries
- `src/types/`: Stage A TypeScript data contracts only.
- `src/schemas/`: Stage A Zod runtime boundary contracts using `.strict()`.
- `tests/`: Stage C adversarial oracles.
- `src/engine/`: Stage B engines/state evaluators.
- `references/`: protected Layer 3 policy and frozen plans.
- `stages/*/CONTEXT.md`: Layer 2 route contracts.
- Cross-layer circular dependencies are forbidden.
Runtime schema domains: readiness, proposals, dag, workspace, sandbox, exporter, persistence, subagents.

## 4. Pre-SCOUT sanitization
The target repository is never mounted directly into SCOUT or PLAN.
Supervisor ingestion must:
1. resolve exact source identity;
2. create a sanitized snapshot;
3. remove Git/workflow metadata;
4. reject escaping symlinks;
5. compute deterministic SHA-256 tree receipt;
6. expose only the sanitized snapshot read-only.
The exact same sealed snapshot creates the later writable IMPLEMENT workspace. Re-reading the live target between PLAN and IMPLEMENT is prohibited.

## 5. Stage C dual-layer oracle
Stage C tests input falsification, not stub absence.
- Inner oracle: invalid input is expected to yield an exact domain-specific rejection. The null implementation cannot produce it, so inner execution is non-zero and `trace_red.log` is captured.
- Outer control: CI passes only when the expected inner red signal and failure class are observed.
- Stage B must make the unchanged frozen oracle pass by returning the exact expected rejection.
Syntax/import errors, random crashes, and `UnimplementedError` are invalid red evidence.

## 6. INC-0 bootstrap dependency loop
INC-0 readiness/compiler work uses static sanitized snapshot fixtures under `tests/fixtures/`. It must not depend on `src/engine/workspace.ts`. Full runtime materialization is integrated only after INC-1B passes its own oracle.

## 7. PLAN structured-output transport
PLAN has no repository-write authority. It emits exactly one canonical proposal JSON document to stdout, framed by supervisor-defined sentinel bytes.
The supervisor captures stdout, rejects missing/duplicate/nested/malformed frames, extracts exactly one payload, validates it against `src/schemas/proposals.ts`, canonicalizes accepted bytes, then performs the atomic `.proposals/` write itself.
Exact sentinel bytes are Stage A transport-contract data and must be frozen before PLAN runtime is enabled; agents may not invent or vary them.

## 8. Span checker bound
`src/engine/span-checker.ts` uses `ts.createSourceFile` plus bounded syntactic AST traversal only. It must not use `ts.createProgram`, semantic type checking, compiler-host construction, or project-wide program analysis. Target: <140 LOC.

## 9. Sandbox separation
`src/engine/sandbox.ts` owns container lifecycle/isolation only:
- digest-pinned OCI image;
- deny-all network;
- non-root execution;
- no Docker socket;
- dropped capabilities;
- no-new-privileges;
- bounded writable workpiece;
- supervisor state absent from mounts.
`src/engine/tool-manager.ts` owns in-sandbox dispatch only:
- state-gated allowlist;
- sealed-DAG tool membership;
- TaskEnvelope capability membership;
- mid-flight revocation;
- halt after three oscillating calls.
Host daemon privilege and worker runtime privilege must never be combined.

## 10. Runtime lifecycle
`AUTHORIZED TARGET + COMMIT`
-> sanitized source ingestion
-> read-only sealed snapshot
-> SCOUT
-> PLAN stdout proposal
-> PLAN termination / air gap
-> readiness + span + mutation controls
-> deterministic DAG lowering
-> canonical JSON + Ed25519 seal
-> `PRE_CODE_READY`
-> writable workspace from same snapshot
-> digest-pinned Docker sandbox
-> IMPLEMENT sealed DAG only
-> independent verification
-> <200 changed-line enforcement
-> canonical candidate export
-> local JSONL append/fsync
-> optional async Supabase replication.

## 11. Increment sequence
| Increment | Stage A | Stage C | Stage B |
|---|---|---|---|
| PRE-0 | repository preflight | n/a | n/a |
| Phase 0 | governance/toolchain bootstrap | n/a | n/a |
| INC-0.1 | readiness + routing contracts | authority/routing falsification | readiness + routing engines |
| INC-0.2 | proposal + DAG contracts | cycle/span/lowering/signature falsification | span checker/compiler/sealer |
| INC-1 | workspace contracts | Git/symlink/tree falsification | sanitized materializer |
| INC-2 | sandbox contracts | egress/socket/capability falsification | sandbox + tool manager |
| INC-3 | exporter contracts | scope/LOC/patch falsification | verifier/exporter |
| INC-4 | persistence contracts | replay/tamper falsification | local ledger + async sync |
| INC-5 | subagent contracts | leakage/recursion/cycle falsification | bounded subagent runtime |
Each row is delivered as bounded A/C/B micro-envelopes, not one large change.

## 12. PRE-0 repository preflight
Before new implementation code:
1. bind exact `main` HEAD;
2. read `AGENTS.md`, `CONTEXT.md`, exact route contract, exact route JSON;
3. inventory repository files;
4. verify no nested `AGENTS.md`;
5. verify `CLAUDE.md` is exactly `@AGENTS.md`;
6. verify route IDs/files are one-to-one;
7. verify route paths are canonical/exact;
8. verify zero/multiple route matches are BLOCKED;
9. verify protected writes require exact human authorization;
10. verify package/toolchain configuration and blocked gates;
11. record unmet prerequisites as `BLOCKED`, never guessed or repaired around.

## 13. Phase 0 bootstrap gate
Phase 0 establishes only:
- compact root governance and ICM routing;
- strict TypeScript configuration;
- Zod/Vitest/ESLint/Prettier toolchain;
- deterministic scripts;
- dependency lockfile;
- fail-closed placeholders for gates whose A/C/B implementations do not exist.
It does not create engine behavior, signing keys, production Supabase credentials, or target deployment logic.

## 14. Mechanical readiness predicates
`PRE_CODE_READY` requires: authority valid; route valid; source identity valid; proposal schema valid; canonical/authorized paths and spans; closed lowering table; acyclic DAG; frozen red lineage proven; oracle hash unchanged; canonical DAG signature valid.
`WORKSPACE_READY` additionally requires: source-tree hash match; Git/workflow metadata absent; no escaping symlink; deterministic workspace receipt.
`SANDBOX_READY` additionally requires: digest-pinned image; deny-all network; non-root; Docker socket absent; privilege expansion disabled; requested tools subset of authorized tools.
`EXPORTABLE` additionally requires: independent frozen-oracle verification green; candidate paths authorized; changed lines <200; candidate hash stable before/after verification; sealed DAG valid; no protected-state mutation.

## 15. Evidence identities
Target source identity; source-tree SHA-256; TaskEnvelope identity; proposal SHA-256; oracle SHA-256; `trace_red.log` SHA-256; DAG SHA-256; Ed25519 DAG signature; workspace receipt SHA-256; OCI digest; candidate-tree SHA-256; verification receipt SHA-256; patch SHA-256; ledger-head SHA-256.

## 16. Architectural readiness assessment
| Gate | Status | Mechanism |
|---|---|---|
| Supervisor/workpiece isolation | VERIFIED BY DESIGN | pre-SCOUT sanitized snapshot |
| A -> C -> B | VERIFIED BY DESIGN | inner red trace + outer CI control |
| <200 LOC envelope | VERIFIED BY DESIGN | bounded sub-increments; lockfile excluded |
| Runtime strictness | VERIFIED BY DESIGN | strict Zod across eight domains |
| Local determinism | VERIFIED BY DESIGN | local ledger precedes remote sync |
| Repository routing | VERIFIED BY DESIGN | exact route ID + exact path + fail-closed match |
These are architecture predicates; runtime proof is produced by the corresponding mechanical gates.

## 17. Execution boundary
Authorized next work:
1. PRE-0 against the merged baseline.
2. Complete any still-unproven Phase 0 prerequisites.
3. Begin INC-0.1 Stage A only after PRE-0 and Phase 0 are mechanically satisfied.
No Stage B readiness/routing engine is authorized before its frozen Stage C adversarial oracle exists.
