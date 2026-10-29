/**
 * Coordinates two signals that can arrive in either order -- "the iframe has
 * loaded and is listening" and "the bundle is ready" -- and guarantees `send`
 * is called exactly once per generation, with the latest payload, only once
 * both signals have arrived for that SAME generation.
 *
 * Generic in the payload type: originally string-only (just the bundled JS),
 * widened to carry `{ code, css }` once CSS needed its own channel (see
 * bundler.ts -- esbuild emits CSS as a second, separate output file, not
 * inlined into the JS). The coordination logic has never cared what shape
 * the payload is, only that it is delivered exactly once at the right time.
 *
 * Extracted after a real regression: the previous implementation tracked this
 * with React state (`frameReady`) plus a ref for the pending code, coordinated
 * across two separate effects. Removing `frameReady` from one effect's
 * dependency array (to fix a different bug -- a stale ready flag from the
 * previous iframe generation) silently broke the ready-then-code ordering,
 * because a ref write triggers no re-render and nothing else re-checked
 * readiness once the bundle finished. The result was a blank preview with no
 * error whenever the iframe loaded faster than the bundle -- which it
 * usually does. A plain, synchronous, fully-tested class has no render cycle
 * to depend on, so this class of bug cannot recur here.
 */
export class ReadyGate<T> {
  private ready = false;
  private pending: T | null = null;

  constructor(private readonly send: (payload: T) => void) {}

  /** Call at the start of a new generation (e.g. a new iframe just mounted). */
  reset(): void {
    this.ready = false;
    this.pending = null;
  }

  /** Call when the current generation's iframe announces it is listening. */
  markReady(): void {
    this.ready = true;
    this.trySend();
  }

  /** Call when a new bundle is ready to run. */
  setPayload(payload: T): void {
    this.pending = payload;
    this.trySend();
  }

  private trySend(): void {
    if (!this.ready || this.pending === null) return;
    const payload = this.pending;
    this.pending = null;
    this.send(payload);
  }
}
