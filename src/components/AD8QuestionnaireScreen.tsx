import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';
import ad8Config from '../config/questionnaires/ad8_ina.json';

type AD8AnswerValue = 'yes' | 'no' | 'unknown';

interface AD8QuestionnaireScreenProps {
  hasInformant: boolean;
  informantRelation?: string;
  initialAnswers: Record<string, AD8AnswerValue>;
  onSaveAnswers: (answers: Record<string, AD8AnswerValue>) => Promise<void>;
  onComplete: (answers: Record<string, AD8AnswerValue>) => void;
  onBackToProfile: () => void;
}

export const AD8QuestionnaireScreen: React.FC<AD8QuestionnaireScreenProps> = ({
  hasInformant,
  informantRelation,
  initialAnswers,
  onSaveAnswers,
  onComplete,
  onBackToProfile,
}) => {
  const items = ad8Config.items;
  const totalItems = items.length;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, AD8AnswerValue>>(initialAnswers);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const currentItem = items[currentIndex];
  const currentAnswer = answers[currentItem.id];

  // Hitung jumlah butir yang sudah terisi
  const answeredCountTotal = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalItems) * 100);

  const handleSelectOption = async (value: AD8AnswerValue) => {
    const updated = {
      ...answers,
      [currentItem.id]: value,
    };
    setAnswers(updated);

    // Simpan otomatis ke IndexedDB (Dexie) agar tidak hilang saat reload
    setIsSaving(true);
    try {
      await onSaveAnswers(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Selesai seluruh 8 butir
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBackToProfile();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Tombol Kembali Atas */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-slate-950 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{currentIndex === 0 ? 'Kembali ke Profil' : 'Butir Sebelumnya'}</span>
        </button>

        <span className="text-xs sm:text-sm font-extrabold text-teal-900 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
          AD8-INA · Observasi Pengamat
        </span>
      </div>

      {/* 
        ========================================================================
        TATA LETAK DESKTOP: DUA KOLOM
        - Kiri / Tengah (±640px): Pertanyaan aktif dengan pilihan jawaban besar
        - Kanan: Panel Stepper & Indikator Kemajuan 8 Butir
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Pertanyaan (lg:col-span-8 atau selebar ±640-700px) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Peringatan Pengisian Mandiri bila Tanpa Pendamping */}
          {!hasInformant && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-950 text-sm leading-relaxed">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong>Catatan Pengisian Mandiri:</strong> Kuesioner ini dirancang untuk diisi oleh pengamat/keluarga. Pengisian mandiri otomatis menurunkan tingkat keyakinan hasil menjadi Rendah.
              </div>
            </div>
          )}

          {/* Catatan Jika Ada Pendamping */}
          {hasInformant && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-2.5 text-teal-950 text-xs sm:text-sm">
              <UserCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                Diisi oleh pendamping ({informantRelation || 'Keluarga'}). Nilailah perubahan dalam beberapa tahun terakhir.
              </span>
            </div>
          )}

          {/* Kartu Pertanyaan Aktif */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-teal-800 uppercase tracking-wider">
                  Butir Pertanyaan {currentIndex + 1} dari {totalItems}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {progressPercent}% Selesai
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-snug">
                {currentItem.text}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {ad8Config.instructions}
              </p>
            </div>

            {/* Pilihan Jawaban (Tombol Tinggi ≥64px Ramah Sentuh & Lansia) */}
            <div className="space-y-3 pt-1">
              {ad8Config.options.map((opt) => {
                const isSelected = currentAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value as AD8AnswerValue)}
                    className={`w-full min-h-[64px] p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200 ${
                      isSelected
                        ? 'bg-teal-50 border-teal-700 text-teal-950 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-teal-700 bg-teal-700 text-white'
                            : 'border-slate-400 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-base sm:text-lg font-bold block leading-snug">
                          {opt.label}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 block mt-0.5">
                          {opt.description}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-xs font-bold uppercase text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full shrink-0">
                        Dipilih
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Simpan Otomatis */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Tersimpan otomatis ke basis data lokal peramban</span>
              {isSaving && <span className="text-teal-700 font-semibold animate-pulse">Menyimpan...</span>}
            </div>
          </div>

          {/* Navigasi Bawah */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrevious}
              className="min-h-[50px] sm:min-h-[54px] px-5 py-3 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors cursor-pointer"
            >
              {currentIndex === 0 ? 'Ke Profil' : 'Sebelumnya'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`flex-1 min-h-[50px] sm:min-h-[54px] px-6 py-3 text-base sm:text-lg font-bold text-white rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 ${
                currentAnswer
                  ? 'bg-teal-700 hover:bg-teal-800 active:scale-[0.99] shadow-teal-900/10 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{currentIndex < totalItems - 1 ? 'Lanjut ke Butir Berikutnya' : 'Selesai & Ke Daftar Keluhan'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Stepper & Indikator Kemajuan (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 block">
                Indikator Kemajuan
              </span>
              <h3 className="text-base font-bold text-slate-900">
                8 Butir Pertanyaan
              </h3>
            </div>
            <span className="text-sm font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {answeredCountTotal}/8 Terisi
            </span>
          </div>

          {/* Visual Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepper Butir 1-8 */}
          <div className="space-y-1.5 pt-1">
            {items.map((item, idx) => {
              const itemAnswer = answers[item.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-700 text-white font-bold shadow-xs'
                      : itemAnswer
                      ? 'bg-teal-50/80 text-teal-950 border border-teal-200/70 hover:bg-teal-100/60'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-white text-teal-900'
                          : itemAnswer
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate">{item.text}</span>
                  </div>

                  {itemAnswer && !isCurrent && (
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-white/80 border border-teal-300 text-teal-900 shrink-0">
                      {itemAnswer === 'yes' ? 'Ya' : itemAnswer === 'no' ? 'Tidak' : 'Ragu'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 leading-snug">
            Klik nomor butir mana saja untuk meninjau atau mengubah kembali jawaban sebelumnya.
          </div>
        </div>
      </div>
    </div>
  );
};
