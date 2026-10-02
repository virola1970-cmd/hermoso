/**
 * NEXUS VOICE STUDIO — Main Layout Component
 * Integrates Header (Top Bar), Sidebar (Navigation), StageEditor (Script),
 * and VoiceControlPanel (Settings & LEER Y DESCARGAR).
 * Includes global keyboard shortcut handler (Ctrl+Shift+D).
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Project,
  Scene,
  VoiceProfile,
  ProjectMode,
  AudioFormat,
  Mp3Bitrate,
  WavBitDepth,
  TargetLoudnessPreset,
} from '../../types/nexus';
import { voiceService } from '../../services/voiceService';
import { audioEngine, PlaybackState } from '../../services/audioEngine';
import { storageService } from '../../services/storageService';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StageEditor } from './StageEditor';
import { VoiceControlPanel } from './VoiceControlPanel';
import { ProjectModal } from '../modals/ProjectModal';
import { VoiceCloneModal } from '../modals/VoiceCloneModal';
import { PodcastStudioModal } from '../modals/PodcastStudioModal';

export const MainLayout: React.FC = () => {
  // Application State
  const [project, setProject] = useState<Project>(storageService.getActiveProject());
  const [activeSceneId, setActiveSceneId] = useState<string>(
    storageService.getActiveProject().scenes[0]?.id || ''
  );
  const [currentMode, setCurrentMode] = useState<ProjectMode>('simple');
  const [activeView, setActiveView] = useState<'scenes' | 'characters' | 'assets'>('scenes');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Voices & Audio Engine State
  const [voices, setVoices] = useState<VoiceProfile[]>(voiceService.getAllVoices());
  const [activeVoiceId, setActiveVoiceId] = useState<string>(
    project.scenes[0]?.assignedVoiceId || voiceService.getAllVoices()[0].id
  );
  const [playbackState, setPlaybackState] = useState<PlaybackState>(audioEngine.getState());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [isVoiceCloneModalOpen, setIsVoiceCloneModalOpen] = useState<boolean>(false);
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Subscribe to voices and audio playback updates
  useEffect(() => {
    const unsubVoices = voiceService.subscribe(() => {
      setVoices(voiceService.getAllVoices());
    });
    const unsubAudio = audioEngine.subscribe((st) => {
      setPlaybackState(st);
    });
    const unsubSave = storageService.onAutoSaveStatus((st) => {
      setAutoSaveStatus(st);
    });

    return () => {
      unsubVoices();
      unsubAudio();
      unsubSave();
    };
  }, []);

  // Sync active scene
  const activeScene: Scene =
    project.scenes.find((s) => s.id === activeSceneId) ||
    project.scenes[0] || {
      id: 'default-scene',
      projectId: project.id,
      orderIndex: 0,
      title: '01. Escena Inicial',
      rawText: '',
      segments: [],
      assignedVoiceId: activeVoiceId,
      emotion: 'neutral',
      emotionIntensity: 50,
      intent: 'inform',
      speed: 1.0,
      pitch: 0,
      energy: 60,
      warmth: 60,
      pauseType: 'natural',
      pauseDurationMs: 400,
      updatedAt: new Date().toISOString(),
    };

  // Find active voice profile
  const activeVoice: VoiceProfile =
    voices.find((v) => v.id === activeVoiceId) ||
    voices[0] ||
    voiceService.getAllVoices()[0];

  // Helper to persist scene changes
  const updateCurrentScene = useCallback(
    (partial: Partial<Scene>) => {
      setProject((prevProj) => {
        const updatedScenes = prevProj.scenes.map((sc) => {
          if (sc.id === activeScene.id) {
            return {
              ...sc,
              ...partial,
              updatedAt: new Date().toISOString(),
            };
          }
          return sc;
        });

        const updatedProject = {
          ...prevProj,
          scenes: updatedScenes,
          updatedAt: new Date().toISOString(),
        };

        storageService.saveProject(updatedProject);
        return updatedProject;
      });
    },
    [activeScene.id]
  );

  // Add new scene handler
  const handleAddScene = () => {
    const newScene = storageService.addScene(project.id);
    setProject(storageService.getActiveProject());
    setActiveSceneId(newScene.id);
    setActiveVoiceId(newScene.assignedVoiceId);
  };

  // Switch scene handler
  const handleSelectScene = (sceneId: string) => {
    setActiveSceneId(sceneId);
    const targetScene = project.scenes.find((s) => s.id === sceneId);
    if (targetScene && targetScene.assignedVoiceId) {
      setActiveVoiceId(targetScene.assignedVoiceId);
    }
  };

  // Switch voice handler
  const handleSelectVoice = (voiceId: string) => {
    setActiveVoiceId(voiceId);
    updateCurrentScene({ assignedVoiceId: voiceId });
  };

  // Switch to recommended alternative (when browser voice cannot export)
  const handleSwitchToRecommendedAlternative = () => {
    const alt = voiceService.getRecommendedAlternative(activeVoice);
    if (alt) {
      handleSelectVoice(alt.id);
      setStatusMessage(`Cambiado a ${alt.name} (voz exportable local).`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // LEER (Preview audio)
  const handlePreview = async () => {
    if (!activeScene.rawText.trim()) {
      setStatusMessage('Por favor escribe o pega texto antes de reproducir.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    try {
      setIsProcessing(true);
      await audioEngine.preview(activeScene.rawText, activeVoice, {
        speed: activeScene.speed,
        pitch: activeScene.pitch,
        emotion: activeScene.emotion,
        emotionIntensity: activeScene.emotionIntensity,
        intent: activeScene.intent,
        warmth: activeScene.warmth,
        energy: activeScene.energy,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al reproducir audio';
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  // DESCARGAR (Download audio)
  const handleDownload = async (options: {
    format: AudioFormat;
    bitrate: Mp3Bitrate;
    wavBitDepth: WavBitDepth;
    targetLoudness: TargetLoudnessPreset;
  }) => {
    if (!activeScene.rawText.trim()) {
      setStatusMessage('Por favor escribe o pega texto antes de descargar.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    try {
      setIsProcessing(true);
      const res = await audioEngine.download(activeScene.rawText, activeVoice, {
        format: options.format,
        bitrate: options.bitrate,
        wavBitDepth: options.wavBitDepth,
        projectTitle: project.title,
        speed: activeScene.speed,
        pitch: activeScene.pitch,
        warmth: activeScene.warmth,
        energy: activeScene.energy,
        emotion: activeScene.emotion,
        emotionIntensity: activeScene.emotionIntensity,
        intent: activeScene.intent,
        targetLoudness: options.targetLoudness,
      });
      setStatusMessage(`Descarga iniciada: ${res.filename}`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al descargar audio';
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 4500);
    } finally {
      setIsProcessing(false);
    }
  };

  // LEER Y DESCARGAR (Combined 1-Click Action from Section 12.1)
  const handleReadAndDownload = async (options: {
    format: AudioFormat;
    bitrate: Mp3Bitrate;
    wavBitDepth: WavBitDepth;
    targetLoudness: TargetLoudnessPreset;
  }) => {
    if (!activeScene.rawText.trim()) {
      setStatusMessage('Por favor escribe o pega texto antes de leer y descargar.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    try {
      setIsProcessing(true);
      const res = await audioEngine.readAndDownload(activeScene.rawText, activeVoice, {
        format: options.format,
        bitrate: options.bitrate,
        wavBitDepth: options.wavBitDepth,
        projectTitle: project.title,
        speed: activeScene.speed,
        pitch: activeScene.pitch,
        warmth: activeScene.warmth,
        energy: activeScene.energy,
        emotion: activeScene.emotion,
        emotionIntensity: activeScene.emotionIntensity,
        intent: activeScene.intent,
        targetLoudness: options.targetLoudness,
      });
      setStatusMessage(`Audio sintetizado y guardado: ${res.filename}`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al sintetizar y descargar';
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 4500);
    } finally {
      setIsProcessing(false);
    }
  };

  // Global Keyboard Shortcut: Ctrl+Shift+D triggers LEER Y DESCARGAR
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        if (activeVoice.capabilities.canExportAudio) {
          handleReadAndDownload({
            format: 'wav',
            bitrate: '320k',
            wavBitDepth: '16bit',
            targetLoudness: project.targetLoudness || 'podcast',
          });
        } else {
          handlePreview();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVoice, activeScene, project]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Bar Header */}
      <Header
        currentMode={currentMode}
        onModeChange={(mode) => setCurrentMode(mode)}
        autoSaveStatus={autoSaveStatus}
        onNewProject={() => setIsProjectModalOpen(true)}
        onOpenVoiceCloneModal={() => setIsVoiceCloneModalOpen(true)}
        onOpenPodcastStudioModal={() => setIsPodcastModalOpen(true)}
        onQuickReadAndDownload={() =>
          handleReadAndDownload({
            format: 'wav',
            bitrate: '320k',
            wavBitDepth: '16bit',
            targetLoudness: project.targetLoudness || 'podcast',
          })
        }
        isProcessing={isProcessing}
        canExport={activeVoice.capabilities.canExportAudio}
      />

      {/* Ephemeral Status Banner (if any) */}
      {statusMessage && (
        <div className="bg-cyan-950 border-b border-cyan-800 text-cyan-200 text-xs py-1.5 px-4 flex items-center justify-between z-40 transition-all">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-cyan-400 hover:text-cyan-200 text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Studio Body: Sidebar | Stage | Voice Controls */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Project, Scenes, Characters, Assets, Status */}
        <Sidebar
          project={project}
          activeSceneId={activeScene.id}
          onSelectScene={handleSelectScene}
          onAddScene={handleAddScene}
          onOpenProjectList={() => setIsProjectModalOpen(true)}
          activeView={activeView}
          onViewChange={(v) => setActiveView(v)}
        />

        {/* Center Stage: Script Composition & Waveform Transport */}
        <StageEditor
          scene={activeScene}
          activeVoice={activeVoice}
          playbackState={playbackState}
          currentMode={currentMode}
          allScenes={project.scenes}
          onSelectScene={handleSelectScene}
          onUpdateSceneText={(text) => updateCurrentScene({ rawText: text })}
          onUpdateSceneTitle={(title) => updateCurrentScene({ title })}
          onPlayPreview={handlePreview}
          onStopPreview={() => audioEngine.stop()}
          isProcessing={isProcessing}
        />

        {/* Right Panel: Voice Selection, Emotion, Prosody, LEER Y DESCARGAR */}
        <VoiceControlPanel
          voices={voices}
          activeVoice={activeVoice}
          scene={activeScene}
          currentMode={currentMode}
          onSelectVoice={handleSelectVoice}
          onUpdateSceneSettings={(settings) => updateCurrentScene(settings)}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onReadAndDownload={handleReadAndDownload}
          onSwitchToRecommendedAlternative={handleSwitchToRecommendedAlternative}
          onOpenVoiceCloneModal={() => setIsVoiceCloneModalOpen(true)}
          isProcessing={isProcessing}
          isPlaying={playbackState.isPlaying}
        />
      </div>

      {/* Project Switcher / Creator Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={storageService.getProjects()}
        activeProjectId={project.id}
        onSelectProject={(id) => {
          storageService.setActiveProject(id);
          const p = storageService.getActiveProject();
          setProject(p);
          setActiveSceneId(p.scenes[0]?.id || '');
        }}
        onCreateProject={(title, genre, lang) => {
          const newP = storageService.createProject(title, genre, lang);
          setProject(newP);
          setActiveSceneId(newP.scenes[0]?.id || '');
        }}
      />

      {/* Voice Clone & Custom Voice Creator Modal */}
      <VoiceCloneModal
        isOpen={isVoiceCloneModalOpen}
        onClose={() => setIsVoiceCloneModalOpen(false)}
        onVoiceCreated={(newVoice) => {
          setVoices(voiceService.getAllVoices());
          setActiveVoiceId(newVoice.id);
          updateCurrentScene({ assignedVoiceId: newVoice.id });
          setStatusMessage(`¡Voz clonada integrada con éxito!: ${newVoice.name}`);
          setTimeout(() => setStatusMessage(null), 4000);
        }}
      />

      {/* Podcast Studio Modal */}
      <PodcastStudioModal
        isOpen={isPodcastModalOpen}
        onClose={() => setIsPodcastModalOpen(false)}
        availableVoices={voices}
        activeVoice={activeVoice}
      />
    </div>
  );
};
