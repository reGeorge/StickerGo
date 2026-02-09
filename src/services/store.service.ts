import { User, Task, Reward, Log } from '../types';
import { StorageUtil } from '../utils/storage';
import { DateUtil } from '../utils/date';
import { VibrationUtil } from '../utils/vibration';
import { soundService } from './sound.service';
import { STORAGE_KEYS, DEFAULT_USER, DEFAULT_TASKS, DEFAULT_REWARDS } from '../constants';

export class StoreService {
  // 状态
  user: User;
  tasks: Task[];
  rewards: Reward[];
  logs: Log[];

  // 监听器
  private listeners: Set<() => void> = new Set();

  constructor() {
    // 初始化状态
    this.user = { ...DEFAULT_USER };
    this.tasks = [...DEFAULT_TASKS];
    this.rewards = [...DEFAULT_REWARDS];
    this.logs = [];

    // 加载数据
    this.loadData();

    // 检查每日重置
    this.checkDailyReset();

    // 自动保存
    this.autoSave();
  }

  // 加载数据
  private loadData() {
    const user = StorageUtil.get<User>(STORAGE_KEYS.USER, DEFAULT_USER);
    const tasks = StorageUtil.get<Task[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    const rewards = StorageUtil.get<Reward[]>(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS);
    const logs = StorageUtil.get<Log[]>(STORAGE_KEYS.LOGS, []);

    if (user) this.user = user;
    if (tasks) this.tasks = tasks;
    if (rewards) this.rewards = rewards;
    if (logs) this.logs = logs;
  }

  // 自动保存
  private autoSave() {
    // 在 React 中应该使用 useEffect 监听状态变化
    // 这里提供一个手动保存的方法
  }

  // 订阅状态变化
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // 通知所有监听器
  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // 保存所有数据
  saveAll() {
    StorageUtil.set(STORAGE_KEYS.USER, this.user);
    StorageUtil.set(STORAGE_KEYS.TASKS, this.tasks);
    StorageUtil.set(STORAGE_KEYS.REWARDS, this.rewards);
    StorageUtil.set(STORAGE_KEYS.LOGS, this.logs);
  }

  // 检查每日重置
  private checkDailyReset() {
    const today = DateUtil.getToday();

    this.tasks = this.tasks.map(task => {
      if (task.lastCompletedDate !== today) {
        return { ...task, completed: false };
      }
      return task;
    });

    this.saveAll();
    this.notify();
  }

  // 计算属性：今日进度
  getTodaysProgress() {
    const completed = this.tasks.filter(t => t.completed).length;
    const total = this.tasks.length;
    return {
      completed,
      total,
      percentage: total === 0 ? 0 : (completed / total) * 100
    };
  }

  // 任务操作
  toggleTask(taskId: string) {
    const today = DateUtil.getToday();
    let justCompleted = false;
    let taskReward = 0;
    let taskTitle = '';

    this.tasks = this.tasks.map(task => {
      if (task.id === taskId) {
        if (!task.completed) {
          justCompleted = true;
          taskReward = task.magnetReward;
          taskTitle = task.title;
          return { ...task, completed: true, lastCompletedDate: today };
        }
      }
      return task;
    });

    if (justCompleted) {
      this.addMagnets(taskReward, `完成约定: ${taskTitle}`, 'earn');
      this.updateStreak(today);
      this.checkHomeRun(today);
      VibrationUtil.short();
      soundService.playEarn();
    }

    this.saveAll();
  }

  // 检查全垒打
  private checkHomeRun(today: string) {
    const allCompleted = this.tasks.every(t => t.completed);
    const alreadyBonus = this.logs.some(
      l => l.type === 'bonus' && DateUtil.formatDate(l.timestamp) === today
    );

    if (allCompleted && !alreadyBonus) {
      this.addMagnets(5, '全垒打！今日五项全能达成！', 'bonus');
      this.user.homeRuns += 1;
      VibrationUtil.success();
      soundService.playFanfare();
    }
    this.notify();
  }

  // 更新连续打卡天数
  private updateStreak(today: string) {
    if (this.user.lastCheckInDate === today) return;

    const yesterday = DateUtil.getYesterday();

    let newStreak = this.user.streak;
    if (this.user.lastCheckInDate === yesterday) {
      newStreak++;
    } else {
      newStreak = 1;
    }

    this.user.lastCheckInDate = today;
    this.user.streak = newStreak;
    this.user.totalTasksCompleted += 1;
  }

  // 添加磁贴
  addMagnets(amount: number, description: string, type: Log['type']) {
    this.user.magnets += amount;
    this.logs = [{
      id: Date.now().toString(),
      type,
      amount,
      description,
      timestamp: Date.now()
    }, ...this.logs];

    // 根据类型播放音效
    if (type === 'bonus') {
      soundService.playFanfare();
    } else if (type === 'mood') {
      soundService.playChime();
    } else if (type === 'earn' || type === 'magnet-moment') {
      soundService.playEarn();
    }

    this.saveAll();
  }

  // 花费磁贴
  spendMagnets(amount: number, description: string): boolean {
    if (this.user.magnets < amount) return false;

    this.user.magnets -= amount;
    this.logs = [{
      id: Date.now().toString(),
      type: 'spend',
      amount: -amount,
      description,
      timestamp: Date.now()
    }, ...this.logs];

    VibrationUtil.medium();
    soundService.playSpend();
    this.saveAll();
    this.notify();

    return true;
  }

  // 管理操作：添加任务
  addTask(title: string, icon: string, reward: number) {
    this.tasks.push({
      id: Date.now().toString(),
      title,
      icon,
      magnetReward: reward,
      completed: false,
      lastCompletedDate: ''
    });
    this.saveAll();
    this.notify();
  }

  // 管理操作：更新任务
  updateTask(id: string, updates: Partial<Task>) {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    this.saveAll();
    this.notify();
  }

  // 管理操作：删除任务
  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveAll();
    this.notify();
  }

  // 管理操作：添加奖励
  addReward(title: string, icon: string, cost: number, description: string, category: Reward['category'] = 'small') {
    this.rewards.push({
      id: Date.now().toString(),
      title,
      icon,
      cost,
      description,
      category
    });
    this.saveAll();
    this.notify();
  }

  // 管理操作：更新奖励
  updateReward(id: string, updates: Partial<Reward>) {
    this.rewards = this.rewards.map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveAll();
    this.notify();
  }

  // 管理操作：删除奖励
  deleteReward(id: string) {
    this.rewards = this.rewards.filter(r => r.id !== id);
    this.saveAll();
    this.notify();
  }

  // 清空所有数据
  resetAll() {
    this.user = { ...DEFAULT_USER };
    this.tasks = [...DEFAULT_TASKS];
    this.rewards = [...DEFAULT_REWARDS];
    this.logs = [];
    this.saveAll();
    this.notify();
  }

  // 获取最近N天的日志
  getLogsByDays(days: number): Log[] {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.logs.filter(log => log.timestamp >= cutoff);
  }

  // 获取特定类型的日志
  getLogsByType(type: Log['type']): Log[] {
    return this.logs.filter(log => log.type === type);
  }

  // 统计最近N天的收入
  getIncomeByDays(days: number): number {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.logs
      .filter(log => log.timestamp >= cutoff && log.amount > 0)
      .reduce((sum, log) => sum + log.amount, 0);
  }

  // 统计最近N天的支出
  getExpenseByDays(days: number): number {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.logs
      .filter(log => log.timestamp >= cutoff && log.amount < 0)
      .reduce((sum, log) => sum + Math.abs(log.amount), 0);
  }
}

// 导出单例
export const storeService = new StoreService();
