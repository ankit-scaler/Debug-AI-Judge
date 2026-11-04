# DevTools Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Conditions dropdown / Data tab / Diff tab concepts with a single curated terminal (platform-native `npm run dev`, `npm test`, `git diff`, plus question-declared commands, plus a universal `ls`/`cat`/`clear`/`help`), add real client-side `npm test` execution, split Console into a Client/Server-filterable Logs tab, add a Network Table/Timeline toggle, and retrofit flipkart-cart-lab (terminal commands, order history, `DebugPanel.jsx` retirement) as the first consumer.

**Architecture:** Everything follows the existing `post(type, payload)` → `postMessage` → `PreviewFrame` → `SolveScreen` → `DevToolsPanel` pattern already proven by Console/Network. New pieces:
- `src/preview/devtools-source.ts`: a string module (sibling of `interceptor-source.ts`) giving question files `serverLog()` and dispatching `terminal-run` → `terminalHandlers[id]` → `terminal-output` inside the **live** preview iframe. It is registered as the virtual file `__devtools__.js` in **all three** bundlers that see question files: the preview (`src/preview/bundler.ts`), server-side Submit (`src/grading/execute-tests.ts`), and client-side `npm test` (`src/preview/test-bundler.ts`). A question file that imports `'../__devtools__.js'` must build in all three, or Submit breaks.
- `npm test`: the host bundles `testEntry` + harness + interceptor with `esbuild-wasm` and runs it in a **separate, hidden, freshly created iframe** — a third `PreviewFrame` target alongside the visible iframe and the "Open in new tab" popup — never in the live preview. The test bundle brings its own store and its own fetch interceptor; running it inside the live iframe would silently repoint the learner's running app at the test run's throwaway backend. One fresh iframe per run is the client-side equivalent of `execute-tests.ts` giving every Submit its own fresh jsdom.
- Two pure host-side modules: command parsing and a line diff.

`npm test` never touches scoring — Submit's server-side `executeTests()` stays the only scored path (it gains one virtual-file registration, Task 2, and nothing else).

> **Note — this revises the spec on purpose.** The spec (revision 2) says `npm test` runs "in the *same already-running* iframe — reusing the live app's DOM and React tree is the point". That was wrong, and this plan does not do it. None of the real test files touch the live app's DOM (`CartContext.test.jsx` renders its own detached root). What sharing the live iframe actually would do is replace the live app's `fetch` with the test bundle's interceptor and test store, stack another `fetch` patch on every run, and leave `resilience.test.js`'s pricing-failure flag one step from making the live app return 500s. The hidden iframe keeps the spec's real goals (fast, client-side, unscored, repeatable, always bundled from current editor content) without that side effect.

**Tech Stack:** Existing stack only — React/TypeScript, `esbuild-wasm` (already a dependency, already used by `bundlePreview`), `esbuild` + `jsdom` (already dependencies, already used by `execute-tests.ts` and its tests), Vitest. No new dependency.

**Spec:** `docs/superpowers/specs/2026-11-03-devtools-expansion-design.md` (revision 2 — read this first; it has the full reasoning. Where this plan differs from it — the hidden test iframe, the `runId` on `terminal-run`, one merged `logLines` array — the reason is given at that step).

**Task order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Each task only consumes what earlier tasks produce. (Task 5 — the `terminalCommands` type — must land before Task 6, whose `SolveScreen.tsx` wiring reads `question.terminalCommands`.)

## Global Constraints

