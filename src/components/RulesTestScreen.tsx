import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Play, ShieldCheck, Scale, Info, Check, AlertCircle } from 'lucide-react';
import { evaluateRisk, SYNTHETIC_TEST_CASES } from '../engine/riskEngine';
import { CLINICAL_CONFIG } from '../config/clinical';

interface RulesTestScreenProps {
  onBack: () => void;
}

export const RulesTestScreen: React.FC<RulesTestScreenProps> = ({ onBack }) => {
  // Jalankan 8 kasus uji
  const results = SYNTHETIC_TEST_CASES.map((tc) => {
    const actual = evaluateRisk({
      ad8Score: tc.ad8Score,
      ad8AnsweredCount: tc.answeredCount,
      hasInformant: tc.hasInformant,
      complaintsCount: tc.complaintsCount,
    });

    const isLevelMatch = actual.level === tc.expectedLevel;
    const isConfidenceMatch = actual.confidence === tc.expectedConfidence;
    const isPassed = isLevelMatch && isConfidenceMatch;

    return {
      testCase: tc,
      actual,
      isPassed,
      isLevelMatch,
      isConfidenceMatch,
    };
  });

  const passedCount = results.filter((r) => r.isPassed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
              Laboratorium Validasi v0 (PRD Bagian 9.1)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Uji Aturan Risk Engine (/uji-aturan)
            </h1>
          </div>
        </div>

        <p className="text-base text-slate-600 leading-relaxed">
          Memvalidasi mesin kalkulasi risiko kognitif berbasis aturan murni terhadap 8 kasus uji sintetis wajib dari tabel spesifikasi klinis PRD.
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
            Pengujian ini memverifikasi kesesuaian logika kode algoritma dengan matriks aturan PRD 9.1, bukan merupakan pengujian efikasi klinis terhadap pasien.
          </p>
        </div>
      </div>

      {/* Spanduk Ringkasan Kelulusan */}
      <div
        className={`p-5 rounded-3xl border-2 flex items-center justify-between ${
          allPassed
            ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
            : 'bg-rose-50 border-rose-500 text-rose-950'
        }`}
      >
        <div className="flex items-center gap-3">
          {allPassed ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
          )}
          <div>
            <span className="text-lg font-black block">
              {passedCount} dari {totalCount} Kasus Uji Algoritma LULUS ({Math.round((passedCount / totalCount) * 100)}%)
            </span>
            <span className="text-xs sm:text-sm opacity-90 block">
              {allPassed
                ? 'Semua kasus uji aturan sintetis cocok sempurna dengan spesifikasi PRD 9.1.'
                : 'Terdapat ketidakcocokan antara hasil aktual dengan spesifikasi PRD.'}
            </span>
          </div>
        </div>

        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-current">
          {allPassed ? 'STATUS: LULUS' : 'STATUS: GAGAL'}
        </span>
      </div>

      {/* Tabel 8 Kasus Uji */}
      <div className="space-y-3">
        {results.map(({ testCase, actual, isPassed }) => (
          <div
            key={testCase.id}
            className={`bg-white rounded-2xl p-4 sm:p-5 border-2 transition-all ${
              isPassed ? 'border-slate-200 shadow-xs' : 'border-rose-400 bg-rose-50/30'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  {testCase.id}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {testCase.description}
                </span>
              </div>

              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isPassed ? '✓ LULUS' : '✗ GAGAL'}
              </span>
            </div>

            {/* Parameter Masukan */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">AD8</span>
                <span className="text-base font-black text-slate-900">{testCase.ad8Score}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Terjawab</span>
                <span className="text-base font-black text-slate-900">{testCase.answeredCount}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Informan</span>
                <span className="text-base font-black text-slate-900">
                  {testCase.hasInformant ? 'Ya' : 'Tidak'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Keluhan</span>
                <span className="text-base font-black text-slate-900">{testCase.complaintsCount}</span>
              </div>
            </div>

            {/* Perbandingan Ekspektasi vs Aktual */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Ekspektasi PRD
                </span>
                <div className="font-semibold text-slate-800 capitalize">
                  Level: <strong className="text-slate-950">{testCase.expectedLevel}</strong>
                </div>
                <div className="font-semibold text-slate-800 capitalize">
                  Keyakinan: <strong className="text-slate-950">{testCase.expectedConfidence}</strong>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  isPassed
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-rose-50 border-rose-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Hasil Aktual Mesin
                </span>
                <div className="font-semibold text-slate-800 capitalize">
                  Level: <strong className="text-slate-950">{actual.level}</strong>
                </div>
                <div className="font-semibold text-slate-800 capitalize">
                  Keyakinan: <strong className="text-slate-950">{actual.confidence}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Penjelasan Aturan Klinis PRD 9.1 */}
      <div className="bg-teal-50 border border-teal-200 rounded-3xl p-5 space-y-2 text-teal-950 text-xs sm:text-sm">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Info className="w-5 h-5 text-teal-700" />
          Rangkuman Logika Aturan (Rule Logic v0):
        </h3>
        <ul className="list-disc list-inside space-y-1 text-teal-900">
          <li><strong>Tinggi:</strong> AD8 &ge; 3.</li>
          <li><strong>Sedang:</strong> AD8 = 2, atau (AD8 &le; 1 dan Keluhan &ge; 3).</li>
          <li><strong>Rendah:</strong> Selain kondisi di atas.</li>
          <li><strong>Keyakinan Tinggi:</strong> Informan ada dan &ge; 7 butir terjawab.</li>
          <li><strong>Keyakinan Sedang:</strong> Informan ada dan 5–6 butir terjawab.</li>
          <li><strong>Keyakinan Rendah:</strong> Tanpa informan atau &lt; 5 butir terjawab.</li>
        </ul>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full min-h-[50px] rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span>Kembali</span>
        </button>
      </div>
    </div>
  );
};
