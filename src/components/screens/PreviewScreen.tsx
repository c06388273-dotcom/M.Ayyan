import React, { useState } from 'react';
import { ResumeData } from '../../types';
import { Download, Share2, Printer } from 'lucide-react';
import { ModernTemplate } from '../resume-templates/ModernTemplate';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface PreviewScreenProps {
  data: ResumeData;
  updateData: (data: ResumeData) => void;
}

export function PreviewScreen({ data, updateData }: PreviewScreenProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    
    // Wait for React to re-render without scale
    setTimeout(() => {
      const element = document.getElementById('resume-preview-board');
      if (!element) {
        setIsGeneratingPDF(false);
        return;
      }

      // Hack for html2canvas oklch bug in tailwind v4
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function(el, pseudoElt) {
        const compStyle = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(compStyle, {
          get(target, prop) {
            const val = target[prop as keyof CSSStyleDeclaration];
            if (typeof val === 'function') {
              return val.bind(target);
            }
            if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
              // Return transparent for any unsupported color when generating PDF
              return 'rgba(0,0,0,0)'; 
            }
            return val;
          }
        }) as CSSStyleDeclaration;
      };

      const opt: any = {
          margin:       0.4,
          filename:     `${data.personalInfo.fullName || 'My'}_Resume.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', windowWidth: 800 },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak:    { mode: ['css', 'legacy'], avoid: ['.legacy-page-break-avoid', 'h1', 'h2', 'h3', 'p', 'li'] }
      };

      html2pdf().set(opt).from(element).save().then(() => {
          setIsGeneratingPDF(false);
          window.getComputedStyle = originalGetComputedStyle;
      }).catch((err: any) => {
          console.error(err);
          setIsGeneratingPDF(false);
          window.getComputedStyle = originalGetComputedStyle;
      });
    }, 150);
  };

  const currentThemeColor = data.settings?.themeColor || '#4F46E5';

  return (
    <div className="w-full p-4 pb-24 flex flex-col gap-4 relative">
      
      {/* Preview Actions Bar */}
      <div className="glass px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-slate-700/50 shadow-sm print:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        
        {/* Color Picker */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Accent:</span>
          <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input 
              type="color" 
              value={currentThemeColor} 
              onChange={(e) => updateData({ ...data, settings: { ...data.settings, themeColor: e.target.value }})}
              className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-none p-0 outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold rounded-lg transition-colors"
            title="Browser Print"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors active:scale-95 disabled:opacity-50"
          >
            <Download size={16} className={isGeneratingPDF ? "animate-bounce" : ""} />
            {isGeneratingPDF ? 'Generating...' : 'PDF'}
          </button>
          <button 
            onClick={() => alert("Shareable link copied to clipboard! (Mock)")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors active:scale-95"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className={`flex-1 min-h-[500px] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 flex justify-center p-2 shadow-inner ${isGeneratingPDF ? 'opacity-50 pointer-events-none' : ''}`}>
        <div 
          className={`origin-top bg-white shrink-0 transition-transform duration-200 w-[210mm] min-h-[297mm] p-[40px] print:p-0 ${isGeneratingPDF ? 'scale-100 shadow-none' : 'scale-[0.4] sm:scale-[0.5] md:scale-[0.6] shadow-2xl print:scale-100 print:m-0'}`}
          style={{ marginBottom: isGeneratingPDF ? '0' : '-60%' }}
        >
          <div id="resume-preview-board">
            <ModernTemplate data={data} themeColor={currentThemeColor} />
          </div>
        </div>
      </div>

    </div>
  );
}
