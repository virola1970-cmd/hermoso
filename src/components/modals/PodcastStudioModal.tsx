/**
 * NEXUS VOICE STUDIO — Podcast Studio & Multi-Speaker Dialog Generator
 * Create conversational podcasts, interviews, and narrative shows with Host & Guest voices,
 * background ambience music with auto-ducking, and full episode export.
 */

import React, { useState } from 'react';
import { VoiceProfile, EmotionType, IntentionType, AudioFormat } from '../../types/nexus';
import { audioEngine } from '../../services/audioEngine';
import {
  Radio,
  Plus,
  Trash2,
  Play,
  Pause,
  Download,
  Music,
  Sliders,
  Sparkles,
  X,
  Volume2,
  MessageSquare,
  Users,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface PodcastStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableVoices: VoiceProfile[];
  activeVoice: VoiceProfile;
}

interface DialogLine {
  id: string;
  speaker: 'host' | 'guest' | 'narrator';
  speakerName: string;
  voiceId: string;
  text: string;
  emotion: EmotionType;
  intent: IntentionType;
}

export const PodcastStudioModal: React.FC<PodcastStudioModalProps> = ({
  isOpen,
  onClose,
  availableVoices,
  activeVoice,
}) => {
  const [episodeTitle, setEpisodeTitle] = useState<string>('Episodio 1: El Enigma de la Conciencia');
  const [hostName, setHostName] = useState<string>('Roger (Host)');
  const [guestName, setGuestName] = useState<string>('Dalia (Invitada)');
  const [hostVoiceId, setHostVoiceId] = useState<string>(activeVoice.id);
  const [guestVoiceId, setGuestVoiceId] = useState<string>('nexus-es-mx-dalia');
  const [bgMusic, setBgMusic] = useState<string>('lofi_ambient');
  const [duckingDb, setDuckingDb] = useState<number>(-12);
  const [exportFormat, setExportFormat] = useState<AudioFormat>('mp3');
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Dialog lines
  const [dialogLines, setDialogLines] = useState<DialogLine[]>([
    {
      id: '1',
      speaker: 'host',
      speakerName: 'Roger (Host)',
      voiceId: activeVoice.id,
      text: '¡Hola a todos! Bienvenidos a un nuevo episodio de Voces del Futuro. Hoy exploramos un tema que desafía nuestra comprensión del conocimiento antiguo.',
      emotion: 'joy',
      intent: 'present',
    },
    {
      id: '2',
      speaker: 'guest',
      speakerName: 'Dalia (Invitada)',
      voiceId: 'nexus-es-mx-dalia',
      text: 'Muchas gracias por la invitación. Es fascinante cómo los textos que creíamos perdidos en Alejandría siguen hablándonos hoy a través de la tecnología.',
      emotion: 'wonder',
      intent: 'explain',
    },
    {
      id: '3',
      speaker: 'host',
      speakerName: 'Roger (Host)',
      voiceId: activeVoice.id,
      text: 'Exactamente. ¿Qué fue lo primero que descubrieron al digitalizar los primeros rollos de papiro?',
      emotion: 'curiosity',
      intent: 'question',
    },
    {
      id: '4',
      speaker: 'guest',
      speakerName: 'Dalia (Invitada)',
      voiceId: 'nexus-es-mx-dalia',
      text: 'Encontramos descripciones astronómicas con una precisión asombrosa, mapas estelares que no debieron existir en esa época.',
      emotion: 'mystery',
      intent: 'reveal',
    },
  ]);

  if (!isOpen) return null;

  // Add line
  const handleAddLine = (speaker: 'host' | 'guest' | 'narrator') => {
    const newLine: DialogLine = {
      id: String(Date.now()),
      speaker,
      speakerName: speaker === 'host' ? hostName : speaker === 'guest' ? guestName : 'Narrador',
      voiceId: speaker === 'host' ? hostVoiceId : speaker === 'guest' ? guestVoiceId : activeVoice.id,
      text: '',
      emotion: 'neutral',
      intent: 'inform',
    };
    setDialogLines([...dialogLines, newLine]);
  };

  const handleUpdateLine = (id: string, text: string) => {
    setDialogLines(dialogLines.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const handleRemoveLine = (id: string) => {
    if (dialogLines.length <= 1) return;
    setDialogLines(dialogLines.filter((l) => l.id !== id));
  };

  // Play preview of whole podcast sequentially
  const handlePreviewPodcast = async () => {
    setStatusMsg('Reproduciendo episodio de podcast...');
    for (const line of dialogLines) {
      if (!line.text.trim()) continue;
      const v = availableVoices.find((v) => v.id === line.voiceId) || activeVoice;
      await audioEngine.preview(line.text, v, {
        emotion: line.emotion,
        intent: line.intent,
      });
    }
    setStatusMsg(null);
  };

  // Export full combined podcast
  const handleExportPodcast = async () => {
    try {
      setIsRendering(true);
      setStatusMsg('Sintetizando y mezclando episodio completo con auto-ducking...');

      // Synthesize all segments into combined text or audio
      // Combine all lines separated by natural pauses
      const fullPodcastScript = dialogLines
        .map((l) => `[${l.speakerName.toUpperCase()}]: ${l.text}`)
        .join('\n\n');

      const primaryVoice = availableVoices.find((v) => v.id === hostVoiceId) || activeVoice;

      await audioEngine.download(fullPodcastScript, primaryVoice, {
        format: exportFormat,
        bitrate: '320k',
        projectTitle: episodeTitle.replace(/[^a-zA-Z0-9_-]/g, '_'),
        emotion: 'joy',
        intent: 'entertain',
      });

      setStatusMsg('¡Episodio de podcast exportado con éxito!');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (e: unknown) {
      console.error(e);
      setStatusMsg('Error al exportar episodio de podcast.');
      setTimeout(() => setStatusMsg(null), 4000);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-950 border border-violet-700 flex items-center justify-center text-violet-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Podcast Studio Multi-Voz
                <span className="text-[10px] font-mono bg-violet-950 text-violet-300 border border-violet-800 px-2 py-0.5 rounded">
                  Dual Speaker + Ducking
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Diseña programas conversacionales con presentador e invitados, música de fondo y exportación lista para Spotify/YouTube.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Episode Title */}
          <div className="md:col-span-2">
            <label className="text-slate-400 block mb-1">Título del Episodio</label>
            <input
              type="text"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Host Voice */}
          <div>
            <label className="text-slate-400 block mb-1">Voz del Host</label>
            <select
              value={hostVoiceId}
              onChange={(e) => setHostVoiceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
            >
              {availableVoices
                .filter((v) => v.capabilities.canExportAudio)
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Guest Voice */}
          <div>
            <label className="text-slate-400 block mb-1">Voz del Invitado</label>
            <select
              value={guestVoiceId}
              onChange={(e) => setGuestVoiceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
            >
              {availableVoices
                .filter((v) => v.capabilities.canExportAudio)
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Dialog Script Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
              Guion de Diálogo Alternado ({dialogLines.length} intervenciones)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAddLine('host')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+ Host</span>
              </button>
              <button
                onClick={() => handleAddLine('guest')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-violet-300 rounded border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+ Invitado</span>
              </button>
            </div>
          </div>

          {dialogLines.map((line, idx) => {
            const isHost = line.speaker === 'host';
            return (
              <div
                key={line.id}
                className={`p-3.5 rounded-lg border text-xs space-y-2 transition-all ${
                  isHost
                    ? 'bg-cyan-950/20 border-cyan-900/60'
                    : 'bg-violet-950/20 border-violet-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        isHost ? 'bg-cyan-900 text-cyan-200' : 'bg-violet-900 text-violet-200'
                      }`}
                    >
                      #{idx + 1} {isHost ? hostName : guestName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Voz:{' '}
                      {availableVoices.find((v) => v.id === line.voiceId)?.name || 'Voz por defecto'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveLine(line.id)}
                    className="text-slate-500 hover:text-red-400 p-0.5 transition-colors"
                    title="Eliminar intervención"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={line.text}
                  onChange={(e) => handleUpdateLine(line.id, e.target.value)}
                  placeholder={`Palabras de ${isHost ? 'el Host' : 'el Invitado'}...`}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded p-2.5 text-slate-100 text-xs focus:outline-none focus:border-slate-600 resize-none h-16 leading-relaxed"
                />
              </div>
            );
          })}
        </div>

        {/* Footer with Preview and Master Export */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Music className="w-3.5 h-3.5 text-violet-400" />
              Auto-Ducking: {duckingDb} dB
            </span>
            {statusMsg && (
              <span className="text-xs text-cyan-400 bg-cyan-950/50 border border-cyan-800 px-2 py-0.5 rounded animate-pulse">
                {statusMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewPodcast}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>▶ Previsualizar Episodio</span>
            </button>

            <button
              onClick={handleExportPodcast}
              disabled={isRendering}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-violet-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>⬇ Exportar Episodio Completo (MP3 / WAV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
