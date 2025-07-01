// src/math-processing/interfaces/simpletex-response.interface.ts
export interface SimpleTexLatexResult {
  confidence: number;
  res: {
    latex: string; // Este es un campo común que devuelven
    position?: any; // Opcional
  };
  type: string; // ej. 'latex'
}

export interface SimpleTexError {
  code: number;
  message: string;
  details?: any;
}

export interface SimpleTexResponse {
  status_code?: number; // O un campo similar para el código de estado HTTP de la respuesta de SimpleTex
  request_id?: string;
  // SimpleTex podría devolver un array de resultados si detecta múltiples bloques
  // o un objeto con una propiedad principal. Asumiremos un array `res` o un objeto `result`.
  // Revisa la documentación de SimpleTex para la estructura exacta.
  // Ejemplo si devuelve un objeto con un campo 'latex' o 'text' principal:
  text?: string; // Texto simple reconocido
  latex_styled?: string; // LaTeX con formato
  latex?: string; // LaTeX puro

  // Ejemplo si devuelve un array de resultados (más común para OCR de documentos):
  results?: SimpleTexLatexResult[]; // O una estructura más compleja

  // Campos de error
  err_msg?: string; // Campo de error común en APIs chinas
  error?: string | SimpleTexError; // Otro formato de error
  // ... otros campos que pueda devolver la API de SimpleTex
}
