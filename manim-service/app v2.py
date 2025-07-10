import os
import subprocess
import json
import re
import socket # Importar el módulo socket para la validación de red
from urllib.parse import urlparse # Importar urlparse para extraer el hostname
import sys # ¡IMPORTANTE: Asegurarse de que sys esté importado al inicio del archivo!
import tempfile # Para archivos de audio temporales
import wave     # Para leer la duración de archivos WAV

# Importar Manim Scene (ya no VoiceoverScene para SSML directo)
from manim import *
# Ya no necesitamos manim_voiceover para la síntesis de voz, pero si se usa para otras funcionalidades, se puede mantener.
# Para esta implementación de SSML directo, no se usa su AzureService ni su voiceover context manager.
# from manim_voiceover import VoiceoverScene 
# from manim_voiceover.services.azure import AzureService

# Importar la SDK de Azure Cognitive Services Speech directamente
import azure.cognitiveservices.speech as speechsdk 

# --- Variable global para el nombre de la voz de Azure ---
AZURE_VOICE_NAME = 'es-ES-ElviraNeural'
# ---------------------------------------------------------

# Función para verificar la conectividad al endpoint de Azure
def check_azure_connectivity(region: str) -> bool:
    """
    Verifica si el hostname del endpoint de Azure Speech Service puede ser resuelto.
    """
    # Construir el endpoint base para la región dada
    azure_endpoint_url = f"https://{region}.api.cognitive.microsoft.com/"
    
    try:
        # Extraer el hostname de la URL
        hostname = urlparse(azure_endpoint_url).hostname
        if not hostname:
            print(f"ERROR: No se pudo extraer el hostname de la URL: {azure_endpoint_url}")
            return False
        
        # Intentar resolver el hostname a una dirección IP
        socket.gethostbyname(hostname)
        print(f"DEBUG: Hostname '{hostname}' resuelto exitosamente a una IP.", flush=True) # Añadido flush=True
        return True
    except socket.gaierror as e:
        print(f"ERROR: Fallo al resolver el hostname '{hostname}' de Azure: {e}", file=sys.stderr, flush=True) # Añadido file=sys.stderr, flush=True
        return False
    except Exception as e:
        print(f"ERROR: Error inesperado al verificar la conectividad a Azure: {e}", file=sys.stderr, flush=True) # Añadido file=sys.stderr, flush=True
        return False

# --- NUEVA FUNCIÓN: Prueba aislada de Azure TTS ---
def test_azure_tts_isolated(speech_key: str, region: str, text_to_synthesize: str) -> dict:
    """
    Realiza una prueba aislada de síntesis de voz con Azure AI Speech SDK.
    Esta función incluye lógica para añadir atributos SSML si faltan,
    para ser un entorno de prueba robusto.
    """
    speech_synthesizer = None # Inicializar a None para asegurar que siempre esté definida
    try:
        # Configurar el cliente de Speech con la clave y la región
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=region)
        
        # Usar la variable global para el nombre de la voz
        speech_config.speech_synthesis_voice_name = AZURE_VOICE_NAME 
        
        # Si el texto es SSML, asegúrate de que tenga los atributos xml:lang, version y xmlns, y la etiqueta <voice>
        if text_to_synthesize.strip().startswith("<speak>"):
            # Añadir xml:lang si falta
            if 'xml:lang' not in text_to_synthesize:
                text_to_synthesize = text_to_synthesize.replace("<speak>", '<speak xml:lang="es-ES">', 1)
            
            # Añadir version y xmlns si faltan
            if 'version=' not in text_to_synthesize and 'xmlns=' not in text_to_synthesize:
                text_to_synthesize = text_to_synthesize.replace('<speak', '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"', 1)
            elif 'version=' not in text_to_synthesize:
                text_to_synthesize = text_to_synthesize.replace('<speak', '<speak version="1.0"', 1)
            elif 'xmlns=' not in text_to_synthesize:
                text_to_synthesize = text_to_synthesize.replace('<speak', '<speak xmlns="http://www.w3.org/2001/10/synthesis"', 1)

            # Verificar si la etiqueta <voice> está presente dentro de <speak>
            if '<voice' not in text_to_synthesize:
                # Insertar <voice> tag después de <speak>
                # Usamos una expresión regular para encontrar el final de la etiqueta <speak>
                text_to_synthesize = re.sub(r'(<speak[^>]*>)', r'\1<voice name="' + AZURE_VOICE_NAME + '">', text_to_synthesize, 1)
                # Añadir la etiqueta de cierre </voice> antes de </speak>
                text_to_synthesize = text_to_synthesize.replace('</speak>', '</voice></speak>', 1)

        # Sintetizar el texto
        print(f"DEBUG_TTS_ISOLATED: Final SSML for synthesis: {text_to_synthesize}", file=sys.stderr, flush=True) # Añadida impresión
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config) 
        result = speech_synthesizer.speak_ssml_async(text_to_synthesize).get() 
        
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("DEBUG_TTS_ISOLATED: Síntesis de voz completada.", flush=True)
            return {"status": "success", "message": "Síntesis de voz exitosa."}
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            error_message = f"Fallo en la síntesis de voz: {cancellation_details.reason}. "
            if cancellation_details.reason == speech_config.CancellationReason.Error:
                if cancellation_details.error_details:
                    error_message += f"Detalles del error: {cancellation_details.error_details}. "
                error_message += "Verifique su clave, región y conectividad."
            print(f"DEBUG_TTS_ISOLATED: {error_message}", file=sys.stderr, flush=True)
            return {"status": "error", "message": error_message, "details": cancellation_details.error_details}
        else:
            error_message = f"Fallo inesperado en la síntesis de voz: {result.reason}."
            print(f"DEBUG_TTS_ISOLATED: {error_message}", file=sys.stderr, flush=True)
            return {"status": "error", "message": error_message}
            
    except Exception as e:
        print(f"DEBUG_TTS_ISOLATED: Excepción durante la prueba de TTS aislada: {e}", file=sys.stderr, flush=True)
        return {"status": "error", "message": f"Excepción durante la prueba de TTS aislada: {e}"}

