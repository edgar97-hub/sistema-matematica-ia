// // src/app/(pwa_app)/orders/new/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
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
//   Stepper,
//   ThemeIcon,
//   rem,
//   Center,
// } from "@mantine/core";
// import { useForm, zodResolver } from "@mantine/form";
// import { z } from "zod";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { notifications } from "@mantine/notifications";
// import {
//   IconUpload,
//   IconMapPin,
//   IconSchool,
//   IconListDetails,
//   IconClipboardText,
//   IconDeviceFloppy,
//   IconAlertCircle,
//   IconCircleCheck,
//   IconPhoto,
//   IconProgress,
//   IconProgressCheck,
//   IconMoodShare,
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

//   const [activeStep, setActiveStep] = useState(0); // Para el Stepper de Mantine

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
//         // CreateOrderFrontendData debe esperar FormData
//         if (!token) throw new Error("No autenticado.");
//         return orderService.createOrderPwa(formData, token); // Necesitas este método en orderService
//       },
//       onSuccess: (newOrder: any) => {
//         notifications.show({
//           title: "Solicitud Enviada",
//           message: `Tu problema matemático (Orden N°: ${
//             newOrder.code || newOrder.id
//           }) está siendo procesado.`,
//           color: "green",
//           icon: <IconCircleCheck size={18} />,
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
//         // router.push("/orders"); // Ir al historial
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
//       router.push("/credits"); // Sugerir comprar créditos
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

//   const nextStep = () =>
//     setActiveStep((current) => (current < 2 ? current + 1 : current));
//   const prevStep = () =>
//     setActiveStep((current) => (current > 0 ? current - 1 : current));

//   if (!user) {
//     // Si no hay usuario (aunque el layout PWA debería proteger esto)
//     return (
//       <Center p="xl">
//         <Text>Debes iniciar sesión para crear una nueva resolución.</Text>
//       </Center>
//     );
//   }

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
//         <Stepper
//           active={activeStep}
//           onStepClick={setActiveStep}
//           allowNextStepsSelect={false}
//           color="blue"
//           mb="xl"
//         >
//           <Stepper.Step
//             label="Subir Problema"
//             description="Imagen y tema"
//             icon={<IconPhoto size={18} />}
//             loading={isCreatingOrder && activeStep === 0}
//           >
//             <FileInput
//               label="Imagen del Problema Matemático"
//               placeholder="Selecciona o arrastra una imagen (JPG, PNG)"
//               required
//               accept="image/png,image/jpeg,image/jpg"
//               {...form.getInputProps("imageFile")}
//               leftSection={<IconUpload size={18} />}
//               mb="md"
//               description={`Máx. ${MAX_FILE_SIZE_MB}MB. Formatos: JPG, PNG.`}
//             />
//             {form.values.imageFile && (
//               <Box
//                 mb="md"
//                 style={{
//                   border: "1px solid #ccc",
//                   padding: "10px",
//                   borderRadius: "4px",
//                 }}
//               >
//                 <Text size="sm" fw={500}>
//                   Vista previa:
//                 </Text>
//                 <img
//                   src={URL.createObjectURL(form.values.imageFile)}
//                   alt="Vista previa"
//                   style={{
//                     maxHeight: "150px",
//                     marginTop: "10px",
//                     borderRadius: "4px",
//                   }}
//                 />
//               </Box>
//             )}
//             <Textarea
//               label="Tema del Problema"
//               placeholder="Ej: Ecuaciones de segundo grado, Trigonometría básica"
//               required
//               {...form.getInputProps("topic")}
//               minRows={2}
//               autosize
//               mb="lg"
//             />
//             <Group justify="flex-end">
//               <Button
//                 onClick={nextStep}
//                 disabled={
//                   !form.values.imageFile ||
//                   !form.values.topic ||
//                   form.getInputProps("imageFile").error ||
//                   form.getInputProps("topic").error
//                 }
//               >
//                 Siguiente
//               </Button>
//             </Group>
//           </Stepper.Step>

