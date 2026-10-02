/**
 * NEXUS VOICE STUDIO ∞Ω — Universal Types
 * Intermediate Representation, Voice Profiles, Projects and Engine State
 */

export type ProjectMode = 'simple' | 'pro' | 'director';

export type ProviderType = 'local' | 'browser' | 'google' | 'custom';

export type CommercialUseStatus = 'ALLOWED' | 'UNCONFIRMED' | 'PROHIBITED';

export type EmotionType =
  | 'neutral'
  | 'joy'
  | 'sadness'
  | 'hope'
  | 'nostalgia'
  | 'surprise'
  | 'curiosity'
  | 'tension'
  | 'controlled_fear'
  | 'wonder'
  | 'admiration'
  | 'compassion'
  | 'love'
  | 'tenderness'
  | 'serenity'
  | 'solemnity'
  | 'determination'
  | 'urgency'
  | 'mystery'
  | 'confidence'
  | 'authority'
  | 'inspiration'
  | 'reflection'
  | 'gratitude';

export type IntentionType =
  | 'inform'
  | 'teach'
  | 'convince'
  | 'explain'
  | 'reveal'
  | 'warn'
  | 'move_emotion'
  | 'inspire'
  | 'reassure'
  | 'accompany'
  | 'entertain'
  | 'investigate'
  | 'question'
  | 'present'
  | 'conclude'
  | 'surprise'
  | 'create_expectation'
  | 'spark_curiosity'
  | 'provoke_thought';

export type PauseType =
  | 'micro'
  | 'natural'
  | 'thought'
  | 'dramatic'
  | 'emotional'
  | 'revelation'
  | 'transition'
  | 'paragraph';

export type AudioFormat = 'wav' | 'mp3';
export type Mp3Bitrate = '128k' | '192k' | '256k' | '320k';
export type WavBitDepth = '16bit' | '24bit';

export type TargetLoudnessPreset = 'youtube' | 'podcast' | 'audiobook';

export interface VoiceCapabilities {
  tts: boolean;
  ssml: boolean;
  emotionControl: boolean;
  pitchControl: boolean;
  speedControl: boolean;
  styleControl: boolean;
  streaming: boolean;
  offline: boolean;
  canExportAudio: boolean; // Critical rule: browser voices may be false
}

export interface VoiceProfile {
  id: string;
  name: string;
  provider: ProviderType;
  engine: string;
  language: string; // e.g. "es", "en"
  locale: string; // e.g. "es-ES", "es-MX", "en-US"
  gender: 'neutral' | 'female' | 'male';
  ageBracket: 'child' | 'young_adult' | 'adult' | 'senior';
  accent: string;
  style: string;
  license: string;
  commercialUse: CommercialUseStatus;
  attributionRequired: boolean;
  source: string;
  version: string;
  capabilities: VoiceCapabilities;
  offline: boolean;
  description: string;
  tags: string[];
  defaultSpeed: number;
  defaultPitch: number;
  isCloned?: boolean;
  clonedFromAudioName?: string;
  cloneAcoustics?: {
    baseVoiceId: string;
    detectedFundamentalFreqHz: number;
    pitchOffset: number;
    speedOffset: number;
    warmthBoost: number;
    energyBoost: number;
  };
}

export interface NIRSegment {
  segmentId: string;
  text: string;
  speaker: string;
  type: 'narration' | 'dialogue' | 'description' | 'climax' | 'whisper';
  intent: IntentionType;
  emotion: {
    name: EmotionType;
    intensity: number; // 0, 25, 50, 75, 100
  };
  pace: 'very_slow' | 'slow' | 'natural' | 'brisk' | 'fast';
  emphasis: Array<{ span: string; level: 'subtle' | 'normal' | 'strong' | 'dramatic' }>;
  pauseAfter: {
    type: PauseType;
    ms: number;
  };
  pronunciationOverrides?: Array<{ original: string; spoken: string }>;
  lockedText: boolean; // Cannot be rewritten (scriptures, citations)
}

export interface Scene {
  id: string;
  projectId: string;
  orderIndex: number;
  title: string;
  rawText: string;
  segments: NIRSegment[];
  assignedVoiceId: string;
  assignedCharacterId?: string;
  emotion: EmotionType;
  emotionIntensity: number;
  intent: IntentionType;
  speed: number; // 0.5 - 2.0
  pitch: number; // -10 - +10
  energy: number; // 0 - 100
  warmth: number; // 0 - 100
  pauseType: PauseType;
  pauseDurationMs: number;
  audioUrl?: string;
  audioDurationSeconds?: number;
  lastGeneratedHash?: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: 'narrator' | 'protagonist' | 'antagonist' | 'expert' | 'witness' | 'elder' | 'child' | 'custom';
  voiceId: string;
  baseEmotion: EmotionType;
  speed: number;
  pitch: number;
  energy: number;
  warmth: number;
  voiceLocked: boolean;
  notes: string;
}

export interface Project {
  id: string;
  schemaVersion: number;
  title: string;
  description: string;
  genre: 'documentary' | 'mystery' | 'historical' | 'biblical' | 'educational' | 'storytelling' | 'podcast';
  language: string;
  targetLoudness: TargetLoudnessPreset;
  defaultVoiceId: string;
  scenes: Scene[];
  characters: Character[];
  pronunciationDictionary: Array<{ original: string; spoken: string; scope: 'project' | 'global' }>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationSettings {
  format: AudioFormat;
  bitrate: Mp3Bitrate;
  wavBitDepth: WavBitDepth;
  normalizeLoudness: boolean;
  targetLoudness: TargetLoudnessPreset;
  seed: number;
  addSyntheticVoiceMetadata: boolean;
}

export interface SystemStatus {
  activeEngine: string;
  offlineMode: boolean;
  providerStatus: {
    local: 'ONLINE' | 'OFFLINE';
    browser: 'ONLINE' | 'OFFLINE';
    google: 'SETUP REQUIRED' | 'ONLINE' | 'OFFLINE';
  };
  activeQueueCount: number;
  storageUsageMb: number;
}

export interface PodcastSegment {
  id: string;
  speaker: 'host' | 'guest' | 'narrator';
  speakerName: string;
  voiceId: string;
  text: string;
  emotion: EmotionType;
  intent: IntentionType;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  hostName: string;
  hostVoiceId: string;
  guestName: string;
  guestVoiceId: string;
  theme: 'tech' | 'mystery' | 'history' | 'business' | 'storytelling' | 'general';
  bgMusicStyle: 'lofi_ambient' | 'cinematic_mystery' | 'modern_acoustic' | 'tech_pulse' | 'none';
  duckingDb: number; // e.g. -12 dB
  segments: PodcastSegment[];
  createdAt: string;
  updatedAt: string;
}
