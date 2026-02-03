/**
 * 风险识别数据API
 * GET /api/risks?type=xxx
 */

import { NextRequest, NextResponse } from 'next/server';
import { projectManager } from '@/storage/database';
import { projects } from '@/storage/database/shared/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { getDb } from 'coze-coding-dev-sdk';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'prediction';

    const db = await getDb();
    let result;

    switch (type) {
      case 'prediction':
        // 预测不足：currentForecast < targetForecast * 0.8
        result = await db
          .select()
          .from(projects)
          .where(
            and(
              sql`${projects.currentForecast} < ${projects.targetForecast} * 0.8`,
              sql`${projects.status} = 'in_progress'`
            )
          )
          .orderBy(sql`${projects.gapAmount} DESC NULLS LAST`)
          .limit(100);
        break;

      case 'urge':
        // 催下单（未按计划下单）：delayDays > 0
        result = await db
          .select()
          .from(projects)
          .where(
            and(
              eq(projects.status, 'in_progress'),
              gte(projects.delayDays, 0)
            )
          )
          .orderBy(sql`${projects.delayDays} DESC NULLS LAST`)
          .limit(100);
        break;

      case 'report':
        // 报备不足
        result = await db
          .select()
          .from(projects)
          .where(eq(projects.status, 'insufficient_report'))
          .orderBy(sql`${projects.updatedAt} DESC`)
          .limit(100);
        break;

      case 'conversion':
        // 转化不足：conversionRate < 0.2
        result = await db
          .select()
          .from(projects)
          .where(lte(projects.conversionRate, 0.2))
          .orderBy(projects.conversionRate)
          .limit(100);
        break;

      case 'dependency':
        // 大项目依赖：amount >= 100万
        result = await db
          .select()
          .from(projects)
          .where(gte(projects.amount, 1000000))
          .orderBy(sql`${projects.amount} DESC`)
          .limit(100);
        break;

      case 'stagnation':
        // 阶段停滞：updated_at < 30天前
        result = await db
          .select()
          .from(projects)
          .where(
            and(
              eq(projects.status, 'in_progress'),
              sql`${projects.updatedAt} < NOW() - INTERVAL '30 days'`
            )
          )
          .orderBy(projects.updatedAt)
          .limit(100);
        break;

      default:
        result = [];
    }

    // 转换数据格式以匹配前端
    const formattedData = result.map((item: any) => {
      switch (type) {
        case 'prediction':
          return {
            projectName: item.name,
            region: item.region,
            owner: item.owner,
            gapAmount: Number(item.gapAmount || 0),
            currentForecast: Number(item.currentForecast || 0),
            targetForecast: Number(item.targetForecast || 0),
            gapPercentage: item.targetForecast
              ? (Number(item.gapAmount || 0) / Number(item.targetForecast)) * 100
              : 0,
            feedback: item.feedback || '',
          };

        case 'urge':
          return {
            id: item.id,
            projectCode: item.projectCode,
            name: item.name,
            amount: Number(item.amount || 0),
            probability: item.probability || 'medium',
            region: item.region,
            salesEngineer: item.owner,
            cityManager: item.owner,
            projectType: item.projectType,
            projectPhase: item.projectPhase,
            detail: item.detail,
            expectedOrderDate: item.expectedOrderDate || '',
            delayDays: item.delayDays || 0,
            riskReason: item.riskReason || '',
            feedback: item.feedback || '',
          };

        case 'dependency':
          return {
            projectName: item.name,
            projectId: item.id,
            amount: Number(item.amount || 0),
            predictionAmount: Number(item.predictionAmount || 0),
            predictionRatio: item.predictionAmount && item.predictionAmount > 0
              ? (Number(item.amount || 0) / Number(item.predictionAmount)) * 100
              : 0,
            region: item.region,
            owner: item.owner,
            status: item.riskLevel || 'normal',
          };

        case 'report':
        case 'conversion':
        case 'stagnation':
          return {
            owner: item.owner,
            region: item.region,
            ...(type === 'report' && {
              newReportedCount: 0,
              gapCount: 1,
            }),
            ...(type === 'conversion' && {
              uncontactedCount: 1,
            }),
            ...(type === 'stagnation' && {
              stagnationCount: 1,
            }),
            feedback: item.feedback || '',
          };

        default:
          return item;
      }
    });

    return NextResponse.json({
      success: true,
      data: formattedData,
      type,
    });
  } catch (error) {
    console.error('获取风险识别数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
  }
}
