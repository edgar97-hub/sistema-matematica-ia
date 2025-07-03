// "use client";

// import { useState, useEffect, useMemo, useRef } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Title,
//   Text,
//   Paper,
//   Button,
//   Group,
//   FileInput,
//   Select,
//   Textarea,
//   LoadingOverlay,
//   Alert,
//   Center,
//   Stack, // Añadido Stack para organizar elementos de cámara
// } from "@mantine/core";
// import { useForm, zodResolver } from "@mantine/form";
// import { z } from "zod";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { notifications } from "@mantine/notifications";
// import {
//   IconUpload,
//   IconAlertCircle,
//   IconCircleCheck,
//   IconPhoto,
//   IconMoodShare,
//   IconDeviceFloppy,
//   IconCamera, // Añadido para el botón de cámara
//   IconRotate2, // Añadido para el botón de volver a tomar foto
//   IconProgress,
// } from "@tabler/icons-react";

// import { useAuthStore } from "../../../../store/auth.store"; // Ajusta ruta
// import { countryService } from "../../../../lib/services/country.service"; // Ajusta ruta
// import { educationalStageService } from "../../../../lib/services/educational-stage.service"; // Ajusta ruta
// import { educationalSubdivisionService } from "../../../../lib/services/educational-subdivision.service"; // Ajusta ruta
// import {
//   orderService,
//   CreateOrderFrontendData,
// } from "../../../../lib/services/order.service"; // Ajusta ruta
// import {
//   CountryFE,
//   EducationalStageFE,
//   EducationalSubdivisionFE,
// } from "../../../../types/educational-content.types"; // Ajusta ruta
// import classes from "./new-order-page.module.css"; // Crearemos este CSS Module
// import Link from "next/link";

// // Esquema de validación con Zod
// const MAX_FILE_SIZE_MB = 10;
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// const newOrderSchema = z.object({
//   imageFile: z
//     .custom<File | null>((file) => file instanceof File, {
//       message: "Se requiere una imagen del problema.",
//     })
//     .refine(
//       (file) => file && file.size <= MAX_FILE_SIZE_BYTES,
//       `El tamaño máximo del archivo es ${MAX_FILE_SIZE_MB}MB.`
//     )
//     .refine(
//       (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
//       "Solo se permiten imágenes JPG, JPEG o PNG."
//     ),
//   countrySelected: z.string().min(1, { message: "Debe seleccionar un país." }),
//   educationalStageSelected: z
//     .string()
//     .min(1, { message: "Debe seleccionar una etapa educativa." }),
//   subdivisionGradeSelected: z.string().nullable().optional(), // Opcional, no todos los stages tienen subdivisiones
//   topic: z
//     .string()
//     .min(3, { message: "El tema debe tener al menos 3 caracteres." })
//     .max(250, { message: "Máximo 250 caracteres." }),
// });

// type NewOrderFormData = z.infer<typeof newOrderSchema>;

// // QueryClientProvider ya debería estar en (pwa_app)/layout.tsx

// export default function NewOrderPage() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const { user, token } = useAuthStore();

//   const form = useForm<NewOrderFormData>({
//     initialValues: {
//       imageFile: null as File | null, // Tipo File
//       countrySelected: user?.countryOfOrigin || "", // Pre-poblar con el país del usuario si existe
//       educationalStageSelected: "",
//       subdivisionGradeSelected: null,
//       topic: "",
//     },
//     validate: zodResolver(newOrderSchema),
//   });

//   // Estado para la funcionalidad de la cámara
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [capturedImagePreview, setCapturedImagePreview] = useState<
//     string | null
//   >(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null); // Para almacenar la referencia al MediaStream

//   const startCamera = () => {
//     setIsCameraActive(true);
//     setCapturedImagePreview(null);
//     form.setFieldValue("imageFile", null);
//   };

//   useEffect(() => {
//     if (isCameraActive) {
//       const getMedia = async () => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//           });
//           mediaStreamRef.current = stream;
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//             // No es necesario llamar a play() si el tag tiene el atributo autoPlay
//           }
//         } catch (err) {
//           console.error("Error al acceder a la cámara:", err);
//           notifications.show({
//             title: "Error de Cámara",
//             message:
//               "No se pudo acceder a la cámara. Asegúrate de dar permisos.",
//             color: "red",
//             icon: <IconAlertCircle size={18} />,
//           });
//           setIsCameraActive(false); // Volver al estado inicial si hay un error
//         }
//       };

