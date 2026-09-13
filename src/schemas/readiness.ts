import { z } from 'zod';

export const ReadinessStateSchema = z.enum([
  'UNBOUND',
  'SCOUT_READY',
  'PLAN_READY',
  'PRE_CODE_READY',
  'WORKSPACE_READY',
  'SANDBOX_READY',
  'IMPLEMENTING',
  'VERIFYING',
  'EXPORTABLE',
  'EXPORTED',
  'BLOCKED',
  'FAILED',
  'RESET_REQUIRED',
]);

export const ExecutionModeSchema = z.enum(['SCOUT', 'PLAN', 'IMPLEMENT']);

export const HexSha256Schema = z.string().regex(/^[0-9a-f]{64}$/);

export const HexSha1Schema = z.string().regex(/^[0-9a-f]{40}$/);

export const CanonicalRelativePathSchema = z
  .string()
  .regex(
    /^(?![\/\\])(?!.*(?:^|\/)\.\.?(?:\/|$))(?!.*\/\/)[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/
  );

export const AuthorityBindingSchema = z
  .object({
    authorityId: z.string().min(1),
    publicKeyId: z.string().min(1),
    authorizedRoutes: z.array(z.string().min(1)),
    grantTimestamp: z.string().datetime(),
  })
  .strict();

export const TaskEnvelopeSchema = z
  .object({
    envelopeId: z.string().min(1),
    targetRepo: z.string().min(1),
    targetCommitSha1: HexSha1Schema,
    baseSourceTreeSha256: HexSha256Schema,
    permittedMode: ExecutionModeSchema,
    authorizedPaths: z.array(CanonicalRelativePathSchema),
    authorizedCapabilities: z.array(z.string().min(1)),
  })
  .strict();

export const ReadinessTransitionReceiptSchema = z
  .object({
    fromState: ReadinessStateSchema,
    toState: ReadinessStateSchema,
    gatePassed: z.string().min(1),
    evidenceSha256: HexSha256Schema,
  })
  .strict();

export const ReadinessRecordSchema = z
  .object({
    state: ReadinessStateSchema,
    envelopeId: z.string().min(1),
    authority: AuthorityBindingSchema,
    activeMode: ExecutionModeSchema,
    completedTransitions: z.array(ReadinessTransitionReceiptSchema),
    failureReason: z.string().nullable(),
  })
  .strict();
