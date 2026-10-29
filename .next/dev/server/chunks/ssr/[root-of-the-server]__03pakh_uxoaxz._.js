module.exports = [
(()=>{"use strict";return[
"[project]/components/CodeEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CodeEditor",
    ()=>CodeEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__loader$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/loader/index.js [app-ssr] (ecmascript) <export default as loader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-ssr] (css module)");
'use client';
;
;
;
// Monaco's own AMD loader, pointed at the copy self-hosted by
// scripts/build-preview-vendor.mjs. Avoids the CDN that @monaco-editor/react
// defaults to, and avoids bundler-specific worker plumbing entirely.
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__loader$3e$__["loader"].config({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Editor"], {
        height: "100%",
        // `path` gives each file its own model, so undo history and cursor position
        // survive switching tabs.
        path: path,
        language: languageFor(path),
        value: value,
        theme: theme === 'dark' ? 'vs-dark' : 'vs',
        loading: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
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
}),
"[project]/components/DevToolsPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DevToolsPanel",
    ()=>DevToolsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResultCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ResultCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
function DevToolsPanel({ tab, onTabChange, consoleLines, network, result }) {
    const [openRow, setOpenRow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bottom,
        "aria-label": "Developer tools",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabs,
                role: "tablist",
                children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        role: "tab",
                        "aria-selected": tab === t.id,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tab} ${tab === t.id ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabActive : ''}`,
                        onClick: ()=>onTabChange(t.id),
                        children: [
                            t.label,
                            t.count ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabCount,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bottomBody,
                children: [
                    tab === 'console' && (consoleLines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].empty,
                        children: "Console is empty. For some bugs, that silence is the clue."
                    }, void 0, false, {
                        fileName: "[project]/components/DevToolsPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this) : consoleLines.map((line, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logLine} mono ${line.level === 'error' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logError : line.level === 'warn' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logWarn : ''}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    tab === 'network' && (network.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].empty,
                        children: "No requests yet. Interact with the app to see traffic."
                    }, void 0, false, {
                        fileName: "[project]/components/DevToolsPanel.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this) : network.map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].netRow} mono`,
                                    onClick: ()=>setOpenRow(openRow === i ? null : i),
                                    "aria-expanded": openRow === i,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: entry.method
                                        }, void 0, false, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: entry.url
                                        }, void 0, false, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 81,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: entry.status >= 200 && entry.status < 300 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ok : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bad,
                                            children: entry.status || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/components/DevToolsPanel.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                openRow === i ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].netBody} mono`,
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
                    tab === 'results' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResultCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResultCard"], {
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
}),
"[project]/components/FileTree.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileTree",
    ()=>FileTree,
    "buildTree",
    ()=>buildTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-ssr] (css module)");
'use client';
;
;
;
function buildTree(files) {
    const root = {
        name: '',
        path: '',
        children: []
    };
    for (const file of files){
        const segments = file.path.split('/');
        let node = root;
        segments.forEach((segment, index)=>{
            const isLeaf = index === segments.length - 1;
            const path = segments.slice(0, index + 1).join('/');
            let next = node.children.find((c)=>c.name === segment);
            if (!next) {
                next = {
                    name: segment,
                    path,
                    children: []
                };
                node.children.push(next);
            }
            if (isLeaf) next.file = file;
            node = next;
        });
    }
    const sort = (nodes)=>nodes.map((n)=>({
                ...n,
                children: sort(n.children)
            })).sort((a, b)=>{
            const aFolder = a.children.length > 0;
            const bFolder = b.children.length > 0;
            if (aFolder !== bFolder) return aFolder ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
    return sort(root.children);
}
function FileTree({ files, activePath, dirtyPaths, onSelect }) {
    const tree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildTree(files), [
        files
    ]);
    // Folders start open: these apps are small, and hunting for the bug should not
    // start with hunting for the file.
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const toggle = (path)=>setCollapsed((prev)=>{
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    const renderNode = (node, depth)=>{
        const indent = {
            paddingLeft: `${8 + depth * 12}px`
        };
        if (node.children.length > 0) {
            const isCollapsed = collapsed.has(node.path);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeRow,
                        style: indent,
                        onClick: ()=>toggle(node.path),
                        "aria-expanded": !isCollapsed,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].chevron,
                                "aria-hidden": "true",
                                children: isCollapsed ? '▸' : '▾'
                            }, void 0, false, {
                                fileName: "[project]/components/FileTree.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].folderName,
                                children: node.name
                            }, void 0, false, {
                                fileName: "[project]/components/FileTree.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    !isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeList,
                        children: node.children.map((child)=>renderNode(child, depth + 1))
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 95,
                        columnNumber: 13
                    }, this) : null
                ]
            }, node.path, true, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this);
        }
        const file = node.file;
        if (!file) return null;
        const isActive = activePath === file.path;
        const isReadOnly = file.visibility !== 'editable';
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeRow} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeRowActive : ''}`,
                style: indent,
                onClick: ()=>onSelect(file.path),
                "aria-current": isActive ? 'true' : undefined,
                title: isReadOnly ? `${file.path} — read-only` : file.path,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].chevron,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fileName,
                        children: node.name
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    dirtyPaths.has(file.path) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dirty,
                        "aria-label": "Modified",
                        children: "●"
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, this) : null,
                    isReadOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lock,
                        "aria-label": "Read-only",
                        children: "⊘"
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 125,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this)
        }, node.path, false, {
            fileName: "[project]/components/FileTree.tsx",
            lineNumber: 109,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].explorer,
        "aria-label": "Files",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].explorerTitle,
                children: "Explorer"
            }, void 0, false, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeList,
                children: tree.map((node)=>renderNode(node, 0))
            }, void 0, false, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].explorerHint,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lock,
                        children: "⊘"
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    " read-only"
                ]
            }, void 0, true, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FileTree.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/PreviewFrame.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PreviewFrame",
    ()=>PreviewFrame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/bundler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$ready$2d$gate$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/ready-gate.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const PreviewFrame = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function PreviewFrame({ files, entry, handlersPath, runToken, onConsole, onNetwork, onStatus, onLoaded }, ref) {
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // The last payload actually built, kept outside the gate so a tab opened
    // *after* the current build finished still has something to receive the
    // moment it announces itself ready -- the gate's own copy is cleared by
    // design once it has been sent to the iframe.
    const lastPayloadRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((payload)=>{
        const frame = iframeRef.current?.contentWindow;
        if (!frame) return;
        frame.postMessage({
            source: 'debuglab-host',
            type: 'run',
            ...payload
        }, '*');
        onLoaded();
    }, [
        onLoaded
    ]);
    const sendToPopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((payload)=>{
        const popup = popupRef.current;
        if (!popup || popup.closed) return;
        popup.postMessage({
            source: 'debuglab-host',
            type: 'run',
            ...payload
        }, '*');
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
    const gateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    gateRef.current ??= new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$ready$2d$gate$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReadyGate"](send);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, ()=>({
            openInNewTab () {
                const popup = window.open('/preview/frame.html', 'debuglab-preview');
                popupRef.current = popup;
            // If a build already finished, the popup's own 'frame-ready' message
            // (handled below) is what actually delivers it -- window.open()
            // returns before the new document has attached its listener, so
            // posting here would race and silently drop, the same failure mode
            // ReadyGate exists to prevent for the iframe.
            }
        }), []);
    // Messages from the preview realm: console output, network activity,
    // crashes -- from either the embedded iframe or a popped-out tab.
    // event.source tells the two apart, since both post the same message
    // shape; everything except frame-ready is treated identically regardless
    // of which one sent it, so the Console/Network panels stay a single
    // source of truth even when a learner is also driving the popped-out tab.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function onMessage(event) {
            const data = event.data;
            if (!data || data.source !== 'debuglab-preview') return;
            if (data.type === 'frame-ready') {
                if (event.source === popupRef.current) {
                    if (lastPayloadRef.current !== null) sendToPopup(lastPayloadRef.current);
                } else {
                    gateRef.current.markReady();
                }
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
        return ()=>window.removeEventListener('message', onMessage);
    }, [
        onConsole,
        onNetwork,
        sendToPopup
    ]);
    // Bundle on demand and hand the result to the gate, which sends it the
    // moment both the bundle and the (possibly not-yet-loaded) iframe are ready,
    // regardless of which one finishes first. Also mirrored to an open popup.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        // A new runToken remounts the iframe below (key={runToken}): a brand new
        // document that has not announced itself yet. Reset the gate so a ready
        // signal left over from the PREVIOUS iframe generation can never cause
        // code to be posted into a frame that has not loaded its listener yet.
        gateRef.current.reset();
        async function build() {
            onStatus({
                building: true,
                errors: []
            });
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bundlePreview"])({
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
            const payload = {
                code: result.code,
                css: result.css
            };
            lastPayloadRef.current = payload;
            gateRef.current.setPayload(payload);
            sendToPopup(payload);
        }
        void build();
        return ()=>{
            cancelled = true;
        };
    // files/entry are intentionally not dependencies: the host controls when a
    // rebuild happens via runToken, so typing does not trigger a bundle per keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        runToken
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
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
    }, runToken, false, {
        fileName: "[project]/components/PreviewFrame.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
});
}),
"[project]/components/ResultCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResultCard",
    ()=>ResultCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-ssr] (css module)");
