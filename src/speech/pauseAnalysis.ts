/**
 * Pipeline Analisis Jeda Bicara di Perangkat (PRD Bagian 9.2)
 * 
 * FUNGSI MURNI (Pure Function)
 * Menghitung fitur jeda bicara secara lokal di perangkat tanpa menyimpan atau mengirim audio.
 */

import { SpeechFeatures } from './types';
import { CLINICAL_CONFIG } from '../config/clinical';

export interface PauseAnalysisOptions {
  frameSizeMs?: number;
  minPauseMs?: number;
  baselineNoiseSec?: number;
  minDurationSec?: number;
}

/**
 * Menghitung RMS (Root Mean Square) dari sebuah jendela sampel audio
 */
export function calculateRms(samples: Float32Array, start: number, length: number): number {
  let sumSq = 0;
  const end = Math.min(start + length, samples.length);
  const actualLength = end - start;
  if (actualLength <= 0) return 0;

  for (let i = start; i < end; i++) {
    sumSq += samples[i] * samples[i];
  }
  return Math.sqrt(sumSq / actualLength);
}

/**
 * Menganalisis sampel audio mentah untuk mendeteksi jeda dan memeriksa kualitas rekaman.
 * Fungsi murni tanpa efek samping ke luar.
 */
export function analyzeAudioSamples(
  samples: Float32Array,
  sampleRate: number,
  options?: PauseAnalysisOptions
): SpeechFeatures {
  const frameSizeMs = options?.frameSizeMs ?? CLINICAL_CONFIG.SPEECH_TASK.FRAME_SIZE_MS;
  const minPauseMs = options?.minPauseMs ?? CLINICAL_CONFIG.SPEECH_TASK.MIN_PAUSE_MS;
  const baselineNoiseSec = options?.baselineNoiseSec ?? CLINICAL_CONFIG.SPEECH_TASK.BASELINE_NOISE_DURATION_SECONDS;
  const minDurationSec = options?.minDurationSec ?? CLINICAL_CONFIG.SPEECH_TASK.QUALITY_MIN_DURATION_SECONDS;

  const totalSamples = samples.length;
  const durationSeconds = sampleRate > 0 ? totalSamples / sampleRate : 0;
  const samplesPerFrame = Math.max(1, Math.round((sampleRate * frameSizeMs) / 1000));
  const totalFrames = Math.floor(totalSamples / samplesPerFrame);

  if (totalFrames === 0) {
    return {
      taskId: 'speech_v0',
      durationSeconds: 0,
      pauseCount: 0,
      totalPauseSeconds: 0,
      pauseRatio: 0,
      meanPauseSeconds: 0,
      qualityFlags: ['too_short'],
    };
  }

  // 1. Hitung RMS per frame 30 ms
  const frameRmsList: number[] = new Array(totalFrames);
  let peakSample = 0;

  for (let f = 0; f < totalFrames; f++) {
    const start = f * samplesPerFrame;
    const rms = calculateRms(samples, start, samplesPerFrame);
    frameRmsList[f] = rms;
  }

  // Periksa clipping
  for (let i = 0; i < totalSamples; i++) {
    const absVal = Math.abs(samples[i]);
    if (absVal > peakSample) peakSample = absVal;
  }

  // 2. Tentukan ambang kebisingan awal adaptif (2 detik pertama atau persentil 15%)
  const baselineFrameCount = Math.min(
    totalFrames,
    Math.round((baselineNoiseSec * 1000) / frameSizeMs)
  );

  let baselineRmsSum = 0;
  for (let f = 0; f < baselineFrameCount; f++) {
    baselineRmsSum += frameRmsList[f];
  }
  const avgBaselineRms = baselineFrameCount > 0 ? baselineRmsSum / baselineFrameCount : 0.005;

  // Ambang suara adaptif: minimal di atas noise dasar
  const speechThreshold = Math.max(avgBaselineRms * 2.2, 0.015);

  // 3. Deteksi jeda: hening di bawah ambang selama minimal minPauseMs
  const minFramesForPause = Math.ceil(minPauseMs / frameSizeMs);
  let pauseCount = 0;
  let totalPauseFrames = 0;
  let currentSilenceFrames = 0;

  for (let f = 0; f < totalFrames; f++) {
    const isSilence = frameRmsList[f] < speechThreshold;

    if (isSilence) {
      currentSilenceFrames++;
    } else {
      if (currentSilenceFrames >= minFramesForPause) {
        pauseCount++;
        totalPauseFrames += currentSilenceFrames;
      }
      currentSilenceFrames = 0;
    }
  }

  // Cek jika jeda berlangsung hingga akhir rekaman
  if (currentSilenceFrames >= minFramesForPause) {
    pauseCount++;
    totalPauseFrames += currentSilenceFrames;
  }

  const totalPauseSeconds = (totalPauseFrames * frameSizeMs) / 1000;
  const pauseRatio = durationSeconds > 0 ? totalPauseSeconds / durationSeconds : 0;
  const meanPauseSeconds = pauseCount > 0 ? totalPauseSeconds / pauseCount : 0;

  // 4. Pemeriksaan Kualitas
  const qualityFlags: Array<'too_short' | 'high_noise' | 'clipped' | 'good'> = [];

  if (durationSeconds < minDurationSec) {
    qualityFlags.push('too_short');
  }
  if (avgBaselineRms > 0.12) {
    qualityFlags.push('high_noise');
  }
  if (peakSample >= 0.98) {
    qualityFlags.push('clipped');
  }
  if (qualityFlags.length === 0) {
    qualityFlags.push('good');
  }

  return {
    taskId: 'speech_v0',
    durationSeconds: Math.round(durationSeconds * 10) / 10,
    pauseCount,
    totalPauseSeconds: Math.round(totalPauseSeconds * 100) / 100,
    pauseRatio: Math.round(pauseRatio * 1000) / 1000,
    meanPauseSeconds: Math.round(meanPauseSeconds * 100) / 100,
    qualityFlags,
  };
}

