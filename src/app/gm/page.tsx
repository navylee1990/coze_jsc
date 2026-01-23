'use client';

import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Activity, Target, Clock, Database, ChevronRight, BarChart3, UserPlus, User, Play, ChevronLeft, X, Moon, Sun, Filter, Search, MoreVertical, ArrowRight, TrendingDown, Zap, Layers, DollarSign, Users, Shield, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PredictionDecisionCard from '@/components/PredictionDecisionCard';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';

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

// 目标支撑性雷达图数据
const radarData = {
  categories: ['在手项目量', '30天可转化金额', '人均储备', 'SOP健康度', '关键项目风险指数'],
  current: [85, 75, 90, 80, 70],
  target: [90, 85, 90, 90, 80]
};

// 项目储备金字塔数据
const pyramidData = {
  '30天': {
    count: 12,
    amount: 850,
    weightedAmount: 680
  },
  '1-3月': {
    count: 28,
    amount: 2400,
    weightedAmount: 1440
  },
  '3月以上': {
    count: 45,
    amount: 5200,
    weightedAmount: 2080
  }
};

// 模拟项目列表数据
const projectList = [
  { id: 1, name: '北京某医院净化项目', customer: '北京协和医院', stage: '方案阶段', amount: 280, weightedAmount: 168, expectedDate: '2026-02-15', sopStatus: '合规', score: 85, lastAction: '3天前', risk: 'medium' },
  { id: 2, name: '上海某学校净水项目', customer: '上海外国语学校', stage: '商务阶段', amount: 350, weightedAmount: 262.5, expectedDate: '2026-03-01', sopStatus: '合规', score: 88, lastAction: '5天前', risk: 'low' },
  { id: 3, name: '广州某企业办公楼项目', customer: '广州腾讯大厦', stage: '谈判阶段', amount: 450, weightedAmount: 405, expectedDate: '2026-03-10', sopStatus: '部分合规', score: 72, lastAction: '2天前', risk: 'high' },
  { id: 4, name: '深圳某酒店净化项目', customer: '深圳四季酒店', stage: '方案阶段', amount: 320, weightedAmount: 192, expectedDate: '2026-04-20', sopStatus: '合规', score: 82, lastAction: '7天前', risk: 'low' },
  { id: 5, name: '成都某商场净水项目', customer: '成都IFS国际金融中心', stage: '初步接触', amount: 280, weightedAmount: 84, expectedDate: '2026-05-15', sopStatus: '待跟进', score: 65, lastAction: '10天前', risk: 'medium' },
  { id: 6, name: '杭州某工厂净化项目', customer: '杭州阿里巴巴园区', stage: '商务阶段', amount: 380, weightedAmount: 285, expectedDate: '2026-02-28', sopStatus: '合规', score: 87, lastAction: '1天前', risk: 'low' },
  { id: 7, name: '南京某医院项目', customer: '南京鼓楼医院', stage: '谈判阶段', amount: 420, weightedAmount: 378, expectedDate: '2026-03-05', sopStatus: '合规', score: 90, lastAction: '4天前', risk: 'low' },
  { id: 8, name: '武汉某写字楼项目', customer: '武汉绿地中心', stage: '方案阶段', amount: 350, weightedAmount: 210, expectedDate: '2026-04-10', sopStatus: '部分合规', score: 75, lastAction: '6天前', risk: 'medium' },
  { id: 9, name: '西安某学校项目', customer: '西安交通大学', stage: '初步接触', amount: 280, weightedAmount: 84, expectedDate: '2026-06-01', sopStatus: '待跟进', score: 60, lastAction: '15天前', risk: 'high' },
  { id: 10, name: '天津某商场项目', customer: '天津天河城', stage: '商务阶段', amount: 320, weightedAmount: 240, expectedDate: '2026-03-20', sopStatus: '合规', score: 83, lastAction: '2天前', risk: 'low' },
];

