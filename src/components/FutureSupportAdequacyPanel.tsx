'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowRight, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Activity, Clock, Target, DollarSign, Zap, Flame, Lightbulb, Compass, BarChart3, ChevronDown, MapPin, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import DrillDownModal from '@/components/DrillDownModal';

// 主题类型
type Theme = 'dark' | 'dashboard';

// 区域类型
type Region = 'national' | 'north' | 'east' | 'south' | 'southwest' | 'northwest';

// 支撑层级数据
interface SupportLevel {
  period: string; // '0-30天' | '1-3月' | '3-6月'
  label: string;
  amount: number;
  coverage: number; // 覆盖度百分比
  status: 'green' | 'yellow' | 'red';
  target: number;
  gap: number;
  projects: {
    id: number;
    name: string; // 项目名称
    amount: number; // 订单金额
    region?: string; // 大区
    salesEngineer?: string; // 销售工程师
    cityManager?: string; // 城市经理
    projectType?: string; // 项目类型（买断/租赁/服务）
    projectPhase?: string; // 项目阶段（默认：项目采购）
    probability: 'high' | 'medium' | 'low';
    health: 'high' | 'medium' | 'low';
    isOnTrack: boolean;
    delayDays?: number;
    isNew?: boolean;
    isDelayed?: boolean;
    isRisk?: boolean;
    detail?: string; // 明细
    owner?: string; // 责任人
    salesperson?: string; // 业务员
    riskDetail?: string; // 项目风险详情
    expectedOrderDate?: string; // 预计下单时间
    completionTime?: string; // 完成时间
    projectStatus?: string; // 项目状态
    changeAmount?: number; // 变化金额
    changeDate?: string; // 变化时间
    remark?: string; // 备注
  }[];
  excludedProjects?: {
    id: number;
    name: string; // 项目名称
    amount: number; // 订单金额
    excludeReason: 'progress_low' | 'delayed' | 'pending_approval' | 'risk_high' | 'not_confirmed';
    excludeReasonText: string; // 未统计原因
    currentProgress: number;
    expectedProgress: number;
    probability: 'high' | 'medium' | 'low';
    region?: string; // 大区
    salesEngineer?: string; // 销售工程师
    cityManager?: string; // 城市经理
    projectType?: string; // 项目类型
    projectPhase?: string; // 项目阶段（默认：项目采购）
    detail?: string; // 明细
    owner?: string; // 责任人
    salesperson?: string; // 业务员
    riskDetail?: string; // 项目风险详情
    expectedOrderDate?: string; // 预计下单时间
    completionTime?: string; // 完成时间
    projectStatus?: string; // 项目状态
    changeAmount?: number; // 变化金额
    changeDate?: string; // 变化时间
    remark?: string; // 备注
  }[];
  reserveProjects?: {
    id: number;
    name: string; // 项目名称
    amount: number; // 订单金额
    probability: 'high' | 'medium' | 'low';
    region?: string; // 大区
    salesEngineer?: string; // 销售工程师
    cityManager?: string; // 城市经理
    projectType?: string; // 项目类型
    projectPhase?: string; // 项目阶段（默认：项目采购）
    detail?: string; // 明细
    owner?: string; // 责任人
    salesperson?: string; // 业务员
    expectedOrderDate?: string; // 预计下单时间
    completionTime?: string; // 完成时间
    projectStatus?: string; // 项目状态
    changeAmount?: number; // 变化金额
    changeDate?: string; // 变化时间
    remark?: string; // 备注
  }[];
}

// 诊断问题数据
interface DiagnosticIssue {
  id: string;
  type: 'project_delay' | 'reserve_shortage' | 'channel_decline';
  name: string;
  impact: number;
  reason: string;
  riskLevel: 'red' | 'orange' | 'yellow';
}

// 时间线节点数据
interface TimelineNode {
  period: string;
  label: string;
  projects: {
    name: string;
    amount: number;
    probability: 'high' | 'medium' | 'low';
    isNew?: boolean;
    isDelayed?: boolean;
    isRisk?: boolean;
  }[];
  totalAmount: number;
}

// 行动建议数据
interface ActionRecommendation {
  id: string;
  type: 'urgent' | 'supplement' | 'channel' | 'sop';
  priority: number; // 1-4，1最高
  title: string;
  description: string;
  impact: string; // 如 '+310 万'
  owner?: string;
  deadline?: string;
}

// 未来支撑充分性面板数据
interface FutureSupportAdequacyData {
  coreMetrics: {
    coverage: number; // 未来90天支撑覆盖度
    coverageStatus: 'green' | 'yellow' | 'red';
    targetAmount: number;
    supportAmount: number;
    gap: number;
    trend: 'up' | 'stable' | 'down';
    trendValue: number; // 趋势百分比
  };
  supportStructure: {
    '本月': SupportLevel;
    '本季度': SupportLevel;
    '半年度': SupportLevel;
  };
  diagnosticIssues: DiagnosticIssue[];
  timeline: TimelineNode[];
  actions: ActionRecommendation[];
}

// 区域数据
interface RegionData {
  [key: string]: FutureSupportAdequacyData;
}

// 区域配置
const regionConfig: Record<Region, { label: string; color: string }> = {
  national: { label: '全国总览', color: '#3b82f6' },
  north: { label: '华北区', color: '#22c55e' },
  east: { label: '华东区', color: '#f59e0b' },
  south: { label: '华南区', color: '#ef4444' },
  southwest: { label: '西南区', color: '#8b5cf6' },
  northwest: { label: '西北区', color: '#06b6d4' }
};

// 时间段配置
const periodConfig: Record<string, { label: string; color: string }> = {
  '本月': { label: '核心支撑期', color: '#ef4444' },
  '本季度': { label: '中期支撑期', color: '#f59e0b' },
  '半年度': { label: '储备支撑期', color: '#22c55e' }
};

