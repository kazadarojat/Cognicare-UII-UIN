import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Moon, Check, Clock, AlertCircle } from 'lucide-react';
import sleepConfig from '../config/sleepQuestions.json';
import { SleepSummary } from '../db/types';

interface SleepScreenProps {
  initialSleepSummary?: SleepSummary;
  onBackToRiskFactors: () => void;
  onSaveSleep: (summary: SleepSummary) => Promise<void>;
  onComplete: (summary: SleepSummary) => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({
  initialSleepSummary,
  onBackToRiskFactors,
  onSaveSleep,
  onComplete,
}) => {
  const [avgHours, setAvgHours] = useState<number>(initialSleepSummary?.avgHours ?? 7);
  const [insomniaFlag, setInsomniaFlag] = useState<boolean>(
    initialSleepSummary?.insomniaFlag ?? false
  );
  const [nightWakingFlag, setNightWakingFlag] = useState<boolean>(
    initialSleepSummary?.nightWakingFlag ?? false
  );
  const [apneaScreenFlag, setApneaScreenFlag] = useState<boolean>(
    initialSleepSummary?.apneaScreenFlag ?? false
  );
  const [daytimeSleepinessFlag, setDaytimeSleepinessFlag] = useState<boolean>(
    initialSleepSummary?.daytimeSleepinessFlag ?? false
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const saveState = async (updated: SleepSummary) => {
    setIsSaving(true);
    try {
      await onSaveSleep(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleHoursChange = (hours: number) => {
    const updated = {
      avgHours: hours,
      insomniaFlag,
      nightWakingFlag,
      apneaScreenFlag,
      daytimeSleepinessFlag,
    };
    setAvgHours(hours);
    saveState(updated);
  };

  const handleToggle = (
    field: 'insomniaFlag' | 'nightWakingFlag' | 'apneaScreenFlag' | 'daytimeSleepinessFlag',
    val: boolean
  ) => {
    const updated: SleepSummary = {
      avgHours,
      insomniaFlag: field === 'insomniaFlag' ? val : insomniaFlag,
      nightWakingFlag: field === 'nightWakingFlag' ? val : nightWakingFlag,
      apneaScreenFlag: field === 'apneaScreenFlag' ? val : apneaScreenFlag,
      daytimeSleepinessFlag: field === 'daytimeSleepinessFlag' ? val : daytimeSleepinessFlag,
    };

    if (field === 'insomniaFlag') setInsomniaFlag(val);
    if (field === 'nightWakingFlag') setNightWakingFlag(val);
    if (field === 'apneaScreenFlag') setApneaScreenFlag(val);
    if (field === 'daytimeSleepinessFlag') setDaytimeSleepinessFlag(val);

    saveState(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSummary: SleepSummary = {
      avgHours,
      insomniaFlag,
      nightWakingFlag,
      apneaScreenFlag,
      daytimeSleepinessFlag,
    };
    onComplete(finalSummary);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Navigasi */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBackToRiskFactors}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Faktor Risiko</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full inline-block">
              {sleepConfig.status}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1 flex items-center gap-2">
              <Moon className="w-7 h-7 text-indigo-700" />
              Pola & Kualitas Tidur
            </h1>
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Kualitas tidur sangat berpengaruh terhadap kesehatan otak dan metabolisme pembersihan toksin di otak saat malam hari.
        </p>
      </div>

      {/* Pertanyaan 1: Durasi Rata-rata Tidur (Jam) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            Pertanyaan #1 · Durasi Waktu
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950">
            Berapa jam rata-rata durasi tidur malam Anda per hari?
          </h2>
          <p className="text-sm text-slate-500">
            Pilihlah perkiraan jam tidur aktual Anda (bukan sekadar berbaring).
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
          {[4, 5, 6, 7, 8, 9].map((hr) => (
            <button
              key={hr}
              type="button"
              onClick={() => handleHoursChange(hr)}
              className={`h-14 rounded-2xl border-2 font-bold text-base transition-all flex flex-col items-center justify-center ${
                avgHours === hr
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{hr}{hr === 9 ? '+' : ''}</span>
              <span className="text-[10px] uppercase font-semibold opacity-80">Jam</span>
            </button>
          ))}
        </div>

        {avgHours < 6 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900">
            ℹ️ Rata-rata tidur di bawah 6 jam tergolong kurang tidur dan dapat menjadi penanda perancu dalam konsentrasi kognitif.
          </div>
        )}
      </div>

      {/* Pertanyaan 2: Gejala Insomnia */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            Pertanyaan #2 · Kesulitan Tidur
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950">
            Apakah sering butuh waktu lama (&gt;30 menit) untuk terlelap, atau sulit mempertahankan tidur?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleToggle('insomniaFlag', true)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              insomniaFlag
                ? 'bg-rose-50 border-rose-600 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {insomniaFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Ya, Sering Sulit</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggle('insomniaFlag', false)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              !insomniaFlag
                ? 'bg-teal-50 border-teal-700 text-teal-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {!insomniaFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Tidak, Mudah Terlelap</span>
          </button>
        </div>
      </div>

      {/* Pertanyaan 3: Sering Terbangun Malam */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            Pertanyaan #3 · Kestabilan Tidur
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950">
            Apakah sering terbangun berulang kali di tengah malam dan sulit tidur lagi?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleToggle('nightWakingFlag', true)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              nightWakingFlag
                ? 'bg-rose-50 border-rose-600 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {nightWakingFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Ya, Sering Terbangun</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggle('nightWakingFlag', false)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              !nightWakingFlag
                ? 'bg-teal-50 border-teal-700 text-teal-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {!nightWakingFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Tidak, Cukup Nyenyak</span>
          </button>
        </div>
      </div>

      {/* Pertanyaan 4: Mendengkur Keras / Henti Napas (Apnea) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            Pertanyaan #4 · Pernapasan Tidur
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950">
            Pernahkah keluarga memperhatikan Anda mendengkur sangat keras atau tampak henti napas sejenak saat tidur?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleToggle('apneaScreenFlag', true)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              apneaScreenFlag
                ? 'bg-rose-50 border-rose-600 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {apneaScreenFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Ya, Ada Keluhan Ini</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggle('apneaScreenFlag', false)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              !apneaScreenFlag
                ? 'bg-teal-50 border-teal-700 text-teal-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {!apneaScreenFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Tidak Ada</span>
          </button>
        </div>
      </div>

      {/* Pertanyaan 5: Kantuk Siang Hari */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
            Pertanyaan #5 · Stamina Siang Hari
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950">
            Apakah sering merasa sangat mengantuk atau mudah tertidur tanpa sengaja di siang hari?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleToggle('daytimeSleepinessFlag', true)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              daytimeSleepinessFlag
                ? 'bg-rose-50 border-rose-600 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {daytimeSleepinessFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Ya, Sering Mengantuk</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggle('daytimeSleepinessFlag', false)}
            className={`min-h-[50px] px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
              !daytimeSleepinessFlag
                ? 'bg-teal-50 border-teal-700 text-teal-950'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {!daytimeSleepinessFlag && <Check className="w-4 h-4 stroke-[3]" />}
            <span>Tidak / Segar Biasa</span>
          </button>
        </div>
      </div>

      {/* Indikator Penyimpanan */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
        <span>Tersimpan otomatis ke basis data lokal (IndexedDB)</span>
        {isSaving && <span className="text-teal-700 font-semibold animate-pulse">Menyimpan...</span>}
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBackToRiskFactors}
          className="min-h-[54px] px-5 py-3 text-base sm:text-lg font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors"
        >
          Kembali
        </button>

        <button
          type="submit"
          className="flex-1 min-h-[54px] px-6 py-3 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          <span>Simpan & Lanjut ke Tugas Bicara</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
