import dayjs from 'dayjs';

export class DateUtil {
  // 获取今天的日期字符串（YYYY-MM-DD）
  static getToday(): string {
    return dayjs().format('YYYY-MM-DD');
  }

  // 获取昨天的日期字符串
  static getYesterday(): string {
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  }

  // 获取指定天前的日期字符串
  static getDateBefore(days: number): string {
    return dayjs().subtract(days, 'day').format('YYYY-MM-DD');
  }

  // 格式化时间戳为时间字符串
  static formatTime(timestamp: number): string {
    return dayjs(timestamp).format('HH:mm');
  }

  // 格式化时间戳为日期字符串
  static formatDate(timestamp: number): string {
    return dayjs(timestamp).format('YYYY-MM-DD');
  }

  // 格式化时间戳为完整日期时间字符串
  static formatDateTime(timestamp: number): string {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
  }

  // 获取友好的时间显示（今天、昨天或具体日期）
  static getFriendlyTime(timestamp: number): string {
    const today = this.getToday();
    const yesterday = this.getYesterday();
    const date = this.formatDate(timestamp);

    if (date === today) {
      return '今天 ' + this.formatTime(timestamp);
    } else if (date === yesterday) {
      return '昨天 ' + this.formatTime(timestamp);
    } else {
      return this.formatDateTime(timestamp);
    }
  }

  // 判断两个日期是否是同一天
  static isSameDay(timestamp1: number, timestamp2: number): boolean {
    return this.formatDate(timestamp1) === this.formatDate(timestamp2);
  }

  // 获取过去N天的日期数组
  static getLastNDays(n: number): string[] {
    const days: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      days.push(this.getDateBefore(i));
    }
    return days;
  }

  // 计算两个日期之间的天数差
  static getDaysDiff(date1: string, date2: string): number {
    return dayjs(date1).diff(dayjs(date2), 'day');
  }
}