// 人员贡献榜数据
const personContribution = [
  { id: 1, name: '张伟', currentMonth: 380, threeMonth: 1120, sopCompliance: 95, projectCount: 8, stagnantCount: 0, performance: 'excellent' },
  { id: 2, name: '李娜', currentMonth: 350, threeMonth: 1050, sopCompliance: 92, projectCount: 7, stagnantCount: 1, performance: 'excellent' },
  { id: 3, name: '王强', currentMonth: 320, threeMonth: 980, sopCompliance: 88, projectCount: 6, stagnantCount: 2, performance: 'good' },
  { id: 4, name: '刘芳', currentMonth: 280, threeMonth: 850, sopCompliance: 85, projectCount: 5, stagnantCount: 1, performance: 'good' },
  { id: 5, name: '陈明', currentMonth: 250, threeMonth: 720, sopCompliance: 78, projectCount: 4, stagnantCount: 3, performance: 'warning' },
  { id: 6, name: '赵敏', currentMonth: 220, threeMonth: 650, sopCompliance: 72, projectCount: 3, stagnantCount: 2, performance: 'warning' },
];

// 因果链数据 - 增强版，体现业务价值
type CausalChainNode = {
  stage: string;
  label: string;
  inputAmount: number;      // 输入金额（万元）
  outputAmount: number;     // 输出金额（万元）
  conversionRate: number;   // 转化率(%)
  targetRate: number;       // 目标转化率(%)
  loss: number;             // 损耗金额（万元）
  optimizationPotential: number; // 可优化空间（万元）
  isBottleneck: boolean;    // 是否瓶颈
  actionItems: string[];    // 行动建议
  history: {               // 历史数据
    lastMonth: { amount: number; rate: number };
    lastYear: { amount: number; rate: number };
  };
  detail: string;           // 详细说明
};

const causalChainData: CausalChainNode[] = [
  {
    stage: 'project_reserve',
    label: '项目储备',
    inputAmount: 8450,
    outputAmount: 8450,
    conversionRate: 100,
    targetRate: 100,
    loss: 0,
    optimizationPotential: 0,
    isBottleneck: false,
    actionItems: ['持续开拓新项目', '增加项目储备量'],
    history: { lastMonth: { amount: 8200, rate: 100 }, lastYear: { amount: 7500, rate: 100 } },
    detail: '73个项目在手，总储备金额8450万元，较上月增长3%'
  },
  {
    stage: 'sop_compliance',
    label: 'SOP合规',
    inputAmount: 8450,
    outputAmount: 6760,
    conversionRate: 80,
    targetRate: 90,
    loss: 1690,
    optimizationPotential: 845,
    isBottleneck: true,
    actionItems: ['加强SOP培训和执行监控', '每周检查SOP完成情况', '对不达标项目进行重点跟进'],
    history: { lastMonth: { amount: 7380, rate: 75 }, lastYear: { amount: 6375, rate: 85 } },
    detail: 'SOP合规率80%，距离目标90%还有差距，导致1690万被降权'
  },
  {
    stage: 'stage_weight',
    label: '阶段权重',
    inputAmount: 6760,
    outputAmount: 4732,
    conversionRate: 70,
    targetRate: 75,
    loss: 2028,
    optimizationPotential: 338,
    isBottleneck: true,
    actionItems: ['推动项目快速进入高权重阶段', '缩短方案和初步接触周期', '加强商务谈判支持'],
    history: { lastMonth: { amount: 4428, rate: 60 }, lastYear: { amount: 4475, rate: 70 } },
    detail: '平均阶段权重0.7，项目主要集中在低权重阶段，流失2028万'
  },
  {
    stage: 'conversion_rate',
    label: '成交转化',
    inputAmount: 4732,
    outputAmount: 2130,
    conversionRate: 45,
    targetRate: 50,
    loss: 2602,
    optimizationPotential: 237,
    isBottleneck: true,
    actionItems: ['提升销售人员成交技巧', '优化报价策略', '加强竞争对手分析'],
    history: { lastMonth: { amount: 1845, rate: 40 }, lastYear: { amount: 2010, rate: 45 } },
    detail: '历史成交率45%，较上月提升5个百分点，仍有提升空间'
  },
  {
    stage: 'forecast_vs_target',
    label: '预测达标',
    inputAmount: 2130,
    outputAmount: 2130,
    conversionRate: 142,
    targetRate: 100,
    loss: 0,
    optimizationPotential: 0,
    isBottleneck: false,
    actionItems: ['继续保持当前策略', '确保预测准确度'],
    history: { lastMonth: { amount: 1845, rate: 123 }, lastYear: { amount: 1590, rate: 106 } },
    detail: '预测完成2130万，目标1500万，超额完成42%'
  }
];

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