//           <Stepper.Step
//             label="Contexto Educativo"
//             description="País y Nivel"
//             icon={<IconSchool size={18} />}
//             loading={isCreatingOrder && activeStep === 1}
//           >
//             <Select
//               label="País para la Resolución"
//               placeholder="Selecciona un país"
//               data={isLoadingCountries ? [] : countryOptions}
//               required
//               searchable
//               nothingFoundMessage="País no encontrado"
//               {...form.getInputProps("countrySelected")}
//               disabled={isLoadingCountries}
//               mb="md"
//             />
//             <Select
//               label="Etapa Educativa"
//               placeholder={
//                 selectedCountryName
//                   ? "Selecciona una etapa"
//                   : "Selecciona un país primero"
//               }
//               data={isLoadingStages ? [] : stageOptions}
//               required
//               searchable
//               nothingFoundMessage="No hay etapas para este país"
//               {...form.getInputProps("educationalStageSelected")}
//               disabled={!selectedCountryName || isLoadingStages}
//               mb="md"
//             />
//             <Select
//               label="Subdivisión/Grado (Opcional)"
//               placeholder={
//                 selectedStageName
//                   ? "Selecciona una subdivisión"
//                   : "Selecciona una etapa primero"
//               }
//               data={isLoadingSubdivisions ? [] : subdivisionOptions}
//               searchable
//               nothingFoundMessage="No hay subdivisiones para esta etapa"
//               clearable
//               {...form.getInputProps("subdivisionGradeSelected")}
//               disabled={
//                 !selectedStageName ||
//                 isLoadingSubdivisions ||
//                 subdivisionOptions.length === 0
//               }
//               mb="lg"
//             />
//             <Group justify="space-between">
//               <Button variant="default" onClick={prevStep}>
//                 Anterior
//               </Button>
//               <Button
//                 onClick={nextStep}
//                 disabled={
//                   !form.values.countrySelected ||
//                   !form.values.educationalStageSelected ||
//                   form.getInputProps("countrySelected").error ||
//                   form.getInputProps("educationalStageSelected").error
//                 }
//               >
//                 Siguiente
//               </Button>
//             </Group>
//           </Stepper.Step>

//           <Stepper.Step
//             label="Confirmar y Enviar"
//             description="Revisar y usar crédito"
//             icon={<IconProgressCheck size={18} />}
//             loading={isCreatingOrder && activeStep === 2}
//           >
//             <Text size="sm" mb="md">
//               Estás a punto de usar{" "}
//               <Text span fw={700}>
//                 1 crédito
//               </Text>{" "}
//               para esta resolución.
//             </Text>
//             <Text size="sm" mb="lg">
//               Créditos disponibles:{" "}
//               <Text span fw={700}>
//                 {user?.credits || 0}
//               </Text>
//               .
//             </Text>
//             {user.credits < 1 && (
//               <Alert
//                 color="orange"
//                 title="Créditos Insuficientes"
//                 icon={<IconAlertCircle />}
//                 mb="lg"
//               >
//                 No tienes suficientes créditos.{" "}
//                 <Link href="/credits">
//                   <Text span component="a" c="blue" inherit>
//                     Compra más créditos aquí.
//                   </Text>
//                 </Link>
//               </Alert>
//             )}

//             <Group justify="space-between">
//               <Button
//                 variant="default"
//                 onClick={prevStep}
//                 disabled={isCreatingOrder}
//               >
//                 Anterior
//               </Button>
//               <Button
//                 type="button" // Cambiado de submit para que el form.onSubmit no se dispare aquí
//                 onClick={() => form.onSubmit(handleSubmit)()} // Llama a la función de submit del form
//                 loading={isCreatingOrder}
//                 disabled={
//                   isCreatingOrder ||
//                   (user ? user.credits < 1 : true) ||
//                   !form.isValid()
//                 } // Deshabilita si no hay créditos o form inválido
//                 leftSection={<IconDeviceFloppy size={18} />}
//                 color="green"
//               >
//                 {isCreatingOrder ? "Enviando..." : "Confirmar y Resolver"}
//               </Button>
//             </Group>
//           </Stepper.Step>
//           <Stepper.Completed>
//             <Center p="xl">
//               <Title order={4}>¡Solicitud enviada!</Title>
//               <Text>Tu problema está siendo procesado.</Text>
//               <Button component={Link} href="/orders" mt="md">
//                 Ver Mi Historial
//               </Button>
//             </Center>
//           </Stepper.Completed>
//         </Stepper>
//       </Paper>
//     </Box>
//   );
// }

// src/app/(pwa_app)/orders/new/page.tsx
// src/app/(pwa_app)/orders/new/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Title,
  Text,
  Paper,
  Button,
  Group,
  FileInput,
  Select,
  Textarea,
  LoadingOverlay,
  Alert,
  Center,
  Stack, // Añadido Stack para organizar elementos de cámara
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  IconUpload,
  IconAlertCircle,
  IconCircleCheck,
  IconPhoto,
  IconMoodShare,
  IconDeviceFloppy,
  IconCamera, // Añadido para el botón de cámara
  IconRotate2, // Añadido para el botón de volver a tomar foto
} from "@tabler/icons-react";

