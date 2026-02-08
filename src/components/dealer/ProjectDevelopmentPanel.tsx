'use client';

import { useState } from 'react';
import { FolderKanban, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 项目阶段数据
const projectStages = [
  { stage: '初报备', percentage: 0, count: 45, color: 'bg-gray-500' },
  { stage: '复核', percentage: 10, count: 38, color: 'bg-blue-500' },
  { stage: '现场勘察', percentage: 20, count: 32, color: 'bg-cyan-500' },
  { stage: '需求确认中', percentage: 30, count: 28, color: 'bg-teal-500' },
  { stage: '方案提交', percentage: 40, count: 24, color: 'bg-green-500' },
  { stage: '方案确认', percentage: 50, count: 20, color: 'bg-lime-500' },
  { stage: '计划采购中', percentage: 60, count: 18, color: 'bg-yellow-500' },
  { stage: '采购流程启动', percentage: 70, count: 15, color: 'bg-orange-500' },
  { stage: '合同流程', percentage: 90, count: 12, color: 'bg-red-500' },
  { stage: '已签约', percentage: 100, count: 10, color: 'bg-red-600' },
  { stage: '已下单', percentage: 100, count: 8, color: 'bg-red-700' },
];

// 4个季度项目滚动成交率
const quarterlyConversionRate = [
  { quarter: 'Q1', rate: 15 },
  { quarter: 'Q2', rate: 18 },
  { quarter: 'Q3', rate: 22 },
  { quarter: 'Q4', rate: 25 },
];

// 项目报备时间分布
const projectTimeDistribution = [
  { period: '1-3个月', count: 35 },
  { period: '3-6个月', count: 48 },
  { period: '6-9个月', count: 42 },
  { period: '9-12个月', count: 28 },
  { period: '&gt;12个月', count: 15 },
  { period: '延期项目', count: 18 },
];

// 严重超标项目
const overdueProjects = [
  { id: 'P001', name: 'XX学校净化项目', stage: '现场勘察', overdue: 15, amount: 120 },
  { id: 'P002', name: 'XX医院净化系统', stage: '方案提交', overdue: 22, amount: 180 },
  { id: 'P003', name: 'XX企业办公楼', stage: '需求确认中', overdue: 18, amount: 95 },
  { id: 'P004', name: 'XX政府机关项目', stage: '复核', overdue: 12, amount: 200 },
  { id: 'P005', name: 'XX金融机构', stage: '方案确认', overdue: 28, amount: 250 },
];

export default function ProjectDevelopmentPanel() {
  const [showOverdueDetails, setShowOverdueDetails] = useState(false);

  const totalProjects = 250;
  const reportedQuota = 500;
  const remainingQuota = reportedQuota - 250;
  const annualReported = 250;

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-cyan-50">项目开发</h2>
      </div>

      {/* 项目情况分析 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-50 font-bold">项目情况分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="text-xs text-cyan-300/70 mb-1">项目报备数量额度</div>
              <div className="text-xl font-bold text-cyan-50">{reportedQuota}</div>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="text-xs text-green-300/70 mb-1">已报备项目数</div>
              <div className="text-xl font-bold text-green-400">{totalProjects}</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="text-xs text-yellow-300/70 mb-1">剩余报备数量额度</div>
              <div className="text-xl font-bold text-yellow-400">{remainingQuota}</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="text-xs text-purple-300/70 mb-1">当年度报备项目数</div>
              <div className="text-xl font-bold text-purple-400">{annualReported}</div>
            </div>
          </div>

          {/* 已报备项目时间分布 */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-300 mb-3">已报备项目时间分布</h3>
            <div className="space-y-2">
              {projectTimeDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-300">{item.period}</span>
                    <span className="text-cyan-50 font-semibold">{item.count} 个</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / 48) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目节点推进 */}
      <Card className="backdrop-blur-xl border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-50 font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            项目节点推进
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 4个季度项目滚动成交率 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-cyan-300 mb-3">4个季度项目滚动成交率</h3>
            <div className="flex gap-3">
              {quarterlyConversionRate.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                >
                  <div className="text-2xl font-bold text-cyan-400">{item.rate}%</div>
                  <div className="text-xs text-cyan-300/70 mt-1">{item.quarter}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 各阶段项目报备数量 */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-300 mb-3">各阶段项目报备数量</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {projectStages.map((item, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cyan-300 truncate flex-1">{item.stage}</span>
                    <span className="text-xs text-cyan-300/70 ml-2">{item.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', item.color)}
                        style={{ width: `${(item.count / 45) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-cyan-50">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 严重超标项目 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                严重超标项目（可点击查看明细）
              </h3>
              <button
                onClick={() => setShowOverdueDetails(!showOverdueDetails)}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {showOverdueDetails ? '收起' : '展开'}
              </button>
            </div>

            {showOverdueDetails ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyan-500/30">
                      <th className="text-left py-2 px-2 text-cyan-300 font-semibold whitespace-nowrap">项目ID</th>
                      <th className="text-left py-2 px-2 text-cyan-300 font-semibold whitespace-nowrap">项目名称</th>
                      <th className="text-center py-2 px-2 text-cyan-300 font-semibold whitespace-nowrap">当前阶段</th>
                      <th className="text-center py-2 px-2 text-cyan-300 font-semibold whitespace-nowrap">超期天数</th>
                      <th className="text-right py-2 px-2 text-cyan-300 font-semibold whitespace-nowrap">金额(万)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueProjects.map((project, index) => (
                      <tr
                        key={index}
                        className="border-b border-cyan-500/10 hover:bg-red-500/10 transition-colors"
                      >
                        <td className="py-2 px-2 text-cyan-300">{project.id}</td>
                        <td className="py-2 px-2 text-cyan-50">{project.name}</td>
                        <td className="py-2 px-2 text-cyan-300 text-center">{project.stage}</td>
                        <td className="py-2 px-2 text-red-400 font-bold text-center">{project.overdue}天</td>
                        <td className="py-2 px-2 text-cyan-50 text-right font-semibold">{project.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {overdueProjects.map((project, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <div className="text-xs text-cyan-300 mb-1">{project.name}</div>
                    <div className="text-sm font-bold text-red-400">{project.overdue}天</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