- No new runtime dependency without explicit sign-off (`git diff` and the terminal are hand-rolled for this reason).
- A terminal command is only offered if it's platform-native or the question declares it via `terminalCommands` — existing questions' rendering must not change at all.
- `devtools-source.ts` is platform-provided and readonly, never part of a question's editable `files/`, matching `interceptor-source.ts`'s existing status.
- **Every bundler that can reach a question file must register `__devtools__.js`**: `bundlePreview` (Task 2), `executeTests` (Task 2), `bundleTests` (Task 4). `src/grading/build-gate.ts`'s `buildCheck()` deliberately does **not**: it only ever bundles from a question's `entry` (`src/App.jsx`), which never reaches `server-sim/`. A future question whose `entry` reaches a `__devtools__.js` import would have to add it there too — or its LLM-mode Submit would report `build_failed`.
- `npm test` must never affect `scored`/`firstPass`/`gaveUp` state — only Submit's independent server-side `executeTests()` call can set those.
- `npm test` must never run inside the live preview iframe (see Architecture).
- A `terminalHandlers[id]` throwing, or a `npm test` bundle failing, must degrade to realistic terminal output text, never crash the whole preview (`frame.html`'s existing crash banner is for *un*caught errors, not command failures).
- The terminal must never get stuck busy: every command either reports, is cancelled by Run/Reset, or times out after 20s (the same budget the Submit route gives `executeTests()`).
- All new colors come from the existing design tokens in `app/globals.css` (`var(--bg)`, `var(--danger)`, …). No hardcoded colors.
- No LLM call is added anywhere in this plan (explicitly deferred in the spec's Non-goals, pending the project's separate mandatory LLM-feature process).

## Review Focus

- Typing `npm test` twice in quick succession — the terminal input is disabled while any command is in flight (Task 6), and each run gets its own fresh hidden iframe (Task 3), so two runs can never share a realm.
- `npm test` run immediately after an edit that was never "Run" — `onTerminalNpmTest` bundles from SolveScreen's current `files` (editor contents) every time, never from the last Run's bundle (Task 6).
- A repro command typed before the app has rendered — `repro-stale` checks for the real button/badge/logged-in header first and fails with a clear "log in and stay on the catalog" message; the other repros log in by themselves and need no UI. Each one empties the relevant demo user's cart first, exactly like the reference lab (Task 7). A command typed before the preview has loaded at all is refused host-side instead of being posted into a frame with no listener (Task 6).
- `git diff` noise — Task 1's diff is an LCS line diff with per-hunk output. Its tests cover: a whitespace-only change (shown, confined to the one changed line — no `-w` normalization, same as real `git diff`), **two separate edits in one file (two small hunks, not one removed+added block spanning everything between them)**, and a moved line. Line-ending-only (CRLF) changes are not specially handled: every line of a file whose endings changed would diff. No question ships CRLF files and Monaco keeps a file's existing endings, so this is a documented limitation, not a tested case.
- Terminal scrollback after Run/Reset — scrollback is **not** cleared (a real terminal is not wiped when the dev server restarts, and clearing would erase `npm run dev`'s own echo and any `npm test` output the learner is still reading). Instead Run/Reset append a visible `--- preview restarted ---` separator, cancel any in-flight command, and drop late results via `runId`/generation checks, so nothing printed afterwards can be mistaken for the new code's output (Task 6).
- Switching the Logs filter while lines arrive — the filter is a render-time predicate over one accumulated `logLines` array (each line tagged `source: 'client' | 'server'`), never a snapshot, so old and new lines are filtered identically on every render (Task 6).
- Messages from the hidden test iframe — handled first and separately in `PreviewFrame`'s listener, so its `frame-ready` can never mark the live preview's `ReadyGate` ready and its console/network traffic never lands in the live Logs/Network tabs (Task 3).

---

### Task 1: Terminal command parsing and the line diff

Pure, host-side, directly unit-testable — no iframe, no bundler, no DOM.

**Files:**
- Create: `src/terminal/parse-command.ts`
- Create: `src/terminal/diff-lines.ts`
- Test: `src/terminal/parse-command.test.ts`
- Test: `src/terminal/diff-lines.test.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces:
  - `export type PlatformCommand = { kind: 'run' } | { kind: 'git-diff' } | { kind: 'npm-test' } | { kind: 'ls' } | { kind: 'cat'; path: string } | { kind: 'clear' } | { kind: 'help' } | { kind: 'question'; id: string; args: string }`
  - `export function parseCommand(input: string, declared: { id: string; command: string; help: string }[], hasTests: boolean): { ok: true; command: PlatformCommand } | { ok: false; message: string }` — used by Task 6's `TerminalPanel`.
  - `export interface DiffHunk { oldStart: number; newStart: number; lines: { type: 'added' | 'removed'; text: string }[] }` and `export function diffLines(original: string, edited: string): DiffHunk[]` — used by Task 6's `TerminalPanel` for `git diff`.

- [ ] **Step 1: Write the failing tests for `parseCommand`**

```ts
// src/terminal/parse-command.test.ts
import { describe, expect, test } from 'vitest';
import { parseCommand } from './parse-command';

const declared = [
  { id: 'repro-dup', command: 'npm run repro -- dup', help: 'reproduce duplicate cart rows' },
  { id: 'db-inspect', command: 'npm run db:inspect', help: 'print the current tables' },
];

describe('parseCommand', () => {
  test('matches a platform-native command exactly', () => {
    expect(parseCommand('npm run dev', [], true)).toEqual({ ok: true, command: { kind: 'run' } });
  });

  test('matches git diff', () => {
    expect(parseCommand('git diff', [], true)).toEqual({ ok: true, command: { kind: 'git-diff' } });
  });

  test('npm test is only offered when the question has a test suite', () => {
    expect(parseCommand('npm test', [], false)).toEqual({
      ok: false,
      message: 'npm test: no test script found',
    });
    expect(parseCommand('npm test', [], true)).toEqual({ ok: true, command: { kind: 'npm-test' } });
  });

  test('matches a question-declared command by its exact command string', () => {
    expect(parseCommand('npm run repro -- dup', declared, true)).toEqual({
      ok: true,
      command: { kind: 'question', id: 'repro-dup', args: '' },
    });
  });

  test('ls needs no arguments', () => {
    expect(parseCommand('ls', [], true)).toEqual({ ok: true, command: { kind: 'ls' } });
  });

  test('cat requires a path argument', () => {
    expect(parseCommand('cat src/App.jsx', [], true)).toEqual({
      ok: true,
      command: { kind: 'cat', path: 'src/App.jsx' },
    });
    expect(parseCommand('cat', [], true)).toEqual({
      ok: false,
      message: 'usage: cat <path>',
    });
  });

  test('clear and help need no arguments', () => {
    expect(parseCommand('clear', [], true)).toEqual({ ok: true, command: { kind: 'clear' } });
    expect(parseCommand('help', [], true)).toEqual({ ok: true, command: { kind: 'help' } });
  });

  test('an unrecognized command reports command-not-found, shell-style', () => {
    expect(parseCommand('curl example.com', [], true)).toEqual({
      ok: false,
      message: 'command not found: curl',
    });
  });

  test('blank input is not an error, just nothing to do', () => {
    expect(parseCommand('', [], true)).toEqual({ ok: false, message: '' });
    expect(parseCommand('   ', [], true)).toEqual({ ok: false, message: '' });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/terminal/parse-command.test.ts`
Expected: FAIL — `parse-command.ts` does not exist yet.

- [ ] **Step 3: Implement `parseCommand`**

```ts
// src/terminal/parse-command.ts
export type PlatformCommand =
  | { kind: 'run' }
  | { kind: 'git-diff' }
  | { kind: 'npm-test' }
  | { kind: 'ls' }
  | { kind: 'cat'; path: string }
  | { kind: 'clear' }
  | { kind: 'help' }
  | { kind: 'question'; id: string; args: string };

export type ParseResult = { ok: true; command: PlatformCommand } | { ok: false; message: string };

export function parseCommand(
  input: string,
  declared: { id: string; command: string; help: string }[],
  hasTests: boolean,
): ParseResult {
  const trimmed = input.trim();
  if (trimmed === '') return { ok: false, message: '' };

  if (trimmed === 'npm run dev') return { ok: true, command: { kind: 'run' } };
  if (trimmed === 'git diff') return { ok: true, command: { kind: 'git-diff' } };
  if (trimmed === 'npm test') {
    if (!hasTests) return { ok: false, message: 'npm test: no test script found' };
    return { ok: true, command: { kind: 'npm-test' } };
  }
  if (trimmed === 'ls') return { ok: true, command: { kind: 'ls' } };
  if (trimmed === 'clear') return { ok: true, command: { kind: 'clear' } };
  if (trimmed === 'help') return { ok: true, command: { kind: 'help' } };
  if (trimmed === 'cat') return { ok: false, message: 'usage: cat <path>' };
  if (trimmed.startsWith('cat ')) {
    return { ok: true, command: { kind: 'cat', path: trimmed.slice(4).trim() } };
  }

  const match = declared.find((d) => d.command === trimmed);
  if (match) return { ok: true, command: { kind: 'question', id: match.id, args: '' } };

  const [cmd] = trimmed.split(/\s+/);
  return { ok: false, message: `command not found: ${cmd}` };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/terminal/parse-command.test.ts`
Expected: PASS, 9/9

- [ ] **Step 5: Write the failing tests for `diffLines`**

```ts
// src/terminal/diff-lines.test.ts
import { describe, expect, test } from 'vitest';
import { diffLines } from './diff-lines';

describe('diffLines', () => {
  test('identical files produce no hunks', () => {
    const a = 'line1\nline2\n';
    expect(diffLines(a, a)).toEqual([]);
  });

  test('an added line is one hunk with one added line', () => {
    expect(diffLines('a\nb\n', 'a\nb\nc\n')).toEqual([
      { oldStart: 3, newStart: 3, lines: [{ type: 'added', text: 'c' }] },
    ]);
  });

  test('a removed line is one hunk with one removed line', () => {
    expect(diffLines('a\nb\nc\n', 'a\nc\n')).toEqual([
      { oldStart: 2, newStart: 2, lines: [{ type: 'removed', text: 'b' }] },
    ]);
  });

  test('a changed line shows as one removed then one added, not "changed"', () => {
    expect(diffLines('const x = 1;\n', 'const x = 2;\n')).toEqual([
      {
        oldStart: 1,
        newStart: 1,
        lines: [
          { type: 'removed', text: 'const x = 1;' },
          { type: 'added', text: 'const x = 2;' },
        ],
      },
    ]);
  });

  test('two separate edits in one file are two small hunks, not one wall of noise', () => {
    // The real flipkart fix has exactly this shape: several unrelated edits
    // in one file (cartHandlers.js) with untouched lines between them.
    const original = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].join('\n') + '\n';
    const edited = ['a', 'B', 'c', 'd', 'e', 'F', 'g'].join('\n') + '\n';
    expect(diffLines(original, edited)).toEqual([
      { oldStart: 2, newStart: 2, lines: [{ type: 'removed', text: 'b' }, { type: 'added', text: 'B' }] },
      { oldStart: 6, newStart: 6, lines: [{ type: 'removed', text: 'f' }, { type: 'added', text: 'F' }] },
    ]);
  });

  test('a moved block does not drag every line between the two edits into the diff', () => {
    const original = 'x\nkeep1\nkeep2\nkeep3\ny\n';
    const edited = 'keep1\nkeep2\nkeep3\ny\nx\n';
    const changed = diffLines(original, edited).flatMap((h) => h.lines);
    expect(changed).toEqual([
      { type: 'removed', text: 'x' },
      { type: 'added', text: 'x' },
    ]);
  });

  test('trailing-whitespace-only changes still diff as a real change (no -w), confined to that line', () => {
    // Deliberately NOT collapsed to "same" -- real `git diff` without -w
    // shows these too. What matters is that the noise stays on the one
    // line that changed, not that it is hidden.
    expect(diffLines('a\nconst x = 1;\nb\n', 'a\nconst x = 1; \nb\n')).toEqual([
      {
        oldStart: 2,
        newStart: 2,
        lines: [
          { type: 'removed', text: 'const x = 1;' },
          { type: 'added', text: 'const x = 1; ' },
        ],
      },
    ]);
  });
});
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `npx vitest run src/terminal/diff-lines.test.ts`
Expected: FAIL — `diff-lines.ts` does not exist yet.

- [ ] **Step 7: Implement `diffLines`**

A prefix/suffix trim is not enough: with two separate edits in one file it prints everything between them as one big removed+added block, and that is exactly the shape of the real flipkart fix in `cartHandlers.js`. A small LCS table fixes it in about 30 lines:

```ts
// src/terminal/diff-lines.ts
export interface DiffLine {
  type: 'added' | 'removed';
  text: string;
}

/** One contiguous run of changes, like a `@@` hunk in real `git diff` output. */
export interface DiffHunk {
  /** 1-based line number in the original file where this hunk starts. */
  oldStart: number;
  /** 1-based line number in the edited file where this hunk starts. */
  newStart: number;
  lines: DiffLine[];
}

function toLines(text: string): string[] {
  const lines = text.split('\n');
  // A file ending in a newline yields one trailing '' -- drop it so that
  // final newline never shows up as a phantom blank-line change.
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Line-level diff via a longest-common-subsequence table. O(n*m) memory and
 * time -- fine for question files (a few hundred lines at most: 300x300 is
 * 90k cells). Unchanged lines split changes into separate hunks, so two
 * unrelated edits in one file print as two small hunks, not one big
 * removed-then-added block spanning everything between them.
 */
export function diffLines(original: string, edited: string): DiffHunk[] {
  const a = toLines(original);
  const b = toLines(edited);
  const n = a.length;
  const m = b.length;

  // lcs[i][j] = length of the longest common subsequence of a[i..] and b[j..]
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i]![j] = a[i] === b[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }

  const hunks: DiffHunk[] = [];
  let current: DiffHunk | null = null;
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      current = null; // an unchanged line closes the current hunk
      i++;
      j++;
      continue;
    }
    if (current === null) {
      current = { oldStart: i + 1, newStart: j + 1, lines: [] };
      hunks.push(current);
    }
    // On a tie, emit the removal first, so a changed line reads as
    // "- old" then "+ new", the way git prints it.
    if (i < n && (j === m || lcs[i + 1]![j]! >= lcs[i]![j + 1]!)) {
      current.lines.push({ type: 'removed', text: a[i]! });
      i++;
    } else {
      current.lines.push({ type: 'added', text: b[j]! });
      j++;
    }
  }
  return hunks;
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx vitest run src/terminal/diff-lines.test.ts`
Expected: PASS, 7/7

- [ ] **Step 9: Commit**

```bash
git add src/terminal/
git commit -m "feat: add terminal command parsing and a hand-rolled line diff"
```

---

### Task 2: `devtools-source.ts`, registered in the preview AND Submit bundlers, plus `network.startedAt`

**Files:**
- Create: `src/preview/devtools-source.ts`
- Test: `src/preview/devtools-source.test.ts`
- Modify: `src/preview/interceptor-source.ts` (both `post('network', …)` calls, lines 49-57 and 73-81)
- Modify: `src/preview/bundler.ts` (the `if (options.handlersPath)` block, lines 86-89)
- Modify: `src/grading/execute-tests.ts` (imports, and the `if (handlersPath)` block, lines 79-81)
- Modify: `src/grading/execute-tests.test.ts` (one new test)

(`components/PreviewFrame.tsx`'s `NetworkEntry` type gets `startedAt` in Task 3, which owns every `PreviewFrame.tsx` change.)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces:
  - `export const DEVTOOLS_VIRTUAL = '__devtools__.js'` — the virtual path. The map key **is** the import specifier question files use: from `server-sim/cartHandlers.js` or `mock/handlers.js`, `'../__devtools__.js'` resolves to it through the existing `resolveRelative` (verified: `server-sim/` + `..` → root → `__devtools__.js`).
  - `export const DEVTOOLS_MODULE: string` and `export function devtoolsModuleFor(handlersPath: string): string` (the module text with `./__TERMINAL_HANDLERS__` replaced by `./<handlersPath>`). Used by `bundler.ts` and `execute-tests.ts` (this task) and `test-bundler.ts` (Task 4).
  - In the iframe, the module exports `serverLog(level, ...args)` → posts `server-log` `{ level, text }`; and it listens for `terminal-run` `{ id, args, runId }` → posts `terminal-output` `{ id, runId, ok, text }`. `runId` is new compared to the spec: the host uses it to drop a late result from a command that already timed out or was cancelled (Task 6).
  - `network` events now carry `startedAt: number` (epoch ms).

- [ ] **Step 1: Add `startedAt` to both posted `network` payloads**

In `src/preview/interceptor-source.ts`, `const startedAt = Date.now();` (line 44) is computed before the handler lookup, so both branches can use it. Add `startedAt,` as the last property of **both** `post('network', {...})` calls. The no-handler branch (lines 49-57) becomes:

```js
    post('network', {
      method,
      url,
      status: 0,
      mocked: false,
      requestBody: typeof requestBody === 'string' ? requestBody : null,
      responseBody: 'No mock handler matched this request.',
      durationMs: 0,
      startedAt,
    });
```

and the handled branch (lines 73-81) becomes:

```js
  post('network', {
    method,
    url,
    status,
    mocked: true,
    requestBody: typeof requestBody === 'string' ? requestBody : null,
    responseBody: text,
    durationMs: Date.now() - startedAt,
    startedAt,
  });
```

- [ ] **Step 2: Write the failing test for `DEVTOOLS_MODULE`**

The module is source text that runs in the iframe, so it cannot be imported and called directly. The test bundles it with real `esbuild` (same resolver as the preview) into an IIFE, then runs it with fakes for `window` and `parent`, the only two globals it uses. This is real execution, not a mock of the code under test.

```ts
import * as esbuild from 'esbuild';
import { describe, expect, test } from 'vitest';
import { loaderFor, resolveRelative, VIRTUAL_NAMESPACE } from '../bundling/resolve';
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from './devtools-source';

// DEVTOOLS_MODULE is source text meant to run inside the preview iframe. To
// test it for real, bundle it with real esbuild (same resolver the preview
// uses) into an IIFE, then run it with `window` and `parent` shadowed by
// fakes -- the only two globals it touches.
async function load(handlersSource: string) {
  const map = new Map([
    ['mock/handlers.js', handlersSource],
    [DEVTOOLS_VIRTUAL, devtoolsModuleFor('mock/handlers.js')],
  ]);
  const result = await esbuild.build({
    entryPoints: [DEVTOOLS_VIRTUAL],
    bundle: true,
    write: false,
    format: 'iife',
    globalName: '__devtools',
    logLevel: 'silent',
    plugins: [
      {
        name: 'virtual',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            if (args.kind === 'entry-point') return { path: args.path, namespace: VIRTUAL_NAMESPACE };
            const resolved = resolveRelative(args.importer, args.path, map);
            return resolved
              ? { path: resolved, namespace: VIRTUAL_NAMESPACE }
              : { errors: [{ text: `Cannot resolve "${args.path}"` }] };
          });
          build.onLoad({ filter: /.*/, namespace: VIRTUAL_NAMESPACE }, (args) => ({
            contents: map.get(args.path) ?? '',
            loader: loaderFor(args.path),
          }));
        },
      },
    ],
  });
  const code = result.outputFiles[0]!.text;

  const posted: { type: string; payload: Record<string, unknown> }[] = [];
  let listener: ((event: { data: unknown }) => Promise<void>) | null = null;
  const fakeWindow = {
    addEventListener: (_type: string, fn: (event: { data: unknown }) => Promise<void>) => {
      listener = fn;
    },
  };
  const fakeParent = { postMessage: (message: { type: string; payload: Record<string, unknown> }) => posted.push(message) };
  const mod = new Function('window', 'parent', `${code}\nreturn __devtools;`)(fakeWindow, fakeParent) as {
    serverLog: (level: string, ...args: unknown[]) => void;
  };
  const run = (id: string) =>
    listener!({ data: { source: 'debuglab-host', type: 'terminal-run', payload: { id, args: '', runId: 7 } } });
  return { mod, posted, run };
}

describe('DEVTOOLS_MODULE', () => {
  test('serverLog posts a server-log message with level and formatted text', async () => {
    const { mod, posted } = await load('export const handlers = [];');
    mod.serverLog('warn', 'stock', 3, { id: 49 });
    expect(posted).toEqual([
      { source: 'debuglab-preview', type: 'server-log', payload: { level: 'warn', text: 'stock 3 {"id":49}' } },
    ]);
  });

  test('a handler result is posted back as ok terminal-output, echoing runId', async () => {
    const { posted, run } = await load(
      `export const handlers = []; export const terminalHandlers = { hello: async () => 'hi there' };`,
    );
    await run('hello');
    expect(posted).toEqual([
      { source: 'debuglab-preview', type: 'terminal-output', payload: { id: 'hello', runId: 7, ok: true, text: 'hi there' } },
    ]);
  });

  test('a throwing handler gives ok:false with the error text, never an uncaught throw', async () => {
    const { posted, run } = await load(
      `export const handlers = []; export const terminalHandlers = { boom: () => { throw new Error('kaboom'); } };`,
    );
    await run('boom');
    expect(posted[0]?.payload).toMatchObject({ id: 'boom', runId: 7, ok: false });
    expect(String(posted[0]?.payload.text)).toContain('kaboom');
  });

  test('an unknown id acks ok:false -- including for a question with no terminalHandlers export at all', async () => {
    // Every question except flipkart-cart-lab: mock/handlers.js exports no
    // terminalHandlers. A named import of it would be a hard esbuild error;
    // the namespace import must bundle and simply find nothing.
    const { posted, run } = await load('export const handlers = [];');
    await run('nope');
    expect(posted).toEqual([
      {
        source: 'debuglab-preview',
        type: 'terminal-output',
        payload: { id: 'nope', runId: 7, ok: false, text: 'command not found: nope' },
      },
    ]);
  });
});
```

Run: `npx vitest run src/preview/devtools-source.test.ts`
Expected: FAIL — `devtools-source.ts` does not exist yet.

- [ ] **Step 3: Write `devtools-source.ts`**

Two details are load-bearing:
- **Namespace import, read lazily.** A named import (`import { terminalHandlers } from …`) is a hard esbuild error for every question whose `mock/handlers.js` doesn't export `terminalHandlers` (all of them except flipkart-cart-lab): `No matching export in "virtual:mock/handlers.js" for import "terminalHandlers"`. Verified against real esbuild. `import * as` plus reading `.terminalHandlers` inside the listener bundles fine and yields `undefined` when the export is missing.
- **The lazy read must stay inside the listener.** flipkart-cart-lab creates an import cycle: `__devtools__.js` → `mock/handlers.js` → `server-sim/cartHandlers.js` → `__devtools__.js`. It is safe only because nothing reads the namespace while modules are still evaluating (verified with real esbuild: `serverLog` calls and handler dispatch both work across the cycle). Do not move the read to module top level.

```ts
// src/preview/devtools-source.ts
/**
 * Compiled into the learner's bundle (same reason as INTERCEPTOR_MODULE --
 * it must run inside the preview iframe's realm). Gives a question's
 * server-sim/*.js files serverLog() for the Logs tab's "Server" side, and is
 * the dispatch target for the terminal's question-defined commands
 * (terminal-run -> terminalHandlers[id] -> terminal-output).
 *
 * Registered as a virtual file by EVERY bundler that can reach question
 * files: src/preview/bundler.ts (Run), src/grading/execute-tests.ts
 * (Submit) and src/preview/test-bundler.ts (npm test). A question file that
 * imports '../__devtools__.js' must resolve in all three.
 */
export const DEVTOOLS_VIRTUAL = '__devtools__.js';

export const DEVTOOLS_MODULE = `
import * as __questionHandlers from './__TERMINAL_HANDLERS__';

function post(type, payload) {
  try {
    parent.postMessage({ source: 'debuglab-preview', type, payload }, '*');
  } catch (e) {}
}

function format(value) {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.stack || value.message;
  try {
    return JSON.stringify(value);
  } catch (e) {
    return String(value);
  }
}

export function serverLog(level, ...args) {
  post('server-log', { level, text: args.map(format).join(' ') });
}

window.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || data.source !== 'debuglab-host' || data.type !== 'terminal-run') return;
  const { id, args, runId } = data.payload;
  const handlers = __questionHandlers.terminalHandlers || {};
  if (typeof handlers[id] !== 'function') {
    post('terminal-output', { id, runId, ok: false, text: 'command not found: ' + id });
    return;
  }
  try {
    const result = await handlers[id](args);
    post('terminal-output', { id, runId, ok: true, text: String(result ?? '') });
  } catch (err) {
    post('terminal-output', { id, runId, ok: false, text: format(err) });
  }
});
`;

export function devtoolsModuleFor(handlersPath: string): string {
  return DEVTOOLS_MODULE.replace('./__TERMINAL_HANDLERS__', `./${handlersPath}`);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/preview/devtools-source.test.ts`
Expected: PASS, 4/4

- [ ] **Step 5: Register it in `bundlePreview`**

In `src/preview/bundler.ts`, add the import next to the existing `INTERCEPTOR_MODULE` import:

```ts
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from './devtools-source';
```

and extend the existing block (lines 86-89) so it reads:

```ts
  if (options.handlersPath) {
    map.set(INTERCEPTOR, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${options.handlersPath}`));
    imports.push(`import './${INTERCEPTOR}';`);
    // Imported from the entry even when no question file imports it, so the
    // terminal-run listener exists in every preview with a mock backend.
    map.set(DEVTOOLS_VIRTUAL, devtoolsModuleFor(options.handlersPath));
    imports.push(`import './${DEVTOOLS_VIRTUAL}';`);
  }
```

Do **not** add a test for this to `src/preview/bundler.test.ts`: that file mocks `esbuild-wasm` globally (`vi.mock`, with `buildMock` reset in `beforeEach`), so a new test there would never run the real resolver and would prove nothing. Real esbuild-wasm can't run under Vitest either, because its `wasmURL` initialisation only works in a browser. The resolution logic is covered for real by Step 2's test and by Task 4's `bundleTests` test (same `resolveRelative`). Whether every existing question still bundles in the browser is checked live in Task 8, Step 1.

- [ ] **Step 6: Register it in `executeTests` (server-side Submit)**

Without this, every flipkart-cart-lab Submit returns `build_failed` once Task 7 makes `cartHandlers.js` import `'../__devtools__.js'`. In `src/grading/execute-tests.ts`, add the import next to the existing `INTERCEPTOR_MODULE` import:

```ts
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from '../preview/devtools-source';
```

and extend the existing `if (handlersPath)` block (lines 79-81) so it reads:

```ts
  if (handlersPath) {
    map.set(INTERCEPTOR_VIRTUAL, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${handlersPath}`));
    // Question files import '../__devtools__.js' (serverLog). The SAME module
    // the preview bundles, not a stripped fork: its terminal-run listener is
    // simply never triggered during Submit. Not imported from the entry --
    // it only needs to be resolvable.
    map.set(DEVTOOLS_VIRTUAL, devtoolsModuleFor(handlersPath));
  }
```

- [ ] **Step 7: Add a real Submit-path test for it**

Append to `src/grading/execute-tests.test.ts` (real esbuild + real jsdom/vm, like the rest of that file):

```ts
test('a question file importing ../__devtools__.js builds and runs under Submit', async () => {
  const result = await executeTests(
    [
      {
        path: 'mock/handlers.js',
        content: `import { add } from '../server-sim/cart.js';
          export const handlers = [];
          export const terminalHandlers = { x: () => add() };`,
      },
      {
        path: 'server-sim/cart.js',
        content: `import { serverLog } from '../__devtools__.js';
          export function add() { serverLog('info', 'add called'); return 2; }`,
      },
      {
        path: 'tests/cart.test.js',
        content: `
          import { add } from '../server-sim/cart.js';
          const { it, expect } = globalThis.__debuglab_harness__;
          it('add still works with serverLog inside it', () => {
            expect(add()).toBe(2);
          });
        `,
      },
    ],
    'tests/cart.test.js',
    'mock/handlers.js',
  );
  expect(result).toEqual({
    status: 'ran',
    tests: [{ name: 'add still works with serverLog inside it', passed: true, error: null }],
  });
});
```

Run: `npx vitest run src/grading/execute-tests.test.ts src/preview/`
Expected: PASS, including the new test and every existing `bundler.test.ts` test (that file's mocks never hit the new code path in a way that changes any assertion).

- [ ] **Step 8: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/preview/devtools-source.ts src/preview/devtools-source.test.ts src/preview/interceptor-source.ts src/preview/bundler.ts src/grading/execute-tests.ts src/grading/execute-tests.test.ts
git commit -m "feat: add devtools-source (serverLog, terminal-run dispatch), register it for preview and Submit, add network startedAt"
```

---

### Task 3: `PreviewFrame.tsx` and `frame.html` — new messages, plus a hidden test-iframe target

Read `components/PreviewFrame.tsx` in full first. It already manages two targets: the visible iframe (`iframeRef`, `ReadyGate`) and the "Open in new tab" popup (`popupRef`, `sendToPopup`, the `event.source === popupRef.current` check). This task adds a third, the hidden `npm test` iframe, using the same mechanisms: the same `frame.html`, the same `frame-ready` handshake, and `event.source` to tell targets apart.

**Files:**
- Modify (full replacement given below): `components/PreviewFrame.tsx`
- Modify: `public/preview/frame.html` (one new branch in its `message` listener)

**Interfaces:**
- Consumes: the `server-log` / `terminal-run` / `terminal-output` shapes and the `startedAt`-bearing `network` payload from Task 2; `TestResult` from `src/testing/browser-test-harness.ts` (exists: `{ name: string; passed: boolean; error: string | null }`).
- Produces (all used by Task 6's `SolveScreen.tsx`):
  - `NetworkEntry` gains `startedAt: number`.
  - `export interface TerminalOutput { id: string; runId: number; ok: boolean; text: string }`.
  - Props gain `onServerLog: (line: ConsoleLine) => void`, `onTerminalOutput: (output: TerminalOutput) => void`, `onTestResults: (tests: TestResult[]) => void`.
  - `PreviewFrameHandle` gains `sendTerminalCommand(id: string, args: string, runId: number): void` (to the **live** iframe), `sendRunTests(code: string): void` (mounts a **fresh hidden** iframe and runs `code` there once it reports `frame-ready`) and `cancelRunTests(): void` (unmounts it; safe to call with none in flight).
  - New message `run-tests` `{ code }` host → hidden iframe; `test-results` `{ tests }` hidden iframe → host. There is no `test-build-failed` message: build failures are caught host-side by `bundleTests` (Task 4) before anything is sent, so they never cross the iframe boundary.

- [ ] **Step 1: Add the `run-tests` branch to `frame.html`**

In `public/preview/frame.html`, inside the `window.addEventListener('message', …)` handler, insert this block **between** `if (!data || data.source !== 'debuglab-host') return;` and the existing `if (data.type !== 'run') return;` (the existing `run` handling is not changed):

```js
          if (data.type === 'run-tests') {
            // Only ever sent to the hidden npm-test iframe (PreviewFrame.tsx),
            // which is a brand-new document per run -- so nothing here needs
            // cleaning up or guarding against a previous run. The test
            // bundle's entry calls this exactly once, with the harness results.
            window.__debuglab_test_report__ = function (tests) {
              post('test-results', { tests: tests });
            };
            var testScript = document.createElement('script');
            testScript.type = 'module';
            testScript.textContent = data.code;
            document.body.appendChild(testScript);
            return;
          }
```

(`post` here is frame.html's own helper; in an iframe with no `window.opener` it posts to `parent`, which is the host page — the same path the visible iframe uses.)

- [ ] **Step 2: Replace `components/PreviewFrame.tsx`**

Replace the whole file with the version below. Compared with the current file:
- `NetworkEntry.startedAt`, the `TerminalOutput` type, three new props, and three new handle methods.
- A third target. `testRunKey` state (`null` = no test iframe) is the React `key` of a hidden `<iframe src="/preview/frame.html" style={{ display: 'none' }}>`, so every `sendRunTests` mounts a brand-new document. The code waits in `pendingTestCodeRef` until that document posts `frame-ready`, mirroring how the popup is handled.
- In `onMessage`, test-iframe messages are handled **first** and returned early. Otherwise its `frame-ready` would fall into the existing `else { gateRef.current!.markReady() }` branch and mark the **live** preview ready. Its console/network/server-log traffic is dropped on purpose, because it describes the test's throwaway backend, not the live app. On `test-results`, or an uncaught `error` (a test file throwing during module evaluation, before the harness can report), it reports and unmounts the iframe.
- `server-log` and `terminal-output` cases for the live iframe/popup, and the effect's dependency array gains `onServerLog, onTerminalOutput, onTestResults`.
- The component returns a fragment, so the hidden iframe can sit next to the visible one. `display: none` takes it out of layout entirely. Its `sandbox` is `allow-scripts` only (no `allow-modals`), so a stray `alert()` in a test can't pop up over the page.

```tsx
'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { bundlePreview, type PreviewBuildError, type PreviewFile } from '@/src/preview/bundler';
import { ReadyGate } from '@/src/preview/ready-gate';
import type { TestResult } from '@/src/testing/browser-test-harness';

export interface ConsoleLine {
  level: string;
  text: string;
}

export interface NetworkEntry {
  method: string;
  url: string;
  status: number;
  mocked: boolean;
  requestBody: string | null;
  responseBody: string;
  durationMs: number;
  startedAt: number;
}

export interface TerminalOutput {
  id: string;
  runId: number;
  ok: boolean;
  text: string;
}

/** What gets posted into the preview realm on every run. */
interface RunPayload {
  code: string;
  css: string;
}

export interface PreviewFrameProps {
  files: PreviewFile[];
  entry: string;
  handlersPath?: string;
  /** Changing this re-bundles and reloads. The host owns when that happens. */
  runToken: number;
  onConsole: (line: ConsoleLine) => void;
  onNetwork: (entry: NetworkEntry) => void;
  onStatus: (status: { building: boolean; errors: PreviewBuildError[] }) => void;
  /**
   * Called the moment code is actually sent into a loaded, listening iframe --
   * i.e. the preview has something on screen, not just that a bundle compiled.
   * The bundle usually finishes in well under a second; the iframe document
   * itself, on a tab that has never run esbuild-wasm before, can take far
   * longer (confirmed: up to ~20s for a cold WASM compile with no caching
   * yet) with the bundling phase showing as already "done". Without a signal
   * for this second phase, the preview sits blank with no loading indicator
   * at all for however long that takes. The host uses this to keep its
   * loading state up for the whole wait, not just the fast part of it.
   */
  onLoaded: () => void;
  onServerLog: (line: ConsoleLine) => void;
  onTerminalOutput: (output: TerminalOutput) => void;
  onTestResults: (tests: TestResult[]) => void;
}

export interface PreviewFrameHandle {
  /**
   * Opens the same app in a real, top-level browser tab -- not a sandboxed
   * iframe. That tab has a normal origin, so right-click Inspect, F12, the
   * Sources panel and breakpoints all work exactly as they would on any
   * other page, which the embedded preview's sandboxing cannot offer. The
   * tab is kept in sync: every later Run (or edit-triggered rebuild) also
   * posts the new code to it, as long as it is still open.
   */
  openInNewTab: () => void;
  /** Runs a question-defined terminal command inside the LIVE preview iframe. */
  sendTerminalCommand: (id: string, args: string, runId: number) => void;
  /**
   * `npm test`: runs an already-bundled test script in a brand-new HIDDEN
   * iframe -- never the live preview. The test bundle carries its own
   * store, its own fetch interceptor and its own harness; executing it in
   * the live iframe would repoint the learner's running app at the test
   * run's throwaway backend. One fresh iframe per run is the client-side
   * equivalent of execute-tests.ts giving every Submit a fresh jsdom.
   */
  sendRunTests: (code: string) => void;
  /** Tears down an in-flight test iframe (timeout, Run, Reset). Safe to call when none exists. */
  cancelRunTests: () => void;
}

export const PreviewFrame = forwardRef<PreviewFrameHandle, PreviewFrameProps>(function PreviewFrame(
  {
    files,
    entry,
    handlersPath,
    runToken,
    onConsole,
    onNetwork,
    onStatus,
    onLoaded,
    onServerLog,
    onTerminalOutput,
    onTestResults,
  },
  ref,
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const popupRef = useRef<Window | null>(null);
  // The third target, alongside the iframe and the popup: a hidden iframe
  // that exists only while an `npm test` run is in flight. testRunKey is its
  // React key -- a new number mounts a brand-new document; null unmounts it.
  const testFrameRef = useRef<HTMLIFrameElement>(null);
  const [testRunKey, setTestRunKey] = useState<number | null>(null);
  // Held until the hidden iframe announces 'frame-ready' -- posting before
  // its listener exists would be silently dropped, the same race ReadyGate
  // and the popup's frame-ready handshake already exist to prevent.
  const pendingTestCodeRef = useRef<string | null>(null);
  // The last payload actually built, kept outside the gate so a tab opened
  // *after* the current build finished still has something to receive the
  // moment it announces itself ready -- the gate's own copy is cleared by
  // design once it has been sent to the iframe.
  const lastPayloadRef = useRef<RunPayload | null>(null);

  const send = useCallback(
    (payload: RunPayload) => {
      const frame = iframeRef.current?.contentWindow;
      if (!frame) return;
      frame.postMessage({ source: 'debuglab-host', type: 'run', ...payload }, '*');
      onLoaded();
    },
    [onLoaded],
  );

  const sendToPopup = useCallback((payload: RunPayload) => {
    const popup = popupRef.current;
    if (!popup || popup.closed) return;
    popup.postMessage({ source: 'debuglab-host', type: 'run', ...payload }, '*');
  }, []);

  // One gate for the component's whole life. `send` always reads
  // iframeRef.current at call time, so the gate does not need to be recreated
  // per generation -- only reset() needs to run per generation. See
  // src/preview/ready-gate.ts for why this is a plain class and not React
  // state: a prior version of this coordination, built from useState plus two
  // effects, had a real bug where a ref write (queuing the bundle) triggered
  // no re-render, so nothing re-checked readiness once the bundle finished --
  // silently dropping the "frame loaded before the bundle did" ordering,
  // which is the common case, not the edge case.
  const gateRef = useRef<ReadyGate<RunPayload> | null>(null);
  gateRef.current ??= new ReadyGate<RunPayload>(send);

  useImperativeHandle(
    ref,
    () => ({
      openInNewTab() {
        const popup = window.open('/preview/frame.html', 'debuglab-preview');
        popupRef.current = popup;
        // If a build already finished, the popup's own 'frame-ready' message
        // (handled below) is what actually delivers it -- window.open()
        // returns before the new document has attached its listener, so
        // posting here would race and silently drop, the same failure mode
        // ReadyGate exists to prevent for the iframe.
      },
      sendTerminalCommand(id: string, args: string, runId: number) {
        const frame = iframeRef.current?.contentWindow;
        if (!frame) return;
        frame.postMessage(
          { source: 'debuglab-host', type: 'terminal-run', payload: { id, args, runId } },
          '*',
        );
      },
      sendRunTests(code: string) {
        pendingTestCodeRef.current = code;
        setTestRunKey((k) => (k ?? 0) + 1);
      },
      cancelRunTests() {
        pendingTestCodeRef.current = null;
        setTestRunKey(null);
      },
    }),
    [],
  );

  // Messages from the preview realm: console output, network activity,
  // crashes -- from the embedded iframe, a popped-out tab, or the hidden
  // npm-test iframe. event.source tells them apart, since all three post the
  // same message shape. The live iframe and the popup are treated
  // identically (Console/Network stay a single source of truth); the test
  // iframe is handled entirely separately and FIRST, so its traffic never
  // reaches the live Logs/Network panels and its 'frame-ready' never marks
  // the live preview's gate ready.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as
        | { source?: string; type?: string; payload?: unknown }
        | undefined;
      if (!data || data.source !== 'debuglab-preview') return;

      const testFrame = testFrameRef.current?.contentWindow;
      if (testFrame && event.source === testFrame) {
        if (data.type === 'frame-ready') {
          const code = pendingTestCodeRef.current;
          pendingTestCodeRef.current = null;
          if (code !== null) testFrame.postMessage({ source: 'debuglab-host', type: 'run-tests', code }, '*');
          return;
        }
        if (data.type === 'test-results') {
          onTestResults((data.payload as { tests: TestResult[] }).tests);
          setTestRunKey(null); // done -- discard this iframe; the next run gets a fresh one
          return;
        }
        if (data.type === 'error') {
          // An uncaught error in the test realm: in practice a test file
          // throwing while its module evaluates, before the harness's own
          // try/catch exists to report it. The harness will never report, so
          // end the run here rather than waiting for the host's timeout.
          const { text } = data.payload as { text: string };
          onTestResults([{ name: 'test file failed to load', passed: false, error: text }]);
          setTestRunKey(null);
          return;
        }
        // console / network / server-log from a test run: intentionally
        // dropped. They describe the test's throwaway backend, not the live
        // app, and would be indistinguishable from the app's own traffic.
        return;
      }

      // A message whose source is neither the (possibly already-torn-down)
      // test frame nor a live target (the mounted iframe or an open popup)
      // is a straggler from a generation we've already discarded -- e.g. the
      // test iframe's own 'network'/'console'/'frame-ready' arriving after
      // setTestRunKey(null) already nulled testFrameRef. Without this guard
      // those messages fall through to the branches below: test traffic
      // leaks into the live Network/Logs tabs, and a stray 'frame-ready'
      // can mark a freshly-reset live gate ready before the live iframe has
      // actually mounted its listener, which is the exact race ReadyGate
      // exists to prevent.
      const fromLive =
        event.source === iframeRef.current?.contentWindow ||
        (popupRef.current !== null && event.source === popupRef.current);
      if (!fromLive) return;

      if (data.type === 'frame-ready') {
        if (event.source === popupRef.current) {
          if (lastPayloadRef.current !== null) sendToPopup(lastPayloadRef.current);
        } else {
          gateRef.current!.markReady();
        }
        return;
      }
      if (data.type === 'console') {
        onConsole(data.payload as ConsoleLine);
        return;
      }
      if (data.type === 'network') {
        onNetwork(data.payload as NetworkEntry);
        return;
      }
      if (data.type === 'server-log') {
        onServerLog(data.payload as ConsoleLine);
        return;
      }
      if (data.type === 'terminal-output') {
        onTerminalOutput(data.payload as TerminalOutput);
        return;
      }
      if (data.type === 'error') {
        const { text } = data.payload as { text: string };
        onConsole({ level: 'error', text });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onConsole, onNetwork, onServerLog, onTerminalOutput, onTestResults, sendToPopup]);

  // Bundle on demand and hand the result to the gate, which sends it the
  // moment both the bundle and the (possibly not-yet-loaded) iframe are ready,
  // regardless of which one finishes first. Also mirrored to an open popup.
  useEffect(() => {
    let cancelled = false;

    // A new runToken remounts the iframe below (key={runToken}): a brand new
    // document that has not announced itself yet. Reset the gate so a ready
    // signal left over from the PREVIOUS iframe generation can never cause
    // code to be posted into a frame that has not loaded its listener yet.
    gateRef.current!.reset();

    async function build() {
      onStatus({ building: true, errors: [] });
      const result = await bundlePreview({ files, entry, handlersPath });
      if (cancelled) return;

      if (!result.ok) {
        onStatus({ building: false, errors: result.errors });
        return;
      }
      onStatus({ building: false, errors: [] });
      const payload: RunPayload = { code: result.code, css: result.css };
      lastPayloadRef.current = payload;
      gateRef.current!.setPayload(payload);
      sendToPopup(payload);
    }

    void build();
    return () => {
      cancelled = true;
    };
    // files/entry are intentionally not dependencies: the host controls when a
    // rebuild happens via runToken, so typing does not trigger a bundle per keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runToken]);

  return (
    <>
      <iframe
        // Keyed by runToken so React discards the old DOM node and mounts a
        // genuinely new one on every run, rather than reusing a document that
        // has already executed whatever JS it loaded. Without this, editing
        // frame.html (or anything it loads) has no effect on a tab that has
        // been sitting on the Preview tab since before the edit -- the running
        // document is immune to changes on disk until something forces a real
        // reload. This makes every run that reload, unconditionally.
        key={runToken}
        ref={iframeRef}
        src="/preview/frame.html"
        title="App preview"
        sandbox="allow-scripts allow-modals"
        style={{ width: '100%', height: '100%', border: 0, background: '#fff' }}
      />
      {testRunKey !== null ? (
        <iframe
          key={`test-${testRunKey}`}
          ref={testFrameRef}
          src="/preview/frame.html"
          title="npm test runner"
          aria-hidden="true"
          tabIndex={-1}
          sandbox="allow-scripts"
          style={{ display: 'none' }}
        />
      ) : null}
    </>
  );
});
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: errors **only** in `components/SolveScreen.tsx`, about the missing `onServerLog`/`onTerminalOutput`/`onTestResults` props on `<PreviewFrame>`. Task 6 wires those. Any other error is a real problem.

- [ ] **Step 4: Run the existing preview tests**

Run: `npx vitest run src/preview/`
Expected: PASS. Nothing in `src/preview/` changed in this task; `PreviewFrame.tsx` itself has no unit test (it is DOM/iframe glue, verified live in Task 8, as before).

- [ ] **Step 5: Commit** (the tree has a known type error until Task 6, so commit it as work in progress, or hold the commit and fold it into Task 6's)

```bash
git add components/PreviewFrame.tsx public/preview/frame.html
git commit -m "feat: PreviewFrame handles server-log/terminal-output, adds a hidden npm-test iframe target"
```

---

### Task 4: `npm test` client-side bundling

Bundles `testEntry` + the shared harness + the interceptor + `__devtools__.js` with `esbuild-wasm`, client-side. Task 3's hidden iframe runs the result.

**Files:**
- Modify: `scripts/build-preview-vendor.mjs`
- Modify: `src/preview/bundler.ts` (export `ensureInitialised`)
- Create: `src/preview/test-bundler.ts`
- Test: `src/preview/test-bundler.test.ts`

**Interfaces:**
- Consumes: `devtoolsModuleFor`/`DEVTOOLS_VIRTUAL` (Task 2); `INTERCEPTOR_MODULE` (existing); `PreviewFile`/`PreviewBuildError` and the now-exported `ensureInitialised` from `src/preview/bundler.ts`.
- Produces:
  - `scripts/build-preview-vendor.mjs` also writes `public/preview/vendor/harness-source.txt` (the raw text of `src/testing/browser-test-harness.ts`). `public/preview/vendor/` is gitignored and regenerated by `npm run dev`/`npm run build` (both run `build:preview` first). It is not committed.
  - `export async function bundleTests(options: { files: PreviewFile[]; testEntry: string; handlersPath?: string }, deps?: BundleTestsDeps): Promise<{ ok: true; code: string } | { ok: false; errors: PreviewBuildError[] }>` — used by Task 6's `SolveScreen.tsx` (which never passes `deps`; that parameter exists only for the unit test).
  - The bundled code calls `globalThis.__debuglab_test_report__(results)` exactly once (set up by `frame.html`, Task 3 Step 1).

- [ ] **Step 1: Extend the vendor script to export the harness source**

In `scripts/build-preview-vendor.mjs`, insert this right **after** the `for (const target of TARGETS) { … }` loop (ends at line 123), before the `copyFile(… esbuild.wasm …)` call. `readFile`, `writeFile`, `join`, `root` and `outDir` are all already imported/defined in that file.

```js
// src/testing/browser-test-harness.ts has zero imports, so its raw text is
// all `npm test` (src/preview/test-bundler.ts) needs -- esbuild-wasm
// transpiles it as a virtual .ts file, exactly as execute-tests.ts does with
// readFileSync on the server. A browser cannot readFileSync, so bake the text
// into a static asset instead. Regenerated on every `npm run dev`; after
// editing the harness mid-session, re-run `npm run build:preview`.
const harnessSource = await readFile(join(root, 'src', 'testing', 'browser-test-harness.ts'), 'utf8');
await writeFile(join(outDir, 'harness-source.txt'), harnessSource);
console.log('copied browser-test-harness.ts -> public/preview/vendor/harness-source.txt');
```

- [ ] **Step 2: Run the vendor script and confirm the file exists**

Run: `npm run build:preview && grep -c "createTestHarness" public/preview/vendor/harness-source.txt`
Expected: the script's usual output plus the new line; `grep` prints `1` or more.

- [ ] **Step 3: Export `ensureInitialised` from `bundler.ts`**

In `src/preview/bundler.ts`, change line 52 from `function ensureInitialised(): Promise<void> {` to:

```ts
export function ensureInitialised(): Promise<void> {
```

Nothing else changes. `bundleTests` awaits it (Step 6). The first cold esbuild-wasm initialisation can take a long time (see the `onLoaded` comment in `components/PreviewFrame.tsx`: "up to ~20s for a cold WASM compile"), and `npm test` typed during that window must wait for it instead of throwing. Because the guard is parked on `globalThis`, an initialisation `bundlePreview` already started is shared, not repeated.

- [ ] **Step 4: Write the failing test for `bundleTests`**

`bundleTests` can't run unmodified under Vitest, for two reasons: Node's `fetch` rejects the relative harness URL (`Invalid URL`), and esbuild-wasm's `wasmURL` init only works in a browser. So `bundleTests` takes an optional `deps` argument, and the test passes Node equivalents: the harness read from disk, a no-op init, and real `esbuild` (package.json pins `esbuild` and `esbuild-wasm` to the same version, with the same `build()` API). Everything else is the production code path, including the real TypeScript harness, which proves the `.ts` loader choice.

```ts
import * as realEsbuild from 'esbuild';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { bundleTests, type BundleTestsDeps } from './test-bundler';

// Real esbuild (Node), not a mock: the point is proving the assembled file
// set actually bundles -- harness loader, virtual paths, __devtools__.js
// resolution. esbuild-wasm itself cannot initialise under Vitest (its
// wasmURL option is browser-only), so the browser-only pieces are swapped
// for their Node equivalents. Same esbuild version as esbuild-wasm
// (package.json pins both to the same release), same build() API.
const deps: BundleTestsDeps = {
  init: async () => {},
  build: realEsbuild.build as unknown as BundleTestsDeps['build'],
  harnessSource: async () =>
    readFileSync(join(process.cwd(), 'src/testing/browser-test-harness.ts'), 'utf8'),
};

describe('bundleTests', () => {
  test('bundles a test file plus the real (TypeScript) harness into one script', async () => {
    const result = await bundleTests(
      {
        files: [
          {
            path: 'tests/example.test.js',
            content: `
              const { it, expect } = globalThis.__debuglab_harness__;
              it('adds up', () => expect(1 + 1).toBe(2));
            `,
          },
        ],
        testEntry: 'tests/example.test.js',
      },
      deps,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.code).toContain('adds up');
      expect(result.code).toContain('__debuglab_test_report__');
    }
  });

  test('a question file importing ../__devtools__.js resolves when handlersPath is set', async () => {
    const result = await bundleTests(
      {
        files: [
          { path: 'mock/handlers.js', content: `import '../server-sim/thing.js';\nexport const handlers = [];` },
          {
            path: 'server-sim/thing.js',
            content: `import { serverLog } from '../__devtools__.js';\nexport function f() { serverLog('info', 'hi'); }`,
          },
          {
            path: 'tests/example.test.js',
            content: `
              import { f } from '../server-sim/thing.js';
              const { it } = globalThis.__debuglab_harness__;
              it('calls f', () => f());
            `,
          },
        ],
        testEntry: 'tests/example.test.js',
        handlersPath: 'mock/handlers.js',
      },
      deps,
    );
    expect(result).toMatchObject({ ok: true });
  });

  test('a missing testEntry reports a build failure, not a crash', async () => {
    const result = await bundleTests({ files: [], testEntry: 'tests/missing.test.js' }, deps);
    expect(result).toEqual({
      ok: false,
      errors: [{ file: 'tests/missing.test.js', line: 0, column: 0, text: 'Test entry "tests/missing.test.js" is missing' }],
    });
  });

  test('a syntax error in reachable code reports the learner-facing path, not a crash', async () => {
    const result = await bundleTests(
      {
        files: [
          { path: 'src/broken.js', content: 'export const x = ;' },
          { path: 'tests/example.test.js', content: `import '../src/broken.js';` },
        ],
        testEntry: 'tests/example.test.js',
      },
      deps,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]?.file).toBe('src/broken.js');
  });
});
```

Run: `npx vitest run src/preview/test-bundler.test.ts`
Expected: FAIL — `test-bundler.ts` does not exist yet.

- [ ] **Step 5: Implement `bundleTests`**

Mirrors `execute-tests.ts`'s file assembly (same virtual names; `HARNESS_VIRTUAL` ends in **`.ts`** exactly like `execute-tests.ts` line 19 — the harness is real TypeScript and `loaderFor()` would pick the jsx loader for a `.js` name, failing with `Unexpected "interface"`, verified). Setup mirrors `execute-tests.ts` too: it only sets `globalThis.__debuglab_harness__`, which is all the real test files use (`const { it, expect } = globalThis.__debuglab_harness__;`). It does **not** put `describe`/`it`/`expect` on the global object. Differences from the server: `esbuild-wasm`, ESM output with React external (resolved by `frame.html`'s import map), `import 'react'` first (same reason as `bundlePreview`'s entry), and `__debuglab_test_report__` as the report hook.

```ts
import * as esbuild from 'esbuild-wasm';
import {
  loaderFor,
  resolveRelative,
  stripNamespace,
  stripNamespaceEverywhere,
  VIRTUAL_NAMESPACE,
} from '../bundling/resolve';
import { ensureInitialised, type PreviewBuildError, type PreviewFile } from './bundler';
import { DEVTOOLS_VIRTUAL, devtoolsModuleFor } from './devtools-source';
import { INTERCEPTOR_MODULE } from './interceptor-source';

// Same virtual names as src/grading/execute-tests.ts. HARNESS_VIRTUAL must
// end in .ts: the harness source is real TypeScript (`export interface`,
// type annotations), and loaderFor() picks the loader from the extension --
// a .js name gets the jsx loader and fails with `Unexpected "interface"`.
const HARNESS_VIRTUAL = '__debuglab_harness__.ts';
const SETUP_VIRTUAL = '__debuglab_setup__.js';
const INTERCEPTOR_VIRTUAL = '__debuglab_interceptor__.js';
const ENTRY_VIRTUAL = '__debuglab_test_entry__.js';

const REACT_EXTERNALS = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'];

let harnessSourcePromise: Promise<string> | null = null;
function fetchHarnessSource(): Promise<string> {
  // Fetched once per page load, not once per `npm test`. A failed fetch is
  // not cached, so the next `npm test` retries instead of replaying it.
  harnessSourcePromise ??= fetch('/preview/vendor/harness-source.txt')
    .then((r) => {
      if (!r.ok) throw new Error(`could not load the test harness (HTTP ${r.status})`);
      return r.text();
    })
    .catch((err) => {
      harnessSourcePromise = null;
      throw err;
    });
  return harnessSourcePromise;
}

export interface BundleTestsOptions {
  files: PreviewFile[];
  testEntry: string;
  handlersPath?: string;
}

/**
 * Seams for the unit test only. The browser always uses the defaults.
 * Node's fetch() rejects the relative harness URL and esbuild-wasm's
 * browser-only `wasmURL` init cannot run under Vitest, so the test swaps in
 * a disk read, a no-op init and real (Node) esbuild -- same version and
 * same build() API as esbuild-wasm.
 */
export interface BundleTestsDeps {
  init: () => Promise<void>;
  build: (options: esbuild.BuildOptions) => Promise<esbuild.BuildResult>;
  harnessSource: () => Promise<string>;
}

const defaultDeps: BundleTestsDeps = {
  init: ensureInitialised,
  build: (options) => esbuild.build(options),
  harnessSource: fetchHarnessSource,
};

export type BundleTestsResult =
  | { ok: true; code: string }
  | { ok: false; errors: PreviewBuildError[] };

export async function bundleTests(
  options: BundleTestsOptions,
  deps: BundleTestsDeps = defaultDeps,
): Promise<BundleTestsResult> {
  const map = new Map(options.files.map((f) => [f.path, f.content]));
  if (!map.has(options.testEntry)) {
    return {
      ok: false,
      errors: [{ file: options.testEntry, line: 0, column: 0, text: `Test entry "${options.testEntry}" is missing` }],
    };
  }

  // Cold esbuild-wasm init can take a long time on a first visit (see the
  // onLoaded comment in components/PreviewFrame.tsx); `npm test` typed
  // during that window must wait for it, not throw.
  await deps.init();

  map.set(HARNESS_VIRTUAL, await deps.harnessSource());
  map.set(
    SETUP_VIRTUAL,
    `import { createTestHarness } from './${HARNESS_VIRTUAL}';\nglobalThis.__debuglab_harness__ = createTestHarness();\n`,
  );
  if (options.handlersPath) {
    map.set(INTERCEPTOR_VIRTUAL, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${options.handlersPath}`));
    // Question files (e.g. server-sim/cartHandlers.js) import
    // '../__devtools__.js'; without this entry they fail to resolve.
    map.set(DEVTOOLS_VIRTUAL, devtoolsModuleFor(options.handlersPath));
  }
  map.set(
    ENTRY_VIRTUAL,
    // 'react' first, for the same reason as bundlePreview's entry: the
    // vendored react-dom/jsx-runtime read React off a global that only
    // react.js's own module body sets.
    `import 'react';\n` +
      (options.handlersPath ? `import './${INTERCEPTOR_VIRTUAL}';\n` : '') +
      `import './${SETUP_VIRTUAL}';\n` +
      `import './${options.testEntry}';\n\n` +
      `(async () => {\n` +
      `  try {\n` +
      `    const results = await globalThis.__debuglab_harness__.run();\n` +
      `    globalThis.__debuglab_test_report__(results);\n` +
      `  } catch (err) {\n` +
      `    globalThis.__debuglab_test_report__([\n` +
      `      { name: 'test file failed to load', passed: false, error: err instanceof Error ? err.message : String(err) },\n` +
      `    ]);\n` +
      `  }\n` +
      `})();\n`,
  );

  const virtual: esbuild.Plugin = {
    name: 'debuglab-test-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'entry-point') return { path: args.path, namespace: VIRTUAL_NAMESPACE };
        if (REACT_EXTERNALS.includes(args.path)) return { path: args.path, external: true };
        if (!args.path.startsWith('.')) return { path: args.path, external: true };
        const resolved = resolveRelative(args.importer, args.path, map);
        if (!resolved) {
          return { errors: [{ text: `Cannot resolve "${args.path}" from "${args.importer}"` }] };
        }
        return { path: resolved, namespace: VIRTUAL_NAMESPACE };
      });
      build.onLoad({ filter: /.*/, namespace: VIRTUAL_NAMESPACE }, (args) => ({
        contents: map.get(args.path) ?? '',
        loader: loaderFor(args.path),
      }));
    },
  };

  try {
    const result = await deps.build({
      entryPoints: [ENTRY_VIRTUAL],
      bundle: true,
      write: false,
      outdir: 'out',
      format: 'esm',
      jsx: 'automatic',
      target: 'es2022',
      logLevel: 'silent',
      define: { 'process.env.NODE_ENV': '"development"' },
      plugins: [virtual],
    });
    const code = result.outputFiles?.find((f) => f.path.endsWith('.js'))?.text;
    if (code === undefined) {
      return { ok: false, errors: [{ file: options.testEntry, line: 0, column: 0, text: 'Bundler produced no JavaScript output' }] };
    }
    return { ok: true, code };
  } catch (err) {
    const messages = (err as esbuild.BuildFailure).errors ?? [];
    if (messages.length === 0) {
      return { ok: false, errors: [{ file: options.testEntry, line: 0, column: 0, text: (err as Error).message }] };
    }
    return {
      ok: false,
      errors: messages.map((m) => ({
        file: stripNamespace(m.location?.file) ?? options.testEntry,
        line: m.location?.line ?? 0,
        column: m.location?.column ?? 0,
        text: stripNamespaceEverywhere(m.text),
      })),
    };
  }
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/preview/test-bundler.test.ts`
Expected: PASS, 4/4

What this does **not** prove: that esbuild-wasm in a real browser produces the same output, or that the bundle runs correctly inside the hidden iframe (import map, vendored React, `__debuglab_test_report__`). That is covered only by Task 8, Step 3.

- [ ] **Step 7: Verify TypeScript compiles and existing tests still pass**

Run: `npx tsc --noEmit && npx vitest run src/preview/`
Expected: `tsc` reports only the known `SolveScreen.tsx` prop errors from Task 3 (fixed in Task 6); all tests green.

- [ ] **Step 8: Commit**

```bash
git add scripts/build-preview-vendor.mjs src/preview/bundler.ts src/preview/test-bundler.ts src/preview/test-bundler.test.ts
git commit -m "feat: add client-side npm test bundling (bundleTests)"
```

---

### Task 5: `terminalCommands` on `QuestionMeta`/`LearnerQuestion`

Must land before Task 6, which reads `question.terminalCommands`.

**Files:**
- Modify: `src/questions/load-question.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `export interface TerminalCommand { id: string; command: string; help: string }`, `QuestionMeta.terminalCommands?: TerminalCommand[]` and the same field on `LearnerQuestion`, forwarded by `toLearnerQuestion` — consumed by Task 7's `question.json` and (via `SolveScreen.tsx`'s own `LearnerQuestionProps`, which Task 6 extends separately) by Task 6.

