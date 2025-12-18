
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6 pt-12">
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
        Stop Guessing. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Upgrade Your Resume.</span>
      </h1>
      <p className="text-xl text-slate-600 font-light leading-relaxed">
        Our AI-powered Health Check analyzes your impact, keywords, and formatting to give you a realistic edge in the job market.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
        <span className="flex items-center"><svg className="w-5 h-5 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> 100% Realistic Feedback</span>
        <span className="flex items-center"><svg className="w-5 h-5 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Impact Metrics Scan</span>
        <span className="flex items-center"><svg className="w-5 h-5 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Free Section Review</span>
      </div>
    </div>
  );
};

export default Hero;
