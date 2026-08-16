import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Trophy,
  Zap,
  Target,
  AlertCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  BarChart2,
  Sparkles,
  Download,
  Printer,
  Share2,
  Eye,
  Check
} from 'lucide-react';
import { TestResult, UserStats, CertificateData } from '../types';
import { getSpeedFeedback } from '../utils/typingCalculations';
import { createCertificate, sanitizeName, downloadCertificatePNG, printCertificate, shareCertificate } from '../utils/certificate';
import { getCertificateByTestId, saveCertificate } from '../utils/storage';
import { CertificateModal } from './CertificateModal';

interface ResultProps {
  result: TestResult;
  userStats: UserStats;
  onRestart: () => void;
}

export const Result: React.FC<ResultProps> = ({ result, userStats, onRestart }) => {
  const feedback = getSpeedFeedback(result.wpm, result.accuracy);

  // Certificate state
  const [generateCertEnabled, setGenerateCertEnabled] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(() => getCertificateByTestId(result.id));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // If certificate was previously created for this test, automatically enable toggle
    const existing = getCertificateByTestId(result.id);
    if (existing) {
      setCertificate(existing);
      setRecipientName(existing.name);
      setGenerateCertEnabled(true);
    }
  }, [result.id]);

  useEffect(() => {
    // Fire festive celebratory confetti on achievements
    if (result.isNewBest || result.wpm >= 60) {
      try {
        confetti({
          particleCount: result.isNewBest ? 120 : 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#3b82f6']
        });
      } catch {
        // Safe fallback
      }
    }
  }, [result]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeName(recipientName);

    if (!clean || clean.length === 0) {
      setNameError('Please enter your name to generate your certificate.');
      return;
    }

    if (clean.length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }

    setNameError(null);

    // Reuse existing certificate if already generated for this test, or create new
    let certToUse = getCertificateByTestId(result.id);
    if (!certToUse || certToUse.name !== clean) {
      certToUse = createCertificate(result, clean);
      saveCertificate(certToUse);
    }

    setCertificate(certToUse);
    setIsModalOpen(true);
  };

  const handleDownloadPNG = () => {
    if (!certificate) return;
    downloadCertificatePNG(certificate);
    showToast('PNG Downloaded!');
  };

  const handlePrint = () => {
    printCertificate();
  };

  const handleShare = async () => {
    if (!certificate) return;
    const res = await shareCertificate(certificate);
    if (res.method === 'clipboard') {
      showToast('Certificate details copied to clipboard!');
    } else {
      showToast('Certificate shared!');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Certificate Modal Dialog */}
      <CertificateModal
        certificate={certificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800/90 shadow-2xl p-6 sm:p-10 overflow-hidden relative backdrop-blur-xl">
        {/* Background decorative ambient glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          {result.isNewBest && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-500 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 animate-pulse">
              <Trophy className="w-4 h-4" />
              <span>🎉 New Personal Best Record!</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Test Complete!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {feedback.message}
          </p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-bold border ${feedback.badgeColor}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{feedback.tier} ({feedback.percentile})</span>
            </span>
          </div>
        </div>

        {/* Primary Hero Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mb-8 relative z-10">
          {/* WPM */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-brand-500/15 to-transparent border border-brand-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <Zap className="w-4 h-4" />
              <span>WPM</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-brand-600 dark:text-brand-400">
              {result.wpm}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Raw: {result.rawWpm} WPM
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-cyan-500/15 to-transparent border border-cyan-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
              <Target className="w-4 h-4" />
              <span>Accuracy</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
              {result.accuracy.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Precision rate
            </span>
          </div>

          {/* Errors */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-rose-500/15 to-transparent border border-rose-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Errors</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              {result.errors}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Mistyped chars
            </span>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-purple-500/15 to-transparent border border-purple-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>Time</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
              {result.duration}s
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 capitalize">
              {result.difficulty} mode
            </span>
          </div>
        </div>

        {/* Detailed Breakdown & Personal Stats Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
          {/* Character Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              <BarChart2 className="w-4 h-4 text-brand-500" />
              <span>Character Breakdown</span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Correct Characters
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {result.correctChars}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Incorrect Characters
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {result.incorrectChars}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 dark:text-slate-400">Total Characters Typed</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {result.totalChars}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Record Comparison */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Personal Records</span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="text-slate-600 dark:text-slate-400">All-Time Best WPM</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {userStats.bestWpm} WPM
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="text-slate-600 dark:text-slate-400">Best Accuracy</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {userStats.bestAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 dark:text-slate-400">Total Tests Completed</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {userStats.testsCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Certificate Generation Section with Modern Toggle Switch */}
        {/* ------------------------------------------------------------- */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-brand-500/10 via-emerald-500/5 to-cyan-500/10 border-2 border-brand-500/30 relative z-10 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Generate Certificate</span>
                  {certificate && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                      Generated
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Claim an official verifiable achievement certificate for this typing session.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {generateCertEnabled ? 'ON' : 'OFF'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={generateCertEnabled}
                onClick={() => setGenerateCertEnabled(!generateCertEnabled)}
                className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  generateCertEnabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    generateCertEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Form & Actions revealed when Toggle is ON */}
          {generateCertEnabled && (
            <div className="mt-5 pt-5 border-t border-brand-500/20 animate-fade-in space-y-4">
              {!certificate ? (
                /* Name input form before certificate generation */
                <form onSubmit={handleGenerateCertificate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-grow">
                    <label htmlFor="recipient-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name on Certificate
                    </label>
                    <input
                      id="recipient-name"
                      type="text"
                      value={recipientName}
                      onChange={(e) => {
                        setRecipientName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      placeholder="e.g. Faishal Naushad"
                      maxLength={50}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                      required
                    />
                    {nameError && (
                      <p className="text-xs text-rose-500 font-semibold mt-1">
                        {nameError}
                      </p>
                    )}
                  </div>

                  <div className="sm:self-end">
                    <button
                      type="submit"
                      className="btn-interactive w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Get Your Certificate</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Certificate has been generated: reveal View / Download / Share buttons */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-brand-500/30">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <Award className="w-4 h-4 text-brand-500" />
                      <span>
                        Certificate Issued to <span className="font-bold text-brand-600 dark:text-brand-400">{certificate.name}</span>
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        ({certificate.id})
                      </span>
                    </div>

                    <button
                      onClick={() => setCertificate(null)}
                      className="text-xs text-slate-500 hover:text-brand-500 underline text-left sm:text-right"
                    >
                      Change Name
                    </button>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* View Certificate */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="btn-interactive flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Certificate</span>
                    </button>

                    {/* Download PNG */}
                    <button
                      onClick={handleDownloadPNG}
                      className="btn-interactive flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-brand-500" />
                      <span>Download PNG</span>
                    </button>

                    {/* Print / Save PDF */}
                    <button
                      onClick={handlePrint}
                      className="btn-interactive flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-purple-500" />
                      <span>Print / PDF</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={handleShare}
                      className="btn-interactive flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-cyan-500" />
                      <span>Share</span>
                    </button>
                  </div>

                  {toastMessage && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{toastMessage}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button: Restart Test */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button
            onClick={onRestart}
            autoFocus
            className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-500/40"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
