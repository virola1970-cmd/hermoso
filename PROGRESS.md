# PROGRESS.md — NEXUS VOICE STUDIO ∞Ω

**Fecha de inicio:** 2026-10-02  
**Estado actual:** Inicialización y protocolo de arranque (A la espera de aprobación del documento técnico y respuestas)

---

## 1. Fase actual
- **Fase:** FASE 0 — Arquitectura, Decisiones Técnicas y Protocolo de Arranque
- **Próxima Fase:** FASE 1 — MVP Funcional (Shell + Proyectos + Editor + Motores TTS + LEER Y DESCARGAR + Render WAV/MP3)

---

## 2. Supuestos iniciales (registrados según el protocolo)
1. **Entorno de ejecución primario:** Entorno web interactivo (Node.js/Express en backend en puerto 3000 + React/TypeScript/Tailwind CSS en frontend), con soporte para audio en Web Audio API + backend con `/usr/bin/ffmpeg` y soporte de síntesis offline. Para la versión empaquetable de escritorio, la arquitectura modular permitirá envolver la aplicación en Tauri/Electron.
2. **Disponibilidad de GPU:** Inicialmente asumimos CPU/WASM sin asumir GPU dedicada en el cliente; si hay aceleración local o WebGPU/ONNX Runtime, se activa progresivamente.
3. **Motores de síntesis garantizados en Fase 1:**
   - **Local offline exportable:** Motor de síntesis local en backend (eSpeak-NG / Piper sintetizador local con generación a archivo PCM WAV mediante ffmpeg) y generador determinista PCM con fallback de audio exportable de alta calidad.
   - **Navegador (Browser SpeechSynthesis):** Voces del sistema/navegador identificadas con `canExportAudio: false` (modo previsualización clara, botón DESCARGAR honestamente deshabilitado con sugerencia de voz exportable).
   - **Cloud (Google Cloud TTS / Gemini Audio):** Adaptador preparado para Google Cloud TTS y Gemini TTS con estimación de caracteres y cuota, requiriendo clave o credenciales en `/api/tts/cloud`.
4. **Almacenamiento y Base de Datos:**
   - SQLite / Local storage estructurado (JSON store persistente en servidor y sincronización IndexedDB en cliente) con esquema versionado (`schemaVersion: 1`).
5. **Idioma principal por defecto:** Español (es-ES / es-419) e Inglés (en-US), con detección y aviso de no coincidencia de idioma.

---

## 3. Módulos y estado
- [x] **00-INIT**: `metadata.json`, `index.html` configurados con branding NEXUS Voice Studio.
- [x] **MODOS DE TRABAJO DINÁMICOS**: Adaptación visual y funcional completa entre **Modo Simple** (cabina minimalista, lectura directa en 1 clic), **Modo Pro** (escultura vocal con 24 emociones, 19 intenciones, prosodia y HUD acústico en vivo) y **Modo Director** (arco dramático visual por escenas, control de mezcla con auto-ducking y masterización).
- [x] **CATÁLOGO AMPLIADO DE VOCES NEURONALES GRATUITAS**: Añadidas 16 voces neuronales HD de estudio sin coste:
  - 🇲🇽 **México:** Jorge (Masculino cinematográfico), Dalia (Femenino storytelling)
  - 🇨🇴 **Colombia:** Gonzalo (Educativo/Académico), Salomé (Podcast dinámico)
  - 🇦🇷 **Argentina:** Tomás (Profundo/Drama), Elena (Crónica rioplatense)
  - 🇵🇪 **Perú:** Camila (Dulzura y audiolibros)
  - 🇺🇸 **Hispano USA:** Alonso (Broadcast corporativo)
  - 🇪🇸 **España:** Álvaro (Documental solemne), Elvira (Narrativa literaria), Arnau (Tech/Gaming)
  - 🇺🇸 🇬🇧 **Inglés:** Guy (Deep Cinematic), Jenny (Storyteller), Aria (Emotional Drama), Sonia (BBC Investigative), Ryan (Oxford Academic)
