import { describe, expect, it } from 'vitest';
import {
  compileDag,
  sealDag,
  verifySealedDag,
} from '../src/engine/compiler.js';
import {
  compiledDagSchema,
  sealedDagArtifactSchema,
} from '../src/schemas/dag.js';
import type {
  CompiledDag,
  DagValidationErrorCode,
  DagValidationResult,
} from '../src/types/dag.js';
import type {
  ProposalOpType,
  ProposedOperation,
} from '../src/types/proposals.js';

const SOURCE_DIGEST = `sha256:${'a'.repeat(64)}`;
const PRIVATE_KEY_HEX = '1'.repeat(64);

function operation(
  opId: string,
  dependencies: readonly string[] = [],
  opType: ProposalOpType = 'insert',
): ProposedOperation {
  return {
    op_id: opId,
    target_path: `src/${opId}.ts`,
    op_type: opType,
    span: { start_line: 1, start_col: 1, end_line: 1, end_col: 1 },
    payload: opId,
    dependencies,
  };
}

function compile(proposals: readonly ProposedOperation[]): DagValidationResult {
  return compileDag({
    task_envelope_id: 'INC-0.2C1-Stage-C-deadbeef',
    authority_id: 'compiler-test',
    source_digest: SOURCE_DIGEST,
    proposals,
  });
}

function expectErrorCode(
  result: DagValidationResult,
  code: DagValidationErrorCode,
): void {
  expect(result.success).toBe(false);
  if (result.success) return;
  expect(result.errors.map((error) => error.code)).toContain(code);
}

describe('compileDag', () => {
  it('orders prerequisites before their dependents', () => {
    const result = compile([
      operation('publish', ['bundle'], 'delete'),
      operation('bundle', ['source'], 'replace'),
      operation('source'),
    ]);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(compiledDagSchema.safeParse(result.data).success).toBe(true);
    expect(result.data.execution_order).toEqual([
      'source',
      'bundle',
      'publish',
    ]);
    expect(result.data.nodes).toContainEqual({
      id: 'source',
      target_path: 'src/source.ts',
      op_type: 'insert',
      span: { start_line: 1, start_col: 1, end_line: 1, end_col: 1 },
      payload: 'source',
      dependencies: [],
    });
    expect(result.data.nodes).toContainEqual({
      id: 'bundle',
      target_path: 'src/bundle.ts',
      op_type: 'replace',
      span: { start_line: 1, start_col: 1, end_line: 1, end_col: 1 },
      payload: 'bundle',
      dependencies: ['source'],
    });
    expect(result.data.nodes).toContainEqual({
      id: 'publish',
      target_path: 'src/publish.ts',
      op_type: 'delete',
      span: { start_line: 1, start_col: 1, end_line: 1, end_col: 1 },
      payload: 'publish',
      dependencies: ['bundle'],
    });
  });

  it('rejects cyclical dependencies', () => {
    const result = compile([
      operation('first', ['second']),
      operation('second', ['first']),
    ]);

    expectErrorCode(result, 'CYCLE_DETECTED');
  });

  it('rejects missing dependencies', () => {
    const result = compile([operation('dependent', ['missing'])]);

    expectErrorCode(result, 'MISSING_DEPENDENCY');
  });

  it('rejects duplicate node IDs', () => {
    const result = compile([operation('duplicate'), operation('duplicate')]);

    expectErrorCode(result, 'DUPLICATE_NODE_ID');
  });

  it('rejects spans whose end precedes their start', () => {
    const invalidSpan = {
      ...operation('invalid-span'),
      span: { start_line: 2, start_col: 1, end_line: 1, end_col: 1 },
    };

    expectErrorCode(compile([invalidSpan]), 'SCHEMA_VIOLATION');
  });
});

describe('sealed DAG integrity', () => {
  it('rejects tampered DAG bytes and an invalid signature', () => {
    const dag: CompiledDag = {
      schema_version: 1,
      task_envelope_id: 'INC-0.2C1-Stage-C-deadbeef',
      authority_id: 'compiler-test',
      source_digest: SOURCE_DIGEST,
      execution_order: ['source'],
      nodes: [
        {
          id: 'source',
          target_path: 'src/source.ts',
          op_type: 'insert',
          span: { start_line: 1, start_col: 1, end_line: 1, end_col: 1 },
          payload: 'source',
          dependencies: [],
        },
      ],
    };
    const artifact = sealDag(dag, PRIVATE_KEY_HEX);
    expect(sealedDagArtifactSchema.safeParse(artifact).success).toBe(true);
    expect(verifySealedDag(artifact)).toBe(true);

    const tamperedJson = { ...artifact, dag_json: `${artifact.dag_json} ` };
    expect(verifySealedDag(tamperedJson)).toBe(false);

    const firstHex = artifact.signature_hex.at(0);
    const invalidSignature = `${firstHex === '0' ? '1' : '0'}${artifact.signature_hex.slice(1)}`;
    expect(
      verifySealedDag({ ...artifact, signature_hex: invalidSignature }),
    ).toBe(false);
  });
});
