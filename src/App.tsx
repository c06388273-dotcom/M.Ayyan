import React, { useState, useEffect } from 'react';
import { ScreenType, ResumeData } from './types';
import { initialDbData, emptyResumeData } from './data';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { BuilderScreen } from './components/screens/BuilderScreen';
import { PreviewScreen } from './components/screens/PreviewScreen';
import { AnimatePresence, motion } from 'motion/react';
import { Info } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeDraft');
    return saved ? JSON.parse(saved) : initialDbData;
  });

  const [toast, setToast] = useState<{message: string; type: string} | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('resumeDraft', JSON.stringify(resumeData));
  }, [resumeData]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'builder' && currentScreen === 'home') {
      // In a real app we might load empty draft, but we'll stick to initial data
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Setup Gemini SDK for AI Bio Generation
  const handleAIGenerate = async (context: string) => {
    try {
      // Call our secure backend proxy route instead of exposing Gemini SDK directly
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate bio');
      }
      
      const resData = await response.json();
      showToast('Bio generated successfully', 'success');
      return resData.bio;
      
    } catch (error) {
      console.error('Error generating AI bio:', error);
      showToast('API generation failed', 'error');
      return '';
    }
  };

  return (
    <div className="min-h-[100dvh] sm:h-screen sm:min-h-screen flex items-center justify-center bg-slate-200 dark:bg-slate-950 p-0 sm:p-4 transition-colors duration-300">
      <div id="app-container" className="w-full h-full sm:h-[90vh] sm:max-w-md sm:rounded-[30px] sm:border-8 border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden sm:shadow-2xl">
        <div className="print:hidden">
           <TopBar theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Toast Notification Container */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`absolute top-20 left-1/2 z-50 px-4 py-2.5 rounded-full shadow-lg glass flex items-center gap-2 ${
                toast.type === 'error' ? 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/90' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              <Info size={16} />
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <main id="main-content" className="flex-1 w-full overflow-y-auto relative bg-slate-50 dark:bg-slate-900 pt-4 scroll-smooth">
          <AnimatePresence mode="wait">
            {currentScreen === 'home' && (
              <motion.div key="home">
                 <HomeScreen navigateTo={handleNavigate} hasDraft={true} />
              </motion.div>
            )}
            {currentScreen === 'builder' && (
               <motion.div key="builder">
                 <BuilderScreen data={resumeData} updateData={setResumeData} onGenerateAI={handleAIGenerate} />
               </motion.div>
            )}
            {currentScreen === 'preview' && (
               <motion.div key="preview" className="h-full">
                 <PreviewScreen data={resumeData} updateData={setResumeData} />
               </motion.div>
            )}
          </AnimatePresence>
        </main>

        <BottomNav currentScreen={currentScreen} setScreen={handleNavigate} />
      </div>
    </div>
  );
}