# --- FIN NUEVA FUNCIÓN ---

# La función ahora recibe solution_json y la usará para generar la clase de la escena.
def generate_full_voiceover_script(solution_json: dict) -> str:
    scene_class_name = "AzureSSMLSolutionScene" # Cambiado el nombre de la escena
    
    script = "from manim import *\n"
    script += "import os\n"
    script += "import json\n"
    script += "import re\n"
    script += "import sys\n"
    script += "import tempfile\n" # Añadido tempfile
    script += "import wave\n"     # Añadido wave
    script += "import azure.cognitiveservices.speech as speechsdk\n\n" # Añadido speechsdk import

    # La escena ahora hereda de Manim.Scene, ya que no usaremos las funcionalidades de voiceover
    # que no soportan SSML directo.
    script += f"class {scene_class_name}(Scene):\n" 
    script += "    def __init__(self, **kwargs):\n"
    script += "        super().__init__(**kwargs)\n"
    script += f"        self.solution_json = json.loads(r'''{json.dumps(solution_json)}''')\n\n"

    script += "    def construct(self):\n"
    script += "        azure_speech_key = os.environ.get('AZURE_SUBSCRIPTION_KEY')\n"
    script += "        azure_speech_region = os.environ.get('AZURE_SERVICE_REGION')\n"
    
    script += f"        print(f\"DEBUG_MANIM: AZURE_SUBSCRIPTION_KEY (primeros 5): {{azure_speech_key[:5] if azure_speech_key else 'None'}}... (Longitud: {{len(azure_speech_key) if azure_speech_key else 'None'}})\", file=sys.stderr, flush=True)\n"
    script += f"        print(f\"DEBUG_MANIM: AZURE_SERVICE_REGION: {{azure_speech_region}}\", file=sys.stderr, flush=True)\n"

    script += "        if not azure_speech_key or not azure_speech_region:\n"
    script += "            raise RuntimeError(\"Azure Speech credentials (AZURE_SUBSCRIPTION_KEY, AZURE_SERVICE_REGION) not found in environment variables.\")\n"

    script += "        # Configuración del servicio de voz de Azure para uso directo de SSML\n"
    script += "        speech_config = speechsdk.SpeechConfig(subscription=azure_speech_key, region=azure_speech_region)\n"
    script += f"        speech_config.speech_synthesis_voice_name = '{AZURE_VOICE_NAME}'\n" # Usar la variable global

    script += "        self.camera.background_color = GREY_E\n"
    script += "        all_displayed_formulas = VGroup()\n\n"
    
    script += "        steps = self.solution_json.get('steps', [])\n" 
    script += "        for i, step in enumerate(steps):\n"
    script += f"            step_number = str(step.get('stepNumber', ''))\n" # Asegurar que step_number es string
    script += f"            description = step.get('description', '').replace(\"'\", \"\\'\")\n"
    script += f"            narration_ssml = description\n" # La descripción ya es SSML

    script += f"            print(f\"DEBUG_MANIM: SSML text for step {{i+1}}: {{narration_ssml}}\", file=sys.stderr, flush=True)\n" 

    script += "            temp_audio_file_path = None # Inicializar para el bloque finally\n"
    script += "            try:\n"
    script += "                # Crear un archivo WAV temporal para el audio sintetizado\n"
    script += "                temp_audio_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)\n"
    script += "                temp_audio_file_path = temp_audio_file.name\n"
    script += "                temp_audio_file.close()\n"
    script += "                \n"
    script += "                audio_config = speechsdk.audio.AudioOutputConfig(filename=temp_audio_file_path)\n"
    script += "                speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)\n"
    script += "                \n"
    script += "                # Sintetizar el SSML\n"
    script += "                result = speech_synthesizer.speak_ssml_async(narration_ssml).get()\n"
    script += "                \n"
    script += "                audio_duration = 0.0 # Duración por defecto en caso de error\n"
    script += "                if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:\n"
    script += "                    print(f\"DEBUG_MANIM: Audio synthesis completed for step {{i+1}}.\", file=sys.stderr, flush=True)\n"
    script += "                    # Obtener la duración del audio del archivo WAV\n"
    script += "                    try:\n"
    script += "                        with wave.open(temp_audio_file_path, 'rb') as wf:\n"
    script += "                            frames = wf.getnframes()\n"
    script += "                            rate = wf.getframerate()\n"
    script += "                            audio_duration = frames / float(rate)\n"
    script += f"                        print(f\"DEBUG_MANIM: Actual audio duration for step {{i+1}}: {{audio_duration}} seconds.\", file=sys.stderr, flush=True)\n" # NUEVA LÍNEA DE DEBUG
    script += "                    except Exception as e_wave:\n"
    script += "                        print(f\"ERROR_MANIM: Fallo al leer la duración del archivo WAV: {{e_wave}}\", file=sys.stderr, flush=True)\n"
    script += "                        audio_duration = 2.0 # Duración de respaldo si no se puede leer\n"
    script += "                    \n"
    script += "                    self.add_sound(temp_audio_file_path)\n" # Reproducir el sonido
    script += "                    \n"
    script += "                    raw_formula = step.get('formula', '').replace(\"'\", \"\\'\")\n" 
    script += "                    highlight_pattern = r'\\\\hl\\{(.*?)\}'\n"
    script += "                    highlight_matches = re.findall(highlight_pattern, raw_formula)\n"
    script += "                    clean_formula = re.sub(highlight_pattern, r'\\1', raw_formula).replace(\"'\", \"\\'\")\n"
    
    script += "                    if clean_formula and clean_formula.strip():\n"
    script += "                        new_formula_mobject = MathTex(clean_formula, font_size=48, color=WHITE)\n" 
    
    script += f"                        print(f\"DEBUG_MANIM: Checking step_number: {{step_number}}\", file=sys.stderr, flush=True)\n" # Nueva línea de depuración
    script += "                        if step_number is not None and step_number != '':\n" # Condición más robusta
    script += "                            step_label = Text(str(step_number) + \". \", font_size=36, color=BLUE_A)\n"
    script += "                            new_formula_with_label = VGroup(step_label, new_formula_mobject)\n"
    script += "                            new_formula_with_label.arrange(RIGHT, buff=0.2)\n" 
    script += "                        else:\n"
    script += "                            new_formula_with_label = new_formula_mobject\n"
    
    script += "                        all_displayed_formulas.add(new_formula_with_label)\n"
    script += "                        all_displayed_formulas.arrange(DOWN, buff=0.8)\n"
    script += "                        if all_displayed_formulas.height > config.frame_height - 1:\n" 
    script += "                            all_displayed_formulas.scale_to_fit_height(config.frame_height - 1)\n"
    script += "                        all_displayed_formulas.center()\n" 

    script += "                        self.play(\n"
    script += "                            Write(new_formula_mobject),\n"
    script += "                            all_displayed_formulas.animate,\n"
    script += "                            run_time=min(1.0, audio_duration * 0.5) # Ajustar run_time basado en la duración del audio\n" 
    script += "                        )\n"
    
    script += "                        if highlight_matches:\n"
    script += "                            highlight_animations = []\n"
    script += "                            for highlight_tex_content in highlight_matches:\n"
    script += "                                temp_ref_mobject = MathTex(highlight_tex_content, font_size=48, color=WHITE)\n"
    script += "                                temp_ref_mobject.move_to(new_formula_mobject.get_center())\n"
    script += "                                target_part = None\n"
    script += "                                for submob in new_formula_mobject.submobjects:\n"
    script += "                                    if highlight_tex_content in submob.tex_string:\n"
    script += "                                        target_part = submob\n"
    script += "                                        break\n"
    script += "                                if target_part:\n"
    script += "                                    highlight_rect = SurroundingRectangle(target_part, color=YELLOW, buff=0.1)\n"
    script += "                                    highlight_animations.append(Create(highlight_rect, run_time=0.3))\n"
    script += "                                    highlight_animations.append(Wait(0.7))\n"
    script += "                                    highlight_animations.append(Uncreate(highlight_rect, run_time=0.3))\n"
    script += "                                else:\n"
    script += "                                    print(f\"[Manim Script] WARNING: No se pudo encontrar la parte '{{highlight_tex_content}}' para resaltar con SurroundingRectangle.\", file=sys.stderr, flush=True)\n"
    script += "                            \n"
    script += "                            if highlight_animations:\n"
    script += "                                self.play(*highlight_animations, run_time=1.3)\n"

    script += "                        wait_duration = max(0, audio_duration - min(1.0, audio_duration * 0.5) - (1.3 if highlight_matches else 0))\n"
    script += "                        self.wait(wait_duration)\n"
    script += "                    else:\n"
    script += "                        self.wait(audio_duration)\n" # Si no hay fórmula, solo esperar la duración del audio
    script += "                elif result.reason == speechsdk.ResultReason.Canceled:\n"
    script += "                    cancellation_details = result.cancellation_details\n"
    # CAMBIO CLAVE AQUÍ: Interpolación directa de los detalles del error en la cadena de impresión y RuntimeError
    script += f"                    error_message = f\"Fallo en la síntesis de voz para el paso {{i+1}}: {{cancellation_details.reason}}. Detalles del error: {{cancellation_details.error_details}}. Verifique su SSML, clave, región y conectividad.\"\n"
    script += f"                    print(f\"DEBUG_MANIM: {{error_message}}\", file=sys.stderr, flush=True)\n"
    script += f"                    raise RuntimeError(error_message)\n" # Elevar el error con el mensaje completo
    script += "                else:\n"
    script += "                    error_message = f\"Fallo inesperado en la síntesis de voz para el paso {{i+1}}: {{result.reason}}.\"\n"
    script += f"                    print(f\"DEBUG_MANIM: {{error_message}}\", file=sys.stderr, flush=True)\n"
    script += f"                    raise RuntimeError(error_message)\n"
    script += "            finally:\n"
    script += "                # Limpiar el archivo de audio temporal\n"
    script += "                if temp_audio_file_path and os.path.exists(temp_audio_file_path):\n" # COMENTADO TEMPORALMENTE PARA DEBUG
    script += "                    os.remove(temp_audio_file_path)\n" # COMENTADO TEMPORALMENTE PARA DEBUG
    script += "                    print(f\"DEBUG_MANIM: Removed temporary audio file: {{temp_audio_file_path}}\", file=sys.stderr, flush=True)\n" # COMENTADO TEMPORALMENTE PARA DEBUG
    script += "                # pass # Añadido para que el bloque finally no esté vacío si se comenta la eliminación\n" # COMENTADO TEMPORALMENTE PARA DEBUG
    script += "            \n"
    script += "        self.wait(0.001)\n" 
    
    return script


