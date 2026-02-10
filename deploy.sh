#!/bin/bash

# 经销商销售预测系统 - 一键部署脚本
# 使用方法: bash deploy.sh

set -e  # 遇到错误立即退出

echo "=================================="
echo "  经销商销售预测系统 - 部署脚本"
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：打印成功信息
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 函数：打印错误信息
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 函数：打印警告信息
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 检查是否为 root 用户
if [ "$EUID" -eq 0 ]; then
    print_error "请不要使用 root 用户运行此脚本"
    print_warning "建议使用普通用户，如需 sudo 权限会自动提示"
    exit 1
fi

# 1. 检查 Node.js 版本
echo "1. 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装，请先安装 Node.js 24"
    echo "安装命令: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && source ~/.bashrc && nvm install 24"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 版本过低，当前版本: $(node -v)，需要 18+"
    exit 1
fi
print_success "Node.js 版本: $(node -v)"

# 2. 检查 pnpm
echo "2. 检查 pnpm..."
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm 未安装，正在安装..."
    npm install -g pnpm
fi
print_success "pnpm 版本: $(pnpm -v)"

# 3. 检查环境变量文件
echo "3. 检查环境变量配置..."
if [ ! -f .env ]; then
    print_error ".env 文件不存在"
    echo "请先创建 .env 文件并配置数据库连接信息"
    echo ""
    echo "示例配置："
    echo "PGDATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require"
    exit 1
fi
print_success ".env 文件已存在"

# 4. 测试数据库连接
echo "4. 测试数据库连接..."
if ! command -v psql &> /dev/null; then
    print_warning "psql 未安装，跳过数据库连接测试"
else
    if psql "$PGDATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
        print_success "数据库连接成功"
    else
        print_error "数据库连接失败，请检查 PGDATABASE_URL"
        exit 1
    fi
fi

# 5. 安装依赖
echo "5. 安装项目依赖..."
pnpm install --frozen-lockfile
print_success "依赖安装完成"

# 6. 构建项目
echo "6. 构建项目..."
pnpm build
print_success "项目构建完成"

# 7. 检查 PM2
echo "7. 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 未安装，正在安装..."
    pnpm add -g pm2
fi
print_success "PM2 版本: $(pm2 -v)"

# 8. 停止旧进程（如果存在）
echo "8. 检查现有进程..."
if pm2 list | grep -q "dealer-dashboard"; then
    print_warning "发现旧进程，正在停止..."
    pm2 stop dealer-dashboard || true
    pm2 delete dealer-dashboard || true
fi

# 9. 启动应用
echo "9. 启动应用..."
if [ -f .cozeproj/scripts/start.sh ]; then
    pm2 start .cozeproj/scripts/start.sh --name dealer-dashboard
else
    print_error "启动脚本不存在: .cozeproj/scripts/start.sh"
    exit 1
fi
print_success "应用已启动"

# 10. 等待应用启动
echo "10. 等待应用启动..."
sleep 5

# 11. 检查应用状态
echo "11. 检查应用状态..."
if pm2 list | grep -q "dealer-dashboard.*online"; then
    print_success "应用运行正常"
else
    print_error "应用启动失败"
    echo ""
    echo "查看日志: pm2 logs dealer-dashboard"
    exit 1
fi

# 12. 测试本地访问
echo "12. 测试本地访问..."
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    print_success "本地访问测试通过"
else
    print_warning "本地访问测试失败，请检查应用日志"
fi

# 完成
echo ""
echo "=================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=================================="
echo ""
echo "常用命令："
echo "  查看状态: pm2 status"
echo "  查看日志: pm2 logs dealer-dashboard"
echo "  重启应用: pm2 restart dealer-dashboard"
echo "  停止应用: pm2 stop dealer-dashboard"
echo ""
echo "下一步："
echo "  1. 配置 Nginx 反向代理（参考 CLOUD_DEPLOYMENT_GUIDE.md）"
echo "  2. 配置 SSL 证书（可选但推荐）"
echo "  3. 配置域名解析"
echo ""
