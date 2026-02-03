# 商用总经理驾驶舱 - Next.js开发计划

## 📋 项目概述

- **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **部署**: 企业微信工作台
- **集成**: 企业微信OAuth认证
- **预计工期**: 5-7天

---

## 🎯 第一阶段：数据层开发（1-2天）

### 任务1.1：安装依赖

```bash
# 安装数据库相关依赖（如果还没有）
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit
```

### 任务1.2：配置数据库连接

**文件**: `.env`
```env
# PostgreSQL数据库连接
PGDATABASE_URL=postgresql://user:password@host:5432/database

# 企业微信配置（后续使用）
WEWORK_CORPID=your_corp_id
WEWORK_AGENT_ID=your_agent_id
WEWORK_SECRET=your_secret
WEWORK_TOKEN=your_token
WEWORK_ENCODING_AES_KEY=your_encoding_aes_key

# 应用配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
```

### 任务1.3：定义数据库表结构

**文件**: `src/storage/database/shared/schema.ts`

```typescript
import { pgTable, varchar, timestamp, decimal, integer, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 用户表
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  weworkUserId: varchar("wework_user_id", { length: 64 }).unique().notNull(), // 企业微信用户ID
  name: varchar("name", { length: 128 }).notNull(),
  mobile: varchar("mobile", { length: 20 }),
  department: varchar("department", { length: 128 }),
  position: varchar("position", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 项目表
export const projects = pgTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  industry: varchar("industry", { length: 128 }), // 行业
  channel: varchar("channel", { length: 128 }), // 渠道
  grade: varchar("grade", { length: 32 }), // 项目等级
  currentAmount: decimal("current_amount", { precision: 18, scale: 2 }), // 当前金额
  targetAmount: decimal("target_amount", { precision: 18, scale: 2 }), // 目标金额
  gapAmount: decimal("gap_amount", { precision: 18, scale: 2 }), // 缺口金额
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }), // 转化率
  status: varchar("status", { length: 32 }).notNull(), // 状态
  riskLevel: varchar("risk_level", { length: 32 }), // 风险等级
  currentNode: varchar("current_node", { length: 128 }), // 当前节点
  predictedAmount: decimal("predicted_amount", { precision: 18, scale: 2 }), // 预测金额
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 风险识别表
export const riskIdentifications = pgTable("risk_identifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).references(() => projects.id).notNull(),
  type: varchar("type", { length: 32 }).notNull(), // 预测不足/催下单/报备不足/转化不足/大项目依赖/在线确认
  description: text("description"),
  messageTemplate: text("message_template"), // 消息模板
  status: varchar("status", { length: 32 }).default("pending"), // pending/sent/completed
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 数据快照表（用于历史数据查询）
export const dataSnapshots = pgTable("data_snapshots", {
  id: varchar("id", { length: 36 }).primaryKey(),
  snapshotDate: timestamp("snapshot_date").notNull(), // 快照日期
  totalProjects: integer("total_projects").notNull(), // 总项目数
  totalAmount: decimal("total_amount", { precision: 18, scale: 2 }), // 总金额
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }), // 转化率
  riskProjects: integer("risk_projects"), // 风险项目数
  stagnantProjects: integer("stagnant_projects"), // 停滞项目数
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type RiskIdentification = typeof riskIdentifications.$inferSelect;
```

### 任务1.4：创建Manager类

**文件**: `src/storage/database/userManager.ts`

```typescript
import { eq } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { users } from "./shared/schema";
import type { User, InsertUser } from "./shared/schema";

export class UserManager {
  async getUserByWeworkId(weworkUserId: string): Promise<User | null> {
    const db = await getDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.weworkUserId, weworkUserId));
    return user || null;
  }

  async createUser(data: InsertUser): Promise<User> {
    const db = await getDb();
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    const db = await getDb();
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}

export const userManager = new UserManager();
```

**文件**: `src/storage/database/projectManager.ts`

```typescript
import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { projects } from "./shared/schema";
import type { Project, InsertProject } from "./shared/schema";

export class ProjectManager {
  async getProjects(params?: {
    industry?: string;
    channel?: string;
    grade?: string;
    status?: string;
    riskLevel?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Project[]; total: number }> {
    const db = await getDb();
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;

    let query = db.select().from(projects).orderBy(desc(projects.updatedAt));

    // 添加过滤条件
    if (params?.industry) {
      query = query.where(eq(projects.industry, params.industry));
    }
    if (params?.channel) {
      query = query.where(eq(projects.channel, params.channel));
    }
    // ...其他过滤条件

    const data = await query.limit(pageSize).offset((page - 1) * pageSize);
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(projects);

    return { data, total: count };
  }

  async getProjectById(id: string): Promise<Project | null> {
    const db = await getDb();
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || null;
  }

  async createProject(data: InsertProject): Promise<Project> {
    const db = await getDb();
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
    const db = await getDb();
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }
}

export const projectManager = new ProjectManager();
```

