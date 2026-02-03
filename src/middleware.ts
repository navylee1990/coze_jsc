/**
 * 中间件
 * 用于验证用户身份和重定向到企业微信登录
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 检查是否启用企业微信认证（默认禁用，开发模式下直接放行）
  const weworkEnabled = process.env.WEWORK_ENABLED === 'true';

  // 只对需要认证的页面进行检查
  if (request.nextUrl.pathname.startsWith('/gm')) {
    // 如果未启用企业微信认证，直接放行
    if (!weworkEnabled) {
      return NextResponse.next();
    }

    const session = request.cookies.get('session');

    if (!session) {
      // 重定向到企业微信授权页面
      const corpId = process.env.WEWORK_CORPID;
      const agentId = process.env.WEWORK_AGENT_ID;
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:5000';
      const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/wework`);

      const authUrl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${corpId}&agentid=${agentId}&redirect_uri=${redirectUri}&state=STATE`;

      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gm/:path*'],
};
