/**
 * CogniCare Clinical Configuration
 * 
 * PENTING:
 * Semua nilai dan ambang batas di berkas ini adalah:
 * DRAF, belum divalidasi klinis, menunggu keputusan dokter pembimbing dan tim.
 * Aplikasi ini adalah instrumen skrining risiko awal, bukan diagnosis medis.
 */

export const CLINICAL_CONFIG = {
  ENGINE_VERSION: '0.1.0-draft',
  
  // Ambang batas AD8-INA
  // DRAF, belum divalidasi klinis, menunggu keputusan dokter
  AD8_THRESHOLDS: {
    HIGH_RISK_MIN: 3,    // AD8 >= 3 -> Risiko Tinggi
    MODERATE_RISK: 2,    // AD8 == 2 -> Risiko Sedang
    LOW_RISK_MAX: 1,     // AD8 <= 1 -> Risiko Rendah (kecuali keluhan >= 3)
    COMPLAINTS_TRIGGER_FOR_MODERATE: 3, // Jika AD8 <= 1 tetapi keluhan subjektif >= 3 -> Risiko Sedang
  },

  // Kriteria tingkat keyakinan (Confidence Level)
  CONFIDENCE_CRITERIA: {
    HIGH_MIN_ITEMS: 7,     // Informan ada & butir terjawab >= 7
    MODERATE_MIN_ITEMS: 5, // Informan ada & butir terjawab 5-6
    // Tanpa informan atau butir terjawab < 5 -> Rendah
  },

  // Parameter Analisis Bicara (Speech Task) - PRD Bagian 9.2
  // DRAF, dihitung lokal di browser tanpa menyimpan file audio
  SPEECH_TASK: {
    MIN_PAUSE_MS: 500,        // Batas jeda minimal 500 ms (hening dihitung jeda)
    MIN_DURATION_SECONDS: 60, // Durasi rekam minimal 60 detik
    MAX_DURATION_SECONDS: 90, // Durasi rekam maksimal 90 detik
    FRAME_SIZE_MS: 30,        // Jendela frame RMS 30 ms
    BASELINE_NOISE_DURATION_SECONDS: 2, // Referensi kebisingan awal 2 detik
    QUALITY_MIN_DURATION_SECONDS: 30,   // Penanda kualitas 'too_short' bila < 30 detik
    PROMPT_TEXT: 'Ceritakan kegiatan Ibu/Bapak kemarin dari pagi sampai malam.',
  },

  // Batasan Usia Sasaran
  TARGET_AGE: {
    RECOMMENDED_MIN: 50,
  },
} as const;
