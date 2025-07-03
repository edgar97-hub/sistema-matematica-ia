(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/store/auth.store.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAuthStore": (()=>useAuthStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        theme: "light",
        // Acciones
        setUser: (user, token)=>{
            console.log("AuthStore: Setting user and token", {
                user,
                token
            });
            set({
                user,
                token,
                isAuthenticated: !!user && !!token,
                isLoading: false,
                error: null
            });
        },
        logout: ()=>{
            console.log("AuthStore: Logging out");
            // Aquí también se podría llamar a un endpoint de logout del backend si es necesario
            // authService.logoutBackend(); // Ejemplo
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        },
        setCountryOfOrigin: (country)=>{
            set((state)=>({
                    user: state.user ? {
                        ...state.user,
                        countryOfOrigin: country
                    } : null
                }));
        },
        setLoading: (loading)=>set({
                isLoading: loading
            }),
        setError: (error)=>set({
                isLoading: false,
                error
            }),
        hydrateAuth: (initialUser, initialToken)=>{
            if (initialUser && initialToken) {
                console.log("AuthStore: Hydrating auth state", {
                    initialUser,
                    initialToken
                });
                set({
                    user: initialUser,
                    token: initialToken,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            } else {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });
            }
        },
        // Nuevas acciones para el tema
        setTheme: (theme)=>{
            console.log("AuthStore: Setting theme to", theme);
            set({
                theme
            });
        },
        toggleTheme: ()=>{
            const currentTheme = get().theme;
            let newTheme;
            if (currentTheme === "light") {
                newTheme = "dark";
            } else if (currentTheme === "dark") {
                newTheme = "light";
            } else {
                // Si es 'auto', y queremos cambiar, podemos ir a 'light' o 'dark'
                // o podrías tener una lógica más compleja para alternar 'auto' -> 'light' -> 'dark' -> 'auto'
                const prefersDark = "object" !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                newTheme = prefersDark ? "light" : "dark"; // Si es auto y oscuro, pasa a claro, y viceversa
            }
            console.log("AuthStore: Toggling theme to", newTheme);
            set({
                theme: newTheme
            });
        }
    }), {
    name: "pwa-auth-storage",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    // Opcional: si solo quieres persistir ciertas partes del estado
    partialize: (state)=>({
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            theme: state.theme
        }),
    onRehydrateStorage: ()=>(state)=>{
            console.log("AuthStore: State rehydrated from localStorage. Theme:", state?.theme);
            if (state) {
                state.isLoading = false;
            }
        }
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>RootLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$MantineProvider$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/core/MantineProvider/MantineProvider.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$ColorSchemeScript$2f$ColorSchemeScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/core/MantineProvider/ColorSchemeScript/ColorSchemeScript.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$Notifications$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/notifications/esm/Notifications.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const mantineTheme = {
    fontFamily: "Montserrat, sans-serif",
    primaryColor: "blue"
};
function RootLayout({ children }) {
    _s();
    const currentThemePreference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "RootLayout.useAuthStore[currentThemePreference]": (state)=>state.theme
    }["RootLayout.useAuthStore[currentThemePreference]"]);
    const [effectiveColorScheme, setEffectiveColorScheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RootLayout.useEffect": ()=>{
            let themeValue;
            if (currentThemePreference === "auto") {
                themeValue = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            } else {
                themeValue = currentThemePreference;
            }
            setEffectiveColorScheme(themeValue);
            // Aplicar clase al body para tus estilos CSS globales
            document.body.classList.remove("light-theme", "dark-theme");
            if (themeValue === "dark") {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.add("light-theme"); // Opcional, si tienes estilos específicos para .light-theme
            }
        }
    }["RootLayout.useEffect"], [
        currentThemePreference
    ]);
    // Escuchar cambios de tema del sistema si la preferencia es 'auto'
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RootLayout.useEffect": ()=>{
            if (currentThemePreference !== "auto") return;
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = {
                "RootLayout.useEffect.handleChange": (e)=>{
                    console.log("System theme changed, updating effective color scheme (if auto)");
                    const newSystemTheme = e.matches ? "dark" : "light";
                    setEffectiveColorScheme(newSystemTheme);
                    document.body.classList.remove("light-theme", "dark-theme");
                    document.body.classList.add(newSystemTheme === "dark" ? "dark-theme" : "light-theme");
                }
            }["RootLayout.useEffect.handleChange"];
            mediaQuery.addEventListener("change", handleChange);
            return ({
                "RootLayout.useEffect": ()=>mediaQuery.removeEventListener("change", handleChange)
            })["RootLayout.useEffect"];
        }
    }["RootLayout.useEffect"], [
        currentThemePreference
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "es",
        suppressHydrationWarning: true,
        className: effectiveColorScheme === "dark" ? "dark-theme" : "light-theme",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$ColorSchemeScript$2f$ColorSchemeScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorSchemeScript"], {
                        defaultColorScheme: currentThemePreference
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        charSet: "UTF-8"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                suppressHydrationWarning: true,
                className: effectiveColorScheme === "dark" ? "dark-theme" : "light-theme",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$MantineProvider$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MantineProvider"], {
                    theme: mantineTheme,
                    defaultColorScheme: effectiveColorScheme,
                    forceColorScheme: effectiveColorScheme,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$Notifications$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notifications"], {}, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        children
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(RootLayout, "iVK+IAyp3GB+y9KQ49j77R7xJtg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = RootLayout;
var _c;
__turbopack_context__.k.register(_c, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_ce322a40._.js.map