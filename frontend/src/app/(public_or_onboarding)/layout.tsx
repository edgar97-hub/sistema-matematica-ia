"use client"; // Si usas hooks o estado, sino puede ser Server Component
import React, { useEffect } from "react";
import { Box, Center, Loader } from "@mantine/core";
import classes from "./onboarding-layout.module.css"; // CSS para este layout
import { useAuthStore } from "../../store/auth.store"; // Ajusta ruta
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // <--- IMPORTAR

const onboardingQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Puedes tener opciones diferentes para las queries en esta sección si es necesario
      staleTime: 1000 * 60, // 1 minuto
      refetchOnWindowFocus: false,
    },
  },
});
const INTENDED_URL_KEY = "intended_pwa_url"; // Misma clave que en PwaAppLayout

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const router = useRouter();
  const pathname = usePathname();

  // Lógica de redirección para este layout
  useEffect(() => {
    if (isLoadingAuth) return; // Esperar a que termine la carga del estado de auth

    if (pathname === "/set-country") {
      if (!isAuthenticated) {
        // Si no está autenticado, no debería estar aquí
        router.replace("/login");
      } else if (user?.countryOfOrigin) {
        // Si ya tiene país, no debería estar aquí
        // router.replace("/dashboard");

        const intendedUrl = sessionStorage.getItem(INTENDED_URL_KEY);
        sessionStorage.removeItem(INTENDED_URL_KEY);
        if (!user?.countryOfOrigin) {
          router.replace(
            intendedUrl && intendedUrl !== "/set-country"
              ? `/set-country?redirect=${encodeURIComponent(intendedUrl)}`
              : "/set-country"
          );
        } else {
          router.replace(intendedUrl || "/dashboard");
        }
        return;
      }
    } else if (pathname === "/login" || pathname === "/admin/login") {
      // Para las páginas de login
      if (isAuthenticated) {
        // Si ya está autenticado, redirigir
        if (user?.role === "ADMINISTRATOR" && pathname.startsWith("/admin")) {
          router.replace("/admin/dashboard");
        } else if (user?.role === "CLIENT") {
          // Asumiendo que UserPwaRole.CLIENT es 'CLIENT'
          // router.replace("/dashboard");
        }
      }
    }
  }, [isAuthenticated, user, isLoadingAuth, router, pathname]);

  if (
    isLoadingAuth &&
    (pathname === "/set-country" ||
      pathname === "/login" ||
      pathname === "/admin/login")
  ) {
    // Muestra un loader simple si está cargando el auth y está en una de estas páginas sensibles
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <QueryClientProvider client={onboardingQueryClient}>
      <div className={classes.wrapper}>
        <main className={classes.content}>{children}</main>
      </div>
    </QueryClientProvider>
  );
}
