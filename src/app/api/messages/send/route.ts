/**
 * 消息发送API
 * POST /api/messages/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { weworkAuth } from '@/lib/wework-auth';
import { getDb } from 'coze-coding-dev-sdk';
import { riskIdentifications, users } from '@/storage/database/shared/schema';
import { eq } from 'drizzle-orm';

interface SendMessageRequest {
  projectId: string;
  type: string;
  message: string;
  recipientId?: string; // 可选：指定接收者
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    const { projectId, type, message, recipientId } = body;

    if (!projectId || !type || !message) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1. 查询项目信息
    const projectResult = await db
      .select()
      .from(riskIdentifications)
      .where(eq(riskIdentifications.projectId, projectId));

    if (!projectResult || projectResult.length === 0) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      );
    }

    // 2. 确定接收者
    let recipientWeworkId = recipientId;
    if (!recipientId) {
      // 如果没有指定接收者，默认发送给当前登录用户
      // 这里简化处理，实际应该从session中获取
      return NextResponse.json(
        { success: false, error: '请指定接收者' },
        { status: 400 }
      );
    }

    // 3. 查询用户的企业微信ID
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, recipientId));

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    const weworkUserId = userResult[0].weworkUserId;

    // 4. 保存到数据库
    const [risk] = await db
      .insert(riskIdentifications)
      .values({
        id: crypto.randomUUID(),
        projectId,
        type,
        description: message,
        messageTemplate: message,
        status: 'sent',
        sentAt: new Date(),
        sentTo: weworkUserId,
      })
      .returning();

    // 5. 调用企业微信API发送消息
    try {
      await weworkAuth.sendTextMessage([weworkUserId], message);
    } catch (error) {
      console.error('企业微信消息发送失败:', error);
      // 即使企业微信发送失败，也返回成功（已保存到数据库）
      return NextResponse.json({
        success: true,
        data: risk,
        warning: '消息已保存，但企业微信发送失败',
      });
    }

    return NextResponse.json({
      success: true,
      data: risk,
      message: '消息已发送',
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    return NextResponse.json(
      { success: false, error: '发送消息失败' },
      { status: 500 }
    );
  }
}
