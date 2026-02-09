---
name: Angular Web 项目改造为微信小程序
overview: 将基于 Angular 21.1.0 + Tailwind CSS 的 Web 应用（儿童习惯养成与情绪管理"磁贴大挑战"）改造为微信小程序，使用 UniApp Vue 3 框架，实现任务打卡、奖励兑换、心情转换、数据统计等核心功能。
design:
  architecture:
    component: tdesign
  styleKeywords:
    - Glassmorphism
    - 童趣风格
    - 渐变色
    - 卡片式布局
    - 微动画
    - 圆角设计
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#EC4899"
      - "#F43F5E"
      - "#8B5CF6"
      - "#6366F1"
    background:
      - "#FFFFFF"
      - "#F0F4FF"
      - "#FFF5F7"
      - "#FAFAFA"
    text:
      - "#1F2937"
      - "#6B7280"
      - "#9CA3AF"
      - "#F3F4F6"
    functional:
      - "#10B981"
      - "#EF4444"
      - "#F59E0B"
      - "#3B82F6"
todos:
  - id: setup-taro-project
    content: 初始化 Taro 项目，配置 TDesign 组件库和 ECharts 插件
    status: completed
  - id: migrate-data-services
    content: 迁移数据服务层，改造 store.service.ts 和 sound.service.ts 适配小程序
    status: completed
    dependencies:
      - setup-taro-project
  - id: implement-home-page
    content: 实现首页页面，包含仪表盘、任务列表和快捷操作组件
    status: completed
    dependencies:
      - migrate-data-services
  - id: implement-rewards-page
    content: 实现梦想屋页面，包含奖励列表、兑换逻辑和数学验证组件
    status: completed
    dependencies:
      - migrate-data-services
  - id: implement-stats-page
    content: 实现统计页面，集成 ECharts 折线图和饼图组件
    status: completed
    dependencies:
      - migrate-data-services
  - id: implement-moments-page
    content: 实现美好时光页面，包含时间线展示和导出功能
    status: completed
    dependencies:
      - migrate-data-services
  - id: implement-profile-page
    content: 实现个人中心页面，包含管理界面和导入导出功能
    status: completed
    dependencies:
      - migrate-data-services
  - id: configure-tabbar
    content: 配置底部 TabBar 导航，完善页面路由
    status: completed
    dependencies:
      - implement-home-page
      - implement-rewards-page
      - implement-stats-page
      - implement-moments-page
      - implement-profile-page
  - id: add-animations-feedback
    content: 集成 Lottie 动画、音效和振动反馈
    status: completed
    dependencies:
      - implement-home-page
      - implement-rewards-page
---

## 产品概述

磁贴大挑战是一款面向家庭的儿童习惯养成与情绪管理应用，通过游戏化的"磁贴"代币机制帮助孩子建立良好生活习惯、培养情绪控制能力。

## 核心功能

- 首页仪表盘：展示磁贴总数、每日任务进度、快捷操作入口（磁贴时刻、心情转换）
- 每日约定场景：5个基础生活习惯任务，每日自动重置，完成获得磁贴，全垒打额外奖励
- 奖励兑换系统：分级奖励兑换，大梦想进度条展示，家长验证机制
- 情绪管理工具：心情转换器，引导孩子识别和转换负面情绪
- 美好时刻记录：记录生活中的闪光点，时间线展示，支持导出
- 数据统计分析：近7天磁贴收支趋势、收入来源分析
- 个人中心管理：用户信息展示、任务/奖励自定义管理（家长验证）、数据导入导出
- 底部导航：首页、梦想屋、统计、美好、我的 5个 Tab 页面

## 改造目标

将现有的 Angular Web 应用改造为微信小程序，保持所有核心功能和视觉体验。

## 技术栈选择

### 框架与组件库