//       getMedia();
//     } else {
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//         mediaStreamRef.current = null;
//       }
//     }

//     return () => {
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [isCameraActive]);

//   const stopCamera = () => {
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//       mediaStreamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraActive(false);
//   };

//   // Función para tomar una foto
//   const handleTakePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;

//       // Asegurarse de que el canvas tenga las mismas dimensiones que el video
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const context = canvas.getContext("2d");
//       if (context) {
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const imageDataUrl = canvas.toDataURL("image/png");
//         setCapturedImagePreview(imageDataUrl);

//         // Convertir Data URL a objeto File para el formulario
//         fetch(imageDataUrl)
//           .then((res) => res.blob())
//           .then((blob) => {
//             const file = new File([blob], `photo-${Date.now()}.png`, {
//               type: "image/png",
//             });
//             form.setFieldValue("imageFile", file);
//             stopCamera(); // Detener la cámara después de tomar la foto
//           })
//           .catch((err) => {
//             console.error("Error al convertir imagen a File:", err);
//             notifications.show({
//               title: "Error al Procesar Imagen",
//               message: "No se pudo procesar la foto capturada.",
//               color: "red",
//               icon: <IconAlertCircle size={18} />,
//             });
//           });
//       }
//     }
//   };

//   // Función para volver a tomar la foto
//   const handleRetakePhoto = () => {
//     setCapturedImagePreview(null);
//     form.setFieldValue("imageFile", null);
//     startCamera(); // Reiniciar la cámara
//   };

//   // Cargar países
//   const { data: countries, isLoading: isLoadingCountries } = useQuery<
//     CountryFE[],
//     Error
//   >({
//     queryKey: ["pwa-active-countries"],
//     queryFn: () => countryService.getActiveCountriesForPwa(), // Tu servicio para PWA
//   });
//   const countryOptions = useMemo(
//     () => countries?.map((c) => ({ value: c.name, label: c.name })) || [],
//     [countries]
//   );

//   // Cargar etapas cuando cambia el país seleccionado
//   const selectedCountryName = form.values.countrySelected;
//   const { data: stages, isLoading: isLoadingStages } = useQuery<
//     EducationalStageFE[],
//     Error
//   >({
//     queryKey: ["pwa-stages-by-country", selectedCountryName],
//     queryFn: () =>
//       selectedCountryName
//         ? educationalStageService.getStagesByCountryNameForPwa(
//             selectedCountryName
//           )
//         : Promise.resolve([]),
//     enabled: !!selectedCountryName,
//   });
//   const stageOptions = useMemo(
//     () =>
//       (Array.isArray(stages) ? stages : [])?.map((s) => ({
//         value: s.name,
//         label: s.name,
//       })) || [],
//     [stages]
//   );

//   // Cargar subdivisiones cuando cambia la etapa seleccionada
//   const selectedStageName = form.values.educationalStageSelected;
//   const { data: subdivisions, isLoading: isLoadingSubdivisions } = useQuery<
//     EducationalSubdivisionFE[],
//     Error
//   >({
//     queryKey: [
//       "pwa-subdivisions-by-stage",
//       selectedStageName,
//       selectedCountryName,
//     ], // Añade country para refetch si cambia
//     queryFn: () => {
//       if (selectedStageName && stages) {
//         const currentStage = (Array.isArray(stages) ? stages : []).find(
//           (s) => s.name === selectedStageName
//         );
//         if (currentStage) {
//           console.log("currentStage", currentStage);
//           return educationalSubdivisionService.getSubdivisionsByStageIdForPwa(
//             currentStage.id.toString()
//           );
//         }
//       }
//       return Promise.resolve([]);
//     },
//     enabled: !!selectedStageName && !!stages,
//   });
//   const subdivisionOptions = useMemo(
//     () =>
//       (Array.isArray(subdivisions) ? subdivisions : [])?.map((s) => ({
//         value: s.name,
//         label: s.name,
//       })) || [],
//     [subdivisions]
//   );

//   // Efecto para resetear etapa y subdivisión si cambia el país
//   useEffect(() => {
//     form.setFieldValue("educationalStageSelected", "");
//     form.setFieldValue("subdivisionGradeSelected", null);
//   }, [selectedCountryName]); // Solo depende de selectedCountryName

