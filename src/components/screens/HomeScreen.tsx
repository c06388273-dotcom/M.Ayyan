import React from 'react';
import { Plus, FileText, Clock, PenLine } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '../../types';

interface HomeScreenProps {
  navigateTo: (screen: ScreenType) => void;
  hasDraft?: boolean;
}

export function HomeScreen({ navigateTo, hasDraft = true }: HomeScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-4xl mx-auto w-full pb-24"
    >
      <div className="glass-card p-8 text-center space-y-6 mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-3">
            Create Your Premium Resume
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            AI-powered, ATS-friendly, and beautifully designed to get you hired faster.
          </p>
          <button 
            onClick={() => navigateTo('builder')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} />
            Build New Resume
          </button>
        </div>
      </div>

      {hasDraft && (
        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock size={20} className="text-indigo-500" />
            Recent Draft
          </h2>
          
          <button 
            onClick={() => navigateTo('builder')}
            className="w-full text-left glass-card p-4 sm:p-5 flex items-center justify-between group hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-lg text-indigo-600 dark:text-indigo-400">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  My Resume <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">Draft</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last edited recently</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <PenLine size={18} />
            </div>
          </button>
        </div>
      )}
    </motion.div>
  );
}
