/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { db } from './db/db';
import { UserProfile, UserConsent, AssessmentRecord, BodyMeasurements, SleepSummary } from './db/types';
import { SpeechFeatures } from './speech/types';
import { evaluateRisk } from './engine/riskEngine';
import { RiskResult } from './engine/types';
import { Header } from './components/Header';
import { DeleteDataModal } from './components/DeleteDataModal';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ConsentScreen } from './components/ConsentScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { M1CompleteScreen } from './components/M1CompleteScreen';
import { AD8QuestionnaireScreen } from './components/AD8QuestionnaireScreen';
import { ComplaintsScreen } from './components/ComplaintsScreen';
import { M2CompleteScreen } from './components/M2CompleteScreen';
import { RiskFactorsScreen } from './components/RiskFactorsScreen';
import { SleepScreen } from './components/SleepScreen';
import { SpeechTaskScreen } from './components/SpeechTaskScreen';
import { SpeechTestScreen } from './components/SpeechTestScreen';
import { ResultScreen } from './components/ResultScreen';
import { RulesTestScreen } from './components/RulesTestScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { DoctorSummaryScreen } from './components/DoctorSummaryScreen';
import { KaderDemoScreen } from './components/KaderDemoScreen';
import { MyDataScreen } from './components/MyDataScreen';
import { OfflineIndicator } from './components/OfflineIndicator';

