import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Activity, Check, HelpCircle, Scale, Ruler, AlertCircle } from 'lucide-react';
import riskConfig from '../config/riskFactors.json';
import { UserProfile, BodyMeasurements } from '../db/types';

interface RiskFactorsScreenProps {
  profile: UserProfile;
  initialStatuses?: Record<string, 'present' | 'absent' | 'unknown'>;
  initialMeasurements?: BodyMeasurements;
  onBackToComplaints: () => void;
  onSaveRiskFactors: (
    statuses: Record<string, 'present' | 'absent' | 'unknown'>,
    measurements?: BodyMeasurements
  ) => Promise<void>;
  onComplete: (
    statuses: Record<string, 'present' | 'absent' | 'unknown'>,
    measurements?: BodyMeasurements
  ) => void;
}

export const RiskFactorsScreen: React.FC<RiskFactorsScreenProps> = ({
  profile,
  initialStatuses = {},
  initialMeasurements,
  onBackToComplaints,
  onSaveRiskFactors,
  onComplete,
}) => {
  // 1. Pendidikan rendah otomatis dipetakan dari profil (early life factor)
  const isLowEducation = profile.educationLevel === 'tidak_sekolah_sd';

  // 2. State pengukuran antropometri untuk perhitungan IMT (obesitas)
  const [heightCm, setHeightCm] = useState<string>(
    initialMeasurements?.heightCm ? String(initialMeasurements.heightCm) : '160'
  );
  const [weightKg, setWeightKg] = useState<string>(
    initialMeasurements?.weightKg ? String(initialMeasurements.weightKg) : '60'
  );

  // 3. Status 12 faktor risiko lainnya
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent' | 'unknown'>>({
    low_education: isLowEducation ? 'present' : 'absent',
    ...initialStatuses,
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Hitung IMT secara murni di kode (Bukan diagnosis medis)
  const parsedH = parseFloat(heightCm);
  const parsedW = parseFloat(weightKg);
  const heightInMeters = !isNaN(parsedH) && parsedH > 0 ? parsedH / 100 : 0;
  const calculatedBmi =
    heightInMeters > 0 && !isNaN(parsedW) && parsedW > 0
      ? Math.round((parsedW / (heightInMeters * heightInMeters)) * 10) / 10
      : 0;

  // Standar Asia-Pasifik: IMT >= 25 mengindikasikan kelebihan berat badan / obesitas
  const isObese = calculatedBmi >= 25;

  const handleStatusChange = async (
    factorId: string,
    status: 'present' | 'absent' | 'unknown'
  ) => {
    const updated: Record<string, 'present' | 'absent' | 'unknown'> = {
      ...statuses,
      [factorId]: status,
      low_education: (isLowEducation ? 'present' : 'absent') as 'present' | 'absent',
      obesity: (isObese ? 'present' : 'absent') as 'present' | 'absent',
    };
    setStatuses(updated);

    const measurements: BodyMeasurements | undefined =
      calculatedBmi > 0
        ? {
            heightCm: parsedH,
            weightKg: parsedW,
            calculatedBmi,
          }
        : undefined;

    setIsSaving(true);
    try {
      await onSaveRiskFactors(updated, measurements);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const measurements: BodyMeasurements | undefined =
      calculatedBmi > 0
        ? {
            heightCm: parsedH,
            weightKg: parsedW,
            calculatedBmi,
          }
        : undefined;

    const finalStatuses: Record<string, 'present' | 'absent' | 'unknown'> = {
      ...statuses,
      low_education: (isLowEducation ? 'present' : 'absent') as 'present' | 'absent',
      obesity: (isObese ? 'present' : 'absent') as 'present' | 'absent',
    };

    onComplete(finalStatuses, measurements);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Navigasi */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBackToComplaints}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Keluhan</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full inline-block">
              {riskConfig.status}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
              Faktor Risiko Gaya Hidup
            </h1>
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          14 faktor kesehatan ini berdasarkan bukti komisi Lancet 2024. Sebagian besar faktor dapat dicegah atau diperbaiki dengan langkah gaya hidup sehat.
        </p>
      </div>

      {/* Bagian 1: Obesitas & Pengukuran Tubuh (IMT) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-700" />
            <span className="text-lg font-bold text-slate-950">
              1. Tinggi & Berat Badan (Indeks Massa Tubuh)
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
            Dihitung Otomatis
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Angka ini digunakan untuk menghitung rasio indeks massa tubuh (IMT) secara otomatis tanpa label diagnosis.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="height-input" className="text-sm font-semibold text-slate-700 block">
              Tinggi Badan (cm)
            </label>
            <input
              id="height-input"
              type="number"
              min={80}
              max={230}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full h-12 px-3 text-lg font-bold text-center bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="weight-input" className="text-sm font-semibold text-slate-700 block">
              Berat Badan (kg)
            </label>
            <input
              id="weight-input"
              type="number"
              min={25}
              max={250}
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full h-12 px-3 text-lg font-bold text-center bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>

        {calculatedBmi > 0 && (
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-sm">
            <span className="text-slate-700 font-medium">Hasil Perhitungan IMT:</span>
            <span className="text-base font-bold text-teal-900 bg-white px-2.5 py-0.5 rounded-lg border border-teal-200">
              {calculatedBmi} kg/m²
            </span>
          </div>
        )}
      </div>

      {/* Bagian 2: Pendidikan Rendah (Otomatis dari Profil) */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
          2
        </div>
        <div className="space-y-1 flex-1">
          <span className="text-base font-bold text-slate-900 block">
            Faktor Pendidikan Dasar
          </span>
          <p className="text-sm text-slate-600">
            Terisi otomatis dari profil: {isLowEducation ? 'Pendidikan dasar / tidak sekolah (Terindikasi)' : 'Tingkat pendidikan mencukupi (Bukan faktor risiko)'}.
          </p>
        </div>
      </div>

      {/* Bagian 3: 12 Faktor Risiko Lainnya dengan Bahasa Sederhana */}
      <div className="space-y-4">
        {riskConfig.factors.map((factor, index) => {
          const currentVal = statuses[factor.id] || 'absent';
          return (
            <div
              key={factor.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200/90 shadow-xs space-y-4"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Faktor #{index + 3} · {factor.label}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-950 leading-snug">
                  {factor.question}
                </h2>
                {factor.help && (
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {factor.help}
                  </p>
                )}
              </div>

              {/* Tombol Opsi: Ya / Tidak / Belum Pernah Diperiksa */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Opsi: Ya (Ada) */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(factor.id, 'present')}
                  className={`min-h-[50px] px-3 py-2.5 rounded-xl border-2 text-base font-bold transition-all flex items-center justify-center gap-2 ${
                    currentVal === 'present'
                      ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {currentVal === 'present' && <Check className="w-4 h-4 stroke-[3]" />}
                  <span>Ya</span>
                </button>

                {/* Opsi: Tidak */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(factor.id, 'absent')}
                  className={`min-h-[50px] px-3 py-2.5 rounded-xl border-2 text-base font-bold transition-all flex items-center justify-center gap-2 ${
                    currentVal === 'absent'
                      ? 'bg-teal-50 border-teal-700 text-teal-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {currentVal === 'absent' && <Check className="w-4 h-4 stroke-[3]" />}
                  <span>Tidak</span>
                </button>

                {/* Opsi: Belum Pernah Diperiksa (Status unknown) */}
                {factor.allowUnknown && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(factor.id, 'unknown')}
                    className={`min-h-[50px] px-3 py-2.5 rounded-xl border-2 text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-1.5 ${
                      currentVal === 'unknown'
                        ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {currentVal === 'unknown' && <Check className="w-4 h-4 stroke-[3]" />}
                    <span>Belum Diperiksa</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indikator Penyimpanan Otomatis */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
        <span>Tersimpan otomatis di peramban (IndexedDB)</span>
        {isSaving && <span className="text-teal-700 font-semibold animate-pulse">Menyimpan...</span>}
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBackToComplaints}
          className="min-h-[54px] px-5 py-3 text-base sm:text-lg font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors"
        >
          Kembali
        </button>

        <button
          type="submit"
          className="flex-1 min-h-[54px] px-6 py-3 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          <span>Simpan & Lanjut ke Pola Tidur</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
