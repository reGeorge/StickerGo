import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { storeService } from '../../services';
import { Reward } from '../../types';
import '../../styles/rewards.scss';

export default function Rewards() {
  const [user, setUser] = useState(storeService.user);
  const [rewards, setRewards] = useState(storeService.rewards);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathQuestion, setMathQuestion] = useState('');
  const [mathQuestionData, setMathQuestionData] = useState<{ a: number; b: number; operation: string } | null>(null);

  useEffect(() => {
    const refreshData = () => {
      setUser(storeService.user);
      setRewards(storeService.rewards);
    };
    refreshData();
    const unsubscribe = storeService.subscribe(refreshData);

    return () => {
      unsubscribe();
    };
  }, []);

  const generateMathQuestion = () => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { question: `${a} ${operation} ${b} = ?`, a, b, operation };
  };

  const handleRedeem = (reward) => {
    // 先刷新用户状态，确保显示最新的磁贴数量
    setUser({ ...storeService.user });

    if (storeService.user.magnets < reward.cost) {
      Taro.showToast({
        title: '磁贴不足！',
        icon: 'none'
      });
      return;
    }

    setSelectedReward(reward);
    const question = generateMathQuestion();
    setMathQuestion(question.question);
    setMathQuestionData({ a: question.a, b: question.b, operation: question.operation });
    setMathAnswer('');
    setShowVerifyModal(true);
  };

  const handleVerify = () => {
    if (!selectedReward || !mathQuestionData) return;

    let correct = 0;
    const { a, b, operation } = mathQuestionData;

    if (operation === '+') {
      correct = a + b;
    } else if (operation === '-') {
      correct = a - b;
    } else if (operation === '×') {
      correct = a * b;
    }

    const userAnswer = parseInt(mathAnswer);
    if (userAnswer === correct) {
      const success = storeService.spendMagnets(selectedReward.cost, `兑换奖励: ${selectedReward.title}`);

      if (success) {
        // 立即刷新用户状态，使用最新的 storeService.user
        setUser({ ...storeService.user });
        setShowVerifyModal(false);
        Taro.showToast({
          title: '兑换成功！',
          icon: 'success'
        });
      } else {
        Taro.showToast({
          title: '兑换失败，磁贴不足！',
          icon: 'none'
        });
      }
    } else {
      Taro.showToast({
        title: '答案错误！',
        icon: 'none'
      });
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'mini': return '#EC4899';
      case 'small': return '#8B5CF6';
      case 'bonus': return '#F59E0B';
      case 'dream': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView className='rewards-page' scrollY>
      {/* 可用磁贴展示 */}
      <View className='magnet-display'>
        <Text className='display-label'>可用磁贴</Text>
        <Text className='display-count'>{user.magnets} 🌟</Text>
      </View>

      {/* 奖励列表 */}
      <View className='rewards-grid'>
        {rewards.map(reward => (
          <View key={reward.id} className='reward-card'>
            <View
              className='reward-icon'
              style={{ borderColor: getCategoryColor(reward.category) }}
            >
              <Text className='icon-emoji'>{reward.icon}</Text>
            </View>
            <Text className='reward-title'>{reward.title}</Text>
            <Text className='reward-cost'>{reward.cost} 磁贴</Text>
            <Button
              className={`redeem-button ${user.magnets < reward.cost ? 'disabled' : ''}`}
              disabled={user.magnets < reward.cost}
              onClick={() => handleRedeem(reward)}
            >
              兑换
            </Button>
          </View>
        ))}
      </View>

      {/* 数学验证模态框 */}
      {showVerifyModal && selectedReward && (
        <View className='modal-overlay' onClick={() => setShowVerifyModal(false)}>
          <View className='modal-content' onClick={(e) => e.stopPropagation()}>
            <View className='modal-header'>
              <Text className='modal-title'>家长验证</Text>
              <Text className='modal-close' onClick={() => setShowVerifyModal(false)}>✕</Text>
            </View>

            <View className='modal-body'>
              <Text className='verify-label'>请回答以下问题：</Text>
              <Text className='math-question'>{mathQuestion}</Text>

              <View className='input-group'>
                <Input
                  className='math-input'
                  type='number'
                  value={mathAnswer}
                  onInput={(e) => setMathAnswer(e.detail.value)}
                  placeholder='输入答案'
                  placeholderClass='placeholder'
                />
              </View>

              <View className='reward-preview'>
                <Text className='preview-icon'>{selectedReward.icon}</Text>
                <Text className='preview-text'>
                  将消耗 {selectedReward.cost} 磁贴兑换 "{selectedReward.title}"
                </Text>
              </View>

              <Button className='verify-button' onClick={handleVerify}>
                确认兑换
              </Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
