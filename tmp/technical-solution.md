# 商用净水经营驾驶舱 - 技术方案

## 一、项目概述

### 1.1 项目背景
商用净水经营驾驶舱是一个面向商用净水行业的双驾驶舱管理系统，旨在为销售团队和经销商老板提供数据可视化、业务分析和决策支持。

### 1.2 核心目标
- **AO经营看板**：帮助AO团队追踪业绩、管理项目进度、提升团队效能
- **经销商经营看板**：帮助老板监控年度目标、分析趋势、预警风险

### 1.3 技术特点
- 响应式设计，支持多端访问
- 实时数据可视化
- AI智能洞察分析
- 企业微信工作台集成

---

## 二、技术栈

### 2.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19.2.3 | 前端框架 |
| **Next.js** | 16.1.1 | 全栈框架（App Router） |
| **TypeScript** | 5.x | 类型安全 |
| **Tailwind CSS** | 4.x | 样式框架 |
| **shadcn/ui** | latest | UI组件库 |
| **Recharts** | 2.15.4 | 数据可视化 |
| **Lucide React** | 0.468.0 | 图标库 |

### 2.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | 24.x | 运行时环境 |
| **Next.js API Routes** | 内置 | 后端API |
| **PostgreSQL** | 16.x | 关系型数据库 |
| **Drizzle ORM** | 0.45.1 | 数据库ORM |
| **AWS S3 SDK** | 3.958.0 | 对象存储 |

### 2.3 AI集成

| 技术 | 版本 | 用途 |
|------|------|------|
| **coze-coding-dev-sdk** | 0.5.4 | 大语言模型集成 |
| **方舟大模型** | - | AI智能洞察 |

### 2.4 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| **pnpm** | 9.0.0+ | 包管理器 |
| **ESLint** | 9.x | 代码规范检查 |
| **TypeScript** | 5.x | 类型检查 |
| **Coze CLI** | latest | 项目构建与部署 |

---

## 三、项目架构

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                     客户端层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  浏览器访问    │  │  企业微信     │  │  移动端适配   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    前端应用层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  AO经营看板   │  │  经销商经营看板 │  │  导航分发页   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    后端服务层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  API Routes   │  │  AI服务       │  │  文件上传     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    数据存储层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL   │  │  S3对象存储   │  │  Redis缓存    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3.2 路由架构

```
/ (首页)
├── /sales (AO经营看板)
│   └── page.tsx
└── /dealer (经销商经营看板)
    └── page.tsx
```

---

## 四、目录结构

```
商用净水经营驾驶舱/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx               # 首页（导航分发）
│   │   ├── sales/                 # AO经营看板
│   │   │   └── page.tsx
│   │   ├── dealer/                # 经销商经营看板
│   │   │   └── page.tsx
│   │   ├── api/                   # API Routes（待扩展）
│   │   │   ├── auth/             # 认证接口
│   │   │   ├── data/             # 数据接口
│   │   │   └── upload/           # 文件上传
│   │   ├── layout.tsx            # 全局布局
│   │   └── globals.css           # 全局样式
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 组件库
│   │   ├── ai-insight.tsx        # AI智能洞察组件
│   │   └── ...                   # 其他业务组件
│   ├── lib/
│   │   ├── utils.ts              # 工具函数
│   │   └── db.ts                 # 数据库配置
│   └── types/                    # TypeScript 类型定义
├── tmp/                          # 文档目录
│   ├── development-guide.md      # 快速开发指南
│   ├── wecom-integration-guide.md # 企业微信集成指南
│   └── technical-solution.md     # 技术方案（本文档）
├── public/                       # 静态资源
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript配置
├── tailwind.config.ts            # Tailwind配置
├── .coze                         # Coze构建配置
└── .cozeproj/                    # 预置脚本
```

---

## 五、核心功能模块

### 5.1 AO经营看板（/sales）

#### 功能清单
- **KPI总览卡片**
  - 目标金额、已完成金额、未来预计完成
  - 任务缺口、健康度指数
  - 支持月度/季度/年度切换

- **缺口分析模块**
  - 任务缺口构成分析
  - 在跟进项目预测
  - 还需新开拓项目数

- **大区/城市维度分析**
  - 按大区/城市查看达成情况
  - 支持下钻分析
  - 表格 + 趋势指标

- **AI智能洞察**
  - 自动分析业务问题
  - 提供可执行建议

### 5.2 经销商经营看板（/dealer）

#### 功能清单
- **年度目标达成**
  - 年度目标、已完成、已提货
  - 达成率、健康度、项目储备
  - 本月实际完成

