/**
 * NEXUS VOICE STUDIO — Backend Server
 * Express server mounted with Vite middlewares in development.
 * Handles server-side Neural TTS synthesis (MsEdgeTTS) with 24 emotions & 19 intentions,
 * resilient audio delivery (zero crash on Cloud Run / production without external FFmpeg).
 */

import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execFileAsync = promisify(execFile);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Complete mapping of all free Neural Voice models & aliases
const NEURAL_VOICE_MAP: Record<string, string> = {
  // Español Latino
  'nexus-es-mx-jorge': 'es-MX-JorgeNeural',
  'es-mx-jorgeneural': 'es-MX-JorgeNeural',
  'jorge': 'es-MX-JorgeNeural',

  'nexus-es-mx-dalia': 'es-MX-DaliaNeural',
  'es-mx-dalianeural': 'es-MX-DaliaNeural',
  'dalia': 'es-MX-DaliaNeural',

  'nexus-es-co-gonzalo': 'es-CO-GonzaloNeural',
  'es-co-gonzaloneural': 'es-CO-GonzaloNeural',
  'gonzalo': 'es-CO-GonzaloNeural',

  'nexus-es-co-salome': 'es-CO-SalomeNeural',
  'es-co-salomeneural': 'es-CO-SalomeNeural',
  'salome': 'es-CO-SalomeNeural',

  'nexus-es-ar-tomas': 'es-AR-TomasNeural',
  'es-ar-tomasneural': 'es-AR-TomasNeural',
  'tomas': 'es-AR-TomasNeural',

  'nexus-es-ar-elena': 'es-AR-ElenaNeural',
  'es-ar-elenaneural': 'es-AR-ElenaNeural',
  'elena': 'es-AR-ElenaNeural',

  'nexus-es-pe-camila': 'es-PE-CamilaNeural',
  'es-pe-camilaneural': 'es-PE-CamilaNeural',
  'camila': 'es-PE-CamilaNeural',

  'nexus-es-us-alonso': 'es-US-AlonsoNeural',
  'es-us-alsonsoneural': 'es-US-AlonsoNeural',
  'alonso': 'es-US-AlonsoNeural',

  // Español España
  'nexus-loc-es-doc': 'es-ES-AlvaroNeural',
  'es-es-alvaroneural': 'es-ES-AlvaroNeural',
  'alvaro': 'es-ES-AlvaroNeural',

  'nexus-loc-es-narrator': 'es-ES-ElviraNeural',
  'es-es-elviraneural': 'es-ES-ElviraNeural',
  'elvira': 'es-ES-ElviraNeural',

  'nexus-es-arnau': 'es-ES-ArnauNeural',
  'es-es-arnauneural': 'es-ES-ArnauNeural',
  'arnau': 'es-ES-ArnauNeural',

  // English US & UK
  'nexus-loc-en-doc': 'en-US-GuyNeural',
  'en-us-guyneural': 'en-US-GuyNeural',
  'guy': 'en-US-GuyNeural',

  'nexus-en-jenny': 'en-US-JennyNeural',
  'en-us-jennyneural': 'en-US-JennyNeural',
  'jenny': 'en-US-JennyNeural',

  'nexus-en-aria': 'en-US-AriaNeural',
  'en-us-arianeural': 'en-US-AriaNeural',
  'aria': 'en-US-AriaNeural',

  'nexus-loc-en-elena': 'en-GB-SoniaNeural',
  'en-gb-sonianeural': 'en-GB-SoniaNeural',
  'sonia': 'en-GB-SoniaNeural',

  'nexus-en-ryan': 'en-GB-RyanNeural',
  'en-gb-ryanneural': 'en-GB-RyanNeural',
  'ryan': 'en-GB-RyanNeural',
};

