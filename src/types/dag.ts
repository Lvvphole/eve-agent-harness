import type { ProposalOpType, TextSpan } from './proposals.js';

export interface DagNode {
  readonly id: string;
  readonly target_path: string;
  readonly op_type: ProposalOpType;
  readonly span: TextSpan;
  readonly payload: string;
  readonly dependencies: readonly string[];
}

export interface CompiledDag {
  readonly schema_version: 1;
  readonly task_envelope_id: string;
  readonly authority_id: string;
  readonly source_digest: string;
  readonly execution_order: readonly string[];
  readonly nodes: readonly DagNode[];
}

export interface SealedDagArtifact {
  readonly dag_json: string;
  readonly dag_sha256: string;
  readonly signature_hex: string;
  readonly signer_public_key: string;
}

export type DagValidationErrorCode =
  | 'CYCLE_DETECTED'
  | 'MISSING_DEPENDENCY'
  | 'INVALID_TOPOLOGICAL_ORDER'
  | 'DUPLICATE_NODE_ID'
  | 'SCHEMA_VIOLATION';

export interface DagValidationError {
  readonly code: DagValidationErrorCode;
  readonly message: string;
  readonly node_id?: string;
}

export type DagValidationResult =
  | { readonly success: true; readonly data: CompiledDag }
  | { readonly success: false; readonly errors: readonly DagValidationError[] };
