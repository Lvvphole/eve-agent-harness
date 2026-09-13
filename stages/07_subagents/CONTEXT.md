# Stage 07_subagents: Bounded Subagents

## Repository Access

The only repository path authority for this stage is
`../../references/routes/07_subagents.json` under `../../references/routing-policy.md`.
Do not infer read, grep, or write permission from prose. Any unlisted path is
`BLOCKED`.

## Inputs

- Layer 3: `../../references/routing-policy.md`
- Layer 3: `../../references/routes/global.json`
- Layer 3: `../../references/routes/07_subagents.json`
- Layer 3: `../../references/engineering-rules.md`
- Layer 3: `../../references/security-boundaries.md`
- Layer 3: `../../references/verification-policy.md`
- Layer 4: parent authority envelope
- Layer 4: parent path envelope
- Layer 4: parent capability envelope
- Layer 4: parent context envelope

## Process

1. Stage A: define child lifecycle, context, authority-subset, and depth contracts.
2. Stage C: falsify context leakage, scope expansion, unbounded recursion, self-delegation, and cyclic messaging.
3. Stage B: construct bounded child context, enforce finite depth, execute, and reduce observations to structured output.

## Outputs

- `src/types/subagents.ts`
- `src/schemas/subagents.ts`
- `tests/subagents.test.ts`
- `src/engine/subagents.ts`

## Exit

Child capabilities, paths, and context must remain subsets of the parent.