- [ ] **Step 1: Add the field and type**

In `src/questions/load-question.ts`, add to the end of `interface QuestionMeta` (right after `testEntry?: string;`):

```ts
  /**
   * Question-declared terminal commands (the Terminal tab's non-platform-native
   * set). `command` is the exact string a learner types; `id` is the key into
   * mock/handlers.js's `terminalHandlers` export, which actually runs it inside
   * the preview iframe (see src/preview/devtools-source.ts). Metadata only --
   * the server never executes question files.
   */
  terminalCommands?: TerminalCommand[];
```

Directly below the closing `}` of `QuestionMeta`, add:

```ts
export interface TerminalCommand {
  id: string;
  command: string;
  help: string;
}
```

Add to the end of `interface LearnerQuestion` (after its `testEntry?: string;`):

```ts
  terminalCommands?: TerminalCommand[];
```

- [ ] **Step 2: Forward it in `toLearnerQuestion`**

In `toLearnerQuestion`'s returned object, after `testEntry: meta.testEntry,` add:

```ts
    terminalCommands: meta.terminalCommands,
```

- [ ] **Step 3: Run the question-loading tests**

Run: `npx vitest run src/questions/`
Expected: PASS — additive optional field (the existing tests use `toEqual`/`JSON.stringify`, which tolerate an `undefined` property).

