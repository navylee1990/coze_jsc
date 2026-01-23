'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

// 仪表盘数据接口
interface GaugeData {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string; // 霓虹颜色
  warningThreshold?: number; // 警告阈值
  showPointer?: boolean; // 是否显示指针
}

interface GaugeDashboardProps {
  gauges: GaugeData[];
  className?: string;
}

// 单个仪表盘组件
function Gauge({ data, animate = true }: { data: GaugeData; animate?: boolean }) {
  const {
    value,
    max,
    label,
    unit,
    color,
    warningThreshold,
    showPointer = true
  } = data;

  // 计算角度（0%对应0度，100%对应180度）
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const angle = percentage * 180;

  // 创建刻度线
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const tickAngle = (i / 10) * 180;
    const isMajor = i % 5 === 0;
    const tickLength = isMajor ? 12 : 8;

    // 将角度转换为弧度
    const radian = ((180 - tickAngle) * Math.PI) / 180;

    // 刻度线的起点和终点
    const startX = 120 + 95 * Math.cos(radian);
    const startY = 120 - 95 * Math.sin(radian);
    const endX = 120 + (95 - tickLength) * Math.cos(radian);
    const endY = 120 - (95 - tickLength) * Math.sin(radian);

    ticks.push(
      <line
        key={i}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={i <= (warningThreshold ? warningThreshold / max * 10 : 10) ? color : '#64748b'}
        strokeWidth={isMajor ? 2.5 : 1.5}
        strokeLinecap="round"
        opacity={i <= percentage * 10 ? 1 : 0.3}
        style={{
          filter: i <= percentage * 10 ? `drop-shadow(0 0 4px ${color})` : 'none'
        }}
      />
    );
  }

  // 创建彩色弧线（进度条）
  const arcPath = () => {
    if (percentage === 0) return '';

    const startAngle = 180;
    const endAngle = 180 - angle;

    const startRadian = (startAngle * Math.PI) / 180;
    const endRadian = (endAngle * Math.PI) / 180;

    const radius = 85;
    const centerX = 120;
    const centerY = 120;

    const startX = centerX + radius * Math.cos(startRadian);
    const startY = centerY - radius * Math.sin(startRadian);
    const endX = centerX + radius * Math.cos(endRadian);
    const endY = centerY - radius * Math.sin(endRadian);

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${angle > 90 ? 1 : 0} 0 ${endX} ${endY}`;
  };

  // 指针位置
  const pointerAngle = 180 - angle;
  const pointerRadian = (pointerAngle * Math.PI) / 180;
  const pointerLength = 75;
  const pointerX = 120 + pointerLength * Math.cos(pointerRadian);
  const pointerY = 120 - pointerLength * Math.sin(pointerRadian);

  return (
    <div className="relative w-full aspect-square max-w-[240px] mx-auto">
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
        }}
      >
        {/* 背景渐变 */}
        <defs>
          <radialGradient id={`gaugeGradient-${label}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>

          {/* 霓虹发光滤镜 */}
          <filter id={`neonGlow-${label}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 指针发光 */}
          <filter id={`pointerGlow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 主背景圆 */}
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="url(#gaugeGradient)"
          stroke={color}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 15px ${color}40)`
          }}
          opacity="0.9"
        />

        {/* 内圈装饰线 */}
        <circle
          cx="120"
          cy="120"
          r="90"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* 外圈装饰线 */}
        <circle
          cx="120"
          cy="120"
          r="98"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.2"
        />

        {/* 刻度线 */}
        {ticks}

        {/* 彩色进度弧线 */}
        {percentage > 0 && (
          <path
            d={arcPath()}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              filter: `url(#neonGlow-${label})`,
              animation: animate ? 'glow 2s ease-in-out infinite' : 'none'
            }}
          />
        )}

        {/* 刻度数字 */}
        {[0, 25, 50, 75, 100].map((tickValue) => {
          const tickAngle = (tickValue / 100) * 180;
          const radian = ((180 - tickAngle) * Math.PI) / 180;
          const textRadius = 70;
          const textX = 120 + textRadius * Math.cos(radian);
          const textY = 120 - textRadius * Math.sin(radian);

          return (
            <text
              key={tickValue}
              x={textX}
              y={textY}
              fill={tickValue <= percentage * 100 ? '#e2e8f0' : '#64748b'}
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity={tickValue <= percentage * 100 ? 1 : 0.4}
            >
              {Math.round(tickValue)}
            </text>
          );
        })}

        {/* 指针 */}
        {showPointer && (
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '120px 120px',
              transition: animate ? 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              filter: `url(#pointerGlow-${label})`
            }}
          >
            {/* 指针杆 */}
            <line
              x1="120"
              y1="120"
              x2="195"
              y2="120"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* 指针尖端的亮点 */}
            <circle
              cx="195"
              cy="120"
              r="4"
              fill="#ffffff"
              style={{
                filter: `drop-shadow(0 0 8px ${color})`
              }}
            />
          </g>
        )}

        {/* 中心圆点 */}
        <circle
          cx="120"
          cy="120"
          r="8"
          fill="#0f172a"
          stroke={color}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`
          }}
        />

        {/* 数值显示（在指针下方） */}
        <text
          x="120"
          y="170"
          fill="#ffffff"
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            fontFamily: 'monospace'
          }}
        >
          {value.toLocaleString()}
        </text>

        {/* 单位 */}
        <text
          x="120"
          y="190"
          fill="#94a3b8"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {unit}
        </text>

        {/* 标签 */}
        <text
          x="120"
          y="210"
          fill={color}
          fontSize="13"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
            textShadow: `0 0 10px ${color}40`
          }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

export default function GaugeDashboard({ gauges, className }: GaugeDashboardProps) {
  return (
    <div className={cn('w-full', className)}>
      <style jsx global>{`
        @keyframes glow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {gauges.map((gauge, index) => (
          <div key={index} className="flex flex-col items-center">
            <Gauge data={gauge} animate={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
