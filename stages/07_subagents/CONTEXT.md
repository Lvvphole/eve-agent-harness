# Stage 07: Bounded Subagents

## Inputs

- Layer 0: `../../AGENTS.md`
- Layer 1: `../../CONTEXT.md`
- Layer 3: `../../references/engineering-rules.md`
- Layer 4: parent authority, path, capability, and context envelope

## Process

1. Stage A: define child lifecycle, context manifest, authority subset, and
   recursion-limit schemas.
2. Stage C: falsify context leakage, capability/path expansion, unbounded
   recursion, self-delegation, and cyclic child messaging.
3. Freeze the oracle and capture intended red evidence.
4. Stage B: construct bounded child context, enforce finite depth, execute, and
   reduce observations to structured output.

## Outputs

- `src/types/subagents.ts`
- `src/schemas/subagents.ts`
- `tests/subagents.test.ts`
- `src/engine/subagents.ts`

## Exit

For every child: capabilities, paths, and context must be subsets of the
authorized parent envelope.
