import { NextRequest, NextResponse } from 'next/server';
import { dealerManager } from '@/storage/database';

/**
 * GET /api/dealer/core-metrics
 * 获取经销商核心指标
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dealerId = searchParams.get('dealerId') || 'default';
    const period = searchParams.get('period') || 'current';

    const metrics = await dealerManager.getCoreMetrics(dealerId, period);

    if (!metrics) {
      return NextResponse.json({
        success: false,
        error: 'Core metrics not found',
      }, { status: 404 });
    }

    // 转换 numeric 类型为 number
    const convertedMetrics = {
      ...metrics,
      targetAmount: Number(metrics.targetAmount),
      completedAmount: Number(metrics.completedAmount),
      forecastAmount: Number(metrics.forecastAmount),
      yearOverYearGrowth: Number(metrics.yearOverYearGrowth),
      completionRate: Number(metrics.completionRate),
    };

    return NextResponse.json({
      success: true,
      data: convertedMetrics,
    });
  } catch (error) {
    console.error('GET /api/dealer/core-metrics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch core metrics',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
