
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Results from './components/Results';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import FullRewriteView from './components/FullRewriteView';
import { AppView, ResumeAnalysis, Plan, User } from './types';
import { analyzeResume, fullRewriteResume } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState<string | null>(null);
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
      const saved = localStorage.getItem(`redo_${user.email}`);
      if (saved) setRewrittenResume(saved);
    }
  }, [user]);

  const executeAnalysis = async (text: string) => {
    setView('analyzing');
    const interval = setInterval(() => {
      const msgs = ["Decoding text...", "Running keyword audit...", "Calculating scores...", "Generating report..."];
      setLoadingMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 2000);

    try {
      const result = await analyzeResume(text);
      setAnalysis(result);
      setView('results');
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try a smaller snippet of text or check your connection.");
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
    setLoadingMessage("Executive Writer is crafting your new story...");

    try {
      const { content } = await fullRewriteResume(originalText);
      setRewrittenResume(content);
      if (user) localStorage.setItem(`redo_${user.email}`, content);
      setView('full-rewrite');
    } catch (error) {
      alert("Failed to generate rewrite. Try again.");
      setView('results');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blob -translate-y-1/2 translate-x-1/2 no-print"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blob translate-y-1/2 -translate-x-1/2 no-print"></div>

      <Header plan={plan} user={user} onNavigate={() => setView('landing')} />

      <main className="flex-grow container mx-auto px-4 py-8 z-10">
        {view === 'landing' && (
          <div className="space-y-12">
            <Hero />
            <Uploader onUpload={(text) => {
              setOriginalText(text);
              if (!user) { setPendingText(text); setShowAuth(true); } 
              else { executeAnalysis(text); }
            }} />
          </div>
        )}

        {view === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
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
          <FullRewriteView content={rewrittenResume} onBack={() => setView('results')} />
        )}

        {view === 'pricing' && (
          <Pricing currentPlan={plan} onSelect={(p) => { setPendingPlan(p); setShowPayment(true); }} />
        )}
      </main>

      {showAuth && <AuthModal onAuthSuccess={(u) => { setUser(u); setShowAuth(false); if(pendingText) { executeAnalysis(pendingText); setPendingText(null); } }} onClose={() => setShowAuth(false)} />}
      {showPayment && pendingPlan && <PaymentModal plan={pendingPlan} onPaymentSuccess={() => { setPlan(pendingPlan); setShowPayment(false); setView(analysis ? 'results' : 'landing'); }} onClose={() => setShowPayment(false)} />}
    </div>
  );
};

export default App;
