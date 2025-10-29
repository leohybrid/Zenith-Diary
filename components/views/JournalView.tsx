
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useAppContext } from '../../context/AppContext';
import { summarizeJournal } from '../../services/geminiService';
import type { Mood } from '../../types';
import { Sparkles } from '../icons';

const moodOptions: { value: Mood; emoji: string; color: string }[] = [
  { value: 'awful', emoji: '😞', color: 'text-red-400' },
  { value: 'sad', emoji: '😐', color: 'text-yellow-400' },
  { value: 'neutral', emoji: '😊', color: 'text-green-400' },
  { value: 'happy', emoji: '😄', color: 'text-teal-400' },
  { value: 'ecstatic', emoji: '🤩', color: 'text-purple-400' },
];

const moodMap: Record<Mood, number> = {
    awful: 0,
    sad: 1,
    neutral: 2,
    happy: 3,
    ecstatic: 4,
}

const JournalView: React.FC = () => {
    const { journal, setJournal } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState('');

    const handleMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedMood = moodOptions[parseInt(e.target.value)];
        setJournal({ ...journal, mood: selectedMood.value });
    };
    
    const handleGetReflection = async () => {
        setLoading(true);
        const summary = await summarizeJournal(journal);
        setAiInsight(summary);
        setLoading(false);
    };
    
    const currentMood = moodOptions[moodMap[journal.mood]];
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <Card title="Personal Journal">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">How did you feel today?</label>
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`text-4xl ${currentMood.color}`}>{currentMood.emoji}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={moodMap[journal.mood]}
                                    onChange={handleMoodChange}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <input
                                type="text"
                                value={journal.moodReason}
                                onChange={(e) => setJournal({...journal, moodReason: e.target.value})}
                                placeholder="Why did you feel this way?"
                                className="mt-4 w-full bg-gray-700 border-gray-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Free Notes</label>
                            <textarea
                                value={journal.notes}
                                onChange={(e) => setJournal({...journal, notes: e.target.value})}
                                placeholder="Write down your thoughts, reflections, or anything on your mind..."
                                rows={10}
                                className="mt-2 w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="AI Reflection Summary">
                    <div className="flex flex-col h-full">
                         <p className="text-sm text-gray-400 mb-4">Let AI provide a thoughtful summary of your journal entry.</p>
                         <div className="flex-grow flex items-center justify-center bg-gray-700/50 p-4 rounded-lg mb-4 min-h-[150px]">
                            {loading ? <Spinner /> : <p className="text-center italic">{aiInsight || 'Your reflection will appear here.'}</p>}
                         </div>
                        <Button onClick={handleGetReflection} disabled={loading} className="w-full">
                            {loading ? <Spinner size="sm" /> : <Sparkles />}
                            Generate Reflection
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default JournalView;
