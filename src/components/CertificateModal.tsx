import React, { useState } from 'react';
import { X, Download, Printer, Share2, Check, Sparkles } from 'lucide-react';
import { CertificateData } from '../types';
import { CertificateView } from './CertificateView';
import { downloadCertificatePNG, printCertificate, shareCertificate } from '../utils/certificate';

interface CertificateModalProps {
  certificate: CertificateData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || !certificate) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDownloadPNG = () => {
    downloadCertificatePNG(certificate);
    showToast('Certificate PNG downloaded successfully!');
  };

  const handlePrint = () => {
    printCertificate();
  };

  const handleShare = async () => {
    const res = await shareCertificate(certificate);
    if (res.method === 'clipboard') {
      showToast('Certificate details copied to clipboard!');
    } else if (res.success) {
      showToast('Certificate shared!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Official Typing Certificate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Issued for {certificate.name} ({certificate.wpm} WPM)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-interactive p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close certificate preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Certificate Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow bg-slate-100/60 dark:bg-slate-950/80 flex items-center justify-center">
          <div className="w-full flex justify-center transform scale-90 sm:scale-100 origin-center transition-transform">
            <CertificateView certificate={certificate} />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          {/* Toast Notification */}
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 min-h-[20px]">
            {toastMessage && (
              <span className="animate-fade-in flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>{toastMessage}</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download PNG */}
            <button
              onClick={handleDownloadPNG}
              className="btn-interactive flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>

            {/* Download PDF / Print */}
            <button
              onClick={handlePrint}
              className="btn-interactive flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-purple-500" />
              <span>Print / Save PDF</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="btn-interactive flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-500" />
              <span>Share Certificate</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="btn-interactive px-4 py-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