// 区域默认数据
const regionData: RegionData = {
  national: {
  coreMetrics: {
    coverage: 78,
    coverageStatus: 'red',
    targetAmount: 1500,
    supportAmount: 1170,
    gap: 330,
    trend: 'down',
    trendValue: -5.2
  },
  supportStructure: {
    '本月': {
      period: '本月',
      label: '核心支撑期',
      amount: 123.4, // 已统计项目总和
      coverage: 94.9, // 123.4/130
      status: 'green',
      target: 130,
      gap: -6.6, // 实际上超出了
      projects: [
        {
          id: 1,
          name: '高邮市外国语学校行政楼【办公饮水】',
          amount: 39.9772,
          probability: 'high',
          health: 'high',
          isOnTrack: true,
          detail: '行政楼办公饮水设备',
          region: '一区',
          salesEngineer: '朱若愚',
          cityManager: '卢继栋',
          projectType: '买断',
          expectedOrderDate: '2026/1/4',
          projectStatus: '已下单',
          changeAmount: 39.9772,
          changeDate: '1.19更新'
        },
        {
          id: 2,
          name: '国网江苏扬州供电公司（协调1231303）',
          amount: 40.01375,
          probability: 'high',
          health: 'high',
          isOnTrack: true,
          detail: '供电公司净水设备',
          region: '一区',
          salesEngineer: '朱若愚',
          cityManager: '卢继栋',
          projectType: '买断',
          expectedOrderDate: '2026/1/4',
          projectStatus: '已下单',
          changeAmount: 40.01375,
          changeDate: '1.19更新'
        },
        {
          id: 3,
          name: '江苏省地质矿产局第六地质大队【办公饮水(含咖啡机)】',
          amount: 0.9104,
          probability: 'high',
          health: 'high',
          isOnTrack: true,
          detail: '办公饮水设备含咖啡机',
          region: '一区',
          salesEngineer: '杨锦宇',
          cityManager: '卢继栋',
          projectType: '买断',
          expectedOrderDate: '2026/1/4',
          projectStatus: '已下单',
          changeAmount: 0.9104,
          changeDate: '1.19更新'
        },
        {
          id: 4,
          name: '南通能达伊顿国际幼儿园【办公饮水】',
          amount: 0.06472,
          probability: 'high',
          health: 'high',
          isOnTrack: true,
          detail: '幼儿园办公饮水设备',
          region: '一区',
          salesEngineer: '单帅',
          cityManager: '卢继栋',
          projectType: '买断',
          expectedOrderDate: '2026/1/4',
          projectStatus: '已下单',
          changeAmount: 0.06472,
          changeDate: '1.19更新'
        },
        {
          id: 5,
          name: '宿迁东方雨虹建筑材料有限公司【办公饮水】',
          amount: 16.515,
          probability: 'high',
          health: 'high',
          isOnTrack: true,
          detail: '建筑材料公司办公饮水',
          region: '一区',
          salesEngineer: '施露景',
          cityManager: '卢继栋',
          projectType: '买断',
          expectedOrderDate: '2026/1/4',
          projectStatus: '已下单',
          changeAmount: 16.515,
          changeDate: '1.19更新'
        },
        {
          id: 6,
          name: '希彼埃姆机械(南通)有限公司',
          amount: 0.4092,
          probability: 'medium',
          health: 'high',
          isOnTrack: true,
          detail: '机械公司净水设备',
          region: '一区',
          salesEngineer: '单帅',
          cityManager: '卢继栋',
          projectType: '买断',
          expectedOrderDate: '2026/1/4',
          projectStatus: '已下单',
          changeAmount: 0.4092,
          changeDate: '1.19更新'
        },
        {
          id: 7,
          name: '扬州万达广场租赁项目',
          amount: 25.5,
          probability: 'medium',
          health: 'medium',
          isOnTrack: false,
          delayDays: 3,
          detail: '商业广场租赁服务',
          region: '一区',
          salesEngineer: '张伟',
          cityManager: '卢继栋',
          projectType: '租赁',
          expectedOrderDate: '2026/1/15',
          projectStatus: '未下单',
          changeAmount: 0,
          changeDate: ''
        }
      ],
      excludedProjects: [
        {
          id: 101,
          name: '天津天河城净水项目',
          amount: 100,
          excludeReason: 'progress_low',
          excludeReasonText: '项目进度滞后，仅完成35%进度',
          currentProgress: 35,
          expectedProgress: 80,
          probability: 'high',
          detail: '商业综合体净水系统',
          region: '华北区',
          owner: '张伟',
          salesperson: '李明',
          riskDetail: '进度严重滞后',
          completionTime: '2025-04-01',
          projectStatus: '推进中'
        },
        {
          id: 102,
          name: '广州白云机场航站楼项目',
          amount: 80,
          excludeReason: 'pending_approval',
          excludeReasonText: '商务合同待审批，预计下周完成',
          currentProgress: 60,
          expectedProgress: 70,
          probability: 'high',
          detail: '机场航站楼净化系统',
          region: '华南区',
          owner: '陈明',
          salesperson: '赵敏',
          riskDetail: '审批流程较长',
          completionTime: '2025-04-15',
          projectStatus: '待审批'
        },
        {
          id: 103,
          name: '北京大兴国际机场配套项目',
          amount: 60,
          excludeReason: 'delayed',
          excludeReasonText: '客户决策延迟，商务谈判暂停',
          currentProgress: 40,
          expectedProgress: 60,
          probability: 'medium',
          detail: '机场配套设施净化系统',
          region: '华北区',
          owner: '张伟',
          salesperson: '李明',
          riskDetail: '客户决策延迟',
          completionTime: '2025-04-20',
          projectStatus: '暂停'
        },
        {
          id: 104,
          name: '上海浦东国际博览中心项目',
          amount: 40,
          excludeReason: 'risk_high',
          excludeReasonText: '项目风险较高，客户资金链紧张',
          currentProgress: 25,
          expectedProgress: 45,
          probability: 'low',
          detail: '展览中心净水设备',
          region: '华东区',
          owner: '王强',
          salesperson: '刘芳',
          riskDetail: '客户资金链紧张',
          completionTime: '2025-05-01',
          projectStatus: '风险'
        },
        {
          id: 105,
          name: '深圳前海自贸区综合项目',
          amount: 20,
          excludeReason: 'not_confirmed',
          excludeReasonText: '项目未最终确认，处于意向阶段',
          currentProgress: 15,
          expectedProgress: 30,
          probability: 'medium',
          detail: '自贸区综合项目净水系统',
          region: '华南区',
          owner: '孙丽',
          salesperson: '周杰',
          riskDetail: '项目未确认',
          completionTime: '2025-05-15',
          projectStatus: '意向'
        }
      ]
    },
    '本季度': {
      period: '本季度',
      label: '中期支撑期',
      amount: 450,
      coverage: 75,
      status: 'yellow',
      target: 600,
      gap: 150,
      projects: [
        {
          id: 3,
          name: '南京鼓楼医院项目',
          amount: 180,
          probability: 'medium',
          health: 'high',
          isOnTrack: true,
          detail: '医院净化系统采购',
          region: '华东区',
          owner: '王强',
          salesperson: '刘芳',
          riskDetail: '无风险',
          completionTime: '2025-04-10',
          projectStatus: '推进中'
        },
        {
          id: 4,
          name: '深圳四季酒店净化项目',
          amount: 140,
          probability: 'medium',
          health: 'medium',
          isOnTrack: true,
          detail: '酒店净化系统安装',
          region: '华南区',
          owner: '陈明',
          salesperson: '赵敏',
          riskDetail: '施工进度略慢',
          completionTime: '2025-04-25',
          projectStatus: '推进中'
        },
        {
          id: 5,
          name: '杭州阿里巴巴园区项目',
          amount: 130,
          probability: 'low',
          health: 'low',
          isOnTrack: false,
          delayDays: 8,
          detail: '企业园区净水设备',
          region: '华东区',
          owner: '王强',
          salesperson: '刘芳',
          riskDetail: '需求变更延迟',
          completionTime: '2025-05-01',
          projectStatus: '推进中'
        }
      ],
      excludedProjects: [
        {
          id: 103,
          name: '重庆环球金融中心项目',
          amount: 150,
          excludeReason: 'delayed',
          excludeReasonText: '客户决策延迟，商务谈判暂停',
          currentProgress: 40,
          expectedProgress: 60,
          probability: 'medium',
          detail: '商业中心净化系统',
          region: '西南区',
          owner: '孙丽',
          salesperson: '周杰',
          riskDetail: '客户决策延迟',
          completionTime: '2025-05-20',
          projectStatus: '暂停'
        }
      ]
    },
    '半年度': {
      period: '半年度',
      label: '储备支撑期',
      amount: 200,
      coverage: 100,
      status: 'green',
      target: 200,
      gap: 0,
      projects: [
        {
          id: 6,
          name: '武汉绿地中心项目',
          amount: 120,
          probability: 'low',
          health: 'low',
          isOnTrack: true,
          isNew: true,
          detail: '超高层建筑净化系统',
          region: '华南区',
          owner: '陈明',
          salesperson: '赵敏',
          riskDetail: '项目处于早期阶段',
          completionTime: '2025-07-01',
          projectStatus: '意向'
        },
        {
          id: 7,
          name: '西安交通大学项目',
          amount: 80,
          probability: 'low',
          health: 'low',
          isOnTrack: false,
          isRisk: true,
          detail: '校园净水系统',
          region: '西北区',
          owner: '吴刚',
          salesperson: '郑华',
          riskDetail: '预算审批流程较长',
          completionTime: '2025-08-15',
          projectStatus: '意向'
        }
      ],
      excludedProjects: []
    }
  },
  diagnosticIssues: [
    {
      id: '1',
      type: 'project_delay',
      name: '项目推进延迟',
      impact: -180,
      reason: '2个项目延迟超过10天，降低短期支撑',
      riskLevel: 'red'
    },
    {
      id: '2',
      type: 'reserve_shortage',
      name: '储备新增不足',
      impact: -90,
      reason: '本月新增储备项目仅2个，低于目标5个',
      riskLevel: 'orange'
    },
    {
      id: '3',
      type: 'channel_decline',
      name: '渠道贡献下滑',
      impact: -60,
      reason: '华北渠道近30天无新增项目',
      riskLevel: 'yellow'
    }
  ],
  timeline: [
    {
      period: 'Week 1',
      label: 'Week 1',
      projects: [
        { name: '北京协和医院净化项目', amount: 350, probability: 'high' },
        { name: '上海外国语学校净水项目', amount: 170, probability: 'medium', isDelayed: true }
      ],
      totalAmount: 520
    },
    {
      period: 'Week 2',
      label: 'Week 2',
      projects: [],
      totalAmount: 0
    },
    {
      period: 'Week 3',
      label: 'Week 3',
      projects: [],
      totalAmount: 0
    },
    {
      period: 'Week 4',
      label: 'Week 4',
      projects: [
        { name: '南京鼓楼医院项目', amount: 180, probability: 'medium' }
      ],
      totalAmount: 180
    },
    {
      period: '1-3 Month',
      label: '1-3 Month',
      projects: [
        { name: '深圳四季酒店净化项目', amount: 140, probability: 'medium' },
        { name: '杭州阿里巴巴园区项目', amount: 130, probability: 'low', isDelayed: true }
      ],
      totalAmount: 270
    },
    {
      period: '3-6 Month',
      label: '3-6 Month',
      projects: [
        { name: '武汉绿地中心项目', amount: 120, probability: 'low', isNew: true },
        { name: '西安交通大学项目', amount: 80, probability: 'low', isRisk: true }
      ],
      totalAmount: 200
    }
  ],
  actions: [
    {
      id: '1',
      type: 'urgent',
      priority: 1,
      title: '本月：推进延迟项目',
      description: '上海外国语学校、杭州阿里巴巴园区项目已延迟12天，优先推进可释放+310万支撑',
      impact: '+310 万',
      owner: '李娜、王强',
      deadline: '本周内'
    },
    {
      id: '2',
      type: 'supplement',
      priority: 2,
      title: '本月：开发新项目',
      description: '短期缺口480万，建议优先开拓医院、学校类项目（转化周期短、概率高）',
      impact: '+480 万',
      owner: '张伟',
      deadline: '30天内'
    },
    {
      id: '3',
      type: 'supplement',
      priority: 3,
      title: '1-3月：补齐中期储备',
      description: '中期缺口150万，需新增2个商务阶段项目（建议从现有线索中转化）',
      impact: '+150 万',
      owner: '刘芳',
      deadline: '15天内'
    },
    {
      id: '4',
      type: 'channel',
      priority: 4,
      title: '渠道激活计划',
      description: '华北渠道近30天无新增，本周需拜访≥5家渠道，目标新增项目4个',
      impact: '+200 万',
      owner: '刘芳',
      deadline: '本周内'
    }
  ]
  },
  // 华北区
  north: {
    coreMetrics: {
      coverage: 85,
      coverageStatus: 'yellow',
      targetAmount: 450,
      supportAmount: 382.5,
      gap: 67.5,
      trend: 'stable',
      trendValue: 0
    },
    supportStructure: {
      '本月': {
        period: '本月',
        label: '核心支撑期',
        amount: 180,
        coverage: 60,
        status: 'yellow',
        target: 300,
        gap: 120,
        projects: [
          {
            id: 1,
            name: '北京协和医院净化项目',
            amount: 120,
            probability: 'high',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 2,
            name: '天津天河城净水项目',
            amount: 60,
            probability: 'medium',
            health: 'medium',
            isOnTrack: true
          }
        ]
      },
      '本季度': {
        period: '本季度',
        label: '中期支撑期',
        amount: 120,
        coverage: 80,
        status: 'green',
        target: 150,
        gap: 30,
        projects: [
          {
            id: 3,
            name: '石家庄第一医院项目',
            amount: 80,
            probability: 'medium',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 4,
            name: '唐山五星级酒店净化项目',
            amount: 40,
            probability: 'low',
            health: 'medium',
            isOnTrack: true
          }
        ]
      },
      '半年度': {
        period: '半年度',
        label: '储备支撑期',
        amount: 82.5,
        coverage: 100,
        status: 'green',
        target: 82.5,
        gap: 0,
        projects: [
          {
            id: 5,
            name: '雄安新区管委会项目',
            amount: 50,
            probability: 'low',
            health: 'low',
            isOnTrack: true,
            isNew: true
          }
        ]
      }
    },
    diagnosticIssues: [
      {
        id: '1',
        type: 'reserve_shortage',
        name: '储备新增不足',
        impact: -45,
        reason: '本月新增储备项目仅1个，低于目标3个',
        riskLevel: 'orange'
      },
      {
        id: '2',
        type: 'channel_decline',
        name: '渠道贡献下滑',
        impact: -22.5,
        reason: '河北地区渠道近20天无新增项目',
        riskLevel: 'yellow'
      }
    ],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '北京协和医院净化项目', amount: 120, probability: 'high' }
        ],
        totalAmount: 120
      },
      {
        period: 'Week 2',
        label: 'Week 2',
        projects: [
          { name: '天津天河城净水项目', amount: 60, probability: 'medium' }
        ],
        totalAmount: 60
      },
      {
        period: 'Week 3',
        label: 'Week 3',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 4',
        label: 'Week 4',
        projects: [],
        totalAmount: 0
      },
      {
        period: '1-3 Month',
        label: '1-3 Month',
        projects: [
          { name: '石家庄第一医院项目', amount: 80, probability: 'medium' },
          { name: '唐山五星级酒店净化项目', amount: 40, probability: 'low' }
        ],
        totalAmount: 120
      },
      {
        period: '3-6 Month',
        label: '3-6 Month',
        projects: [
          { name: '雄安新区管委会项目', amount: 50, probability: 'low', isNew: true }
        ],
        totalAmount: 50
      }
    ],
    actions: [
      {
        id: '1',
        type: 'urgent',
        priority: 1,
        title: '本月：开发新项目',
        description: '短期缺口120万，建议开拓石家庄、保定地区医院项目（转化周期约20天）',
        impact: '+120 万',
        owner: '张伟',
        deadline: '20天内'
      },
      {
        id: '2',
        type: 'supplement',
        priority: 2,
        title: '1-3月：补齐中期储备',
        description: '中期缺口30万，需新增1个商务阶段项目',
        impact: '+30 万',
        owner: '李娜',
        deadline: '15天内'
      },
      {
        id: '3',
        type: 'channel',
        priority: 3,
        title: '激活河北渠道',
        description: '河北渠道近20天无新增，本周拜访2家渠道，目标新增项目2个',
        impact: '+40 万',
        owner: '刘芳',
        deadline: '本周内'
      }
    ]
  },
  // 华东区
  east: {
    coreMetrics: {
      coverage: 92,
      coverageStatus: 'green',
      targetAmount: 500,
      supportAmount: 460,
      gap: 40,
      trend: 'up',
      trendValue: 8.5
    },
    supportStructure: {
      '本月': {
        period: '本月',
        label: '核心支撑期',
        amount: 250,
        coverage: 83,
        status: 'green',
        target: 300,
        gap: 50,
        projects: [
          {
            id: 1,
            name: '上海外国语学校净水项目',
            amount: 170,
            probability: 'high',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 2,
            name: '南京鼓楼医院项目',
            amount: 80,
            probability: 'medium',
            health: 'high',
            isOnTrack: true
          }
        ]
      },
      '本季度': {
        period: '本季度',
        label: '中期支撑期',
        amount: 150,
        coverage: 100,
        status: 'green',
        target: 150,
        gap: 0,
        projects: [
          {
            id: 3,
            name: '杭州阿里巴巴园区项目',
            amount: 130,
            probability: 'medium',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 4,
            name: '苏州工业园区项目',
            amount: 20,
            probability: 'low',
            health: 'medium',
            isOnTrack: true
          }
        ]
      },
      '半年度': {
        period: '半年度',
        label: '储备支撑期',
        amount: 60,
        coverage: 100,
        status: 'green',
        target: 60,
        gap: 0,
        projects: [
          {
            id: 5,
            name: '宁波北仑港项目',
            amount: 40,
            probability: 'low',
            health: 'low',
            isOnTrack: true,
            isNew: true
          }
        ]
      }
    },
    diagnosticIssues: [
      {
        id: '1',
        type: 'project_delay',
        name: '项目推进延迟',
        impact: -25,
        reason: '1个项目延迟超过5天，影响较小',
        riskLevel: 'yellow'
      }
    ],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '上海外国语学校净水项目', amount: 170, probability: 'high' }
        ],
        totalAmount: 170
      },
      {
        period: 'Week 2',
        label: 'Week 2',
        projects: [
          { name: '南京鼓楼医院项目', amount: 80, probability: 'medium' }
        ],
        totalAmount: 80
      },
      {
        period: 'Week 3',
        label: 'Week 3',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 4',
        label: 'Week 4',
        projects: [],
        totalAmount: 0
      },
      {
        period: '1-3 Month',
        label: '1-3 Month',
        projects: [
          { name: '杭州阿里巴巴园区项目', amount: 130, probability: 'medium' }
        ],
        totalAmount: 130
      },
      {
        period: '3-6 Month',
        label: '3-6 Month',
        projects: [
          { name: '宁波北仑港项目', amount: 40, probability: 'low', isNew: true }
        ],
        totalAmount: 40
      }
    ],
    actions: [
      {
        id: '1',
        type: 'urgent',
        priority: 1,
        title: '推进项目',
        description: '加快杭州阿里巴巴园区项目推进速度',
        impact: '+25 万',
        owner: '王强',
        deadline: '本周内'
      }
    ]
  },
  // 华南区
  south: {
    coreMetrics: {
      coverage: 65,
      coverageStatus: 'red',
      targetAmount: 350,
      supportAmount: 227.5,
      gap: 122.5,
      trend: 'down',
      trendValue: -12.3
    },
    supportStructure: {
      '本月': {
        period: '本月',
        label: '核心支撑期',
        amount: 80,
        coverage: 32,
        status: 'red',
        target: 250,
        gap: 170,
        projects: [
          {
            id: 1,
            name: '深圳四季酒店净化项目',
            amount: 80,
            probability: 'medium',
            health: 'medium',
            isOnTrack: false,
            delayDays: 15
          }
        ]
      },
      '本季度': {
        period: '本季度',
        label: '中期支撑期',
        amount: 90,
        coverage: 60,
        status: 'yellow',
        target: 150,
        gap: 60,
        projects: [
          {
            id: 2,
            name: '广州腾讯大厦项目',
            amount: 60,
            probability: 'medium',
            health: 'medium',
            isOnTrack: true
          },
          {
            id: 3,
            name: '珠海长隆度假区项目',
            amount: 30,
            probability: 'low',
            health: 'low',
            isOnTrack: false,
            delayDays: 10
          }
        ]
      },
      '半年度': {
        period: '半年度',
        label: '储备支撑期',
        amount: 57.5,
        coverage: 100,
        status: 'green',
        target: 57.5,
        gap: 0,
        projects: [
          {
            id: 4,
            name: '东莞松山湖项目',
            amount: 40,
            probability: 'low',
            health: 'low',
            isOnTrack: true,
            isNew: true
          },
          {
            id: 5,
            name: '佛山顺德区项目',
            amount: 17.5,
            probability: 'low',
            health: 'low',
            isOnTrack: true
          }
        ]
      }
    },
    diagnosticIssues: [
      {
        id: '1',
        type: 'project_delay',
        name: '项目推进延迟',
        impact: -70,
        reason: '2个项目延迟超过10天，严重支撑不足',
        riskLevel: 'red'
      },
      {
        id: '2',
        type: 'reserve_shortage',
        name: '储备新增不足',
        impact: -35,
        reason: '本月新增储备项目仅1个，低于目标4个',
        riskLevel: 'orange'
      },
      {
        id: '3',
        type: 'channel_decline',
        name: '渠道贡献下滑',
        impact: -17.5,
        reason: '深圳渠道近30天无新增项目',
        riskLevel: 'yellow'
      }
    ],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '深圳四季酒店净化项目', amount: 80, probability: 'medium', isDelayed: true }
        ],
        totalAmount: 80
      },
      {
        period: 'Week 2',
        label: 'Week 2',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 3',
        label: 'Week 3',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 4',
        label: 'Week 4',
        projects: [],
        totalAmount: 0
      },
      {
        period: '1-3 Month',
        label: '1-3 Month',
        projects: [
          { name: '广州腾讯大厦项目', amount: 60, probability: 'medium' },
          { name: '珠海长隆度假区项目', amount: 30, probability: 'low', isDelayed: true }
        ],
        totalAmount: 90
      },
      {
        period: '3-6 Month',
        label: '3-6 Month',
        projects: [
          { name: '东莞松山湖项目', amount: 40, probability: 'low', isNew: true }
        ],
        totalAmount: 40
      }
    ],
    actions: [
      {
        id: '1',
        type: 'urgent',
        priority: 1,
        title: '0-30天：紧急推进延迟项目',
        description: '深圳四季酒店、珠海长隆项目已延迟15天和10天，优先推进可释放+70万',
        impact: '+70 万',
        owner: '陈明',
        deadline: '本周内'
      },
      {
        id: '2',
        type: 'supplement',
        priority: 2,
        title: '本月：开发新项目',
        description: '短期缺口170万，建议开拓广州、深圳地区酒店项目（成交周期15-20天）',
        impact: '+170 万',
        owner: '刘芳',
        deadline: '25天内'
      },
      {
        id: '3',
        type: 'supplement',
        priority: 3,
        title: '1-3月：补齐中期储备',
        description: '中期缺口60万，需新增2个商务阶段项目',
        impact: '+60 万',
        owner: '赵敏',
        deadline: '20天内'
      },
      {
        id: '4',
        type: 'channel',
        priority: 4,
        title: '激活深圳渠道',
        description: '深圳渠道近30天无新增，本周拜访3家，目标新增项目3个',
        impact: '+50 万',
        owner: '赵敏',
        deadline: '本周内'
      }
    ]
  },
  // 西南区
  southwest: {
    coreMetrics: {
      coverage: 72,
      coverageStatus: 'yellow',
      targetAmount: 200,
      supportAmount: 144,
      gap: 56,
      trend: 'up',
      trendValue: 3.5
    },
    supportStructure: {
      '本月': {
        period: '本月',
        label: '核心支撑期',
        amount: 60,
        coverage: 50,
        status: 'yellow',
        target: 120,
        gap: 60,
        projects: [
          {
            id: 1,
            name: '重庆环球中心项目',
            amount: 40,
            probability: 'high',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 2,
            name: '成都IFS国际金融中心项目',
            amount: 20,
            probability: 'medium',
            health: 'medium',
            isOnTrack: false,
            delayDays: 8
          }
        ]
      },
      '本季度': {
        period: '本季度',
        label: '中期支撑期',
        amount: 60,
        coverage: 75,
        status: 'yellow',
        target: 80,
        gap: 20,
        projects: [
          {
            id: 3,
            name: '昆明长水机场项目',
            amount: 40,
            probability: 'medium',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 4,
            name: '贵阳国际会展中心项目',
            amount: 20,
            probability: 'low',
            health: 'low',
            isOnTrack: true
          }
        ]
      },
      '半年度': {
        period: '半年度',
        label: '储备支撑期',
        amount: 24,
        coverage: 100,
        status: 'green',
        target: 24,
        gap: 0,
        projects: [
          {
            id: 5,
            name: '成都天府新区项目',
            amount: 24,
            probability: 'low',
            health: 'low',
            isOnTrack: true,
            isNew: true
          }
        ]
      }
    },
    diagnosticIssues: [
      {
        id: '1',
        type: 'project_delay',
        name: '项目推进延迟',
        impact: -15,
        reason: '1个项目延迟超过5天',
        riskLevel: 'yellow'
      },
      {
        id: '2',
        type: 'reserve_shortage',
        name: '储备新增不足',
        impact: -24,
        reason: '本月新增储备项目仅1个，低于目标2个',
        riskLevel: 'yellow'
      }
    ],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '重庆环球中心项目', amount: 40, probability: 'high' }
        ],
        totalAmount: 40
      },
      {
        period: 'Week 2',
        label: 'Week 2',
        projects: [
          { name: '成都IFS国际金融中心项目', amount: 20, probability: 'medium', isDelayed: true }
        ],
        totalAmount: 20
      },
      {
        period: 'Week 3',
        label: 'Week 3',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 4',
        label: 'Week 4',
        projects: [],
        totalAmount: 0
      },
      {
        period: '1-3 Month',
        label: '1-3 Month',
        projects: [
          { name: '昆明长水机场项目', amount: 40, probability: 'medium' }
        ],
        totalAmount: 40
      },
      {
        period: '3-6 Month',
        label: '3-6 Month',
        projects: [
          { name: '成都天府新区项目', amount: 24, probability: 'low', isNew: true }
        ],
        totalAmount: 24
      }
    ],
    actions: [
      {
        id: '1',
        type: 'urgent',
        priority: 1,
        title: '本月：推进延迟项目',
        description: '成都IFS项目已延迟，优先推进可释放+20万',
        impact: '+20 万',
        owner: '孙丽',
        deadline: '本周内'
      },
      {
        id: '2',
        type: 'supplement',
        priority: 2,
        title: '1-3月：补齐中期储备',
        description: '中期缺口20万，需新增1个商务阶段项目',
        impact: '+20 万',
        owner: '周杰',
        deadline: '15天内'
      }
    ]
  },
  // 西北区
  northwest: {
    coreMetrics: {
      coverage: 95,
      coverageStatus: 'green',
      targetAmount: 150,
      supportAmount: 142.5,
      gap: 7.5,
      trend: 'up',
      trendValue: 12.8
    },
    supportStructure: {
      '本月': {
        period: '本月',
        label: '核心支撑期',
        amount: 80,
        coverage: 100,
        status: 'green',
        target: 80,
        gap: 0,
        projects: [
          {
            id: 1,
            name: '西安交通大学项目',
            amount: 80,
            probability: 'high',
            health: 'high',
            isOnTrack: true
          }
        ]
      },
      '本季度': {
        period: '本季度',
        label: '中期支撑期',
        amount: 40,
        coverage: 100,
        status: 'green',
        target: 40,
        gap: 0,
        projects: [
          {
            id: 2,
            name: '兰州中心医院项目',
            amount: 40,
            probability: 'medium',
            health: 'high',
            isOnTrack: true
          }
        ]
      },
      '半年度': {
        period: '半年度',
        label: '储备支撑期',
        amount: 22.5,
        coverage: 100,
        status: 'green',
        target: 22.5,
        gap: 0,
        projects: [
          {
            id: 3,
            name: '乌鲁木齐高铁站项目',
            amount: 22.5,
            probability: 'low',
            health: 'low',
            isOnTrack: true,
            isNew: true
          }
        ]
      }
    },
    diagnosticIssues: [],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '西安交通大学项目', amount: 80, probability: 'high' }
        ],
        totalAmount: 80
      },
      {
        period: 'Week 2',
        label: 'Week 2',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 3',
        label: 'Week 3',
        projects: [],
        totalAmount: 0
      },
      {
        period: 'Week 4',
        label: 'Week 4',
        projects: [],
        totalAmount: 0
      },
      {
        period: '1-3 Month',
        label: '1-3 Month',
        projects: [
          { name: '兰州中心医院项目', amount: 40, probability: 'medium' }
        ],
        totalAmount: 40
      },
      {
        period: '3-6 Month',
        label: '3-6 Month',
        projects: [
          { name: '乌鲁木齐高铁站项目', amount: 22.5, probability: 'low', isNew: true }
        ],
        totalAmount: 22.5
      }
    ],
    actions: [
      {
        id: '1',
        type: 'supplement',
        priority: 1,
        title: '持续开拓',
        description: '当前支撑充足（95%），保持现有项目推进节奏，继续开拓西安、兰州地区新项目',
        impact: '+10 万',
        owner: '吴刚',
        deadline: '30天内'
      }
    ]
  }
};