- [ ] **Step 4: Commit**

```bash
git add src/questions/load-question.ts
git commit -m "feat: add terminalCommands to QuestionMeta/LearnerQuestion"
```

---

### Task 6: `TerminalPanel.tsx`, `DevToolsPanel.tsx` layout, `SolveScreen.tsx` wiring

Brings Tasks 1-5 together into the UI a learner actually uses.

**Files:**
- Create: `components/TerminalPanel.tsx`
- Modify (full replacement given below): `components/DevToolsPanel.tsx`
- Modify: `components/SolveScreen.tsx`
- Modify: `components/solve.module.css`

**Interfaces:**
- Consumes: `parseCommand`/`diffLines` (Task 1); `bundleTests` (Task 4); `PreviewFrameHandle.sendTerminalCommand`/`sendRunTests`/`cancelRunTests`, the `onServerLog`/`onTerminalOutput`/`onTestResults` props and the `TerminalOutput` type (all Task 3); `LearnerQuestion.terminalCommands` (Task 5).
- Produces: `BottomTab = 'logs' | 'network' | 'terminal' | 'results' | 'solution'` and `LogLine` (`ConsoleLine & { source: 'client' | 'server' }`), exported from `DevToolsPanel.tsx`; `TerminalLine`/`TerminalPanelProps`, exported from `TerminalPanel.tsx`.

