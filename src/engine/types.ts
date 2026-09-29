/**
 * Definisi Tipe Data Risk Engine CogniCare (PRD Bagian 9.1)
 */

import { UserProfile, SleepSummary } from '../db/types';
import { SpeechFeatures } from '../speech/types';

export type RiskLevel = 'rendah' | 'sedang' | 'tinggi';
export type ConfidenceLevel = 'rendah' | 'sedang' | 'tinggi';

export interface SupportingIndicator {
  kind: 'bicara' | 'tidur';
  text: string;
}

export interface RiskResult {
  level: RiskLevel;
  confidence: ConfidenceLevel;
  contributingFactors: string[];
  supportingIndicators: SupportingIndicator[];
  confounderNotes: string[];
  engineVersion: string;
}

export interface AssessmentInput {
  ad8Score: number;
  ad8AnsweredCount: number;
  hasInformant: boolean;
  complaintsCount: number;
  profile?: UserProfile;
  riskFactorStatuses?: Record<string, 'present' | 'absent' | 'unknown'>;
  sleepSummary?: SleepSummary;
  speechFeatures?: SpeechFeatures;
  isDemo?: boolean;
}

export interface TestCase {
  id: number;
  ad8Score: number;
  answeredCount: number;
  hasInformant: boolean;
  complaintsCount: number;
  expectedLevel: RiskLevel;
  expectedConfidence: ConfidenceLevel;
  description: string;
}
