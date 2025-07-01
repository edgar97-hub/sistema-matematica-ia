"use client";

import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Center,
  Anchor,
  Box,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useAuthStore } from "../../../store/auth.store"; // Ajusta la ruta
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import classes from "./login-page.module.css"; // CSS Modules para esta página

// URL de tu backend para iniciar el flujo OAuth de Google
const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`; // Usa variable de entorno
const INTENDED_URL_KEY = "intended_pwa_url"; // Misma clave que en PwaAppLayout

export default function PwaLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, error, setError } = useAuthStore();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      // router.replace("/dashboard"); // Redirige a la PWA
      // const intendedUrl = sessionStorage.getItem(INTENDED_URL_KEY);
      // sessionStorage.removeItem(INTENDED_URL_KEY);
      // if (!user?.countryOfOrigin) {
      //   router.replace(
      //     intendedUrl && intendedUrl !== "/set-country"
      //       ? `/set-country?redirect=${encodeURIComponent(intendedUrl)}`
      //       : "/set-country"
      //   );
      // } else {
      //   router.replace(intendedUrl || "/dashboard");
      // }
    }
  }, [isAuthenticated, router]);

  // Limpiar errores al montar el componente si vienes de un error de callback
  useEffect(() => {
    const callbackError = searchParams.get("error");
    if (callbackError) {
      setError(decodeURIComponent(callbackError));
    }
    // Limpiar el query param de error de la URL para que no se muestre si el usuario refresca
    if (
      typeof window !== "undefined" &&
      window.history.replaceState &&
      callbackError
    ) {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({ path: url.toString() }, "", url.toString());
    }
    return () => {
      setError(null); // Limpiar error al desmontar
    };
  }, [searchParams, setError]);

  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = GOOGLE_AUTH_URL;
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Text>Verificando sesión...</Text>
      </Center>
    );
  }

  return (
    <Paper
      withBorder
      shadow="xl"
      p={30}
      radius="md"
      className={classes.loginCard}
    >
      <div className={classes.logoContainer}>
        <img
          src="https://www.logoai.com/uploads/output/2025/02/14/0d66e2a69ec18e5dc102cee0afa1eb69.jpg?t=1739502594"
          // alt="JN Courier Logo"
          className={classes.logo}
          style={{ height: "100px" }}
        />
        {/* <Text size="xl" fw={700} className={classes.appName}>
          JN COURIER
        </Text> */}
      </div>
      <Title order={2} ta="center" mb="xs">
        Bienvenido/a
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Inicia sesión para resolver tus problemas matemáticos.
      </Text>

      {error && (
        <Text color="red" size="sm" ta="center" mb="md">
          Error: {error}
        </Text>
      )}

      <Button
        fullWidth
        leftSection={<IconBrandGoogle size={20} />}
        onClick={handleGoogleLogin}
        variant="outline"
        size="md"
        className={classes.googleButton}
      >
        Continuar con Google
      </Button>
      <Box style={{ display: "flex", flexDirection: "column" }}>
        <Text>Al continuar, aceptas nuestros </Text>
        <Anchor href="/terms">
          <Text className={classes.link}>Términos de Servicio</Text>
        </Anchor>{" "}
        y{" "}
        <Anchor href="/privacy">
          <Text className={classes.link}>Política de Privacidad</Text>
        </Anchor>
        .
      </Box>
    </Paper>
  );
}
