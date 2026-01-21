'use client';

import { Database, AlertTriangle, Activity, Target, ArrowRight, MessageSquare, Users, Sparkles, CheckCircle } from 'lucide-react';

// 单页PPT：数据→风险→行动，保障目标达成

export default function PPTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* 单页PPT容器 */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video p-12 relative">
          {/* 标题区域 */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              商用净水经营驾驶舱
            </h1>
            <p className="text-2xl text-gray-600 font-medium">数据 → 风险 → 行动，保障目标达成</p>
          </div>

          {/* 核心流程 */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-6">
              {/* 数据层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
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
                      <span>项目预测智能计算</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 箭头 */}
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

              {/* 风险层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <h3 className="text-xl font-bold text-orange-600">风险层</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>智能识别风险等级</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>三色预警提前发现</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span>任务缺口突出显示</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 箭头 */}
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

              {/* 行动层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl font-bold text-green-600">行动层</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>责任人提醒快速响应</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>可执行建议精准发力</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>闭环管理持续优化</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 特色功能 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 企业微信拉群 */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-emerald-700">企业微信拉群</h3>
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-700 mb-3">一键拉群，快速协调责任人</p>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full inline-block">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>智能识别责任人，自动建群沟通</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 专属话术 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-blue-700">专属话术</h3>
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-700 mb-3">根据达成率自动匹配提醒话术</p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full inline-block">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>智能生成提醒消息，精准触达</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部标语 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <Target className="w-4 h-4 text-green-600" />
              <span>从发现问题到解决问题，驱动目标达成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
