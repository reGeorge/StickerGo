import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storeService } from '../../services';
import { DateUtil } from '../../utils/date';
import '../../styles/stats.scss';

export default function Stats() {
  const [user, setUser] = useState(storeService.user);
  const [income7Days, setIncome7Days] = useState(0);
  const [expense7Days, setExpense7Days] = useState(0);
  const [netGrowth7Days, setNetGrowth7Days] = useState(0);

  useEffect(() => {
    const refreshData = () => {
      setUser(storeService.user);
      const income = storeService.getIncomeByDays(7);
      const expense = storeService.getExpenseByDays(7);
      setIncome7Days(income);
      setExpense7Days(expense);
      setNetGrowth7Days(income - expense);
    };
    refreshData();
    const unsubscribe = storeService.subscribe(refreshData);

    return () => {
      unsubscribe();
    };
  }, []);

  const last7Days = DateUtil.getLastNDays(7);
  const dailyData = last7Days.map(date => {
    const logs = storeService.logs.filter(
      log => DateUtil.formatDate(log.timestamp) === date
    );
    const income = logs.filter(l => l.amount > 0).reduce((sum, l) => sum + l.amount, 0);
    const expense = logs.filter(l => l.amount < 0).reduce((sum, l) => sum + Math.abs(l.amount), 0);
    return { date, income, expense };
  });

  const incomeByType = storeService.getLogsByType('earn').reduce((acc, log) => {
    acc[log.description] = (acc[log.description] || 0) + log.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomeByTypeData = Object.entries(incomeByType).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <ScrollView className='stats-page' scrollY>
      {/* 概览卡片 */}
      <View className='overview-cards'>
        <View className='stat-card income'>
          <Text className='stat-label'>近7天收入</Text>
          <Text className='stat-value'>+{income7Days}</Text>
        </View>
        <View className='stat-card expense'>
          <Text className='stat-label'>近7天支出</Text>
          <Text className='stat-value'>-{expense7Days}</Text>
        </View>
        <View className='stat-card growth'>
          <Text className='stat-label'>净增长</Text>
          <Text className={`stat-value ${netGrowth7Days >= 0 ? 'positive' : 'negative'}`}>
            {netGrowth7Days >= 0 ? '+' : ''}{netGrowth7Days}
          </Text>
        </View>
      </View>

      {/* 趋势图表 */}
      <View className='chart-section'>
        <Text className='section-title'>近7天收支趋势</Text>
        <View className='chart-container'>
          <View className='chart-placeholder'>
            <Text className='placeholder-text'>📊 收支趋势图表</Text>
            <Text className='placeholder-sub'>（集成 ECharts 后显示）</Text>
          </View>
        </View>
      </View>

      {/* 收入来源分析 */}
      <View className='chart-section'>
        <Text className='section-title'>收入来源分析</Text>
        <View className='chart-container'>
          <View className='chart-placeholder'>
            <Text className='placeholder-text'>🥧 收入来源饼图</Text>
            <Text className='placeholder-sub'>（集成 ECharts 后显示）</Text>
          </View>
        </View>
      </View>

      {/* 荣誉展示 */}
      <View className='honor-section'>
        <Text className='section-title'>荣誉殿堂</Text>
        <View className='honor-cards'>
          <View className='honor-card'>
            <Text className='honor-icon'>🔥</Text>
            <Text className='honor-label'>连续打卡</Text>
            <Text className='honor-value'>{user.streak} 天</Text>
          </View>
          <View className='honor-card'>
            <Text className='honor-icon'>⚾</Text>
            <Text className='honor-label'>全垒打</Text>
            <Text className='honor-value'>{user.homeRuns} 次</Text>
          </View>
          <View className='honor-card'>
            <Text className='honor-icon'>✅</Text>
            <Text className='honor-label'>任务完成</Text>
            <Text className='honor-value'>{user.totalTasksCompleted} 次</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
