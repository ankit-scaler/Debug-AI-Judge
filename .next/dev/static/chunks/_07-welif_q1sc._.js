(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
(()=>{"use strict";return[
"[project]/components/CodeEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CodeEditor",
    ()=>CodeEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__loader$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/loader/index.js [app-client] (ecmascript) <export default as loader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-client] (css module)");
'use client';
;
;
;
// Monaco's own AMD loader, pointed at the copy self-hosted by
// scripts/build-preview-vendor.mjs. Avoids the CDN that @monaco-editor/react
// defaults to, and avoids bundler-specific worker plumbing entirely.
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__loader$3e$__["loader"].config({
    paths: {
        vs: '/monaco/vs'
    }
});
function languageFor(path) {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.md')) return 'markdown';
    return 'plaintext';
}
function CodeEditor({ path, value, readOnly, theme, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Editor"], {
        height: "100%",
        // `path` gives each file its own model, so undo history and cursor position
        // survive switching tabs.
        path: path,
        language: languageFor(path),
        value: value,
        theme: theme === 'dark' ? 'vs-dark' : 'vs',
        loading: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].overlay,
            children: "Loading editor…"
        }, void 0, false, {
            fileName: "[project]/components/CodeEditor.tsx",
            lineNumber: 38,
            columnNumber: 16
        }, this),
        onChange: (next)=>onChange(next ?? ''),
        options: {
            readOnly,
            fontSize: 13,
            lineHeight: 20,
            fontFamily: 'var(--font-code), ui-monospace, monospace',
            minimap: {
                enabled: false
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            renderWhitespace: 'selection',
            padding: {
                top: 12,
                bottom: 12
            }
        }
    }, void 0, false, {
        fileName: "[project]/components/CodeEditor.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = CodeEditor;
var _c;
__turbopack_context__.k.register(_c, "CodeEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/DevToolsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DevToolsPanel",
    ()=>DevToolsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResultCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ResultCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DevToolsPanel({ tab, onTabChange, consoleLines, network, result }) {
    _s();
    const [openRow, setOpenRow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const tabs = [
        {
            id: 'console',
            label: 'Console',
            count: consoleLines.length
        },
        {
            id: 'network',
            label: 'Network',
            count: network.length
        },
        {
            id: 'results',
            label: 'Results'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bottom,
        "aria-label": "Developer tools",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabs,
                role: "tablist",
                children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        role: "tab",
                        "aria-selected": tab === t.id,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tab} ${tab === t.id ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabActive : ''}`,
                        onClick: ()=>onTabChange(t.id),
                        children: [
                            t.label,
                            t.count ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabCount,
                                children: t.count
                            }, void 0, false, {
                                fileName: "[project]/components/DevToolsPanel.tsx",
                                lineNumber: 45,
                                columnNumber: 24
                            }, this) : null
                        ]
                    }, t.id, true, {
                        fileName: "[project]/components/DevToolsPanel.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/DevToolsPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bottomBody,
                children: [
                    tab === 'console' && (consoleLines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
                        children: "Console is empty. For some bugs, that silence is the clue."
                    }, void 0, false, {
                        fileName: "[project]/components/DevToolsPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this) : consoleLines.map((line, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logLine} mono ${line.level === 'error' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logError : line.level === 'warn' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logWarn : ''}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: line.text
                            }, void 0, false, {
                                fileName: "[project]/components/DevToolsPanel.tsx",
                                lineNumber: 64,
                                columnNumber: 17
                            }, this)
                        }, i, false, {
                            fileName: "[project]/components/DevToolsPanel.tsx",
                            lineNumber: 58,
                            columnNumber: 15
                        }, this))),
                    tab === 'network' && (network.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
                        children: "No requests yet. Interact with the app to see traffic."
                    }, void 0, false, {
                        fileName: "[project]/components/DevToolsPanel.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this) : network.map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].netRow} mono`,
                                    onClick: ()=>setOpenRow(openRow === i ? null : i),
                                    "aria-expanded": openRow === i,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: entry.method
                                        }, void 0, false, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: entry.url
                                        }, void 0, false, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 81,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: entry.status >= 200 && entry.status < 300 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ok : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bad,
                                            children: entry.status || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                entry.durationMs,
                                                "ms"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 85,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DevToolsPanel.tsx",
                                    lineNumber: 75,
                                    columnNumber: 17
                                }, this),
                                openRow === i ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].netBody} mono`,
                                    children: [
                                        entry.mocked ? '# served by the question\'s mock handlers\n' : '',
                                        entry.requestBody ? `request:  ${entry.requestBody}\n` : '',
                                        `response: ${entry.responseBody}`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DevToolsPanel.tsx",
                                    lineNumber: 88,
                                    columnNumber: 19
                                }, this) : null
                            ]
                        }, i, true, {
                            fileName: "[project]/components/DevToolsPanel.tsx",
                            lineNumber: 74,
                            columnNumber: 15
                        }, this))),
                    tab === 'results' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResultCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResultCard"], {
                        result: result
                    }, void 0, false, {
                        fileName: "[project]/components/DevToolsPanel.tsx",
                        lineNumber: 98,
                        columnNumber: 31
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DevToolsPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DevToolsPanel.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(DevToolsPanel, "eQW8sb7QiYAh3u7X4fEf3d4G5+E=");
_c = DevToolsPanel;
var _c;
__turbopack_context__.k.register(_c, "DevToolsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PreviewFrame.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PreviewFrame",
    ()=>PreviewFrame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/bundler.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function PreviewFrame({ files, entry, handlersPath, runToken, onConsole, onNetwork, onStatus }) {
    _s();
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [frameReady, setFrameReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pendingCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Messages from the preview realm: console output, network activity, crashes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreviewFrame.useEffect": ()=>{
            function onMessage(event) {
                const data = event.data;
                if (!data || data.source !== 'debuglab-preview') return;
                if (data.type === 'frame-ready') {
                    setFrameReady(true);
                    return;
                }
                if (data.type === 'console') {
                    onConsole(data.payload);
                    return;
                }
                if (data.type === 'network') {
                    onNetwork(data.payload);
                    return;
                }
                if (data.type === 'error') {
                    const { text } = data.payload;
                    onConsole({
                        level: 'error',
                        text
                    });
                }
            }
            window.addEventListener('message', onMessage);
            return ({
                "PreviewFrame.useEffect": ()=>window.removeEventListener('message', onMessage)
            })["PreviewFrame.useEffect"];
        }
    }["PreviewFrame.useEffect"], [
        onConsole,
        onNetwork
    ]);
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PreviewFrame.useCallback[send]": (code)=>{
            const frame = iframeRef.current?.contentWindow;
            if (!frame) return;
            frame.postMessage({
                source: 'debuglab-host',
                type: 'run',
                code
            }, '*');
        }
    }["PreviewFrame.useCallback[send]"], []);
    // Bundle on demand, then hand the result to the frame. If the frame has not
    // announced itself yet, hold the code until it does.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreviewFrame.useEffect": ()=>{
            let cancelled = false;
            async function build() {
                onStatus({
                    building: true,
                    errors: []
                });
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bundlePreview"])({
                    files,
                    entry,
                    handlersPath
                });
                if (cancelled) return;
                if (!result.ok) {
                    onStatus({
                        building: false,
                        errors: result.errors
                    });
                    return;
                }
                onStatus({
                    building: false,
                    errors: []
                });
                if (frameReady) send(result.code);
                else pendingCode.current = result.code;
            }
            void build();
            return ({
                "PreviewFrame.useEffect": ()=>{
                    cancelled = true;
                }
            })["PreviewFrame.useEffect"];
        // files/entry are intentionally not dependencies: the host controls when a
        // rebuild happens via runToken, so typing does not trigger a bundle per keystroke.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PreviewFrame.useEffect"], [
        runToken,
        frameReady
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreviewFrame.useEffect": ()=>{
            if (frameReady && pendingCode.current) {
                send(pendingCode.current);
                pendingCode.current = null;
            }
        }
    }["PreviewFrame.useEffect"], [
        frameReady,
        send
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
        ref: iframeRef,
        src: "/preview/frame.html",
        title: "App preview",
        sandbox: "allow-scripts allow-modals",
        style: {
            width: '100%',
            height: '100%',
            border: 0,
            background: '#fff'
        }
    }, void 0, false, {
        fileName: "[project]/components/PreviewFrame.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
_s(PreviewFrame, "A5oivV4+R9R9CNMpT5A7MXvGCS0=");
_c = PreviewFrame;
var _c;
__turbopack_context__.k.register(_c, "PreviewFrame");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ResultCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResultCard",
    ()=>ResultCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-client] (css module)");
'use client';
;
;
function ResultCard({ result }) {
    if (result === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: "Submit your fix and the per-criterion result appears here."
        }, void 0, false, {
            fileName: "[project]/components/ResultCard.tsx",
            lineNumber: 21,
            columnNumber: 12
        }, this);
    }
    if (result.status === 'build_failed') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].banner} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bannerFail}`,
                    children: "Your code did not compile"
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                result.errors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].evidence} mono`,
                        children: [
                            e.file,
                            ":",
                            e.line,
                            ":",
                            e.column,
                            " — ",
                            e.text
                        ]
                    }, i, true, {
                        fileName: "[project]/components/ResultCard.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
                    children: "Nothing was graded, so this attempt cost nothing."
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ResultCard.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    if (result.status === 'invalid_submission') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].banner} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bannerFail}`,
                    children: "Submission rejected"
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                result.errors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].criterionText,
                        children: e
                    }, i, false, {
                        fileName: "[project]/components/ResultCard.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/components/ResultCard.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this);
    }
    if (result.status === 'grading_unavailable' || result.status === 'system_error') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].banner} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bannerNeutral}`,
                    children: "Not graded"
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].criterionText,
                    children: result.message
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ResultCard.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    const passedCount = result.criteria.filter((c)=>c.passed).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].banner} ${result.passed ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bannerPass : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bannerFail}`,
                children: [
                    result.passed ? `Solved — all ${result.criteria.length} criteria passed` : `Not solved yet — ${passedCount} of ${result.criteria.length} criteria passed`,
                    result.cacheHit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mocked,
                        children: "cached verdict"
                    }, void 0, false, {
                        fileName: "[project]/components/ResultCard.tsx",
                        lineNumber: 70,
                        columnNumber: 28
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResultCard.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            result.criteria.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].criterion,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: c.passed ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ok : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bad,
                            "aria-hidden": "true",
                            children: c.passed ? '✓' : '✗'
                        }, void 0, false, {
                            fileName: "[project]/components/ResultCard.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].criterionText,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: c.passed ? 'Passed: ' : 'Failed: '
                                        }, void 0, false, {
                                            fileName: "[project]/components/ResultCard.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        c.description
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ResultCard.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                c.evidence ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].evidence} mono`,
                                    children: c.evidence
                                }, void 0, false, {
                                    fileName: "[project]/components/ResultCard.tsx",
                                    lineNumber: 83,
                                    columnNumber: 27
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ResultCard.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, c.id, true, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ResultCard.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c = ResultCard;
var _c;
__turbopack_context__.k.register(_c, "ResultCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SolveScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolveScreen",
    ()=>SolveScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CodeEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CodeEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DevToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DevToolsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PreviewFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PreviewFrame.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/useTheme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/bundler.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function SolveScreen({ question }) {
    _s();
    const originals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolveScreen.useMemo[originals]": ()=>Object.fromEntries(question.files.map({
                "SolveScreen.useMemo[originals]": (f)=>[
                        f.path,
                        f.content
                    ]
            }["SolveScreen.useMemo[originals]"]))
    }["SolveScreen.useMemo[originals]"], [
        question.files
    ]);
    const visibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolveScreen.useMemo[visibility]": ()=>Object.fromEntries(question.files.map({
                "SolveScreen.useMemo[visibility]": (f)=>[
                        f.path,
                        f.visibility
                    ]
            }["SolveScreen.useMemo[visibility]"]))
    }["SolveScreen.useMemo[visibility]"], [
        question.files
    ]);
    const [contents, setContents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(originals);
    const [activePath, setActivePath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(question.files.find({
        "SolveScreen.useState": (f)=>f.visibility === 'editable'
    }["SolveScreen.useState"])?.path ?? question.files[0].path);
    const [rightTab, setRightTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('preview');
    const [bottomTab, setBottomTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('console');
    const [runToken, setRunToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [consoleLines, setConsoleLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [network, setNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [building, setBuilding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [buildErrors, setBuildErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [theme, toggleTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const files = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolveScreen.useMemo[files]": ()=>question.files.map({
                "SolveScreen.useMemo[files]": (f)=>({
                        path: f.path,
                        content: contents[f.path] ?? f.content
                    })
            }["SolveScreen.useMemo[files]"])
    }["SolveScreen.useMemo[files]"], [
        question.files,
        contents
    ]);
    const dirty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolveScreen.useMemo[dirty]": ()=>question.files.some({
                "SolveScreen.useMemo[dirty]": (f)=>contents[f.path] !== originals[f.path]
            }["SolveScreen.useMemo[dirty]"])
    }["SolveScreen.useMemo[dirty]"], [
        question.files,
        contents,
        originals
    ]);
    const onConsole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SolveScreen.useCallback[onConsole]": (line)=>{
            setConsoleLines({
                "SolveScreen.useCallback[onConsole]": (prev)=>[
                        ...prev,
                        line
                    ]
            }["SolveScreen.useCallback[onConsole]"]);
        }
    }["SolveScreen.useCallback[onConsole]"], []);
    const onNetwork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SolveScreen.useCallback[onNetwork]": (entry)=>{
            setNetwork({
                "SolveScreen.useCallback[onNetwork]": (prev)=>[
                        ...prev,
                        entry
                    ]
            }["SolveScreen.useCallback[onNetwork]"]);
        }
    }["SolveScreen.useCallback[onNetwork]"], []);
    const onStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SolveScreen.useCallback[onStatus]": (status)=>{
            setBuilding(status.building);
            setBuildErrors(status.errors);
        }
    }["SolveScreen.useCallback[onStatus]"], []);
    const run = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SolveScreen.useCallback[run]": ()=>{
            setConsoleLines([]);
            setNetwork([]);
            setRightTab('preview');
            setRunToken({
                "SolveScreen.useCallback[run]": (n)=>n + 1
            }["SolveScreen.useCallback[run]"]);
        }
    }["SolveScreen.useCallback[run]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SolveScreen.useCallback[reset]": ()=>{
            setContents(originals);
            setConsoleLines([]);
            setNetwork([]);
            setResult(null);
            setRunToken({
                "SolveScreen.useCallback[reset]": (n)=>n + 1
            }["SolveScreen.useCallback[reset]"]);
        }
    }["SolveScreen.useCallback[reset]"], [
        originals
    ]);
    const submit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SolveScreen.useCallback[submit]": async ()=>{
            setBottomTab('results');
            setResult(null);
            // Stage one is a real local build with the same bundler the server's gate
            // uses, so code that cannot compile never costs a paid grading call.
            setStage('checking');
            const bundle = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bundlePreview"])({
                files,
                entry: question.entry,
                handlersPath: question.handlersPath
            });
            if (!bundle.ok) {
                setStage(null);
                setResult({
                    status: 'build_failed',
                    errors: bundle.errors
                });
                return;
            }
            setStage('grading');
            try {
                const response = await fetch(`/api/attempts/${question.slug}/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        // Only editable files are sent. The server rejects anything else.
                        files: question.files.filter({
                            "SolveScreen.useCallback[submit]": (f)=>f.visibility === 'editable'
                        }["SolveScreen.useCallback[submit]"]).map({
                            "SolveScreen.useCallback[submit]": (f)=>({
                                    path: f.path,
                                    content: contents[f.path] ?? f.content
                                })
                        }["SolveScreen.useCallback[submit]"])
                    })
                });
                setResult(await response.json());
            } catch (err) {
                setResult({
                    status: 'system_error',
                    message: `Could not reach the grader: ${err.message}`
                });
            } finally{
                setStage(null);
            }
        }
    }["SolveScreen.useCallback[submit]"], [
        contents,
        files,
        question
    ]);
    const busy = stage !== null;
    const activeReadOnly = visibility[activePath] !== 'editable';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shell,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].topBar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brand,
                        children: [
                            "Debugging",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brandAccent,
                                children: "Lab"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 145,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spacer
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btn,
                        onClick: run,
                        disabled: busy || building,
                        children: [
                            building ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 149,
                                columnNumber: 23
                            }, this) : null,
                            building ? 'Building' : 'Run'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btn,
                        onClick: reset,
                        disabled: busy || !dirty,
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btnPrimary}`,
                        onClick: ()=>void submit(),
                        disabled: busy,
                        children: [
                            busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 160,
                                columnNumber: 19
                            }, this) : null,
                            stage === 'checking' ? 'Checking build' : stage === 'grading' ? 'Grading' : 'Submit'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btn,
                        onClick: toggleTheme,
                        "aria-label": "Toggle colour theme",
                        children: theme === 'dark' ? 'Light' : 'Dark'
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SolveScreen.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].body,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].left,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].company,
                                children: question.company
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                                children: question.title
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLabel,
                                children: "Scenario"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].prose,
                                children: question.scenario
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLabel,
                                children: "Reported symptom"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].symptom,
                                children: question.symptom
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tagRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tag,
                                        children: question.difficulty
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this),
                                    question.tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tag,
                                            children: t
                                        }, t, false, {
                                            fileName: "[project]/components/SolveScreen.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].right,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabs,
                                role: "tablist",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "tab",
                                        "aria-selected": rightTab === 'code',
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tab} ${rightTab === 'code' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabActive : ''}`,
                                        onClick: ()=>setRightTab('code'),
                                        children: "Code"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 191,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "tab",
                                        "aria-selected": rightTab === 'preview',
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tab} ${rightTab === 'preview' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabActive : ''}`,
                                        onClick: ()=>setRightTab('preview'),
                                        children: "Preview"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            rightTab === 'code' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fileRow,
                                        role: "tablist",
                                        "aria-label": "Files",
                                        children: question.files.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                role: "tab",
                                                "aria-selected": activePath === f.path,
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fileTab} ${activePath === f.path ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fileTabActive : ''} mono`,
                                                onClick: ()=>setActivePath(f.path),
                                                children: [
                                                    f.path,
                                                    f.visibility !== 'editable' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].lock,
                                                        title: "Read-only",
                                                        children: "read-only"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SolveScreen.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 23
                                                    }, this) : null,
                                                    contents[f.path] !== originals[f.path] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dirty,
                                                        "aria-label": "Modified",
                                                        children: "●"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SolveScreen.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 23
                                                    }, this) : null
                                                ]
                                            }, f.path, true, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].paneArea,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CodeEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CodeEditor"], {
                                            path: activePath,
                                            value: contents[activePath] ?? '',
                                            readOnly: activeReadOnly,
                                            theme: theme,
                                            onChange: (value)=>setContents((prev)=>({
                                                        ...prev,
                                                        [activePath]: value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/components/SolveScreen.tsx",
                                            lineNumber: 237,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 236,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].paneArea,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PreviewFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PreviewFrame"], {
                                        files: files,
                                        entry: question.entry,
                                        handlersPath: question.handlersPath,
                                        runToken: runToken,
                                        onConsole: onConsole,
                                        onNetwork: onNetwork,
                                        onStatus: onStatus
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this),
                                    building ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].overlay,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 261,
                                                columnNumber: 19
                                            }, this),
                                            " Bundling your app…"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 260,
                                        columnNumber: 17
                                    }, this) : null,
                                    buildErrors.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].buildErrors} mono`,
                                        children: buildErrors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    e.file,
                                                    ":",
                                                    e.line,
                                                    ":",
                                                    e.column,
                                                    " — ",
                                                    e.text
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 267,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DevToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DevToolsPanel"], {
                                tab: bottomTab,
                                onTabChange: setBottomTab,
                                consoleLines: consoleLines,
                                network: network,
                                result: result
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SolveScreen.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SolveScreen.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_s(SolveScreen, "pnJ0RTzzvlCloHrAalGwZdcTowY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = SolveScreen;
var _c;
__turbopack_context__.k.register(_c, "SolveScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/useTheme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const STORAGE_KEY = 'debuglab-theme';
function read() {
    const explicit = document.documentElement.dataset.theme;
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function useTheme() {
    _s();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dark');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTheme.useEffect": ()=>{
            setTheme(read());
            const media = window.matchMedia('(prefers-color-scheme: light)');
            const onChange = {
                "useTheme.useEffect.onChange": ()=>{
                    if (!document.documentElement.dataset.theme) setTheme(read());
                }
            }["useTheme.useEffect.onChange"];
            media.addEventListener('change', onChange);
            return ({
                "useTheme.useEffect": ()=>media.removeEventListener('change', onChange)
            })["useTheme.useEffect"];
        }
    }["useTheme.useEffect"], []);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[toggle]": ()=>{
            setTheme({
                "useTheme.useCallback[toggle]": (current)=>{
                    const next = current === 'dark' ? 'light' : 'dark';
                    document.documentElement.dataset.theme = next;
                    try {
                        localStorage.setItem(STORAGE_KEY, next);
                    } catch  {
                    // Private windows throw. The toggle still works for this session.
                    }
                    return next;
                }
            }["useTheme.useCallback[toggle]"]);
        }
    }["useTheme.useCallback[toggle]"], []);
    return [
        theme,
        toggle
    ];
}
_s(useTheme, "IxHXDXmwOSvw+1F5/624stGfBx8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/preview/bundler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bundlePreview",
    ()=>bundlePreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/esbuild-wasm/lib/browser.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../bundling/resolve.js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './interceptor-source.js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
const ENTRY = '__debuglab_entry__.js';
const INTERCEPTOR = '__debuglab_interceptor__.js';
const MOUNT = '__debuglab_mount__.jsx';
/**
 * React is left bare so the preview frame's import map resolves it to the
 * vendored copy. All three specifiers must stay external or the learner's bundle
 * would carry a second React instance and hooks would break.
 */ const REACT_EXTERNALS = [
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime'
];
let initialised = null;
/** esbuild-wasm may only be initialised once per realm. */ function ensureInitialised() {
    initialised ??= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialize"]({
        wasmURL: '/preview/esbuild.wasm'
    });
    return initialised;
}
async function bundlePreview(options) {
    await ensureInitialised();
    const map = new Map(options.files.map((f)=>[
            f.path,
            f.content
        ]));
    // The interceptor must patch fetch before the app evaluates. Module bodies run
    // in import order, so importing it first in the entry is what guarantees that.
    const imports = [];
    if (options.handlersPath) {
        map.set(INTERCEPTOR, INTERCEPTOR_MODULE.replace('./__HANDLERS__', `./${options.handlersPath}`));
        imports.push(`import './${INTERCEPTOR}';`);
    }
    map.set(MOUNT, `import { createRoot } from 'react-dom/client';\n` + `import App from './${options.entry}';\n` + `const el = document.getElementById('root');\n` + `createRoot(el).render(<App />);\n`);
    imports.push(`import './${MOUNT}';`);
    map.set(ENTRY, imports.join('\n') + '\n');
    const virtual = {
        name: 'debuglab-virtual',
        setup (build) {
            build.onResolve({
                filter: /.*/
            }, (args)=>{
                if (args.kind === 'entry-point') return {
                    path: args.path,
                    namespace: VIRTUAL_NAMESPACE
                };
                if (REACT_EXTERNALS.includes(args.path)) return {
                    path: args.path,
                    external: true
                };
                if (!args.path.startsWith('.')) return {
                    path: args.path,
                    external: true
                };
                const resolved = resolveRelative(args.importer, args.path, map);
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
                    namespace: VIRTUAL_NAMESPACE
                };
            });
            build.onLoad({
                filter: /.*/,
                namespace: VIRTUAL_NAMESPACE
            }, (args)=>({
                    contents: map.get(args.path) ?? '',
                    loader: loaderFor(args.path)
                }));
        }
    };
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["build"]({
            entryPoints: [
                ENTRY
            ],
            bundle: true,
            write: false,
            // Required even with write:false, so a stylesheet import can emit.
            outdir: 'out',
            format: 'esm',
            jsx: 'automatic',
            target: 'es2022',
            logLevel: 'silent',
            define: {
                'process.env.NODE_ENV': '"development"'
            },
            plugins: [
                virtual
            ]
        });
        const code = result.outputFiles?.find((f)=>f.path.endsWith('.js'))?.text;
        if (code === undefined) {
            return {
                ok: false,
                errors: [
                    {
                        file: options.entry,
                        line: 0,
                        column: 0,
                        text: 'Bundler produced no JavaScript output'
                    }
                ]
            };
        }
        return {
            ok: true,
            code
        };
    } catch (err) {
        const messages = err.errors ?? [];
        if (messages.length === 0) {
            return {
                ok: false,
                errors: [
                    {
                        file: options.entry,
                        line: 0,
                        column: 0,
                        text: err.message
                    }
                ]
            };
        }
        return {
            ok: false,
            errors: messages.map((m)=>({
                    file: stripNamespace(m.location?.file) ?? options.entry,
                    line: m.location?.line ?? 0,
                    column: m.location?.column ?? 0,
                    text: stripNamespaceEverywhere(m.text)
                }))
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]})(),
"[project]/components/solve.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bad": "solve-module__0DhTmG__bad",
  "banner": "solve-module__0DhTmG__banner",
  "bannerFail": "solve-module__0DhTmG__bannerFail",
  "bannerNeutral": "solve-module__0DhTmG__bannerNeutral",
  "bannerPass": "solve-module__0DhTmG__bannerPass",
  "body": "solve-module__0DhTmG__body",
  "bottom": "solve-module__0DhTmG__bottom",
  "bottomBody": "solve-module__0DhTmG__bottomBody",
  "brand": "solve-module__0DhTmG__brand",
  "brandAccent": "solve-module__0DhTmG__brandAccent",
  "btn": "solve-module__0DhTmG__btn",
  "btnPrimary": "solve-module__0DhTmG__btnPrimary",
  "buildErrors": "solve-module__0DhTmG__buildErrors",
  "company": "solve-module__0DhTmG__company",
  "criterion": "solve-module__0DhTmG__criterion",
  "criterionText": "solve-module__0DhTmG__criterionText",
  "dirty": "solve-module__0DhTmG__dirty",
  "empty": "solve-module__0DhTmG__empty",
  "evidence": "solve-module__0DhTmG__evidence",
  "fileRow": "solve-module__0DhTmG__fileRow",
  "fileTab": "solve-module__0DhTmG__fileTab",
  "fileTabActive": "solve-module__0DhTmG__fileTabActive",
  "left": "solve-module__0DhTmG__left",
  "lock": "solve-module__0DhTmG__lock",
  "logError": "solve-module__0DhTmG__logError",
  "logLine": "solve-module__0DhTmG__logLine",
  "logWarn": "solve-module__0DhTmG__logWarn",
  "mocked": "solve-module__0DhTmG__mocked",
  "netBody": "solve-module__0DhTmG__netBody",
  "netRow": "solve-module__0DhTmG__netRow",
  "ok": "solve-module__0DhTmG__ok",
  "overlay": "solve-module__0DhTmG__overlay",
  "paneArea": "solve-module__0DhTmG__paneArea",
  "prose": "solve-module__0DhTmG__prose",
  "right": "solve-module__0DhTmG__right",
  "sectionLabel": "solve-module__0DhTmG__sectionLabel",
  "shell": "solve-module__0DhTmG__shell",
  "spacer": "solve-module__0DhTmG__spacer",
  "spin": "solve-module__0DhTmG__spin",
  "spinner": "solve-module__0DhTmG__spinner",
  "symptom": "solve-module__0DhTmG__symptom",
  "tab": "solve-module__0DhTmG__tab",
  "tabActive": "solve-module__0DhTmG__tabActive",
  "tabCount": "solve-module__0DhTmG__tabCount",
  "tabs": "solve-module__0DhTmG__tabs",
  "tag": "solve-module__0DhTmG__tag",
  "tagRow": "solve-module__0DhTmG__tagRow",
  "title": "solve-module__0DhTmG__title",
  "topBar": "solve-module__0DhTmG__topBar",
});
}),
]);

//# sourceMappingURL=_07-welif_q1sc._.js.map