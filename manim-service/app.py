import os
import subprocess
import json
import re
import socket # Importar el módulo socket para la validación de red
from urllib.parse import urlparse # Importar urlparse para extraer el hostname
import sys # ¡IMPORTANTE: Asegurarse de que sys esté importado al inicio del archivo!

# Importar VoiceoverScene y AzureService de manim_voiceover
from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.azure import AzureService # Importar AzureService

# Importar la SDK de Azure Cognitive Services Speech directamente
import azure.cognitiveservices.speech as speechsdk 

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
    """
    try:
        # Configurar el cliente de Speech con la clave y la región
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=region)
        
        # Opcional: Configurar la voz. Usamos la misma que en Manim para consistencia.
        speech_config.speech_synthesis_voice_name = 'es-ES-ElviraNeural'
        
        # Crear un sintetizador de voz SIN un audio_config explícito.
        # Esto hará que la síntesis se realice pero el audio se descarte,
        # lo cual es ideal para una prueba de funcionalidad sin salida de audio.
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config) 
        
        # Sintetizar el texto
        result = speech_synthesizer.speak_text_async(text_to_synthesize).get()
        
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("DEBUG_TTS_ISOLATED: Síntesis de voz completada.", flush=True)
            return {"status": "success", "message": "Síntesis de voz exitosa."}
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = result.cancellation_details
            error_message = f"Fallo en la síntesis de voz: {cancellation_details.reason}. "
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
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
    scene_class_name = "AzureVoiceoverSolutionScene"
    
    script = "from manim import *\n"
    script += "from manim_voiceover import VoiceoverScene\n"
    script += "from manim_voiceover.services.azure import AzureService # Importar AzureService\n"
    script += "import os\n"
    script += "import json\n"
    script += "import re\n"
    script += "import sys # ¡IMPORTANTE: Añadir esta importación para sys.stderr y sys.exit!\n\n"
    
    # Serializamos solution_json a una cadena JSON.
    escaped_solution_json_str = json.dumps(solution_json)

    script += f"class {scene_class_name}(VoiceoverScene):\n" # Vuelve a heredar de VoiceoverScene
    script += "    def __init__(self, **kwargs):\n"
    script += "        super().__init__(**kwargs)\n"
    script += f"        self.solution_json = json.loads(r'''{escaped_solution_json_str}''')\n\n"

    script += "    def construct(self):\n"
    # Obtener las credenciales de Azure de las variables de entorno
    # Se usan los nombres de variables que la librería manim-voiceover (en la versión que causa el KeyError) busca.
    script += "        azure_speech_key = os.environ.get('AZURE_SUBSCRIPTION_KEY')\n" 
    script += "        azure_speech_region = os.environ.get('AZURE_SERVICE_REGION')\n" 
    
    # --- INICIO: Sentencias PRINT de depuración para la clave y región ---
    # Los prints ahora usan los nombres de variables definidos arriba.
    script += f"        print(f\"DEBUG_MANIM: AZURE_SUBSCRIPTION_KEY (primeros 5): {{azure_speech_key[:5] if azure_speech_key else 'None'}}... (Longitud: {{len(azure_speech_key) if azure_speech_key else 'None'}})\", file=sys.stderr, flush=True)\n"
    script += f"        print(f\"DEBUG_MANIM: AZURE_SERVICE_REGION: {{azure_speech_region}}\", file=sys.stderr, flush=True)\n"
    # --- FIN: Sentencias PRINT de depuración ---

    # --- INICIO: Bloque try-except para la configuración del servicio de voz ---
    script += "        try:\n"
    # Configurar Azure Speech Service.
    # Se ha eliminado el parámetro 'style' para probar la compatibilidad.
    script += f"            self.set_speech_service(AzureService(voice='es-ES-ElviraNeural'))\n" 
    script += "            print(\"DEBUG_MANIM: set_speech_service called successfully.\", file=sys.stderr, flush=True)\n" 
    script += "        except Exception as e:\n"
    script += "            print(f\"DEBUG_MANIM_ERROR_CONFIG: Fallo en la configuración del servicio de voz: {e}\", file=sys.stderr, flush=True)\n"
    script += "            raise RuntimeError(f\"Error al configurar Azure Speech Service: {e}. Verifique sus credenciales, región y la disponibilidad de la voz. Detalles adicionales pueden estar en la salida STDERR de Manim.\")\n"
    # --- FIN: Bloque try-except para la llamada a voiceover ---
    
    script += "        self.camera.background_color = GREY_E\n"
    
    # Este VGroup contendrá todas las fórmulas que se acumulan en pantalla.
    script += "        all_displayed_formulas = VGroup()\n\n"
    
    # Accedemos a solution_json a través de self.solution_json, que ya fue cargado en __init__
    script += "        steps = self.solution_json.get('steps', [])\n" 
    script += "        for i, step in enumerate(steps):\n"
    script += f"            description = step.get('description', '').replace(\"'\", \"\\'\")\n" 
    # Eliminar todas las etiquetas SSML del texto de la descripción
    script += f"            clean_description = re.sub(r'<[^>]+>', '', description)\n" # <-- NUEVA LÍNEA
    script += f"            narration_text = clean_description\n" # <-- CAMBIO AQUÍ
    
    # --- NUEVA LÍNEA DE DEPURACIÓN: Imprimir el narration_text ---
    script += f"            print(f\"DEBUG_MANIM: Narration text for step {{i+1}}: {{narration_text}}\", file=sys.stderr, flush=True)\n" 
    
    script += f"            raw_formula = step.get('formula', '').replace(\"'\", \"\\'\")\n" 
    script += f"            step_number = step.get('stepNumber', '')\n" # Obtener el número de paso

    # --- LÓGICA PARA EL RESALTADO ---
    # Regex para encontrar \hl{...} y capturar su contenido
    script += "            highlight_pattern = r'\\\\hl\\{(.*?)\}'\n"
    script += "            highlight_matches = re.findall(highlight_pattern, raw_formula)\n"
    # Eliminar \hl{} de la fórmula para obtener la versión limpia para renderizar
    script += "            clean_formula = re.sub(highlight_pattern, r'\\1', raw_formula).replace(\"'\", \"\\'\")\n"
    # --- FIN LÓGICA RESALTADO ---

    # Pasar la descripción directamente a manim_voiceover, que la manejará como SSML
    # CAMBIO CLAVE: Usar 'text' en lugar de 'ssml' porque manim-voiceover no soporta SSML directo.
    script += "            try:\n"
    script += f"                with self.voiceover(text=narration_text) as tracker:\n" # <-- CAMBIO CLAVE AQUÍ
    script += f"                    if clean_formula and clean_formula.strip():\n" # Usar clean_formula aquí
    script += f"                        new_formula_mobject = MathTex(clean_formula, font_size=48, color=WHITE)\n" 
    
    # Añadir número de paso si existe
    script += f"                        if step_number is not None:\n"
    script += f"                            step_label = Text(str(step_number) + \". \", font_size=36, color=BLUE_A)\n"
    script += f"                            # Agrupar el número de paso y la fórmula para que se muevan juntos\n"
    script += f"                            new_formula_with_label = VGroup(step_label, new_formula_mobject)\n"
    script += f"                            new_formula_with_label.arrange(RIGHT, buff=0.2)\n" # Organizar horizontalmente
    script += f"                        else:\n"
    script += f"                            new_formula_with_label = new_formula_mobject\n"
    
    script += f"                        all_displayed_formulas.add(new_formula_with_label)\n"

    # Ajustar el grupo de fórmulas para que quepa en la pantalla
    script += f"                        all_displayed_formulas.arrange(DOWN, buff=0.8)\n"
    script += f"                        if all_displayed_formulas.height > config.frame_height - 1:\n" 
    script += f"                            all_displayed_formulas.scale_to_fit_height(config.frame_height - 1)\n"
    script += f"                        all_displayed_formulas.center()\n" 

    script += f"                        self.play(\n"
    script += f"                            Write(new_formula_mobject),\n" # Solo animamos la escritura de la fórmula
    script += f"                            all_displayed_formulas.animate,\n" # Animamos el grupo completo para el reordenamiento
    script += f"                            run_time=min(1.0, tracker.duration * 0.5)\n" 
    script += f"                        )\n"
    
    # --- LÓGICA DE ANIMACIÓN DE RESALTADO (Usando SurroundingRectangle) ---
    # Nota: Esta lógica ha presentado desafíos con la identificación precisa de submobjects complejos.
    # Si el resaltado no funciona como se espera, podría requerir una estrategia alternativa o un ajuste fino.
    script += "                        if highlight_matches:\n"
    script += "                            highlight_animations = []\n"
    script += "                            for highlight_tex_content in highlight_matches:\n"
    script += "                                # Crear un MathTex temporal para obtener la posición exacta de la parte a resaltar\n"
    script += "                                # Este mobject temporal no se añade a la escena, solo se usa para referencia\n"
    script += "                                temp_ref_mobject = MathTex(highlight_tex_content, font_size=48, color=WHITE)\n"
    script += "                                temp_ref_mobject.move_to(new_formula_mobject.get_center())\n"
    script += "                                \n"
    script += "                                # Intentar alinear el temp_ref_mobject con la parte correspondiente en new_formula_mobject\n"
    script += "                                # Esto es una heurística para encontrar la posición correcta\n"
    script += "                                # Se busca la parte de new_formula_mobject que contiene el highlight_tex_content\n"
    script += "                                target_part = None\n"
    script += "                                for submob in new_formula_mobject.submobjects:\n"
    script += "                                    if highlight_tex_content in submob.tex_string:\n"
    script += "                                        target_part = submob\n"
    script += "                                        break\n"
    script += "                                \n"
    script += "                                if target_part:\n"
    script += "                                    # Crear un rectángulo que rodee la parte objetivo\n"
    script += "                                    highlight_rect = SurroundingRectangle(target_part, color=YELLOW, buff=0.1)\n"
    script += "                                    \n"
    script += "                                    # Animaciones: aparecer, esperar, desaparecer\n"
    script += "                                    highlight_animations.append(Create(highlight_rect, run_time=0.3))\n"
    script += "                                    highlight_animations.append(Wait(0.7))\n" # Mantener el resaltado visible
    script += "                                    highlight_animations.append(Uncreate(highlight_rect, run_time=0.3))\n"
    script += "                                else:\n"
    script += "                                    print(f\"[Manim Script] WARNING: No se pudo encontrar la parte '{highlight_tex_content}' para resaltar con SurroundingRectangle.\")\n"
    script += "                            \n"
    script += "                            if highlight_animations:\n"
    script += "                                self.play(*highlight_animations, run_time=1.3) # Duración total de la secuencia de resaltado (0.3+0.7+0.3)\n"
    # --- FIN LÓGICA DE RESALTADO ---

    # Ajustar el tiempo de espera restante, considerando la duración de la animación de resaltado
    # La animación de resaltado ahora dura 1.3 segundos (0.3 crear + 0.7 esperar + 0.3 deshacer)
    script += "                        wait_duration = max(0, tracker.duration - min(1.0, tracker.duration * 0.5) - (1.3 if highlight_matches else 0))\n" 
    script += "                        self.wait(wait_duration)\n"
    script += f"                    else:\n"
    script += f"                        self.wait(tracker.duration)\n\n"
    script += "            except Exception as e:\n"
    script += "                raise RuntimeError(f\"Error durante la síntesis de voz o animación: {e}.\")\n" # Mensaje de error mejorado
    # --- FIN: Bloque try-except para la llamada a voiceover ---
    
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
    scene_name_to_render = "AzureVoiceoverSolutionScene" # Nombre de la escena actualizado
    manim_output_scene_dir = "full_scene" 

    try:
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
