import Taro from '@tarojs/taro';

export class SoundService {
  private volume = 0.3; // 主音量
  private audioContext: any = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      // 微信小程序使用 InnerAudioContext
      this.audioContext = Taro.createInnerAudioContext();
    } catch (error) {
      console.error('音频初始化失败:', error);
    }
  }

  /**
   * 标准音效 - 完成任务获得磁贴
   * 高音、快速衰减的正弦波
   */
  playEarn() {
    this.playFrequency(880, 200, 'sine');
    setTimeout(() => {
      this.playFrequency(1760, 300, 'sine');
    }, 100);
  }

  /**
   * 购买音效 - 花费磁贴兑换奖励
   * 两个快速的独特音调
   */
  playSpend() {
    this.playFrequency(600, 150, 'triangle');
    setTimeout(() => {
      this.playFrequency(800, 300, 'triangle');
    }, 150);
  }

  /**
   * 庆祝音效 - 全垒打
   * 大三和弦琶音（C - E - G - C）
   */
  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 150;

    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playFrequency(freq, duration * 2, 'square');
      }, i * duration);
    });
  }

  /**
   * 温馨音效 - 心情转换
   */
  playChime() {
    this.playFrequency(440, 1500, 'sine');
  }

  /**
   * 播放指定频率的音调
   * @param freq 频率
   * @param duration 持续时间
   * @param type 波形类型
   */
  private playFrequency(freq: number, duration: number, type: string) {
    try {
      // 使用 InnerAudioContext 播放音频
      if (!this.audioContext) {
        this.initAudioContext();
      }

      // 注意：小程序的 InnerAudioContext 不支持直接播放频率
      // 这里我们使用简化的实现，实际应该使用音频文件
      // 为了演示，我们这里只是模拟
      
      // 在实际项目中，应该准备音频文件：
      // const audio = Taro.createInnerAudioContext();
      // audio.src = '/assets/sounds/earn.mp3';
      // audio.volume = this.volume;
      // audio.play();

    } catch (error) {
      console.error('播放音效失败:', error);
    }
  }

  /**
   * 设置音量
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 获取当前音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 停止所有音效
   */
  stop() {
    if (this.audioContext) {
      try {
        this.audioContext.stop();
      } catch (error) {
        // 忽略停止失败
      }
    }
  }
}

// 导出单例
export const soundService = new SoundService();
