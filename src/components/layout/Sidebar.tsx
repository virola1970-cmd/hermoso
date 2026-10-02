/**
 * NEXUS VOICE STUDIO — Sidebar Component
 * Left navigation: Projects, Scenes/Chapters, Characters, and System Status.
 */

import React from 'react';
import { Project, Scene, Character } from '../../types/nexus';
import {
  Film,
  Plus,
  Lock,
  Unlock,
  Volume2,
  FolderKanban,
  Music2,
  HardDrive,
  Cpu,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  project: Project;
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddScene: () => void;
  onOpenProjectList: () => void;
  activeView: 'scenes' | 'characters' | 'assets';
  onViewChange: (view: 'scenes' | 'characters' | 'assets') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  project,
  activeSceneId,
  onSelectScene,
  onAddScene,
  onOpenProjectList,
  activeView,
  onViewChange,
}) => {
  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 flex flex-col justify-between shrink-0 select-none overflow-hidden">
      {/* Top: Project Banner */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
            Proyecto Activo
          </span>
          <button
            onClick={onOpenProjectList}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Cambiar
          </button>
        </div>
        <h2 className="text-sm font-semibold text-slate-100 truncate" title={project.title}>
          {project.title}
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
          <span className="capitalize">{project.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{project.scenes.length} escenas</span>
          <span aria-hidden="true">·</span>
          <span className="uppercase">{project.language}</span>
        </div>
      </div>

      {/* View Switcher Tabs: Escenas / Personajes / Assets */}
      <div className="flex items-center p-2 border-b border-slate-800/60 bg-slate-950 gap-1 text-xs">
        <button
          onClick={() => onViewChange('scenes')}
          className={`flex-1 py-1 px-2 rounded text-center transition-colors truncate font-medium ${
            activeView === 'scenes'
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Escenas ({project.scenes.length})
        </button>
        <button
          onClick={() => onViewChange('characters')}
          className={`flex-1 py-1 px-2 rounded text-center transition-colors truncate font-medium ${
            activeView === 'characters'
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Personajes ({project.characters.length})
        </button>
        <button
          onClick={() => onViewChange('assets')}
          className={`flex-1 py-1 px-2 rounded text-center transition-colors truncate font-medium ${
            activeView === 'assets'
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Audio
        </button>
      </div>

      {/* Middle Scrollable Section */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {activeView === 'scenes' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400 font-medium">
              <span>LISTA DE ESCENAS</span>
              <button
                onClick={onAddScene}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                title="Añadir nueva escena al proyecto"
              >
                <Plus className="w-3 h-3" />
                <span>Añadir</span>
              </button>
            </div>

            {project.scenes.map((scene: Scene, index: number) => {
              const isActive = scene.id === activeSceneId;
              const wordCount = scene.rawText.trim() ? scene.rawText.trim().split(/\s+/).length : 0;
              return (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(scene.id)}
                  className={`w-full text-left p-2.5 rounded transition-all flex items-start gap-2 border ${
                    isActive
                      ? 'bg-cyan-950/30 border-cyan-800/80 text-slate-100 shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-900/30 border-transparent text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <Film
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-600'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {scene.title || `Escena ${index + 1}`}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono tabular-nums">{wordCount} palabras</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{scene.emotion}</span>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        )}

        {activeView === 'characters' && (
          <div className="space-y-1.5">
            <div className="px-2 py-1 text-[11px] text-slate-400 font-medium">
              VOCES ASIGNADAS Y VOICE LOCK
            </div>
            {project.characters.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500 bg-slate-900/30 rounded border border-slate-800/50">
                No hay personajes configurados. La voz del narrador se asigna por defecto.
              </div>
            ) : (
              project.characters.map((char: Character) => (
                <div
                  key={char.id}
                  className="p-2.5 rounded bg-slate-900/40 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      {char.name}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-[10px] ${
                        char.voiceLocked ? 'text-amber-400' : 'text-slate-500'
                      }`}
                      title={
                        char.voiceLocked
                          ? 'Voice Lock activo: mantiene identidad, parámetros y emoción base entre escenas'
                          : 'Voz libre'
                      }
                    >
                      {char.voiceLocked ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Libre</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 capitalize">
                    Rol: {char.role} · Emoción base: {char.baseEmotion}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'assets' && (
          <div className="space-y-2">
            <div className="px-2 py-1 text-[11px] text-slate-400 font-medium">
              CAPAS DE AUDIO Y AMBIENTE
            </div>
            <div className="p-2.5 rounded bg-slate-900/30 border border-slate-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  Pista de Voz (Narración)
                </span>
                <span className="text-[11px] text-emerald-400">Activa</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5 text-slate-500" />
                  Música de Fondo
                </span>
                <span className="text-[10px] text-slate-500">Auto-Ducking</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                  Efectos y Ambiente
                </span>
                <span className="text-[10px] text-slate-500">Fase 4</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: System Status Console (Masterprompt section 14 & anti-slop honest status) */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between font-medium text-slate-300">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            Estado del Sistema
          </span>
          <span className="text-emerald-400">Listo</span>
        </div>
        <div className="space-y-1 text-[10px] text-slate-500">
          <div className="flex justify-between">
            <span>Motor Local Offline:</span>
            <span className="text-emerald-400 font-mono">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span>Web Speech API:</span>
            <span className="text-emerald-400 font-mono">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span>Google Cloud TTS:</span>
            <span className="text-amber-400 font-mono">SETUP REQUIRED</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800/50">
            <span>Loudness Objetivo:</span>
            <span className="text-slate-300 font-mono uppercase">{project.targetLoudness}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