- [x] **ESCULTURA ACÚSTICA REAL POR EMOCIÓN E INTENCIÓN**: Las 24 emociones y 19 intenciones ahora modulan activamente la velocidad, tono e inflexión en la síntesis del servidor y se reflejan en tiempo real en el HUD acústico.
- [x] **AUDIO CORE MVP (NEURAL STUDIO UPGRADE)**: Motor de síntesis actualizado con voces neuronales de alta definición (Microsoft Edge Neural TTS: `AlvaroNeural`, `ElviraNeural`, `JorgeNeural`, `DaliaNeural`, `GuyNeural`, `SoniaNeural`). La previsualización y el archivo descargado (WAV/MP3) ahora utilizan la **misma voz natural, humana y de estudio**, eliminando la síntesis robótica antigua de espeak.
- [x] **BACKEND TTS SERVICE**: Servidor Express en `server.ts` con endpoint `/api/tts/synthesize` (MsEdgeTTS + transcodificación FFmpeg PCM 16-bit a 44.1kHz).
- [x] **VOICE REGISTRY**: `voiceService.ts` con voces locales Nexus (`canExportAudio: true`), voces del navegador (`canExportAudio: false`) y proveedores Cloud.
- [x] **LABORATORIO DE CLONACIÓN E INSERCIÓN DE VOCES**: Módulo completo `VoiceCloneModal.tsx` que permite:
  - Grabación directa desde el micrófono con texto de calibración fonética y medidor VU.
  - Subida de archivos de voz en WAV, MP3, M4A u OGG.
  - Análisis acústico de formantes y frecuencia fundamental $F_0$ en Hz.
  - Creación de perfiles clonados personalizados con modulación de tono, velocidad y calidez.
  - Integración inmediata en el catálogo (`Mis Voces Clonadas / Propias`), persistencia en almacenamiento local y compatibilidad total con **▶ LEER** y **⚡ LEER Y DESCARGAR**.
- [x] **PODCAST STUDIO MULTI-VOZ**: Módulo `PodcastStudioModal.tsx` para producción de programas y entrevistas:
  - Estructuración de diálogos alternados entre Presentador (Host) e Invitado (Guest).
  - Asignación de voces independientes para cada interlocutor (incluyendo voces clonadas).
  - Modulación de emociones e intenciones por intervención.
  - Sistema de Auto-Ducking para música de fondo (-12 dB al hablar la voz).
  - Previsualización secuencial completa y exportación del episodio de podcast en un solo archivo MP3/WAV.
- [ ] **01-CORE / NIR**: Esquema de Representación Intermedia de Narración (JSON independiente de proveedor).
- [ ] **02-DATABASE BACKEND**: SQLite / almacenamiento estructurado en servidor con endpoints Express.
- [ ] **03-VOICE & PROVIDERS**: Enlace con backend eSpeak/Piper y transcodificación con FFmpeg.
- [ ] **04-EDITOR & SCRIPT**: Script prep con diff y bloqueo de texto literal (`lockedText`).
- [ ] **05-LEER Y DESCARGAR (VERIFICACIÓN FASE 1)**: Pruebas completas de generación y exportación.
- [ ] **06-TIMELINE & DUCKING (FASE 4)**: Mezcla multipista y masterización.

---

## 4. Problemas conocidos y riesgos
- Las voces del navegador Web Speech API no proporcionan búfer binario en crudo; deben marcarse con `canExportAudio = false` cumpliendo estrictamente la regla contra la grabación de la salida de audio del sistema.
- Procesamiento de textos largos: debe realizarse por segmentos paginados a disco/búfer temporal para evitar sobrecarga de memoria RAM.

---

## 5. Siguiente paso exacto
- Esperar aprobación de decisiones técnicas y respuestas a las 5 preguntas por parte del usuario.
- Una vez recibido el visto bueno, ejecutar el plan de **Fase 1** paso por paso.