### 任务1.5：同步数据库结构

```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 执行迁移
pnpm drizzle-kit migrate
```

---

## 🎯 第二阶段：API Routes开发（1-2天）

### 任务2.1：项目数据API

**文件**: `src/app/api/projects/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { projectManager } from '@/storage/database/projectManager';

// GET /api/projects - 获取项目列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      industry: searchParams.get('industry') || undefined,
      channel: searchParams.get('channel') || undefined,
      grade: searchParams.get('grade') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '20'),
    };

    const result = await projectManager.getProjects(params);
    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/projects - 创建项目
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await projectManager.createProject(body);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('创建项目失败:', error);
    return NextResponse.json(
      { success: false, error: '创建项目失败' },
      { status: 500 }
    );
  }
}
```

### 任务2.2：驾驶舱数据API

**文件**: `src/app/api/dashboard/summary/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getDb } from 'coze-coding-dev-sdk';
import { projects, dataSnapshots } from '@/storage/database/shared/schema';
import { sql, eq, desc } from 'drizzle-orm';

// GET /api/dashboard/summary - 获取驾驶舱汇总数据
export async function GET() {
  try {
    const db = await getDb();

    // 项目总数
    const [{ count: totalProjects }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects);

    // 总金额（万）
    const [{ total: totalAmount }] = await db
      .select({ total: sql<number>`COALESCE(sum(current_amount), 0)::numeric` })
      .from(projects);

    // 转化率
    const [{ avg: conversionRate }] = await db
      .select({ avg: sql<number>`COALESCE(avg(conversion_rate), 0)::numeric` })
      .from(projects);

    // 风险项目数
    const [{ count: riskProjects }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(sql`risk_level IN ('high', 'very_high')`);

    // 停滞项目数（超过30天未更新）
    const [{ count: stagnantProjects }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(sql`updated_at < NOW() - INTERVAL '30 days'`);

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalAmount: Number(totalAmount) / 10000, // 转换为万
        conversionRate: Number(conversionRate) * 100, // 转换为百分比
        riskProjects,
        stagnantProjects,
      },
    });
  } catch (error) {
    console.error('获取驾驶舱汇总数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
  }
}
```

### 任务2.3：风险识别API

**文件**: `src/app/api/risks/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'coze-coding-dev-sdk';
import { projects } from '@/storage/database/shared/schema';
import { sql, desc } from 'drizzle-orm';

// GET /api/risks?type=prediction - 获取预测不足项目
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'prediction';

    const db = await getDb();
    let result;

    switch (type) {
      case 'prediction':
        // 预测不足：当前预测 < 目标预测 * 0.8
        result = await db
          .select()
          .from(projects)
          .where(sql`predicted_amount < target_amount * 0.8`)
          .orderBy(desc(projects.gapAmount))
          .limit(100);
        break;

      case 'urge':
        // 催下单：转化率低且金额较大
        result = await db
          .select()
          .from(projects)
          .where(sql`conversion_rate < 0.3 AND current_amount > 100000`)
          .orderBy(desc(projects.currentAmount))
          .limit(100);
        break;

      case 'report':
        // 报备不足：报备数 < 目标数
        result = await db
          .select()
          .from(projects)
          .where(sql`status = 'insufficient_report'`)
          .orderBy(desc(projects.updatedAt))
          .limit(100);
        break;

      case 'conversion':
        // 转化不足：转化率 < 20%
        result = await db
          .select()
          .from(projects)
          .where(sql`conversion_rate < 0.2`)
          .orderBy(projects.conversionRate)
          .limit(100);
        break;

      case 'dependency':
        // 大项目依赖：金额 > 100万
        result = await db
          .select()
          .from(projects)
          .where(sql`current_amount > 1000000`)
          .orderBy(desc(projects.currentAmount))
          .limit(100);
        break;

      case 'confirmation':
        // 在线确认：待确认项目
        result = await db
          .select()
          .from(projects)
          .where(eq(projects.status, 'pending_confirmation'))
          .orderBy(desc(projects.updatedAt))
          .limit(100);
        break;

      default:
        result = [];
    }

    return NextResponse.json({
      success: true,
      data: result,
      type,
    });
  } catch (error) {
    console.error('获取风险识别数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
  }
}
```

