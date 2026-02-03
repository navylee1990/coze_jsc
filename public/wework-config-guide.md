# 企业微信配置指南

## 🔧 配置步骤

### 步骤1：登录企业微信管理后台

访问：[https://work.weixin.qq.com/](https://work.weixin.qq.com/)

使用管理员账号登录。

---

### 步骤2：获取企业ID（CorpId）

1. 点击左侧菜单 **"我的企业"**
2. 点击 **"企业信息"**
3. 找到 **"企业ID"**（格式：`ww1234567890abcdef`）
4. 复制这个值

```
示例：ww1234567890abcdef
```

---

### 步骤3：获取应用信息（AgentId 和 Secret）

#### 3.1 创建应用（如果没有应用）

1. 点击左侧菜单 **"应用管理"**
2. 点击 **"应用"** → **"自建"** → **"创建应用"**
3. 填写应用信息：
   - 应用名称：`商用总经理驾驶舱`
   - 应用介绍：`商用总经理驾驶舱 - 查看风险识别和经营数据`
   - 应用logo：上传你的logo
4. 点击 **"确定创建"**

#### 3.2 获取 AgentId

1. 点击你创建的应用
2. 在 **"应用信息"** 页面找到 **"AgentId"**
3. 格式：数字，如 `1000001`
4. 复制这个值

```
示例：1000001
```

#### 3.3 获取 Secret

1. 在同一个页面找到 **"Secret"**
2. 点击 **"查看"** 按钮
3. 使用企业微信管理员扫码验证
4. 复制Secret值（格式：长字符串）

```
示例：abcdefghijklmnopqrstuvwxyz123456
```

⚠️ **重要提示**：
- Secret 只会显示一次，请立即复制保存
- 如果忘记，需要重新生成
- 请妥善保管Secret，不要泄露给他人

---

### 步骤4：配置应用主页

1. 在应用页面，找到 **"应用主页"**
2. 点击 **"配置"**
3. 填写主页地址：
   ```
   http://your-domain.com/gm
   ```
   - 开发环境：`http://localhost:5000/gm`
   - 生产环境：`http://your-domain.com/gm`
4. 点击 **"确定"**

---

### 步骤5：配置可信域名

1. 在应用页面，找到 **"开发者接口"**
2. 点击 **"网页授权及JS-SDK"**
3. 在 **"可信域名"** 中填写：
   ```
   your-domain.com
   ```
   - 开发环境：`localhost`
   - 生产环境：你的域名
4. 下载域名验证文件，上传到你的服务器根目录
5. 点击 **"确定"**

---

### 步骤6：更新 .env 文件

打开项目根目录的 `.env` 文件，替换以下配置：

```env
# ==================== 企业微信配置 ====================
# 企业微信企业ID
WEWORK_CORPID=ww1234567890abcdef

# 企业微信应用ID（AgentId）
WEWORK_AGENT_ID=1000001

# 企业微信应用Secret
WEWORK_SECRET=abcdefghijklmnopqrstuvwxyz123456

# 企业微信应用Token（用于接收消息回调，可选）
WEWORK_TOKEN=your_token_here

# 企业微信应用EncodingAESKey（用于消息加密，可选）
WEWORK_ENCODING_AES_KEY=your_encoding_aes_key_here
```

**替换说明**：
- `ww1234567890abcdef` → 替换为你的企业ID
- `1000001` → 替换为你的应用AgentId
- `abcdefghijklmnopqrstuvwxyz123456` → 替换为你的应用Secret

---

### 步骤7：重启开发服务器

配置完成后，需要重启开发服务器：

```bash
# 停止当前服务器（Ctrl + C）

# 重新启动
coze dev
```

或者，如果服务在后台运行：

```bash
# 查找并停止进程
ps aux | grep "coze dev"
kill -9 <进程ID>

# 重新启动
coze dev >/app/work/logs/bypass/dev.log 2>&1 &
```

---

### 步骤8：测试企业微信登录

1. 打开浏览器访问：`http://localhost:5000/gm`
2. 应该会自动跳转到企业微信授权页面
3. 使用企业微信扫码登录
4. 登录成功后会跳转回驾驶舱页面

---

## 🔍 常见问题

### Q1: 提示 "appid 参数错误"

**原因**：
- `WEWORK_CORPID` 环境变量的值不正确
- 可能是占位符（`your_corp_id_here`）没有替换

**解决**：
- 检查 `.env` 文件中的 `WEWORK_CORPID` 是否正确
- 确认企业ID格式（以 `ww` 开头）
- 重启开发服务器

---

### Q2: 提示 "redirect_uri 参数错误"

**原因**：
- `NEXTAUTH_URL` 环境变量的值不正确
- 企业微信应用的可信域名没有配置

**解决**：
- 检查 `.env` 文件中的 `NEXTAUTH_URL` 是否正确
- 在企业微信管理后台配置可信域名
- 确保回调地址格式正确

---

### Q3: 提示 "invalid code"

**原因**：
- 企业微信授权链接的 `redirect_uri` 不正确
- 可能是URL编码问题

**解决**：
- 检查 `middleware.ts` 中的重定向URL
- 确保回调地址正确编码

---

### Q4: 提示 "access_token 过期"

**原因**：
- 企业微信 access_token 默认有效期2小时
- 代码中已经实现了自动刷新，理论上不应该出现

**解决**：
- 检查系统时间是否正确
- 重启开发服务器

---

### Q5: 提示 "no permission"

**原因**：
- 当前用户没有权限访问该应用
- 应用没有分配给用户所在的部门

**解决**：
- 在企业微信管理后台，将应用分配给用户
- 或者将应用设置为全员可见

---

## 📋 配置检查清单

在完成配置后，请检查以下项目：

- [ ] 企业ID（CorpId）已正确填写
- [ ] 应用ID（AgentId）已正确填写
- [ ] 应用Secret已正确填写
- [ ] 应用主页已配置
- [ ] 可信域名已配置
- [ ] `.env` 文件已保存
- [ ] 开发服务器已重启
- [ ] 浏览器缓存已清除

---

## 🎯 快速测试

配置完成后，快速测试登录：

```bash
# 1. 检查环境变量
cat .env | grep WEWORK

# 2. 启动开发服务器
coze dev

# 3. 访问驾驶舱
# 浏览器打开：http://localhost:5000/gm

# 4. 应该会跳转到企业微信授权页面
# 如果提示 "appid 参数错误"，说明配置有问题
```

---

## 📞 获取帮助

如果遇到问题，请提供以下信息：

1. `.env` 文件中的企业微信配置（Secret可以脱敏）
2. 浏览器控制台的错误信息
3. 服务器日志（`/app/work/logs/bypass/dev.log`）
4. 截图：错误提示

---

## 📚 相关文档

- [企业微信API文档](https://developer.work.weixin.qq.com/document/path/91039)
- [企业微信OAuth2.0文档](https://developer.work.weixin.qq.com/document/path/91019)
- [企业微信网页授权文档](https://developer.work.weixin.qq.com/document/path/91033)
