
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
    // The index.html has @media print styles to hide UI and show only this document
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in zoom-in-95 duration-500">
      {/* Floating Control Bar */}
      <div className="flex items-center justify-between no-print bg-white/70 p-4 rounded-3xl border border-slate-200 backdrop-blur-xl sticky top-20 z-40 shadow-xl shadow-slate-200/50">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-all text-sm group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Analysis
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handleDownloadTxt}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Text File (.txt)
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* The Document Canvas */}
      <div className="bg-white shadow-2xl rounded-sm p-12 md:p-20 min-h-[1100px] border border-slate-100 flex flex-col items-center">
        <div className="w-full max-w-[750px] resume-document">
          <div className="prose prose-slate max-w-none">
            {/* Serif font used for the actual resume content to look realistic */}
            <pre className="whitespace-pre-wrap font-serif text-slate-900 leading-[1.6] text-sm md:text-[15px] tracking-normal bg-transparent border-none p-0 selection:bg-indigo-100">
              {content}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3 no-print">
        <div className="inline-flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L9.03 1.2a1 1 0 01.938 0l6.865 3.7A1 1 0 0117.34 5.92v6.6a1 1 0 01-.507.869l-6.865 3.7a1 1 0 01-.937 0l-6.865-3.7A1 1 0 011.66 12.52V5.92a1 1 0 01.507-.9zM9 4.384v10.153l5.833-3.141V5.417L9 4.384z" clipRule="evenodd"></path></svg>
          <span>Saved to Profile Vault</span>
        </div>
        <p className="text-slate-400 text-xs">Your data is encrypted and stored locally in this browser session.</p>
      </div>
    </div>
  );
};

export default FullRewriteView;
