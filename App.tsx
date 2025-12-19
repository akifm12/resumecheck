
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

  // Effect to load saved rewrites from the "Profile Vault"
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`vault_redo_${user.email}`);
      if (saved) setRewrittenResume(saved);
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
    const loadingTexts = [
      "Parsing professional history...",
      "Identifying keyword gaps...",
      "Calculating impact scores...",
      "Generating executive summary..."
    ];
    
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
      console.error(error);
      alert("AI Analysis failed. Please try a different resume or refresh the page.");
      setView('landing');
    } finally {
      clearInterval(interval);
    }
  };

  const handleFullRewrite = async () => {
    // Check if user has required plan (Unlimited or Super Premium)
    if (plan === Plan.FREE || plan === Plan.BASIC) {
      setView('pricing');
      return;
    }

    if (!originalText) {
      alert("Please upload your resume first.");
      setView('landing');
      return;
    }

    setView('analyzing');
    setLoadingMessage("Executive AI Writer is reconstructing your profile...");
    
    try {
      const data = await fullRewriteResume(originalText);
      setRewrittenResume(data.content);
      
      // Save to Vault
      if (user) {
        localStorage.setItem(`vault_redo_${user.email}`, data.content);
      }
      
      setView('full-rewrite');
    } catch (error) {
      console.error(error);
      alert("Professional rewrite failed. Please try again.");
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

  const handleUpgradeClick = (selectedPlan: Plan) => {
    setPendingPlan(selectedPlan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (pendingPlan) {
      setPlan(pendingPlan);
      setShowPayment(false);
      setPendingPlan(null);
      if (view === 'pricing' && analysis) {
        setView('results');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blob -translate-y-1/2 translate-x-1/2 no-print"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blob translate-y-1/2 -translate-x-1/2 no-print"></div>

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
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Processing</h2>
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
            content={rewrittenResume} 
            onBack={() => setView('results')} 
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

      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm no-print">
        <p>© 2024 ResumeGenius AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
