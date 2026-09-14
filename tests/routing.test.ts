import { describe, expect, it } from 'vitest';

import { evaluateRoute } from '../src/engine/routing.js';
import {
  CanonicalRelativePathSchema,
  RepositoryOperationSchema,
  RouteEvaluationRequestSchema,
  RouteManifestSchema,
} from '../src/schemas/routing.js';
import type {
  GlobalRouteConfig,
  RepositoryOperation,
  RouteEvaluationRequest,
  RouteManifest,
} from '../src/types/routing.js';

const manifest: RouteManifest = {
  schema_version: 1,
  route_id: '01_readiness',
  read_exact: ['src/types/routing.ts', 'README.md'],
  grep_exact: ['src/types/routing.ts'],
  write_exact: ['src/types/routing.ts'],
  protected_write_exact: ['references/protected.md'],
};

const globalConfig: GlobalRouteConfig = {
  schema_version: 1,
  denied_prefixes: ['.git', '.github', '.harness', '.scratch', 'logs', 'node_modules', 'dist', 'coverage', '.env'],
  default_decision: 'BLOCKED',
  ambiguous_match_decision: 'BLOCKED',
  unscoped_grep_decision: 'BLOCKED',
  protected_write_authorization_field: 'human_authorized_protected_paths',
  route_ids: ['00_bootstrap', '01_readiness', '02_compiler', '03_workspace', '04_sandbox', '05_exporter', '06_persistence', '07_subagents'],
  missing_route_decision: 'BLOCKED',
  unknown_route_decision: 'BLOCKED',
};

const request = (operation: RepositoryOperation, path: string, humanAuthorizedProtectedPaths?: readonly string[]): RouteEvaluationRequest => ({
  routeId: '01_readiness',
  operation,
  path,
  ...(humanAuthorizedProtectedPaths !== undefined ? { humanAuthorizedProtectedPaths } : {}),
});

describe('routing subsystem adversarial oracle', () => {
  describe('schema and boundary falsification', () => {
    it('rejects unknown request properties', () => {
      expect(RouteEvaluationRequestSchema.safeParse({ ...request('read', 'README.md'), trusted: true }).success).toBe(false);
    });

    it('rejects unknown manifest properties', () => {
      expect(RouteManifestSchema.safeParse({ ...manifest, fallback: 'ALLOW' }).success).toBe(false);
    });

    it.each(['../secret', '/etc/passwd', 'src\\secret', 'src//secret', '.'])('rejects non-canonical path %s', (path) =>
      expect(CanonicalRelativePathSchema.safeParse(path).success).toBe(false),
    );

    it.each(['execute', 'admin', 'recursive'])('rejects operation %s', (operation) => {
      expect(RepositoryOperationSchema.safeParse(operation).success).toBe(false);
    });

    it('rejects an unknown manifest route identifier', () => {
      expect(RouteManifestSchema.safeParse({ ...manifest, route_id: '99_unknown' }).success).toBe(false);
    });
  });

  describe('global denials take precedence', () => {
    it.each(['.git/config', '.github/workflows/ci.yml', '.scratch/result', 'logs/trace.log', 'dist/index.js', 'node_modules/pkg/index.js', '.env/secret'])(
      'blocks sensitive path %s even when the manifest allows it',
      (path) => {
        const permissive = { ...manifest, read_exact: [path], grep_exact: [path], write_exact: [path] };
        expect(evaluateRoute(request('read', path), permissive, globalConfig).decision).toBe('BLOCKED');
        expect(evaluateRoute(request('grep', path), permissive, globalConfig).decision).toBe('BLOCKED');
        expect(evaluateRoute(request('write', path), permissive, globalConfig).decision).toBe('BLOCKED');
      },
    );
  });

  describe('read and grep require one exact match', () => {
    it.each([
      ['read', 'README.md'],
      ['grep', 'src/types/routing.ts'],
    ] satisfies readonly (readonly [RepositoryOperation, string])[])('allows exact %s target %s', (operation, path) => {
      expect(evaluateRoute(request(operation, path), manifest, globalConfig).decision).toBe('ALLOW');
    });

    it.each([
      ['read', 'src'],
      ['read', 'src/types'],
      ['read', 'README.md/child'],
      ['grep', ''],
      ['grep', 'src'],
      ['grep', 'src/**'],
      ['grep', 'src/types/readiness.ts'],
    ] satisfies readonly (readonly [RepositoryOperation, string])[])('blocks non-exact %s target %s', (operation, path) => {
      expect(evaluateRoute(request(operation, path), manifest, globalConfig).decision).toBe('BLOCKED');
    });
  });

  describe('write sets are disjoint and protected writes require human authority', () => {
    it('allows an ordinary exact write', () => {
      expect(evaluateRoute(request('write', 'src/types/routing.ts'), manifest, globalConfig).decision).toBe('ALLOW');
    });

    it('allows an authorized protected exact write', () => {
      const protectedRequest = request('write', 'references/protected.md', ['references/protected.md']);
      expect(evaluateRoute(protectedRequest, manifest, globalConfig).decision).toBe('ALLOW');
    });

    it('blocks a protected write without human authorization', () => {
      expect(evaluateRoute(request('write', 'references/protected.md'), manifest, globalConfig).decision).toBe('BLOCKED');
    });

    it('blocks human authorization without a manifest match', () => {
      const authorizedOnly = request('write', 'references/other.md', ['references/other.md']);
      expect(evaluateRoute(authorizedOnly, manifest, globalConfig).decision).toBe('BLOCKED');
    });

    it('blocks a path ambiguously present in both write sets', () => {
      const ambiguous = { ...manifest, protected_write_exact: ['src/types/routing.ts'] };
      const authorized = request('write', 'src/types/routing.ts', ['src/types/routing.ts']);
      expect(evaluateRoute(authorized, ambiguous, globalConfig).decision).toBe('BLOCKED');
    });

    it.each(['src/types/sibling.ts', 'src/types/routing.ts.tmp', 'tmp/routing.ts'])('blocks arbitrary write %s', (path) =>
      expect(evaluateRoute(request('write', path), manifest, globalConfig).decision).toBe('BLOCKED'),
    );
  });

  describe('missing and unknown routes fail closed', () => {
    it.each(['', '99_unknown', '01-readiness'])('blocks route identifier %s', (routeId) => {
      expect(evaluateRoute({ ...request('read', 'README.md'), routeId }, manifest, globalConfig).decision).toBe('BLOCKED');
    });

    it('blocks a known route without its matching manifest', () => {
      const otherRoute = { ...request('read', 'README.md'), routeId: '02_compiler' };
      expect(evaluateRoute(otherRoute, manifest, globalConfig).decision).toBe('BLOCKED');
    });
  });
});
