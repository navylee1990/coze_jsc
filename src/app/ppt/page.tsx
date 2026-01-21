'use client';

import { Database, AlertTriangle, TrendingUp, Target, ArrowRight, Shield, MessageSquare, UserPlus, MapPin, Building2, Users, UserCircle } from 'lucide-react';

export default function PPTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video p-8 relative">
          {/* 标题区域 */}
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              商用净水经营驾驶舱
            </h1>
            <p className="text-lg text-gray-600">层层挖掘问题，精准发现问题快速响应</p>
          </div>

          {/* 下钻流程：目标→区域→经销商→项目→业务员 */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-2">
              {/* 目标 */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border-2 border-blue-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-700">目标</h3>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span>销售目标达成监控</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span>月度趋势分析预测</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <span>任务缺口实时预警</span>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              {/* 区域 */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border-2 border-purple-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-700">区域</h3>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                      <span>区域达成全景分析</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                      <span>下钻查看区域详情</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                      <span>区域风险快速识别</span>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              {/* 经销商 */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border-2 border-green-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-700">经销商</h3>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-green-500"></div>
                      <span>经销商名单管理</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-green-500"></div>
                      <span>达成情况实时追踪</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-green-500"></div>
                      <span>风险等级自动识别</span>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              {/* 项目 */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border-2 border-orange-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-700">项目</h3>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                      <span>在手项目智能统计</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                      <span>项目阶段分类管理</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                      <span>预测完成贡献分析</span>
                    </div>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

              {/* 业务员 */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-3 border-2 border-pink-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
                      <UserCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-pink-700">业务员</h3>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                      <span>责任人信息展示</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                      <span>达成率风险标识</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                      <span>快速沟通响应</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 分割线和行动层 */}
          <div className="border-t-2 border-gray-200 my-5"></div>

          {/* 行动层 */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-emerald-700">行动层 - 发现问题后快速响应</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* 企业微信拉群 */}
              <div className="bg-white rounded-lg p-3 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-emerald-700 text-sm">企业微信拉群</h4>
                </div>
                <p className="text-xs text-gray-600">智能识别责任人，一键拉群快速协同</p>
              </div>

              {/* 专属话术 */}
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-700 text-sm">专属话术</h4>
                </div>
                <p className="text-xs text-gray-600">根据达成率智能匹配，精准触达提醒</p>
              </div>

              {/* 三色预警 */}
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-orange-500 to-red-500 rounded">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-orange-700 text-sm">三色预警</h4>
                </div>
                <p className="text-xs text-gray-600">红/黄/绿风险等级，自动识别问题</p>
              </div>

              {/* 智能预测 */}
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-green-700 text-sm">智能预测</h4>
                </div>
                <p className="text-xs text-gray-600">已完成+在手项目，自动计算预测</p>
              </div>
            </div>
          </div>

          {/* 底部标语 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <Target className="w-3.5 h-3.5 text-green-600" />
              <span>目标 → 区域 → 经销商 → 项目 → 业务员 → 快速响应</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
