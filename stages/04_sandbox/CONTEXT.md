# Route 04_sandbox: Sandbox and Tool Confinement

## Repository Access

The only repository path authority for this route is
`../../references/routes/04_sandbox.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/04_sandbox.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: sealed DAG
- Layer 4: workspace receipt
- Layer 4: authorized capability envelope

## Process

1. Stage A: define OCI, network, tool, revocation, and sandbox contracts.
2. Stage C: falsify egress, Docker socket/host access, capability expansion, forbidden tools, and oscillation.
3. Stage B: enforce the digest-pinned sandbox and state/DAG/task/routing capability intersection.

## Outputs

- `src/types/sandbox.ts`
- `src/schemas/sandbox.ts`
- `tests/sandbox.test.ts`
- `src/engine/sandbox.ts`
- `src/engine/tool-manager.ts`

## Exit

IMPLEMENT runs only inside the verified capability and repository-route envelope.
