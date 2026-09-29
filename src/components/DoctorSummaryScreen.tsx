import React from 'react';
import { ArrowLeft, Printer, ShieldAlert, CheckCircle2, User, Activity, Moon, Mic, Calendar, FileText, Info, HelpCircle } from 'lucide-react';
import { UserProfile, UserConsent, AssessmentRecord } from '../db/types';
import { evaluateRisk } from '../engine/riskEngine';
import { getPrioritizedActions } from '../engine/actionPrioritizer';
import riskConfig from '../config/riskFactors.json';
import complaintsConfig from '../config/complaints.json';
import { CLINICAL_CONFIG } from '../config/clinical';

interface DoctorSummaryScreenProps {
  profile: UserProfile;
  consent: UserConsent | null;
  assessment: AssessmentRecord;
  onBack: () => void;
}

export const DoctorSummaryScreen: React.FC<DoctorSummaryScreenProps> = ({
  profile,
  consent,
  assessment,
  onBack,
}) => {
  const riskResult = evaluateRisk({
    ad8Score: assessment.ad8Score || 0,
    ad8AnsweredCount: assessment.ad8AnsweredCount || 8,
    hasInformant: profile.hasInformant,
    complaintsCount: assessment.complaintsCount || 0,
    profile,
    riskFactorStatuses: assessment.riskFactorStatuses,
    sleepSummary: assessment.sleepSummary,
    speechFeatures: assessment.speechFeatures,
  });

  const prioritizedActions = getPrioritizedActions(
    assessment.riskFactorStatuses,
    assessment.sleepSummary
  );

  const handlePrint = () => {
    window.print();
  };

  const assessmentDate = new Date(assessment.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const educationMap: Record<string, string> = {
    tidak_sekolah_sd: 'Tidak Sekolah / SD',
    smp: 'SMP / Sederajat',
    sma_smk: 'SMA / SMK / Sederajat',
    diploma_sarjana: 'Diploma / Sarjana (D3/S1/S2)',
  };

  const languageMap: Record<string, string> = {
    indonesia: 'Bahasa Indonesia',
    jawa: 'Bahasa Jawa',
    sunda: 'Bahasa Sunda',
    lainnya: 'Bahasa Daerah Lainnya',
  };

  const informantMap: Record<string, string> = {
    anak: 'Anak Kandung',
    pasangan: 'Suami / Istri',
    kerabat: 'Kerabat / Saudara',
    kader: 'Kader Kesehatan / Pendamping',
    lainnya: 'Lainnya',
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 text-slate-900">
      {/* Bar Aksi Atas (Disembunyikan saat mencetak) */}
      <div className="no-print bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-900/10 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Dokumen Lembar Cetak Dokter (CSS Print Friendly) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xs space-y-5 print:p-0 print:border-none print:shadow-none">
        {/* Kop Lembar Rujukan Skrining */}
        <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 block">
              Lembar Ringkasan Skrining Awal Kognitif Lansia
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Instrumen CogniCare (PRD v0)
            </h1>
            <span className="text-xs text-slate-500 block mt-0.5">
              Untuk bahan diskusi pemeriksaan bersama Dokter Umum / Spesialis Saraf
            </span>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-700 block">Tanggal Penilaian:</span>
            <span className="text-slate-900 font-semibold">{assessmentDate}</span>
          </div>
        </div>

        {/* Peringatan Klinis Wajib */}
        <div className="p-2.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Pemberitahuan Klinis:</strong> Ini hasil skrining, bukan diagnosis. Prototipe, belum divalidasi.
          </div>
        </div>

        {/* 1. Profil Pasien & Informan */}
        <div className="space-y-1.5 text-xs">
          <h2 className="font-extrabold uppercase text-[11px] tracking-wider text-slate-700 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-600" />
            1. Profil & Pengisi Penilaian
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Usia:</span>
              <span className="font-bold text-slate-900">{profile.age} Tahun</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pendidikan:</span>
              <span className="font-bold text-slate-900">{educationMap[profile.educationLevel] || profile.educationLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Bahasa Sehari-hari:</span>
              <span className="font-bold text-slate-900">{languageMap[profile.primaryLanguage] || profile.primaryLanguage}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Metode Pengisian:</span>
              <span className="font-bold text-slate-900">
                {profile.hasInformant
                  ? `Didampingi (${informantMap[profile.informantRelation || ''] || 'Pendamping'})`
                  : 'Mandiri (Tanpa Informan)'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Ringkasan Tingkat Risiko & Keyakinan */}
        <div className="space-y-1.5 text-xs">
          <h2 className="font-extrabold uppercase text-[11px] tracking-wider text-slate-700 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-600" />
            2. Hasil Evaluasi Risiko Awal
          </h2>
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-slate-500 block">Tingkat Risiko:</span>
              <span
                className={`text-sm font-black uppercase tracking-wider block mt-0.5 ${
                  riskResult.level === 'tinggi'
                    ? 'text-rose-700'
                    : riskResult.level === 'sedang'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                Risiko {riskResult.level}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Tingkat Keyakinan:</span>
              <span className="text-sm font-bold capitalize text-slate-900 block mt-0.5">
                {riskResult.confidence}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Skor AD8-INA:</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {assessment.ad8Score} dari 8 Butir Perubahan
              </span>
            </div>
          </div>
        </div>

        {/* 3. Keluhan Kognitif Subjektif */}
        <div className="space-y-1.5 text-xs">
          <h2 className="font-extrabold uppercase text-[11px] tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            3. Keluhan Subjektif yang Dilaporkan ({assessment.complaintsCount} Keluhan)
          </h2>
          {assessment.complaintIds && assessment.complaintIds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {assessment.complaintIds.map((cId) => {
                const item = complaintsConfig.items.find((c: { id: string; text: string }) => c.id === cId);
                return (
                  <div key={cId} className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800">
                    • {item ? item.text : cId}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 italic p-1.5">Tidak ada keluhan subjektif yang dipilih.</p>
          )}
        </div>

        {/* 4. Faktor Risiko Gaya Hidup (Lancet 2024) Termasuk Status Unknown */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h2 className="font-extrabold uppercase text-[11px] tracking-wider text-slate-700">
              4. Faktor Risiko Gaya Hidup (14 Faktor Lancet 2024)
            </h2>
            {assessment.bodyMeasurements && (
              <span className="text-[11px] text-slate-700 font-semibold">
                TB: {assessment.bodyMeasurements.heightCm} cm | BB: {assessment.bodyMeasurements.weightKg} kg | IMT: {assessment.bodyMeasurements.calculatedBmi} kg/m²
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {riskConfig.factors.map((f) => {
              const status = assessment.riskFactorStatuses?.[f.id] || 'absent';
              return (
                <div
                  key={f.id}
                  className={`p-1.5 rounded-lg border flex items-center justify-between text-[11px] ${
                    status === 'present'
                      ? 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                      : status === 'unknown'
                      ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-1">{f.label}</span>
                  <span className="shrink-0 uppercase text-[9px] px-1 rounded font-extrabold">
                    {status === 'present' ? 'ADA' : status === 'unknown' ? 'BELUM CEK' : 'TIDAK'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Pola Tidur & Fitur Suara di Perangkat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Tidur */}
          <div className="space-y-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-700" />
              Pola Tidur (PRD F6)
            </h3>
            {assessment.sleepSummary ? (
              <div className="space-y-0.5 text-[11px] text-slate-700">
                <div>Durasi Rata-rata: <strong>{assessment.sleepSummary.avgHours} Jam/Malam</strong></div>
                <div>Sulit Memulai/Insomnia: {assessment.sleepSummary.insomniaFlag ? 'Ya, sering' : 'Tidak'}</div>
                <div>Sering Terbangun Malam: {assessment.sleepSummary.nightWakingFlag ? 'Ya' : 'Tidak'}</div>
                <div>Mendengkur/Henti Napas: {assessment.sleepSummary.apneaScreenFlag ? 'Ya, dilaporkan' : 'Tidak'}</div>
                <div>Rasa Kantuk Siang Hari: {assessment.sleepSummary.daytimeSleepinessFlag ? 'Ya, sering' : 'Tidak'}</div>
              </div>
            ) : (
              <span className="text-slate-500 italic text-[11px]">Belum diisi.</span>
            )}
          </div>

          {/* Bicara */}
          <div className="space-y-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-teal-700" />
              Analisis Jeda Bicara di Perangkat (PRD F7)
            </h3>
            {assessment.speechFeatures ? (
              <div className="space-y-0.5 text-[11px] text-slate-700">
                <div>Durasi Rekaman: <strong>{assessment.speechFeatures.durationSeconds} Detik</strong></div>
                <div>Jumlah Jeda (&ge;500ms): <strong>{assessment.speechFeatures.pauseCount} Jeda</strong></div>
                <div>Total Waktu Jeda: <strong>{assessment.speechFeatures.totalPauseSeconds} Detik</strong></div>
                <div>Rasio Jeda: <strong>{assessment.speechFeatures.pauseRatio}</strong></div>
                <div>Kualitas Sinyal: <strong className="capitalize">{assessment.speechFeatures.qualityFlags.join(', ')}</strong></div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">Audio tidak disimpan; hanya fitur numerik.</div>
              </div>
            ) : (
              <span className="text-slate-500 italic text-[11px]">Tugas bicara dilewati atau belum dilakukan.</span>
            )}
          </div>
        </div>

        {/* 6. Saran Tindak Lanjut / Prioritas Diskusi Dokter (PRD F9) */}
        <div className="space-y-1.5 text-xs">
          <h2 className="font-extrabold uppercase text-[11px] tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            6. Saran Prioritas Pemeriksaan / Diskusi Faskes
          </h2>
          <div className="space-y-1.5">
            {prioritizedActions.map((act) => (
              <div key={act.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] leading-relaxed">
                <span className="font-bold text-slate-950 block">
                  [{act.priorityBadge}] {act.title}
                </span>
                <span className="text-slate-700">{act.concreteStep}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Catatan Dokter Pemeriksa */}
        <div className="pt-3 border-t border-slate-300 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold block">Catatan Tambahan Dokter:</span>
            <div className="h-14 border border-dashed border-slate-300 rounded-lg" />
          </div>
          <div className="text-right space-y-10">
            <span className="text-slate-500 font-semibold block">Tanda Tangan / Cap Faskes:</span>
            <span className="text-slate-400 block text-[10px]">(...................................................)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
