export type RepositoryOperation = 'read' | 'grep' | 'write';

export type RoutingDecision = 'ALLOW' | 'BLOCKED';

export type RouteId =
  | '00_bootstrap'
  | '01_readiness'
  | '02_compiler'
  | '03_workspace'
  | '04_sandbox'
  | '05_exporter'
  | '06_persistence'
  | '07_subagents';

export interface RouteManifest {
  readonly schema_version: 1;
  readonly route_id: RouteId;
  readonly read_exact: readonly string[];
  readonly grep_exact: readonly string[];
  readonly write_exact: readonly string[];
  readonly protected_write_exact: readonly string[];
}

export interface GlobalRouteConfig {
  readonly schema_version: 1;
  readonly denied_prefixes: readonly string[];
  readonly default_decision: 'BLOCKED';
  readonly ambiguous_match_decision: 'BLOCKED';
  readonly unscoped_grep_decision: 'BLOCKED';
  readonly protected_write_authorization_field: string;
  readonly route_ids: readonly RouteId[];
  readonly missing_route_decision: 'BLOCKED';
  readonly unknown_route_decision: 'BLOCKED';
}

export interface RouteEvaluationRequest {
  readonly routeId: string;
  readonly operation: RepositoryOperation;
  readonly path: string;
  readonly humanAuthorizedProtectedPaths?: readonly string[];
}

export interface RouteEvaluationResult {
  readonly decision: RoutingDecision;
  readonly reason: string;
  readonly matchedPath?: string;
}
