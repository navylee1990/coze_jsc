// 商用总经理驾驶舱系统 - 主页
import Link from 'next/link';
import { Activity, Zap, Layers, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">商用总经理驾驶舱系统</h1>
          <p className="text-gray-600">预测驱动，数据赋能，全面掌握业务运营</p>
        </div>

        {/* 驾驶舱卡片 */}
        <Link href="/gm" className="block group">
          <Card className="border-2 border-gray-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 bg-white">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* 图标 */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* 文字内容 */}
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">商用总经理驾驶舱</h2>
                  <p className="text-gray-600 mb-4">
                    基于预测模型的经营看板，实时追踪销售目标达成、项目储备、人员贡献等关键指标
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>预测模型驱动</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span>多维度数据洞察</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span>实时风险识别</span>
                    </div>
                  </div>
                </div>

                {/* 箭头 */}
                <div className="flex-shrink-0">
                  <Button variant="default" className="group-hover:bg-green-600 transition-colors">
                    进入驾驶舱
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 底部说明 */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>© 2026 商用总经理驾驶舱系统</p>
        </div>
      </div>
    </div>
  );
}
