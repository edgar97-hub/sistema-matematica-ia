import os
import subprocess
import uuid
from flask import Flask, request, jsonify, send_from_directory
import json # Importar json para serializar/deserializar el JSON

# def generate_segment_script(formula: str, description: str, duration: float) -> str:
#     """
#     Toma los datos del segmento y genera dinámicamente un script de Manim robusto
#     y sintácticamente correcto.
#     """
    
#     # 1. Escapado de la descripción para que sea una cadena literal segura en Python.
#     # Usaremos triple comilla para manejar saltos de línea de forma nativa.
#     # Solo necesitamos escapar las comillas triples si aparecen en la descripción.
#     safe_description = description.replace('"""', '\\"\\"\\"')

#     # 2. Escapado de la fórmula
#     safe_formula = formula.replace('"""', '\\"\\"\\"') if formula else ""

#     # 3. Construir el script usando una plantilla multilínea.
#     # ESTO GENERA UN ARCHIVO .py CON SALTOS DE LÍNEA REALES.
#     script_template = f"""
# from manim import *

# class GeneratedScene(Scene):
#     def construct(self):
#         desc_text = Text(
#             \"\"\"{safe_description}\"\"\",
#             font_size=24,
#             line_spacing=1.2
#         ).to_edge(LEFT, buff=0.5).shift(UP*1.5)
        
#         has_formula = {bool(safe_formula.strip())}

#         if has_formula:
#             formula_tex = MathTex(
#                 r\"\"\"{safe_formula}\"\"\"
#             ).next_to(desc_text, DOWN, buff=0.5, aligned_edge=LEFT)
#             anim_in = AnimationGroup(FadeIn(desc_text), Write(formula_tex), lag_ratio=0.5)
#             anim_out = AnimationGroup(FadeOut(desc_text), FadeOut(formula_tex))
#         else:
#             anim_in = FadeIn(desc_text)
#             anim_out = FadeOut(desc_text)
            
#         duration_in = min(1.0, {duration} * 0.2)
#         duration_out = duration_in
#         wait_duration = max(0.1, {duration} - (duration_in + duration_out))
        
#         self.play(anim_in, run_time=duration_in)
#         self.wait(wait_duration)
#         self.play(anim_out, run_time=duration_out)
# """
#     return script_template

