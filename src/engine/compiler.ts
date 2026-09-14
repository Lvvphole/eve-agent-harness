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

export function compileDag(input: CompileDagInput): DagValidationResult {
  void input;
  throw new Error('Not implemented');
}

export function sealDag(
  dag: CompiledDag,
  privateKeyHex: string,
): SealedDagArtifact {
  void dag;
  void privateKeyHex;
  throw new Error('Not implemented');
}

export function verifySealedDag(artifact: SealedDagArtifact): boolean {
  void artifact;
  throw new Error('Not implemented');
}
