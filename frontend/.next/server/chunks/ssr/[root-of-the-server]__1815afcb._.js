module.exports = {

"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "apiClient": (()=>apiClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)"); // Importa InternalAxiosRequestConfig
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)"); // Ajusta la ruta si 'store' está en otra parte
;
;
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:3000/api") || "http://localhost:3001/api"
});
// Interceptor para añadir el token JWT a las peticiones
apiClient.interceptors.request.use((config)=>{
    // Añadir tipo explícito
    // Obtener el token del store de Zustand
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Opcional: Interceptor de respuesta para manejar errores 401 (Unauthorized) globalmente
apiClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response && error.response.status === 401) {
        // Si es un error 401, desloguear al usuario.
        // Evita llamar a logout si ya estamos en la página de login para no crear bucles.
        if ("undefined" !== "undefined" && !window.location.pathname.endsWith("/login")) {
            "TURBOPACK unreachable";
        // La redirección a /login debería ocurrir por el guard del layout o el propio logout
        // o una lógica de redirección en el RootLayout al cambiar isAuthenticated.
        }
    }
    return Promise.reject(error);
});
;
}}),
"[project]/src/lib/services/order.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// En orderService.ts
__turbopack_context__.s({
    "orderService": (()=>orderService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)"); // Asume que tienes un apiClient configurado
;
const orderService = {
    async createOrderPwa (formData, authToken) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/orders", formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    },
    async getMyOrdersPwa (pagination, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get("/orders/pwa/my-orders", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: pagination
        });
        return response.data;
    },
    async getOrderByIdPwa (orderId, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
}}),
"[project]/src/types/order.types.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Coincide con UserEntity del backend (campos relevantes para la tabla/edición)
// export interface OrderFE {
//   id: string;
//   googleId?: string;
//   email: string;
//   name: string;
//   pictureUrl?: string;
//   countryOfOrigin?: string;
//   creditBalance: number;
//   isActive: boolean;
//   updatedAt: string; // O Date
// }
// Para la respuesta de la API de listado
__turbopack_context__.s({
    "OrderPipelineStatus": (()=>OrderPipelineStatus)
});
var OrderPipelineStatus = /*#__PURE__*/ function(OrderPipelineStatus) {
    OrderPipelineStatus["PENDING"] = "PENDING";
    OrderPipelineStatus["OCR_PENDING"] = "OCR_PENDING";
    OrderPipelineStatus["PROCESSING_OCR"] = "PROCESSING_OCR";
    OrderPipelineStatus["OCR_SUCCESSFUL_CREDIT_PENDING"] = "OCR_SUCCESSFUL_CREDIT_PENDING";
    OrderPipelineStatus["OCR_FAILED"] = "OCR_FAILED";
    OrderPipelineStatus["CREDIT_DEDUCTION_FAILED"] = "CREDIT_DEDUCTION_FAILED";
    OrderPipelineStatus["AI_SOLUTION_PENDING"] = "AI_SOLUTION_PENDING";
    OrderPipelineStatus["AI_SOLUTION_FAILED"] = "AI_SOLUTION_FAILED";
    OrderPipelineStatus["GENERATING_AUDIO_PENDING"] = "GENERATING_AUDIO_PENDING";
    OrderPipelineStatus["AUDIO_FAILED"] = "AUDIO_FAILED";
    OrderPipelineStatus["RENDERING_ANIMATION_PENDING"] = "RENDERING_ANIMATION_PENDING";
    OrderPipelineStatus["ANIMATION_FAILED"] = "ANIMATION_FAILED";
    OrderPipelineStatus["ASSEMBLING_FINAL_PENDING"] = "ASSEMBLING_FINAL_PENDING";
    OrderPipelineStatus["ASSEMBLY_FAILED"] = "ASSEMBLY_FAILED";
    OrderPipelineStatus["COMPLETED"] = "COMPLETED";
    OrderPipelineStatus["FAILED_GENERAL"] = "FAILED_GENERAL";
    OrderPipelineStatus["GENERATING_VIDEO_PENDING"] = "GENERATING_VIDEO_PENDING";
    return OrderPipelineStatus;
}({});
}}),
"[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>OrderStatusPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/core/Box/Box.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Title$2f$Title$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Title/Title.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Text/Text.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stepper$2f$Stepper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Stepper/Stepper.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Loader$2f$Loader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Loader/Loader.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Paper$2f$Paper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Paper/Paper.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Center/Center.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Alert/Alert.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Button/Button.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Modal$2f$Modal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Modal/Modal.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$order$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/order.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/order.types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCircleCheck$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCircleCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconCircleCheck.mjs [app-ssr] (ecmascript) <export default as IconCircleCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconAlertCircle.mjs [app-ssr] (ecmascript) <export default as IconAlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
const statusSteps = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].OCR_PENDING]: {
        step: 1,
        label: "Lectura de Imagen (OCR)"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].PROCESSING_OCR]: {
        step: 1,
        label: "Procesando de Imagen (OCR)"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].OCR_SUCCESSFUL_CREDIT_PENDING]: {
        step: 2,
        label: "Análisis con IA"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].AI_SOLUTION_PENDING]: {
        step: 2,
        label: "Análisis con IA"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].GENERATING_AUDIO_PENDING]: {
        step: 2,
        label: "Creando Video"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].RENDERING_ANIMATION_PENDING]: {
        step: 3,
        label: "Creando Video"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].ASSEMBLING_FINAL_PENDING]: {
        step: 3,
        label: "Creando Video"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].COMPLETED]: {
        step: 4,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].PENDING]: {
        step: 9,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].OCR_FAILED]: {
        step: 10,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].CREDIT_DEDUCTION_FAILED]: {
        step: 11,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].AI_SOLUTION_FAILED]: {
        step: 12,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].AUDIO_FAILED]: {
        step: 5,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].ANIMATION_FAILED]: {
        step: 5,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].ASSEMBLY_FAILED]: {
        step: 6,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].FAILED_GENERAL]: {
        step: 7,
        label: "Completado"
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].GENERATING_VIDEO_PENDING]: {
        step: 8,
        label: "Completado"
    }
};
const errorStates = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].OCR_FAILED,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].CREDIT_DEDUCTION_FAILED,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].AI_SOLUTION_FAILED,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].FAILED_GENERAL
];
function OrderStatusPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const orderId = params.orderId;
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((state)=>state.token);
    const [selectedVideoUrl, setSelectedVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { data: order, isLoading, isError, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "order-status",
            orderId
        ],
        queryFn: ()=>{
            if (!token) throw new Error("No autenticado");
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$order$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderService"].getOrderByIdPwa(orderId, token); // Necesitas este método en el servicio
        },
        refetchInterval: (query)=>{
            const orderData = query.state.data;
            if (orderData?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].COMPLETED || orderData?.status && errorStates.includes(orderData?.status)) {
                return false;
            }
            return 1000; // Volver a consultar cada 3 segundos
        },
        enabled: !!orderId && !!token
    });
    const activeStep = order ? statusSteps[order?.status].step ?? -1 : 0;
    console.log("activeStep", activeStep);
    const isFailed = order ? errorStates.includes(order.status) : false;
    if (isLoading && !order) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Center"], {
            h: "50vh",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Loader$2f$Loader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Loader"], {}, void 0, false, {
                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
            lineNumber: 115,
            columnNumber: 7
        }, this);
    }
    if (isError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Center"], {
            h: "50vh",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                color: "red",
                title: "Error",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {}, void 0, false, {
                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                    lineNumber: 124,
                    columnNumber: 48
                }, void 0),
                children: [
                    "No se pudo cargar el estado de la orden: ",
                    error.message
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this);
    }
    const backendBaseUrl = ("TURBOPACK compile-time value", "http://localhost:3000") || "";
    const fullVideoUrl = orderId ? `${backendBaseUrl}/uploads/final_videos/order_${orderId}_final.mp4` : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
        p: "lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Title$2f$Title$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
                order: 2,
                mb: "xl",
                children: [
                    "Estado de la Resolución (Orden N°: ",
                    order?.id,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Paper$2f$Paper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Paper"], {
                withBorder: true,
                shadow: "md",
                p: "xl",
                radius: "md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stepper$2f$Stepper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Stepper"], {
                        active: activeStep,
                        color: isFailed ? "red" : "blue",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stepper$2f$Stepper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Stepper"].Step, {
                                label: "Paso 1",
                                description: "Lectura de Imagen"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stepper$2f$Stepper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Stepper"].Step, {
                                label: "Paso 2",
                                description: "Análisis con IA"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stepper$2f$Stepper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Stepper"].Step, {
                                label: "Paso 3",
                                description: "Generando Video"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stepper$2f$Stepper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Stepper"].Step, {
                                label: "Paso 4",
                                description: "Completado"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Center"], {
                        p: "xl",
                        children: order?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$order$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderPipelineStatus"].COMPLETED ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                            style: {
                                textAlign: "center"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCircleCheck$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCircleCheck$3e$__["IconCircleCheck"], {
                                    size: 48,
                                    color: "teal"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                    size: "lg",
                                    mt: "md",
                                    children: "¡Tu video está listo!"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>{
                                        setSelectedVideoUrl(fullVideoUrl);
                                    },
                                    mt: "lg",
                                    children: "Ver Video Ahora"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                            lineNumber: 152,
                            columnNumber: 13
                        }, this) : isFailed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                            color: "red",
                            title: "Ha Ocurrido un Error",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {}, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                lineNumber: 170,
                                columnNumber: 21
                            }, void 0),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                    children: "No se pudo procesar tu solicitud."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                    size: "xs",
                                    mt: "sm",
                                    children: [
                                        "Motivo: ",
                                        order?.errorMessage || "Error desconocido."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    component: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
                                    href: "/orders/new",
                                    mt: "lg",
                                    variant: "outline",
                                    children: "Intentar de Nuevo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                            style: {
                                textAlign: "center"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Loader$2f$Loader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Loader"], {}, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                    size: "lg",
                                    mt: "md",
                                    children: [
                                        "Procesando:",
                                        " ",
                                        statusSteps[order?.status]?.label || "Iniciando..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 188,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                    c: "dimmed",
                                    mt: "xs",
                                    children: "Esto puede tardar unos minutos. Puedes esperar en esta página o volver más tarde."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                            lineNumber: 186,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Modal$2f$Modal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Modal"], {
                opened: !!selectedVideoUrl,
                onClose: ()=>setSelectedVideoUrl(null),
                title: "Video de la Resolución",
                size: "xl",
                centered: true,
                children: selectedVideoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                    src: fullVideoUrl,
                    controls: true,
                    autoPlay: true,
                    style: {
                        width: "100%"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                    lineNumber: 210,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(pwa_app)/orders/[orderId]/status/page.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__1815afcb._.js.map