import { useEffect, useRef } from 'react';
import { View } from '@tarojs/components';

interface LottieAnimationProps {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
  onComplete?: () => void;
}

/**
 * Lottie 动画组件
 * 注意：需要先安装 lottie-miniprogram 并在 app.config.ts 中引入
 */
export default function LottieAnimation({
  path,
  loop = true,
  autoplay = true,
  width = 300,
  height = 300,
  onComplete
}: LottieAnimationProps) {
  const canvasRef = useRef<any>(null);
  const lottieInstance = useRef<any>(null);

  useEffect(() => {
    // 注意：小程序环境中需要使用 lottie-miniprogram
    // 这里提供组件结构，实际使用时需要：
    // 1. 安装 lottie-miniprogram: npm install lottie-miniprogram
    // 2. 在 app.config.ts 中引入: 'lottie-animation': 'lottie-miniprogram/index'
    // 3. 使用正确的初始化方式

    // 临时占位实现
    console.log('Lottie animation path:', path);

    return () => {
      // 清理动画实例
      if (lottieInstance.current) {
        lottieInstance.current.destroy();
      }
    };
  }, [path]);

  return (
    <View
      style={{
        width: `${width}rpx`,
        height: `${height}rpx`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Lottie canvas 将在这里渲染 */}
      {/* 临时占位符 */}
      <View
        style={{
          fontSize: `${Math.min(width, height) / 3}rpx`
        }}
      >
        ✨
      </View>
    </View>
  );
}
