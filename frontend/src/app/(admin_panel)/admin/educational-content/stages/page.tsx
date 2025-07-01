"use client";

import { useState, useEffect } from "react"; // useEffect para cargar países
import {
  Box,
  Title,
  Button,
  Group,
  Alert,
  Select as MantineSelect,
} from "@mantine/core";
import {
  IconBook,
  IconRefresh,
  IconAlertCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

import {
  EducationalStageFE,
  PaginatedEducationalStagesResponse,
} from "../../../../../types/educational-content.types";
import { educationalStageService } from "../../../../../lib/services/educational-stage.service";
import { countryService } from "../../../../../lib/services/country.service"; // Para obtener la lista de países
import { EducationalStageTable } from "./EducationalStageTable";
import { CountryFE } from "project/types/country.types";

const queryClientInstance = new QueryClient({
  /* ... */
});

export default function EducationalStagesPageWrapper() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <EducationalStagesPage />
    </QueryClientProvider>
  );
}

function EducationalStagesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );

  // Cargar países para el filtro
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery<
    CountryFE[],
    Error
  >({
    queryKey: ["countries-for-stages-filter"],
    queryFn: () => countryService.getActiveCountriesForPwa(), // <--- CORRECCIÓN: pasar como función
  });

  const countryOptions =
    countriesData?.map((c: any) => ({
      value: c.id.toString(),
      label: c.name,
    })) || [];

  // Query para obtener las etapas, se re-ejecuta si selectedCountryId cambia
  const {
    data: stagesResponse,
    isError,
    isLoading,
    refetch,
  } = useQuery<
    PaginatedEducationalStagesResponse | EducationalStageFE[],
    Error
  >({
    queryKey: ["educational-stages", selectedCountryId], // La query depende del país seleccionado
    queryFn: () =>
      educationalStageService.getEducationalStages({
        countryId: selectedCountryId || undefined, // Envía countryId solo si está seleccionado
      }),
  });

  const stages = Array.isArray(stagesResponse)
    ? stagesResponse
    : stagesResponse?.data || [];

  const { mutateAsync: deleteCountryMutation } = useMutation({
    mutationFn: educationalStageService.deleteEducationalStage,
    onSuccess: (_, deletedCountryId) => {
      notifications.show({
        title: "País Eliminado",
        message: `El país ha sido eliminado correctamente.`,
        color: "green",
        icon: <IconTrash size={18} />,
      });
      queryClient.invalidateQueries({ queryKey: ["educational-stages"] });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error al Eliminar",
        message: error.message || "No se pudo eliminar el país.",
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
    },
  });
  const handleDeleteStage = async (stage: EducationalStageFE) => {
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar el país "${stage.name}"? Se eliminarán también sus etapas y subdivisiones asociadas.`
      )
    ) {
      await deleteCountryMutation(stage.id);
    }
  };
  const handleEditStage = (stage: EducationalStageFE) => {
    router.push(`/admin/educational-content/stages/edit/${stage.id}`);
  };

  return (
    <Box p="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>
          <IconBook
            size={28}
            style={{ marginRight: "10px", verticalAlign: "bottom" }}
          />
          Gestión de Etapas Educativas
        </Title>
        <Group>
          <Button
            onClick={() =>
              router.push("/admin/educational-content/stages/create")
            }
            leftSection={<IconPlus size={18} />}
            variant="filled"
            color="blue"
          >
            Nueva Etapa
          </Button>
          <Button
            onClick={() => refetch()}
            leftSection={<IconRefresh size={18} />}
            variant="default"
            loading={isLoading && stages.length > 0}
          >
            Refrescar
          </Button>
        </Group>
      </Group>

      <MantineSelect
        label="Filtrar por País"
        placeholder="Todos los países"
        data={[{ value: "", label: "Todos los Países" }, ...countryOptions]}
        value={selectedCountryId}
        onChange={(value) => setSelectedCountryId(value)}
        clearable
        mb="md"
        style={{ maxWidth: 300 }}
      />

      {isError && !isLoading && (
        <Alert title="Error" color="red" icon={<IconAlertCircle />}>
          No se pudieron cargar las etapas.
        </Alert>
      )}

      <EducationalStageTable
        stages={stages}
        isLoading={isLoading}
        onEdit={handleEditStage}
        onDelete={handleDeleteStage}
      />
    </Box>
  );
}
