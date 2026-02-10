import { NextRequest, NextResponse } from 'next/server';
import { dealerManager } from '@/storage/database';

/**
 * GET /api/dealer/data
 * 获取经销商所有数据
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dealerId = searchParams.get('dealerId') || 'default';
    const period = searchParams.get('period') || 'current';

    const data = await dealerManager.getFullDealerData(dealerId, period);

    // 转换 numeric 类型为 number
    const convertedData = {
      ...data,
      coreMetrics: data.coreMetrics ? {
        ...data.coreMetrics,
        targetAmount: Number(data.coreMetrics.targetAmount),
        completedAmount: Number(data.coreMetrics.completedAmount),
        forecastAmount: Number(data.coreMetrics.forecastAmount),
        yearOverYearGrowth: Number(data.coreMetrics.yearOverYearGrowth),
        completionRate: Number(data.coreMetrics.completionRate),
      } : null,
      monthlySales: data.monthlySales.map(s => ({
        ...s,
        targetAmount: Number(s.targetAmount),
        completedAmount: Number(s.completedAmount),
        forecastAmount: Number(s.forecastAmount),
      })),
      trackData: data.trackData.map(t => ({
        ...t,
        percentage: Number(t.percentage),
        growthRate: Number(t.growthRate),
        totalAmount: Number(t.totalAmount),
        marginRate: Number(t.marginRate),
      })),
      subcategoryData: data.subcategoryData.map(s => ({
        ...s,
        targetAmount: Number(s.targetAmount),
        actualAmount: Number(s.actualAmount),
        completionRate: Number(s.completionRate),
        marginRate: Number(s.marginRate),
      })),
      projectFunnel: data.projectFunnel.map(p => ({
        ...p,
        conversionRate: Number(p.conversionRate),
      })),
      projectRisk: data.projectRisk.map(r => ({
        ...r,
        percentage: Number(r.percentage),
        totalAmount: Number(r.totalAmount),
        avgAmount: Number(r.avgAmount),
      })),
      criticalProjects: data.criticalProjects.map(c => ({
        ...c,
        amount: Number(c.amount),
      })),
    };

    return NextResponse.json({
      success: true,
      data: convertedData,
    });
  } catch (error) {
    console.error('GET /api/dealer/data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dealer data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
