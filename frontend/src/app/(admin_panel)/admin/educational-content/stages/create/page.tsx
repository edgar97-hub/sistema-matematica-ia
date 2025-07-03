"use client";

import {
  Box,
  Title,
  Button,
  Group,
  Alert,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import {
  EducationalStageFormComponent,
  EducationalStageFormData,
} from "../../../../../../components/admin/stages/EducationalStageFormComponent";
import { educationalStageService } from "../../../../../../lib/services/educational-stage.service";
import { countryService } from "../../../../../../lib/services/country.service";
import { CountryFE } from "../../../../../../types/educational-content.types";

export default function CreateEducationalStagePage() {
  const router = useRouter();
  const queryClientHook = useQueryClient();

  const {
    data: countries,
    isLoading: isLoadingCountries,
    isError: isCountriesError,
  } = useQuery<CountryFE[], Error>({
    queryKey: ["active-countries-for-form"],
    queryFn: () => countryService.getActiveCountriesForPwa(),
  });

  const { mutateAsync: createStageMutation, isPending } = useMutation({
    mutationFn: educationalStageService.createEducationalStage,
    onSuccess: (newStage) => {
      notifications.show({
        title: "Etapa Creada",
        message: `La etapa educativa "${newStage.name}" ha sido creada exitosamente.`,
        color: "green",
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClientHook.invalidateQueries({ queryKey: ["educational-stages"] });
      router.push("/admin/educational-content/stages");
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error al Crear Etapa",
        message: error.message || "No se pudo crear la etapa educativa.",
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
    },
  });

  const handleSubmit = async (formData: EducationalStageFormData) => {
    await createStageMutation(formData);
  };

  if (isLoadingCountries) {
    return (
      <Box p="lg" style={{ textAlign: "center" }}>
        <Loader />
        <Text mt="sm">Cargando lista de países...</Text>
      </Box>
    );
  }

  if (isCountriesError || !countries || countries.length === 0) {
    return (
      <Box p="lg">
        <Alert color="red" title="Error o Sin Datos" icon={<IconAlertCircle />}>
          No se pudieron cargar los países o no hay países activos definidos.
          Por favor, cree al menos un país activo antes de añadir etapas.
          <Button
            component="a"
            href="/admin/educational-content/countries/create"
            variant="outline"
            mt="md"
          >
            Crear País
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p="lg" className="form-page-container">
      <Group justify="space-between" mb="xl" className="page-header">
        <Title order={3}>Crear Nueva Etapa Educativa</Title>
        <Button
          variant="default"
          size="xs"
          onClick={() => router.push("/admin/educational-content/stages")}
          leftSection={<IconArrowLeft size={16} />}
        >
          Volver a la Lista de Etapas
        </Button>
      </Group>
      <EducationalStageFormComponent
        countries={countries}
        onSubmit={handleSubmit}
        isSaving={isPending}
        onCancel={() => router.push("/admin/educational-content/stages")}
      />
    </Box>
  );
}
