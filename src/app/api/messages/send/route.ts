/**
 * 消息发送API
 * POST /api/messages/send
 * 注意：已移除企业微信集成，仅保存消息到数据库
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from 'coze-coding-dev-sdk';
import { riskIdentifications } from '@/storage/database/shared/schema';
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

    // 2. 保存到数据库（不再发送企业微信消息）
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
        sentTo: recipientId || 'system', // 记录接收者ID
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: risk,
      message: '消息已保存',
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    return NextResponse.json(
      { success: false, error: '发送消息失败' },
      { status: 500 }
    );
  }
}
