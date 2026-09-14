import type {
  CompiledDag,
  DagValidationResult,
  SealedDagArtifact,
} from '../types/dag.js';

export interface CompileDagInput {
  readonly task_envelope_id: string;
  readonly authority_id: string;
  readonly source_digest: string;
  readonly proposals: readonly unknown[];
}

export function compileDag(_input: CompileDagInput): DagValidationResult {
  throw new Error('Not implemented');
}

export function sealDag(
  _dag: CompiledDag,
  _privateKeyHex: string,
): SealedDagArtifact {
  throw new Error('Not implemented');
}

export function verifySealedDag(_artifact: SealedDagArtifact): boolean {
  throw new Error('Not implemented');
}
