import React, { useState, useEffect } from 'react';
import {
  Award,
  Download,
  Share2,
  Eye,
  Check,
  Search,
  Zap,
  ArrowRight
} from 'lucide-react';
import { CertificateData, Page } from '../types';
import { getStoredCertificates } from '../utils/storage';
import { CertificateModal } from '../components/CertificateModal';
import { downloadCertificatePNG, shareCertificate } from '../utils/certificate';
import { PopIn } from '../components/animations/PopIn';
import { StaggerItem } from '../components/animations/StaggerItem';

interface CertificatePageProps {
  initialCertificateId?: string | null;
  onNavigate: (page: Page) => void;
}

export const CertificatePage: React.FC<CertificatePageProps> = ({
  initialCertificateId,
  onNavigate,
}) => {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredCertificates();
    setCertificates(list);

    if (initialCertificateId) {
      const match = list.find((c) => c.id === initialCertificateId);
      if (match) {
        setSelectedCertificate(match);
        setIsModalOpen(true);
      }
    }
  }, [initialCertificateId]);

  const filtered = certificates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (cert: CertificateData) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  };

  const handleShare = async (cert: CertificateData, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await shareCertificate(cert);
    setToastMessage(res.method === 'share' ? 'Shared successfully!' : 'Certificate details copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Modal Dialog */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Award className="w-4 h-4 text-yellow-500" />
          <span>Official Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Typing Certificates Library
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Access, verify, download, and share your earned TypeFast Typing Achievement Certificates.
        </p>
      </PopIn>

      {/* Search Bar (PopIn 60ms) */}
      <PopIn delay={60} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by recipient name or certificate ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-400 shadow-sm"
          />
        </div>

        <button
          onClick={() => onNavigate('test')}
          className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Earn New Certificate</span>
        </button>
      </PopIn>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Certificates Gallery Grid with Stagger */}
      {filtered.length === 0 ? (
        <PopIn delay={100} className="p-12 rounded-3xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {searchQuery ? 'No matching certificates found' : 'No certificates earned yet'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? 'Try a different search query for recipient name or certificate ID.'
              : 'Complete any typing test and switch on "Generate Certificate" on the result screen to earn your verified credential!'}
          </p>
          <button
            onClick={() => onNavigate('test')}
            className="btn-interactive inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md"
          >
            <span>Take a Typing Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </PopIn>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert, idx) => (
            <StaggerItem
              key={cert.id}
              index={idx}
              baseDelay={45}
              className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-brand-500/50 transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between space-y-5 cursor-pointer"
            >
              <div onClick={() => handleOpenModal(cert)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold">
                    <Award className="w-3 h-3" />
                    <span>{cert.id}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {cert.date}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {cert.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-4 font-mono">
                  <div>
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                      {cert.wpm}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">WPM</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                      {cert.accuracy.toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-500 ml-1">Acc</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenModal(cert)}
                  className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadCertificatePNG(cert);
                    }}
                    className="btn-interactive p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    title="Download PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleShare(cert, e)}
                    className="btn-interactive p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    title="Share Certificate"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      )}
    </div>
  );
};
