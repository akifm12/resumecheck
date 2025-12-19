
import React from 'react';

interface Props {
  content: string;
  onBack: () => void;
}

const FullRewriteView: React.FC<Props> = ({ content, onBack }) => {
  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Optimized_Resume_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // index.html has @media print styles to hide everything except this document
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between no-print bg-white/60 p-4 rounded-2xl border border-slate-100 backdrop-blur-md sticky top-20 z-40">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors text-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Analysis
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handleDownloadTxt}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download TXT
          </button>
          <button 
            onClick={handlePrint}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Document "Paper" Layout */}
      <div className="bg-white shadow-2xl rounded-sm p-8 md:p-16 min-h-[1100px] border border-slate-100 flex flex-col items-center">
        <div className="w-full max-w-[800px]">
          <div className="prose prose-slate max-w-none">
            {/* Serif font for a professional document look */}
            <pre className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm md:text-base tracking-wide bg-transparent border-none p-0">
              {content}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2 no-print">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">AI Professional Resume Reconstruction</p>
        <p className="text-slate-400 text-xs">This document is encrypted and stored in your profile vault.</p>
      </div>
    </div>
  );
};

export default FullRewriteView;