- [ ] **Step 1: Create `components/TerminalPanel.tsx`**

`files` is `question.files` (which carries `visibility`), not SolveScreen's own `files` memo (`{path, content}` only). `ls`/`cat`/`git diff` need `visibility` to skip hidden files. `git diff` compares `originals` (the broken starting files) with `contents` (current editor text) and prints one `@@` header per hunk. `clear` wipes scrollback, its own echo included. Input is disabled and shows a spinner while `busy`, so a second command (e.g. a second `npm test`) can't start while one is in flight.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './solve.module.css';
import { parseCommand, type PlatformCommand } from '@/src/terminal/parse-command';
import { diffLines } from '@/src/terminal/diff-lines';

export interface TerminalLine {
  kind: 'input' | 'output' | 'error';
  text: string;
}

export interface TerminalCommandMeta {
  id: string;
  command: string;
  help: string;
}

/** Same shape as SolveScreen's LearnerFile -- `question.files`, which carries visibility. */
export interface TerminalFile {
  path: string;
  content: string;
  visibility: 'editable' | 'readonly' | 'hidden';
}

export interface TerminalPanelProps {
  lines: TerminalLine[];
  onLines: (update: (prev: TerminalLine[]) => TerminalLine[]) => void;
  busy: boolean;
  declaredCommands: TerminalCommandMeta[];
  hasTests: boolean;
  /** question.files (NOT SolveScreen's `files`, which has no visibility field). */
  files: TerminalFile[];
  originals: Record<string, string>;
  contents: Record<string, string>;
  onRun: () => void;
  onNpmTest: () => void;
  onQuestionCommand: (id: string, args: string) => void;
}

