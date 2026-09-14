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
  DagNode,
  DagValidationErrorCode,
  DagValidationResult,
} from '../src/types/dag.js';

const SOURCE_DIGEST = `sha256:${'a'.repeat(64)}`;
const PRIVATE_KEY_HEX = '1'.repeat(64);

function node(id: string, dependencies: readonly string[] = []): DagNode {
  return {
    id,
    target_path: `src/${id}.ts`,
    op_type: 'insert',
    span: { start_line: 1, start_col: 1, end_line: 1, end_col: 1 },
    payload: id,
    dependencies,
  };
}

function compile(nodes: readonly DagNode[]): DagValidationResult {
  return compileDag({
    task_envelope_id: 'INC-0.2C1-Stage-C-deadbeef',
    authority_id: 'compiler-test',
    source_digest: SOURCE_DIGEST,
    proposals: nodes,
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
  it('orders prerequisites before dependents and preserves proposal metadata', () => {
    const inputNodes = [
      node('publish', ['bundle']),
      node('bundle', ['source']),
      node('source'),
    ];
    const result = compile(inputNodes);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(compiledDagSchema.safeParse(result.data).success).toBe(true);
    expect(result.data.task_envelope_id).toBe('INC-0.2C1-Stage-C-deadbeef');
    expect(result.data.authority_id).toBe('compiler-test');
    expect(result.data.source_digest).toBe(SOURCE_DIGEST);
    expect(result.data.execution_order).toEqual([
      'source',
      'bundle',
      'publish',
    ]);
    expect(result.data.nodes).toEqual(inputNodes);
  });

  it('rejects cyclical dependencies', () => {
    const result = compile([
      node('first', ['second']),
      node('second', ['first']),
    ]);

    expectErrorCode(result, 'CYCLE_DETECTED');
  });

  it('rejects missing dependencies', () => {
    const result = compile([node('dependent', ['missing'])]);

    expectErrorCode(result, 'MISSING_DEPENDENCY');
  });

  it('rejects duplicate node IDs', () => {
    const result = compile([node('duplicate'), node('duplicate')]);

    expectErrorCode(result, 'DUPLICATE_NODE_ID');
  });

  it('rejects out-of-bounds or invalid spans', () => {
    const invalidNode: DagNode = {
      ...node('invalid-span'),
      span: { start_line: 0, start_col: 1, end_line: 1, end_col: 1 },
    };

    expectErrorCode(compile([invalidNode]), 'SCHEMA_VIOLATION');
  });
});

describe('sealed DAG integrity', () => {
  it('verifies valid artifacts and rejects tampered bytes or signatures', () => {
    const dag: CompiledDag = {
      schema_version: 1,
      task_envelope_id: 'INC-0.2C1-Stage-C-deadbeef',
      authority_id: 'compiler-test',
      source_digest: SOURCE_DIGEST,
      execution_order: ['source'],
      nodes: [node('source')],
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
