'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowRight, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Activity, Clock, Target, DollarSign, Zap, Flame, Lightbulb, Compass, BarChart3, ChevronDown, MapPin, TrendingDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';

// 主题类型
type Theme = 'dark' | 'light';

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
        title: '紧急推进',
        description: '立刻推进上海外国语学校、杭州阿里巴巴园区项目（释放 +310 万）',
        impact: '+310 万',
        owner: '李娜、王强',
        deadline: '本周内'
      },
      {
        id: '2',
        type: 'supplement',
        priority: 2,
        title: '补齐支撑',
        description: '需新增 3 个中期储备项目（填补 +180 万缺口）',
        impact: '+180 万',
        owner: '张伟',
        deadline: '15天内'
      },
      {
        id: '3',
        type: 'channel',
        priority: 3,
        title: '渠道动作',
        description: '激活华北渠道代理，本周需新增项目≥4 个',
        impact: '+200 万',
        owner: '刘芳',
        deadline: '本周内'
      },
      {
        id: '4',
        type: 'sop',
        priority: 4,
        title: 'SOP督办',
        description: '陈明、赵敏 SOP 未更新>14天，影响支撑 +120 万',
        impact: '+120 万',
        owner: '张伟',
        deadline: '3天内'
      }
    ]
  },
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
        type: 'supplement',
        priority: 1,
        title: '补齐支撑',
        description: '需新增 2 个中期储备项目（填补 +45 万缺口）',
        impact: '+45 万',
        owner: '张伟',
        deadline: '15天内'
      },
      {
        id: '2',
        type: 'channel',
        priority: 2,
        title: '渠道动作',
        description: '激活河北地区渠道，本周需新增项目≥2 个',
        impact: '+30 万',
        owner: '李娜',
        deadline: '本周内'
      }
    ]
  },
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
    diagnosticIssues: [],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '上海外国语学校净水项目', amount: 170, probability: 'high' },
          { name: '南京鼓楼医院项目', amount: 80, probability: 'medium' }
        ],
        totalAmount: 250
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
          { name: '杭州阿里巴巴园区项目', amount: 130, probability: 'medium' },
          { name: '苏州工业园区项目', amount: 20, probability: 'low' }
        ],
        totalAmount: 150
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
        title: '保持优势',
        description: '当前态势良好，继续保持优势',
        impact: '+40 万',
        owner: '刘芳',
        deadline: '30天内'
      }
    ]
  },
  south: {
    coreMetrics: {
      coverage: 65,
      coverageStatus: 'red',
      targetAmount: 300,
      supportAmount: 195,
      gap: 105,
      trend: 'down',
      trendValue: -8.3
    },
    supportStructure: {
      '0-30天': {
        period: '0-30天',
        label: '核心支撑期',
        amount: 90,
        coverage: 45,
        status: 'red',
        target: 200,
        gap: 110,
        projects: [
          {
            id: 1,
            name: '广州腾讯大厦项目',
            amount: 60,
            probability: 'high',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 2,
            name: '深圳四季酒店净化项目',
            amount: 30,
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
        amount: 65,
        coverage: 65,
        status: 'yellow',
        target: 100,
        gap: 35,
        projects: [
          {
            id: 3,
            name: '珠海长隆度假区项目',
            amount: 35,
            probability: 'medium',
            health: 'high',
            isOnTrack: true
          },
          {
            id: 4,
            name: '东莞松山湖项目',
            amount: 30,
            probability: 'low',
            health: 'low',
            isOnTrack: true
          }
        ]
      },
      '3-6月': {
        period: '3-6月',
        label: '储备支撑期',
        amount: 40,
        coverage: 100,
        status: 'green',
        target: 40,
        gap: 0,
        projects: [
          {
            id: 5,
            name: '海口自贸区项目',
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
        impact: -60,
        reason: '1个项目延迟超过15天',
        riskLevel: 'red'
      },
      {
        id: '2',
        type: 'reserve_shortage',
        name: '储备新增不足',
        impact: -35,
        reason: '本月新增储备项目仅1个，低于目标3个',
        riskLevel: 'orange'
      }
    ],
    timeline: [
      {
        period: 'Week 1',
        label: 'Week 1',
        projects: [
          { name: '广州腾讯大厦项目', amount: 60, probability: 'high' }
        ],
        totalAmount: 60
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
          { name: '深圳四季酒店净化项目', amount: 30, probability: 'medium' }
        ],
        totalAmount: 30
      },
      {
        period: '1-3 Month',
        label: '1-3 Month',
        projects: [
          { name: '珠海长隆度假区项目', amount: 35, probability: 'medium' }
        ],
        totalAmount: 35
      },
      {
        period: '3-6 Month',
        label: '3-6 Month',
        projects: [
          { name: '海口自贸区项目', amount: 40, probability: 'low', isNew: true }
        ],
        totalAmount: 40
      }
    ],
    actions: [
      {
        id: '1',
        type: 'urgent',
        priority: 1,
        title: '紧急推进',
        description: '立刻推进深圳四季酒店项目（释放 +30 万）',
        impact: '+30 万',
        owner: '陈明',
        deadline: '本周内'
      },
      {
        id: '2',
        type: 'supplement',
        priority: 2,
        title: '补齐支撑',
        description: '需新增 2 个中期储备项目（填补 +35 万缺口）',
        impact: '+35 万',
        owner: '刘芳',
        deadline: '15天内'
      },
      {
        id: '3',
        type: 'channel',
        priority: 3,
        title: '渠道动作',
        description: '激活深圳渠道，本周需新增项目≥2 个',
        impact: '+50 万',
        owner: '赵敏',
        deadline: '本周内'
      }
    ]
  },
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
        title: '推进项目',
        description: '加快成都IFS国际金融中心项目推进',
        impact: '+15 万',
        owner: '孙丽',
        deadline: '本周内'
      },
      {
        id: '2',
        type: 'supplement',
        priority: 2,
        title: '补齐支撑',
        description: '需新增 1 个中期储备项目',
        impact: '+20 万',
        owner: '周杰',
        deadline: '15天内'
      }
    ]
  },
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
        description: '保持当前态势，继续开拓新项目',
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
  theme = 'light',
  defaultRegion = 'national'
}: FutureSupportAdequacyPanelProps) {
  // 区域选择状态
  const [selectedRegion, setSelectedRegion] = useState<Region>(defaultRegion);

  // 合并默认数据和自定义数据
  const allRegionData = { ...regionData, ...customData };
  const data = allRegionData[selectedRegion] || regionData.national;

  // 获取状态颜色
  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return { bg: theme === 'dark' ? 'bg-green-500' : 'bg-green-500', text: theme === 'dark' ? 'text-green-400' : 'text-green-600', border: theme === 'dark' ? 'border-green-500' : 'border-green-500' };
      case 'yellow':
        return { bg: theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500', text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600', border: theme === 'dark' ? 'border-yellow-500' : 'border-yellow-500' };
      case 'red':
        return { bg: theme === 'dark' ? 'bg-red-500' : 'bg-red-500', text: theme === 'dark' ? 'text-red-400' : 'text-red-600', border: theme === 'dark' ? 'border-red-500' : 'border-red-500' };
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
        return theme === 'dark' ? 'bg-green-500' : 'bg-green-500';
      case 'medium':
        return theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500';
      case 'low':
        return theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400';
    }
  };

  // 获取健康度颜色
  const getHealthColor = (health: 'high' | 'medium' | 'low') => {
    switch (health) {
      case 'high':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'medium':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'low':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend: 'up' | 'stable' | 'down') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'stable':
        return <ArrowRight className="w-5 h-5 text-slate-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
    }
  };

  // 获取行动类型图标
  const getActionIcon = (type: 'urgent' | 'supplement' | 'channel' | 'sop') => {
    switch (type) {
      case 'urgent':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'supplement':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'channel':
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'sop':
        return <Compass className="w-5 h-5 text-purple-500" />;
    }
  };

  // 支撑结构数据转换（用于图表）
  const supportStructureData = [
    { name: '0-30天', amount: data.supportStructure['0-30天'].amount, coverage: data.supportStructure['0-30天'].coverage, status: data.supportStructure['0-30天'].status },
    { name: '1-3月', amount: data.supportStructure['1-3月'].amount, coverage: data.supportStructure['1-3月'].coverage, status: data.supportStructure['1-3月'].status },
    { name: '3-6月', amount: data.supportStructure['3-6月'].amount, coverage: data.supportStructure['3-6月'].coverage, status: data.supportStructure['3-6月'].status }
  ];

  return (
    <div className={cn(
      'w-full rounded-xl overflow-hidden',
      theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-100 via-white to-slate-50'
    )}>
      {/* 顶部标题栏 - 驾驶舱风格 */}
      <div className={cn(
        'px-6 py-4 flex items-center justify-between',
        theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-r from-slate-800 to-slate-900'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            theme === 'dark' ? 'bg-blue-500/20' : 'bg-white/20'
          )}>
            <BarChart3 className={cn('w-6 h-6', theme === 'dark' ? 'text-blue-400' : 'text-white')} />
          </div>
          <div>
            <h3 className={cn('text-xl font-bold', theme === 'dark' ? 'text-white' : 'text-white')}>未来支撑充分性分析</h3>
            <p className={cn('text-xs', theme === 'dark' ? 'text-slate-400' : 'text-white/70')}>驾驶舱模式 · 未来90天支撑预测</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 区域选择器 */}
          <div className="flex items-center gap-2">
            <MapPin className={cn('w-4 h-4', theme === 'dark' ? 'text-slate-400' : 'text-white/70')} />
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                className={cn(
                  'appearance-none pl-4 pr-10 py-2 text-sm rounded-lg cursor-pointer',
                  'transition-colors focus:outline-none',
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-white/20 text-white border border-white/30 backdrop-blur-sm'
                )}
              >
                {Object.entries(regionConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <ChevronDown className={cn('absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none', theme === 'dark' ? 'text-slate-400' : 'text-white/70')} />
            </div>
          </div>
        </div>
      </div>

      {/* 驾驶舱主内容区 - 网格布局 */}
      <div className="grid grid-cols-12 gap-0.5 p-0.5">
        
        {/* 【核心指标区 - 左侧3列】深色背景 */}
        <div className={cn(
          'col-span-3 p-6 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-br from-slate-800 to-slate-900'
        )}>
          {/* 覆盖度 - 大数字 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Target className={cn('w-5 h-5', theme === 'dark' ? 'text-blue-400' : 'text-blue-300')} />
              <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>支撑覆盖度</span>
            </div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-7xl font-black" style={{ color: getStatusColor(data.coreMetrics.coverageStatus).text }}>
                {data.coreMetrics.coverage}
              </span>
              <span className={cn('text-3xl font-bold', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>%</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(data.coreMetrics.trend)}
                <span className={cn('text-sm font-medium', data.coreMetrics.trendValue >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {data.coreMetrics.trendValue > 0 ? '+' : ''}{data.coreMetrics.trendValue}%
                </span>
              </div>
            </div>
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium',
              data.coreMetrics.coverageStatus === 'green' ? 'bg-green-500/20 text-green-400' :
              data.coreMetrics.coverageStatus === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            )}>
              {data.coreMetrics.coverageStatus === 'green' ? '支撑充足' :
               data.coreMetrics.coverageStatus === 'yellow' ? '基本达标' :
               '支撑不足'}
            </div>
          </div>

          {/* 目标 vs 支撑 */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-sm', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>未来目标</span>
                <span className={cn('text-2xl font-bold', theme === 'dark' ? 'text-white' : 'text-white')}>{data.coreMetrics.targetAmount.toLocaleString()}万</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: '100%', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-sm', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>可支撑</span>
                <span className={cn('text-2xl font-bold', theme === 'dark' ? 'text-green-400' : 'text-green-400')}>{data.coreMetrics.supportAmount.toLocaleString()}万</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)' }}>
                <div className="h-full rounded-full transition-all duration-500 bg-green-500" style={{ width: `${data.coreMetrics.coverage}%` }} />
              </div>
            </div>
            <div className={cn(
              'p-4 rounded-xl flex items-center justify-between',
              theme === 'dark' ? 'bg-red-500/10' : 'bg-red-500/10'
            )}>
              <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>缺口</span>
              <span className="text-2xl font-bold text-red-400">{data.coreMetrics.gap > 0 ? '-' : '+'}{Math.abs(data.coreMetrics.gap).toLocaleString()}万</span>
            </div>
          </div>
        </div>

        {/* 【支撑结构区 - 中间5列】浅色背景 */}
        <div className={cn(
          'col-span-5 p-6 rounded-lg',
          theme === 'dark' ? 'bg-slate-900/30' : 'bg-white'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className={cn('w-5 h-5', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
              <span className={cn('text-base font-semibold', theme === 'dark' ? 'text-white' : 'text-slate-800')}>支撑结构</span>
            </div>
          </div>

          {/* 三段支撑结构 */}
          <div className="space-y-3">
            {Object.entries(data.supportStructure).map(([key, level]) => (
              <div
                key={key}
                className={cn(
                  'p-4 rounded-xl',
                  theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={cn('text-sm font-semibold mb-1', theme === 'dark' ? 'text-white' : 'text-slate-800')}>{level.label}</div>
                    <div className={cn('text-xs', theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>{level.period}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={cn('text-xs', theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>覆盖度</div>
                      <div className={cn('text-lg font-bold', getStatusColor(level.status).text)}>{level.coverage}%</div>
                    </div>
                    <div className={cn('w-3 h-3 rounded-full', getStatusColor(level.status).bg)} />
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${level.coverage}%`, backgroundColor: getStatusColor(level.status).bg }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={cn(theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                    支撑: <span className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-slate-700')}>{level.amount}万</span>
                  </span>
                  <span className={cn(theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                    目标: <span className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-slate-700')}>{level.target}万</span>
                  </span>
                  {level.gap > 0 && (
                    <span className={cn('font-semibold', theme === 'dark' ? 'text-red-400' : 'text-red-600')}>
                      缺口 {level.gap}万
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 【缺失诊断区 - 右侧4列】深色背景 */}
        <div className={cn(
          'col-span-4 p-6 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-br from-slate-800 to-slate-900'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className={cn('w-5 h-5', theme === 'dark' ? 'text-red-400' : 'text-red-400')} />
            <span className={cn('text-base font-semibold', theme === 'dark' ? 'text-white' : 'text-white')}>缺失诊断</span>
          </div>

          {data.diagnosticIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <CheckCircle2 className={cn('w-16 h-16 mb-3', theme === 'dark' ? 'text-green-400' : 'text-green-400')} />
              <div className={cn('text-lg font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-white')}>支撑充足</div>
              <div className={cn('text-sm', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>当前无缺失风险</div>
            </div>
          ) : (
            <div className="space-y-3">
              {data.diagnosticIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={cn(
                    'p-4 rounded-xl border-l-4',
                    theme === 'dark' ? 'bg-slate-900/30' : 'bg-white/10',
                    { 'border-red-500': issue.riskLevel === 'red', 'border-orange-500': issue.riskLevel === 'orange', 'border-yellow-500': issue.riskLevel === 'yellow' }
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className={cn('text-sm font-semibold mb-1', theme === 'dark' ? 'text-white' : 'text-white')}>{issue.name}</div>
                      <div className={cn('text-xs', theme === 'dark' ? 'text-slate-400' : 'text-slate-300')}>{issue.reason}</div>
                    </div>
                    <div className={cn('text-lg font-bold', issue.riskLevel === 'red' ? 'text-red-400' : issue.riskLevel === 'orange' ? 'text-orange-400' : 'text-yellow-400')}>
                      {issue.impact > 0 ? '+' : ''}{issue.impact}
                    </div>
                  </div>
                  <div className={cn('text-xs', theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                    影响: {Math.abs(issue.impact)}万
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 底部双列区域 */}
      <div className="grid grid-cols-2 gap-0.5 p-0.5 mt-0.5">
        
        {/* 【时间路径图 - 左侧】深色背景 */}
        <div className={cn(
          'p-6 rounded-lg',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-br from-slate-800 to-slate-900'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-400')} />
            <span className={cn('text-base font-semibold', theme === 'dark' ? 'text-white' : 'text-white')}>支撑路径图</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supportStructureData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)'} />
                <XAxis 
                  dataKey="name" 
                  stroke={theme === 'dark' ? '#94a3b8' : '#e2e8f0'}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke={theme === 'dark' ? '#94a3b8' : '#e2e8f0'}
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 【行动建议区 - 右侧】浅色背景 */}
        <div className={cn(
          'p-6 rounded-lg',
          theme === 'dark' ? 'bg-slate-900/30' : 'bg-white'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-500')} />
            <span className={cn('text-base font-semibold', theme === 'dark' ? 'text-white' : 'text-slate-800')}>行动建议</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {data.actions.slice(0, 4).map((action) => (
              <div
                key={action.id}
                className={cn(
                  'p-4 rounded-xl',
                  theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center',
                    action.priority === 1 ? 'bg-red-500' : 
                    action.priority === 2 ? 'bg-orange-500' : 
                    action.priority === 3 ? 'bg-yellow-500' : 'bg-slate-500'
                  )}>
                    <span className="text-xs font-bold text-white">{action.priority}</span>
                  </div>
                  {getActionIcon(action.type)}
                  <span className={cn('text-xs font-bold', theme === 'dark' ? 'text-white' : 'text-slate-700')}>{action.title}</span>
                </div>
                <div className={cn('text-xs mb-2 line-clamp-2', theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                  {action.description}
                </div>
                <div className={cn('text-sm font-bold text-green-500')}>{action.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
