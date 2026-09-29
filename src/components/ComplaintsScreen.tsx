import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckSquare, Square, Check, AlertCircle, Sparkles } from 'lucide-react';
import complaintsConfig from '../config/complaints.json';

interface ComplaintsScreenProps {
  initialSelectedIds: string[];
  onBackToAD8: () => void;
  onSaveComplaints: (selectedIds: string[]) => Promise<void>;
  onComplete: (selectedIds: string[]) => void;
}

export const ComplaintsScreen: React.FC<ComplaintsScreenProps> = ({
  initialSelectedIds,
  onBackToAD8,
  onSaveComplaints,
  onComplete,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const toggleComplaint = async (id: string) => {
    let updated: string[];
    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((item) => item !== id);
    } else {
      updated = [...selectedIds, id];
    }
    setSelectedIds(updated);

    // Simpan otomatis ke IndexedDB (Dexie)
    setIsSaving(true);
    try {
      await onSaveComplaints(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectNone = async () => {
    setSelectedIds([]);
    setIsSaving(true);
    try {
      await onSaveComplaints([]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(selectedIds);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Navigasi */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBackToAD8}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Kuesioner AD8</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full inline-block">
              {complaintsConfig.status}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
              Daftar Keluhan Subjektif
            </h1>
          </div>
          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-800 text-sm">
            {selectedIds.length} Keluhan Terpilih
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Pilihlah keluhan apa saja yang pernah atau sering dirasakan dalam beberapa bulan terakhir. Anda boleh memilih lebih dari satu, atau tidak memilih sama sekali bila tidak ada keluhan.
        </p>
      </div>

      {/* Opsi Cepat: Tidak Ada Keluhan */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSelectNone}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 py-1"
        >
          Hapus Semua Pilihan (Tidak Ada Keluhan)
        </button>
      </div>

      {/* Daftar Butir Keluhan (DRAF) */}
      <div className="space-y-3">
        {complaintsConfig.items.map((item, idx) => {
          const isChecked = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleComplaint(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-start gap-4 ${
                isChecked
                  ? 'bg-teal-50/80 border-teal-700 text-teal-950 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleComplaint(item.id);
                }
              }}
            >
              <div
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isChecked
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-400 bg-white'
                }`}
              >
                {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-base sm:text-lg font-bold block leading-snug">
                  {item.text}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Keluhan #{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Penyimpanan Otomatis */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
        <span>Tersimpan otomatis ke memori lokal peramban (IndexedDB)</span>
        {isSaving && <span className="text-teal-700 font-semibold animate-pulse">Menyimpan...</span>}
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBackToAD8}
          className="min-h-[54px] px-5 py-3 text-base sm:text-lg font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors"
        >
          Kembali ke AD8
        </button>

        <button
          type="submit"
          className="flex-1 min-h-[54px] px-6 py-3 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          <span>Simpan & Lihat Ringkasan M2</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
