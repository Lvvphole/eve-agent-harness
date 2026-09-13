# Verification Policy

## Stage lineage

Behavior-bearing work follows `Stage A -> Stage C -> Stage B`.

Stage C must prove the intended null/invalid implementation fails for the
expected reason. Freeze the oracle bytes before Stage B. Changing the frozen
oracle to make Stage B pass is a One-Strike violation.

## One-Strike Reset

Repair budget is zero for:
- architectural boundary bypass;
- schema weakening or mutation;
- protected-state mutation;
- test weakening;
- authority expansion;
- sandbox escape;
- evidence tampering;
- LOC-cap bypass.

On detection: stop execution, mark the branch terminal, preserve exact negative
evidence, append the failure receipt, and await human branch termination/restart
authority. Do not repair the terminal branch.

Tactical implementation errors have at most two bounded repair iterations.

## Adversarial test rules

Forbidden Vitest controls:
- `test.skip`, `it.skip`, `describe.skip`;
- `test.only`, `it.only`.

Tests may not mock:
- `crypto`;
- `fs`;
- `node:child_process`;
- supervisor verification engines.

Reject tautological assertions such as generic defined/truthy checks or vacuous
length comparisons. Assertions must bind to explicit expected values or failure
classes.

## Required evidence

- `trace_red.log`: intended Stage C failure before Stage B.
- `trace_green.log`: frozen Stage C oracle passing after Stage B.
- `tree_hash.receipt`: deterministic SHA-256 workpiece manifest.
- `DELIVERY.txt`: machine-templated digest/signature receipt.
- `dag.json` + raw-hex `dag.sig`.

Candidate digest format: `^sha256:[a-f0-9]{64}$`.
TaskEnvelope identity: `<increment_id>-<stage>-<hash>`.

Agent prose is never evidence.

## Completion authority

The deterministic supervisor derives candidate state from validated bytes,
hashes, signatures, exit codes, and frozen policy. Agents cannot self-approve.
Only the human operator may merge into a target main branch.
