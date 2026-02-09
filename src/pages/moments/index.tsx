import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storeService } from '../../services';
import { Log } from '../../types';
import { DateUtil } from '../../utils/date';
import '../../styles/moments.scss';

export default function Moments() {
  const [logs, setLogs] = useState(storeService.logs);

  useEffect(() => {
    const refreshData = () => {
      setLogs([...storeService.logs]);
    };
    refreshData();
    const unsubscribe = storeService.subscribe(refreshData);

    return () => {
      unsubscribe();
    };
  }, []);

  const magnetMomentLogs = logs.filter(log =>
    log.type === 'magnet-moment' ||
    log.type === 'earn' ||
    log.type === 'mood' ||
    log.type === 'spend' ||
    log.type === 'bonus'
  );

  // 按日期分组
  const groupLogsByDate = (logs) => {
    const groups = {};
    const today = DateUtil.getToday();
    const yesterday = DateUtil.getYesterday();

    logs.forEach(log => {
      const date = DateUtil.formatDate(log.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });

    // 排序并返回
    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        friendlyDate: date === today ? '今天' : date === yesterday ? '昨天' : date,
        logs: items.sort((a, b) => b.timestamp - a.timestamp)
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const groupedLogs = groupLogsByDate(magnetMomentLogs);

  // 获取记录图标
  const getLogIcon = (log: Log) => {
    switch (log.type) {
      case 'magnet-moment':
        return '📸';
      case 'earn':
        return '✅';
      case 'mood':
        return '🌈';
      case 'bonus':
        return '🎁';
      case 'spend':
        return '🎁';
      default:
        return '📸';
    }
  };

  // 获取记录颜色
  const getLogColor = (log: Log) => {
    if (log.type === 'spend') {
      return '#EF4444';
    }
    return '#EC4899';
  };

  const handleExport = () => {
    const content = magnetMomentLogs
      .map(log => {
        const prefix = log.amount > 0 ? '+' : '';
        return `${DateUtil.formatDateTime(log.timestamp)} - ${log.description} (${prefix}${log.amount} 磁贴)`;
      })
      .join('\n');

    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  };

  return (
    <ScrollView className='moments-page' scrollY>
      {/* 顶部操作栏 */}
      <View className='header-actions'>
        <View className='header-info'>
          <Text className='header-title'>磁贴记录</Text>
          <Text className='header-subtitle'>记录磁贴的获得和消费</Text>
        </View>
        <Button className='export-button' onClick={handleExport}>
          📤 导出
        </Button>
      </View>

      {/* 时间线 */}
      {groupedLogs.length > 0 ? (
        <View className='timeline'>
          {groupedLogs.map((group, groupIndex) => (
            <View key={group.date} className='timeline-group'>
              <View className='timeline-date'>
                <Text className='date-text'>{group.friendlyDate}</Text>
              </View>
              <View className='timeline-items'>
                {group.logs.map((log, logIndex) => (
                  <View
                    key={log.id}
                    className={`timeline-item ${logIndex === group.logs.length - 1 ? 'last' : ''}`}
                  >
                    <View
                      className='timeline-dot'
                      style={{ borderColor: getLogColor(log) }}
                    />
                    <View className='timeline-content'>
                      <View className='timeline-header'>
                        <Text className='timeline-time'>
                          {DateUtil.formatTime(log.timestamp)}
                        </Text>
                        <View className='timeline-reward'>
                          <Text
                            className='reward-number'
                            style={{ color: getLogColor(log) }}
                          >
                            {log.amount > 0 ? '+' : ''}{log.amount}
                          </Text>
                          <Text className='reward-emoji'>{getLogIcon(log)}</Text>
                        </View>
                      </View>
                      <Text className='timeline-description'>
                        {log.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className='empty-state'>
          <Text className='empty-icon'>📸</Text>
          <Text className='empty-text'>还没有磁贴记录哦</Text>
          <Text className='empty-subtitle'>去首页完成任务或记录美好时刻吧！</Text>
        </View>
      )}
    </ScrollView>
  );
}
