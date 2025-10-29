
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import AgendaView from './components/views/AgendaView';
import CompletionView from './components/views/CompletionView';
import HighlightsView from './components/views/HighlightsView';
import JournalView from './components/views/JournalView';
import FinanceView from './components/views/FinanceView';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('agenda');

  const renderView = () => {
    switch (activeView) {
      case 'agenda':
        return <AgendaView />;
      case 'completion':
        return <CompletionView />;
      case 'highlights':
        return <HighlightsView />;
      case 'journal':
        return <JournalView />;
      case 'finance':
        return <FinanceView />;
      default:
        return <AgendaView />;
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col overflow-y-auto">
         <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">Zenith Diary</h1>
            <p className="text-sm text-gray-400">{today}</p>
        </header>
        <div className="p-4 md:p-8 flex-1">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
