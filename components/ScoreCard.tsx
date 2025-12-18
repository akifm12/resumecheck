
import React from 'react';

interface Props {
  label: string;
  score: number;
  color: 'indigo' | 'emerald' | 'amber';
}

const ScoreCard: React.FC<Props> = ({ label, score, color }) => {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100'
  };

  const ringColors = {
    indigo: '#4f46e5',
    emerald: '#10b981',
    amber: '#f59e0b'
  };

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-6">
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={ringColors[color]}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
          {score}%
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</h3>
        <p className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block border ${colorClasses[color]}`}>
          {score > 80 ? 'EXCELLENT' : score > 60 ? 'GOOD' : 'NEEDS WORK'}
        </p>
      </div>
    </div>
  );
};

export default ScoreCard;
