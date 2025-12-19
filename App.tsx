
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
          console.error("Failed to parse saved resume");
        }
      }
    }
  }, [user]);

  const handleUploadAttempt = (text: string) => {
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
    const loadingTexts = ["Auditing skills...", "Checking keyword density...", "Evaluating impact metrics..."];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(loadingTexts[i % loadingTexts.length]);
      i++;
    }, 2000);

    try {
      const result = await analyzeResume(text);
      setAnalysis(result);
      setView('results');
    } catch (error) {
      alert("AI Analysis failed. Try again.");
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
    if (!originalText) return;

    setView('analyzing');
    setLoadingMessage("Executive Designer is crafting your professional story...");
    
    try {
      const data = await fullRewriteResume(originalText);
      setRewrittenResume(data.content);
      if (user) localStorage.setItem(`vault_redo_${user.email}`, JSON.stringify(data.content));
      setView('full-rewrite');
    } catch (error) {
      alert("Professional rewrite failed.");
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
          <div className="space-y-12">
            <Hero />
            <Uploader onUpload={handleUploadAttempt} />
          </div>
        )}

        {view === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">{loadingMessage}</p>
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
      {showPayment && pendingPlan && <PaymentModal plan={pendingPlan} onPaymentSuccess={() => { setPlan(pendingPlan); setShowPayment(false); setView('results'); }} onClose={() => setShowPayment(false)} />}
    </div>
  );
};

export default App;
