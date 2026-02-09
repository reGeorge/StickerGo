import { View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import './index.scss';

interface SafeAreaProps {
  children: any;
  position?: 'top' | 'bottom' | 'both';
}

/**
 * 安全区域适配组件
 * 适配刘海屏和底部横条
 */
export default function SafeArea({ children, position = 'bottom' }: SafeAreaProps) {
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync();
    const { statusBarHeight, safeArea } = systemInfo;

    setSafeAreaInsets({
      top: statusBarHeight || 0,
      bottom: (safeArea && safeArea.bottom) ? systemInfo.screenHeight - safeArea.bottom : 0
    });
  }, []);

  const style: any = {
    paddingTop: position === 'top' || position === 'both' ? `${safeAreaInsets.top}rpx` : 0,
    paddingBottom: position === 'bottom' || position === 'both' ? `${safeAreaInsets.bottom}rpx` : 0
  };

  return (
    <View className="safe-area" style={style}>
      {children}
    </View>
  );
}
