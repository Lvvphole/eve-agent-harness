# Security Boundaries

## Human-only authority

Only the human operator may:
- provision, rotate, or revoke `.harness/ed25519.key`;
- authorize branch termination/restart after One-Strike Reset;
- modify protected governance in `references/` or protected `.harness/` state
  unless an exact human TaskEnvelope authorizes that change;
- apply production Supabase migrations or credentials;
- resolve HITL pause/resume gates;
- merge exported candidate pull requests.

Agents have zero authority over protected state, authority sets, test criteria,
signing keys, or completion.

## Supervisor-sensitive paths

Workers have zero access to:
- `.harness/`;
- `.scratch/`;
- `logs/`;
- supervisor credentials, registries, signing material, or host secrets.

## Workpiece-sensitive paths

Before worker mounting, scrub target:
- `.git/`;
- `.github/`;
- workflow files;
- paths outside `authorized_candidate_paths`.

Reject escaping symlinks and host-volume exposure.

## Modes

### SCOUT
Read-only filesystem/AST/symbol inspection. No writes, patching, bash, package
installation, git, network, or sealing.

### PLAN
Read-only inspection plus creation of `.proposals/*.json` only. No shell,
compiler execution, git, patching, network, or sealing. The supervisor unlinks a
staged proposal immediately after reading its bytes.

### IMPLEMENT
Requires `PRE_CODE_READY` and a sealed DAG. Allow only bounded writes and
sandboxed shell execution inside `authorized_candidate_paths`. Ban raw package
installs, git, network/socket connections, host mounts, sealing, authority
mutation, and self-verification.

Mid-flight capability revocation terminates execution. Three consecutive
oscillating/repetitive tool calls halt the node.

## Sandbox

IMPLEMENT runs in a digest-pinned OCI container with:
- deny-all network;
- non-root user;
- read-only system mounts where applicable;
- dropped Linux capabilities;
- no-new-privileges;
- no `/var/run/docker.sock`;
- bounded writable workpiece storage only.

Capabilities may only decrease during a run.
