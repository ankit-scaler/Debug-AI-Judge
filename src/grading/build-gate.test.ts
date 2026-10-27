import { expect, test } from 'vitest';
import { buildCheck } from './build-gate.js';

const good = [
  { path: 'src/App.jsx', content: `import { Cart } from './Cart.jsx';\nexport default function App() { return <Cart />; }\n` },
  { path: 'src/Cart.jsx', content: `export function Cart() { return <div>cart</div>; }\n` },
];

test('accepts an app that bundles', async () => {
  expect(await buildCheck(good, 'src/App.jsx')).toEqual({ ok: true });
});

test('reports a syntax error with a location', async () => {
  const r = await buildCheck(
    [{ path: 'src/App.jsx', content: 'export default function App() { return <div>;\n' }],
    'src/App.jsx',
  );
  expect(r.ok).toBe(false);
  if (!r.ok) {
    expect(r.errors[0]?.file).toBe('src/App.jsx');
    expect(r.errors[0]?.line).toBeGreaterThan(0);
  }
});

test('reports an unresolvable relative import', async () => {
  const r = await buildCheck(
    [{ path: 'src/App.jsx', content: `import './Missing.jsx';\nexport default function App() {}\n` }],
    'src/App.jsx',
  );
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.errors[0]?.text).toMatch(/Missing\.jsx/);
});

test('treats bare specifiers as external rather than failing', async () => {
  const r = await buildCheck(
    [{ path: 'src/App.jsx', content: `import React from 'react';\nexport default function App() { return <div />; }\n` }],
    'src/App.jsx',
  );
  expect(r).toEqual({ ok: true });
});

test('resolves an extensionless relative import', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.jsx', content: `import { x } from './util';\nexport default () => x;\n` },
      { path: 'src/util.js', content: 'export const x = 1;\n' },
    ],
    'src/App.jsx',
  );
  expect(r).toEqual({ ok: true });
});

test('fails when the entry file is absent', async () => {
  const r = await buildCheck([], 'src/App.jsx');
  expect(r.ok).toBe(false);
});
