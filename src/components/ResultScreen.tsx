import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Activity,
  Moon,
  Mic,
  Info,
  Sparkles,
  Stethoscope,
  HeartPulse,
  History,
  FileText,
  Share2,
  Calendar
} from 'lucide-react';
import { RiskResult } from '../engine/types';
import { UserProfile, AssessmentRecord } from '../db/types';
import { getPrioritizedActions } from '../engine/actionPrioritizer';

interface ResultScreenProps {
  riskResult: RiskResult;
  profile: UserProfile;
  assessment: AssessmentRecord;
  onViewMyData: () => void;
  onOpenRulesTest: () => void;
  onOpenHistory?: () => void;
  onOpenDoctorSummary?: () => void;
  onOpenDeleteModal: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  riskResult,
  profile,
  assessment,
  onViewMyData,
  onOpenRulesTest,
  onOpenHistory,
  onOpenDoctorSummary,
  onOpenDeleteModal,
}) => {
  // Ambil maksimal 3 prioritas teratas rencana pengurangan risiko (PRD F9)
  const prioritizedActions = getPrioritizedActions(
    assessment.riskFactorStatuses,
    assessment.sleepSummary
  );

  // Pengelompokan warna & teks non-diagnostik berdasarkan tingkat risiko
  const getLevelDetails = () => {
    switch (riskResult.level) {
      case 'tinggi':
        return {
          title: 'Tingkat Risiko: Tinggi',
          colorBadge: 'bg-rose-100 text-rose-950 border-rose-300',
          containerBorder: 'border-rose-300 bg-rose-50/60',
          icon: <AlertTriangle className="w-9 h-9 text-rose-600" />,
          summaryText:
            'Hasil skrining menunjukkan risiko gangguan kognitif yang tinggi. Ini bukan diagnosis. Kami menyarankan Anda berkonsultasi ke dokter di Puskesmas atau Poli Saraf untuk evaluasi menyeluruh.',
        };
      case 'sedang':
        return {
          title: 'Tingkat Risiko: Sedang',
          colorBadge: 'bg-amber-100 text-amber-950 border-amber-300',
          containerBorder: 'border-amber-300 bg-amber-50/60',
          icon: <AlertCircle className="w-9 h-9 text-amber-600" />,
          summaryText:
            'Ada beberapa indikasi yang perlu diperhatikan. Kami menyarankan pemeriksaan tekanan darah, gula darah, dan pendengaran di faskes terdekat, serta evaluasi gaya hidup berkala.',
        };
      case 'rendah':
      default:
        return {
          title: 'Tingkat Risiko: Rendah',
          colorBadge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          containerBorder: 'border-emerald-300 bg-emerald-50/60',
          icon: <CheckCircle2 className="w-9 h-9 text-emerald-600" />,
          summaryText:
            'Saat ini tidak ditemukan perubahan kognitif yang signifikan. Pertahankan gaya hidup sehat, aktivitas fisik, stimulasi otak, serta ulangi skrining setiap 6–12 bulan.',
        };
    }
  };

  const getConfidenceDetails = () => {
    switch (riskResult.confidence) {
      case 'tinggi':
        return {
          label: 'Tinggi',
          desc: 'Didampingi keluarga/pengamat, butir kuesioner terisi lengkap, dan data faktor risiko tercatat baik.',
          badge: 'bg-teal-100 text-teal-950 border-teal-300',
        };
      case 'sedang':
        return {
          label: 'Sedang',
          desc: 'Pengisian lengkap namun sebagian data pendukung belum terisi penuh.',
          badge: 'bg-amber-100 text-amber-950 border-amber-300',
        };
      case 'rendah':
      default:
        return {
          label: 'Rendah',
          desc: 'Diisi mandiri tanpa pendamping atau butir yang terjawab sangat sedikit.',
          badge: 'bg-slate-200 text-slate-800 border-slate-300',
        };
    }
  };

  const levelInfo = getLevelDetails();
  const confidenceInfo = getConfidenceDetails();

  return (
    <div className="w-full space-y-6">
      {/* Peringatan Medis Wajib Terpampang Jelas */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl flex items-start gap-3.5 text-amber-950">
        <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-0.5">
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 block">
            Pemberitahuan Medis Wajib
          </span>
          <p className="text-base font-bold leading-snug">
            Ini hasil skrining, bukan diagnosis. Prototipe, belum divalidasi.
          </p>
          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed mt-1">
            Skrining ini bertujuan untuk deteksi awal risiko dan panduan gaya hidup sehat, bukan pengganti pemeriksaan medis oleh dokter spesialis saraf atau dokter umum.
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        DASHBOARD GRID TATA LETAK DESKTOP (≥1024px)
        - Kolom Kiri (lg:col-span-5): Kartu Tingkat Risiko + Keyakinan + Lembar Dokter
        - Kolom Kanan (lg:col-span-7): 3 Rencana Prioritas, Faktor Kontribusi, Indikator
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: STATUS RISIKO UTAMA & AKSI DOKTER (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Kartu Utama Hasil Risiko */}
          <div className={`rounded-3xl p-6 sm:p-7 border-2 shadow-xs space-y-5 ${levelInfo.containerBorder}`}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {levelInfo.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Hasil Skrining Awal
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
                    {levelInfo.title}
                  </h1>
                </div>
              </div>

              <div>
                <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border ${confidenceInfo.badge}`}>
                  Keyakinan {confidenceInfo.label}
                </span>
              </div>
            </div>

            <p className="text-base text-slate-800 leading-relaxed font-medium">
              {levelInfo.summaryText}
            </p>

            <div className="text-xs text-slate-600 bg-white/90 p-3.5 rounded-2xl border border-slate-200">
              <strong className="block text-slate-900 mb-0.5">Keterangan Keyakinan:</strong>
              {confidenceInfo.desc}
            </div>

            {/* Tombol Cetak / Bawa ke Dokter */}
            {onOpenDoctorSummary && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenDoctorSummary}
                  className="w-full min-h-[50px] px-5 py-3 text-base font-bold text-white bg-teal-800 hover:bg-teal-900 active:scale-[0.99] rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Buka Lembar Ringkasan Dokter</span>
                </button>
              </div>
            )}
          </div>

          {/* Catatan Perancu (Confounders) */}
          {riskResult.confounders.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-950 font-bold text-base">
                <Info className="w-5 h-5 text-indigo-700" />
                <span>Catatan Faktor Perancu</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Faktor latar belakang berikut memengaruhi interpretasi skor observasi:
              </p>
              <ul className="space-y-2">
                {riskResult.confounders.map((c, idx) => (
                  <li key={idx} className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs sm:text-sm text-indigo-950 leading-relaxed">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Akses Cepat Riwayat */}
          {onOpenHistory && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-700" />
                  Pemantauan Berkala
                </span>
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                >
                  Lihat Riwayat & Grafik
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Disarankan mengulang skrining setiap 3–6 bulan sekali untuk memantau stabilitas daya ingat.
              </p>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: RENCANA AKSI & FAKTOR KONTRIBUSI (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Rencana 3 Langkah Pengurangan Risiko (PRD F9) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-teal-900 bg-teal-100 border border-teal-200 px-2.5 py-0.5 rounded-full inline-block">
                  DRAF, perlu tinjauan dokter
                </span>
                <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2 mt-1">
                  <HeartPulse className="w-5 h-5 text-teal-700" />
                  Rencana Pengurangan Risiko (3 Prioritas Teratas)
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Berikut adalah langkah konkret sederhana yang dapat diprioritaskan. Faktor yang belum pernah diperiksa otomatis dicatat sebagai anjuran pemeriksaan di faskes:
            </p>

            <div className="space-y-3.5 pt-1">
              {prioritizedActions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
                    action.type === 'screening_recommendation'
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-teal-50/60 border-teal-300'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                      {action.priorityBadge}
                    </span>

                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        action.type === 'screening_recommendation'
                          ? 'bg-amber-100 text-amber-950 border border-amber-200'
                          : 'bg-teal-100 text-teal-950 border border-teal-200'
                      }`}
                    >
                      {action.type === 'screening_recommendation'
                        ? '🔍 Saran Pemeriksaan di Faskes'
                        : '🌱 Langkah Gaya Hidup Sehat'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                      {action.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      <strong>Mengapa penting:</strong> {action.reason}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong className="text-teal-950 block mb-0.5">Langkah Konkret Sederhana:</strong>
                    <span>{action.concreteStep}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 italic pt-1">
              Catatan: Rencana ini bersifat anjuran edukatif gaya hidup umum, bukan resep medis dan tanpa dosis obat.
            </p>
          </div>

          {/* Faktor yang Berkontribusi pada Risiko */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-700" />
              Faktor yang Berkontribusi pada Risiko
            </h2>

            <ul className="space-y-2 text-sm sm:text-base text-slate-800">
              {riskResult.contributingFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-teal-700 mt-2 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Indikator Pendukung (Bicara dan Tidur) */}
          {riskResult.supportingIndicators.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-700" />
                  Indikator Pendukung (Bicara & Tidur)
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Bahasa Netral
                </span>
              </div>

              <div className="space-y-2.5">
                {riskResult.supportingIndicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-2xl flex items-start gap-3 text-sm text-teal-950 leading-relaxed"
                  >
                    {ind.kind === 'bicara' ? (
                      <Mic className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    ) : (
                      <Moon className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="block text-xs uppercase font-extrabold tracking-wider text-teal-800 mb-0.5">
                        Indikator {ind.kind === 'bicara' ? 'Bicara' : 'Pola Tidur'}
                      </strong>
                      <p className="font-semibold text-slate-900">{ind.finding}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{ind.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tombol Audit Aturan & Kelola Data */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onViewMyData}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold cursor-pointer"
            >
              Lihat Data Saya di Browser
            </button>

            <button
              type="button"
              onClick={onOpenRulesTest}
              className="px-4 py-2.5 rounded-xl border border-teal-300 bg-teal-50 text-teal-900 hover:bg-teal-100 text-sm font-bold cursor-pointer"
            >
              Verifikasi 8 Aturan Algoritma (PRD 9.1)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
