"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Title,
  Button,
  Group,
  Alert,
  Select as MantineSelect,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import {
  IconSitemap,
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
  EducationalSubdivisionFE,
  CountryFE,
  EducationalStageFE,
  PaginatedEducationalSubdivisionsResponse,
} from "../../../../../types/educational-content.types";
import { educationalSubdivisionService } from "../../../../../lib/services/educational-subdivision.service";
import { educationalStageService } from "../../../../../lib/services/educational-stage.service";
import { countryService } from "../../../../../lib/services/country.service";
import { EducationalSubdivisionTable } from "../../../../../components/admin/subdivisions/EducationalSubdivisionTable";

export default function EducationalSubdivisionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

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

  // Cargar etapas basadas en el país seleccionado
  const { data: stages, isLoading: isLoadingStages } = useQuery<
    EducationalStageFE[],
    Error
  >({
    queryKey: ["stages-for-subdivision-filter", selectedCountryId],
    queryFn: () =>
      selectedCountryId
        ? educationalStageService.getEducationalStagesForPwa(selectedCountryId)
        : Promise.resolve([]),
    enabled: !!selectedCountryId,
  });
  const stageOptions =
    (Array.isArray(stages) ? stages : stages || [])?.map((s) => ({
      value: s.id.toString(),
      label: s.name,
    })) || [];

  const {
    data: subdivisionsResponse,
    isError,
    isLoading: isLoadingSubdivisions,
    refetch,
  } = useQuery<
    PaginatedEducationalSubdivisionsResponse | EducationalSubdivisionFE[],
    Error
  >({
    queryKey: ["educational-subdivisions", selectedStageId],
    queryFn: () =>
      educationalSubdivisionService.getEducationalSubdivisions({
        educationalStageId: selectedStageId || undefined,
      }),
    enabled: !!selectedStageId, // Solo cargar si se selecciona una etapa
  });

  const subdivisions = Array.isArray(subdivisionsResponse)
    ? subdivisionsResponse
    : subdivisionsResponse?.data || [];

  const { mutateAsync: deleteSubdivisionMutation } = useMutation({
    mutationFn: educationalSubdivisionService.deleteEducationalSubdivision,
    onSuccess: (_, deletedCountryId) => {
      notifications.show({
        title: "País Eliminado",
        message: `El país ha sido eliminado correctamente.`,
        color: "green",
        icon: <IconTrash size={18} />,
      });
      queryClient.invalidateQueries({ queryKey: ["educational-subdivisions"] });
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
  const handleDeleteSubdivision = async (sub: EducationalSubdivisionFE) => {
    if (
      sub.id &&
      window.confirm(
        `¿Está seguro de que desea eliminar el item "${sub.name}"?`
      )
    ) {
      await deleteSubdivisionMutation(sub.id);
    }
  };
  const handleEditSubdivision = (sub: EducationalSubdivisionFE) => {
    router.push(`/admin/educational-content/subdivisions/edit/${sub.id}`);
  };

  const handleCountryChange = (countryId: string | null) => {
    setSelectedCountryId(countryId);
    setSelectedStageId(null); // Resetear etapa al cambiar país
  };

  const isLoading =
    isLoadingCountries || isLoadingStages || isLoadingSubdivisions;

  return (
    <Box p="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>
          <IconSitemap
            size={28}
            style={{ marginRight: "10px", verticalAlign: "bottom" }}
          />
          Gestión de Subdivisiones Educativas
        </Title>
        <Group>
          <Button
            onClick={() =>
              router.push("/admin/educational-content/subdivisions/create")
            }
            leftSection={<IconPlus size={18} />}
            variant="filled"
            color="blue"
            disabled={!selectedStageId || isLoadingStages}
          >
            Nueva Subdivisión
          </Button>
          {/* ... botón de refrescar ... */}
          <Button
            onClick={() => refetch()}
            leftSection={<IconRefresh size={18} />}
            variant="default"
            loading={isLoading && !!stages?.length && stages?.length > 0}
          >
            Refrescar
          </Button>
        </Group>
      </Group>

      <Group mb="md" grow>
        <MantineSelect
          label="Filtrar por País"
          placeholder="Seleccione País"
          data={countryOptions}
          value={selectedCountryId?.toString()}
          onChange={handleCountryChange}
          disabled={isLoadingCountries}
          clearable
          searchable
        />
        <MantineSelect
          label="Filtrar por Etapa"
          placeholder="Seleccione Etapa"
          data={stageOptions}
          value={selectedStageId}
          onChange={setSelectedStageId}
          disabled={isLoadingStages || !selectedCountryId}
          clearable
          searchable
        />
      </Group>

      {isLoading && (
        <Center p="xl">
          <Loader />
        </Center>
      )}
      {!isLoading && isError && (
        <Alert title="Error" color="red">
          No se pudieron cargar las subdivisiones.
        </Alert>
      )}

      {!isLoading &&
        !isError &&
        selectedStageId && ( // Mostrar tabla solo si se seleccionó una etapa
          <EducationalSubdivisionTable
            subdivisions={subdivisions}
            isLoading={isLoadingSubdivisions && subdivisions.length === 0}
            onEdit={handleEditSubdivision}
            onDelete={handleDeleteSubdivision}
          />
        )}
      {!isLoading && !isError && !selectedStageId && (
        <Center p="xl">
          <Text c="dimmed">
            Seleccione un país y una etapa para ver las subdivisiones.
          </Text>
        </Center>
      )}
    </Box>
  );
}
