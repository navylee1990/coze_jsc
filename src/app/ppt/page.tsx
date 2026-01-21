'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle, AlertTriangle, Target, Activity, Database, TrendingUp, ArrowRight, ArrowDown } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: '商用净水经营驾驶舱',
    subtitle: '从数据到风险到行动，驱动目标达成',
    image: 'https://coze-coding-project.tos.coze.site/coze_storage_7595291180900909090/image/generate_image_c6a89932-4409-40f4-afca-24da962cf4de.jpeg?sign=1771587854-0a7ba67ae5-0-4b8d103cae83a97f6ee92200bcd727eacb2b408c83d7695388333a1a4d65339f',
    content: [],
    color: 'from-blue-600 to-green-600'
  },
  {
    id: 2,
    title: '核心逻辑',
    subtitle: '四层架构，闭环驱动',
    image: 'https://coze-coding-project.tos.coze.site/coze_storage_7595291180900909090/image/generate_image_cc7131ff-2a42-4e9c-a7c0-79c21cddd546.jpeg?sign=1771587844-4553de635b-0-76705f8bdec7626893599fa3da8af5933de42bf2dc86cde223b2e18e4e1b3f31',
    items: [
      { icon: Database, label: '数据层', desc: '全方位数据采集与展示', color: 'text-blue-600' },
      { icon: AlertTriangle, label: '风险层', desc: '智能风险识别与预警', color: 'text-orange-600' },
      { icon: Activity, label: '行动层', desc: '可执行的行动建议', color: 'text-green-600' },
      { icon: Target, label: '目标层', desc: '目标达成与闭环管理', color: 'text-purple-600' }
    ],
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 3,
    title: '数据层',
    subtitle: '全方位数据采集，全景展示',
    image: 'https://coze-coding-project.tos.coze.site/coze_storage_7595291180900909090/image/generate_image_1b56e03b-7702-4fec-9638-a2c62705cbb6.jpeg?sign=1771587851-99860ba695-0-a8a9360fa902ffcd2bd1387731be98f13a875e9a849892538e67006601d6b0eb',
    content: [
      '• 销售数据：买断、租赁、续租实时业绩',
      '• 区域数据：各区域、各经销商达成情况',
      '• 项目数据：在手项目、预测完成、任务缺口',
      '• 业务员数据：个人业绩、预测达成率',
      '• 趋势数据：月度/季度/年度趋势分析'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 4,
    title: '风险层',
    subtitle: '智能识别，精准预警',
    image: 'https://coze-coding-project.tos.coze.site/coze_storage_7595291180900909090/image/generate_image_703ecd97-a7bc-4bb5-8967-62123823ef3a.jpeg?sign=1771587852-61d2b61197-0-a933e4f8171db6e49804ba94606982e365f5c760fe64f9b88cf8011e720d2ce4',
    content: [
      '• 三色预警：红色（高风险）、橙色（中风险）、绿色（低风险）',
      '• 风险等级自动计算：< 80%高风险、80%-100%中风险、≥100%低风险',
      '• 任务缺口突出显示：左侧粗边框+背景色区分',
      '• 预测达成率实时监控：提前发现目标偏差',
      '• AI智能洞察：自动识别关键风险点'
    ],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: '行动层',
    subtitle: '可执行建议，精准发力',
    image: 'https://coze-coding-project.tos.coze.site/coze_storage_7595291180900909090/image/generate_image_4987ccc6-f773-4289-b135-07a331d4f04d.jpeg?sign=1771587853-e738ece661-0-0b5041d1031d518cb6902a8404b38a0bedeb3b38ba80cbe0d3d7fea2f9ee5b33',
    content: [
      '• 责任人提醒：一键拉群，快速协调',
      '• 消息模板：根据达成率自动匹配提醒话术',
      '• 在手项目跟进：关注重点项目，推动转化',
      '• 区域下钻分析：深入分析落后区域，制定策略',
      '• 可执行建议：AI洞察提供具体行动方向'
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 6,
    title: '目标层',
    subtitle: '闭环管理，持续优化',
    image: 'https://coze-coding-project.tos.coze.site/coze_storage_7595291180900909090/image/generate_image_228ef4c8-9077-45b2-8614-93869584fe2c.jpeg?sign=1771587851-aa94b70969-0-ca052650155c91d2db15eecec3f4e0e65972acde60616cfe40b49f609f121cc3',
    content: [
      '• 目标达成追踪：实时对比目标、已完成、预测完成',
      '• 业务目标vs财务目标：双维度管控',
      '• 合计信息统一展示：目标、已完成、预测、缺口、在手',
      '• 月度趋势分析：四条曲线完整呈现业务发展',
      '• 持续优化：基于数据反馈，不断调整策略'
    ],
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 7,
    title: '价值总结',
    subtitle: '从发现到解决，驱动业务增长',
    image: null,
    items: [
      { icon: CheckCircle, label: '实时监控', desc: '数据实时更新，掌握经营动态', color: 'text-blue-600' },
      { icon: AlertTriangle, label: '风险预警', desc: '提前发现风险，避免目标偏差', color: 'text-orange-600' },
      { icon: Activity, label: '精准行动', desc: '可执行建议，快速解决问题', color: 'text-green-600' },
      { icon: Target, label: '目标达成', desc: '闭环管理，确保目标实现', color: 'text-purple-600' }
    ],
    color: 'from-blue-600 to-green-600'
  }
];

export default function PPTPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  // 自动播放
  if (autoPlay) {
    setTimeout(() => {
      nextSlide();
    }, 5000);
  }

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* 幻灯片容器 */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden aspect-video relative">
          {/* 幻灯片内容 */}
          <div className="absolute inset-0 flex">
            {/* 左侧：图片区域 */}
            {slide.image && (
              <div className="w-1/2 relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-20`}></div>
              </div>
            )}

            {/* 右侧：内容区域 */}
            <div className={`flex-1 p-12 flex flex-col justify-center ${slide.image ? 'w-1/2' : 'w-full'}`}>
              {/* 标题 */}
              <div className={`mb-8`}>
                <h1 className="text-5xl font-bold bg-gradient-to-r ${slide.color} bg-clip-text text-transparent mb-4">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-2xl text-gray-600 font-medium">{slide.subtitle}</p>
                )}
              </div>

              {/* 内容列表 */}
              {slide.content && (
                <div className="space-y-4 mb-8">
                  {slide.content.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 text-lg text-gray-700">
                      <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${slide.color}`}></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 项目网格 */}
              {slide.items && (
                <div className="grid grid-cols-2 gap-6">
                  {slide.items.map((item, index) => (
                    <div key={index} className={`p-6 bg-gradient-to-br ${slide.color} bg-opacity-10 rounded-xl border-2 border-opacity-20 border-current`}>
                      <item.icon className={`w-10 h-10 ${item.color} mb-3`} />
                      <h3 className={`text-xl font-bold ${item.color} mb-2`}>{item.label}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 幻灯片编号 */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prevSlide}
            className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors group"
            title="上一页"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
          </button>

          <button
            onClick={toggleAutoPlay}
            className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors group"
            title={autoPlay ? '暂停' : '自动播放'}
          >
            <Play className={`w-6 h-6 text-gray-700 group-hover:text-blue-600 ${autoPlay ? 'text-red-600' : ''}`} />
          </button>

          <button
            onClick={nextSlide}
            className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors group"
            title="下一页"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
          </button>
        </div>

        {/* 页面指示器 */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? 'w-8 bg-gradient-to-r from-blue-600 to-green-600'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* 页面标题 */}
        <div className="text-center mt-8">
          <h2 className="text-3xl font-bold text-white mb-2">商用净水经营驾驶舱</h2>
          <p className="text-gray-400">从数据到风险到行动，驱动目标达成</p>
        </div>
      </div>
    </div>
  );
}
