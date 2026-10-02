/**
 * NEXUS VOICE STUDIO — Voice Settings & Export Control Panel
 * Adapts dynamically between Modo Simple, Modo Pro, and Modo Director.
 * Offers categorized free Latino, Spanish, and English neural voices.
 */

import React, { useState } from 'react';
import {
  VoiceProfile,
  Scene,
  EmotionType,
  IntentionType,
  AudioFormat,
  Mp3Bitrate,
  WavBitDepth,
  TargetLoudnessPreset,
  PauseType,
  ProjectMode,
} from '../../types/nexus';
import {
  Sparkles,
  Download,
  Play,
  RotateCcw,
  Sliders,
  Heart,
  Target,
  Clock,
  ShieldCheck,
  AlertCircle,
  Volume2,
  SlidersHorizontal,
  Layers,
  Music,
  UserCheck,
} from 'lucide-react';

interface VoiceControlPanelProps {
  voices: VoiceProfile[];
  activeVoice: VoiceProfile;
  scene: Scene;
  currentMode: ProjectMode;
  onSelectVoice: (voiceId: string) => void;
  onUpdateSceneSettings: (settings: Partial<Scene>) => void;
  onPreview: () => void;
  onDownload: (options: {
    format: AudioFormat;
    bitrate: Mp3Bitrate;
    wavBitDepth: WavBitDepth;
    targetLoudness: TargetLoudnessPreset;
  }) => void;
  onReadAndDownload: (options: {
    format: AudioFormat;
    bitrate: Mp3Bitrate;
    wavBitDepth: WavBitDepth;
    targetLoudness: TargetLoudnessPreset;
  }) => void;
  onSwitchToRecommendedAlternative: () => void;
  onOpenVoiceCloneModal?: () => void;
  isProcessing: boolean;
  isPlaying: boolean;
}

// 24 emotions from Masterprompt Section 6
const EMOTIONS_LIST: Array<{ id: EmotionType; label: string; desc: string }> = [
  { id: 'neutral', label: 'Neutral', desc: 'Locución sobria y clara' },
  { id: 'joy', label: 'Alegría', desc: 'Entusiasmo y calidez radiante' },
  { id: 'sadness', label: 'Tristeza', desc: 'Tono grave y pausado' },
  { id: 'hope', label: 'Esperanza', desc: 'Inflexión ascendente luminosa' },
  { id: 'nostalgia', label: 'Nostalgia', desc: 'Evocación melancólica' },
  { id: 'surprise', label: 'Sorpresa', desc: 'Apertura y ritmo repentino' },
  { id: 'curiosity', label: 'Curiosidad', desc: 'Acento inquisitivo' },
  { id: 'tension', label: 'Tensión', desc: 'Gravedad suspendida y suspenso' },
  { id: 'controlled_fear', label: 'Miedo Controlado', desc: 'Respiración contenida' },
  { id: 'wonder', label: 'Asombro', desc: 'Reverencia ante lo extraordinario' },
  { id: 'admiration', label: 'Admiración', desc: 'Tono elogioso y cálido' },
  { id: 'compassion', label: 'Compasión', desc: 'Ternura empática' },
  { id: 'love', label: 'Amor', desc: 'Resonancia profunda' },
  { id: 'tenderness', label: 'Ternura', desc: 'Delicadeza íntima' },
  { id: 'serenity', label: 'Serenidad', desc: 'Flujo continuo sin sobresaltos' },
  { id: 'solemnity', label: 'Solemnidad', desc: 'Gravedad histórica o sagrada' },
  { id: 'determination', label: 'Determinación', desc: 'Ataque frontal firme' },
  { id: 'urgency', label: 'Urgencia', desc: 'Aceleración y alarma' },
  { id: 'mystery', label: 'Misterio', desc: 'Cadencia baja e intrigante' },
  { id: 'confidence', label: 'Confianza', desc: 'Solidez y convicción' },
  { id: 'authority', label: 'Autoridad', desc: 'Comando firme e imperativo' },
  { id: 'inspiration', label: 'Inspiración', desc: 'Crecimiento de energía lírica' },
  { id: 'reflection', label: 'Reflexión', desc: 'Introspección reflexiva' },
  { id: 'gratitude', label: 'Gratitud', desc: 'Agradecimiento honesto' },
];

