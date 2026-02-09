# 音效资源说明

此目录存放小程序音效文件。

## 音效列表

### 1. earn.mp3
- **用途**: 完成任务获得磁贴
- **时长**: ~0.3秒
- **音效**: 硬币掉落声、升调正弦波（880Hz → 1760Hz）

### 2. spend.mp3
- **用途**: 花费磁贴兑换奖励
- **时长**: ~0.4秒
- **音效**: 两个快速的独特音调（600Hz → 800Hz）

### 3. fanfare.mp3
- **用途**: 全垒打奖励
- **时长**: ~0.6秒
- **音效**: 大三和弦琶音（C5, E5, G5, C6）

### 4. chime.mp3
- **用途**: 心情转换成功
- **时长**: ~1.5秒
- **音效**: 温馨的风铃声（440Hz → 880Hz）

## 音效要求

- **格式**: MP3 或 AAC
- **质量**: 128kbps
- **采样率**: 44.1kHz
- **单声道**: 是（为了减小文件体积）
- **最大文件大小**: 每个文件不超过 50KB

## 生成音效

### 方案1: 使用在线音效库
- Freesound: https://freesound.org/
- Zapsplat: https://www.zapsplat.com/
- Mixkit: https://mixkit.co/free-sound-effects/

### 方案2: 使用合成器
- Audacity (免费)
- FL Studio
- Ableton Live

### 方案3: 使用 TTS (文本转语音)
- 小程序云开发提供 TTS 接口
- 可以将文字转为语音文件

## 临时方案

如果还没有准备音效文件，可以：

1. **使用小程序内置音效**
   ```typescript
   Taro.playBackgroundMusic({
     title: '背景音乐',
     src: 'https://example.com/bgm.mp3'
   });
   ```

2. **使用在线音效链接**
   - 需要注意版权问题
   - 需要在小程序后台配置域名白名单

3. **使用 Tone.js (仅 H5)**
   - Taro H5 环境可以使用 Tone.js 实时生成音效
   - 小程序环境不支持

## 音效使用示例

```typescript
import Taro from '@tarojs/taro';

// 播放音效
const audioContext = Taro.createInnerAudioContext();
audioContext.src = '/assets/sounds/earn.mp3';
audioContext.volume = 0.3;
audioContext.play();

// 监听播放结束
audioContext.onEnded(() => {
  console.log('音效播放结束');
});

// 销毁音效实例
audioContext.destroy();
```

## 最佳实践

1. **音量控制**
   - 默认音量设置为 0.3（30%）
   - 提供音量调节功能

2. **静音模式**
   - 检测系统静音状态
   - 提供静音开关

3. **性能优化**
   - 预加载常用音效
   - 及时销毁不用的音效实例
   - 使用单例模式管理音效

4. **用户体验**
   - 添加音效开关（设置中）
   - 第一次播放时提示用户开启音效
   - 音效不可用时提供视觉反馈