# La función ahora recibe solution_json y la usará para generar la clase de la escena.
def generate_full_voiceover_script(solution_json: dict) -> str:
    scene_class_name = "VoiceoverSolutionScene"
    
    script = "from manim import *\n"
    script += "from manim_voiceover import VoiceoverScene\n"
    script += "from manim_voiceover.services.openai import OpenAIService\n"
    script += "import os\n"
    script += "import json\n\n" 
    
    escaped_solution_json_str = json.dumps(solution_json)

    script += f"class {scene_class_name}(VoiceoverScene):\n"
    script += "    def __init__(self, **kwargs):\n"
    script += "        super().__init__(**kwargs)\n"
    script += f"        self.solution_json = json.loads(r'''{escaped_solution_json_str}''')\n\n"

    script += "    def construct(self):\n"
    script += "        openai_api_key_from_env = os.environ.get('OPENAI_API_KEY')\n"
    script += "        if not openai_api_key_from_env:\n"
    script += "            raise ValueError(\"OPENAI_API_KEY no está configurada en el entorno.\")\n"

    script += f"        self.set_speech_service(OpenAIService(api_key=openai_api_key_from_env, voice='fable', transcription_model=None, language='es'))\n"

    script += "        self.camera.background_color = GREY_E\n"
    
    script += "        current_formula_on_screen = VGroup() # Inicialmente vacío\n\n"
    
    # script += "        steps = self.solution_json.get('steps', [])\n" 
    # script += "        for i, step in enumerate(steps):\n"
    # script += f"            description = step.get('description', '').replace(\"'\", \"\\'\")\n"
    # script += f"            formula = step.get('formula', '').replace(\"'\", \"\\'\")\n"

    # script += f"            narration_text = f\"<speak>{{description}}</speak>\"\n" 
    # script += f"            with self.voiceover(text=narration_text) as tracker:\n" 
    # script += f"                if formula and formula.strip():\n"
    # script += f"                    new_formula_to_write = MathTex(formula, font_size=48, color=WHITE).shift(UP*0.5)\n" 
    
    # script += f"                    if i > 0 and current_formula_on_screen.submobjects:\n" 
    # script += f"                        self.play(FadeOut(current_formula_on_screen), run_time=0.25)\n"
    
    # script += f"                    write_duration = min(1.0, tracker.duration * 0.5) # Máximo 1 segundo o 50% de la duración del audio\n"
    # script += f"                    self.play(Write(new_formula_to_write), run_time=write_duration)\n"
    # script += f"                    self.wait(max(0, tracker.duration - write_duration))\n" 
    # script += f"                    current_formula_on_screen = new_formula_to_write # Actualizar la referencia para el siguiente paso\n"
    # script += f"                else:\n"
    # script += f"                    self.wait(tracker.duration)\n\n"
    # script += "        self.wait(0.5)\n"



 # Accedemos a solution_json a través de self.solution_json, que ya fue cargado en __init__
    script += "        steps = self.solution_json.get('steps', [])\n" 
    script += "        for i, step in enumerate(steps):\n"
    # Ahora, las asignaciones de 'description' y 'formula'
    # se escriben directamente en el script de Manim, dentro del bucle.
    # Esto asegura que 'step' esté definido cuando se accede a sus propiedades.
    # Las comillas simples se escapan para que sean parte del string literal en el script generado.
    script += f"            description = step.get('description', '').replace(\"'\", \"\\'\")\n"
    script += f"            formula = step.get('formula', '').replace(\"'\", \"\\'\")\n"

    script += f"            narration_text = f\"<speak>{{description}}</speak>\"\n"
    script += f"            with self.voiceover(text=narration_text) as tracker:\n" 
    # CORRECCIÓN CLAVE: Cambiado Text a MarkupText y max_width a width.
    script += f"                subtitle_text = MarkupText(description, font_size=65, color=WHITE, width=12).to_edge(DOWN).shift(UP * 0.5)\n"
    script += f"                self.play(FadeIn(subtitle_text), run_time=0.25)\n" # Aparecer rápido

    script += f"                if formula and formula.strip():\n"
    script += f"                    new_formula_to_write = MathTex(formula, font_size=48, color=WHITE).shift(UP*0.5)\n" 
    
    script += f"                    if i > 0 and current_formula_on_screen.submobjects:\n" 
    script += f"                        self.play(FadeOut(current_formula_on_screen), run_time=0.25)\n"
    
    script += f"                    write_duration = min(1.0, tracker.duration * 0.5) # Máximo 1 segundo o 50% de la duración del audio\n"
    script += f"                    self.play(Write(new_formula_to_write), run_time=write_duration)\n"
    script += f"                    self.wait(max(0, tracker.duration - write_duration))\n" # Espera el tiempo restante
    script += f"                    current_formula_on_screen = new_formula_to_write # Actualizar la referencia para el siguiente paso\n"
    script += f"                else:\n"
    script += f"                    self.wait(tracker.duration)\n\n"
    
    script += f"                # Desvanecer el subtítulo al final del segmento de audio\n"
    script += f"                self.play(FadeOut(subtitle_text), run_time=0.25)\n"


    # CORRECCIÓN CLAVE: Cambiamos el tiempo de espera final a un valor muy pequeño pero positivo.
    script += "        self.wait(0.001)\n" 
    return script



app = Flask(__name__)
PROCESSING_DIR = os.path.join(os.getcwd(), "manim_processing")
os.makedirs(PROCESSING_DIR, exist_ok=True)

# @app.route("/render-segment-test", methods=["POST"])
# def render_manim_segment():
#     data = request.get_json()
#     segment_id = data.get("segmentId", str(uuid.uuid4()))
#     formula = data.get("formula", "")
#     description = data.get("description", "")
#     duration = data.get("duration")

#     if duration is None:
#         return jsonify({"status": "error", "message": "Missing 'duration'"}), 400

#     request_dir = os.path.join(PROCESSING_DIR, str(segment_id))
#     script_path = os.path.join(request_dir, "scene.py")
#     os.makedirs(request_dir, exist_ok=True)

#     try:
#         manim_script_content = generate_segment_script(formula, description, float(duration))
#         with open(script_path, "w", encoding="utf-8") as f:
#             f.write(manim_script_content)