// 组件属性
interface FutureSupportAdequacyPanelProps {
  data?: Partial<RegionData>;
  theme?: Theme;
  defaultRegion?: Region;
}

// 辅助函数：获取状态颜色
const getStatusColor = (status: 'green' | 'yellow' | 'red', theme: Theme) => {
  switch (status) {
    case 'green':
      return {
        bg: theme === 'dashboard' ? 'bg-cyan-500' : 'bg-green-500',
        text: theme === 'dashboard' ? 'text-cyan-400' : 'text-green-600',
        border: theme === 'dashboard' ? 'border-cyan-500' : 'border-green-500'
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600',
        border: 'border-yellow-500'
      };
    case 'red':
      return {
        bg: 'bg-red-500',
        text: 'text-red-600',
        border: 'border-red-500'
      };
  }
};

// 辅助函数：获取概率颜色
const getProbabilityColor = (probability: 'high' | 'medium' | 'low', theme: Theme) => {
  switch (probability) {
    case 'high':
      return theme === 'dashboard' ? 'bg-cyan-500' : 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return theme === 'dashboard' ? 'bg-slate-500' : 'bg-gray-500';
  }
};

// 辅助函数：获取健康度颜色
const getHealthColor = (health: 'high' | 'medium' | 'low', theme: Theme) => {
  switch (health) {
    case 'high':
      return theme === 'dashboard' ? 'text-cyan-400' : theme === 'dark' ? 'text-green-500' : 'text-green-600';
    case 'medium':
      return theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600';
    case 'low':
      return theme === 'dark' ? 'text-red-500' : 'text-red-600';
  }
};

