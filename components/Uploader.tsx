
import React, { useState } from 'react';

interface Props {
  onUpload: (text: string) => void;
}

const Uploader: React.FC<Props> = ({ onUpload }) => {
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onUpload(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onUpload(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4 ${
            dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
          onDragOver={handleDrag}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Drop your resume here</p>
            <p className="text-sm text-slate-500">Supports .txt files (PDF coming soon)</p>
          </div>
          <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-medium">
            Browse Files
            <input type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
          </label>
        </div>

        <div className="mt-8">
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-4 text-slate-400 text-sm font-medium">OR PASTE TEXT</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 bg-slate-50 font-mono text-sm"
            placeholder="Paste your resume content here for a quick scan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button 
            disabled={!text.trim()}
            onClick={() => onUpload(text)}
            className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
          >
            Start Health Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
