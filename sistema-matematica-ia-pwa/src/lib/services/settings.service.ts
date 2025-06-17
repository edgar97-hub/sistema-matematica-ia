// src/lib/services/settings.service.ts
import { apiClient } from "../apiClient"; // Asume que tienes un apiClient configurado

// Interfaz que coincide con tu SystemConfigurationEntity y lo que el form manejará
// (Excluye 'id' si el backend no lo espera en el DTO de actualización)
export interface SystemSettingsData {
  openAiPromptBase: string | null;
  welcomeCreditEnabled: boolean;
  welcomeCreditAmount: number;
  // Añade aquí los otros campos que implementaste en el SettingsPageComponent:
  // logo_url, terms_conditions_url, global_notice_image_url, etc. si son parte de esta misma entidad/endpoint
}

export interface SystemSettingsResponse extends SystemSettingsData {
  id: string; // El backend probablemente devuelva el ID
  // ... otros campos que devuelva la API (createdAt, updatedAt)
}

export const settingsService = {
  async getSettings(): Promise<SystemSettingsResponse> {
    // El endpoint en tu SystemConfigurationController era GET /configuration
    const response = await apiClient.get<SystemSettingsResponse>(
      "/configuration"
    );
    return response.data;
  },

  async updateSettings(
    data: SystemSettingsData
  ): Promise<SystemSettingsResponse> {
    // El endpoint en tu SystemConfigurationController era PATCH /configuration
    // El backend espera un DTO (UpdateConfigurationDto) que podría ser igual a SystemSettingsData
    const response = await apiClient.patch<SystemSettingsResponse>(
      "/configuration",
      data
    );
    return response.data;
  },

  // Si la subida de archivos (logo, aviso global, etc.) se maneja por separado
  // y este servicio solo guarda las URLs, no necesitas más aquí.
  // Si este servicio también coordinara la subida, añadirías esos métodos.
};
