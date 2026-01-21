'use client';

import { Target, Users, FileText, UserCircle, Shield, AlertTriangle, TrendingUp, MessageSquare, UserPlus, Bell, BarChart3 } from 'lucide-react';

export default function PPTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video p-8 relative">
          {/* 标题区域 */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              商用净水经营驾驶舱
            </h1>
            <p className="text-lg text-gray-600">四大维度全方位管理，精准发现问题快速响应</p>
          </div>

          <div className="flex gap-4 h-[calc(100%-80px)]">
            {/* 左侧：4个tab页主题 */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* 目标Tab */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-700">目标</h3>
                </div>
                <div className="flex-1 space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                    <span>销售目标达成监控</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                    <span>区域达成全景分析</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                    <span>月度趋势智能预测</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                    <span>任务缺口实时预警</span>
                  </div>
                </div>
              </div>

              {/* 经销商Tab */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-700">经销商</h3>
                </div>
                <div className="flex-1 space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                    <span>经销商名单管理</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                    <span>达成情况实时追踪</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                    <span>风险等级自动识别</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                    <span>下钻查看详情</span>
                  </div>
                </div>
              </div>

              {/* 项目Tab */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-700">项目</h3>
                </div>
                <div className="flex-1 space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <span>在手项目智能统计</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <span>项目阶段分类管理</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <span>金额与数量双维度</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <span>预测完成贡献分析</span>
                  </div>
                </div>
              </div>

              {/* 业务员Tab */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-700">业务员</h3>
                </div>
                <div className="flex-1 space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span>责任人信息展示</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span>达成率风险标识</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span>快速沟通响应</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span>绩效跟踪管理</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：协同层（拉群协同+专属话术） */}
            <div className="w-80 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-700">协同层</h3>
              </div>
              
              <div className="flex-1 space-y-3">
                {/* 企业微信拉群 */}
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded">
                      <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-emerald-700 text-sm">企业微信拉群</h4>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      <span>智能识别相关责任人</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      <span>一键拉群快速协同</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      <span>达成率自动匹配模板</span>
                    </div>
                  </div>
                </div>

                {/* 专属话术 */}
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-blue-700 text-sm">专属话术</h4>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span>根据达成率智能匹配</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span>差异化提醒策略</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span>精准触达提升效率</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 协同层亮点 */}
              <div className="mt-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-700 text-xs">核心价值</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  发现问题后，立即拉群协同，使用专属话术精准提醒，快速响应解决问题
                </p>
              </div>
            </div>
          </div>

          {/* 底部标语 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              <span>目标达成 · 经销商管理 · 项目追踪 · 业务员绩效 · 拉群协同 · 专属话术</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
