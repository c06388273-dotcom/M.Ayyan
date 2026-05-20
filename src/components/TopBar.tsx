import React from 'react';
import { Moon, Sun, FileSignature } from 'lucide-react';
import { motion } from 'motion/react';

interface TopBarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function TopBar({ theme, toggleTheme }: TopBarProps) {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass w-full px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-2 text-primary font-display font-bold text-xl">
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
          <FileSignature size={20} />
        </div>
        <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">ResumeAI</span>
      </div>
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
      </button>
    </motion.header>
  );
}
