
import React from 'react';
import { ResumeAnalysis, Plan } from '../types';
import ScoreCard from './ScoreCard';

interface Props {
  analysis: ResumeAnalysis;
  plan: Plan;
  onUpgrade: () => void;
  onFullRewrite: () => void;
}

const Results: React.FC<Props> = ({ analysis, plan, onUpgrade, onFullRewrite }) => {
  const isLocked = plan === Plan.FREE;
  const isSuperPremium = plan === Plan.SUPER_PREMIUM;
  const canRewrite = plan === Plan.UNLIMITED || plan === Plan.SUPER_PREMIUM;

  const handleDownloadTxt = () => {
    let report = `RESUME GENIUS AI - HEALTH CHECK REPORT\n`;
    report += `==========================================\n\n`;
    report += `OVERALL SCORE: ${analysis.overallScore}%\n`;
    report += `IMPACT METRICS: ${analysis.impactMetricsScore}%\n\n`;
    report += `EXECUTIVE SUMMARY:\n${analysis.summary}\n\n`;
    report += `CRITICAL KEYWORD GAPS:\n${analysis.keywordsMissing.join(', ')}\n\n`;
    report += `SECTION BREAKDOWN:\n`;
    report += `------------------\n`;

    analysis.sections.forEach((section, idx) => {
      const locked = isLocked && !section.isFree;
      report += `\n[${idx + 1}] ${section.title.toUpperCase()}\n`;
      report += `Score: ${section.score}%\n`;
      
      if (locked) {
        report += `Feedback: [LOCKED - Upgrade to Professional to view]\n`;
        report += `Suggested Rewrite: [LOCKED - Upgrade to Professional to view]\n`;
      } else {
        report += `Feedback: ${section.feedback}\n`;
        report += `Optimized Text: ${section.suggestedRewrite}\n`;
      }
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Super Premium Banner */}
      {isSuperPremium && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-amber-100 no-print">
          <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center shrink-0">
             <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-amber-900">Executive Concierge Active</h2>
            <p className="text-amber-700 font-medium">Our expert human writers are now manually rewriting your entire resume. You will receive the final bespoke version in your inbox within 24 hours.</p>
          </div>
          <div className="ml-auto bg-amber-200/50 px-4 py-2 rounded-xl text-amber-800 font-bold text-sm">EST. 22:45 LEFT</div>
        </div>
      )}

      {/* Executive Overview */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Executive Health Summary</h2>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 no-print">
            <button 
              onClick={handleDownloadTxt}
              className="flex items-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download TXT
            </button>
            <button 
              onClick={handlePrintPdf}
              className="flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-100 transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Save as PDF
            </button>
          </div>
        </div>
        
        <p className="text-slate-600 leading-relaxed text-lg">
          {analysis.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard label="Overall Health" score={analysis.overallScore} color="indigo" />
        <ScoreCard label="Impact Metrics" score={analysis.impactMetricsScore} color="emerald" />
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
            Critical Keyword Gaps
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywordsMissing.map((kw, idx) => (
              <span key={idx} className="bg-slate-50 text-slate-700 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FULL REWRITE CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2.5rem] p-12 text-center text-white shadow-2xl relative overflow-hidden no-print">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 space-y-6">
          <div className="inline-block bg-indigo-500/20 px-4 py-1 rounded-full text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
            Premium Mode
          </div>
          <h2 className="text-4xl font-black">Ready for the Full Upgrade?</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Our AI can now completely rewrite your entire resume into a professional, high-impact document optimized for your target job. 
          </p>
          <button 
            onClick={onFullRewrite}
            className="inline-flex items-center px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10"
          >
            {canRewrite ? (
              <>
                <svg className="w-6 h-6 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                Generate Full Rewrite
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                Unlock Power Rewrite ($29)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-slate-800 text-center pt-8">Deep-Dive Analysis</h2>
        {analysis.sections.map((section, idx) => {
          const locked = isLocked && !section.isFree;
          
          return (
            <div key={idx} className="relative group page-break-inside-avoid">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 px-4">
                <div className="flex items-center space-x-3 mb-2 md:mb-0">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {section.title}
                  </h3>
                  {section.isFree && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-emerald-200 no-print">
                      Free Preview
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-50">
                  <span className="text-sm font-medium text-slate-400">Section Score</span>
                  <span className={`text-xl font-black ${section.score > 80 ? 'text-emerald-500' : section.score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                    {section.score}%
                  </span>
                </div>
              </div>

              {locked ? (
                <div className="relative overflow-hidden rounded-3xl bg-white p-12 border-2 border-dashed border-slate-200 text-center no-print">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">Analysis Locked</h4>
                    <p className="text-slate-500">Upgrade to "Professional" to see the realistic feedback and high-impact rewrites for your {section.title}.</p>
                    <button 
                      onClick={onUpgrade}
                      className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Unlock All Sections
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Feedback Column */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">The Real Problem</h4>
                      <p className="text-slate-700 leading-relaxed">
                        {section.feedback}
                      </p>
                    </div>
                  </div>

                  {/* Rewrite Column */}
                  <div className="lg:col-span-3">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 p-4 opacity-10 no-print">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                      </div>
                      <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse no-print"></span>
                        AI Recommended Impact Rewrite
                      </h4>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-xl font-medium leading-relaxed text-indigo-50">
                          {section.suggestedRewrite}
                        </p>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(section.suggestedRewrite)}
                        className="mt-8 flex items-center text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all active:scale-95 no-print"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        Copy Optimized Text
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isLocked && (
        <div className="sticky bottom-8 left-0 right-0 px-4 flex justify-center z-40 no-print">
          <div className="bg-indigo-600 rounded-3xl p-1 shadow-2xl shadow-indigo-200 max-w-2xl w-full">
            <div className="bg-white rounded-[calc(1.5rem-2px)] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-800">You've only seen the tip of the iceberg.</p>
                <p className="text-sm text-slate-500">Unlock the full {analysis.sections.length} section analysis.</p>
              </div>
              <button 
                onClick={onUpgrade}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all whitespace-nowrap"
              >
                Upgrade to Professional
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
