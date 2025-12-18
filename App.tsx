
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Results from './components/Results';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import { AppView, ResumeAnalysis, Plan, User } from './types';
import { analyzeResume } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [plan, setPlan] = useState<Plan>(Plan.FREE);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing AI scan...');

  const handleUploadAttempt = (text: string) => {
    if (!user) {
      setPendingText(text);
      setShowAuth(true);
    } else {
      executeAnalysis(text);
    }
  };

  const executeAnalysis = async (text: string) => {
    setView('analyzing');
    const messages = [
      "Parsing your professional history...",
      "Extracting key impact metrics...",
      "Comparing against industry benchmarks...",
      "Running semantic grammar checks...",
      "Identifying high-impact keywords...",
      "Finalizing your health score..."
    ];
    
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2000);

    try {
      const result = await analyzeResume(text);
      setAnalysis(result);
      setView('results');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Something went wrong with the AI analysis. Please try again.");
      setView('landing');
    } finally {
      clearInterval(interval);
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

  const handleUpgradeClick = (selectedPlan: Plan) => {
    setPendingPlan(selectedPlan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (pendingPlan) {
      setPlan(pendingPlan);
      setShowPayment(false);
      setPendingPlan(null);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blob -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blob translate-y-1/2 -translate-x-1/2"></div>

      <Header plan={plan} user={user} onNavigate={() => setView('landing')} />

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        {view === 'landing' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <Hero />
            <div id="upload-section">
              <Uploader onUpload={handleUploadAttempt} />
            </div>
          </div>
        )}

        {view === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Resume</h2>
              <p className="text-slate-500 animate-pulse">{loadingMessage}</p>
            </div>
          </div>
        )}

        {view === 'results' && analysis && (
          <Results 
            analysis={analysis} 
            plan={plan} 
            onUpgrade={() => setView('pricing')} 
          />
        )}

        {view === 'pricing' && (
          <Pricing onSelect={handleUpgradeClick} currentPlan={plan} />
        )}
      </main>

      {showAuth && (
        <AuthModal 
          onAuthSuccess={handleAuthSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}

      {showPayment && pendingPlan && (
        <PaymentModal 
          plan={pendingPlan} 
          onPaymentSuccess={handlePaymentSuccess} 
          onClose={() => setShowPayment(false)} 
        />
      )}

      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2024 ResumeGenius AI. Built for the Middle East career market.</p>
      </footer>
    </div>
  );
};

export default App;
