"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/auth.store"; // Ajusta ruta
import { MainLayout } from "../../components/layout/MainLayout"; // Ajusta ruta
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Para las páginas dentro de pwa_app
import { Center, Loader } from "@mantine/core";
import { pwaAppMenuItems } from "project/config/admin-menu-items";

// Crear una instancia de QueryClient para este layout y sus hijos
const pwaAppQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minuto
      refetchOnWindowFocus: false,
    },
  },
});
const INTENDED_URL_KEY = "intended_pwa_url"; // Clave para sessionStorage

export default function PwaAppLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.isLoading); // Estado de carga del store
  const router = useRouter();
  const pathname = usePathname();
  const search = typeof window !== "undefined" ? window.location.search : ""; // Para obtener query params

  useEffect(() => {
    // Dar tiempo a que el estado se hidrate desde localStorage
    if (isLoadingAuth) {
      return;
    }

    if (!isAuthenticated || user?.role !== "CLIENT") {
      console.log(
        "PwaAppLayout: Not authenticated as CLIENT. Saving intended URL and redirecting to /login"
      );
      // Guarda la URL actual (incluyendo query params) antes de redirigir
      const intendedUrl = pathname + search;
      sessionStorage.setItem(INTENDED_URL_KEY, intendedUrl);
      router.replace("/login"); // Redirige a la página de login PWA (que está en (public_auth))
      return;
    }

    if (!user.countryOfOrigin && pathname !== "/set-country") {
      console.log(
        "PwaAppLayout: No country. Saving intended URL (if any) and redirecting to /set-country"
      );
      const intendedUrl = pathname + search;
      // Solo guarda si no es ya /set-country para evitar bucles
      if (pathname !== "/set-country") {
        sessionStorage.setItem(INTENDED_URL_KEY, intendedUrl);
      }
      router.replace("/set-country");
      return;
    }

    // Si está autenticado, tiene país Y está en la página de set-country, redirigir al dashboard o intendedUrl
    if (user.countryOfOrigin && pathname === "/set-country") {
      const intendedUrl = sessionStorage.getItem(INTENDED_URL_KEY);
      sessionStorage.removeItem(INTENDED_URL_KEY); // Limpiar
      console.log(
        "PwaAppLayout: Has country, on set-country page. Redirecting to:",
        intendedUrl || "/dashboard"
      );
      router.replace(intendedUrl || "/dashboard");
    }
  }, [isAuthenticated, user, isLoadingAuth, router, pathname]);

  if (
    isLoadingAuth ||
    !isAuthenticated ||
    user?.role !== "CLIENT" ||
    !user?.countryOfOrigin
  ) {
    // Muestra loader mientras se verifica todo o si alguna condición no se cumple antes de la redirección final
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  // Muestra un loader mientras se verifica la autenticación o si se está redirigiendo
  if (isLoadingAuth) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  // Si no está autenticado, o si no tiene país y no es la página de set-country,
  // no renderizar el MainLayout para evitar un flash antes de la redirección.
  if (
    !isAuthenticated ||
    (user && !user.countryOfOrigin && pathname !== "/set-country")
  ) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <QueryClientProvider client={pwaAppQueryClient}>
      <MainLayout navItems={pwaAppMenuItems}>{children}</MainLayout>
    </QueryClientProvider>
  );
}
