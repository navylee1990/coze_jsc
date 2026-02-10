#!/bin/bash

# Nginx 自动配置脚本
# 使用方法: bash setup-nginx.sh your-domain.com

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "错误: 请提供域名"
    echo "使用方法: bash setup-nginx.sh your-domain.com"
    exit 1
fi

echo "=================================="
echo "  Nginx 配置脚本"
echo "  域名: $DOMAIN"
echo "=================================="
echo ""

# 检查 Nginx 是否安装
if ! command -v nginx &> /dev/null; then
    echo "Nginx 未安装，正在安装..."
    sudo apt update
    sudo apt install nginx -y
fi

# 创建 Nginx 配置文件
CONFIG_FILE="/etc/nginx/sites-available/$DOMAIN"
echo "创建配置文件: $CONFIG_FILE"

sudo tee "$CONFIG_FILE" > /dev/null <<EOF
# HTTP 配置（重定向到 HTTPS）
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/${DOMAIN}-access.log;
    error_log /var/log/nginx/${DOMAIN}-error.log;

    # 客户端上传大小限制
    client_max_body_size 20M;

    # Next.js 代理配置
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        # 代理头设置
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # 真实IP
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 创建软链接
echo "启用配置..."
sudo ln -sf "$CONFIG_FILE" "/etc/nginx/sites-enabled/"

# 测试配置
echo "测试 Nginx 配置..."
if sudo nginx -t; then
    echo "Nginx 配置测试通过"
    sudo systemctl reload nginx
    echo "Nginx 已重新加载"
else
    echo "Nginx 配置测试失败"
    exit 1
fi

# 安装 Certbot
if ! command -v certbot &> /dev/null; then
    echo "Certbot 未安装，正在安装..."
    sudo apt update
    sudo apt install certbot python3-certbot-nginx -y
fi

# 获取 SSL 证书
echo ""
echo "=================================="
echo "  SSL 证书配置"
echo "=================================="
echo ""
echo "即将为 $DOMAIN 申请 SSL 证书..."
echo "请按照提示操作。"
echo ""

read -p "是否现在申请 SSL 证书？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN"

    # 配置自动续期
    echo "配置证书自动续期..."
    (crontab -l 2>/dev/null; echo "0 2 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
    echo "证书自动续期已配置（每天凌晨2点）"
fi

echo ""
echo "=================================="
echo "  Nginx 配置完成"
echo "=================================="
echo ""
echo "配置文件: $CONFIG_FILE"
echo "访问地址: https://$DOMAIN"
echo ""
echo "常用命令："
echo "  重新加载: sudo nginx -s reload"
echo "  查看日志: sudo tail -f /var/log/nginx/${DOMAIN}-error.log"
echo "  续期证书: sudo certbot renew"
echo ""
