/**
 * 获取当前登录用户信息
 * GET /api/auth/user
 */

import { NextRequest, NextResponse } from 'next/server';
import { userManager } from '@/storage/database';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session');

    if (!session) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const sessionData = JSON.parse(session.value);
    const userId = sessionData.userId;

    // 获取用户信息
    const user = await userManager.getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        weworkUserId: user.weworkUserId,
        name: user.name,
        mobile: user.mobile,
        department: user.department,
        position: user.position,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
