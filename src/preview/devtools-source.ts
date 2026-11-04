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
