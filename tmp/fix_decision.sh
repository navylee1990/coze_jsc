#!/bin/bash

# 读取源文件
SOURCE="src/app/gm/page.tsx"

# 提取三部分
# 第1部分: 1-587行
head -587 "$SOURCE" > /tmp/decision_part1.txt

# 第3部分: 719行到结尾
tail -n +719 "$SOURCE" > /tmp/decision_part2.txt

# 创建新内容
cat > /tmp/decision_new.txt << 'ENDOFFILE'
            {/* 核心预测决策卡片 - 自适应高度 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  核心预测决策
                </h2>
              </div>

              {/* 核心数据展示 - 商务风格 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                {/* 达成率卡片 */}
                <div className="relative">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <div className="flex flex-col items-center">
                      {/* 标题 */}
                      <div className="text-sm font-semibold text-gray-600 mb-3">目标达成率</div>

                      {/* 简化的圆形进度条 */}
                      <div className="relative" style={{ width: '120px', height: '120px' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* 背景圆 */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          {/* 达成率进度弧线 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={animatedRate >= 90 ? '#10b981' : animatedRate >= 70 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="251"
                            strokeDashoffset={251 - (251 * Math.min(parseFloat(getAchievementRate()), 100) / 100)}
                            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                          />
                        </svg>
                        {/* 中心数值 - 达成率 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn(
                            'text-3xl font-bold',
                            animatedRate >= 90 ? 'text-green-600' : animatedRate >= 70 ? 'text-amber-600' : 'text-red-600'
                          )}>
                            {animatedRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* 下方辅助信息 */}
                      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-gray-500">目标</span>
                          <span className="font-semibold text-gray-700">{animatedTarget.toLocaleString()}万</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-500">预测</span>
                          <span className={cn(
                            'font-semibold',
                            animatedForecast >= getTimeRangeData().target ? 'text-green-600' : 'text-gray-700'
                          )}>{animatedForecast.toLocaleString()}万</span>
                          {animatedRate < 100 && (
                            <AlertTriangle className={`w-3 h-3 ${animatedRate >= 80 ? 'text-amber-500' : 'text-red-500'}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 预测完成卡片 */}
                <div className="relative">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <div className="flex flex-col items-center">
                      {/* 标题 */}
                      <div className="text-sm font-semibold text-gray-600 mb-3">预测完成</div>

                      {/* 简化的圆形进度条 */}
                      <div className="relative" style={{ width: '120px', height: '120px' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* 背景圆 */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          {/* 预测进度弧线 */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="251"
                            strokeDashoffset={251 - (251 * Math.min(animatedForecast / animatedTarget, 100) / 100)}
                            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                          />
                        </svg>
                        {/* 中心数值 - 预测完成 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-blue-600">
                            {animatedRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* 下方辅助信息 */}
                      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-gray-500">目标</span>
                          <span className="font-semibold text-gray-700">{animatedTarget.toLocaleString()}万</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-gray-500">预测</span>
                          <span className="font-semibold text-blue-600">{animatedForecast.toLocaleString()}万</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
ENDOFFILE

# 合并三个部分
cat /tmp/decision_part1.txt /tmp/decision_new.txt /tmp/decision_part2.txt > "$SOURCE"

echo "文件修改完成"
