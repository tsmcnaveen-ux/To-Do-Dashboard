export type TaskCategory = 'PER' | 'BIZ' | 'POL';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  time: string;
  whom: string;
  created_at: string;
  category: TaskCategory;
}