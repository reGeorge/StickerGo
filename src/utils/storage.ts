import Taro from '@tarojs/taro';
import { STORAGE_KEYS } from '../constants';

export class StorageUtil {
  // 同步存储数据
  static set<T>(key: typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS], value: T): boolean {
    try {
      Taro.setStorageSync(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('存储失败:', error);
      return false;
    }
  }

  // 同步获取数据
  static get<T>(key: typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS], defaultValue?: T): T | null {
    try {
      const data = Taro.getStorageSync(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return defaultValue || null;
    } catch (error) {
      console.error('读取失败:', error);
      return defaultValue || null;
    }
  }

  // 同步删除数据
  static remove(key: typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]): boolean {
    try {
      Taro.removeStorageSync(key);
      return true;
    } catch (error) {
      console.error('删除失败:', error);
      return false;
    }
  }

  // 清空所有数据
  static clear(): boolean {
    try {
      Taro.clearStorageSync();
      return true;
    } catch (error) {
      console.error('清空失败:', error);
      return false;
    }
  }

  // 获取存储信息
  static async getInfo() {
    try {
      const info = await Taro.getStorageInfo();
      return info;
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return null;
    }
  }
}
