# 商用总经理驾驶舱 - 前端技术栈

## 🎨 总体说明

**不是基础的 HTML + CSS**，而是使用现代化的 **React 技术栈**。

---

## 📦 核心技术栈

### 1. **Next.js 16** - 框架
- **类型**：React 框架（服务端渲染）
- **版本**：16.1.1
- **用途**：
  - 页面路由（App Router）
  - 服务端渲染（SSR）
  - API Routes（后端接口）
  - 代码分割和优化

### 2. **React 19** - UI 库
- **版本**：19.2.3
- **用途**：
  - 构建用户界面
  - 组件化开发
  - 状态管理（useState、useEffect等）

### 3. **TypeScript 5** - 类型系统
- **版本**：5.x
- **用途**：
  - 类型安全
  - 提高代码质量
  - 智能提示

---

## 🎨 样式框架

### 4. **Tailwind CSS 4** - 原子化 CSS 框架
- **版本**：4.x
- **用途**：
  - 快速构建样式
  - 响应式设计
  - 暗黑模式支持

**示例**：
```tsx
<div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
  <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-md">
    <h1 className="text-2xl font-bold text-cyan-400">
      驾驶舱
    </h1>
  </Card>
</div>
```

---

## 🧩 组件库

### 5. **shadcn/ui** - 高质量 React 组件库
- **底层**：Radix UI（无样式组件）+ Tailwind CSS
- **特点**：
  - 完全可定制
  - 无运行时开销
  - 代码完全在你的项目中

**已安装的组件**（27个）：
- `accordion` - 手风琴
- `alert-dialog` - 警告对话框
- `avatar` - 头像
- `card` - 卡片（使用最多）
- `dialog` - 对话框
- `dropdown-menu` - 下拉菜单
- `label` - 标签
- `popover` - 气泡
- `progress` - 进度条
- `scroll-area` - 滚动区域
- `select` - 选择器
- `separator` - 分隔线
- `tabs` - 标签页（使用最多）
- `toggle` - 切换开关
- `tooltip` - 提示框
- `button` - 按钮
- `badge` - 徽章
- `checkbox` - 复选框
- `switch` - 开关
- `slider` - 滑块
- `radio-group` - 单选组
- `aspect-ratio` - 宽高比
- `collapsible` - 折叠面板
- `context-menu` - 上下文菜单
- `hover-card` - 悬停卡片
- `menubar` - 菜单栏
- `navigation-menu` - 导航菜单
- `toggle-group` - 切换组

**示例**：
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Card className="border-cyan-500/30 bg-black/40 backdrop-blur-md">
  <CardHeader>
    <CardTitle className="text-cyan-400">驾驶舱</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>点击</Button>
    <Badge>状态</Badge>
    <Tabs>
      <TabsList>
        <TabsTrigger>Tab 1</TabsTrigger>
        <TabsTrigger>Tab 2</TabsTrigger>
      </TabsList>
    </Tabs>
  </CardContent>
</Card>
```

---

## 📊 图表库

### 6. **Recharts 2.15** - React 图表库
- **版本**：2.15.4
- **用途**：
  - 折线图（LineChart）
  - 面积图（AreaChart）
  - 柱状图（BarChart）
  - 饼图（PieChart）
  - 热力图（Heatmap）

**示例**：
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#00d4ff" />
  </LineChart>
</ResponsiveContainer>
```

---

## 🎯 图标库

### 7. **Lucide React** - 图标库
- **版本**：0.468.0
- **用途**：
  - 提供丰富的 SVG 图标
  - 轻量级（每个图标只包含必要的路径）

**项目中使用的图标**（18个）：
- `ArrowUp` - 上箭头
- `ArrowDown` - 下箭头
- `TrendingUp` - 上升趋势
- `TrendingDown` - 下降趋势
- `AlertTriangle` - 警告
- `Activity` - 活动
- `Target` - 目标
- `Clock` - 时钟
- `ChevronRight` - 右箭头
- `ChevronLeft` - 左箭头
- `BarChart3` - 柱状图
- `Play` - 播放
- `X` - 关闭
- `DollarSign` - 美元
- `CheckCircle2` - 成功
- `XCircle` - 失败
- `Plus` - 加号
- `Search` - 搜索

