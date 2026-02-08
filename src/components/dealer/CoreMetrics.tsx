'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// 时间范围类型
type TimeRange = 'current' | 'quarter' | 'year';

// 时间范围数据
const TIME_RANGE_DATA = {
  current: {
    target: 1200,
    completed: 960,
    forecast: 1050,
  },
  quarter: {
    target: 3600,
    completed: 2880,
    forecast: 3150,
  },
  year: {
    target: 14400,
    completed: 11520,
    forecast: 12600,
  },
};

// 主仪表盘组件
const MainGauge = ({
  actualValue,
  targetValue,
  label,
  unit = '万',
  size = 160
}: {
  actualValue: number;
  targetValue: number;
  label: string;
  unit?: string;
  size?: number;
}) => {
  const percentage = Math.min((actualValue / targetValue) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* 外圈发光效果 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: percentage >= 90 ? 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, transparent 70%)' :
                      percentage >= 70 ? 'radial-gradient(circle, rgba(250,204,21,0.2) 0%, transparent 70%)' :
                      'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)',
          }}
        />

        {/* 仪表盘SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 背景圆环 */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="12"
          />

          {/* 刻度线 */}
          {[...Array(11)].map((_, i) => {
            const angle = (i * 18 - 90) * (Math.PI / 180);
            const innerR = 65;
            const outerR = 75;
            const x1 = 100 + innerR * Math.cos(angle);
            const y1 = 100 + innerR * Math.sin(angle);
            const x2 = 100 + outerR * Math.cos(angle);
            const y2 = 100 + outerR * Math.sin(angle);

            const tickPercentage = (i / 10) * 100;
            const strokeColor = tickPercentage >= 90 ? '#22c55e' :
                               tickPercentage >= 70 ? '#eab308' :
                               '#ef4444';

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* 进度弧线 */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke={percentage >= 90 ? '#22c55e' :
                    percentage >= 70 ? '#eab308' :
                    '#ef4444'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 4.71} 471`}
            strokeDashoffset={0}
            transform="rotate(-90 100 100)"
            style={{
              filter: percentage >= 90 ? 'drop-shadow(0 0 15px rgba(74,222,128,1))' :
                     percentage >= 70 ? 'drop-shadow(0 0 15px rgba(250,204,21,1))' :
                     'drop-shadow(0 0 15px rgba(239,68,68,1))',
              transition: 'stroke-dasharray 0.1s ease-out',
            }}
          />

          {/* 指针 */}
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon
              points="-4,0 0,-60 4,0"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(34,211,238,1))',
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.9))',
              }}
            />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-cyan-50 mb-1"
               style={{
                 textShadow: '0 0 20px rgba(6,182,212,0.6)',
               }}
          >
            {Math.round(actualValue)}
          </div>
          <div className="text-xs font-semibold text-cyan-400/70">{unit}</div>
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold text-cyan-300/90">{label}</div>
    </div>
  );
};

export default function CoreMetrics({ timeRange = 'current' }: { timeRange?: TimeRange }) {
  const [mounted, setMounted] = useState(false);

  // 动画状态
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [animatedForecast, setAnimatedForecast] = useState(0);
  const [animatedGap, setAnimatedGap] = useState(0);

  useEffect(() => {
    setMounted(true);

    // 动画效果
    const data = TIME_RANGE_DATA[timeRange];
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedCompleted(data.completed * easeOut);
      setAnimatedForecast(data.forecast * easeOut);
      setAnimatedGap((data.target - data.forecast) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [timeRange]);

  const data = TIME_RANGE_DATA[timeRange];
  const gap = data.target - data.forecast;

  return (
    <div className="flex flex-col gap-6">
      {/* 实际达成 */}
      <div className="flex flex-col items-center">
        <MainGauge
          actualValue={data.completed}
          targetValue={data.target}
          label="实际达成"
          unit="万"
          size={140}
        />
      </div>

      {/* 预计达成 */}
      <div className="flex flex-col items-center">
        <MainGauge
          actualValue={data.forecast}
          targetValue={data.target}
          label="预计达成"
          unit="万"
          size={140}
        />
      </div>

      {/* 缺口 */}
      <div className="flex flex-col items-center">
        <MainGauge
          actualValue={Math.abs(gap)}
          targetValue={data.target}
          label={gap < 0 ? '超额' : '缺口'}
          unit="万"
          size={140}
        />
      </div>
    </div>
  );
}