'use client';
;
;
function ResultCard({ result }) {
    if (result === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].empty,
            children: "Submit your fix and the per-criterion result appears here."
        }, void 0, false, {
            fileName: "[project]/components/ResultCard.tsx",
            lineNumber: 21,
            columnNumber: 12
        }, this);
    }
    if (result.status === 'build_failed') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].banner} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bannerFail}`,
                    children: "Your code did not compile"
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                result.errors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].evidence} mono`,
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].empty,
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].banner} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bannerFail}`,
                    children: "Submission rejected"
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                result.errors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].criterionText,
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].banner} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bannerNeutral}`,
                    children: "Not graded"
                }, void 0, false, {
                    fileName: "[project]/components/ResultCard.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].criterionText,
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].banner} ${result.passed ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bannerPass : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bannerFail}`,
                children: [
                    result.passed ? `Solved — all ${result.criteria.length} criteria passed` : `Not solved yet — ${passedCount} of ${result.criteria.length} criteria passed`,
                    result.cacheHit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mocked,
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
            result.criteria.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].criterion,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: c.passed ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ok : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bad,
                            "aria-hidden": "true",
                            children: c.passed ? '✓' : '✗'
                        }, void 0, false, {
                            fileName: "[project]/components/ResultCard.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].criterionText,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                c.evidence ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].evidence} mono`,
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
}),
"[project]/components/SolveScreen.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolveScreen",
    ()=>SolveScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CodeEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CodeEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DevToolsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DevToolsPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FileTree$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FileTree.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PreviewFrame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PreviewFrame.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useTheme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/useTheme.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/bundler.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
