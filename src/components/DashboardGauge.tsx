'use client';

import React from 'react';

interface DashboardGaugeProps {
  target: number;
  predicted: number;
  gap: number;
  size?: number;
  showDetails?: boolean;
}

/**
 * 驾驶舱仪表盘组件
 * 用于展示目标、预测完成、缺口等信息
 * 采用汽车仪表盘风格，带青色霓虹发光效果
 */
export default function DashboardGauge({
  target,
  predicted,
  gap,
  size = 280,
  showDetails = true,
}: DashboardGaugeProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - 20) / 2;
  const strokeWidth = 16;

  // 计算达成率
  const achievementRate = target > 0 ? (predicted / target) * 100 : 0;
  const clampedRate = Math.min(Math.max(achievementRate, 0), 120); // 限制在0-120%

  // 仪表盘角度（从135度到405度，总共270度）
  const startAngle = 135;
  const endAngle = 405;
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (clampedRate / 120) * angleRange;

  // 将角度转换为弧度
  const angleToRadians = (angle: number) => (angle * Math.PI) / 180;

  // 计算指针末端位置
  const pointerLength = radius - 10;
  const pointerX = centerX + pointerLength * Math.cos(angleToRadians(currentAngle));
  const pointerY = centerY + pointerLength * Math.sin(angleToRadians(currentAngle));

  // 计算仪表盘弧线路径
  const getArcPath = (start: number, end: number) => {
    const startRad = angleToRadians(start);
    const endRad = angleToRadians(end);
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    const largeArcFlag = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // 获取颜色
  const getColor = () => {
    if (achievementRate >= 100) return '#22c55e'; // 绿色
    if (achievementRate >= 80) return '#eab308'; // 黄色
    return '#ef4444'; // 红色
  };

  const gaugeColor = getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
      >
        {/* 背景圆弧 */}
        <path
          d={getArcPath(startAngle, endAngle)}
          fill="none"
          stroke="rgba(30, 41, 59, 0.5)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 刻度线 */}
        {[0, 20, 40, 60, 80, 100, 120].map((tick) => {
          const tickAngle = startAngle + (tick / 120) * angleRange;
          const tickRad = angleToRadians(tickAngle);
          const innerRadius = radius - strokeWidth / 2 - 5;
          const outerRadius = radius - strokeWidth / 2 + 5;
          const x1 = centerX + innerRadius * Math.cos(tickRad);
          const y1 = centerY + innerRadius * Math.sin(tickRad);
          const x2 = centerX + outerRadius * Math.cos(tickRad);
          const y2 = centerY + outerRadius * Math.sin(tickRad);

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={tick >= 100 ? '#22c55e' : tick >= 80 ? '#eab308' : '#ef4444'}
              strokeWidth={2}
              opacity={0.6}
            />
          );
        })}

        {/* 进度弧 */}
        <path
          d={getArcPath(startAngle, currentAngle)}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${gaugeColor})`,
          }}
        />

        {/* 青色霓虹光晕 */}
        <path
          d={getArcPath(startAngle, currentAngle)}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          opacity={0.3}
          style={{
            filter: `drop-shadow(0 0 15px rgba(6,182,212,0.8))`,
          }}
        />

        {/* 指针 */}
        <g
          style={{
            filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.8))',
          }}
        >
          <line
            x1={centerX}
            y1={centerY}
            x2={pointerX}
            y2={pointerY}
            stroke="#22d3ee"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={8}
            fill="#0f172a"
            stroke="#22d3ee"
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))',
            }}
          />
        </g>

        {/* 刻度标签 */}
        <text
          x={centerX}
          y={centerY + radius + 25}
          textAnchor="middle"
          fill="rgba(6,182,212,0.7)"
          fontSize={11}
          fontWeight="500"
        >
          0%
        </text>
        <text
          x={centerX - radius - 10}
          y={centerY}
          textAnchor="middle"
          fill="rgba(6,182,212,0.7)"
          fontSize={11}
          fontWeight="500"
        >
          60%
        </text>
        <text
          x={centerX + radius + 10}
          y={centerY}
          textAnchor="middle"
          fill="rgba(6,182,212,0.7)"
          fontSize={11}
          fontWeight="500"
        >
          100%
        </text>
      </svg>

      {/* 中央数值 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div className={`text-4xl font-bold drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] ${achievementRate >= 100 ? 'text-green-400' : achievementRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
          {achievementRate.toFixed(1)}%
        </div>
        <div className="text-xs text-cyan-400/70 mt-1">达成率</div>

        {showDetails && (
          <div className="mt-3 space-y-1 text-center">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-cyan-400/70">目标</span>
              <span className="text-cyan-300 font-semibold">{target.toLocaleString()}万</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-cyan-400/70">预测</span>
              <span className="text-cyan-300 font-semibold">{predicted.toLocaleString()}万</span>
            </div>
            <div className={`flex items-center gap-2 text-xs ${gap >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              <span className={`${gap >= 0 ? 'text-red-400/70' : 'text-green-400/70'}`}>缺口</span>
              <span className="font-semibold">
                {gap >= 0 ? gap.toFixed(0) : `+${Math.abs(gap).toFixed(0)}`}万
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
