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
import { PopIn } from './animations/PopIn';
import { StaggerItem } from './animations/StaggerItem';

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
    const existing = getCertificateByTestId(result.id);
    if (existing) {
      setCertificate(existing);
      setGenerateCertEnabled(true);
      setRecipientName(existing.name);
    }
  }, [result.id]);

  useEffect(() => {
    if (result.isNewBest || result.accuracy === 100 || result.wpm >= 80) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FFFFFF', '#A7A6A6', '#FAFAFA', '#666666']
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

    let cert = getCertificateByTestId(result.id);
    if (!cert) {
      cert = createCertificate(result, sanitized);
      saveCertificate(cert);
    }

    setCertificate(cert);
  };

  const handleCopyLink = async () => {
    if (!certificate) return;
    const ok = await shareCertificate(certificate);
    if (ok) {
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#0c0c0c]/95 border border-[#1f1f1f] shadow-elevated-dark backdrop-blur-xl space-y-8 animate-fade-in text-left">
      {/* Header Feedback */}
      <div className="text-center space-y-3 pt-2">
        <div className="flex items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Test Completed (+{xpAwarded} XP)</span>
          </div>

          {result.isNewBest && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Best</span>
            </div>
          )}
        </div>

        <PopIn delay={80}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight">
            {feedback.tier}
          </h2>
          <p className="text-sm sm:text-base text-[#A7A6A6] max-w-md mx-auto mt-1">
            {feedback.message}
          </p>
        </PopIn>

        {/* Level XP Progress */}
        <PopIn delay={120}>
          <div className="pt-2 max-w-xs mx-auto">
            <div className="flex justify-between items-center text-[10px] font-semibold text-[#888888] mb-1">
              <span>Level {levelInfo.level} • {levelInfo.title}</span>
              <span>{levelInfo.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </PopIn>
      </div>

      {/* 4 Core Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Net WPM */}
        <StaggerItem index={0} className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#A7A6A6] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Speed</span>
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-[#FAFAFA] mt-1">
            {result.wpm}
          </div>
          <div className="text-[10px] text-[#666666] font-medium mt-0.5">
            WPM (Net)
          </div>
        </StaggerItem>

        {/* Accuracy */}
        <StaggerItem index={1} className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#A7A6A6] uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-white" />
            <span>Accuracy</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#FAFAFA] mt-1">
            {result.accuracy.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#666666] font-medium mt-0.5">
            Precision
          </div>
        </StaggerItem>

        {/* Errors */}
        <StaggerItem index={2} className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#A7A6A6] uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Errors</span>
          </div>
          <div className={`text-3xl sm:text-4xl font-mono font-bold mt-1 ${result.errors > 0 ? 'text-rose-400' : 'text-[#FAFAFA]'}`}>
            {result.errors}
          </div>
          <div className="text-[10px] text-[#666666] font-medium mt-0.5">
            Uncorrected
          </div>
        </StaggerItem>

        {/* Duration */}
        <StaggerItem index={3} className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#A7A6A6] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>Mode</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#FAFAFA] mt-1">
            {result.duration}s
          </div>
          <div className="text-[10px] text-[#666666] font-medium capitalize mt-0.5">
            {result.difficulty}
          </div>
        </StaggerItem>
      </div>

      {/* AI Coach Quick Diagnostic Card */}
      <PopIn delay={200} className="p-5 sm:p-6 rounded-2xl bg-[#121212] border border-[#222222] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FAFAFA]">
            <Sparkles className="w-4 h-4 text-white" />
            <span>AI Diagnostic Analysis</span>
          </div>
          {analysis.weakKeys.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[#A7A6A6]">
              <span>Hesitation keys:</span>
              {analysis.weakKeys.map(k => (
                <span key={k} className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-[11px]">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#A7A6A6] leading-relaxed">
          {analysis.recommendation}
        </p>

        {onNavigate && (
          <div className="flex items-center justify-between pt-2 border-t border-[#1c1c1c] text-xs">
            <span className="text-[#666666]">Recommended drill: <strong className="capitalize text-[#FAFAFA]">{analysis.recommendedMode}</strong></span>
            <button
              onClick={() => onNavigate('practice')}
              className="text-xs font-semibold text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Practice Targeted Drills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </PopIn>

      {/* Certificate Generation Toggle Section */}
      <PopIn delay={250} className="p-5 sm:p-6 rounded-2xl bg-[#121212] border border-[#222222] space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-[#FAFAFA]">
                Verified Typing Certificate
              </h4>
              <p className="text-xs text-[#A7A6A6]">
                Generate an official verifiable A4 achievement credential with your score.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={generateCertEnabled}
            onClick={() => setGenerateCertEnabled(!generateCertEnabled)}
            className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              generateCertEnabled ? 'bg-white' : 'bg-[#222222]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#050505] shadow transition duration-200 ${
                generateCertEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {generateCertEnabled && (
          <div className="pt-4 border-t border-[#1c1c1c] animate-fade-in">
            {!certificate ? (
              <form onSubmit={handleGenerateCertificate} className="space-y-3">
                <label className="block text-xs font-semibold text-[#A7A6A6]">
                  Recipient Name on Certificate
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter your full name"
                    maxLength={50}
                    className="flex-grow px-4 py-2 rounded-xl bg-[#181818] border border-[#2e2e2e] text-white text-sm font-medium focus:outline-none focus:border-white placeholder-[#666666]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-[#E5E5E5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>Create Certificate</span>
                  </button>
                </div>
                {nameError && (
                  <p className="text-xs text-rose-400">{nameError}</p>
                )}
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#181818] border border-[#2a2a2a]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-[#FAFAFA]">
                      Certificate Issued: <span className="text-white font-bold">{certificate.name}</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#888888]">
                      ID: {certificate.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-[#E5E5E5] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => downloadCertificatePNG(certificate)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#222222] text-[#FAFAFA] hover:bg-[#2c2c2c] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => printCertificate()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#222222] text-[#FAFAFA] hover:bg-[#2c2c2c] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#222222] text-[#FAFAFA] hover:bg-[#2c2c2c] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </PopIn>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Restart Button */}
      <div className="flex items-center justify-center pt-2">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FAFAFA] hover:bg-white text-[#050505] font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-white-pill cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Test (Esc)</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && certificate && (
        <CertificateModal
          certificate={certificate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
