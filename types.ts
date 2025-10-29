
export type ViewType = 'agenda' | 'completion' | 'highlights' | 'journal' | 'finance';

export enum TaskType {
  Task = 'task',
  Meeting = 'meeting',
  Break = 'break',
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  time: string; // HH:mm format
  duration: number; // in minutes
  completed: boolean;
  reasonUnachieved?: string;
}

export interface Achievement {
  id: string;
  text: string;
}

export type Mood = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'awful';

export interface JournalEntry {
  mood: Mood;
  moodReason: string;
  notes: string;
}

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export enum FinanceCategory {
  Transport = 'Transport',
  Food = 'Food',
  Subscriptions = 'Subscriptions',
  Salary = 'Salary',
  Freelance = 'Freelance',
  Other = 'Other'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: FinanceCategory;
  amount: number;
  date: string;
  description: string;
}
