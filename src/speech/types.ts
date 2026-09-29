/**
 * Definisi Tipe Data Analisis Jeda Suara di Perangkat (PRD Bagian 9.2)
 * PENTING: Audio dibuang dari memori dan TIDAK disimpan / dikirim.
 */

export interface SpeechFeatures {
  taskId: string;
  durationSeconds: number;
  pauseCount: number;
  totalPauseSeconds: number;
  pauseRatio: number; // total jeda / durasi
  meanPauseSeconds: number;
  qualityFlags: Array<'too_short' | 'high_noise' | 'clipped' | 'good'>;
}
