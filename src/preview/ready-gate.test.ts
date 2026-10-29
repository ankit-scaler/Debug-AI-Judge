import { expect, test, vi } from 'vitest';
import { ReadyGate } from './ready-gate.js';

test('sends once code arrives after ready', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.markReady();
  expect(send).not.toHaveBeenCalled();
  gate.setPayload('console.log(1)');
  expect(send).toHaveBeenCalledExactlyOnceWith('console.log(1)');
});

// This exact ordering is the regression: the iframe loading before the bundle
// finishes is the common case, not the edge case.
test('sends once ready arrives after code -- the common ordering in practice', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.setPayload('console.log(1)');
  expect(send).not.toHaveBeenCalled();
  gate.markReady();
  expect(send).toHaveBeenCalledExactlyOnceWith('console.log(1)');
});

test('does not send before both signals have arrived', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.markReady();
  expect(send).not.toHaveBeenCalled();
});

test('only the latest code is sent when setCode is called more than once before ready', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.setPayload('stale');
  gate.setPayload('latest');
  gate.markReady();
  expect(send).toHaveBeenCalledExactlyOnceWith('latest');
});

test('a duplicate ready signal does not resend', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.setPayload('console.log(1)');
  gate.markReady();
  gate.markReady();
  expect(send).toHaveBeenCalledOnce();
});

// The other bug this class exists to prevent: a ready signal left over from a
// previous generation must never cause an immediate send of code queued for a
// NEW generation, before that new generation's own iframe is actually ready.
test('reset prevents a stale ready from a previous generation from firing early', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.markReady();
  gate.reset(); // new generation starts; old readiness must not carry over
  gate.setPayload('for the new generation');
  expect(send).not.toHaveBeenCalled();
  gate.markReady(); // the new generation's own iframe announces itself
  expect(send).toHaveBeenCalledExactlyOnceWith('for the new generation');
});

test('reset also discards an unsent pending code from the previous generation', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);
  gate.setPayload('for the old generation, never sent');
  gate.reset();
  gate.markReady();
  expect(send).not.toHaveBeenCalled();
});

test('a full generation cycle works correctly, twice in a row', () => {
  const send = vi.fn();
  const gate = new ReadyGate<string>(send);

  gate.reset();
  gate.setPayload('run 1');
  gate.markReady();
  expect(send).toHaveBeenNthCalledWith(1, 'run 1');

  gate.reset();
  gate.markReady();
  gate.setPayload('run 2');
  expect(send).toHaveBeenNthCalledWith(2, 'run 2');
  expect(send).toHaveBeenCalledTimes(2);
});
