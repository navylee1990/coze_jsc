'use client';

import React from 'react';

interface MiniGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

/**
 * 小型仪表盘组件
 * 用于区域达成情况展示
 * 根据达成率自动变色（绿/黄/红）
 */
export default function MiniGauge({
  value,
  size = 60,
  strokeWidth = 6,
}: MiniGaugeProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - strokeWidth) / 2;

  // 限制值在0-100之间
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // 仪表盘角度（从180度到360度，总共180度）
  const startAngle = 180;
  const endAngle = 360;
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (clampedValue / 100) * angleRange;

  // 将角度转换为弧度
  const angleToRadians = (angle: number) => (angle * Math.PI) / 180;

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
    if (clampedValue >= 100) return '#22c55e'; // 绿色
    if (clampedValue >= 80) return '#eab308'; // 黄色
    return '#ef4444'; // 红色
  };

  const gaugeColor = getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
      >
        {/* 背景圆弧 */}
        <path
          d={getArcPath(startAngle, endAngle)}
          fill="none"
          stroke="rgba(30, 41, 59, 0.5)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 进度弧 */}
        <path
          d={getArcPath(startAngle, currentAngle)}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${gaugeColor})`,
          }}
        />

        {/* 青色霓虹光晕 */}
        <path
          d={getArcPath(startAngle, currentAngle)}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          opacity={0.3}
          style={{
            filter: `drop-shadow(0 0 10px rgba(6,182,212,0.6))`,
          }}
        />
      </svg>

      {/* 中央数值 */}
      <div className="absolute inset-0 flex items-end justify-center pb-1">
        <span className={`text-sm font-bold ${clampedValue >= 100 ? 'text-green-400' : clampedValue >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
          {clampedValue.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
