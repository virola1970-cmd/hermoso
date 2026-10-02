/**
 * NEXUS VOICE STUDIO — Central Stage & Script Editor Component
 * Transforms dynamically across Modo Simple, Modo Pro, and Modo Director.
 * Displays live visual and acoustic feedback for 24 emotions and 19 narrative intentions.
 */

import React, { useState } from 'react';
import { Scene, VoiceProfile, ProjectMode, EmotionType, IntentionType } from '../../types/nexus';
import { PlaybackState } from '../../services/audioEngine';
import {
  Wand2,
  Volume2,
  Square,
  Play,
  Pause,
  Clock,
  Type,
  VolumeX,
  Sparkles,
  Target,
  Heart,
  Sliders,
  Layers,
  Activity,
  Flame,
  UserCheck,
  Zap,
} from 'lucide-react';

interface StageEditorProps {
  scene: Scene;
  activeVoice: VoiceProfile;
  playbackState: PlaybackState;
  currentMode: ProjectMode;
  allScenes?: Scene[];
  onSelectScene?: (id: string) => void;
  onUpdateSceneText: (newText: string) => void;
  onUpdateSceneTitle: (newTitle: string) => void;
  onPlayPreview: () => void;
  onStopPreview: () => void;
  isProcessing: boolean;
}