export default function FutureSupportAdequacyPanel({
  data: customData,
  theme = 'dark',
  defaultRegion = 'national'
}: FutureSupportAdequacyPanelProps) {
  // 区域选择状态
  const [selectedRegion, setSelectedRegion] = useState<Region>(defaultRegion);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  // 催单状态
  const [urgeMessage, setUrgeMessage] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // 合并默认数据和自定义数据
  const allRegionData = { ...regionData, ...customData };
  const data = allRegionData[selectedRegion] || regionData.national; // 默认回退到全国数据

  // 获取风险等级颜色
  const getRiskLevelColor = (level: 'red' | 'orange' | 'yellow') => {
    switch (level) {
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-500';
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend: 'up' | 'stable' | 'down') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-5 h-5 text-green-600" />;
      case 'stable':
        return <ArrowRight className="w-5 h-5 text-slate-600" />;
      case 'down':
        return <ArrowDown className="w-5 h-5 text-red-600" />;
    }
  };

  // 获取行动类型图标
  const getActionIcon = (type: 'urgent' | 'supplement' | 'channel' | 'sop') => {
    switch (type) {
      case 'urgent':
        return <Flame className={cn('w-4 h-4', theme === 'dashboard' ? 'text-red-400' : 'text-red-600')} />;
      case 'supplement':
        return <AlertTriangle className={cn('w-4 h-4', theme === 'dashboard' ? 'text-yellow-400' : 'text-yellow-600')} />;
      case 'channel':
        return <Lightbulb className={cn('w-4 h-4', theme === 'dashboard' ? 'text-blue-400' : 'text-blue-600')} />;
      case 'sop':
        return <Compass className={cn('w-4 h-4', theme === 'dashboard' ? 'text-purple-400' : 'text-purple-600')} />;
    }
  };

  // 获取行动类型背景色
  const getActionTypeBg = (type: 'urgent' | 'supplement' | 'channel' | 'sop', theme: Theme) => {
    if (theme === 'dashboard') {
      return 'bg-transparent'; // dashboard模式使用边框发光效果
    }
    switch (type) {
      case 'urgent':
        return theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50';
      case 'supplement':
        return theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-50';
      case 'channel':
        return theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50';
      case 'sop':
        return theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-50';
    }
  };

  // 支撑结构数据转换（用于图表）
  const supportStructureData = [
    { name: '本月', amount: data.supportStructure['本月'].amount, coverage: data.supportStructure['本月'].coverage, status: data.supportStructure['本月'].status },
    { name: '本季度', amount: data.supportStructure['本季度'].amount, coverage: data.supportStructure['本季度'].coverage, status: data.supportStructure['本季度'].status },
    { name: '半年度', amount: data.supportStructure['半年度'].amount, coverage: data.supportStructure['半年度'].coverage, status: data.supportStructure['半年度'].status }
  ];

  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden transition-all duration-300',
        theme === 'dashboard'
          ? 'bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
          : theme === 'dark'
          ? 'bg-slate-900/80 border border-slate-700'
          : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'
      )}
    >
      {/* 标题区 */}
      <div
        className={cn(
          'px-6 py-3 border-b flex items-center justify-between',
          theme === 'dashboard'
            ? 'border-cyan-500/30 bg-slate-900/60'
            : theme === 'dark'
            ? 'border-slate-700 bg-slate-900/50'
            : 'border-slate-200 bg-white'
        )}
      >
        <div className="flex items-center gap-3">
          <Activity className={cn(
            'w-5 h-5',
            theme === 'dashboard'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
              : 'text-green-600'
          )} />
          <h3 className={cn(
            'font-bold text-lg',
            theme === 'dashboard'
              ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]'
              : 'text-slate-900'
          )}>关键支撑</h3>
        </div>
        <div className="flex items-center gap-4">
          {/* 区域选择器 */}
          <div className="flex items-center gap-2">
            <MapPin className={cn('w-4 h-4', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-600')} />
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                className={cn(
                  'appearance-none pl-3 pr-8 py-1.5 text-sm rounded-lg border cursor-pointer',
                  'transition-colors focus:outline-none focus:ring-2',
                  theme === 'dashboard'
                    ? 'bg-slate-900/80 border-cyan-500/40 text-white hover:bg-cyan-500/20 focus:ring-cyan-500 focus:text-cyan-100'
                    : theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 focus:ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 focus:ring-blue-500'
                )}
                style={{
                  backgroundImage: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                {Object.entries(regionConfig).map(([key, config]) => (
                  <option
                    key={key}
                    value={key}
                    className={theme === 'dashboard' ? 'bg-slate-900 text-cyan-100' : ''}
                  >
                    {config.label}
                  </option>
                ))}
              </select>
              <ChevronDown className={cn('absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-600')} />
            </div>
          </div>
          <div
            className={cn(
              'h-6 w-px',
              theme === 'dashboard' ? 'bg-cyan-500/30' : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
            )}
          />
          <div className="flex items-center gap-2">
            <BarChart3 className={cn('w-4 h-4', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-600')} />
          </div>
        </div>
      </div>

      {/* 催单提示消息 */}
      {urgeMessage.show && (
        <div className={cn(
          'mx-4 my-2 p-3 rounded-lg border flex items-center gap-3 animate-pulse',
          theme === 'dashboard'
            ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
            : 'bg-orange-100 border-orange-300 text-orange-800'
        )}>
          <Zap className={cn('w-5 h-5 flex-shrink-0', theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600')} />
          <span className="text-sm font-medium">{urgeMessage.message}</span>
        </div>
      )}

      {/* 主内容区 - 时间段矩阵卡片布局 */}
      <div className="p-4">
        {/* 响应式网格布局：小屏单列，中屏双列，大屏三列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(['本月', '本季度', '半年度'] as const).map((period, index) => {
            const level = data.supportStructure[period];
            const statusColor = getStatusColor(level.status, theme);
            const periodConfigInfo = periodConfig[period];

            // 计算统计项目总金额
            const projectsTotalAmount = level.projects.reduce((sum, p) => sum + p.amount, 0);
            // 计算预测完成项目总金额
            const excludedProjectsTotalAmount = level.excludedProjects
              ? level.excludedProjects.reduce((sum, p) => sum + p.amount, 0)
              : 0;
            // 计算储备项目总金额
            const reserveProjectsTotalAmount = level.reserveProjects
              ? level.reserveProjects.reduce((sum, p) => sum + p.amount, 0)
              : 0;
            // 加上预测完成后的覆盖率
            const totalCoverage = level.target > 0
              ? Math.round(((level.amount + excludedProjectsTotalAmount) / level.target) * 100)
              : 0;
            // 计算还需要新开发的金额
            const newDevNeeded = Math.max(0, level.target - (level.amount + excludedProjectsTotalAmount));

            // 计算各区域在该时间段的达标情况
            const underachievingRegions: string[] = [];
            const regions = ['north', 'east', 'south', 'southwest', 'northwest'] as Region[];
            regions.forEach(regionKey => {
              const regionLevel = allRegionData[regionKey]?.supportStructure[period];
              if (regionLevel) {
                const regionExcludedAmount = regionLevel.excludedProjects
                  ? regionLevel.excludedProjects.reduce((sum, p) => sum + p.amount, 0)
                  : 0;
                const regionTotalCoverage = regionLevel.target > 0
                  ? ((regionLevel.amount + regionExcludedAmount) / regionLevel.target) * 100
                  : 100;
                if (regionTotalCoverage < 100) {
                  underachievingRegions.push(regionConfig[regionKey].label);
                }
              }
            });

            return (
              <div
                key={period}
                className={cn(
                  'p-4 rounded-xl relative border transition-all duration-300 cursor-pointer hover:scale-105',
                  theme === 'dashboard'
                    ? cn(
                        'bg-slate-900/60 backdrop-blur-sm',
                        index === 0
                          ? 'border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                          : index === 1
                          ? 'border-yellow-500/30 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                          : 'border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
                        'shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      )
                    : theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700/50'
                    : `bg-gradient-to-b ${index === 0 ? 'from-red-50/50 to-slate-50/30' : index === 1 ? 'from-yellow-50/50 to-slate-50/30' : 'from-green-50/50 to-slate-50/30'}`
                )}
                onClick={() => {
                  setSelectedPeriod(period);
                  setIsDrillDownOpen(true);
                }}
              >
                {/* 时间段标签 */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h4 className={cn(
                      'text-xs sm:text-sm font-bold',
                      theme === 'dashboard'
                        ? 'text-cyan-200 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                        : 'text-slate-900'
                    )}>{period}</h4>
                    <ChevronRight className={cn(
                      'w-3 h-3 sm:w-4 sm:h-4',
                      theme === 'dashboard' ? 'text-cyan-400/50' : 'text-slate-400'
                    )} />
                    {newDevNeeded > 0 && (
                      <span className={cn(
                        'text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full',
                        theme === 'dashboard'
                          ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                          : 'bg-yellow-100 text-yellow-700'
                      )}>
                        需新开发{newDevNeeded.toFixed(0)}万
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={cn(
                      'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full',
                      statusColor.bg,
                      theme === 'dashboard' && 'shadow-[0_0_8px_currentColor]'
                    )} />
                    {level.excludedProjects && level.excludedProjects.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const excludedCount = level.excludedProjects?.length || 0;
                          setUrgeMessage({
                            show: true,
                            message: `已向【${period}】的 ${excludedCount} 个未统计项目发送催单提醒`
                          });
                          setTimeout(() => {
                            setUrgeMessage({ show: false, message: '' });
                          }, 2000);
                        }}
                        className={cn(
                          'flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all',
                          theme === 'dashboard'
                            ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        )}
                        title="批量催单"
                      >
                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{level.excludedProjects?.length || 0}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 核心指标 - 紧凑布局 */}
                <div className="space-y-1.5">
                  {/* 目标/支撑/覆盖率 - 单行显示，响应式字体大小 */}
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-1 sm:gap-2">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>目标</span>
                      <span className={cn('font-semibold text-xs sm:text-sm', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                        {level.target.toFixed(2)}万
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>支撑</span>
                      <span className={cn('font-semibold text-xs sm:text-sm', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                        {level.amount.toFixed(2)}万
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>覆盖率</span>
                      <span className={cn('font-semibold text-xs sm:text-sm', level.coverage >= 80 ? 'text-green-400' : level.coverage > 50 ? 'text-yellow-400' : 'text-red-400')}>
                        {level.coverage}%
                      </span>
                    </div>
                  </div>

                  {/* 覆盖度进度条 */}
                  <div className={cn('w-full h-1 sm:h-1.5 rounded-full overflow-hidden', theme === 'dashboard' ? 'bg-slate-700/50' : 'bg-slate-200')}>
                    <div
                      className={`h-full transition-all duration-500 ${
                        level.coverage >= 80 ? 'bg-green-500' : level.coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(level.coverage, 100)}%` }}
                    />
                  </div>

                  {/* 缺口 */}
                  <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5 sm:pt-1">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>缺口</span>
                      <span className={`text-xs sm:text-sm font-bold ${level.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {level.gap > 0 ? `${level.gap.toFixed(2)}` : `+${Math.abs(level.gap).toFixed(2)}`}
                      </span>
                      <span className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万</span>
                    </div>
                  </div>

                  {/* 已完成项目数 + 金额 */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm pt-0.5 sm:pt-1">
                    <span className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>已下单</span>
                    <span className={cn('font-semibold text-xs sm:text-sm', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                      {level.projects.length}个
                    </span>
                    <span className={cn('font-semibold text-xs sm:text-sm text-green-400', theme === 'dashboard' ? 'text-green-300' : 'text-green-600')}>
                      {projectsTotalAmount.toFixed(2)}万
                    </span>
                  </div>

                  {/* 未统计项目数 + 金额 */}
                  {level.excludedProjects && level.excludedProjects.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className={cn('text-[10px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>未下单</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className={cn(
                          'font-semibold text-xs text-orange-400',
                          theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600'
                        )}>{level.excludedProjects.length}个</span>
                        <span className={cn(
                          'font-semibold text-xs text-orange-400',
                          theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600'
                        )}>{excludedProjectsTotalAmount.toFixed(2)}万</span>
                      </div>
                    </div>
                  )}

                  {/* 储备项目数 + 金额 */}
                  <div className="flex justify-between text-xs">
                    <span className={cn('text-[10px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>储备</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className={cn(
                        'font-semibold text-xs text-purple-400',
                        theme === 'dashboard' ? 'text-purple-300' : 'text-purple-600'
                      )}>{level.reserveProjects?.length || 0}个</span>
                      <span className={cn(
                        'font-semibold text-xs text-purple-400',
                        theme === 'dashboard' ? 'text-purple-300' : 'text-purple-600'
                      )}>{reserveProjectsTotalAmount.toFixed(2)}万</span>
                    </div>
                  </div>

                  {/* 不达标大区 */}
                  {underachievingRegions.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className={cn('text-[10px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>不达标</span>
                      <span className={cn(
                        'font-semibold text-xs',
                        theme === 'dashboard' ? 'text-red-300' : 'text-red-600'
                      )}>
                        {underachievingRegions.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 钻取弹窗 */}
      {selectedPeriod && isDrillDownOpen && (
        <ProjectDrillDownModal
          isOpen={isDrillDownOpen}
          onClose={() => {
            setIsDrillDownOpen(false);
            setSelectedPeriod(null);
          }}
          period={selectedPeriod}
          data={data.supportStructure[selectedPeriod as keyof typeof data.supportStructure]}
          theme={theme}
        />
      )}
    </div>
  );
}

// 项目钻取弹窗组件
function ProjectDrillDownModal({
  isOpen,
  onClose,
  period,
  data,
  theme
}: {
  isOpen: boolean;
  onClose: () => void;
  period: string;
  data: SupportLevel;
  theme: Theme;
}) {
  // 表格状态
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('expectedOrderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'projects' | 'excluded' | 'reserve'>('projects');
  const itemsPerPage = 5;

  // 催单提示状态
  const [urgeMessage, setUrgeMessage] = useState<{ show: boolean; projectName: string }>({ show: false, projectName: '' });

  // 处理催单
  const handleUrgeProject = (project: { name: string }) => {
    setUrgeMessage({ show: true, projectName: project.name });
    setTimeout(() => {
      setUrgeMessage({ show: false, projectName: '' });
    }, 2000);
  };

  // 获取所有项目列表
  const getActiveProjects = () => {
    switch (activeTab) {
      case 'projects':
        return data.projects.map(p => ({ ...p, projectType: p.projectType || '买断', projectPhase: p.projectPhase || '项目采购', projectStatus: p.projectStatus || '未下单' }));
      case 'excluded':
        return (data.excludedProjects || []).map(p => ({ ...p, projectType: p.projectType || '买断', projectPhase: p.projectPhase || '项目采购', projectStatus: p.projectStatus || '未下单' }));
      case 'reserve':
        return (data.reserveProjects || []).map(p => ({ ...p, projectType: p.projectType || '买断', projectPhase: p.projectPhase || '项目采购', projectStatus: p.projectStatus || '未下单' }));
      default:
        return [];
    }
  };

  // 筛选和排序项目
  const getFilteredAndSortedProjects = () => {
    let projects = getActiveProjects();

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.salesEngineer?.toLowerCase().includes(query) ||
        p.cityManager?.toLowerCase().includes(query)
      );
    }

    // 大区过滤
    if (filterRegion !== 'all') {
      projects = projects.filter(p => p.region === filterRegion);
    }

    // 状态过滤
    if (filterStatus !== 'all') {
      projects = projects.filter(p => p.projectStatus === filterStatus);
    }

    // 排序
    projects = [...projects].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'expectedOrderDate':
          comparison = (a.expectedOrderDate || '').localeCompare(b.expectedOrderDate || '');
          break;
        case 'amount':
          comparison = (a.amount || 0) - (b.amount || 0);
          break;
        case 'region':
          comparison = (a.region || '').localeCompare(b.region || '');
          break;
        case 'salesEngineer':
          comparison = (a.salesEngineer || '').localeCompare(b.salesEngineer || '');
          break;
        case 'projectStatus':
          comparison = (a.projectStatus || '').localeCompare(b.projectStatus || '');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return projects;
  };

  // 处理排序
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // 分页数据
  const allProjects = getActiveProjects(); // 当前Tab的所有数据（未筛选）
  const filteredProjects = getFilteredAndSortedProjects();
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProjects = filteredProjects.slice(startIndex, endIndex);

  if (!isOpen) return null;

  const periodInfo = periodConfig[period];

  // 重置页码（当筛选条件变化时）
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRegion, filterStatus, sortBy, sortOrder, activeTab, isOpen]);

  // 计算合计
  const totals = {
    target: data.target,
    amount: data.amount,
    gap: data.gap,
    coverage: data.coverage
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 - 响应式宽度 */}
      <div className={cn(
        'relative w-full max-w-5xl mx-2 sm:mx-4 max-h-[75vh] border-2 rounded-2xl overflow-hidden transition-all flex flex-col',
        theme === 'dashboard'
          ? 'bg-slate-900/80 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
          : theme === 'dark'
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-slate-200'
      )}>
        {/* 标题栏 */}
        <div className={cn(
          'flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b',
          theme === 'dashboard'
            ? 'border-cyan-500/30 bg-slate-900/80'
            : theme === 'dark'
            ? 'border-slate-700 bg-slate-800'
            : 'border-slate-200 bg-slate-50'
        )}>
          <div className="flex items-center gap-2 sm:gap-4">
            <Activity className={cn(
              'w-4 h-4 sm:w-5 sm:h-5',
              theme === 'dashboard'
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                : 'text-green-600'
            )} />
            <div>
              <h2 className={cn(
                'text-base sm:text-xl font-bold flex items-center gap-2',
                theme === 'dashboard'
                  ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                  : 'text-slate-900'
              )}>
                {period} - {periodInfo?.label || '支撑详情'}
              </h2>
              <p className={cn(
                'text-[10px] sm:text-sm mt-1',
                theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600'
              )}>
                项目明细与进度跟踪
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-1.5 sm:p-2 rounded-lg transition-colors',
              theme === 'dashboard'
                ? 'bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30'
                : theme === 'dark'
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            )}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 催单提示消息 */}
        {urgeMessage.show && (
          <div className={cn(
            'mx-3 sm:mx-4 mt-2 sm:mt-3 p-2 rounded-lg border flex items-center gap-2 animate-pulse',
            theme === 'dashboard'
              ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
              : 'bg-orange-100 border-orange-300 text-orange-800'
          )}>
            <Zap className={cn('w-4 h-4 flex-shrink-0', theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600')} />
            <span className="text-xs sm:text-sm font-medium">
              已向【{urgeMessage.projectName}】发送催单提醒
            </span>
          </div>
        )}

        {/* 合计数据栏 - 响应式布局 */}
        <div className={cn(
          'px-2 sm:px-3 py-1.5 sm:py-2 border-b',
          theme === 'dashboard'
            ? 'border-cyan-500/20 bg-cyan-500/10'
            : theme === 'dark'
            ? 'border-slate-700 bg-slate-800/50'
            : 'border-slate-200 bg-slate-50'
        )}>
          {/* 小屏单列，中屏两列，大屏四列 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3">
            <div className={cn(
              'text-center p-1.5 sm:p-2 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>目标</div>
              <div className="flex items-center justify-center gap-0.5">
                <div className={cn('text-base sm:text-xl font-bold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                  {totals.target.toFixed(2)}
                </div>
                <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万元</div>
              </div>
            </div>
            <div className={cn(
              'text-center p-1.5 sm:p-2 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>支撑</div>
              <div className="flex items-center justify-center gap-0.5">
                <div className={cn('text-base sm:text-xl font-bold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                  {totals.amount.toFixed(2)}
                </div>
                <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万元</div>
              </div>
            </div>
            <div className={cn(
              'text-center p-1.5 sm:p-2 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>缺口</div>
              <div className="flex items-center justify-center gap-0.5">
                <div className={cn('text-base sm:text-xl font-bold', totals.gap > 0 ? 'text-red-400' : 'text-green-400')}>
                  {totals.gap > 0 ? `${totals.gap.toFixed(2)}` : `+${Math.abs(totals.gap).toFixed(2)}`}
                </div>
                <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万元</div>
              </div>
            </div>
            <div className={cn(
              'text-center p-1.5 sm:p-2 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>覆盖度</div>
              <div className="flex items-center justify-center gap-0.5">
                <div className={cn('text-base sm:text-xl font-bold', totals.coverage >= 80 ? 'text-green-400' : totals.coverage >= 50 ? 'text-yellow-400' : 'text-red-400')}>
                  {totals.coverage}%
                </div>
                <div className={cn('text-[9px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>支撑达成</div>
              </div>
            </div>
          </div>
        </div>

        {/* 项目列表 */}
        <div className={cn('flex flex-col flex-1 min-h-0')}>
          {/* Tab切换 */}
          <div className={cn(
            'flex border-b px-4 sm:px-6',
            theme === 'dashboard' ? 'border-cyan-500/20' : theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          )}>
            <button
              onClick={() => setActiveTab('projects')}
              className={cn(
                'px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-all border-b-2',
                activeTab === 'projects'
                  ? theme === 'dashboard'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : theme === 'dark'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-blue-500 text-blue-600 bg-blue-50'
                  : theme === 'dashboard'
                  ? 'border-transparent text-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-500/5'
                  : theme === 'dark'
                  ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              )}
            >
              预测项目 ({data.projects.length})
            </button>
            {data.excludedProjects && data.excludedProjects.length > 0 && (
              <button
                onClick={() => setActiveTab('excluded')}
                className={cn(
                  'px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-all border-b-2',
                  activeTab === 'excluded'
                    ? theme === 'dashboard'
                      ? 'border-orange-400 text-orange-300 bg-orange-500/10'
                      : theme === 'dark'
                      ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                      : 'border-orange-500 text-orange-600 bg-orange-50'
                    : theme === 'dashboard'
                    ? 'border-transparent text-orange-400/50 hover:text-orange-300 hover:bg-orange-500/5'
                    : theme === 'dark'
                    ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                )}
              >
                储备项目 ({data.excludedProjects.length})
              </button>
            )}
            {data.reserveProjects && data.reserveProjects.length > 0 && (
              <button
                onClick={() => setActiveTab('reserve')}
                className={cn(
                  'px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-all border-b-2',
                  activeTab === 'reserve'
                    ? theme === 'dashboard'
                      ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                      : theme === 'dark'
                      ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                      : 'border-purple-500 text-purple-600 bg-purple-50'
                    : theme === 'dashboard'
                    ? 'border-transparent text-purple-400/50 hover:text-purple-300 hover:bg-purple-500/5'
                    : theme === 'dark'
                    ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                )}
              >
                储备项目 ({data.reserveProjects.length})
              </button>
            )}
          </div>

          {/* 筛选和搜索区 */}
          <div className={cn(
            'px-2 sm:px-3 py-2 sm:py-2.5 border-b flex flex-wrap gap-2 sm:gap-3 items-center',
            theme === 'dashboard' ? 'border-cyan-500/20' : theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          )}>
            {/* 搜索框 */}
            <input
              type="text"
              placeholder="搜索项目名称、销售、城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg border focus:outline-none focus:ring-2 min-w-[160px] sm:min-w-[240px]',
                theme === 'dashboard'
                  ? 'bg-slate-900/50 border-cyan-500/30 text-white placeholder-cyan-400/40 focus:ring-cyan-500 focus:text-cyan-100'
                  : theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500'
              )}
            />

            {/* 大区筛选 */}
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className={cn(
                'px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg border focus:outline-none focus:ring-2 cursor-pointer',
                theme === 'dashboard'
                  ? 'bg-slate-900/50 border-cyan-500/30 text-white focus:ring-cyan-500'
                  : theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-white focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500'
              )}
            >
              <option value="all">全部大区</option>
              {Array.from(new Set(filteredProjects.map(p => p.region).filter(Boolean))).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={cn(
                'px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg border focus:outline-none focus:ring-2 cursor-pointer',
                theme === 'dashboard'
                  ? 'bg-slate-900/50 border-cyan-500/30 text-white focus:ring-cyan-500'
                  : theme === 'dark'
                  ? 'bg-slate-800 border-slate-600 text-white focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500'
              )}
            >
              <option value="all">全部状态</option>
              <option value="已下单">已下单</option>
              <option value="未下单">未下单</option>
            </select>

            {/* 一键催单按钮 */}
            <button
              onClick={() => {
                // 只统计未下单的项目
                const unOrderedProjects = filteredProjects.filter(p =>
                  p.projectStatus && p.projectStatus.toLowerCase().includes('未下单')
                );
                const unOrderedCount = unOrderedProjects.length;
                const totalCount = filteredProjects.length;
                const tabName = activeTab === 'projects' ? '预测' : activeTab === 'excluded' ? '预测' : '储备';

                if (unOrderedCount === 0) {
                  // 如果没有未下单的项目，不执行催单
                  setUrgeMessage({
                    show: true,
                    projectName: `${tabName}项目中没有需要催单的项目`
                  });
                  setTimeout(() => {
                    setUrgeMessage({ show: false, projectName: '' });
                  }, 2000);
                  return;
                }

                setUrgeMessage({
                  show: true,
                  projectName: `已向${tabName}项目的 ${unOrderedCount} 个未下单项目发送催单提醒`
                });
                setTimeout(() => {
                  setUrgeMessage({ show: false, projectName: '' });
                }, 2000);
              }}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ml-auto',
                theme === 'dashboard'
                  ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              )}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>一键催单</span>
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]',
                theme === 'dashboard' ? 'bg-orange-500/30' : 'bg-orange-200'
              )}>
                {filteredProjects.filter(p =>
                  p.projectStatus && p.projectStatus.toLowerCase().includes('未下单')
                ).length}
              </span>
            </button>
          </div>

          {/* 表格区域 */}
          <div className={cn('flex-1 overflow-auto', theme === 'dashboard' ? 'bg-slate-900/30' : '')}>
            <table className={cn('w-full text-sm', theme === 'dashboard' ? 'text-cyan-100' : '')}>
              <thead className={cn(
                'sticky top-0 z-10',
                theme === 'dashboard'
                  ? 'bg-slate-900/95 border-b border-cyan-500/30'
                  : theme === 'dark'
                  ? 'bg-slate-900 border-b border-slate-700'
                  : 'bg-slate-50 border-b border-slate-200'
              )}>
                <tr>
                  <th className={cn(
                    'px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold w-16',
                    theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                  )}>
                    序号
                  </th>
                  <th className={cn(
                    'px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold',
                    theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                  )}>
                    项目阶段
                  </th>
                  <th
                    onClick={() => handleSort('expectedOrderDate')}
                    className={cn(
                      'px-3 py-1.5 sm:px-4 sm:py-2 text-left font-semibold cursor-pointer hover:opacity-80 transition-opacity select-none',
                      theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      预计下单
                      {sortBy === 'expectedOrderDate' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={cn(
                    'px-3 py-1.5 sm:px-4 sm:py-2 text-left font-semibold w-48 sm:w-64',
                    theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                  )}>
                    项目名称
                  </th>
                  <th
                    onClick={() => handleSort('region')}
                    className={cn(
                      'hidden lg:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-left font-semibold cursor-pointer hover:opacity-80 transition-opacity select-none',
                      theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      大区
                      {sortBy === 'region' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('salesEngineer')}
                    className={cn(
                      'hidden md:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-left font-semibold cursor-pointer hover:opacity-80 transition-opacity select-none',
                      theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      销售
                      {sortBy === 'salesEngineer' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className={cn(
                    'hidden xl:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-left font-semibold',
                    theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                  )}>
                    城市经理
                  </th>
                  <th className={cn(
                    'hidden md:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-left font-semibold',
                    theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                  )}>
                    类型
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className={cn(
                      'px-3 py-1.5 sm:px-4 sm:py-2 text-right font-semibold cursor-pointer hover:opacity-80 transition-opacity select-none',
                      theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-end gap-1">
                      金额
                      {sortBy === 'amount' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('projectStatus')}
                    className={cn(
                      'px-3 py-1.5 sm:px-4 sm:py-2 text-center font-semibold cursor-pointer hover:opacity-80 transition-opacity select-none',
                      theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      状态
                      {sortBy === 'projectStatus' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className={cn(
                        'px-4 py-12 text-center',
                        theme === 'dashboard' ? 'text-cyan-400/50' : 'text-slate-500'
                      )}
                    >
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  displayedProjects.map((project, index) => {
                    // 获取状态颜色
                    const getStatusColor = (status?: string) => {
                      if (!status) return theme === 'dashboard' ? 'text-slate-400' : 'text-slate-500';
                      const statusLower = status.toLowerCase();
                      if (statusLower.includes('已下单')) {
                        return theme === 'dashboard'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-green-100 text-green-700 border-green-200';
                      }
                      if (statusLower.includes('未下单')) {
                        return theme === 'dashboard'
                          ? 'bg-orange-500/30 text-orange-300 border-orange-500/50 shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                          : 'bg-orange-100 text-orange-700 border-orange-300';
                      }
                      return theme === 'dashboard'
                        ? 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                        : 'bg-slate-100 text-slate-700 border-slate-200';
                    };

                    return (
                      <tr
                        key={project.id || index}
                        className={cn(
                          'border-b transition-colors hover:bg-opacity-50',
                          theme === 'dashboard'
                            ? 'border-cyan-500/10 hover:bg-cyan-500/5'
                            : theme === 'dark'
                            ? 'border-slate-700 hover:bg-slate-700/50'
                            : 'border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        {/* 序号 */}
                        <td className={cn(
                          'px-3 py-1.5 sm:px-4 sm:py-2 text-center text-xs',
                          theme === 'dashboard' ? 'text-cyan-300/80' : 'text-slate-600'
                        )}>
                          {startIndex + index + 1}
                        </td>

                        {/* 项目阶段 */}
                        <td className={cn(
                          'px-3 py-1.5 sm:px-4 sm:py-2 text-xs',
                          theme === 'dashboard' ? 'text-cyan-300/80' : 'text-slate-600'
                        )}>
                          {project.projectPhase || '项目采购'}
                        </td>

                        {/* 预计下单时间 */}
                        <td className={cn(
                          'px-3 py-1.5 sm:px-4 sm:py-2 text-xs whitespace-nowrap',
                          theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700'
                        )}>
                          {project.expectedOrderDate || '-'}
                        </td>

                        {/* 项目名称 */}
                        <td className={cn(
                          'px-3 py-1.5 sm:px-4 sm:py-2 text-xs',
                          theme === 'dashboard' ? 'text-cyan-100' : 'text-slate-900'
                        )}>
                          <div className={cn(
                            'font-medium leading-snug',
                            theme === 'dashboard' ? 'text-cyan-100' : 'text-slate-900'
                          )}>
                            {project.name}
                          </div>
                        </td>

                        {/* 大区 */}
                        <td className={cn(
                          'hidden lg:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-xs',
                          theme === 'dashboard' ? 'text-cyan-300/80' : 'text-slate-600'
                        )}>
                          {project.region || '-'}
                        </td>

                        {/* 销售工程师 */}
                        <td className={cn(
                          'hidden md:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-xs',
                          theme === 'dashboard' ? 'text-cyan-300/80' : 'text-slate-600'
                        )}>
                          {project.salesEngineer || project.salesperson || '-'}
                        </td>

                        {/* 城市经理 */}
                        <td className={cn(
                          'hidden xl:table-cell px-3 py-2 sm:px-4 sm:py-3 text-xs',
                          theme === 'dashboard' ? 'text-cyan-300/80' : 'text-slate-600'
                        )}>
                          {project.cityManager || project.owner || '-'}
                        </td>

                        {/* 项目类型 */}
                        <td className={cn(
                          'hidden md:table-cell px-3 py-1.5 sm:px-4 sm:py-2 text-xs',
                          theme === 'dashboard' ? 'text-cyan-300/80' : 'text-slate-600'
                        )}>
                          {project.projectType || '-'}
                        </td>

                        {/* 订单金额 */}
                        <td className={cn(
                          'px-3 py-1.5 sm:px-4 sm:py-2 text-right whitespace-nowrap',
                          theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900'
                        )}>
                          <span className={cn(
                            'font-bold text-xs sm:text-sm',
                            activeTab === 'projects' ? 'text-green-400' : activeTab === 'excluded' ? 'text-orange-400' : 'text-purple-400'
                          )}>
                            {project.amount?.toFixed(2) || '0.00'}
                          </span>
                          <span className={cn('text-xs ml-1', theme === 'dashboard' ? 'text-cyan-400/50' : 'text-slate-500')}>
                                万
                              </span>
                        </td>

                        {/* 项目状态 */}
                        <td className={cn('px-3 py-1.5 sm:px-4 sm:py-2 text-center')}>
                          <span className={cn(
                            'inline-block px-2 py-1 rounded text-[10px] sm:text-xs font-medium border',
                            getStatusColor(project.projectStatus)
                          )}>
                            {project.projectStatus || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 合计栏 */}
          <div className={cn(
            'mt-2 px-4 sm:px-6 py-3 border-t',
            theme === 'dashboard'
              ? 'border-cyan-500/20 bg-cyan-500/5'
              : theme === 'dark'
              ? 'border-slate-700 bg-slate-800/50'
              : 'border-slate-200 bg-slate-50'
          )}>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className={cn('flex items-center gap-2', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                <span className={cn('font-medium', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                  项目数量:
                </span>
                <span className={cn('font-bold', theme === 'dashboard' ? 'text-cyan-200' : 'text-slate-900')}>
                  {allProjects.length} 个
                </span>
              </div>
              <div className={cn('flex items-center gap-2', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                <span className={cn('font-medium', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                  合计金额:
                </span>
                <span className={cn(
                  'font-bold text-base sm:text-lg',
                  activeTab === 'projects' ? 'text-green-400' : activeTab === 'excluded' ? 'text-orange-400' : 'text-purple-400'
                )}>
                  {allProjects.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </span>
                <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>
                  万
                </span>
              </div>
              {filterStatus !== 'all' && (
                <div className={cn(
                  'flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg',
                  theme === 'dashboard'
                    ? 'bg-orange-500/10 border border-orange-500/30'
                    : 'bg-orange-50 border border-orange-200'
                )}>
                  <span className={cn('font-medium text-orange-600', theme === 'dashboard' ? 'text-orange-400' : '')}>
                    当前筛选
                  </span>
                  <span className={cn('text-orange-600', theme === 'dashboard' ? 'text-orange-400' : '')}>
                    {filterStatus} 共 {filteredProjects.length} 个
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className={cn(
              'flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 px-3 sm:px-4 py-2 sm:py-2.5 border-t',
              theme === 'dashboard' ? 'border-cyan-500/20' : theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            )}>
              <div className={cn('text-[10px] sm:text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                共 {filteredProjects.length} 条，{totalPages} 页
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* 首页 */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    theme === 'dashboard'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  )}
                  title="首页"
                >
                  &laquo;
                </button>
                {/* 上一页 */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    theme === 'dashboard'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  )}
                >
                  &lsaquo;
                </button>

                {/* 页码列表 */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5; // 最多显示5个页码

                    if (totalPages <= maxVisible) {
                      // 总页数少于等于最大显示数，显示所有页码
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={cn(
                              'px-2 py-1 rounded text-xs font-medium transition-all',
                              currentPage === i
                                ? theme === 'dashboard'
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : theme === 'dashboard'
                                ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            )}
                          >
                            {i}
                          </button>
                        );
                      }
                    } else {
                      // 总页数较多，智能显示页码
                      // 始终显示第一页
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className={cn(
                            'px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all',
                            currentPage === 1
                              ? theme === 'dashboard'
                                ? 'bg-cyan-500 text-white'
                                : 'bg-blue-500 text-white'
                              : theme === 'dashboard'
                              ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          )}
                        >
                          1
                        </button>
                      );

                      // 显示省略号（如果需要）
                      if (currentPage > 3) {
                        pages.push(
                          <span key="ellipsis1" className={cn(
                            'px-2 py-0.5 text-[10px]',
                            theme === 'dashboard' ? 'text-cyan-400/50' : 'text-slate-400'
                          )}>
                            ...
                          </span>
                        );
                      }

                      // 显示当前页附近的页码
                      const startPage = Math.max(2, currentPage - 1);
                      const endPage = Math.min(totalPages - 1, currentPage + 1);
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={cn(
                              'px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all',
                              currentPage === i
                                ? theme === 'dashboard'
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : theme === 'dashboard'
                                ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            )}
                          >
                            {i}
                          </button>
                        );
                      }

                      // 显示省略号（如果需要）
                      if (currentPage < totalPages - 2) {
                        pages.push(
                          <span key="ellipsis2" className={cn(
                            'px-2 py-0.5 text-[10px]',
                            theme === 'dashboard' ? 'text-cyan-400/50' : 'text-slate-400'
                          )}>
                            ...
                          </span>
                        );
                      }

                      // 始终显示最后一页
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className={cn(
                            'px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all',
                            currentPage === totalPages
                              ? theme === 'dashboard'
                                ? 'bg-cyan-500 text-white'
                                : 'bg-blue-500 text-white'
                              : theme === 'dashboard'
                              ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          )}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>

                {/* 下一页 */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    theme === 'dashboard'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  )}
                >
                  &rsaquo;
                </button>
                {/* 末页 */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    theme === 'dashboard'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  )}
                  title="末页"
                >
                  &raquo;
                </button>

                {/* 跳转 */}
                <div className="flex items-center gap-1 ml-2">
                  <span className={cn('text-[10px]', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                    跳转
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage === totalPages ? totalPages : ''}
                    placeholder={currentPage.toString()}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className={cn(
                      'w-10 sm:w-12 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded border text-center focus:outline-none focus:ring-2',
                      theme === 'dashboard'
                        ? 'bg-slate-900/50 border-cyan-500/30 text-white focus:ring-cyan-500'
                        : theme === 'dark'
                        ? 'bg-slate-800 border-slate-600 text-white focus:ring-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500'
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
