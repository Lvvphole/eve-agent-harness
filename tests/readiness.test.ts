import { describe, expect, it } from 'vitest';

import { transitionReadiness, VALID_TRANSITIONS } from '../src/engine/readiness.js';
import {
  AuthorityBindingSchema,
  CanonicalRelativePathSchema,
  ExecutionModeSchema,
  HexSha1Schema,
  HexSha256Schema,
  ReadinessRecordSchema,
  TaskEnvelopeSchema,
} from '../src/schemas/readiness.js';
import type {
  HexSha256,
  ReadinessRecord,
  ReadinessState,
  ReadinessTransitionReceipt,
} from '../src/types/readiness.js';

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
  it.each([
    ['AuthorityBinding', AuthorityBindingSchema, { ...authority, extra: 'unauthorized' }],
    ['TaskEnvelope', TaskEnvelopeSchema, { ...envelope, extra: 'unauthorized' }],
    ['ReadinessRecord', ReadinessRecordSchema, { ...record, metadata: { trusted: true } }],
  ])('rejects unknown %s properties', (_name, schema, candidate) => {
    expect(schema.safeParse(candidate).success).toBe(false);
  });

  it.each([
    ['63 characters', 'a'.repeat(63)],
    ['65 characters', 'a'.repeat(65)],
    ['uppercase hexadecimal', 'A'.repeat(64)],
    ['non-hexadecimal', `${'a'.repeat(63)}g`],
    ['whitespace', `${'a'.repeat(63)} `],
  ])('rejects SHA-256 %s', (_name, candidate) => {
    expect(HexSha256Schema.safeParse(candidate).success).toBe(false);
  });

  it.each([
    ['wrong length', 'a'.repeat(39)],
    ['malformed characters', `${'a'.repeat(39)}g`],
  ])('rejects SHA-1 %s', (_name, candidate) => {
    expect(HexSha1Schema.safeParse(candidate).success).toBe(false);
  });

  it.each([
    ['parent traversal', '../secrets'],
    ['root prefix', '/etc/passwd'],
    ['Windows separator', 'src\\types'],
    ['empty segment', 'foo//bar'],
    ['naked dot', '.'],
    ['naked parent dot', '..'],
  ])('rejects %s path', (_name, candidate) => {
    expect(CanonicalRelativePathSchema.safeParse(candidate).success).toBe(false);
  });

  it.each(['EXEC', 'ADMIN', 'ROOT'])('rejects unauthorized mode %s', (mode) => {
    expect(ExecutionModeSchema.safeParse(mode).success).toBe(false);
  });

  it.each([
    ['malformed grant timestamp', { ...authority, grantTimestamp: 'not-a-datetime' }],
    ['empty authority identifier', { ...authority, authorityId: '' }],
  ])('rejects %s', (_name, candidate) => {
    expect(AuthorityBindingSchema.safeParse(candidate).success).toBe(false);
  });

  it('rejects records with omitted failureReason', () => {
    const candidate = { ...record };
    Reflect.deleteProperty(candidate, "failureReason");
    expect(ReadinessRecordSchema.safeParse(candidate).success).toBe(false);
  });

  it('rejects records with invalid failureReason types', () => {
    expect(ReadinessRecordSchema.safeParse({ ...record, failureReason: 42 }).success).toBe(false);
  });
});

const readinessRecord = (state: ReadinessState): ReadinessRecord => ({
  state,
  envelopeId: 'envelope-1',
  authority,
  activeMode: 'PLAN',
  completedTransitions: [],
  failureReason: null,
});
const receipt = (fromState: ReadinessState, toState: ReadinessState): ReadinessTransitionReceipt => ({
  fromState,
  toState,
  gatePassed: 'gate-1',
  evidenceSha256: SHA256 as HexSha256,
});

describe('readiness transition engine oracle', () => {
  it('permits the next transition, appends its receipt, and preserves input immutability', () => {
    const input = readinessRecord('UNBOUND');
    const originalTransitions = input.completedTransitions;
    const transition = receipt('UNBOUND', 'SCOUT_READY');
    const result = transitionReadiness(input, transition);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.record.completedTransitions).toEqual([transition]);
      expect(result.record.state).toBe('SCOUT_READY');
      expect(result.record.failureReason).toBe(null);
    }
    expect(input.completedTransitions).toBe(originalTransitions);
    expect(input).toEqual(readinessRecord('UNBOUND'));
  });

  it.each([
    ['UNBOUND', 'IMPLEMENTING'],
    ['SCOUT_READY', 'EXPORTED'],
    ['PLAN_READY', 'SCOUT_READY'],
  ] satisfies readonly (readonly [ReadinessState, ReadinessState])[])('rejects invalid transition %s -> %s', (fromState, toState) => {
    const result = transitionReadiness(readinessRecord(fromState), receipt(fromState, toState));
    expect(result.success).toBe(false);
  });

  it.each(['EXPORTED', 'FAILED', 'RESET_REQUIRED'] satisfies readonly ReadinessState[])('locks transitions originating from %s', (fromState) => {
    const result = transitionReadiness(readinessRecord(fromState), receipt(fromState, 'UNBOUND'));
    expect(result.success).toBe(false);
  });

  it.each(['FAILED', 'BLOCKED'] satisfies readonly ReadinessState[])('captures the reason on transition to %s', (toState) => {
    const result = transitionReadiness(readinessRecord('SCOUT_READY'), receipt('SCOUT_READY', toState), 'gate rejected');
    expect(result.success).toBe(true);
    if (result.success) expect(result.record.failureReason).toBe('gate rejected');
  });

  it('defines the complete acyclic readiness graph and terminal lockouts', () => {
    expect(VALID_TRANSITIONS).toEqual({
      UNBOUND: ['SCOUT_READY', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      SCOUT_READY: ['PLAN_READY', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      PLAN_READY: ['PRE_CODE_READY', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      PRE_CODE_READY: ['WORKSPACE_READY', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      WORKSPACE_READY: ['SANDBOX_READY', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      SANDBOX_READY: ['IMPLEMENTING', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      IMPLEMENTING: ['VERIFYING', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      VERIFYING: ['EXPORTABLE', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      EXPORTABLE: ['EXPORTED', 'BLOCKED', 'FAILED', 'RESET_REQUIRED'],
      BLOCKED: ['RESET_REQUIRED'],
      EXPORTED: [],
      FAILED: [],
      RESET_REQUIRED: [],
    });
    expect(VALID_TRANSITIONS.EXPORTED).toEqual([]);
    expect(VALID_TRANSITIONS.FAILED).toEqual([]);
    expect(VALID_TRANSITIONS.RESET_REQUIRED).toEqual([]);
  });
});
