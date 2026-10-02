/**
 * NEXUS VOICE STUDIO — Storage & Project Repository
 * Manages projects, scenes, versioned migrations (schemaVersion: 1),
 * autosave status, and default demo project.
 */

import { Project, Scene } from '../types/nexus';
import { BUILTIN_LOCAL_VOICES } from './voiceService';

const STORAGE_KEY_PROJECTS = 'nexus_voice_projects_v1';
const STORAGE_KEY_ACTIVE_PROJECT_ID = 'nexus_voice_active_project_id';

export const DEMO_PROJECT: Project = {
  id: 'nexus-demo-lost-archive',
  schemaVersion: 1,
  title: 'El Archivo Perdido de Alejandría',
  description: 'Documental de investigación histórica sobre los códices olvidados en las arenas del Mediterráneo.',
  genre: 'documentary',
  language: 'es',
  targetLoudness: 'podcast',
  defaultVoiceId: BUILTIN_LOCAL_VOICES[0].id,
  characters: [
    {
      id: 'char-narrator-solemn',
      projectId: 'nexus-demo-lost-archive',
      name: 'Narrador Principal',
      role: 'narrator',
      voiceId: BUILTIN_LOCAL_VOICES[0].id,
      baseEmotion: 'mystery',
      speed: 0.95,
      pitch: -1,
      energy: 65,
      warmth: 75,
      voiceLocked: true,
      notes: 'Cadencia pausada, tono solemne y misterio contenido.',
    },
    {
      id: 'char-scholar',
      projectId: 'nexus-demo-lost-archive',
      name: 'Dra. Miriam Al-Hassan',
      role: 'expert',
      voiceId: BUILTIN_LOCAL_VOICES[1].id,
      baseEmotion: 'curiosity',
      speed: 1.02,
      pitch: 1,
      energy: 70,
      warmth: 60,
      voiceLocked: true,
      notes: 'Investigadora jefa de paleografía.',
    },
  ],
  pronunciationDictionary: [
    { original: 'Ptolomeo', spoken: 'Tolomeo', scope: 'project' },
    { original: 'Serapio', spoken: 'Se-ra-pion', scope: 'project' },
  ],
  createdAt: '2026-10-02T07:00:00.000Z',
  updatedAt: '2026-10-02T07:12:00.000Z',
  scenes: [
    {
      id: 'scene-01-intro',
      projectId: 'nexus-demo-lost-archive',
      orderIndex: 0,
      title: '01. Las Cenizas del Gran Museo',
      rawText:
        'La ciudad parecía completamente sumergida en el silencio de los siglos. Bajo tres metros de lodo calcáreo y arena del delta, los arqueólogos hallaron un cilindro de bronce sellado con resina de cedro. Al abrirlo, el olor a papiro seco reveló palabras que no debían haber sobrevivido al fuego del año 48 antes de Cristo.',
      segments: [
        {
          segmentId: 's01-01',
          text: 'La ciudad parecía completamente sumergida en el silencio de los siglos.',
          speaker: 'Narrador Principal',
          type: 'description',
          intent: 'spark_curiosity',
          emotion: { name: 'mystery', intensity: 75 },
          pace: 'slow',
          emphasis: [{ span: 'completamente sumergida', level: 'normal' }],
          pauseAfter: { type: 'dramatic', ms: 700 },
          lockedText: false,
        },
      ],
      assignedVoiceId: BUILTIN_LOCAL_VOICES[0].id,
      assignedCharacterId: 'char-narrator-solemn',
      emotion: 'mystery',
      emotionIntensity: 75,
      intent: 'spark_curiosity',
      speed: 0.95,
      pitch: -1,
      energy: 65,
      warmth: 75,
      pauseType: 'dramatic',
      pauseDurationMs: 600,
      updatedAt: '2026-10-02T07:12:00.000Z',
    },
    {
      id: 'scene-02-discovery',
      projectId: 'nexus-demo-lost-archive',
      orderIndex: 1,
      title: '02. El Códice de las Estrellas',
      rawText:
        'No era un inventario mercantil ni un decreto imperial. Era el catálogo de cartas estelares atribuido a Hiparco de Nicea, perdido durante dos mil años. Cada coordenada astronómica anotada a mano desafiaba la cronología oficial del conocimiento astronómico antiguo.',
      segments: [],
      assignedVoiceId: BUILTIN_LOCAL_VOICES[1].id,
      assignedCharacterId: 'char-scholar',
      emotion: 'wonder',
      emotionIntensity: 60,
      intent: 'reveal',
      speed: 1.0,
      pitch: 0,
      energy: 70,
      warmth: 65,
      pauseType: 'natural',
      pauseDurationMs: 450,
      updatedAt: '2026-10-02T07:12:00.000Z',
    },
  ],
};

