import {
  BadRequestException,
  HttpException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
// import { FileStorageService } from '../../file-storage/file-storage/file-storage.service';

// Tipos específicos para los parámetros de TTS de OpenAI
// Estos son los valores permitidos por la API de OpenAI para speech.create()
type OpenAiTtsVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
type OpenAiTtsModel = 'tts-1' | 'tts-1-hd';
type OpenAiTtsResponseFormat = 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm'; // Añadidos más formatos comunes

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    // private readonly fileStorageService: FileStorageService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateStepByStepSolution(
    extractedMathLatex: string,
    promptBase: string,
    country?: string,
    stage?: string,
    subdivision?: string,
  ): Promise<object> {
    try {
      const userPrompt = `    
   Eres un asistente experto en matemáticas y un generador de guiones para animaciones educativas. 
   Tu tarea es resolver problemas matemáticos paso a paso, desglosando la solución en los pasos más pequeños y lógicos posibles, 
   como si cada paso fuera una "diapositiva" o "segmento de animación" en un video.
   El problema matemático a resolver es: ${extractedMathLatex}.
   Contexto adicional para la resolución (si aplica): País: ${country || 'General'}, Etapa: ${stage || 'General'}, Nivel: ${subdivision || 'General'}.

  Tu respuesta DEBE ser un objeto JSON válido con la siguiente estructura. Cada "step" representa una etapa clara y atómica de la solución:

  {
    "steps": [
      {
        "stepNumber": 0,
        "description": "Presentamos el problema matemático original que vamos a resolver.",
        "formula": "${extractedMathLatex.replace(/"/g, '\\"')}"
      },
      {
        "stepNumber": 1,
        "description": "Describe de forma concisa la PRIMERA pequeña acción o concepto aplicado. Usa lenguaje simple y directo. Máximo 1-2 oraciones.",
        "formula": "La expresión LaTeX resultante DESPUÉS de aplicar la descripción de este paso. Debe ser una transformación directa del paso anterior."
      },
      {
        "stepNumber": 2,
        "description": "Describe la SIGUIENTE pequeña acción o concepto. Máximo 1-2 oraciones.",
        "formula": "La expresión LaTeX resultante."
      },
      // ... Continúa con tantos pasos atómicos como sean necesarios ...
      {
        "stepNumber": "Final",
        "description": "Concluimos con la respuesta final del problema.",
        "formula": "La expresión LaTeX de la respuesta final, en su forma más simplificada."
      }
    ]
  }

  **Instrucciones Cruciales para la Generación de Pasos:**

  1.  **Atomicidad:** Cada "step" debe realizar **una única operación matemática o lógica** 
      (ej. "sumar numeradores", "simplificar por 2", "aplicar propiedad distributiva"). 
      NO combines múltiples operaciones en una sola "formula" o "description".
  2.  **Progresión Lógica de "formula":** La "formula" de cada paso debe ser el **estado completo de la expresión 
      matemática DESPUÉS** de que la "description" de ese mismo paso se haya llevado a cabo.
  3.  **LaTeX Válido y Completo:** Todas las "formula" deben ser cadenas LaTeX válidas y autocontenidas, 
      listas para ser renderizadas. Usa "\\" para comandos LaTeX (ej. "\\frac", "\\sqrt").
  4.  **Descripción Concisa:** La "description" debe ser breve y directa, idealmente no más de 1-2 oraciones, 
      para permitir una buena sincronización con una narración de voz corta.
  5.  **Primer Paso (stepNumber 0):** SIEMPRE debe ser el problema original, sin modificaciones.
  6.  **Último Paso (stepNumber "Final"):** SIEMPRE debe ser la respuesta final, simplificada si es posible.
  7.  **Validación de JSON:** La salida DEBE ser un JSON válido y parseable.

  **Ejemplo Ilustrativo (para $\frac{19}{8} + \frac{57}{8}$):**

  {
    "steps": [
      {
        "stepNumber": 0,
        "description": "El problema a resolver es la suma de dos fracciones.",
        "formula": "\\frac{19}{8} + \\frac{57}{8}"
      },
      {
        "stepNumber": 1,
        "description": "Identificamos que ambas fracciones tienen el mismo denominador.",
        "formula": "\\frac{19}{8} + \\frac{57}{8}"
      },
      {
        "stepNumber": 2,
        "description": "Por lo tanto, podemos sumar directamente los numeradores y mantener el denominador común.",
        "formula": "\\frac{19 + 57}{8}"
      },
      {
        "stepNumber": 3,
        "description": "Realizamos la suma de los numeradores.",
        "formula": "\\frac{76}{8}"
      },
      {
        "stepNumber": 4,
        "description": "Ahora, simplificamos la fracción dividiendo el numerador y el denominador por su máximo común divisor, que es 4.",
        "formula": "\\frac{76 \\div 4}{8 \\div 4}"
      },
      {
        "stepNumber": 5,
        "description": "Realizamos las divisiones para obtener la fracción simplificada.",
        "formula": "\\frac{19}{2}"
      },
      {
        "stepNumber": "Final",
        "description": "La respuesta final a la operación es diecinueve medios.",
        "formula": "\\frac{19}{2}"
      }
    ]
    }`;
      const fullPrompt = `${promptBase}\n\n${userPrompt}`;
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o', // O el modelo que hayas elegido (gpt-4, gpt-3.5-turbo)
        messages: [{ role: 'user', content: fullPrompt }],
        response_format: { type: 'json_object' }, // <--- ¡MUY IMPORTANTE para asegurar salida JSON! (Requiere modelos recientes)
        temperature: 0.2,
        // max_tokens: 1500, // Ajusta según la longitud esperada de la solución
      });

      const jsonResponseString = completion.choices[0].message.content;

      if (!jsonResponseString) {
        throw new Error('OpenAI returned an empty response');
      }

      // Intentar parsear la respuesta JSON
      const solutionObject = JSON.parse(jsonResponseString);
      // Aquí podrías añadir validación de la estructura del solutionObject con class-validator si creas un DTO para ello.
      return solutionObject;
    } catch (error) {
      console.error('Error generating solution with OpenAI:', error);
      throw new Error('Failed to generate step-by-step solution with OpenAI');
    }
  }

  /**
   * Genera la narración de audio para un texto dado usando la API TTS de OpenAI.
   * @param textToNarrate El texto completo que se convertirá a voz.
   * @param voice El identificador de la voz de OpenAI a usar (ej. 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer').
   * @param model El modelo TTS a usar (ej. 'tts-1', 'tts-1-hd').
   * @param format El formato de salida del audio (ej. 'mp3', 'opus', 'aac', 'flac').
   * @returns Una promesa que resuelve a un objeto con el buffer de audio y la extensión del archivo.
   */

  // async generateAudioNarrationBuffer(
  //   textToNarrate: string,
  //   voice: OpenAiTtsVoice = 'nova', // <--- USA EL TIPO DEFINIDO ARRIBA
  //   model: OpenAiTtsModel = 'tts-1', // <--- USA EL TIPO DEFINIDO ARRIBA
  //   format: OpenAiTtsResponseFormat = 'mp3', // <--- USA EL TIPO DEFINIDO ARRIBA
  // ): Promise<{ audioBuffer: Buffer; fileExtension: string }> {
  //   console.log(
  //     `Generando narración TTS para texto (longitud: ${textToNarrate.length}). Voz: ${voice}, Modelo: ${model}`,
  //   );

  //   if (!textToNarrate || textToNarrate.trim() === '') {
  //     console.warn('Texto para narrar está vacío.');
  //     throw new BadRequestException(
  //       'No se proporcionó texto para la narración.',
  //     );
  //   }

  //   // OpenAI TTS tiene límites de longitud de texto (ej. 4096 caracteres).
  //   // Si tu texto es muy largo, necesitarás dividirlo y concatenar los audios,
  //   // lo cual es más complejo y podría estar fuera del alcance del MVP.
  //   // Por ahora, asumimos que el texto cabe.
  //   const MAX_TTS_LENGTH = 4000; // Límite conservador
  //   if (textToNarrate.length > MAX_TTS_LENGTH) {
  //     console.warn(
  //       `El texto para TTS excede la longitud máxima de ${MAX_TTS_LENGTH} caracteres. Será truncado.`,
  //       '',
  //     );
  //     textToNarrate = textToNarrate.substring(0, MAX_TTS_LENGTH);
  //   }

  //   try {
  //     const speechResponse = await this.openai.audio.speech.create({
  //       model: model,
  //       input: textToNarrate,
  //       voice: voice,
  //       response_format: format,
  //       // speed: 1.0 // Puedes ajustar la velocidad de habla (0.25 a 4.0)
  //     });

  //     // La respuesta de speech.create() es un ReadableStream (Node.js) o un Response (Navegador).
  //     // Necesitamos convertirlo a un Buffer.
  //     const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());

  //     console.log(
  //       `Audio TTS generado exitosamente. Tamaño del buffer: ${audioBuffer.length} bytes.`,
  //     );
  //     return { audioBuffer, fileExtension: format };
  //   } catch (error: any) {
  //     console.error(
  //       `Error al llamar a la API de OpenAI TTS: ${error.message}`,
  //       error.stack,
  //     );
  //     let errorMessage = 'Fallo al generar la narración de audio con IA.';
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.error &&
  //       error.response.data.error.message
  //     ) {
  //       errorMessage = `OpenAI TTS Error: ${error.response.data.error.message}`;
  //     } else if (error.message) {
  //       errorMessage = `OpenAI TTS Error: ${error.message}`;
  //     }
  //     // Determinar el HttpStatus basado en el error de OpenAI si es posible
  //     const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  //     throw new HttpException(errorMessage, status);
  //   }
  // }
}
