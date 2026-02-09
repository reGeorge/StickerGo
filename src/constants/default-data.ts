import { Task, Reward, User } from '../types';

export const DEFAULT_USER: User = {
  name: '宝贝',
  magnets: 0,
  streak: 0,
  lastCheckInDate: '',
  totalTasksCompleted: 0,
  homeRuns: 0
};

export const DEFAULT_TASKS: Task[] = [
  { id: '1', title: '吃饭香香', icon: '🍚', magnetReward: 1, completed: false, lastCompletedDate: '' },
  { id: '2', title: '洗刷刷达人', icon: '🛁', magnetReward: 1, completed: false, lastCompletedDate: '' },
  { id: '3', title: '玩具回新家', icon: '🧸', magnetReward: 1, completed: false, lastCompletedDate: '' },
  { id: '4', title: '上学不迟到', icon: '🎒', magnetReward: 1, completed: false, lastCompletedDate: '' },
  { id: '5', title: '准时梦游记', icon: '🌙', magnetReward: 1, completed: false, lastCompletedDate: '' }
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: '玩一会手机', icon: '📱', cost: 2, description: 'mini奖励 (15分钟)', category: 'mini' },
  { id: 'r2', title: '玩一会游戏', icon: '🎮', cost: 3, description: '小奖励 (30分钟)', category: 'small' },
  { id: 'r3', title: '美味零食', icon: '🍫', cost: 5, description: '小奖赏 (10元以内)', category: 'bonus' },
  { id: 'r4', title: '心仪玩具', icon: '🎁', cost: 10, description: '大梦想 (50元以内)', category: 'dream' }
];

export const STORAGE_VERSION = '3.0.0';