// 19 narrative intentions from Masterprompt Section 6
const INTENTIONS_LIST: Array<{ id: IntentionType; label: string }> = [
  { id: 'inform', label: 'Informar (Noticias y Hechos)' },
  { id: 'teach', label: 'Enseñar (Pedagógico)' },
  { id: 'convince', label: 'Convencer (Retórico)' },
  { id: 'explain', label: 'Explicar (Paso a paso)' },
  { id: 'reveal', label: 'Revelar (Secretos y Clímax)' },
  { id: 'warn', label: 'Advertir (Preventivo)' },
  { id: 'move_emotion', label: 'Emocionar (Dramático)' },
  { id: 'inspire', label: 'Inspirar (Motivacional)' },
  { id: 'reassure', label: 'Tranquilizar (Calma)' },
  { id: 'accompany', label: 'Acompañar (Íntimo)' },
  { id: 'entertain', label: 'Entretener (Dinámico)' },
  { id: 'investigate', label: 'Investigar (Pesquisa)' },
  { id: 'question', label: 'Cuestionar (Duda)' },
  { id: 'present', label: 'Presentar (Apertura)' },
  { id: 'conclude', label: 'Concluir (Cierre)' },
  { id: 'surprise', label: 'Sorprender (Impacto)' },
  { id: 'create_expectation', label: 'Crear Expectativa (Suspenso)' },
  { id: 'spark_curiosity', label: 'Generar Curiosidad (Enigma)' },
  { id: 'provoke_thought', label: 'Provocar Reflexión (Filosófico)' },
];

const PAUSE_TYPES: Array<{ id: PauseType; label: string; ms: number }> = [
  { id: 'micro', label: 'Micro (150ms)', ms: 150 },
  { id: 'natural', label: 'Natural (400ms)', ms: 400 },
  { id: 'thought', label: 'Pensamiento (600ms)', ms: 600 },
  { id: 'dramatic', label: 'Dramática (850ms)', ms: 850 },
  { id: 'emotional', label: 'Emocional (750ms)', ms: 750 },
  { id: 'revelation', label: 'Revelación (900ms)', ms: 900 },
  { id: 'transition', label: 'Transición (1000ms)', ms: 1000 },
  { id: 'paragraph', label: 'Párrafo (1200ms)', ms: 1200 },
];

