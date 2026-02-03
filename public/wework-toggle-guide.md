# 企业微信认证开关说明

## 🎯 当前状态

**企业微信认证已禁用** ✅

现在可以直接访问驾驶舱页面，无需登录：
- 访问地址：`http://localhost:5000/gm`
- 无需配置企业微信
- 无需扫码登录

---

## 🔧 如何启用企业微信认证

### 步骤1：配置企业微信信息

按照 `public/wework-config-guide.md` 中的说明，配置以下环境变量：

```env
# 企业微信企业ID
WEWORK_CORPID=ww1234567890abcdef

# 企业微信应用ID（AgentId）
WEWORK_AGENT_ID=1000001

# 企业微信应用Secret
WEWORK_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 步骤2：启用企业微信认证

打开 `.env` 文件，将 `WEWORK_ENABLED` 设置为 `true`：

```env
# 是否启用企业微信认证
WEWORK_ENABLED=true
```

### 步骤3：重启开发服务器

```bash
# 停止当前服务器（Ctrl + C）
# 重新启动
coze dev
```

### 步骤4：测试认证

访问 `http://localhost:5000/gm`，应该会自动跳转到企业微信授权页面。

---

## 🔧 如何禁用企业微信认证

如果不需要企业微信认证，或者想暂时禁用：

### 步骤1：禁用企业微信认证

打开 `.env` 文件，将 `WEWORK_ENABLED` 设置为 `false`：

```env
# 是否启用企业微信认证
WEWORK_ENABLED=false
```

### 步骤2：重启开发服务器

```bash
# 停止当前服务器（Ctrl + C）
# 重新启动
coze dev
```

### 步骤3：测试访问

访问 `http://localhost:5000/gm`，应该可以直接访问驾驶舱页面，无需登录。

---

## 📋 环境变量说明

| 环境变量 | 说明 | 开发环境 | 生产环境 |
|---------|------|---------|---------|
| `WEWORK_ENABLED` | 是否启用企业微信认证 | `false` | `true` |
| `WEWORK_CORPID` | 企业微信企业ID | 需要配置 | 需要配置 |
| `WEWORK_AGENT_ID` | 企业微信应用ID | 需要配置 | 需要配置 |
| `WEWORK_SECRET` | 企业微信应用Secret | 需要配置 | 需要配置 |

---

## 🚀 使用建议

### 开发环境

建议保持 `WEWORK_ENABLED=false`，这样可以：
- ✅ 快速开发和测试
- ✅ 无需配置企业微信
- ✅ 直接访问驾驶舱页面
- ✅ 不受网络环境影响

### 生产环境

必须设置 `WEWORK_ENABLED=true`，这样可以：
- ✅ 确保数据安全
- ✅ 只有授权用户才能访问
- ✅ 与企业微信集成

---

## 🧪 快速测试

### 测试禁用状态

```bash
# 1. 确认配置
cat .env | grep WEWORK_ENABLED
# 应该输出：WEWORK_ENABLED=false

# 2. 访问驾驶舱
# 浏览器打开：http://localhost:5000/gm
# 应该可以直接访问，无需登录
```

### 测试启用状态

```bash
# 1. 修改配置
# 将 WEWORK_ENABLED 改为 true

# 2. 重启服务器
coze dev

# 3. 访问驾驶舱
# 浏览器打开：http://localhost:5000/gm
# 应该会跳转到企业微信授权页面
```

---

## ❓ 常见问题

### Q1: 设置了 WEWORK_ENABLED=true，但还是可以直接访问？

**原因**：
- 开发服务器没有重启
- 环境变量没有生效

**解决**：
- 检查 `.env` 文件是否保存
- 重启开发服务器
- 清除浏览器缓存

---

### Q2: 设置了 WEWORK_ENABLED=false，但还是跳转到企业微信？

**原因**：
- 浏览器缓存了旧的中间件逻辑
- Cookie 中还有旧的 session

**解决**：
- 清除浏览器缓存和 Cookie
- 重启开发服务器
- 使用无痕模式访问

---

### Q3: 修改了 WEWORK_ENABLED，需要做什么？

**回答**：
- 修改 `.env` 文件
- 重启开发服务器
- 清除浏览器缓存

---

## 📚 相关文档

- [企业微信配置指南](./wework-config-guide.md)
- [环境变量示例](../.env.example)
