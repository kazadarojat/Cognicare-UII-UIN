import React, { useState } from 'react';
import { User, ArrowRight, ArrowLeft, AlertCircle, Info, Check, Users, UserCheck } from 'lucide-react';
import { CLINICAL_CONFIG } from '../config/clinical';
import { UserProfile } from '../db/types';

interface ProfileScreenProps {
  initialProfile?: Partial<UserProfile> | null;
  onBack: () => void;
  onSaveProfile: (profileData: Omit<UserProfile, 'id' | 'createdAt'>) => Promise<void>;
  isSaving: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  initialProfile,
  onBack,
  onSaveProfile,
  isSaving,
}) => {
  const [age, setAge] = useState<string>(initialProfile?.age ? String(initialProfile.age) : '65');
  const [educationLevel, setEducationLevel] = useState<string>(initialProfile?.educationLevel || 'sma_smk');
  const [primaryLanguage, setPrimaryLanguage] = useState<string>(initialProfile?.primaryLanguage || 'indonesia');
  const [hasInformant, setHasInformant] = useState<boolean>(
    initialProfile?.hasInformant !== undefined ? initialProfile.hasInformant : true
  );
  const [informantRelation, setInformantRelation] = useState<string>(
    initialProfile?.informantRelation || 'anak'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parsedAge = parseInt(age, 10);
  const isUnder50 = !isNaN(parsedAge) && parsedAge < CLINICAL_CONFIG.TARGET_AGE.RECOMMENDED_MIN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 120) {
      setErrorMsg('Mohon masukkan usia yang valid (antara 18 dan 120 tahun).');
      return;
    }

    if (!educationLevel) {
      setErrorMsg('Mohon pilih tingkat pendidikan terakhir.');
      return;
    }

    if (!primaryLanguage) {
      setErrorMsg('Mohon pilih bahasa utama sehari-hari.');
      return;
    }

    await onSaveProfile({
      age: parsedAge,
      educationLevel,
      primaryLanguage,
      hasInformant,
      informantRelation: hasInformant ? informantRelation : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7">
      {/* Header Form */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Persetujuan</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profil Dasar Pengguna
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Informasi ini membantu menyesuaikan hasil skrining dengan profil demografis dan sosial Anda.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-base">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Bagian 1: Usia (Wajib) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <label htmlFor="user-age" className="block">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-950">
              1. Berapa usia orang yang diskrining?
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              Wajib
            </span>
          </div>
          <span className="text-sm sm:text-base text-slate-500 block mt-1">
            Masukkan angka usia saat ini (dalam tahun)
          </span>
        </label>

        <div className="flex items-center gap-4">
          <input
            id="user-age"
            type="number"
            min={18}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-32 h-14 px-4 text-2xl font-bold text-center text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
          />
          <span className="text-xl font-semibold text-slate-700">Tahun</span>

          {/* Tombol preset cepat untuk memudahkan lansia/pendamping */}
          <div className="flex flex-wrap gap-2">
            {[55, 65, 70, 75].map((presetAge) => (
              <button
                key={presetAge}
                type="button"
                onClick={() => setAge(String(presetAge))}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                  age === String(presetAge)
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {presetAge} th
              </button>
            ))}
          </div>
        </div>

        {/* Peringatan bila usia di bawah 50 tahun (sesuai PRD F2) */}
        {isUnder50 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-sm sm:text-base leading-relaxed">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Catatan Usia:</strong> Aplikasi ini dirancang utama untuk usia 50 tahun ke atas. Anda tetap dapat melanjutkan untuk mencoba proses skrining, dan hasil akan menyertakan catatan demografis.
            </div>
          </div>
        )}
      </div>

      {/* Bagian 2: Pendidikan Terakhir (Wajib) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-950">
            2. Apa tingkat pendidikan terakhir?
          </span>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
            Wajib
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-500">
          Tingkat pendidikan merupakan salah satu faktor yang diperhitungkan dalam evaluasi kognitif.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'tidak_sekolah_sd', label: 'Tidak Sekolah / Tamat SD' },
            { id: 'smp', label: 'Tamat SMP / Sederajat' },
            { id: 'sma_smk', label: 'Tamat SMA / SMK / MA' },
            { id: 'diploma_sarjana', label: 'Diploma / Sarjana (D3/S1/S2/S3)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEducationLevel(item.id)}
              className={`min-h-[54px] px-4 py-3 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between ${
                educationLevel === item.id
                  ? 'bg-teal-50 border-teal-700 text-teal-950 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{item.label}</span>
              {educationLevel === item.id && (
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bagian 3: Bahasa Utama Sehari-hari (Wajib) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-950">
            3. Bahasa utama yang paling nyaman digunakan sehari-hari?
          </span>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
            Wajib
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'indonesia', label: 'Bahasa Indonesia' },
            { id: 'jawa', label: 'Bahasa Jawa' },
            { id: 'sunda', label: 'Bahasa Sunda' },
            { id: 'lainnya', label: 'Bahasa Lainnya' },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setPrimaryLanguage(lang.id)}
              className={`min-h-[52px] px-4 py-3 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between ${
                primaryLanguage === lang.id
                  ? 'bg-teal-50 border-teal-700 text-teal-950 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{lang.label}</span>
              {primaryLanguage === lang.id && (
                <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bagian 4: Ketersediaan Pendamping / Informan (Wajib) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-950">
            4. Apakah ada pendamping atau keluarga yang mendampingi?
          </span>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
            Wajib
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-500">
          Penilaian kognitif jauh lebih akurat bila ada pengamatan dari orang terdekat yang tinggal bersama atau sering berinteraksi.
        </p>

        <div className="space-y-3">
          {/* Opsi Ada Pendamping */}
          <div
            onClick={() => setHasInformant(true)}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              hasInformant
                ? 'bg-teal-50 border-teal-700 text-teal-950 shadow-xs'
                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  hasInformant ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-400 bg-white'
                }`}
              >
                {hasInformant && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-1">
                <span className="text-base sm:text-lg font-bold block">
                  Ya, ada pendamping (Anak, Pasangan, Kerabat, atau Kader)
                </span>
                <span className="text-sm text-slate-600 block">
                  Pendamping dapat membantu menjawab kuesioner observasi AD8-INA tentang perubahan yang diamati.
                </span>
              </div>
            </div>

            {hasInformant && (
              <div className="mt-4 pt-3 border-t border-teal-200/80">
                <label className="block text-sm font-semibold text-teal-950 mb-2">
                  Hubungan pendamping dengan orang yang diskrining:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'anak', label: 'Anak / Menantu' },
                    { id: 'pasangan', label: 'Suami / Istri' },
                    { id: 'kerabat', label: 'Kerabat / Saudara' },
                    { id: 'kader', label: 'Kader Posyandu / Nakes' },
                  ].map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInformantRelation(rel.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                        informantRelation === rel.id
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {rel.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Opsi Mengisi Sendiri */}
          <div
            onClick={() => setHasInformant(false)}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              !hasInformant
                ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-xs'
                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  !hasInformant ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-400 bg-white'
                }`}
              >
                {!hasInformant && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-1">
                <span className="text-base sm:text-lg font-bold block">
                  Tidak, mengisi sendiri secara mandiri
                </span>
                <span className="text-sm text-slate-600 block">
                  Kuesioner informan akan disesuaikan menjadi versi refleksi mandiri (dengan catatan tingkat keyakinan hasil lebih rendah).
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="min-h-[54px] px-6 py-3 text-base sm:text-lg font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 min-h-[54px] px-6 py-3 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil & Lanjut'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
