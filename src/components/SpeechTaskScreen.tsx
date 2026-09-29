import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, Clock, Volume2, AlertCircle, Info, Sparkles, RefreshCw } from 'lucide-react';
import { CLINICAL_CONFIG } from '../config/clinical';
import { SpeechFeatures } from '../speech/types';
import { analyzeAudioSamples } from '../speech/pauseAnalysis';

interface SpeechTaskScreenProps {
  voiceConsented: boolean;
  initialSpeechFeatures?: SpeechFeatures;
  onBackToSleep: () => void;
  onSkipSpeechTask: () => void;
  onSaveSpeechFeatures: (features: SpeechFeatures) => Promise<void>;
  onComplete: (features?: SpeechFeatures) => void;
  onOpenSpeechTest: () => void;
}

export const SpeechTaskScreen: React.FC<SpeechTaskScreenProps> = ({
  voiceConsented,
  initialSpeechFeatures,
  onBackToSleep,
  onSkipSpeechTask,
  onSaveSpeechFeatures,
  onComplete,
  onOpenSpeechTest,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [computedFeatures, setComputedFeatures] = useState<SpeechFeatures | null>(
    initialSpeechFeatures || null
  );
  const [liveVolume, setLiveVolume] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const minDuration = CLINICAL_CONFIG.SPEECH_TASK.MIN_DURATION_SECONDS; // 60s
  const maxDuration = CLINICAL_CONFIG.SPEECH_TASK.MAX_DURATION_SECONDS; // 90s

  // Bersihkan audio stream dan timer jika komponen unmount
  useEffect(() => {
    return () => {
      cleanupAudioStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const cleanupAudioStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Mulai Perekaman Suara
  const startRecording = async () => {
    setMicPermissionError(null);
    audioChunksRef.current = [];
    setElapsedSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // Pertahankan sinyal akustik alami untuk jeda
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Inisialisasi Web Audio API untuk visualisasi live volume
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Monitor level volume live
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setLiveVolume(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Rekam via MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await processAndDiscardAudio();
      };

      mediaRecorder.start(250); // chunk setiap 250ms
      setIsRecording(true);

      // Jalankan Timer Detik
      const interval = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= maxDuration) {
            // Capai durasi maksimal 90 detik -> otomatis berhenti
            stopRecording();
          }
          return next;
        });
      }, 1000);
      timerIntervalRef.current = interval;
    } catch (err: unknown) {
      console.warn('Izin mikrofon ditolak atau gagal:', err);
      setMicPermissionError(
        'Akses mikrofon tidak dapat dibuka atau ditolak oleh peramban. Anda dapat melewati tugas ini.'
      );
    }
  };

  // Berhenti Merekam
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setLiveVolume(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Ekstraksi Fitur & Pembuangan Audio dari Memori
  const processAndDiscardAudio = async () => {
    setIsAnalyzing(true);
    try {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      // Segera kosongkan chunks mentah
      audioChunksRef.current = [];

      const arrayBuffer = await blob.arrayBuffer();

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const offlineCtx = new AudioCtx();
      const decodedBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
      await offlineCtx.close();

      const sampleRate = decodedBuffer.sampleRate;
      const channelData = decodedBuffer.getChannelData(0); // Ambil saluran pertama

      // Hitung fitur jeda dengan fungsi murni
      const features = analyzeAudioSamples(channelData, sampleRate);
      setComputedFeatures(features);

      // PENTING (PRD Bagian 2 & 9.2):
      // Hanya fitur numerik yang disimpan; audio tidak disimpan dan dibuang dari memori.
      await onSaveSpeechFeatures(features);
    } catch (err) {
      console.error('Kendala ekstraksi fitur bicara:', err);
    } finally {
      cleanupAudioStream();
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setComputedFeatures(null);
    setElapsedSeconds(0);
    setMicPermissionError(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // KONDISI 1: Pengguna TIDAK mencentang persetujuan suara di awal
  if (!voiceConsented) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <MicOff className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tugas Bicara Dilewati
          </h1>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              Pada lembar persetujuan awal, Anda memilih untuk <strong>tidak mengaktifkan izin mikrofon</strong>.
            </p>
            <p className="text-slate-600">
              Sesuai kaidah privasi PRD, mikrofon tidak akan diakses sama sekali. Skrining risiko kognitif tetap dapat diselesaikan lengkap dengan catatan <em>"tanpa indikator bicara"</em>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onBackToSleep}
              className="min-h-[52px] px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 text-base"
            >
              Kembali ke Pola Tidur
            </button>
            <button
              type="button"
              onClick={onSkipSpeechTask}
              className="flex-1 min-h-[52px] px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base shadow-md shadow-teal-900/10 flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Hasil / Data Saya</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Navigasi */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onBackToSleep}
          disabled={isRecording || isAnalyzing}
          className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 py-1.5 focus:outline-none disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Pola Tidur</span>
        </button>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full inline-block">
              Tugas Bicara Singkat · Draf
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1 flex items-center gap-2">
              <Mic className="w-7 h-7 text-teal-700" />
              Tugas Bercerita (60–90 Detik)
            </h1>
          </div>

          <button
            type="button"
            onClick={onOpenSpeechTest}
            className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200"
          >
            Uji Sampel Sintetis (/uji-bicara)
          </button>
        </div>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Tugas ini mengukur durasi dan pola jeda saat bercerita santai. Audio <strong>tidak disimpan</strong> dan segera dibuang setelah fitur numerik dihitung.
        </p>
      </div>

      {/* Peringatan Izin Mikrofon Bermasalah */}
      {micPermissionError && (
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-3 text-amber-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold">Mikrofon Tidak Dapat Dibuka</h2>
              <p className="text-sm sm:text-base leading-relaxed">{micPermissionError}</p>
            </div>
          </div>
          <div className="pt-1 flex gap-3">
            <button
              type="button"
              onClick={onSkipSpeechTask}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-sm hover:bg-amber-800 transition-colors"
            >
              Lewati Tugas Bicara Ini
            </button>
            <button
              type="button"
              onClick={startRecording}
              className="min-h-[48px] px-4 py-2.5 rounded-xl border border-amber-400 bg-white text-amber-900 font-bold text-sm hover:bg-amber-100 transition-colors"
            >
              Coba Buka Lagi
            </button>
          </div>
        </div>
      )}

      {/* Kartu Pemandu Bicara */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800 block">
            Pemandu Tugas
          </span>
          <p className="text-lg sm:text-xl font-bold text-teal-950 leading-relaxed">
            "{CLINICAL_CONFIG.SPEECH_TASK.PROMPT_TEXT}"
          </p>
          <span className="text-xs sm:text-sm text-slate-600 block mt-1">
            Ceritakan dengan santai dan tenang. Bila perlu berhenti berpikir, tidak apa-apa.
          </span>
        </div>

        {/* Tampilan Status Perekaman & Timer */}
        {!computedFeatures && (
          <div className="flex flex-col items-center justify-center py-4 space-y-5">
            {/* Visual Timer */}
            <div className="text-center space-y-1">
              <span className="text-4xl sm:text-5xl font-mono font-black text-slate-900">
                {formatTime(elapsedSeconds)}
              </span>
              <span className="text-xs text-slate-500 block">
                Target: {minDuration}–{maxDuration} detik (Minimal 60s)
              </span>
            </div>

            {/* Indikator Volume Suara Live saat Rekam */}
            {isRecording && (
              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Intensitas Suara Mikrofon:</span>
                  <span className="font-bold text-teal-700">{liveVolume}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-teal-600 h-full transition-all duration-75"
                    style={{ width: `${Math.min(100, liveVolume * 1.5)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tombol Utama Rekam / Berhenti */}
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={isAnalyzing}
                className="w-full max-w-xs min-h-[60px] px-6 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-lg shadow-lg shadow-teal-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Mulai Rekam Narasi</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="w-full max-w-xs min-h-[60px] px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-lg shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer animate-pulse"
              >
                <Square className="w-6 h-6 fill-current" />
                <span>Selesai & Analisis</span>
              </button>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-teal-800 font-semibold animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menganalisis pola jeda di browser... Audio akan segera dibuang.</span>
              </div>
            )}
          </div>
        )}

        {/* Tampilan Hasil Analisis Numerik di Perangkat */}
        {computedFeatures && (
          <div className="space-y-5 pt-2 animate-fadeIn">
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-base font-bold block">Analisis Jeda Selesai</span>
                  <span className="text-xs text-emerald-800">
                    Audio telah dihapus dari memori. Hanya fitur numerik berikut yang tersimpan.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRetake}
                className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                Rekam Ulang
              </button>
            </div>

            {/* Grid Metrik Fitur Bicara (PRD Bagian 9.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-500 block">Durasi Total</span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {computedFeatures.durationSeconds}s
                </span>
                <span className="text-[10px] text-slate-500">detik bicara</span>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
                <span className="text-xs uppercase font-bold text-teal-800 block">Jumlah Jeda</span>
                <span className="text-2xl font-black text-teal-950 block mt-0.5">
                  {computedFeatures.pauseCount}
                </span>
                <span className="text-[10px] text-teal-700">jeda &ge; 500 ms</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-500 block">Total Waktu Jeda</span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {computedFeatures.totalPauseSeconds}s
                </span>
                <span className="text-[10px] text-slate-500">detik hening</span>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
                <span className="text-xs uppercase font-bold text-teal-800 block">Rasio Jeda</span>
                <span className="text-2xl font-black text-teal-950 block mt-0.5">
                  {computedFeatures.pauseRatio}
                </span>
                <span className="text-[10px] text-teal-700">total jeda / durasi</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-500 block">Rerata Jeda</span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {computedFeatures.meanPauseSeconds}s
                </span>
                <span className="text-[10px] text-slate-500">rerata per jeda</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-500 block">Kualitas</span>
                <span className="text-sm font-bold text-slate-900 block mt-2 capitalize">
                  {computedFeatures.qualityFlags.includes('good')
                    ? 'Baik'
                    : computedFeatures.qualityFlags.join(', ')}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed">
              <strong>Catatan Ilmiah (PRD Bagian 9.2):</strong> Fitur jeda ini belum divalidasi klinis untuk penutur Indonesia dan hanya tampil sebagai indikator pendukung netral tanpa memvonis risiko.
            </div>
          </div>
        )}
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onSkipSpeechTask}
          disabled={isRecording || isAnalyzing}
          className="min-h-[54px] px-5 py-3 text-base font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-2xl border border-slate-300 transition-colors disabled:opacity-50"
        >
          Lewati Tugas Ini
        </button>

        <button
          type="button"
          onClick={() => onComplete(computedFeatures || undefined)}
          disabled={isRecording || isAnalyzing}
          className="flex-1 min-h-[54px] px-6 py-3 text-lg font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.99] rounded-2xl transition-all shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{computedFeatures ? 'Simpan & Lihat Hasil Skrining' : 'Lanjut ke Hasil Skrining'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
