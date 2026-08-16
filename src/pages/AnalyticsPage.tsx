import {
  BarChart3,
  Target,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { PerformanceChart } from '../components/PerformanceChart';
import { getAnalyticsSummary } from '../services/testService';
import { PopIn } from '../components/animations/PopIn';
import { StaggerItem } from '../components/animations/StaggerItem';

export const AnalyticsPage: React.FC = () => {
  const analytics = getAnalyticsSummary();

  const metrics = [
    {
      title: 'Typing Velocity (WPM)',
      current: `${analytics.currentWpm}`,
      average: `${analytics.averageWpm}`,
      peak: `${analytics.bestWpm}`,
      trend: `+${analytics.monthlyImprovementPercent.toFixed(1)}% / mo`,
      trendPositive: analytics.monthlyImprovementPercent >= 0,
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: 'from-amber-500/15 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30'
    },
    {
      title: 'Precision Accuracy',
      current: `${analytics.currentAccuracy.toFixed(1)}%`,
      average: `${analytics.averageAccuracy.toFixed(1)}%`,
      peak: `${analytics.bestAccuracy.toFixed(1)}%`,
      trend: 'Low Variance',
      trendPositive: true,
      icon: <Target className="w-5 h-5 text-cyan-500" />,
      color: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30'
    },
    {
      title: 'Consistency Index',
      current: `${analytics.consistencyScore.toFixed(0)}%`,
      average: 'Steady',
      peak: '98%',
      trend: 'Low Fluctuations',
      trendPositive: true,
      icon: <Activity className="w-5 h-5 text-purple-500" />,
      color: 'from-purple-500/15 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          <span>Biomechanical Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Performance Analytics
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Deep diagnostic metrics analyzing your speed growth curves, accuracy stability, and long-term consistency trends.
        </p>
      </PopIn>

      {/* 3 Core Metric Deep-Dive Cards with Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <StaggerItem
            key={idx}
            index={idx}
            baseDelay={60}
            className={`p-6 rounded-3xl bg-gradient-to-b ${m.color} bg-white/90 dark:bg-slate-900/80 border ${m.borderColor} shadow-xl backdrop-blur-md space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {m.icon}
                <span>{m.title}</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${m.trendPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{m.trend}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 font-mono">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {m.current}
                </div>
                <div className="text-[11px] font-sans text-slate-500">Current Test</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {m.average}
                </div>
                <div className="text-[10px] font-sans text-slate-400">Rolling Average</div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </div>

      {/* Interactive Performance Graph (PopIn 140ms) */}
      <PopIn delay={140}>
        <PerformanceChart />
      </PopIn>
    </div>
  );
};
