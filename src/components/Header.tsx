import React from 'react';
import { Trash2, Database, History, Users } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenDeleteModal: () => void;
  onOpenMyData?: () => void;
  onOpenHistory?: () => void;
  onOpenKaderMode?: () => void;
  hasStoredData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeleteModal,
  onOpenMyData,
  onOpenHistory,
  onOpenKaderMode,
  hasStoredData,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
          C
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-950 block leading-tight">
            CogniCare
          </span>
          <span className="text-xs text-amber-700 font-semibold inline-flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Prototipe Skrining · Draf
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Tombol PWA Pasang Aplikasi */}
        <PWAInstallButton />

        {/* Tombol Mode Kader Demo */}
        {onOpenKaderMode && (
          <button
            type="button"
            onClick={onOpenKaderMode}
            title="Buka Mode Kader (Data Demo)"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 active:scale-95 transition-all text-xs font-bold min-h-[38px]"
            aria-label="Mode Kader Data Demo"
          >
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Kader Demo</span>
          </button>
        )}

        {hasStoredData && onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            title="Buka Riwayat Penilaian"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 active:scale-95 transition-all text-xs font-bold min-h-[38px]"
            aria-label="Buka Riwayat Penilaian"
          >
            <History className="w-3.5 h-3.5 text-indigo-700" />
            <span className="hidden sm:inline">Riwayat</span>
          </button>
        )}

        {hasStoredData && onOpenMyData && (
          <button
            type="button"
            onClick={onOpenMyData}
            title="Buka Data Saya"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 active:scale-95 transition-all text-xs font-bold min-h-[38px]"
            aria-label="Buka Halaman Data Saya"
          >
            <Database className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden sm:inline">Data Saya</span>
          </button>
        )}

        {hasStoredData && (
          <button
            type="button"
            onClick={onOpenDeleteModal}
            title="Hapus Semua Data Lokal"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 active:scale-95 transition-all text-xs font-semibold min-h-[38px]"
            aria-label="Hapus Semua Data Lokal"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          </button>
        )}
      </div>
    </header>
  );
};
