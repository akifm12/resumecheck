
import React from 'react';
import { Plan, User } from '../types';

interface Props {
  plan: Plan;
  user: User | null;
  onNavigate: () => void;
}

const Header: React.FC<Props> = ({ plan, user, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={onNavigate}
        >
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">ResumeGenius<span className="text-indigo-600">AI</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border ${
            plan === Plan.FREE ? 'bg-slate-50 text-slate-400 border-slate-200' : 
            plan === Plan.BASIC ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
            plan === Plan.SUPER_PREMIUM ? 'bg-amber-50 text-amber-600 border-amber-100' :
            'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {plan.replace('_', ' ')}
          </span>
          
          {user ? (
            <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-700">{user.name.split(' ')[0]}</span>
            </div>
          ) : (
            <button className="text-slate-600 hover:text-indigo-600 text-sm font-bold">Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
