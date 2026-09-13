# Stage 07: Bounded Subagents

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/07_subagents.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: parent authority, path, capability, and context envelope

## Process

1. Stage A: define child lifecycle, context, authority-subset, and depth contracts.
2. Stage C: falsify context leakage, scope expansion, unbounded recursion,
   self-delegation, and cyclic messaging.
3. Stage B: construct bounded child context, enforce finite depth, execute, and
   reduce observations to structured output.

## Outputs

- subagent types/schema;
- subagent adversarial oracle;
- subagent engine.

## Exit

Child capabilities, paths, and context must remain subsets of the parent.
