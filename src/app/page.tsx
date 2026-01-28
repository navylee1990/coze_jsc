import Link from 'next/link';
import { BarChart3, Users, TrendingUp, Target, Activity, Zap, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">商用净水经营驾驶舱</h1>
          <p className="text-gray-600">选择您需要查看的经营看板</p>
        </div>

        {/* 驾驶舱卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 商用净水经营驾驶舱 */}
          <Link href="/sales" className="group">
            <Card className="border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-white h-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center h-full justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">商用净水经营驾驶舱</h2>
                  <p className="text-gray-600 mb-6">品牌方视角，全面掌握销售业绩、项目进度、业务员表现</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span>销售数据分析</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-green-500" />
                      <span>目标达成追踪</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 商用总经理驾驶舱 */}
          <Link href="/gm" className="group">
            <Card className="border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 bg-white h-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center h-full justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">商用总经理驾驶舱</h2>
                  <p className="text-gray-600 mb-6">预测驱动，数据赋能，查看预测模型、项目储备、人员贡献</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>预测模型</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span>因果链路</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>© 2026 商用净水经营驾驶舱系统</p>
        </div>
      </div>
    </div>
  );
}
