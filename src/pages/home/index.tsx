import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storeService } from '../../services';
import { Task } from '../../types';
import './index.css';

export default function Home() {
  const [user, setUser] = useState(storeService.user);
  const [tasks, setTasks] = useState(storeService.tasks);
  const [progress, setProgress] = useState(storeService.getTodaysProgress());
  const [showMagnetMomentModal, setShowMagnetMomentModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodSuccess, setMoodSuccess] = useState(false);
  const [magnetMomentDescription, setMagnetMomentDescription] = useState('');
  const [magnetMomentAmount, setMagnetMomentAmount] = useState(1);

  // 刷新数据
  useEffect(() => {
    const refreshData = () => {
      setUser(storeService.user);
      setTasks(storeService.tasks);
      setProgress(storeService.getTodaysProgress());
    };

    refreshData();
    const unsubscribe = storeService.subscribe(refreshData);

    return () => {
      unsubscribe();
    };
  }, []);

  // 处理任务切换
  const handleToggleTask = (taskId) => {
    storeService.toggleTask(taskId);
    // 刷新状态
    setUser({ ...storeService.user });
    setTasks([...storeService.tasks]);
    setProgress(storeService.getTodaysProgress());
  };

  // 磁贴时刻相关
  const openMagnetMoment = () => {
    setMagnetMomentDescription('');
    setMagnetMomentAmount(1);
    setShowMagnetMomentModal(true);
  };

  const closeMagnetMoment = () => {
    setShowMagnetMomentModal(false);
  };

  const submitMagnetMoment = () => {
    if (!magnetMomentDescription) return;

    storeService.addMagnets(
      magnetMomentAmount,
      `磁贴时刻: ${magnetMomentDescription}`,
      'magnet-moment'
    );

    // 刷新状态
    setUser({ ...storeService.user });
    closeMagnetMoment();

    Taro.showToast({
      title: '记录成功！',
      icon: 'success'
    });
  };

  // 心情转换相关
  const openMoodModal = () => {
    setMoodSuccess(false);
    setShowMoodModal(true);
  };

  const closeMoodModal = () => {
    setShowMoodModal(false);
  };

  const convertMood = (moodLabel) => {
    setMoodSuccess(true);

    setTimeout(() => {
      storeService.addMagnets(2, `心情转换: 处理了 ${moodLabel} 情绪`, 'mood');

      // 刷新状态
      setUser({ ...storeService.user });
    }, 300);
  };

  return (
    <ScrollView className='home-page' scrollY>
      {/* 欢迎横幅 */}
      <View className='welcome-banner'>
        <View className='welcome-text'>
          <Text className='welcome-title'>你好, {user.name}! 👋</Text>
          <Text className='welcome-subtitle'>今天也要加油收集磁贴哦！</Text>
        </View>
        <View className='avatar'>🐻</View>
      </View>

      {/* 核心卡片：磁贴总数 + 今日进度 */}
      <View className='magnet-card'>
        <View className='card-top'>
          <View className='magnet-info'>
            <Text className='magnet-label'>我的磁贴总数</Text>
            <View className='magnet-count'>
              <Text className='count-number'>{user.magnets}</Text>
              <Text className='count-emoji'>🌟</Text>
            </View>
          </View>
          <View className='trophy-icon'>🏆</View>
        </View>

        <View className='progress-section'>
          <View className='progress-header'>
            <Text className='progress-label'>每日约定场景</Text>
            <Text className='progress-value'>{progress.completed} / {progress.total}</Text>
          </View>
          <View className='progress-bar-container'>
            <View
              className='progress-bar'
              style={{ width: `${progress.percentage}%` }}
            />
          </View>
        </View>
      </View>

      {/* 快捷操作区 */}
      <View className='quick-actions'>
        <View className='action-card' onClick={openMagnetMoment}>
          <View className='action-icon-pink'>📸</View>
          <Text className='action-label'>磁贴时刻</Text>
        </View>
        <View className='action-card' onClick={openMoodModal}>
          <View className='action-icon-purple'>🌈</View>
          <Text className='action-label'>心情转换</Text>
        </View>
      </View>

      {/* 任务列表 */}
      <View className='tasks-section'>
        <Text className='section-title'>今日约定场景</Text>
        <View className='tasks-grid'>
          {tasks.map(task => (
            <View
              key={task.id}
              className={`task-card ${task.completed ? 'completed' : ''}`}
              onClick={() => handleToggleTask(task.id)}
            >
              {task.completed && <View className='completed-overlay'>✓</View>}
              <Text className='task-icon'>{task.icon}</Text>
              <Text className='task-title'>{task.title}</Text>
              <Text className='task-reward'>+{task.magnetReward} 磁贴</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 磁贴时刻模态框 */}
      {showMagnetMomentModal && (
        <View className='modal-overlay' onClick={closeMagnetMoment}>
          <View className='modal-content' onClick={(e) => e.stopPropagation()}>
            <View className='modal-header'>
              <Text className='modal-title'>📸 磁贴时刻</Text>
              <Text className='modal-close' onClick={closeMagnetMoment}>✕</Text>
            </View>

            <View className='modal-body'>
              <Text className='form-label'>发生了什么美好的事情？</Text>
              <Textarea
                className='form-textarea'
                value={magnetMomentDescription}
                onInput={(e) => setMagnetMomentDescription(e.detail.value)}
                placeholder='例如：主动帮妈妈扫地...'
                placeholderClass='placeholder'
              />

              <Text className='form-label'>奖励磁贴数量</Text>
              <View className='amount-selector'>
                {[1, 2, 3, 4, 5].map(num => (
                  <View
                    key={num}
                    className={`amount-item ${magnetMomentAmount === num ? 'active' : ''}`}
                    onClick={() => setMagnetMomentAmount(num)}
                  >
                    <Text className='amount-number'>{num}</Text>
                  </View>
                ))}
              </View>

              <Button
                className='submit-button'
                disabled={!magnetMomentDescription}
                onClick={submitMagnetMoment}
              >
                记录并获得奖励
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 心情转换模态框 */}
      {showMoodModal && (
        <View className='modal-overlay' onClick={closeMoodModal}>
          <View className='modal-content mood-modal' onClick={(e) => e.stopPropagation()}>
            {!moodSuccess ? (
              <>
                <View className='modal-header mood-header'>
                  <Text className='modal-title'>🌈 心情转换器</Text>
                </View>
                <Text className='mood-subtitle'>选择当前的小情绪，把它变成正能量！</Text>

                <View className='mood-grid'>
                  {[
                    { icon: '😤', label: '生气' },
                    { icon: '😢', label: '难过' },
                    { icon: '😫', label: '疲惫' }
                  ].map(mood => (
                    <View
                      key={mood.label}
                      className='mood-card'
                      onClick={() => convertMood(mood.label)}
                    >
                      <Text className='mood-icon'>{mood.icon}</Text>
                      <Text className='mood-label'>{mood.label}</Text>
                    </View>
                  ))}
                </View>

                <Text className='mood-cancel' onClick={closeMoodModal}>取消</Text>
              </>
            ) : (
              <View className='mood-success'>
                <View className='success-animation'>🎉</View>
                <Text className='success-title'>太棒了！</Text>
                <Text className='success-subtitle'>你成功控制了情绪！</Text>
                <View className='success-reward'>+2 磁贴 🌟</View>
                <Button className='success-button' onClick={closeMoodModal}>
                  收下奖励
                </Button>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
