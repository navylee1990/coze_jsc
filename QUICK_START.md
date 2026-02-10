# 云服务器快速部署指南

本指南帮助您快速将经销商销售预测系统部署到云服务器。

---

## 🚀 5分钟快速部署

### 前提条件
- 已有云服务器（推荐 Ubuntu 22.04）
- 服务器已配置好 PostgreSQL 数据库（阿里云 RDS、腾讯云 PostgreSQL 等）
- 已有域名（可选）

### 步骤1: 准备项目代码

#### 选项A: 使用 Git（推荐）

```bash
# 在沙盒环境中提交代码
cd /workspace/projects
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

#### 选项B: 打包下载

```bash
# 在沙盒环境中打包
cd /workspace/projects
tar -czf dealer-dashboard.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .

# 下载 dealer-dashboard.tar.gz 文件到本地
```

---

### 步骤2: 连接到云服务器

```bash
ssh root@your-server-ip
```

---

### 步骤3: 上传并部署项目

#### 如果使用 Git:

```bash
# 安装 Git
sudo apt update
sudo apt install git -y

# 克隆项目
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git dealer-dashboard
cd dealer-dashboard
sudo chown -R $USER:$USER .
```

#### 如果使用打包文件:

```bash
# 在本地使用 SCP 上传
scp dealer-dashboard.tar.gz root@your-server-ip:/var/www/

# 在服务器上解压
ssh root@your-server-ip
cd /var/www
tar -xzf dealer-dashboard.tar.gz
mv dealer-dashboard dealer-dashboard
cd dealer-dashboard
sudo chown -R $USER:$USER .
```

---

### 步骤4: 安装 Node.js 和 pnpm

```bash
# 安装 Node.js 24
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 24
nvm use 24
nvm alias default 24

# 验证安装
node -v  # 应该显示 v24.x.x

# 安装 pnpm
npm install -g pnpm
pnpm -v
```

---

### 步骤5: 配置环境变量

```bash
# 创建 .env 文件
nano .env
```

#### .env 配置内容：

```env
# 数据库连接（必须修改）
PGDATABASE_URL=postgresql://dealer_user:YourPassword123@your-db-host:5432/dealer_db?sslmode=require

# 应用配置
NODE_ENV=production
PORT=5000
```

**重要提示：**
- 将 `YourPassword123` 替换为真实密码
- 将 `your-db-host` 替换为数据库地址
- 如果使用云数据库（如阿里云 RDS），需要在数据库安全组中添加服务器IP白名单

---

### 步骤6: 测试数据库连接

```bash
# 安装 PostgreSQL 客户端
sudo apt install postgresql-client -y

# 测试连接
psql $PGDATABASE_URL -c "SELECT version();"

# 如果成功，会显示 PostgreSQL 版本信息
```

---

### 步骤7: 运行一键部署脚本

```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 运行部署脚本
bash deploy.sh
```

脚本会自动完成：
- ✅ 检查 Node.js 和 pnpm
- ✅ 检查环境变量
- ✅ 测试数据库连接
- ✅ 安装依赖
- ✅ 构建项目
- ✅ 使用 PM2 启动应用

---

### 步骤8: 验证部署

```bash
# 检查应用状态
pm2 status

# 查看日志
pm2 logs dealer-dashboard

# 测试本地访问
curl http://localhost:5000

# 应该返回 HTML 内容
```

---

### 步骤9: 配置 Nginx（可选但推荐）

```bash
# 安装 Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 配置 Nginx
chmod +x setup-nginx.sh
bash setup-nginx.sh your-domain.com

# 按照提示操作，会自动：
# 1. 创建 Nginx 配置
# 2. 申请 SSL 证书
# 3. 配置反向代理
```

---

### 步骤10: 配置域名解析（可选）

在域名服务商（如阿里云、腾讯云）配置：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 您的服务器IP |
| A | www | 您的服务器IP |

---

## 📋 常用命令

### 应用管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs dealer-dashboard

# 重启应用
pm2 restart dealer-dashboard

# 停止应用
pm2 stop dealer-dashboard

# 监控
pm2 monit
```

### 更新代码

```bash
# 拉取最新代码
cd /var/www/dealer-dashboard
git pull origin main

# 重新安装依赖（如有需要）
pnpm install --frozen-lockfile

# 重新构建
pnpm build

# 重启应用
pm2 restart dealer-dashboard
```

### 查看日志

```bash
# 应用日志
pm2 logs dealer-dashboard

# Nginx 日志
sudo tail -f /var/log/nginx/dealer-dashboard-error.log
sudo tail -f /var/log/nginx/dealer-dashboard-access.log
```

---

## 🔧 常见问题

### 1. 数据库连接失败

**症状：**
```
psql: error: could not connect to server
```

**解决方法：**
1. 检查 `.env` 文件中的连接字符串是否正确
2. 检查数据库安全组是否添加了服务器IP
3. 检查数据库用户名和密码是否正确
4. 尝试添加 `?sslmode=require` 到连接字符串

### 2. 构建失败

**症状：**
```
Build failed
```

**解决方法：**
```bash
# 清理缓存
rm -rf .next node_modules

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

### 3. 应用无法访问

**症状：**
- 浏览器访问域名显示 "无法访问此网站"

**解决方法：**
```bash
# 检查应用是否运行
pm2 status

# 检查端口
sudo netstat -tlnp | grep :5000

# 检查 Nginx 配置
sudo nginx -t

# 检查防火墙
sudo ufw status
```

### 4. 内存不足

**症状：**
- 应用频繁重启
- PM2 显示 "restart time too high"

**解决方法：**
```bash
# 查看内存使用
free -h

# 限制 PM2 内存使用
pm2 stop dealer-dashboard
pm2 start .cozeproj/scripts/start.sh --name dealer-dashboard --max-memory-restart=500M
```

---

## 🔒 安全建议

### 1. 配置防火墙

```bash
# 启用防火墙
sudo ufw enable

# 允许必要端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

### 2. 配置 SSH 密钥登录

```bash
# 在本地生成 SSH 密钥
ssh-keygen -t rsa -b 4096

# 复制公钥到服务器
ssh-copy-id root@your-server-ip

# 禁用密码登录
sudo nano /etc/ssh/sshd_config
# 修改: PasswordAuthentication no
sudo systemctl restart sshd
```

### 3. 定期备份数据库

```bash
# 手动备份
pg_dump $PGDATABASE_URL > backup_$(date +%Y%m%d).sql

# 定时备份（添加到 crontab）
crontab -e
# 添加: 0 2 * * * /usr/bin/pg_dump $PGDATABASE_URL > /backup/db_$(date +\%Y\%m\%d).sql
```

---

## ✅ 部署检查清单

- [ ] 代码已上传到服务器
- [ ] Node.js 和 pnpm 已安装
- [ ] `.env` 文件已配置
- [ ] 数据库连接已测试
- [ ] 项目已构建成功
- [ ] PM2 进程已启动
- [ ] 应用可以访问
- [ ] Nginx 已配置（可选）
- [ ] SSL 证书已配置（可选）
- [ ] 防火墙已配置
- [ ] 备份策略已制定

---

## 📞 需要帮助？

查看详细文档：
- **完整部署指南**: [CLOUD_DEPLOYMENT_GUIDE.md](./CLOUD_DEPLOYMENT_GUIDE.md)
- **数据库接入**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **前端集成示例**: [FRONTEND_INTEGRATION_EXAMPLE.tsx](./FRONTEND_INTEGRATION_EXAMPLE.tsx)

---

**祝您部署成功！** 🎉
