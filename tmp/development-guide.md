# 商用净水经营驾驶舱 - 快速开发指南

## 一、项目初始化

```bash
# 1. 克隆或创建项目
git clone <项目地址>
cd <项目目录>

# 2. 安装依赖
pnpm install

# 3. 启动开发环境
coze dev

# 开发服务器运行在 http://localhost:5000
```

## 二、开发流程

### 1. 本地开发
```bash
# 启动开发环境（支持热更新）
coze dev

# 访问应用
open http://localhost:5000
```

### 2. 代码修改
- 修改代码后自动热更新，无需重启
- 保存文件即可看到变化
- 推荐使用 VS Code + TypeScript 插件

### 3. 类型检查
```bash
# 运行类型检查
npx tsc --noEmit
```

## 三、构建和部署

### 1. 生产构建
```bash
# 构建生产版本
coze build

# 构建产物在 .next 目录
```

### 2. 本地测试生产环境
```bash
# 启动生产环境
coze start

# 访问 http://localhost:5000
```

### 3. 环境变量配置
创建 `.env.local` 文件：
```env
# 应用配置
NEXT_PUBLIC_APP_NAME=商用净水经营驾驶舱
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com

# 企业微信配置（可选）
NEXT_PUBLIC_WECOM_CORP_ID=your_corp_id
```

## 四、项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页（导航分发）
│   ├── sales/                # 销售管理驾驶舱
│   │   └── page.tsx
│   └── dealer/               # 经销商老板驾驶舱
│       └── page.tsx
├── components/
│   └── ui/                   # shadcn/ui 组件库
├── lib/                      # 工具函数
└── types/                    # TypeScript 类型定义
```

## 五、开发规范

### 1. 组件开发
- 使用 React 19 + TypeScript
- 使用 shadcn/ui 组件库
- 遵循函数式组件规范

### 2. 样式规范
- 使用 Tailwind CSS
- 统一使用 text-sm 字体大小
- 主题色：蓝色系

### 3. 数据模拟
- 本地开发使用 mock 数据
- 数据定义在各页面文件的顶部常量

## 六、API 集成

### 1. 创建 API 路由
```typescript
// src/app/api/data/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // 获取真实数据
  const data = await fetchFromDatabase();
  return NextResponse.json(data);
}
```

### 2. 前端调用
```typescript
// 使用 fetch API
const response = await fetch('/api/data');
const data = await response.json();
```

## 七、常见问题

### 1. 端口占用
```bash
# 检查5000端口
lsof -i:5000

# 杀死进程
kill -9 <PID>
```

### 2. 依赖安装失败
```bash
# 清理缓存
rm -rf node_modules .next
pnpm install
```

### 3. 类型错误
```bash
# 重新生成类型
npx tsc --noEmit
```
