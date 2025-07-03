"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  Paper,
  LoadingOverlay,
  Center,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { IconAlertCircle, IconLogin } from "@tabler/icons-react";
import {
  useAuthStore,
  UserPwa as AuthUser,
} from "../../../../store/auth.store";
import { apiClient } from "../../../../lib/apiClient";
import { AuthAdminResponse } from "project/types/auth.types";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres",
  }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    setUser,
    isAuthenticated,
    user: currentUserFromStore,
    setLoading: setAuthLoading,
    setError: setAuthError,
    error: authErrorFromStore,
    isLoading: authIsLoadingFromStore,
  } = useAuthStore();

  const form = useForm({
    initialValues: { username: "", password: "" },
    validate: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (
      isAuthenticated &&
      (currentUserFromStore as AuthUser & { role?: string })?.role ===
        "ADMINISTRATOR"
    ) {
      router.replace("/admin/credit-transactions");
    }
  }, [isAuthenticated, currentUserFromStore, router]);

  const handleAdminLogin = async (values: typeof form.values) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await apiClient.post<AuthAdminResponse>(
        "/auth/admin/login",
        {
          username: values.username,
          password: values.password,
        }
      );

      const { accessToken, user: adminUserDataBackend } = response.data;
      const adminUserForStore: AuthUser = {
        id: adminUserDataBackend.id,
        name: adminUserDataBackend.name,
        email: adminUserDataBackend.email || null,
        role: adminUserDataBackend.role,
        pictureUrl: null,
        countryOfOrigin: null,
        credits: 0,
      };
      setUser(adminUserForStore, accessToken);
      router.push("/admin/credit-transactions");
    } catch (err: any) {
      const apiErrorMessage =
        err.response?.data?.message || err.message || "Error de autenticación.";
      setAuthError(apiErrorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  if (
    isAuthenticated &&
    (currentUserFromStore as AuthUser & { role?: string })?.role ===
      "ADMINISTRATOR"
  ) {
    return (
      <Center mih="100vh">
        <LoadingOverlay visible={true} />
      </Center>
    );
  }

  return (
    <Center
      mih="100vh"
      style={{ backgroundColor: "var(--mantine-color-gray-1, #f8f9fa)" }}
    >
      <Paper
        shadow="xl"
        p={30}
        radius="md"
        withBorder
        style={{ width: 420, position: "relative" }}
      >
        <LoadingOverlay
          visible={authIsLoadingFromStore}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
        <Title order={2} ta="center" mb="xs">
          Panel de Administración
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb={30}>
          Acceso exclusivo para administradores.
        </Text>

        {authErrorFromStore && (
          <Alert
            icon={<IconAlertCircle size="1.1rem" />}
            title="Error de Acceso"
            color="red"
            variant="light"
            withCloseButton
            onClose={() => setAuthError(null)}
            mb="md"
            radius="md"
          >
            {authErrorFromStore}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleAdminLogin)}>
          <Stack>
            <TextInput
              required
              label="Nombre de Usuario"
              placeholder="usuario_admin"
              {...form.getInputProps("username")}
              data-autofocus
            />
            <PasswordInput
              required
              label="Contraseña"
              placeholder="Tu contraseña"
              {...form.getInputProps("password")}
            />
            <Button
              type="submit"
              fullWidth
              mt="lg"
              leftSection={<IconLogin size="1.1rem" />}
              loading={authIsLoadingFromStore}
            >
              Ingresar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
