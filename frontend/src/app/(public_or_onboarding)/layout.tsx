"use client";
import React, { useEffect } from "react";
import { Box, Center, Loader } from "@mantine/core";
import classes from "./onboarding-layout.module.css";
import { useAuthStore } from "../../store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const onboardingQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});
const INTENDED_URL_KEY = "intended_pwa_url";

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

  useEffect(() => {
    if (isLoadingAuth) return;
    // if (!isAuthenticated) {
    //   router.replace("/login");
    // }
    if (pathname === "/set-country") {
      // if (!isAuthenticated) {
      //   router.replace("/login");
      // } else if (user?.countryOfOrigin) {
      //   const intendedUrl = sessionStorage.getItem(INTENDED_URL_KEY);
      //   sessionStorage.removeItem(INTENDED_URL_KEY);
      //   if (!user?.countryOfOrigin) {
      //     router.replace(
      //       intendedUrl && intendedUrl !== "/set-country"
      //         ? `/set-country?redirect=${encodeURIComponent(intendedUrl)}`
      //         : "/set-country"
      //     );
      //   } else {
      //     router.replace(intendedUrl || "/orders");
      //   }
      //   return;
      // }
    } else if (pathname === "/login" || pathname === "/admin/login") {
      if (isAuthenticated) {
        if (user?.role === "ADMINISTRATOR" && pathname.startsWith("/admin")) {
          router.replace("/admin/credit-transactions");
        } else if (user?.role === "CLIENT") {
          // Asumiendo que UserPwaRole.CLIENT es 'CLIENT'
          // router.replace("/orders");
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
