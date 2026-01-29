
import React, { useState } from 'react';
import { Page, UserTier } from '../types';
import { Building2, UserCheck, Loader2, ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';

interface FamilyLandingPageProps {
    userTier: UserTier;
    onNavigate: (page: Page) => void;
    onFound: () => void;
    isJoining: boolean;
    onJoin: (code: string) => void;
}

const FamilyLandingPage: React.FC<FamilyLandingPageProps> = ({ userTier, onNavigate, onFound, isJoining, onJoin }) => {
    const [inviteCode, setInviteCode] = useState('');
    return (
        <div className="bg-[#050811] text-slate-200 animate-fade-in -mt-20 overflow-x-hidden">
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={ASSETS.FAMILY.HERO_SLIDES[1]} alt="Lineage" className="w-full h-full object-cover opacity-30 animate-ken-burns-slow" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050811] z-10"></div>
                </div>
                <div className="relative z-30 max-w-7xl animate-fade-in-up">
                    <h1 className="font-brand font-bold text-5xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-white tracking-tighter leading-[1.05] md:leading-[0.88] drop-shadow-2xl mb-8">
                        Map the <span className="text-indigo-400">Lineage.</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-slate-300 font-serif italic mb-12 leading-relaxed max-w-3xl mx-auto">
                        "A collective memory that bridges the sequence of time."
                    </p>
                    <button onClick={() => document.getElementById('found-house')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-12 rounded-2xl text-lg shadow-2xl transition-all transform hover:scale-105">Found Your House</button>
                </div>
            </section>

            <section id="found-house" className="py-32 bg-[#050811]">
                <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-12 flex flex-col items-center text-center group hover:bg-slate-800 transition-all duration-700 shadow-2xl">
                        <Building2 size={48} className="text-indigo-400 mb-10" />
                        <h2 className="text-4xl font-bold font-brand text-white mb-6">Found Your House</h2>
                        <button onClick={onFound} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl shadow-xl transition-all tracking-widest uppercase text-xs">Start Private Space</button>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center text-center group hover:bg-slate-800/60 transition-all duration-700 shadow-2xl">
                        <UserCheck size={48} className="text-cyan-400 mb-10" />
                        <h2 className="text-4xl font-bold font-brand text-white mb-6">Enter a House</h2>
                        <input type="text" value={inviteCode} maxLength={6} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="0 0 0 0 0 0" className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 mb-6 text-white text-center font-mono text-3xl tracking-[0.4em] outline-none focus:border-cyan-500/50" />
                        <button onClick={() => onJoin(inviteCode)} disabled={inviteCode.length !== 6 || isJoining} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 rounded-2xl transition-all tracking-widest uppercase text-xs shadow-xl">{isJoining ? <Loader2 className="animate-spin" /> : 'Request Access'}</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FamilyLandingPage;
