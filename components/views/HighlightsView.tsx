
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useAppContext } from '../../context/AppContext';
import { analyzeMomentum } from '../../services/geminiService';
import { Sparkles } from '../icons';
import type { Achievement } from '../../types';


const HighlightsView: React.FC = () => {
    const { achievements, setAchievements } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState('');

    const handleAchievementChange = (id: string, text: string) => {
        setAchievements(achievements.map(a => a.id === id ? {...a, text} : a));
    };

    const handleGetInsight = async () => {
        setLoading(true);
        const insight = await analyzeMomentum(achievements);
        setAiInsight(insight);
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Today's Highlights">
                <div className="space-y-4">
                    {achievements.map((ach, index) => (
                         <div key={ach.id}>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Achievement {index + 1}</label>
                            <textarea
                                value={ach.text}
                                onChange={(e) => handleAchievementChange(ach.id, e.target.value)}
                                placeholder="What went well today?"
                                rows={3}
                                className="w-full bg-gray-700 border-gray-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="AI Insight">
                <div className="flex flex-col h-full">
                    <p className="text-sm text-gray-400 mb-4">Get an AI-powered summary of your progress and momentum.</p>
                    <div className="flex-grow flex items-center justify-center bg-gray-700/50 p-4 rounded-lg mb-4 min-h-[150px]">
                        {loading ? <Spinner /> : <p className="text-center italic">{aiInsight || 'Your insight will appear here.'}</p>}
                    </div>
                    <Button onClick={handleGetInsight} disabled={loading} className="w-full">
                        {loading ? <Spinner size="sm" /> : <Sparkles />}
                        Analyze Momentum
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default HighlightsView;
