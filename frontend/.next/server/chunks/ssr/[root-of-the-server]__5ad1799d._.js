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
"[project]/src/lib/services/pwa-user.service.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/services/pwa-user.service.ts
__turbopack_context__.s({
    "pwaUserService": (()=>pwaUserService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)"); // Asume que tienes un apiClient configurado
;
const pwaUserService = {
    async getUsers (params) {
        const queryParams = {};
        // 1. Mapear Paginación (PaginationQueryDto)
        queryParams.page = params.pagination.pageIndex + 1; // API es 1-based, frontend (Mantine Table) es 0-based
        queryParams.limit = params.pagination.pageSize;
        // 2. Mapear Ordenamiento (SortUserDto)
        if (params.sorting && params.sorting.length > 0) {
            queryParams.sortField = params.sorting[0].id; // 'field' es lo que espera SortUserDto
            queryParams.sortDirection = params.sorting[0].desc ? "DESC" : "ASC"; // 'direction' es lo que espera SortUserDto
        } else {
        // Opcional: Enviar un ordenamiento por defecto si no se especifica ninguno desde la tabla
        // queryParams.field = 'name'; // O 'createdAt'
        // queryParams.direction = 'ASC';
        }
        if (params.columnFilters && params.columnFilters.length > 0) {
            params.columnFilters.forEach((filter)=>{
                if (filter.value !== undefined && filter.value !== "" && filter.value !== null) {
                    queryParams[filter.id] = filter.value;
                }
            });
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get("/users", {
            params: queryParams
        });
        return response.data;
    },
    async deactivateUser (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`/users/${id}`);
    },
    async activateUser (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].delete(`/users/${id}`);
    },
    async getUserById (id) {
        console.log(`PWAUSER_SERVICE: Attempting to fetch user with ID: ${id}`); // LOG AQUÍ
        if (!id) {
            console.error("PWAUSER_SERVICE: getUserById called with no ID.");
            return Promise.reject(new Error("User ID is required"));
        }
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(`/users/${id}`); // Endpoint del backend
            console.log(`PWAUSER_SERVICE: Data received for ${id}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`PWAUSER_SERVICE: Error fetching user ${id}:`, error);
            throw error;
        }
    },
    async updateUser (id, data) {
        const { email, ...user } = data;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(`/users/${id}`, user);
        return response.data;
    },
    async updatePwaUserProfile (data, token) {
        // El backend espera este endpoint para el perfil del usuario logueado
        // Endpoint: PATCH /api/users/profile (o el que hayas definido en UsersController para PWA)
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch("/users/update-by-user/profile", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
}}),
"[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.module.css [app-ssr] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "dataRow": "PwaUserTable-module__nVO2pW__dataRow",
  "filterRow": "PwaUserTable-module__nVO2pW__filterRow",
  "headerButton": "PwaUserTable-module__nVO2pW__headerButton",
  "mantine-Group-root": "PwaUserTable-module__nVO2pW__mantine-Group-root",
  "paginationFooter": "PwaUserTable-module__nVO2pW__paginationFooter",
  "sortIcon": "PwaUserTable-module__nVO2pW__sortIcon",
  "sortIconDesc": "PwaUserTable-module__nVO2pW__sortIconDesc",
  "sortIconPlaceholder": "PwaUserTable-module__nVO2pW__sortIconPlaceholder",
  "tableHeader": "PwaUserTable-module__nVO2pW__tableHeader",
  "tableWrapper": "PwaUserTable-module__nVO2pW__tableWrapper",
});
}}),
"[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "PwaUserTable": (()=>PwaUserTable)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Table/Table.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ScrollArea$2f$ScrollArea$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/ScrollArea/ScrollArea.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$UnstyledButton$2f$UnstyledButton$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/UnstyledButton/UnstyledButton.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Group/Group.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Text/Text.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Center/Center.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Pagination$2f$Pagination$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Pagination/Pagination.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Select/Select.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$TextInput$2f$TextInput$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/TextInput/TextInput.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/ActionIcon/ActionIcon.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tooltip$2f$Tooltip$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Tooltip/Tooltip.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Badge$2f$Badge$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Badge/Badge.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/core/Box/Box.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconArrowUp$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconArrowUp.mjs [app-ssr] (ecmascript) <export default as IconArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconEdit$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconEdit$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconEdit.mjs [app-ssr] (ecmascript) <export default as IconEdit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconTrash$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconTrash$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconTrash.mjs [app-ssr] (ecmascript) <export default as IconTrash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconSearch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconSearch$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconSearch.mjs [app-ssr] (ecmascript) <export default as IconSearch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconX$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconX$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconX.mjs [app-ssr] (ecmascript) <export default as IconX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconPlus.mjs [app-ssr] (ecmascript) <export default as IconPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.module.css [app-ssr] (css module)"); // Crearemos este archivo
"use client";
;
;
;
;
function PwaUserTable({ users, isLoading, totalRowCount, pagination, sorting, columnFilters, onPaginationChange, onSortingChange, onColumnFiltersChange, onEditUser, handleToggleUserActivation }) {
    const headers = [
        {
            key: "name",
            label: "Nombre Completo",
            sortable: true,
            filterable: true,
            filterType: "text"
        },
        {
            key: "email",
            label: "Correo",
            sortable: true,
            filterable: true,
            filterType: "text"
        },
        {
            key: "creditBalance",
            label: "Créditos",
            sortable: true,
            align: "center",
            width: "100px"
        },
        {
            key: "countryOfOrigin",
            label: "País Origen",
            sortable: true,
            filterable: true,
            filterType: "text",
            align: "center"
        },
        {
            key: "isActive",
            label: "Activo",
            sortable: true,
            filterable: true,
            filterType: "select",
            selectOptions: [
                {
                    label: "Sí",
                    value: "true"
                },
                {
                    label: "No",
                    value: "false"
                }
            ],
            align: "center",
            width: "100px"
        },
        // { key: 'role', label: 'Rol', sortable: true, filterable: true, filterType: 'text', align: 'center', width: '120px' },
        {
            key: "createdAt",
            label: "Registro",
            sortable: true,
            width: "120px"
        },
        {
            key: "actions",
            label: "Acciones",
            align: "center",
            width: "100px"
        }
    ];
    const handleSort = (key)=>{
        if (!isSortableHeader(key)) return;
        const currentSort = sorting.find((s)=>s.id === key);
        let newSorting;
        if (!currentSort) {
            newSorting = [
                {
                    id: key,
                    desc: false
                }
            ];
        } else if (!currentSort.desc) {
            newSorting = [
                {
                    id: key,
                    desc: true
                }
            ];
        } else {
            newSorting = []; // Limpiar ordenamiento si se hace clic por tercera vez
        }
        onSortingChange(newSorting);
    };
    const handleFilterChange = (columnId, value)=>{
        onColumnFiltersChange((prev)=>{
            const newFilters = prev.filter((f)=>f.id !== columnId);
            if (value) {
                newFilters.push({
                    id: columnId,
                    value
                });
            }
            return newFilters;
        });
    };
    const getFilterValue = (columnId)=>{
        const filter = columnFilters.find((f)=>f.id === columnId);
        return filter?.value || "";
    };
    // Helper para castear el tipo de keyof UserPwaFE
    const isSortableHeader = (key)=>{
        return headers.find((h)=>h.key === key)?.sortable || false;
    };
    const rows = users.map((user)=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Tr, {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dataRow,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    children: user.name
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    children: user.email
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    style: {
                        textAlign: "center"
                    },
                    children: user.creditBalance
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    style: {
                        textAlign: "center"
                    },
                    children: user.countryOfOrigin || "N/A"
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    style: {
                        textAlign: "center"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Badge$2f$Badge$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        color: user.isActive ? "teal" : "pink",
                        variant: "light",
                        size: "sm",
                        children: user.isActive ? "Sí" : "No"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    children: new Date(user.createdAt).toLocaleDateString("es-ES")
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                    style: {
                        textAlign: "center"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                        gap: "xs",
                        justify: "center",
                        wrap: "nowrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tooltip$2f$Tooltip$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                label: "Editar Usuario",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionIcon"], {
                                    variant: "subtle",
                                    color: "blue",
                                    onClick: ()=>onEditUser(user),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconEdit$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconEdit$3e$__["IconEdit"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                        lineNumber: 182,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tooltip$2f$Tooltip$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                label: user.isActive ? "Desactivar Usuario" : "Activar Usuario",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionIcon"], {
                                    variant: "subtle",
                                    color: user.isActive ? "red" : "teal",
                                    onClick: ()=>handleToggleUserActivation(user),
                                    children: user.isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconTrash$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconTrash$3e$__["IconTrash"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                        lineNumber: 194,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconPlus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconPlus$3e$__["IconPlus"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                        lineNumber: 196,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                    lineNumber: 188,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this)
            ]
        }, user.id, true, {
            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
            lineNumber: 154,
            columnNumber: 7
        }, this);
    });
    const totalPages = Math.ceil(totalRowCount / pagination.pageSize);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tableWrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ScrollArea$2f$ScrollArea$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollArea"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                    striped: true,
                    highlightOnHover: true,
                    verticalSpacing: "sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Thead, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tableHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Tr, {
                                    children: headers.map((header)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Th, {
                                            style: {
                                                width: header.width,
                                                textAlign: header.align || "left"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$UnstyledButton$2f$UnstyledButton$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UnstyledButton"], {
                                                onClick: ()=>handleSort(header.key),
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerButton,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                                                    gap: "xs",
                                                    wrap: "nowrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                                            fw: 500,
                                                            children: header.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 23
                                                        }, this),
                                                        header.sortable && sorting.find((s)=>s.id === header.key) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconArrowUp$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconArrowUp$3e$__["IconArrowUp"], {
                                                            size: 14,
                                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sortIcon} ${sorting.find((s)=>s.id === header.key)?.desc ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sortIconDesc : ""}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                lineNumber: 222,
                                                columnNumber: 19
                                            }, this)
                                        }, header.key, false, {
                                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                            lineNumber: 215,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Tr, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].filterRow,
                                    children: headers.map((header, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Th, {
                                            style: {
                                                padding: "4px 8px"
                                            },
                                            children: [
                                                header.filterable && header.filterType === "text" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$TextInput$2f$TextInput$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                                    placeholder: `Filtrar ${header.label}...`,
                                                    value: getFilterValue(header.key),
                                                    onChange: (event)=>handleFilterChange(header.key, event.currentTarget.value),
                                                    rightSection: getFilterValue(header.key) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionIcon"], {
                                                        size: "xs",
                                                        variant: "transparent",
                                                        onClick: ()=>handleFilterChange(header.key, ""),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconX$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconX$3e$__["IconX"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 29
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 27
                                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconSearch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconSearch$3e$__["IconSearch"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 27
                                                    }, void 0),
                                                    size: "xs"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 21
                                                }, this),
                                                header.filterable && header.filterType === "select" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                    placeholder: `Filtrar ${header.label}...`,
                                                    //   data={header.selectOptions || []}
                                                    value: getFilterValue(header.key),
                                                    onChange: (value)=>handleFilterChange(header.key, value || ""),
                                                    searchable: true,
                                                    clearable: true,
                                                    size: "xs"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `filter-${index}`, true, {
                                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Tbody, {
                            children: [
                                isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Tr, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                                        colSpan: headers.length,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Center"], {
                                                p: "xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                                    children: "Cargando usuarios..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                lineNumber: 307,
                                                columnNumber: 19
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                        lineNumber: 306,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                    lineNumber: 305,
                                    columnNumber: 15
                                }, this),
                                !isLoading && users.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Tr, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Table$2f$Table$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Td, {
                                        colSpan: headers.length,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Center$2f$Center$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Center"], {
                                            p: "xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                                                c: "dimmed",
                                                children: "No se encontraron usuarios."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                                lineNumber: 318,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                            lineNumber: 317,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                                    lineNumber: 315,
                                    columnNumber: 15
                                }, this),
                                !isLoading && rows
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                            lineNumber: 303,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                justify: "space-between",
                align: "center",
                p: "md",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].paginationFooter,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
                        size: "sm",
                        children: [
                            "Mostrando",
                            " ",
                            users.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0,
                            " ",
                            "-",
                            " ",
                            Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRowCount),
                            " ",
                            "de ",
                            totalRowCount,
                            " usuarios"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Pagination$2f$Pagination$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pagination"], {
                        total: totalPages,
                        value: pagination.pageIndex + 1,
                        onChange: (page)=>onPaginationChange({
                                ...pagination,
                                pageIndex: page - 1
                            }),
                        siblings: 1,
                        boundaries: 1,
                        withEdges: true,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Select$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        size: "xs",
                        style: {
                            width: 120
                        },
                        data: [
                            "5",
                            "10",
                            "20",
                            "50"
                        ].map((s)=>({
                                label: `${s} por página`,
                                value: s
                            })),
                        value: pagination.pageSize.toString(),
                        onChange: (value)=>onPaginationChange({
                                pageIndex: 0,
                                pageSize: Number(value)
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/(admin_panel)/admin/users-pwa/page.tsx
__turbopack_context__.s({
    "default": (()=>PwaUsersPageWrapper)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/core/Box/Box.mjs [app-ssr] (ecmascript)"); // Asegúrate que Alert esté importado
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Title$2f$Title$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Title/Title.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Button/Button.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Group/Group.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/core/esm/components/Alert/Alert.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconRefresh$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconRefresh$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconRefresh.mjs [app-ssr] (ecmascript) <export default as IconRefresh>"); // Añade IconTrash y IconEdit
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconAlertCircle.mjs [app-ssr] (ecmascript) <export default as IconAlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconTrash$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconTrash$3e$__ = __turbopack_context__.i("[project]/node_modules/@tabler/icons-react/dist/esm/icons/IconTrash.mjs [app-ssr] (ecmascript) <export default as IconTrash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/notifications/esm/notifications.store.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$pwa$2d$user$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/pwa-user.service.ts [app-ssr] (ecmascript)"); // Asumimos que pwaUserService.getUsers ahora toma estos tipos
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(admin_panel)/admin/users-pwa/PwaUserTable.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$disclosure$2f$use$2d$disclosure$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mantine/hooks/esm/use-disclosure/use-disclosure.mjs [app-ssr] (ecmascript)");
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
const queryClientInstance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 20,
            refetchOnWindowFocus: false
        }
    }
});
function PwaUsersPageWrapper() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClientInstance,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PwaUsersPage, {}, void 0, false, {
            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
function PwaUsersPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const [columnFilters, setColumnFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sorting, setSorting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: "name",
            desc: false
        }
    ]);
    const [pagination, setPagination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        pageIndex: 0,
        pageSize: 10
    });
    // Estado para el diálogo de ajuste de créditos
    const [adjustCreditsModalOpened, { open: openAdjustCreditsModal, close: closeAdjustCreditsModal }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$disclosure$2f$use$2d$disclosure$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDisclosure"])(false);
    const [selectedUserForCredits, setSelectedUserForCredits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { data, isError, isFetching, isLoading, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "pwa-users",
            columnFilters,
            pagination.pageIndex,
            pagination.pageSize,
            sorting
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$pwa$2d$user$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pwaUserService"].getUsers({
                pagination,
                sorting,
                columnFilters
            }),
        enabled: true
    });
    const users = data?.data || [];
    const totalRowCount = data?.total || 0;
    const { mutateAsync: toggleUserActivationMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (user)=>{
            if (user.isActive) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$pwa$2d$user$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pwaUserService"].deactivateUser(user.id); // Llama a la API para desactivar
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$pwa$2d$user$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pwaUserService"].activateUser(user.id); // Llama a la API para activar (NECESITAS ESTE MÉTODO EN EL SERVICIO)
            }
        },
        onSuccess: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Usuario Desactivado",
                message: "El usuario ha sido desactivado correctamente.",
                color: "green",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconTrash$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconTrash$3e$__["IconTrash"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                    lineNumber: 125,
                    columnNumber: 15
                }, this)
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "pwa-users"
                ]
            });
        },
        onError: (error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Error al Desactivar",
                message: error.message || "No se pudo desactivar el usuario.",
                color: "red",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                    lineNumber: 134,
                    columnNumber: 15
                }, this)
            });
        }
    });
    const handleToggleUserActivation = async (user)=>{
        const actionText = user.isActive ? "desactivar" : "activar";
        if (window.confirm(`¿Está seguro de que desea ${actionText} a ${user.name}?`)) {
            await toggleUserActivationMutation(user);
        }
    };
    // NUEVA Mutación para ajustar créditos
    const { mutateAsync: adjustCreditsMutation, isPending: isAdjustingCredits } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$pwa$2d$user$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pwaUserService"].adminAdjustCredits(params.userId, params.amount, params.reason),
        onSuccess: (updatedUser, variables)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Créditos Ajustados",
                message: `Se ${variables.amount > 0 ? "añadieron" : "quitaron"} ${Math.abs(variables.amount)} créditos a ${updatedUser.name}.`,
                color: "green"
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "pwa-users"
                ]
            }); // Refresca la tabla
            queryClient.invalidateQueries({
                queryKey: [
                    "pwa-user",
                    updatedUser.id
                ]
            }); // Refresca el detalle si está cacheado
            closeAdjustCreditsModal(); // Cierra el modal
        },
        onError: (error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$notifications$2f$esm$2f$notifications$2e$store$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"].show({
                title: "Error al Ajustar Créditos",
                message: error.message || "No se pudo completar el ajuste de créditos.",
                color: "red"
            });
        // No cerramos el modal en error para que el usuario pueda reintentar o corregir
        }
    });
    const handleOpenAdjustCredits = (user)=>{
        setSelectedUserForCredits(user);
        openAdjustCreditsModal();
    };
    const handleConfirmAdjustCredits = async (formData)=>{
        if (!selectedUserForCredits) return;
        await adjustCreditsMutation({
            userId: selectedUserForCredits.id,
            amount: formData.amount,
            reason: formData.reason
        });
    };
    const handleEditUser = (user)=>{
        router.push(`/admin/users-pwa/edit/${user.id}`);
    };
    const handleSortingChange = (updater)=>{
        setSorting(updater);
        setPagination((prev)=>({
                ...prev,
                pageIndex: 0
            })); // Resetear a primera página
    };
    const handleColumnFiltersChange = (updater)=>{
        setColumnFilters(updater);
        setPagination((prev)=>({
                ...prev,
                pageIndex: 0
            })); // Resetear a primera página
    };
    const handlePaginationChange = (updater)=>{
        setPagination(updater);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$Box$2f$Box$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box"], {
        p: "lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                justify: "space-between",
                mb: "xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Title$2f$Title$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
                        order: 2,
                        children: "Gestión de Usuarios (Clientes PWA)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>refetch(),
                            leftSection: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconRefresh$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconRefresh$3e$__["IconRefresh"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                                lineNumber: 249,
                                columnNumber: 26
                            }, void 0),
                            variant: "default",
                            loading: isFetching && !isLoading,
                            disabled: isFetching && !isLoading,
                            children: "Refrescar"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            isError && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Alert$2f$Alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tabler$2f$icons$2d$react$2f$dist$2f$esm$2f$icons$2f$IconAlertCircle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IconAlertCircle$3e$__["IconAlertCircle"], {
                    size: "1rem"
                }, void 0, false, {
                    fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                    lineNumber: 261,
                    columnNumber: 17
                }, void 0),
                title: "Error de Carga",
                color: "red",
                withCloseButton: true,
                mb: "md",
                children: "No se pudieron cargar los datos de los usuarios. Intente refrescar."
            }, void 0, false, {
                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                lineNumber: 260,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$admin_panel$292f$admin$2f$users$2d$pwa$2f$PwaUserTable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PwaUserTable"], {
                users: users,
                isLoading: isLoading || isFetching && users.length === 0,
                totalRowCount: totalRowCount,
                pagination: pagination,
                sorting: sorting,
                columnFilters: columnFilters,
                onPaginationChange: handlePaginationChange,
                onSortingChange: handleSortingChange,
                onColumnFiltersChange: handleColumnFiltersChange,
                onEditUser: handleEditUser,
                handleToggleUserActivation: handleToggleUserActivation,
                onAdjustCredits: handleOpenAdjustCredits
            }, void 0, false, {
                fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(admin_panel)/admin/users-pwa/page.tsx",
        lineNumber: 233,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5ad1799d._.js.map