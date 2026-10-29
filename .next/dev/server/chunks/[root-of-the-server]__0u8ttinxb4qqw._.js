module.exports = [
(()=>{"use strict";return[
"[project]/app/api/attempts/[slug]/submit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$grade$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/grade.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$questions$2f$load$2d$question$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/questions/load-question.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$local$2d$deps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/local-deps.ts [app-route] (ecmascript)");
;
;
;
async function POST(request, ctx) {
    const { slug } = await ctx.params;
    let submitted;
    try {
        const body = await request.json();
        if (!Array.isArray(body.files)) throw new Error('files must be an array');
        submitted = body.files;
    } catch  {
        return Response.json({
            status: 'invalid_submission',
            errors: [
                'Malformed request body'
            ]
        }, {
            status: 400
        });
    }
    const loaded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$questions$2f$load$2d$question$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadQuestion"])(slug);
    const deps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$local$2d$deps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["localGradeDeps"])();
    const outcome = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$grade$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["grade"])({
        questionId: loaded.meta.id,
        questionVersion: loaded.meta.version,
        entry: loaded.meta.entry,
        scenario: loaded.meta.scenario,
        symptom: loaded.meta.symptom,
        rubric: loaded.meta.rubric,
        referenceFix: loaded.referenceFix,
        questionFiles: loaded.questionFiles,
        submitted
    }, deps);
    if (outcome.status === 'graded') {
        const byId = new Map(loaded.meta.rubric.map((c)=>[
                c.id,
                c.description
            ]));
        const response = {
            status: 'graded',
            passed: outcome.verdict.passed,
            cacheHit: outcome.cacheHit,
            scored: outcome.scored,
            // Criterion text is revealed only after a submission, never in the question
            // payload. Deliberate: the result card is useless without it.
            criteria: outcome.verdict.criteria.map((c)=>({
                    id: c.id,
                    description: byId.get(c.id) ?? c.id,
                    passed: c.passed,
                    evidence: c.evidence
                }))
        };
        return Response.json(response);
    }
    if (outcome.status === 'system_error') {
        // The reason can carry raw provider output. Log it, do not ship it.
        console.error(`[submit] system error on "${slug}": ${outcome.reason}`);
        return Response.json({
            status: 'system_error',
            message: 'Grading failed for a technical reason. Your code is safe — try again.'
        });
    }
    if (outcome.status === 'grading_unavailable') {
        const spend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$local$2d$deps$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["localSpend"])();
        console.error(`[submit] spend ceiling reached: $${spend.spentUsd.toFixed(4)} of $${spend.ceilingUsd}`);
        return Response.json({
            status: 'grading_unavailable',
            message: 'Grading is temporarily unavailable because the spend limit was reached. ' + 'Your code is safe. Raise AI_MONTHLY_CEILING_USD to continue.'
        });
    }
    return Response.json(outcome);
}
}),
"[project]/src/bundling/resolve.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module resolution for the in-memory file sets we bundle.
 *
 * Shared deliberately between the server-side build gate (`esbuild`) and the
 * browser preview worker (`esbuild-wasm`). If these two disagreed, a submission
 * could preview fine and then fail the build gate, or the reverse, and the
 * learner would have no way to understand why.
 *
 * The loader union is declared here rather than imported from esbuild so this
 * module stays free of any Node-only import; both esbuild builds accept these
 * exact strings.
 */ __turbopack_context__.s([
    "EXTENSIONS",
    ()=>EXTENSIONS,
    "VIRTUAL_NAMESPACE",
    ()=>VIRTUAL_NAMESPACE,
    "loaderFor",
    ()=>loaderFor,
    "resolveRelative",
    ()=>resolveRelative,
    "stripNamespace",
    ()=>stripNamespace,
    "stripNamespaceEverywhere",
    ()=>stripNamespaceEverywhere
]);
const EXTENSIONS = [
    '',
    '.jsx',
    '.js',
    '.tsx',
    '.ts',
    '/index.jsx',
    '/index.js',
    '/index.tsx',
    '/index.ts'
];
const DATAURL_EXTENSIONS = [
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.ico',
    '.woff',
    '.woff2'
];
const TEXT_EXTENSIONS = [
    '.md',
    '.txt',
    '.html'
];
function loaderFor(path) {
    if (path.endsWith('.tsx')) return 'tsx';
    if (path.endsWith('.ts')) return 'ts';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.css')) return 'css';
    if (DATAURL_EXTENSIONS.some((e)=>path.endsWith(e))) return 'dataurl';
    if (TEXT_EXTENSIONS.some((e)=>path.endsWith(e))) return 'text';
    if (/\.(jsx|js|mjs|cjs)$/.test(path)) return 'jsx';
    // Anything else contributes nothing rather than being parsed as code. Guessing
    // 'jsx' made an SVG prologue or a Markdown heading look like a syntax error in a
    // file the learner cannot even open.
    return 'empty';
}
function resolveRelative(importer, specifier, files) {
    const base = importer.split('/').slice(0, -1);
    const parts = specifier.split('/');
    for (const part of parts){
        if (part === '.' || part === '') continue;
        if (part === '..') base.pop();
        else base.push(part);
    }
    const joined = base.join('/');
    for (const ext of EXTENSIONS){
        if (files.has(joined + ext)) return joined + ext;
    }
    return undefined;
}
const VIRTUAL_NAMESPACE = 'virtual';
function stripNamespace(file) {
    if (file === undefined) return undefined;
    const prefix = `${VIRTUAL_NAMESPACE}:`;
    return file.startsWith(prefix) ? file.slice(prefix.length) : file;
}
function stripNamespaceEverywhere(text) {
    return text.replaceAll(`${VIRTUAL_NAMESPACE}:`, '');
}
}),
"[project]/src/files/read-dir-files.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readDirFiles",
    ()=>readDirFiles
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
async function readDirFiles(dir) {
    const entries = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readdir"])(dir, {
        recursive: true,
        withFileTypes: true
    });
    const out = [];
    for (const entry of entries){
        if (!entry.isFile()) continue;
        const absolute = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(entry.parentPath, entry.name);
        out.push({
            path: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["relative"])(dir, absolute).split(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["sep"]).join('/'),
            content: await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(absolute, 'utf8')
        });
    }
    return out.sort((a, b)=>a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
}),
"[project]/src/grading/assemble-prompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MIN_STABLE_PREFIX_CHARS",
    ()=>MIN_STABLE_PREFIX_CHARS,
    "assembleGradingMessages",
    ()=>assembleGradingMessages
]);
const MIN_STABLE_PREFIX_CHARS = 4800;
function renderFiles(files) {
    return files.map((f)=>`--- path: ${f.path} ---\n${f.content}`).join('\n\n');
}
function assembleGradingMessages(input) {
    const stableText = [
        `## QUESTION\n\nScenario: ${input.scenario}\nReported symptom: ${input.symptom}`,
        `## RUBRIC\n\n${input.rubric.map((c)=>`- ${c.id} (${c.kind}): ${c.description}`).join('\n')}`,
        `## REFERENCE FIX\n\n${renderFiles(input.referenceFix)}`
    ].join('\n\n');
    const volatileText = `## SUBMITTED FILES\n\n${renderFiles(input.submitted)}`;
    const stablePrefixChars = input.promptText.length + stableText.length;
    const messages = [
        {
            role: 'system',
            content: input.promptText
        },
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: stableText,
                    cache_control: {
                        type: 'ephemeral'
                    }
                },
                {
                    type: 'text',
                    text: volatileText
                }
            ]
        }
    ];
    return {
        messages,
        stablePrefixChars,
        cacheWarning: stablePrefixChars < MIN_STABLE_PREFIX_CHARS ? `Stable prefix is ${stablePrefixChars} chars, likely under Sonnet 4.6's 1,024-token minimum — caching will silently not apply` : null
    };
}
}),
"[project]/src/grading/build-gate.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCheck",
    ()=>buildCheck
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$esbuild__$5b$external$5d$__$28$esbuild$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$esbuild$29$__ = __turbopack_context__.i("[externals]/esbuild [external] (esbuild, cjs, [project]/node_modules/esbuild)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/bundling/resolve.ts [app-route] (ecmascript)");
;
;
async function buildCheck(files, entry) {
    const map = new Map(files.map((f)=>[
            f.path,
            f.content
        ]));
    if (!map.has(entry)) {
        return {
            ok: false,
            errors: [
                {
                    file: entry,
                    line: 0,
                    column: 0,
                    text: `Entry file "${entry}" is missing`
                }
            ]
        };
    }
    const virtual = {
        name: 'debuglab-virtual',
        setup (build) {
            build.onResolve({
                filter: /.*/
            }, (args)=>{
                if (args.kind === 'entry-point') return {
                    path: args.path,
                    namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
                };
                if (!args.path.startsWith('.')) return {
                    path: args.path,
                    external: true
                };
                const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveRelative"])(args.importer, args.path, map);
                if (!resolved) {
                    return {
                        errors: [
                            {
                                text: `Cannot resolve "${args.path}" from "${args.importer}"`
                            }
                        ]
                    };
                }
                return {
                    path: resolved,
                    namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
                };
            });
            build.onLoad({
                filter: /.*/,
                namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
            }, (args)=>({
                    contents: map.get(args.path) ?? '',
                    loader: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loaderFor"])(args.path)
                }));
        }
    };
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$esbuild__$5b$external$5d$__$28$esbuild$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$esbuild$29$__["build"]({
            entryPoints: [
                entry
            ],
            bundle: true,
            write: false,
            // Required even with write:false: without an output path esbuild refuses to
            // emit a second output file, so any JS importing CSS is a hard error.
            // Nothing is written to disk.
            outdir: 'out',
            logLevel: 'silent',
            format: 'esm',
            jsx: 'automatic',
            plugins: [
                virtual
            ]
        });
        return {
            ok: true
        };
    } catch (err) {
        const messages = err.errors ?? [];
        return {
            ok: false,
            errors: messages.map((m)=>({
                    // esbuild prefixes paths with the plugin namespace ("virtual:src/App.jsx").
                    // Learners must see their own path, not our bundler internals.
                    file: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripNamespace"])(m.location?.file) ?? entry,
                    line: m.location?.line ?? 0,
                    column: m.location?.column ?? 0,
                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripNamespaceEverywhere"])(m.text)
                }))
        };
    }
}
}),
"[project]/src/grading/cost.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FEEDBACK_MODEL",
    ()=>FEEDBACK_MODEL,
    "GRADER_MODEL",
    ()=>GRADER_MODEL,
    "MODEL_PRICES",
    ()=>MODEL_PRICES,
    "costUsd",
    ()=>costUsd,
    "priceUsage",
    ()=>priceUsage
]);
const GRADER_MODEL = 'anthropic/claude-sonnet-4.6';
const FEEDBACK_MODEL = 'anthropic/claude-haiku-5.5';
const MODEL_PRICES = {
    'anthropic/claude-sonnet-4.6': {
        inputPerMTok: 3,
        outputPerMTok: 15
    },
    'anthropic/claude-haiku-5.5': {
        inputPerMTok: 0.1,
        outputPerMTok: 0.5
    }
};
/** Both multipliers confirmed against live usage/cost figures on 2026-10-27. */ const CACHE_READ_MULTIPLIER = 0.1;
const CACHE_WRITE_MULTIPLIER = 1.25; // 5-minute TTL; a 1h TTL write would be 2x
const REPORTED_COST_TOLERANCE = 0.25;
function priceUsage(model, usage) {
    const price = MODEL_PRICES[model];
    if (!price) throw new Error(`Unknown model "${model}": refusing to guess a price`);
    const warnings = [];
    let cached = usage.cachedInputTokens;
    let written = usage.cacheWriteInputTokens;
    if (cached + written > usage.inputTokens) {
        warnings.push(`Cached (${cached}) plus cache-write (${written}) tokens exceed input tokens (${usage.inputTokens}); clamping`);
        written = Math.min(written, usage.inputTokens);
        cached = Math.max(0, Math.min(cached, usage.inputTokens - written));
    }
    const fresh = Math.max(0, usage.inputTokens - cached - written);
    const costUsd = fresh * price.inputPerMTok / 1_000_000 + cached * price.inputPerMTok * CACHE_READ_MULTIPLIER / 1_000_000 + written * price.inputPerMTok * CACHE_WRITE_MULTIPLIER / 1_000_000 + usage.outputTokens * price.outputPerMTok / 1_000_000;
    if (usage.reportedCostUsd !== null) {
        const divergence = Math.abs(usage.reportedCostUsd - costUsd);
        const scale = Math.max(usage.reportedCostUsd, costUsd, 1e-9);
        if (divergence / scale > REPORTED_COST_TOLERANCE) {
            warnings.push(`Computed cost ${costUsd.toFixed(6)} diverges from provider reported cost ${usage.reportedCostUsd.toFixed(6)}`);
        }
    }
    return {
        costUsd,
        warnings
    };
}
function costUsd(model, usage) {
    return priceUsage(model, usage).costUsd;
}
}),
"[project]/src/grading/grade.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "grade",
    ()=>grade
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$assemble$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/assemble-prompt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$build$2d$gate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/build-gate.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$cost$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/cost.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$hash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/hash.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/openrouter.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$validate$2d$submission$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/validate-submission.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$verdict$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/verdict-schema.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function grade(input, deps) {
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$validate$2d$submission$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSubmission"])(input.submitted, input.questionFiles);
    if (!validation.ok) return {
        status: 'invalid_submission',
        errors: validation.errors
    };
    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$hash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["submissionHash"])(input.questionId, input.questionVersion, input.submitted);
    const cached = await deps.cache.get(hash);
    if (cached) {
        const scored = cached.passed ? await deps.firstPass.claim(deps.userId, input.questionId) : false;
        return {
            status: 'graded',
            verdict: cached,
            cacheHit: true,
            costUsd: 0,
            scored
        };
    }
    const merged = mergeFiles(input.questionFiles, input.submitted);
    const build = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$build$2d$gate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCheck"])(merged, input.entry);
    if (!build.ok) return {
        status: 'build_failed',
        errors: build.errors
    };
    const [mtd, ceiling] = await Promise.all([
        deps.spend.monthToDateUsd(),
        deps.spend.ceilingUsd()
    ]);
    if (mtd >= ceiling) return {
        status: 'grading_unavailable',
        reason: 'spend_ceiling'
    };
    const assembled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$assemble$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assembleGradingMessages"])({
        promptText: deps.promptText,
        scenario: input.scenario,
        symptom: input.symptom,
        rubric: input.rubric,
        referenceFix: input.referenceFix,
        submitted: input.submitted
    });
    const record = async (usage, latencyMs)=>{
        const priced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$cost$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["priceUsage"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$cost$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GRADER_MODEL"], usage);
        await deps.spend.record({
            userId: deps.userId,
            questionId: input.questionId,
            feature: 'grade',
            model: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$cost$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GRADER_MODEL"],
            promptVersion: deps.promptVersion,
            usage,
            costUsd: priced.costUsd,
            latencyMs,
            cacheHit: false,
            cacheWarning: assembled.cacheWarning,
            costWarnings: priced.warnings
        });
        return priced.costUsd;
    };
    let response;
    try {
        response = await deps.callModel({
            model: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$cost$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GRADER_MODEL"],
            messages: assembled.messages,
            schemaName: 'verdict',
            schema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$verdict$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verdictJsonSchema"])(input.rubric)
        }, {
            fetch: deps.fetchImpl ?? fetch,
            apiKey: deps.apiKey ?? ''
        });
    } catch (err) {
        // A 200 that was billed but unusable still has usage attached. Ledger it
        // before returning, or the spend ceiling silently drifts below reality.
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModelCallError"] && err.usage) {
            await record(err.usage, err.latencyMs ?? 0);
        }
        return {
            status: 'system_error',
            reason: `Model call failed: ${err.message}`
        };
    }
    const cost = await record(response.usage, response.latencyMs);
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$verdict$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseVerdict"])(response.raw, input.rubric);
    if (!parsed.ok) {
        return {
            status: 'system_error',
            reason: `Invalid verdict: ${parsed.reason}`
        };
    }
    await deps.cache.put(hash, parsed.verdict);
    const scored = parsed.verdict.passed ? await deps.firstPass.claim(deps.userId, input.questionId) : false;
    return {
        status: 'graded',
        verdict: parsed.verdict,
        cacheHit: false,
        costUsd: cost,
        scored
    };
}
function mergeFiles(questionFiles, submitted) {
    const bySubmitted = new Map(submitted.map((f)=>[
            f.path,
            f.content
        ]));
    return questionFiles.map((f)=>({
            path: f.path,
            content: bySubmitted.get(f.path) ?? f.content
        }));
}
}),
"[project]/src/grading/hash.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "submissionHash",
    ()=>submissionHash
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
function normalise(content) {
    return content.replace(/\r\n/g, '\n').replace(/\n+$/, '') + '\n';
}
function submissionHash(questionId, questionVersion, files) {
    const sorted = [
        ...files
    ].sort((x, y)=>x.path < y.path ? -1 : x.path > y.path ? 1 : 0);
    const h = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])('sha256');
    h.update(`${questionId}\u0000${questionVersion}\u0000`);
    for (const f of sorted){
        h.update(f.path);
        h.update('\u0000');
        h.update(normalise(f.content));
        h.update('\u0000');
    }
    return h.digest('hex');
}
}),
"[project]/src/grading/openrouter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModelCallError",
    ()=>ModelCallError,
    "callModel",
    ()=>callModel
]);
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
class ModelCallError extends Error {
    /**
   * Usage from a response that was billed but unusable. A 200 that contains prose
   * instead of JSON still costs money, and a call that never reaches the ledger
   * lets month-to-date spend understate and the ceiling be walked past.
   */ usage;
    latencyMs;
    constructor(message, usage, latencyMs){
        super(message);
        this.name = 'ModelCallError';
        this.usage = usage;
        this.latencyMs = latencyMs;
    }
}
async function callModel(req, deps) {
    const started = Date.now();
    const res = await deps.fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${deps.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: req.model,
            messages: req.messages,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: req.schemaName,
                    strict: true,
                    schema: req.schema
                }
            },
            // Structured-output support is per endpoint on OpenRouter; without this a
            // request can be routed to an endpoint that ignores the schema entirely.
            provider: {
                require_parameters: true
            }
        })
    });
    const latencyMs = Date.now() - started;
    if (!res.ok) {
        throw new ModelCallError(`OpenRouter returned ${res.status}: ${await res.text()}`);
    }
    // Field names and semantics verified against a live OpenRouter response on
    // 2026-10-27: cached_tokens and cache_write_tokens are both subsets of
    // prompt_tokens, and cost_details.upstream_inference_cost is the real spend on
    // a BYOK key (usage.cost is 0 there).
    const body = await res.json();
    const usage = {
        inputTokens: body.usage?.prompt_tokens ?? 0,
        outputTokens: body.usage?.completion_tokens ?? 0,
        cachedInputTokens: body.usage?.prompt_tokens_details?.cached_tokens ?? 0,
        cacheWriteInputTokens: body.usage?.prompt_tokens_details?.cache_write_tokens ?? 0,
        reportedCostUsd: body.usage?.cost_details?.upstream_inference_cost ?? body.usage?.cost ?? null
    };
    const content = body.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
        throw new ModelCallError('OpenRouter response had no content', usage, latencyMs);
    }
    let raw;
    try {
        raw = JSON.parse(content);
    } catch  {
        throw new ModelCallError(`Model content was not valid JSON: ${content.slice(0, 200)}`, usage, latencyMs);
    }
    return {
        raw,
        latencyMs,
        usage
    };
}
}),
"[project]/src/grading/prompt-loader.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadPrompt",
    ()=>loadPrompt
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
const VERSION_RE = /^v\d+$/;
const PROMPT_ROOT = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), 'prompts');
async function loadPrompt(name, version) {
    if (!VERSION_RE.test(version)) {
        throw new Error(`Invalid version "${version}": expected vN`);
    }
    if (!/^[a-z-]+$/.test(name)) {
        throw new Error(`Invalid prompt name "${name}"`);
    }
    const path = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(PROMPT_ROOT, name, `${version}.md`);
    try {
        const text = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(path, 'utf8');
        return {
            name,
            version,
            text
        };
    } catch  {
        throw new Error(`Prompt not found: ${name}/${version} at ${path}`);
    }
}
}),
"[project]/src/grading/validate-submission.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_FILE_BYTES",
    ()=>MAX_FILE_BYTES,
    "MAX_TOTAL_BYTES",
    ()=>MAX_TOTAL_BYTES,
    "validateSubmission",
    ()=>validateSubmission
]);
const MAX_FILE_BYTES = 128 * 1024;
const MAX_TOTAL_BYTES = 512 * 1024;
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;
function validateSubmission(submitted, questionFiles) {
    const errors = [];
    const byPath = new Map(questionFiles.map((f)=>[
            f.path,
            f
        ]));
    const seen = new Set();
    let total = 0;
    for (const file of submitted){
        // Two entries for one path would both be rendered into the grading prompt,
        // labelled identically, letting a learner show the grader a correct-looking
        // version alongside their real code.
        if (seen.has(file.path)) {
            errors.push(`"${file.path}" was submitted more than once`);
            continue;
        }
        seen.add(file.path);
        const known = byPath.get(file.path);
        if (!known) {
            errors.push(`"${file.path}" is not part of this question`);
            continue;
        }
        if (known.visibility !== 'editable') {
            errors.push(`"${file.path}" is read-only and cannot be modified`);
        }
        const bytes = Buffer.byteLength(file.content, 'utf8');
        if (bytes > MAX_FILE_BYTES) {
            errors.push(`"${file.path}" is too large (${bytes} bytes, max ${MAX_FILE_BYTES})`);
        }
        if (CONTROL_CHARS.test(file.content)) {
            errors.push(`"${file.path}" contains control or binary characters`);
        }
        total += bytes;
    }
    if (total > MAX_TOTAL_BYTES) {
        errors.push(`Submission is too large (${total} bytes, max ${MAX_TOTAL_BYTES})`);
    }
    return errors.length === 0 ? {
        ok: true
    } : {
        ok: false,
        errors
    };
}
}),
"[project]/src/grading/verdict-schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseVerdict",
    ()=>parseVerdict,
    "verdictJsonSchema",
    ()=>verdictJsonSchema
]);
function verdictJsonSchema(rubric) {
    return {
        type: 'object',
        additionalProperties: false,
        required: [
            'criteria',
            'passed'
        ],
        properties: {
            criteria: {
                type: 'array',
                minItems: rubric.length,
                maxItems: rubric.length,
                items: {
                    type: 'object',
                    additionalProperties: false,
                    required: [
                        'id',
                        'passed',
                        'evidence'
                    ],
                    properties: {
                        id: {
                            type: 'string',
                            enum: rubric.map((c)=>c.id),
                            description: 'The rubric criterion this verdict is for.'
                        },
                        passed: {
                            type: 'boolean',
                            description: 'True only if the criterion is fully satisfied.'
                        },
                        evidence: {
                            type: 'string',
                            description: 'A short quote from the submitted code supporting this verdict.'
                        }
                    }
                }
            },
            passed: {
                type: 'boolean',
                description: 'True only if every criterion passed.'
            }
        }
    };
}
function parseVerdict(raw, rubric) {
    if (typeof raw !== 'object' || raw === null) {
        return {
            ok: false,
            reason: 'Verdict is not an object'
        };
    }
    const obj = raw;
    if (typeof obj.passed !== 'boolean') {
        return {
            ok: false,
            reason: 'Verdict "passed" is not a boolean'
        };
    }
    if (!Array.isArray(obj.criteria)) {
        return {
            ok: false,
            reason: 'Verdict "criteria" is not an array'
        };
    }
    const expected = new Set(rubric.map((c)=>c.id));
    const seen = new Set();
    const criteria = [];
    for (const entry of obj.criteria){
        if (typeof entry !== 'object' || entry === null) {
            return {
                ok: false,
                reason: 'A criterion verdict is not an object'
            };
        }
        const c = entry;
        if (typeof c.id !== 'string') return {
            ok: false,
            reason: 'A criterion id is not a string'
        };
        if (typeof c.passed !== 'boolean') {
            return {
                ok: false,
                reason: `Criterion "${c.id}" has a non-boolean passed field`
            };
        }
        if (typeof c.evidence !== 'string') {
            return {
                ok: false,
                reason: `Criterion "${c.id}" has a non-string evidence field`
            };
        }
        // A pass must be evidenced. This is the only thing standing between a
        // fabricated pass and a score, and the prompt alone cannot enforce it: §9
        // records that some providers treat the schema as a hint. A fail needs no
        // evidence, since a fail awards nothing.
        if (c.passed === true && c.evidence.trim() === '') {
            return {
                ok: false,
                reason: `Criterion "${c.id}" passed with no evidence`
            };
        }
        if (!expected.has(c.id)) {
            return {
                ok: false,
                reason: `Criterion "${c.id}" is not in the rubric`
            };
        }
        if (seen.has(c.id)) {
            return {
                ok: false,
                reason: `Criterion "${c.id}" appears more than once`
            };
        }
        seen.add(c.id);
        criteria.push({
            id: c.id,
            passed: c.passed,
            evidence: c.evidence
        });
    }
    const missing = [
        ...expected
    ].filter((id)=>!seen.has(id));
    if (missing.length > 0) {
        return {
            ok: false,
            reason: `Verdict omits criteria: ${missing.join(', ')}`
        };
    }
    const allPassed = criteria.every((c)=>c.passed);
    if (allPassed !== obj.passed) {
        return {
            ok: false,
            reason: `Overall "passed" (${obj.passed}) contradicts the criteria (${allPassed})`
        };
    }
    return {
        ok: true,
        verdict: {
            criteria,
            passed: obj.passed
        }
    };
}
}),
"[project]/src/questions/load-question.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadQuestion",
    ()=>loadQuestion,
    "toLearnerQuestion",
    ()=>toLearnerQuestion
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$files$2f$read$2d$dir$2d$files$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/files/read-dir-files.ts [app-route] (ecmascript)");
;
;
;
const QUESTIONS_ROOT = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), 'questions');
const SLUG_RE = /^[a-z0-9-]+$/;
async function loadQuestion(slug) {
    if (!SLUG_RE.test(slug)) throw new Error(`Invalid question slug "${slug}"`);
    const dir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(QUESTIONS_ROOT, slug);
    const meta = JSON.parse(await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, 'question.json'), 'utf8'));
    const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$files$2f$read$2d$dir$2d$files$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readDirFiles"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, 'files'));
    const questionFiles = raw.map((f)=>({
            ...f,
            // Anything the author did not classify is read-only, never editable. A typo
            // in the visibility map must not hand a learner write access.
            visibility: meta.visibility[f.path] ?? 'readonly'
        }));
    return {
        meta,
        questionFiles,
        referenceFix: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$files$2f$read$2d$dir$2d$files$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readDirFiles"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, 'reference'))
    };
}
function toLearnerQuestion(loaded) {
    const { meta } = loaded;
    return {
        slug: meta.slug,
        version: meta.version,
        title: meta.title,
        company: meta.company,
        difficulty: meta.difficulty,
        tags: meta.tags,
        timeLimitSec: meta.timeLimitSec,
        entry: meta.entry,
        handlersPath: meta.handlersPath,
        scenario: meta.scenario,
        symptom: meta.symptom,
        files: loaded.questionFiles.filter((f)=>f.visibility !== 'hidden')
    };
}
}),
"[project]/src/server/local-deps.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ceilingUsd",
    ()=>ceilingUsd,
    "localGradeDeps",
    ()=>localGradeDeps,
    "localSpend",
    ()=>localSpend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/openrouter.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$prompt$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/grading/prompt-loader.ts [app-route] (ecmascript)");