export const VoiceControlPanel: React.FC<VoiceControlPanelProps> = ({
  voices,
  activeVoice,
  scene,
  currentMode,
  onSelectVoice,
  onUpdateSceneSettings,
  onPreview,
  onDownload,
  onReadAndDownload,
  onSwitchToRecommendedAlternative,
  onOpenVoiceCloneModal,
  isProcessing,
  isPlaying,
}) => {
  const [format, setFormat] = useState<AudioFormat>('wav');
  const [bitrate, setBitrate] = useState<Mp3Bitrate>('320k');
  const [wavDepth, setWavDepth] = useState<WavBitDepth>('16bit');
  const [loudness, setLoudness] = useState<TargetLoudnessPreset>('podcast');
  const [duckingDb, setDuckingDb] = useState<number>(-12);

  const canExport = activeVoice.capabilities.canExportAudio;

  const handleDownloadClick = () => {
    onDownload({ format, bitrate, wavBitDepth: wavDepth, targetLoudness: loudness });
  };

  const handleReadAndDownloadClick = () => {
    onReadAndDownload({ format, bitrate, wavBitDepth: wavDepth, targetLoudness: loudness });
  };

  const handleResetProsody = () => {
    onUpdateSceneSettings({
      speed: activeVoice.defaultSpeed || 1.0,
      pitch: activeVoice.defaultPitch || 0,
      warmth: 60,
      energy: 65,
      emotion: 'neutral',
      emotionIntensity: 50,
      intent: 'inform',
    });
  };

  return (
    <aside className="w-80 border-l border-slate-800/80 bg-slate-950/80 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            {currentMode === 'simple' && 'Cabina de Locución Simple'}
            {currentMode === 'pro' && 'Escultura Vocal Pro'}
            {currentMode === 'director' && 'Consola de Dirección'}
          </span>
          <button
            onClick={handleResetProsody}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            title="Restablecer valores"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Voice Selector with Grouped Free Neural Voices */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
            <span>Voz Activa</span>
            <span className="text-[10px] text-cyan-400 font-mono">Neural HD</span>
          </label>
          <select
            value={activeVoice.id}
            onChange={(e) => onSelectVoice(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {voices.some((v) => v.provider === 'custom' || v.isCloned) && (
              <optgroup label="🌟 Mis Voces Clonadas / Propias">
                {voices
                  .filter((v) => v.provider === 'custom' || v.isCloned)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </optgroup>
            )}
            <optgroup label="🇲🇽 🇨🇴 🇦🇷 🇵🇪 Voces Latinoamericanas (Gratis)">
              {voices
                .filter((v) => v.tags.includes('#latino'))
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="🇪🇸 Voces de España (Gratis)">
              {voices
                .filter((v) => v.tags.includes('#espana'))
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="🇺🇸 🇬🇧 Voces en Inglés (Gratis)">
              {voices
                .filter((v) => v.tags.includes('#english'))
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </optgroup>
            {voices.some((v) => v.provider === 'browser') && (
              <optgroup label="Voces del Sistema (Solo Previsualización)">
                {voices
                  .filter((v) => v.provider === 'browser')
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>

          {/* Voice details */}
          <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-800/80 space-y-0.5">
            <div className="text-slate-300 font-medium">{activeVoice.style}</div>
            <div className="text-slate-500 text-[10px]">{activeVoice.description}</div>
            <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-400 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Uso comercial permitido
              </span>
              <span className="text-slate-500">{activeVoice.accent}</span>
            </div>
          </div>

          {onOpenVoiceCloneModal && (
            <button
              onClick={onOpenVoiceCloneModal}
              className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Clonar mi Voz con Micrófono</span>
            </button>
          )}
        </div>

        {/* 2. LEER Y DESCARGAR MASTER CORE (Section 12.1) */}
        <div className="p-3 bg-gradient-to-b from-slate-900/90 to-slate-950 rounded-lg border border-cyan-800/40 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              LEER Y DESCARGAR
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1 Clic</span>
          </div>

          {/* Format selection (Hidden in simple mode, defaults to WAV) */}
          {currentMode !== 'simple' ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Formato</span>
                <div className="flex rounded border border-slate-700 bg-slate-900 p-0.5">
                  <button
                    onClick={() => setFormat('wav')}
                    className={`flex-1 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                      format === 'wav'
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    WAV
                  </button>
                  <button
                    onClick={() => setFormat('mp3')}
                    className={`flex-1 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                      format === 'mp3'
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    MP3
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">
                  {format === 'wav' ? 'Profundidad' : 'Bitrate'}
                </span>
                {format === 'wav' ? (
                  <select
                    value={wavDepth}
                    onChange={(e) => setWavDepth(e.target.value as WavBitDepth)}
                    className="w-full bg-slate-900 border border-slate-700 rounded py-1 px-1.5 text-xs text-slate-200 font-mono"
                  >
                    <option value="16bit">16-bit PCM (Estudio)</option>
                    <option value="24bit">24-bit PCM (Master)</option>
                  </select>
                ) : (
                  <select
                    value={bitrate}
                    onChange={(e) => setBitrate(e.target.value as Mp3Bitrate)}
                    className="w-full bg-slate-900 border border-slate-700 rounded py-1 px-1.5 text-xs text-slate-200 font-mono"
                  >
                    <option value="128k">128 kbps</option>
                    <option value="192k">192 kbps</option>
                    <option value="256k">256 kbps</option>
                    <option value="320k">320 kbps (HQ)</option>
                  </select>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Formato de descarga:</span>
              <span className="font-mono text-cyan-400 font-semibold">WAV 16-bit Studio</span>
            </div>
          )}

          {/* Master Button: LEER Y DESCARGAR */}
          <button
            onClick={handleReadAndDownloadClick}
            disabled={isProcessing || !canExport}
            className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
              canExport
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
            }`}
            title="Genera, reproduce y descarga el archivo con la voz natural en un solo clic (Ctrl+Shift+D)"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>LEER Y DESCARGAR</span>
          </button>

          {/* Individual Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={onPreview}
              disabled={isProcessing}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3 h-3 ml-0.5" />
              <span>▶ LEER</span>
            </button>
            <button
              onClick={handleDownloadClick}
              disabled={isProcessing || !canExport}
              className={`py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border ${
                canExport
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-600'
                  : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
              }`}
            >
              <Download className="w-3 h-3" />
              <span>⬇ DESCARGAR</span>
            </button>
          </div>
        </div>

        {/* 3. PRO & DIRECTOR CONTROLS: 24 EMOTIONS & 19 INTENTIONS */}
        {currentMode !== 'simple' && (
          <div className="space-y-3 pt-2 border-t border-slate-800/60">
            {/* Emotion */}
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-violet-400" />
                  Emoción ({EMOTIONS_LIST.length})
                </span>
                <span className="text-[11px] text-cyan-400 font-mono tabular-nums">
                  {scene.emotionIntensity}%
                </span>
              </label>
              <select
                value={scene.emotion}
                onChange={(e) =>
                  onUpdateSceneSettings({ emotion: e.target.value as EmotionType })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 capitalize focus:outline-none focus:border-cyan-500"
              >
                {EMOTIONS_LIST.map((emo) => (
                  <option key={emo.id} value={emo.id}>
                    {emo.label} — {emo.desc}
                  </option>
                ))}
              </select>

              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  value={scene.emotionIntensity}
                  onChange={(e) =>
                    onUpdateSceneSettings({ emotionIntensity: parseInt(e.target.value) })
                  }
                  className="w-full accent-violet-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Narrative Intention */}
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Intención Narrativa
              </label>
              <select
                value={scene.intent}
                onChange={(e) =>
                  onUpdateSceneSettings({ intent: e.target.value as IntentionType })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {INTENTIONS_LIST.map((int) => (
                  <option key={int.id} value={int.id}>
                    {int.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 4. SPEED & PROSODY CONTROLS */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="text-xs font-medium text-slate-400">
            {currentMode === 'simple' ? 'VELOCIDAD DE LECTURA' : 'PROSODIA Y CADENCIA'}
          </div>

          {/* Speed slider (Visible in all modes) */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Velocidad</span>
              <span className="font-mono tabular-nums text-cyan-400">
                {scene.speed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.02"
              value={scene.speed}
              onChange={(e) => onUpdateSceneSettings({ speed: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* Advanced Pitch & Human Pause (Hidden in simple mode) */}
          {currentMode !== 'simple' && (
            <>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Tono Base (Semitonos)</span>
                  <span className="font-mono tabular-nums text-cyan-400">
                    {scene.pitch > 0 ? `+${scene.pitch}` : scene.pitch}st
                  </span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={scene.pitch}
                  onChange={(e) => onUpdateSceneSettings({ pitch: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Human Pause Engine
                </label>
                <select
                  value={scene.pauseType}
                  onChange={(e) => {
                    const found = PAUSE_TYPES.find((p) => p.id === e.target.value);
                    onUpdateSceneSettings({
                      pauseType: e.target.value as PauseType,
                      pauseDurationMs: found?.ms || 400,
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                >
                  {PAUSE_TYPES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* 5. DIRECTOR CONSOLE CONTROLS (Only visible in Modo Director) */}
        {currentMode === 'director' && (
          <div className="space-y-3 pt-2 border-t border-violet-900/60 bg-violet-950/20 p-2.5 rounded-lg border">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span>CONTROL DE MEZCLA Y DUCKING</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Music className="w-3 h-3 text-violet-400" />
                  Auto-Ducking de Música
                </span>
                <span className="font-mono tabular-nums text-violet-300">{duckingDb} dB</span>
              </div>
              <input
                type="range"
                min="-24"
                max="-3"
                step="1"
                value={duckingDb}
                onChange={(e) => setDuckingDb(parseInt(e.target.value))}
                className="w-full accent-violet-500 h-1 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Atenuación automática del fondo musical al hablar la voz.
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Objetivo Loudness Master</span>
              <select
                value={loudness}
                onChange={(e) => setLoudness(e.target.value as TargetLoudnessPreset)}
                className="w-full bg-slate-900 border border-slate-700 rounded py-1 px-2 text-xs text-slate-200"
              >
                <option value="podcast">Podcast (≈ −16 LUFS, −1 dBTP)</option>
                <option value="youtube">YouTube / Video (≈ −14 LUFS, −1 dBTP)</option>
                <option value="audiobook">Audiolibro ACX (RMS −20 dB, −3 dBTP)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