type ScreenStep =
  | 'onboarding'
  | 'consent'
  | 'profile'
  | 'm1_complete'
  | 'ad8'
  | 'complaints'
  | 'm2_complete'
  | 'risk_factors'
  | 'sleep'
  | 'speech'
  | 'speech_test'
  | 'result'
  | 'rules_test'
  | 'history'
  | 'doctor_summary'
  | 'kader_demo'
  | 'data_saya';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenStep>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<UserConsent | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [allAssessments, setAllAssessments] = useState<AssessmentRecord[]>([]);
  const [tempVoiceConsented, setTempVoiceConsented] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletionSuccessMessage, setDeletionSuccessMessage] = useState<string | null>(null);

  // Periksa apakah URL browser adalah /data-saya, /uji-bicara, /uji-aturan, /riwayat, /ringkasan-dokter, atau /mode-kader
  useEffect(() => {
    if (window.location.pathname === '/data-saya') {
      setCurrentScreen('data_saya');
    } else if (window.location.pathname === '/uji-bicara') {
      setCurrentScreen('speech_test');
    } else if (window.location.pathname === '/uji-aturan') {
      setCurrentScreen('rules_test');
    } else if (window.location.pathname === '/riwayat') {
      setCurrentScreen('history');
    } else if (window.location.pathname === '/ringkasan-dokter') {
      setCurrentScreen('doctor_summary');
    } else if (window.location.pathname === '/mode-kader') {
      setCurrentScreen('kader_demo');
    }
  }, []);

  // Muat data dari IndexedDB saat pertama kali dibuka
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedProfiles = await db.profiles.toArray();
        const storedConsents = await db.consents.toArray();
        const storedAssessments = await db.assessments.toArray();

        setAllAssessments(storedAssessments);

        if (storedProfiles.length > 0) {
          const latestProfile = storedProfiles[storedProfiles.length - 1];
          setProfile(latestProfile);

          const matchingConsent = storedConsents.find(
            (c) => c.profileId === latestProfile.id
          );
          if (matchingConsent) {
            setConsent(matchingConsent);
            setTempVoiceConsented(matchingConsent.voiceConsented);
          }

          const userAssessments = storedAssessments.filter(
            (a) => a.profileId === latestProfile.id
          );

          if (userAssessments.length > 0) {
            const latestAssessment = userAssessments[userAssessments.length - 1];
            setAssessment(latestAssessment);

            // Jika rute browser bukan rute langsung khusus, tentukan posisi layar
            if (
              window.location.pathname !== '/data-saya' &&
              window.location.pathname !== '/uji-bicara' &&
              window.location.pathname !== '/uji-aturan' &&
              window.location.pathname !== '/riwayat' &&
              window.location.pathname !== '/ringkasan-dokter' &&
              window.location.pathname !== '/mode-kader'
            ) {
              if (latestAssessment.speechFeatures || latestAssessment.sleepSummary) {
                setCurrentScreen('result');
              } else if (latestAssessment.riskFactorStatuses) {
                setCurrentScreen('sleep');
              } else if (latestAssessment.complaintIds && latestAssessment.complaintIds.length > 0) {
                setCurrentScreen('m2_complete');
              } else if (Object.keys(latestAssessment.ad8Answers || {}).length > 0) {
                setCurrentScreen('ad8');
              } else {
                setCurrentScreen('m1_complete');
              }
            }
          } else if (
            window.location.pathname !== '/data-saya' &&
            window.location.pathname !== '/uji-bicara' &&
            window.location.pathname !== '/uji-aturan' &&
            window.location.pathname !== '/riwayat' &&
            window.location.pathname !== '/ringkasan-dokter' &&
            window.location.pathname !== '/mode-kader'
          ) {
            setCurrentScreen('m1_complete');
          }
        }
      } catch (err) {
        console.error('Gagal membaca data dari IndexedDB:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, []);

  // Handler Navigasi M1
  const handleStartOnboarding = () => {
    setDeletionSuccessMessage(null);
    setCurrentScreen('consent');
  };

  const handleConsentComplete = (basicConsented: boolean, voiceConsented: boolean) => {
    setTempVoiceConsented(voiceConsented);
    setCurrentScreen('profile');
  };

  const handleSaveProfile = async (
    profileData: Omit<UserProfile, 'id' | 'createdAt'>
  ) => {
    setIsSaving(true);
    try {
      const profileId = profile?.id || `profile_${Date.now()}`;
      const now = Date.now();

      const newProfile: UserProfile = {
        id: profileId,
        createdAt: profile?.createdAt || now,
        ...profileData,
      };

      const newConsent: UserConsent = {
        id: consent?.id || `consent_${Date.now()}`,
        profileId,
        basicDataConsented: true,
        basicDataAt: consent?.basicDataAt || now,
        voiceConsented: tempVoiceConsented,
        voiceAt: tempVoiceConsented ? (consent?.voiceAt || now) : null,
        revokedAt: null,
      };

      await db.profiles.put(newProfile);
      await db.consents.put(newConsent);

      setProfile(newProfile);
      setConsent(newConsent);
      setCurrentScreen('ad8');
    } catch (err) {
      console.error('Gagal menyimpan profil ke IndexedDB:', err);
      alert('Gagal menyimpan ke basis data lokal. Mohon coba kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler M2: AD8-INA
  const handleSaveAD8Answers = async (
    answers: Record<string, 'yes' | 'no' | 'unknown'>
  ) => {
    if (!profile) return;

    const yesCount = Object.values(answers).filter((v) => v === 'yes').length;
    const answeredCount = Object.values(answers).filter(
      (v) => v === 'yes' || v === 'no'
    ).length;

    const recordId = assessment?.id || `assessment_${Date.now()}`;
    const updatedRecord: AssessmentRecord = {
      id: recordId,
      profileId: profile.id,
      createdAt: assessment?.createdAt || Date.now(),
      isDemo: false,
      ad8Answers: answers,
      ad8Score: yesCount,
      ad8AnsweredCount: answeredCount,
      complaintIds: assessment?.complaintIds || [],
      complaintsCount: assessment?.complaintsCount || 0,
      riskFactorStatuses: assessment?.riskFactorStatuses,
      bodyMeasurements: assessment?.bodyMeasurements,
      sleepSummary: assessment?.sleepSummary,
      speechFeatures: assessment?.speechFeatures,
    };

    await db.assessments.put(updatedRecord);
    setAssessment(updatedRecord);
    const stored = await db.assessments.toArray();
    setAllAssessments(stored);
  };

  const handleCompleteAD8 = (answers: Record<string, 'yes' | 'no' | 'unknown'>) => {
    setCurrentScreen('complaints');
  };

  // Handler M2: Keluhan Subjektif
  const handleSaveComplaints = async (selectedIds: string[]) => {
    if (!profile || !assessment) return;

    const updatedRecord: AssessmentRecord = {
      ...assessment,
      complaintIds: selectedIds,
      complaintsCount: selectedIds.length,
    };

    await db.assessments.put(updatedRecord);
    setAssessment(updatedRecord);
    const stored = await db.assessments.toArray();
    setAllAssessments(stored);
  };

  const handleCompleteComplaints = (selectedIds: string[]) => {
    setCurrentScreen('m2_complete');
  };

  // Handler M3: Faktor Risiko
  const handleSaveRiskFactors = async (
    statuses: Record<string, 'present' | 'absent' | 'unknown'>,
    measurements?: BodyMeasurements
  ) => {
    if (!profile || !assessment) return;

    const updatedRecord: AssessmentRecord = {
      ...assessment,
      riskFactorStatuses: statuses,
      bodyMeasurements: measurements || assessment.bodyMeasurements,
    };

    await db.assessments.put(updatedRecord);
    setAssessment(updatedRecord);
    const stored = await db.assessments.toArray();
    setAllAssessments(stored);
  };

  const handleCompleteRiskFactors = (
    statuses: Record<string, 'present' | 'absent' | 'unknown'>,
    measurements?: BodyMeasurements
  ) => {
    setCurrentScreen('sleep');
  };

  // Handler M3: Pola Tidur
  const handleSaveSleep = async (summary: SleepSummary) => {
    if (!profile || !assessment) return;

    const updatedRecord: AssessmentRecord = {
      ...assessment,
      sleepSummary: summary,
    };

    await db.assessments.put(updatedRecord);
    setAssessment(updatedRecord);
    const stored = await db.assessments.toArray();
    setAllAssessments(stored);
  };

  const handleCompleteSleep = (summary: SleepSummary) => {
    setCurrentScreen('speech');
  };

  // Handler M4: Tugas Bicara
  const handleSaveSpeechFeatures = async (features: SpeechFeatures) => {
    if (!profile || !assessment) return;

    const updatedRecord: AssessmentRecord = {
      ...assessment,
      speechFeatures: features,
    };

    await db.assessments.put(updatedRecord);
    setAssessment(updatedRecord);
    const stored = await db.assessments.toArray();
    setAllAssessments(stored);
  };

  const handleCompleteSpeech = (features?: SpeechFeatures) => {
    setCurrentScreen('result');
  };

  // Handler F10: Tambah Catatan Penilaian Berkala Baru
  const handleAddPeriodicEvaluation = async () => {
    if (!profile) return;

    const now = Date.now();
    const simulatedPastTime = now - 90 * 24 * 60 * 60 * 1000;

    const periodicRecord: AssessmentRecord = {
      id: `assessment_${simulatedPastTime}`,
      profileId: profile.id,
      createdAt: simulatedPastTime,
      isDemo: true,
      ad8Answers: {
        item_1: 'yes',
        item_2: 'no',
        item_3: 'no',
        item_4: 'no',
        item_5: 'no',
        item_6: 'no',
        item_7: 'no',
        item_8: 'no',
      },
      ad8Score: 1,
      ad8AnsweredCount: 8,
      complaintIds: ['forget_recent'],
      complaintsCount: 1,
      riskFactorStatuses: {
        hypertension: 'present',
        physical_inactivity: 'absent',
      },
      sleepSummary: {
        avgHours: 7,
        insomniaFlag: false,
        nightWakingFlag: false,
        apneaScreenFlag: false,
        daytimeSleepinessFlag: false,
      },
    };

    await db.assessments.put(periodicRecord);
    const updated = await db.assessments.toArray();
    setAllAssessments(updated);
  };

  // Hitung Hasil Risiko Melalui Fungsi Murni Risk Engine v0
  const riskResult: RiskResult | null =
    assessment && profile
      ? evaluateRisk({
          ad8Score: assessment.ad8Score || 0,
          ad8AnsweredCount: assessment.ad8AnsweredCount || 0,
          hasInformant: profile.hasInformant,
          complaintsCount: assessment.complaintsCount || 0,
          profile,
          riskFactorStatuses: assessment.riskFactorStatuses,
          sleepSummary: assessment.sleepSummary,
          speechFeatures: assessment.speechFeatures,
        })
      : null;

  // Handlers Buka Halaman
  const handleOpenMyData = () => {
    setCurrentScreen('data_saya');
    window.history.pushState({}, '', '/data-saya');
  };

  const handleOpenHistory = () => {
    setCurrentScreen('history');
    window.history.pushState({}, '', '/riwayat');
  };

  const handleOpenDoctorSummary = () => {
    setCurrentScreen('doctor_summary');
    window.history.pushState({}, '', '/ringkasan-dokter');
  };

  const handleOpenKaderMode = () => {
    setCurrentScreen('kader_demo');
    window.history.pushState({}, '', '/mode-kader');
  };

  const handleOpenSpeechTest = () => {
    setCurrentScreen('speech_test');
    window.history.pushState({}, '', '/uji-bicara');
  };

  const handleOpenRulesTest = () => {
    setCurrentScreen('rules_test');
    window.history.pushState({}, '', '/uji-aturan');
  };

  // Handler Hapus Semua Data (PRD F12: Pembersihan Penuh Dexie, localStorage, sessionStorage)
  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      // 1. Bersihkan seluruh tabel IndexedDB via Dexie
      await db.clearAllData();

      // 2. Bersihkan localStorage dan sessionStorage browser
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }

      // 3. Reset seluruh state React
      setProfile(null);
      setConsent(null);
      setAssessment(null);
      setAllAssessments([]);
      setTempVoiceConsented(false);

      // 4. Kembali ke layar awal (Onboarding) dan perbarui URL
      setCurrentScreen('onboarding');
      setIsDeleteModalOpen(false);
      window.history.pushState({}, '', '/');

      // 5. Tampilkan pesan konfirmasi berhasil yang ramah
      setDeletionSuccessMessage(
        'Semua data berhasil dihapus secara permanen dari perangkat ini. Penyimpanan lokal kini telah kosong.'
      );
    } catch (err) {
      console.error('Gagal menghapus data dari basis data lokal:', err);
      alert('Terjadi kendala saat menghapus data. Mohon coba kembali.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-base font-semibold text-slate-700">Memuat CogniCare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      {/* Header Utama dengan Tombol Mode Kader, Riwayat, Data Saya & Hapus Data */}
      <Header
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
        onOpenMyData={handleOpenMyData}
        onOpenHistory={handleOpenHistory}
        onOpenKaderMode={handleOpenKaderMode}
        hasStoredData={profile !== null}
      />

      {/* Konten Utama Sesuai Langkah Saat Ini */}
      <main className="flex-1 flex flex-col justify-center">
        {/* Banner Pesan Konfirmasi Berhasil Dihapus */}
        {deletionSuccessMessage && (
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-start justify-between gap-3 text-emerald-950 shadow-xs animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 block">
                    Pemberitahuan Sistem
                  </span>
                  <p className="text-sm font-bold leading-snug">
                    {deletionSuccessMessage}
                  </p>
                  <p className="text-xs text-emerald-800/90 mt-0.5">
                    Tabel Dexie, localStorage, dan sessionStorage telah bersih tanpa ada data yang tersisa.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeletionSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-950 p-1 rounded-xl hover:bg-emerald-100 transition-colors"
                aria-label="Tutup pesan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen onStart={handleStartOnboarding} />
        )}

        {currentScreen === 'consent' && (
          <ConsentScreen
            initialBasicConsented={consent?.basicDataConsented ?? true}
            initialVoiceConsented={tempVoiceConsented}
            onBack={() => setCurrentScreen('onboarding')}
            onConsentComplete={handleConsentComplete}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            initialProfile={profile}
            onBack={() => setCurrentScreen('consent')}
            onSaveProfile={handleSaveProfile}
            isSaving={isSaving}
          />
        )}

        {currentScreen === 'm1_complete' && profile && consent && (
          <M1CompleteScreen
            profile={profile}
            consent={consent}
            onEditProfile={() => setCurrentScreen('profile')}
            onEditConsent={() => setCurrentScreen('consent')}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
            onProceedToM2={() => setCurrentScreen('ad8')}
          />
        )}

        {currentScreen === 'ad8' && profile && (
          <AD8QuestionnaireScreen
            hasInformant={profile.hasInformant}
            informantRelation={profile.informantRelation}
            initialAnswers={assessment?.ad8Answers || {}}
            onSaveAnswers={handleSaveAD8Answers}
            onComplete={handleCompleteAD8}
            onBackToProfile={() => setCurrentScreen('profile')}
          />
        )}

        {currentScreen === 'complaints' && (
          <ComplaintsScreen
            initialSelectedIds={assessment?.complaintIds || []}
            onBackToAD8={() => setCurrentScreen('ad8')}
            onSaveComplaints={handleSaveComplaints}
            onComplete={handleCompleteComplaints}
          />
        )}

        {currentScreen === 'm2_complete' && profile && assessment && (
          <M2CompleteScreen
            profile={profile}
            assessment={assessment}
            onEditAD8={() => setCurrentScreen('ad8')}
            onEditComplaints={() => setCurrentScreen('complaints')}
            onViewProfile={() => setCurrentScreen('profile')}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
            onProceedToM3={() => setCurrentScreen('risk_factors')}
          />
        )}

        {currentScreen === 'risk_factors' && profile && (
          <RiskFactorsScreen
            profile={profile}
            initialStatuses={assessment?.riskFactorStatuses}
            initialMeasurements={assessment?.bodyMeasurements}
            onBackToComplaints={() => setCurrentScreen('complaints')}
            onSaveRiskFactors={handleSaveRiskFactors}
            onComplete={handleCompleteRiskFactors}
          />
        )}

        {currentScreen === 'sleep' && (
          <SleepScreen
            initialSleepSummary={assessment?.sleepSummary}
            onBackToRiskFactors={() => setCurrentScreen('risk_factors')}
            onSaveSleep={handleSaveSleep}
            onComplete={handleCompleteSleep}
          />
        )}

        {currentScreen === 'speech' && (
          <SpeechTaskScreen
            voiceConsented={consent?.voiceConsented ?? false}
            initialSpeechFeatures={assessment?.speechFeatures}
            onBackToSleep={() => setCurrentScreen('sleep')}
            onSkipSpeechTask={() => handleCompleteSpeech(undefined)}
            onSaveSpeechFeatures={handleSaveSpeechFeatures}
            onComplete={handleCompleteSpeech}
            onOpenSpeechTest={handleOpenSpeechTest}
          />
        )}

        {currentScreen === 'speech_test' && (
          <SpeechTestScreen
            onBack={() => {
              setCurrentScreen('speech');
              window.history.pushState({}, '', '/');
            }}
          />
        )}

        {currentScreen === 'result' && riskResult && profile && assessment && (
          <ResultScreen
            riskResult={riskResult}
            profile={profile}
            assessment={assessment}
            onViewMyData={handleOpenMyData}
            onOpenRulesTest={handleOpenRulesTest}
            onOpenHistory={handleOpenHistory}
            onOpenDoctorSummary={handleOpenDoctorSummary}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
          />
        )}

        {currentScreen === 'doctor_summary' && profile && assessment && (
          <DoctorSummaryScreen
            profile={profile}
            consent={consent}
            assessment={assessment}
            onBack={() => {
              setCurrentScreen('result');
              window.history.pushState({}, '', '/');
            }}
          />
        )}

        {currentScreen === 'kader_demo' && (
          <KaderDemoScreen
            onBack={() => {
              if (riskResult) {
                setCurrentScreen('result');
              } else if (profile) {
                setCurrentScreen('data_saya');
              } else {
                setCurrentScreen('onboarding');
              }
              window.history.pushState({}, '', '/');
            }}
          />
        )}

        {currentScreen === 'rules_test' && (
          <RulesTestScreen
            onBack={() => {
              if (riskResult) {
                setCurrentScreen('result');
              } else {
                setCurrentScreen('data_saya');
              }
              window.history.pushState({}, '', '/');
            }}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            assessments={allAssessments}
            profile={profile}
            onBack={() => {
              if (riskResult) {
                setCurrentScreen('result');
              } else {
                setCurrentScreen('data_saya');
              }
              window.history.pushState({}, '', '/');
            }}
            onSelectAssessment={(rec) => {
              setAssessment(rec);
              setCurrentScreen('result');
            }}
            onAddPeriodicEvaluation={handleAddPeriodicEvaluation}
          />
        )}

        {currentScreen === 'data_saya' && (
          <MyDataScreen
            profile={profile}
            consent={consent}
            assessment={assessment}
            onBack={() => {
              if (riskResult) {
                setCurrentScreen('result');
              } else if (assessment?.speechFeatures) {
                setCurrentScreen('speech');
              } else if (assessment?.sleepSummary) {
                setCurrentScreen('sleep');
              } else if (assessment?.complaintIds) {
                setCurrentScreen('m2_complete');
              } else {
                setCurrentScreen('profile');
              }
              window.history.pushState({}, '', '/');
            }}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
            onNavigateToScreen={(target) => {
              setCurrentScreen(target);
              window.history.pushState({}, '', '/');
            }}
            onViewResults={
              riskResult
                ? () => {
                    setCurrentScreen('result');
                    window.history.pushState({}, '', '/');
                  }
                : undefined
            }
          />
        )}
      </main>

      {/* Indikator Offline PWA */}
      <OfflineIndicator />

      {/* Footer Wajib: Batasan Medis Skrining (Disembunyikan saat cetak) */}
      <footer className="no-print w-full max-w-xl mx-auto px-4 sm:px-6 py-4 border-t border-slate-200 text-center space-y-1">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Ini hasil skrining, bukan diagnosis. Prototipe, belum divalidasi. Seluruh data diproses dan disimpan secara lokal di perangkat Anda.
        </p>
      </footer>

      {/* Dialog Konfirmasi Hapus Data (Dua Langkah) */}
      <DeleteDataModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAllData}
        isDeleting={isDeleting}
      />
    </div>
  );
}