- **开发框架**: Taro 3.x（基于 React）
- **UI 组件库**: TDesign 小程序组件库
- **状态管理**: React Hooks（useState, useEffect, useMemo, useContext）
- **语言**: TypeScript

### 依赖库替换方案

- **样式系统**: Tailwind CSS → TDesign 组件 + WXSS
- **动画效果**: lottie-web → 微信小程序 Lottie 组件（lottie-miniprogram）
- **图表库**: D3.js → ECharts for Taro（@tarojs/plugin-echarts）
- **数据存储**: localStorage → wx.setStorageSync/wx.getStorageSync
- **音效系统**: Web Audio API → wx.createInnerAudioContext
- **振动反馈**: navigator.vibrate → wx.vibrateShort
- **日期处理**: Angular DatePipe → dayjs

## 实施方案

### 技术选型理由

1. **Taro 框架**：支持 React 语法，最大程度复用现有的组件逻辑和设计思路，降低学习成本
2. **TDesign 组件库**：企业级设计系统，提供完善的小程序组件，快速构建现代化 UI
3. **React Hooks**：替代 Angular Signals，提供响应式状态管理
4. **ECharts for Taro**：强大的图表库，完美适配小程序环境

### 架构设计

采用**分层架构**：

- **页面层**：5个主页面（首页、梦想屋、统计、美好、我的）对应底部 Tab
- **组件层**：可复用组件（任务卡片、奖励卡片、模态框、动画组件）
- **服务层**：数据持久化、业务逻辑、状态管理
- **工具层**：日期处理、音效播放、振动反馈等

### 数据流设计

```
用户交互 → 组件事件 → 状态更新 → 视图渲染
           ↓
    存储同步 → 持久化数据
```

### 关键技术决策

1. **路由管理**：使用 Taro 内置路由，配置 app.config.ts 的 tabBar
2. **全局状态**：使用 Taro.setStorageSync + React Context 实现跨页面状态共享
3. **动画实现**：使用 Taro.createAnimation API 替代 CSS 动画，Lottie 用于复杂动画
4. **音效管理**：封装音效服务类，使用小程序 InnerAudioContext
5. **家长验证**：使用小程序 modal + 自定义数字键盘组件

## 实施要点

### 性能优化

- 使用 Taro 的分包加载，将页面按模块分包
- 图片和 Lottie 资源使用 CDN 或小程序云存储
- 列表渲染使用虚拟列表处理大数据量
- 避免频繁 setData，使用防抖/节流

### 兼容性处理

- 适配不同微信版本和机型
- 使用 Taro.getSystemInfoSync 获取设备信息进行响应式布局
- 安全区域适配（padding-bottom: env(safe-area-inset-bottom)）

### 存储策略

- 使用 wx.setStorageSync 同步存储关键数据
- 存储键命名规范：magnet_v3_{key}
- 数据结构保持与原项目一致，便于迁移

### 音效与振动

- 封装 SoundService 类，管理音频实例
- 支持静音模式和音量控制
- 振动反馈使用 wx.vibrateShort(50)

### 图表实现

- 使用 @tarojs/plugin-echarts 插件
- 折线图：展示近7天收支趋势
- 饼图：展示收入来源分析
- 配置 ECharts 主题适配小程序

## 目录结构

