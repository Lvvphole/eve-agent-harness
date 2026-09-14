import { z } from 'zod';

import { CanonicalRelativePathSchema } from './readiness.js';

export { CanonicalRelativePathSchema } from './readiness.js';

export const RepositoryOperationSchema = z.enum(['read', 'grep', 'write']);

export const RoutingDecisionSchema = z.enum(['ALLOW', 'BLOCKED']);

export const RouteIdSchema = z.enum([
  '00_bootstrap',
  '01_readiness',
  '02_compiler',
  '03_workspace',
  '04_sandbox',
  '05_exporter',
  '06_persistence',
  '07_subagents',
]);

export const RouteManifestSchema = z
  .object({
    schema_version: z.literal(1),
    route_id: RouteIdSchema,
    read_exact: z.array(CanonicalRelativePathSchema),
    grep_exact: z.array(CanonicalRelativePathSchema),
    write_exact: z.array(CanonicalRelativePathSchema),
    protected_write_exact: z.array(CanonicalRelativePathSchema),
  })
  .strict();

export const GlobalRouteConfigSchema = z
  .object({
    schema_version: z.literal(1),
    denied_prefixes: z.array(CanonicalRelativePathSchema),
    default_decision: z.literal('BLOCKED'),
    ambiguous_match_decision: z.literal('BLOCKED'),
    unscoped_grep_decision: z.literal('BLOCKED'),
    protected_write_authorization_field: z.string().min(1),
    route_ids: z.array(RouteIdSchema),
    missing_route_decision: z.literal('BLOCKED'),
    unknown_route_decision: z.literal('BLOCKED'),
  })
  .strict();

export const RouteEvaluationRequestSchema = z
  .object({
    routeId: z.string().min(1),
    operation: RepositoryOperationSchema,
    path: CanonicalRelativePathSchema,
    humanAuthorizedProtectedPaths: z
      .array(CanonicalRelativePathSchema)
      .optional(),
  })
  .strict();
