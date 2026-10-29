import * as esbuild from 'esbuild';
import {
  loaderFor,
  resolveRelative,
  stripNamespace,
  stripNamespaceEverywhere,
  VIRTUAL_NAMESPACE,
} from '../bundling/resolve';
import type { SubmittedFile } from '../types';

export interface BuildError {
  file: string;
  line: number;
  column: number;
  text: string;
}

export type BuildResult = { ok: true } | { ok: false; errors: BuildError[] };

export async function buildCheck(
  files: SubmittedFile[],
  entry: string,
): Promise<BuildResult> {
  const map = new Map(files.map((f) => [f.path, f.content]));
  if (!map.has(entry)) {
    return { ok: false, errors: [{ file: entry, line: 0, column: 0, text: `Entry file "${entry}" is missing` }] };
  }

  const virtual: esbuild.Plugin = {
    name: 'debuglab-virtual',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === 'entry-point') return { path: args.path, namespace: VIRTUAL_NAMESPACE };
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
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      write: false,
      // Required even with write:false: without an output path esbuild refuses to
      // emit a second output file, so any JS importing CSS is a hard error.
      // Nothing is written to disk.
      outdir: 'out',
      logLevel: 'silent',
      format: 'esm',
      jsx: 'automatic',
      plugins: [virtual],
    });
    return { ok: true };
  } catch (err) {
    const messages = (err as esbuild.BuildFailure).errors ?? [];
    return {
      ok: false,
      errors: messages.map((m) => ({
        // esbuild prefixes paths with the plugin namespace ("virtual:src/App.jsx").
        // Learners must see their own path, not our bundler internals.
        file: stripNamespace(m.location?.file) ?? entry,
        line: m.location?.line ?? 0,
        column: m.location?.column ?? 0,
        text: stripNamespaceEverywhere(m.text),
      })),
    };
  }
}
