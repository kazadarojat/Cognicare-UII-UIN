import React from 'react';
import { CheckCircle2, ClipboardList, AlertCircle, Edit3, ArrowRight, UserCheck, ShieldCheck, Database, Activity } from 'lucide-react';
import { UserProfile, AssessmentRecord } from '../db/types';
import complaintsConfig from '../config/complaints.json';
import ad8Config from '../config/questionnaires/ad8_ina.json';

interface M2CompleteScreenProps {
  profile: UserProfile;
  assessment: AssessmentRecord;
  onEditAD8: () => void;
  onEditComplaints: () => void;
  onViewProfile: () => void;
  onOpenDeleteModal: () => void;
  onProceedToM3: () => void;
}

export const M2CompleteScreen: React.FC<M2CompleteScreenProps> = ({
  profile,
  assessment,
  onEditAD8,
  onEditComplaints,
  onViewProfile,
  onOpenDeleteModal,
  onProceedToM3,
}) => {
  const ad8Answers = assessment.ad8Answers || {};
  const yesCount = Object.values(ad8Answers).filter((v) => v === 'yes').length;
  const noCount = Object.values(ad8Answers).filter((v) => v === 'no').length;
  const unknownCount = Object.values(ad8Answers).filter((v) => v === 'unknown').length;
  const answeredCount = yesCount + noCount;

  const selectedComplaints = complaintsConfig.items.filter((c) =>
    assessment.complaintIds?.includes(c.id)
  );

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Banner Selesai M2 */}
      <div className="bg-teal-50 border-2 border-teal-600 rounded-3xl p-6 text-center space-y-3">
        <div className="w-14 h-14 bg-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-950">
          Kuesioner AD8 & Keluhan Selesai!
        </h1>
        <p className="text-base sm:text-lg text-teal-900 leading-relaxed max-w-md mx-auto">
          Skor AD8 ({yesCount}) dan keluhan ({selectedComplaints.length}) telah tersimpan persisten di IndexedDB browser Anda.
        </p>
      </div>

      {/* Tombol Utama Lanjut ke M3 */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onProceedToM3}
          className="w-full min-h-[56px] px-6 py-4 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          <Activity className="w-5 h-5" />
          <span>Lanjut ke Faktor Risiko Gaya Hidup (M3)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Kartu Skor AD8-INA */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-700" />
              Skor Kuesioner AD8-INA
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Status: {ad8Config.status}
            </span>
          </div>
          <button
            type="button"
            onClick={onEditAD8}
            className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah</span>
          </button>
        </div>

        {/* Peringatan Mandiri bila tanpa pendamping */}
        {!profile.hasInformant && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Catatan Pengisian Mandiri:</strong> Kuesioner diisi sendiri tanpa pendamping. Sesuai PRD, hasil pengamatan mandiri kurang dapat diandalkan dibandingkan pengamatan pihak kedua/informan.
            </div>
          </div>
        )}

        {/* Kotak Metrik Skor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
            <span className="text-xs font-bold text-teal-800 uppercase block">Skor AD8 (Ya)</span>
            <span className="text-3xl font-black text-teal-950 block mt-1">{yesCount}</span>
            <span className="text-xs text-teal-700">dari 8 butir</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase block">Tidak</span>
            <span className="text-3xl font-black text-slate-900 block mt-1">{noCount}</span>
            <span className="text-xs text-slate-500">tidak berubah</span>
          </div>

          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase block">Tidak Tahu</span>
            <span className="text-3xl font-black text-amber-950 block mt-1">{unknownCount}</span>
            <span className="text-xs text-amber-700">tak dihitung skor</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase block">Terjawab</span>
            <span className="text-3xl font-black text-slate-900 block mt-1">{answeredCount}</span>
            <span className="text-xs text-slate-500">butir valid</span>
          </div>
        </div>
      </div>

      {/* Kartu Keluhan Subjektif */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-700" />
              Keluhan Subjektif
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Status: {complaintsConfig.status}
            </span>
          </div>
          <button
            type="button"
            onClick={onEditComplaints}
            className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-base font-semibold text-slate-700">Total Keluhan yang Dipilih:</span>
          <span className="text-lg font-black text-teal-900 bg-teal-100 px-3 py-1 rounded-xl">
            {selectedComplaints.length} Keluhan
          </span>
        </div>

        {selectedComplaints.length > 0 ? (
          <ul className="space-y-2">
            {selectedComplaints.map((item) => (
              <li
                key={item.id}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 flex items-start gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm text-slate-600">
            Tidak ada keluhan subjektif yang dipilih.
          </div>
        )}
      </div>

      {/* Info Basis Data & Privasi */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 text-slate-700 text-sm">
        <Database className="w-5 h-5 text-slate-600 shrink-0" />
        <span>
          Semua jawaban disimpan persisten di IndexedDB lokal browser Anda. Reload halaman tidak akan menghilangkan jawaban.
        </span>
      </div>

      {/* Navigasi Tambahan */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onViewProfile}
          className="flex-1 min-h-[50px] px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-base"
        >
          Lihat Profil Pengguna (M1)
        </button>
        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="min-h-[50px] px-4 py-2.5 rounded-2xl border border-rose-200 text-rose-700 font-semibold hover:bg-rose-50 transition-colors text-base"
        >
          Hapus Semua Data
        </button>
      </div>
    </div>
  );
};
