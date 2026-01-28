'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

// 主题类型
type Theme = 'dark' | 'dashboard';

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
  warningNeon: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  successNeon: 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]',
};

// 组件属性
interface PredictionDecisionCardProps {
  theme?: Theme;
}

export default function PredictionDecisionCard({
  theme = 'dashboard',
}: PredictionDecisionCardProps) {
  // 核心数据
  const target = 1500;      // 目标（万元）
  const forecast = 1140;    // 预测（万元）
  const completed = 800;    // 已完成（万元）
  const achievementRate = 76; // 达成率 %

  // 动画状态
  const [animatedRate, setAnimatedRate] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(-90);
  const [animatedForecast, setAnimatedForecast] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [mounted, setMounted] = useState(false);

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

    // 2. 指针动画
    const needleDuration = 1500;
    const needleStartTime = Date.now();
    const targetAngle = (achievementRate / 100) * 180 - 90; // 0% = -90°, 100% = 90°
    const animateNeedle = () => {
      const elapsed = Date.now() - needleStartTime;
      const progress = Math.min(elapsed / needleDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setNeedleAngle(-90 + (targetAngle + 90) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNeedle);
      }
    };

    // 3. 数字滚动动画
    const duration = 1800;
    const startTime = Date.now();
    const animateNumbers = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedForecast(forecast * easeOut);
      setAnimatedCompleted(completed * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      }
    };

    animateRate();
    animateNeedle();
    animateNumbers();
  }, []);

  // 主仪表盘组件
  const MainGauge = ({ value, maxValue, size = 240 }: { value: number; maxValue: number; size?: number }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const angle = (percentage / 100) * 180 - 90;

    return (
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
            r="85"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="12"
          />

          {/* 刻度线 */}
          {[...Array(11)].map((_, i) => {
            const angle = (i * 18 - 90) * (Math.PI / 180);
            const innerR = 75;
            const outerR = 85;
            const x1 = 100 + innerR * Math.cos(angle);
            const y1 = 100 + innerR * Math.sin(angle);
            const x2 = 100 + outerR * Math.cos(angle);
            const y2 = 100 + outerR * Math.sin(angle);

            // 刻度颜色
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
            r="85"
            fill="none"
            stroke={percentage >= 90 ? '#22c55e' :
                    percentage >= 70 ? '#eab308' :
                    '#ef4444'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 5.34} 534`}
            strokeDashoffset={0}
            transform="rotate(-90 100 100)"
            style={{
              filter: percentage >= 90 ? 'drop-shadow(0 0 12px rgba(74,222,128,1))' :
                     percentage >= 70 ? 'drop-shadow(0 0 12px rgba(250,204,21,1))' :
                     'drop-shadow(0 0 12px rgba(239,68,68,1))',
              transition: 'stroke-dasharray 0.1s ease-out',
            }}
          />

          {/* 指针 */}
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon
              points="-4,0 0,-65 4,0"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(34,211,238,1))',
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="8"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.9))',
              }}
            />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-black mb-1"
               style={{
                 color: percentage >= 90 ? '#22c55e' :
                        percentage >= 70 ? '#eab308' :
                        '#ef4444',
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

  // 小型仪表盘（用于预测完成、时间紧迫度）
  const SmallGauge = ({
    value,
    maxValue,
    label,
    unit = '万',
    color = 'cyan',
    size = 180
  }: {
    value: number;
    maxValue: number;
    label: string;
    unit?: string;
    color?: 'cyan' | 'red' | 'green' | 'yellow';
    size?: number;
  }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const angle = (percentage / 100) * 180 - 90;

    const colorMap = {
      cyan: '#22d3ee',
      red: '#ef4444',
      green: '#22c55e',
      yellow: '#eab308',
    };

    const strokeColor = colorMap[color];

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 背景圆环 */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="10"
          />

          {/* 进度弧线 */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 4.71} 471`}
            strokeDashoffset={0}
            transform="rotate(-90 100 100)"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor})`,
              transition: 'stroke-dasharray 0.1s ease-out',
            }}
          />

          {/* 指针 */}
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon
              points="-3,0 0,-60 3,0"
              fill={strokeColor}
              style={{
                filter: `drop-shadow(0 0 6px ${strokeColor})`,
              }}
            />
            <circle cx="0" cy="0" r="6" fill={strokeColor} />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black"
               style={{
                 color: strokeColor,
                 textShadow: `0 0 15px ${strokeColor}`,
               }}
          >
            {mounted ? Math.round(value) : 0}
          </div>
          <div className="text-xs font-semibold text-cyan-400/60 mt-1">
            {unit}
          </div>
          <div className="text-xs text-cyan-500/50 mt-1">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'p-6',
      theme === 'dashboard' && DASHBOARD_STYLES.bg
    )}>
      {/* 标题栏 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className={cn('w-6 h-6', DASHBOARD_STYLES.neon)} />
          <h2 className={cn('text-xl font-bold', DASHBOARD_STYLES.neon)}>
            核心预测决策
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-400/60">
          <Clock className="w-4 h-4" />
          <span>实时数据</span>
        </div>
      </div>

      {/* 驾驶舱布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：预测完成 */}
        <div className="flex flex-col items-center">
          <SmallGauge
            value={animatedForecast}
            maxValue={target}
            label="预测完成"
            unit="万"
            color="cyan"
          />
          <div className="mt-4 text-center">
            <div className="text-sm text-cyan-400/70 mb-2">关键指标</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-cyan-500/60">
                <span>已完成</span>
                <span className="font-semibold text-cyan-300">
                  {mounted ? Math.round(animatedCompleted) : 0} 万
                </span>
              </div>
              <div className="flex justify-between text-xs text-cyan-500/60">
                <span>缺口</span>
                <span className={cn('font-semibold',
                  forecast >= target ? 'text-green-400' : 'text-red-400'
                )}>
                  {mounted ? (animatedForecast - animatedCompleted > 0 ? '+' : '') : ''}{mounted ? Math.round(animatedForecast - animatedCompleted) : 0} 万
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 中央：达成率（主仪表盘） */}
        <div className="flex flex-col items-center lg:col-span-1">
          <MainGauge
            value={animatedRate}
            maxValue={100}
            size={260}
          />
          <div className="mt-4 text-center">
            <div className="text-sm text-cyan-400/70 mb-2">目标达成</div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-cyan-500/60">目标</span>
                <span className="font-semibold text-orange-400">{target}万</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-500/60">预测</span>
                <span className="font-semibold text-cyan-300">
                  {mounted ? Math.round(animatedForecast) : 0}万
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：时间紧迫度 */}
        <div className="flex flex-col items-center">
          <SmallGauge
            value={7}
            maxValue={30}
            label="剩余天数"
            unit="天"
            color="red"
          />
          <div className="mt-4 text-center">
            <div className="text-sm text-cyan-400/70 mb-2">时间状态</div>
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs text-red-400 font-semibold">紧迫</span>
            </div>
            <div className="mt-2 text-xs text-cyan-500/60">
              日均需完成 <span className="font-semibold text-cyan-300">95万</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：驾驶舱科技装饰 */}
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