#         output_filename = "segment.mp4"
#         scene_name_to_render = "GeneratedScene"
#         manim_executable = "manim" 

#         # El nombre del script sin la extensión, Manim lo usa para crear el directorio
#         script_name_without_ext = os.path.splitext(os.path.basename(script_path))[0]

#         # --- CORRECCIÓN CLAVE AQUÍ ---
#         # Construir la ruta de salida exacta que Manim utilizará por defecto
#         # para la calidad -ql (480p15)
#         expected_video_path = os.path.join(
#             request_dir,
#             "videos",
#             script_name_without_ext,
#             "480p15",
#             output_filename
#         )

#         command = [
#             manim_executable,  # <--- USA LA RUTA ABSOLUTA
#             "render",
#             script_path,
#             scene_name_to_render,
#             "-ql",
#             "--media_dir", request_dir,
#             "--output_file", output_filename,
#             "--progress_bar", "none"
#         ]
        
#         process = subprocess.run(command, capture_output=True, text=True, check=True, timeout=120)

#         # Usamos la ruta esperada para verificar si el archivo existe
#         if not os.path.exists(expected_video_path):
#             # Como fallback, revisamos también la ruta simple, por si alguna versión de Manim la usa
#             fallback_path = os.path.join(request_dir, output_filename)
#             if not os.path.exists(fallback_path):
#                 raise FileNotFoundError(f"El video de Manim no fue encontrado en las rutas esperadas. Stdout: {process.stdout}, Stderr: {process.stderr}")
#             else:
#                 video_file_path = fallback_path
#         else:
#             video_file_path = expected_video_path
        
#         return jsonify({"status": "success", "video_path": video_file_path})

#     except subprocess.CalledProcessError as e:
#         return jsonify({"status": "error", "message": "Manim execution failed", "stderr": e.stderr}), 500
#     except Exception as e:
#         return jsonify({"status": "error", "message": "An unexpected error occurred", "error": str(e)}), 500

 
@app.route("/render-full-video", methods=["POST"])
def render_full_video():
    data = request.get_json()
    order_id = data.get("orderId")
    solution_json = data.get("solutionJson")
    openai_api_key = data.get("openaiApiKey") 

    if not all([order_id, solution_json, openai_api_key]):
        missing_params = []
        if not order_id: missing_params.append("orderId")
        if not solution_json: missing_params.append("solutionJson")
        if not openai_api_key: missing_params.append("openaiApiKey")
        return jsonify({"status": "error", "message": f"Faltan parámetros requeridos: {', '.join(missing_params)}"}), 400

    request_dir = os.path.join(PROCESSING_DIR, str(order_id))
    script_path = os.path.join(request_dir, "full_scene.py")
    os.makedirs(request_dir, exist_ok=True)
    scene_name_to_render = "VoiceoverSolutionScene"
    manim_output_scene_dir = "full_scene" 

    try:
        manim_script_content = generate_full_voiceover_script(solution_json)

        with open(script_path, "w", encoding="utf-8") as f:
            f.write(manim_script_content)

        output_filename = f"order_{order_id}_final_with_audio.mp4"
        
        env_for_subprocess = os.environ.copy()
        env_for_subprocess["OPENAI_API_KEY"] = openai_api_key

        command = [
            "manim", "render", script_path, scene_name_to_render,
            "-ql",
            "--media_dir", request_dir,
            "--output_file", output_filename,
            "--progress_bar", "none",
        ]
        
        process = subprocess.run(
            command, 
            capture_output=True, 
            text=True, 
            check=True, 
            timeout=600, 
            env=env_for_subprocess 
        )

        video_file_path = os.path.join(
            request_dir, 
            "videos", 
            manim_output_scene_dir, 
            "480p15", 
            output_filename
        )
        if not os.path.exists(video_file_path):
            raise FileNotFoundError(f"El video final de Manim no fue encontrado en la ruta esperada. Manim Stdout: {process.stdout}")

        return jsonify({"status": "success", "video_path": video_file_path})

    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": "Manim execution failed", "stderr": e.stderr}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": "Un error inesperado ocurrió", "error": str(e)}), 500



@app.route("/videos/<path:filepath>")
def download_video(filepath):
    print(f"Solicitud de descarga para: {filepath}")
    return send_from_directory(PROCESSING_DIR, filepath, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)