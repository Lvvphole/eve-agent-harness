import {describe, expect, it} from 'vitest';

import {
  AuthorityBindingSchema,
  CanonicalRelativePathSchema,
  ExecutionModeSchema,
  HexSha1Schema,
  HexSha256Schema,
  ReadinessRecordSchema,
  TaskEnvelopeSchema,
} from '../src/schemas/readiness.js';

const SHA1 = 'a'.repeat(40);
const SHA256 = 'b'.repeat(64);

const authority = {
  authorityId: 'authority-1',
  publicKeyId: 'key-1',
  authorizedRoutes: ['01_readiness'],
  grantTimestamp: '2026-09-13T21:00:00.000Z',
};

const envelope = {
  envelopeId: 'envelope-1',
  targetRepo: 'Lvvphole/eve-agent-harness',
  targetCommitSha1: SHA1,
  baseSourceTreeSha256: SHA256,
  permittedMode: 'PLAN',
  authorizedPaths: ['src/types/readiness.ts'],
  authorizedCapabilities: ['read'],
};

const record = {
  state: 'PLAN_READY',
  envelopeId: 'envelope-1',
  authority,
  activeMode: 'PLAN',
  completedTransitions: [],
  failureReason: null,
};

describe('readiness boundary adversarial oracle', () => {
  describe('unknown property injection', () => {
    it('rejects injected AuthorityBinding properties', () => {
      const result = AuthorityBindingSchema.safeParse({
        ...authority,
        extra: 'unauthorized',
      });
      expect(result.success).toBe(false);
    });

    it('rejects injected TaskEnvelope properties', () => {
      const result = TaskEnvelopeSchema.safeParse({
        ...envelope,
        extra: 'unauthorized',
      });
      expect(result.success).toBe(false);
    });

    it('rejects injected ReadinessRecord metadata', () => {
      const result = ReadinessRecordSchema.safeParse({
        ...record,
        metadata: {trusted: true},
      });
      expect(result.success).toBe(false);
    });
  });

  describe('cryptographic identity falsification', () => {
    it.each([
      ['63 characters', 'a'.repeat(63)],
      ['65 characters', 'a'.repeat(65)],
      ['uppercase hexadecimal', 'A'.repeat(64)],
      ['non-hexadecimal', `${'a'.repeat(63)}g`],
      ['whitespace', `${'a'.repeat(63)} `],
    ])('rejects SHA-256 %s', (_caseName, candidate) => {
      const result = HexSha256Schema.safeParse(candidate);
      expect(result.success).toBe(false);
    });

    it.each([
      ['wrong length', 'a'.repeat(39)],
      ['malformed characters', `${'a'.repeat(39)}g`],
    ])('rejects SHA-1 %s', (_caseName, candidate) => {
      const result = HexSha1Schema.safeParse(candidate);
      expect(result.success).toBe(false);
    });
  });

  describe('path traversal and boundary escapes', () => {
    it.each([
      ['parent traversal', '../secrets'],
      ['root prefix', '/etc/passwd'],
      ['Windows separator', 'src\\types'],
      ['empty segment', 'foo//bar'],
      ['naked dot', '.'],
      ['naked parent dot', '..'],
    ])('rejects %s path', (_caseName, candidate) => {
      const result = CanonicalRelativePathSchema.safeParse(candidate);
      expect(result.success).toBe(false);
    });
  });

  describe('authority and mode escalation', () => {
    it.each(['EXEC', 'ADMIN', 'ROOT'])('rejects unauthorized mode %s', (mode) => {
      const result = ExecutionModeSchema.safeParse(mode);
      expect(result.success).toBe(false);
    });

    it('rejects malformed authority grant timestamps', () => {
      const result = AuthorityBindingSchema.safeParse({
        ...authority,
        grantTimestamp: 'not-a-datetime',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty authority identifiers', () => {
      const result = AuthorityBindingSchema.safeParse({
        ...authority,
        authorityId: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('terminal and unanchored state handling', () => {
    it('rejects records with omitted failureReason', () => {
      const {failureReason: _failureReason, ...withoutFailureReason} = record;
      const result = ReadinessRecordSchema.safeParse(withoutFailureReason);
      expect(result.success).toBe(false);
    });

    it('rejects records with invalid failureReason types', () => {
      const result = ReadinessRecordSchema.safeParse({
        ...record,
        failureReason: 42,
      });
      expect(result.success).toBe(false);
    });
  });
});
