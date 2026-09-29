import React from 'react';
import { CheckCircle2, User, Database, Mic, ShieldCheck, Edit3, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { UserProfile, UserConsent } from '../db/types';

interface M1CompleteScreenProps {
  profile: UserProfile;
  consent: UserConsent;
  onEditProfile: () => void;
  onEditConsent: () => void;
  onOpenDeleteModal: () => void;
  onProceedToM2: () => void;
}

export const M1CompleteScreen: React.FC<M1CompleteScreenProps> = ({
  profile,
  consent,
  onEditProfile,
  onEditConsent,
  onOpenDeleteModal,
  onProceedToM2,
}) => {
  const getEducationLabel = (id: string) => {
    switch (id) {
      case 'tidak_sekolah_sd':
        return 'Tidak Sekolah / Tamat SD';
      case 'smp':
        return 'Tamat SMP / Sederajat';
      case 'sma_smk':
        return 'Tamat SMA / SMK / MA';
      case 'diploma_sarjana':
        return 'Diploma / Sarjana (D3/S1/S2/S3)';
      default:
        return id;
    }
  };

  const getLanguageLabel = (id: string) => {
    switch (id) {
      case 'indonesia':
        return 'Bahasa Indonesia';
      case 'jawa':
        return 'Bahasa Jawa';
      case 'sunda':
        return 'Bahasa Sunda';
      case 'lainnya':
        return 'Bahasa Lainnya';
      default:
        return id;
    }
  };

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Banner Berhasil */}
      <div className="bg-teal-50 border-2 border-teal-600 rounded-3xl p-6 text-center space-y-3">
        <div className="w-14 h-14 bg-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-950">
          Profil Berhasil Disimpan!
        </h1>
        <p className="text-base sm:text-lg text-teal-900 leading-relaxed max-w-md mx-auto">
          Persetujuan dan profil dasar telah tersimpan di memori peramban lokal (IndexedDB).
        </p>
      </div>

      {/* Tombol Utama Lanjut ke M2 */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onProceedToM2}
          className="w-full min-h-[56px] px-6 py-4 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          <span>Lanjut ke Kuesioner AD8-INA (M2)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Ringkasan Data Tersimpan di IndexedDB */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-700" />
            Data Profil Tersimpan
          </h2>
          <button
            type="button"
            onClick={onEditProfile}
            className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Usia</span>
            <span className="text-lg font-bold text-slate-900">{profile.age} Tahun</span>
            {profile.age < 50 && (
              <span className="text-xs text-amber-700 block mt-0.5">
                (Di bawah 50 th: mode simulasi)
              </span>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Pendidikan</span>
            <span className="text-base font-bold text-slate-900">
              {getEducationLabel(profile.educationLevel)}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Bahasa Utama</span>
            <span className="text-base font-bold text-slate-900">
              {getLanguageLabel(profile.primaryLanguage)}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs uppercase font-bold text-slate-500 block mb-1">Pendamping / Informan</span>
            <span className="text-base font-bold text-slate-900">
              {profile.hasInformant ? (
                <span className="text-teal-800 font-semibold">
                  Ada ({profile.informantRelation || 'Pendamping'})
                </span>
              ) : (
                <span className="text-amber-800 font-semibold">Mengisi Sendiri (Mandiri)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Ringkasan Status Persetujuan (Consent) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            Status Persetujuan (Consent)
          </h2>
          <button
            type="button"
            onClick={onEditConsent}
            className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200">
            <div className="space-y-0.5">
              <span className="text-base font-bold text-teal-950 block">
                Persetujuan Data Dasar (Wajib)
              </span>
              <span className="text-xs text-teal-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Disetujui: {formatTimestamp(consent.basicDataAt)}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-700 text-white">
              Aktif
            </span>
          </div>

          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              consent.voiceConsented
                ? 'bg-teal-50/60 border-teal-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-base font-bold text-slate-900 block">
                Persetujuan Tugas Bicara & Mikrofon
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1">
                {consent.voiceConsented ? (
                  <>
                    <Clock className="w-3.5 h-3.5" /> Disetujui: {formatTimestamp(consent.voiceAt)}
                  </>
                ) : (
                  'Dilewati (Tugas bicara akan dilewati otomatis)'
                )}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                consent.voiceConsented
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {consent.voiceConsented ? 'Aktif' : 'Dilewati'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Penyimpanan IndexedDB */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 text-slate-700 text-sm">
        <Database className="w-5 h-5 text-slate-600 shrink-0" />
        <span>
          Basis Data Lokal: <strong>CogniCareDB (IndexedDB)</strong> · Data tersimpan persisten di browser ini tanpa koneksi internet.
        </span>
      </div>

      {/* Tombol Hapus Data */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="text-base font-semibold text-rose-600 hover:text-rose-800 underline underline-offset-4 py-2"
        >
          Hapus Semua Data & Mulai Ulang
        </button>
      </div>
    </div>
  );
};
