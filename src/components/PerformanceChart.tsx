import React, { useState, useMemo } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { getPerformancePoints } from '../services/testService';

interface PerformanceChartProps {
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ className = '' }) => {
  const [metric, setMetric] = useState<'wpm' | 'accuracy'>('wpm');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    wpm: number;
    accuracy: number;
    date: string;
  } | null>(null);

  const points = useMemo(() => {
    return getPerformancePoints(timeframe);
  }, [timeframe]);

  // Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const values = points.map(p => (metric === 'wpm' ? p.wpm : p.accuracy));
  const rawMin = Math.min(...values, metric === 'wpm' ? 30 : 85);
  const rawMax = Math.max(...values, metric === 'wpm' ? 90 : 100);

  const minVal = Math.floor(rawMin / (metric === 'wpm' ? 10 : 5)) * (metric === 'wpm' ? 10 : 5);
  const maxVal = Math.ceil(rawMax / (metric === 'wpm' ? 10 : 5)) * (metric === 'wpm' ? 10 : 5);
  const range = Math.max(1, maxVal - minVal);

  const coords = useMemo(() => {
    if (points.length === 0) return [];
    return points.map((p, idx) => {
      const val = metric === 'wpm' ? p.wpm : p.accuracy;
      const x = padLeft + (idx / Math.max(1, points.length - 1)) * chartWidth;
      const y = padTop + chartHeight - ((val - minVal) / range) * chartHeight;
      return { x, y, point: p };
    });
  }, [points, metric, minVal, range, chartWidth, chartHeight, padLeft, padTop]);

  // Generate SVG Bezier Path
  const { linePath, areaPath } = useMemo(() => {
    if (coords.length < 2) {
      const p = coords[0] || { x: padLeft, y: padTop + chartHeight / 2 };
      return {
        linePath: `M ${padLeft} ${p.y} L ${padLeft + chartWidth} ${p.y}`,
        areaPath: `M ${padLeft} ${p.y} L ${padLeft + chartWidth} ${p.y} L ${padLeft + chartWidth} ${padTop + chartHeight} L ${padLeft} ${padTop + chartHeight} Z`
      };
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const current = coords[i];
      const next = coords[i + 1];
      const controlX = (current.x + next.x) / 2;
      d += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const area = `${d} L ${coords[coords.length - 1].x} ${padTop + chartHeight} L ${coords[0].x} ${padTop + chartHeight} Z`;
    return { linePath: d, areaPath: area };
  }, [coords, chartWidth, chartHeight, padLeft, padTop]);

  const colorPrimary = metric === 'wpm' ? '#10b981' : '#06b6d4';

  return (
    <div className={`w-full p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md ${className}`}>
      {/* Header with Metric & Timeframe Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            {metric === 'wpm' ? (
              <TrendingUp className="w-5 h-5 text-brand-500" />
            ) : (
              <Target className="w-5 h-5 text-cyan-500" />
            )}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Performance Over Time
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track your typing speed velocity and accuracy consistency
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
            <button
              onClick={() => setMetric('wpm')}
              className={`btn-interactive px-3 py-1 rounded-lg transition-all ${
                metric === 'wpm'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              WPM
            </button>
            <button
              onClick={() => setMetric('accuracy')}
              className={`btn-interactive px-3 py-1 rounded-lg transition-all ${
                metric === 'accuracy'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Accuracy
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
            {(['7d', '30d', '3m', 'all'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`btn-interactive px-2.5 py-1 rounded-lg uppercase transition-all ${
                  timeframe === tf
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden" onMouseLeave={() => setHoveredPoint(null)}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-64 overflow-visible"
        >
          <defs>
            {/* Area Gradient */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorPrimary} stopOpacity="0.35" />
              <stop offset="100%" stopColor={colorPrimary} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padTop + chartHeight * (1 - ratio);
            const val = Math.round(minVal + range * ratio);
            return (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + chartWidth}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800/80"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  {val}
                  {metric === 'accuracy' ? '%' : ''}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={colorPrimary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points & Hover Triggers */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r="4.5"
                fill="#ffffff"
                stroke={colorPrimary}
                strokeWidth="2.5"
                className="transition-transform duration-150 hover:scale-150 cursor-pointer"
              />
              <circle
                cx={c.x}
                cy={c.y}
                r="18"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() =>
                  setHoveredPoint({
                    x: c.x,
                    y: c.y,
                    wpm: c.point.wpm,
                    accuracy: c.point.accuracy,
                    date: c.point.dateStr
                  })
                }
              />
            </g>
          ))}

          {/* X-Axis Date Labels (First, Middle, Last) */}
          {coords.length > 0 && (
            <>
              <text
                x={coords[0].x}
                y={svgHeight - 10}
                textAnchor="start"
                className="text-[11px] font-medium fill-slate-400 dark:fill-slate-500"
              >
                {coords[0].point.dateStr}
              </text>
              {coords.length > 2 && (
                <text
                  x={coords[Math.floor(coords.length / 2)].x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  className="text-[11px] font-medium fill-slate-400 dark:fill-slate-500"
                >
                  {coords[Math.floor(coords.length / 2)].point.dateStr}
                </text>
              )}
              <text
                x={coords[coords.length - 1].x}
                y={svgHeight - 10}
                textAnchor="end"
                className="text-[11px] font-medium fill-slate-400 dark:fill-slate-500"
              >
                {coords[coords.length - 1].point.dateStr}
              </text>
            </>
          )}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-2xl border border-slate-700 animate-scale-in"
            style={{
              left: `${Math.min(85, Math.max(10, (hoveredPoint.x / svgWidth) * 100))}%`,
              top: `${Math.max(5, (hoveredPoint.y / svgHeight) * 100 - 30)}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="font-bold text-slate-300 text-[10px] mb-1">
              {hoveredPoint.date}
            </div>
            <div className="flex items-center gap-2 font-mono font-extrabold text-sm">
              <span className="text-emerald-400">{hoveredPoint.wpm} WPM</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400">{hoveredPoint.accuracy.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
