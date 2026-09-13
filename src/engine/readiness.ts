import type {
  HexSha256,
  ReadinessRecord,
  ReadinessState,
  ReadinessTransitionReceipt,
} from '../types/readiness.js';

type TransitionResult =
  | { readonly success: true; readonly record: ReadinessRecord }
  | { readonly success: false; readonly error: string };

interface TransitionData {
  readonly gatePassed: string;
  readonly evidenceSha256: HexSha256;
  readonly failureReason?: string | null;
}

const successors = (
  states: readonly ReadinessState[],
): readonly ReadinessState[] => Object.freeze(states);

export const VALID_TRANSITIONS: Readonly<
  Record<ReadinessState, readonly ReadinessState[]>
> = Object.freeze({
  UNBOUND: successors(['SCOUT_READY', 'BLOCKED', 'FAILED', 'RESET_REQUIRED']),
  SCOUT_READY: successors([
    'PLAN_READY',
    'BLOCKED',
    'FAILED',
    'RESET_REQUIRED',
  ]),
  PLAN_READY: successors([
    'PRE_CODE_READY',
    'BLOCKED',
    'FAILED',
    'RESET_REQUIRED',
  ]),
  PRE_CODE_READY: successors([
    'WORKSPACE_READY',
    'BLOCKED',
    'FAILED',
    'RESET_REQUIRED',
  ]),
  WORKSPACE_READY: successors([
    'SANDBOX_READY',
    'BLOCKED',
    'FAILED',
    'RESET_REQUIRED',
  ]),
  SANDBOX_READY: successors([
    'IMPLEMENTING',
    'BLOCKED',
    'FAILED',
    'RESET_REQUIRED',
  ]),
  IMPLEMENTING: successors([
    'VERIFYING',
    'BLOCKED',
    'FAILED',
    'RESET_REQUIRED',
  ]),
  VERIFYING: successors(['EXPORTABLE', 'BLOCKED', 'FAILED', 'RESET_REQUIRED']),
  EXPORTABLE: successors(['EXPORTED', 'BLOCKED', 'FAILED', 'RESET_REQUIRED']),
  EXPORTED: successors([]),
  BLOCKED: successors(['RESET_REQUIRED']),
  FAILED: successors([]),
  RESET_REQUIRED: successors([]),
});

export function transitionReadiness(
  record: ReadinessRecord,
  targetState: ReadinessState,
  receiptData: TransitionData,
): TransitionResult;
export function transitionReadiness(
  record: ReadinessRecord,
  receipt: ReadinessTransitionReceipt,
  failureReason?: string | null,
): TransitionResult;
export function transitionReadiness(
  record: ReadinessRecord,
  targetOrReceipt: ReadinessState | ReadinessTransitionReceipt,
  dataOrReason?: TransitionData | string | null,
): TransitionResult {
  const receipt = createReceipt(record, targetOrReceipt, dataOrReason);
  if (receipt === null)
    return { success: false, error: 'Transition receipt data is required' };
  if (receipt.fromState !== record.state) {
    return {
      success: false,
      error: 'Transition origin does not match the current state',
    };
  }
  if (!VALID_TRANSITIONS[record.state].includes(receipt.toState)) {
    return {
      success: false,
      error: `Transition ${record.state} -> ${receipt.toState} is not permitted`,
    };
  }

  const suppliedReason =
    dataOrReason !== null && typeof dataOrReason === 'object'
      ? dataOrReason.failureReason
      : dataOrReason;
  const isFailureState =
    receipt.toState === 'FAILED' || receipt.toState === 'BLOCKED';
  return {
    success: true,
    record: {
      ...record,
      state: receipt.toState,
      completedTransitions: [...record.completedTransitions, receipt],
      failureReason: isFailureState ? (suppliedReason ?? null) : null,
    },
  };
}

function createReceipt(
  record: ReadinessRecord,
  targetOrReceipt: ReadinessState | ReadinessTransitionReceipt,
  dataOrReason: TransitionData | string | null | undefined,
): ReadinessTransitionReceipt | null {
  if (typeof targetOrReceipt !== 'string') return targetOrReceipt;
  if (
    dataOrReason === null ||
    dataOrReason === undefined ||
    typeof dataOrReason !== 'object'
  )
    return null;
  return {
    fromState: record.state,
    toState: targetOrReceipt,
    gatePassed: dataOrReason.gatePassed,
    evidenceSha256: dataOrReason.evidenceSha256,
  };
}