- **月度趋势分析**
  - 12个月度数据折线图
  - 达成率趋势可视化
  - AI智能洞察分析

- **项目阶段统计**
  - 跟进中、已立项、已签约、已交付
  - 各阶段金额与数量
  - 进度条可视化

- **风险预警**
  - 项目风险预警
  - 业务异常提示

### 5.3 首页导航（/）

#### 功能清单
- **角色选择入口**
- 快速导航到对应经营看板

---

## 六、开发规范

### 6.1 代码规范

#### 组件开发
```typescript
'use client'; // 客户端组件必须标注

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  title: string;
  data: any[];
}

export default function MyComponent({ title, data }: Props) {
  // 组件逻辑
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 内容 */}
      </CardContent>
    </Card>
  );
}
```

#### 样式规范
```typescript
// 使用 Tailwind CSS
<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
  <h2 className="text-sm font-semibold text-gray-900 mb-2">
    标题
  </h2>
</div>

// 字体统一使用 text-sm
// 间距统一使用 2 (0.5rem)、3 (0.75rem)、4 (1rem)
```

#### 数据定义
```typescript
// 在页面顶部定义模拟数据
const kpiData = {
  target: 15000,
  completed: 8250,
  // ...
};

// 使用 TypeScript 类型
interface KPIData {
  target: number;
  completed: number;
  // ...
}
```

### 6.2 命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 组件文件 | kebab-case | `my-component.tsx` |
| 组件名称 | PascalCase | `MyComponent` |
| 变量/函数 | camelCase | `handleClick`, `userData` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 类型/接口 | PascalCase | `UserData`, `APIResponse` |

### 6.3 Git提交规范

```
feat: 新功能
fix: 修复bug
refactor: 重构
docs: 文档更新
style: 样式调整
test: 测试相关
chore: 构建/工具
```

---

## 七、数据流转

### 7.1 数据流向

```
┌─────────────┐
│  用户操作    │
└──────┬──────┘
       ↓
┌─────────────┐
│  前端页面    │
└──────┬──────┘
       ↓
┌─────────────────┐
│  API Routes     │
│  /api/data/*    │
└──────┬──────────┘
       ↓
┌─────────────────┐
│  PostgreSQL     │
│  数据查询        │
└─────────────────┘
```

### 7.2 数据模型（待实现）

```sql
-- 销售数据表
CREATE TABLE sales_data (
  id SERIAL PRIMARY KEY,
  region VARCHAR(50),
  city VARCHAR(100),
  salesperson VARCHAR(50),
  target DECIMAL(12,2),
  completed DECIMAL(12,2),
  predicted DECIMAL(12,2),
  period_type VARCHAR(20), -- month/quarter/year
  period_value VARCHAR(20), -- 2026-01 / Q1 / 2026
  created_at TIMESTAMP DEFAULT NOW()
);

-- 项目表
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  stage VARCHAR(50), -- 跟进中/已立项/已签约/已交付
  amount DECIMAL(12,2),
  region VARCHAR(50),
  city VARCHAR(100),
  salesperson VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 大区维度表
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  owner VARCHAR(50),
  target DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 八、部署方案

### 8.1 开发环境

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发环境
coze dev

# 访问 http://localhost:5000
```

### 8.2 生产环境

#### 方案一：云服务部署
1. 服务器配置：2核4GB+，Linux系统
2. 安装Node.js 24.x
3. 使用PM2管理进程
4. Nginx反向代理
5. 配置HTTPS证书

#### 方案二：容器化部署
1. 构建Docker镜像
2. 使用Docker Compose编排
3. 支持横向扩展

### 8.3 环境变量配置

```env
# .env.local
NEXT_PUBLIC_APP_NAME=商用净水经营驾驶舱
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/dashboard

# 企业微信配置
NEXT_PUBLIC_WECOM_CORP_ID=your_corp_id
NEXT_PUBLIC_WECOM_AGENT_ID=your_agent_id
WECOM_SECRET=your_secret

# S3配置
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket
S3_REGION=us-east-1

# AI服务配置
COZE_API_KEY=your_api_key
```

---

## 九、企业微信集成

### 9.1 集成方案

#### 1. 工作台入口
- 在企业微信管理后台创建自建应用
- 配置可信域名
- 设置应用可见范围（AO、经销商）

#### 2. 单点登录
- OAuth2.0授权
- 获取企业微信用户信息
- 根据用户角色自动跳转对应经营看板

#### 9.2 权限控制

