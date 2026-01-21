'use client';

import { Database, AlertTriangle, Activity, Target, ArrowRight, TrendingUp, Shield, BarChart3 } from 'lucide-react';

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
            <p className="text-2xl text-gray-600 font-medium">数据 → 风险 → 预测，精准掌控业务动态</p>
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
                  </div>
                </div>
              </div>

              {/* 箭头 */}
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

              {/* 预测层 */}
              <div className="flex-1 max-w-xs">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl font-bold text-green-600">预测层</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>预测完成智能计算</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>月度趋势四维分析</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>目标达成实时追踪</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 四大核心特色 */}
          <div className="grid grid-cols-4 gap-4">
            {/* 三色预警 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mb-3">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-orange-700">三色预警</h3>
                </div>
                <div className="text-xs text-gray-600 mb-2">红/黄/绿风险等级</div>
                <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  &lt;80% 高风险预警
                </div>
              </div>
            </div>

            {/* 任务缺口 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border-2 border-red-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg mb-3">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-red-700">任务缺口</h3>
                </div>
                <div className="text-xs text-gray-600 mb-2">突出显示未完成部分</div>
                <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  左侧边框+背景色
                </div>
              </div>
            </div>

            {/* 智能预测 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mb-3">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-green-700">智能预测</h3>
                </div>
                <div className="text-xs text-gray-600 mb-2">已完成+在手项目</div>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  自动计算预测完成
                </div>
              </div>
            </div>

            {/* 月度趋势 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg mb-3">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <h3 className="text-base font-bold text-blue-700">月度趋势</h3>
                </div>
                <div className="text-xs text-gray-600 mb-2">四条曲线完整呈现</div>
                <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  目标/plan/已完/预测
                </div>
              </div>
            </div>
          </div>

          {/* 底部标语 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <Target className="w-4 h-4 text-green-600" />
              <span>实时数据采集 · 智能风险预警 · 精准预测分析</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
