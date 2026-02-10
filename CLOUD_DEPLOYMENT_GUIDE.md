# 云服务器部署完整指南

本指南帮助您将经销商销售预测系统部署到自己的云服务器（阿里云、腾讯云、华为云等）。

---

## 📋 目录

1. [环境准备](#环境准备)
2. [项目迁移](#项目迁移)
3. [服务器环境配置](#服务器环境配置)
4. [项目部署](#项目部署)
5. [Nginx反向代理配置](#nginx反向代理配置)
6. [SSL证书配置（可选）](#ssl证书配置可选)
7. [进程管理（PM2）](#进程管理pm2)
8. [监控和日志](#监控和日志)
9. [常见问题](#常见问题)

---

## 🖥️ 环境准备

### 1. 云服务器配置推荐

**最低配置：**
- CPU: 2核
- 内存: 2GB
- 硬盘: 40GB
- 操作系统: Ubuntu 20.04 / 22.04 或 CentOS 7/8

**推荐配置：**
- CPU: 4核
- 内存: 4GB
- 硬盘: 80GB
- 操作系统: Ubuntu 22.04 LTS

### 2. 安装必要软件

#### 连接到服务器

```bash
# 使用SSH连接到您的云服务器
ssh root@your-server-ip

# 或使用密钥
ssh -i /path/to/your-key.pem root@your-server-ip
```

#### 更新系统

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### 安装 Node.js 24

```bash
# Ubuntu/Debian - 使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 24
nvm use 24
nvm alias default 24

# 验证安装
node -v  # 应该显示 v24.x.x
npm -v
```

#### 安装 pnpm

```bash
npm install -g pnpm
pnpm -v
```

#### 安装 PostgreSQL 客户端（用于连接远程数据库）

```bash
# Ubuntu/Debian
sudo apt install postgresql-client -y

# CentOS/RHEL
sudo yum install postgresql -y
```

#### 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 安装 PM2（进程管理）

```bash
pnpm add -g pm2
```

---

## 📦 项目迁移

### 方法1: 使用 Git（推荐）

#### 在沙盒环境中提交代码

```bash
# 进入项目目录
cd /workspace/projects

# 初始化Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 经销商销售预测系统初始版本"

# 推送到远程仓库（如GitHub/GitLab）
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

#### 在云服务器上克隆项目

```bash
# 安装 Git
sudo apt install git -y  # Ubuntu/Debian
sudo yum install git -y  # CentOS/RHEL

# 克隆项目
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git dealer-dashboard
cd dealer-dashboard

# 设置权限
sudo chown -R $USER:$USER .
```

### 方法2: 使用 SFTP/SCP 上传

#### 在本地打包项目

```bash
# 在沙盒环境中，进入项目目录
cd /workspace/projects

# 排除不需要的文件
tar -czf dealer-dashboard.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=dist \
  --exclude=.git \
  --exclude=.env \
  .
```

#### 上传到云服务器

```bash
# 使用 scp 上传
scp dealer-dashboard.tar.gz root@your-server-ip:/var/www/

# 或使用 SFTP 客户端（如 FileZilla）
```

#### 在云服务器上解压

```bash
# SSH 连接到服务器
ssh root@your-server-ip

# 解压
cd /var/www
tar -xzf dealer-dashboard.tar.gz
mv <解压后的文件夹> dealer-dashboard
cd dealer-dashboard

# 设置权限
sudo chown -R $USER:$USER .
```

---

## ⚙️ 服务器环境配置

### 1. 创建环境变量文件

```bash
# 创建 .env 文件
nano .env
```

#### 环境变量配置示例

```env
# 数据库连接（替换为您的真实数据库信息）
PGDATABASE_URL=postgresql://dealer_user:SecurePassword123@your-db-host:5432/dealer_db?sslmode=require

# 可选：应用配置
NODE_ENV=production
PORT=5000
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com

# 可选：企业微信配置（如果需要）
WEWORK_ENABLED=false
WEWORK_CORP_ID=your_corp_id
WEWORK_SECRET=your_secret
WEWORK_AGENT_ID=your_agent_id

# 可选：日志配置
LOG_LEVEL=info
```

**重要安全提示：**
- 不要将 `.env` 文件提交到 Git
- 使用强密码
- 启用 SSL 连接数据库

### 2. 配置防火墙

```bash
# Ubuntu (UFW)
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## 🚀 项目部署

### 1. 安装依赖

```bash
cd /var/www/dealer-dashboard

# 安装依赖
pnpm install --frozen-lockfile
```

### 2. 测试数据库连接

```bash
# 测试数据库连接
psql $PGDATABASE_URL -c "SELECT version();"

# 如果失败，检查：
# 1. 数据库地址是否正确
# 2. 用户名和密码是否正确
# 3. 数据库服务器是否允许您的服务器IP连接
```

### 3. 导入数据库表结构

```bash
# 如果数据库是空的，需要创建表结构
# 方法1: 使用 Coze CLI（推荐）
coze-coding-ai db upgrade

# 方法2: 手动执行 SQL（如果使用其他数据库）
psql $PGDATABASE_URL -f init-sample-data.sql
```

### 4. 构建项目

```bash
# 构建生产版本
pnpm build

# 或者使用 Coze CLI
coze build
```

### 5. 使用 PM2 启动服务

```bash
# 启动应用
pm2 start .cozeproj/scripts/start.sh --name dealer-dashboard

# 或者直接使用 coze start
# coze start &

# 查看状态
pm2 status

# 查看日志
pm2 logs dealer-dashboard

# 重启
pm2 restart dealer-dashboard

# 停止
pm2 stop dealer-dashboard

# 设置开机自启
pm2 startup
pm2 save
```

### 6. 验证服务

```bash
# 检查服务是否运行
pm2 status

# 测试本地访问
curl http://localhost:5000

# 应该返回 HTML 内容
```

---

## 🌐 Nginx反向代理配置

### 1. 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/dealer-dashboard
```

### 2. 配置内容

```nginx
# HTTP 配置（重定向到 HTTPS）
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置（见下文）
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/dealer-dashboard-access.log;
    error_log /var/log/nginx/dealer-dashboard-error.log;

    # 客户端上传大小限制
    client_max_body_size 20M;

    # Next.js 代理配置
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        # 代理头设置
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # 真实IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://127.0.0.1:5000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # API 路由
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/dealer-dashboard /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 4. 临时 HTTP 配置（如果还没有 SSL）

```nginx
# 临时使用 HTTP（没有 SSL）
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 SSL证书配置（可选但推荐）

### 使用 Let's Encrypt 免费证书

#### 1. 安装 Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

#### 2. 获取证书

```bash
# 自动配置 Nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按照提示操作：
# 1. 输入邮箱
# 2. 同意服务条款
# 3. 选择是否分享邮箱
# 4. 选择重定向到 HTTPS（建议选 2）
```

#### 3. 自动续期

```bash
# 测试续期
sudo certbot renew --dry-run

# Certbot 会自动设置定时任务，无需手动配置
# 查看定时任务
sudo systemctl status certbot.timer
```

### 手动配置 SSL（如果使用其他证书）

```bash
# 将证书文件放到服务器
# /path/to/your/certificate.crt
# /path/to/your/private.key

# 修改 Nginx 配置
sudo nano /etc/nginx/sites-available/dealer-dashboard
```

```nginx
ssl_certificate /path/to/your/certificate.crt;
ssl_certificate_key /path/to/your/private.key;
```

---

## 🔄 进程管理（PM2）

### PM2 常用命令

```bash
# 启动
pm2 start .cozeproj/scripts/start.sh --name dealer-dashboard

# 查看状态
pm2 status

# 查看日志
pm2 logs dealer-dashboard
pm2 logs dealer-dashboard --lines 100

# 监控
pm2 monit

# 重启
pm2 restart dealer-dashboard

# 停止
pm2 stop dealer-dashboard

# 删除
pm2 delete dealer-dashboard

# 查看详细信息
pm2 show dealer-dashboard
```

### PM2 配置文件（可选）

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'dealer-dashboard',
    script: '.cozeproj/scripts/start.sh',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/dealer-dashboard/error.log',
    out_file: '/var/log/dealer-dashboard/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

使用配置文件启动：

```bash
pm2 start ecosystem.config.js
```

### 开机自启

```bash
# 生成启动脚本
pm2 startup

# 保存当前进程列表
pm2 save
```

---

## 📊 监控和日志

### 1. 应用日志

```bash
# PM2 日志
pm2 logs dealer-dashboard

# 或查看日志文件
tail -f /var/log/dealer-dashboard/out.log
tail -f /var/log/dealer-dashboard/error.log
```

### 2. Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/dealer-dashboard-access.log

# 错误日志
tail -f /var/log/nginx/dealer-dashboard-error.log
```

### 3. 系统资源监控

```bash
# CPU 和内存
htop
# 或
top

# 磁盘使用
df -h

# 内存使用
free -h
```

### 4. 数据库连接监控

```bash
# 检查数据库连接数
psql $PGDATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# 查看活跃连接
psql $PGDATABASE_URL -c "SELECT state, count(*) FROM pg_stat_activity GROUP BY state;"
```

---

## 🔧 常见问题

### 1. 端口被占用

```bash
# 查看端口占用
sudo netstat -tlnp | grep :5000
# 或
sudo ss -tlnp | grep :5000

# 停止占用端口的进程
sudo kill <PID>

# 或修改应用端口（在 .env 或代码中）
```

### 2. 数据库连接失败

```bash
# 检查连接
psql $PGDATABASE_URL -c "SELECT version();"

# 常见原因：
# 1. 防火墙阻止 - 检查数据库服务器防火墙
# 2. 白名单限制 - 检查云数据库的安全组/白名单
# 3. 连接字符串错误 - 检查 .env 文件
# 4. SSL 配置 - 添加 ?sslmode=require
```

### 3. 构建失败

```bash
# 清理缓存
rm -rf .next node_modules

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

### 4. Nginx 502 错误

```bash
# 检查应用是否运行
pm2 status

# 检查端口
curl http://localhost:5000

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
tail -f /var/log/nginx/dealer-dashboard-error.log
```

### 5. 内存不足

```bash
# 查看内存使用
free -h

# 优化 PM2 配置（限制内存）
pm2 stop dealer-dashboard
pm2 start .cozeproj/scripts/start.sh --name dealer-dashboard --max-memory-restart=500M

# 或增加服务器内存/swap
```

---

## 📝 更新部署流程

当需要更新代码时：

```bash
# 1. 拉取最新代码
cd /var/www/dealer-dashboard
git pull origin main

# 2. 安装依赖（如有更新）
pnpm install --frozen-lockfile

# 3. 重新构建
pnpm build

# 4. 重启应用
pm2 restart dealer-dashboard

# 5. 检查状态
pm2 status
pm2 logs dealer-dashboard --lines 50
```

---

## ✅ 部署检查清单

- [ ] 服务器环境已配置（Node.js, pnpm, Nginx）
- [ ] 代码已上传到服务器
- [ ] `.env` 文件已配置
- [ ] 数据库连接已测试
- [ ] 数据库表结构已创建
- [ ] 项目已构建成功
- [ ] PM2 进程已启动并正常运行
- [ ] Nginx 已配置并运行
- [ ] 域名已解析到服务器IP
- [ ] SSL 证书已配置（可选但推荐）
- [ ] 防火墙规则已配置
- [ ] 日志和监控已设置
- [ ] 备份策略已制定

---

## 🚨 安全建议

1. **定期更新系统和软件**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **配置 SSH 密钥登录**
   ```bash
   # 禁用密码登录
   sudo nano /etc/ssh/sshd_config
   # 修改: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

3. **配置防火墙**
   ```bash
   sudo ufw enable
   ```

4. **定期备份数据库**
   ```bash
   # 备份数据库
   pg_dump $PGDATABASE_URL > backup_$(date +%Y%m%d).sql

   # 定期备份（使用 cron）
   0 2 * * * /usr/bin/pg_dump $PGDATABASE_URL > /backup/db_$(date +\%Y\%m\%d).sql
   ```

5. **配置 fail2ban 防止暴力破解**
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

---

## 📞 技术支持

如遇到问题，请检查：

1. 应用日志：`pm2 logs dealer-dashboard`
2. Nginx 日志：`/var/log/nginx/dealer-dashboard-error.log`
3. 系统日志：`journalctl -xe`
4. 数据库连接：`psql $PGDATABASE_URL -c "SELECT version();"`

---

**祝您部署成功！** 🎉
