import React, { useState } from 'react';
import {
  ArrowLeft,
  History,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  BarChart2,
  Table,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { AssessmentRecord, UserProfile } from '../db/types';
import { evaluateRisk } from '../engine/riskEngine';

interface HistoryScreenProps {
  assessments: AssessmentRecord[];
  profile: UserProfile | null;
  onBack: () => void;
  onSelectAssessment: (record: AssessmentRecord) => void;
  onAddPeriodicEvaluation: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  assessments,
  profile,
  onBack,
  onSelectAssessment,
  onAddPeriodicEvaluation,
}) => {
  // Urutkan penilaian dari yang paling lama ke yang terbaru untuk grafik
  const sortedForChart = [...assessments].sort((a, b) => a.createdAt - b.createdAt);

  // Urutkan penilaian dari yang terbaru ke yang terlama untuk daftar/tabel
  const sortedForList = [...assessments].sort((a, b) => b.createdAt - a.createdAt);

  // Format data untuk Recharts
  const chartData = sortedForChart.map((record, index) => {
    const d = new Date(record.createdAt);
    const dateLabel = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });

    const yesCount =
      record.ad8Score ??
      (record.ad8Answers
        ? Object.values(record.ad8Answers).filter((v) => v === 'yes').length
        : 0);

    const complaintsCount =
      record.complaintsCount ?? (record.complaintIds ? record.complaintIds.length : 0);
    const sleepHours = record.sleepSummary ? record.sleepSummary.avgHours : 7;

    return {
      name: `#${index + 1} (${dateLabel})`,
      fullDate: d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      ad8Score: yesCount,
      complaintsCount,
      sleepHours,
    };
  });

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Halaman Riwayat */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-slate-950 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
              Modul F10 · Pemantauan Berkala
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Riwayat & Tren Skor Berkala
            </h1>
          </div>

          <button
            type="button"
            onClick={onAddPeriodicEvaluation}
            className="min-h-[48px] inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-700 text-white font-bold text-sm shadow-sm hover:bg-teal-800 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Simulasikan Penilaian Berkala</span>
          </button>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pemantauan fungsi kognitif secara longitudinal. Grafik di bawah memperlihatkan perubahan skor kuesioner observasi AD8, jumlah keluhan mandiri, dan rata-rata jam tidur.
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
            Riwayat dan tren skor berkala ini ditujukan untuk pemantauan gaya hidup mandiri, bukan pengganti pemeriksaan medis oleh dokter spesialis saraf atau dokter umum.
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        BAGIAN 1: GRAFIK TREN SKOR BERKALA (LEBAR PENUH RESPONSIF)
        Recharts responsive container menjangkau lebar penuh kontainer desktop
        ========================================================================
      */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-teal-700" />
            Grafik Tren Skor Longitudinal
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {assessments.length} Penilaian Tersimpan
          </span>
        </div>

        {assessments.length < 2 ? (
          /* Pesan Ramah bila baru satu penilaian */
          <div className="p-8 bg-teal-50/60 border-2 border-dashed border-teal-300 rounded-3xl text-center space-y-3 my-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-xs">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-teal-950">
                Grafik tren akan muncul setelah ada minimal dua kali penilaian berkala.
              </h3>
              <p className="text-xs sm:text-sm text-teal-900/90 max-w-lg mx-auto leading-relaxed">
                Terus pantau kesehatan kognitif secara rutin. Anda dapat mengulang skrining setiap 3–6 bulan sekali untuk memantau kestabilan fungsi berpikir.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onAddPeriodicEvaluation}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-white text-teal-900 border border-teal-300 hover:bg-teal-100 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simulasikan Penilaian Berkala ke-2</span>
              </button>
            </div>
          </div>
        ) : (
          /* Tampilan Grafik Lebar Penuh */
          <div className="space-y-3 pt-2">
            <div className="h-72 sm:h-80 lg:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#475569' }}
                    stroke="#cbd5e1"
                  />
                  <YAxis
                    domain={[0, 9]}
                    tick={{ fontSize: 12, fill: '#475569' }}
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '13px',
                      padding: '12px',
                      border: 'none',
                    }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
                  <Line
                    type="monotone"
                    name="Skor AD8 (0-8)"
                    dataKey="ad8Score"
                    stroke="#0f766e"
                    strokeWidth={3}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    name="Keluhan Subjektif"
                    dataKey="complaintsCount"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    name="Durasi Tidur (Jam)"
                    dataKey="sleepHours"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center italic">
              Grafik interaktif menunjukkan tren longitudinal: skor AD8 (garis hijau), keluhan memori (garis ungu), dan jam tidur (garis oranye putus-putus).
            </p>
          </div>
        )}
      </div>

      {/* 
        ========================================================================
        BAGIAN 2: TABEL RIWAYAT LENGKAP RESPONSIF DI BAWAH GRAFIK
        Desktop: Tampilan Tabel Elegan dengan Baris Jelas
        Mobile: Tampilan Kartu Kompak
        ========================================================================
      */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2">
            <Table className="w-5 h-5 text-teal-700" />
            Tabel Rincian Penilaian Tersimpan
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Total {sortedForList.length} rekaman di IndexedDB
          </span>
        </div>

        {/* Tabel untuk Layar Desktop & Tablet (hidden di mobile kecil jika prefer table scrollable) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase text-xs font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Skor AD8</th>
                <th className="py-3 px-4">Keluhan</th>
                <th className="py-3 px-4">Tidur</th>
                <th className="py-3 px-4">Status Risiko</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedForList.map((record, idx) => {
                const yesCount =
                  record.ad8Score ??
                  (record.ad8Answers
                    ? Object.values(record.ad8Answers).filter((v) => v === 'yes').length
                    : 0);
                const complaintsCount =
                  record.complaintsCount ??
                  (record.complaintIds ? record.complaintIds.length : 0);
                const sleepHours = record.sleepSummary ? record.sleepSummary.avgHours : 7;

                // Hitung status risiko
                const risk = evaluateRisk({
                  ad8Score: yesCount,
                  ad8AnsweredCount: record.ad8AnsweredCount || 8,
                  hasInformant: profile?.hasInformant ?? false,
                  complaintsCount,
                  profile: profile || undefined,
                  riskFactorStatuses: record.riskFactorStatuses,
                  sleepSummary: record.sleepSummary,
                  speechFeatures: record.speechFeatures,
                });

                const badgeRisk =
                  risk.level === 'tinggi'
                    ? 'bg-rose-100 text-rose-950 border-rose-300'
                    : risk.level === 'sedang'
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-emerald-100 text-emerald-950 border-emerald-300';

                return (
                  <tr
                    key={record.id || idx}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-slate-900">{yesCount}</span>
                      <span className="text-xs text-slate-500"> / 8</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {complaintsCount} keluhan
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {sleepHours} jam
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeRisk}`}>
                        Risiko {risk.level === 'tinggi' ? 'Tinggi' : risk.level === 'sedang' ? 'Sedang' : 'Rendah'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectAssessment(record)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold cursor-pointer transition-all"
                      >
                        <span>Lihat Rincian</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