from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)
PROCESSING_DIR = os.path.join(os.getcwd(), "manim_processing")
os.makedirs(PROCESSING_DIR, exist_ok=True)


# --- NUEVO ENDPOINT: Para probar la síntesis de voz de forma aislada ---
@app.route("/test-tts", methods=["POST"])
def test_tts():
    data = request.get_json()
    speech_key = data.get("azureSpeechKey")
    region = data.get("azureSpeechRegion")
    text_to_synthesize = data.get("textToSynthesize")

    if not all([speech_key, region, text_to_synthesize]):
        return jsonify({"status": "error", "message": "Faltan parámetros requeridos: azureSpeechKey, azureSpeechRegion, textToSynthesize"}), 400

    result = test_azure_tts_isolated(speech_key, region, text_to_synthesize)
    return jsonify(result)
# --- FIN NUEVO ENDPOINT ---


@app.route("/render-full-video", methods=["POST"])
def render_full_video():
    data = request.get_json()
    order_id = data.get("orderId")
    solution_json = data.get("solutionJson")
    # Ahora esperamos las credenciales de Azure
    azure_speech_key = data.get("azureSpeechKey") 
    azure_speech_region = data.get("azureSpeechRegion")

    if not all([order_id, solution_json, azure_speech_key, azure_speech_region]):
        missing_params = []
        if not order_id: missing_params.append("orderId")
        if not solution_json: missing_params.append("solutionJson")
        if not azure_speech_key: missing_params.append("azureSpeechKey")
        if not azure_speech_region: missing_params.append("azureSpeechRegion")
        return jsonify({"status": "error", "message": f"Faltan parámetros requeridos: {', '.join(missing_params)}"}), 400

    # --- INICIO: Validar conectividad a Azure antes de ejecutar Manim ---
    if not check_azure_connectivity(azure_speech_region):
        return jsonify({
            "status": "error",
            "message": f"Fallo en la validación de conectividad a Azure Speech Service para la región '{azure_speech_region}'. "
                       "Verifique su conexión a internet, configuración de DNS y que la región sea correcta."
        }), 500
    # --- FIN: Validar conectividad a Azure ---

    request_dir = os.path.join(PROCESSING_DIR, str(order_id))
    script_path = os.path.join(request_dir, "full_scene.py")
    os.makedirs(request_dir, exist_ok=True)
    # Actualizado el nombre de la escena a AzureSSMLSolutionScene
    scene_name_to_render = "AzureSSMLSolutionScene" 
    manim_output_scene_dir = "full_scene" 

    try:
        # --- NUEVA VERIFICACIÓN: Comprobar si ffmpeg está disponible ---
        try:
            subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
            print("DEBUG: ffmpeg está disponible en la ruta.", file=sys.stderr, flush=True)
        except FileNotFoundError:
            return jsonify({
                "status": "error",
                "message": "ffmpeg no se encontró. Asegúrese de que ffmpeg esté instalado y en la ruta del sistema."
            }), 500
        except subprocess.CalledProcessError as e:
            return jsonify({
                "status": "error",
                "message": f"ffmpeg se encontró pero devolvió un error: {e.stderr}"
            }), 500
        # --- FIN NUEVA VERIFICACIÓN ---

        manim_script_content = generate_full_voiceover_script(solution_json)

        with open(script_path, "w", encoding="utf-8") as f:
            f.write(manim_script_content)

        output_filename = f"order_{order_id}_final_with_audio.mp4"
        
        env_for_subprocess = os.environ.copy()
        # PASO CRUCIAL: Pasar las credenciales de Azure con los nombres CORRECTOS que manim-voiceover espera internamente
        env_for_subprocess["AZURE_SUBSCRIPTION_KEY"] = azure_speech_key      # <-- CAMBIO CLAVE AQUÍ
        env_for_subprocess["AZURE_SERVICE_REGION"] = azure_speech_region # <-- CAMBIO CLAVE AQUÍ

        command = [
            "manim", "render", script_path, scene_name_to_render,
            "-ql",
            "--media_dir", request_dir,
            "--output_file", output_filename,
            "--progress_bar", "none",
            "--verbosity", "DEBUG", # <-- Añadido para obtener logs detallados de Manim/manim-voiceover
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

        # Si hay stderr, lo incluimos en la respuesta para depuración
        if process.stderr:
            print(f"Manim Stderr (DEBUG): {process.stderr}") # Imprimir en los logs del Flask
            # Si el stderr contiene el error de síntesis, lo manejamos como un error
            if "Speech synthesis failed" in process.stderr:
                return jsonify({
                    "status": "error",
                    "message": "Manim execution completed, but Azure Speech synthesis failed. Check 'stderr' for details.",
                    "stderr": process.stderr
                }), 500
            else:
                # Si hay stderr pero no es el error de síntesis, puede ser una advertencia, etc.
                # En este caso, el video se generó, así que lo consideramos éxito pero con advertencias.
                return jsonify({
                    "status": "success",
                    "video_path": video_file_path,
                    "warnings": process.stderr
                })
        
        return jsonify({"status": "success", "video_path": video_file_path})

    except subprocess.CalledProcessError as e:
        # Si Manim falla por un error de proceso, incluimos el stderr completo
        return jsonify({"status": "error", "message": "Manim execution failed", "stderr": e.stderr}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": "Un error inesperado ocurrió", "error": str(e)}), 500


@app.route("/videos/<path:filepath>")
def download_video(filepath):
    print(f"Solicitud de descarga para: {filepath}")
    return send_from_directory(PROCESSING_DIR, filepath, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)