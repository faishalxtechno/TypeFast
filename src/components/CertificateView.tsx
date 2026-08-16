import React from 'react';
import { Zap, Award } from 'lucide-react';
import { CertificateData } from '../types';

interface CertificateViewProps {
  certificate: CertificateData;
  className?: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto p-2 sm:p-4 flex justify-center ${className}`}>
      {/* A4 Landscape Ratio Container (1.414 : 1) */}
      <div
        id="certificate-element"
        className="certificate-printable relative w-[850px] min-w-[700px] sm:min-w-[800px] h-[600px] bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 border-[12px] border-emerald-600 shadow-2xl rounded-2xl p-8 sm:p-10 flex flex-col justify-between select-none overflow-hidden"
      >
        {/* Inner Gold Border */}
        <div className="absolute inset-2.5 border-2 border-amber-500/80 pointer-events-none rounded-lg" />

        {/* Decorative Corner Flairs */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-700 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-700 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-700 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-700 pointer-events-none" />

        {/* Watermark Diagonal Subtle Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-[0.07] pointer-events-none" />

        {/* Header Section: Logo & Titles */}
        <div className="text-center relative z-10 pt-1">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Zap className="w-5 h-5 fill-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              TYPE<span className="text-brand-600">FAST</span>
            </span>
          </div>

          <h1 className="text-sm sm:text-base font-bold tracking-widest text-emerald-700 uppercase">
            Typing Speed Achievement Certificate
          </h1>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-2" />
        </div>

        {/* Recipient Statement Section */}
        <div className="text-center relative z-10 my-auto py-2">
          <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide">
            This certificate is proudly awarded to
          </p>

          <div className="my-2.5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif uppercase px-4 inline-block border-b-2 border-brand-500/60 pb-1">
              {certificate.name}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            For successfully completing a <span className="font-bold text-slate-900">TypeFast</span> typing test with demonstrated typing speed, accuracy, and keyboard mastery.
          </p>

          {/* Performance Badges Grid */}
          <div className="grid grid-cols-4 gap-2.5 max-w-2xl mx-auto mt-4">
            {/* WPM */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Speed
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 mt-0.5">
                {certificate.wpm} <span className="text-xs">WPM</span>
              </div>
              <div className="text-[9px] text-emerald-700/75">
                Raw: {certificate.rawWpm}
              </div>
            </div>

            {/* Accuracy */}
            <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200/80 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">
                Accuracy
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-600 mt-0.5">
                {certificate.accuracy.toFixed(1)}%
              </div>
              <div className="text-[9px] text-cyan-700/75">
                {certificate.errors} Errors
              </div>
            </div>

            {/* Duration */}
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200/80 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800">
                Duration
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-purple-600 mt-0.5">
                {certificate.duration}s
              </div>
              <div className="text-[9px] text-purple-700/75">
                Timed Session
              </div>
            </div>

            {/* Difficulty */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Mode
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-600 mt-0.5 capitalize">
                {certificate.difficulty}
              </div>
              <div className="text-[9px] text-amber-700/75">
                Vocabulary Tier
              </div>
            </div>
          </div>
        </div>

        {/* Footer Details: ID, Date, Seal Stamp, Founder Credit */}
        <div className="relative z-10 border-t border-slate-200 pt-3 flex items-end justify-between text-xs text-slate-600">
          {/* Left: Certificate ID & Date */}
          <div className="flex flex-col text-left space-y-1">
            <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-[11px]">
              <span>ID:</span>
              <span className="text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                {certificate.id}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Date: <span className="font-semibold text-slate-700">{certificate.date}</span>
            </div>
          </div>

          {/* Center: Gold Verification Seal */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-500 flex flex-col items-center justify-center text-center shadow-md p-1">
              <Award className="w-4 h-4 text-amber-600 mb-0.5" />
              <span className="text-[7px] font-extrabold uppercase text-amber-900 tracking-tighter leading-tight">
                Verified
              </span>
              <span className="text-[8px] font-bold font-mono text-amber-800">
                {certificate.wpm} WPM
              </span>
            </div>
          </div>

          {/* Right: Founder Signature Line */}
          <div className="flex flex-col text-right items-end">
            <div className="w-48 border-b border-slate-300 pb-1 mb-1 text-center font-serif italic text-slate-700 text-sm">
              Faishal Naushad
            </div>
            <div className="text-[11px] font-bold text-slate-800">
              Founded & Developed by Mr. Faishal Naushad
            </div>
            <div className="text-[9px] text-slate-500">
              Platform Architect & Creator, TypeFast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