### 任务2.4：消息发送API

**文件**: `src/app/api/messages/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'coze-coding-dev-sdk';
import { riskIdentifications } from '@/storage/database/shared/schema';
import { eq } from 'drizzle-orm';

// POST /api/messages/send - 发送消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type, message } = body;

    // 1. 保存到数据库
    const db = await getDb();
    const [risk] = await db
      .insert(riskIdentifications)
      .values({
        id: crypto.randomUUID(),
        projectId,
        type,
        description: message,
        messageTemplate: message,
        status: 'pending',
        sentAt: new Date(),
      })
      .returning();

    // 2. 调用企业微信API发送消息（在第三阶段实现）
    // await sendWeworkMessage(message);

    return NextResponse.json({
      success: true,
      data: risk,
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    return NextResponse.json(
      { success: false, error: '发送消息失败' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 第三阶段：企业微信集成（1-2天）

### 任务3.1：配置企业微信应用

在企业微信管理后台完成以下配置：

1. **创建应用**
   - 应用类型：企业微信应用
   - 应用名称：商用总经理驾驶舱
   - 应用描述：总经理驾驶舱，实时监控项目风险

2. **获取配置信息**
   - 企业ID（CorpId）
   - 应用ID（AgentId）
   - 应用Secret（Secret）
   - 应用Token（Token）
   - 应用EncodingAESKey

3. **配置可信域名**
   - 首页URL：`https://your-domain.com`
   - 登录授权域名：`https://your-domain.com`

### 任务3.2：实现OAuth认证

**文件**: `src/lib/wework-auth.ts`

```typescript
import axios from 'axios';

const WEWORK_BASE_URL = 'https://qyapi.weixin.qq.com';

export class WeWorkAuth {
  private corpId: string;
  private agentId: string;
  private secret: string;

  constructor() {
    this.corpId = process.env.WEWORK_CORPID!;
    this.agentId = process.env.WEWORK_AGENT_ID!;
    this.secret = process.env.WEWORK_SECRET!;
  }

  // 获取access_token
  private async getAccessToken(): Promise<string> {
    const url = `${WEWORK_BASE_URL}/cgi-bin/gettoken`;
    const response = await axios.get(url, {
      params: {
        corpid: this.corpId,
        corpsecret: this.secret,
      },
    });

    if (response.data.errcode !== 0) {
      throw new Error(`获取access_token失败: ${response.data.errmsg}`);
    }

    return response.data.access_token;
  }

  // 根据code获取用户信息
  async getUserInfo(code: string): Promise<{ userId: string; name: string }> {
    const accessToken = await this.getAccessToken();

    // 1. 获取用户ID
    const userUrl = `${WEWORK_BASE_URL}/cgi-bin/user/getuserinfo`;
    const userResponse = await axios.get(userUrl, {
      params: {
        access_token: accessToken,
        code,
      },
    });

    if (userResponse.data.errcode !== 0) {
      throw new Error(`获取用户ID失败: ${userResponse.data.errmsg}`);
    }

    const userId = userResponse.data.UserId;

    // 2. 获取用户详细信息
    const detailUrl = `${WEWORK_BASE_URL}/cgi-bin/user/get`;
    const detailResponse = await axios.get(detailUrl, {
      params: {
        access_token: accessToken,
        userid: userId,
      },
    });

    if (detailResponse.data.errcode !== 0) {
      throw new Error(`获取用户详情失败: ${detailResponse.data.errmsg}`);
    }

    return {
      userId,
      name: detailResponse.data.name,
      mobile: detailResponse.data.mobile,
      department: detailResponse.data.department,
      position: detailResponse.data.position,
    };
  }

  // 发送文本消息
  async sendTextMessage(userIds: string[], message: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const url = `${WEWORK_BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`;

    const data = {
      touser: userIds.join('|'),
      msgtype: 'text',
      agentid: this.agentId,
      text: {
        content: message,
      },
    };

    const response = await axios.post(url, data);
    if (response.data.errcode !== 0) {
      throw new Error(`发送消息失败: ${response.data.errmsg}`);
    }
  }
}

export const weworkAuth = new WeWorkAuth();
```

### 任务3.3：创建登录路由

**文件**: `src/app/api/auth/wework/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { weworkAuth } from '@/lib/wework-auth';
import { userManager } from '@/storage/database/userManager';

// GET /api/auth/wework?code=xxx - 企业微信OAuth回调
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: '缺少code参数' },
        { status: 400 }
      );
    }

    // 1. 获取企业微信用户信息
    const weworkUser = await weworkAuth.getUserInfo(code);

    // 2. 查询或创建本地用户
    let user = await userManager.getUserByWeworkId(weworkUser.userId);
    if (!user) {
      user = await userManager.createUser({
        id: crypto.randomUUID(),
        weworkUserId: weworkUser.userId,
        name: weworkUser.name,
        mobile: weworkUser.mobile,
        department: weworkUser.department?.join(','),
        position: weworkUser.position,
      });
    }

    // 3. 创建会话token
    const session = {
      userId: user.id,
      weworkUserId: user.weworkUserId,
      name: user.name,
    };

    // 4. 重定向到首页，携带token
    const response = NextResponse.redirect(new URL('/gm', request.url));
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
    });

    return response;
  } catch (error) {
    console.error('企业微信登录失败:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
```

### 任务3.4：创建中间件验证用户

**文件**: `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 只对需要认证的页面进行检查
  if (request.nextUrl.pathname.startsWith('/gm')) {
    const session = request.cookies.get('session');

    if (!session) {
      // 重定向到企业微信授权页面
      const corpId = process.env.WEWORK_CORPID;
      const agentId = process.env.WEWORK_AGENT_ID;
      const redirectUri = encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/wework`);

      const authUrl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${corpId}&agentid=${agentId}&redirect_uri=${redirectUri}&state=STATE`;

      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gm/:path*'],
};
```

