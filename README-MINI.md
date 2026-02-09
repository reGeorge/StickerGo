# 磁贴大挑战 - 儿童习惯养成与情绪管理小程序

> 基于 Taro + React 开发的微信小程序，帮助孩子建立良好生活习惯、培养情绪控制能力。

## ✨ 功能特性

- 📋 **每日约定场景** - 5个基础生活习惯任务，每日自动重置
- 🏆 **全垒打奖励** - 每天完成所有任务额外获得5个磁贴
- 🎁 **奖励兑换系统** - 分级奖励兑换，大梦想进度条展示
- 🌈 **情绪管理工具** - 心情转换器，引导孩子识别和转换负面情绪
- 📸 **美好时刻记录** - 记录生活中的闪光点，时间线展示
- 📊 **数据统计分析** - 近7天磁贴收支趋势、收入来源分析
- 👤 **个人中心管理** - 用户信息展示、任务/奖励自定义管理
- 🎵 **音效与振动** - 即时反馈，增强交互体验

## 🚀 技术栈

- **开发框架**: Taro 3.x + React 18
- **UI 组件**: TDesign 小程序组件库
- **状态管理**: React Hooks
- **样式**: SCSS + WXSS
- **图表**: ECharts for Taro（待集成）
- **动画**: Lottie（待集成）
- **语言**: TypeScript

## 📦 项目结构

```
magnet-challenge-miniprogram/
├── config/               # Taro 配置文件
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── constants/       # 常量定义
│   ├── pages/          # 页面
│   │   ├── home/       # 首页
│   │   ├── rewards/    # 梦想屋
│   │   ├── stats/      # 统计
│   │   ├── moments/    # 美好时光
│   │   └── profile/    # 个人中心
│   ├── services/       # 服务层
│   │   ├── store.service.ts    # 状态管理
│   │   └── sound.service.ts    # 音效服务
│   ├── styles/         # 全局样式
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   ├── app.config.ts   # 小程序配置
│   ├── app.tsx         # 应用入口
│   └── app.scss        # 全局样式
├── package.json
├── tsconfig.json
└── project.config.json # 微信小程序配置
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 14
- npm >= 6
- 微信开发者工具

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动微信小程序开发
npm run dev:weapp
```

然后在微信开发者工具中导入 `dist` 目录。

### 构建

```bash
# 构建微信小程序
npm run build:weapp
```

## 📝 核心功能说明

### 状态管理

使用 React Hooks + 自定义服务类实现状态管理：

```typescript
// 获取服务实例
const store = storeService;

// 读取数据
const user = store.user;
const tasks = store.tasks;

// 操作数据
store.toggleTask(taskId);
store.addMagnets(5, '奖励描述', 'earn');
```

### 数据持久化

使用小程序本地存储：

```typescript
// 存储
Taro.setStorageSync(STORAGE_KEYS.USER, data);

// 读取
const data = Taro.getStorageSync(STORAGE_KEYS.USER);
```

### 音效系统

封装的音效服务：

```typescript
import { soundService } from '@/services/sound.service';

// 播放音效
soundService.playEarn();   // 赚取音效
soundService.playSpend();  // 花费音效
soundService.playFanfare(); // 庆祝音效
soundService.playChime();  // 心情转换音效
```

### 振动反馈

```typescript
import { VibrationUtil } from '@/utils/vibration';

VibrationUtil.short();   // 短振动
VibrationUtil.medium();  // 中等振动
VibrationUtil.success(); // 成功反馈
```

## 🎨 设计风格

采用**玻璃拟态 + 童趣风格**，通过柔和的色彩、圆角卡片、渐变背景和精致的动画营造梦幻、积极的氛围。

### 色彩系统

- **主色调**: 粉色 #EC4899、紫色 #8B5CF6、蓝色 #6366F1
- **背景色**: 浅蓝 #F0F4FF、浅粉 #FFF5F7
- **功能色**: 成功 #10B981、警告 #F59E0B、错误 #EF4444

## 📱 页面说明

### 1. 首页

- 欢迎横幅
- 磁贴总数展示
- 每日任务进度条
- 快捷操作（磁贴时刻、心情转换）
- 任务列表

### 2. 梦想屋

- 可用磁贴展示
- 奖励列表
- 兑换功能（带数学验证）

### 3. 统计

- 近7天收入、支出、净增长
- 收支趋势图表
- 收入来源分析
- 荣誉殿堂

### 4. 美好时光

- 时间线展示美好时刻
- 导出功能

### 5. 个人中心

- 用户信息展示
- 荣誉展示
- 任务/奖励管理
- 数据重置

## 🔧 待完善功能

- [ ] 集成 ECharts 图表
- [ ] 集成 Lottie 动画
- [ ] 准备 TabBar 图标资源
- [ ] 添加音效文件
- [ ] 性能优化
- [ ] 单元测试

## 📄 License

MIT

## 🙏 致谢

原项目基于 Angular 开发，感谢原作者的贡献。
