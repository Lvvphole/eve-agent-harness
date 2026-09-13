# Canonical Engineering Rules

This file records the human-authorized external engineering source identity.
It does not copy or replace the upstream guide.

- Source: https://google.github.io/styleguide/tsguide.html
- Frozen source representation: `google/styleguide` `gh-pages/tsguide.html`
- Frozen SHA-256: `f175e2dbbea31bc40a73e757bbea11f53ad1580bd5d6aa4d10288fa6505832bb`
- Source modified date observed at freeze: `2025-01-18T01:02:17Z`

The mechanical rules required by this repository are stricter where root
`AGENTS.md` says so. Upstream prose never expands agent authority.

## Mechanical Additions

- No type assertions or non-null assertions.
- No explicit `any`; implicit `any` is a compiler error.
- Exported functions have explicit parameter and return types.
- Stage A type properties and arrays are readonly.
- Object-type nesting depth is at most 3.
- Recursive schemas declare a finite termination bound.
- Untyped `throw` is forbidden for fallible domain operations; return a
  discriminated union result.
- Union switches use an `assertNever(x: never): never` default branch.
- Stage C cannot skip/focus tests, mock supervisor trust primitives, or use
  tautological assertions.
