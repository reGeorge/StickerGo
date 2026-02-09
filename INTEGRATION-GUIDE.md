# 集成指南

本文档说明如何完善小程序的集成工作。

## 🎨 图标资源

### TabBar 图标

需要准备 10 个图标文件（5个页面 × 2种状态）：

| 文件名 | 尺寸 | 说明 |
|--------|------|------|
| `home.png` | 81×81px | 首页（未选中） |
| `home-active.png` | 81×81px | 首页（选中） |
| `rewards.png` | 81×81px | 梦想屋（未选中） |
| `rewards-active.png` | 81×81px | 梦想屋（选中） |
| `stats.png` | 81×81px | 统计（未选中） |
| `stats-active.png` | 81×81px | 统计（选中） |
| `moments.png` | 81×81px | 美好（未选中） |
| `moments-active.png` | 81×81px | 美好（选中） |
| `profile.png` | 81×81px | 我的（未选中） |
| `profile-active.png` | 81×81px | 我的（选中） |

**推荐工具**：
- Iconfont: https://www.iconfont.cn/
- Flaticon: https://www.flaticon.com/
- 可以使用设计软件自行设计

## 🎵 音效资源

需要准备 4 个音效文件：

| 文件名 | 用途 |
|--------|------|
| `earn.mp3` | 完成任务 |
| `spend.mp3` | 兑换奖励 |
| `fanfare.mp3` | 全垒打 |
| `chime.mp3` | 心情转换 |

详见 `assets/sounds/README.md`

## ✨ Lottie 动画

### 安装依赖

```bash
npm install lottie-miniprogram
```

### 配置

在 `app.config.ts` 中添加：

```typescript
export default {
  // ...
  usingComponents: {
    'lottie-animation': 'lottie-miniprogram/index'
  }
}
```

### 使用示例

```typescript
import LottieAnimation from '@/components/lottie-animation';

<LottieAnimation
  path="https://lottie.host/xxx.json"
  loop={false}
  width={300}
  height={300}
/>
```

### 常用动画

- 成功动画: https://lottie.host/5ccfe317-5e60-4414-b49d-649033327663/zN1l2E4IqI.json
- 更多动画: https://lottiefiles.com/

## 📊 ECharts 图表

### 安装依赖

```bash
npm install echarts-for-taro
```

### 配置

在 `config/index.js` 中添加：

```javascript
const config = {
  // ...
  plugins: [
    '@tarojs/plugin-platform-weapp',
    '@tarojs/plugin-echarts' // 添加此插件
  ]
}
```

### 使用示例

```typescript
import Taro from '@tarojs/taro';
import * as echarts from 'echarts-for-taro';

function Chart() {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line'
      }]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, []);

  return <View ref={chartRef} style={{ width: '100%', height: 400 }} />;
}
```

## 🎨 TDesign 组件库

### 安装依赖

```bash
npm install tdesign-miniprogram
```

### 配置

在 `app.config.ts` 中添加：

```typescript
export default {
  // ...
  usingComponents: {
    't-button': 'tdesign-miniprogram/button/button',
    't-input': 'tdesign-miniprogram/input/input',
    't-modal': 'tdesign-miniprogram/modal/modal',
    't-toast': 'tdesign-miniprogram/toast/toast',
    // ... 其他组件
  }
}
```

### 使用示例

```typescript
import { View } from '@tarojs/components';

function MyComponent() {
  return (
    <View>
      <t-button theme="primary">按钮</t-button>
      <t-input placeholder="请输入" />
    </View>
  );
}
```

## 🚀 部署流程

### 1. 安装依赖

```bash
npm install
```

### 2. 开发调试

```bash
npm run dev:weapp
```

### 3. 微信开发者工具配置

1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. AppID: 使用测试号或申请正式 AppID
4. 开启"不校验合法域名"（开发阶段）

### 4. 生产构建

```bash
npm run build:weapp
```

### 5. 上传发布

1. 微信开发者工具中点击"上传"
2. 登录微信公众平台
3. 填写版本号和更新说明
4. 提交审核

## ⚙️ 常见问题

### 问题1: TabBar 图标不显示

**解决方案**：
- 检查图标路径是否正确
- 确认图标尺寸为 81×81px
- 检查图标文件大小不超过 40KB

### 问题2: 音效无法播放

**解决方案**：
- 检查音效文件路径
- 确认音效格式为 MP3 或 AAC
- 检查音效文件是否损坏
- 测试音效音量是否设置为 0

### 问题3: 图表不显示

**解决方案**：
- 确认 echarts-for-taro 已正确安装
- 检查配置文件是否正确引入插件
- 确认图表容器有明确的高度
- 检查小程序基础库版本（建议 2.9.0+）

### 问题4: 数据存储失败

**解决方案**：
- 检查存储键名是否重复
- 确认数据大小不超过 10MB
- 检查数据格式是否可序列化

## 📞 技术支持

- Taro 官方文档: https://taro-docs.jd.com/
- TDesign 小程序组件库: https://tdesign.tencent.com/miniprogram/
- ECharts for Taro: https://echarts.apache.org/zh/option.html
- 微信小程序官方文档: https://developers.weixin.qq.com/miniprogram/dev/framework/

## 📝 更新日志

### v1.0.0 (2026-02-07)
- ✅ 完成项目基础架构
- ✅ 实现所有核心页面
- ✅ 实现状态管理和服务层
- ✅ 完成基础样式和动画

### 待完成
- [ ] 集成 ECharts 图表
- [ ] 集成 Lottie 动画
- [ ] 准备图标和音效资源
- [ ] 性能优化
- [ ] 单元测试
