"use client";

import { useEffect } from "react";
import {
  Box,
  Title,
  Paper,
  LoadingOverlay,
  Alert,
  Group,
  Button,
  TextInput,
  Switch,
  NumberInput,
  Textarea,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconDeviceFloppy,
  IconDiscountCheck,
  IconSettings,
  IconSettings as IconSettingsTabler,
} from "@tabler/icons-react"; // Renombrado para evitar conflicto
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import {
  settingsService,
  SystemSettingsData,
  SystemSettingsResponse,
} from "../../../../lib/services/settings.service"; // Ajusta ruta

// Esquema de validación con Zod para el formulario
const settingsSchema = z.object({
  openAiPromptBase: z.string().nullable().optional(),
  welcomeCreditEnabled: z.boolean(),
  welcomeCreditAmount: z
    .number()
    .min(0, "Debe ser 0 o más")
    .int("Debe ser un número entero"),
});

// QueryClientProvider ya debería estar en el admin_panel layout

export default function SystemSettingsPage() {
  const queryClient = useQueryClient();

  // Query para obtener la configuración actual
  const {
    data: currentSettings,
    isLoading: isLoadingSettings,
    isError,
    error,
    refetch, // Para el botón de descartar
  } = useQuery<SystemSettingsResponse, Error>({
    queryKey: ["system-settings"],
    queryFn: settingsService.getSettings,
    staleTime: 1000 * 60 * 5, // 5 minutos de stale time
    // No necesitamos onSuccess aquí si usamos useEffect para inicializar el form
  });

  // Formulario con Mantine
  const form = useForm<SystemSettingsData>({
    initialValues: {
      // Se poblará desde la query
      openAiPromptBase: "",
      welcomeCreditEnabled: true,
      welcomeCreditAmount: 1,
    },
    validate: zodResolver(settingsSchema),
  });

  // Efecto para popular el formulario una vez que los datos se cargan
  useEffect(() => {
    if (currentSettings) {
      form.setValues({
        openAiPromptBase: currentSettings.openAiPromptBase || "", // Asegurar string o null
        welcomeCreditEnabled: currentSettings.welcomeCreditEnabled,
        welcomeCreditAmount: currentSettings.welcomeCreditAmount,
      });
      form.resetDirty(currentSettings); // Marcar el formulario como no "dirty" con los valores cargados
    }
  }, [currentSettings]); // Sin 'form' en las dependencias para evitar bucles

  // Mutación para actualizar la configuración
  const { mutateAsync: updateSettingsMutation, isLoading: isSaving } =
    useMutation({
      mutationFn: settingsService.updateSettings,
      onSuccess: (updatedSettings) => {
        console.log("updatedSettings", updatedSettings);
        notifications.show({
          title: "Configuración Guardada",
          message:
            "La configuración del sistema ha sido actualizada exitosamente.",
          color: "green",
          icon: <IconDeviceFloppy size={18} />,
        });
        // Actualizar los datos en caché de la query para que reflejen los cambios
        queryClient.setQueryData(["system-settings"], updatedSettings);
        form.resetDirty(updatedSettings); // Marcar como no dirty después de guardar
      },
      onError: (err: any) => {
        notifications.show({
          title: "Error al Guardar",
          message: err.message || "No se pudo guardar la configuración.",
          color: "red",
          icon: <IconAlertCircle size={18} />,
        });
      },
    });

  const handleSaveSettings = async (values: SystemSettingsData) => {
    await updateSettingsMutation(values);
  };

  const handleDiscardChanges = () => {
    if (currentSettings) {
      form.setValues({
        // Resetear a los valores cargados originalmente
        openAiPromptBase: currentSettings.openAiPromptBase || "",
        welcomeCreditEnabled: currentSettings.welcomeCreditEnabled,
        welcomeCreditAmount: currentSettings.welcomeCreditAmount,
      });
      form.resetDirty(currentSettings);
    }
    notifications.show({
      title: "Cambios Descartados",
      message: "",
      color: "blue",
      autoClose: 2000,
    });
  };

  if (isLoadingSettings) {
    return (
      <Box
        p="lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 200px)",
        }}
      >
        <LoadingOverlay
          visible={true}
          overlayProps={{ blur: 2 }}
          loaderProps={{ children: <Text>Cargando configuración...</Text> }}
        />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p="lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error de Carga"
          color="red"
        >
          No se pudo cargar la configuración del sistema.
          {error?.message && (
            <Text size="xs" mt="xs">
              Detalle: {error.message}
            </Text>
          )}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p="lg" className="settings-page-container">
      <Title order={2} mb="xl" className="page-main-title">
        <IconSettings
          size={28}
          style={{ marginRight: "10px", verticalAlign: "bottom" }}
        />
        Configuración del Sistema
      </Title>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSaveSettings)}>
          <Textarea
            label="Prompt Base para OpenAI (GPT)"
            placeholder="Define el comportamiento base para la IA al resolver problemas..."
            {...form.getInputProps("openAiPromptBase")}
            minRows={4}
            autosize
            mb="lg"
            description="Este prompt se usará como base para las solicitudes a la IA de resolución."
          />

          <Switch
            label="Habilitar Crédito de Bienvenida"
            {...form.getInputProps("welcomeCreditEnabled", {
              type: "checkbox",
            })}
            color="teal"
            size="md"
            thumbIcon={
              form.values.welcomeCreditEnabled ? (
                <IconCheck style={{ width: "12px", height: "12px" }} />
              ) : (
                <IconDiscountCheck style={{ width: "12px", height: "12px" }} />
              )
            }
            mb="xs"
          />

          <NumberInput
            label="Cantidad de Créditos de Bienvenida"
            placeholder="Número de créditos"
            required
            min={0}
            step={1}
            {...form.getInputProps("welcomeCreditAmount")}
            disabled={!form.values.welcomeCreditEnabled} // Deshabilitar si el toggle está apagado
            mb="xl"
          />

          <Group justify="flex-end" mt="xl">
            <Button
              variant="default"
              onClick={handleDiscardChanges}
              disabled={isSaving || !form.isDirty()}
            >
              Descartar
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              disabled={!form.isDirty() || isSaving} // Deshabilitar si no hay cambios o está guardando
              leftSection={<IconDeviceFloppy size={18} />}
            >
              Guardar Configuración
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}
