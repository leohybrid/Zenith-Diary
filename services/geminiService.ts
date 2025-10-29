
import { GoogleGenAI } from '@google/genai';
import type { Task, Achievement, JournalEntry, Transaction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateText = async (prompt: string) => {
  if (!API_KEY) {
    return "API Key not configured. Please set up your API key to use AI features.";
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "There was an error communicating with the AI. Please check the console for details.";
  }
};

export const analyzeCompletion = async (tasks: Task[]): Promise<string> => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const unachievedTasks = tasks.filter(t => !t.completed && t.reasonUnachieved);

  const prompt = `
    Analyze my daily task completion. I completed ${completedTasks} out of ${totalTasks} tasks.
    Here are the tasks I didn't complete and my reasons:
    ${unachievedTasks.map(t => `- ${t.title}: ${t.reasonUnachieved}`).join('\n')}

    Based on this, provide one concise, actionable suggestion for improvement (e.g., "You often miss tasks after 6pm — consider lighter evenings.").
  `;
  return generateText(prompt);
};

export const analyzeMomentum = async (achievements: Achievement[]): Promise<string> => {
  const filledAchievements = achievements.filter(a => a.text.trim() !== '');
  if (filledAchievements.length === 0) {
    return "Log some achievements to get momentum insights.";
  }
  const prompt = `
    Analyze my daily achievements. Today's highlights are:
    ${filledAchievements.map(a => `- ${a.text}`).join('\n')}

    Provide a short, encouraging insight about my momentum, like "You accomplished ${filledAchievements.length} goals today. Your momentum is building!".
  `;
  return generateText(prompt);
};

export const summarizeJournal = async (journal: JournalEntry): Promise<string> => {
  if (!journal.notes.trim()) {
    return "Write some notes in your journal to get a reflection summary.";
  }
  const prompt = `
    Analyze my journal entry. Today I felt ${journal.mood} because "${journal.moodReason}".
    My notes are: "${journal.notes}"

    Provide a concise, thoughtful reflection summary. If you see a recurring theme like stress, gently point it out and offer a helpful suggestion, like "Your entries this week show recurring stress around deadlines. Would you like to schedule focus sessions?".
  `;
  return generateText(prompt);
};

export const analyzeSpending = async (transactions: Transaction[]): Promise<string> => {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  if (transactions.length < 2) {
    return "Log more transactions for detailed spending insights.";
  }

  const prompt = `
    Analyze my daily finances. Total income: $${income.toFixed(2)}. Total expenses: $${expenses.toFixed(2)}.
    Here is a list of my expenses today:
    ${transactions.filter(t => t.type === 'expense').map(t => `- ${t.category}: $${t.amount.toFixed(2)} for ${t.description}`).join('\n')}

    Provide a brief, helpful spending insight, like "You've spent 32% less than last week on food." or "Your subscription costs are a significant part of your daily spending."
  `;
  return generateText(prompt);
};
