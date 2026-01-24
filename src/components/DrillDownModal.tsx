'use client';

import { X, ArrowLeft, Activity, User } from 'lucide-react';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: any[];
  level: 'city' | 'salesperson';
  onBack?: () => void;
  onItemClick?: (item: any) => void;
}

// 驾驶舱样式
const DASHBOARD_STYLES = {
  bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  text: 'text-cyan-50',
  textMuted: 'text-cyan-300/70',
  textSecondary: 'text-cyan-200',
  cardBg: 'bg-slate-900/60 backdrop-blur-sm',
  cardBorder: 'border-cyan-500/30',
  glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  neon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
};

export default function DrillDownModal({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  level,
  onBack,
  onItemClick
}: DrillDownModalProps) {
  if (!isOpen) return null;

  // 计算合计
  const totals = data.reduce((acc, item) => ({
    target: acc.target + item.target,
    completed: acc.completed + item.completed,
    predicted: acc.predicted + item.predicted,
    pendingAmount: acc.pendingAmount + (item.pendingAmount || 0),
  }), { target: 0, completed: 0, predicted: 0, pendingAmount: 0 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className={`relative w-full max-w-5xl max-h-[90vh] ${DASHBOARD_STYLES.cardBg} ${DASHBOARD_STYLES.cardBorder} border-2 rounded-2xl overflow-hidden ${DASHBOARD_STYLES.glow}`}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-slate-900/80">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className={`text-xl font-bold ${DASHBOARD_STYLES.neon} flex items-center gap-2`}>
                <Activity className="w-5 h-5" />
                {title}
              </h2>
              {subtitle && <p className={`text-sm ${DASHBOARD_STYLES.textMuted} mt-1`}>{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 合计数据栏 */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-cyan-500/10">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>目标</div>
              <div className="text-2xl font-bold text-cyan-300">{totals.target.toLocaleString()}</div>
              <div className="text-xs text-cyan-400/60 mt-1">万元</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>预测</div>
              <div className="text-2xl font-bold text-cyan-300">{totals.predicted.toLocaleString()}</div>
              <div className="text-xs text-cyan-400/60 mt-1">万元</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>在手项目</div>
              <div className="text-2xl font-bold text-cyan-300">{totals.pendingAmount.toLocaleString()}</div>
              <div className="text-xs text-cyan-400/60 mt-1">万元</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-cyan-500/20">
              <div className={`text-xs ${DASHBOARD_STYLES.textMuted} mb-1`}>总体达成率</div>
              <div className={`text-2xl font-bold ${totals.predicted >= totals.target ? 'text-green-400' : 'text-red-400'}`}>
                {((totals.predicted / totals.target) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-cyan-400/60 mt-1">预测达成</div>
            </div>
          </div>
        </div>

        {/* 数据列表 */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item, index) => (
              <div
                key={index}
                className={`${DASHBOARD_STYLES.cardBg} border-2 rounded-xl p-4 transition-all duration-300 hover:border-cyan-400/60 hover:scale-105 ${DASHBOARD_STYLES.glow} ${
                  item.gap > 0 ? 'border-red-500/30' : 'border-green-500/30'
                } ${level === 'city' ? 'cursor-pointer' : ''}`}
                onClick={() => level === 'city' && onItemClick?.(item)}
              >
                {/* 名称 */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-base font-bold text-cyan-200 flex items-center gap-2`}>
                    {level === 'salesperson' ? <User className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    {item.name}
                  </h4>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    item.gap > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {item.gap > 0 ? `${item.gap}` : `+${Math.abs(item.gap)}`}
                  </div>
                </div>

                {/* 指标网格 */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-cyan-400/60 mb-1">目标</div>
                    <div className="text-lg font-bold text-cyan-300">{item.target.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-cyan-400/60 mb-1">预测</div>
                    <div className="text-lg font-bold text-cyan-300">{item.predicted.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-cyan-400/60 mb-1">已完成</div>
                    <div className="text-lg font-bold text-cyan-300">{item.completed.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-cyan-400/60 mb-1">在手项目</div>
                    <div className="text-lg font-bold text-cyan-300">{(item.pendingAmount || 0).toLocaleString()}</div>
                  </div>
                </div>

                {/* 达成率进度条 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cyan-400/60">达成率</span>
                    <span className={item.rate >= 100 ? 'text-green-400' : item.rate >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                      {item.rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.rate >= 100 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.rate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 负责人（如果是城市层级） */}
                {level === 'city' && item.owner && (
                  <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-xs">
                    <span className="text-cyan-400/60">负责人</span>
                    <span className="text-cyan-300">{item.owner}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
