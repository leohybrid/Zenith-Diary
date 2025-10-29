
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useAppContext } from '../../context/AppContext';
import { analyzeCompletion } from '../../services/geminiService';
import type { Task } from '../../types';
import { Sparkles } from '../icons';

const CompletionView: React.FC = () => {
  const { tasks, setTasks } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  const handleToggleCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleReasonChange = (id: string, reason: string) => {
      setTasks(tasks.map(task => task.id === id ? {...task, reasonUnachieved: reason} : task));
  };

  const handleGetInsight = async () => {
    setLoading(true);
    const insight = await analyzeCompletion(tasks);
    setAiInsight(insight);
    setLoading(false);
  };
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card title="Tasks Completed">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleCompletion(task.id)}
                          className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
                      </label>
                      <span className={`px-2 py-1 text-xs rounded-full ${task.completed ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {task.completed ? 'Completed' : 'Unachieved'}
                      </span>
                    </div>
                    {!task.completed && (
                        <div className="mt-2 pl-8">
                             <input type="text" placeholder="Reason (under 20 words)" value={task.reasonUnachieved || ''} onChange={(e) => handleReasonChange(task.id, e.target.value)} className="mt-1 text-sm block w-full bg-gray-800 border-gray-600 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                    )}
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-gray-400">No tasks on your agenda for today.</p>}
              </div>
            </Card>
        </div>
        <div className="space-y-6">
            <Card title="Daily Summary">
                <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-gray-700" strokeWidth="2" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-blue-500" strokeWidth="2" fill="none" strokeDasharray={`${completionRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-3xl font-bold">{completionRate}%</span>
                    </div>
                    <p className="mt-2 text-lg">Completion Rate</p>
                    <p className="text-sm text-gray-400">{completedCount} of {totalCount} tasks completed</p>
                </div>
            </Card>
            <Card title="AI Improvement Trends">
                <Button onClick={handleGetInsight} disabled={loading} className="w-full mb-4">
                    {loading ? <Spinner size="sm" /> : <Sparkles />}
                    Suggest Improvements
                </Button>
                {aiInsight && (
                    <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                        <p className="text-sm">{aiInsight}</p>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
};

export default CompletionView;
