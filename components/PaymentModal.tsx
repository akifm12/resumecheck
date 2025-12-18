
import React from 'react';
import { Plan } from '../types';

interface Props {
  plan: Plan;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<Props> = ({ plan, onPaymentSuccess, onClose }) => {
  const price = plan === Plan.BASIC ? '$15' : plan === Plan.UNLIMITED ? '$29' : '$99';
  const label = plan === Plan.SUPER_PREMIUM ? 'Executive Concierge' : 'Resume Unlock';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in zoom-in-95 duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-10 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 className="text-3xl font-black mb-2">{label}</h2>
          <p className="text-slate-400">Total Due Today: <span className="text-white font-bold text-2xl ml-2">{price}</span></p>
        </div>

        <div className="p-10 space-y-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Select Payment Method (UAE Supported)</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* PayPal */}
            <button 
              onClick={onPaymentSuccess}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                   <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" className="h-6" alt="PayPal" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">PayPal</p>
                  <p className="text-xs text-slate-500">Pay via PayPal or Credit Card</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Tabby (UAE Specific BNPL) */}
            <button 
              onClick={onPaymentSuccess}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-emerald-500">
                   TABBY
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">Tabby (BNPL)</p>
                  <p className="text-xs text-slate-500">Split into 4 interest-free payments</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Apple Pay */}
            <button 
              onClick={onPaymentSuccess}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-slate-900 hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">Apple Pay</p>
                  <p className="text-xs text-slate-500">One-tap checkout</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 leading-relaxed">
            By proceeding, you agree to our Terms of Service. <br /> Securely processed in Dubai, UAE.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
