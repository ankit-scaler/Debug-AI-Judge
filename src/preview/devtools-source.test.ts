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