```
┌─────────────────┐
│  企业微信登录     │
└──────┬──────────┘
       ↓
┌─────────────────┐
│  获取用户信息     │
└──────┬──────────┘
       ↓
┌─────────────────┐
│  判断角色权限     │
└──────┬──────────┘
       ↓
┌─────────────────┐
│  跳转对应经营看板 │
└─────────────────┘
```

---

## 十、性能优化

### 10.1 前端优化
- **代码分割**：Next.js自动分割
- **懒加载**：动态导入组件
- **图片优化**：Next.js Image组件
- **缓存策略**：SWR或React Query

### 10.2 后端优化
- **数据库索引**：关键字段索引
- **查询优化**：避免N+1查询
- **缓存机制**：Redis缓存热点数据
- **CDN加速**：静态资源CDN

---

## 十一、安全策略

### 11.1 前端安全
- **XSS防护**：React自动转义
- **CSRF防护**：Token验证
- **内容安全策略**：CSP头

### 11.2 后端安全
- **SQL注入防护**：参数化查询
- **身份认证**：JWT Token
- **数据加密**：敏感数据加密
- **访问日志**：操作日志记录

---

## 十二、测试策略

### 12.1 单元测试
```typescript
// 使用 Vitest
import { describe, it, expect } from 'vitest';
import { calculateAchievementRate } from '@/lib/utils';

describe('calculateAchievementRate', () => {
  it('should calculate correct rate', () => {
    expect(calculateAchievementRate(1000, 800)).toBe(80);
  });
});
```

### 12.2 E2E测试
```typescript
// 使用 Playwright
import { test, expect } from '@playwright/test';

test('dealer dashboard page loads', async ({ page }) => {
  await page.goto('/dealer');
  await expect(page.locator('h1')).toContainText('经销商经营看板');
});
```

---

## 十三、监控与运维

### 13.1 监控指标
- **性能监控**：页面加载时间、API响应时间
- **错误监控**：错误日志、异常报警
- **业务监控**：活跃用户、访问量、转化率

### 13.2 日志管理
- **日志分级**：DEBUG、INFO、WARN、ERROR
- **日志收集**：集中式日志系统
- **日志分析**：ELK Stack或Loki

---

## 十四、扩展指南

### 14.1 添加新功能模块

#### 步骤
1. 在 `src/app/` 下创建新路由
2. 创建页面组件
3. 定义数据模型
4. 实现业务逻辑
5. 添加测试

#### 示例
```bash
# 创建新页面
mkdir -p src/app/analytics
touch src/app/analytics/page.tsx

# 实现组件
# src/app/analytics/page.tsx
export default function AnalyticsPage() {
  return <div>数据分析页</div>;
}
```

### 14.2 集成新API

#### 步骤
1. 创建API Route
```typescript
// src/app/api/data/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data);
}
```

2. 前端调用
```typescript
const response = await fetch('/api/data');
const data = await response.json();
```

### 14.3 添加新图表

```typescript
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Bar dataKey="value" fill="#3B82F6" />
  </BarChart>
</ResponsiveContainer>
```

---

## 十五、常见问题

### Q1: 如何切换数据库？
A: 修改 `.env.local` 中的 `DATABASE_URL`，然后运行 `pnpm drizzle-kit push` 同步表结构。

### Q2: 如何自定义主题色？
A: 修改 `tailwind.config.ts` 中的主题配置，或在组件中使用 `className="bg-blue-500"` 指定颜色。

### Q3: 如何添加新的图表类型？
A: 安装 `recharts` 支持的图表组件，参考文档实现。

### Q4: 如何实现数据实时更新？
A: 使用 Server-Sent Events (SSE) 或 WebSocket 实现实时数据推送。

---

## 十六、联系与支持

- **技术文档**：`tmp/development-guide.md`
- **集成指南**：`tmp/wecom-integration-guide.md`
- **技术方案**：`tmp/technical-solution.md`（本文档）

---

## 附录

### A. 技术选型对比

| 方案 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **Next.js vs Vue** | React生态成熟、SSR优秀 | 学习曲线略陡 | 企业级应用首选 |
| **shadcn/ui vs AntD** | 轻量、可定制性强 | 组件相对少 | 需要高度定制 |
| **PostgreSQL vs MySQL** | 功能强大、数据类型丰富 | 配置复杂 | 企业级数据存储 |
| **Recharts vs ECharts** | React原生、轻量 | 功能相对少 | 适合React生态 |

### B. 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Recharts 文档](https://recharts.org)

### C. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0.0 | 2025-01-XX | 初始版本，双经营看板系统上线 |

---

**文档版本**: v1.0.0  
**最后更新**: 2025-01-XX  
**维护者**: 开发团队
