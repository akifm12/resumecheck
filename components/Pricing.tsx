
import React from 'react';
import { Plan } from '../types';

interface Props {
  currentPlan: Plan;
  onSelect: (plan: Plan) => void;
}

const Pricing: React.FC<Props> = ({ currentPlan, onSelect }) => {
  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Invest in Your Future</h2>
        <p className="text-xl text-slate-500">Tailored solutions for every stage of your career journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Free Check</h3>
            <p className="text-slate-500 text-xs">Essential status check.</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-black text-slate-900">$0</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8 flex-grow text-xs font-medium">
            <li className="flex items-center text-slate-600"><CheckIcon /> AI health score</li>
            <li className="flex items-center text-slate-600"><CheckIcon /> 1 free section rewrite</li>
            <li className="flex items-center text-slate-400 line-through"><XIcon /> Full analysis</li>
          </ul>
          <button disabled className="w-full py-3 rounded-2xl font-bold bg-slate-100 text-slate-400">Current Plan</button>
        </div>

        {/* Basic Plan */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col transition-all hover:shadow-lg">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Professional</h3>
            <p className="text-slate-500 text-xs">Complete one-time overhaul.</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-black text-slate-900">$15</span>
              <span className="ml-2 text-slate-400 text-xs font-bold uppercase tracking-widest">one-off</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8 flex-grow text-xs font-medium">
            <li className="flex items-center text-slate-600"><CheckIcon /> All section rewrites</li>
            <li className="flex items-center text-slate-600"><CheckIcon /> Keyword gap analysis</li>
            <li className="flex items-center text-slate-600"><CheckIcon /> PDF Export</li>
          </ul>
          <button 
            onClick={() => onSelect(Plan.BASIC)}
            className="w-full py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Upgrade Now
          </button>
        </div>

        {/* Unlimited Plan */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-emerald-500 flex flex-col transition-all relative scale-105 z-10">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">Best Value</div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Power User</h3>
            <p className="text-slate-500 text-xs">Unlimited variants for job hunting.</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-black text-slate-900">$29</span>
              <span className="ml-2 text-slate-400 text-xs font-bold uppercase tracking-widest">/ month</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8 flex-grow text-xs font-medium">
            <li className="flex items-center text-slate-600"><CheckIcon /> Everything in Professional</li>
            <li className="flex items-center text-slate-600"><CheckIcon /> Unlimited resume uploads</li>
            <li className="flex items-center text-slate-600"><CheckIcon /> ATS Matching reports</li>
          </ul>
          <button 
            onClick={() => onSelect(Plan.UNLIMITED)}
            className="w-full py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100"
          >
            Get Unlimited
          </button>
        </div>

        {/* Super Premium */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col transition-all hover:bg-slate-800 group">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-amber-400 mb-2">Executive</h3>
            <p className="text-slate-400 text-xs">Human-expert intervention.</p>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-3xl font-black">$99</span>
              <span className="ml-2 text-slate-500 text-xs font-bold uppercase tracking-widest">concierge</span>
            </div>
          </div>
          <ul className="space-y-3 mb-8 flex-grow text-xs font-medium text-slate-300">
            <li className="flex items-center"><CheckIcon color="text-amber-400" /> Full Human Rewrite</li>
            <li className="flex items-center"><CheckIcon color="text-amber-400" /> 24-hr Expert Turnaround</li>
            <li className="flex items-center"><CheckIcon color="text-amber-400" /> Executive Bio writing</li>
            <li className="flex items-center"><CheckIcon color="text-amber-400" /> 1-on-1 Strategy session</li>
          </ul>
          <button 
            onClick={() => onSelect(Plan.SUPER_PREMIUM)}
            className="w-full py-3 rounded-2xl font-bold bg-amber-400 text-slate-900 hover:bg-amber-300 transition-all"
          >
            Request Concierge
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = ({ color = "text-emerald-500" }) => (
  <svg className={`w-4 h-4 mr-3 ${color}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 mr-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

export default Pricing;
