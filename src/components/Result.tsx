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
  BarChart2,
  Sparkles,
  Download,
  Printer,
  Share2,
  Eye,
  Check,
  ArrowRight
} from 'lucide-react';
import { TestResult, UserStats, CertificateData, Page } from '../types';
import { getSpeedFeedback } from '../utils/typingCalculations';
import { createCertificate, sanitizeName, downloadCertificatePNG, printCertificate, shareCertificate } from '../utils/certificate';
import { getCertificateByTestId, saveCertificate } from '../utils/storage';
import { CertificateModal } from './CertificateModal';
import { generateAICoachAnalysis } from '../services/aiCoachService';
import { awardXp, getLevelInfo } from '../services/xpService';

interface ResultProps {
  result: TestResult;
  userStats?: UserStats;
  onRestart: () => void;
  onNavigate?: (page: Page) => void;
}

export const Result: React.FC<ResultProps> = ({ result, onRestart, onNavigate }) => {
  const feedback = getSpeedFeedback(result.wpm, result.accuracy);
  const analysis = generateAICoachAnalysis(result);

  // Award XP on test completion
  const [xpAwarded] = useState<number>(() => {
    const base = Math.min(100, Math.max(40, Math.round(result.wpm * 0.7 + (result.accuracy / 100) * 30)));
    awardXp(base);
    return base;
  });

  const levelInfo = getLevelInfo();

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
      setGenerateCertEnabled(true);
      setRecipientName(existing.name);
    }
  }, [result.id]);

  useEffect(() => {
    // Confetti celebration if user set new record
    if (result.isNewBest || result.accuracy === 100 || result.wpm >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6']
        });
      } catch {
        // Safe fallback
      }
    }
  }, [result.isNewBest, result.accuracy, result.wpm]);

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeName(recipientName);

    if (!sanitized || sanitized.length < 2) {
      setNameError('Please enter a valid recipient name (minimum 2 characters).');
      return;
    }

    setNameError(null);

    // Reuse existing certificate or create new
    let cert = getCertificateByTestId(result.id);
    if (!cert) {
      cert = createCertificate(result, sanitized);
      saveCertificate(cert);
    }

    setCertificate(cert);
    setIsModalOpen(true);
  };

  const handleCopyLink = async () => {
    if (!certificate) return;
    const res = await shareCertificate(certificate);
    setToastMessage(res.method === 'share' ? 'Shared successfully!' : 'Certificate details copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-white/90 dark:bg-[#0c1220]/90 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl backdrop-blur-xl p-6 sm:p-10 space-y-8 animate-scale-in">
      {/* Certificate Modal Dialog */}
      <CertificateModal
        certificate={certificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Test Completed</span>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span>+{xpAwarded} XP Earned</span>
          </div>

          {result.isNewBest && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider animate-bounce">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Personal Best!</span>
            </div>
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {feedback.tier}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {feedback.message}
        </p>

        {/* Level XP Progress Mini Bar */}
        <div className="pt-2 max-w-xs mx-auto">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-1">
            <span>Level {levelInfo.level} • {levelInfo.title}</span>
            <span>{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Core Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Net WPM */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            <span>Net Speed</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-brand-600 dark:text-brand-400 mt-1">
            {result.wpm}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Words Per Minute
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-cyan-500" />
            <span>Accuracy</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">
            {result.accuracy.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Precision Rate
          </div>
        </div>

        {/* Errors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Errors</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
            {result.errors}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Uncorrected
          </div>
        </div>

        {/* Duration */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Duration</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-slate-800 dark:text-slate-200 mt-1">
            {result.duration}s
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium capitalize">
            {result.difficulty} Tier
          </div>
        </div>
      </div>

      {/* AI Coach Quick Diagnostic Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-brand-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>AI Coach Diagnostics</span>
          </div>
          {analysis.weakKeys.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Weak keys:</span>
              {analysis.weakKeys.map(k => (
                <span key={k} className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-mono font-bold text-[11px]">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          💡 <strong>Coach Advice:</strong> {analysis.recommendation}
        </p>

        {onNavigate && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Recommended mode: <strong className="capitalize text-slate-800 dark:text-slate-200">{analysis.recommendedMode}</strong></span>
            <button
              onClick={() => onNavigate('practice')}
              className="btn-interactive text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Practice My Weak Keys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Certificate Generation Toggle Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Generate Official Typing Certificate
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Claim a verified landscape A4 achievement credential with your name and speed score.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={generateCertEnabled}
            onClick={() => setGenerateCertEnabled(!generateCertEnabled)}
            className={`btn-interactive relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              generateCertEnabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                generateCertEnabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Revealed Name Input Form when Toggle is ON */}
        {generateCertEnabled && (
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 animate-fade-in">
            {!certificate ? (
              <form onSubmit={handleGenerateCertificate} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Name on Certificate
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter your full name (e.g. Faishal Naushad)"
                    maxLength={50}
                    className="flex-grow px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="btn-interactive px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>Get Your Certificate</span>
                  </button>
                </div>
                {nameError && (
                  <p className="text-xs text-rose-500 font-semibold">{nameError}</p>
                )}
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Certificate Generated for <span className="text-brand-600 dark:text-brand-400">{certificate.name}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-500">
                      Credential ID: {certificate.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => downloadCertificatePNG(certificate)}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => printCertificate()}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Restart Test Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRestart}
          className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/25 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Restart Test (Tab + Enter)</span>
        </button>
      </div>
    </div>
  );
};
