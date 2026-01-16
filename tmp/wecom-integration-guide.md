# 企业微信工作台集成指南

## 一、部署方案

### 方案一：云服务部署（推荐）

#### 1. 服务器准备
- 推荐使用：阿里云/腾讯云/华为云
- 配置：2核4GB以上
- 系统：Linux（Ubuntu 20.04+ 或 CentOS 7+）

#### 2. 域名配置
```bash
# 域名解析
dashboard.yourdomain.com -> 服务器IP

# HTTPS 证书（必需）
# 使用 Let's Encrypt 免费证书
certbot --nginx -d dashboard.yourdomain.com
```

#### 3. Nginx 配置
```nginx
server {
    listen 80;
    server_name dashboard.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/dashboard.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.yourdomain.com/privkey.pem;

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

#### 4. 使用 PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 构建项目
pnpm build

# 启动应用
pm2 start npm --name "dashboard" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 方案二：容器化部署

#### Docker 部署
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# 构建
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 运行
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
# 构建镜像
docker build -t dashboard:v1 .

# 运行容器
docker run -d -p 5000:5000 --name dashboard dashboard:v1
```

#### Docker Compose
```yaml
version: '3.8'
services:
  dashboard:
    build: .
    ports:
      - "5000:5000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

## 二、企业微信工作台集成

### 步骤1：企业微信后台配置

#### 1. 创建应用
```
登录企业微信管理后台 -> 应用管理 -> 应用 -> 自建 -> 创建应用
```

**必填信息：**
- 应用名称：商用净水经营驾驶舱
- 应用介绍：查看销售业绩、经销商数据、风险预警
- 应用Logo：上传应用图标
- 可见范围：选择需要访问的部门和人员

#### 2. 获取应用凭证
```
应用详情 -> 开发管理 -> 开发凭证
```

**保存以下信息：**
- 企业ID（CorpID）
- 应用的AgentId
- 应用的Secret

#### 3. 配置可信域名
```
应用详情 -> 开发管理 -> 开发配置
```

**配置内容：**
- 可信域名：https://dashboard.yourdomain.com
- 授权回调域名：https://dashboard.yourdomain.com

### 步骤2：实现企业微信登录

#### 1. 安装企业微信 SDK
```bash
pnpm add @wecom/jssdk
```

#### 2. 创建企业微信登录组件
```typescript
// src/components/wecom-login.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WeComLogin() {
  const router = useRouter();

  useEffect(() => {
    // 检查URL中的code参数
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 有code，获取用户信息
      handleLogin(code);
    } else {
      // 没有code，跳转到企业微信授权页面
      redirectToAuth();
    }
  }, []);

  const redirectToAuth = () => {
    const appId = process.env.NEXT_PUBLIC_WECOM_AGENT_ID;
    const redirectUri = encodeURIComponent(window.location.href);
    const state = 'login';

    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;

    window.location.href = authUrl;
  };

  const handleLogin = async (code: string) => {
    try {
      // 调用后端API，用code换取access_token和用户信息
      const response = await fetch('/api/auth/wecom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (result.success) {
        // 登录成功，跳转到主页面
        router.push('/');
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在登录企业微信...</p>
      </div>
    </div>
  );
}
```

#### 3. 创建后端API
```typescript
// src/app/api/auth/wecom/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const CORP_ID = process.env.WECOM_CORP_ID;
const CORP_SECRET = process.env.WECOM_CORP_SECRET;

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // 1. 获取access_token
    const tokenResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. 获取用户信息
    const userResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo?access_token=${accessToken}&code=${code}`
    );

    const userId = userResponse.data.UserId;

    // 3. 获取用户详细信息
    const detailResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`
    );

    const userInfo = detailResponse.data;

    // 4. 创建会话（使用JWT）
    const session = {
      userId: userInfo.userid,
      name: userInfo.name,
      mobile: userInfo.mobile,
      department: userInfo.department,
    };

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('企业微信登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    );
  }
}
```

### 步骤3：配置工作台入口

#### 1. 添加应用到工作台
```
企业微信管理后台 -> 应用管理 -> 应用 -> 自建 -> 商用净水经营驾驶舱
```

**配置内容：**
- 应用主页URL：https://dashboard.yourdomain.com
- 信任域名：https://dashboard.yourdomain.com

#### 2. 设置可见范围
- 选择可以访问的部门
- 选择可以访问的人员
- 权限控制：可以根据部门和角色分配不同权限

### 步骤4：权限控制

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 检查是否已登录
  const token = request.cookies.get('session');

  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 角色权限控制
  const userRole = request.cookies.get('role')?.value;

  if (request.nextUrl.pathname.startsWith('/dealer') && userRole !== 'boss') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 三、数据安全

### 1. HTTPS 强制使用
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};
```

### 2. 环境变量配置
```env
# .env.production（生产环境）
NODE_ENV=production
WECOM_CORP_ID=your_corp_id
WECOM_CORP_SECRET=your_corp_secret
DATABASE_URL=your_database_url
```

### 3. 数据加密
```typescript
// 敏感数据加密存储
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

function decrypt(encryptedText: string) {
  const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
  const encrypted = encryptedText.slice(32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

## 四、监控和维护

### 1. 日志监控
```bash
# PM2 日志
pm2 logs dashboard

# 日志文件位置
~/.pm2/logs/
```

### 2. 性能监控
```typescript
// 添加性能监控
import analytics from '@vercel/analytics';

analytics.track('page_view', {
  path: window.location.pathname,
  userId: user.id,
});
```

### 3. 自动备份
```bash
# 数据库备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres -d dashboard > backup_$DATE.sql

# 每天凌晨2点备份
0 2 * * * /path/to/backup.sh
```

## 五、快速启动清单

- [ ] 准备云服务器
- [ ] 配置域名和HTTPS证书
- [ ] 构建并部署应用
- [ ] 在企业微信后台创建应用
- [ ] 配置企业微信登录
- [ ] 添加到工作台
- [ ] 设置可见范围和权限
- [ ] 测试登录和数据访问
- [ ] 配置监控和备份

## 六、故障排查

### 1. 登录失败
- 检查企业微信应用配置是否正确
- 验证域名和HTTPS证书
- 查看后端日志

### 2. 数据不显示
- 检查API接口是否正常
- 验证数据库连接
- 查看浏览器控制台错误

### 3. 权限问题
- 检查middleware配置
- 验证角色分配
- 查看cookie设置

## 七、联系支持

如有问题，请联系：
- 技术支持：tech-support@example.com
- 企业微信对接：wecom-support@example.com