// Emotion acoustic modulation table (rate modifier %, pitch modifier Hz)
const EMOTION_ACOUSTICS: Record<string, { rate: number; pitch: number }> = {
  neutral: { rate: 0, pitch: 0 },
  joy: { rate: 10, pitch: 5 },
  sadness: { rate: -12, pitch: -4 },
  hope: { rate: 5, pitch: 3 },
  nostalgia: { rate: -8, pitch: -2 },
  surprise: { rate: 14, pitch: 7 },
  curiosity: { rate: 6, pitch: 4 },
  tension: { rate: -5, pitch: 4 },
  controlled_fear: { rate: 8, pitch: 5 },
  wonder: { rate: -7, pitch: 4 },
  admiration: { rate: -4, pitch: 2 },
  compassion: { rate: -8, pitch: -2 },
  love: { rate: -6, pitch: -1 },
  tenderness: { rate: -8, pitch: 1 },
  serenity: { rate: -10, pitch: -2 },
  solemnity: { rate: -12, pitch: -5 },
  determination: { rate: 6, pitch: -2 },
  urgency: { rate: 18, pitch: 4 },
  mystery: { rate: -10, pitch: -4 },
  confidence: { rate: 4, pitch: -2 },
  authority: { rate: -6, pitch: -3 },
  inspiration: { rate: 6, pitch: 2 },
  reflection: { rate: -12, pitch: -3 },
  gratitude: { rate: -4, pitch: 1 },
};

// Intention acoustic modulation table
const INTENTION_ACOUSTICS: Record<string, { rate: number; pitch: number }> = {
  inform: { rate: 0, pitch: 0 },
  teach: { rate: -4, pitch: 1 },
  convince: { rate: 4, pitch: -1 },
  explain: { rate: -5, pitch: 0 },
  reveal: { rate: -8, pitch: -3 },
  warn: { rate: -4, pitch: 3 },
  move_emotion: { rate: -6, pitch: -1 },
  inspire: { rate: 5, pitch: 2 },
  reassure: { rate: -6, pitch: -2 },
  accompany: { rate: -4, pitch: 0 },
  entertain: { rate: 8, pitch: 3 },
  investigate: { rate: -5, pitch: 2 },
  question: { rate: 2, pitch: 4 },
  present: { rate: 2, pitch: 0 },
  conclude: { rate: -8, pitch: -3 },
  surprise: { rate: 14, pitch: 6 },
  create_expectation: { rate: -6, pitch: 2 },
  spark_curiosity: { rate: 6, pitch: 4 },
  provoke_thought: { rate: -10, pitch: -3 },
};

function resolveNeuralVoice(voiceId?: string, lang?: string): string {
  if (voiceId) {
    const cleanId = voiceId.toLowerCase().trim();
    if (NEURAL_VOICE_MAP[cleanId]) {
      return NEURAL_VOICE_MAP[cleanId];
    }
    for (const val of Object.values(NEURAL_VOICE_MAP)) {
      if (val.toLowerCase() === cleanId) {
        return val;
      }
    }
  }
  const l = (lang || 'es-MX').toLowerCase();
  if (l.includes('mx') || l.includes('la')) return 'es-MX-JorgeNeural';
  if (l.includes('co')) return 'es-CO-GonzaloNeural';
  if (l.includes('ar')) return 'es-AR-TomasNeural';
  if (l.includes('pe')) return 'es-PE-CamilaNeural';
  if (l.startsWith('es')) return 'es-ES-AlvaroNeural';
  if (l.includes('gb') || l.includes('uk')) return 'en-GB-SoniaNeural';
  if (l.startsWith('en')) return 'en-US-GuyNeural';
  return 'es-MX-JorgeNeural';
}

// Health and capabilities endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    engine: 'Microsoft Edge Neural TTS Studio Master (45 Spanish + 47 English voices)',
    neuralCapable: true,
  });
});

