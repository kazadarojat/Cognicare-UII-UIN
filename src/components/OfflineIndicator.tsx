import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../pwa/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 border border-slate-700 px-4 py-2.5 text-xs text-white shadow-xl backdrop-blur-xs animate-fadeIn">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
      <div className="leading-tight">
        <strong className="block text-amber-300 font-bold">Mode Luar Jaringan (Offline)</strong>
        <span className="text-slate-300 text-[11px]">Kuesioner dan kalkulasi risiko tetap berjalan penuh tanpa internet.</span>
      </div>
    </div>
  );
};