### 任务3.5：获取当前用户信息

**文件**: `src/app/api/auth/user/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/user - 获取当前登录用户
export async function GET(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.json(
      { error: '未登录' },
      { status: 401 }
    );
  }

  try {
    const user = JSON.parse(session.value);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { error: '会话无效' },
      { status: 401 }
    );
  }
}
```

---

## 🎯 第四阶段：前端集成（1天）

### 任务4.1：修改驾驶舱页面，接入真实数据

**文件**: `src/app/gm/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function GMPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 获取当前用户信息
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data);
        }
      });

    // 获取驾驶舱汇总数据
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSummary(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-b border-cyan-500 border-opacity-30 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">商用总经理驾驶舱</h1>
          <div className="text-white">
            {user?.name}，您好
          </div>
        </div>
      </header>

      {/* 驾驶舱内容 */}
      <div className="p-6">
        {/* 汇总数据 */}
        {summary && (
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500 border-opacity-30">
              <div className="text-gray-400 mb-2">项目总数</div>
              <div className="text-3xl font-bold text-cyan-400">{summary.totalProjects}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500 border-opacity-30">
              <div className="text-gray-400 mb-2">总金额（万）</div>
              <div className="text-3xl font-bold text-cyan-400">{summary.totalAmount.toFixed(2)}</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500 border-opacity-30">
              <div className="text-gray-400 mb-2">转化率</div>
              <div className="text-3xl font-bold text-cyan-400">{summary.conversionRate.toFixed(2)}%</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500 border-opacity-30">
              <div className="text-gray-400 mb-2">风险项目</div>
              <div className="text-3xl font-bold text-red-400">{summary.riskProjects}</div>
            </div>
          </div>
        )}

        {/* 风险识别面板 */}
        <RiskIdentificationPanel />
      </div>
    </div>
  );
}
```

### 任务4.2：修改风险识别面板，接入真实数据

