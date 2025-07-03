"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Title,
  Paper,
  LoadingOverlay,
  Alert,
  Group,
  Button,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import {
  EducationalStageFE,
  CountryFE,
  UpdateEducationalStageData,
} from "../../../../../../../types/educational-content.types";
import { educationalStageService } from "../../../../../../../lib/services/educational-stage.service";
import { countryService } from "../../../../../../../lib/services/country.service";
import {
  EducationalStageFormComponent,
  EducationalStageFormData,
} from "../../../../../../../components/admin/stages/EducationalStageFormComponent";

export default function EditEducationalStagePage() {
  const router = useRouter();
  const params = useParams();
  const stageId = params.id as string;
  const queryClientHook = useQueryClient();

  // Cargar países para el selector
  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    CountryFE[],
    Error
  >({
    queryKey: ["all-active-countries-for-stage-edit-form", stageId],
    queryFn: () => countryService.getActiveCountriesForPwa(),
  });

  // Query para obtener los datos de la etapa a editar
  const {
    data: currentStage,
    isLoading: isLoadingStage,
    isError: isStageQueryError,
    error: stageQueryError,
  } = useQuery<EducationalStageFE, Error>({
    queryKey: ["educational-stage", stageId],
    queryFn: () => educationalStageService.getEducationalStageById(stageId),
    enabled: !!stageId && !!countries,
  });

  // Mutación para actualizar la etapa
  const { mutateAsync: updateStageMutation, isPending } = useMutation({
    mutationFn: (formData: UpdateEducationalStageData) =>
      educationalStageService.updateEducationalStage(stageId, formData),
    onSuccess: (updatedStage) => {
      notifications.show({
        title: "Etapa Actualizada",
        message: `La etapa "${updatedStage.name}" ha sido actualizada.`,
        color: "green",
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClientHook.invalidateQueries({ queryKey: ["educational-stages"] });
      queryClientHook.setQueryData(
        ["educational-stage", stageId],
        updatedStage
      );
      router.push("/admin/educational-content/stages"); // Ajusta ruta
    },
    onError: (err: any) => {
      /* ... manejo de error ... */
    },
  });

  const handleFormSubmit = async (formData: EducationalStageFormData) => {
    await updateStageMutation(formData as UpdateEducationalStageData);
  };

  const isLoading = isLoadingCountries || isLoadingStage;

  if (isLoading) {
    return (
      <Box p="lg" style={{ textAlign: "center" }}>
        <Loader />
        <Text mt="sm">Cargando datos...</Text>
      </Box>
    );
  }

  if (isStageQueryError || !currentStage) {
    return (
      <Box p="lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error de Carga"
          color="red"
        >
          No se pudieron cargar los datos de la etapa.
          {stageQueryError?.message && (
            <Text size="xs" mt="xs">
              Detalle: {stageQueryError.message}
            </Text>
          )}
        </Alert>
      </Box>
    );
  }
  if (!countries || countries.length === 0) {
    return (
      <Box p="lg">
        <Alert color="orange" title="Faltan Países" icon={<IconAlertCircle />}>
          No hay países activos definidos para asignar la etapa.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p="lg" className="form-page-container">
      <Group justify="space-between" mb="xl" className="page-header">
        <Title order={3}>Editar Etapa Educativa: {currentStage?.name}</Title>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push("/admin/educational-content/stages")}
        >
          Volver a la Lista
        </Button>
      </Group>

      <EducationalStageFormComponent
        initialData={currentStage}
        countries={countries}
        onSubmit={handleFormSubmit}
        isSaving={isPending}
        onCancel={() => router.push("/admin/educational-content/stages")}
      />
    </Box>
  );
}
