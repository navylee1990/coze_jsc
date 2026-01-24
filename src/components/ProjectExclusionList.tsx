'use client';

import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, XCircle, Clock, FileText, TrendingDown } from 'lucide-react';

interface ProjectExclusionListProps {
  excludedProjects: any[];
  theme?: 'dark' | 'dashboard';
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function ProjectExclusionList({
  excludedProjects,
  theme = 'dashboard',
  collapsed = false,
  onToggle
}: ProjectExclusionListProps) {
  if (!excludedProjects || excludedProjects.length === 0) {
    return null;
  }

  const getExcludeReasonStyle = (reason: string) => {
    const styles = {
      progress_low: {
        icon: TrendingDown,
        color: theme === 'dashboard' ? 'text-red-400' : 'text-red-600',
        bgColor: theme === 'dashboard' ? 'bg-red-500/20' : 'bg-red-100',
        borderColor: theme === 'dashboard' ? 'border-red-500/30' : 'border-red-300'
      },
      delayed: {
        icon: Clock,
        color: theme === 'dashboard' ? 'text-orange-400' : 'text-orange-600',
        bgColor: theme === 'dashboard' ? 'bg-orange-500/20' : 'bg-orange-100',
        borderColor: theme === 'dashboard' ? 'border-orange-500/30' : 'border-orange-300'
      },
      pending_approval: {
        icon: FileText,
        color: theme === 'dashboard' ? 'text-yellow-400' : 'text-yellow-600',
        bgColor: theme === 'dashboard' ? 'bg-yellow-500/20' : 'bg-yellow-100',
        borderColor: theme === 'dashboard' ? 'border-yellow-500/30' : 'border-yellow-300'
      },
      risk_high: {
        icon: AlertCircle,
        color: theme === 'dashboard' ? 'text-red-400' : 'text-red-600',
        bgColor: theme === 'dashboard' ? 'bg-red-500/20' : 'bg-red-100',
        borderColor: theme === 'dashboard' ? 'border-red-500/30' : 'border-red-300'
      },
      not_confirmed: {
        icon: XCircle,
        color: theme === 'dashboard' ? 'text-gray-400' : 'text-gray-600',
        bgColor: theme === 'dashboard' ? 'bg-gray-500/20' : 'bg-gray-100',
        borderColor: theme === 'dashboard' ? 'border-gray-500/30' : 'border-gray-300'
      }
    };
    return styles[reason as keyof typeof styles] || styles.not_confirmed;
  };

  const totalExcludedAmount = excludedProjects.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mt-3 pt-3 border-t border-cyan-500/20">
      {/* 展开标题 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className={`w-3.5 h-3.5 ${theme === 'dashboard' ? 'text-red-400' : 'text-red-600'}`} />
          <span className={`text-xs font-semibold ${theme === 'dashboard' ? 'text-red-300' : 'text-red-700'}`}>
            未统计项目 ({excludedProjects.length}个)
          </span>
          <span className={`text-xs ${theme === 'dashboard' ? 'text-red-400/80' : 'text-red-600'}`}>
            共{totalExcludedAmount}万
          </span>
        </div>
        {collapsed ? (
          <ChevronRight className={`w-4 h-4 transition-transform ${theme === 'dashboard' ? 'text-cyan-400/70' : 'text-gray-400'}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${theme === 'dashboard' ? 'text-cyan-400/70' : 'text-gray-400'}`} />
        )}
      </button>

      {/* 项目列表 */}
      {!collapsed && (
        <div className="space-y-1.5">
          {excludedProjects.map((project) => {
            const style = getExcludeReasonStyle(project.excludeReason);
            const Icon = style.icon;
            const progressGap = project.expectedProgress - project.currentProgress;

            return (
              <div
                key={project.id}
                className={`p-2 rounded border ${style.bgColor} ${style.borderColor} transition-all hover:opacity-80`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-start gap-2 flex-1">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${style.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-xs truncate ${theme === 'dashboard' ? 'text-slate-200' : 'text-slate-800'}`}>
                        {project.name}
                      </div>
                      <div className={`text-[10px] ${theme === 'dashboard' ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                        {project.excludeReasonText}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold ml-2 flex-shrink-0 ${style.color}`}>
                    {project.amount}万
                  </div>
                </div>

                {/* 进度对比 */}
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={theme === 'dashboard' ? 'text-slate-400' : 'text-slate-500'}>
                    当前进度
                  </span>
                  <span className={theme === 'dashboard' ? 'text-slate-400' : 'text-slate-500'}>
                    预期进度
                  </span>
                </div>
                <div className="relative">
                  {/* 预期进度条（背景） */}
                  <div className="h-1.5 rounded-full bg-slate-600/30 overflow-hidden">
                    <div
                      className="h-full bg-slate-500/50"
                      style={{ width: `${project.expectedProgress}%` }}
                    />
                  </div>
                  {/* 当前进度条（前景） */}
                  <div className="absolute top-0 left-0 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressGap > 20 ? 'bg-red-500' : progressGap > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${project.currentProgress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className={`font-semibold ${theme === 'dashboard' ? 'text-red-400' : 'text-red-600'}`}>
                    {project.currentProgress}%
                  </span>
                  <span className={theme === 'dashboard' ? 'text-slate-500' : 'text-slate-400'}>
                    差距{progressGap > 0 ? `-${progressGap}%` : `+${Math.abs(progressGap)}%`}
                  </span>
                  <span className={`font-semibold ${theme === 'dashboard' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {project.expectedProgress}%
                  </span>
                </div>

                {/* 概率标签 */}
                <div className="mt-1.5 flex items-center gap-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    project.probability === 'high'
                      ? theme === 'dashboard' ? 'bg-green-500/30 text-green-400' : 'bg-green-100 text-green-700'
                      : project.probability === 'medium'
                      ? theme === 'dashboard' ? 'bg-yellow-500/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                      : theme === 'dashboard' ? 'bg-gray-500/30 text-gray-400' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {project.probability === 'high' ? '高概率' : project.probability === 'medium' ? '中概率' : '低概率'}
                  </span>
                  {progressGap > 15 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'dashboard' ? 'bg-red-500/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                      进度滞后严重
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
