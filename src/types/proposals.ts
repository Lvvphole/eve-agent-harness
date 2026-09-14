export type ProposalOpType = 'insert' | 'replace' | 'delete';

export interface TextSpan {
  readonly start_line: number;
  readonly start_col: number;
  readonly end_line: number;
  readonly end_col: number;
}

export interface ProposedOperation {
  readonly op_id: string;
  readonly target_path: string;
  readonly op_type: ProposalOpType;
  readonly span: TextSpan;
  readonly payload: string;
  readonly dependencies: readonly string[];
}

export interface PlanProposal {
  readonly task_envelope_id: string;
  readonly authority_id: string;
  readonly source_digest: string;
  readonly authorized_candidate_paths: readonly string[];
  readonly operations: readonly ProposedOperation[];
}

export type ProposalValidationErrorCode =
  | 'UNAUTHORIZED_TARGET_PATH'
  | 'INVALID_SPAN_BOUNDS'
  | 'DUPLICATE_OP_ID'
  | 'DANGLING_DEPENDENCY'
  | 'SCHEMA_VIOLATION';

export interface ProposalValidationError {
  readonly code: ProposalValidationErrorCode;
  readonly message: string;
  readonly path?: string;
}

export type ProposalValidationResult =
  | { readonly success: true; readonly data: PlanProposal }
  | {
      readonly success: false;
      readonly errors: readonly ProposalValidationError[];
    };
