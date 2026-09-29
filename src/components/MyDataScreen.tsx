import React, { useState } from 'react';
import { Database, User, ClipboardList, Activity, Moon, ShieldCheck, ArrowLeft, ArrowRight, RefreshCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, UserConsent, AssessmentRecord } from '../db/types';
import riskConfig from '../config/riskFactors.json';
import complaintsConfig from '../config/complaints.json';

interface MyDataScreenProps {
  profile: UserProfile | null;
  consent: UserConsent | null;
  assessment: AssessmentRecord | null;
  onBack: () => void;
  onOpenDeleteModal: () => void;
  onNavigateToScreen: (screen: 'profile' | 'ad8' | 'complaints' | 'risk_factors' | 'sleep' | 'speech') => void;
  onViewResults?: () => void;
}

export const MyDataScreen: React.FC<MyDataScreenProps> = ({
  profile,
  consent,
  assessment,
  onBack,
  onOpenDeleteModal,
  onNavigateToScreen,
  onViewResults,
}) => {
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  const formatTimestamp = (ts: number | null | undefined) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ad8Answers = assessment?.ad8Answers || {};
  const yesCount = Object.values(ad8Answers).filter((v) => v === 'yes').length;
  const noCount = Object.values(ad8Answers).filter((v) => v === 'no').length;
  const unknownCount = Object.values(ad8Answers).filter((v) => v === 'unknown').length;
  const answeredCount = yesCount + noCount;

  const selectedComplaints = complaintsConfig.items.filter((c) =>
    assessment?.complaintIds?.includes(c.id)
  );

  const riskStatuses = assessment?.riskFactorStatuses || {};

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Halaman /data-saya */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                Pemeriksaan Lokal (IndexedDB)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Data Saya (/data-saya)
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRawJson(!showRawJson)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            {showRawJson ? 'Tutup Data Mentah (JSON)' : 'Lihat Data Mentah (JSON)'}
          </button>
        </div>

        <p className="text-base text-slate-600">
          Halaman ini menampilkan seluruh catatan yang saat ini tersimpan di memori browser perangkat Anda tanpa koneksi ke server mana pun.
        </p>
      </div>

      {/* Peringatan Klinis Wajib */}
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
            Seluruh data dan rekaman penilaian kognitif ini disimpan murni secara lokal di peramban perangkat Anda.
          </p>
        </div>
      </div>

      {/* Raw JSON Viewer bila diaktifkan */}
      {showRawJson && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>IndexedDB: CogniCareDB</span>
            <span>UTF-8</span>
          </div>
          <pre className="text-xs font-mono overflow-x-auto max-h-80 p-3 bg-slate-950/70 rounded-xl leading-relaxed text-teal-300">
            {JSON.stringify({ profile, consent, assessment }, null, 2)}
          </pre>
        </div>
      )}

      {/* Bagian 1: Data Profil & Consent */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-700" />
            1. Profil & Persetujuan
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToScreen('profile')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Ubah
          </button>
        </div>

        {profile ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block">Usia:</span>
              <span className="font-bold text-slate-900 text-base">{profile.age} Tahun</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block">Pendidikan:</span>
              <span className="font-bold text-slate-900 capitalize">{profile.educationLevel.replace(/_/g, ' ')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block">Bahasa:</span>
              <span className="font-bold text-slate-900 capitalize">{profile.primaryLanguage}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block">Pendamping:</span>
              <span className="font-bold text-slate-900">
                {profile.hasInformant ? `Ada (${profile.informantRelation || 'Keluarga'})` : 'Mandiri'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Belum ada profil yang tersimpan.</p>
        )}

        {consent && (
          <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
            <div>✓ Consent Data Dasar: {formatTimestamp(consent.basicDataAt)}</div>
            <div>
              {consent.voiceConsented
                ? `✓ Consent Tugas Bicara: ${formatTimestamp(consent.voiceAt)}`
                : '○ Consent Tugas Bicara: Dilewati'}
            </div>
          </div>
        )}
      </div>

      {/* Bagian 2: Skor AD8-INA */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-700" />
            2. Kuesioner AD8-INA
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToScreen('ad8')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Ubah
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
            <span className="text-[10px] uppercase font-bold text-teal-800 block">Skor (Ya)</span>
            <span className="text-2xl font-black text-teal-950">{yesCount}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Tidak</span>
            <span className="text-2xl font-black text-slate-900">{noCount}</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Tdk Tahu</span>
            <span className="text-2xl font-black text-amber-950">{unknownCount}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Terjawab</span>
            <span className="text-2xl font-black text-slate-900">{answeredCount}</span>
          </div>
        </div>
      </div>

      {/* Bagian 3: Keluhan Subjektif */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-700" />
            3. Keluhan Subjektif ({selectedComplaints.length} Dipilih)
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToScreen('complaints')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Ubah
          </button>
        </div>

        {selectedComplaints.length > 0 ? (
          <ul className="space-y-1.5 text-sm text-slate-800">
            {selectedComplaints.map((c) => (
              <li key={c.id} className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">Tidak ada keluhan yang dipilih.</p>
        )}
      </div>

      {/* Bagian 4: Faktor Risiko (14 Faktor Lancet) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            4. Faktor Risiko Gaya Hidup (Lancet 2024)
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToScreen('risk_factors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Ubah
          </button>
        </div>

        {/* Data IMT */}
        {assessment?.bodyMeasurements && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm flex items-center justify-between">
            <span className="text-slate-600">
              TB: {assessment.bodyMeasurements.heightCm} cm · BB: {assessment.bodyMeasurements.weightKg} kg
            </span>
            <span className="font-bold text-slate-900">
              IMT: {assessment.bodyMeasurements.calculatedBmi} kg/m²
            </span>
          </div>
        )}

        {/* Daftar Status Faktor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {riskConfig.factors.map((f) => {
            const st = riskStatuses[f.id] || 'absent';
            return (
              <div
                key={f.id}
                className="p-2.5 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-100"
              >
                <span className="font-semibold text-slate-800">{f.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                    st === 'present'
                      ? 'bg-rose-100 text-rose-800'
                      : st === 'unknown'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {st === 'present' ? 'Ya (Ada)' : st === 'unknown' ? 'Belum Diperiksa' : 'Tidak Ada'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 5: Pola Tidur */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-700" />
            5. Pola Tidur
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToScreen('sleep')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Ubah
          </button>
        </div>

        {assessment?.sleepSummary ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-700">Durasi Tidur Rata-rata:</span>
              <span className="font-bold text-slate-950">
                {assessment.sleepSummary.avgHours} Jam / Malam
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Insomnia:</span>
                <span className="font-bold text-slate-900">
                  {assessment.sleepSummary.insomniaFlag ? 'Ya, sering sulit' : 'Tidak'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Terbangun Malam:</span>
                <span className="font-bold text-slate-900">
                  {assessment.sleepSummary.nightWakingFlag ? 'Ya, sering' : 'Tidak'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Mendengkur/Apnea:</span>
                <span className="font-bold text-slate-900">
                  {assessment.sleepSummary.apneaScreenFlag ? 'Ya, ada tanda' : 'Tidak'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Kantuk Siang:</span>
                <span className="font-bold text-slate-900">
                  {assessment.sleepSummary.daytimeSleepinessFlag ? 'Ya, sering' : 'Tidak'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Belum ada data tidur yang diisi.</p>
        )}
      </div>

      {/* Bagian 6: Fitur Jeda Bicara (M4) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            6. Fitur Jeda Bicara (Di Perangkat)
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToScreen('speech')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Ubah / Rekam
          </button>
        </div>

        {assessment?.speechFeatures ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Durasi</span>
                <span className="font-black text-slate-900 text-lg">
                  {assessment.speechFeatures.durationSeconds}s
                </span>
              </div>
              <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
                <span className="text-teal-800 font-bold block">Jumlah Jeda</span>
                <span className="font-black text-teal-950 text-lg">
                  {assessment.speechFeatures.pauseCount}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Total Waktu Jeda</span>
                <span className="font-black text-slate-900 text-lg">
                  {assessment.speechFeatures.totalPauseSeconds}s
                </span>
              </div>
              <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
                <span className="text-teal-800 font-bold block">Rasio Jeda</span>
                <span className="font-black text-teal-950 text-lg">
                  {assessment.speechFeatures.pauseRatio}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Rerata Durasi</span>
                <span className="font-black text-slate-900 text-lg">
                  {assessment.speechFeatures.meanPauseSeconds}s
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Kualitas</span>
                <span className="font-bold text-slate-900 text-sm mt-1 capitalize block">
                  {assessment.speechFeatures.qualityFlags.join(', ')}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Data suara tidak disimpan; hanya nilai numerik di atas yang tersimpan secara lokal.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Tugas bicara belum dijalankan atau dilewati.
          </p>
        )}
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="pt-2 flex flex-col gap-3">
        {onViewResults && assessment?.ad8Answers && (
          <button
            type="button"
            onClick={onViewResults}
            className="w-full min-h-[54px] px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base transition-colors shadow-md shadow-teal-900/10 flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            <span>Lihat Hasil Skrining Risiko (M5)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 min-h-[52px] px-6 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            <span>Kembali ke Halaman Sebelumnya</span>
          </button>

          <button
            type="button"
            onClick={onOpenDeleteModal}
            className="min-h-[52px] px-5 py-3 rounded-2xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-base transition-colors"
          >
            Hapus Semua Data
          </button>
        </div>
      </div>
    </div>
  );
};
