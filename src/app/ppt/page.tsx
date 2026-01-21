'use client';

import { Database, AlertTriangle, Activity, Target, ArrowRight, Users, Sparkles, CheckCircle, Bot, Shield, RefreshCw } from 'lucide-react';

// 单页PPT：数据→风险→行动，保障目标达成

export default function PPTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* 单页PPT容器 */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video p-12 relative">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              商用净水经营驾驶舱
            </h1>
            <p className="text-2xl text-gray-600 font-medium">数据 → 风险 → 行动，保障目标达成</p>
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
                      <span>项目预测智能计算</span>
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
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
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

          {/* 四大核心特色 */}
          <div className="grid grid-cols-4 gap-4">
            {/* 智能协同 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg mb-3">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-emerald-700">智能协同</h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-xs text-gray-600 mb-2">企业微信拉群 + 专属话术</div>
                <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  一键拉群，精准触达
                </div>
              </div>
            </div>

            {/* 三色预警 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mb-3">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-orange-700">三色预警</h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-xs text-gray-600 mb-2">红/黄/绿风险等级</div>
                <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  &lt;80% 高风险预警
                </div>
              </div>
            </div>

            {/* AI洞察 */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg mb-3">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-purple-700">AI洞察</h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-xs text-gray-600 mb-2">智能识别关键风险点</div>
                <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  自动生成行动建议
                </div>
              </div>
            </div>

            {/* 目标闭环 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-3">
                  <RefreshCw className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-blue-700">目标闭环</h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-xs text-gray-600 mb-2">发现问题→解决问题</div>
                <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  确保目标达成
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
