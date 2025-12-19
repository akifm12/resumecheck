
import React, { useState } from 'react';
import { StructuredResume } from '../types';

interface Props {
  resume: StructuredResume;
  onBack: () => void;
}

const FullRewriteView: React.FC<Props> = ({ resume, onBack }) => {
  const [accentColor, setAccentColor] = useState('#1e293b'); // Default Slate 800 for Professionalism

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let text = `${resume.header.name.toUpperCase()}\n`;
    text += `${resume.header.title}\n`;
    text += `${resume.header.email} | ${resume.header.phone} | ${resume.header.location}\n`;
    if (resume.header.linkedin) text += `LinkedIn: ${resume.header.linkedin}\n`;
    text += `\nSUMMARY\n${resume.summary}\n\n`;
    text += `PROFESSIONAL EXPERIENCE\n`;
    resume.experience.forEach(exp => {
      text += `\n${exp.company} | ${exp.location}\n`;
      text += `${exp.position} | ${exp.dateRange}\n`;
      exp.bullets.forEach(b => text += `• ${b}\n`);
    });
    text += `\nEDUCATION\n`;
    resume.education.forEach(edu => {
      text += `${edu.school} | ${edu.location}\n`;
      text += `${edu.degree} | ${edu.dateRange}\n`;
    });
    text += `\nSKILLS & EXPERTISE\n`;
    resume.skills.forEach(skill => {
      text += `${skill.category}: ${skill.items.join(', ')}\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.header.name.replace(/\s/g, '_')}_Pro_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 animate-in fade-in zoom-in-95 duration-700">
      {/* Designer Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between no-print bg-white/90 p-5 rounded-2xl border border-slate-200 backdrop-blur-xl sticky top-20 z-40 shadow-xl shadow-indigo-100/30 gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-all text-sm group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Audit
          </button>
          
          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Template Tone</span>
            <div className="flex space-x-1.5">
              {[
                { name: 'Executive', color: '#1e293b' },
                { name: 'Modern', color: '#4f46e5' },
                { name: 'Growth', color: '#059669' },
                { name: 'Creative', color: '#db2777' }
              ].map(theme => (
                <button
                  key={theme.name}
                  title={theme.name}
                  onClick={() => setAccentColor(theme.color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === theme.color ? 'border-white ring-2 ring-slate-300 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: theme.color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            onClick={handleDownloadTxt}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            Plain Text
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-black transition-all shadow-lg flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print Professional PDF
          </button>
        </div>
      </div>

      {/* The Designer Canvas (Standard Business Layout) */}
      <div className="bg-white shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] rounded-sm p-12 md:p-16 min-h-[1120px] border border-slate-100 flex flex-col items-center print:shadow-none print:border-none">
        <div className="w-full max-w-[760px] text-slate-900 font-serif leading-relaxed">
          
          {/* Header Section */}
          <header className="text-center mb-10 border-b pb-8" style={{ borderColor: `${accentColor}20` }}>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 font-sans uppercase">
              {resume.header.name}
            </h1>
            <p className="text-lg font-bold tracking-wider mb-4 font-sans uppercase" style={{ color: accentColor }}>
              {resume.header.title}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] text-slate-500 font-sans font-medium uppercase tracking-tight">
              <span>{resume.header.email}</span>
              <span className="opacity-30">•</span>
              <span>{resume.header.phone}</span>
              <span className="opacity-30">•</span>
              <span>{resume.header.location}</span>
              {resume.header.linkedin && (
                <>
                  <span className="opacity-30">•</span>
                  <span>LinkedIn: {resume.header.linkedin}</span>
                </>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-[11px] font-black tracking-[0.25em] uppercase mb-3 font-sans border-b-2 inline-block pb-0.5" style={{ borderColor: accentColor, color: accentColor }}>
              Professional Summary
            </h2>
            <p className="text-[14.5px] text-slate-700 leading-6">
              {resume.summary}
            </p>
          </section>

          {/* Experience Section */}
          <section className="mb-8">
            <h2 className="text-[11px] font-black tracking-[0.25em] uppercase mb-5 font-sans border-b-2 inline-block pb-0.5" style={{ borderColor: accentColor, color: accentColor }}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[16px] font-bold text-slate-900 font-sans">{exp.company}</h3>
                    <span className="text-[12px] font-bold text-slate-500 font-sans uppercase tracking-tighter">{exp.dateRange}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="text-[14px] font-bold italic text-slate-600 font-sans">{exp.position}</span>
                    <span className="text-[12px] font-medium text-slate-400 font-sans">{exp.location}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-[14px] text-slate-700 relative pl-4 leading-normal">
                        <span className="absolute left-0 top-[7px] w-1.5 h-1.5 border border-slate-300 rounded-full" style={{ backgroundColor: `${accentColor}10` }}></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Grid for Education and Skills */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-t pt-8" style={{ borderColor: `${accentColor}10` }}>
            <div className="md:col-span-2 space-y-8">
              {/* Education */}
              <section>
                <h2 className="text-[11px] font-black tracking-[0.25em] uppercase mb-4 font-sans border-b-2 inline-block pb-0.5" style={{ borderColor: accentColor, color: accentColor }}>
                  Education
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-[14px] font-bold text-slate-900 font-sans leading-tight">{edu.degree}</h3>
                      <p className="text-[13px] text-slate-600 font-sans mt-0.5">{edu.school}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase font-sans mt-0.5">{edu.dateRange}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="md:col-span-3">
              {/* Skills */}
              <section>
                <h2 className="text-[11px] font-black tracking-[0.25em] uppercase mb-4 font-sans border-b-2 inline-block pb-0.5" style={{ borderColor: accentColor, color: accentColor }}>
                  Core Competencies
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {resume.skills.map((skill, idx) => (
                    <div key={idx} className="flex flex-col">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-sans">{skill.category}</h3>
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {skill.items.map((item, iIdx) => (
                          <span key={iIdx} className="text-[13.5px] text-slate-700 font-medium">
                            {item}{iIdx < skill.items.length - 1 ? ' • ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center no-print">
         <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Certified AI Designer Draft</p>
         <p className="text-slate-300 text-[10px] mt-1 italic italic">Optimized for high-end printers and ATS compatibility.</p>
      </div>
    </div>
  );
};

export default FullRewriteView;
