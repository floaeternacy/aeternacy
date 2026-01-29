
import React, { useState } from 'react';
import { Page, UserTier } from '../types';
import { ShieldCheck, CreditCard, Lock, ArrowRight, Loader2, Sparkles, Check, Zap, Landmark } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface CheckoutOverlayProps {
  tier: UserTier;
  onConfirm: (tier: UserTier) => void;
  onCancel: () => void;
}

const tierPricing: Record<UserTier, string> = {
    free: "€0",
    essæntial: "€79.90",
    fæmily: "€149.90",
    fæmily_plus: "€249.90",
    lægacy: "€1,999"
};

const tierFeatures: Record<string, string[]> = {
    essæntial: ["200 GB Secure Vault", "Advanced AI Narrator", "30-Day Recovery Buffer"],
    fæmily: ["1 TB Shared Archive", "6 Access Seats", "Living Family Storyline", "The Bridge™ Support"],
    fæmily_plus: ["2 TB Shared Archive", "12 Access Seats", "Vocal Signature Cloning", "AI Video Reflections"],
    lægacy: ["Centennial Archive Protection", "Legal Succession Protocol", "Vocal Signature Priming", "Annual Hardcover Artifact"]
};

const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({ tier, onConfirm, onCancel }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (tier === 'free') return null;

    const handlePayment = async () => {
        setIsProcessing(true);
        // TODO BACKEND: Stripe Payment Integration - Create PaymentIntent and confirm via Stripe SDK.
        await new Promise(r => setTimeout(r, 2500));
        setIsProcessing(false);
        onConfirm(tier);
    };

    const displayTitle = tier.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="fixed inset-0 bg-[#02040a]/95 backdrop-blur-2xl z-[10000] flex items-center justify-center p-6 animate-fade-in">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-4xl relative animate-fade-in-up">
                <div className="bg-slate-900/60 border border-white/10 rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Left: Summary */}
                    <div className="p-10 md:p-16 flex-1 flex flex-col justify-between">
                        <div>
                            <BrandLogo variant="icon" size="text-4xl" className="text-white mb-10" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-4">Funding the Archive</h2>
                            <h3 className="text-4xl font-bold font-brand text-white tracking-tighter mb-4">
                                {displayTitle.replace('Fæmily Plus', 'Fæmily Plus')} <br/>
                                <span className="text-slate-500">Subscription</span>
                            </h3>
                            <p className="text-slate-400 font-serif italic mb-10 leading-relaxed">
                                "The endowment funds the neural compute and archival storage required to secure your story for the next 100 years."
                            </p>

                            <ul className="space-y-4 mb-12">
                                {(tierFeatures[tier] || []).map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <Check size={16} className="text-cyan-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button onClick={onCancel} className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors self-start">
                            Cancel and Return
                        </button>
                    </div>

                    {/* Right: Payment */}
                    <div className="p-10 md:p-16 bg-white/5 border-l border-white/5 w-full md:w-[400px] flex flex-col justify-center">
                        <div className="mb-12">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Yearly Endowment</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold font-brand text-white tracking-tighter">{tierPricing[tier]}</span>
                                {tier !== 'lægacy' && <span className="text-slate-500 text-xs font-bold">/ yr</span>}
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest">Compute Deposit</span>
                                    <span className="text-slate-200 font-mono">Invoiced</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest">Archive Rights</span>
                                    <span className="text-green-500 font-bold uppercase">Included</span>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Total Funding</span>
                                    <span className="text-lg font-bold text-white">{tierPricing[tier]}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-white hover:bg-cyan-50 text-black font-black py-6 rounded-2xl text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-0.98 shadow-2xl flex items-center justify-center gap-4"
                        >
                            {isProcessing ? (
                                <><Loader2 className="animate-spin w-5 h-5"/> Processing...</>
                            ) : (
                                <><ShieldCheck size={20} /> Complete Endowment</>
                            )}
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                            <Lock size={16} />
                            <Landmark size={16} />
                            <Zap size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutOverlay;