```
magnet-challenge-miniprogram/
├── config/
│   ├── index.js                    # Taro 配置文件
│   └── dev.js                      # 开发环境配置
├── src/
│   ├── app.config.ts               # 小程序配置（tabBar、页面路由）
│   ├── app.tsx                     # 应用入口
│   ├── app.scss                    # 全局样式
│   ├── pages/
│   │   ├── home/                   # 首页 [NEW]
│   │   │   ├── index.tsx           # 首页主组件（包含仪表盘、快捷操作）
│   │   │   ├── components/
│   │   │   │   ├── task-card.tsx   # 任务卡片组件
│   │   │   │   ├── magnet-card.tsx # 磁贴卡片
│   │   │   │   └── mood-modal.tsx  # 心情转换器模态框
│   │   │   └── index.scss          # 首页样式
│   │   ├── rewards/                # 梦想屋页面 [NEW]
│   │   │   ├── index.tsx           # 奖励列表和兑换逻辑
│   │   │   ├── components/
│   │   │   │   ├── reward-card.tsx # 奖励卡片
│   │   │   │   └── math-gate.tsx   # 家长验证组件
│   │   │   └── index.scss
│   │   ├── stats/                  # 统计页面 [NEW]
│   │   │   ├── index.tsx           # 数据统计和图表展示
│   │   │   ├── components/
│   │   │   │   ├── trend-chart.tsx # 折线图组件
│   │   │   │   └── pie-chart.tsx   # 饼图组件
│   │   │   └── index.scss
│   │   ├── moments/                # 美好时刻页面 [NEW]
│   │   │   ├── index.tsx           # 时间线展示
│   │   │   ├── components/
│   │   │   │   └── timeline-item.tsx # 时间线项组件
│   │   │   └── index.scss
│   │   └── profile/                # 个人中心页面 [NEW]
│   │       ├── index.tsx           # 用户信息和管理入口
│   │       ├── components/
│   │       │   ├── manage-tasks.tsx # 任务管理组件
│   │       │   ├── manage-rewards.tsx # 奖励管理组件
│   │       │   └── import-modal.tsx # 导入配置模态框
│   │       └── index.scss
│   ├── services/
│   │   ├── store.service.ts        # [MODIFY] 核心业务逻辑（状态管理、数据持久化）
│   │   └── sound.service.ts        # [MODIFY] 音效服务（使用 wx.createInnerAudioContext）
│   ├── components/
│   │   ├── lottie-animation.tsx    # [NEW] Lottie 动画封装组件
│   │   ├── safe-area.tsx           # [NEW] 安全区域适配组件
│   │   └── toast.tsx              # [NEW] 轻提示组件
│   ├── utils/
│   │   ├── storage.ts              # [NEW] 本地存储封装
│   │   ├── date.ts                 # [NEW] 日期处理工具
│   │   └── vibration.ts            # [NEW] 振动反馈工具
│   ├── constants/
│   │   ├── storage-keys.ts         # [NEW] 存储键常量
│   │   └── default-data.ts         # [NEW] 默认数据配置
│   └── types/
│       ├── user.ts                 # [NEW] 用户类型定义
│       ├── task.ts                 # [NEW] 任务类型定义
│       ├── reward.ts               # [NEW] 奖励类型定义
│       └── log.ts                  # [NEW] 日志类型定义
├── package.json
├── tsconfig.json
└── project.config.json             # 微信小程序项目配置
```

## 核心代码结构

### 数据模型定义

```typescript
// types/user.ts
export interface User {
  name: string;
  magnets: number;
  streak: number;
  lastCheckInDate: string;
  totalTasksCompleted: number;
  homeRuns: number;
}

// types/task.ts
export interface Task {
  id: string;
  title: string;
  icon: string;
  magnetReward: number;
  completed: boolean;
  lastCompletedDate: string;
}

// types/reward.ts
export interface Reward {
  id: string;
  title: string;
  icon: string;
  cost: number;
  description: string;
  category: 'mini' | 'small' | 'bonus' | 'dream';
}

// types/log.ts
export interface Log {
  id: string;
  type: 'earn' | 'spend' | 'bonus' | 'mood' | 'penalty' | 'magnet-moment';
  amount: number;
  description: string;
  timestamp: number;
}
```

### 状态管理服务接口

