'use client';

import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Clock, ChevronRight, BarChart3, Play, ChevronLeft, X, Moon, Sun, TrendingDown, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PredictionDecisionCard from '@/components/PredictionDecisionCard';
import FutureSupportAdequacyPanel from '@/components/FutureSupportAdequacyPanel';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// 页面标题
const PAGE_TITLE = '商用总经理驾驶舱';

// 主题类型
type Theme = 'dark' | 'light';

// 主题颜色映射 - 解决浅色模式对比度问题
const getThemeColors = (theme: Theme) => ({
  bg: theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50',
  text: theme === 'dark' ? 'text-white' : 'text-slate-900',
  textMuted: theme === 'dark' ? 'text-slate-600' : 'text-slate-600',
  textSecondary: theme === 'dark' ? 'text-slate-700' : 'text-slate-700',
  cardBg: theme === 'dark' ? 'bg-slate-900/50' : 'bg-white',
  cardBorder: theme === 'dark' ? 'border-slate-800' : 'border-slate-200',
  subCardBg: theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50',
  subCardBorder: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
});

// 核心预测总览数据
const forecastOverviewData = {
  currentMonth: {
    target: 1500,
    forecast: 1350,
    completed: 800
  },
  threeMonth: {
    target: 4500,
    forecast: 4200,
    completed: 2400
  },
  sixMonth: {
    target: 9000,
    forecast: 8500,
    completed: 4800
  }
};

// 风险面板数据
const riskData = {
  projectRisks: [
    { projectId: 3, projectName: '广州某企业办公楼项目', riskType: '30天无动作', impact: 405, owner: '王强', days: 32 },
    { projectId: 9, projectName: '西安某学校项目', riskType: '30天无动作', impact: 84, owner: '赵敏', days: 45 },
  ],
  personnelRisks: [
    { personId: 5, name: '陈明', riskType: 'SOP不达标', sopRate: 78, impact: -55, projectCount: 4 },
    { personId: 6, name: '赵敏', riskType: 'SOP不达标', sopRate: 72, impact: -68, projectCount: 3 },
  ]
};

// 预测趋势图数据
const forecastTrendData = [
  { month: '1月', target: 1500, forecast: 1350, completed: 800 },
  { month: '2月', target: 1500, forecast: 1480, completed: 0 },
  { month: '3月', target: 1500, forecast: 1370, completed: 0 },
  { month: '4月', target: 1500, forecast: 1420, completed: 0 },
  { month: '5月', target: 1500, forecast: 1380, completed: 0 },
  { month: '6月', target: 1500, forecast: 1450, completed: 0 },
];

export default function GMDashboard() {
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'current' | 'threeMonth' | 'sixMonth'>('current');

  // 主题颜色类 - 解决浅色模式对比度问题
  const textMuted = theme === 'dark' ? 'text-slate-600' : 'text-slate-600';
  const textSecondary = theme === 'dark' ? 'text-slate-700' : 'text-slate-700';
  const cardBg = theme === 'dark' ? 'bg-slate-900/50' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-slate-800' : 'border-slate-200';
  const subCardBg = theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50';
  const subCardBorder = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  // 获取当前时间范围的数据
  const getTimeRangeData = () => {
    if (selectedTimeRange === 'current') return forecastOverviewData.currentMonth;
    if (selectedTimeRange === 'threeMonth') return forecastOverviewData.threeMonth;
    return forecastOverviewData.sixMonth;
  };

  // 计算达成率
  const getAchievementRate = () => {
    const data = getTimeRangeData();
    return ((data.forecast / data.target) * 100).toFixed(1);
  };

  // 计算缺口
  const getGap = () => {
    const data = getTimeRangeData();
    return data.target - data.forecast;
  };

  // 切换主题
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-900'} min-h-screen`}>
      {/* 顶部导航栏 */}
      <header className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border-b backdrop-blur-sm sticky top-0 z-50`}>
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className={`${theme === 'dark' ? 'text-slate-600 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{PAGE_TITLE}</h1>
                <p className={`text-sm ${textSecondary}`}>预测驱动 · 数据赋能 · 精准决策</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={getGap() < 0 ? 'default' : 'destructive'} className="text-sm px-4 py-1.5">
                {getGap() < 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    预计超额完成 {Math.abs(getGap()).toFixed(0)}万
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-1" />
                    目标缺口 {getGap().toFixed(0)}万
                  </>
                )}
              </Badge>

              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Badge variant="outline" className="text-sm">
                张晖
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="max-w-[1920px] mx-auto p-6">
          <div className="space-y-6">
            {/* 核心预测决策卡片 - 新设计 */}
            <PredictionDecisionCard
              theme={theme}
              data={{
                target: getTimeRangeData().target,
                forecast: getTimeRangeData().forecast,
                completed: getTimeRangeData().completed,
                achievementRate: parseFloat(getAchievementRate()),
                gap: getGap(),
                trendDirection: getGap() < 0 ? 'up' : getGap() === 0 ? 'stable' : 'down',
                trendData: forecastTrendData
              }}
              onSupportFactorHover={(factor) => {
                console.log('支撑因子悬停:', factor);
              }}
              onRiskFactorHover={(risk) => {
                console.log('风险因子悬停:', risk);
              }}
            />

            {/* 未来支撑充分性面板 - Future Support Adequacy Panel */}
            <FutureSupportAdequacyPanel theme={theme} />

            {/* 风险预警面板 */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    风险预警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 项目风险 */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-sm">项目风险（30天无动作）</span>
                      </div>
                      <div className="space-y-2">
                        {riskData.projectRisks.map((risk) => (
                          <div
                            key={risk.projectId}
                            className={`${theme === 'dark' ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200'} border rounded p-2 text-xs`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{risk.projectName}</span>
                              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                                影响-{risk.impact}万
                              </Badge>
                            </div>
                            <div className="text-slate-700">
                              责任人: {risk.owner} · {risk.days}天无动作
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* 人员风险 */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-sm">人员风险（SOP不达标）</span>
                      </div>
                      <div className="space-y-2">
                        {riskData.personnelRisks.map((risk) => (
                          <div
                            key={risk.personId}
                            className={`${theme === 'dark' ? 'bg-orange-950/20 border-orange-500/30' : 'bg-orange-50 border-orange-200'} border rounded p-2 text-xs`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{risk.name}</span>
                              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                                SOP合规率 {risk.sopRate}%
                              </Badge>
                            </div>
                            <div className="text-slate-700">
                              影响预测-{Math.abs(risk.impact)}万 · 管辖{risk.projectCount}个项目
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
      </main>
    </div>
  );
}
