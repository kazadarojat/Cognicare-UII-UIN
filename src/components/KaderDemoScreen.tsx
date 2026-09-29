import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  X,
  Filter,
  Sparkles,
  Moon,
  Mic,
  HelpCircle,
  Activity,
  Table,
  UserCheck
} from 'lucide-react';
import demoData from '../demo/syntheticData.json';

interface KaderDemoScreenProps {
  onBack: () => void;
}

export const KaderDemoScreen: React.FC<KaderDemoScreenProps> = ({ onBack }) => {
  const [selectedItem, setSelectedItem] = useState<typeof demoData.items[0] | null>(null);
  const [filterRisk, setFilterRisk] = useState<'semua' | 'rendah' | 'sedang' | 'tinggi'>('semua');

  const filteredItems = demoData.items.filter((item) => {
    if (filterRisk === 'semua') return true;
    return item.riskLevel === filterRisk;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Mode Kader */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-slate-950 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Aplikasi Utama</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-black text-xl shadow-xs">
              <Users className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-wider text-amber-950 bg-amber-200/90 border border-amber-400 px-3 py-0.5 rounded-full inline-block shadow-2xs">
                  {demoData.badge}
                </span>
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-800">
                  Pelatihan Kader Posyandu Lansia
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                Mode Kader: Tabel 12 Kasus Sintetis
              </h1>
            </div>
          </div>

          {/* Filter Risiko */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {(['semua', 'rendah', 'sedang', 'tinggi'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterRisk(lvl)}
                className={`min-h-[40px] px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterRisk === lvl
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {demoData.disclaimer}
        </p>
      </div>

      {/* Banner Peringatan Data Terisolasi & Kalimat Wajib */}
      <div className="p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl flex items-start gap-3.5 text-amber-950 shadow-xs">
        <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs sm:text-sm">
          <strong className="block font-bold text-base text-amber-950">
            Simulasi Terisolasi — Data Tidak Menyentuh IndexedDB
          </strong>
          <p className="text-amber-950 font-bold leading-relaxed">
            Ini hasil skrining, bukan diagnosis. Prototipe, belum divalidasi.
          </p>
          <p className="text-amber-900/90 leading-relaxed mt-0.5">
            Daftar 12 baris di bawah ini dimuat langsung dari berkas statis terpisah (<code>src/demo/syntheticData.json</code>). Membuka atau meninjau data ini tidak akan mengubah ataupun mencemari riwayat penilaian pengguna asli di perangkat.
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        TABEL 12 BARIS DATA DEMO RESPONSIF DENGAN BADGE "DATA DEMO" JELAS
        ========================================================================
      */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-teal-700" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-950">
              Tabel 12 Baris Profil Sintetis Kader
            </h2>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            DATA DEMO · TERISOLASI
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase text-xs font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No & Profil</th>
                <th className="py-3 px-4">Pendamping</th>
                <th className="py-3 px-4">Skor AD8</th>
                <th className="py-3 px-4">Keluhan</th>
                <th className="py-3 px-4">Tidur</th>
                <th className="py-3 px-4">Tingkat Risiko</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredItems.map((item, idx) => {
                const badgeRisk =
                  item.riskLevel === 'tinggi'
                    ? 'bg-rose-100 text-rose-950 border-rose-300'
                    : item.riskLevel === 'sedang'
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-emerald-100 text-emerald-950 border-emerald-300';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="block font-bold text-slate-950">{item.name}</span>
                          <span className="text-xs text-slate-500">{item.age} tahun · {item.education}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.informant ? (
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {item.informant}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Mandiri
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-slate-900">{item.ad8Score}</span>
                      <span className="text-xs text-slate-500"> / 8</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.complaintsCount} keluhan
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.sleepHours} jam
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeRisk}`}>
                        Risiko {item.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Item Demo */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 border-2 border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  DATA DEMO KADER
                </span>
                <h3 className="text-xl font-bold text-slate-950">{selectedItem.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedItem.age} tahun · {selectedItem.education}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950">
              <strong>Catatan Kader:</strong> {selectedItem.notes}
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Skor AD8:</span>
                <strong>{selectedItem.ad8Score} dari 8</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Status Pendamping:</span>
                <strong>{selectedItem.informant || 'Mandiri'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Keluhan Memori:</span>
                <strong>{selectedItem.complaintsCount} butir</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Durasi Tidur:</span>
                <strong>{selectedItem.sleepHours} jam</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Tingkat Risiko:</span>
                <strong className="capitalize text-teal-800">{selectedItem.riskLevel}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="w-full min-h-[48px] py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-bold"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
