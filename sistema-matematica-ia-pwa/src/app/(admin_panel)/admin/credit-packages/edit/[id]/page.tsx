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
} from "@tanstack/react-query"; // Import QueryClient, QueryClientProvider
import { notifications } from "@mantine/notifications";

import {
  CreditPackageFE,
  UpdateCreditPackageData,
} from "../../../../../../types/credit-package.types"; // Ajusta ruta
import { creditPackageService } from "../../../../../../lib/services/credit-package.service"; // Ajusta ruta
import {
  CreditPackageFormComponent,
  CreditPackageFormData,
} from "../../../../../../components/admin/credit-packages/CreditPackageFormComponent"; // Ajusta ruta

export default function EditCreditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string; // El [id] de la ruta
  const queryClient = useQueryClient();

  // Query para obtener los datos del paquete a editar
  const {
    data: currentPackage,
    isLoading: isLoadingPackage,
    isError,
    error,
    refetch, // Para el botón de descartar
  } = useQuery<CreditPackageFE, Error>({
    queryKey: ["credit-package", packageId],
    queryFn: () => creditPackageService.getCreditPackageById(packageId),
    enabled: !!packageId, // Solo ejecuta si hay packageId
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { mutateAsync: updatePackageMutation } = useMutation({
    mutationFn: (
      formData: UpdateCreditPackageData // El servicio espera UpdateCreditPackageData
    ) => creditPackageService.updateCreditPackage(packageId, formData),
    onSuccess: (updatedPackage) => {
      notifications.show({
        title: "Paquete Actualizado",
        message: `El paquete "${updatedPackage.name}" ha sido actualizado exitosamente.`,
        color: "green",
        icon: <IconDeviceFloppy size={18} />,
      });
      queryClient.invalidateQueries({ queryKey: ["credit-packages"] }); // Invalida la lista
      queryClient.setQueryData(["credit-package", packageId], updatedPackage); // Actualiza el caché de este item
      router.push("/admin/credit-packages"); // Volver a la lista
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error al Actualizar",
        message: err.message || "No se pudo actualizar el paquete de crédito.",
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
    },
  });

  const handleFormSubmit = async (formData: CreditPackageFormData) => {
    const dataToUpdate: UpdateCreditPackageData = {
      name: formData.name,
      description: formData.description,
      creditAmount: formData.creditAmount,
      price: formData.price,
      isActive: formData.isActive,
    };
    await updatePackageMutation(dataToUpdate);
  };

  if (isLoadingPackage) {
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
          loaderProps={{ children: <Text>Cargando datos del paquete...</Text> }}
        />
      </Box>
    );
  }

  if (isError || !currentPackage) {
    return (
      <Box p="lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error de Carga"
          color="red"
          withCloseButton
          onClose={() => router.push("/admin/credit-packages")}
        >
          No se pudieron cargar los datos del paquete o el paquete no existe.
          {error?.message && (
            <Text size="xs" mt="xs">
              Detalle: {error.message}
            </Text>
          )}
        </Alert>
      </Box>
    );
  }

  const initialFormDataForForm: CreditPackageFormData = {
    name: currentPackage.name,
    description: currentPackage.description || null,
    creditAmount: currentPackage.credit_amount || 0,
    price: currentPackage.price,
    isActive: currentPackage.is_active,
  };

  console.log("initialFormDataForForm", initialFormDataForForm, currentPackage);
  return (
    <Box p="lg" className="form-page-container">
      <Group justify="space-between" mb="xl">
        <Title order={3}>Editar Paquete de Crédito</Title>
        <Button
          //   component={Link}
          onClick={() => router.push("/admin/credit-packages")}
          variant="default"
          size="xs"
          leftSection={<IconArrowLeft size={16} />}
        >
          Volver a la Lista
        </Button>
      </Group>
      <CreditPackageFormComponent
        initialData={initialFormDataForForm} // Pasa los datos cargados
        onSubmit={handleFormSubmit}
        isSaving={false}
        onCancel={() => router.push("/admin/credit-packages")}
      />
    </Box>
  );
}
