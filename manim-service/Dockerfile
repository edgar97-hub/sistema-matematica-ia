# Paso 1: Usar una imagen base oficial de Python 3.9, delgada y estable.
FROM python:3.9-slim-bullseye

# Paso 2: Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Paso 3: Instalar las dependencias de sistema de Manim.
# Esto se ejecuta en un entorno Debian limpio, por lo que no habrá conflictos.

 

    # Instalar TODAS las dependencias de sistema necesarias para Manim y manim-voiceover.
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     ffmpeg \
#     texlive-full \
#     libcairo2-dev \
#     libpango1.0-dev \
#     dvisvgm \
#     portaudio19-dev \
#     sox \
#     libsox-fmt-all \
#     && rm -rf /var/lib/apt/lists/*

# Paso 4: Copiar el archivo de requerimientos de Python y luego instalarlos.
# Se hace en dos pasos para aprovechar el caché de Docker.
# COPY requirements.txt .
# RUN pip install numpy typing-extensions 
# RUN pip install manim-handwritten
# RUN pip install --no-cache-dir -r requirements.txt

# Paso 5: Copiar el resto del código de la aplicación al contenedor.

COPY requirements.txt .

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     ffmpeg \
#     texlive \
#     texlive-latex-extra \
#     texlive-fonts-extra \
#     texlive-latex-recommended \
#     texlive-science \
#     tipa \
#     libcairo2-dev \
#     libpango1.0-dev \
#     dvisvgm \
#     portaudio19-dev \
#     sox \
#     libsox-fmt-all \
#     && rm -rf /var/lib/apt/lists/* && \
#     pip install numpy typing-extensions && \
#     pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    texlive texlive-latex-extra texlive-fonts-extra texlive-latex-recommended texlive-science tipa \
    libcairo2-dev libpango1.0-dev dvisvgm \
    portaudio19-dev sox libsox-fmt-all \
    && rm -rf /var/lib/apt/lists/*

RUN pip install "numpy<2" typing-extensions

RUN pip install --no-cache-dir --timeout 1200 -r requirements.txt

RUN pip install --no-cache-dir google-cloud-texttospeech "manim-voiceover[google-cloud]==0.3.7"

COPY . .

# Paso 6: Exponer el puerto que usará Flask.
EXPOSE 3002

# Paso 7: Comando para iniciar la aplicación cuando se ejecute el contenedor.
# CMD ["flask", "--app", "app", "run", "--host=0.0.0.0", "--port=3002"]
# CMD ["flask", "run"]
CMD ["flask", "run", "--no-reload"]