class StorageService {
  private projects: Project[] = [];
  private activeProjectId: string = DEMO_PROJECT.id;
  private autoSaveListeners: Array<(status: 'saved' | 'saving' | 'error') => void> = [];
  private saveTimeout: number | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (stored) {
        this.projects = JSON.parse(stored);
      } else {
        this.projects = [DEMO_PROJECT];
        this.persist();
      }

      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT_ID);
      if (storedActiveId && this.projects.some((p) => p.id === storedActiveId)) {
        this.activeProjectId = storedActiveId;
      } else {
        this.activeProjectId = this.projects[0].id;
      }
    } catch {
      this.projects = [DEMO_PROJECT];
      this.activeProjectId = DEMO_PROJECT.id;
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(this.projects));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, this.activeProjectId);
      this.notifySaveStatus('saved');
    } catch (e) {
      this.notifySaveStatus('error');
    }
  }

  public onAutoSaveStatus(listener: (status: 'saved' | 'saving' | 'error') => void): () => void {
    this.autoSaveListeners.push(listener);
    return () => {
      this.autoSaveListeners = this.autoSaveListeners.filter((l) => l !== listener);
    };
  }

  private notifySaveStatus(status: 'saved' | 'saving' | 'error') {
    this.autoSaveListeners.forEach((l) => l(status));
  }

  public getProjects(): Project[] {
    return this.projects;
  }

  public getActiveProject(): Project {
    const found = this.projects.find((p) => p.id === this.activeProjectId);
    return found || this.projects[0] || DEMO_PROJECT;
  }

  public setActiveProject(id: string) {
    if (this.projects.some((p) => p.id === id)) {
      this.activeProjectId = id;
      this.persist();
    }
  }

  public saveProject(updated: Project) {
    this.notifySaveStatus('saving');
    if (this.saveTimeout) clearTimeout(this.saveTimeout);

    this.saveTimeout = window.setTimeout(() => {
      const index = this.projects.findIndex((p) => p.id === updated.id);
      if (index >= 0) {
        this.projects[index] = {
          ...updated,
          updatedAt: new Date().toISOString(),
        };
      } else {
        this.projects.push({
          ...updated,
          updatedAt: new Date().toISOString(),
        });
      }
      this.persist();
    }, 400);
  }

  public createProject(title: string, genre: Project['genre'], language = 'es'): Project {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      schemaVersion: 1,
      title: title.trim() || 'Nuevo Proyecto de Narración',
      description: 'Estudio de locución narrativa profesional',
      genre,
      language,
      targetLoudness: 'podcast',
      defaultVoiceId: BUILTIN_LOCAL_VOICES[0].id,
      characters: [],
      pronunciationDictionary: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [
        {
          id: `scene-${Date.now()}-01`,
          projectId: `proj-${Date.now()}`,
          orderIndex: 0,
          title: '01. Introducción',
          rawText: '',
          segments: [],
          assignedVoiceId: BUILTIN_LOCAL_VOICES[0].id,
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
        },
      ],
    };
    newProj.scenes[0].projectId = newProj.id;
    this.projects.unshift(newProj);
    this.activeProjectId = newProj.id;
    this.persist();
    return newProj;
  }

  public addScene(projectId: string, title?: string): Scene {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    const newScene: Scene = {
      id: `scene-${Date.now()}-${project.scenes.length + 1}`,
      projectId,
      orderIndex: project.scenes.length,
      title: title || `${String(project.scenes.length + 1).padStart(2, '0')}. Nueva Escena`,
      rawText: '',
      segments: [],
      assignedVoiceId: project.defaultVoiceId || BUILTIN_LOCAL_VOICES[0].id,
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

    project.scenes.push(newScene);
    this.saveProject(project);
    return newScene;
  }
}

export const storageService = new StorageService();
