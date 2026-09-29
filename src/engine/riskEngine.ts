/**
 * CogniCare Risk Engine v0 (Berbasis Aturan / Rule-Based)
 * PRD Bagian 9.1
 * 
 * PENTING:
 * Seluruh ambang skor dan aturan di berkas ini adalah:
 * DRAF, belum divalidasi klinis, menunggu keputusan dokter pembimbing dan tim.
 * Aplikasi ini adalah skrining awal risiko, bukan diagnosis medis.
 */

import { CLINICAL_CONFIG } from '../config/clinical';
import { AssessmentInput, RiskResult, RiskLevel, ConfidenceLevel, TestCase } from './types';

/**
 * Menghitung tingkat risiko dan tingkat keyakinan (Fungsi Murni)
 */
export function evaluateRisk(input: AssessmentInput): RiskResult {
  const {
    ad8Score,
    ad8AnsweredCount,
    hasInformant,
    complaintsCount,
    profile,
    riskFactorStatuses,
    sleepSummary,
    speechFeatures,
  } = input;

  const thresholds = CLINICAL_CONFIG.AD8_THRESHOLDS;
  const confidenceCriteria = CLINICAL_CONFIG.CONFIDENCE_CRITERIA;

  // 1. Tentukan Tingkat Risiko (Aturan PRD Bagian 9.1)
  // DRAF, belum divalidasi klinis
  let level: RiskLevel;
  if (ad8Score >= thresholds.HIGH_RISK_MIN) {
    // AD8 >= 3 -> Risiko Tinggi
    level = 'tinggi';
  } else if (
    ad8Score === thresholds.MODERATE_RISK ||
    (ad8Score <= thresholds.LOW_RISK_MAX && complaintsCount >= thresholds.COMPLAINTS_TRIGGER_FOR_MODERATE)
  ) {
    // AD8 == 2, ATAU (AD8 <= 1 DAN keluhan >= 3) -> Risiko Sedang
    level = 'sedang';
  } else {
    // Selain kondisi di atas -> Risiko Rendah
    level = 'rendah';
  }

  // 2. Tentukan Tingkat Keyakinan Hasil (Confidence Level)
  // DRAF, belum divalidasi klinis
  let confidence: ConfidenceLevel;
  if (!hasInformant || ad8AnsweredCount < confidenceCriteria.MODERATE_MIN_ITEMS) {
    // Tanpa informan atau < 5 butir terjawab -> Rendah
    confidence = 'rendah';
  } else if (ad8AnsweredCount >= confidenceCriteria.HIGH_MIN_ITEMS) {
    // Ada informan dan >= 7 butir terjawab -> Tinggi
    confidence = 'tinggi';
  } else {
    // Ada informan dan 5-6 butir terjawab -> Sedang
    confidence = 'sedang';
  }

  // 3. Faktor yang Berkontribusi pada Tingkat Risiko
  const contributingFactors: string[] = [];
  contributingFactors.push(`Skor kuesioner observasi AD8-INA: ${ad8Score} dari 8 butir perubahan diamati.`);
  contributingFactors.push(`Jumlah keluhan kognitif subjektif: ${complaintsCount} keluhan dirasakan.`);
  if (!hasInformant) {
    contributingFactors.push('Kuesioner diisi mandiri tanpa pendamping (mengurangi keandalan penilaian observasi).');
  }

  // 4. Indikator Pendukung (Bicara dan Tidur) - Bahasa Netral, Tidak Mengubah Tingkat Risiko
  const supportingIndicators: Array<{ kind: 'bicara' | 'tidur'; text: string }> = [];

  if (speechFeatures) {
    const pausePct = Math.round(speechFeatures.pauseRatio * 100);
    supportingIndicators.push({
      kind: 'bicara',
      text: `Pada rekaman narasi, terukur pola jeda dengan rasio ${pausePct}% (${speechFeatures.pauseCount} jeda, rerata ${speechFeatures.meanPauseSeconds} detik) sebagai indikator akustik pendukung tanpa klaim diagnostik.`,
    });
  }

  if (sleepSummary) {
    const sleepIssues: string[] = [];
    if (sleepSummary.avgHours < 6) sleepIssues.push(`durasi tidur ${sleepSummary.avgHours} jam/malam`);
    if (sleepSummary.insomniaFlag) sleepIssues.push('kesulitan memulai/mempertahankan tidur');
    if (sleepSummary.apneaScreenFlag) sleepIssues.push('tanda dengkuran keras atau jeda napas');
    if (sleepSummary.daytimeSleepinessFlag) sleepIssues.push('kantuk berlebih di siang hari');

    if (sleepIssues.length > 0) {
      supportingIndicators.push({
        kind: 'tidur',
        text: `Tercatat potensi gangguan kenyamanan tidur (${sleepIssues.join(', ')}) yang dapat memengaruhi kebugaran harian.`,
      });
    } else {
      supportingIndicators.push({
        kind: 'tidur',
        text: `Pola tidur dilaporkan relatif cukup dan stabil (${sleepSummary.avgHours} jam/malam).`,
      });
    }
  }

  // 5. Catatan Perancu (Confounder Notes) - Hal-hal yang dapat membiaskan hasil
  const confounderNotes: string[] = [];

  if (riskFactorStatuses?.hearing_loss === 'present') {
    confounderNotes.push('Gangguan pendengaran dapat memengaruhi kelancaran komunikasi dan pemahaman percakapan.');
  }

  if (profile?.educationLevel === 'tidak_sekolah_sd') {
    confounderNotes.push('Tingkat pendidikan dasar dapat memengaruhi pemahaman dan interpretasi butir kuesioner.');
  }

  if (profile?.primaryLanguage && profile.primaryLanguage !== 'indonesia') {
    const langName = profile.primaryLanguage.charAt(0).toUpperCase() + profile.primaryLanguage.slice(1);
    confounderNotes.push(`Bahasa sehari-hari adalah Bahasa ${langName}, sedangkan instrumen evaluasi menggunakan Bahasa Indonesia.`);
  }

  if (riskFactorStatuses?.depression === 'present') {
    confounderNotes.push('Riwayat suasana hati sedih / depresi dapat menimbulkan keluhan konsentrasi dan mudah lupa fungsional sementara.');
  }

  if (sleepSummary && (sleepSummary.avgHours < 6 || sleepSummary.apneaScreenFlag)) {
    confounderNotes.push('Kurang tidur atau tanda henti napas dapat menyebabkan kelelahan dan penurunan fokus di siang hari.');
  }

  if (profile && profile.age < CLINICAL_CONFIG.TARGET_AGE.RECOMMENDED_MIN) {
    confounderNotes.push(`Usia yang diskrining (${profile.age} tahun) berada di bawah sasaran utama skrining lansia (50+ tahun).`);
  }

  return {
    level,
    confidence,
    contributingFactors,
    supportingIndicators,
    confounderNotes,
    engineVersion: CLINICAL_CONFIG.ENGINE_VERSION,
  };
}

