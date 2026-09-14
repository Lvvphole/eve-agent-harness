import { z } from 'zod';
import {
  CANONICAL_PATH_REGEX,
  DIGEST_REGEX,
  TASK_ENVELOPE_ID_REGEX,
  textSpanSchema,
} from './proposals.js';

export const ED25519_HEX_SIG_REGEX = /^[a-f0-9]{128}$/;
export const ED25519_HEX_PUBKEY_REGEX = /^[a-f0-9]{64}$/;

export const dagNodeSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9_.-]+$/),
    target_path: z.string().min(1).regex(CANONICAL_PATH_REGEX),
    op_type: z.enum(['insert', 'replace', 'delete']),
    span: textSpanSchema.readonly(),
    payload: z.string(),
    dependencies: z
      .array(
        z
          .string()
          .min(1)
          .regex(/^[a-zA-Z0-9_.-]+$/),
      )
      .readonly(),
  })
  .strict()
  .readonly();

export const compiledDagSchema = z
  .object({
    schema_version: z.literal(1),
    task_envelope_id: z.string().regex(TASK_ENVELOPE_ID_REGEX),
    authority_id: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9_.:-]+$/),
    source_digest: z.string().regex(DIGEST_REGEX),
    execution_order: z
      .array(
        z
          .string()
          .min(1)
          .regex(/^[a-zA-Z0-9_.-]+$/),
      )
      .nonempty()
      .readonly(),
    nodes: z.array(dagNodeSchema).nonempty().readonly(),
  })
  .strict()
  .readonly()
  .refine(
    (dag) => {
      const nodeIds = dag.nodes.map((n) => n.id);
      return new Set(nodeIds).size === nodeIds.length;
    },
    {
      message: 'DAG node IDs must be distinct',
      path: ['nodes'],
    },
  )
  .refine(
    (dag) => {
      const nodeIds = new Set(dag.nodes.map((n) => n.id));
      const orderSet = new Set(dag.execution_order);
      return (
        orderSet.size === dag.execution_order.length &&
        orderSet.size === nodeIds.size &&
        dag.execution_order.every((id) => nodeIds.has(id))
      );
    },
    {
      message: 'execution_order must contain every node exactly once',
      path: ['execution_order'],
    },
  )
  .refine(
    (dag) => {
      const seen = new Set<string>();
      const nodeMap = new Map(dag.nodes.map((n) => [n.id, n]));
      for (const id of dag.execution_order) {
        const node = nodeMap.get(id);
        if (!node) return false;
        if (!node.dependencies.every((dep) => seen.has(dep))) {
          return false;
        }
        seen.add(id);
      }
      return true;
    },
    {
      message: 'execution_order must satisfy topological dependency ordering',
      path: ['execution_order'],
    },
  );

export const sealedDagArtifactSchema = z
  .object({
    dag_json: z.string().min(1),
    dag_sha256: z.string().regex(DIGEST_REGEX),
    signature_hex: z.string().regex(ED25519_HEX_SIG_REGEX),
    signer_public_key: z.string().regex(ED25519_HEX_PUBKEY_REGEX),
  })
  .strict()
  .readonly();

export type CompiledDagInput = z.input<typeof compiledDagSchema>;
export type CompiledDagOutput = z.infer<typeof compiledDagSchema>;
export type SealedDagArtifactInput = z.input<typeof sealedDagArtifactSchema>;
export type SealedDagArtifactOutput = z.infer<typeof sealedDagArtifactSchema>;
