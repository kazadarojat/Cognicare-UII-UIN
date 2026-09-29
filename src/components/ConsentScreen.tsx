import React, { useState } from 'react';
import { ShieldCheck, Mic, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

interface ConsentScreenProps {
  initialBasicConsented?: boolean;
  initialVoiceConsented?: boolean;
  onBack: () => void;
  onConsentComplete: (basicConsented: boolean, voiceConsented: boolean) => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  initialBasicConsented = false,
  initialVoiceConsented = false,
  onBack,
  onConsentComplete,
}) => {
  const [basicConsented, setBasicConsented] = useState<boolean>(initialBasicConsented);
  const [voiceConsented, setVoiceConsented] = useState<boolean>(initialVoiceConsented);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicConsented) return;
    onConsentComplete(basicConsented, voiceConsented);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Langkah */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Penjelasan</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lembar Persetujuan (Consent)
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Mohon tinjau dua persetujuan di bawah ini sebelum memulai pengisian.
        </p>
      </div>

      {/* Bagian A: Persetujuan Data Dasar (WAJIB) */}
      <div
        onClick={() => setBasicConsented(!basicConsented)}
        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer select-none space-y-4 ${
          basicConsented
            ? 'bg-teal-50/70 border-teal-600 shadow-sm'
            : 'bg-white border-slate-300 hover:border-slate-400'
        }`}
        role="checkbox"
        aria-checked={basicConsented}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setBasicConsented(!basicConsented);
          }
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
              basicConsented
                ? 'bg-teal-700 border-teal-700 text-white'
                : 'border-slate-400 bg-white'
            }`}
          >
            {basicConsented && <Check className="w-5 h-5 stroke-[3]" />}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-slate-950">
                1. Persetujuan Data Dasar Skrining
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Wajib
              </span>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">
              Saya menyetujui informasi dasar (usia, pendidikan, keluhan kognitif, dan gaya hidup) diproses dan disimpan <strong>hanya di perangkat ini (IndexedDB)</strong> untuk keperluan penghitungan skrining risiko.
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-500 bg-white/70 p-3 rounded-xl border border-slate-200">
          ✓ Anda dapat menghapus data ini sepenuhnya kapan saja melalui tombol Pengaturan / Hapus Data.
        </div>
      </div>

      {/* Bagian B: Persetujuan Penggunaan Mikrofon / Tugas Bicara (OPSIONAL) */}
      <div
        onClick={() => setVoiceConsented(!voiceConsented)}
        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer select-none space-y-4 ${
          voiceConsented
            ? 'bg-teal-50/70 border-teal-600 shadow-sm'
            : 'bg-white border-slate-300 hover:border-slate-400'
        }`}
        role="checkbox"
        aria-checked={voiceConsented}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setVoiceConsented(!voiceConsented);
          }
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
              voiceConsented
                ? 'bg-teal-700 border-teal-700 text-white'
                : 'border-slate-400 bg-white'
            }`}
          >
            {voiceConsented && <Check className="w-5 h-5 stroke-[3]" />}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-slate-950">
                2. Persetujuan Tugas Bicara & Mikrofon
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Opsional
              </span>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">
              Saya bersedia mencoba tugas bicara singkat (60–90 detik). Saya memahami bahwa suara <strong>hanya dianalisis pola jedanya di dalam browser perangkat</strong> dan rekaman suara langsung dibuang dari memori tanpa disimpan.
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-500 bg-white/70 p-3 rounded-xl border border-slate-200">
          ℹ️ <strong>Bila tidak dicentang:</strong> Tugas bicara akan dilewati otomatis. Skrining tetap dapat diselesaikan dengan lengkap.
        </div>
      </div>

      {/* Peringatan jika Bagian Wajib belum dicentang */}
      {!basicConsented && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-base">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Silakan centang <strong>Persetujuan Data Dasar (Wajib)</strong> di atas untuk dapat melanjutkan.</span>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[54px] px-6 py-3 text-base sm:text-lg font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={!basicConsented}
          className={`flex-1 min-h-[54px] px-6 py-3 text-lg font-bold text-white rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 ${
            basicConsented
              ? 'bg-teal-700 hover:bg-teal-800 active:scale-[0.99] shadow-teal-900/10 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Lanjut ke Pengisian Profil</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