;
;
/**
 * In-memory implementations of everything `grade()` needs, for running locally.
 *
 * Phase 2b replaces these with Supabase. Deliberately process-local: restarting
 * the dev server clears the verdict cache and the spend total, which is the right
 * behaviour for a local toy and the wrong behaviour for production.
 */ const verdictCache = new Map();
const firstPassClaims = new Set();
const usageLog = [];
let spentUsd = 0;
const DEFAULT_CEILING_USD = 5;
function ceilingUsd() {
    const raw = process.env.AI_MONTHLY_CEILING_USD;
    if (raw === undefined || raw === '') return DEFAULT_CEILING_USD;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CEILING_USD;
}
function localSpend() {
    return {
        spentUsd,
        ceilingUsd: ceilingUsd(),
        calls: usageLog.length
    };
}
async function localGradeDeps(userId = 'local-dev') {
    const prompt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$prompt$2d$loader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadPrompt"])('grader', process.env.GRADER_PROMPT_VERSION ?? 'v1');
    return {
        cache: {
            get: async (hash)=>verdictCache.get(hash) ?? null,
            put: async (hash, verdict)=>{
                verdictCache.set(hash, verdict);
            }
        },
        spend: {
            monthToDateUsd: async ()=>spentUsd,
            ceilingUsd: async ()=>ceilingUsd(),
            record: async (entry)=>{
                spentUsd += entry.costUsd;
                usageLog.push(entry);
                const flags = [
                    entry.cacheWarning,
                    ...entry.costWarnings
                ].filter(Boolean);
                console.log(`[ai_usage] ${entry.feature} ${entry.model} ${entry.promptVersion} ` + `in=${entry.usage.inputTokens} cached=${entry.usage.cachedInputTokens} ` + `out=${entry.usage.outputTokens} $${entry.costUsd.toFixed(5)} ` + `${entry.latencyMs}ms  (month-to-date $${spentUsd.toFixed(5)} of $${ceilingUsd()})`);
                for (const flag of flags)console.warn(`[ai_usage] warning: ${flag}`);
            }
        },
        firstPass: {
            claim: async (uid, questionId)=>{
                const key = `${uid}::${questionId}`;
                if (firstPassClaims.has(key)) return false;
                firstPassClaims.add(key);
                return true;
            }
        },
        callModel: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$grading$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callModel"],
        promptText: prompt.text,
        promptVersion: prompt.version,
        userId,
        apiKey: process.env.OPENROUTER_API_KEY
    };
}
}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0u8ttinxb4qqw._.js.map