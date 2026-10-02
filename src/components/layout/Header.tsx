/**
 * NEXUS VOICE STUDIO — Top Bar Component
 * Implements strict Top Bar Contract (Wordmark — 4 Nav links — Actions)
 * Anti-slop, zero-pill, single-line controls with WCAG AA compliance.
 */

import React from 'react';
import { ProjectMode } from '../../types/nexus';
import { Play, Download, Sparkles, FolderPlus, CheckCircle2, RefreshCw, Mic, Radio } from 'lucide-react';

interface HeaderProps {
  currentMode: ProjectMode;
  onModeChange: (mode: ProjectMode) => void;
  autoSaveStatus: 'saved' | 'saving' | 'error';
  onNewProject: () => void;
  onQuickReadAndDownload: () => void;
  onOpenVoiceCloneModal?: () => void;
  onOpenPodcastStudioModal?: () => void;
  isProcessing: boolean;
  canExport: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  autoSaveStatus,
  onNewProject,
  onQuickReadAndDownload,
  onOpenVoiceCloneModal,
  onOpenPodcastStudioModal,
  isProcessing,
  canExport,
}) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/95 px-5 flex items-center justify-between select-none z-30 shrink-0 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.35)]">
            <span className="font-mono font-bold text-xs text-black">Ω</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
            NEXUS Voice Studio
          </span>
        </a>

        {/* Clean unboxed autosave indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 ml-3">
          <span aria-hidden="true">·</span>
          {autoSaveStatus === 'saving' ? (
            <span className="flex items-center gap-1 text-cyan-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Guardando
            </span>
          ) : autoSaveStatus === 'saved' ? (
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Guardado local
            </span>
          ) : (
            <span className="text-amber-400">Error guardado</span>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links / Studio Modes */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-md border border-slate-800">
        <button
          onClick={() => onModeChange('simple')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            currentMode === 'simple'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Modo Simple: Texto, Voz, Reproducción y Descarga rápida"
        >
          Modo Simple
        </button>
        <button
          onClick={() => onModeChange('pro')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            currentMode === 'pro'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Modo Pro: Control de emociones, intenciones, prosodia y pausas humanas"
        >
          Modo Pro
        </button>
        <button
          onClick={() => onModeChange('director')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            currentMode === 'director'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Modo Director: Escenas, personajes, arco dramático y mezcla"
        >
          Modo Director
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        {onOpenVoiceCloneModal && (
          <button
            onClick={onOpenVoiceCloneModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 rounded transition-colors whitespace-nowrap shadow-sm"
            title="Grabar o subir muestra de voz para clonar tu voz propia"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Clonar Voz</span>
          </button>
        )}

        {onOpenPodcastStudioModal && (
          <button
            onClick={onOpenPodcastStudioModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/80 rounded transition-colors whitespace-nowrap shadow-sm"
            title="Crear podcast conversacional multi-voz con auto-ducking"
          >
            <Radio className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Crear Podcast</span>
          </button>
        )}

        <button
          onClick={onNewProject}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors whitespace-nowrap"
          title="Crear un nuevo proyecto de narración"
        >
          <FolderPlus className="w-3.5 h-3.5 text-slate-400" />
          <span>Nuevo Proyecto</span>
        </button>

        {/* Instant LEER Y DESCARGAR CTA */}
        <button
          onClick={onQuickReadAndDownload}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded transition-all whitespace-nowrap shadow-sm ${
            canExport
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_14px_rgba(6,182,212,0.35)]'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
          title={
            canExport
              ? 'Atajo rápido: Lee y descarga el audio actual (Ctrl+Shift+D)'
              : 'La voz seleccionada solo permite previsualización (Web Speech API)'
          }
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sintetizando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Leer y Descargar</span>
              <kbd className="hidden lg:inline text-[10px] font-mono bg-black/30 px-1 rounded ml-1 text-cyan-200">
                Ctrl+⇧+D
              </kbd>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
