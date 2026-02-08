'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, Activity, Target, Clock, ChevronLeft, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DealerFinancialMetrics from '@/components/dealer/DealerFinancialMetrics';
import MarketInsightsPanel from '@/components/dealer/MarketInsightsPanel';
import ProjectDevelopmentPanel from '@/components/dealer/ProjectDevelopmentPanel';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 页面标题
const PAGE_TITLE = '经销商销售预测';

export default function DealerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-cyan-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/gm">
              <button className="rounded-lg p-2 hover:bg-cyan-500/10 transition-colors">
                <ChevronLeft className="h-5 w-5 text-cyan-400" />
              </button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {PAGE_TITLE}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-cyan-300">实时数据</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="p-4 lg:p-6 space-y-6">
        {/* 财务指标模块 */}
        <DealerFinancialMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 市场洞察及风险分析 */}
          <MarketInsightsPanel />

          {/* 项目开发分析 */}
          <ProjectDevelopmentPanel />
        </div>
      </div>
    </div>
  );
}
