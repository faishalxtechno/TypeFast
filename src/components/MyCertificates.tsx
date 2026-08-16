import React, { useState } from 'react';
import { Award, Download, Eye, Trash2 } from 'lucide-react';
import { CertificateData } from '../types';
import { downloadCertificatePNG } from '../utils/certificate';

interface MyCertificatesProps {
  certificates: CertificateData[];
  onViewCertificate: (cert: CertificateData) => void;
  onDeleteCertificate?: (id: string) => void;
}

export const MyCertificates: React.FC<MyCertificatesProps> = ({
  certificates,
  onViewCertificate,
  onDeleteCertificate,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (certificates.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-3xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
          <Award className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          No Certificates Generated Yet
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Complete any typing test and toggle "Generate Certificate" on the results screen to earn and collect your official certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-4 px-4 sm:px-6">Certificate ID</th>
              <th className="py-4 px-4 sm:px-6">Recipient Name</th>
              <th className="py-4 px-4 sm:px-6 text-right">WPM</th>
              <th className="py-4 px-4 sm:px-6 text-right">Accuracy</th>
              <th className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">Mode</th>
              <th className="py-4 px-4 sm:px-6 hidden md:table-cell text-right">Issue Date</th>
              <th className="py-4 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {certificates.map((cert) => (
              <tr
                key={cert.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Certificate ID */}
                <td className="py-4 px-4 sm:px-6">
                  <span className="font-mono font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-1 rounded-md text-xs border border-brand-200/60 dark:border-brand-800/60">
                    {cert.id}
                  </span>
                </td>

                {/* Recipient Name */}
                <td className="py-4 px-4 sm:px-6">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {cert.name}
                  </span>
                </td>

                {/* WPM */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <span className="font-mono font-extrabold text-base text-brand-600 dark:text-brand-400">
                    {cert.wpm}
                  </span>
                </td>

                {/* Accuracy */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                    {cert.accuracy.toFixed(1)}%
                  </span>
                </td>

                {/* Mode */}
                <td className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {cert.duration}s • {cert.difficulty}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-right text-xs text-slate-500 dark:text-slate-400">
                  {cert.date}
                </td>

                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {confirmDeleteId === cert.id ? (
                      <div className="flex items-center gap-1 animate-fade-in">
                        <button
                          onClick={() => {
                            if (onDeleteCertificate) {
                              onDeleteCertificate(cert.id);
                            }
                            setConfirmDeleteId(null);
                          }}
                          className="btn-interactive px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs"
                          title="Confirm Delete"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="btn-interactive px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* View Button */}
                        <button
                          onClick={() => onViewCertificate(cert)}
                          className="btn-interactive p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="View Certificate"
                          aria-label={`View certificate ${cert.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download PNG Button */}
                        <button
                          onClick={() => downloadCertificatePNG(cert)}
                          className="btn-interactive p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Download PNG"
                          aria-label={`Download certificate ${cert.id} as PNG`}
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        {onDeleteCertificate && (
                          <button
                            onClick={() => setConfirmDeleteId(cert.id)}
                            className="btn-interactive p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Certificate"
                            aria-label={`Delete certificate ${cert.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
