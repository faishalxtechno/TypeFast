import React from 'react';

interface StatsProps {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  errors: number;
  isTestRunning: boolean;
}

export const Stats: React.FC<StatsProps> = ({
  timeLeft,
  wpm,
  accuracy,
  errors,
  isTestRunning,
}) => {
  // Format time as MM:SS or SSs
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const statItems = [
    {
      label: 'WPM',
      value: wpm,
      color: 'text-[#FAFAFA]',
    },
    {
      label: 'ACCURACY',
      value: `${accuracy.toFixed(1)}%`,
      color: 'text-[#FAFAFA]',
    },
    {
      label: 'TIME',
      value: formattedTime,
      color: timeLeft <= 5 && isTestRunning ? 'text-rose-400 font-bold animate-pulse' : 'text-[#FAFAFA]',
    },
    {
      label: 'ERRORS',
      value: errors,
      color: errors > 0 ? 'text-rose-400' : 'text-[#666666]',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-3 px-6 rounded-2xl bg-[#0c0c0c]/80 border border-[#1c1c1c] backdrop-blur-md">
      <div className="grid grid-cols-4 divide-x divide-[#222222]">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center px-2 py-1 select-none"
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#A7A6A6] uppercase mb-0.5">
              {item.label}
            </span>
            <span className={`text-xl sm:text-2xl lg:text-3xl font-mono font-bold tracking-tight ${item.color} transition-colors`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
