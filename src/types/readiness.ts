export type ReadinessState =
  | 'UNBOUND'
  | 'SCOUT_READY'
  | 'PLAN_READY'
  | 'PRE_CODE_READY'
  | 'WORKSPACE_READY'
  | 'SANDBOX_READY'
  | 'IMPLEMENTING'
  | 'VERIFYING'
  | 'EXPORTABLE'
  | 'EXPORTED'
  | 'BLOCKED'
  | 'FAILED'
  | 'RESET_REQUIRED';

export type ExecutionMode = 'SCOUT' | 'PLAN' | 'IMPLEMENT';

export type HexSha256 = string & {readonly __brand: unique symbol};
export type HexSha1 = string & {readonly __brand: unique symbol};
export type CanonicalRelativePath = string & {readonly __brand: unique symbol};

export interface AuthorityBinding {
  readonly authorityId: string;
  readonly publicKeyId: string;
  readonly authorizedRoutes: readonly string[];
  readonly grantTimestamp: string;
}

export interface TaskEnvelope {
  readonly envelopeId: string;
  readonly targetRepo: string;
  readonly targetCommitSha1: HexSha1;
  readonly baseSourceTreeSha256: HexSha256;
  readonly permittedMode: ExecutionMode;
  readonly authorizedPaths: readonly CanonicalRelativePath[];
  readonly authorizedCapabilities: readonly string[];
}

export interface ReadinessTransitionReceipt {
  readonly fromState: ReadinessState;
  readonly toState: ReadinessState;
  readonly gatePassed: string;
  readonly evidenceSha256: HexSha256;
}

export interface ReadinessRecord {
  readonly state: ReadinessState;
  readonly envelopeId: string;
  readonly authority: AuthorityBinding;
  readonly activeMode: ExecutionMode;
  readonly completedTransitions: readonly ReadinessTransitionReceipt[];
  readonly failureReason: string | null;
}
