export interface Reward {
  id: string;
  title: string;
  icon: string;
  cost: number;
  description: string;
  category: 'mini' | 'small' | 'bonus' | 'dream';
}

export type RewardCategory = 'mini' | 'small' | 'bonus' | 'dream';