```typescript
// services/store.service.ts 核心接口
export class StoreService {
  // 状态
  user: User;
  tasks: Task[];
  rewards: Reward[];
  logs: Log[];
  
  // 计算属性
  todaysProgress: { completed: number; total: number; percentage: number };
  
  // 任务操作
  toggleTask(taskId: string): void;
  
  // 磁贴操作
  addMagnets(amount: number, description: string, type: Log['type']): void;
  spendMagnets(amount: number, description: string): boolean;
  
  // 管理操作
  addTask(title: string, icon: string, reward: number): void;
  updateTask(id: string, updates: Partial<Task>): void;
  deleteTask(id: string): void;
  addReward(...): void;
  updateReward(...): void;
  deleteReward(...): void;
}
```

## 设计风格

采用现代、温馨、充满童趣的 Glassmorphism（玻璃拟态）与 Material Design 结合风格，通过柔和的色彩、圆角卡片、渐变背景和精致的动画营造梦幻、积极的氛围。

## 设计原则

- **儿童友好**：大图标、大按钮、简洁操作、即时反馈
- **视觉愉悦**：蓝紫粉渐变主色调，暖色调辅助色
- **交互流畅**：微动画、震动反馈、音效增强沉浸感
- **信息清晰**：卡片式布局，层次分明，重要信息突出

## 页面规划

### 1. 首页

**顶部区域**

- 欢迎横幅：显示用户昵称和问候语，右侧显示用户头像（emoji）
- 核心卡片：融合磁贴总数展示 + 今日任务进度，使用粉紫渐变背景，大字号展示磁贴数量

**快捷操作区**

- 磁贴时刻按钮（相机图标，粉色）
- 心情转换按钮（彩虹图标，紫色）

**任务列表区**

- 任务卡片网格（移动端1列，横屏2列）
- 每个任务卡片：图标、标题、奖励磁贴数、完成状态
- 完成状态：绿色遮罩 + 勾选标记

**底部提示**

- 全垒打达成提示（黄色渐变背景，弹跳动画）

### 2. 梦想屋

**顶部固定栏**

- 可用磁贴展示（粉紫渐变胶囊）

**奖励列表**

- 网格布局（移动端2列，横屏3-4列）
- 奖励卡片：图标、名称、消耗磁贴数、兑换按钮
- 大梦想奖励：红色渐变标签、底部进度条

**兑换记录**

- 最近兑换列表（最多5条）

### 3. 统计

**概览卡片**

- 3个统计卡片：近7天收入、支出、净增长

**趋势图表**

- 折线图：蓝色收入线、红色支出虚线

**收入来源**

- 饼图 + 图例，显示各类磁贴来源

### 4. 美好时光

**时间线布局**

- 垂直时间线，粉色渐变线条
- 按日期分组，显示"今天"、"昨天"或具体日期
- 每条记录：描述、磁贴奖励、时间

**顶部操作**

- 导出按钮

### 5. 个人中心

**个人信息区**

- 头像、昵称、加入日期

**荣誉展示**

- 连续打卡天数（火焰图标）
- 全垒打次数（棒球图标）

**管理菜单**

- 任务管理（蓝色图标，家长标签）
- 奖励管理（粉色图标，家长标签）

**管理界面**

- 全屏覆盖层，向上滑入动画
- 添加/编辑表单
- 现有项目列表
- 导入/导出配置

## 交互细节

- **按钮点击**：缩放动画（scale 0.95）+ 震动反馈
- **卡片悬停**：阴影加深，轻微上浮
- **模态框**：淡入 + 弹跳动画
- **列表加载**：逐项淡入
- **确认弹窗**：先显示确认，家长验证（数学题），最后成功动画

## 响应式适配

- 移动端优先设计，主要适配手机竖屏
- 横屏模式下卡片网格自动调整列数
- 安全区域适配底部 Tab 和刘海屏

## Agent Extensions

### MCP

- **TDesign MCP Server**
- Purpose: 获取 TDesign 小程序组件库的可用组件列表、文档和 DOM 结构
- Expected outcome: 在组件开发过程中查询 TDesign 组件的使用方法，确保正确使用组件库实现 UI 功能