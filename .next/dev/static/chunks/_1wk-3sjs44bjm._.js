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
"[project]/components/FileTree.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileTree",
    ()=>FileTree,
    "buildTree",
    ()=>buildTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/solve.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    _s();
    const tree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FileTree.useMemo[tree]": ()=>buildTree(files)
    }["FileTree.useMemo[tree]"], [
        files
    ]);
    // Folders start open: these apps are small, and hunting for the bug should not
    // start with hunting for the file.
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].treeRow,
                        style: indent,
                        onClick: ()=>toggle(node.path),
                        "aria-expanded": !isCollapsed,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].chevron,
                                "aria-hidden": "true",
                                children: isCollapsed ? '▸' : '▾'
                            }, void 0, false, {
                                fileName: "[project]/components/FileTree.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].folderName,
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
                    !isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].treeList,
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].treeRow} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].treeRowActive : ''}`,
                style: indent,
                onClick: ()=>onSelect(file.path),
                "aria-current": isActive ? 'true' : undefined,
                title: isReadOnly ? `${file.path} — read-only` : file.path,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].chevron,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fileName,
                        children: node.name
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    dirtyPaths.has(file.path) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dirty,
                        "aria-label": "Modified",
                        children: "●"
                    }, void 0, false, {
                        fileName: "[project]/components/FileTree.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, this) : null,
                    isReadOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].lock,
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].explorer,
        "aria-label": "Files",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].explorerTitle,
                children: "Explorer"
            }, void 0, false, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].treeList,
                children: tree.map((node)=>renderNode(node, 0))
            }, void 0, false, {
                fileName: "[project]/components/FileTree.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].explorerHint,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].lock,
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
_s(FileTree, "PTUcliLQoHsWw92WAscbYCqGTc0=");
_c = FileTree;
var _c;
__turbopack_context__.k.register(_c, "FileTree");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$ready$2d$gate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/ready-gate.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function PreviewFrame({ files, entry, handlersPath, runToken, onConsole, onNetwork, onStatus }) {
    _s();
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
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
    // One gate for the component's whole life. `send` always reads
    // iframeRef.current at call time, so the gate does not need to be recreated
    // per generation -- only reset() needs to run per generation. See
    // src/preview/ready-gate.ts for why this is a plain class and not React
    // state: a prior version of this coordination, built from useState plus two
    // effects, had a real bug where a ref write (queuing the bundle) triggered
    // no re-render, so nothing re-checked readiness once the bundle finished --
    // silently dropping the "frame loaded before the bundle did" ordering,
    // which is the common case, not the edge case.
    const gateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    gateRef.current ??= new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$ready$2d$gate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReadyGate"](send);
    // Messages from the preview realm: console output, network activity, crashes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreviewFrame.useEffect": ()=>{
            function onMessage(event) {
                const data = event.data;
                if (!data || data.source !== 'debuglab-preview') return;
                if (data.type === 'frame-ready') {
                    gateRef.current.markReady();
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
    // Bundle on demand and hand the result to the gate, which sends it the
    // moment both the bundle and the (possibly not-yet-loaded) iframe are ready,
    // regardless of which one finishes first.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PreviewFrame.useEffect": ()=>{
            let cancelled = false;
            // A new runToken remounts the iframe below (key={runToken}): a brand new
            // document that has not announced itself yet. Reset the gate so a ready
            // signal left over from the PREVIOUS iframe generation can never cause
            // code to be sent into a frame that has not loaded its listener yet.
            gateRef.current.reset();
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
                gateRef.current.setCode(result.code);
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
        runToken
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
    }, runToken, false, {
        fileName: "[project]/components/PreviewFrame.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(PreviewFrame, "YIIqyU/M3uSjFsInqZ40t07fCJE=");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FileTree$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FileTree.tsx [app-client] (ecmascript)");
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
    const dirtyPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SolveScreen.useMemo[dirtyPaths]": ()=>new Set(question.files.filter({
                "SolveScreen.useMemo[dirtyPaths]": (f)=>contents[f.path] !== originals[f.path]
            }["SolveScreen.useMemo[dirtyPaths]"]).map({
                "SolveScreen.useMemo[dirtyPaths]": (f)=>f.path
            }["SolveScreen.useMemo[dirtyPaths]"]))
    }["SolveScreen.useMemo[dirtyPaths]"], [
        question.files,
        contents,
        originals
    ]);
    const dirty = dirtyPaths.size > 0;
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
                                lineNumber: 150,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spacer
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 152,
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
                                lineNumber: 154,
                                columnNumber: 23
                            }, this) : null,
                            building ? 'Building' : 'Run'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btn,
                        onClick: reset,
                        disabled: busy || !dirty,
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 157,
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
                                lineNumber: 165,
                                columnNumber: 19
                            }, this) : null,
                            stage === 'checking' ? 'Checking build' : stage === 'grading' ? 'Grading' : 'Submit'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].btn,
                        onClick: toggleTheme,
                        "aria-label": "Toggle colour theme",
                        children: theme === 'dark' ? 'Light' : 'Dark'
                    }, void 0, false, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SolveScreen.tsx",
                lineNumber: 148,
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
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                                children: question.title
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLabel,
                                children: "Scenario"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].prose,
                                children: question.scenario
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLabel,
                                children: "Reported symptom"
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].symptom,
                                children: question.symptom
                            }, void 0, false, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 182,
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
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this),
                                    question.tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tag,
                                            children: t
                                        }, t, false, {
                                            fileName: "[project]/components/SolveScreen.tsx",
                                            lineNumber: 187,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 184,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 174,
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
                                        lineNumber: 196,
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
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            rightTab === 'code' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].codeSplit,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FileTree$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileTree"], {
                                        files: question.files,
                                        activePath: activePath,
                                        dirtyPaths: dirtyPaths,
                                        onSelect: setActivePath
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 216,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editorPane,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editorPath,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editorPathActive,
                                                        children: activePath
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SolveScreen.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 19
                                                    }, this),
                                                    activeReadOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].readOnlyNote,
                                                        children: "read-only"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SolveScreen.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 21
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
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
                                                    lineNumber: 230,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 229,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 215,
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
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this),
                                    building ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].overlay,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$solve$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                                            }, void 0, false, {
                                                fileName: "[project]/components/SolveScreen.tsx",
                                                lineNumber: 255,
                                                columnNumber: 19
                                            }, this),
                                            " Bundling your app…"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 254,
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
                                                lineNumber: 261,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/SolveScreen.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SolveScreen.tsx",
                                lineNumber: 243,
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
                                lineNumber: 270,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SolveScreen.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SolveScreen.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SolveScreen.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_s(SolveScreen, "EUcQN0/p7PKlMyeX8NU9PkEJXNw=", false, function() {
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
"[project]/src/bundling/resolve.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/bundling/resolve.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$interceptor$2d$source$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/preview/interceptor-source.ts [app-client] (ecmascript)");
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
    g[GLOBAL_KEY] ??= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$esbuild$2d$wasm$2f$lib$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialize"]({
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
function reportToServer(event, payload) {
    // Fire-and-forget. If this fails (e.g. the dev server isn't the local one),
    // the preview must still work -- this is diagnostics, not a dependency.
    try {
        void fetch('/api/debug/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event,
                ...payload
            }),
            keepalive: true
        }).catch(()=>{});
    } catch  {
    // ignore
    }
}
async function bundlePreview(options) {
    await ensureInitialised();
    const map = new Map(options.files.map((f)=>[
            f.path,
            f.content
        ]));
    // Pairing check: the bundler is only ever as correct as its inputs, and a
    // path/content mismatch here would surface as a baffling resolve error in an
    // unrelated file. Reported to the server log so it is readable without
    // DevTools -- see app/api/debug/log/route.ts.
    reportToServer('bundling', {
        entry: options.entry,
        handlersPath: options.handlersPath,
        files: options.files.map((f)=>({
                path: f.path,
                bytes: f.content.length,
                startsWith: f.content.slice(0, 50)
            }))
    });
    // The interceptor must patch fetch before the app evaluates. Module bodies run
    // in import order, so importing it first in the entry is what guarantees that.
    const imports = [];
    if (options.handlersPath) {
        map.set(INTERCEPTOR, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$preview$2f$interceptor$2d$source$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERCEPTOR_MODULE"].replace('./__HANDLERS__', `./${options.handlersPath}`));
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
                    namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
                };
                if (REACT_EXTERNALS.includes(args.path)) return {
                    path: args.path,
                    external: true
                };
                if (!args.path.startsWith('.')) return {
                    path: args.path,
                    external: true
                };
                const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveRelative"])(args.importer, args.path, map);
                if (!resolved) {
                    // Say what was actually available. A bare "cannot resolve" forces
                    // whoever hits this to guess at the file set, and the file set is the
                    // one thing they cannot see.
                    const available = [
                        ...map.keys()
                    ].filter((k)=>!k.startsWith('__debuglab')).sort();
                    const importerContent = map.get(args.importer);
                    reportToServer('unresolved-import', {
                        specifier: args.path,
                        importer: args.importer,
                        importerLoaded: map.has(args.importer),
                        importerStartsWith: importerContent?.slice(0, 80) ?? null,
                        available
                    });
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
                    namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
                };
            });
            build.onLoad({
                filter: /.*/,
                namespace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIRTUAL_NAMESPACE"]
            }, (args)=>({
                    contents: map.get(args.path) ?? '',
                    loader: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loaderFor"])(args.path)
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
                    file: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripNamespace"])(m.location?.file) ?? options.entry,
                    line: m.location?.line ?? 0,
                    column: m.location?.column ?? 0,
                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$bundling$2f$resolve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripNamespaceEverywhere"])(m.text)
                }))
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/preview/interceptor-source.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/preview/ready-gate.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Coordinates two signals that can arrive in either order -- "the iframe has
 * loaded and is listening" and "the bundle is ready" -- and guarantees `send`
 * is called exactly once per generation, with the latest code, only once both
 * signals have arrived for that SAME generation.
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
    pendingCode;
    constructor(send){
        this.send = send;
        this.ready = false;
        this.pendingCode = null;
    }
    /** Call at the start of a new generation (e.g. a new iframe just mounted). */ reset() {
        this.ready = false;
        this.pendingCode = null;
    }
    /** Call when the current generation's iframe announces it is listening. */ markReady() {
        this.ready = true;
        this.trySend();
    }
    /** Call when a new bundle is ready to run. */ setCode(code) {
        this.pendingCode = code;
        this.trySend();
    }
    trySend() {
        if (!this.ready || this.pendingCode === null) return;
        const code = this.pendingCode;
        this.pendingCode = null;
        this.send(code);
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
]);

//# sourceMappingURL=_1wk-3sjs44bjm._.js.map