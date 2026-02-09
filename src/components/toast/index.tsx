import { useEffect } from 'react';
import Taro from '@tarojs/taro';

interface ToastProps {
  title: string;
  icon?: 'success' | 'error' | 'loading' | 'none';
  duration?: number;
  mask?: boolean;
  visible: boolean;
  onClose?: () => void;
}

/**
 * 轻提示组件
 * 封装 Taro.showToast
 */
export default function Toast({
  title,
  icon = 'none',
  duration = 2000,
  mask = false,
  visible,
  onClose
}: ToastProps) {
  useEffect(() => {
    if (visible && title) {
      Taro.showToast({
        title,
        icon,
        duration,
        mask,
        success: () => {
          setTimeout(() => {
            onClose?.();
          }, duration);
        }
      });
    }
  }, [visible, title, icon, duration, mask, onClose]);

  return null; // Toast 是全局组件，不需要渲染任何内容
}

/**
 * 快捷显示成功提示
 */
export const showToast = (title: string, duration = 2000) => {
  Taro.showToast({
    title,
    icon: 'success',
    duration
  });
};

/**
 * 快捷显示错误提示
 */
export const showErrorToast = (title: string, duration = 2000) => {
  Taro.showToast({
    title,
    icon: 'error',
    duration
  });
};

/**
 * 快捷显示加载提示
 */
export const showLoadingToast = (title = '加载中...', mask = true) => {
  Taro.showLoading({
    title,
    mask
  });
};

/**
 * 隐藏加载提示
 */
export const hideLoadingToast = () => {
  Taro.hideLoading();
};
