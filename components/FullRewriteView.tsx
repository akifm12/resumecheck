
import React, { useState } from 'react';
import { StructuredResume } from '../types';

interface Props {
  resume: StructuredResume;
  onBack: () => void;
}

const FullRewriteView: React.FC<Props> = ({ resume, onBack }) => {
  const [accentColor, setAccentColor] = useState('#4f46e5'); // Default Indigo

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let text = `${resume.header.name}\n${resume.header.title}\n${resume.header.email} | ${resume.header.phone} | ${resume.header.location}\n\n`;
    text += `SUMMARY\n${resume.summary}\n\n`;
    text += `EXPERIENCE\n`;
    resume.experience.forEach(exp => {
      text += `${exp.position} | ${exp.company}\n${exp.dateRange} | ${exp.location}\n`;
      exp.bullets.forEach(b => text += `- ${b}\n`);
      text += `\n`;
    });
    text += `EDUCATION\n`;
    resume.education.forEach(edu => {
      text += `${edu.degree}\n${edu.school} | ${edu.dateRange}\n\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.header.name.replace(/\s/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 animate-in fade-in zoom-in-95 duration-700">
      {/* Designer Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between no-print bg-white/80 p-6 rounded-3xl border border-slate-200 backdrop-blur-xl sticky top-20 z-40 shadow-2xl shadow-indigo-100/50 gap-4">
        <div className="flex items-center space-x-6">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-all text-sm group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Edit Analysis
          </button>
          
          <div className="h-8 w-px bg-slate-200"></div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accent</span>
            <div className="flex space-x-2">
              {['#4f46e5', '#0f172a', '#10b981', '#ef4444'].map(color => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === color ? 'border-white ring-2 ring-slate-300 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadTxt}
            className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
          >
            Export Text
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl shadow-slate-300 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Download Designer PDF
          </button>
        </div>
      </div>

      {/* The Designer Canvas (A4 Aspect) */}
      <div className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-sm p-12 md:p-20 min-h-[1100px] border border-slate-100 flex flex-col items-center">
        <div className="w-full max-w-[800px] text-slate-900 font-serif">
          
          {/* Header */}
          <header className="mb-12 border-b-2 pb-8" style={{ borderColor: accentColor }}>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2 font-sans uppercase">
              {resume.header.name}
            </h1>
            <p className="text-xl font-medium tracking-wide mb-6 font-sans" style={{ color: accentColor }}>
              {resume.header.title}
            </p>
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-[13px] text-slate-500 font-sans font-medium uppercase tracking-wider">
              <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> {resume.header.email}</span>
              <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg> {resume.header.phone}</span>
              <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg> {resume.header.location}</span>
              {resume.header.linkedin && <span className="flex items-center">LinkedIn: {resume.header.linkedin}</span>}
            </div>
          </header>

          {/* Summary */}
          <section className="mb-10">
            <h2 className="text-[12px] font-black tracking-[0.3em] uppercase mb-4 font-sans flex items-center" style={{ color: accentColor }}>
              Professional Summary
            </h2>
            <p className="text-[15px] leading-[1.7] text-slate-700 italic">
              {resume.summary}
            </p>
          </section>

          {/* Experience */}
          <section className="mb-10">
            <h2 className="text-[12px] font-black tracking-[0.3em] uppercase mb-6 font-sans" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-8">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[17px] font-bold text-slate-900 font-sans">{exp.position}</h3>
                    <span className="text-[13px] font-medium text-slate-400 font-sans uppercase tracking-wider">{exp.dateRange}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[15px] font-semibold text-slate-600 italic">{exp.company}</span>
                    <span className="text-[13px] font-medium text-slate-400 font-sans">{exp.location}</span>
                  </div>
                  <ul className="space-y-3">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-[14.5px] leading-[1.6] text-slate-700 relative pl-5">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: accentColor }}></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-12">
            {/* Education */}
            <section>
              <h2 className="text-[12px] font-black tracking-[0.3em] uppercase mb-6 font-sans" style={{ color: accentColor }}>
                Education
              </h2>
              <div className="space-y-6">
                {resume.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="text-[15px] font-bold text-slate-900 font-sans mb-1">{edu.degree}</h3>
                    <p className="text-[14px] text-slate-600 mb-1">{edu.school}</p>
                    <p className="text-[12px] font-medium text-slate-400 uppercase font-sans">{edu.dateRange}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-[12px] font-black tracking-[0.3em] uppercase mb-6 font-sans" style={{ color: accentColor }}>
                Expertise
              </h2>
              <div className="space-y-5">
                {resume.skills.map((skill, idx) => (
                  <div key={idx}>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 font-sans">{skill.category}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {skill.items.map((item, iIdx) => (
                        <span key={iIdx} className="text-[14px] text-slate-700 font-medium">
                          {item}{iIdx < skill.items.length - 1 ? ',' : ''}
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
      
      <div className="text-center no-print">
         <p className="text-slate-400 text-sm font-medium">✨ Designer Preview Mode Active</p>
         <p className="text-slate-300 text-xs mt-1 italic">Optimized for high-end printers and professional ATS readers.</p>
      </div>
    </div>
  );
};

export default FullRewriteView;
