import React, { useState, useEffect, useRef } from 'react';
import { Page, UserTier, Moment } from '../types';
import { Users, LayoutGrid, UserPlus, GitMerge, MessageSquare, Eye, X, MapPin, ArrowRight, Plus, GitBranch, Heart, Check, ArrowLeft, ShieldCheck, Sparkles, Building2, UserCheck, Share2, Compass, Layers, BrainCircuit, ChevronDown, Loader2, Landmark, History, Zap, Settings2, Lock, TreeDeciduous, Camera, GitFork, PlayCircle, Mic, Image as ImageIcon, Search, SlidersHorizontal, List, Clock, Palette, BarChart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ASSETS } from '../data/assets';
import BrandLogo from './BrandLogo';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface FamilySpacePageProps {
    onNavigate: (page: Page) => void;
    userTier: UserTier;
    moments: Moment[];
    familyName: string;
    onFamilyNameChange: (name: string) => void;
    familyHeaderImages: string[];
    onUpdateFamilyHeader: (urls: string[]) => void;
    onSelectMoment: (moment: Moment) => void;
    onPinToggle: (id: number) => void;
    onUpdateMoment: (moment: Moment) => void;
    onEditMoment: (moment: Moment) => void;
    onDeleteMoment: (id: number) => void;
}

const SharedMomentPin: React.FC<{ moment: Moment; onClick: () => void; isDark: boolean }> = ({ moment, onClick, isDark }) => {
    return (
        <button 
            onClick={onClick}
            className="memory-card-mini group rounded-3xl"
        >
            <div className="img-container">
                <img src={moment.image || moment.images?.[0]} alt="" />
            </div>
            
            {moment.createdBy && moment.createdBy !== 'JD' && (
                <div className="absolute top-4 left-4 z-20 bg-indigo-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-lg">
                    {moment.createdBy}
                </div>
            )}

            <div className="content">
                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-1">{moment.date}</p>
                <h3 className="font-bold text-white text-base leading-tight tracking-tight line-clamp-1">{moment.title}</h3>
            </div>
        </button>
    );
};

