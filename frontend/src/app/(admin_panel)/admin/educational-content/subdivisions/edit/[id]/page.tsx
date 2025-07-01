"use client";

import { useEffect, useState } from "react";
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
  Select as MantineSelect,
  ComboboxData,
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
  EducationalSubdivisionFE,
  EducationalStageFE,
  CountryFE,
  UpdateEducationalSubdivisionData,
} from "../../../../../../../types/educational-content.types";
import { educationalSubdivisionService } from "../../../../../../../lib/services/educational-subdivision.service";
import { educationalStageService } from "../../../../../../../lib/services/educational-stage.service";
import { countryService } from "../../../../../../../lib/services/country.service";
import {
  EducationalSubdivisionFormComponent,
  EducationalSubdivisionFormData,
} from "../../../../../../../components/admin/subdivisions/EducationalSubdivisionFormComponent";

export default function EditEducationalSubdivisionPage() {
  const router = useRouter();
  const params = useParams();
  const subdivisionId = params.id as string;
  const queryClientHook = useQueryClient();

  const {
    data: currentSubdivision,
    isLoading: isLoadingSubdivision,
    isError: isSubdivisionQueryError,
    error: subdivisionQueryError,
  } = useQuery<EducationalSubdivisionFE, Error>({
    queryKey: ["educational-subdivision", subdivisionId],
    queryFn: () =>
      educationalSubdivisionService.getEducationalSubdivisionById(
        subdivisionId
      ),
    enabled: !!subdivisionId,
  });
  // Estados para los selectores de contexto (País y Etapa)
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );
  // const [selectedStageIdForForm, setSelectedStageIdForForm] = useState<string | null>(null); // Se tomará de currentSubdivision

  // 2. Cargar todos los países (para el selector de país, si permites cambiarlo)
  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    CountryFE[],
    Error
  >({
    queryKey: ["all-active-countries-for-subdivision-edit"],
    queryFn: () => countryService.getActiveCountriesForPwa(),
  });
  const countryOptions: ComboboxData =
    countries?.map((c) => ({ value: c.id?.toString() || "", label: c.name })) ||
    [];

  // 3. Cargar etapas basadas en el país de la subdivisión actual (o el país seleccionado si se cambia)
  // Inicialmente, carga las etapas del país de la subdivisión actual
  useEffect(() => {
    if (currentSubdivision && currentSubdivision.educationalStage?.countryId) {
      // Asume que educationalStage tiene countryId
      setSelectedCountryId(
        currentSubdivision.educationalStage.countryId.toString()
      );
    } else if (currentSubdivision?.educationalStageId) {
      // Si no tenemos el objeto country anidado, necesitamos cargar la etapa para obtener su countryId
      // Esto es más complejo. Por ahora, asumimos que currentSubdivision.educationalStage.countryId está disponible
      // o que el selector de etapa mostrará todas las etapas si no se puede determinar el país.
    }
  }, [currentSubdivision]);

  const { data: stagesForSelectedCountry, isLoading: isLoadingStages } =
    useQuery<EducationalStageFE[], Error>({
      queryKey: ["stages-for-subdivision-edit", selectedCountryId],
      queryFn: () =>
        selectedCountryId
          ? educationalStageService.getEducationalStagesForPwa(
              selectedCountryId
            )
          : Promise.resolve([]),
      enabled: !!selectedCountryId,
    });
  const stageOptions =
    (Array.isArray(stagesForSelectedCountry)
      ? stagesForSelectedCountry
      : stagesForSelectedCountry || []
    )?.map((s: any) => ({ value: s.id.toString(), label: s.name })) || [];

  // Mutación para actualizar la subdivisión
  const { mutateAsync: updateSubdivisionMutation, isPending } = useMutation({
    mutationFn: (formData: UpdateEducationalSubdivisionData) =>
      educationalSubdivisionService.updateEducationalSubdivision(
        subdivisionId,
        formData
      ),
    onSuccess: (updatedSubdivision) => {
      notifications.show({
        title: "Subdivisión Actualizada",
        message: `La subdivisión "${updatedSubdivision.name}" ha sido Actualizada exitosamente.`,
        color: "green",
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClientHook.invalidateQueries({
        queryKey: [
          "educational-subdivisions",
          updatedSubdivision.educationalStageId,
        ],
      });
      queryClientHook.invalidateQueries({
        queryKey: ["educational-subdivision", subdivisionId],
      });
      queryClientHook.invalidateQueries({
        queryKey: ["educational-subdivisions"],
      });

      router.push("/admin/educational-content/subdivisions");
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error al Crear Subdivisión",
        message: error.message || "No se pudo crear la subdivisión educativa.",
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
    },
  });

  const handleFormSubmit = async (formData: EducationalSubdivisionFormData) => {
    await updateSubdivisionMutation(
      formData as UpdateEducationalSubdivisionData
    );
  };

  const isLoading =
    isLoadingSubdivision ||
    isLoadingCountries ||
    (selectedCountryId && isLoadingStages);

  if (isLoading) {
    /* ... loader ... */
  }
  if (isSubdivisionQueryError || !currentSubdivision) {
    /* ... error de carga de subdivisión ... */
  }
  if (!countries && !isLoadingCountries) {
    /* ... error/mensaje de no hay países ... */
  }

  // Prepara initialData para el formulario una vez que currentSubdivision esté disponible
  const initialFormDataForForm: EducationalSubdivisionFE | undefined =
    currentSubdivision
      ? {
          id: currentSubdivision.id,
          name: currentSubdivision.name,
          description: currentSubdivision.description || null,
          isActive: currentSubdivision.isActive,
          educationalStageId: currentSubdivision.educationalStageId.toString(),
        }
      : undefined;

  return (
    <Box p="lg" className="form-page-container">
      <Group justify="space-between" mb="xl" className="page-header">
        <Title order={3}>Editar Subdivisión: {currentSubdivision?.name}</Title>
        <Button
          onClick={() => router.push("/admin/educational-content/subdivisions")}
          variant="default"
          size="xs"
          leftSection={<IconArrowLeft size={16} />}
        >
          Volver
        </Button>
      </Group>

      {/* Selectores de País y Etapa para CONTEXTO, podrían estar deshabilitados o permitir cambio */}
      {/* <Paper withBorder shadow="sm" p="lg" radius="md" mb="xl">
        <Title order={5} mb="sm">
          Contexto de la Subdivisión
        </Title>
        <Group grow>
          <MantineSelect
            label="País de la Etapa"
            data={countryOptions}
            value={selectedCountryId}
            onChange={(val) => {
              setSelectedCountryId(val);
              // Si cambias el país, el educationalStageId del form debe resetearse
              // o el selector de Etapa en el form debe actualizarse
            }}
            disabled={isLoadingCountries || isPending} // Deshabilitar si está guardando
            searchable
          />
          <MantineSelect
            label="Etapa Educativa (Asociada)"
            data={stageOptions}
            // El valor se toma del initialData del formulario
            value={currentSubdivision?.educationalStageId.toString()}
            disabled // Generalmente no se cambia la etapa padre al editar una subdivisión, se borra y crea en otra.
            // Si se permite, el form debe reflejarlo.
            searchable
            readOnly // Hacerlo readonly
          />
        </Group>
      </Paper> */}

      {initialFormDataForForm ? (
        <EducationalSubdivisionFormComponent
          initialData={initialFormDataForForm}
          stages={
            stagesForSelectedCountry
              ? Array.isArray(stagesForSelectedCountry)
                ? stagesForSelectedCountry
                : stagesForSelectedCountry
              : []
          }
          onSubmit={handleFormSubmit}
          isSaving={isPending}
          onCancel={() =>
            router.push("/admin/educational-content/subdivisions")
          }
        />
      ) : (
        !isLoading && (
          <Alert color="orange">Cargando datos o contexto no encontrado.</Alert>
        )
      )}
    </Box>
  );
}
