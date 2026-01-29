
import React from 'react';
import { Page, UserTier, CreditState } from '../types';
import { 
    Wand2, Layers, BookOpen, Film, 
    Sparkles, ArrowRight, Zap, Info, 
    Bot, Database, Layout, Mic,
    Landmark, Clock, Palette, BookImage
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TOKEN_COSTS } from '../services/costCatalog';
import PageHeader from './PageHeader';
import TokenIcon from './icons/TokenIcon';

interface StudioPageProps {
    onNavigate: (page: Page) => void;
    userTier: UserTier;
    tokenState: CreditState;
}

interface WingCardProps {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    page: Page;
    image: string;
    onNavigate: (page: Page) => void;
    isComingSoon?: boolean;
}

const WingCard: React.FC<WingCardProps> = ({ title, subtitle, description, icon: Icon, page, image, onNavigate, isComingSoon }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button 
            onClick={() => !isComingSoon && onNavigate(page)}
            disabled={isComingSoon}
            className={`group relative w-full h-[460px] rounded-[3rem] overflow-hidden border transition-all duration-1000 text-left
                ${isDark ? 'bg-[#0B101B] border-white/5' : 'bg-white border-stone-200 shadow-2xl'}
                ${isComingSoon ? 'opacity-70 grayscale cursor-not-allowed' : 'hover:border-cyan-500/30 hover:-translate-y-2'}
            `}
        >
            <div className="absolute inset-0 z-0">
                <img src={image} className="w-full h-full object-cover opacity-30 transition-transform duration-[10s] group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
            </div>

            <div className="relative z-10 p-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-110 transition-transform duration-700">
                        <Icon size={28} />
                    </div>
                    {isComingSoon && (
                        <div className="bg-indigo-600/20 text-indigo-400 text-[8px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full border border-indigo-400/20 shadow-2xl">
                            Under Construction
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500/60 mb-2">{subtitle}</p>
                        <h3 className="text-4xl font-bold font-brand tracking-tighter text-white">{title}</h3>
                    </div>
                    <p className="text-lg text-slate-400 font-serif italic leading-relaxed max-w-sm">"{description}"</p>
                    
                    <div className={`pt-8 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-500 
                        ${isComingSoon ? 'text-slate-700' : 'text-slate-500 group-hover:text-white group-hover:translate-x-2'}
                    `}>
                        {isComingSoon ? 'Locked' : 'Explore'} <ArrowRight size={16}/>
                    </div>
                </div>
            </div>
        </button>
    );
};

const StudioPage: React.FC<StudioPageProps> = ({ onNavigate, userTier, tokenState }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-1000`}>
            <PageHeader title="The Studio" onBack={() => onNavigate(Page.Home)} />
            
            <div className="container mx-auto px-6 pt-32 pb-40 max-w-7xl animate-fade-in">
                
                {/* NEURAL RESERVOIR HUD */}
                <div className="mb-20 flex flex-col md:flex-row items-center gap-6 p-1 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="px-10 py-6 border-r border-white/5 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                            <TokenIcon size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Neural Reservoir</p>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold font-brand text-white">{tokenState.balance.toLocaleString()}</span>
                                <span className="text-xs font-bold text-amber-500/60 uppercase">Tk</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow px-10 py-6 text-left">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-3">Manifestation Capacity</p>
                        <div className="flex items-center gap-8">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Story Synthesis (Unlimited)</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Living Frames ({Math.floor(tokenState.balance / 500)} Ready)</span>
                             </div>
                        </div>
                    </div>
                    <div className="pr-10">
                        <button onClick={() => onNavigate(Page.Subscription)} className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-all shadow-xl active:scale-95">
                            Refill Energy
                        </button>
                    </div>
                </div>

                <div className="text-center mb-24 max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                        <Palette size={14} className="text-cyan-400" /> Digital Workshop v14.6
                    </div>
                    <h1 className="text-5xl md:text-[6.5rem] font-bold font-brand tracking-tighter leading-[0.88] text-white">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-500">Studio.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-serif italic leading-relaxed">
                        "Your workshop for refinement and creation. Polish individual fragments, group them into collections, or manifest your legacy in physical form."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <WingCard 
                        title="Moments"
                        subtitle="Individual Memories"
                        description="Edit photos and AI captions."
                        icon={Wand2}
                        page={Page.Curate}
                        image="https://images.unsplash.com/photo-1516900441530-91436440268f?q=80&w=1200&auto=format&fit=crop"
                        onNavigate={onNavigate}
                    />
                    <WingCard 
                        title="Collections"
                        subtitle="Narrative Weaving"
                        description="Organize moments into larger stories."
                        icon={Layers}
                        page={Page.SmartCollection}
                        image="https://images.pexels.com/photos/1575845/pexels-photo-1575845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        onNavigate={onNavigate}
                    />
                    <WingCard 
                        title="Print Shop"
                        subtitle="Physical Editions"
                        description="Order magazines and hardcovers."
                        icon={BookImage}
                        page={Page.Shop}
                        image="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop"
                        onNavigate={onNavigate}
                    />
                </div>

                {/* Secondary Discovery Node */}
                <div className="mt-32 p-16 rounded-[4rem] bg-white/[0.01] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
                    <div className="flex-1 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner"><Film size={32}/></div>
                        <h3 className="text-3xl font-bold font-brand text-white tracking-tight">The Cinema</h3>
                        <p className="text-slate-400 font-serif italic text-lg leading-relaxed">
                            "Transform your timeline into cinematic AI reflections. Watch as static artifacts breathe and speak with original resonance."
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Compute Requirement</p>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-2xl font-bold text-amber-500 font-mono">500</span>
                                <Zap size={20} className="text-amber-500" fill="currentColor" />
                            </div>
                        </div>
                        <button 
                            onClick={() => onNavigate(Page.AIVideo)}
                            className="px-12 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-4"
                        >
                            Enter Lab <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudioPage;
