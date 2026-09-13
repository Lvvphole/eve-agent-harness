# Stage 04: Sandbox and Tool Confinement

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 4: sealed DAG, workspace receipt, authorized capability envelope

## Process

1. Stage A: define OCI identity, network, tool, revocation, and sandbox schemas.
2. Stage C: falsify network egress, Docker socket access, host probing,
   capability expansion, forbidden tools, and oscillating calls.
3. Freeze the oracle and capture intended red evidence.
4. Stage B: launch a digest-pinned, non-root, deny-all-network container with
   dropped capabilities and no Docker socket.
5. Stage B: enforce state/DAG/task/sandbox tool intersection and mid-flight
   revocation. Halt on three repetitive oscillating invocations.

## Outputs

- `src/types/sandbox.ts`
- `src/schemas/sandbox.ts`
- `tests/sandbox.test.ts`
- `src/engine/sandbox.ts`
- `src/engine/tool-manager.ts`

## Exit

IMPLEMENT may run only inside the established capability envelope.
