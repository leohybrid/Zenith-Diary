
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useAppContext } from '../../context/AppContext';
import { TaskType } from '../../types';
import type { Task } from '../../types';
import { PlusCircle, Trash2 } from '../icons';

const taskColors: Record<TaskType, string> = {
  [TaskType.Task]: 'bg-blue-500 border-blue-400',
  [TaskType.Meeting]: 'bg-purple-500 border-purple-400',
  [TaskType.Break]: 'bg-gray-500 border-gray-400',
};

const AgendaView: React.FC = () => {
  const { tasks, setTasks } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: TaskType.Task, time: '09:00', duration: 30 });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const taskToAdd: Task = { ...newTask, id: new Date().toISOString(), completed: false };
    setTasks([...tasks, taskToAdd].sort((a,b) => a.time.localeCompare(b.time)));
    setNewTask({ title: '', type: TaskType.Task, time: '09:00', duration: 30 });
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const totalMinutesInDay = 24 * 60;

  return (
    <div className="space-y-6">
      <Card title="Agenda">
        <div className="relative h-[720px] overflow-y-auto bg-gray-800 p-4 rounded-lg">
          {/* Timeline hours */}
          <div className="absolute top-0 left-0 w-12 h-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-[30px] text-xs text-gray-400 text-right pr-2 border-r border-gray-600">{`${i.toString().padStart(2, '0')}:00`}</div>
            ))}
          </div>
          {/* Tasks */}
          <div className="relative ml-12 h-full">
            {tasks.map((task) => {
              const [hours, minutes] = task.time.split(':').map(Number);
              const top = ((hours * 60 + minutes) / totalMinutesInDay) * 100;
              const height = (task.duration / totalMinutesInDay) * 100;

              return (
                <div
                  key={task.id}
                  className={`absolute w-full p-2 rounded-lg text-white text-xs ${taskColors[task.type]} flex justify-between items-start group`}
                  style={{ top: `${top}%`, height: `${Math.max(height, 2)}%` }}
                >
                  <div>
                    <p className="font-bold">{task.title}</p>
                    <p>{task.time} - {task.duration} min</p>
                  </div>
                   <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400">
                      <Trash2 size={16}/>
                   </button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full">
            <PlusCircle />
            Add New Item
          </Button>
        ) : (
          <form onSubmit={handleAddTask} className="space-y-4">
            <h3 className="font-bold">New Agenda Item</h3>
             <div>
                <label className="block text-sm font-medium text-gray-400">Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Type</label>
                    <select value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value as TaskType})} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        {Object.values(TaskType).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Time</label>
                    <input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Duration (min)</label>
                    <input type="number" value={newTask.duration} onChange={e => setNewTask({...newTask, duration: parseInt(e.target.value)})} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AgendaView;