import { useAuthStore } from "../../../../store/auth.store"; // Ajusta ruta
import { countryService } from "../../../../lib/services/country.service"; // Ajusta ruta
import { educationalStageService } from "../../../../lib/services/educational-stage.service"; // Ajusta ruta
import { educationalSubdivisionService } from "../../../../lib/services/educational-subdivision.service"; // Ajusta ruta
import {
  orderService,
  CreateOrderFrontendData,
} from "../../../../lib/services/order.service"; // Ajusta ruta
import {
  CountryFE,
  EducationalStageFE,
  EducationalSubdivisionFE,
} from "../../../../types/educational-content.types"; // Ajusta ruta
import classes from "./new-order-page.module.css"; // Crearemos este CSS Module
import Link from "next/link";

// Esquema de validación con Zod
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const newOrderSchema = z.object({
  imageFile: z
    .custom<File | null>((file) => file instanceof File, {
      message: "Se requiere una imagen del problema.",
    })
    .refine(
      (file) => file && file.size <= MAX_FILE_SIZE_BYTES,
      `El tamaño máximo del archivo es ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten imágenes JPG, JPEG o PNG."
    ),
  countrySelected: z.string().min(1, { message: "Debe seleccionar un país." }),
  educationalStageSelected: z
    .string()
    .min(1, { message: "Debe seleccionar una etapa educativa." }),
  subdivisionGradeSelected: z.string().nullable().optional(), // Opcional, no todos los stages tienen subdivisiones
  topic: z
    .string()
    .min(3, { message: "El tema debe tener al menos 3 caracteres." })
    .max(250, { message: "Máximo 250 caracteres." }),
});

type NewOrderFormData = z.infer<typeof newOrderSchema>;

// QueryClientProvider ya debería estar en (pwa_app)/layout.tsx

export default function NewOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();

  // Se elimina el estado de activeStep
  // const [activeStep, setActiveStep] = useState(0); // Para el Stepper de Mantine

  const form = useForm<NewOrderFormData>({
    initialValues: {
      imageFile: null as File | null, // Tipo File
      countrySelected: user?.countryOfOrigin || "", // Pre-poblar con el país del usuario si existe
      educationalStageSelected: "",
      subdivisionGradeSelected: null,
      topic: "",
    },
    validate: zodResolver(newOrderSchema),
  });

  // Estado para la funcionalidad de la cámara
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImagePreview, setCapturedImagePreview] = useState<
    string | null
  >(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); // Para almacenar la referencia al MediaStream

  // Función para iniciar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream; // Guardar referencia al stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setCapturedImagePreview(null); // Resetear cualquier imagen capturada previamente
        form.setFieldValue("imageFile", null); // Limpiar el archivo en el formulario
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      notifications.show({
        title: "Error de Cámara",
        message: "No se pudo acceder a la cámara. Asegúrate de dar permisos.",
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
      setIsCameraActive(false);
    }
  };

  // Función para detener la cámara
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Función para tomar una foto
  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Asegurarse de que el canvas tenga las mismas dimensiones que el video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImagePreview(imageDataUrl);

        // Convertir Data URL a objeto File para el formulario
        fetch(imageDataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], `photo-${Date.now()}.png`, {
              type: "image/png",
            });
            form.setFieldValue("imageFile", file);
            stopCamera(); // Detener la cámara después de tomar la foto
          })
          .catch((err) => {
            console.error("Error al convertir imagen a File:", err);
            notifications.show({
              title: "Error al Procesar Imagen",
              message: "No se pudo procesar la foto capturada.",
              color: "red",
              icon: <IconAlertCircle size={18} />,
            });
          });
      }
    }
  };

  // Función para volver a tomar la foto
  const handleRetakePhoto = () => {
    setCapturedImagePreview(null);
    form.setFieldValue("imageFile", null);
    startCamera(); // Reiniciar la cámara
  };

  // Cargar países
  const { data: countries, isLoading: isLoadingCountries } = useQuery<
    CountryFE[],
    Error
  >({
    queryKey: ["pwa-active-countries"],
    queryFn: () => countryService.getActiveCountriesForPwa(), // Tu servicio para PWA
  });
  const countryOptions = useMemo(
    () => countries?.map((c) => ({ value: c.name, label: c.name })) || [],
    [countries]
  );

  // Cargar etapas cuando cambia el país seleccionado
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

  // Cargar subdivisiones cuando cambia la etapa seleccionada
  const selectedStageName = form.values.educationalStageSelected;
  const { data: subdivisions, isLoading: isLoadingSubdivisions } = useQuery<
    EducationalSubdivisionFE[],
    Error
  >({
    queryKey: [
      "pwa-subdivisions-by-stage",
      selectedStageName,
      selectedCountryName,
    ], // Añade country para refetch si cambia
    queryFn: () => {
      if (selectedStageName && stages) {
        const currentStage = (Array.isArray(stages) ? stages : []).find(
          (s) => s.name === selectedStageName
        );
        if (currentStage) {
          console.log("currentStage", currentStage);
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

  // Efecto para resetear etapa y subdivisión si cambia el país
  useEffect(() => {
    form.setFieldValue("educationalStageSelected", "");
    form.setFieldValue("subdivisionGradeSelected", null);
  }, [selectedCountryName]); // Solo depende de selectedCountryName

  // Efecto para resetear subdivisión si cambia la etapa
  useEffect(() => {
    form.setFieldValue("subdivisionGradeSelected", null);
  }, [selectedStageName]); // Solo depende de selectedStageName

  // Mutación para crear la orden
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } =
    useMutation({
      mutationFn: (formData: CreateOrderFrontendData) => {
        // CreateOrderFrontendData debe esperar FormData
        if (!token) throw new Error("No autenticado.");
        return orderService.createOrderPwa(formData, token); // Necesitas este método en orderService
      },
      onSuccess: (newOrder: any) => {
        notifications.show({
          title: "Solicitud Enviada",
          message: `Tu problema matemático (Orden N°: ${
            newOrder.code || newOrder.id
          }) está siendo procesado.`,
          color: "green",
          icon: <IconCircleCheck size={18} />,
        });
        useAuthStore.getState().setUser(
          {
            ...user!,
            credits: user!.credits - (newOrder.creditsConsumed || 1),
          },
          token
        );
        queryClient.invalidateQueries({ queryKey: ["pwa-user-orders"] });
        queryClient.invalidateQueries({
          queryKey: ["pwa-user-profile", user?.id],
        });
        router.push("/orders"); // Ir al historial
      },
      onError: (error: any) => {
        notifications.show({
          title: "Error al Enviar Solicitud",
          message:
            error.message ||
            "No se pudo crear la orden. Verifica tus créditos o intenta de nuevo.",
          color: "red",
          icon: <IconAlertCircle size={18} />,
        });
      },
    });

  const handleSubmit = async (values: NewOrderFormData) => {
    if (!user || user.credits < 1) {
      notifications.show({
        title: "Créditos Insuficientes",
        message: "No tienes suficientes créditos para esta operación.",
        color: "orange",
      });
      router.push("/credits");
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("imageFile", values.imageFile!); // El '!' asume que la validación ya pasó
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

    await createOrderMutation(formDataPayload as any); // El servicio debe esperar FormData
  };

  if (!user) {
    // Si no hay usuario (aunque el layout PWA debería proteger esto)
    return (
      <Center p="xl">
        <Text>Debes iniciar sesión para crear una nueva resolución.</Text>
      </Center>
    );
  }

  return (
    <Box p="lg" className={classes.newOrderContainer}>
      <Title order={2} className={classes.pageTitle} mb="xl">
        <IconMoodShare
          size={32}
          style={{ marginRight: "12px", verticalAlign: "bottom" }}
        />
        Nueva Resolución Matemática
      </Title>

      <Paper withBorder shadow="md" p="xl" radius="md">
        {/* Selector de origen de imagen */}
        <Group justify="center" mb="lg">
          {!isCameraActive && !capturedImagePreview && (
            <Button
              onClick={startCamera}
              leftSection={<IconCamera size={18} />}
              variant="outline"
            >
              Tomar Foto
            </Button>
          )}
          {(isCameraActive || capturedImagePreview) && (
            <Button
              onClick={() => {
                stopCamera();
                setCapturedImagePreview(null);
                form.setFieldValue("imageFile", null);
              }}
              leftSection={<IconUpload size={18} />}
              variant="outline"
            >
              Subir Archivo
            </Button>
          )}
        </Group>

        {/* Sección de entrada de imagen */}
        {!isCameraActive && !capturedImagePreview && (
          <FileInput
            label="Imagen del Problema Matemático"
            placeholder="Selecciona o arrastra una imagen (JPG, PNG)"
            required
            accept="image/png,image/jpeg,image/jpg"
            {...form.getInputProps("imageFile")}
            leftSection={<IconUpload size={18} />}
            mb="md"
            description={`Máx. ${MAX_FILE_SIZE_MB}MB. Formatos: JPG, PNG.`}
          />
        )}

        {isCameraActive && !capturedImagePreview && (
          <Stack align="center" mb="md">
            <video
              ref={videoRef}
              style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
              autoPlay
              playsInline
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>{" "}
            {/* Canvas oculto para la captura */}
            <Button
              onClick={handleTakePhoto}
              leftSection={<IconCamera size={18} />}
              disabled={!videoRef.current || videoRef.current.readyState < 3} // Deshabilita si el video no está listo
            >
              Capturar Foto
            </Button>
          </Stack>
        )}

        {capturedImagePreview && (
          <Box
            mb="md"
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <Text size="sm" fw={500} mb="sm">
              Vista previa de la foto capturada:
            </Text>
            <img
              src={capturedImagePreview}
              alt="Vista previa de la foto capturada"
              style={{
                maxHeight: "250px",
                maxWidth: "100%",
                borderRadius: "4px",
              }}
            />
            <Button
              onClick={handleRetakePhoto}
              leftSection={<IconRotate2 size={18} />}
              variant="outline"
              mt="md"
            >
              Volver a Tomar Foto
            </Button>
          </Box>
        )}

        {/* Muestra la vista previa del archivo subido si no hay cámara activa ni imagen capturada */}
        {form.values.imageFile && !isCameraActive && !capturedImagePreview && (
          <Box
            mb="md"
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <Text size="sm" fw={500}>
              Vista previa:
            </Text>
            <img
              src={URL.createObjectURL(form.values.imageFile)}
              alt="Vista previa"
              style={{
                maxHeight: "150px",
                marginTop: "10px",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}

        <Textarea
          label="Tema del Problema"
          placeholder="Ej: Ecuaciones de segundo grado, Trigonometría básica"
          required
          {...form.getInputProps("topic")}
          minRows={2}
          autosize
          mb="lg"
        />

        <Select
          label="País para la Resolución"
          placeholder="Selecciona un país"
          data={isLoadingCountries ? [] : countryOptions}
          required
          searchable
          nothingFoundMessage="País no encontrado"
          {...form.getInputProps("countrySelected")}
          disabled={isLoadingCountries}
          mb="md"
        />
        <Select
          label="Etapa Educativa"
          placeholder={
            selectedCountryName
              ? "Selecciona una etapa"
              : "Selecciona un país primero"
          }
          data={isLoadingStages ? [] : stageOptions}
          required
          searchable
          nothingFoundMessage="No hay etapas para este país"
          {...form.getInputProps("educationalStageSelected")}
          disabled={!selectedCountryName || isLoadingStages}
          mb="md"
        />
        <Select
          label="Subdivisión/Grado (Opcional)"
          placeholder={
            selectedStageName
              ? "Selecciona una subdivisión"
              : "Selecciona una etapa primero"
          }
          data={isLoadingSubdivisions ? [] : subdivisionOptions}
          searchable
          nothingFoundMessage="No hay subdivisiones para esta etapa"
          clearable
          {...form.getInputProps("subdivisionGradeSelected")}
          disabled={
            !selectedStageName ||
            isLoadingSubdivisions ||
            subdivisionOptions.length === 0
          }
          mb="lg"
        />

        {/* Sección de Confirmar y Enviar integrada */}
        <Text size="sm" mb="md">
          Estás a punto de usar{" "}
          <Text span fw={700}>
            1 crédito
          </Text>{" "}
          para esta resolución.
        </Text>
        <Text size="sm" mb="lg">
          Créditos disponibles:{" "}
          <Text span fw={700}>
            {user?.credits || 0}
          </Text>
          .
        </Text>
        {user.credits < 1 && (
          <Alert
            color="orange"
            title="Créditos Insuficientes"
            icon={<IconAlertCircle />}
            mb="lg"
          >
            No tienes suficientes créditos.{" "}
            <Link href="/credits">
              <Text span component="a" c="blue" inherit>
                Compra más créditos aquí.
              </Text>
            </Link>
          </Alert>
        )}

        <Group justify="flex-end">
          <Button
            type="button"
            onClick={() => form.onSubmit(handleSubmit)()}
            loading={isCreatingOrder}
            disabled={
              isCreatingOrder ||
              (user ? user.credits < 1 : true) ||
              !form.isValid()
            }
            leftSection={<IconDeviceFloppy size={18} />}
            color="green"
          >
            {isCreatingOrder ? "Enviando..." : "Confirmar y Resolver"}
          </Button>
        </Group>
      </Paper>
    </Box>
  );
}
