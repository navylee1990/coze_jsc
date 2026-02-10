// ============================================
// 前端组件集成API示例
// ============================================
// 本文件展示如何将硬编码的前端组件改为从API获取真实数据
// ============================================

// ============================================
// 示例1: CoreMetrics 组件修改
// ============================================

/*
修改前（硬编码数据）：
*/
export default function CoreMetricsOld({ timeRange }: { timeRange: string }) {
  // 硬编码的数据
  const metrics = {
    targetAmount: 10000,
    completedAmount: 6800,
    forecastAmount: 8500,
    yearOverYearGrowth: 12.5,
    completionRate: 68,
  };

  return (
    // ... 渲染代码
  );
}

/*
修改后（从API获取）：
*/
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 定义数据类型
interface DealerCoreMetrics {
  targetAmount: number;
  completedAmount: number;
  forecastAmount: number;
  yearOverYearGrowth: number;
  completionRate: number;
}

export default function CoreMetrics({ timeRange }: { timeRange: string }) {
  const [metrics, setMetrics] = useState<DealerCoreMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 从API获取数据
        const response = await fetch(
          `/api/dealer/data?dealerId=default&period=${timeRange}`
        );
        const result = await response.json();

        if (result.success && result.data.coreMetrics) {
          setMetrics(result.data.coreMetrics);
        } else {
          setError('暂无数据');
        }
      } catch (err) {
        setError('数据加载失败');
        console.error('Failed to fetch core metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyan-300/70">加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">{error || '暂无数据'}</div>
      </div>
    );
  }

  // 正常渲染
  return (
    <div className="space-y-3">
      <div className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs text-cyan-300/70 mb-1">目标金额</div>
        <div className="text-2xl font-bold text-cyan-50">
          {metrics.targetAmount.toLocaleString()}万
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs text-cyan-300/70 mb-1">已完成</div>
        <div className="text-2xl font-bold text-green-400">
          {metrics.completedAmount.toLocaleString()}万
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs text-cyan-300/70 mb-1">预计完成</div>
        <div className="text-2xl font-bold text-cyan-400">
          {metrics.forecastAmount.toLocaleString()}万
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/30 rounded-lg p-2 border border-white/10">
          <div className="text-xs text-cyan-300/70">同比增长</div>
          <div className={cn(
            "text-lg font-bold",
            metrics.yearOverYearGrowth >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {metrics.yearOverYearGrowth >= 0 ? "+" : ""}{metrics.yearOverYearGrowth}%
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-2 border border-white/10">
          <div className="text-xs text-cyan-300/70">完成率</div>
          <div className={cn(
            "text-lg font-bold",
            metrics.completionRate >= 80 ? "text-green-400" :
            metrics.completionRate >= 60 ? "text-yellow-400" : "text-red-400"
          )}>
            {metrics.completionRate}%
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 示例2: TrackAnalysisPanel 组件修改
// ============================================

/*
修改后（从API获取）：
*/
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target, ChevronRight, ChevronDown } from 'lucide-react';

interface TrackData {
  trackName: string;
  percentage: number;
  growthRate: number;
  healthScore: number;
  healthStatus: string;
  totalAmount: number;
  marginRate: number;
  subcategoryCount: number;
}

export default function TrackAnalysisPanel({ timeRange }: { timeRange: string }) {
  const [trackData, setTrackData] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dealer/data?dealerId=default&period=${timeRange}`
        );
        const result = await response.json();

        if (result.success && result.data.trackData) {
          setTrackData(result.data.trackData);
        }
      } catch (err) {
        console.error('Failed to fetch track data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) {
    return <div className="text-cyan-300/70">加载中...</div>;
  }

  return (
    <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base text-cyan-50 font-bold flex items-center gap-2">
          <Target className="h-4 w-4 text-cyan-400" />
          当前赛道定位分析
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {trackData.map((track, idx) => (
            <div key={idx} className="bg-slate-800/30 rounded-lg p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedTrack(expandedTrack === track.trackName ? null : track.trackName)}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    {expandedTrack === track.trackName ? (
                      <ChevronDown className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-cyan-400" />
                    )}
                    <span className="font-semibold text-sm text-cyan-50">{track.trackName}</span>
                  </button>
                  <span className="text-xs text-cyan-300/70">({track.subcategoryCount}个细分)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn(
                    track.growthRate >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {track.growthRate >= 0 ? '+' : ''}{track.growthRate}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-cyan-300/70">占比: <span className="font-semibold text-cyan-50">{track.percentage}%</span></div>
                <div className="text-cyan-300/70">金额: <span className="font-semibold text-cyan-50">{track.totalAmount}万</span></div>
                <div className="text-cyan-300/70">毛利率: <span className={cn('font-semibold', track.marginRate >= 20 ? 'text-green-400' : track.marginRate >= 15 ? 'text-yellow-400' : 'text-red-400')}>{track.marginRate}%</span></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// 需要修改的组件清单
// ============================================
/*
1. CoreMetrics.tsx - 核心指标
2. DealerFinancialMetrics.tsx - 月度销售趋势
3. TrackAnalysisPanel.tsx - 赛道定位分析
4. BusinessInsightsPanel.tsx - 盈利能力总览
5. ProjectFunnelPanel.tsx - 项目漏斗分析
6. ProjectRiskPanel.tsx - 项目风险分析

所有组件都按照上面的模式修改：
1. 添加 useState 管理数据状态
2. 添加 useEffect 获取API数据
3. 处理 loading、error 状态
4. 使用真实数据渲染UI
*/

// ============================================
// API数据结构说明
// ============================================
/*
GET /api/dealer/data 的响应结构：
{
  "success": true,
  "data": {
    "coreMetrics": {
      "targetAmount": 10000,
      "completedAmount": 6800,
      "forecastAmount": 8500,
      "yearOverYearGrowth": 12.5,
      "completionRate": 68
    },
    "monthlySales": [
      {
        "year": 2024,
        "month": 1,
        "targetAmount": 800,
        "completedAmount": 600,
        "forecastAmount": 750
      },
      // ... 更多月份数据
    ],
    "trackData": [
      {
        "trackName": "教育",
        "percentage": 35.0,
        "growthRate": 12.0,
        "healthScore": 85,
        "healthStatus": "良好",
        "totalAmount": 3500,
        "marginRate": 18.0,
        "subcategoryCount": 3
      },
      // ... 更多赛道数据
    ],
    "subcategoryData": [
      {
        "trackName": "教育",
        "subcategoryName": "幼教",
        "targetAmount": 2000,
        "actualAmount": 960,
        "completionRate": 48.0,
        "marginRate": 16.0,
        "status": "需加强",
        "productMix": { "premium": 30, "standard": 50, "budget": 20 },
        "insight": "...",
        "actions": ["..."],
        "priority": "高"
      },
      // ... 更多细分数据
    ],
    "projectFunnel": [
      {
        "stage": "初报备",
        "projectCount": 250,
        "conversionRate": 100.0,
        "issues": "无",
        "riskLevel": "低",
        "actions": "保持报备节奏"
      },
      // ... 更多漏斗数据
    ],
    "projectRisk": [
      {
        "category": "高风险项目",
        "projectCount": 28,
        "percentage": 11.2,
        "totalAmount": 2800,
        "avgAmount": 100,
        "issues": ["..."],
        "suggestions": ["..."],
        "impact": "..."
      },
      // ... 更多风险数据
    ],
    "criticalProjects": [
      {
        "id": "P001",
        "projectName": "XX学校净化项目",
        "customerName": "XX教育集团",
        "industry": "教育",
        "stage": "方案确认",
        "amount": 350,
        "overdueDays": 35,
        "riskLevel": "严重",
        "issues": ["..."],
        "probability": 20,
        "suggestion": "...",
        "actions": "..."
      },
      // ... 更多预警数据
    ]
  }
}
*/
