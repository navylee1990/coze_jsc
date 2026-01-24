'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowRight, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Activity, Clock, Target, DollarSign, Zap, Flame, Lightbulb, Compass, BarChart3, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import ProjectExclusionList from '@/components/ProjectExclusionList';

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
    name: string;
    amount: number;
    probability: 'high' | 'medium' | 'low';
    health: 'high' | 'medium' | 'low';
    isOnTrack: boolean;
    delayDays?: number;
    isNew?: boolean;
    isDelayed?: boolean;
    isRisk?: boolean;
  }[];
  excludedProjects?: {
    id: number;
    name: string;
    amount: number;
    excludeReason: 'progress_low' | 'delayed' | 'pending_approval' | 'risk_high' | 'not_confirmed';
    excludeReasonText: string;
    currentProgress: number;
    expectedProgress: number;
    probability: 'high' | 'medium' | 'low';
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
    '0-30天': SupportLevel;
    '1-3月': SupportLevel;
    '3-6月': SupportLevel;
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
    '0-30天': {
      period: '0-30天',
      label: '核心支撑期',
      amount: 520,
      coverage: 52,
      status: 'red',
      target: 1000,
      gap: 480,
      projects: [
        {
          id: 1,
          name: '北京协和医院净化项目',
          amount: 350,
          probability: 'high',
          health: 'high',
          isOnTrack: true
        },
        {
          id: 2,
          name: '上海外国语学校净水项目',
          amount: 170,
          probability: 'medium',
          health: 'medium',
          isOnTrack: false,
          delayDays: 12
        }
      ],
      excludedProjects: [
        {
          id: 101,
          name: '天津天河城净水项目',
          amount: 280,
          excludeReason: 'progress_low',
          excludeReasonText: '项目进度滞后，仅完成35%进度',
          currentProgress: 35,
          expectedProgress: 80,
          probability: 'high'
        },
        {
          id: 102,
          name: '广州白云机场航站楼项目',
          amount: 200,
          excludeReason: 'pending_approval',
          excludeReasonText: '商务合同待审批，预计下周完成',
          currentProgress: 60,
          expectedProgress: 70,
          probability: 'high'
        }
      ]
    },
    '1-3月': {
      period: '1-3月',
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
          isOnTrack: true
        },
        {
          id: 4,
          name: '深圳四季酒店净化项目',
          amount: 140,
          probability: 'medium',
          health: 'medium',
          isOnTrack: true
        },
        {
          id: 5,
          name: '杭州阿里巴巴园区项目',
          amount: 130,
          probability: 'low',
          health: 'low',
          isOnTrack: false,
          delayDays: 8
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
          probability: 'medium'
        }
      ]
    },
    '3-6月': {
      period: '3-6月',
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
          isNew: true
        },
        {
          id: 7,
          name: '西安交通大学项目',
          amount: 80,
          probability: 'low',
          health: 'low',
          isOnTrack: false,
          isRisk: true
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
      title: '0-30天：推进延迟项目',
      description: '上海外国语学校、杭州阿里巴巴园区项目已延迟12天，优先推进可释放+310万支撑',
      impact: '+310 万',
      owner: '李娜、王强',
      deadline: '本周内'
    },
    {
      id: '2',
      type: 'supplement',
      priority: 2,
      title: '0-30天：开发新项目',
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
      '0-30天': {
        period: '0-30天',
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
      '1-3月': {
        period: '1-3月',
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
      '3-6月': {
        period: '3-6月',
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
        title: '0-30天：开发新项目',
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
      '0-30天': {
        period: '0-30天',
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
      '1-3月': {
        period: '1-3月',
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
      '3-6月': {
        period: '3-6月',
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
      '0-30天': {
        period: '0-30天',
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
      '1-3月': {
        period: '1-3月',
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
      '3-6月': {
        period: '3-6月',
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
        title: '0-30天：开发新项目',
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
      '0-30天': {
        period: '0-30天',
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
      '1-3月': {
        period: '1-3月',
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
      '3-6月': {
        period: '3-6月',
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
        title: '0-30天：推进延迟项目',
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
      '0-30天': {
        period: '0-30天',
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
      '1-3月': {
        period: '1-3月',
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
      '3-6月': {
        period: '3-6月',
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

export default function FutureSupportAdequacyPanel({
  data: customData,
  theme = 'dark',
  defaultRegion = 'national'
}: FutureSupportAdequacyPanelProps) {
  // 区域选择状态
  const [selectedRegion, setSelectedRegion] = useState<Region>(defaultRegion);
  const [collapsedPeriods, setCollapsedPeriods] = useState<Set<string>>(new Set());

  // 合并默认数据和自定义数据
  const allRegionData = { ...regionData, ...customData };
  const data = allRegionData[selectedRegion] || regionData.national; // 默认回退到全国数据

  // 获取状态颜色
  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
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

  // 获取概率颜色
  const getProbabilityColor = (probability: 'high' | 'medium' | 'low') => {
    switch (probability) {
      case 'high':
        return theme === 'dashboard' ? 'bg-cyan-500' : 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return theme === 'dashboard' ? 'bg-slate-500' : 'bg-gray-500';
    }
  };

  // 获取健康度颜色
  const getHealthColor = (health: 'high' | 'medium' | 'low') => {
    switch (health) {
      case 'high':
        return theme === 'dashboard' ? 'text-cyan-400' : theme === 'dark' ? 'text-green-500' : 'text-green-600';
      case 'medium':
        return theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600';
      case 'low':
        return theme === 'dark' ? 'text-red-500' : 'text-red-600';
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
    { name: '0-30天', amount: data.supportStructure['0-30天'].amount, coverage: data.supportStructure['0-30天'].coverage, status: data.supportStructure['0-30天'].status },
    { name: '1-3月', amount: data.supportStructure['1-3月'].amount, coverage: data.supportStructure['1-3月'].coverage, status: data.supportStructure['1-3月'].status },
    { name: '3-6月', amount: data.supportStructure['3-6月'].amount, coverage: data.supportStructure['3-6月'].coverage, status: data.supportStructure['3-6月'].status }
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
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            theme === 'dashboard'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-green-500/20 text-green-700'
          )}>未来90天</span>
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
                    ? 'bg-slate-800/60 border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20 focus:ring-cyan-500'
                    : theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 focus:ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 focus:ring-blue-500'
                )}
              >
                {Object.entries(regionConfig).map(([key, config]) => (
                  <option key={key} value={key}>
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
            <span className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>驾驶舱模式</span>
            <BarChart3 className={cn('w-4 h-4', theme === 'dashboard' ? 'text-cyan-400' : 'text-slate-600')} />
          </div>
        </div>
      </div>

      {/* 主内容区 - 时间段支撑结构 */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {(['0-30天', '1-3月', '3-6月'] as const).map((period, index) => {
              const level = data.supportStructure[period];
              const statusColor = getStatusColor(level.status);
              return (
                <div
                  key={period}
                  className={cn(
                    'p-4 rounded-lg relative border transition-all duration-300',
                    theme === 'dashboard'
                      ? cn(
                          'bg-slate-800/40 backdrop-blur-sm',
                          index === 0
                            ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : index === 1
                            ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                            : 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        )
                      : theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700/50'
                      : `bg-gradient-to-b ${index === 0 ? 'from-red-50/50 to-slate-50/30' : index === 1 ? 'from-yellow-50/50 to-slate-50/30' : 'from-green-50/50 to-slate-50/30'}`
                  )}
                >
                  {/* 时间段标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      'text-sm font-semibold',
                      theme === 'dashboard'
                        ? 'text-cyan-200 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                        : 'text-slate-900'
                    )}>{period}</span>
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      statusColor.bg,
                      theme === 'dashboard' && 'shadow-[0_0_8px_currentColor]'
                    )} />
                  </div>

                  {/* 支撑进度条 */}
                  <div className="mb-3">
                    <div className={cn('h-3 rounded-full overflow-hidden mb-2', theme === 'dashboard' ? 'bg-slate-700/50' : 'bg-slate-200')}>
                      <div
                        className={cn(
                          'h-full transition-all duration-500',
                          statusColor.bg,
                          theme === 'dashboard' && 'shadow-[0_0_10px_currentColor]'
                        )}
                        style={{ width: `${Math.min(level.coverage, 100)}%` }}
                      />
                    </div>
                    <div className={cn('flex items-center justify-between text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>
                      <span className={theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600'}>
                        支撑 <span className={cn('font-semibold', theme === 'dashboard' ? 'text-cyan-200' : 'text-slate-900')}>{level.amount.toLocaleString()}</span>万
                      </span>
                      <span className={theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600'}>
                        目标 <span className={cn('font-semibold', theme === 'dashboard' ? 'text-cyan-200' : 'text-slate-900')}>{level.target.toLocaleString()}</span>万
                      </span>
                    </div>
                  </div>

                  {/* 覆盖度 */}
                  <div className="flex items-center justify-center mb-2">
                    <span className={cn('text-xs', theme === 'dashboard' ? 'text-cyan-400/70' : 'text-slate-600')}>覆盖度</span>
                    <span className={cn(
                      'text-lg font-bold ml-2',
                      statusColor.text,
                      theme === 'dashboard' && 'drop-shadow-[0_0_8px_currentColor]'
                    )}>{level.coverage}%</span>
                  </div>

                  {/* 针对性建议 */}
                  {level.coverage < 70 && (
                    <div className={cn(
                      'p-2 rounded text-[10px] mb-2 border',
                      theme === 'dashboard'
                        ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : theme === 'dark'
                        ? 'bg-red-500/20 border border-red-500/30'
                        : 'bg-red-50 border border-red-200'
                    )}>
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className={cn(
                          'w-3 h-3',
                          theme === 'dashboard'
                            ? 'text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                            : 'text-red-600'
                        )} />
                        <span className={cn(
                          'font-bold',
                          theme === 'dashboard'
                            ? 'text-red-300'
                            : 'text-red-700'
                        )}>支撑不足</span>
                      </div>
                      <div className={cn(
                        theme === 'dashboard' ? 'text-red-200/80' : 'text-slate-700'
                      )}>
                        {level.coverage < 50 && '紧急：需新增' + (level.target - level.amount) + '万（开发新项目）'}
                        {level.coverage >= 50 && level.coverage < 70 && '建议：推进' + level.projects.filter(p => !p.isOnTrack).length + '个延迟项目'}
                      </div>
                    </div>
                  )}

                  {/* Top项目列表 */}
                  <div className="space-y-2">
                    {level.projects.slice(0, 3).map((project, pIndex) => (
                      <div
                        key={project.id}
                        className={cn(
                          'p-1.5 rounded text-xs relative border transition-all duration-200',
                          theme === 'dashboard'
                            ? 'bg-slate-800/30 border-cyan-500/20 hover:border-cyan-500/40'
                            : theme === 'dark'
                            ? 'bg-slate-700/50'
                            : 'bg-white/60'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            'font-medium truncate flex-1 mr-2',
                            theme === 'dashboard'
                              ? 'text-cyan-100'
                              : 'text-slate-900'
                          )}>{project.name}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {project.isNew && <span className={cn(
                              'px-1 rounded text-[10px]',
                              theme === 'dashboard'
                                ? 'bg-blue-500/40 text-blue-300 border border-blue-500/40'
                                : 'bg-blue-500 text-white'
                            )}>新</span>}
                            {project.isDelayed && <span className={cn(
                              'px-1 rounded text-[10px]',
                              theme === 'dashboard'
                                ? 'bg-red-500/40 text-red-300 border border-red-500/40'
                                : 'bg-red-500 text-white'
                            )}>延</span>}
                            {project.isRisk && <span className={cn(
                              'px-1 rounded text-[10px]',
                              theme === 'dashboard'
                                ? 'bg-orange-500/40 text-orange-300 border border-orange-500/40'
                                : 'bg-orange-500 text-white'
                            )}>险</span>}
                            <span className={cn(
                              'font-bold',
                              theme === 'dashboard'
                                ? 'text-cyan-200'
                                : 'text-slate-900'
                            )}>{project.amount}万</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              getProbabilityColor(project.probability),
                              theme === 'dashboard' && 'shadow-[0_0_6px_currentColor]'
                            )} />
                            <span className={cn(
                              'text-[10px]',
                              theme === 'dashboard'
                                ? 'text-cyan-400/70'
                                : 'text-slate-600'
                            )}>{project.probability === 'high' ? '高' : project.probability === 'medium' ? '中' : '低'}概率</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              'text-[10px]',
                              getHealthColor(project.health),
                              theme === 'dashboard' && 'drop-shadow-[0_0_6px_currentColor]'
                            )}>
                              {project.health === 'high' ? '健康' : project.health === 'medium' ? '一般' : '风险'}
                            </span>
                            {!project.isOnTrack && project.delayDays && (
                              <span className={cn(
                                'text-[10px]',
                                theme === 'dashboard'
                                  ? 'text-red-400'
                                  : 'text-red-600'
                              )}>延迟{project.delayDays}天</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 未统计项目列表 */}
                  {(level.excludedProjects && level.excludedProjects.length > 0) && (
                    <ProjectExclusionList
                      excludedProjects={level.excludedProjects}
                      theme={theme}
                      collapsed={collapsedPeriods.has(period)}
                      onToggle={() => {
                        setCollapsedPeriods(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(period)) {
                            newSet.delete(period);
                          } else {
                            newSet.add(period);
                          }
                          return newSet;
                        });
                      }}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
    );
}
