export interface Task {
  id: string;
  title: string;
  icon: string;
  magnetReward: number;
  completed: boolean;
  lastCompletedDate: string;
}

export type TaskStatus = 'pending' | 'completed';
