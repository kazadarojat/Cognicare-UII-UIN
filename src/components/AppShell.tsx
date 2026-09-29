import React from 'react';
import {
  Home,
  ClipboardList,
  History,
  Settings,
  ShieldCheck,
  Users,
  Activity,
  HeartPulse,
  Brain,
  AlertCircle,
  PencilRuler
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type MainNavTab = 'beranda' | 'skrining' | 'riwayat' | 'pengaturan';

interface AppShellProps {
  currentTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  onOpenKaderMode?: () => void;
  onOpenRulesTest?: () => void;
  isKaderActive?: boolean;
  isRulesActive?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onTabChange,
  onOpenKaderMode,
  onOpenRulesTest,
  isKaderActive = false,
  isRulesActive = false,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* 
        ========================================================================
        1. TABLET ONLY TOP BAR (768px - 1023px)
        Ringkas, efisien di layar sentuh tablet horizontal & vertikal
        ========================================================================
      */}
      <header className="hidden md:flex lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-950">
                CogniCare
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                Draf
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Skrining Risiko Kognitif Lansia
            </span>
          </div>
        </div>

        {/* Tablet Navigation Tabs */}
        <nav className="flex items-center gap-1.5" aria-label="Navigasi Tablet">
          <button
            type="button"
            onClick={() => onTabChange('beranda')}
            className={`min-h-[48px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              currentTab === 'beranda' && !isKaderActive && !isRulesActive
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('skrining')}
            className={`min-h-[48px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              currentTab === 'skrining' && !isKaderActive && !isRulesActive
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Skrining</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('riwayat')}
            className={`min-h-[48px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              currentTab === 'riwayat' && !isKaderActive && !isRulesActive
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('pengaturan')}
            className={`min-h-[48px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              currentTab === 'pengaturan' && !isKaderActive && !isRulesActive
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>
        </nav>

        <div className="flex items-center gap-2">
          {onOpenKaderMode && (
            <button
              type="button"
              onClick={onOpenKaderMode}
              className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isKaderActive
                  ? 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>Kader Demo</span>
            </button>
          )}
          <PWAInstallButton />
        </div>
      </header>

      {/* 
        ========================================================================
        2. DESKTOP / MAIN WRAPPER (SIDEBAR KIRI TETAP ≥1024px)
        ========================================================================
      */}
      <div className="flex-1 flex w-full">
        {/* SIDEBAR DESKTOP TETAP (Hanya tampil pada breakpoint lg: ≥1024px) */}
        <aside
          className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen select-none z-30"
          aria-label="Sidebar Navigasi Desktop"
        >
          {/* Bagian Atas: Logo & Label Status Draf Skrining Wajib */}
          <div className="p-6 border-b border-slate-100 space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-sm">
                C
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-950 block leading-tight">
                  CogniCare
                </span>
                <span className="text-xs text-slate-500 font-semibold block">
                  Platform Deteksi Risiko Kognitif
                </span>
              </div>
            </div>

            {/* Label DRAF & PROTOTIPE tetap jelas terlihat */}
            <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Prototipe Skrining · Draf
                </span>
              </div>
              <p className="text-[12px] text-amber-900 leading-snug">
                Bukan alat diagnosis medis. Dirancang untuk edukasi & pendampingan keluarga lansia.
              </p>
            </div>
          </div>

          {/* Navigasi Utama Sidebar Desktop */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Menu Utama">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-1">
              Menu Utama
            </div>

            <button
              type="button"
              onClick={() => onTabChange('beranda')}
              className={`w-full min-h-[50px] px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-all cursor-pointer ${
                currentTab === 'beranda' && !isKaderActive && !isRulesActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 shrink-0" />
                <span>Beranda & Panduan</span>
              </div>
              {currentTab === 'beranda' && !isKaderActive && !isRulesActive && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange('skrining')}
              className={`w-full min-h-[50px] px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-all cursor-pointer ${
                currentTab === 'skrining' && !isKaderActive && !isRulesActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 shrink-0" />
                <span>Alur Skrining Kognitif</span>
              </div>
              {currentTab === 'skrining' && !isKaderActive && !isRulesActive && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange('riwayat')}
              className={`w-full min-h-[50px] px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-all cursor-pointer ${
                currentTab === 'riwayat' && !isKaderActive && !isRulesActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 shrink-0" />
                <span>Riwayat & Tren Skor</span>
              </div>
              {currentTab === 'riwayat' && !isKaderActive && !isRulesActive && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onTabChange('pengaturan')}
              className={`w-full min-h-[50px] px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-all cursor-pointer ${
                currentTab === 'pengaturan' && !isKaderActive && !isRulesActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 shrink-0" />
                <span>Data Saya & Privasi</span>
              </div>
              {currentTab === 'pengaturan' && !isKaderActive && !isRulesActive && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>

            {/* Menu Khusus Pelatihan & Verifikasi */}
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-3 pt-6 pb-1">
              Simulasi & Audit
            </div>

            {onOpenKaderMode && (
              <button
                type="button"
                onClick={onOpenKaderMode}
                className={`w-full min-h-[50px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer border ${
                  isKaderActive
                    ? 'bg-amber-100 text-amber-950 border-amber-400 font-extrabold shadow-xs'
                    : 'bg-amber-50/60 text-amber-950 border-amber-200/90 hover:bg-amber-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="text-left leading-tight">
                    Mode Kader
                    <span className="block text-[11px] font-semibold text-amber-800">
                      12 Data Sintetis Terisolasi
                    </span>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  Demo
                </span>
              </button>
            )}

            {onOpenRulesTest && (
              <button
                type="button"
                onClick={onOpenRulesTest}
                className={`w-full min-h-[50px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer border ${
                  isRulesActive
                    ? 'bg-teal-100 text-teal-950 border-teal-400 font-extrabold shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PencilRuler className="w-5 h-5 text-teal-700 shrink-0" />
                  <span className="text-left leading-tight">
                    Uji Aturan Sintetis
                    <span className="block text-[11px] font-semibold text-slate-500">
                      Matriks 8 Kasus PRD 9.1
                    </span>
                  </span>
                </div>
              </button>
            )}
          </nav>

          {/* Bagian Bawah Sidebar: Tombol Pasang PWA & Jaminan Privasi */}
          <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/70">
            <PWAInstallButton />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>100% Offline & Lokal di Memori Browser</span>
            </div>
          </div>
        </aside>

        {/* 
          ========================================================================
          3. AREA KONTEN UTAMA (FLUID RESPONSIF)
          Desktop (≥1024px): Area lapang maksimal ±1200px dengan padding nyaman
          Tablet (768px-1023px): Area menengah dengan padding responsif
          Ponsel (<768px): Satu kolom fluid dengan ruang bawah untuk Bottom Nav
          ========================================================================
        */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8 lg:pb-10">
          {/* Header Mobile Ringkas (<768px) */}
          <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-white font-black text-lg">
                C
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-950 block leading-tight">
                  CogniCare
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                  Prototipe Skrining · Draf
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenKaderMode && (
                <button
                  type="button"
                  onClick={onOpenKaderMode}
                  className={`min-h-[44px] px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                    isKaderActive
                      ? 'bg-amber-100 text-amber-950 border-amber-400'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                  aria-label="Buka Mode Kader Demo"
                >
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[11px]">Kader</span>
                </button>
              )}
              <PWAInstallButton />
            </div>
          </header>

          {/* Kontainer Utama Konten: Lebar maksimal ±1200px di layar desktop lebar */}
          <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">
            {children}
          </main>

          {/* Footer Medis Wajib Global */}
          <footer className="no-print w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-200 text-center">
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Ini hasil skrining, bukan diagnosis. Prototipe, belum divalidasi. Seluruh data diproses dan disimpan secara lokal di perangkat Anda.
            </p>
          </footer>
        </div>
      </div>

      {/* 
        ========================================================================
        4. BOTTOM NAVIGATION UNTUK PONSEL (<768px)
        Tombol lebar sentuh nyaman (≥48px tinggi), ikon jelas, ramah satu jempol
        ========================================================================
      */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg"
        aria-label="Navigasi Bawah Ponsel"
      >
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => onTabChange('beranda')}
            className={`min-h-[52px] flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              currentTab === 'beranda' && !isKaderActive && !isRulesActive
                ? 'text-teal-800 bg-teal-50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Beranda</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('skrining')}
            className={`min-h-[52px] flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              currentTab === 'skrining' && !isKaderActive && !isRulesActive
                ? 'text-teal-800 bg-teal-50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Skrining</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('riwayat')}
            className={`min-h-[52px] flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              currentTab === 'riwayat' && !isKaderActive && !isRulesActive
                ? 'text-teal-800 bg-teal-50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Riwayat</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('pengaturan')}
            className={`min-h-[52px] flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              currentTab === 'pengaturan' && !isKaderActive && !isRulesActive
                ? 'text-teal-800 bg-teal-50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Pengaturan</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
