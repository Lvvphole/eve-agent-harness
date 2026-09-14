import { z } from 'zod';

export const DIGEST_REGEX = /^sha256:[a-f0-9]{64}$/;
export const TASK_ENVELOPE_ID_REGEX =
  /^[A-Za-z0-9._-]+-[A-Za-z0-9._-]+-[a-f0-9]{8,64}$/;
export const PROPOSAL_FILENAME_REGEX =
  /^\.proposals\/[A-Za-z0-9][A-Za-z0-9._-]{0,127}\.json$/;
export const CANONICAL_PATH_REGEX =
  /^(?!\/)(?!\.\/)(?!.*\.\.)(?!.*\/$)(?!.*\/\/)[a-zA-Z0-9_.\-]+(?:\/[a-zA-Z0-9_.\-]+)*$/;

export const textSpanSchema = z
  .object({
    start_line: z.number().int().positive(),
    start_col: z.number().int().positive(),
    end_line: z.number().int().positive(),
    end_col: z.number().int().positive(),
  })
  .strict()
  .refine(
    (span) =>
      span.end_line > span.start_line ||
      (span.end_line === span.start_line && span.end_col >= span.start_col),
    {
      message: 'end position must be greater than or equal to start position',
      path: ['end_line'],
    },
  );

export const proposedOperationSchema = z
  .object({
    op_id: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9_.-]+$/),
    target_path: z.string().min(1).regex(CANONICAL_PATH_REGEX),
    op_type: z.enum(['insert', 'replace', 'delete']),
    span: textSpanSchema,
    payload: z.string(),
    dependencies: z.array(
      z
        .string()
        .min(1)
        .regex(/^[a-zA-Z0-9_.-]+$/),
    ),
  })
  .strict();

export const planProposalSchema = z
  .object({
    task_envelope_id: z.string().regex(TASK_ENVELOPE_ID_REGEX),
    authority_id: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9_.:-]+$/),
    source_digest: z.string().regex(DIGEST_REGEX),
    authorized_candidate_paths: z
      .array(z.string().min(1).regex(CANONICAL_PATH_REGEX))
      .nonempty(),
    operations: z.array(proposedOperationSchema).nonempty(),
  })
  .strict()
  .refine(
    (proposal) => {
      const allowed = new Set(proposal.authorized_candidate_paths);
      return proposal.operations.every((op) => allowed.has(op.target_path));
    },
    {
      message:
        'Proposed operations must only target authorized candidate paths',
      path: ['operations'],
    },
  )
  .refine(
    (proposal) => {
      const opIds = proposal.operations.map((op) => op.op_id);
      return new Set(opIds).size === opIds.length;
    },
    {
      message: 'Operation IDs must be distinct',
      path: ['operations'],
    },
  )
  .refine(
    (proposal) => {
      const opIds = new Set(proposal.operations.map((op) => op.op_id));
      return proposal.operations.every((op) =>
        op.dependencies.every((dep) => opIds.has(dep)),
      );
    },
    {
      message:
        'Operation dependencies must reference declared operations within the proposal',
      path: ['operations'],
    },
  );

export type PlanProposalInput = z.input<typeof planProposalSchema>;
export type PlanProposalOutput = z.infer<typeof planProposalSchema>;