function SolveScreen({ question }) {
    const originals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Object.fromEntries(question.files.map((f)=>[
                f.path,
                f.content
            ])), [
        question.files
    ]);
    const visibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Object.fromEntries(question.files.map((f)=>[
                f.path,
                f.visibility
            ])), [
        question.files
    ]);
    const [contents, setContents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(originals);
    const [activePath, setActivePath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(question.files.find((f)=>f.visibility === 'editable')?.path ?? question.files[0].path);
    const [rightTab, setRightTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('preview');
    const [bottomTab, setBottomTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('console');
    const [runToken, setRunToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [consoleLines, setConsoleLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [network, setNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [building, setBuilding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [buildErrors, setBuildErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // False from the moment a run starts until code actually reaches a loaded,
    // listening iframe. Distinct from `building`: the JS bundle usually compiles
    // in under a second, but the iframe itself -- on a tab that has never run
    // esbuild-wasm before -- can take far longer to finish its own one-time
    // engine warm-up. Without tracking this separately, the preview sat blank
    // with no loading indicator for however long that second phase took.
    const [previewLoaded, setPreviewLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [theme, toggleTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$useTheme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const previewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const files = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>question.files.map((f)=>({
                path: f.path,
                content: contents[f.path] ?? f.content
            })), [
        question.files,
        contents
    ]);
    const dirtyPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Set(question.files.filter((f)=>contents[f.path] !== originals[f.path]).map((f)=>f.path)), [
        question.files,
        contents,
        originals
    ]);
    const dirty = dirtyPaths.size > 0;
    const onConsole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((line)=>{
        setConsoleLines((prev)=>[
                ...prev,
                line
            ]);
    }, []);
    const onNetwork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((entry)=>{
        setNetwork((prev)=>[
                ...prev,
                entry
            ]);
    }, []);
    const onStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((status)=>{
        setBuilding(status.building);
        setBuildErrors(status.errors);
        if (status.errors.length > 0) setPreviewLoaded(true); // nothing more to wait for
    }, []);
    const onPreviewLoaded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setPreviewLoaded(true), []);
    const run = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setConsoleLines([]);
        setNetwork([]);
        setRightTab('preview');
        setPreviewLoaded(false);
        setRunToken((n)=>n + 1);
    }, []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setContents(originals);
        setConsoleLines([]);
        setNetwork([]);
        setResult(null);
        setPreviewLoaded(false);
        setRunToken((n)=>n + 1);
    }, [
        originals
    ]);
    const submit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setBottomTab('results');
        setResult(null);
        // Stage one is a real local build with the same bundler the server's gate
        // uses, so code that cannot compile never costs a paid grading call.
        setStage('checking');
        const bundle = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$bundler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bundlePreview"])({
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
                    files: question.files.filter((f)=>f.visibility === 'editable').map((f)=>({
                            path: f.path,
                            content: contents[f.path] ?? f.content
                        }))
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
    }, [
        contents,
        files,
        question
    ]);
    const busy = stage !== null;
    const activeReadOnly = visibility[activePath] !== 'editable';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].shell,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].topBar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brand,
                        children: [
                            "Debugging",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brandAccent,
                                children: "Lab"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 167,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spacer
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].btn,
                        onClick: run,
                        disabled: busy || building,
                        children: [
                            building ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spinner
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 171,
                                columnNumber: 23
                            }, this) : null,
                            building ? 'Building' : 'Run'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].btn,
                        onClick: reset,
                        disabled: busy || !dirty,
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].btn} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].btnPrimary}`,
                        onClick: ()=>void submit(),
                        disabled: busy,
                        children: [
                            busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spinner
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 182,
                                columnNumber: 19
                            }, this) : null,
                            stage === 'checking' ? 'Checking build' : stage === 'grading' ? 'Grading' : 'Submit'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].btn,
                        onClick: toggleTheme,
                        "aria-label": "Toggle colour theme",
                        children: theme === 'dark' ? 'Light' : 'Dark'
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SolveScreen.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].body,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].left,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].company,
                                children: question.company
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                                children: question.title
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                children: "Scenario"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].prose,
                                children: question.scenario
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                children: "Reported symptom"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].symptom,
                                children: question.symptom
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tagRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tag,
                                        children: question.difficulty
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this),
                                    question.tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tag,
                                            children: t
                                        }, t, false, {
                                            fileName: "[project]/components/SolveScreen.tsx",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].right,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabs,
                                role: "tablist",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "tab",
                                        "aria-selected": rightTab === 'code',
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tab} ${rightTab === 'code' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabActive : ''}`,
                                        onClick: ()=>setRightTab('code'),
                                        children: "Code"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "tab",
                                        "aria-selected": rightTab === 'preview',
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tab} ${rightTab === 'preview' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabActive : ''}`,
                                        onClick: ()=>setRightTab('preview'),
                                        children: "Preview"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this),
                                    rightTab === 'preview' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spacer
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 231,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tab,
                                                onClick: ()=>previewRef.current?.openInNewTab(),
                                                title: "Open the preview in its own browser tab, with full DevTools",
                                                children: "Open in new tab ↗"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].codeSplit,
                                style: {
                                    display: rightTab === 'code' ? undefined : 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FileTree$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FileTree"], {
                                        files: question.files,
                                        activePath: activePath,
                                        dirtyPaths: dirtyPaths,
                                        onSelect: setActivePath
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].editorPane,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].editorPath,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].editorPathActive,
                                                        children: activePath
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SolveScreen.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 17
                                                    }, this),
                                                    activeReadOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].readOnlyNote,
                                                        children: "read-only"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SolveScreen.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 35
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 263,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].paneArea,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CodeEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CodeEditor"], {
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
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 267,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].paneArea,
                                style: {
                                    display: rightTab === 'preview' ? undefined : 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PreviewFrame$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PreviewFrame"], {
                                        ref: previewRef,
                                        files: files,
                                        entry: question.entry,
                                        handlersPath: question.handlersPath,
                                        runToken: runToken,
                                        onConsole: onConsole,
                                        onNetwork: onNetwork,
                                        onStatus: onStatus,
                                        onLoaded: onPreviewLoaded
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    building || !previewLoaded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spinner
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, this),
                                            building ? 'Bundling your app…' : 'Starting the preview — first load can take a little while…'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this) : null,
                                    buildErrors.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].buildErrors} mono`,
                                        children: buildErrors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                lineNumber: 305,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DevToolsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DevToolsPanel"], {
                                tab: bottomTab,
                                onTabChange: setBottomTab,
                                consoleLines: consoleLines,
                                network: network,
                                result: result
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SolveScreen.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SolveScreen.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/useTheme.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const STORAGE_KEY = 'debuglab-theme';
function read() {
    const explicit = document.documentElement.dataset.theme;
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function useTheme() {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('dark');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setTheme(read());
        const media = window.matchMedia('(prefers-color-scheme: light)');
        const onChange = ()=>{
            if (!document.documentElement.dataset.theme) setTheme(read());
        };
        media.addEventListener('change', onChange);
        return ()=>media.removeEventListener('change', onChange);
    }, []);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setTheme((current)=>{
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch  {
            // Private windows throw. The toggle still works for this session.
            }
            return next;
        });
    }, []);
    return [
        theme,
        toggle
    ];
}
}),
"[project]/src/bundling/resolve.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/preview/bundler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bundlePreview",
    ()=>bundlePreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$main$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/esbuild-wasm/lib/main.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/bundling/resolve.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$interceptor$2d$source$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/interceptor-source.ts [app-ssr] (ecmascript)");
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
/**
 * esbuild-wasm may only be initialised once per browser realm. A plain
 * module-level `let` is not enough: editing this file during development
 * triggers Hot Module Replacement, which re-evaluates the module and resets a
 * local variable back to null -- while the real esbuild-wasm instance, loaded
 * from node_modules and never hot-reloaded, still remembers it already
 * initialised. The guard then calls `initialize()` a second time for real,
 * and esbuild-wasm's own idempotency check throws "Cannot call initialize
 * more than once". Parking the promise on globalThis survives HMR; catching
 * that exact message is the fallback for any other path that double-calls it.
 */ const GLOBAL_KEY = '__debuglabEsbuildInit';
