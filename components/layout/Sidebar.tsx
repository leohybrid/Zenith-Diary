
import React from 'react';
import type { ViewType } from '../../types';
import { CalendarDays, CheckCircle, Trophy, BookHeart, Landmark, Settings, LogIn } from '../icons';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const navItems = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'completion', label: 'Completion', icon: CheckCircle },
  { id: 'highlights', label: 'Highlights', icon: Trophy },
  { id: 'journal', label: 'Journal', icon: BookHeart },
  { id: 'finance', label: 'Finances', icon: Landmark },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="flex flex-col justify-between w-16 md:w-64 bg-gray-900 border-r border-gray-700 p-2 md:p-4">
      <div>
        <div className="flex items-center gap-3 mb-8 p-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          <span className="hidden md:inline font-bold text-lg">Zenith</span>
        </div>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 mb-2 ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
         <div className="flex items-center gap-3 p-2 mb-4 border-t border-gray-700 pt-4">
          <img src="https://picsum.photos/100" alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="hidden md:inline">
            <p className="font-semibold">Alex Doe</p>
            <p className="text-xs text-gray-400">Pro Member</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white mb-2">
            <Settings className="w-6 h-6 flex-shrink-0"/>
            <span className="hidden md:inline">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white">
            <LogIn className="w-6 h-6 flex-shrink-0"/>
            <span className="hidden md:inline">Login</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