/**
 * Generator Sampel Audio Sintetis untuk Pengujian
 * Membantu menguji algoritma tanpa memerlukan mikrofon sungguhan.
 */
export function generateSyntheticAudio(
  segments: Array<{ kind: 'speech' | 'silence'; durationSeconds: number }>,
  sampleRate = 16000
): Float32Array {
  const totalDuration = segments.reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalSamples = Math.round(totalDuration * sampleRate);
  const buffer = new Float32Array(totalSamples);

  let currentSample = 0;

  for (const seg of segments) {
    const segSamples = Math.round(seg.durationSeconds * sampleRate);
    const endSample = Math.min(currentSample + segSamples, totalSamples);

    for (let i = currentSample; i < endSample; i++) {
      const t = (i - currentSample) / sampleRate;

      if (seg.kind === 'speech') {
        // Nada suara sintetis (komponen 180Hz, 360Hz, 720Hz dengan modulasi)
        const fundamental = Math.sin(2 * Math.PI * 180 * t);
        const harmonic = 0.5 * Math.sin(2 * Math.PI * 360 * t);
        const overtone = 0.25 * Math.sin(2 * Math.PI * 720 * t);
        // Modulasi laju bicara ~ 3Hz
        const envelope = 0.7 + 0.3 * Math.sin(2 * Math.PI * 3 * t);
        // Desisan ringan
        const noise = (Math.random() - 0.5) * 0.02;

        buffer[i] = (fundamental + harmonic + overtone) * 0.25 * envelope + noise;
      } else {
        // Hening dengan noise latar belakang mikroskopis (ambient noise)
        buffer[i] = (Math.random() - 0.5) * 0.003;
      }
    }

    currentSample = endSample;
  }

  return buffer;
}
