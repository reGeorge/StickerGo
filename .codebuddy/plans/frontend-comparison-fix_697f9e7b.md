---
name: frontend-comparison-fix
overview: 对比原始Angular实现和当前Taro实现，修复宽度截断和交互体验问题
todos:
  - id: fix-app-container
    content: 在app.scss添加全局max-width容器限制
    status: completed
  - id: fix-home-modal
    content: 修复首页模态框宽度为384rpx等效值
    status: completed
    dependencies:
      - fix-app-container
  - id: fix-profile-modal
    content: 修复个人中心模态框和网格布局
    status: completed
    dependencies:
      - fix-app-container
  - id: fix-rewards-modal
    content: 修复梦想屋模态框和卡片尺寸
    status: completed
    dependencies:
      - fix-app-container
  - id: fix-stats-grid
    content: 修复统计页面卡片网格响应式
    status: completed
    dependencies:
      - fix-app-container
  - id: fix-moments-layout
    content: 修复美好时光页面布局
    status: completed
    dependencies:
      - fix-app-container
  - id: add-interaction-feedback
    content: 添加按压反馈和过渡动画优化
    status: completed
  - id: verify-build
    content: 重新编译验证修复效果
    status: completed
    dependencies:
      - fix-home-modal
      - fix-profile-modal
      - fix-rewards-modal
      - fix-stats-grid
      - fix-moments-layout
      - add-interaction-feedback
---

## 用户需求

对比Taro微信小程序实现与原始Angular实现，找出页面布局截断问题的根本原因，全面修复宽度问题并优化交互体验。

## 问题分析

### 关键差异发现

**原始Angular实现（Tailwind CSS）：**

- 主容器: `max-w-6xl mx-auto` (最大1152px，居中)
- 内容区: `max-w-5xl mx-auto` (最大1024px，居中)
- 模态框: `max-w-sm` (最大384px)
- 响应式网格: `grid-cols-2 sm:grid-cols-4`
- 底部导航: `max-w-6xl` + `max-w-lg` 嵌套限制

**当前Taro实现的问题：**

- 无外层max-width限制，内容直接撑满屏幕
- 固定rpx单位缺少响应式适配
- 模态框宽度设置不一致(480rpx-600rpx)
- 缺少整体居中布局结构
- 小程序屏幕宽度750rpx与原始设计1024px不匹配

### 修复目标

1. 添加外层容器max-width限制，匹配原始设计比例
2. 统一模态框宽度为max-w-sm等效值(约384rpx)
3. 添加响应式网格支持
4. 优化交互反馈（点击缩放、过渡动画）
5. 保持Taro小程序兼容性

## 技术方案

### 核心策略

基于原始Angular的Tailwind设计规范，将固定rpx单位转换为带max-width限制的响应式布局，确保在各种屏幕尺寸下保持视觉一致性。

### 技术细节

**1. 外层容器架构**

- 添加全局wrapper: `max-width: 720rpx` (等效原始max-w-6xl在750rpx设计宽度下的比例)
- 内容区: `max-width: 640rpx` (等效max-w-5xl)
- 使用margin: 0 auto实现居中

**2. 模态框标准化**

- 统一使用 `max-width: 384rpx` (等效Tailwind max-w-sm)
- 宽度使用百分比 `width: 85%`
- 添加 `box-sizing: border-box` 防止padding溢出

**3. 响应式网格**

- 任务网格: 2列基础，适配更宽屏幕
- 奖励网格: 保持2列，减少卡片尺寸
- 使用flex布局替代部分grid实现更好兼容性

**4. 交互优化**

- 添加 `active:scale-95` 按压反馈
- 统一过渡动画时间 0.2s-0.3s
- 添加backdrop-filter模糊效果

**5. 安全区域适配**

- 底部预留 `pb-safe` 区域
- 考虑iPhone刘海屏适配

### 文件修改清单

- `src/app.scss` - 添加全局容器限制
- `src/pages/home/index.css` - 修复模态框和网格
- `src/styles/profile.scss` - 修复管理模态框
- `src/styles/rewards.scss` - 修复兑换模态框
- `src/styles/home.scss` - 修复全局模态框样式
- `src/styles/stats.scss` - 修复统计卡片网格
- `src/styles/moments.scss` - 修复时间线布局