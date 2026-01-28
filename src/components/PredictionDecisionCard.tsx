'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, AlertTriangle, Zap, Gauge, BarChart3, TrendingUp } from 'lucide-react';
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

// 月度趋势数据
const monthlyTrendData = [
  { month: '1月', businessTarget: 1500, financialTarget: 1200, completed: 800, forecast: 900 },
  { month: '2月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 950 },
  { month: '3月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 880 },
  { month: '4月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1020 },
  { month: '5月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 980 },
  { month: '6月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1050 },
  { month: '7月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1100 },
  { month: '8月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1080 },
  { month: '9月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 1030 },
  { month: '10月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 990 },
  { month: '11月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 960 },
  { month: '12月', businessTarget: 1500, financialTarget: 1200, completed: 0, forecast: 940 },
];

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
  const [trendAnimations, setTrendAnimations] = useState<number[]>(new Array(12).fill(0));
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

    // 4. 趋势图动画
    const trendDuration = 2200;
    const trendStartTime = Date.now();
    const animateTrend = () => {
      const elapsed = Date.now() - trendStartTime;
      const progress = Math.min(elapsed / trendDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newAnimations = monthlyTrendData.map((data, index) => {
        return data.forecast * easeOut * (1 + (index * 0.05)); // 错开动画
      });

      setTrendAnimations(newAnimations);

      if (progress < 1) {
        requestAnimationFrame(animateTrend);
      }
    };

    animateRate();
    animateNeedle();
    animateNumbers();
    animateTrend();
  }, []);

  // 主仪表盘组件
  const MainGauge = ({ value, maxValue, size = 200 }: { value: number; maxValue: number; size?: number }) => {
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
            r="75"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="10"
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
            r="75"
            fill="none"
            stroke={percentage >= 90 ? '#22c55e' :
                    percentage >= 70 ? '#eab308' :
                    '#ef4444'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 4.71} 471`}
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
              points="-3,0 0,-55 3,0"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(34,211,238,1))',
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="#22d3ee"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.9))',
              }}
            />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black mb-1"
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
          <div className="text-xs font-semibold text-cyan-400/70">%</div>
          <div className="text-xs text-cyan-500/50 mt-1">达成率</div>
        </div>
      </div>
    );
  };

  // 小型仪表盘
  const SmallGauge = ({
    value,
    maxValue,
    label,
    unit = '万',
    color = 'cyan',
    size = 150
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
            r="70"
            fill="none"
            stroke="rgba(30,41,59,0.8)"
            strokeWidth="8"
          />

          {/* 进度弧线 */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 4.40} 440`}
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
              points="-2.5,0 0,-50 2.5,0"
              fill={strokeColor}
              style={{
                filter: `drop-shadow(0 0 6px ${strokeColor})`,
              }}
            />
            <circle cx="0" cy="0" r="5" fill={strokeColor} />
          </g>
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-black"
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

  // 月度趋势柱状图（驾驶舱风格）
  const MonthlyTrendChart = () => {
    const maxValue = 1600; // 最大值

    return (
      <div className="mt-6 pt-6 border-t border-cyan-500/20">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
              <h3 className={cn('text-lg font-bold', DASHBOARD_STYLES.neon)}>
                年度趋势预测
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-400/30 border-2 border-orange-400"></div>
              <div className="text-xs">
                <div className="text-orange-400 font-semibold">业务目标</div>
                <div className="text-cyan-500/60">1500万/月</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-400 border-2 border-cyan-300"></div>
              <div className="text-xs">
                <div className="text-cyan-400 font-semibold">预测完成</div>
                <div className="text-cyan-500/60">模型预测</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-400 border-2 border-green-300"></div>
              <div className="text-xs">
                <div className="text-green-400 font-semibold">已完成</div>
                <div className="text-cyan-500/60">实际签约</div>
              </div>
            </div>
          </div>
        </div>

        {/* 柱状图容器 */}
        <div className="relative h-48 w-full">
          {/* 业务目标线（1500万） */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400"
            style={{ top: `${100 - (1500 / maxValue) * 100}%` }}
          >
            <span className="absolute right-2 -top-5 text-xs text-orange-400 font-semibold whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded">
              业务目标 1500万
            </span>
          </div>

          {/* 财务目标线（1200万） */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-purple-400"
            style={{ top: `${100 - (1200 / maxValue) * 100}%` }}
          >
            <span className="absolute right-2 -top-5 text-xs text-purple-400 font-semibold whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded">
              财务目标 1200万
            </span>
          </div>

          {/* Y轴刻度 */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-cyan-500/50 -ml-2">
            <span>1600</span>
            <span>1200</span>
            <span>800</span>
            <span>400</span>
            <span>0</span>
          </div>

          {/* 柱状图 */}
          <div className="flex items-end justify-between h-full gap-1 sm:gap-2 px-2 ml-6">
            {monthlyTrendData.map((data, index) => {
              const targetHeight = (data.businessTarget / maxValue) * 100;
              const forecastHeight = (trendAnimations[index] / maxValue) * 100;
              const completedHeight = (data.completed / maxValue) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group">
                  {/* 数值显示（hover时显示） */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-center z-10">
                    <div className="flex flex-col gap-1">
                      {data.completed > 0 && (
                        <div className="text-xs text-green-400">
                          <span className="font-semibold">已完成:</span> {data.completed}万
                        </div>
                      )}
                      <div className="text-xs text-cyan-300">
                        <span className="font-semibold">预测:</span> {mounted ? Math.round(trendAnimations[index]) : 0}万
                      </div>
                      <div className="text-xs text-orange-400">
                        <span className="font-semibold">目标:</span> {data.businessTarget}万
                      </div>
                    </div>
                  </div>

                  {/* 柱状图 */}
                  <div className="relative w-full max-w-[4.5rem] bg-slate-800/50 rounded-t-lg overflow-hidden">
                    {/* 目标柱（背景 - 橙色半透明） */}
                    <div
                      className="absolute inset-0 bg-orange-500/30 rounded-t-lg border-t-2 border-orange-400"
                      style={{ height: `${targetHeight}%` }}
                    />

                    {/* 预测柱（前景 - 青色渐变） */}
                    {forecastHeight > 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${forecastHeight}%`,
                          filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.8))',
                          boxShadow: '0 0 20px rgba(34,211,238,0.4)',
                        }}
                      >
                        {/* 已完成部分（实心 - 绿色） */}
                        {data.completed > 0 && (
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg border-t-2 border-green-300"
                            style={{
                              height: `${(completedHeight / forecastHeight) * 100}%`,
                              filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.8))',
                              boxShadow: '0 0 20px rgba(74,222,128,0.4)',
                            }}
                          />
                        )}

                        {/* 顶部发光效果 */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 bg-cyan-300"
                          style={{
                            filter: 'drop-shadow(0 0 12px rgba(34,211,238,1))',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 月份标签 */}
                  <div className="mt-2 px-2 py-1 rounded text-xs text-cyan-400/70 font-medium transition-all group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'p-5',
      theme === 'dashboard' && DASHBOARD_STYLES.bg
    )}>
      {/* 标题栏 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className={cn('w-5 h-5', DASHBOARD_STYLES.neon)} />
          <h2 className={cn('text-lg font-bold', DASHBOARD_STYLES.neon)}>
            核心预测决策
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-cyan-400/60">
          <Clock className="w-4 h-4" />
          <span>实时数据</span>
        </div>
      </div>

      {/* 驾驶舱布局 - 仪表盘 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 左侧：预测完成 */}
        <div className="flex flex-col items-center">
          <SmallGauge
            value={animatedForecast}
            maxValue={target}
            label="预测完成"
            unit="万"
            color="cyan"
            size={150}
          />
          <div className="mt-3 text-center">
            <div className="flex justify-between text-xs text-cyan-500/60 px-4">
              <span>已完成</span>
              <span className="font-semibold text-cyan-300">
                {mounted ? Math.round(animatedCompleted) : 0}万
              </span>
            </div>
          </div>
        </div>

        {/* 中央：达成率（主仪表盘） */}
        <div className="flex flex-col items-center">
          <MainGauge
            value={animatedRate}
            maxValue={100}
            size={200}
          />
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-cyan-500/60">目标</span>
                <span className="font-semibold text-orange-400">{target}万</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
            size={150}
          />
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="text-xs text-red-400 font-semibold">紧迫</span>
            </div>
            <div className="mt-1 text-xs text-cyan-500/60">
              日均需完成 <span className="font-semibold text-cyan-300">95万</span>
            </div>
          </div>
        </div>
      </div>

      {/* 年度趋势图 */}
      <MonthlyTrendChart />

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
              <TrendingUp className="w-3 h-3" />
              <span>趋势实时</span>
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
