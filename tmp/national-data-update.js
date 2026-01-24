// 临时文件，用于存储全国数据更新
const nationalDataUpdate = {
  '0-30天': {
    projects: [
      {
        id: 1,
        name: '北京协和医院净化项目',
        amount: 350,
        probability: 'high',
        health: 'high',
        isOnTrack: true
      },
      {
        id: 2,
        name: '上海外国语学校净水项目',
        amount: 170,
        probability: 'medium',
        health: 'medium',
        isOnTrack: false,
        delayDays: 12
      }
    ],
    excludedProjects: [
      {
        id: 101,
        name: '天津天河城净水项目',
        amount: 280,
        excludeReason: 'progress_low',
        excludeReasonText: '项目进度滞后，仅完成35%进度',
        currentProgress: 35,
        expectedProgress: 80,
        probability: 'high'
      },
      {
        id: 102,
        name: '广州白云机场航站楼项目',
        amount: 200,
        excludeReason: 'pending_approval',
        excludeReasonText: '商务合同待审批，预计下周完成',
        currentProgress: 60,
        expectedProgress: 70,
        probability: 'high'
      }
    ]
  }
};
