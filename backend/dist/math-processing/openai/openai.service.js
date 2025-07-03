"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let OpenaiService = class OpenaiService {
    configService;
    openai;
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async generateStepByStepSolution(extractedMathLatex, promptBase, country, stage, subdivision) {
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
                model: 'gpt-4o',
                messages: [{ role: 'user', content: fullPrompt }],
                response_format: { type: 'json_object' },
                temperature: 0.2,
            });
            const jsonResponseString = completion.choices[0].message.content;
            if (!jsonResponseString) {
                throw new Error('OpenAI returned an empty response');
            }
            const solutionObject = JSON.parse(jsonResponseString);
            return solutionObject;
        }
        catch (error) {
            console.error('Error generating solution with OpenAI:', error);
            throw new Error('Failed to generate step-by-step solution with OpenAI');
        }
    }
};
exports.OpenaiService = OpenaiService;
exports.OpenaiService = OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenaiService);
//# sourceMappingURL=openai.service.js.map