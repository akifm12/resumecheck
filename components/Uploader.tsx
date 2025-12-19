
import React, { useState, useRef } from 'react';

interface Props {
  onUpload: (text: string) => void;
}

declare const mammoth: any;
declare const pdfjsLib: any;

const Uploader: React.FC<Props> = ({ onUpload }) => {
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure PDF.js worker
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        onUpload(fullText);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.name.endsWith('.docx')
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onUpload(result.value);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text();
        onUpload(text);
      } else {
        alert("Unsupported file format. Please upload a PDF, DOCX, or TXT file.");
      }
    } catch (error) {
      console.error("File processing error:", error);
      alert("Could not read document. It might be password protected or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4 ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-600 font-bold animate-pulse">Extracting Content...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Drop your resume here</p>
                <p className="text-sm text-slate-500">Supports PDF, DOCX, and TXT</p>
              </div>
              <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-medium">
                Browse Files
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
              </label>
            </>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-4 text-slate-400 text-sm font-medium uppercase tracking-widest">or paste text</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 bg-slate-50 font-mono text-sm resize-none"
            placeholder="Paste your raw resume text here if file upload is restricted..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
          />
          
          <button 
            disabled={!pastedText.trim() || isProcessing}
            onClick={() => onUpload(pastedText)}
            className="w-full mt-4 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
          >
            Start Genius Audit
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-6">
         <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <svg className="w-3 h-3 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            SSL Secure
         </div>
         <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <svg className="w-3 h-3 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            Private Processing
         </div>
      </div>
    </div>
  );
};

export default Uploader;
