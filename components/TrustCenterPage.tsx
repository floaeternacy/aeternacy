import React from 'react';
import { Page } from '../types';
import { ArrowLeft, ShieldCheck, Lock, Database, UserCheck, BrainCircuit, Fingerprint, Globe, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Iso27001Badge = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#B0B0B0" />
      <text x="50" y="55" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="#2D3748" textAnchor="middle">ISO</text>
      <text x="50" y="75" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#2D3748" textAnchor="middle">27001</text>
    </svg>
);
  
const GdprBadge = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#4A5568" />
      <text x="50" y="60" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">GDPR</text>
    </svg>
);

const Soc2Badge = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#2D3748" />
        <text x="50" y="60" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">SOC 2</text>
    </svg>
);

interface TrustCenterPageProps {
  onNavigate: (page: Page) => void;
}

const PrincipleCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-white/5 group hover:border-cyan-500/40 transition-all shadow-2xl">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white font-brand tracking-tight">{title}</h3>
    </div>
    <p className="text-slate-400 text-sm leading-relaxed font-serif italic">{description}</p>
  </div>
);

const TrustCenterPage: React.FC<TrustCenterPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050811] text-white animate-fade-in-up pb-32">
      <header className="fixed top-0 left-0 right-0 p-6 z-50 bg-[#050811]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <button onClick={() => onNavigate(Page.Landing)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
          <BrandLogo className="text-xl" showTrademark={false} />
          <div className="w-12"></div>
        </div>
      </header>

      <section className="pt-48 pb-20 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-5xl md:text-8xl font-bold font-brand text-white tracking-tighter leading-[0.85] mb-8">Trust is our <br/><span className="text-cyan-400">Foundation.</span></h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-serif italic leading-relaxed">
            "Your story is your property. We have built æternacy to be a fortress for human legacy, where technology serves preservation, never exploitation."
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-6xl space-y-24">
        <section className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-500/20 rounded-[4rem] p-10 md:p-20 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 mb-8">
                    <Sparkles size={14} className="animate-pulse" /> Technical Integrity
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-brand text-white mb-8 tracking-tighter">The Sovereign <br/>Knowledge Layer.</h2>
                <p className="text-xl md:text-2xl text-slate-300 font-serif italic leading-relaxed mb-12 max-w-3xl">
                    "Unlike standard AI platforms, æterny utilizes a decentralized RAG architecture. This means your personal history is never part of a shared training set."
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner"><Fingerprint size={20}/></div>
                        <h4 className="font-bold text-white text-base">Isolated Silos</h4>
                        <p className="text-slate-500 text-sm leading-relaxed italic">Every archive has its own mathematical vector index. There is no physical way for data to bleed between accounts.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner"><Globe size={20}/></div>
                        <h4 className="font-bold text-white text-base">Zero-Training Clause</h4>
                        <p className="text-slate-500 text-sm leading-relaxed italic">Your artifacts are processed in a private silo. We explicitly disable model weight updates from user content.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner"><Lock size={20}/></div>
                        <h4 className="font-bold text-white text-base">Client-Side Keys</h4>
                        <p className="text-slate-500 text-sm leading-relaxed italic">In our premium tiers, only you hold the keys to decrypt the Knowledge Layer, ensuring total archival sovereignty.</p>
                    </div>
                </div>
            </div>
        </section>

        <section>
          <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-4xl font-bold text-white font-brand tracking-tighter">Archival Principles</h2>
              <div className="h-px w-24 bg-cyan-500/30 mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PrincipleCard 
                icon={Lock}
                title="Privacy by Design"
                description="Security isn't an add-on; it's the core. We build every feature starting with the question: 'How can we ensure the user is the only one who sees this?'"
            />
             <PrincipleCard 
                icon={Database}
                title="Encryption at Rest"
                description="Your memories are sealed with AES-256 industrial-grade encryption. Even if our servers were physicalized, your data remains an unreadable noise without your key."
            />
             <PrincipleCard 
                icon={UserCheck}
                title="Auditable Intelligence"
                description="æterny is a mirror, not a master. You can audit, edit, and purge the AI's learned context via your Neural Ledger at any time."
            />
             <PrincipleCard 
                icon={ShieldCheck}
                title="GDPR Sovereignty"
                description="We exceed international standards for data deletion and export. Your legacy is portable; you are never locked into our ecosystem."
            />
          </div>
        </section>

        <section className="pt-12">
            <h2 className="text-3xl font-bold text-white font-brand text-center mb-16">Verified Security Stack</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 mb-8 group-hover:scale-105 transition-transform"><Iso27001Badge /></div>
                    <h3 className="text-xl font-bold text-white mb-3">ISO/IEC 27001</h3>
                    <p className="text-sm text-slate-500 leading-relaxed italic">The gold standard for information security management. We are built for institutional-grade reliability.</p>
                </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 mb-8 group-hover:scale-105 transition-transform"><Soc2Badge /></div>
                    <h3 className="text-xl font-bold text-white mb-3">SOC 2 Type II</h3>
                    <p className="text-sm text-slate-500 leading-relaxed italic">Independent verification that our privacy and security controls operate effectively over time.</p>
                </div>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 mb-8 group-hover:scale-105 transition-transform"><GdprBadge /></div>
                    <h3 className="text-xl font-bold text-white mb-3">GDPR Compliant</h3>
                    <p className="text-sm text-slate-500 leading-relaxed italic">Absolute adherence to the European standard for data rights and personal sovereignty.</p>
                </div>
            </div>
        </section>

        <section className="text-center py-20 border-t border-white/5">
            <h2 className="text-3xl font-bold font-brand text-white mb-4 tracking-tight">Technical Questions?</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-serif italic text-lg">For a deep look at our cryptographic architecture, please review our Whitepaper or contact our Security Team.</p>
            <div className="flex flex-wrap justify-center gap-8">
                <button className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] hover:text-cyan-300 transition-colors">Privacy Policy</button>
                <button className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] hover:text-cyan-300 transition-colors">Technical Whitepaper</button>
                 <button className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] hover:text-cyan-300 transition-colors">Contact Support</button>
            </div>
        </section>
      </div>
    </div>
  );
};

export default TrustCenterPage;