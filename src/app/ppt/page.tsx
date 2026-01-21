'use client';

import { Database, AlertTriangle, TrendingUp, Target, ArrowRight, Shield, MessageSquare, UserPlus } from 'lucide-react';

export default function PPTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video p-12 relative">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              商用经营驾驶舱
            </h1>
            <p className="text-2xl text-gray-600 font-medium">数据 → 风险 → 行动，精准掌控业务动态</p>
          </div>

          {/* 核心流程 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-5">
              {/* 数据层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-600">数据层</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>销售数据实时采集</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>区域达成全景展示</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>在手项目智能统计</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>月度趋势分析预测</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 箭头 */}
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

              {/* 风险层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <h3 className="text-xl font-bold text-orange-600">风险层</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>三色预警自动识别</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>任务缺口突出显示</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>预测达成实时监控</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>责任人风险标识</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 箭头 */}
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

              {/* 行动层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl font-bold text-green-600">行动层</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>企业微信拉群协同</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>专属话术精准触达</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>推动业务SOP落地</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 五大核心特色 */}
          <div className="grid grid-cols-5 gap-3">
            {/* 三色预警 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mb-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-sm font-bold text-orange-700">三色预警</h3>
                </div>
                <div className="text-[11px] text-gray-600 mb-1">红/黄/绿风险等级</div>
                <div className="text-[11px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                  &lt;80% 高风险
                </div>
              </div>
            </div>

            {/* 任务缺口 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg mb-2">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-sm font-bold text-red-700">任务缺口</h3>
                </div>
                <div className="text-[11px] text-gray-600 mb-1">突出显示未完成</div>
                <div className="text-[11px] text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  边框+背景色
                </div>
              </div>
            </div>

            {/* 智能预测 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-sm font-bold text-green-700">智能预测</h3>
                </div>
                <div className="text-[11px] text-gray-600 mb-1">已完成+在手项目</div>
                <div className="text-[11px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  自动计算预测
                </div>
              </div>
            </div>

            {/* 企业微信拉群 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg mb-2">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-sm font-bold text-emerald-700">拉群协同</h3>
                </div>
                <div className="text-[11px] text-gray-600 mb-1">企业微信一键拉群</div>
                <div className="text-[11px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  智能识别责任人
                </div>
              </div>
            </div>

            {/* 专属话术 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg mb-2">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-sm font-bold text-blue-700">专属话术</h3>
                </div>
                <div className="text-[11px] text-gray-600 mb-1">达成率自动匹配</div>
                <div className="text-[11px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  精准触达提醒
                </div>
              </div>
            </div>
          </div>

          {/* 底部标语 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <Target className="w-4 h-4 text-green-600" />
              <span>目标 · 经销商 · 项目 · 业务员 · 拉群协同 · 专属话术</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
