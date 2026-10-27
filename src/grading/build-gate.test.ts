import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

// C1: a React app importing a stylesheet is the common case, not an edge case.
test('bundles an app that imports a stylesheet', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.jsx', content: `import './App.css';\nexport default function App() { return <div />; }\n` },
      { path: 'src/App.css', content: 'body { color: red }\n' },
    ],
    'src/App.jsx',
  );
  expect(r).toEqual({ ok: true });
});

test('bundles an app that imports a CSS module', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.jsx', content: `import s from './App.module.css';\nexport default function App() { return <div className={s.root} />; }\n` },
      { path: 'src/App.module.css', content: '.root { color: red }\n' },
    ],
    'src/App.jsx',
  );
  expect(r).toEqual({ ok: true });
});

// I2: barrel files are routine in TypeScript questions.
test('resolves a barrel import to index.ts', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.tsx', content: `import { x } from './lib';\nexport default () => x;\n` },
      { path: 'src/lib/index.ts', content: 'export const x: number = 1;\n' },
    ],
    'src/App.tsx',
  );
  expect(r).toEqual({ ok: true });
});

test('resolves a barrel import to index.tsx', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.tsx', content: `import { C } from './comp';\nexport default () => <C />;\n` },
      { path: 'src/comp/index.tsx', content: 'export const C = () => <div />;\n' },
    ],
    'src/App.tsx',
  );
  expect(r).toEqual({ ok: true });
});

// I3: a question with a logo or a README must not fail with a syntax error.
test('does not parse non-code assets as JSX', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.jsx', content: `import logo from './logo.svg';\nimport notes from './notes.md';\nexport default () => <img src={logo} alt={notes} />;\n` },
      { path: 'src/logo.svg', content: '<?xml version="1.0"?><svg></svg>\n' },
      { path: 'src/notes.md', content: '# notes\n\nsome prose\n' },
    ],
    'src/App.jsx',
  );
  expect(r).toEqual({ ok: true });
});

// I4: stripNamespace must clean the message text too, not only the file field.
test('never leaks the bundler namespace into errors', async () => {
  const r = await buildCheck(
    [
      { path: 'src/App.jsx', content: `import './a.css';\nexport default function App() { return <div>;\n` },
      { path: 'src/a.css', content: 'body{color:red}\n' },
    ],
    'src/App.jsx',
  );
  expect(r.ok).toBe(false);
  if (!r.ok) expect(JSON.stringify(r.errors)).not.toContain('virtual:');
});

// I10: the no-execution invariant is the most important property in the spec and
// nothing in the suite was pinning it. A refactor that turns the gate into a
// runner must fail here.
test('never executes submitted code', async () => {
  const marker = join(tmpdir(), `debuglab-exec-probe-${process.pid}.txt`);
  const r = await buildCheck(
    [
      {
        path: 'src/App.jsx',
        content:
          `import { writeFileSync } from 'node:fs';\n` +
          `writeFileSync(${JSON.stringify(marker)}, 'pwned');\n` +
          `export default function App() { return <div />; }\n`,
      },
    ],
    'src/App.jsx',
  );
  expect(r).toEqual({ ok: true });
  expect(existsSync(marker)).toBe(false);
});
