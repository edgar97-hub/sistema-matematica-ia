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
  Paper,
  Select as MantineSelect,
  ComboboxData,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
  IconSitemap,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation"; // Importar useSearchParams
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";

import {
  EducationalSubdivisionFormComponent,
  EducationalSubdivisionFormData,
} from "../../../../../../components/admin/subdivisions/EducationalSubdivisionFormComponent"; // Ajusta ruta
import { educationalSubdivisionService } from "../../../../../../lib/services/educational-subdivision.service"; // Ajusta ruta
import { educationalStageService } from "../../../../../../lib/services/educational-stage.service"; // Para obtener etapas
import { countryService } from "../../../../../../lib/services/country.service"; // Para obtener países
import {
  EducationalStageFE,
  CountryFE,
} from "../../../../../../types/educational-content.types"; // Ajusta ruta

// const queryClient = new QueryClient({ /* ... */ }); // Asumimos que el Provider está en un layout superior

// export default function CreateEducationalSubdivisionPageWrapper() { /* ... */ }

export default function CreateEducationalSubdivisionPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Para leer query params
  const queryClientHook = useQueryClient();

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    searchParams.get("countryId") || null
  );
  const [selectedStageIdForForm, setSelectedStageIdForForm] = useState<
    string | null
  >(searchParams.get("stageId") || null);

  // 1. Cargar países (para el primer selector)
  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    CountryFE[],
    Error
  >({
    queryKey: ["all-active-countries-for-subdivision-form"],
    queryFn: () => countryService.getActiveCountriesForPwa(),
  });
  const countryOptions: ComboboxData =
    countries?.map((c) => ({ value: c.id?.toString() || "", label: c.name })) ||
    [];

  // 2. Cargar etapas basadas en el país seleccionado
  const { data: stages, isLoading: isLoadingStages } = useQuery<
    EducationalStageFE[],
    Error
  >({
    queryKey: ["active-stages-for-subdivision-form", selectedCountryId],
    queryFn: () =>
      selectedCountryId
        ? educationalStageService.getEducationalStagesForPwa(selectedCountryId) // Asume que getEducationalStages puede devolver array simple
        : Promise.resolve([]),
    enabled: !!selectedCountryId, // Solo si hay un país seleccionado
  });
  const stageOptions =
    (Array.isArray(stages) ? stages : stages || [])?.map((s) => ({
      value: s.id.toString(),
      label: s.name,
    })) || [];

  // Efecto para actualizar selectedStageIdForForm si las opciones de etapa cambian y el actual no es válido
  useEffect(() => {
    if (stages && selectedStageIdForForm) {
      const isValidStage = (Array.isArray(stages) ? stages : stages || []).some(
        (s: any) => s.id.toString() === selectedStageIdForForm
      );
      if (!isValidStage) {
        setSelectedStageIdForForm(null); // Resetear si la etapa seleccionada ya no es válida para el país
      }
    }
  }, [stages, selectedStageIdForForm]);

  const { mutateAsync: createSubdivisionMutation, isPending } = useMutation({
    mutationFn: educationalSubdivisionService.createEducationalSubdivision,
    onSuccess: (newSubdivision) => {
      notifications.show({
        title: "Subdivisión Creada",
        message: `La subdivisión "${newSubdivision.name}" ha sido creada exitosamente.`,
        color: "green",
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClientHook.invalidateQueries({
        queryKey: ["educational-subdivisions", selectedStageIdForForm],
      }); // Invalida la lista de subdivisiones para la etapa
      queryClientHook.invalidateQueries({
        queryKey: ["educational-subdivisions"],
      });
      router.push("/admin/educational-content/subdivisions"); // O a la lista de subdivisiones filtrada
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

  const handleSubmit = async (formData: EducationalSubdivisionFormData) => {
    if (!selectedStageIdForForm && !formData.educationalStageId) {
      notifications.show({
        title: "Error de Validación",
        message: "Debe seleccionar una Etapa Educativa.",
        color: "orange",
      });
      return;
    }
    // Asegurarse que educationalStageId esté en formData
    const dataToSubmit = {
      ...formData,
      educationalStageId:
        formData.educationalStageId || selectedStageIdForForm!,
    };
    await createSubdivisionMutation(dataToSubmit);
  };

  const isLoadingFilters =
    isLoadingCountries || (selectedCountryId && isLoadingStages);

  return (
    <Box p="lg" className="form-page-container">
      <Group justify="space-between" mb="xl" className="page-header">
        <Title order={3}>Crear Nueva Subdivisión Educativa</Title>
        <Button
          component="a"
          href="/admin/educational-content/subdivisions" // Ajusta esta ruta
          variant="default"
          size="xs"
          leftSection={<IconArrowLeft size={16} />}
        >
          Volver a la Lista
        </Button>
      </Group>

      <Paper withBorder shadow="sm" p="lg" radius="md" mb="xl">
        <Title order={5} mb="sm">
          Seleccionar Contexto
        </Title>
        <Group grow align="flex-start">
          <MantineSelect
            label="País"
            placeholder="Seleccione un país"
            data={countryOptions}
            value={selectedCountryId}
            onChange={setSelectedCountryId}
            disabled={isLoadingCountries}
            searchable
            nothingFoundMessage="No hay países"
          />
          <MantineSelect
            label="Etapa Educativa"
            placeholder={
              selectedCountryId
                ? "Seleccione una etapa"
                : "Seleccione un país primero"
            }
            data={stageOptions}
            value={selectedStageIdForForm}
            onChange={setSelectedStageIdForForm}
            disabled={!selectedCountryId || isLoadingStages}
            searchable
            nothingFoundMessage="No hay etapas para este país"
            required
          />
        </Group>
        {isLoadingFilters && (
          <Center mt="sm">
            <Loader size="xs" />
          </Center>
        )}
      </Paper>

      {selectedStageIdForForm ? (
        <EducationalSubdivisionFormComponent
          // Pasa el educationalStageId seleccionado al formulario si no es parte de su estado interno
          // o modifica el form para que tome el stageId como prop y lo use en initialValues
          initialData={
            {
              educationalStageId: selectedStageIdForForm,
            } as EducationalSubdivisionFormData
          } // Parcial, el resto es vacío
          stages={stages ? (Array.isArray(stages) ? stages : stages) : []} // Pasa todas las etapas cargadas para el país
          // El form usará el stageId para preseleccionar
          onSubmit={handleSubmit}
          isSaving={isPending}
          onCancel={() =>
            router.push("/admin/educational-content/subdivisions")
          }
        />
      ) : (
        <Alert
          color="blue"
          title="Seleccione Contexto"
          icon={<IconAlertCircle />}
        >
          Por favor, seleccione un País y una Etapa Educativa para añadir una
          subdivisión.
        </Alert>
      )}
    </Box>
  );
}
