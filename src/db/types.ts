/**
 * Skema Data Lokal CogniCare (PRD Bagian 7)
 * Seluruh data disimpan lokal di browser (IndexedDB) via Dexie.
 */

import { SpeechFeatures } from '../speech/types';

export interface UserProfile {
  id: string;
  createdAt: number;
  age: number;
  educationLevel: string; // 'tidak_sekolah_sd' | 'smp' | 'sma_smk' | 'diploma_sarjana'
  primaryLanguage: string; // 'indonesia' | 'jawa' | 'sunda' | 'lainnya'
  hasInformant: boolean;
  informantRelation?: string; // 'anak', 'pasangan', 'kerabat', 'kader'
}

export interface UserConsent {
  id: string;
  profileId: string;
  basicDataConsented: boolean;
  basicDataAt: number | null;
  voiceConsented: boolean;
  voiceAt: number | null;
  revokedAt: number | null;
}

export interface SleepSummary {
  avgHours: number;
  insomniaFlag: boolean;
  nightWakingFlag: boolean;
  apneaScreenFlag: boolean;
  daytimeSleepinessFlag: boolean;
}

export interface BodyMeasurements {
  heightCm: number;
  weightKg: number;
  calculatedBmi: number;
}

export interface AssessmentRecord {
  id: string;
  profileId: string;
  createdAt: number;
  isDemo: boolean;
  ad8Answers: Record<string, 'yes' | 'no' | 'unknown'>;
  ad8Score: number;
  ad8AnsweredCount: number;
  complaintIds: string[];
  complaintsCount: number;
  riskFactorStatuses?: Record<string, 'present' | 'absent' | 'unknown'>;
  bodyMeasurements?: BodyMeasurements;
  sleepSummary?: SleepSummary;
  speechFeatures?: SpeechFeatures;
}
