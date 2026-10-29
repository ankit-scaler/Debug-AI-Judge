/**
 * The fake-API interceptor (decision D7), as source text.
 *
 * It has to be compiled *into the learner's bundle* rather than live in our app
 * bundle, because it must patch `fetch` inside the preview iframe's realm before
 * the learner's app module evaluates. Keeping it as a string is the price of that.
 *
 * Known gap: XMLHttpRequest is not intercepted. Every question we have uses
 * fetch, and a half-tested XHR shim is worse than an honest warning, so a
 * question that uses XHR logs a clear message instead of silently hitting the
 * network. Implement it when a question needs it.
 */
export const INTERCEPTOR_MODULE = `
import { handlers } from './__HANDLERS__';

function post(type, payload) {
  try {
    parent.postMessage({ source: 'debuglab-preview', type, payload }, '*');
  } catch (e) {}
}

function pathOf(url) {
  try {
    return new URL(url, location.origin).pathname;
  } catch (e) {
    return String(url);
  }
}

function findHandler(method, url) {
  const path = pathOf(url);
  return (handlers || []).find(
    (h) => String(h.method).toUpperCase() === String(method).toUpperCase() && h.path === path,
  );
}

const realFetch = globalThis.fetch ? globalThis.fetch.bind(globalThis) : null;

globalThis.fetch = async function (input, init) {
  const url = typeof input === 'string' ? input : input && input.url;
  const method =
    (init && init.method) || (input && typeof input !== 'string' && input.method) || 'GET';
  const requestBody = (init && init.body) || null;
  const startedAt = Date.now();

  const handler = findHandler(method, url);

  if (!handler) {
    post('network', {
      method,
      url,
      status: 0,
      mocked: false,
      requestBody: typeof requestBody === 'string' ? requestBody : null,
      responseBody: 'No mock handler matched this request.',
      durationMs: 0,
    });
    if (!realFetch) throw new Error('No mock handler for ' + method + ' ' + url);
    return realFetch(input, init);
  }

  const result = await handler.handler({
    url,
    method,
    body: requestBody,
    headers: (init && init.headers) || {},
  });

  const status = typeof result.status === 'number' ? result.status : 200;
  const text =
    typeof result.body === 'string' ? result.body : JSON.stringify(result.body ?? null);

  post('network', {
    method,
    url,
    status,
    mocked: true,
    requestBody: typeof requestBody === 'string' ? requestBody : null,
    responseBody: text,
    durationMs: Date.now() - startedAt,
  });

  return new Response(text, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

if (typeof XMLHttpRequest !== 'undefined') {
  const RealXHR = XMLHttpRequest;
  globalThis.XMLHttpRequest = function () {
    console.warn(
      'This app uses XMLHttpRequest, which the Debugging Lab preview does not mock yet. ' +
        'The request will not be intercepted and will not appear in the Network panel.',
    );
    return new RealXHR();
  };
}
`;