export function TerminalPanel({
  lines,
  onLines,
  busy,
  declaredCommands,
  hasTests,
  files,
  originals,
  contents,
  onRun,
  onNpmTest,
  onQuestionCommand,
}: TerminalPanelProps) {
  const [input, setInput] = useState('');
  const inputRowRef = useRef<HTMLDivElement>(null);

  // Keep the prompt in view on every change to `lines` -- including output
  // that arrives later from the iframe (npm test results, repro reports),
  // not just local echoes.
  useEffect(() => {
    inputRowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);

  function append(...newLines: TerminalLine[]) {
    onLines((prev) => [...prev, ...newLines]);
  }

  function runCommand(command: PlatformCommand) {
    switch (command.kind) {
      case 'run':
        onRun();
        return;
      case 'npm-test':
        onNpmTest();
        return;
      case 'question':
        onQuestionCommand(command.id, command.args);
        return;
      case 'git-diff': {
        const out: TerminalLine[] = [];
        for (const f of files) {
          if (f.visibility === 'hidden') continue;
          const before = originals[f.path] ?? f.content;
          const after = contents[f.path] ?? f.content;
          if (before === after) continue;
          out.push({ kind: 'output', text: `diff --git a/${f.path} b/${f.path}` });
          for (const hunk of diffLines(before, after)) {
            out.push({ kind: 'output', text: `@@ -${hunk.oldStart} +${hunk.newStart} @@` });
            for (const d of hunk.lines) {
              out.push({ kind: 'output', text: (d.type === 'added' ? '+ ' : '- ') + d.text });
            }
          }
        }
        append(...(out.length > 0 ? out : [{ kind: 'output' as const, text: '(no changes)' }]));
        return;
      }
      case 'ls':
        append(
          ...files
            .filter((f) => f.visibility !== 'hidden')
            .map((f): TerminalLine => ({ kind: 'output', text: f.path })),
        );
        return;
      case 'cat': {
        const file = files.find((f) => f.path === command.path && f.visibility !== 'hidden');
        if (!file) {
          append({ kind: 'error', text: `cat: ${command.path}: No such file or directory` });
          return;
        }
        append({ kind: 'output', text: contents[file.path] ?? file.content });
        return;
      }
      case 'clear':
        onLines(() => []);
        return;
      case 'help':
        append(
          { kind: 'output', text: `npm run dev, ${hasTests ? 'npm test, ' : ''}git diff, ls, cat <path>, clear, help` },
          ...declaredCommands.map((d): TerminalLine => ({ kind: 'output', text: `${d.command} — ${d.help}` })),
        );
        return;
    }
  }

  function submit() {
    const raw = input;
    setInput('');
    if (raw.trim() === '') return;
    const result = parseCommand(raw, declaredCommands, hasTests);
    if (result.ok && result.command.kind === 'clear') {
      runCommand(result.command); // clear wipes everything, its own echo included
      return;
    }
    append({ kind: 'input', text: raw });
    if (!result.ok) {
      if (result.message) append({ kind: 'error', text: result.message });
      return;
    }
    runCommand(result.command);
  }

  return (
    <div className={styles.terminal} data-testid="terminal-panel">
      <div className={styles.terminalScrollback}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${styles.terminalLine} mono ${
              line.kind === 'input' ? styles.terminalInputLine : line.kind === 'error' ? styles.terminalError : ''
            }`}
          >
            {line.kind === 'input' ? '$ ' : ''}
            {line.text}
          </div>
        ))}
      </div>
      <div ref={inputRowRef} className={`${styles.terminalInputRow} mono`}>
        {busy ? <span className={styles.spinner} aria-hidden="true" /> : <span aria-hidden="true">$</span>}
        <input
          className={`${styles.terminalInput} mono`}
          value={input}
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder={busy ? 'running…' : 'type a command, or help'}
          aria-label="Terminal input"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `components/DevToolsPanel.tsx`**

Compared with the current file:
- `'console'` becomes `'logs'`, and a `'terminal'` tab is added.
- Logs takes one `logLines: LogLine[]` array instead of `consoleLines`. The spec described "two underlying arrays, one merged chronological view". One array, with each line tagged by `source` when it arrives, is chronological by construction and needs no merge step. The All/Client/Server chips are a render-time filter over it.
- Network gets a Table/Timeline toggle. The Timeline view orders rows by send time (`startedAt`), positions each bar by start, sizes it by `durationMs` (so a bar's right edge is when its response arrived), and labels each row with its arrival rank `#n`. No charting library.
- The Terminal tab renders `TerminalPanel` with a single `terminal` prop object (all of `TerminalPanelProps`), so the panel's own prop list doesn't grow by eleven.

```tsx
'use client';

import { useState } from 'react';
import type { ConsoleLine, NetworkEntry } from './PreviewFrame';
import { ResultCard, type SubmitResult } from './ResultCard';
import { TerminalPanel, type TerminalPanelProps } from './TerminalPanel';
import styles from './solve.module.css';

export type BottomTab = 'logs' | 'network' | 'terminal' | 'results' | 'solution';

export interface SolutionFile {
  path: string;
  content: string;
}

/** One line in the Logs tab. `source` says which realm produced it. */
export interface LogLine extends ConsoleLine {
  source: 'client' | 'server';
}

export interface DevToolsPanelProps {
  tab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  logLines: LogLine[];
  network: NetworkEntry[];
  result: SubmitResult | null;
  solutionFiles: SolutionFile[] | null;
  terminal: TerminalPanelProps;
}

type LogFilter = 'all' | 'client' | 'server';

export function DevToolsPanel({
  tab,
  onTabChange,
  logLines,
  network,
  result,
  solutionFiles,
  terminal,
}: DevToolsPanelProps) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [logFilter, setLogFilter] = useState<LogFilter>('all');
  const [netView, setNetView] = useState<'table' | 'timeline'>('table');

  const tabs: { id: BottomTab; label: string; count?: number }[] = [
    { id: 'logs', label: 'Logs', count: logLines.length },
    { id: 'network', label: 'Network', count: network.length },
    { id: 'terminal', label: 'Terminal' },
    { id: 'results', label: 'Results' },
    { id: 'solution', label: 'Solution' },
  ];

  // A render-time predicate over the full accumulated array, never a
  // snapshot taken when the filter changes: lines that arrive while a filter
  // is active, and lines from before it was switched, are filtered by the
  // exact same rule on every render.
  const visibleLogs = logFilter === 'all' ? logLines : logLines.filter((l) => l.source === logFilter);

  return (
    <section className={styles.bottom} aria-label="Developer tools">
      <div className={styles.tabs} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
            {t.count ? <span className={styles.tabCount}>{t.count}</span> : null}
          </button>
        ))}
      </div>

      <div className={styles.bottomBody}>
        {tab === 'logs' && (
          <>
            <div className={styles.toggleRow} role="group" aria-label="Filter logs by source">
              {(['all', 'client', 'server'] as const).map((f) => (
                <button
                  key={f}
                  className={`${styles.toggleChip} ${logFilter === f ? styles.toggleChipActive : ''}`}
                  aria-pressed={logFilter === f}
                  onClick={() => setLogFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'client' ? 'Client' : 'Server'}
                </button>
              ))}
            </div>
            {visibleLogs.length === 0 ? (
              <p className={styles.empty}>
                {logLines.length === 0
                  ? 'Logs are empty. For some bugs, that silence is the clue.'
                  : `No ${logFilter} logs yet.`}
              </p>
            ) : (
              visibleLogs.map((line, i) => (
                <div
                  key={i}
                  className={`${styles.logLine} mono ${
                    line.level === 'error' ? styles.logError : line.level === 'warn' ? styles.logWarn : ''
                  }`}
                >
                  <span className={styles.logSource}>{line.source}</span>
                  <span>{line.text}</span>
                </div>
              ))
            )}
          </>
        )}

        {tab === 'network' && (
          <>
            <div className={styles.toggleRow} role="group" aria-label="Network view">
              {(['table', 'timeline'] as const).map((v) => (
                <button
                  key={v}
                  className={`${styles.toggleChip} ${netView === v ? styles.toggleChipActive : ''}`}
                  aria-pressed={netView === v}
                  onClick={() => setNetView(v)}
                >
                  {v === 'table' ? 'Table' : 'Timeline'}
                </button>
              ))}
            </div>
            {network.length === 0 ? (
              <p className={styles.empty}>No requests yet. Interact with the app to see traffic.</p>
            ) : netView === 'table' ? (
              network.map((entry, i) => (
                <div key={i}>
                  <button
                    className={`${styles.netRow} mono`}
                    onClick={() => setOpenRow(openRow === i ? null : i)}
                    aria-expanded={openRow === i}
                  >
                    <span>{entry.method}</span>
                    <span>{entry.url}</span>
                    <span className={entry.status >= 200 && entry.status < 300 ? styles.ok : styles.bad}>
                      {entry.status || '—'}
                    </span>
                    <span>{entry.durationMs}ms</span>
                  </button>
                  {openRow === i ? (
                    <pre className={`${styles.netBody} mono`}>
                      {entry.mocked ? '# served by the question\'s mock handlers\n' : ''}
                      {entry.requestBody ? `request:  ${entry.requestBody}\n` : ''}
                      {`response: ${entry.responseBody}`}
                    </pre>
                  ) : null}
                </div>
              ))
            ) : (
              <NetworkTimeline network={network} />
            )}
          </>
        )}

        {tab === 'terminal' && <TerminalPanel {...terminal} />}

        {tab === 'results' && <ResultCard result={result} />}

        {tab === 'solution' &&
          (solutionFiles === null ? (
            <p className={styles.empty}>
              Pass the question, or use &ldquo;I&rsquo;m stuck&rdquo; in the left panel, to unlock
              the reference solution.
            </p>
          ) : (
            solutionFiles.map((f) => (
              <div key={f.path}>
                <p className={styles.editorPath}>{f.path}</p>
                <pre className={`${styles.evidence} mono`}>{f.content}</pre>
              </div>
            ))
          ))}
      </div>
    </section>
  );
}

/**
 * Bars positioned by when each request STARTED, sized by how long it took,
 * so where a bar ENDS is when its response arrived. `#n` is arrival rank.
 * Rows are in start (send) order; when the #n labels do not read 1, 2, 3
 * top to bottom, responses arrived out of order. Plain absolutely
 * positioned divs -- no charting dependency.
 */
function NetworkTimeline({ network }: { network: NetworkEntry[] }) {
  const t0 = Math.min(...network.map((e) => e.startedAt));
  const t1 = Math.max(...network.map((e) => e.startedAt + e.durationMs));
  const span = Math.max(1, t1 - t0);
  const bySend = [...network].sort((a, b) => a.startedAt - b.startedAt);
  const byArrival = [...network].sort((a, b) => a.startedAt + a.durationMs - (b.startedAt + b.durationMs));
  return (
    <div>
      {bySend.map((entry, i) => (
        <div key={i} className={`${styles.timelineRow} mono`}>
          <span className={styles.timelineLabel}>
            #{byArrival.indexOf(entry) + 1} {entry.method} {entry.url}{' '}
            <span className={entry.status >= 200 && entry.status < 300 ? styles.ok : styles.bad}>
              {entry.status || '—'}
            </span>
          </span>
          <span className={styles.timelineTrack}>
            <span
              className={styles.timelineBar}
              style={{
                left: `${((entry.startedAt - t0) / span) * 100}%`,
                width: `${Math.max(0.5, (entry.durationMs / span) * 100)}%`,
              }}
              title={`${entry.durationMs}ms`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: `SolveScreen.tsx` — imports, prop type, constants**

The edits below are exact find/replace pairs against the current file.

a) Replace `import { DevToolsPanel, type BottomTab } from './DevToolsPanel';` with:

```tsx
import { DevToolsPanel, type BottomTab, type LogLine } from './DevToolsPanel';
```

b) Replace

```tsx
  type PreviewFrameHandle,
} from './PreviewFrame';
import type { SubmitResult } from './ResultCard';
```

with

```tsx
  type PreviewFrameHandle,
  type TerminalOutput,
} from './PreviewFrame';
import type { SubmitResult } from './ResultCard';
import type { TerminalLine } from './TerminalPanel';
```

c) Replace `import { bundlePreview, type PreviewBuildError } from '@/src/preview/bundler';` with:

```tsx
import { bundlePreview, type PreviewBuildError } from '@/src/preview/bundler';
import { bundleTests } from '@/src/preview/test-bundler';
import type { TestResult } from '@/src/testing/browser-test-harness';

/** Matches the Submit route's own executeTests() budget (20000ms). */
const TERMINAL_COMMAND_TIMEOUT_MS = 20000;
```

d) `LearnerQuestionProps` (line 24) is SolveScreen's own prop type, separate from `LearnerQuestion` in `load-question.ts` (`app/q/[slug]/page.tsx` casts one to the other), so Task 5 did not extend it. Replace its last line, `  files: LearnerFile[];\n}`, with:

```tsx
  files: LearnerFile[];
  gradingMode?: 'llm' | 'tests';
  testEntry?: string;
  terminalCommands?: { id: string; command: string; help: string }[];
}
```

- [ ] **Step 4: `SolveScreen.tsx` — state**

a) Replace `const [bottomTab, setBottomTab] = useState<BottomTab>('console');` with:

```tsx
  const [bottomTab, setBottomTab] = useState<BottomTab>('logs');
```

b) Replace `const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);` with:

```tsx
  const [logLines, setLogLines] = useState<LogLine[]>([]);
```

c) Replace `  const previewRef = useRef<PreviewFrameHandle>(null);` with:

```tsx
  const previewRef = useRef<PreviewFrameHandle>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [terminalBusy, setTerminalBusy] = useState(false);
  // Bookkeeping for the one in-flight terminal command (the input is
  // disabled while one runs, so there is never more than one):
  const busyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commandSeqRef = useRef(0); // source of runIds for terminal-run
  const activeRunIdRef = useRef<number | null>(null); // terminal-output we are waiting for
  const testsPendingRef = useRef(false); // test-results we are waiting for
  const terminalGenRef = useRef(0); // bumped on cancel; an await that resumes into a newer generation drops its result
```

- [ ] **Step 5: `SolveScreen.tsx` — log callbacks**

Replace

```tsx
  const onConsole = useCallback((line: ConsoleLine) => {
    setConsoleLines((prev) => [...prev, line]);
  }, []);
```

with

```tsx
  const onConsole = useCallback((line: ConsoleLine) => {
    setLogLines((prev) => [...prev, { ...line, source: 'client' }]);
  }, []);
  const onServerLog = useCallback((line: ConsoleLine) => {
    setLogLines((prev) => [...prev, { ...line, source: 'server' }]);
  }, []);
```

- [ ] **Step 6: `SolveScreen.tsx` — command lifecycle, `run()`, `reset()`, and the terminal handlers**

Replace everything from `  const run = useCallback(() => {` through the end of `reset` (the line `  }, [originals]);`) with the block below. It must sit **after** `onPreviewLoaded` and **after** the `files` memo (both already earlier in the file), because the new callbacks read `files`, `buildErrors` and `previewLoaded`.

How a command ends, and how `terminalBusy` can never stick:
- `startCommand` sets busy and arms a 20s timeout. The timeout calls `cancelCommand` and prints why.
- A result arriving (`onTerminalOutput` with the matching `runId`, or `onTestResults` while `testsPendingRef` is set) calls `finishCommand`.
- `run()` and `reset()` call `cancelCommand` first. That bumps `terminalGenRef` (so a `bundleTests` still awaiting drops its result), tears down any hidden test iframe, and clears busy. Without this, Run/Reset remounting the iframe mid-command would leave the terminal busy forever.
- `onTerminalNpmTest` wraps everything in `try`/`catch`/`finally`. If `bundleTests` rejects (harness fetch failure, esbuild init failure), the error is printed and busy is cleared, unless the code was actually sent to the hidden iframe.
- A question command isn't posted at all while the preview is still loading or failed to build. That would be a message to a frame with no listener, silently dropped.
- `npm test` has the same guard. Besides avoiding that same dead-message case, it ensures `previewLoaded` is already true before `startCommand` arms its 20s timeout -- `previewLoaded` only becomes true after `bundlePreview`'s own `ensureInitialised()` has already resolved, so `bundleTests`'s `await deps.init()` is then a no-op rather than a fresh, possibly-~20s cold esbuild-wasm init racing the same budget.
- `run()` no longer clears the terminal (see Review Focus): it prints a separator instead. It still clears Logs and Network, as before.
- `hasTests` follows the spec: `gradingMode === 'tests'` **and** `testEntry`.

```tsx
  const appendTerminal = useCallback((...lines: TerminalLine[]) => {
    setTerminalLines((prev) => [...prev, ...lines]);
  }, []);

  // Ends the current terminal command normally (its result arrived).
  const finishCommand = useCallback(() => {
    if (busyTimerRef.current !== null) clearTimeout(busyTimerRef.current);
    busyTimerRef.current = null;
    activeRunIdRef.current = null;
    testsPendingRef.current = false;
    setTerminalBusy(false);
  }, []);

  // Abandons the current terminal command (timeout, Run, Reset): any result
  // that still arrives for it afterwards is ignored, and a hidden test
  // iframe is torn down. Without this, terminalBusy could stay true forever
  // -- e.g. Run remounting the iframe mid-command, a command posted before
  // the new iframe generation attached its listener, or a test file
  // throwing before the harness could report.
  const cancelCommand = useCallback(() => {
    terminalGenRef.current += 1;
    previewRef.current?.cancelRunTests();
    finishCommand();
  }, [finishCommand]);

  const startCommand = useCallback(
    (label: string) => {
      setTerminalBusy(true);
      if (busyTimerRef.current !== null) clearTimeout(busyTimerRef.current);
      busyTimerRef.current = setTimeout(() => {
        cancelCommand();
        appendTerminal({
          kind: 'error',
          text: `${label}: no result after ${TERMINAL_COMMAND_TIMEOUT_MS / 1000}s -- gave up. Press Run and try again.`,
        });
      }, TERMINAL_COMMAND_TIMEOUT_MS);
    },
    [appendTerminal, cancelCommand],
  );

  const onTerminalOutput = useCallback(
    (output: TerminalOutput) => {
      if (output.runId !== activeRunIdRef.current) return; // stale: timed out or cancelled
      appendTerminal({ kind: output.ok ? 'output' : 'error', text: output.text });
      finishCommand();
    },
    [appendTerminal, finishCommand],
  );

  const onTestResults = useCallback(
    (tests: TestResult[]) => {
      if (!testsPendingRef.current) return; // stale: timed out or cancelled
      const passedCount = tests.filter((t) => t.passed).length;
      appendTerminal(
        ...tests.map(
          (t): TerminalLine => ({
            kind: t.passed ? 'output' : 'error',
            text: `${t.passed ? 'PASS' : 'FAIL'}  ${t.name}${t.error ? `\n      ${t.error}` : ''}`,
          }),
        ),
        {
          kind: passedCount === tests.length ? 'output' : 'error',
          text: `Tests: ${passedCount} passed, ${tests.length - passedCount} failed, ${tests.length} total`,
        },
      );
      finishCommand();
    },
    [appendTerminal, finishCommand],
  );

  const run = useCallback(() => {
    cancelCommand();
    appendTerminal({ kind: 'output', text: '--- preview restarted (npm run dev) ---' });
    setLogLines([]);
    setNetwork([]);
    setRightTab('preview');
    setPreviewLoaded(false);
    setRunToken((n) => n + 1);
  }, [appendTerminal, cancelCommand]);

  const reset = useCallback(() => {
    cancelCommand();
    appendTerminal({ kind: 'output', text: '--- files reset to the original broken code; preview restarted ---' });
    setContents(originals);
    setLogLines([]);
    setNetwork([]);
    setResult(null);
    setPreviewLoaded(false);
    setRunToken((n) => n + 1);
  }, [originals, appendTerminal, cancelCommand]);

  const hasTests = question.gradingMode === 'tests' && !!question.testEntry;

  const onTerminalNpmTest = useCallback(async () => {
    const testEntry = question.testEntry;
    if (!testEntry) return; // unreachable: parseCommand only offers npm test when hasTests
    if (buildErrors.length > 0) {
      appendTerminal({ kind: 'error', text: 'The app failed to build -- fix the build errors, then Run.' });
      return;
    }
    if (!previewLoaded) {
      appendTerminal({ kind: 'error', text: 'The preview is still starting -- wait for it to load, then try again.' });
      return;
    }
    // previewLoaded true means bundlePreview already called ensureInitialised()
    // and it resolved -- esbuild-wasm's cold init (documented up to ~20s) is
    // already paid for. Without this gate, npm test could call startCommand
    // (arming the 20s TERMINAL_COMMAND_TIMEOUT_MS) and then spend most or all
    // of that budget inside bundleTests's own await deps.init(), timing out on
    // a cold init rather than on a real hang.
    const gen = terminalGenRef.current;
    startCommand('npm test');
    testsPendingRef.current = true;
    let sent = false;
    try {
      // Bundled fresh from the CURRENT editor contents every time -- never
      // the last Run's bundle -- so an edit that was never Run is tested.
      const bundle = await bundleTests({ files, testEntry, handlersPath: question.handlersPath });
      if (gen !== terminalGenRef.current) return; // cancelled while bundling
      if (!bundle.ok) {
        appendTerminal(
          { kind: 'error', text: 'npm test: the test bundle failed to build' },
          ...bundle.errors.map((e): TerminalLine => ({ kind: 'error', text: `${e.file}:${e.line}:${e.column} — ${e.text}` })),
        );
        return;
      }
      const handle = previewRef.current;
      if (!handle) throw new Error('the preview is not mounted');
      handle.sendRunTests(bundle.code);
      sent = true; // still busy: onTestResults (or the timeout) ends it
    } catch (err) {
      if (gen === terminalGenRef.current) {
        appendTerminal({ kind: 'error', text: `npm test: ${(err as Error).message}` });
      }
    } finally {
      if (!sent && gen === terminalGenRef.current) finishCommand();
    }
  }, [
    files,
    question.testEntry,
    question.handlersPath,
    buildErrors.length,
    previewLoaded,
    startCommand,
    appendTerminal,
    finishCommand,
  ]);

  const onTerminalQuestionCommand = useCallback(
    (id: string, args: string) => {
      if (buildErrors.length > 0) {
        appendTerminal({ kind: 'error', text: 'The app failed to build -- fix the build errors, then Run.' });
        return;
      }
      if (!previewLoaded) {
        appendTerminal({ kind: 'error', text: 'The preview is still starting -- wait for it to load, then try again.' });
        return;
      }
      const runId = ++commandSeqRef.current;
      activeRunIdRef.current = runId;
      startCommand(id);
      previewRef.current?.sendTerminalCommand(id, args, runId);
    },
    [buildErrors.length, previewLoaded, appendTerminal, startCommand],
  );
```

- [ ] **Step 7: `SolveScreen.tsx` — pass the new props**

a) In the `<PreviewFrame … />` element, replace `              onLoaded={onPreviewLoaded}\n            />` with:

```tsx
              onLoaded={onPreviewLoaded}
              onServerLog={onServerLog}
              onTerminalOutput={onTerminalOutput}
              onTestResults={onTestResults}
            />
```

b) In the `<DevToolsPanel … />` element, replace

```tsx
            consoleLines={consoleLines}
            network={network}
            result={result}
            solutionFiles={solutionFiles}
          />
```

with

```tsx
            logLines={logLines}
            network={network}
            result={result}
            solutionFiles={solutionFiles}
            terminal={{
              lines: terminalLines,
              onLines: setTerminalLines,
              busy: terminalBusy,
              declaredCommands: question.terminalCommands ?? [],
              hasTests,
              files: question.files,
              originals,
              contents,
              onRun: run,
              onNpmTest: () => void onTerminalNpmTest(),
              onQuestionCommand: onTerminalQuestionCommand,
            }}
          />
```

