from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.azure import AzureService # Importar AzureService
import os
import json
import re
import sys # ¡IMPORTANTE: Añadir esta importación para sys.stderr y sys.exit!

class AzureVoiceoverSolutionScene(VoiceoverScene):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.solution_json = json.loads(r'''{"steps": [{"stepNumber": 1, "description": "Presentamos el problema matem\u00e1tico original que vamos a resolver.", "formula": "48a^2 + 16a^4 -18a -62a^3 +5 +2a^2 -6a"}, {"stepNumber": 2, "description": "Reordenamos los t\u00e9rminos para agruparlos por potencias de a, de mayor a menor.", "formula": "\\hl{16a^4} + \\hl{-62a^3} + \\hl{48a^2 + 2a^2} + \\hl{-18a -6a} + \\hl{5}"}, {"stepNumber": 3, "description": "Sumamos los coeficientes de a al cuadrado.", "formula": "16a^4 -62a^3 + \\hl{(48+2)a^2} -18a -6a +5"}, {"stepNumber": 4, "description": "Realizamos la suma de los coeficientes de a al cuadrado, obteniendo cincuenta.", "formula": "16a^4 -62a^3 + \\hl{50a^2} -18a -6a +5"}, {"stepNumber": 5, "description": "Sumamos los coeficientes de a.", "formula": "16a^4 -62a^3 +50a^2 + \\hl{(-18) + (-6)}a +5"}, {"stepNumber": 6, "description": "Realizamos la suma de los coeficientes de a, obteniendo menos veinticuatro.", "formula": "16a^4 -62a^3 +50a^2 + \\hl{-24a} +5"}, {"stepNumber": "Final", "description": "Concluimos con la expresi\u00f3n final simplificada.", "formula": "16a^4 -62a^3 +50a^2 -24a +5"}]}''')

    def construct(self):
        azure_speech_key = os.environ.get('AZURE_SUBSCRIPTION_KEY')
        azure_speech_region = os.environ.get('AZURE_SERVICE_REGION')
        print(f"DEBUG_MANIM: AZURE_SUBSCRIPTION_KEY (primeros 5): {azure_speech_key[:5] if azure_speech_key else 'None'}... (Longitud: {len(azure_speech_key) if azure_speech_key else 'None'})", file=sys.stderr, flush=True)
        print(f"DEBUG_MANIM: AZURE_SERVICE_REGION: {azure_speech_region}", file=sys.stderr, flush=True)
        try:
            self.set_speech_service(AzureService(voice='es-ES-ElviraNeural'))
            print("DEBUG_MANIM: set_speech_service called successfully.", file=sys.stderr, flush=True)
        except Exception as e:
            print(f"DEBUG_MANIM_ERROR_CONFIG: Fallo en la configuración del servicio de voz: {e}", file=sys.stderr, flush=True)
            raise RuntimeError(f"Error al configurar Azure Speech Service: {e}. Verifique sus credenciales, región y la disponibilidad de la voz. Detalles adicionales pueden estar en la salida STDERR de Manim.")
        self.camera.background_color = GREY_E
        all_displayed_formulas = VGroup()

        steps = self.solution_json.get('steps', [])
        for i, step in enumerate(steps):
            description = step.get('description', '').replace("'", "\'")
            clean_description = re.sub(r'<[^>]+>', '', description)
            narration_text = clean_description
            print(f"DEBUG_MANIM: Narration text for step {i+1}: {narration_text}", file=sys.stderr, flush=True)
            raw_formula = step.get('formula', '').replace("'", "\'")
            step_number = step.get('stepNumber', '')
            highlight_pattern = r'\\hl\{(.*?)\}'
            highlight_matches = re.findall(highlight_pattern, raw_formula)
            clean_formula = re.sub(highlight_pattern, r'\1', raw_formula).replace("'", "\'")
            try:
                with self.voiceover(text=narration_text) as tracker:
                    if clean_formula and clean_formula.strip():
                        new_formula_mobject = MathTex(clean_formula, font_size=48, color=WHITE)
                        if step_number is not None:
                            step_label = Text(str(step_number) + ". ", font_size=36, color=BLUE_A)
                            # Agrupar el número de paso y la fórmula para que se muevan juntos
                            new_formula_with_label = VGroup(step_label, new_formula_mobject)
                            new_formula_with_label.arrange(RIGHT, buff=0.2)
                        else:
                            new_formula_with_label = new_formula_mobject
                        all_displayed_formulas.add(new_formula_with_label)
                        all_displayed_formulas.arrange(DOWN, buff=0.8)
                        if all_displayed_formulas.height > config.frame_height - 1:
                            all_displayed_formulas.scale_to_fit_height(config.frame_height - 1)
                        all_displayed_formulas.center()
                        self.play(
                            Write(new_formula_mobject),
                            all_displayed_formulas.animate,
                            run_time=min(1.0, tracker.duration * 0.5)
                        )
                        if highlight_matches:
                            highlight_animations = []
                            for highlight_tex_content in highlight_matches:
                                # Crear un MathTex temporal para obtener la posición exacta de la parte a resaltar
                                # Este mobject temporal no se añade a la escena, solo se usa para referencia
                                temp_ref_mobject = MathTex(highlight_tex_content, font_size=48, color=WHITE)
                                temp_ref_mobject.move_to(new_formula_mobject.get_center())
                                
                                # Intentar alinear el temp_ref_mobject con la parte correspondiente en new_formula_mobject
                                # Esto es una heurística para encontrar la posición correcta
                                # Se busca la parte de new_formula_mobject que contiene el highlight_tex_content
                                target_part = None
                                for submob in new_formula_mobject.submobjects:
                                    if highlight_tex_content in submob.tex_string:
                                        target_part = submob
                                        break
                                
                                if target_part:
                                    # Crear un rectángulo que rodee la parte objetivo
                                    highlight_rect = SurroundingRectangle(target_part, color=YELLOW, buff=0.1)
                                    
                                    # Animaciones: aparecer, esperar, desaparecer
                                    highlight_animations.append(Create(highlight_rect, run_time=0.3))
                                    highlight_animations.append(Wait(0.7))
                                    highlight_animations.append(Uncreate(highlight_rect, run_time=0.3))
                                else:
                                    print(f"[Manim Script] WARNING: No se pudo encontrar la parte '{highlight_tex_content}' para resaltar con SurroundingRectangle.")
                            
                            if highlight_animations:
                                self.play(*highlight_animations, run_time=1.3) # Duración total de la secuencia de resaltado (0.3+0.7+0.3)
                        wait_duration = max(0, tracker.duration - min(1.0, tracker.duration * 0.5) - (1.3 if highlight_matches else 0))
                        self.wait(wait_duration)
                    else:
                        self.wait(tracker.duration)

            except Exception as e:
                raise RuntimeError(f"Error durante la síntesis de voz o animación: {e}.")
        self.wait(0.001)
