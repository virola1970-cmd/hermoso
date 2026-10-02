/**
 * NEXUS VOICE STUDIO — Voice Registry & Provider Adapter Service
 * Rich library of 100% free studio neural voices in Spanish (Latino & Spain) and English.
 */

import { VoiceProfile, ProviderType } from '../types/nexus';

// Complete collection of free high-fidelity neural voices
export const BUILTIN_LOCAL_VOICES: VoiceProfile[] = [
  // --- ESPAÑOL LATINOAMERICANO ---
  {
    id: 'nexus-es-mx-jorge',
    name: 'Jorge (México - Narrativa y Cine)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-MX',
    gender: 'male',
    ageBracket: 'adult',
    accent: 'México / Neutro Latinoamericano',
    style: 'Cálido, Cinematográfico y Confiable',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-MX-JorgeNeural',
    version: '2026.1',
    offline: false,
    description: 'Voz masculina mexicana de gran versatilidad, ideal para documentales modernos, comerciales y audiolibros.',
    tags: ['#latino', '#mexico', '#narrativa', '#cine', '#masculino'],
    defaultSpeed: 1.0,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-mx-dalia',
    name: 'Dalia (México - Storytelling y Calidez)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-MX',
    gender: 'female',
    ageBracket: 'adult',
    accent: 'México / Neutro Latinoamericano',
    style: 'Storytelling, Empática y Expresiva',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-MX-DaliaNeural',
    version: '2026.1',
    offline: false,
    description: 'Voz femenina mexicana con excelente modulación emocional para audiolibros, historias de misterio y podcasts.',
    tags: ['#latino', '#mexico', '#storytelling', '#calidez', '#femenino'],
    defaultSpeed: 1.0,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-co-gonzalo',
    name: 'Gonzalo (Colombia - Educativo y Culto)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-CO',
    gender: 'male',
    ageBracket: 'adult',
    accent: 'Colombia / Neutro Bogotá',
    style: 'Didáctico, Claro y Académico',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-CO-GonzaloNeural',
    version: '2026.1',
    offline: false,
    description: 'Dicción pristina y articulación pausada para divulgación científica, historia y cursos educativos.',
    tags: ['#latino', '#colombia', '#educativo', '#academia', '#masculino'],
    defaultSpeed: 0.98,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-co-salome',
    name: 'Salomé (Colombia - Podcast y Dinamismo)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-CO',
    gender: 'female',
    ageBracket: 'young_adult',
    accent: 'Colombia / Dinámica',
    style: 'Fresco, Juvenil y Motivador',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-CO-SalomeNeural',
    version: '2026.1',
    offline: false,
    description: 'Entonación moderna y envolvente ideal para podcasts conversacionales, redes sociales y tutoriales.',
    tags: ['#latino', '#colombia', '#podcast', '#fresco', '#femenino'],
    defaultSpeed: 1.02,
    defaultPitch: 1,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-ar-tomas',
    name: 'Tomás (Argentina - Profundidad y Drama)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-AR',
    gender: 'male',
    ageBracket: 'adult',
    accent: 'Argentina / Rioplatense',
    style: 'Resonante, Reflexivo y Profundo',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-AR-TomasNeural',
    version: '2026.1',
    offline: false,
    description: 'Timbre resonante rioplatense para crónicas periodísticas, ensayos narrados y novelas de suspenso.',
    tags: ['#latino', '#argentina', '#profundo', '#drama', '#masculino'],
    defaultSpeed: 0.95,
    defaultPitch: -1,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-ar-elena',
    name: 'Elena (Argentina - Elegancia y Crónica)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-AR',
    gender: 'female',
    ageBracket: 'adult',
    accent: 'Argentina / Rioplatense',
    style: 'Elegante y Periodístico',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-AR-ElenaNeural',
    version: '2026.1',
    offline: false,
    description: 'Locución sofisticada para documentales de arte, semblanzas históricas y relatos biográficos.',
    tags: ['#latino', '#argentina', '#elegante', '#cronica', '#femenino'],
    defaultSpeed: 0.97,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-pe-camila',
    name: 'Camila (Perú - Dulzura y Audiolibros)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-PE',
    gender: 'female',
    ageBracket: 'young_adult',
    accent: 'Perú / Neutro Lima',
    style: 'Dulce, Pausada e Íntima',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-PE-CamilaNeural',
    version: '2026.1',
    offline: false,
    description: 'Cadencia dulce y cercana para meditación guiada, cuentos infantiles y literatura poética.',
    tags: ['#latino', '#peru', '#dulzura', '#audiolibros', '#femenino'],
    defaultSpeed: 0.96,
    defaultPitch: 1,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-us-alonso',
    name: 'Alonso (Hispano EE.UU. - Broadcast)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-US',
    gender: 'male',
    ageBracket: 'adult',
    accent: 'Estados Unidos / Hispano Neutro',
    style: 'Corporativo, Firme y Televisivo',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-US-AlonsoNeural',
    version: '2026.1',
    offline: false,
    description: 'Voz institucional con presencia enérgica para comerciales, anuncios y resúmenes de negocios.',
    tags: ['#latino', '#usa', '#broadcast', '#corporativo', '#masculino'],
    defaultSpeed: 1.0,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },

  // --- ESPAÑOL DE ESPAÑA (PENINSULAR) ---
  {
    id: 'nexus-loc-es-doc',
    name: 'Álvaro (España - Documental Solemne)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-ES',
    gender: 'male',
    ageBracket: 'adult',
    accent: 'España / Peninsular',
    style: 'Documental Solemne e Histórico',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-ES-AlvaroNeural',
    version: '2026.1',
    offline: false,
    description: 'Voz profunda de locutor de gran prestigio, articulación cristalina y cadencia medida para grandes historias.',
    tags: ['#espana', '#documental', '#solemne', '#profesional', '#masculino'],
    defaultSpeed: 0.95,
    defaultPitch: -1,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-loc-es-narrator',
    name: 'Elvira (España - Narrativa Literaria)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-ES',
    gender: 'female',
    ageBracket: 'adult',
    accent: 'España / Peninsular',
    style: 'Narrativa, Expresiva y Teatral',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-ES-ElviraNeural',
    version: '2026.1',
    offline: false,
    description: 'Voz expresiva para novelas, drama teatral y ficción con amplia flexibilidad dramática.',
    tags: ['#espana', '#literatura', '#teatro', '#narrativa', '#femenino'],
    defaultSpeed: 0.98,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-es-arnau',
    name: 'Arnau (España - Juvenil y Tecnológico)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'es',
    locale: 'es-ES',
    gender: 'male',
    ageBracket: 'young_adult',
    accent: 'España / Peninsular',
    style: 'Moderno, Enérgico y Tecnológico',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'es-ES-ArnauNeural',
    version: '2026.1',
    offline: false,
    description: 'Voz joven para videojuegos, documentales de tecnología e internet.',
    tags: ['#espana', '#juvenil', '#tech', '#gaming', '#masculino'],
    defaultSpeed: 1.02,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },

  // --- INGLÉS (ENGLISH US & UK) ---
  {
    id: 'nexus-loc-en-doc',
    name: 'Guy (USA - Deep Cinematic & Mystery)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'en',
    locale: 'en-US',
    gender: 'male',
    ageBracket: 'adult',
    accent: 'Standard American',
    style: 'Deep Cinematic, Investigative & Authoritative',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'en-US-GuyNeural',
    version: '2026.1',
    offline: false,
    description: 'Rich movie-trailer resonance for blockbuster documentaries, crime mysteries, and space documentaries.',
    tags: ['#english', '#us', '#cinematic', '#mystery', '#male'],
    defaultSpeed: 0.94,
    defaultPitch: -2,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-en-jenny',
    name: 'Jenny (USA - Natural Storyteller & Warmth)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'en',
    locale: 'en-US',
    gender: 'female',
    ageBracket: 'adult',
    accent: 'Standard American',
    style: 'Warm, Conversational & Engaging',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'en-US-JennyNeural',
    version: '2026.1',
    offline: false,
    description: 'Warm, highly expressive female voice for audiobooks, podcasts, and personal development narration.',
    tags: ['#english', '#us', '#storyteller', '#warm', '#female'],
    defaultSpeed: 1.0,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-en-aria',
    name: 'Aria (USA - Expressive Audiobooks & Drama)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'en',
    locale: 'en-US',
    gender: 'female',
    ageBracket: 'young_adult',
    accent: 'Standard American',
    style: 'Dramatic, Vivid and Emotional',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'en-US-AriaNeural',
    version: '2026.1',
    offline: false,
    description: 'Nuanced emotional inflection tailored for fiction, poetry, and character-driven scenes.',
    tags: ['#english', '#us', '#drama', '#expressive', '#female'],
    defaultSpeed: 0.98,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-loc-en-elena',
    name: 'Sonia (UK - British Investigative & BBC Style)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'en',
    locale: 'en-GB',
    gender: 'female',
    ageBracket: 'adult',
    accent: 'British Received Pronunciation',
    style: 'Investigative, Crisp and Intellectual',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'en-GB-SoniaNeural',
    version: '2026.1',
    offline: false,
    description: 'Classic British broadcast diction for history, philosophy, science podcasts, and mysteries.',
    tags: ['#english', '#uk', '#investigative', '#british', '#female'],
    defaultSpeed: 0.98,
    defaultPitch: 0,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
  {
    id: 'nexus-en-ryan',
    name: 'Ryan (UK - British Historical & Oxford)',
    provider: 'local',
    engine: 'Microsoft Edge Neural TTS Studio',
    language: 'en',
    locale: 'en-GB',
    gender: 'male',
    ageBracket: 'senior',
    accent: 'British Oxford Academic',
    style: 'Historical, Authoritative and Calm',
    license: 'Free Commercial & Personal Tier',
    commercialUse: 'ALLOWED',
    attributionRequired: false,
    source: 'en-GB-RyanNeural',
    version: '2026.1',
    offline: false,
    description: 'Distinguished British voice for royal history, archaeology, war documentaries, and classics.',
    tags: ['#english', '#uk', '#historical', '#academic', '#male'],
    defaultSpeed: 0.95,
    defaultPitch: -1,
    capabilities: {
      tts: true,
      ssml: true,
      emotionControl: true,
      pitchControl: true,
      speedControl: true,
      styleControl: true,
      streaming: true,
      offline: false,
      canExportAudio: true,
    },
  },
];

const CUSTOM_VOICES_STORAGE_KEY = 'nexus_custom_voices_v1';

class VoiceService {
  private browserVoices: VoiceProfile[] = [];
  private customVoices: VoiceProfile[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadCustomVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadBrowserVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadBrowserVoices();
        this.notifyListeners();
      };
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  public loadCustomVoices() {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(CUSTOM_VOICES_STORAGE_KEY);
      if (data) {
        this.customVoices = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error al cargar voces personalizadas:', e);
      this.customVoices = [];
    }
  }

  public saveCustomVoice(voice: VoiceProfile): VoiceProfile {
    const existingIndex = this.customVoices.findIndex((v) => v.id === voice.id);
    if (existingIndex >= 0) {
      this.customVoices[existingIndex] = voice;
    } else {
      this.customVoices.unshift(voice);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CUSTOM_VOICES_STORAGE_KEY, JSON.stringify(this.customVoices));
      } catch (e) {
        console.error('Error al guardar voz personalizada:', e);
      }
    }
    this.notifyListeners();
    return voice;
  }

  public deleteCustomVoice(id: string): boolean {
    const beforeCount = this.customVoices.length;
    this.customVoices = this.customVoices.filter((v) => v.id !== id);
    if (this.customVoices.length !== beforeCount && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CUSTOM_VOICES_STORAGE_KEY, JSON.stringify(this.customVoices));
      } catch (e) {
        console.error('Error al eliminar voz personalizada:', e);
      }
      this.notifyListeners();
      return true;
    }
    return false;
  }

  public getCustomVoices(): VoiceProfile[] {
    return [...this.customVoices];
  }

  private loadBrowserVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const rawVoices = window.speechSynthesis.getVoices();
    this.browserVoices = rawVoices.map((v, index) => {
      const isSpanish = v.lang.startsWith('es');
      const isEnglish = v.lang.startsWith('en');
      return {
        id: `browser-${index}-${v.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: `${v.name} (Sistema)`,
        provider: 'browser' as ProviderType,
        engine: 'Web Speech API (Sistema Operativo)',
        language: v.lang.split('-')[0] || 'es',
        locale: v.lang,
        gender: v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer')
          ? 'female'
          : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre')
          ? 'male'
          : 'neutral',
        ageBracket: 'adult',
        accent: v.lang,
        style: 'Locución Básica del Sistema',
        license: 'Propiedad del Sistema Operativo',
        commercialUse: 'UNCONFIRMED',
        attributionRequired: false,
        source: 'OS Speech Engine',
        version: 'Browser Native',
        offline: true,
        description: 'Voz expuesta por el navegador. Solo permite previsualización; no expone audio binario para exportación.',
        tags: [isSpanish ? '#español' : isEnglish ? '#english' : '#sistema', '#navegador'],
        defaultSpeed: 1.0,
        defaultPitch: 0,
        capabilities: {
          tts: true,
          ssml: false,
          emotionControl: false,
          pitchControl: true,
          speedControl: true,
          styleControl: false,
          streaming: false,
          offline: true,
          canExportAudio: false,
        },
      };
    });
  }

  public getAllVoices(): VoiceProfile[] {
    return [...this.customVoices, ...BUILTIN_LOCAL_VOICES, ...this.browserVoices];
  }

  public getExportableVoices(): VoiceProfile[] {
    return this.getAllVoices().filter((v) => v.capabilities.canExportAudio);
  }

  public getVoiceById(id: string): VoiceProfile | undefined {
    return this.getAllVoices().find((v) => v.id === id);
  }

  public getRecommendedAlternative(currentVoice: VoiceProfile): VoiceProfile | undefined {
    const exportable = this.getExportableVoices().filter((v) => v.id !== currentVoice.id);
    const sameLang = exportable.filter((v) => v.language === currentVoice.language);
    if (sameLang.length > 0) {
      const sameGender = sameLang.find((v) => v.gender === currentVoice.gender);
      return sameGender || sameLang[0];
    }
    return exportable[0];
  }
}

export const voiceService = new VoiceService();
