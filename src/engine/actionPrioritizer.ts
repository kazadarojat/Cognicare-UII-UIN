/**
 * Prioritisasi Rencana Pengurangan Risiko (PRD F9)
 * 
 * FUNGSI MURNI (Pure Function)
 * Memilih maksimal 3 prioritas teratas dari katalog actions.json.
 * Faktor yang berstatus 'unknown' diubah menjadi saran pemeriksaan di faskes.
 * Bebas klaim mencegah penyakit, tanpa nama/dosis obat.
 */

import actionsData from '../config/actions.json';
import { SleepSummary } from '../db/types';

export interface PrioritizedAction {
  id: string;
  factorName: string;
  type: 'lifestyle' | 'screening_recommendation';
  title: string;
  reason: string;
  concreteStep: string;
  priorityBadge: string;
}

export function getPrioritizedActions(
  riskFactorStatuses: Record<string, 'present' | 'absent' | 'unknown'> = {},
  sleepSummary?: SleepSummary
): PrioritizedAction[] {
  const allActions = actionsData.actions;

  // 1. Kumpulkan faktor risiko yang ADA (status: 'present')
  const presentActions: PrioritizedAction[] = [];

  // 2. Kumpulkan faktor risiko yang BELUM DIPERIKSA (status: 'unknown') -> Saran Pemeriksaan
  const unknownActions: PrioritizedAction[] = [];

  for (const item of allActions) {
    const status = riskFactorStatuses[item.factorId];

    if (status === 'present') {
      presentActions.push({
        id: item.factorId,
        factorName: item.factorName,
        type: 'lifestyle',
        title: `Langkah Gaya Hidup: ${item.factorName}`,
        reason: item.reason,
        concreteStep: item.concreteStep,
        priorityBadge: '',
      });
    } else if (status === 'unknown') {
      unknownActions.push({
        id: item.factorId,
        factorName: item.factorName,
        type: 'screening_recommendation',
        title: `Saran Pemeriksaan: ${item.factorName}`,
        reason: item.reason,
        concreteStep: item.unknownAdvice,
        priorityBadge: '',
      });
    }
  }

  // Jika ada masalah tidur yang signifikan, tambahkan sebagai kandidat gaya hidup
  if (sleepSummary && (sleepSummary.avgHours < 6 || sleepSummary.apneaScreenFlag || sleepSummary.insomniaFlag)) {
    presentActions.unshift({
      id: 'sleep_hygiene',
      factorName: 'Kualitas & Kebersihan Tidur',
      type: 'lifestyle',
      title: 'Langkah Gaya Hidup: Perbaikan Pola Tidur',
      reason: 'Tidur yang cukup dan berkualitas mendukung proses alami pembersihan sisa metabolisme di otak.',
      concreteStep: 'Ciptakan jam tidur yang konsisten setiap malam, redupkan lampu kamar, hindari layar gadget 1 jam sebelum tidur, dan konsultasikan ke faskes bila mendengkur keras disertai napas tertahan.',
      priorityBadge: '',
    });
  }

  // Gabungkan: prioritas pertama adalah faktor yang ada (present), disusul saran pemeriksaan (unknown)
  const combined = [...presentActions, ...unknownActions];

  // Bila hasil gabungan masih kurang dari 3, tambahkan saran umum gaya hidup aktif & stimulasi otak
  if (combined.length < 3) {
    const fallbackIds = ['physical_inactivity', 'social_isolation', 'low_education'];
    for (const fbId of fallbackIds) {
      if (combined.length >= 3) break;
      if (!combined.some((c) => c.id === fbId)) {
        const item = allActions.find((a) => a.factorId === fbId);
        if (item) {
          combined.push({
            id: item.factorId,
            factorName: item.factorName,
            type: 'lifestyle',
            title: `Langkah Gaya Hidup: ${item.factorName}`,
            reason: item.reason,
            concreteStep: item.concreteStep,
            priorityBadge: '',
          });
        }
      }
    }
  }

  // Ambil maksimal 3 prioritas teratas
  const topThree = combined.slice(0, 3).map((action, idx) => ({
    ...action,
    priorityBadge: `Prioritas ${idx + 1}`,
  }));

  return topThree;
}
