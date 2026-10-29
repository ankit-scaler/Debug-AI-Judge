module.exports = [
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
"[project]/app/api/questions/[slug]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$questions$2f$load$2d$question$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/questions/load-question.ts [app-route] (ecmascript)");
;
async function GET(_request, ctx) {
    const { slug } = await ctx.params;
    try {
        const loaded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$questions$2f$load$2d$question$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadQuestion"])(slug);
        // toLearnerQuestion is an allow-list: no rubric, no reference fix, no hidden
        // files. Covered by src/questions/load-question.test.ts.
        return Response.json((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$questions$2f$load$2d$question$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toLearnerQuestion"])(loaded));
    } catch (err) {
        console.error(`[questions] failed to load "${slug}":`, err);
        return Response.json({
            error: 'Question not found'
        }, {
            status: 404
        });
    }
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
(()=>{
    const e = new Error("Cannot find module '../files/read-dir-files.js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
const QUESTIONS_ROOT = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), 'questions');
const SLUG_RE = /^[a-z0-9-]+$/;
async function loadQuestion(slug) {
    if (!SLUG_RE.test(slug)) throw new Error(`Invalid question slug "${slug}"`);
    const dir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(QUESTIONS_ROOT, slug);
    const meta = JSON.parse(await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, 'question.json'), 'utf8'));
    const raw = await readDirFiles((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, 'files'));
    const questionFiles = raw.map((f)=>({
            ...f,
            // Anything the author did not classify is read-only, never editable. A typo
            // in the visibility map must not hand a learner write access.
            visibility: meta.visibility[f.path] ?? 'readonly'
        }));
    return {
        meta,
        questionFiles,
        referenceFix: await readDirFiles((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, 'reference'))
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1ga7-lwgwxzou._.js.map