//   // Efecto para resetear subdivisión si cambia la etapa
//   useEffect(() => {
//     form.setFieldValue("subdivisionGradeSelected", null);
//   }, [selectedStageName]); // Solo depende de selectedStageName

//   // Mutación para crear la orden
//   const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } =
//     useMutation({
//       mutationFn: (formData: CreateOrderFrontendData) => {
//         if (!token) throw new Error("No autenticado.");
//         return orderService.createOrderPwa(formData, token); // Necesitas este método en orderService
//       },
//       onSuccess: (newOrder: any) => {
//         notifications.show({
//           title: "Solicitud Recibida",
//           message: `Tu problema (Orden N°: ${newOrder.code}) ha comenzado a procesarse.`,
//           color: "blue",
//           icon: <IconProgress size={18} />,
//         });
//         useAuthStore.getState().setUser(
//           {
//             ...user!,
//             credits: user!.credits - (newOrder.creditsConsumed || 1),
//           },
//           token
//         );
//         queryClient.invalidateQueries({ queryKey: ["pwa-user-orders"] });
//         queryClient.invalidateQueries({
//           queryKey: ["pwa-user-profile", user?.id],
//         });
//         router.push(`/orders/${newOrder.id}/status`);
//       },
//       onError: (error: any) => {
//         notifications.show({
//           title: "Error al Enviar Solicitud",
//           message:
//             error.message ||
//             "No se pudo crear la orden. Verifica tus créditos o intenta de nuevo.",
//           color: "red",
//           icon: <IconAlertCircle size={18} />,
//         });
//       },
//     });

//   const handleSubmit = async (values: NewOrderFormData) => {
//     if (!user || user.credits < 1) {
//       notifications.show({
//         title: "Créditos Insuficientes",
//         message: "No tienes suficientes créditos para esta operación.",
//         color: "orange",
//       });
//       router.push("/credits");
//       return;
//     }

//     const formDataPayload = new FormData();
//     formDataPayload.append("imageFile", values.imageFile!); // El '!' asume que la validación ya pasó
//     formDataPayload.append("countrySelected", values.countrySelected);
//     formDataPayload.append(
//       "educationalStageSelected",
//       values.educationalStageSelected
//     );
//     if (values.subdivisionGradeSelected) {
//       formDataPayload.append(
//         "subdivisionGradeSelected",
//         values.subdivisionGradeSelected
//       );
//     }
//     formDataPayload.append("topic", values.topic);

//     await createOrderMutation(formDataPayload as any); // El servicio debe esperar FormData
//   };

//   if (!user) {
//     // Si no hay usuario (aunque el layout PWA debería proteger esto)
//     return (
//       <Center p="xl">
//         <Text>Debes iniciar sesión para crear una nueva resolución.</Text>
//       </Center>
//     );
//   }
//   console.log("isCameraActive", isCameraActive);
//   return (
//     <Box p="lg" className={classes.newOrderContainer}>
//       <Title order={2} className={classes.pageTitle} mb="xl">
//         <IconMoodShare
//           size={32}
//           style={{ marginRight: "12px", verticalAlign: "bottom" }}
//         />
//         Nueva Resolución Matemática
//       </Title>

//       <Paper withBorder shadow="md" p="xl" radius="md">
//         {/* Selector de origen de imagen */}
//         <Group justify="center" mb="lg">
//           {!isCameraActive && !capturedImagePreview && (
//             <Button
//               onClick={startCamera}
//               leftSection={<IconCamera size={18} />}
//               variant="outline"
//             >
//               Tomar Foto
//             </Button>
//           )}
//           {(isCameraActive || capturedImagePreview) && (
//             <Button
//               onClick={() => {
//                 stopCamera();
//                 setCapturedImagePreview(null);
//                 form.setFieldValue("imageFile", null);
//               }}
//               leftSection={<IconUpload size={18} />}
//               variant="outline"
//             >
//               Subir Archivo
//             </Button>
//           )}
//         </Group>

//         {/* Sección de entrada de imagen */}
//         {!isCameraActive && !capturedImagePreview && (
//           <FileInput
//             label="Imagen del Problema Matemático"
//             placeholder="Selecciona o arrastra una imagen (JPG, PNG)"
//             required
//             accept="image/png,image/jpeg,image/jpg"
//             {...form.getInputProps("imageFile")}
//             leftSection={<IconUpload size={18} />}
//             mb="md"
//             description={`Máx. ${MAX_FILE_SIZE_MB}MB. Formatos: JPG, PNG.`}
//           />
//         )}