// Visual theme and acoustic details for emotions
const EMOTION_META: Record<EmotionType, { label: string; color: string; bg: string; acousticDesc: string }> = {
  neutral: { label: 'Neutral', color: 'text-slate-300', bg: 'bg-slate-800/60 border-slate-700', acousticDesc: 'Cadencia equilibrada, articulación limpia' },
  joy: { label: 'Alegría', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/80', acousticDesc: 'Cadencia +10% · Tono +5Hz · Brillo y dinamismo' },
  sadness: { label: 'Tristeza', color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-800/80', acousticDesc: 'Cadencia -12% · Tono -4Hz · Descenso melódico lento' },
  hope: { label: 'Esperanza', color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-800/80', acousticDesc: 'Cadencia +5% · Tono +3Hz · Entonación ascendente' },
  nostalgia: { label: 'Nostalgia', color: 'text-amber-300', bg: 'bg-amber-950/40 border-amber-800/80', acousticDesc: 'Cadencia -8% · Tono -2Hz · Aire contenido y calidez' },
  surprise: { label: 'Sorpresa', color: 'text-yellow-300', bg: 'bg-yellow-950/40 border-yellow-800/80', acousticDesc: 'Cadencia +14% · Tono +7Hz · Ataque rápido y apertura' },
  curiosity: { label: 'Curiosidad', color: 'text-cyan-300', bg: 'bg-cyan-950/40 border-cyan-800/80', acousticDesc: 'Cadencia +6% · Tono +4Hz · Inflexión interrogativa' },
  tension: { label: 'Tensión', color: 'text-orange-400', bg: 'bg-orange-950/40 border-orange-800/80', acousticDesc: 'Cadencia -5% · Tono +4Hz · Tensión laríngea y rigor' },
  controlled_fear: { label: 'Miedo Controlado', color: 'text-red-400', bg: 'bg-red-950/40 border-red-800/80', acousticDesc: 'Cadencia +8% · Tono +5Hz · Respiración recortada' },
  wonder: { label: 'Asombro', color: 'text-violet-300', bg: 'bg-violet-950/40 border-violet-800/80', acousticDesc: 'Cadencia -7% · Tono +4Hz · Pausa prolongada y reverencia' },
  admiration: { label: 'Admiración', color: 'text-indigo-300', bg: 'bg-indigo-950/40 border-indigo-800/80', acousticDesc: 'Cadencia -4% · Tono +2Hz · Enaltecimiento' },
  compassion: { label: 'Compasión', color: 'text-pink-300', bg: 'bg-pink-950/40 border-pink-800/80', acousticDesc: 'Cadencia -8% · Tono -2Hz · Suavidad y cercanía' },
  love: { label: 'Amor', color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/80', acousticDesc: 'Cadencia -6% · Tono -1Hz · Graves envolventes' },
  tenderness: { label: 'Ternura', color: 'text-fuchsia-300', bg: 'bg-fuchsia-950/40 border-fuchsia-800/80', acousticDesc: 'Cadencia -8% · Tono +1Hz · Acento delicado' },
  serenity: { label: 'Serenidad', color: 'text-emerald-300', bg: 'bg-emerald-950/40 border-emerald-800/80', acousticDesc: 'Cadencia -10% · Tono -2Hz · Flujo continuo y calmo' },
  solemnity: { label: 'Solemnidad', color: 'text-slate-200', bg: 'bg-slate-900 border-slate-700', acousticDesc: 'Cadencia -12% · Tono -5Hz · Gravedad litúrgica' },
  determination: { label: 'Determinación', color: 'text-sky-300', bg: 'bg-sky-950/40 border-sky-800/80', acousticDesc: 'Cadencia +6% · Tono -2Hz · Ataque firme y seguro' },
  urgency: { label: 'Urgencia', color: 'text-red-500', bg: 'bg-red-950/50 border-red-700', acousticDesc: 'Cadencia +18% · Tono +4Hz · Ritmo acelerado' },
  mystery: { label: 'Misterio', color: 'text-cyan-400', bg: 'bg-cyan-950/50 border-cyan-700', acousticDesc: 'Cadencia -10% · Tono -4Hz · Murmullo denso y suspense' },
  confidence: { label: 'Confianza', color: 'text-green-400', bg: 'bg-green-950/40 border-green-800/80', acousticDesc: 'Cadencia +4% · Tono -2Hz · Resonancia torácica' },
  authority: { label: 'Autoridad', color: 'text-amber-400', bg: 'bg-amber-950/50 border-amber-700', acousticDesc: 'Cadencia -6% · Tono -3Hz · Comando imperativo' },
  inspiration: { label: 'Inspiración', color: 'text-purple-300', bg: 'bg-purple-950/40 border-purple-800/80', acousticDesc: 'Cadencia +6% · Tono +2Hz · Crecimiento lírico' },
  reflection: { label: 'Reflexión', color: 'text-slate-300', bg: 'bg-slate-900/60 border-slate-700', acousticDesc: 'Cadencia -12% · Tono -3Hz · Silencios de introspección' },
  gratitude: { label: 'Gratitud', color: 'text-lime-300', bg: 'bg-lime-950/40 border-lime-800/80', acousticDesc: 'Cadencia -4% · Tono +1Hz · Afecto sincero' },
};

const INTENTION_META: Record<IntentionType, string> = {
  inform: 'Transmisión neutra y precisa de datos.',
  teach: 'Énfasis explicativo con articulación didáctica.',
  convince: 'Énfasis retórico persuasivo con pausas estratégicas.',
  explain: 'Clarificación paso a paso.',
  reveal: 'Desaceleración previa antes del término clave.',
  warn: 'Gravedad preventiva con tono de advertencia.',
  move_emotion: 'Curva dramática en los puntos climáticos.',
  inspire: 'Cadencia en ascenso para movilizar la acción.',
  reassure: 'Frecuencias cálidas para brindar tranquilidad.',
  accompany: 'Presencia vocal íntima.',
  entertain: 'Variaciones dinámicas de velocidad para mantener interés.',
  investigate: 'Tono minucioso de pesquisa y formulación de hipótesis.',
  question: 'Inflexión tonal alta al cierre de oraciones.',
  present: 'Proyección clara y bienvenida.',
  conclude: 'Cierre conclusivo definitivo con descenso de tono.',
  surprise: 'Pico repentino de velocidad y agudos.',
  create_expectation: 'Pausa tensa y cadencia decreciente.',
  spark_curiosity: 'Énfasis interrogativo en adjetivos y enigmas.',
  provoke_thought: 'Pausas largas post-frase para asimilación del oyente.',
};

export const StageEditor: React.FC<StageEditorProps> = ({
  scene,
  activeVoice,
  playbackState,
  currentMode,
  allScenes = [],
  onSelectScene,
  onUpdateSceneText,
  onUpdateSceneTitle,
  onPlayPreview,
  onStopPreview,
  isProcessing,
}) => {
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const cleanText = scene.rawText.trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const charCount = cleanText.length;
  const readingSpeed = Math.max(0.5, scene.speed || 1.0);
  const estimatedSeconds = Math.max(1, Math.round((wordCount / (150 * readingSpeed)) * 60));

  const currentEmotion = EMOTION_META[scene.emotion] || EMOTION_META.neutral;
  const intentionDesc = INTENTION_META[scene.intent] || 'Transmisión natural';

  // Quick text normalizer
  const handleNormalizeText = () => {
    let t = scene.rawText;
    t = t.replace(/\$([0-9]+)/g, '$1 dólares');
    t = t.replace(/€([0-9]+)/g, '$1 euros');
    t = t.replace(/%([0-9]+)/g, '$1 por ciento');
    t = t.replace(/([0-9]+)%/g, '$1 por ciento');
    t = t.replace(/2026/g, 'dos mil veintiséis');
    t = t.replace(/2025/g, 'dos mil veinticinco');
    onUpdateSceneText(t);
  };

  const handleInsertTag = (tag: string) => {
    const newText = scene.rawText ? `${scene.rawText} ${tag} ` : `${tag} `;
    onUpdateSceneText(newText);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main className="flex-1 flex flex-col bg-slate-900/40 relative overflow-hidden select-text">
      {/* 1. Header with Mode Banner and Scene Meta */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-1">
            {/* Mode Indicator Badge */}
            <span
              className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                currentMode === 'simple'
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : currentMode === 'pro'
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80'
                  : 'bg-violet-950/60 text-violet-300 border-violet-800/80'
              }`}
            >
              {currentMode === 'simple' && 'Modo Simple · Lectura Directa'}
              {currentMode === 'pro' && 'Modo Pro · Escultura Vocal'}
              {currentMode === 'director' && 'Modo Director · Arco Dramático y Mezcla'}
            </span>

            {/* Active Character lock (if any) */}
            {scene.assignedCharacterId && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/30 border border-amber-800/50 px-2 py-0.5 rounded">
                <UserCheck className="w-3 h-3" />
                Voz Asignada
              </span>
            )}
          </div>

          <input
            type="text"
            value={scene.title}
            onChange={(e) => onUpdateSceneTitle(e.target.value)}
            placeholder="Título de la escena..."
            className="w-full bg-transparent text-base font-semibold text-slate-100 placeholder-slate-600 focus:outline-none focus:text-cyan-300 transition-colors"
          />

          {/* Stats Bar */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Type className="w-3 h-3 text-slate-500" />
              {wordCount} palabras
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{charCount} caracteres</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums text-cyan-400">
              <Clock className="w-3 h-3 text-cyan-500" />
              ~{estimatedSeconds}s lectura
            </span>
          </div>
        </div>

        {/* Text Utility Toolbar (Hidden in Simple Mode for maximum focus) */}
        {currentMode !== 'simple' && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded border border-slate-800 text-xs">
            <button
              onClick={handleNormalizeText}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
              title="Normalizar cifras y fechas a forma hablada"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Normalizar</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
            <button
              onClick={() => handleInsertTag('[PAUSA]')}
              className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors font-mono text-[11px]"
            >
              + [PAUSA]
            </button>
            <button
              onClick={() => handleInsertTag('[ÉNFASIS]')}
              className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors font-mono text-[11px]"
            >
              + [ÉNFASIS]
            </button>
          </div>
        )}
      </div>

      {/* 2. DYNAMIC VISUAL HUD FOR EMOTION & INTENTION (Visible in Pro and Director modes) */}
      {currentMode !== 'simple' && (
        <div className="px-6 py-2 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Emotion Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border font-medium ${currentEmotion.bg} ${currentEmotion.color}`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Emoción: {currentEmotion.label} ({scene.emotionIntensity}%)</span>
            </div>

            {/* Active Intention Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-slate-900 border-slate-700/80 text-cyan-300">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">Intención: {scene.intent.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Live Acoustic Profile Feedback */}
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{currentEmotion.acousticDesc} · {intentionDesc}</span>
          </div>
        </div>
      )}

      {/* 3. DIRECTOR MODE: DRAMATIC ARC & SCENE TIMELINE */}
      {currentMode === 'director' && allScenes.length > 0 && (
        <div className="px-6 py-2.5 bg-slate-950/90 border-b border-violet-900/30 flex items-center gap-3 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase text-violet-400 font-semibold tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Arco Dramático:
          </span>
          <div className="flex items-center gap-2 flex-1">
            {allScenes.map((sc, idx) => {
              const isCur = sc.id === scene.id;
              const em = EMOTION_META[sc.emotion] || EMOTION_META.neutral;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScene && onSelectScene(sc.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 shrink-0 border ${
                    isCur
                      ? 'bg-violet-950 border-violet-500 text-white font-semibold shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono text-[10px]">#{idx + 1}</span>
                  <span className="truncate max-w-[120px]">{sc.title}</span>
                  <span className={`text-[10px] font-mono ${em.color}`}>({em.label})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Main Script Textarea */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          <label htmlFor="script-editor" className="sr-only">
            Guion de narración
          </label>
          <textarea
            id="script-editor"
            value={scene.rawText}
            onChange={(e) => onUpdateSceneText(e.target.value)}
            placeholder="Escribe o pega el texto del guion aquí... Pulsa '▶ LEER' para escuchar la locución neural o 'LEER Y DESCARGAR' para obtener el archivo WAV/MP3 listo para producción."
            className={`flex-1 w-full p-4 bg-slate-950/60 rounded-lg border text-slate-100 placeholder-slate-600 focus:outline-none resize-none font-sans selection:bg-cyan-900/60 selection:text-white transition-all ${
              currentMode === 'simple'
                ? 'border-slate-800/80 text-base leading-loose font-normal p-6'
                : 'border-slate-800/80 text-[15px] leading-relaxed focus:border-cyan-600/80 focus:ring-1 focus:ring-cyan-500/20'
            }`}
          />

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
            <span>
              Voz: <strong className="text-slate-300">{activeVoice.name}</strong> ({activeVoice.accent})
            </span>
            <span>Atajo: Ctrl+Shift+D</span>
          </div>
        </div>
      </div>

      {/* 5. Synchronized Audio Transport Bar */}
      <div className="border-t border-slate-800 bg-slate-950 px-6 py-3 flex items-center justify-between gap-4 shrink-0 select-none">
        <div className="flex items-center gap-2">
          {playbackState.isPlaying ? (
            <button
              onClick={onStopPreview}
              className="w-9 h-9 rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors shadow-sm"
              title="Detener audio"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onPlayPreview}
              disabled={isProcessing || !cleanText}
              className="w-9 h-9 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 disabled:opacity-40 flex items-center justify-center transition-colors border border-slate-700"
              title="▶ LEER locución neural"
            >
              <Play className="w-4 h-4 ml-0.5" />
            </button>
          )}

          <button
            onClick={onStopPreview}
            disabled={!playbackState.isPlaying}
            className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors border border-slate-800"
            title="Parada"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Waveform / Progress Scrub Bar */}
        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-slate-400 min-w-[36px] text-right">
            {formatTime(playbackState.currentTime)}
          </span>

          <div className="flex-1 h-6 bg-slate-900 rounded border border-slate-800 relative overflow-hidden flex items-center px-1">
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-30 pointer-events-none">
              {Array.from({ length: 48 }).map((_, i) => {
                const height = Math.sin(i * 0.4) * 35 + 45;
                const isPassed = (i / 48) * 100 <= playbackState.progressPercent;
                return (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-[2px] rounded-full ${
                      isPassed ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                  />
                );
              })}
            </div>

            <div
              style={{ width: `${playbackState.progressPercent}%` }}
              className="h-full bg-cyan-600/30 border-r border-cyan-400 transition-all duration-75 relative z-10"
            />
          </div>

          <span className="text-xs font-mono tabular-nums text-slate-500 min-w-[36px]">
            {formatTime(playbackState.duration || estimatedSeconds)}
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>
    </main>
  );
};