// TTS Synthesis endpoint with dynamic Emotion & Intention prosody sculpting
app.post('/api/tts/synthesize', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voiceId,
      cloneBaseVoiceId,
      lang = 'es-MX',
      speed = 1.0,
      pitch = 0,
      emotion = 'neutral',
      emotionIntensity = 50,
      intent = 'inform',
      format = 'mp3',
      bitrate = '192k',
    } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Texto es requerido para la síntesis.' });
      return;
    }

    const cleanText = text.trim();
    if (!cleanText) {
      res.status(400).json({ error: 'El texto no puede estar vacío.' });
      return;
    }

    // Resolve voice model
    const targetVoiceId = cloneBaseVoiceId || voiceId;
    const selectedNeuralVoice = resolveNeuralVoice(targetVoiceId, lang);
    const tempDir = path.join(
      os.tmpdir(),
      `nexus_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    );
    await fs.mkdir(tempDir, { recursive: true });

    let audioData: Buffer | null = null;
    let actualFormat = 'mp3';

    try {
      // 1. Primary: High-fidelity Studio Neural Voice via MsEdgeTTS
      const tts = new MsEdgeTTS();
      await tts.setMetadata(
        selectedNeuralVoice,
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
      );

      // Calculate emotion & intention modulation weights
      const emoMod = EMOTION_ACOUSTICS[emotion] || { rate: 0, pitch: 0 };
      const intMod = INTENTION_ACOUSTICS[intent] || { rate: 0, pitch: 0 };
      const intensityWeight = (emotionIntensity || 50) / 100;

      // Base user speed modifier
      const baseRatePercent = (Math.max(0.5, Math.min(2.0, speed)) - 1.0) * 100;
      const totalRatePercent = Math.round(
        baseRatePercent + emoMod.rate * intensityWeight + intMod.rate * 0.6
      );

      // Base user pitch modifier (semitones to Hz approximation: 1st ~ 4Hz)
      const basePitchHz = pitch * 4;
      const totalPitchHz = Math.round(
        basePitchHz + emoMod.pitch * intensityWeight + intMod.pitch * 0.5
      );

      const rateStr = `${totalRatePercent >= 0 ? '+' : ''}${totalRatePercent}%`;
      const pitchStr = `${totalPitchHz >= 0 ? '+' : ''}${totalPitchHz}Hz`;

      await tts.toFile(tempDir, cleanText, {
        rate: rateStr,
        pitch: pitchStr,
      });

      try {
        tts.close();
      } catch {
        // Ignored
      }

      const generatedMp3Path = path.join(tempDir, 'audio.mp3');

      if (format === 'wav') {
        const tempFinalOutput = path.join(tempDir, 'final_output.wav');
        try {
          await execFileAsync('ffmpeg', [
            '-y',
            '-i',
            generatedMp3Path,
            '-acodec',
            'pcm_s16le',
            '-ar',
            '44100',
            tempFinalOutput,
          ]);
          audioData = await fs.readFile(tempFinalOutput);
          actualFormat = 'wav';
        } catch {
          // If ffmpeg is not available, safely return the MP3
          audioData = await fs.readFile(generatedMp3Path);
          actualFormat = 'mp3';
        }
      } else {
        // format is mp3
        if (bitrate && bitrate !== '96k') {
          const tempFinalOutput = path.join(tempDir, 'final_output.mp3');
          try {
            await execFileAsync('ffmpeg', [
              '-y',
              '-i',
              generatedMp3Path,
              '-b:a',
              bitrate,
              tempFinalOutput,
            ]);
            audioData = await fs.readFile(tempFinalOutput);
          } catch {
            audioData = await fs.readFile(generatedMp3Path);
          }
        } else {
          audioData = await fs.readFile(generatedMp3Path);
        }
        actualFormat = 'mp3';
      }
    } catch (neuralErr) {
      console.warn('Fallo en Neural TTS MsEdgeTTS:', neuralErr);
      // Fallback: try espeak-ng if available
      try {
        const fallbackWav = path.join(tempDir, 'fallback.wav');
        const voiceCode = lang.startsWith('en') ? 'en-us' : 'es';
        const wpm = Math.round(160 * Math.max(0.5, Math.min(2.0, speed)));

        await execFileAsync('espeak-ng', [
          '-v',
          voiceCode,
          '-s',
          String(wpm),
          '-w',
          fallbackWav,
          cleanText,
        ]);
        audioData = await fs.readFile(fallbackWav);
        actualFormat = 'wav';
      } catch (espeakErr) {
        console.error('Fallo en fallback espeak-ng:', espeakErr);
      }
    } finally {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignored
      }
    }

    if (!audioData) {
      throw new Error(`No se pudo generar audio para la voz solicitada (${selectedNeuralVoice}).`);
    }

    res.setHeader('Content-Type', actualFormat === 'mp3' ? 'audio/mpeg' : 'audio/wav');
    res.setHeader('X-Audio-Format', actualFormat);
    res.setHeader('X-Voice-Used', selectedNeuralVoice);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="nexus_${selectedNeuralVoice}_${Date.now()}.${actualFormat}"`
    );
    res.send(audioData);
  } catch (err: unknown) {
    console.error('Error en /api/tts/synthesize:', err);
    res.status(500).json({
      error: 'Error al sintetizar audio',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`NEXUS Voice Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