//         {isCameraActive && !capturedImagePreview && (
//           <Stack align="center" mb="md">
//             <video
//               ref={videoRef}
//               style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
//               autoPlay
//               playsInline
//             ></video>
//             <canvas ref={canvasRef} style={{ display: "none" }}></canvas>{" "}
//             <Button
//               onClick={handleTakePhoto}
//               leftSection={<IconCamera size={18} />}
//             >
//               Capturar Foto
//             </Button>
//           </Stack>
//         )}

//         {capturedImagePreview && (
//           <Box
//             mb="md"
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               borderRadius: "4px",
//               textAlign: "center",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Text size="sm" fw={500} mb="sm">
//               Vista previa de la foto capturada:
//             </Text>
//             <img
//               src={capturedImagePreview}
//               alt="Vista previa de la foto capturada"
//               style={{
//                 maxHeight: "250px",
//                 maxWidth: "100%",
//                 borderRadius: "4px",
//               }}
//             />
//             <Button
//               onClick={handleRetakePhoto}
//               leftSection={<IconRotate2 size={18} />}
//               variant="outline"
//               mt="md"
//             >
//               Volver a Tomar Foto
//             </Button>
//           </Box>
//         )}

//         {/* Muestra la vista previa del archivo subido si no hay cámara activa ni imagen capturada */}
//         {form.values.imageFile && !isCameraActive && !capturedImagePreview && (
//           <Box
//             mb="md"
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               borderRadius: "4px",
//             }}
//           >
//             <Text size="sm" fw={500}>
//               Vista previa:
//             </Text>
//             <img
//               src={URL.createObjectURL(form.values.imageFile)}
//               alt="Vista previa"
//               style={{
//                 maxHeight: "150px",
//                 marginTop: "10px",
//                 borderRadius: "4px",
//               }}
//             />
//           </Box>
//         )}

//         <Textarea
//           label="Tema del Problema"
//           placeholder="Ej: Ecuaciones de segundo grado, Trigonometría básica"
//           required
//           {...form.getInputProps("topic")}
//           minRows={2}
//           autosize
//           mb="lg"
//         />

//         <Select
//           label="País para la Resolución"
//           placeholder="Selecciona un país"
//           data={isLoadingCountries ? [] : countryOptions}
//           required
//           searchable
//           nothingFoundMessage="País no encontrado"
//           {...form.getInputProps("countrySelected")}
//           disabled={isLoadingCountries}
//           mb="md"
//         />
//         <Select
//           label="Etapa Educativa"
//           placeholder={
//             selectedCountryName
//               ? "Selecciona una etapa"
//               : "Selecciona un país primero"
//           }
//           data={isLoadingStages ? [] : stageOptions}
//           required
//           searchable
//           nothingFoundMessage="No hay etapas para este país"
//           {...form.getInputProps("educationalStageSelected")}
//           disabled={!selectedCountryName || isLoadingStages}
//           mb="md"
//         />
//         <Select
//           label="Subdivisión/Grado (Opcional)"
//           placeholder={
//             selectedStageName
//               ? "Selecciona una subdivisión"
//               : "Selecciona una etapa primero"
//           }
//           data={isLoadingSubdivisions ? [] : subdivisionOptions}
//           searchable
//           nothingFoundMessage="No hay subdivisiones para esta etapa"
//           clearable
//           {...form.getInputProps("subdivisionGradeSelected")}
//           disabled={
//             !selectedStageName ||
//             isLoadingSubdivisions ||
//             subdivisionOptions.length === 0
//           }
//           mb="lg"
//         />

//         {/* Sección de Confirmar y Enviar integrada */}
//         <Text size="sm" mb="md">
//           Estás a punto de usar{" "}
//           <Text span fw={700}>
//             1 crédito
//           </Text>{" "}
//           para esta resolución.
//         </Text>
//         <Text size="sm" mb="lg">
//           Créditos disponibles:{" "}
//           <Text span fw={700}>
//             {user?.credits || 0}
//           </Text>
//           .
//         </Text>
//         {user.credits < 1 && (
//           <Alert
//             color="orange"
//             title="Créditos Insuficientes"
//             icon={<IconAlertCircle />}
//             mb="lg"
//           >
//             No tienes suficientes créditos.{" "}
//             <Link href="/credits">
//               <Text span component="a" c="blue" inherit>
//                 Compra más créditos aquí.
//               </Text>
//             </Link>
//           </Alert>
//         )}

