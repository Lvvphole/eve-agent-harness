# Stage 04: Sandbox and Tool Confinement

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/04_sandbox.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: sealed DAG, workspace receipt, authorized capability envelope

## Process

1. Stage A: define OCI, network, tool, revocation, and sandbox contracts.
2. Stage C: falsify egress, Docker socket/host access, capability expansion,
   forbidden tools, and oscillation.
3. Stage B: enforce the digest-pinned sandbox and state/DAG/task capability
   intersection.

## Outputs

- sandbox types/schema;
- sandbox adversarial oracle;
- sandbox engine and tool manager.

## Exit

IMPLEMENT runs only inside the verified capability envelope.
