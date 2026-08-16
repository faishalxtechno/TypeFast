import React, { useState } from 'react';
import { Download, Printer, Share2, Check } from 'lucide-react';
import { CertificateData } from '../types';
import { CertificateView } from './CertificateView';
import { downloadCertificatePNG, printCertificate, shareCertificate } from '../utils/certificate';
import { Modal } from './Modal';

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

  if (!certificate) return null;

  const handleDownloadPNG = () => {
    downloadCertificatePNG(certificate);
    setToastMessage('Downloading high-resolution certificate PNG...');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    printCertificate();
  };

  const handleShare = async () => {
    const res = await shareCertificate(certificate);
    setToastMessage(res.method === 'share' ? 'Shared successfully!' : 'Certificate details copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Typing Achievement Certificate"
      maxWidth="max-w-5xl"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Certificate Display Canvas View */}
        <div className="overflow-x-auto p-1 sm:p-2 bg-slate-100/60 dark:bg-slate-950/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex justify-center">
          <div className="w-full max-w-4xl transform scale-[0.98] sm:scale-100 origin-top">
            <CertificateView certificate={certificate} />
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Certificate ID: <strong className="font-mono text-slate-900 dark:text-white">{certificate.id}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download PNG */}
            <button
              onClick={handleDownloadPNG}
              className="btn-interactive flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG (300 DPI)</span>
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={handlePrint}
              className="btn-interactive flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            {/* Share Certificate */}
            <button
              onClick={handleShare}
              className="btn-interactive flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
