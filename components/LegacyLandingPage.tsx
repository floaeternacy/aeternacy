
import React, { useEffect, useState } from 'react';
import { Page } from '../types';
import { 
    ArrowLeft, Lock, Clock, Mic, ShieldCheck, Users, Sparkles, Fingerprint, 
    Infinity, ChevronDown, Star, ArrowRight, Landmark, Globe, ShieldAlert, Zap,
    Zap as ZapIcon
} from 'lucide-react';
import LegacyIcon from './icons/LegacyIcon';
import { TOKEN_COSTS } from '../services/costCatalog';
import TokenIcon from './icons/TokenIcon';

interface LegacyLandingPageProps {
  onNavigate: (page: Page) => void;
}

const LegacyLandingPage: React.FC<LegacyLandingPageProps> = ({ onNavigate }) => {
    const [scrolled, setScrolled] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleUpgrade = () => onNavigate(Page.Subscription);

    return (
        <div className="bg-[#050505] text-slate-200 animate-fade-in font-sans selection:bg-amber-500/30 selection:text-amber-100 pb-20">
            
            {/* Nav Bar Overlay */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled > 50 ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4' : 'py-6 bg-transparent'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <button onClick={() => onNavigate(Page.Home)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold tracking-wide">Back</span>
                    </button>
                    <div className={`flex items-center gap-2 transition-opacity duration-500 ${scrolled > 300 ? 'opacity-100' : 'opacity-0'}`}>
                        <LegacyIcon className="w-5 h-5 text-amber-400" />
                        <span className="font-brand font-bold text-white tracking-widest uppercase text-sm">Lægacy</span>
                    </div>
                    <button 
                        onClick={handleUpgrade}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold py-2 px-6 rounded-full text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                    >
                        Unlock
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Starry Night" className="w-full h-full object-cover opacity-20 scale-110 animate-ken-burns-slow" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>
                </div>

                <div className="relative z-10 p-6 max-w-5xl mx-auto flex flex-col items-center">
                    <div className="mb-8 p-4 rounded-full border border-amber-500/20 bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.1)] backdrop-blur-sm animate-fade-in-up">
                        <LegacyIcon className="w-16 h-16 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-bold font-brand text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-700/80 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Become Timeless.
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        "We live twice: once in reality, and once in memory. Ensure the second life lasts forever."
                    </p>

                    <button 
                        onClick={handleUpgrade}
                        className="group relative px-10 py-5 bg-transparent overflow-hidden rounded-full animate-fade-in-up" 
                        style={{ animationDelay: '0.3s' }}
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
                        <div className="absolute inset-0 w-full h-full border border-amber-500/50 rounded-full group-hover:border-amber-400 transition-colors"></div>
                        <span className="relative flex items-center gap-3 text-amber-100 font-bold tracking-[0.2em] uppercase text-sm">
                            Enter the Studio <ArrowRight className="w-4 h-4" />
                        </span>
                    </button>
                </div>

                <div className="absolute bottom-10 animate-bounce text-amber-500/30">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </section>

            {/* --- IMMERSIVE VOCAL RESONANCE HIGHLIGHT --- */}
            <section className="py-24 px-6 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className={`relative rounded-[4rem] p-1 bg-gradient-to-br from-amber-600 via-amber-400 to-amber-600 shadow-[0_0_80px_rgba(245,158,11,0.2)] overflow-hidden group`}>
                        <div className={`relative z-10 p-10 md:p-20 rounded-[3.9rem] flex flex-col md:flex-row items-center justify-between gap-16 bg-[#0a0c14]`}>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                        <Landmark size={12} className="animate-pulse" /> Foundational Preservation
                                    </div>
                                </div>
                                
                                <h2 className={`text-4xl md:text-6xl font-bold font-brand mb-6 tracking-tighter text-white leading-tight`}>
                                    Digital Vocal <br/><span className="text-amber-500">Resonance.</span>
                                </h2>
                                
                                <p className={`text-xl md:text-2xl leading-relaxed italic font-serif text-slate-300 max-w-2xl`}>
                                    "Let æterny speak with your own voice. Record and calibrate your own resonance to narrate your legacy for future generations."
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Processing Tier</p>
                                        <p className="text-sm font-bold text-white">Parallel GPU Training</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Calibration Cost</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-amber-500 font-mono">2,500</span>
                                            <TokenIcon className="w-3.5 h-3.5 text-amber-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sovereignty</p>
                                        <p className="text-sm font-bold text-white">Encrypted Offline Silo</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 flex flex-col items-center gap-6">
                                <div className="group relative w-40 h-40 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-700 hover:scale-105 shadow-3xl overflow-hidden">
                                    <div className="absolute inset-0 bg-amber-500 animate-pulse opacity-20 blur-2xl"></div>
                                    <div className="absolute inset-0 border-2 border-amber-500/30 rounded-full group-hover:border-amber-400 transition-colors"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center text-center px-4">
                                        <Mic size={48} className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest leading-tight">
                                            Calibrate<br/>Signature
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                    Lægacy Access Only
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Showcase 1: The Biographer */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 right-0 -translate-x-1/2 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[128px] pointer-events-none"></div>
                <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-6">
                            <Mic className="w-3 h-3" /> The Biografær
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-brand text-white mb-6">Your Story, Told in Your Voice.</h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            This isn't a form to fill out. It's a conversation. æterny, your AI biographer, interviews you about your life chapters—from childhood memories to career defining moments.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon />
                                <span className="text-slate-300">Live, empathic voice interviews</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon />
                                <span className="text-slate-300">Auto-transcribed and woven into a narrative</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon />
                                <span className="text-slate-300">Voice cloning to narrate your own photobooks</span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Visual: Chat Simulation */}
                    <div className="order-1 md:order-2 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-purple-500/20 blur-3xl opacity-30 rounded-full"></div>
                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400"><Sparkles size={14}/></div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Live Session</span>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-200">
                                    "Tell me about the house you grew up in. What did the kitchen smell like on Sunday mornings?"
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-amber-600/20 border border-amber-500/30 p-4 rounded-2xl rounded-tr-sm text-sm text-amber-100/90">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                                            <div className="w-1 h-5 bg-amber-400 rounded-full animate-pulse delay-75"></div>
                                            <div className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
                                            <span className="text-[10px] font-bold uppercase ml-1 opacity-70">Recording</span>
                                        </div>
                                        "It always smelled like coffee and burnt toast..."
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOUNDATIONAL ENDOWMENT */}
            <section className="py-24 px-6 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="relative rounded-[3rem] p-px bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-[0_0_80px_rgba(245,158,11,0.1)] overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent)] pointer-events-none"></div>
                        <div className={`rounded-[2.9rem] p-8 md:p-12 h-full flex flex-col md:flex-row items-center justify-between gap-10 bg-[#0a0c14]`}>
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Landmark size={14} className="animate-pulse" /> The Dynasty Founder Offer
                                </div>
                                <h2 className={`text-4xl md:text-5xl font-bold font-brand mb-4 tracking-tighter text-white`}>
                                    Foundational <span className="text-amber-500">Endowment</span>
                                </h2>
                                <p className={`text-lg md:text-xl leading-relaxed text-slate-400 max-w-2xl`}>
                                    Secure your place in history for the next <span className="text-amber-500 font-bold">10 years</span> with a single, foundational investment. Built with <span className="text-white font-bold underline decoration-amber-500/50">Exit Protection</span> and <span className="text-white font-bold underline decoration-amber-500/50">Digital Sovereignty</span> guarantees.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                                    <div className="group/item">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1"><Globe size={10} className="text-amber-500"/> Sovereignty</p>
                                        <p className={`font-bold text-xs text-white`}>Local Archive Export</p>
                                    </div>
                                    <div className="group/item">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1"><ShieldAlert size={10} className="text-amber-500"/> Protection</p>
                                        <p className={`font-bold text-xs text-white`}>Binding Exit Clause</p>
                                    </div>
                                    <div className="group/item">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1"><Zap size={10} className="text-amber-500"/> Reservoir</p>
                                        <p className={`font-bold text-xs text-amber-500`}>250,000 Tokæn</p>
                                    </div>
                                    <div className="group/item">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1"><Infinity size={10} className="text-amber-500"/> Duration</p>
                                        <p className={`font-bold text-xs text-white`}>10 Year Lock-In</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center gap-4 bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20 backdrop-blur-sm">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Foundational Investment</p>
                                    <p className={`text-6xl font-bold font-brand text-white`}>€1,999</p>
                                    <p className="text-xs text-amber-500 font-bold mt-2 italic">One payment. Decades of peace.</p>
                                </div>
                                <button onClick={handleUpgrade} className="w-full md:w-64 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95">
                                    Activate Membership
                                </button>
                                <p className="text-[9px] text-slate-500 font-medium max-w-[1800px] text-center uppercase tracking-tight">Binding architectural preservation charter.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Showcase 2: The Trust */}
            <section className="py-32 px-6 bg-white/[0.02]">
                <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Visual: Connection Graphic */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-500/20 rounded-full animate-ping-slow"></div>
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <div className="w-20 h-20 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                <span className="font-brand font-bold text-2xl">You</span>
                            </div>
                            <div className="h-16 w-0.5 bg-gradient-to-b from-amber-500 to-slate-700"></div>
                            <div className="flex gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-2">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase">Steward</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 mb-2">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase">Successor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-6">
                            <Infinity className="w-3 h-3" /> The Legacy Protocol
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-brand text-white mb-6">Passed Down, Never Lost.</h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            Set up a digital trust. Appoint Stewards who can access your vault only when specific conditions are met. Ensure your story reaches the right people, at the right time.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon />
                                <span className="text-slate-300">Inactivity monitoring & automated handover</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon />
                                <span className="text-slate-300">Time Capsules locked until specific future dates</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon />
                                <span className="text-slate-300">Legal-grade digital asset succession</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Final Pricing CTA */}
            <section className="py-32 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent pointer-events-none"></div>
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl md:text-6xl font-bold font-brand text-white mb-6">Secure Your Place in History.</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Join the Lægacy tier. The only plan designed to outlive you.
                    </p>

                    <div className="relative bg-[#0A0A0A] border border-amber-500/30 rounded-3xl p-12 shadow-[0_0_60px_rgba(245,158,11,0.1)] overflow-hidden group hover:border-amber-500/50 transition-all">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-left">
                                <h3 className="text-2xl font-bold text-white font-brand mb-2">Lægacy Membership</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-amber-400">€29.99</span>
                                    <span className="text-slate-500">/ month</span>
                                </div>
                                <p className="text-sm text-slate-400 mt-4 max-w-md">
                                    Includes 5TB Vault, Unlimited AI Biographer, Priority Concierge, and 1 Print-On-Demand Hardcover Book per year.
                                </p>
                            </div>
                            <button 
                                onClick={handleUpgrade}
                                className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg shadow-amber-500/20 transform hover:scale-105"
                            >
                                Activate Membership
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-12 flex justify-center gap-8 text-sm text-slate-500">
                        <span className="flex items-center gap-2"><Lock className="w-4 h-4"/> 256-bit AES Encryption</span>
                        <span className="flex items-center gap-2"><Star className="w-4 h-4"/> ISO 27001 Certified</span>
                    </div>
                </div>
            </section>

            <footer className="py-32 border-t border-white/5 text-center flex flex-col items-center gap-10 bg-black">
                <LegacyIcon className="w-8 h-8 opacity-20 grayscale" />
                <div className="flex flex-wrap justify-center gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                    <button onClick={() => onNavigate(Page.About)} className="hover:text-amber-400 transition-colors">Origins</button>
                    <button onClick={() => onNavigate(Page.TrustCenter)} className="hover:text-amber-400 transition-colors">Safety</button>
                    <button onClick={() => onNavigate(Page.Legal)} className="hover:text-amber-400 transition-colors">Legal Charter</button>
                </div>
                <div className="h-px w-24 bg-white/5"></div>
                <p className="text-xs text-slate-700 font-medium max-w-xs leading-loose italic">
                    "Memory is a radiant thread. We simply hold the spool."
                </p>
            </footer>
        </div>
    );
};

const CheckCircleIcon = () => (
    <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
    </div>
);

export default LegacyLandingPage;
