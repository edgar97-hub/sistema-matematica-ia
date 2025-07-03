from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.openai import OpenAIService
import os
import json

class VoiceoverSolutionScene(VoiceoverScene):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.solution_json = json.loads(r'''{"steps": [{"formula": "\\frac{7}{8} + \\frac{19}{8} + \\frac{57}{8} =", "stepNumber": 0, "description": "Presentamos el problema matem\u00e1tico original que vamos a resolver."}, {"formula": "\\frac{7}{8} + \\frac{19}{8} + \\frac{57}{8}", "stepNumber": 1, "description": "Observamos que todas las fracciones tienen el mismo denominador."}, {"formula": "\\frac{7 + 19 + 57}{8}", "stepNumber": 2, "description": "Sumamos los numeradores de las fracciones y mantenemos el denominador com\u00fan."}, {"formula": "\\frac{83}{8}", "stepNumber": 3, "description": "Realizamos la suma de los numeradores."}, {"formula": "\\frac{83}{8}", "stepNumber": "Final", "description": "La respuesta final a la operaci\u00f3n es ochenta y tres octavos."}]}''')

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
