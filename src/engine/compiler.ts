import * as crypto from 'node:crypto';
import { proposedOperationSchema } from '../schemas/proposals.js';
import { sealedDagArtifactSchema } from '../schemas/dag.js';
import type {
  CompiledDag,
  DagValidationErrorCode,
  DagValidationResult,
  SealedDagArtifact,
} from '../types/dag.js';
import type { ProposedOperation } from '../types/proposals.js';
const PRIVATE_PREFIX = '302e020100300506032b657004220420';
const PUBLIC_PREFIX = '302a300506032b6570032100';
export interface CompileDagInput {
  readonly task_envelope_id: string;
  readonly authority_id: string;
  readonly source_digest: string;
  readonly proposals: readonly unknown[];
}
function failure(
  code: DagValidationErrorCode,
  message: string,
): DagValidationResult {
  return { success: false, errors: [{ code, message }] };
}
function parseProposals(
  values: readonly unknown[],
): readonly ProposedOperation[] | undefined {
  const proposals: ProposedOperation[] = [];
  for (const value of values) {
    const parsed = proposedOperationSchema.safeParse(value);
    if (!parsed.success) return undefined;
    proposals.push(parsed.data);
  }
  return proposals;
}
export function compileDag(input: CompileDagInput): DagValidationResult {
  const proposals = parseProposals(input.proposals);
  if (!proposals) {
    return failure('SCHEMA_VIOLATION', 'One or more proposals are invalid');
  }
  const ids = new Set<string>();
  for (const proposal of proposals) {
    if (ids.has(proposal.op_id)) {
      return failure(
        'DUPLICATE_NODE_ID',
        `Duplicate node ID: ${proposal.op_id}`,
      );
    }
    ids.add(proposal.op_id);
  }
  for (const proposal of proposals) {
    for (const dependency of proposal.dependencies) {
      if (!ids.has(dependency)) {
        return failure(
          'MISSING_DEPENDENCY',
          `Node ${proposal.op_id} depends on missing node ${dependency}`,
        );
      }
    }
  }
  const remaining = new Map(
    proposals.map((proposal) => [proposal.op_id, proposal.dependencies.length]),
  );
  const dependents = new Map<string, string[]>();
  for (const proposal of proposals) {
    for (const dependency of proposal.dependencies) {
      const list = dependents.get(dependency) ?? [];
      list.push(proposal.op_id);
      dependents.set(dependency, list);
    }
  }
  const ready = proposals
    .filter((proposal) => proposal.dependencies.length === 0)
    .map((proposal) => proposal.op_id)
    .sort();
  const executionOrder: string[] = [];
  while (ready.length > 0) {
    const id = ready.shift();
    if (!id) break;
    executionOrder.push(id);
    for (const dependent of dependents.get(id) ?? []) {
      const count = remaining.get(dependent);
      if (count === undefined) continue;
      remaining.set(dependent, count - 1);
      if (count === 1) {
        ready.push(dependent);
        ready.sort();
      }
    }
  }
  if (executionOrder.length !== proposals.length) {
    return failure('CYCLE_DETECTED', 'Proposal dependencies contain a cycle');
  }
  const nodes = proposals.map((proposal) => ({
    id: proposal.op_id,
    target_path: proposal.target_path,
    op_type: proposal.op_type,
    span: proposal.span,
    payload: proposal.payload,
    dependencies: proposal.dependencies,
  }));
  return {
    success: true,
    data: {
      schema_version: 1,
      task_envelope_id: input.task_envelope_id,
      authority_id: input.authority_id,
      source_digest: input.source_digest,
      execution_order: executionOrder,
      nodes,
    },
  };
}
function canonicalJson(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean')
    return JSON.stringify(value) ?? 'null';
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(',')}}`;
  }
  return 'null';
}
export function sealDag(
  dag: CompiledDag,
  privateKeyHex: string,
): SealedDagArtifact {
  const dagJson = canonicalJson(dag);
  const bytes = Buffer.from(dagJson, 'utf8');
  const privateKey = crypto.createPrivateKey({
    key: Buffer.concat([
      Buffer.from(PRIVATE_PREFIX, 'hex'),
      Buffer.from(privateKeyHex, 'hex'),
    ]),
    format: 'der',
    type: 'pkcs8',
  });
  const publicDer = crypto.createPublicKey(privateKey).export({
    format: 'der',
    type: 'spki',
  });
  return {
    dag_json: dagJson,
    dag_sha256: `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`,
    signature_hex: crypto.sign(null, bytes, privateKey).toString('hex'),
    signer_public_key: publicDer.subarray(12).toString('hex'),
  };
}
export function verifySealedDag(artifact: SealedDagArtifact): boolean {
  if (!sealedDagArtifactSchema.safeParse(artifact).success) return false;
  const bytes = Buffer.from(artifact.dag_json, 'utf8');
  const digest = `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
  if (digest !== artifact.dag_sha256) return false;
  try {
    const publicKey = crypto.createPublicKey({
      key: Buffer.concat([
        Buffer.from(PUBLIC_PREFIX, 'hex'),
        Buffer.from(artifact.signer_public_key, 'hex'),
      ]),
      format: 'der',
      type: 'spki',
    });
    return crypto.verify(
      null,
      bytes,
      publicKey,
      Buffer.from(artifact.signature_hex, 'hex'),
    );
  } catch {
    return false;
  }
}
