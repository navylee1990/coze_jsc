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
  period: string; // '本月' | '本季度' | '半年度'
  label: string;
  amount: number;
  coverage: number; // 覆盖度百分比
  status: 'green' | 'yellow' | 'red';
  target: number;
  gap: number;
  projects: {
    id: number;
    region: string; // 大区
    cityManager: string; // 城市经理
    salesEngineer: string; // 销售工程师
    projectName: string; // 项目名称
    projectType: '买断' | '租赁'; // 项目类型
    orderAmount: number; // 订单金额（万元）
    estimatedOrderTime: string; // 预计下单时间（YYYY-MM-DD）
    remark: '已下单' | '未下单'; // 备注
    projectStatus: string; // 项目状态（跟进中、已投标未公示等）
    projectPhase: '项目新建' | '初步接洽' | '需求意向' | '方案设计' | '项目采购' | '项目合同' | '赢单'; // 项目阶段
    lastUpdated: string; // 最后更新时间
  }[];
  excludedProjects?: {
    id: number;
    region: string; // 大区
    cityManager: string; // 城市经理
    salesEngineer: string; // 销售工程师
    projectName: string; // 项目名称
    projectType: '买断' | '租赁'; // 项目类型
    orderAmount: number; // 订单金额（万元）
    estimatedOrderTime: string; // 预计下单时间（YYYY-MM-DD）
    remark: '已下单' | '未下单'; // 备注
    projectStatus: string; // 项目状态
    projectPhase: '项目新建' | '初步接洽' | '需求意向' | '方案设计' | '项目采购' | '项目合同' | '赢单'; // 项目阶段
    lastUpdated: string; // 最后更新时间
    excludeReason: string; // 未统计原因
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
      amount: 500, // 已统计项目总和
      coverage: 50, // 500/1000
      status: 'red',
      target: 1000,
      gap: 500, // 1000 - 500
      projects: [
        {
          id: 1,
          region: '华北区',
          cityManager: '张伟',
          salesEngineer: '李明',
          projectName: '北京协和医院净化项目',
          projectType: '买断',
          orderAmount: 150,
          estimatedOrderTime: '2025-02-15',
          remark: '未下单',
          projectStatus: '跟进中',
          projectPhase: '项目采购',
          lastUpdated: '2025-01-24'
        },
        {
          id: 2,
          region: '华东区',
          cityManager: '王强',
          salesEngineer: '刘芳',
          projectName: '上海外国语学校净水项目',
          projectType: '租赁',
          orderAmount: 100,
          estimatedOrderTime: '2025-02-28',
          remark: '未下单',
          projectStatus: '已投标未公示',
          projectPhase: '项目合同',
          lastUpdated: '2025-01-24'
        },
        {
          id: 3,
          region: '华南区',
          cityManager: '陈明',
          salesEngineer: '赵敏',
          projectName: '广州天河城购物中心净水项目',
          projectType: '买断',
          orderAmount: 80,
          estimatedOrderTime: '2025-03-01',
          remark: '未下单',
          projectStatus: '跟进中',
          projectPhase: '项目采购',
          lastUpdated: '2025-01-24'
        },
        {
          id: 4,
          region: '华南区',
          cityManager: '孙丽',
          salesEngineer: '周杰',
          projectName: '深圳华为总部园区项目',
          projectType: '租赁',
          orderAmount: 60,
          estimatedOrderTime: '2025-03-05',
          remark: '未下单',
          projectStatus: '方案设计中',
          projectPhase: '方案设计',
          lastUpdated: '2025-01-24'
        },
        {
          id: 5,
          region: '西南区',
          cityManager: '吴刚',
          salesEngineer: '郑华',
          projectName: '成都天府国际机场航站楼项目',
          projectType: '买断',
          orderAmount: 60,
          estimatedOrderTime: '2025-02-20',
          remark: '未下单',
          projectStatus: '跟进中',
          projectPhase: '项目采购',
          lastUpdated: '2025-01-24'
        },
        {
          id: 6,
          region: '华东区',
          cityManager: '王强',
          salesEngineer: '刘芳',
          projectName: '南京河西万达广场项目',
          projectType: '买断',
          orderAmount: 50,
          estimatedOrderTime: '2025-03-10',
          remark: '未下单',
          projectStatus: '需求确认中',
          projectPhase: '需求意向',
          lastUpdated: '2025-01-24'
        },
        {
          id: 7,
          region: '华北区',
          cityManager: '张伟',
          salesEngineer: '李明',
          projectName: '天津天河城净水项目',
          projectType: '租赁',
          orderAmount: 40,
          estimatedOrderTime: '2025-03-15',
          remark: '未下单',
          projectStatus: '初步接洽',
          projectPhase: '初步接洽',
          lastUpdated: '2025-01-24'
        },
        {
          id: 8,
          region: '华南区',
          cityManager: '陈明',
          salesEngineer: '赵敏',
          projectName: '广州白云机场航站楼项目',
          projectType: '买断',
          orderAmount: 30,
          estimatedOrderTime: '2025-03-20',
          remark: '已下单',
          projectStatus: '赢单',
          projectPhase: '赢单',
          lastUpdated: '2025-01-24'
        },
        {
          id: 9,
          region: '华北区',
          cityManager: '张伟',
          salesEngineer: '李明',
          projectName: '北京大兴国际机场配套项目',
          projectType: '租赁',
          orderAmount: 25,
          estimatedOrderTime: '2025-03-25',
          remark: '未下单',
          projectStatus: '跟进中',
          projectPhase: '项目采购',
          lastUpdated: '2025-01-24'
        },
        {
          id: 10,
          region: '华东区',
          cityManager: '王强',
          salesEngineer: '刘芳',
          projectName: '杭州阿里巴巴园区项目',
          projectType: '买断',
          orderAmount: 20,
          estimatedOrderTime: '2025-03-30',
          remark: '未下单',
          projectStatus: '赢单',
          projectPhase: '赢单',
          lastUpdated: '2025-01-24'
        }
      ],
      excludedProjects: [
        {
          id: 101,
          region: '华北区',
          cityManager: '张伟',
          salesEngineer: '李明',
          projectName: '天津天河城净水项目（备用）',
          projectType: '租赁',
          orderAmount: 100,
          estimatedOrderTime: '2025-04-01',
          remark: '未下单',
          projectStatus: '跟进中',
          projectPhase: '初步接洽',
          lastUpdated: '2025-01-24',
          excludeReason: '项目进度滞后'
        },
        {
          id: 102,
          region: '华南区',
          cityManager: '陈明',
          salesEngineer: '赵敏',
          projectName: '广州白云机场航站楼项目（备用）',
          projectType: '买断',
          orderAmount: 80,
          estimatedOrderTime: '2025-04-15',
          remark: '未下单',
          projectStatus: '待审批',
          projectPhase: '方案设计',
          lastUpdated: '2025-01-24',
          excludeReason: '商务合同待审批'
        },
        {
          id: 103,
          region: '华北区',
          cityManager: '张伟',
          salesEngineer: '李明',
          projectName: '北京大兴国际机场配套项目（备用）',
          projectType: '租赁',
          orderAmount: 60,
          estimatedOrderTime: '2025-04-20',
          remark: '未下单',
          projectStatus: '跟进中',
          projectPhase: '需求意向',
          lastUpdated: '2025-01-24',
          excludeReason: '客户决策延迟'
        }
      ]
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
  ],
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
  northwest: {
    coreMetrics: {
      coverage: 60,
      coverageStatus: 'red',
      targetAmount: 100,
      supportAmount: 60,
      gap: 40,
      trend: 'stable',
      trendValue: 0
    },
    supportStructure: {
      '本月': { period: '本月', label: '核心支撑期', amount: 30, coverage: 50, status: 'red', target: 60, gap: 30, projects: [], excludedProjects: [] },
      '本季度': { period: '本季度', label: '中期支撑期', amount: 20, coverage: 67, status: 'yellow', target: 30, gap: 10, projects: [], excludedProjects: [] },
      '半年度': { period: '半年度', label: '储备支撑期', amount: 10, coverage: 100, status: 'green', target: 10, gap: 0, projects: [], excludedProjects: [] }
    },
    diagnosticIssues: [],
    timeline: [],
    actions: []
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
        <div className="grid grid-cols-3 gap-3">
          {(['本月', '本季度', '半年度'] as const).map((period, index) => {
            const level = data.supportStructure[period];
            const statusColor = getStatusColor(level.status, theme);
            const periodConfigInfo = periodConfig[period];

            // 计算统计项目总金额
            const projectsTotalAmount = level.projects.reduce((sum, p) => sum + p.amount, 0);
            // 计算未统计项目总金额
            const excludedProjectsTotalAmount = level.excludedProjects
              ? level.excludedProjects.reduce((sum, p) => sum + p.amount, 0)
              : 0;
            // 加上未统计后的覆盖率
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      'text-sm font-bold',
                      theme === 'dashboard'
                        ? 'text-cyan-200 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                        : 'text-slate-900'
                    )}>{period}</h4>
                    <ChevronRight className={cn(
                      'w-4 h-4',
                      theme === 'dashboard' ? 'text-cyan-400/50' : 'text-slate-400'
                    )} />
                    {newDevNeeded > 0 && (
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        theme === 'dashboard'
                          ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                          : 'bg-yellow-100 text-yellow-700'
                      )}>
                        需新开发{newDevNeeded.toFixed(0)}万
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
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
                          'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all',
                          theme === 'dashboard'
                            ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        )}
                        title="批量催单"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{level.excludedProjects?.length || 0}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 核心指标 - 紧凑布局 */}
                <div className="space-y-2">
                  {/* 目标/支撑/覆盖率 - 单行显示 */}
                  <div className="flex items-center justify-between text-sm gap-2">
                    <div className="flex items-center gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>目标</span>
                      <span className={cn('font-semibold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                        {level.target.toLocaleString()}万
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>支撑</span>
                      <span className={cn('font-semibold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                        {level.amount.toLocaleString()}万
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>覆盖率</span>
                      <span className={cn('font-semibold', level.coverage >= 80 ? 'text-green-400' : level.coverage > 50 ? 'text-yellow-400' : 'text-red-400')}>
                        {level.coverage}%
                      </span>
                    </div>
                  </div>

                  {/* 覆盖度进度条 */}
                  <div className={cn('w-full h-1.5 rounded-full overflow-hidden', theme === 'dashboard' ? 'bg-slate-700/50' : 'bg-slate-200')}>
                    <div
                      className={`h-full transition-all duration-500 ${
                        level.coverage >= 80 ? 'bg-green-500' : level.coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(level.coverage, 100)}%` }}
                    />
                  </div>

                  {/* 缺口 + 项目数 - 单行显示 */}
                  <div className="flex items-center justify-between text-sm pt-1">
                    <div className="flex items-center gap-1">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>缺口</span>
                      <span className={`text-sm font-bold ${level.gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {level.gap > 0 ? `${level.gap}` : `+${Math.abs(level.gap)}`}
                      </span>
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>项目</span>
                      <span className={cn('font-semibold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                        {level.projects.length}个
                      </span>
                      <span className={cn('font-semibold text-green-400', theme === 'dashboard' ? 'text-green-300' : 'text-green-600')}>
                        {projectsTotalAmount}万
                      </span>
                    </div>
                  </div>

                  {/* 未统计项目数 + 金额 */}
                  {level.excludedProjects && level.excludedProjects.length > 0 && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>未统计</span>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'font-semibold text-orange-400',
                            theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600'
                          )}>{level.excludedProjects.length}个</span>
                          <span className={cn(
                            'font-semibold text-orange-400',
                            theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600'
                          )}>{excludedProjectsTotalAmount}万</span>
                        </div>
                      </div>
                      {/* 加上未统计后的覆盖率 */}
                      <div className="flex justify-between text-xs">
                        <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>加上未统计</span>
                        <span className={cn(
                          'font-semibold',
                          totalCoverage >= 80 ? 'text-green-400' : totalCoverage > 50 ? 'text-yellow-400' : 'text-red-400'
                        )}>
                          {totalCoverage}%
                        </span>
                      </div>
                      {/* 不达标大区 */}
                      {underachievingRegions.length > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>不达标</span>
                          <span className={cn(
                            'font-semibold text-red-400',
                            theme === 'dashboard' ? 'text-red-300' : 'text-red-600'
                          )}>
                            {underachievingRegions.join(', ')}
                          </span>
                        </div>
                      )}
                    </>
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
  // 翻页状态
  const [projectsCurrentPage, setProjectsCurrentPage] = useState(1);
  const [excludedProjectsCurrentPage, setExcludedProjectsCurrentPage] = useState(1);
  const projectsPerPage = 10; // 每页显示10个项目（数据量约30条）

  // 催单提示状态
  const [urgeMessage, setUrgeMessage] = useState<{ show: boolean; projectName: string }>({ show: false, projectName: '' });

  // 处理催单
  const handleUrgeProject = (project: { projectName: string }) => {
    setUrgeMessage({ show: true, projectName: project.projectName });
    setTimeout(() => {
      setUrgeMessage({ show: false, projectName: '' });
    }, 2000);
  };

  if (!isOpen) return null;

  const periodInfo = periodConfig[period];

  // 计算统计项目的分页数据
  const projectsTotalPages = Math.ceil(data.projects.length / projectsPerPage);
  const projectsStartIndex = (projectsCurrentPage - 1) * projectsPerPage;
  const projectsEndIndex = projectsStartIndex + projectsPerPage;
  const displayedProjects = data.projects.slice(projectsStartIndex, projectsEndIndex);

  // 计算未统计项目的分页数据
  const excludedProjectsTotalPages = data.excludedProjects
    ? Math.ceil(data.excludedProjects.length / projectsPerPage)
    : 0;
  const excludedProjectsStartIndex = (excludedProjectsCurrentPage - 1) * projectsPerPage;
  const excludedProjectsEndIndex = excludedProjectsStartIndex + projectsPerPage;
  const displayedExcludedProjects = data.excludedProjects
    ? data.excludedProjects.slice(excludedProjectsStartIndex, excludedProjectsEndIndex)
    : [];

  // 重置页码（当弹窗打开或数据变化时）
  useEffect(() => {
    setProjectsCurrentPage(1);
    setExcludedProjectsCurrentPage(1);
  }, [isOpen, period]);

  // 计算合计
  const totals = {
    target: data.target,
    amount: data.amount,
    gap: data.gap,
    coverage: data.coverage
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className={cn(
        'relative w-full max-w-5xl max-h-[90vh] border-2 rounded-2xl overflow-hidden transition-all',
        theme === 'dashboard'
          ? 'bg-slate-900/80 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
          : theme === 'dark'
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-slate-200'
      )}>
        {/* 标题栏 */}
        <div className={cn(
          'flex items-center justify-between px-6 py-4 border-b',
          theme === 'dashboard'
            ? 'border-cyan-500/30 bg-slate-900/80'
            : theme === 'dark'
            ? 'border-slate-700 bg-slate-800'
            : 'border-slate-200 bg-slate-50'
        )}>
          <div className="flex items-center gap-4">
            <Activity className={cn(
              'w-5 h-5',
              theme === 'dashboard'
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                : 'text-green-600'
            )} />
            <div>
              <h2 className={cn(
                'text-xl font-bold flex items-center gap-2',
                theme === 'dashboard'
                  ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                  : 'text-slate-900'
              )}>
                {period} - {periodInfo?.label || '支撑详情'}
              </h2>
              <p className={cn(
                'text-sm mt-1',
                theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600'
              )}>
                项目明细与进度跟踪 · 共{data.projects.length + (data.excludedProjects?.length || 0)}个项目
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              theme === 'dashboard'
                ? 'bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30'
                : theme === 'dark'
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 项目分类统计和承诺完成提醒 */}
        <div className={cn(
          'px-6 py-3 border-b',
          theme === 'dashboard'
            ? 'border-cyan-500/20 bg-slate-900/60'
            : theme === 'dark'
            ? 'border-slate-700 bg-slate-800/50'
            : 'border-slate-200 bg-slate-50'
        )}>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                已完成（赢单）：
              </span>
              <span className={cn('font-bold', theme === 'dashboard' ? 'text-green-400' : 'text-green-700')}>
                {data.projects.filter(p => p.projectPhase === '赢单').reduce((sum, p) => sum + p.orderAmount, 0).toLocaleString()}万
                ({data.projects.filter(p => p.projectPhase === '赢单').length}个)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                预测完成（采购+合同）：
              </span>
              <span className={cn('font-bold', theme === 'dashboard' ? 'text-blue-400' : 'text-blue-700')}>
                {data.projects.filter(p => p.projectPhase === '项目采购' || p.projectPhase === '项目合同').reduce((sum, p) => sum + p.orderAmount, 0).toLocaleString()}万
                ({data.projects.filter(p => p.projectPhase === '项目采购' || p.projectPhase === '项目合同').length}个)
              </span>
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-medium animate-pulse',
                theme === 'dashboard'
                  ? 'bg-orange-500/30 text-orange-300 border border-orange-500/30'
                  : 'bg-orange-100 text-orange-700'
              )}>
                承诺完成
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                储备（初步+需求+方案）：
              </span>
              <span className={cn('font-bold', theme === 'dashboard' ? 'text-yellow-400' : 'text-yellow-700')}>
                {data.projects.filter(p => ['初步接洽', '需求意向', '方案设计'].includes(p.projectPhase)).reduce((sum, p) => sum + p.orderAmount, 0).toLocaleString()}万
                ({data.projects.filter(p => ['初步接洽', '需求意向', '方案设计'].includes(p.projectPhase)).length}个)
              </span>
            </div>
          </div>
        </div>

        {/* 催单提示消息 */}
        {urgeMessage.show && (
          <div className={cn(
            'mx-6 mt-4 p-3 rounded-lg border flex items-center gap-3 animate-pulse',
            theme === 'dashboard'
              ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
              : 'bg-orange-100 border-orange-300 text-orange-800'
          )}>
            <Zap className={cn('w-5 h-5 flex-shrink-0', theme === 'dashboard' ? 'text-orange-300' : 'text-orange-600')} />
            <span className="text-sm font-medium">
              已向【{urgeMessage.projectName}】发送催单提醒
            </span>
          </div>
        )}

        {/* 合计数据栏 */}
        <div className={cn(
          'px-6 py-4 border-b',
          theme === 'dashboard'
            ? 'border-cyan-500/20 bg-cyan-500/10'
            : theme === 'dark'
            ? 'border-slate-700 bg-slate-800/50'
            : 'border-slate-200 bg-slate-50'
        )}>
          <div className="grid grid-cols-4 gap-4">
            <div className={cn(
              'text-center p-3 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-xs mb-1', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>目标</div>
              <div className={cn('text-2xl font-bold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                {totals.target.toLocaleString()}
              </div>
              <div className={cn('text-xs mt-1', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万元</div>
            </div>
            <div className={cn(
              'text-center p-3 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-xs mb-1', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>支撑</div>
              <div className={cn('text-2xl font-bold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                {totals.amount.toLocaleString()}
              </div>
              <div className={cn('text-xs mt-1', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万元</div>
            </div>
            <div className={cn(
              'text-center p-3 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-xs mb-1', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>缺口</div>
              <div className={cn('text-2xl font-bold', totals.gap > 0 ? 'text-red-400' : 'text-green-400')}>
                {totals.gap > 0 ? `${totals.gap}` : `+${Math.abs(totals.gap)}`}
              </div>
              <div className={cn('text-xs mt-1', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>万元</div>
            </div>
            <div className={cn(
              'text-center p-3 rounded-lg',
              theme === 'dashboard'
                ? 'bg-slate-900/50 border border-cyan-500/20'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-white border border-slate-200'
            )}>
              <div className={cn('text-xs mb-1', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>覆盖度</div>
              <div className={cn('text-2xl font-bold', totals.coverage >= 80 ? 'text-green-400' : totals.coverage >= 50 ? 'text-yellow-400' : 'text-red-400')}>
                {totals.coverage}%
              </div>
              <div className={cn('text-xs mt-1', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>支撑达成</div>
            </div>
          </div>
        </div>

        {/* 项目列表 */}
        <div className={cn('p-6 overflow-y-auto', theme === 'dashboard' ? 'max-h-[calc(90vh-250px)]' : 'max-h-[calc(90vh-280px)]')}>
          {/* 统计项目 */}
          <div className="mb-6">
            <h3 className={cn('text-lg font-bold mb-3 flex items-center gap-2', theme === 'dashboard' ? 'text-cyan-200' : 'text-slate-900')}>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              统计项目 ({data.projects.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {displayedProjects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200 h-48 flex flex-col',
                    theme === 'dashboard'
                      ? 'bg-slate-800/40 border-cyan-500/20 hover:border-cyan-500/40'
                      : theme === 'dark'
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  )}
                >
                  {/* 第一行：项目名称和金额 */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 mr-2">
                      <h4 className={cn(
                        'font-semibold text-sm leading-tight',
                        theme === 'dashboard' ? 'text-cyan-100' : 'text-slate-900'
                      )}>{project.projectName}</h4>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={cn('text-lg font-bold', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900')}>
                        {project.orderAmount.toLocaleString()}万
                      </span>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-xs',
                        theme === 'dashboard'
                          ? project.projectType === '买断'
                            ? 'bg-blue-500/40 text-blue-300 border border-blue-500/40'
                            : 'bg-purple-500/40 text-purple-300 border border-purple-500/40'
                          : project.projectType === '买断'
                          ? 'bg-blue-500 text-white'
                          : 'bg-purple-500 text-white'
                      )}>
                        {project.projectType}
                      </span>
                    </div>
                  </div>

                  {/* 第二行：大区、城市经理、销售工程师 */}
                  <div className="flex items-center gap-4 text-xs mb-1">
                    <div className="flex items-center gap-1">
                      <MapPin className={cn('w-3 h-3', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-400')} />
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                        {project.region}
                      </span>
                    </div>
                    <div className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                      经理：{project.cityManager}
                    </div>
                    <div className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                      销售：{project.salesEngineer}
                    </div>
                  </div>

                  {/* 第三行：项目阶段和状态 */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-xs font-medium',
                        theme === 'dashboard'
                          ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                          : 'bg-green-100 text-green-700'
                      )}>
                        {project.projectPhase}
                      </span>
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                        {project.projectStatus}
                      </span>
                    </div>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs',
                      theme === 'dashboard'
                        ? project.remark === '已下单'
                          ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                        : project.remark === '已下单'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {project.remark}
                    </span>
                  </div>

                  {/* 第四行：预计下单时间和最后更新 */}
                  <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-cyan-500/10">
                    <div className="flex items-center gap-1">
                      <Clock className={cn('w-3 h-3', theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-400')} />
                      <span className={cn(theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                        预计：{project.estimatedOrderTime}
                      </span>
                    </div>
                    <div className={cn(theme === 'dashboard' ? 'text-cyan-400/60' : 'text-slate-500')}>
                      更新：{project.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 统计项目翻页控件 */}
            {data.projects.length > projectsPerPage && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-cyan-500/20">
                <button
                  onClick={() => setProjectsCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={projectsCurrentPage === 1}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    theme === 'dashboard'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  )}
                >
                  上一页
                </button>
                <span className={cn('text-sm', theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-700')}>
                  第 {projectsCurrentPage} / {projectsTotalPages} 页
                </span>
                <button
                  onClick={() => setProjectsCurrentPage((prev) => Math.min(projectsTotalPages, prev + 1))}
                  disabled={projectsCurrentPage === projectsTotalPages}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    theme === 'dashboard'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  )}
                >
                  下一页
                </button>
              </div>
            )}
          </div>

          {/* 未统计项目 */}
          {data.excludedProjects && data.excludedProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn('text-lg font-bold flex items-center gap-2', theme === 'dashboard' ? 'text-cyan-200' : 'text-slate-900')}>
                  <XCircle className="w-5 h-5 text-orange-500" />
                  未统计项目 ({data.excludedProjects.length})
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const totalAmount = data.excludedProjects?.reduce((sum, p) => sum + p.amount, 0) || 0;
                    setUrgeMessage({
                      show: true,
                      projectName: `全部未统计项目 (${data.excludedProjects?.length || 0}个)`
                    });
                    setTimeout(() => {
                      setUrgeMessage({ show: false, projectName: '' });
                    }, 2000);
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    theme === 'dashboard'
                      ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  )}
                  title="批量催单提醒"
                >
                  <Zap className="w-3 h-3" />
                  全部催单
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {displayedExcludedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all duration-200 h-48 flex flex-col',
                      theme === 'dashboard'
                        ? 'bg-slate-800/40 border-orange-500/30 hover:border-orange-500/50'
                        : theme === 'dark'
                        ? 'bg-slate-800 border-orange-500/30'
                        : 'bg-orange-50 border-orange-200'
                    )}
                  >
                    {/* 第一行：项目名称和金额 */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 mr-2">
                        <h4 className={cn(
                          'font-semibold text-sm leading-tight',
                          theme === 'dashboard' ? 'text-cyan-100' : 'text-slate-900'
                        )}>{project.projectName}</h4>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={cn(
                          'text-lg font-bold',
                          theme === 'dashboard' ? 'text-cyan-300' : 'text-slate-900'
                        )}>
                          {project.orderAmount.toLocaleString()}万
                        </span>
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-xs',
                          theme === 'dashboard'
                            ? project.projectType === '买断'
                              ? 'bg-blue-500/40 text-blue-300 border border-blue-500/40'
                              : 'bg-purple-500/40 text-purple-300 border border-purple-500/40'
                            : project.projectType === '买断'
                            ? 'bg-blue-500 text-white'
                            : 'bg-purple-500 text-white'
                        )}>
                          {project.projectType}
                        </span>
                      </div>
                    </div>

                    {/* 第二行：大区、城市经理、销售工程师 */}
                    <div className="flex items-center gap-4 text-xs mb-1">
                      <div className="flex items-center gap-1">
                        <MapPin className={cn('w-3 h-3', theme === 'dashboard' ? 'text-orange-400/60' : 'text-slate-400')} />
                        <span className={cn(theme === 'dashboard' ? 'text-orange-400/70' : 'text-slate-600')}>
                          {project.region}
                        </span>
                      </div>
                      <div className={cn(theme === 'dashboard' ? 'text-orange-400/70' : 'text-slate-600')}>
                        经理：{project.cityManager}
                      </div>
                      <div className={cn(theme === 'dashboard' ? 'text-orange-400/70' : 'text-slate-600')}>
                        销售：{project.salesEngineer}
                      </div>
                    </div>

                    {/* 第三行：项目阶段和状态 */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-xs font-medium',
                          theme === 'dashboard'
                            ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                            : 'bg-green-100 text-green-700'
                        )}>
                          {project.projectPhase}
                        </span>
                        <span className={cn(theme === 'dashboard' ? 'text-orange-400/70' : 'text-slate-600')}>
                          {project.projectStatus}
                        </span>
                      </div>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-xs',
                        theme === 'dashboard'
                          ? project.remark === '已下单'
                            ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                            : 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                          : project.remark === '已下单'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {project.remark}
                      </span>
                    </div>

                    {/* 第四行：预计下单时间和最后更新 */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1">
                        <Clock className={cn('w-3 h-3', theme === 'dashboard' ? 'text-orange-400/60' : 'text-slate-400')} />
                        <span className={cn(theme === 'dashboard' ? 'text-orange-400/70' : 'text-slate-600')}>
                          预计：{project.estimatedOrderTime}
                        </span>
                      </div>
                      <div className={cn(theme === 'dashboard' ? 'text-orange-400/60' : 'text-slate-500')}>
                        更新：{project.lastUpdated}
                      </div>
                    </div>

                    {/* 第五行：未统计原因和催单 */}
                    <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-orange-500/10">
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-xs',
                        theme === 'dashboard'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-orange-100 text-orange-700'
                      )}>
                        {project.excludeReason}
                      </span>
                      <button
                        onClick={() => handleUrgeProject(project)}
                        className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all',
                          theme === 'dashboard'
                            ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        )}
                      >
                        <Zap className="w-3 h-3" />
                        催单
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 未统计项目翻页控件 */}
              {data.excludedProjects.length > projectsPerPage && (
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-orange-500/20">
                  <button
                    onClick={() => setExcludedProjectsCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={excludedProjectsCurrentPage === 1}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                      theme === 'dashboard'
                        ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    )}
                  >
                    上一页
                  </button>
                  <span className={cn('text-sm', theme === 'dashboard' ? 'text-orange-300' : 'text-orange-700')}>
                    第 {excludedProjectsCurrentPage} / {excludedProjectsTotalPages} 页
                  </span>
                  <button
                    onClick={() => setExcludedProjectsCurrentPage((prev) => Math.min(excludedProjectsTotalPages, prev + 1))}
                    disabled={excludedProjectsCurrentPage === excludedProjectsTotalPages}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                      theme === 'dashboard'
                        ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    )}
                  >
                    下一页
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
