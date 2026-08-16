import React from 'react';
import { Timer as TimerIcon, Zap, Target, AlertCircle } from 'lucide-react';

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
  const statItems = [
    {
      label: 'TIME',
      value: `${timeLeft}s`,
      numericValue: timeLeft,
      icon: <TimerIcon className="w-4 h-4 text-brand-500" />,
      colorClass: timeLeft <= 5 && isTestRunning ? 'text-rose-500 animate-pulse font-black' : 'text-brand-600 dark:text-brand-400',
    },
    {
      label: 'WPM',
      value: wpm,
      numericValue: wpm,
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      colorClass: 'text-amber-500 dark:text-amber-400',
    },
    {
      label: 'ACCURACY',
      value: `${accuracy.toFixed(1)}%`,
      numericValue: accuracy,
      icon: <Target className="w-4 h-4 text-cyan-500" />,
      colorClass: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      label: 'ERRORS',
      value: errors,
      numericValue: errors,
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      colorClass: errors > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mx-auto">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-1.5 mb-1">
            {item.icon}
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {item.label}
            </span>
          </div>
          <span className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-mono ${item.colorClass} transition-colors`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