**示例**：
```tsx
import { ArrowUp, AlertTriangle, Clock } from 'lucide-react';

<div className="flex items-center gap-2">
  <ArrowUp className="w-4 h-4 text-green-400" />
  <AlertTriangle className="w-5 h-5 text-yellow-400" />
  <Clock className="w-6 h-6 text-cyan-400" />
</div>
```

---

## 🛠️ 其他重要库

### 8. **Axios** - HTTP 客户端
- **版本**：1.13.4
- **用途**：API 请求

**示例**：
```tsx
import axios from 'axios';

const response = await axios.get('/api/dashboard/summary');
```

### 9. **date-fns** - 日期处理
- **版本**：4.1.0
- **用途**：日期格式化、计算

### 10. **Zod** - 数据验证
- **版本**：4.3.5
- **用途**：表单验证、API 数据验证

### 11. **React Hook Form** - 表单管理
- **版本**：7.70.0
- **用途**：高效表单处理

### 12. **next-themes** - 主题切换
- **版本**：0.4.6
- **用途**：支持亮色/暗色模式

### 13. **sonner** - Toast 通知
- **版本**：2.0.7
- **用途**：优雅的提示框

---

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── gm/                # 驾驶舱页面
│   │   └── page.tsx       # 主页面
│   └── api/               # API Routes
│       ├── auth/          # 认证接口
│       ├── dashboard/     # 驾驶舱数据接口
│       └── risks/         # 风险识别接口
├── components/            # 组件
│   ├── ui/                # shadcn/ui 组件（27个）
│   ├── RiskIdentificationPanel.tsx
│   ├── RegionMatrix.tsx
│   └── ...
└── lib/                   # 工具函数
    ├── utils.ts           # 工具函数
    └── wework-auth.ts     # 企业微信认证
```

---

## 🎨 样式系统

### Tailwind CSS 配置

```tsx
// 使用 cn 函数合并 className
import { cn } from '@/lib/utils';

<div className={cn(
  "bg-gradient-to-br from-slate-900 to-slate-800",
  "min-h-screen p-4 md:p-8",
  "text-slate-100"
)}>
  {/* 内容 */}
</div>
```

### 常用样式类

**渐变背景**：
```tsx
bg-gradient-to-br from-slate-900 to-slate-800
bg-gradient-to-br from-blue-900/20 to-purple-900/20
```

**发光效果**：
```tsx
shadow-[0_0_20px_rgba(0,212,255,0.3)]
shadow-[0_0_15px_rgba(239,68,68,0.3)]
```

**边框**：
```tsx
border-cyan-500/30
border-red-500/30
```

**文字**：
```tsx
text-cyan-400
text-green-400
text-red-400
text-2xl font-bold
```

---

## 🚀 为什么选择这个技术栈？

### ✅ 优势

1. **现代化**：使用最新的 React 和 Next.js 16
2. **高性能**：服务端渲染、代码分割
3. **可维护**：TypeScript 类型安全
4. **美观**：shadcn/ui + Tailwind CSS
5. **响应式**：完美适配各种屏幕
6. **生态丰富**：大量的第三方库
7. **开发效率高**：组件化、热更新

### 📊 与传统 HTML+CSS 对比

| 特性 | 传统 HTML+CSS | 当前技术栈 |
|------|--------------|-----------|
| 开发效率 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 维护性 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 扩展性 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 性能 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 响应式 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 组件复用 | ⭐ | ⭐⭐⭐⭐⭐ |
| 类型安全 | ❌ | ✅ |
| 热更新 | ❌ | ✅ |

---

## 📚 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

---

## 💡 总结

**这是一个现代化、高性能、可维护的前端项目**，使用了业界最流行的技术栈：

- **框架**：Next.js 16 + React 19
- **语言**：TypeScript 5
- **样式**：Tailwind CSS 4
- **组件**：shadcn/ui (27个组件)
- **图表**：Recharts
- **图标**：Lucide React

**不是基础的 HTML+CSS，而是现代化的 React 技术栈！**
