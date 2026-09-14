import type {
  GlobalRouteConfig,
  RouteEvaluationRequest,
  RouteEvaluationResult,
  RouteManifest,
} from '../types/routing.js';

export function evaluateRoute(
  request: RouteEvaluationRequest,
  manifest: RouteManifest,
  globalConfig: GlobalRouteConfig,
): RouteEvaluationResult {
  const isKnownRoute = globalConfig.route_ids.some(
    (id) => id === request.routeId,
  );
  if (!isKnownRoute || request.routeId !== manifest.route_id) {
    return { decision: 'BLOCKED', reason: 'Invalid or mismatched route' };
  }

  const isDenied = globalConfig.denied_prefixes.some(
    (prefix) =>
      request.path === prefix || request.path.startsWith(`${prefix}/`),
  );
  if (isDenied) {
    return { decision: 'BLOCKED', reason: 'Path violates global denial' };
  }

  if (request.operation === 'read') {
    return manifest.read_exact.includes(request.path)
      ? {
          decision: 'ALLOW',
          reason: 'Authorized read',
          matchedPath: request.path,
        }
      : { decision: 'BLOCKED', reason: 'Unauthorized read' };
  }

  if (request.operation === 'grep') {
    return manifest.grep_exact.includes(request.path)
      ? {
          decision: 'ALLOW',
          reason: 'Authorized grep',
          matchedPath: request.path,
        }
      : { decision: 'BLOCKED', reason: 'Unauthorized grep' };
  }

  if (request.operation === 'write') {
    const inWrite = manifest.write_exact.includes(request.path);
    const inProtected = manifest.protected_write_exact.includes(request.path);

    if (inWrite && inProtected) {
      return { decision: 'BLOCKED', reason: 'Ambiguous write target' };
    }
    if (inProtected) {
      const authorized =
        request.humanAuthorizedProtectedPaths?.includes(request.path) ?? false;
      return authorized
        ? {
            decision: 'ALLOW',
            reason: 'Protected write authorized',
            matchedPath: request.path,
          }
        : { decision: 'BLOCKED', reason: 'Protected write unauthorized' };
    }
    if (inWrite) {
      return {
        decision: 'ALLOW',
        reason: 'Authorized write',
        matchedPath: request.path,
      };
    }
    return { decision: 'BLOCKED', reason: 'Unauthorized write' };
  }

  return { decision: 'BLOCKED', reason: 'Unsupported operation' };
}