//         <Group justify="flex-end">
//           <Button
//             type="button"
//             onClick={() => form.onSubmit(handleSubmit)()}
//             loading={isCreatingOrder}
//             disabled={
//               isCreatingOrder ||
//               (user ? user.credits < 1 : true) ||
//               !form.isValid()
//             }
//             leftSection={<IconDeviceFloppy size={18} />}
//             color="green"
//           >
//             {isCreatingOrder ? "Enviando..." : "Confirmar y Resolver"}
//           </Button>
//         </Group>
//       </Paper>
//     </Box>
//   );
// }

"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Title,
  Paper,
  Button,
  Group,
  Select,
  Textarea,
  Grid,
  Divider,
  Stack,
  Center,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  IconMoodShare,
  IconProgress,
  IconAlertCircle,
} from "@tabler/icons-react";

import { useAuthStore } from "../../../../store/auth.store";
import { countryService } from "../../../../lib/services/country.service";
import { educationalStageService } from "../../../../lib/services/educational-stage.service";
import { educationalSubdivisionService } from "../../../../lib/services/educational-subdivision.service";
import {
  orderService,
  CreateOrderFrontendData,
} from "../../../../lib/services/order.service";
import {
  CountryFE,
  EducationalStageFE,
  EducationalSubdivisionFE,
} from "../../../../types/educational-content.types";
import { ImageInput } from "../../../../components/pwa/orders/ImageInput";
import { OrderConfirmation } from "../../../../components/pwa/orders/OrderConfirmation";
import classes from "./new-order-page.module.css";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const newOrderSchema = z.object({
  imageFile: z
    .custom<File>((file) => file instanceof File, {
      message: "Se requiere una imagen del problema.",
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `El tamaño máximo del archivo es ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten imágenes JPG, JPEG, o PNG."
    ),
  countrySelected: z.string().min(1, { message: "Debe seleccionar un país." }),
  educationalStageSelected: z
    .string()
    .min(1, { message: "Debe seleccionar una etapa educativa." }),
  subdivisionGradeSelected: z.string().nullable().optional(),
  topic: z
    .string()
    .min(3, { message: "El tema debe tener al menos 3 caracteres." })
    .max(250, { message: "Máximo 250 caracteres." }),
});

type NewOrderFormData = z.infer<typeof newOrderSchema>;

export default function NewOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();

  const form = useForm<NewOrderFormData>({
    initialValues: {
      imageFile: null as any,
      countrySelected: user?.countryOfOrigin || "",
      educationalStageSelected: "",
      subdivisionGradeSelected: null,
      topic: "",
    },
    validate: zodResolver(newOrderSchema),
  });

  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    CountryFE[],
    Error
  >({
    queryKey: ["pwa-active-countries"],
    queryFn: () => countryService.getActiveCountriesForPwa(),
  });
  const countryOptions = useMemo(
    () => countries?.map((c) => ({ value: c.name, label: c.name })) || [],
    [countries]
  );

  const selectedCountryName = form.values.countrySelected;
  const { data: stages, isLoading: isLoadingStages } = useQuery<
    EducationalStageFE[],
    Error
  >({
    queryKey: ["pwa-stages-by-country", selectedCountryName],
    queryFn: () =>
      selectedCountryName
        ? educationalStageService.getStagesByCountryNameForPwa(
            selectedCountryName
          )
        : Promise.resolve([]),
    enabled: !!selectedCountryName,
  });
  const stageOptions = useMemo(
    () =>
      (Array.isArray(stages) ? stages : [])?.map((s) => ({
        value: s.name,
        label: s.name,
      })) || [],
    [stages]
  );

  const selectedStageName = form.values.educationalStageSelected;
  const { data: subdivisions, isLoading: isLoadingSubdivisions } = useQuery<
    EducationalSubdivisionFE[],
    Error
  >({
    queryKey: [
      "pwa-subdivisions-by-stage",
      selectedStageName,
      selectedCountryName,
    ],
    queryFn: () => {
      if (selectedStageName && stages) {
        const currentStage = (Array.isArray(stages) ? stages : []).find(
          (s) => s.name === selectedStageName
        );
        if (currentStage) {
          return educationalSubdivisionService.getSubdivisionsByStageIdForPwa(
            currentStage.id.toString()
          );
        }
      }
      return Promise.resolve([]);
    },
    enabled: !!selectedStageName && !!stages,
  });
  const subdivisionOptions = useMemo(
    () =>
      (Array.isArray(subdivisions) ? subdivisions : [])?.map((s) => ({
        value: s.name,
        label: s.name,
      })) || [],
    [subdivisions]
  );

  useEffect(() => {
    form.setFieldValue("educationalStageSelected", "");
    form.setFieldValue("subdivisionGradeSelected", null);
  }, [selectedCountryName]);

  useEffect(() => {
    form.setFieldValue("subdivisionGradeSelected", null);
  }, [selectedStageName]);

  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } =
    useMutation({
      mutationFn: (formData: CreateOrderFrontendData) => {
        if (!token) throw new Error("No autenticado.");
        return orderService.createOrderPwa(formData, token);
      },
      onSuccess: (newOrder: any) => {
        notifications.show({
          title: "Solicitud Recibida",
          message: `Tu problema (Orden N°: ${newOrder.id}) ha comenzado a procesarse.`,
          color: "blue",
          icon: <IconProgress size={18} />,
        });
        useAuthStore.getState().setUser(
          {
            ...user!,
            credits: user!.credits - (newOrder.creditsConsumed || 1),
          },
          token
        );
        queryClient.invalidateQueries({ queryKey: ["pwa-user-orders"] });
        router.push(`/orders/${newOrder.id}/status`);
      },
      onError: (error: any) => {
        notifications.show({
          title: "Error al Enviar Solicitud",
          message: error.message || "No se pudo crear la orden.",
          color: "red",
          icon: <IconAlertCircle size={18} />,
        });
      },
    });

  const handleSubmit = async (values: NewOrderFormData) => {
    const formDataPayload = new FormData();
    formDataPayload.append("imageFile", values.imageFile!);
    formDataPayload.append("countrySelected", values.countrySelected);
    formDataPayload.append(
      "educationalStageSelected",
      values.educationalStageSelected
    );
    if (values.subdivisionGradeSelected) {
      formDataPayload.append(
        "subdivisionGradeSelected",
        values.subdivisionGradeSelected
      );
    }
    formDataPayload.append("topic", values.topic);
    await createOrderMutation(formDataPayload as any);
  };

  if (!user) {
    return (
      <Center p="xl">
        <Text>Debes iniciar sesión para crear una nueva resolución.</Text>
      </Center>
    );
  }

  return (
    <Box p="lg" className={classes.container}>
      <Title order={2} mb="xl" className={classes.title}>
        <IconMoodShare size={32} />
        Nueva Resolución Matemática
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper
              withBorder
              shadow="md"
              p="xl"
              radius="md"
              style={{ height: "100%" }}
            >
              <Stack gap="lg">
                <Title order={4} className={classes.sectionTitle}>
                  1. El Problema
                </Title>
                <ImageInput
                  onFileChange={(file: any) =>
                    form.setFieldValue("imageFile", file)
                  }
                />
                <Textarea
                  label="Tema del Problema"
                  placeholder="Ej: Ecuaciones de segundo grado, Trigonometría"
                  required
                  {...form.getInputProps("topic")}
                />
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              withBorder
              shadow="md"
              p="xl"
              radius="md"
              style={{ height: "100%" }}
            >
              <Stack gap="lg">
                <Title order={4} className={classes.sectionTitle}>
                  2. Contexto Educativo
                </Title>
                <Select
                  label="País"
                  data={isLoadingCountries ? [] : countryOptions}
                  searchable
                  required
                  {...form.getInputProps("countrySelected")}
                />
                <Select
                  label="Etapa Educativa"
                  data={isLoadingStages ? [] : stageOptions}
                  disabled={!selectedCountryName || isLoadingStages}
                  searchable
                  required
                  {...form.getInputProps("educationalStageSelected")}
                />
                <Select
                  label="Subdivisión/Grado"
                  data={isLoadingSubdivisions ? [] : subdivisionOptions}
                  disabled={
                    !selectedStageName ||
                    isLoadingSubdivisions ||
                    subdivisionOptions.length === 0
                  }
                  searchable
                  clearable
                  {...form.getInputProps("subdivisionGradeSelected")}
                />
                <Divider
                  my="sm"
                  label="Confirmación Final"
                  labelPosition="center"
                />
                <OrderConfirmation
                  creditsAvailable={user.credits || 0}
                  isLoading={isCreatingOrder}
                  isFormValid={form.isValid()}
                />
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  );
}
