import React from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Database,
  Mic,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ClipboardList,
  Activity,
  Users
} from 'lucide-react';

interface OnboardingScreenProps {
  onStart: () => void;
  onOpenKaderDemo?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStart, onOpenKaderDemo }) => {
  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* 
        ========================================================================
        BAGIAN ATAS: DESKTOP TWO-COLUMN HERO (Layar Lebar) / Satu Kolom di Mobile
        Kiri: Teks Sambutan & Call to Action
        Kanan: Kartu Ringkas "Cara Kerja" 3 Langkah yang Informatif
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Pengenalan & Mulai Skrining (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Inisiatif Kesehatan Kognitif Komunitas Indonesia</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-950 tracking-tight leading-tight">
              Skrining Risiko Kognitif Ramah Keluarga
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              CogniCare membantu Anda, lansia, dan keluarga mendeteksi dini perubahan daya ingat serta merencanakan langkah hidup sehat harian yang terarah dan bermakna.
            </p>
          </div>

          {/* Peringatan Klinis Wajib */}
          <div className="p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3.5 text-amber-950">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 block">
                Pemberitahuan Medis Wajib
              </span>
              <p className="text-base font-bold text-amber-950 leading-snug">
                Ini hasil skrining, bukan diagnosis. Prototipe, belum divalidasi.
              </p>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Aplikasi ini merupakan instrumen skrining awal risiko, bukan pengganti pemeriksaan medis oleh dokter di Puskesmas atau rumah sakit.
              </p>
            </div>
          </div>

          {/* Tombol Utama */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              onClick={onStart}
              className="flex-1 min-h-[52px] sm:min-h-[56px] px-6 py-4 text-base sm:text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <span>Mulai Skrining Kognitif</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>

            {onOpenKaderDemo && (
              <button
                type="button"
                onClick={onOpenKaderDemo}
                className="min-h-[52px] sm:min-h-[56px] px-5 py-3 text-sm sm:text-base font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-amber-700" />
                <span>Simulasi Kader (12 Demo)</span>
              </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan: 3 Langkah Cara Kerja (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ClipboardList className="w-4 h-4" />
              <span>Cara Kerja 3 Langkah Sederhana</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Cepat, Mudah, dan Menjaga Martabat Lansia
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dapat diisi santai bersama anak, cucu, atau kader kesehatan dalam waktu kurang dari 10 menit.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-3.5 sm:p-4 rounded-2xl flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-xl bg-teal-400 text-teal-950 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-0.5">
                <strong className="text-sm sm:text-base text-white block">
                  Profil & Kuesioner Observasi (AD8)
                </strong>
                <span className="text-xs text-slate-300 block leading-snug">
                  8 pertanyaan kebiasaan harian yang dijawab oleh pendamping keluarga.
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-3.5 sm:p-4 rounded-2xl flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-xl bg-teal-400 text-teal-950 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-0.5">
                <strong className="text-sm sm:text-base text-white block">
                  Faktor Gaya Hidup Lancet & Pola Tidur
                </strong>
                <span className="text-xs text-slate-300 block leading-snug">
                  14 faktor kesehatan fisik yang dapat dicegah serta kualitas tidur malam.
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-3.5 sm:p-4 rounded-2xl flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-xl bg-teal-400 text-teal-950 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-0.5">
                <strong className="text-sm sm:text-base text-white block">
                  Hasil Dashboard & Rencana Aksi
                </strong>
                <span className="text-xs text-slate-300 block leading-snug">
                  Ringkasan tingkat risiko, 3 langkah prioritas, dan lembar konsultasi dokter.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center gap-2 text-xs text-teal-200">
            <ShieldCheck className="w-4 h-4 shrink-0 text-teal-300" />
            <span>100% Data diproses lokal di peramban tanpa koneksi server.</span>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        BAGIAN BAWAH: GRID INFORMASI DATA YANG DIKUMPULKAN & JAMINAN PRIVASI
        Desktop: 4 Kolom Rapi / Tablet 2 Kolom / Mobile 1 Kolom
        ========================================================================
      */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-teal-700" />
              Komponen Penilaian yang Dinilai
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Setiap komponen dirancang berdasarkan standar panduan klinis internasional dan disesuaikan untuk konteks Indonesia:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <strong className="block text-base text-slate-950">Profil Dasar</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Usia, pendidikan terakhir, bahasa percakapan, dan status ada/tidaknya pendamping pengamat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <strong className="block text-base text-slate-950">Kuesioner AD8-INA</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              8 butir penilaian perubahan kognitif yang dijawab pengamat (anak/pasangan/keluarga).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <strong className="block text-base text-slate-950">14 Faktor Gaya Hidup</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Faktor kesehatan fisik modifikasi Lancet 2024 (tensi, pendengaran, aktivitas, IMT).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 font-extrabold text-sm flex items-center justify-center">
              4
            </div>
            <strong className="block text-base text-slate-950">Tugas Suara (Opsional)</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bercerita 60–90 detik untuk mendeteksi pola jeda bicara alami tanpa menyimpan rekaman suara.
            </p>
          </div>
        </div>

        {/* Jaminan Privasi Total */}
        <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <Database className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs sm:text-sm text-teal-950 leading-relaxed">
            <strong className="font-bold text-teal-950 block">
              Jaminan Privasi Penuh: Tidak Ada Rekaman Suara atau Data Pribadi Keluar
            </strong>
            <p>
              Semua jawaban, metrik suara, dan skor disimpan di basis data lokal peramban (IndexedDB) pada perangkat ini saja. Tidak ada pelacak daring, tidak ada login akun, dan Anda dapat menghapus seluruh data kapan saja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
