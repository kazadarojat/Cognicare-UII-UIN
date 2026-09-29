import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, ArrowRight, ArrowLeft, ShieldAlert, Check } from 'lucide-react';

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteDataModal: React.FC<DeleteDataModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isAgreementChecked, setIsAgreementChecked] = useState<boolean>(false);

  // Reset langkah saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsAgreementChecked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-scaleUp">
        {/* Indikator Langkah */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                step === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Langkah 1: Tinjauan
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                step === 2 ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Langkah 2: Konfirmasi Akhir
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Langkah 1: Penjelasan Data yang Dihapus */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="delete-dialog-title" className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Hapus Semua Data Lokal?
                </h2>
                <p className="text-xs uppercase font-extrabold tracking-wider text-amber-800 mt-0.5">
                  Konfirmasi Tahap 1 dari 2
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Tindakan ini akan membersihkan seluruh basis data lokal peramban di perangkat Anda tanpa mengirim apapun ke internet.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-700">
              <strong className="text-slate-900 block font-bold text-sm">
                Data yang akan dihapus permanen meliputi:
              </strong>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Profil demografi (nama, usia, pendidikan, bahasa)</li>
                <li>Persetujuan informed consent (dasar & suara)</li>
                <li>Seluruh jawaban kuesioner observasi AD8-INA</li>
                <li>Daftar keluhan subjektif dan 14 faktor risiko gaya hidup</li>
                <li>Ringkasan pola tidur dan fitur numerik rekaman suara</li>
                <li>Seluruh riwayat riwayat pemantauan berkala</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[50px] px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-base"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 min-h-[50px] px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold transition-all flex items-center justify-center gap-2 text-base shadow-md shadow-amber-900/10 cursor-pointer"
              >
                <span>Lanjut ke Konfirmasi Akhir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Konten Langkah 2: Konfirmasi Terakhir Permanen */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldAlert className="w-7 h-7" aria-hidden="true" />
              </div>
              <div>
                <h2 id="delete-dialog-title" className="text-xl sm:text-2xl font-black text-rose-950 tracking-tight">
                  Konfirmasi Akhir Penghapusan
                </h2>
                <p className="text-xs uppercase font-extrabold tracking-wider text-rose-700 mt-0.5">
                  Konfirmasi Tahap 2 dari 2 (Permanen)
                </p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-950 space-y-1">
              <strong>Peringatan Terakhir:</strong>
              <p className="leading-relaxed">
                Data yang telah dihapus <strong>tidak dapat dipulihkan kembali</strong>. Semua tabel Dexie (IndexedDB), localStorage, dan sessionStorage akan dikosongkan seketika. Anda akan dikembalikan ke layar awal pengenalan (Onboarding).
              </p>
            </div>

            {/* Checkbox Konfirmasi Sadar */}
            <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={isAgreementChecked}
                onChange={(e) => setIsAgreementChecked(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 mt-0.5 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug select-none">
                Saya mengerti dan menyetujui seluruh data di perangkat ini dihapus secara permanen.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isDeleting}
                className="min-h-[50px] px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-base flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting || !isAgreementChecked}
                className="flex-1 min-h-[50px] px-5 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 active:scale-[0.99] text-white font-bold transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                <span>{isDeleting ? 'Sedang Menghapus Semua Data...' : 'Ya, Hapus Semua Data Sekarang'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