/**
 * 8 Kasus Uji Sintetis Wajib (PRD Bagian 9.1)
 */
export const SYNTHETIC_TEST_CASES: TestCase[] = [
  {
    id: 1,
    ad8Score: 0,
    answeredCount: 8,
    hasInformant: true,
    complaintsCount: 0,
    expectedLevel: 'rendah',
    expectedConfidence: 'tinggi',
    description: 'Skor AD8 0, informan lengkap, tanpa keluhan',
  },
  {
    id: 2,
    ad8Score: 1,
    answeredCount: 8,
    hasInformant: true,
    complaintsCount: 2,
    expectedLevel: 'rendah',
    expectedConfidence: 'tinggi',
    description: 'Skor AD8 1, informan lengkap, keluhan 2 (<3)',
  },
  {
    id: 3,
    ad8Score: 1,
    answeredCount: 8,
    hasInformant: true,
    complaintsCount: 3,
    expectedLevel: 'sedang',
    expectedConfidence: 'tinggi',
    description: 'Skor AD8 1, informan lengkap, keluhan 3 (memicu Sedang)',
  },
  {
    id: 4,
    ad8Score: 2,
    answeredCount: 8,
    hasInformant: true,
    complaintsCount: 0,
    expectedLevel: 'sedang',
    expectedConfidence: 'tinggi',
    description: 'Skor AD8 2, informan lengkap, keluhan 0',
  },
  {
    id: 5,
    ad8Score: 3,
    answeredCount: 8,
    hasInformant: true,
    complaintsCount: 1,
    expectedLevel: 'tinggi',
    expectedConfidence: 'tinggi',
    description: 'Skor AD8 3 (memicu Tinggi), informan lengkap',
  },
  {
    id: 6,
    ad8Score: 5,
    answeredCount: 6,
    hasInformant: true,
    complaintsCount: 4,
    expectedLevel: 'tinggi',
    expectedConfidence: 'sedang',
    description: 'Skor AD8 5 (Tinggi), terjawab 6 butir (Keyakinan Sedang)',
  },
  {
    id: 7,
    ad8Score: 1,
    answeredCount: 8,
    hasInformant: false,
    complaintsCount: 0,
    expectedLevel: 'rendah',
    expectedConfidence: 'rendah',
    description: 'Skor AD8 1 (Rendah), tanpa informan (Keyakinan Rendah)',
  },
  {
    id: 8,
    ad8Score: 2,
    answeredCount: 4,
    hasInformant: true,
    complaintsCount: 1,
    expectedLevel: 'sedang',
    expectedConfidence: 'rendah',
    description: 'Skor AD8 2 (Sedang), terjawab 4 butir <5 (Keyakinan Rendah)',
  },
];