const FamilyLandingPage: React.FC<{ 
    userTier: UserTier, 
    onNavigate: (page: Page) => void, 
    onFound: () => void,
    isJoining: boolean,
    onJoin: (code: string) => void
}> = ({ userTier, onNavigate, onFound, isJoining, onJoin }) => {
    const [inviteCode, setInviteCode] = useState('');
    return (
        <div className="bg-[#050811] text-slate-200 animate-fade-in -mt-20 overflow-x-hidden">
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={ASSETS.FAMILY.HERO_SLIDES[1]} alt="Family" className="w-full h-full object-cover opacity-30 animate-ken-burns-slow" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-transparent to-[#050811] z-10"></div>
                </div>
                <div className="relative z-30 max-w-7xl animate-fade-in-up">
                    <h1 className="font-brand font-bold text-5xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-white tracking-tighter leading-[1.05] md:leading-[0.88] drop-shadow-2xl mb-8">
                        Found Your <span className="text-indigo-400">House.</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-slate-300 font-serif italic mb-12 leading-relaxed max-w-3xl mx-auto">
                        "A family is a conversation across time."
                    </p>
                    <button onClick={() => document.getElementById('found-house')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-12 rounded-2xl text-lg shadow-2xl transition-all transform hover:scale-105">Create Family Space</button>
                </div>
            </section>

            <section id="found-house" className="py-32 bg-[#050811]">
                <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-12 flex flex-col items-center text-center group hover:bg-slate-800 transition-all duration-700 shadow-2xl">
                        <Building2 size={48} className="text-indigo-400 mb-10" />
                        <h2 className="text-4xl font-bold font-brand text-white mb-6">Found Your House</h2>
                        <button onClick={onFound} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-12 rounded-2xl shadow-xl transition-all tracking-widest uppercase text-xs">Start Family Space</button>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center text-center group hover:bg-slate-800/60 transition-all duration-700 shadow-2xl">
                        <UserCheck size={48} className="text-cyan-400 mb-10" />
                        <h2 className="text-4xl font-bold font-brand text-white mb-6">Enter a House</h2>
                        <input type="text" value={inviteCode} maxLength={6} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="0 0 0 0 0 0" className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 mb-6 text-white text-center font-mono text-3xl tracking-[0.4em] outline-none focus:border-cyan-500/50" />
                        <button onClick={() => onJoin(inviteCode)} disabled={inviteCode.length !== 6 || isJoining} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 rounded-2xl transition-all tracking-widest uppercase text-xs shadow-xl">{isJoining ? <Loader2 className="animate-spin" /> : 'Request Entry'}</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FamilySpacePage: React.FC<FamilySpacePageProps> = (props) => {
    const { onNavigate, moments, onSelectMoment, userTier, familyName, familyHeaderImages } = props;
    const [isFoundingActive, setIsFoundingActive] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const hasAccess = userTier === 'fæmily' || userTier === 'lægacy' || isFoundingActive;

    const displayHeroImages = familyHeaderImages.length > 0 ? familyHeaderImages : ASSETS.FAMILY.HERO_SLIDES;

    useEffect(() => {
        const timer = setInterval(() => setCurrentHeroIndex(p => (p + 1) % displayHeroImages.length), 8000);
        return () => clearInterval(timer);
    }, [displayHeroImages.length]);

    if (!hasAccess) {
        return <FamilyLandingPage userTier={userTier} onNavigate={onNavigate} onFound={() => setIsFoundingActive(true)} onJoin={(c) => setIsJoining(true)} isJoining={isJoining} />;
    }

    const sharedMoments = moments.filter(m => m.collaborators?.length || m.createdBy !== 'JD');

    return (
        <div className="min-h-screen bg-[#0B101B] text-white -mt-20 overflow-x-hidden flex flex-col">
            <section className="relative h-screen min-h-[600px] w-full flex flex-col justify-center items-center text-center overflow-hidden">
                {displayHeroImages.map((url, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={getOptimizedUrl(url, 1920)} className={`absolute inset-0 w-full h-full object-cover opacity-40 ${index === currentHeroIndex ? 'animate-ken-burns-slow' : ''}`} alt="" />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0B101B] z-10"></div>
                
                <div className="relative z-10 px-6 max-w-7xl animate-fade-in-up">
                    <h1 className="font-brand font-bold text-5xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-white tracking-tighter leading-[1.05] md:leading-[0.88] drop-shadow-2xl mb-8">
                        The <span className="text-indigo-400">{familyName}</span> House.
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
                        <button onClick={() => onNavigate(Page.FamilyStoryline)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-6 px-14 rounded-[2rem] text-lg flex items-center gap-4 transition-all transform hover:scale-105 shadow-2xl shadow-indigo-900/40">
                            <Layers size={24}/> Storyline
                        </button>
                        <button onClick={() => onNavigate(Page.FamilyTree)} className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-bold py-6 px-14 rounded-[2rem] text-lg flex items-center gap-4 transition-all shadow-xl">
                            <TreeDeciduous size={24}/> Tree
                        </button>
                    </div>
                </div>
            </section>

            <div className="relative z-20 -mt-32 pb-40 container mx-auto px-6 max-w-7xl">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                     <button 
                        onClick={() => onNavigate(Page.FamilyInsight)}
                        className="p-10 rounded-[3rem] border border-white/10 bg-indigo-900/20 backdrop-blur-xl group hover:border-indigo-500/50 transition-all duration-500 text-left flex flex-col justify-between h-72 shadow-2xl"
                    >
                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/30 shadow-inner">
                            <BarChart size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold font-brand text-white mb-3 tracking-tighter">Collective Insights</h3>
                            <p className="text-slate-400 text-base leading-relaxed">Visualize the emotional resonance and dynamics of your family.</p>
                        </div>
                        <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                            View Fabric <ArrowRight size={18}/>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => onNavigate(Page.FamilyMoments)}
                        className="p-10 rounded-[3rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl group hover:border-cyan-500/50 transition-all duration-500 text-left flex flex-col justify-between h-72 shadow-2xl"
                    >
                        <div className="w-16 h-16 rounded-[1.5rem] bg-cyan-500/20 flex items-center justify-center text-cyan-400 ring-1 ring-cyan-500/30 shadow-inner">
                            <History size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold font-brand text-white mb-3 tracking-tighter">The Archive</h3>
                            <p className="text-slate-400 text-base leading-relaxed">Access every shared artifact contributed by kin.</p>
                        </div>
                        <div className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                            Open Vault <ArrowRight size={18}/>
                        </div>
                    </button>

                    <div 
                        className="p-10 rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-md flex flex-col justify-center h-72 relative overflow-hidden group shadow-2xl"
                    >
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">æterny Insight</p>
                         <p className="text-xl md:text-2xl italic text-slate-300 leading-relaxed font-serif">"The {familyName} house is currently most active in 'Adventure' threads."</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Shared Archive</h2>
                    <button onClick={() => onNavigate(Page.FamilyMoments)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 tracking-widest uppercase flex items-center gap-3 transition-all">View All <ArrowRight size={14}/></button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {sharedMoments.map(m => (
                        <SharedMomentPin key={m.id} moment={m} onClick={() => onSelectMoment(m)} isDark={true} />
                    ))}
                    
                    <button className="memory-card-mini flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[2rem] hover:border-indigo-500/50 hover:bg-indigo-500/5 group transition-all duration-500 shadow-xl min-h-[220px]">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-900/40 transition-all group-hover:scale-110">
                            <UserPlus size={24} className="text-slate-500 group-hover:text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300">Invite Kin</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FamilySpacePage;