**文件**: `src/components/RiskIdentificationPanel.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Send, Clock, AlertTriangle, CheckCircle, TrendingDown, Building2 } from 'lucide-react';

export function RiskIdentificationPanel() {
  const [activeTab, setActiveTab] = useState('prediction');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });

  const tabs = [
    { id: 'prediction', label: '预测不足', icon: TrendingDown },
    { id: 'urge', label: '催下单', icon: Send },
    { id: 'report', label: '报备不足', icon: AlertTriangle },
    { id: 'conversion', label: '转化不足', icon: Clock },
    { id: 'dependency', label: '大项目依赖', icon: Building2 },
    { id: 'confirmation', label: '在线确认', icon: CheckCircle },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/risks?type=${activeTab}&page=${pagination.page}&pageSize=${pagination.pageSize}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setPagination(prev => ({ ...prev, total: result.data.length }));
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (projectId: string, type: string) => {
    const message = `项目 ${projectId} 需要${type === 'prediction' ? '补预测' : '跟进'}，请及时处理。`;

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, type, message }),
      });

      const result = await response.json();
      if (result.success) {
        alert('消息已发送！');
      } else {
        alert('发送失败：' + result.error);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送失败');
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-cyan-500 border-opacity-30">
      {/* Tab标题 */}
      <div className="flex border-b border-gray-700">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 表格内容 */}
      <div className="p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-8">加载中...</div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-4 font-medium text-center">项目名称</th>
                  <th className="pb-4 font-medium text-center">金额（万）</th>
                  <th className="pb-4 font-medium text-center">转化率</th>
                  <th className="pb-4 font-medium text-center">状态</th>
                  <th className="pb-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30 transition-colors">
                    <td className="py-4 text-white text-center">{item.name}</td>
                    <td className="py-4 text-cyan-400 text-center">{(Number(item.currentAmount) / 10000).toFixed(2)}</td>
                    <td className="py-4 text-white text-center">{(Number(item.conversionRate) * 100).toFixed(2)}%</td>
                    <td className="py-4 text-white text-center">{item.status}</td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleSendMessage(item.id, activeTab)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition-colors flex items-center gap-2"
                      >
                        <Send size={16} />
                        {activeTab === 'prediction' ? '补预测' : '确认发送'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-gray-400">
                共 {pagination.total} 条记录
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="px-4 py-2 text-white">
                  第 {pagination.page} 页
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page * pagination.pageSize >= pagination.total}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 第五阶段：企业微信工作台配置（0.5天）

### 任务5.1：配置应用主页

在企业微信管理后台：

1. **进入应用管理**
   - 找到"商用总经理驾驶舱"应用

2. **配置应用主页**
   - 首页URL：`https://your-domain.com/gm`
   - 登录授权：开启
   - 可信域名：`https://your-domain.com`

3. **配置可见范围**
   - 设置哪些部门和员工可以访问

### 任务5.2：测试访问流程

1. **在企业微信工作台打开应用**
2. **自动跳转到登录页面**
3. **扫码或输入账号密码登录**
4. **跳转到驾驶舱首页**
5. **查看数据是否正常显示**

---

## 🎯 第六阶段：部署上线（0.5天）

### 任务6.1：构建生产版本

```bash
# 构建项目
pnpm build

# 本地测试
pnpm start
```

### 任务6.2：部署到服务器

1. **使用Docker部署**

**文件**: `Dockerfile`

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

EXPOSE 5000

CMD ["pnpm", "start"]
```

**构建镜像**：
```bash
docker build -t gm-dashboard .
```

**运行容器**：
```bash
docker run -d -p 5000:5000 --name gm-dashboard \
  -e PGDATABASE_URL=your_database_url \
  -e WEWORK_CORPID=your_corp_id \
  -e WEWORK_AGENT_ID=your_agent_id \
  -e WEWORK_SECRET=your_secret \
  -e NEXTAUTH_URL=https://your-domain.com \
  -e NEXTAUTH_SECRET=your-secret \
  gm-dashboard
```

2. **配置Nginx反向代理**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **配置SSL证书**

使用Let's Encrypt免费SSL证书：
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 📊 开发时间估算

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| 第一阶段 | 数据层开发 | 1-2天 |
| 第二阶段 | API Routes开发 | 1-2天 |
| 第三阶段 | 企业微信集成 | 1-2天 |
| 第四阶段 | 前端集成 | 1天 |
| 第五阶段 | 工作台配置 | 0.5天 |
| 第六阶段 | 部署上线 | 0.5天 |
| **总计** | | **5-7天** |

---

## 🎁 额外功能（可选）

### 功能1：消息推送（1-2天）

- 实现企业微信消息推送
- 支持定时任务提醒
- 支持批量发送消息

### 功能2：数据导出（1天）

- 导出Excel
- 导出PDF
- 导出图片

### 功能3：权限管理（1-2天）

- 角色权限控制
- 数据权限控制
- 操作日志记录

---

## 📝 注意事项

1. **数据库设计**
   - 根据实际业务需求调整表结构
   - 添加必要的索引
   - 考虑数据分区（如果数据量大）

2. **企业微信集成**
   - 确保企业微信应用配置正确
   - 测试OAuth登录流程
   - 测试消息推送功能

3. **性能优化**
   - 使用Redis缓存热点数据
   - 数据库查询优化
   - 前端加载优化

4. **安全性**
   - 使用HTTPS
   - 配置CORS
   - 验证用户权限
   - 防止SQL注入

---

## 🚀 开始开发

现在你可以按照这个计划开始开发了！如果需要我帮你实现具体的某个部分，请告诉我！

**下一步建议**：
1. 先完成第一阶段：数据层开发
2. 我可以帮你生成完整的代码
3. 逐步完成各个阶段的任务

需要我帮你开始实现吗？😊
