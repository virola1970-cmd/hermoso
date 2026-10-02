/**
 * NEXUS VOICE STUDIO — Audio Engine & Exporter
 * Provides natural speech synthesis via Web Speech API and backend espeak-ng + FFmpeg.
 * Completely eliminates synthetic oscillator beeps in favor of authentic spoken words.
 */

import { VoiceProfile, AudioFormat, Mp3Bitrate, WavBitDepth, TargetLoudnessPreset } from '../types/nexus';
import { audioBufferToWavBlob } from '../utils/wavEncoder';

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  activeVoiceId: string | null;
  progressPercent: number;
}

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private playbackState: PlaybackState = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    activeVoiceId: null,
    progressPercent: 0,
  };
  private listeners: Array<(state: PlaybackState) => void> = [];
  private progressInterval: number | null = null;

  public subscribe(listener: (state: PlaybackState) => void): () => void {
    this.listeners.push(listener);
    listener(this.playbackState);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private updateState(partial: Partial<PlaybackState>) {
    this.playbackState = { ...this.playbackState, ...partial };
    this.listeners.forEach((l) => l(this.playbackState));
  }

  public getState(): PlaybackState {
    return this.playbackState;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Stop any ongoing audio preview immediately
   */
  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignored
      }
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // Ignored
      }
      this.currentAudioElement = null;
    }
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {
        // Ignored
      }
      this.currentSource = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.updateState({
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      progressPercent: 0,
    });
  }

  /**
   * LEER (Preview function):
   * Plays authentic neural speech synthesized by server (for exportable voices)
   * or Web Speech API (for browser voices), guaranteeing matching natural voice.
   */
  public async preview(
    text: string,
    voice: VoiceProfile,
    options?: {
      speed?: number;
      pitch?: number;
      emotion?: string;
      emotionIntensity?: number;
      intent?: string;
      warmth?: number;
      energy?: number;
    }
  ): Promise<void> {
    this.stop();
    const cleanText = text.trim();
    if (!cleanText) return;

    // For exportable voices, use server neural synthesis so preview and download match 100%
    if (voice.capabilities.canExportAudio) {
      try {
        await this.previewViaServer(cleanText, voice, options);
        return;
      } catch (err) {
        console.warn('Primer intento de síntesis fallido, reintentando...', err);
        try {
          await new Promise((r) => setTimeout(r, 400));
          await this.previewViaServer(cleanText, voice, options);
          return;
        } catch (retryErr: unknown) {
          const msg = retryErr instanceof Error ? retryErr.message : String(retryErr);
          throw new Error(`Error al sintetizar voz neural "${voice.name}": ${msg}`);
        }
      }
    }

    // Use Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return new Promise<void>((resolve, reject) => {
        try {
          const speed = Math.max(0.6, Math.min(1.8, options?.speed ?? voice.defaultSpeed ?? 1.0));
          const pitch = options?.pitch ?? voice.defaultPitch ?? 0;
          const utterance = new SpeechSynthesisUtterance(cleanText);
          const rawVoices = window.speechSynthesis.getVoices();

          const langCode = (voice.locale || 'es-ES').toLowerCase();
          const langPrefix = langCode.split('-')[0];

          let matchedVoice = rawVoices.find(
            (v) => v.lang.toLowerCase() === langCode || v.lang.toLowerCase().replace('_', '-') === langCode
          );

          if (!matchedVoice) {
            matchedVoice = rawVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
          }

          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }

          utterance.lang = voice.locale || 'es-ES';
          utterance.rate = speed;
          utterance.pitch = Math.max(0.5, Math.min(1.6, 1.0 + pitch * 0.08));

          const words = cleanText.split(/\s+/).length;
          const estimatedDuration = Math.max(1.5, (words / (145 * speed)) * 60);

          this.currentUtterance = utterance;
          this.updateState({
            isPlaying: true,
            isPaused: false,
            duration: estimatedDuration,
            currentTime: 0,
            activeVoiceId: voice.id,
          });

          const startTime = Date.now();
          this.progressInterval = window.setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed >= estimatedDuration) {
              if (this.progressInterval) clearInterval(this.progressInterval);
            } else {
              this.updateState({
                currentTime: elapsed,
                progressPercent: Math.min(99, (elapsed / estimatedDuration) * 100),
              });
            }
          }, 80);

          utterance.onend = () => {
            this.stop();
            resolve();
          };

          utterance.onerror = (e) => {
            this.stop();
            if (e.error === 'canceled' || e.error === 'interrupted') {
              resolve();
            } else {
              reject(new Error('Fallo en reproducción de voz'));
            }
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          reject(err);
        }
      });
    }
  }

  /**
   * Preview using server-side natural neural TTS audio
   */
  private async previewViaServer(
    text: string,
    voice: VoiceProfile,
    options?: {
      speed?: number;
      pitch?: number;
      emotion?: string;
      emotionIntensity?: number;
      intent?: string;
    }
  ): Promise<void> {
    const res = await fetch('/api/tts/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceId: voice.id,
        cloneBaseVoiceId: voice.cloneAcoustics?.baseVoiceId,
        lang: voice.locale || 'es-MX',
        speed: options?.speed ?? voice.defaultSpeed ?? 1.0,
        pitch: options?.pitch ?? voice.defaultPitch ?? 0,
        emotion: options?.emotion || 'neutral',
        emotionIntensity: options?.emotionIntensity ?? 50,
        intent: options?.intent || 'inform',
        format: 'mp3',
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.details || 'Error al conectar con el motor de voz del servidor.');
    }

    const arrayBuf = await res.arrayBuffer();
    const ctx = this.getAudioContext();
    const audioBuf = await ctx.decodeAudioData(arrayBuf);

    this.stop();
    const source = ctx.createBufferSource();
    source.buffer = audioBuf;
    source.connect(ctx.destination);
    this.currentSource = source;

    const duration = audioBuf.duration;
    const startTime = ctx.currentTime;

    this.updateState({
      isPlaying: true,
      isPaused: false,
      duration,
      currentTime: 0,
      activeVoiceId: voice.id,
    });

    this.progressInterval = window.setInterval(() => {
      const elapsed = ctx.currentTime - startTime;
      if (elapsed >= duration) {
        this.stop();
      } else {
        this.updateState({
          currentTime: elapsed,
          progressPercent: Math.min(100, (elapsed / duration) * 100),
        });
      }
    }, 60);

    source.onended = () => {
      this.stop();
    };

    source.start(0);
  }

  /**
   * DESCARGAR (Download function):
   * Generates genuine spoken WAV or MP3 audio via backend TTS
   * and triggers clean browser download.
   */
  public async download(
    text: string,
    voice: VoiceProfile,
    options: {
      format: AudioFormat;
      bitrate?: Mp3Bitrate;
      wavBitDepth?: WavBitDepth;
      projectTitle?: string;
      speed?: number;
      pitch?: number;
      warmth?: number;
      energy?: number;
      emotion?: string;
      emotionIntensity?: number;
      intent?: string;
      targetLoudness?: TargetLoudnessPreset;
    }
  ): Promise<{ filename: string; blob: Blob }> {
    if (!voice.capabilities.canExportAudio) {
      throw new Error(
        `Esta voz (${voice.name}) solo permite reproducción en altavoz del navegador. Elige una voz exportable (como las voces locales Nexus) para descargar.`
      );
    }

    const cleanText = text.trim();
    if (!cleanText) {
      throw new Error('El texto no puede estar vacío.');
    }

    // Call server TTS endpoint
    const res = await fetch('/api/tts/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        voiceId: voice.id,
        cloneBaseVoiceId: voice.cloneAcoustics?.baseVoiceId,
        lang: voice.locale || 'es-MX',
        speed: options.speed ?? voice.defaultSpeed ?? 1.0,
        pitch: options.pitch ?? voice.defaultPitch ?? 0,
        emotion: options.emotion || 'neutral',
        emotionIntensity: options.emotionIntensity ?? 50,
        intent: options.intent || 'inform',
        format: options.format === 'wav' ? 'wav' : 'mp3',
        bitrate: options.bitrate || '192k',
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.details || 'Fallo en la generación de audio del servidor.');
    }

    const rawBlob = await res.blob();
    let finalBlob: Blob = rawBlob;

    // If WAV requested, guarantee genuine PCM WAV by decoding and encoding client-side if needed
    if (options.format === 'wav') {
      try {
        const arrayBuf = await rawBlob.arrayBuffer();
        const ctx = this.getAudioContext();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        finalBlob = audioBufferToWavBlob(audioBuf, options.wavBitDepth || '16bit');
      } catch (wavErr) {
        console.warn('Conversión client-side a WAV omitida, usando audio directo:', wavErr);
        finalBlob = rawBlob;
      }
    }

    // Prepare filename
    const safeTitle = (options.projectTitle || 'NEXUS_Audio')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeVoice = voice.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const filename = `${safeTitle}_${safeVoice}_${timestamp}.${options.format}`;

    // Trigger download
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);

    return { filename, blob: finalBlob };
  }

  /**
   * LEER Y DESCARGAR (Combined function from Section 12.1)
   */
  public async readAndDownload(
    text: string,
    voice: VoiceProfile,
    options: {
      format: AudioFormat;
      bitrate?: Mp3Bitrate;
      wavBitDepth?: WavBitDepth;
      projectTitle?: string;
      speed?: number;
      pitch?: number;
      warmth?: number;
      energy?: number;
      emotion?: string;
      emotionIntensity?: number;
      intent?: string;
      targetLoudness?: TargetLoudnessPreset;
    }
  ): Promise<{ filename: string; blob: Blob }> {
    // Start natural preview playback
    this.preview(text, voice, options);
    // Generate and trigger download
    return await this.download(text, voice, options);
  }
}

export const audioEngine = new AudioEngine();
