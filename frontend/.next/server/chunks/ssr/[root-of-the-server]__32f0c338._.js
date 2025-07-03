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
"[project]/src/lib/services/country.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/services/country.service.ts
__turbopack_context__.s({
    "countryService": (()=>countryService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)"); // Asume tu apiClient configurado
;
// Asume que en tu backend el controlador está en '/countries' o '/educational-content/countries'
const API_ENDPOINT = "/countries"; // AJUSTA ESTO A TU ENDPOINT REAL
const countryService = {
    async getCountries () {
        // El backend podría devolver paginado o un array simple
        // const params: any = { page, limit };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`${API_ENDPOINT}`); // , { params });
        return response.data;
    },
    async getCountryById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`${API_ENDPOINT}/${id}`);
        return response.data;
    },
    async createCountry (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(API_ENDPOINT, data);
        return response.data;
    },
    async updateCountry (id, data) {
        console.log("data", data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(`${API_ENDPOINT}/${id}`, data);
        return response.data;
    },
    async deleteCountry (id) {
        // O podría ser un PATCH para cambiar isActive a false (soft delete)
        if (id) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`${API_ENDPOINT}/${id}`);
        }
    },
    // Endpoint PWA que ya tenías en el backend para listar países activos
    async getPwaActiveCountries () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`${API_ENDPOINT}/pwa-list`);
        return response.data;
    },
    async getActiveCountriesForPwa () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`${API_ENDPOINT}/pwa-list`);
        return response.data;
    }
};
}}),
"[project]/src/lib/services/educational-stage.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/services/educational-stage.service.ts
__turbopack_context__.s({
    "educationalStageService": (()=>educationalStageService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)");
;
const educationalStageService = {
    async getEducationalStages (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get("/educational-stages", {
            params
        });
        return response.data;
    },
    async getEducationalStageById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/educational-stages/${id}`);
        return response.data;
    },
    async createEducationalStage (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/educational-stages", data);
        return response.data;
    },
    async updateEducationalStage (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(`/educational-stages/${id}`, data);
        return response.data;
    },
    async deleteEducationalStage (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`/educational-stages/${id}`);
    },
    async getEducationalStagesForPwa (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/educational-stages/by-id-country/${id}/pwa-list`);
        return response.data;
    },
    async getStagesByCountryNameForPwa (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/educational-stages/by-name-country/${id}/pwa-list`);
        return response.data;
    }
};
}}),
"[project]/src/lib/services/educational-subdivision.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/services/educational-subdivision.service.ts
__turbopack_context__.s({
    "educationalSubdivisionService": (()=>educationalSubdivisionService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)");
;
const educationalSubdivisionService = {
    async getEducationalSubdivisions (params) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get("/educational-subdivisions", {
            params
        });
        return response.data;
    },
    async getEducationalSubdivisionById (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/educational-subdivisions/${id}`);
        return response.data;
    },
    async createEducationalSubdivision (data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/educational-subdivisions", data);
        return response.data;
    },
    async updateEducationalSubdivision (id, data) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(`/educational-subdivisions/${id}`, data);
        return response.data;
    },
    async deleteEducationalSubdivision (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`/educational-subdivisions/${id}`);
    },
    async getSubdivisionsByStageIdForPwa (id) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/educational-subdivisions/by-stage/${id}/pwa-list`);
        return response.data;
    }
};
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
"[project]/src/app/(pwa_app)/orders/new/new-order-page.module.css [app-ssr] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "imagePreviewContainer": "new-order-page-module__RcyY7a__imagePreviewContainer",
  "mantine-Button-root": "new-order-page-module__RcyY7a__mantine-Button-root",
  "mantine-FileInput-root": "new-order-page-module__RcyY7a__mantine-FileInput-root",
  "mantine-Group-root": "new-order-page-module__RcyY7a__mantine-Group-root",
  "mantine-Paper-root": "new-order-page-module__RcyY7a__mantine-Paper-root",
  "mantine-Select-root": "new-order-page-module__RcyY7a__mantine-Select-root",
  "mantine-Stack-root": "new-order-page-module__RcyY7a__mantine-Stack-root",
  "mantine-Textarea-root": "new-order-page-module__RcyY7a__mantine-Textarea-root",
  "newOrderContainer": "new-order-page-module__RcyY7a__newOrderContainer",
  "pageTitle": "new-order-page-module__RcyY7a__pageTitle",
});
}}),
"[project]/src/app/(pwa_app)/orders/new/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// // src/app/(pwa_app)/orders/new/page.tsx
// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Title,
//   Text,
//   Paper,
//   Button,
//   Group,
//   FileInput,
//   Select,
//   Textarea,
//   LoadingOverlay,
//   Alert,
//   Stepper,
//   ThemeIcon,
//   rem,
//   Center,
// } from "@mantine/core";
// import { useForm, zodResolver } from "@mantine/form";
// import { z } from "zod";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { notifications } from "@mantine/notifications";
// import {
//   IconUpload,
//   IconMapPin,
//   IconSchool,
//   IconListDetails,
//   IconClipboardText,
//   IconDeviceFloppy,
//   IconAlertCircle,
//   IconCircleCheck,
//   IconPhoto,
//   IconProgress,
//   IconProgressCheck,
//   IconMoodShare,
// } from "@tabler/icons-react";
// import { useAuthStore } from "../../../../store/auth.store"; // Ajusta ruta
// import { countryService } from "../../../../lib/services/country.service"; // Ajusta ruta
// import { educationalStageService } from "../../../../lib/services/educational-stage.service"; // Ajusta ruta
// import { educationalSubdivisionService } from "../../../../lib/services/educational-subdivision.service"; // Ajusta ruta
// import {
//   orderService,
//   CreateOrderFrontendData,
// } from "../../../../lib/services/order.service"; // Ajusta ruta
// import {
//   CountryFE,
//   EducationalStageFE,
//   EducationalSubdivisionFE,
// } from "../../../../types/educational-content.types"; // Ajusta ruta
// import classes from "./new-order-page.module.css"; // Crearemos este CSS Module
// import Link from "next/link";
// // Esquema de validación con Zod
// const MAX_FILE_SIZE_MB = 10;
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
// const newOrderSchema = z.object({
//   imageFile: z
//     .custom<File | null>((file) => file instanceof File, {
//       message: "Se requiere una imagen del problema.",
//     })
//     .refine(
//       (file) => file && file.size <= MAX_FILE_SIZE_BYTES,
//       `El tamaño máximo del archivo es ${MAX_FILE_SIZE_MB}MB.`
//     )
//     .refine(
//       (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
//       "Solo se permiten imágenes JPG, JPEG o PNG."
//     ),
//   countrySelected: z.string().min(1, { message: "Debe seleccionar un país." }),
//   educationalStageSelected: z
//     .string()
//     .min(1, { message: "Debe seleccionar una etapa educativa." }),
//   subdivisionGradeSelected: z.string().nullable().optional(), // Opcional, no todos los stages tienen subdivisiones
//   topic: z
//     .string()
//     .min(3, { message: "El tema debe tener al menos 3 caracteres." })
//     .max(250, { message: "Máximo 250 caracteres." }),
// });
// type NewOrderFormData = z.infer<typeof newOrderSchema>;
// // QueryClientProvider ya debería estar en (pwa_app)/layout.tsx
// export default function NewOrderPage() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const { user, token } = useAuthStore();
//   const [activeStep, setActiveStep] = useState(0); // Para el Stepper de Mantine
//   const form = useForm<NewOrderFormData>({
//     initialValues: {
//       imageFile: null as File | null, // Tipo File
//       countrySelected: user?.countryOfOrigin || "", // Pre-poblar con el país del usuario si existe
//       educationalStageSelected: "",
//       subdivisionGradeSelected: null,
//       topic: "",
//     },
//     validate: zodResolver(newOrderSchema),
//   });
//   // Cargar países
//   const { data: countries, isLoading: isLoadingCountries } = useQuery<
//     CountryFE[],
//     Error
//   >({
//     queryKey: ["pwa-active-countries"],
//     queryFn: () => countryService.getActiveCountriesForPwa(), // Tu servicio para PWA
//   });
//   const countryOptions = useMemo(
//     () => countries?.map((c) => ({ value: c.name, label: c.name })) || [],
//     [countries]
//   );
//   // Cargar etapas cuando cambia el país seleccionado
//   const selectedCountryName = form.values.countrySelected;
//   const { data: stages, isLoading: isLoadingStages } = useQuery<
//     EducationalStageFE[],
//     Error
//   >({
//     queryKey: ["pwa-stages-by-country", selectedCountryName],
//     queryFn: () =>
//       selectedCountryName
//         ? educationalStageService.getStagesByCountryNameForPwa(
//             selectedCountryName
//           )
//         : Promise.resolve([]),
//     enabled: !!selectedCountryName,
//   });
//   const stageOptions = useMemo(
//     () =>
//       (Array.isArray(stages) ? stages : [])?.map((s) => ({
//         value: s.name,
//         label: s.name,
//       })) || [],
//     [stages]
//   );
//   // Cargar subdivisiones cuando cambia la etapa seleccionada
//   const selectedStageName = form.values.educationalStageSelected;
//   const { data: subdivisions, isLoading: isLoadingSubdivisions } = useQuery<
//     EducationalSubdivisionFE[],
//     Error
//   >({
//     queryKey: [
//       "pwa-subdivisions-by-stage",
//       selectedStageName,
//       selectedCountryName,
//     ], // Añade country para refetch si cambia
//     queryFn: () => {
//       if (selectedStageName && stages) {
//         const currentStage = (Array.isArray(stages) ? stages : []).find(
//           (s) => s.name === selectedStageName
//         );
//         if (currentStage) {
//           console.log("currentStage", currentStage);
//           return educationalSubdivisionService.getSubdivisionsByStageIdForPwa(
//             currentStage.id.toString()
//           );
//         }
//       }
//       return Promise.resolve([]);
//     },
//     enabled: !!selectedStageName && !!stages,
//   });
//   const subdivisionOptions = useMemo(
//     () =>
//       (Array.isArray(subdivisions) ? subdivisions : [])?.map((s) => ({
//         value: s.name,
//         label: s.name,
//       })) || [],
//     [subdivisions]
//   );
//   // Efecto para resetear etapa y subdivisión si cambia el país
//   useEffect(() => {
//     form.setFieldValue("educationalStageSelected", "");
//     form.setFieldValue("subdivisionGradeSelected", null);
//   }, [selectedCountryName]); // Solo depende de selectedCountryName
//   // Efecto para resetear subdivisión si cambia la etapa
//   useEffect(() => {
//     form.setFieldValue("subdivisionGradeSelected", null);
//   }, [selectedStageName]); // Solo depende de selectedStageName
//   // Mutación para crear la orden
//   const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } =
//     useMutation({
//       mutationFn: (formData: CreateOrderFrontendData) => {
//         // CreateOrderFrontendData debe esperar FormData
//         if (!token) throw new Error("No autenticado.");
//         return orderService.createOrderPwa(formData, token); // Necesitas este método en orderService
//       },
//       onSuccess: (newOrder: any) => {
//         notifications.show({
//           title: "Solicitud Enviada",
//           message: `Tu problema matemático (Orden N°: ${
//             newOrder.code || newOrder.id
//           }) está siendo procesado.`,
//           color: "green",
//           icon: <IconCircleCheck size={18} />,
//         });
//         useAuthStore.getState().setUser(
//           {
//             ...user!,
//             credits: user!.credits - (newOrder.creditsConsumed || 1),
//           },
//           token
//         );
//         queryClient.invalidateQueries({ queryKey: ["pwa-user-orders"] });
//         queryClient.invalidateQueries({
//           queryKey: ["pwa-user-profile", user?.id],
//         });
//         // router.push("/orders"); // Ir al historial
//       },
//       onError: (error: any) => {
//         notifications.show({
//           title: "Error al Enviar Solicitud",
//           message:
//             error.message ||
//             "No se pudo crear la orden. Verifica tus créditos o intenta de nuevo.",
//           color: "red",
//           icon: <IconAlertCircle size={18} />,
//         });
//       },
//     });
//   const handleSubmit = async (values: NewOrderFormData) => {
//     if (!user || user.credits < 1) {
//       notifications.show({
//         title: "Créditos Insuficientes",
//         message: "No tienes suficientes créditos para esta operación.",
//         color: "orange",
//       });
//       router.push("/credits"); // Sugerir comprar créditos
//       return;
//     }
//     const formDataPayload = new FormData();
//     formDataPayload.append("imageFile", values.imageFile!); // El '!' asume que la validación ya pasó
//     formDataPayload.append("countrySelected", values.countrySelected);
//     formDataPayload.append(
//       "educationalStageSelected",
//       values.educationalStageSelected
//     );
//     if (values.subdivisionGradeSelected) {
//       formDataPayload.append(
//         "subdivisionGradeSelected",
//         values.subdivisionGradeSelected
//       );
//     }
//     formDataPayload.append("topic", values.topic);
//     await createOrderMutation(formDataPayload as any); // El servicio debe esperar FormData
//   };
//   const nextStep = () =>
//     setActiveStep((current) => (current < 2 ? current + 1 : current));
//   const prevStep = () =>
//     setActiveStep((current) => (current > 0 ? current - 1 : current));
//   if (!user) {
//     // Si no hay usuario (aunque el layout PWA debería proteger esto)
//     return (
//       <Center p="xl">
//         <Text>Debes iniciar sesión para crear una nueva resolución.</Text>
//       </Center>
//     );
//   }
//   return (
//     <Box p="lg" className={classes.newOrderContainer}>
//       <Title order={2} className={classes.pageTitle} mb="xl">
//         <IconMoodShare
//           size={32}
//           style={{ marginRight: "12px", verticalAlign: "bottom" }}
//         />
//         Nueva Resolución Matemática
//       </Title>
//       <Paper withBorder shadow="md" p="xl" radius="md">
//         <Stepper
//           active={activeStep}
//           onStepClick={setActiveStep}
//           allowNextStepsSelect={false}
//           color="blue"
//           mb="xl"
//         >
//           <Stepper.Step
//             label="Subir Problema"
//             description="Imagen y tema"
//             icon={<IconPhoto size={18} />}
//             loading={isCreatingOrder && activeStep === 0}
//           >
//             <FileInput
//               label="Imagen del Problema Matemático"
//               placeholder="Selecciona o arrastra una imagen (JPG, PNG)"
//               required
//               accept="image/png,image/jpeg,image/jpg"
//               {...form.getInputProps("imageFile")}
//               leftSection={<IconUpload size={18} />}
//               mb="md"
//               description={`Máx. ${MAX_FILE_SIZE_MB}MB. Formatos: JPG, PNG.`}
//             />
//             {form.values.imageFile && (
//               <Box
//                 mb="md"
//                 style={{
//                   border: "1px solid #ccc",
//                   padding: "10px",
//                   borderRadius: "4px",
//                 }}
//               >
//                 <Text size="sm" fw={500}>
//                   Vista previa:
//                 </Text>
//                 <img
//                   src={URL.createObjectURL(form.values.imageFile)}
//                   alt="Vista previa"
//                   style={{
//                     maxHeight: "150px",
//                     marginTop: "10px",
//                     borderRadius: "4px",
//                   }}
//                 />
//               </Box>
//             )}
//             <Textarea
//               label="Tema del Problema"
//               placeholder="Ej: Ecuaciones de segundo grado, Trigonometría básica"
//               required
//               {...form.getInputProps("topic")}
//               minRows={2}
//               autosize
//               mb="lg"
//             />
//             <Group justify="flex-end">
//               <Button
//                 onClick={nextStep}
//                 disabled={
//                   !form.values.imageFile ||
//                   !form.values.topic ||
//                   form.getInputProps("imageFile").error ||
//                   form.getInputProps("topic").error
//                 }
//               >
//                 Siguiente
//               </Button>
//             </Group>
//           </Stepper.Step>
//           <Stepper.Step
//             label="Contexto Educativo"
//             description="País y Nivel"
//             icon={<IconSchool size={18} />}
//             loading={isCreatingOrder && activeStep === 1}
//           >
//             <Select
//               label="País para la Resolución"
//               placeholder="Selecciona un país"
//               data={isLoadingCountries ? [] : countryOptions}
//               required
//               searchable
//               nothingFoundMessage="País no encontrado"
//               {...form.getInputProps("countrySelected")}
//               disabled={isLoadingCountries}
//               mb="md"
//             />
//             <Select
//               label="Etapa Educativa"
//               placeholder={
//                 selectedCountryName
//                   ? "Selecciona una etapa"
//                   : "Selecciona un país primero"
//               }
//               data={isLoadingStages ? [] : stageOptions}
//               required
//               searchable
//               nothingFoundMessage="No hay etapas para este país"
//               {...form.getInputProps("educationalStageSelected")}
//               disabled={!selectedCountryName || isLoadingStages}
//               mb="md"
//             />
//             <Select
//               label="Subdivisión/Grado (Opcional)"
//               placeholder={
//                 selectedStageName
//                   ? "Selecciona una subdivisión"
//                   : "Selecciona una etapa primero"
//               }
//               data={isLoadingSubdivisions ? [] : subdivisionOptions}
//               searchable
//               nothingFoundMessage="No hay subdivisiones para esta etapa"
//               clearable
//               {...form.getInputProps("subdivisionGradeSelected")}
//               disabled={
//                 !selectedStageName ||
//                 isLoadingSubdivisions ||
//                 subdivisionOptions.length === 0
//               }
//               mb="lg"
//             />
//             <Group justify="space-between">
//               <Button variant="default" onClick={prevStep}>
//                 Anterior
//               </Button>
//               <Button
//                 onClick={nextStep}
//                 disabled={
//                   !form.values.countrySelected ||
//                   !form.values.educationalStageSelected ||
//                   form.getInputProps("countrySelected").error ||
//                   form.getInputProps("educationalStageSelected").error
//                 }
//               >
//                 Siguiente
//               </Button>
//             </Group>
//           </Stepper.Step>
//           <Stepper.Step
//             label="Confirmar y Enviar"
//             description="Revisar y usar crédito"
//             icon={<IconProgressCheck size={18} />}
//             loading={isCreatingOrder && activeStep === 2}
//           >
//             <Text size="sm" mb="md">
//               Estás a punto de usar{" "}
//               <Text span fw={700}>
//                 1 crédito
//               </Text>{" "}
//               para esta resolución.
//             </Text>
//             <Text size="sm" mb="lg">
//               Créditos disponibles:{" "}
//               <Text span fw={700}>
//                 {user?.credits || 0}
//               </Text>
//               .
//             </Text>
//             {user.credits < 1 && (
//               <Alert
//                 color="orange"
//                 title="Créditos Insuficientes"
//                 icon={<IconAlertCircle />}
//                 mb="lg"
//               >
//                 No tienes suficientes créditos.{" "}
//                 <Link href="/credits">
//                   <Text span component="a" c="blue" inherit>
//                     Compra más créditos aquí.
//                   </Text>
//                 </Link>
//               </Alert>
//             )}
//             <Group justify="space-between">
//               <Button
//                 variant="default"
//                 onClick={prevStep}
//                 disabled={isCreatingOrder}
//               >
//                 Anterior
//               </Button>
//               <Button
//                 type="button" // Cambiado de submit para que el form.onSubmit no se dispare aquí
//                 onClick={() => form.onSubmit(handleSubmit)()} // Llama a la función de submit del form
//                 loading={isCreatingOrder}
//                 disabled={
//                   isCreatingOrder ||
//                   (user ? user.credits < 1 : true) ||
//                   !form.isValid()
//                 } // Deshabilita si no hay créditos o form inválido
//                 leftSection={<IconDeviceFloppy size={18} />}
//                 color="green"
//               >
//                 {isCreatingOrder ? "Enviando..." : "Confirmar y Resolver"}
//               </Button>
//             </Group>
//           </Stepper.Step>
//           <Stepper.Completed>
//             <Center p="xl">
//               <Title order={4}>¡Solicitud enviada!</Title>
//               <Text>Tu problema está siendo procesado.</Text>
//               <Button component={Link} href="/orders" mt="md">
//                 Ver Mi Historial
//               </Button>
//             </Center>
//           </Stepper.Completed>
//         </Stepper>
//       </Paper>
//     </Box>
//   );
// }
__turbopack_context__.s({
    "default": (()=>NewOrderPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/core/Box/Box.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Title$2f$Title$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Title/Title.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Text/Text.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Paper$2f$Paper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Paper/Paper.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Button/Button.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Group/Group.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$FileInput$2f$FileInput$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/FileInput/FileInput.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Select/Select.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Textarea$2f$Textarea$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Textarea/Textarea.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Alert/Alert.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Center/Center.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stack$2f$Stack$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Stack/Stack.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$form$2f$esm$2f$use$2d$form$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/form/esm/use-form.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$form$2f$esm$2f$resolvers$2f$zod$2d$resolver$2f$zod$2d$resolver$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/form/esm/resolvers/zod-resolver/zod-resolver.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/dist/esm/index.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/dist/esm/v3/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/notifications/esm/notifications.store.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconUpload$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconUpload$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconUpload.mjs [app-ssr] (ecmascript) <export default as IconUpload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconAlertCircle.mjs [app-ssr] (ecmascript) <export default as IconAlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconMoodShare$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconMoodShare$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconMoodShare.mjs [app-ssr] (ecmascript) <export default as IconMoodShare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDeviceFloppy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDeviceFloppy$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconDeviceFloppy.mjs [app-ssr] (ecmascript) <export default as IconDeviceFloppy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCamera$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCamera$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconCamera.mjs [app-ssr] (ecmascript) <export default as IconCamera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconRotate2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconRotate2$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconRotate2.mjs [app-ssr] (ecmascript) <export default as IconRotate2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconProgress$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconProgress$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconProgress.mjs [app-ssr] (ecmascript) <export default as IconProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)"); // Ajusta ruta
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$country$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/country.service.ts [app-ssr] (ecmascript)"); // Ajusta ruta
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$educational$2d$stage$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/educational-stage.service.ts [app-ssr] (ecmascript)"); // Ajusta ruta
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$educational$2d$subdivision$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/educational-subdivision.service.ts [app-ssr] (ecmascript)"); // Ajusta ruta
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$order$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/order.service.ts [app-ssr] (ecmascript)"); // Ajusta ruta
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$pwa_app$292f$orders$2f$new$2f$new$2d$order$2d$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/(pwa_app)/orders/new/new-order-page.module.css [app-ssr] (css module)"); // Crearemos este CSS Module
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
;
;
;
;
;
;
// Esquema de validación con Zod
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg"
];
const newOrderSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    imageFile: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].custom((file)=>file instanceof File, {
        message: "Se requiere una imagen del problema."
    }).refine((file)=>file && file.size <= MAX_FILE_SIZE_BYTES, `El tamaño máximo del archivo es ${MAX_FILE_SIZE_MB}MB.`).refine((file)=>file && ACCEPTED_IMAGE_TYPES.includes(file.type), "Solo se permiten imágenes JPG, JPEG o PNG."),
    countrySelected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, {
        message: "Debe seleccionar un país."
    }),
    educationalStageSelected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, {
        message: "Debe seleccionar una etapa educativa."
    }),
    subdivisionGradeSelected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable().optional(),
    topic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, {
        message: "El tema debe tener al menos 3 caracteres."
    }).max(250, {
        message: "Máximo 250 caracteres."
    })
});
function NewOrderPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const { user, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$form$2f$esm$2f$use$2d$form$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        initialValues: {
            imageFile: null,
            countrySelected: user?.countryOfOrigin || "",
            educationalStageSelected: "",
            subdivisionGradeSelected: null,
            topic: ""
        },
        validate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$form$2f$esm$2f$resolvers$2f$zod$2d$resolver$2f$zod$2d$resolver$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zodResolver"])(newOrderSchema)
    });
    // Estado para la funcionalidad de la cámara
    const [isCameraActive, setIsCameraActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [capturedImagePreview, setCapturedImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mediaStreamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null); // Para almacenar la referencia al MediaStream
    const startCamera = ()=>{
        setIsCameraActive(true);
        setCapturedImagePreview(null);
        form.setFieldValue("imageFile", null);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isCameraActive) {
            const getMedia = async ()=>{
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    });
                    mediaStreamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    // No es necesario llamar a play() si el tag tiene el atributo autoPlay
                    }
                } catch (err) {
                    console.error("Error al acceder a la cámara:", err);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                        title: "Error de Cámara",
                        message: "No se pudo acceder a la cámara. Asegúrate de dar permisos.",
                        color: "red",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                            lineNumber: 638,
                            columnNumber: 19
                        }, this)
                    });
                    setIsCameraActive(false); // Volver al estado inicial si hay un error
                }
            };
            getMedia();
        } else {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track)=>track.stop());
                mediaStreamRef.current = null;
            }
        }
        return ()=>{
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track)=>track.stop());
            }
        };
    }, [
        isCameraActive
    ]);
    const stopCamera = ()=>{
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track)=>track.stop());
            mediaStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };
    // Función para tomar una foto
    const handleTakePhoto = ()=>{
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            // Asegurarse de que el canvas tenga las mismas dimensiones que el video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataUrl = canvas.toDataURL("image/png");
                setCapturedImagePreview(imageDataUrl);
                // Convertir Data URL a objeto File para el formulario
                fetch(imageDataUrl).then((res)=>res.blob()).then((blob)=>{
                    const file = new File([
                        blob
                    ], `photo-${Date.now()}.png`, {
                        type: "image/png"
                    });
                    form.setFieldValue("imageFile", file);
                    stopCamera(); // Detener la cámara después de tomar la foto
                }).catch((err)=>{
                    console.error("Error al convertir imagen a File:", err);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                        title: "Error al Procesar Imagen",
                        message: "No se pudo procesar la foto capturada.",
                        color: "red",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                            lineNumber: 702,
                            columnNumber: 21
                        }, this)
                    });
                });
            }
        }
    };
    // Función para volver a tomar la foto
    const handleRetakePhoto = ()=>{
        setCapturedImagePreview(null);
        form.setFieldValue("imageFile", null);
        startCamera(); // Reiniciar la cámara
    };
    // Cargar países
    const { data: countries, isLoading: isLoadingCountries } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "pwa-active-countries"
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$country$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["countryService"].getActiveCountriesForPwa()
    });
    const countryOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>countries?.map((c)=>({
                value: c.name,
                label: c.name
            })) || [], [
        countries
    ]);
    // Cargar etapas cuando cambia el país seleccionado
    const selectedCountryName = form.values.countrySelected;
    const { data: stages, isLoading: isLoadingStages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "pwa-stages-by-country",
            selectedCountryName
        ],
        queryFn: ()=>selectedCountryName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$educational$2d$stage$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["educationalStageService"].getStagesByCountryNameForPwa(selectedCountryName) : Promise.resolve([]),
        enabled: !!selectedCountryName
    });
    const stageOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(Array.isArray(stages) ? stages : [])?.map((s)=>({
                value: s.name,
                label: s.name
            })) || [], [
        stages
    ]);
    // Cargar subdivisiones cuando cambia la etapa seleccionada
    const selectedStageName = form.values.educationalStageSelected;
    const { data: subdivisions, isLoading: isLoadingSubdivisions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "pwa-subdivisions-by-stage",
            selectedStageName,
            selectedCountryName
        ],
        queryFn: ()=>{
            if (selectedStageName && stages) {
                const currentStage = (Array.isArray(stages) ? stages : []).find((s)=>s.name === selectedStageName);
                if (currentStage) {
                    console.log("currentStage", currentStage);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$educational$2d$subdivision$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["educationalSubdivisionService"].getSubdivisionsByStageIdForPwa(currentStage.id.toString());
                }
            }
            return Promise.resolve([]);
        },
        enabled: !!selectedStageName && !!stages
    });
    const subdivisionOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(Array.isArray(subdivisions) ? subdivisions : [])?.map((s)=>({
                value: s.name,
                label: s.name
            })) || [], [
        subdivisions
    ]);
    // Efecto para resetear etapa y subdivisión si cambia el país
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        form.setFieldValue("educationalStageSelected", "");
        form.setFieldValue("subdivisionGradeSelected", null);
    }, [
        selectedCountryName
    ]); // Solo depende de selectedCountryName
    // Efecto para resetear subdivisión si cambia la etapa
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        form.setFieldValue("subdivisionGradeSelected", null);
    }, [
        selectedStageName
    ]); // Solo depende de selectedStageName
    // Mutación para crear la orden
    const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (formData)=>{
            if (!token) throw new Error("No autenticado.");
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$order$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderService"].createOrderPwa(formData, token); // Necesitas este método en orderService
        },
        onSuccess: (newOrder)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Solicitud Recibida",
                message: `Tu problema (Orden N°: ${newOrder.code}) ha comenzado a procesarse.`,
                color: "blue",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconProgress$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconProgress$3e$__["IconProgress"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                    lineNumber: 812,
                    columnNumber: 17
                }, this)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState().setUser({
                ...user,
                credits: user.credits - (newOrder.creditsConsumed || 1)
            }, token);
            queryClient.invalidateQueries({
                queryKey: [
                    "pwa-user-orders"
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "pwa-user-profile",
                    user?.id
                ]
            });
            router.push(`/orders/${newOrder.id}/status`);
        },
        onError: (error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Error al Enviar Solicitud",
                message: error.message || "No se pudo crear la orden. Verifica tus créditos o intenta de nuevo.",
                color: "red",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                    lineNumber: 834,
                    columnNumber: 17
                }, this)
            });
        }
    });
    const handleSubmit = async (values)=>{
        if (!user || user.credits < 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Créditos Insuficientes",
                message: "No tienes suficientes créditos para esta operación.",
                color: "orange"
            });
            router.push("/credits");
            return;
        }
        const formDataPayload = new FormData();
        formDataPayload.append("imageFile", values.imageFile); // El '!' asume que la validación ya pasó
        formDataPayload.append("countrySelected", values.countrySelected);
        formDataPayload.append("educationalStageSelected", values.educationalStageSelected);
        if (values.subdivisionGradeSelected) {
            formDataPayload.append("subdivisionGradeSelected", values.subdivisionGradeSelected);
        }
        formDataPayload.append("topic", values.topic);
        await createOrderMutation(formDataPayload); // El servicio debe esperar FormData
    };
    if (!user) {
        // Si no hay usuario (aunque el layout PWA debería proteger esto)
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Center"], {
            p: "xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                children: "Debes iniciar sesión para crear una nueva resolución."
            }, void 0, false, {
                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                lineNumber: 872,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
            lineNumber: 871,
            columnNumber: 7
        }, this);
    }
    console.log("isCameraActive", isCameraActive);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
        p: "lg",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$pwa_app$292f$orders$2f$new$2f$new$2d$order$2d$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].newOrderContainer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Title$2f$Title$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
                order: 2,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$pwa_app$292f$orders$2f$new$2f$new$2d$order$2d$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].pageTitle,
                mb: "xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconMoodShare$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconMoodShare$3e$__["IconMoodShare"], {
                        size: 32,
                        style: {
                            marginRight: "12px",
                            verticalAlign: "bottom"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 880,
                        columnNumber: 9
                    }, this),
                    "Nueva Resolución Matemática"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                lineNumber: 879,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Paper$2f$Paper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Paper"], {
                withBorder: true,
                shadow: "md",
                p: "xl",
                radius: "md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                        justify: "center",
                        mb: "lg",
                        children: [
                            !isCameraActive && !capturedImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: startCamera,
                                leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCamera$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCamera$3e$__["IconCamera"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                    lineNumber: 893,
                                    columnNumber: 28
                                }, void 0),
                                variant: "outline",
                                children: "Tomar Foto"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 891,
                                columnNumber: 13
                            }, this),
                            (isCameraActive || capturedImagePreview) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>{
                                    stopCamera();
                                    setCapturedImagePreview(null);
                                    form.setFieldValue("imageFile", null);
                                },
                                leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconUpload$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconUpload$3e$__["IconUpload"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                    lineNumber: 906,
                                    columnNumber: 28
                                }, void 0),
                                variant: "outline",
                                children: "Subir Archivo"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 900,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 889,
                        columnNumber: 9
                    }, this),
                    !isCameraActive && !capturedImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$FileInput$2f$FileInput$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FileInput"], {
                        label: "Imagen del Problema Matemático",
                        placeholder: "Selecciona o arrastra una imagen (JPG, PNG)",
                        required: true,
                        accept: "image/png,image/jpeg,image/jpg",
                        ...form.getInputProps("imageFile"),
                        leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconUpload$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconUpload$3e$__["IconUpload"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                            lineNumber: 922,
                            columnNumber: 26
                        }, void 0),
                        mb: "md",
                        description: `Máx. ${MAX_FILE_SIZE_MB}MB. Formatos: JPG, PNG.`
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 916,
                        columnNumber: 11
                    }, this),
                    isCameraActive && !capturedImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stack$2f$Stack$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Stack"], {
                        align: "center",
                        mb: "md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                ref: videoRef,
                                style: {
                                    width: "100%",
                                    maxWidth: "400px",
                                    borderRadius: "8px"
                                },
                                autoPlay: true,
                                playsInline: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 930,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                ref: canvasRef,
                                style: {
                                    display: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 936,
                                columnNumber: 13
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleTakePhoto,
                                leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconCamera$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconCamera$3e$__["IconCamera"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                    lineNumber: 939,
                                    columnNumber: 28
                                }, void 0),
                                children: "Capturar Foto"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 937,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 929,
                        columnNumber: 11
                    }, this),
                    capturedImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                        mb: "md",
                        style: {
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "4px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                size: "sm",
                                fw: 500,
                                mb: "sm",
                                children: "Vista previa de la foto capturada:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 958,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: capturedImagePreview,
                                alt: "Vista previa de la foto capturada",
                                style: {
                                    maxHeight: "250px",
                                    maxWidth: "100%",
                                    borderRadius: "4px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 961,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleRetakePhoto,
                                leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconRotate2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconRotate2$3e$__["IconRotate2"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                    lineNumber: 972,
                                    columnNumber: 28
                                }, void 0),
                                variant: "outline",
                                mt: "md",
                                children: "Volver a Tomar Foto"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 970,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 947,
                        columnNumber: 11
                    }, this),
                    form.values.imageFile && !isCameraActive && !capturedImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
                        mb: "md",
                        style: {
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "4px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                size: "sm",
                                fw: 500,
                                children: "Vista previa:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 991,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: URL.createObjectURL(form.values.imageFile),
                                alt: "Vista previa",
                                style: {
                                    maxHeight: "150px",
                                    marginTop: "10px",
                                    borderRadius: "4px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 994,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 983,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Textarea$2f$Textarea$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                        label: "Tema del Problema",
                        placeholder: "Ej: Ecuaciones de segundo grado, Trigonometría básica",
                        required: true,
                        ...form.getInputProps("topic"),
                        minRows: 2,
                        autosize: true,
                        mb: "lg"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1006,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        label: "País para la Resolución",
                        placeholder: "Selecciona un país",
                        data: isLoadingCountries ? [] : countryOptions,
                        required: true,
                        searchable: true,
                        nothingFoundMessage: "País no encontrado",
                        ...form.getInputProps("countrySelected"),
                        disabled: isLoadingCountries,
                        mb: "md"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1016,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        label: "Etapa Educativa",
                        placeholder: selectedCountryName ? "Selecciona una etapa" : "Selecciona un país primero",
                        data: isLoadingStages ? [] : stageOptions,
                        required: true,
                        searchable: true,
                        nothingFoundMessage: "No hay etapas para este país",
                        ...form.getInputProps("educationalStageSelected"),
                        disabled: !selectedCountryName || isLoadingStages,
                        mb: "md"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1027,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        label: "Subdivisión/Grado (Opcional)",
                        placeholder: selectedStageName ? "Selecciona una subdivisión" : "Selecciona una etapa primero",
                        data: isLoadingSubdivisions ? [] : subdivisionOptions,
                        searchable: true,
                        nothingFoundMessage: "No hay subdivisiones para esta etapa",
                        clearable: true,
                        ...form.getInputProps("subdivisionGradeSelected"),
                        disabled: !selectedStageName || isLoadingSubdivisions || subdivisionOptions.length === 0,
                        mb: "lg"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1042,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                        size: "sm",
                        mb: "md",
                        children: [
                            "Estás a punto de usar",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                span: true,
                                fw: 700,
                                children: "1 crédito"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 1065,
                                columnNumber: 11
                            }, this),
                            " ",
                            "para esta resolución."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1063,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                        size: "sm",
                        mb: "lg",
                        children: [
                            "Créditos disponibles:",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                span: true,
                                fw: 700,
                                children: user?.credits || 0
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 1072,
                                columnNumber: 11
                            }, this),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1070,
                        columnNumber: 9
                    }, this),
                    user.credits < 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                        color: "orange",
                        title: "Créditos Insuficientes",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {}, void 0, false, {
                            fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                            lineNumber: 1081,
                            columnNumber: 19
                        }, void 0),
                        mb: "lg",
                        children: [
                            "No tienes suficientes créditos.",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/credits",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                    span: true,
                                    component: "a",
                                    c: "blue",
                                    inherit: true,
                                    children: "Compra más créditos aquí."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                    lineNumber: 1086,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 1085,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1078,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                        justify: "flex-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            onClick: ()=>form.onSubmit(handleSubmit)(),
                            loading: isCreatingOrder,
                            disabled: isCreatingOrder || (user ? user.credits < 1 : true) || !form.isValid(),
                            leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconDeviceFloppy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconDeviceFloppy$3e$__["IconDeviceFloppy"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                                lineNumber: 1103,
                                columnNumber: 26
                            }, void 0),
                            color: "green",
                            children: isCreatingOrder ? "Enviando..." : "Confirmar y Resolver"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                            lineNumber: 1094,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                        lineNumber: 1093,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
                lineNumber: 887,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(pwa_app)/orders/new/page.tsx",
        lineNumber: 878,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__32f0c338._.js.map