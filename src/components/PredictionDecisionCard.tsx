'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

// 主题类型
type Theme = 'dark' | 'dashboard';

// 月度数据接口
interface MonthlyData {
  month: string;
  target: number;
  forecast: number;
  completed: number;
}

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  warningNeon: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  successNeon: 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]',
  cardBg: 'bg-slate-900/80 backdrop-blur-sm',
  cardBorder: 'border-cyan-500/30',
};

// 组件属性
interface PredictionDecisionCardProps {
  theme?: Theme;
}

export default function PredictionDecisionCard({
  theme = 'dashboard',
}: PredictionDecisionCardProps) {
  // 核心数据
  const target = 1500;
  const forecast = 1140;
  const completed = 800;
  const achievementRate = 76;

  // 12个月趋势数据
  const monthlyData: MonthlyData[] = [
    { month: '1月', target: 1500, forecast: 1140, completed: 800 },
    { month: '2月', target: 1500, forecast: 1200, completed: 0 },
    { month: '3月', target: 1500, forecast: 1350, completed: 0 },
    { month: '4月', target: 1500, forecast: 1400, completed: 0 },
    { month: '5月', target: 1500, forecast: 1380, completed: 0 },
    { month: '6月', target: 1500, forecast: 1420, completed: 0 },
    { month: '7月', target: 1500, forecast: 1450, completed: 0 },
    { month: '8月', target: 1500, forecast: 1480, completed: 0 },
    { month: '9月', target: 1500, forecast: 1500, completed: 0 },
    { month: '10月', target: 1500, forecast: 1520, completed: 0 },
    { month: '11月', target: 1500, forecast: 1550, completed: 0 },
    { month: '12月', target: 1500, forecast: 1600, completed: 0 },
  ];

  // 动画状态
  const [animatedRate, setAnimatedRate] = useState(0);
  const [animatedForecast, setAnimatedForecast] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [radarProgress, setRadarProgress] = useState(0);
  const [barProgress, setBarProgress] = useState(0);

  // 启动动画
  useEffect(() => {
    setMounted(true);

    // 1. 达成率动画
    const rateDuration = 2000;
    const rateStartTime = Date.now();
    const animateRate = () => {
      const elapsed = Date.now() - rateStartTime;
      const progress = Math.min(elapsed / rateDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedRate(achievementRate * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateRate);
      }
    };

    // 2. 数字滚动动画
    const numberDuration = 1800;
    const numberStartTime = Date.now();
    const animateNumbers = () => {
      const elapsed = Date.now() - numberStartTime;
      const progress = Math.min(elapsed / numberDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedForecast(forecast * easeOut);
      setAnimatedCompleted(completed * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      }
    };

    // 3. 雷达图动画
    const radarDuration = 2200;
    const radarStartTime = Date.now();
    const animateRadar = () => {
      const elapsed = Date.now() - radarStartTime;
      const progress = Math.min(elapsed / radarDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setRadarProgress(easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateRadar);
      }
    };

    // 4. 柱状图动画
    const barDuration = 2000;
    const barStartTime = Date.now();
    const animateBar = () => {
      const elapsed = Date.now() - barStartTime;
      const progress = Math.min(elapsed / barDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setBarProgress(easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateBar);
      }
    };

    animateRate();
    animateNumbers();
    animateRadar();
    animateBar();
  }, []);

  // 主仪表盘组件
  const MainGauge = ({ value, maxValue, size = 200 }: { value: number; maxValue: number; size?: number }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const angle = (percentage / 100) * 180 - 90;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 背景圆环 */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="10" />

          {/* 刻度线 */}
          {[...Array(11)].map((_, i) => {
            const a = (i * 18 - 90) * (Math.PI / 180);
            const x1 = 100 + 75 * Math.cos(a);
            const y1 = 100 + 75 * Math.sin(a);
            const x2 = 100 + 85 * Math.cos(a);
            const y2 = 100 + 85 * Math.sin(a);
            const p = (i / 10) * 100;
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={p >= 90 ? '#22c55e' : p >= 70 ? '#eab308' : '#ef4444'}
                strokeWidth="2" strokeLinecap="round"
              />
            );
          })}

          {/* 进度弧线 */}
          <circle
            cx="100" cy="100" r="85" fill="none"
            stroke={percentage >= 90 ? '#22c55e' : percentage >= 70 ? '#eab308' : '#ef4444'}
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${percentage * 5.34} 534`} transform="rotate(-90 100 100)"
            style={{
              filter: percentage >= 90 ? 'drop-shadow(0 0 12px rgba(74,222,128,1))' :
                     percentage >= 70 ? 'drop-shadow(0 0 12px rgba(250,204,21,1))' :
                     'drop-shadow(0 0 12px rgba(239,68,68,1))',
              transition: 'stroke-dasharray 0.1s ease-out',
            }}
          />

          {/* 指针 */}
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon points="-4,0 0,-65 4,0" fill="#22d3ee"
              style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,1))' }}
            />
            <circle cx="0" cy="0" r="8" fill="#22d3ee"
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.9))' }}
            />
          </g>
        </svg>

        {/* 中心数值 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black mb-1"
            style={{
              color: percentage >= 90 ? '#22c55e' : percentage >= 70 ? '#eab308' : '#ef4444',
              textShadow: percentage >= 90 ? '0 0 20px rgba(74,222,128,1)' :
                         percentage >= 70 ? '0 0 20px rgba(250,204,21,1)' :
                         '0 0 20px rgba(239,68,68,1)',
            }}
          >
            {mounted ? Math.round(value) : 0}
          </div>
          <div className="text-sm font-semibold text-cyan-400/70">%</div>
          <div className="text-xs text-cyan-500/50 mt-1">达成率</div>
        </div>
      </div>
    );
  };

  // 雷达图组件
  const RadarChart = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const sides = 12;

    const getPoint = (index: number, value: number, max: number) => {
      const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
      const r = (value / max) * radius * radarProgress;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
      };
    };

    const maxForecast = Math.max(...monthlyData.map(d => d.forecast));
    const maxTarget = Math.max(...monthlyData.map(d => d.target));
    const maxCompleted = Math.max(...monthlyData.map(d => d.completed));
    const maxValue = Math.max(maxForecast, maxTarget, maxCompleted);

    // 生成多边形路径
    const forecastPath = monthlyData.map((d, i) => getPoint(i, d.forecast, maxValue));
    const targetPath = monthlyData.map((d, i) => getPoint(i, d.target, maxValue));
    const completedPath = monthlyData.map((d, i) => getPoint(i, d.completed, maxValue));

    const pathD = (points: any[]) =>
      points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

    return (
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 300 300" className="w-full h-full max-w-[280px]">
          {/* 背景网格 */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
            <polygon
              key={scale}
              points={Array.from({ length: sides }, (_, i) => {
                const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
                const x = centerX + radius * scale * Math.cos(angle);
                const y = centerY + radius * scale * Math.sin(angle);
                return `${x.toFixed(1)} ${y.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke="rgba(6,182,212,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* 轴线 */}
          {Array.from({ length: sides }, (_, i) => {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="rgba(6,182,212,0.15)" strokeWidth="1" />;
          })}

          {/* 目标区域 */}
          <polygon
            points={targetPath.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
            fill="rgba(59,130,246,0.15)"
            stroke="#3b82f6"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }}
          />

          {/* 预测区域 */}
          <polygon
            points={forecastPath.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
            fill="rgba(34,211,238,0.2)"
            stroke="#22d3ee"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.5))' }}
          />

          {/* 已完成区域 */}
          <polygon
            points={completedPath.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
            fill="rgba(34,197,94,0.2)"
            stroke="#22c55e"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))' }}
          />

          {/* 月份标签 */}
          {monthlyData.map((d, i) => {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = centerX + (radius + 20) * Math.cos(angle);
            const y = centerY + (radius + 20) * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-cyan-400/60"
              >
                {d.month}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // 霓虹柱状图组件
  const NeonBarChart = () => {
    const maxBarHeight = 120;
    const barWidth = 12;
    const gap = 8;

    return (
      <div className="flex items-end justify-center gap-1">
        {monthlyData.map((d, i) => {
          const maxHeight = Math.max(...monthlyData.map(m => Math.max(m.target, m.forecast, m.completed)));
          const targetHeight = (d.target / maxHeight) * maxBarHeight * barProgress;
          const forecastHeight = (d.forecast / maxHeight) * maxBarHeight * barProgress;
          const completedHeight = (d.completed / maxHeight) * maxBarHeight * barProgress;

          return (
            <div key={i} className="flex items-end gap-0.5" style={{ height: maxBarHeight }}>
              {/* 目标柱 */}
              <div
                className="relative rounded-t-sm"
                style={{
                  width: barWidth / 3,
                  height: targetHeight,
                  background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                  boxShadow: '0 0 8px rgba(59,130,246,0.5)',
                  transition: 'height 0.3s ease-out',
                }}
              />
              {/* 预测柱 */}
              <div
                className="relative rounded-t-sm"
                style={{
                  width: barWidth / 3,
                  height: forecastHeight,
                  background: 'linear-gradient(to top, #22d3ee, #67e8f9)',
                  boxShadow: '0 0 8px rgba(34,211,238,0.5)',
                  transition: 'height 0.3s ease-out',
                }}
              />
              {/* 已完成柱 */}
              <div
                className="relative rounded-t-sm"
                style={{
                  width: barWidth / 3,
                  height: completedHeight,
                  background: 'linear-gradient(to top, #22c55e, #4ade80)',
                  boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                  transition: 'height 0.3s ease-out',
                }}
              />
              {/* 月份标签 */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-cyan-400/50 whitespace-nowrap"
                style={{ width: barWidth * 3 + gap }}
              >
                {d.month}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('p-6', theme === 'dashboard' && DASHBOARD_STYLES.bg)}>
      {/* 标题栏 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className={cn('w-6 h-6', DASHBOARD_STYLES.neon)} />
          <h2 className={cn('text-xl font-bold', DASHBOARD_STYLES.neon)}>核心预测决策</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-400/60">
          <Clock className="w-4 h-4" />
          <span>实时数据</span>
        </div>
      </div>

      {/* 上层：三个仪表盘 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 预测完成 */}
        <div className="flex flex-col items-center">
          <div className="relative w-[160px] h-[160px]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="10" />
              <circle
                cx="100" cy="100" r="75" fill="none" stroke="#22d3ee"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${Math.min((animatedForecast / target) * 100, 100) * 4.71} 471`}
                transform="rotate(-90 100 100)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,1))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-black text-cyan-400"
                style={{ textShadow: '0 0 15px rgba(34,211,238,1)' }}
              >
                {mounted ? Math.round(animatedForecast) : 0}
              </div>
              <div className="text-xs text-cyan-400/60">万</div>
              <div className="text-xs text-cyan-500/50 mt-1">预测完成</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="flex justify-between text-xs text-cyan-500/60 px-8">
              <span>已完成: <span className="text-cyan-300">{mounted ? Math.round(animatedCompleted) : 0}万</span></span>
              <span className={animatedForecast >= target ? 'text-green-400' : 'text-red-400'}>
                缺口: {mounted ? Math.round(animatedForecast - animatedCompleted) : 0}万
              </span>
            </div>
          </div>
        </div>

        {/* 达成率（主仪表盘） */}
        <div className="flex flex-col items-center lg:col-span-1">
          <MainGauge value={animatedRate} maxValue={100} size={220} />
          <div className="mt-4 text-center">
            <div className="text-sm text-cyan-400/70 mb-2">目标达成</div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-cyan-500/60">目标: {target}万</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-500/60">预测: {mounted ? Math.round(animatedForecast) : 0}万</span>
              </div>
            </div>
          </div>
        </div>

        {/* 时间紧迫度 */}
        <div className="flex flex-col items-center">
          <div className="relative w-[160px] h-[160px]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="10" />
              <circle
                cx="100" cy="100" r="75" fill="none" stroke="#ef4444"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${Math.min((7 / 30) * 100, 100) * 4.71} 471`}
                transform="rotate(-90 100 100)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,1))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-black text-red-400"
                style={{ textShadow: '0 0 15px rgba(239,68,68,1)' }}
              >
                7
              </div>
              <div className="text-xs text-red-400/60">天</div>
              <div className="text-xs text-red-500/50 mt-1">剩余天数</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs text-red-400 font-semibold">紧迫</span>
            </div>
            <div className="text-xs text-cyan-500/60">
              日均需完成 <span className="text-cyan-300 font-semibold">95万</span>
            </div>
          </div>
        </div>
      </div>

      {/* 下层：12个月趋势展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 雷达图 */}
        <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className={cn('w-4 h-4', DASHBOARD_STYLES.neon)} />
            <h3 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textMuted)}>12月趋势雷达</h3>
          </div>
          <RadarChart />
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-blue-500" />
              <span className="text-cyan-400/60">目标</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-cyan-400" />
              <span className="text-cyan-400/60">预测</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-green-400" />
              <span className="text-cyan-400/60">已完成</span>
            </div>
          </div>
        </div>

        {/* 霓虹柱状图 */}
        <div className={`${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className={cn('w-4 h-4', DASHBOARD_STYLES.neon)} />
            <h3 className={cn('text-sm font-semibold', DASHBOARD_STYLES.textMuted)}>12月趋势柱状</h3>
          </div>
          <div className="h-[160px]">
            <NeonBarChart />
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-blue-500" />
              <span className="text-cyan-400/60">目标</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-cyan-400" />
              <span className="text-cyan-400/60">预测</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-green-400" />
              <span className="text-cyan-400/60">已完成</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="mt-6 pt-4 border-t border-cyan-500/20">
        <div className="flex items-center justify-between text-xs text-cyan-500/40">
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3" />
            <span>驾驶舱模式已激活</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>系统正常</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>数据实时</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
