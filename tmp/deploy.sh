#!/bin/bash

# 商用净水经营驾驶舱 - 快速部署脚本

set -e

echo "========================================"
echo "商用净水经营驾驶舱 - 快速部署"
echo "========================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必要的命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}错误: $1 未安装${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}1. 检查环境...${NC}"
check_command "node"
check_command "pnpm"
check_command "git"
echo -e "${GREEN}✓ 环境检查通过${NC}"

echo -e "${YELLOW}2. 拉取最新代码...${NC}"
git pull origin main
echo -e "${GREEN}✓ 代码更新完成${NC}"

echo -e "${YELLOW}3. 安装依赖...${NC}"
pnpm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"

echo -e "${YELLOW}4. 运行类型检查...${NC}"
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 类型检查通过${NC}"
else
    echo -e "${RED}✗ 类型检查失败${NC}"
    exit 1
fi

echo -e "${YELLOW}5. 构建生产版本...${NC}"
pnpm build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi

echo -e "${YELLOW}6. 重启应用...${NC}"

# 检查PM2是否安装
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 未安装，正在安装...${NC}"
    npm install -g pm2
fi

# 停止旧进程
if pm2 list | grep -q "dashboard"; then
    pm2 stop dashboard
    pm2 delete dashboard
fi

# 启动新进程
pm2 start npm --name "dashboard" -- start
pm2 save
pm2 startup

echo -e "${GREEN}✓ 应用启动成功${NC}"

echo -e "${YELLOW}7. 显示应用状态...${NC}"
pm2 status

echo ""
echo "========================================"
echo -e "${GREEN}部署完成！${NC}"
echo "========================================"
echo "应用访问地址: http://localhost:5000"
echo ""
echo "常用命令："
echo "  查看日志: pm2 logs dashboard"
echo "  查看状态: pm2 status"
echo "  重启应用: pm2 restart dashboard"
echo "  停止应用: pm2 stop dashboard"
echo "========================================"