(`files: question.files` on purpose: SolveScreen's own `files` memo has no `visibility`.)

- [ ] **Step 8: Add terminal / toggle / timeline CSS**

Append to `components/solve.module.css`. The `.mono` font class lives in `app/globals.css` (global, not in this module), so these classes only add layout and color. Every color is an existing token. `white-space: pre-wrap` on `.terminalLine` is required: `db:inspect`'s tables, repro reports and test failure messages are multi-line single entries.

```css
/* ---- Terminal ---- */

.terminal {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.terminalScrollback {
  flex: 1 1 auto;
  padding: var(--space-2) var(--space-3);
}

.terminalLine {
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.terminalInputLine {
  color: var(--text-muted);
}

.terminalError {
  color: var(--danger);
}

.terminalInputRow {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--border);
  color: var(--accent);
}

.terminalInput {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 12px;
}

.terminalInput:disabled {
  color: var(--text-faint);
}

/* ---- Logs filter / Network view toggles ---- */

.toggleRow {
  display: flex;
  gap: var(--space-1);
  padding-bottom: var(--space-2);
}

.toggleChip {
  padding: 2px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
}

.toggleChip:hover {
  color: var(--text);
}

.toggleChipActive {
  border-color: var(--accent-fill);
  color: var(--text);
}

.logSource {
  flex: 0 0 48px;
  color: var(--text-faint);
}

/* ---- Network timeline ---- */

.timelineRow {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: var(--space-2);
  align-items: center;
  padding: 3px 0;
  border-bottom: 1px solid var(--border);
}

.timelineLabel {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timelineTrack {
  position: relative;
  height: 10px;
  background: var(--surface-raised);
  border-radius: var(--radius-sm);
}

.timelineBar {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--accent-fill);
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 9: Verify TypeScript compiles and all tests pass**

Run: `npx tsc --noEmit && npx vitest run`
Expected: PASS, no type errors anywhere (this clears Task 3's known `SolveScreen.tsx` errors).

- [ ] **Step 10: Manual check in the browser (full live pass is Task 8)**

Run `npm run dev` and open one existing question, e.g. `swiggy-order-tracking`. It has a `handlersPath` but no `terminalHandlers`, so it is the case that would have broken under a named import. Confirm:
- the preview renders exactly as before;
- the Logs/Network/Terminal/Results/Solution tabs all render;
- `ls`, `cat src/App.jsx`, `clear`, `help`, `git diff` (prints `(no changes)`) and `npm run dev` (prints the separator and reloads the preview) all work;
- `npm test` prints `npm test: no test script found`;
- `npm run repro -- dup` prints `command not found: npm` (that question declares no such command).

No component test runs this wiring: `vitest.config.ts` only includes `components/**/*.test.ts`, there is no DOM test environment, and adding one would be a new dependency.

- [ ] **Step 11: Commit**

```bash
git add components/TerminalPanel.tsx components/DevToolsPanel.tsx components/SolveScreen.tsx components/solve.module.css
git commit -m "feat: add TerminalPanel, Logs filter and Network timeline, wire terminal into SolveScreen"
```

---

### Task 7: flipkart-cart-lab retrofit

Closes the real-reference fidelity gaps (terminal commands, order history, `DebugPanel.jsx` retirement) identified against the reference lab (`questions/Standard Flipkart Question/flipkart-cart-lab/`, gitignored, local only — its `scripts/repro.js` and `scripts/db.js` are what the commands below port).

**Files:**
- Modify: `questions/flipkart-cart-lab/question.json`
- Modify: `questions/flipkart-cart-lab/files/mock/handlers.js`
- Modify: `questions/flipkart-cart-lab/files/server-sim/cartHandlers.js`
- Modify: `questions/flipkart-cart-lab/reference/server-sim/cartHandlers.js`
- Modify: `questions/flipkart-cart-lab/files/src/api.js`
- Create: `questions/flipkart-cart-lab/files/src/pages/Orders.jsx`
- Modify: `questions/flipkart-cart-lab/files/src/components/Header.jsx`
- Modify: `questions/flipkart-cart-lab/files/src/App.jsx`
- Modify: `questions/flipkart-cart-lab/files/src/App.css`
- Delete: `questions/flipkart-cart-lab/files/src/components/DebugPanel.jsx`
- Modify: `questions/flipkart-cart-lab/files/notes/author-notes.md`

**Interfaces:**
- Consumes: `serverLog` imported as `'../__devtools__.js'` (Task 2 — resolvable in preview, Submit and `npm test`); the `terminalHandlers` export convention and `terminal-run` dispatch (Task 2); `terminalCommands` (Task 5).
- Produces: nothing consumed by later tasks — leaf retrofit; Task 8 verifies it live.

**Why the repro commands send real `fetch` requests.** They go through the same interceptor the app uses, like the reference's `scripts/repro.js`, which sends real HTTP requests. Calling `postItems` directly would bypass `fetch`: nothing would appear in the Network tab, so the Timeline check in Task 8 couldn't work, and `repro-stale` couldn't touch the client at all.

**Why `repro-stale` drives the real app.** Problem 1 is client-side: `CartContext.jsx`'s `mutate()` calls `setCart(next)` for whatever response arrives. A server-side call can't reproduce it. And in this simulation, responses always reach the client in the order the server computed them (the pricing delay sits *before* the write, not after it, unlike the reference's response-latency middleware), so a plain burst never shows Problem 1 either. So `repro-stale` clicks the real Add to cart button three times and uses `api.js`'s existing test-only `__setFetchOverride` hook (the one `tests/CartContext.test.jsx` already uses). Through that hook, the server handles the three adds in send order, and the responses are handed back to the app newest first: the reference lab's `LATENCY=lab` condition. It then reports the real badge's history next to the server's truth.

Verified end to end against the real app components (jsdom, real React, real interceptor): on the shipped code `repro-stale` reports `badge over time: 0 -> 3 -> 2 -> 1` and `BUG: … settled on 1, but the server holds 3`, and with the reference fix applied it reports `OK`. `repro-dup` shows 3 duplicate rows (1 row, quantity 3, when fixed). `repro-stock` shows 5 units (3 units plus two `HTTP 409` when fixed). The full test suite still gives 6/12 unfixed and 12/12 with the reference fix.

- [ ] **Step 1: `question.json` — `terminalCommands`, hint #1, `visibility`**

Add after the `"testEntry"` line:

```json
  "terminalCommands": [
    { "id": "repro-stale", "command": "npm run repro -- stale", "help": "reproduce the wrong cart badge (problem 1) -- drives the running app; log in first" },
    { "id": "repro-dup", "command": "npm run repro -- dup", "help": "reproduce the duplicate cart rows (problem 2)" },
    { "id": "repro-stock", "command": "npm run repro -- stock", "help": "reproduce overselling the Dumbbell Set (problem 3)" },
    { "id": "db-inspect", "command": "npm run db:inspect", "help": "print cart_items, duplicate lines and carts" }
  ],
```

Replace hint #1 (the one starting `"Open the app with ?debug=1 in the URL`) with:

```json
    "Log in, stay on the catalog, and type `npm run repro -- stale` in the Terminal tab. It taps Add to cart on the Yoga Mat three times and lets the responses come back newest-first, the way a slow network can. It prints the order the responses ARRIVED in and every number the header badge showed. Does the badge end on the cart's real total, or on whichever response happened to arrive last?",
```

In `visibility`, remove the line `"src/components/DebugPanel.jsx": "readonly",` and add `"src/pages/Orders.jsx": "readonly",` next to the other `src/pages/` entries.

- [ ] **Step 2: `mock/handlers.js` — imports**

Two existing lines change; do not add a second import of anything already imported (a duplicate binding is a `SyntaxError`).

Replace `import { createStore, PRODUCTS } from '../server-sim/db.js';` with:

```js
import { createStore, PRODUCTS, USERS } from '../server-sim/db.js';
```

Replace `import { postOrder } from '../server-sim/orderHandlers.js';` with:

```js
import { postOrder } from '../server-sim/orderHandlers.js';
import { __setFetchOverride } from '../src/api.js';
```

- [ ] **Step 3: `mock/handlers.js` — `GET /api/orders`**

Add this entry to the `handlers` array, directly after the existing `POST /api/orders` entry (before the closing `];`):

```js
  {
    method: 'GET',
    path: '/api/orders',
    handler: safe((req) => {
      const userId = auth(req);
      if (!userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
      const orders = store.orders
        .filter((o) => o.userId === userId)
        .slice()
        .reverse()
        .map((o) => ({ id: o.id, address: o.address, total: o.totalPaise, items: o.items }));
      return { status: 200, body: { orders } };
    }),
  },
```

(Field names match what `server-sim/orderHandlers.js` stores: `userId`, `address`, `totalPaise`, `items`.)

- [ ] **Step 4: `mock/handlers.js` — `terminalHandlers`**

Append to the end of the file. Notes:
- `burst()` records **arrival** order: each request pushes its own result the moment *it* resolves. `Promise.all`'s result array is in call order, so labelling it "arrival order" would hide the very thing these commands exist to show.
- Requests are 60ms apart, like the reference.
- Every scenario empties its demo user's cart first through real `PATCH … quantity 0` requests, as the reference does, and leaves the rows in place for `db:inspect`.
- Every scenario starts by reassigning the module-level `pricing` (`pricing = createPricingService(store);`), the same reset `__setPricingFailing` already performs. `BURST_DELAYS_MS[callIndex % 3]` (`server-sim/pricing.js`) advances across the store's whole life, not per burst, so without this a repro's delay pattern -- and therefore its arrival order and the exact counts Task 8 Steps 2, 5 and 6 expect -- would depend on how many `pricing.quote()` calls happened before it. This makes every run start from callIndex 0.
- The running app is **not** told about requests it didn't make. Its badge only changes through `repro-stale`, which goes through the app itself. The output says so, and says that Run starts over from a fresh store.

```js
// --- Terminal commands (the Terminal tab's `npm run repro -- <scenario>` and
// `npm run db:inspect`). Ports of the reference lab's scripts/repro.js and
// scripts/db.js. Every request below is a REAL fetch() through the same
// interceptor the app uses, so each one shows up in the Network tab
// (Timeline view shows arrival order) and in the Logs tab's Server filter,
// exactly like the reference's repro script sends real HTTP requests.
// Called lazily by src/preview/devtools-source.ts when a learner types the
// command -- never at module-evaluation time.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const YOGA_MAT = 43;
const DUMBBELL_SET = 49;

async function call(method, path, token, body) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}

async function loginAs(email) {
  const r = await call('POST', '/api/auth/login', null, { email, password: 'password123' });
  return r.body.token;
}

/** Same as the reference: start every scenario from an empty cart so earlier runs can't change the numbers. */
async function emptyCart(token) {
  const cart = (await call('GET', '/api/cart', token)).body;
  for (const id of new Set(cart.items.map((i) => i.productId))) {
    await call('PATCH', `/api/cart/items/${id}`, token, { quantity: 0 });
  }
}

/**
 * Fires `n` add-to-cart requests 60ms apart (a fast triple tap) and records
 * them in ARRIVAL order: each request pushes its own result the moment IT
 * resolves. (Promise.all's result array is in call order -- formatting that
 * as "arrival order" would hide the very thing this command exists to show.)
 */
async function burst(token, productId, n) {
  const jobs = [];
  const arrived = [];
  for (let i = 0; i < n; i++) {
    const sentAs = i + 1;
    jobs.push(
      call('POST', '/api/cart/items', token, { productId, quantity: 1 }).then((r) => {
        arrived.push({ ...r, sentAs });
      }),
    );
    await sleep(60);
  }
  await Promise.all(jobs);
  return arrived;
}

function arrivalLines(arrived) {
  return arrived.map(
    (r, i) =>
      `  arrived #${i + 1}: tap ${r.sentAs} -> HTTP ${r.status}` +
      (r.body.version !== undefined
        ? `, cart v${r.body.version}, itemCount ${r.body.itemCount}, ${r.body.items.length} line(s)`
        : `, ${r.body.error}`),
  );
}

function cartIdFor(email) {
  const user = USERS.find((u) => u.email === email);
  return store.carts.find((c) => c.userId === user.id)?.id;
}

function rowsFor(email, productId) {
  const cartId = cartIdFor(email);
  return store.cartItems.filter((ci) => ci.cartId === cartId && ci.productId === productId);
}

function table(columns, rows) {
  if (rows.length === 0) return '  (no rows)';
  const cells = [columns, ...rows.map((r) => columns.map((c) => String(r[c] ?? '')))];
  const widths = columns.map((_, i) => Math.max(...cells.map((row) => row[i].length)));
  return cells.map((row) => '  ' + row.map((cell, i) => cell.padEnd(widths[i])).join('  ')).join('\n');
}

const LEFT_IN_PLACE =
  'The rows from this run were left in the store on purpose -- look at them with: npm run db:inspect\n' +
  "The running app's badge is not told about requests it didn't make; press Run to start over from a fresh store.";

async function reproStale() {
  // Problem 1 lives in the CLIENT (CartContext's mutate), so this one drives
  // the real running app: it clicks the real Add to cart button and watches
  // the real badge. A direct server-side call would never touch the client.
  //
  // pricing's BURST_DELAYS_MS[callIndex % 3] (server-sim/pricing.js) advances
  // across the store's WHOLE life, not per burst -- without resetting it here,
  // this repro's delay pattern (and therefore its arrival order) depends on
  // how many pricing.quote() calls happened before it, including from earlier
  // repro runs or normal app use. Recreating it gives every run the same
  // 800/450/100ms sequence starting from callIndex 0.
  pricing = createPricingService(store);

  const button = document.querySelector(`[data-testid="add-to-cart-${YOGA_MAT}"]`);
  const badge = document.querySelector('[data-testid="cart-count"]');
  const loggedIn = [...document.querySelectorAll('.site-header button')].some((b) =>
    b.textContent.startsWith('Logout'),
  );
  if (!button || !badge || !loggedIn) {
    throw new Error(
      'npm run repro -- stale drives the running app: log in, stay on the catalog page (Yoga Mat visible), then run it again.',
    );
  }

  const token = await loginAs('asha@example.com');
  await emptyCart(token);

  // A simulated slow network, the same condition as the reference lab's
  // LATENCY=lab mode: the server handles the three adds one after another
  // (v1, v2, v3 -- so Problem 2's race cannot interfere here), but their
  // responses are handed back to the app NEWEST FIRST. Uses api.js's
  // existing test-only __setFetchOverride hook (the same one
  // tests/CartContext.test.jsx uses); restored in `finally`.
  const held = [];
  let serverQueue = Promise.resolve();
  let sent = 0;
  __setFetchOverride((path, init) => {
    if (!(init && init.method === 'POST' && path === '/api/cart/items')) return fetch(path, init);
    const sentAs = ++sent;
    const authed = { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } };
    const response = serverQueue.then(() => fetch(path, authed));
    serverQueue = response.then(
      () => {},
      () => {},
    );
    return new Promise((resolve, reject) => held.push({ sentAs, response, resolve, reject }));
  });

  const badgeHistory = [badge.textContent];
  const observer = new MutationObserver(() => {
    if (badge.textContent !== badgeHistory[badgeHistory.length - 1]) badgeHistory.push(badge.textContent);
  });
  observer.observe(badge, { childList: true, characterData: true, subtree: true });

  const arrived = [];
  try {
    for (let i = 0; i < 3; i++) {
      button.click();
      await sleep(60);
    }
    for (let waited = 0; held.length < 3; waited += 20) {
      if (waited > 5000) throw new Error('the app did not send 3 add-to-cart requests -- is the Yoga Mat button enabled?');
      await sleep(20);
    }
    for (const h of [...held].reverse()) {
      const res = await h.response;
      arrived.push({ sentAs: h.sentAs, status: res.status, body: await res.clone().json() });
      h.resolve(res);
      await sleep(150); // let React render this response before the next one lands
    }
  } finally {
    __setFetchOverride(null);
    observer.disconnect();
  }

  const server = (await call('GET', '/api/cart', token)).body;
  const shown = badge.textContent;
  return [
    'Problem 1: 3 rapid adds of Yoga Mat (Asha), responses delivered newest-first',
    ...arrivalLines(arrived),
    `  badge over time: ${badgeHistory.join(' -> ')}`,
    `  server cart now: v${server.version}, itemCount ${server.itemCount}`,
    String(server.itemCount) === shown
      ? `  OK: the badge settled on ${shown}, matching the server.`
      : `  BUG: the badge settled on ${shown}, but the server holds ${server.itemCount} -- an older response overwrote a newer one.`,
  ].join('\n');
}

async function reproDup() {
  pricing = createPricingService(store); // see reproStale's comment: resets BURST_DELAYS_MS to callIndex 0
  const token = await loginAs('asha@example.com');
  await emptyCart(token);
  const arrived = await burst(token, YOGA_MAT, 3);
  const rows = rowsFor('asha@example.com', YOGA_MAT);
  const cart = (await call('GET', '/api/cart', token)).body;
  return [
    'Problem 2: 3 rapid adds of Yoga Mat (Asha, stock 5)',
    ...arrivalLines(arrived),
    'cart_items rows for Yoga Mat (expected: ONE row with quantity 3):',
    table(['id', 'cartId', 'productId', 'quantity'], rows),
    `GET /api/cart (what a page refresh shows): ${cart.items.length} line(s), itemCount ${cart.itemCount}`,
    LEFT_IN_PLACE,
  ].join('\n');
}

async function reproStock() {
  pricing = createPricingService(store); // see reproStale's comment: resets BURST_DELAYS_MS to callIndex 0
  const token = await loginAs('ravi@example.com');
  await emptyCart(token);
  const arrived = await burst(token, DUMBBELL_SET, 5);
  const total = rowsFor('ravi@example.com', DUMBBELL_SET).reduce((n, r) => n + r.quantity, 0);
  return [
    'Problem 3: 5 rapid adds of Dumbbell Set (Ravi, stock 3)',
    ...arrivalLines(arrived),
    `Units of Dumbbell Set in the cart: ${total} (stock is 3, so at most 3 may be accepted; the rest should get HTTP 409)`,
    LEFT_IN_PLACE,
  ].join('\n');
}

function dbInspect() {
  const items = [...store.cartItems]
    .sort((a, b) => a.id - b.id)
    .map((ci) => {
      const cart = store.carts.find((c) => c.id === ci.cartId);
      const user = USERS.find((u) => u.id === cart?.userId);
      const product = store.products.find((p) => p.id === ci.productId);
      return { id: ci.id, user: user?.email, productId: ci.productId, name: product?.name, quantity: ci.quantity, stock: product?.stock };
    });
  const groups = new Map();
  for (const ci of store.cartItems) {
    const key = `${ci.cartId}:${ci.productId}`;
    const g = groups.get(key) ?? { cartId: ci.cartId, productId: ci.productId, rows: 0, totalQty: 0 };
    g.rows += 1;
    g.totalQty += ci.quantity;
    groups.set(key, g);
  }
  const duplicates = [...groups.values()].filter((g) => g.rows > 1);
  return [
    'cart_items  (one row per product per cart is what we expect)',
    table(['id', 'user', 'productId', 'name', 'quantity', 'stock'], items),
    '',
    'rows per (cart, product)  -> anything above 1 is a duplicate line',
    table(['cartId', 'productId', 'rows', 'totalQty'], duplicates),
    '',
    'carts',
    table(['id', 'userId', 'version'], store.carts),
  ].join('\n');
}

export const terminalHandlers = {
  'repro-stale': reproStale,
  'repro-dup': reproDup,
  'repro-stock': reproStock,
  'db-inspect': dbInspect,
};

