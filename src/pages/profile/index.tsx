import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storeService } from '../../services';
import '../../styles/profile.scss';

export default function Profile() {
  const [user, setUser] = useState(storeService.user);
  const [showManageTasks, setShowManageTasks] = useState(false);
  const [showManageRewards, setShowManageRewards] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskIcon, setNewTaskIcon] = useState('⭐');
  const [newTaskReward, setNewTaskReward] = useState('1');
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');
  const [newRewardCost, setNewRewardCost] = useState('1');

  useEffect(() => {
    const refreshData = () => {
      setUser(storeService.user);
    };
    refreshData();
    const unsubscribe = storeService.subscribe(refreshData);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddTask = () => {
    if (!newTaskTitle) {
      Taro.showToast({
        title: '请输入任务名称',
        icon: 'none'
      });
      return;
    }

    storeService.addTask(newTaskTitle, newTaskIcon, parseInt(newTaskReward));
    setNewTaskTitle('');
    setNewTaskIcon('⭐');
    setNewTaskReward('1');

    Taro.showToast({
      title: '添加成功',
      icon: 'success'
    });
  };

  const handleDeleteTask = (taskId) => {
    storeService.deleteTask(taskId);
    setUser({ ...storeService.user });
    Taro.showToast({
      title: '删除成功',
      icon: 'success'
    });
  };

  const handleAddReward = () => {
    if (!newRewardTitle) {
      Taro.showToast({
        title: '请输入奖励名称',
        icon: 'none'
      });
      return;
    }

    storeService.addReward(
      newRewardTitle,
      newRewardIcon,
      parseInt(newRewardCost),
      '自定义奖励',
      'small'
    );
    setNewRewardTitle('');
    setNewRewardIcon('🎁');
    setNewRewardCost('1');

    Taro.showToast({
      title: '添加成功',
      icon: 'success'
    });
  };

  const handleDeleteReward = (rewardId) => {
    storeService.deleteReward(rewardId);
    setUser({ ...storeService.user });
    Taro.showToast({
      title: '删除成功',
      icon: 'success'
    });
  };

  return (
    <ScrollView className='profile-page' scrollY>
      {/* 用户信息卡片 */}
      <View className='user-card'>
        <View className='avatar-large'>{user.name.charAt(0)}</View>
        <View className='user-info'>
          <Text className='user-name'>{user.name}</Text>
          <Text className='user-join-date'>加入日期: {user.lastCheckInDate || '今天'}</Text>
        </View>
      </View>

      {/* 荣誉展示 */}
      <View className='honor-section'>
        <View className='honor-item'>
          <View className='honor-icon-wrapper'>
            <Text className='honor-icon'>🔥</Text>
          </View>
          <View className='honor-text'>
            <Text className='honor-label'>连续打卡</Text>
            <Text className='honor-value'>{user.streak} 天</Text>
          </View>
        </View>
        <View className='honor-item'>
          <View className='honor-icon-wrapper'>
            <Text className='honor-icon'>⚾</Text>
          </View>
          <View className='honor-text'>
            <Text className='honor-label'>全垒打</Text>
            <Text className='honor-value'>{user.homeRuns} 次</Text>
          </View>
        </View>
      </View>

      {/* 管理菜单 */}
      <View className='menu-section'>
        <View className='menu-item' onClick={() => setShowManageTasks(true)}>
          <View className='menu-icon-wrapper-blue'>
            <Text className='menu-icon'>📝</Text>
          </View>
          <View className='menu-text'>
            <Text className='menu-title'>任务管理</Text>
            <Text className='menu-subtitle'>自定义每日约定场景</Text>
          </View>
          <Text className='menu-arrow'>›</Text>
        </View>

        <View className='menu-item' onClick={() => setShowManageRewards(true)}>
          <View className='menu-icon-wrapper-pink'>
            <Text className='menu-icon'>🎁</Text>
          </View>
          <View className='menu-text'>
            <Text className='menu-title'>奖励管理</Text>
            <Text className='menu-subtitle'>自定义兑换奖励</Text>
          </View>
          <Text className='menu-arrow'>›</Text>
        </View>
      </View>

      {/* 任务管理模态框 */}
      {showManageTasks && (
        <View className='modal-overlay' onClick={() => setShowManageTasks(false)}>
          <View className='modal-content' onClick={(e) => e.stopPropagation()}>
            <View className='modal-header'>
              <Text className='modal-title'>📝 任务管理</Text>
              <Text className='modal-close' onClick={() => setShowManageTasks(false)}>✕</Text>
            </View>

            <View className='modal-body'>
              <Text className='section-label'>添加新任务</Text>
              <View className='form-row'>
                <Input
                  className='form-input'
                  value={newTaskTitle}
                  onInput={(e) => setNewTaskTitle(e.detail.value)}
                  placeholder='任务名称'
                  placeholderClass='placeholder'
                />
                <Input
                  className='form-input-small'
                  value={newTaskReward}
                  onInput={(e) => setNewTaskReward(e.detail.value)}
                  type='number'
                  placeholder='奖励'
                  placeholderClass='placeholder'
                />
              </View>
              <View className='emoji-selector'>
                {['⭐', '🍚', '🛁', '🧸', '🎒', '🌙', '🏃', '📚', '🎨', '🎵'].map(emoji => (
                  <View
                    key={emoji}
                    className={`emoji-item ${newTaskIcon === emoji ? 'active' : ''}`}
                    onClick={() => setNewTaskIcon(emoji)}
                  >
                    <Text className='emoji-text'>{emoji}</Text>
                  </View>
                ))}
              </View>
              <Button className='add-button' onClick={handleAddTask}>
                添加任务
              </Button>

              <Text className='section-label'>现有任务</Text>
              <View className='items-list'>
                {storeService.tasks.map(task => (
                  <View key={task.id} className='item-row'>
                    <Text className='item-icon'>{task.icon}</Text>
                    <Text className='item-name'>{task.title}</Text>
                    <Text className='item-reward'>+{task.magnetReward}</Text>
                    <Text
                      className='item-delete'
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      删除
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 奖励管理模态框 */}
      {showManageRewards && (
        <View className='modal-overlay' onClick={() => setShowManageRewards(false)}>
          <View className='modal-content' onClick={(e) => e.stopPropagation()}>
            <View className='modal-header'>
              <Text className='modal-title'>🎁 奖励管理</Text>
              <Text className='modal-close' onClick={() => setShowManageRewards(false)}>✕</Text>
            </View>

            <View className='modal-body'>
              <Text className='section-label'>添加新奖励</Text>
              <View className='form-row'>
                <Input
                  className='form-input'
                  value={newRewardTitle}
                  onInput={(e) => setNewRewardTitle(e.detail.value)}
                  placeholder='奖励名称'
                  placeholderClass='placeholder'
                />
                <Input
                  className='form-input-small'
                  value={newRewardCost}
                  onInput={(e) => setNewRewardCost(e.detail.value)}
                  type='number'
                  placeholder='花费'
                  placeholderClass='placeholder'
                />
              </View>
              <View className='emoji-selector'>
                {['🎁', '📱', '🎮', '🍫', '🎨', '🎵', '🏃', '📚', '🎪', '🎡'].map(emoji => (
                  <View
                    key={emoji}
                    className={`emoji-item ${newRewardIcon === emoji ? 'active' : ''}`}
                    onClick={() => setNewRewardIcon(emoji)}
                  >
                    <Text className='emoji-text'>{emoji}</Text>
                  </View>
                ))}
              </View>
              <Button className='add-button' onClick={handleAddReward}>
                添加奖励
              </Button>

              <Text className='section-label'>现有奖励</Text>
              <View className='items-list'>
                {storeService.rewards.map(reward => (
                  <View key={reward.id} className='item-row'>
                    <Text className='item-icon'>{reward.icon}</Text>
                    <Text className='item-name'>{reward.title}</Text>
                    <Text className='item-cost'>{reward.cost} 磁贴</Text>
                    <Text
                      className='item-delete'
                      onClick={() => handleDeleteReward(reward.id)}
                    >
                      删除
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
