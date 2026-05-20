import React from 'react';
import { Home, PenSquare, Eye } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
}

export function BottomNav({ currentScreen, setScreen }: BottomNavProps) {
  const navItems: { id: ScreenType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'Edit', icon: PenSquare },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  return (
    <nav className="glass border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] z-40 print:hidden shrink-0">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