```

- [ ] **Step 5: `server-sim/cartHandlers.js` (shipped, buggy) — `serverLog`**

Add the import below the file's opening comment (above `const MAX_PER_ADD = 10;`):

```js
import { serverLog } from '../__devtools__.js';
```

and four calls inside `postItems`:

```js
  // after: const existingQtyAtReadTime = existing?.quantity ?? 0;
  serverLog('info', `postItems: read cart ${cart.id} -> ${existingQtyAtReadTime} of product ${productId}`);

  // after: if (!product) return { status: 404, body: { error: 'NOT_FOUND' } };
  serverLog('info', `postItems: pricing replied for product ${productId} (stock ${product.stock})`);

  // first line INSIDE: if (nextQty > product.stock) {
    serverLog('warn', `postItems: rejected product ${productId}, ${nextQty} > stock ${product.stock} (409)`);

  // after: store.bumpVersion(cart.id);  (cart is the same object bumpVersion mutates)
  serverLog('info', `postItems: wrote product ${productId} quantity ${nextQty}, cart ${cart.id} now v${cart.version}`);
```

The first three are the three moments the race lives between: the stale read, the await, the write. Filter Logs to "Server" during `npm run repro -- dup` and you see three reads of `0` before any write.

- [ ] **Step 6: `reference/server-sim/cartHandlers.js` (View solution) — same `serverLog` calls**

So the revealed solution reads like the learner's own working file. Same import, same four messages, placed at the equivalent points of the fixed flow. There the read happens **after** the await, which is the fix, and the log order shows it:

```js
import { serverLog } from '../__devtools__.js';

  // after: if (!product) return { status: 404, body: { error: 'NOT_FOUND' } };
  serverLog('info', `postItems: pricing replied for product ${productId} (stock ${product.stock})`);

  // after: const nextQty = (existing?.quantity ?? 0) + qty;
  serverLog('info', `postItems: read cart ${cart.id} -> ${existing?.quantity ?? 0} of product ${productId}`);

  // first line INSIDE: if (nextQty > product.stock) {
    serverLog('warn', `postItems: rejected product ${productId}, ${nextQty} > stock ${product.stock} (409)`);

  // after: store.bumpVersion(cart.id);
  serverLog('info', `postItems: wrote product ${productId} quantity ${nextQty}, cart ${cart.id} now v${cart.version}`);
```

- [ ] **Step 7: `src/api.js` — remove the dead `?debug=1` event hook**

`onApiEvent` is used only by `DebugPanel.jsx` (checked: no other importer), which this task deletes. Remove:

```js
// Tiny event hook used only by the ?debug=1 panel (components/DebugPanel.jsx).
const listeners = new Set();
let sentCounter = 0;
export const onApiEvent = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const emit = (e) => listeners.forEach((fn) => fn(e));
```

In `api()`, delete these three lines:

```js
  const sentAs = ++sentCounter;
  const startedAt = performance.now();
  emit({ phase: 'sent', sentAs, method, path });
```

and this call:

```js
  emit({
    phase: 'done',
    sentAs,
    method,
    path,
    status: res.status,
    ms: Math.round(performance.now() - startedAt),
    version: data.version,
    itemCount: data.itemCount,
    lines: data.items?.length,
  });
```

Keep `__setFetchOverride`, and update the first line of its comment from `// Test-only hook (used by tests/CartContext.test.jsx) to control exactly when` to:

```js
// Test-only hook (used by tests/CartContext.test.jsx, and by the
// `npm run repro -- stale` terminal command in mock/handlers.js) to control exactly when
```

- [ ] **Step 8: Port `Orders.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { api, rupees } from '../api.js';

export function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    api('GET', '/api/orders').then((r) => setOrders(r.orders)).catch(() => setOrders([]));
  }, []);
  if (!orders) return null;
  if (orders.length === 0) return <p className="card">No orders yet.</p>;
  return (
    <ul className="orders">
      {orders.map((o) => (
        <li key={o.id} className="card">
          <h3>Order #{o.id} · {rupees(o.total)}</h3>
          <p className="muted">{o.address}</p>
          <ul>{o.items.map((i, n) => <li key={n}>{i.quantity} × {i.name}</li>)}</ul>
        </li>
      ))}
    </ul>
  );
}
```

(Identical to the reference's `client/src/pages/Orders.jsx`. `api()`/`rupees()` are exported from this question's `src/api.js`.)

- [ ] **Step 9: Header nav link, App routing, CSS, delete `DebugPanel`**

`src/components/Header.jsx` — inside `<nav>`, before the `{user ? (` Login/Logout block, add:

```jsx
        {user && (
          <button className="link" onClick={() => navigate('orders')}>
            Orders
          </button>
        )}
```

`src/App.jsx` — the result should be exactly:

```jsx
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NavProvider, useNav } from './context/NavContext.jsx';
import { Header } from './components/Header.jsx';
import { Login } from './pages/Login.jsx';
import { Catalog } from './pages/Catalog.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { Orders } from './pages/Orders.jsx';

function Page() {
  const { page } = useNav();
  const { ready } = useAuth();
  if (!ready) return null;
  if (page === 'login') return <Login />;
  if (page === 'cart') return <CartPage />;
  if (page === 'checkout') return <Checkout />;
  if (page === 'orders') return <Orders />;
  return <Catalog />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavProvider>
        <CartProvider>
          <div className="app-shell">
            <Header />
            <main>
              <Page />
            </main>
          </div>
        </CartProvider>
      </NavProvider>
    </AuthProvider>
  );
}
```

(Removed: the `useEffect`/`useState` import (now unused), the `DebugPanel` import, `DEBUG_KEY`, `useDebugFlag`, `const debug = useDebugFlag();` and `{debug ? <DebugPanel /> : null}`. Added: the `Orders` import and route.)

`src/App.css` — delete the whole `/* ---- Debug panel (?debug=1) ---- */` section (from that comment to the end of the file: `.debug-panel`, `.debug-head`, `.debug-panel .link`, `.debug-badge`, `.debug-panel table`, `.debug-panel th, .debug-panel td`) and append the reference's orders list style:

```css
.orders {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}
```

Delete `src/components/DebugPanel.jsx`.

- [ ] **Step 10: Update `author-notes.md`**

Append:

```markdown

## Platform fidelity notes (2026-11-03 retrofit)

- `ProductPage.jsx` from the reference lab is a deliberate drop, not a gap: the
  catalog's own Add-to-cart already exercises every bug class this question
  teaches (races/duplicates/oversell), and a detail page adds surface area with
  no pedagogical return.
- `?debug=1`/`DebugPanel.jsx` (the reference's Request-log panel) is retired in
  favor of the platform's Terminal tab, Logs tab (Server filter) and Network
  tab (Timeline view), which generalize the same capability to every question.
- `npm run repro -- dup|stock` send real fetch() requests through the same
  interceptor the app uses (so they show in Network and Logs), 60ms apart, and
  report responses in true arrival order -- a port of the reference's
  scripts/repro.js.
- `npm run repro -- stale` cannot be a server-side burst here: in this
  simulation the pricing delay sits before the write, so responses always reach
  the client in the order the server produced them, and a plain burst never
  shows Problem 1 (the reference delays the RESPONSE instead, via its
  LATENCY=lab middleware). The command therefore drives the real app (clicks the
  real button, watches the real badge) and uses api.js's `__setFetchOverride`
  to hand responses back newest-first -- the same network condition the
  reference simulates and that tests/CartContext.test.jsx uses.
- Known consequence of the same difference, NOT fixed by this retrofit: a
  learner tapping by hand in the live preview will generally not see Problem 1
  at all, and with only the reference CartContext fix (last-SENT request wins)
  a hand-tapped burst can settle on the oldest snapshot, because the server's
  completion order is the reverse of send order. Fixing that means moving the
  simulated latency from pricing.js to the response (like the reference) and
  re-validating the whole test suite -- a separate change.
```

- [ ] **Step 11: Confirm Submit still grades the question correctly**

Run: `npx vitest run src/grading/ src/questions/`
Expected: PASS. Then confirm the real flipkart suite still gives the documented split through the real Submit pipeline with a one-off script (not committed):

```bash
cat > /tmp/flipkart-suite.mts <<'EOF'
import { readDirFiles } from './src/files/read-dir-files';
import { executeTests } from './src/grading/execute-tests';
const dir = 'questions/flipkart-cart-lab';
let files = await readDirFiles(`${dir}/files`);
if (process.argv[2] === 'ref') {
  const m = new Map(files.map((f) => [f.path, f]));
  for (const r of await readDirFiles(`${dir}/reference`)) m.set(r.path, r);
  files = [...m.values()];
}
const r = await executeTests(files, 'tests/all.test.js', 'mock/handlers.js', 20000);
console.log(r.status === 'ran' ? `${r.tests.filter((t) => t.passed).length}/${r.tests.length} passed` : JSON.stringify(r));
process.exit(0);
EOF
cp /tmp/flipkart-suite.mts ./flipkart-suite.mts && npx tsx flipkart-suite.mts && npx tsx flipkart-suite.mts ref; rm flipkart-suite.mts
```

Expected: `6/12 passed` then `12/12 passed` (a `build_failed` here means a bundler is missing the `__devtools__.js` registration from Task 2). The explicit `process.exit(0)` is needed because of `execute-tests.ts`'s documented MessageChannel leak, which otherwise keeps the process alive.

- [ ] **Step 12: Commit**

```bash
git add -A questions/flipkart-cart-lab/
git commit -m "feat: retrofit flipkart-cart-lab with terminal commands, order history, retire DebugPanel"
```

---

### Task 8: Live browser verification

No new automated tests here. This is the project's established method for anything preview-iframe-shaped, and **it is the only place several things in this plan get checked at all**: esbuild-wasm actually bundling every question with the new `__devtools__.js` injection, the hidden test iframe, and the real browser message flow. Follow the checklist against a running `npm run dev`, in a tab that has not used the app before (so esbuild-wasm initialises cold), and record pass/fail per step.

**Files:** none (verification only).

**Interfaces:** consumes everything from Tasks 1-7.

- [ ] **Step 0: Check whether the embedded preview can authenticate at all**

Before anything else, in the embedded preview (not the popup), open flipkart-cart-lab, log in, and add an item to the cart. If it fails with "Something went wrong" and Network shows a `401` on `/api/cart/items`: the preview iframe is sandboxed without `allow-same-origin`, so `localStorage` throws there and `api.js` silently swallows it, meaning the login token never actually persists. This is a pre-existing issue in the question, not something this plan introduces or needs to fix -- **but it changes how to read every later step that adds to the cart by hand**:
- If this fails: every later "add to cart by hand" check in this task (Steps 3 and 7) cannot pass in the embedded preview regardless of whether this plan's own code is correct, because the app itself can't complete an authenticated request there. Read those steps' hand-add checks against the "Open in new tab" popup (a normal, unsandboxed origin) instead, and record this finding separately -- stop here, don't patch api.js or the sandbox to work around it.
- If this succeeds: proceed normally; Steps 3 and 7 can use the embedded preview as written.

Repeat the same check in the popup tab to confirm it is a normal origin there (no `allow-same-origin` issue), so Step 7's fallback path is known-good before you need it.

- [ ] **Step 1: Every existing (non-flipkart) question still bundles and renders**

Open each of the other five questions: `swiggy-order-tracking`, `makemytrip-flight-search`, `taskforge-board`, `flipkart-cart`, `zomato-restaurant-discovery`. All five have a `handlersPath`, so all five now get `__devtools__.js` injected while their `mock/handlers.js` exports no `terminalHandlers`. That is exactly the case the original named-import design broke at bundle time, and no automated test runs real esbuild-wasm on these files. For each one, confirm:
- the preview renders and no build error banner appears;
- the app's own mocked requests still show in Network;
- `npm test` prints `npm test: no test script found`;
- `ls`, `cat`, `git diff`, `clear` and `help` work;
- Submit's existing `graded` flow is unchanged.

- [ ] **Step 2: flipkart-cart-lab — terminal commands**

Open flipkart-cart-lab. Type `npm run repro -- stale` before logging in: it must fail cleanly with the "log in, stay on the catalog page" message, and the terminal must accept the next command. Log in as Asha and stay on the catalog. Then in the Terminal tab:
- `npm run repro -- stale`: the header badge visibly steps down (3, then 2, then 1), and the report ends with `BUG: the badge settled on 1, but the server holds 3`.
- `npm run repro -- dup`, three times in a row: the same shape every time (arrival order `tap 3, tap 2, tap 1`, and three `cart_items` rows of quantity 1). It does not depend on manual timing.
- `npm run repro -- stock`: 5 units of Dumbbell Set, all `HTTP 200`.
- `npm run db:inspect`: prints the rows the repros just left, plus the duplicate-lines table.
- `help`: lists all four question commands plus the platform ones.

- [ ] **Step 3: `npm test` — real, fast, unscored, isolated from the live app**

Run `npm test`. Confirm:
- it reports `6 passed, 6 failed` on unfixed code, with real assertion messages (e.g. `expected 3 to be 1`);
- it finishes in seconds. If it is noticeably slow (well over ~10s), suspect browser timer throttling of the `display: none` cross-origin iframe: change the hidden iframe's style in `PreviewFrame.tsx` to `{ position: 'fixed', width: 1, height: 1, left: 0, bottom: 0, opacity: 0, pointerEvents: 'none', border: 0 }`, re-time it, and record which one shipped;
- the live app is unaffected afterwards. This does NOT depend on the embedded preview's own login working (Step 0 may have found it doesn't), so check it without a hand add-to-cart: run `npm run db:inspect` right before and right after `npm test` and confirm the printed rows are identical (the test run's throwaway store never touched the live one); run `npm run repro -- dup` right after `npm test` finishes and confirm it behaves exactly as in Step 2 (same arrival order, same duplicate-row shape), proving the live `mock/handlers.js` state and its `pricing` instance are untouched; and confirm the Network/Logs tabs show none of the test run's requests. Also start `npm test`, click Run mid-flight to cancel it, and confirm nothing from the cancelled run leaks into either tab afterward -- this is the check for the hidden-iframe message-isolation fix;
- `scored`, the Results tab and the `gaveUp` flag are untouched.

Run `npm test` twice back to back: the input stays disabled until the first finishes. Edit `server-sim/cartHandlers.js` and run `npm test` **without** clicking Run: the result reflects the edit. Apply the full reference fix (the three files under `reference/`) and confirm `12 passed, 0 failed`, still without clicking Submit.

- [ ] **Step 4: Busy state always recovers**

Start `npm run repro -- dup` and immediately click Run. The terminal prints the restart separator, becomes usable again, and the late repro output does **not** appear. Do the same with `npm test` and Reset.

- [ ] **Step 5: Logs tab — Client/Server split**

Run `npm run repro -- dup`, switch to Logs, choose Server, and confirm three `postItems: read … -> 0 of product 43` lines appear before any `wrote` line. Choose Client and confirm only the React app's own `console.*` output appears. Switch filters while a repro is still running: no lines go missing.

- [ ] **Step 6: Network tab — Timeline toggle**

After `npm run repro -- dup`, switch Network to Timeline. The three `POST /api/cart/items` rows are in send order (staggered 60ms starts), their bars end out of order, and the `#n` arrival labels read `#3, #2, #1` top to bottom. This matches the repro's own `arrived #` lines.

- [ ] **Step 7: Order history**

If Step 0 found the embedded preview can't authenticate, do this step in the "Open in new tab" popup instead (Step 0 already confirmed that's a normal origin there) -- the embedded preview cannot pass it regardless of whether this task's own code is correct, so trying it there again tells you nothing new. Log in, add an item through the UI, check out with a valid address, and confirm the order appears under the new Orders nav link.

- [ ] **Step 8: `git diff`**

Make two separate one-line edits in `server-sim/cartHandlers.js`, run `git diff`, and confirm two `@@` hunks with only the changed lines. A file you didn't touch doesn't appear, and with no edits at all it prints `(no changes)`.

- [ ] **Step 9: Submit remains independent**

Click Submit on unfixed code and confirm the existing `tests_ran` Results rendering is unchanged (`6 passed, 6 failed`, scored as before), with no `build_failed`. That proves the `__devtools__.js` registration in `execute-tests.ts`.

- [ ] **Step 10: Full test suite + typecheck, one last time**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS, everything green.