// 预测逻辑说明
const forecastLogic = {
  conversionRate: {
    source: '历史成交率统计',
    rate: '45%',
    description: '基于近12个月同类项目的实际成交数据计算'
  },
  weightedLogic: {
    method: '加权成交额 = 项目金额 × 阶段权重 × SOP修正系数',
    example: '500万 × 0.8(商务) × 0.9(合规) = 360万'
  },
  sopCorrection: {
    algorithm: 'SOP修正系数基于项目合规程度动态调整',
    levels: [
      { level: '合规', coefficient: 1.0, description: '所有SOP动作均已完成' },
      { level: '部分合规', coefficient: 0.8, description: '完成60%以上SOP动作' },
      { level: '待跟进', coefficient: 0.5, description: '完成不足60% S​​OP动作' }
    ]
  }
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
  const [selectedView, setSelectedView] = useState<'overview' | 'projects' | 'personnel' | 'logic'>('overview');
  const [selectedProject, setSelectedProject] = useState<typeof projectList[0] | null>(null);
  const [selectedNode, setSelectedNode] = useState<typeof causalChainData[0] | null>(null);

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

  // 渲染雷达图颜色
  const getRadarColor = (index: number) => {
    const value = radarData.current[index];
    if (value >= 85) return '#22c55e'; // 绿色
    if (value >= 70) return '#eab308'; // 黄色
    return '#ef4444'; // 红色
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
                <User className="w-4 h-4 mr-1" />
                张晖
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 视图切换标签 */}
      <div className={`${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} border-b`}>
        <div className="max-w-[1920px] mx-auto px-6">
          <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)} className="w-full">
            <TabsList className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'} border inline-flex rounded-lg p-1`}>
              <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                首页总览
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Database className="w-4 h-4 mr-2" />
                项目分析
              </TabsTrigger>
              <TabsTrigger value="personnel" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                人员贡献
              </TabsTrigger>
              <TabsTrigger value="logic" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Info className="w-4 h-4 mr-2" />
                预测逻辑
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 主要内容区 */}
      <main className="max-w-[1920px] mx-auto p-6">
        {selectedView === 'overview' && (
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
              onActionClick={(action) => {
                if (action.link) {
                  if (action.link === '/gm/projects') {
                    setSelectedView('projects');
                  } else if (action.link === '/gm/personnel') {
                    setSelectedView('personnel');
                  }
                }
              }}
              onSupportFactorHover={(factor) => {
                console.log('支撑因子悬停:', factor);
              }}
              onRiskFactorHover={(risk) => {
                console.log('风险因子悬停:', risk);
              }}
            />

            {/* 完整版核心预测总览 - 可展开查看 */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    核心预测总览
                  </span>
                  <Badge variant="outline" className="text-xs">
                    预测达成率: {getAchievementRate()}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-6">
                  {/* 预测趋势图 */}
                  <div className="col-span-8">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="month" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                          <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                              borderRadius: '8px',
                              color: theme === 'dark' ? '#ffffff' : '#0f172a'
                            }}
                          />
                          <Legend />
                          <Line
                            dataKey="target"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            name="目标"
                            strokeDasharray="5 5"
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="预测"
                            dot={{ fill: '#3b82f6' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="completed"
                            stroke="#64748b"
                            strokeWidth={2}
                            name="历史"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 关键指标 */}
                  <div className="col-span-4 space-y-4">
                    <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-4`}>
                      <div className="text-sm text-slate-700 mb-1">本月预测</div>
                      <div className="text-3xl font-bold text-blue-500">{getTimeRangeData().forecast.toLocaleString()}</div>
                      <div className="text-xs text-slate-600 mt-1">目标: {getTimeRangeData().target.toLocaleString()}万</div>
                    </div>

                    <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-4`}>
                      <div className="text-sm text-slate-700 mb-1">1-3月预测</div>
                      <div className="text-3xl font-bold text-green-500">{forecastOverviewData.threeMonth.forecast.toLocaleString()}</div>
                      <div className="text-xs text-slate-600 mt-1">目标: {forecastOverviewData.threeMonth.target.toLocaleString()}万</div>
                    </div>

                    <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-4`}>
                      <div className="text-sm text-slate-700 mb-1">3-6月预测</div>
                      <div className="text-3xl font-bold text-purple-500">{forecastOverviewData.sixMonth.forecast.toLocaleString()}</div>
                      <div className="text-xs text-slate-600 mt-1">目标: {forecastOverviewData.sixMonth.target.toLocaleString()}万</div>
                    </div>

                    <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                      <div className="text-xs text-slate-700 mb-2">模型权重来源</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          成交率
                        </span>
                        <span className="font-semibold">70%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-blue-500" />
                          SOP修正
                        </span>
                        <span className="font-semibold">30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 中间区域：目标支撑雷达图 + 项目储备金字塔 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 目标支撑性雷达图 */}
              <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    目标支撑性分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData.categories.map((cat, i) => ({
                        subject: cat,
                        current: radarData.current[i],
                        target: radarData.target[i],
                        fullMark: 100
                      }))}>
                        <PolarGrid stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <PolarAngleAxis dataKey="subject" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                        <Radar
                          name="当前"
                          dataKey="current"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        >
                          {radarData.current.map((_, index) => (
                            <Cell key={index} fill={getRadarColor(index)} />
                          ))}
                        </Radar>
                        <Radar
                          name="目标"
                          dataKey="target"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            color: theme === 'dark' ? '#ffffff' : '#0f172a'
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 项目储备金字塔 */}
              <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-500" />
                    项目储备金字塔（时间维度）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 30天池 */}
                    <div
                      className={`${theme === 'dark' ? 'bg-gradient-to-r from-green-600/20 to-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border rounded-lg p-4 cursor-pointer hover:border-green-500 transition-colors`}
                      onClick={() => setSelectedView('projects')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">30天转化池</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                          高优先级
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-700">项目数</div>
                          <div className="text-xl font-bold text-green-600">{pyramidData['30天'].count}个</div>
                        </div>
                        <div>
                          <div className="text-slate-700">金额</div>
                          <div className="text-xl font-bold">{pyramidData['30天'].amount}万</div>
                        </div>
                        <div>
                          <div className="text-slate-700">加权成交</div>
                          <div className="text-xl font-bold text-blue-600">{pyramidData['30天'].weightedAmount}万</div>
                        </div>
                      </div>
                    </div>

                    {/* 1-3月池 */}
                    <div
                      className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors`}
                      onClick={() => setSelectedView('projects')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold">1-3月储备池</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                          中优先级
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-700">项目数</div>
                          <div className="text-xl font-bold text-blue-600">{pyramidData['1-3月'].count}个</div>
                        </div>
                        <div>
                          <div className="text-slate-700">金额</div>
                          <div className="text-xl font-bold">{pyramidData['1-3月'].amount}万</div>
                        </div>
                        <div>
                          <div className="text-slate-700">加权成交</div>
                          <div className="text-xl font-bold text-blue-600">{pyramidData['1-3月'].weightedAmount}万</div>
                        </div>
                      </div>
                    </div>

                    {/* 3月以上池 */}
                    <div
                      className={`${theme === 'dark' ? 'bg-gradient-to-r from-purple-600/20 to-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-colors`}
                      onClick={() => setSelectedView('projects')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold">3月以上长期池</span>
                        </div>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                          低优先级
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-700">项目数</div>
                          <div className="text-xl font-bold text-purple-600">{pyramidData['3月以上'].count}个</div>
                        </div>
                        <div>
                          <div className="text-slate-700">金额</div>
                          <div className="text-xl font-bold">{pyramidData['3月以上'].amount}万</div>
                        </div>
                        <div>
                          <div className="text-slate-700">加权成交</div>
                          <div className="text-xl font-bold text-purple-600">{pyramidData['3月以上'].weightedAmount}万</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 底部区域：因果链 + 风险面板 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 因果链展示 - 增强版 */}
              <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-orange-500" />
                      预测因果链分析
                    </span>
                    <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30">
                      共3个瓶颈环节
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {causalChainData.map((node, index) => (
                      <div key={node.stage} className="flex items-center gap-3">
                        {/* 节点卡片 */}
                        <div
                          className={`flex-1 ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} ${node.isBottleneck ? 'ring-2 ring-red-500/50' : ''} border ${node.isBottleneck ? 'border-red-500/30' : 'border-slate-300'} rounded-lg p-3 cursor-pointer transition-all hover:shadow-md`}
                          onClick={() => setSelectedNode(node)}
                        >
                          {/* 标题和瓶颈标识 */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{node.label}</span>
                              {node.isBottleneck && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  <AlertTriangle className="w-3 h-3 mr-0.5" />
                                  瓶颈
                                </Badge>
                              )}
                            </div>
                            {index < causalChainData.length - 1 && (
                              <ArrowRight className={`w-4 h-4 text-slate-600`} />
                            )}
                          </div>

                          {/* 核心指标 */}
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <div className="text-xs text-slate-700">输出金额</div>
                              <div className={`text-base font-bold ${node.outputAmount > 0 ? 'text-blue-600' : 'text-slate-600'}`}>
                                {node.outputAmount.toLocaleString()}万
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-700">转化率</div>
                              <div className={`text-base font-bold ${node.conversionRate < node.targetRate ? 'text-red-500' : 'text-green-600'}`}>
                                {node.conversionRate}%
                                {node.targetRate > 0 && <span className="text-xs text-slate-700"> / 目标{node.targetRate}%</span>}
                              </div>
                            </div>
                          </div>

                          {/* 损耗和优化空间 */}
                          {node.loss > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs">
                                <span className="text-slate-700">损耗: </span>
                                <span className="text-red-500 font-semibold">{node.loss}万</span>
                              </div>
                              {node.optimizationPotential > 0 && (
                                <div className="text-xs">
                                  <span className="text-slate-700">可优化: </span>
                                  <span className="text-green-600 font-semibold">+{node.optimizationPotential}万</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 转化率进度条 */}
                          <div className="mt-2">
                            <Progress
                              value={node.conversionRate}
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 总体分析 */}
                  <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-600/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'} border`}>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      关键洞察
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">•</span>
                        <span>
                          <span className="font-semibold">SOP合规环节</span>是最大瓶颈，转化率80%距离目标90%，可优化空间845万
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">•</span>
                        <span>
                          <span className="font-semibold">阶段权重</span>和<span className="font-semibold">成交转化</span>也需改善，合计损失4630万
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">•</span>
                        <span>
                          总计<span className="text-orange-600 font-semibold">可优化空间1420万</span>，建议优先改善SOP合规率
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 选中节点详情 */}
                  {selectedNode && (
                    <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
                      <DialogContent className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} max-w-2xl`}>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {selectedNode.isBottleneck && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-0.5" />
                                瓶颈环节
                              </Badge>
                            )}
                            {selectedNode.label} - 详细分析
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* 核心数据 */}
                          <div className="grid grid-cols-4 gap-3">
                            <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3 text-center`}>
                              <div className="text-xs text-slate-700 mb-1">输入金额</div>
                              <div className="text-lg font-bold">{selectedNode.inputAmount.toLocaleString()}万</div>
                            </div>
                            <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3 text-center`}>
                              <div className="text-xs text-slate-700 mb-1">输出金额</div>
                              <div className="text-lg font-bold text-blue-600">{selectedNode.outputAmount.toLocaleString()}万</div>
                            </div>
                            <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3 text-center`}>
                              <div className="text-xs text-slate-700 mb-1">当前转化率</div>
                              <div className={`text-lg font-bold ${selectedNode.conversionRate < selectedNode.targetRate ? 'text-red-500' : 'text-green-600'}`}>
                                {selectedNode.conversionRate}%
                              </div>
                            </div>
                            <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3 text-center`}>
                              <div className="text-xs text-slate-700 mb-1">目标转化率</div>
                              <div className="text-lg font-bold text-green-600">{selectedNode.targetRate}%</div>
                            </div>
                          </div>

                          {/* 损耗和优化空间 */}
                          {selectedNode.loss > 0 && (
                            <div className={`grid grid-cols-2 gap-3 ${theme === 'dark' ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
                              <div>
                                <div className="text-sm text-slate-700 mb-1">损耗金额</div>
                                <div className="text-2xl font-bold text-red-500">{selectedNode.loss.toLocaleString()}万</div>
                              </div>
                              {selectedNode.optimizationPotential > 0 && (
                                <div>
                                  <div className="text-sm text-slate-700 mb-1">可优化空间</div>
                                  <div className="text-2xl font-bold text-green-600">+{selectedNode.optimizationPotential.toLocaleString()}万</div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 历史对比 */}
                          <div>
                            <div className="text-sm font-semibold mb-2">历史趋势</div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3`}>
                                <div className="text-xs text-slate-700 mb-1">上月数据</div>
                                <div className="text-sm">
                                  <span className="font-semibold">{selectedNode.history.lastMonth.amount.toLocaleString()}万</span>
                                  <span className="text-slate-700 ml-1">({selectedNode.history.lastMonth.rate}%)</span>
                                </div>
                                <div className="text-xs mt-1">
                                  {selectedNode.outputAmount > selectedNode.history.lastMonth.amount ? (
                                    <span className="text-green-600">↑ 增长{((selectedNode.outputAmount - selectedNode.history.lastMonth.amount) / selectedNode.history.lastMonth.amount * 100).toFixed(1)}%</span>
                                  ) : (
                                    <span className="text-red-500">↓ 下降{((selectedNode.history.lastMonth.amount - selectedNode.outputAmount) / selectedNode.history.lastMonth.amount * 100).toFixed(1)}%</span>
                                  )}
                                </div>
                              </div>
                              <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3`}>
                                <div className="text-xs text-slate-700 mb-1">去年同期</div>
                                <div className="text-sm">
                                  <span className="font-semibold">{selectedNode.history.lastYear.amount.toLocaleString()}万</span>
                                  <span className="text-slate-700 ml-1">({selectedNode.history.lastYear.rate}%)</span>
                                </div>
                                <div className="text-xs mt-1">
                                  {selectedNode.outputAmount > selectedNode.history.lastYear.amount ? (
                                    <span className="text-green-600">↑ 增长{((selectedNode.outputAmount - selectedNode.history.lastYear.amount) / selectedNode.history.lastYear.amount * 100).toFixed(1)}%</span>
                                  ) : (
                                    <span className="text-red-500">↓ 下降{((selectedNode.history.lastYear.amount - selectedNode.outputAmount) / selectedNode.history.lastYear.amount * 100).toFixed(1)}%</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 行动建议 */}
                          <div>
                            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-500" />
                              行动建议
                            </div>
                            <div className="space-y-2">
                              {selectedNode.actionItems.map((item, i) => (
                                <div key={i} className={`flex items-start gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${selectedNode.isBottleneck ? 'bg-red-500' : 'bg-blue-500'}`} />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 详细说明 */}
                          <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-3`}>
                            <div className="text-xs text-slate-700 mb-1">详细说明</div>
                            <div className="text-sm">{selectedNode.detail}</div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>

              {/* 风险面板 */}
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
          </div>
        )}

        {/* 项目分析视图 */}
        {selectedView === 'projects' && (
          <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  项目储备列表
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    筛选
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    搜索
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} border-b`}>
                      <th className="text-left py-3 px-4 font-semibold">项目名称</th>
                      <th className="text-left py-3 px-4 font-semibold">客户</th>
                      <th className="text-left py-3 px-4 font-semibold">阶段</th>
                      <th className="text-right py-3 px-4 font-semibold">金额(万)</th>
                      <th className="text-right py-3 px-4 font-semibold">加权成交(万)</th>
                      <th className="text-left py-3 px-4 font-semibold">预计签约时间</th>
                      <th className="text-left py-3 px-4 font-semibold">SOP状态</th>
                      <th className="text-center py-3 px-4 font-semibold">模型评分</th>
                      <th className="text-left py-3 px-4 font-semibold">最后动作</th>
                      <th className="text-center py-3 px-4 font-semibold">风险</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectList.map((project) => (
                      <tr
                        key={project.id}
                        className={`${theme === 'dark' ? 'hover:bg-slate-800/50 border-slate-800' : 'hover:bg-slate-50 border-slate-200'} border-b cursor-pointer transition-colors`}
                        onClick={() => setSelectedProject(project)}
                      >
                        <td className="py-3 px-4 font-medium">{project.name}</td>
                        <td className="py-3 px-4 text-slate-700">{project.customer}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {project.stage}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">{project.amount}</td>
                        <td className="py-3 px-4 text-right text-blue-600 font-semibold">{project.weightedAmount}</td>
                        <td className="py-3 px-4 text-slate-700">{project.expectedDate}</td>
                        <td className="py-3 px-4">
                          <Badge variant={project.sopStatus === '合规' ? 'default' : 'outline'} className={`text-xs ${project.sopStatus === '合规' ? 'bg-green-600' : ''}`}>
                            {project.sopStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                            project.score >= 80 ? 'bg-green-100 text-green-700' :
                            project.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {project.score}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{project.lastAction}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={`text-xs ${
                            project.risk === 'high' ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                            project.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
                            'bg-green-500/10 text-green-600 border-green-500/30'
                          }`}>
                            {project.risk === 'high' ? '高' : project.risk === 'medium' ? '中' : '低'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 人员贡献视图 */}
        {selectedView === 'personnel' && (
          <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                人员贡献榜
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} border-b`}>
                      <th className="text-left py-3 px-4 font-semibold">排名</th>
                      <th className="text-left py-3 px-4 font-semibold">销售姓名</th>
                      <th className="text-right py-3 px-4 font-semibold">本月预测(万)</th>
                      <th className="text-right py-3 px-4 font-semibold">1-3月预测(万)</th>
                      <th className="text-right py-3 px-4 font-semibold">SOP合规率</th>
                      <th className="text-center py-3 px-4 font-semibold">在手项目数</th>
                      <th className="text-center py-3 px-4 font-semibold">停滞项目数</th>
                      <th className="text-center py-3 px-4 font-semibold">表现</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personContribution.map((person) => (
                      <tr
                        key={person.id}
                        className={`${theme === 'dark' ? 'hover:bg-slate-800/50 border-slate-800' : 'hover:bg-slate-50 border-slate-200'} border-b transition-colors`}
                      >
                        <td className="py-3 px-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            person.performance === 'excellent' ? 'bg-green-500 text-white' :
                            person.performance === 'good' ? 'bg-blue-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {person.id}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-600" />
                          {person.name}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">{person.currentMonth}</td>
                        <td className="py-3 px-4 text-right text-blue-600 font-semibold">{person.threeMonth}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={person.sopCompliance} className="w-16" />
                            <span className="text-xs text-slate-700">{person.sopCompliance}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">{person.projectCount}</td>
                        <td className="py-3 px-4 text-center">
                          {person.stagnantCount > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                              {person.stagnantCount}
                            </Badge>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={`text-xs ${
                            person.performance === 'excellent' ? 'bg-green-500/10 text-green-600 border-green-500/30' :
                            person.performance === 'good' ? 'bg-blue-500/10 text-blue-600 border-blue-500/30' :
                            'bg-red-500/10 text-red-600 border-red-500/30'
                          }`}>
                            {person.performance === 'excellent' ? '优秀' :
                             person.performance === 'good' ? '良好' : '需改进'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 预测逻辑视图 */}
        {selectedView === 'logic' && (
          <div className="space-y-6">
            {/* 成交率来源 */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  成交率来源
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-4`}>
                    <div className="text-sm text-slate-700 mb-2">数据来源</div>
                    <div className="text-lg font-semibold">{forecastLogic.conversionRate.source}</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-4`}>
                    <div className="text-sm text-slate-700 mb-2">基准成交率</div>
                    <div className="text-2xl font-bold text-blue-600">{forecastLogic.conversionRate.rate}</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-4`}>
                    <div className="text-sm text-slate-700 mb-2">计算逻辑</div>
                    <div className="text-sm text-slate-600">{forecastLogic.conversionRate.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 加权逻辑 */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  加权逻辑说明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-6`}>
                  <div className="text-lg font-semibold mb-4">计算公式</div>
                  <div className="text-2xl font-bold text-blue-600 mb-6 font-mono">
                    {forecastLogic.weightedLogic.method}
                  </div>
                  <div className="text-sm text-slate-700 mb-2">示例计算</div>
                  <div className="text-lg font-mono bg-slate-900 text-green-400 p-4 rounded-lg inline-block">
                    {forecastLogic.weightedLogic.example}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SOP修正算法 */}
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  SOP修正算法
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-700 mb-4">{forecastLogic.sopCorrection.algorithm}</div>
                <div className="space-y-3">
                  {forecastLogic.sopCorrection.levels.map((level, index) => (
                    <div
                      key={index}
                      className={`${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-lg p-4`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={`text-sm ${
                          level.level === '合规' ? 'bg-green-500/10 text-green-600 border-green-500/30' :
                          level.level === '部分合规' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
                          'bg-red-500/10 text-red-600 border-red-500/30'
                        }`}>
                          {level.level}
                        </Badge>
                        <div className={`text-2xl font-bold ${
                          level.coefficient === 1.0 ? 'text-green-600' :
                          level.coefficient === 0.8 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {level.coefficient}
                        </div>
                      </div>
                      <div className="text-xs text-slate-700">{level.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* 项目详情弹窗 */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} max-w-2xl`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              项目详情
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-700 mb-1">项目名称</div>
                  <div className="font-semibold">{selectedProject.name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">客户</div>
                  <div className="font-semibold">{selectedProject.customer}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">阶段</div>
                  <Badge variant="outline">{selectedProject.stage}</Badge>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">预计签约时间</div>
                  <div className="font-semibold">{selectedProject.expectedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">项目金额</div>
                  <div className="font-semibold">{selectedProject.amount}万</div>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">加权成交额</div>
                  <div className="font-semibold text-blue-600">{selectedProject.weightedAmount}万</div>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">SOP状态</div>
                  <Badge variant={selectedProject.sopStatus === '合规' ? 'default' : 'outline'} className={selectedProject.sopStatus === '合规' ? 'bg-green-600' : ''}>
                    {selectedProject.sopStatus}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">模型评分</div>
                  <div className="font-semibold">{selectedProject.score}分</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-700 mb-1">风险等级</div>
                  <Badge variant="outline" className={`${
                    selectedProject.risk === 'high' ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                    selectedProject.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
                    'bg-green-500/10 text-green-600 border-green-500/30'
                  }`}>
                    {selectedProject.risk === 'high' ? '高风险' : selectedProject.risk === 'medium' ? '中风险' : '低风险'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-slate-700 mb-1">最后动作</div>
                  <div className="font-semibold">{selectedProject.lastAction}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
