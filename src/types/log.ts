export type LogType = 'earn' | 'spend' | 'bonus' | 'mood' | 'penalty' | 'magnet-moment';

export interface Log {
  id: string;
  type: LogType;
  amount: number;
  description: string;
  timestamp: number;
}
