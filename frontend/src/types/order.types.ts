// Coincide con UserEntity del backend (campos relevantes para la tabla/edición)
// export interface OrderFE {
//   id: string;
//   googleId?: string;
//   email: string;
//   name: string;
//   pictureUrl?: string;
//   countryOfOrigin?: string;
//   creditBalance: number;
//   isActive: boolean;
//   updatedAt: string; // O Date
// }

// Para la respuesta de la API de listado
export interface PaginatedUsersResponse {
  data: OrderFE[];
  total: number;
  page: number;
  limit: number;
}

// Define tu enum de estado si no lo has hecho
export enum OrderPipelineStatus {
  // PENDING = "PENDING",
  // ... todos los estados
  COMPLETED = "COMPLETED",
  FAILED_GENERAL = "FAILED_GENERAL",
  OCR_FAILED = "OCR_FAILED",
  // ...
}

// Define la interfaz para una orden en el frontend
export interface OrderFE {
  id: string;
  topic: string;
  educationalStageSelected: string;
  subdivisionGradeSelected?: string;
  status: OrderPipelineStatus;
  finalVideoUrl?: string;
  createdAt: string; // o Date
}

// Para respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