function ensureInitialised() {
    const g = globalThis;
    g[GLOBAL_KEY] ??= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$main$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialize"]({
        wasmURL: '/preview/esbuild.wasm'
    }).catch((err)=>{
        if (err instanceof Error && err.message.includes('more than once')) {
            return; // esbuild-wasm itself confirms it is already usable.
        }
        delete g[GLOBAL_KEY]; // a real failure must be retryable, not cached.
        throw err;
    });
    return g[GLOBAL_KEY];
}
async function bundlePreview(options) {
    await ensureInitialised();
    const map = new Map(options.files.map((f)=>[
            f.path,
            f.content
        ]));
    // 'react' must be the first module to evaluate, full stop. react-dom/client
    // and react/jsx-runtime's vendor bundles read React off a shared global
    // (window.__DEBUGLAB_REACT__) that only react.js's own module body sets --
    // see scripts/preview-react-shim.cjs. Explicitly importing it first, ahead
    // of even the interceptor, guarantees that global exists before anything
    // that depends on it runs. Leaving this to import order alone is exactly
    // what broke before: the mount file's first import was 'react-dom/client',
    // which evaluated before anything had imported bare 'react' at all.
    const imports = [
        `import 'react';`
    ];
    if (options.handlersPath) {
        map.set(INTERCEPTOR, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$interceptor$2d$source$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERCEPTOR_MODULE"].replace('./__HANDLERS__', `./${options.handlersPath}`));
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
                    namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
                };
                if (REACT_EXTERNALS.includes(args.path)) return {
                    path: args.path,
                    external: true
                };
                if (!args.path.startsWith('.')) return {
                    path: args.path,
                    external: true
                };
                const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveRelative"])(args.importer, args.path, map);
                if (!resolved) {
                    // Say what was actually available. A bare "cannot resolve" forces
                    // whoever hits this to guess at the file set, and the file set is the
                    // one thing they cannot see.
                    const available = [
                        ...map.keys()
                    ].filter((k)=>!k.startsWith('__debuglab')).sort();
                    return {
                        errors: [
                            {
                                text: `Cannot resolve "${args.path}" from "${args.importer}". ` + `Files in this question: ${available.join(', ')}`
                            }
                        ]
                    };
                }
                return {
                    path: resolved,
                    namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
                };
            });
            build.onLoad({
                filter: /.*/,
                namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
            }, (args)=>({
                    contents: map.get(args.path) ?? '',
                    loader: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loaderFor"])(args.path)
                }));
        }
    };
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$main$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["build"]({
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
        // esbuild emits CSS as a SEPARATE output file, not inlined into the JS --
        // confirmed by direct inspection (a build with one CSS import produces
        // outputFiles.length === 2). Grabbing only the .js entry, as this used
        // to, built and ran without error but silently dropped every stylesheet:
        // the bundle was fine, the page was just never styled. css defaults to
        // '' when a question imports none, which is the common case.
        const code = result.outputFiles?.find((f)=>f.path.endsWith('.js'))?.text;
        const css = result.outputFiles?.find((f)=>f.path.endsWith('.css'))?.text ?? '';
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
            code,
            css
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
                    file: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stripNamespace"])(m.location?.file) ?? options.entry,
                    line: m.location?.line ?? 0,
                    column: m.location?.column ?? 0,
                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stripNamespaceEverywhere"])(m.text)
                }))
        };
    }
}
}),
"[project]/src/preview/interceptor-source.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "INTERCEPTOR_MODULE",
    ()=>INTERCEPTOR_MODULE
]);
const INTERCEPTOR_MODULE = `
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
}),
"[project]/src/preview/ready-gate.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "ReadyGate",
    ()=>ReadyGate
]);
class ReadyGate {
    send;
    ready;
    pending;
    constructor(send){
        this.send = send;
        this.ready = false;
        this.pending = null;
    }
    /** Call at the start of a new generation (e.g. a new iframe just mounted). */ reset() {
        this.ready = false;
        this.pending = null;
    }
    /** Call when the current generation's iframe announces it is listening. */ markReady() {
        this.ready = true;
        this.trySend();
    }
    /** Call when a new bundle is ready to run. */ setPayload(payload) {
        this.pending = payload;
        this.trySend();
    }
    trySend() {
        if (!this.ready || this.pending === null) return;
        const payload = this.pending;
        this.pending = null;
        this.send(payload);
    }
}
}),
]})(),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/components/solve.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

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
  "chevron": "solve-module__0DhTmG__chevron",
  "codeSplit": "solve-module__0DhTmG__codeSplit",
  "company": "solve-module__0DhTmG__company",
  "criterion": "solve-module__0DhTmG__criterion",
  "criterionText": "solve-module__0DhTmG__criterionText",
  "dirty": "solve-module__0DhTmG__dirty",
  "editorPane": "solve-module__0DhTmG__editorPane",
  "editorPath": "solve-module__0DhTmG__editorPath",
  "editorPathActive": "solve-module__0DhTmG__editorPathActive",
  "empty": "solve-module__0DhTmG__empty",
  "evidence": "solve-module__0DhTmG__evidence",
  "explorer": "solve-module__0DhTmG__explorer",
  "explorerHint": "solve-module__0DhTmG__explorerHint",
  "explorerTitle": "solve-module__0DhTmG__explorerTitle",
  "fileName": "solve-module__0DhTmG__fileName",
  "fileRow": "solve-module__0DhTmG__fileRow",
  "fileTab": "solve-module__0DhTmG__fileTab",
  "fileTabActive": "solve-module__0DhTmG__fileTabActive",
  "folderName": "solve-module__0DhTmG__folderName",
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
  "readOnlyNote": "solve-module__0DhTmG__readOnlyNote",
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
  "treeList": "solve-module__0DhTmG__treeList",
  "treeRow": "solve-module__0DhTmG__treeRow",
  "treeRowActive": "solve-module__0DhTmG__treeRowActive",
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03pakh_uxoaxz._.js.map