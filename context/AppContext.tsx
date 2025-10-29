
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task, Achievement, JournalEntry, Transaction, Mood } from '../types';
import { TaskType, TransactionType, FinanceCategory } from '../types';

interface AppContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  journal: JournalEntry;
  setJournal: (journal: JournalEntry) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialTasks: Task[] = [
    { id: '1', title: 'Daily Standup', type: TaskType.Meeting, time: '09:00', duration: 15, completed: false },
    { id: '2', title: 'Code Review Session', type: TaskType.Task, time: '11:00', duration: 60, completed: false },
    { id: '3', title: 'Lunch Break', type: TaskType.Break, time: '12:30', duration: 45, completed: false },
];

const initialAchievements: Achievement[] = [
    { id: '1', text: '' },
    { id: '2', text: '' },
    { id: '3', text: '' },
];

const initialJournal: JournalEntry = {
    mood: 'neutral',
    moodReason: '',
    notes: '',
};

const initialTransactions: Transaction[] = [
    {id: '1', type: TransactionType.Expense, category: FinanceCategory.Food, amount: 15, date: new Date().toISOString().split('T')[0], description: 'Lunch'},
    {id: '2', type: TransactionType.Income, category: FinanceCategory.Freelance, amount: 250, date: new Date().toISOString().split('T')[0], description: 'Side project payment'},
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('zenith_tasks', initialTasks);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('zenith_achievements', initialAchievements);
  const [journal, setJournal] = useLocalStorage<JournalEntry>('zenith_journal', initialJournal);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('zenith_transactions', initialTransactions);

  return (
    <AppContext.Provider value={{ tasks, setTasks, achievements, setAchievements, journal, setJournal, transactions, setTransactions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
