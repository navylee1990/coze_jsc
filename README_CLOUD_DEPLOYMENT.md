# 🚀 云服务器部署 - 文件说明

## 📦 已创建的文件

### 1. CLOUD_DEPLOYMENT_GUIDE.md
**完整的云服务器部署指南**（约4000字）

包含内容：
- 环境准备（服务器配置、软件安装）
- 项目迁移（Git、SFTP）
- 服务器环境配置
- 项目部署
- Nginx反向代理配置
- SSL证书配置
- PM2进程管理
- 监控和日志
- 常见问题解决
- 安全建议

**适用人群：** 需要详细了解每个步骤的用户

---

### 2. QUICK_START.md
**5分钟快速部署指南**

包含内容：
- 快速部署流程
- 一键命令示例
- 常用命令速查
- 常见问题快速解决

**适用人群：** 有一定Linux经验，希望快速完成部署的用户

---

### 3. deploy.sh
**一键部署脚本**

功能：
- ✅ 自动检查 Node.js 版本
- ✅ 自动安装 pnpm（如需要）
- ✅ 验证 .env 文件
- ✅ 测试数据库连接
- ✅ 自动安装依赖
- ✅ 自动构建项目
- ✅ 自动使用 PM2 启动应用

使用方法：
```bash
chmod +x deploy.sh
bash deploy.sh
```

---

### 4. setup-nginx.sh
**Nginx 自动配置脚本**

功能：
- ✅ 自动创建 Nginx 配置
- ✅ 自动申请 SSL 证书（Let's Encrypt）
- ✅ 自动配置 HTTPS
- ✅ 自动配置反向代理

使用方法：
```bash
chmod +x setup-nginx.sh
bash setup-nginx.sh your-domain.com
```

---

## 🎯 快速开始（3个步骤）

### 步骤1: 准备项目

**在沙盒环境中执行：**

```bash
# 方式A: 使用 Git（推荐）
cd /workspace/projects
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main

# 方式B: 打包下载
cd /workspace/projects
tar -czf dealer-dashboard.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .
# 下载 dealer-dashboard.tar.gz 到本地
```

### 步骤2: 部署到服务器

**在云服务器上执行：**

```bash
# 1. 安装 Node.js 和 pnpm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 24
nvm use 24
npm install -g pnpm

# 2. 获取项目代码
# 如果使用 Git
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git dealer-dashboard
cd dealer-dashboard
sudo chown -R $USER:$USER .

# 如果使用打包文件（先上传 dealer-dashboard.tar.gz）
cd /var/www
sudo tar -xzf dealer-dashboard.tar.gz
cd dealer-dashboard
sudo chown -R $USER:$USER .

# 3. 配置环境变量
nano .env
# 填入: PGDATABASE_URL=postgresql://...

# 4. 运行一键部署
chmod +x deploy.sh
bash deploy.sh
```

### 步骤3: 配置域名（可选）

```bash
# 安装 Nginx
sudo apt install nginx -y

# 运行 Nginx 配置脚本
chmod +x setup-nginx.sh
bash setup-nginx.sh your-domain.com

# 在域名服务商配置 DNS 解析
# A记录: your-domain.com -> 您的服务器IP
```

---

## 📚 文档选择指南

| 您的情况 | 推荐阅读 |
|---------|---------|
| 首次部署，需要详细指导 | [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md) |
| 有经验，想快速完成 | [QUICK_START.md](./QUICK_START.md) |
| 只需自动化脚本 | 使用 `deploy.sh` 和 `setup-nginx.sh` |

---

## ⚙️ 必须修改的配置

### 1. .env 文件

```env
# 必须修改
PGDATABASE_URL=postgresql://用户名:密码@数据库地址:端口/数据库名?sslmode=require

# 可选
NODE_ENV=production
PORT=5000
```

### 2. 数据库安全组/白名单

如果您使用云数据库（如阿里云 RDS），需要在数据库管理控制台添加：
- 服务器IP地址
- 或 IP段（如 0.0.0.0/0，不推荐用于生产环境）

---

## 🔍 验证部署

### 1. 检查应用状态

```bash
pm2 status
```

应该看到：
```
┌────┬─────────────────┬──────┬─────────┬──────────┬──────────┐
│ id │ name            │ mode │ status  │ cpu      │ memory   │
├────┼─────────────────┼──────┼─────────┼──────────┼──────────┤
│ 0  │ dealer-dashboard│ fork │ online  │ 0%       │ 150MB    │
└────┴─────────────────┴──────┴─────────┴──────────┴──────────┘
```

### 2. 测试本地访问

```bash
curl http://localhost:5000
```

应该返回 HTML 内容。

### 3. 测试公网访问

在浏览器访问：
- `http://your-server-ip:5000`（未配置 Nginx）
- `https://your-domain.com`（已配置 Nginx 和 SSL）

---

## 🛠️ 常用维护命令

### 更新代码

```bash
cd /var/www/dealer-dashboard
git pull origin main
pnpm install --frozen-lockfile
pnpm build
pm2 restart dealer-dashboard
```

### 查看日志

```bash
# 应用日志
pm2 logs dealer-dashboard

# Nginx 日志
sudo tail -f /var/log/nginx/dealer-dashboard-error.log
```

### 重启应用

```bash
pm2 restart dealer-dashboard
```

---

## 🔒 安全提醒

### 1. 不要做的事情

❌ 不要将 `.env` 文件提交到 Git
❌ 不要使用弱密码
❌ 不要开放不必要的端口
❌ 不要以 root 用户运行应用

### 2. 建议做的事情

✅ 使用 SSH 密钥登录
✅ 配置防火墙
✅ 定期更新系统和软件
✅ 定期备份数据库
✅ 使用 SSL 证书（HTTPS）

---

## 📞 需要帮助？

### 常见问题

查看 [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md) 的"常见问题"章节。

### 调试步骤

1. 查看应用日志：`pm2 logs dealer-dashboard`
2. 查看系统日志：`journalctl -xe`
3. 测试数据库连接：`psql $PGDATABASE_URL -c "SELECT version();"`
4. 检查端口占用：`sudo netstat -tlnp | grep :5000`

---

## ✅ 完成检查

部署完成后，请确认：

- [ ] 应用正常运行（`pm2 status` 显示 online）
- [ ] 本地可以访问（`curl http://localhost:5000`）
- [ ] 公网可以访问（浏览器访问域名或IP）
- [ ] 数据库连接正常
- [ ] Nginx 配置正确（如果使用了）
- [ ] SSL 证书有效（如果配置了）
- [ ] 防火墙已配置
- [ ] 备份策略已制定

---

## 🎉 总结

您现在拥有：

1. ✅ **完整的项目代码**（包含数据库接入）
2. ✅ **详细的部署文档**（CLOUD_DEPLOYMENT_GUIDE.md）
3. ✅ **快速部署指南**（QUICK_START.md）
4. ✅ **自动化部署脚本**（deploy.sh）
5. ✅ **Nginx 配置脚本**（setup-nginx.sh）
6. ✅ **示例数据初始化脚本**（init-sample-data.sql）

选择适合您的文档或脚本，开始部署吧！

**祝您部署成功！** 🚀
