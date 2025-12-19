
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Results from './components/Results';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import FullRewriteView from './components/FullRewriteView';
import { AppView, ResumeAnalysis, Plan, User, StructuredResume } from './types';
import { analyzeResume, fullRewriteResume } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState<StructuredResume | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan>(Plan.FREE);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing AI engine...');

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`vault_redo_${user.email}`);
      if (saved) {
        try {
          setRewrittenResume(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved resume from vault");
        }
      }
    }
  }, [user]);

  const handleUploadAttempt = (text: string) => {
    if (!text.trim()) return;
    setOriginalText(text);
    if (!user) {
      setPendingText(text);
      setShowAuth(true);
    } else {
      executeAnalysis(text);
    }
  };

  const executeAnalysis = async (text: string) => {
    setView('analyzing');
    const loadingTexts = [
      "Auditing professional skills...", 
      "Checking industry keyword density...", 
      "Evaluating leadership impact metrics...",
      "Generating realistic feedback report..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(loadingTexts[i % loadingTexts.length]);
      i++;
    }, 2500);

    try {
      const result = await analyzeResume(text);
      setAnalysis(result);
      setView('results');
    } catch (error) {
      alert(error instanceof Error ? error.message : "AI Analysis failed. Please refresh and try again.");
      setView('landing');
    } finally {
      clearInterval(interval);
    }
  };

  const handleFullRewrite = async () => {
    if (plan === Plan.FREE || plan === Plan.BASIC) {
      setView('pricing');
      return;
    }
    if (!originalText) {
      alert("Please upload your resume text first.");
      setView('landing');
      return;
    }

    setView('analyzing');
    setLoadingMessage("Executive AI Designer is reconstructing your career story using your data...");
    
    try {
      const data = await fullRewriteResume(originalText);
      if (!data.content || !data.content.header) {
        throw new Error("Received empty data from AI. Please try again.");
      }
      setRewrittenResume(data.content);
      if (user) {
        localStorage.setItem(`vault_redo_${user.email}`, JSON.stringify(data.content));
      }
      setView('full-rewrite');
    } catch (error) {
      alert(error instanceof Error ? error.message : "Professional rewrite failed. The model may be overloaded.");
      setView('results');
    }
  };

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setShowAuth(false);
    if (pendingText) {
      executeAnalysis(pendingText);
      setPendingText(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blob -translate-y-1/2 translate-x-1/2 no-print"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blob translate-y-1/2 -translate-x-1/2 no-print"></div>

      <Header plan={plan} user={user} onNavigate={() => setView('landing')} />

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        {view === 'landing' && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <Hero />
            <Uploader onUpload={handleUploadAttempt} />
          </div>
        )}

        {view === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in-95">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Genius Intelligence Active</h2>
              <p className="text-slate-500 font-medium animate-pulse">{loadingMessage}</p>
            </div>
          </div>
        )}

        {view === 'results' && analysis && (
          <Results 
            analysis={analysis} 
            plan={plan} 
            onUpgrade={() => setView('pricing')} 
            onFullRewrite={handleFullRewrite}
          />
        )}

        {view === 'full-rewrite' && rewrittenResume && (
          <FullRewriteView 
            resume={rewrittenResume} 
            onBack={() => setView('results')} 
          />
        )}

        {view === 'pricing' && (
          <Pricing onSelect={(p) => { setPendingPlan(p); setShowPayment(true); }} currentPlan={plan} />
        )}
      </main>

      {showAuth && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      
      {showPayment && pendingPlan && (
        <PaymentModal 
          plan={pendingPlan} 
          onPaymentSuccess={() => { 
            setPlan(pendingPlan); 
            setShowPayment(false); 
            setView(analysis ? 'results' : 'landing'); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          onClose={() => setShowPayment(false)} 
        />
      )}
    </div>
  );
};

export default App;
