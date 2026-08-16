import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Download, Printer, Share2, ArrowLeft, Check, FileCheck2 } from 'lucide-react';
import { CertificateData, Page } from '../types';
import { getStoredCertificates, getCertificateById, deleteCertificate } from '../utils/storage';
import { CertificateView } from '../components/CertificateView';
import { MyCertificates } from '../components/MyCertificates';
import { CertificateModal } from '../components/CertificateModal';
import { downloadCertificatePNG, printCertificate, shareCertificate } from '../utils/certificate';

interface CertificatePageProps {
  initialCertificateId?: string | null;
  onNavigate: (page: Page) => void;
}

export const CertificatePage: React.FC<CertificatePageProps> = ({
  initialCertificateId,
  onNavigate,
}) => {
  const [certificates, setCertificates] = useState<CertificateData[]>(() => getStoredCertificates());
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCertificateId) {
      const found = getCertificateById(initialCertificateId);
      if (found) {
        setSelectedCertificate(found);
      }
    } else if (certificates.length > 0) {
      setSelectedCertificate(certificates[0]);
    }
  }, [initialCertificateId, certificates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDownloadPNG = (cert: CertificateData) => {
    downloadCertificatePNG(cert);
    showToast('Certificate PNG downloaded!');
  };

  const handlePrint = () => {
    printCertificate();
  };

  const handleShare = async (cert: CertificateData) => {
    const res = await shareCertificate(cert);
    if (res.method === 'clipboard') {
      showToast('Certificate details copied to clipboard!');
    } else {
      showToast('Certificate shared!');
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteCertificate(id);
    setCertificates(updated);
    if (selectedCertificate && selectedCertificate.id === id) {
      setSelectedCertificate(updated.length > 0 ? updated[0] : null);
    }
    showToast('Certificate removed from local storage.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-10">
      {/* Certificate Modal Dialog */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Award className="w-4 h-4" />
          <span>Official Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Typing Certificates
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          View, download, and share your earned typing speed and accuracy credentials.
        </p>

        {/* Verification Status Notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Client-side validated credential. Backend database verification schema prepared for V2 rollout.</span>
        </div>
      </div>

      {/* Primary Featured Certificate Display */}
      {selectedCertificate && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Certificate
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {selectedCertificate.name} • <span className="text-brand-500 font-mono">{selectedCertificate.wpm} WPM</span>
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleDownloadPNG(selectedCertificate)}
                className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-purple-500" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={() => handleShare(selectedCertificate)}
                className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-cyan-500" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Certificate View */}
          <div className="w-full flex justify-center py-2">
            <CertificateView certificate={selectedCertificate} />
          </div>

          {toastMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* My Certificates History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              My Stored Certificates ({certificates.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigate('test')}
            className="btn-interactive text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Take a Typing Test</span>
          </button>
        </div>

        <MyCertificates
          certificates={certificates}
          onViewCertificate={(cert) => {
            setSelectedCertificate(cert);
            setIsModalOpen(true);
          }}
          onDeleteCertificate={handleDelete}
        />
      </div>
    </div>
  );
};
