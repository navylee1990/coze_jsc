/**
 * 企业微信OAuth回调接口
 * GET /api/auth/wework?code=xxx
 */

import { NextRequest, NextResponse } from 'next/server';
import { weworkAuth, WeWorkUserInfo } from '@/lib/wework-auth';
import { userManager } from '@/storage/database';

// GET /api/auth/wework?code=xxx - 企业微信OAuth回调
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=missing_code', request.url)
      );
    }

    // 1. 获取企业微信用户信息
    const weworkUser = await weworkAuth.getUserInfo(code);

    // 2. 查询或创建本地用户
    const user = await userManager.getOrCreateByWeworkId(
      weworkUser.userId,
      {
        name: weworkUser.name,
        mobile: weworkUser.mobile || undefined,
        department: weworkUser.department?.join(','),
        position: weworkUser.position,
        avatar: weworkUser.avatar,
      }
    );

    // 3. 创建会话token
    const session = {
      userId: user.id,
      weworkUserId: user.weworkUserId,
      name: user.name,
    };

    // 4. 重定向到首页，携带token
    const response = NextResponse.redirect(new URL('/gm', request.url));
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('企业微信登录失败:', error);
    return NextResponse.redirect(
      new URL('/?error=login_failed', request.url)
    );
  }
}
