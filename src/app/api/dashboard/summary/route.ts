/**
 * 驾驶舱汇总数据API
 * GET /api/dashboard/summary
 */

import { NextResponse } from 'next/server';
import { projectManager } from '@/storage/database';

export async function GET() {
  try {
    // 获取驾驶舱汇总数据
    const summary = await projectManager.getDashboardSummary();

    return NextResponse.json({
      success: true,
      data: {
        totalProjects: summary.totalProjects,
        totalAmount: summary.totalAmount / 10000, // 转换为万元
        conversionRate: summary.conversionRate * 100, // 转换为百分比
        riskProjects: summary.riskProjects,
        stagnantProjects: summary.stagnantProjects,
        inProgressProjects: summary.inProgressProjects,
        completedProjects: summary.completedProjects,
      },
    });
  } catch (error) {
    console.error('获取驾驶舱汇总数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
  }
}
