import React from 'react';

interface TypeFastLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const TypeFastLogo: React.FC<TypeFastLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimal Custom TypeFast Geometric Key/Speed Mark */}
      <div
        className={`relative ${iconDimensions} rounded-lg bg-gradient-to-b from-[#222222] to-[#0d0d0d] border border-[#333333] shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#555555] transition-colors duration-200`}
        aria-hidden="true"
      >
        {/* Subtle Top Keycap Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Minimal Precision Key / Speed Chevron / Cursor Vector */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-white"
        >
          {/* Keycap inner frame / speed prompt */}
          <path
            d="M5 8.5L12 4.5L19 8.5V15.5L12 19.5L5 15.5V8.5Z"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Lightning / Cursor fast path */}
          <path
            d="M13 7L8.5 13H13.5L11 17L16 11H11.5L13 7Z"
            fill="url(#typefast-logo-grad)"
            stroke="#FAFAFA"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="typefast-logo-grad" x1="8.5" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#B3B3B3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Geometric Wordmark */}
      {showWordmark && (
        <span
          className={`font-sans font-extrabold ${textSize} tracking-tight text-[#FAFAFA] flex items-center`}
        >
          TypeFast
        </span>
      )}
    </div>
  );
};
