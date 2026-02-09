import Taro from '@tarojs/taro';

export class VibrationUtil {
  /**
   * 短振动（50ms）
   */
  static short(): void {
    try {
      Taro.vibrateShort({
        success: () => {},
        fail: (error) => {
          console.error('振动失败:', error);
        }
      });
    } catch (error) {
      console.error('振动不支持:', error);
    }
  }

  /**
   * 中等振动（100ms）
   */
  static medium(): void {
    try {
      Taro.vibrateShort({
        success: () => {},
        fail: (error) => {
          console.error('振动失败:', error);
        }
      });
    } catch (error) {
      console.error('振动不支持:', error);
    }
  }

  /**
   * 长振动（200ms）
   */
  static long(): void {
    try {
      Taro.vibrateLong({
        success: () => {},
        fail: (error) => {
          console.error('振动失败:', error);
        }
      });
    } catch (error) {
      console.error('振动不支持:', error);
    }
  }

  /**
   * 自定义振动时长
   */
  static custom(duration: number): void {
    try {
      if (Taro.canIUse('vibrateLong')) {
        if (duration <= 100) {
          Taro.vibrateShort();
        } else {
          Taro.vibrateLong();
        }
      }
    } catch (error) {
      console.error('振动不支持:', error);
    }
  }

  /**
   * 成功反馈（两次短振动）
   */
  static success(): void {
    this.short();
    setTimeout(() => {
      this.short();
    }, 100);
  }

  /**
   * 错误反馈（三次短振动）
   */
  static error(): void {
    this.short();
    setTimeout(() => this.short(), 100);
    setTimeout(() => this.short(), 200);
  }
}
