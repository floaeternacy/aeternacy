import React, { useMemo, useState } from 'react';
import { Moment, Page } from '../types';
import { 
    Users, Heart, Zap, Sparkles, BrainCircuit, 
    TrendingUp, Activity, Waves, Bot, ChevronRight,
    MapPin, History, UserCheck, ArrowLeft, BarChart3,
    Trophy, MessageSquare, Mic
} from 'lucide-react';
import PageHeader from './PageHeader';
import { useTheme } from '../contexts/ThemeContext';
import { ASSETS } from '../data/assets';

interface FamilyInsightPageProps {
    moments: Moment[];
    onNavigate: (page: Page) => void;
    familyName: string;
}

const memberConfig: { [key: string]: { color: string, name: string, glow: string } } = {
    'JD': { color: 'text-cyan-400', name: 'John', glow: 'shadow-cyan-500/20' },
    'Sarah': { color: 'text-pink-400', name: 'Sarah', glow: 'shadow-pink-500/20' },
    'Alex': { color: 'text-indigo-400', name: 'Alex', glow: 'shadow-indigo-500/20' },
    'Mia': { color: 'text-emerald-400', name: 'Mia', glow: 'shadow-emerald-500/20' },
};

const FamilyInsightPage: React.FC<FamilyInsightPageProps> = ({ moments, onNavigate, familyName }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);

    const familyMoments = useMemo(() => moments.filter(m => m.createdBy || m.collaborators?.length), [moments]);

    const metrics = useMemo(() => {
        const counts: Record<string, number> = {};
        const emotions: Record<string, number> = { joy: 0, love: 0, adventure: 0, peace: 0, reflection: 0, achievement: 0 };
        
        familyMoments.forEach(m => {
            const creator = m.createdBy || 'JD';
            counts[creator] = (counts[creator] || 0) + 1;
            if (m.emotion) emotions[m.emotion]++;
        });

        const total = familyMoments.length || 1;
        const distribution = Object.entries(emotions).map(([key, val]) => ({
            label: key,
            percent: Math.round((val / total) * 100),
            color: key === 'joy' ? 'bg-yellow-400' : key === 'love' ? 'bg-pink-500' : 'bg-indigo-500'
        }));

        return { distribution, stewardship: Object.entries(counts).sort((a,b) => b[1] - a[1]) };
    }, [familyMoments]);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811] text-white' : 'bg-[#FDFBF7] text-slate-900'} -mt-20 overflow-x-hidden`}>
            <PageHeader 
                title="House Analysis" 
                onBack={() => onNavigate(Page.House)}
            />

            <div className="relative h-[45vh] min-h-[400px] w-full flex flex-col justify-center items-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={ASSETS.LEGACY.CONST_HERO} alt="" className="w-full h-full object-cover opacity-10 transition-transform duration-[10s]" />
                    <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/80 via-transparent to-[#050811]' : 'from-white/20 via-transparent to-[#FDFBF7]'}`}></div>
                </div>
                
                <div className="relative z-10 px-6 animate-fade-in-up flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 mb-8 backdrop-blur-md">
                        <BarChart3 className="w-3.5 h-3.5" /> Collective Synthesis
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold font-brand mb-6 tracking-tighter">The {familyName} <span className="text-indigo-400">Pulse.</span></h1>
                    <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic font-serif ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                        "A legacy is measured not in years, but in the distribution of meaning across the house."
                    </p>
                </div>
            </div>

            <div className="relative z-20 -mt-20 pb-40 container mx-auto px-6 max-w-7xl space-y-12">
                
                {/* 1. Emotional Fabric Analysis */}
                <div className={`p-10 md:p-16 rounded-[4rem] border backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white border-white'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                             <h2 className="text-3xl font-bold font-brand mb-4">Emotional Distribution</h2>
                             <p className="text-slate-500 text-sm leading-relaxed mb-10 italic">"æterny has mapped the emotional peaks of every shared artifact to identify the primary vibe of your family house."</p>
                             <div className="space-y-6">
                                {metrics.distribution.map((d, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.label}</span>
                                            <span className="text-sm font-bold text-white">{d.percent}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${d.color} transition-all duration-1000`} style={{ width: `${d.percent}%` }} />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                             <div className="w-48 h-48 rounded-full border-8 border-indigo-500/20 flex flex-col items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-t-8 border-indigo-500 animate-spin-slow"></div>
                                <Sparkles className="w-12 h-12 text-indigo-400 mb-2" />
                                <span className="text-4xl font-bold font-brand">98%</span>
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Archive Fidelity</span>
                             </div>
                             <p className="mt-8 text-xs text-slate-500 font-medium">Neural mapping calibrated for current generation.</p>
                        </div>
                    </div>
                </div>

                {/* 2. Stewardship Leaderboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className={`p-10 rounded-[3.5rem] border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white'}`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-inner">
                                <Trophy size={28} />
                            </div>
                            <h3 className="text-2xl font-bold font-brand text-white">Stewardship Leaderboard</h3>
                        </div>
                        <div className="space-y-4">
                            {metrics.stewardship.map(([name, count], i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs">#{i+1}</div>
                                        <span className="font-bold text-white">{name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-amber-400 font-bold">{count}</span>
                                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Chapters</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`p-10 rounded-[3.5rem] border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white'}`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner">
                                <Mic size={28} />
                            </div>
                            <h3 className="text-2xl font-bold font-brand text-white">Vocal Resonance</h3>
                        </div>
                        <div className="space-y-6">
                            <p className="text-sm text-slate-500 leading-relaxed italic">"Total hours of authenticated family voices secured in the house vault."</p>
                            <div className="flex justify-between items-center py-6 border-y border-white/5">
                                <div className="text-center flex-1">
                                    <p className="text-4xl font-bold font-mono text-white">12.4</p>
                                    <p className="text-[9px] font-black uppercase text-slate-500 mt-1">Hours Secured</p>
                                </div>
                                <div className="w-px h-12 bg-white/10"></div>
                                <div className="text-center flex-1">
                                    <p className="text-4xl font-bold font-mono text-cyan-400">3</p>
                                    <p className="text-[9px] font-black uppercase text-slate-500 mt-1">Vocal Profiles</p>
                                </div>
                            </div>
                            <button className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all">Calibrate New Voice</button>
                        </div>
                    </div>
                </div>

                {/* æterny Synthesis */}
                <div className={`p-12 md:p-16 rounded-[4rem] border text-center relative overflow-hidden ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500" />
                    <Bot className="w-12 h-12 text-indigo-400 mx-auto mb-8 animate-pulse" />
                    <h3 className="text-3xl font-bold font-brand mb-6">æterny Synthesis Report</h3>
                    <p className="text-xl md:text-2xl leading-relaxed italic font-serif text-slate-300 max-w-4xl mx-auto">
                        "The {familyName} house resonates with a frequency of discovery. Your stewardship is currently led by Jane, who focuses on visual documentation, while John anchors the narrative continuity. Collectively, you are building a legacy defined by 'Adventure' and 'Peace'. I recommend capturing more 'Grandparent Wisdom' to balance the temporal fabric."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FamilyInsightPage;