from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.openai import OpenAIService
import os
import json

class VoiceoverSolutionScene(VoiceoverScene):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.solution_json = json.loads(r'''{"steps": [{"stepNumber": 0, "description": "El problema a resolver es la suma de dos fracciones.", "formula": "\\frac{19}{8} + \\frac{57}{8}"}, {"stepNumber": 1, "description": "Identificamos que ambas fracciones tienen el mismo denominador.", "formula": "\\frac{19}{8} + \\frac{57}{8}"}, {"stepNumber": 2, "description": "Por lo tanto, podemos sumar directamente los numeradores y mantener el denominador com\u00fan.", "formula": "\\frac{19 + 57}{8}"}, {"stepNumber": 3, "description": "Realizamos la suma de los numeradores.", "formula": "\\frac{76}{8}"}, {"stepNumber": 4, "description": "Ahora, simplificamos la fracci\u00f3n dividiendo el numerador y el denominador por su m\u00e1ximo com\u00fan divisor, que es 4.", "formula": "\\frac{76 \\div 4}{8 \\div 4}"}, {"stepNumber": 5, "description": "Realizamos las divisiones para obtener la fracci\u00f3n simplificada.", "formula": "\\frac{19}{2}"}, {"stepNumber": "Final", "description": "La respuesta final a la operaci\u00f3n es diecinueve medios.", "formula": "\\frac{19}{2}"}]}''')

    def construct(self):
        openai_api_key_from_env = os.environ.get('OPENAI_API_KEY')
        if not openai_api_key_from_env:
            raise ValueError("OPENAI_API_KEY no está configurada en el entorno.")
        self.set_speech_service(OpenAIService(api_key=openai_api_key_from_env, voice='fable', transcription_model=None, language='es'))
        self.camera.background_color = GREY_E
        current_formula_on_screen = VGroup() # Inicialmente vacío

        steps = self.solution_json.get('steps', [])
        for i, step in enumerate(steps):
            description = step.get('description', '').replace("'", "\'")
            formula = step.get('formula', '').replace("'", "\'")
            narration_text = f"<speak>{description}</speak>"
            with self.voiceover(text=narration_text) as tracker:
                subtitle_text = MarkupText(description, font_size=65, color=WHITE, width=12).to_edge(DOWN).shift(UP * 0.5)
                self.play(FadeIn(subtitle_text), run_time=0.25)
                if formula and formula.strip():
                    new_formula_to_write = MathTex(formula, font_size=48, color=WHITE).shift(UP*0.5)
                    if i > 0 and current_formula_on_screen.submobjects:
                        self.play(FadeOut(current_formula_on_screen), run_time=0.25)
                    write_duration = min(1.0, tracker.duration * 0.5) # Máximo 1 segundo o 50% de la duración del audio
                    self.play(Write(new_formula_to_write), run_time=write_duration)
                    self.wait(max(0, tracker.duration - write_duration))
                    current_formula_on_screen = new_formula_to_write # Actualizar la referencia para el siguiente paso
                else:
                    self.wait(tracker.duration)

                # Desvanecer el subtítulo al final del segmento de audio
                self.play(FadeOut(subtitle_text), run_time=0.25)
        self.wait(0.001)
