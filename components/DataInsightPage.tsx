import React, { useMemo, useState, useEffect } from 'react';
import { Moment, Page } from '../types';
import { 
    MapPin, Users, Heart, Tag, Bot, TrendingUp, Sparkles, 
    BrainCircuit, Activity, Waves, UserCheck, History, Map,
    Zap, Globe, ChevronRight, LayoutGrid, Timer
} from 'lucide-react';
import PageHeader from './PageHeader';
import { useTheme } from '../contexts/ThemeContext';

interface DataInsightPageProps {
    moments: Moment[];
    onNavigate: (page: Page) => void;
}

// Move helper components outside to fix potential declaration and inference issues
const Compass = ({ size, className }: any) => <Map size={size} className={className} />;
const Trophy = ({ size, className }: any) => <Activity size={size} className={className} />;

// Explicitly defined metrics interface to ensure stable array property inference
interface InsightMetrics {
    topPeople: [string, number][];
    topLocations: [string, number][];
    topActivities: [string, number][];
}

const emotionConfig: { [key: string]: { color: string, hex: string, icon: React.ElementType, name: string } } = {
    joy: { color: 'text-yellow-400', hex: '#facc15', icon: Sparkles, name: 'Radiance' },
    love: { color: 'text-rose-500', hex: '#f43f5e', icon: Heart, name: 'Connection' },
    adventure: { color: 'text-cyan-400', hex: '#22d3ee', icon: Compass, name: 'Exploration' },
    peace: { color: 'text-indigo-300', hex: '#a5b4fc', icon: Waves, name: 'Serenity' },
    reflection: { color: 'text-purple-400', hex: '#c084fc', icon: BrainCircuit, name: 'Wisdom' },
    achievement: { color: 'text-emerald-400', hex: '#34d399', icon: Trophy, name: 'Growth' },
};

const DataInsightPage: React.FC<DataInsightPageProps> = ({ moments, onNavigate }) => {
    const [hoveredThread, setHoveredThread] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Explicitly typed standardMoments as Moment[] to ensure reliable inference in downstream useMemos
    const standardMoments: Moment[] = useMemo(() => moments.filter(m => m.type === 'standard' || m.type === 'focus'), [moments]);

    // Added explicit return type to fix potential unknown inference issues for lifeFabricData
    const lifeFabricData = useMemo<{
        width: number;
        height: number;
        threads: { [emotion: string]: { x: number; y: number }[] };
        years: string[];
        padding: { top: number; right: number; bottom: number; left: number };
        line: (pts: { x: number; y: number }[]) => string;
    } | null>(() => {
        if (standardMoments.length < 2) return null;

        const momentsByYear: { [year: string]: Moment[] } = {};
        standardMoments.forEach(m => {
            const year = new Date(m.date).getFullYear().toString();
            if (!momentsByYear[year]) momentsByYear[year] = [];
            
            // Filter to improve inference stability
            const yearlyMoments = standardMoments.filter(sm => new Date(sm.date).getFullYear().toString() === year);
            yearlyMoments.forEach(sm => {
               if (!momentsByYear[year].find(ex => ex.id === sm.id)) momentsByYear[year].push(sm);
            });
        });

        const years = Object.keys(momentsByYear).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        if (years.length < 2) return null;

        const emotions = Object.keys(emotionConfig);
        const width = 1200, height = 400, padding = { top: 60, right: 80, bottom: 60, left: 80 };
        
        const threads: { [emotion: string]: { x: number, y: number }[] } = {};
        const maxCount = Math.max(1, ...emotions.flatMap(emotion => 
            years.map(year => (momentsByYear[year] || []).filter(m => m.emotion === emotion).length)
        ));

        emotions.forEach(emotion => {
            threads[emotion] = years.map((year, i) => {
                const count = (momentsByYear[year] || []).filter(m => m.emotion === emotion).length;
                return {
                    x: padding.left + (i / (years.length - 1)) * (width - padding.left - padding.right),
                    y: (height - padding.bottom) - ((count / maxCount) * (height - padding.top - padding.bottom))
                };
            });
        });

        const line = (pts: {x:number, y:number}[]) => {
            if (pts.length < 2) return "";
            let d = `M ${pts[0].x} ${pts[0].y}`;
            for (let i = 0; i < pts.length - 1; i++) {
                const p1 = pts[i];
                const p2 = pts[i + 1];
                const cp1x = p1.x + (p2.x - p1.x) * 0.4;
                const cp2x = p1.x + (p2.x - p1.x) * 0.6;
                d += ` C ${cp1x},${p1.y} ${cp2x},${p2.y} ${p2.x},${p2.y}`;
            }
            return d;
        };

        return { width, height, threads, years, padding, line };
    }, [standardMoments]);

    // Explicitly typed return value for insights to fix 'Property map does not exist on type unknown' errors in JSX
    const insights: InsightMetrics = useMemo<InsightMetrics>(() => {
        const peopleCounts: Record<string, number> = {};
        const locationCounts: Record<string, number> = {};
        const activityCounts: Record<string, number> = {};

        standardMoments.forEach(m => {
            m.people?.forEach(p => { if(p !== 'Me') peopleCounts[p] = (peopleCounts[p] || 0) + 1; });
            if (m.location) {
                const city = m.location.split(',')[0].trim();
                locationCounts[city] = (locationCounts[city] || 0) + 1;
            }
            m.activities?.forEach(act => { activityCounts[act] = (activityCounts[act] || 0) + 1; });
        });

        const sortAndSlice = (obj: Record<string, number>): [string, number][] => 
            Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 5) as [string, number][];

        return {
            topPeople: sortAndSlice(peopleCounts),
            topLocations: sortAndSlice(locationCounts),
            topActivities: sortAndSlice(activityCounts)
        };
    }, [standardMoments]);

    const ProgressBar: React.FC<{ label: string, count: number, max: number, color: string }> = ({ label, count, max, color }) => (
        <div className="mb-6 group">
            <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
                <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{count} Chapters</span>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-stone-100 shadow-inner'}`}>
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`} 
                    style={{ width: isLoaded ? `${max > 0 ? (count / max) * 100 : 0}%` : '0%', backgroundColor: color }} 
                />
            </div>
        </div>
    );

    // Safely calculate maximums once to improve reliability and prevent 'unknown' errors during property access in JSX
    const maxPeople = (insights.topPeople[0]?.[1] as number) || 1;
    const maxLocations = (insights.topLocations[0]?.[1] as number) || 1;
    const maxActivities = (insights.topActivities[0]?.[1] as number) || 1;

    // Explicitly typed lifeChapters variable to ensure stable property access in JSX and fix potential "unknown" errors
    const lifeChapters = useMemo<{
        year: string;
        title: string;
        dominantEmotion: string | undefined;
        moments: Moment[];
    }[]>(() => {
        const yearGroups: { [year: string]: Moment[] } = {};
        standardMoments.forEach(m => {
            const year = new Date(m.date).getFullYear().toString();
            if (!yearGroups[year]) yearGroups[year] = [];
            yearGroups[year].push(m);
        });

        return Object.entries(yearGroups)
            .sort(([yearA], [yearB]) => parseInt(yearB, 10) - parseInt(yearA, 10))
            .slice(0, 4)
            .map(([year, yearMoments]) => {
                const emotionCounts: { [emotion: string]: number } = {};
                yearMoments.forEach(m => { if(m.emotion) emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1; });
                const dominantEmotion = Object.entries(emotionCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0];
                
                let title = `The Year of New Beginnings`;
                if(dominantEmotion === 'adventure') title = `The Year of Adventure`;
                if(dominantEmotion === 'achievement') title = `The Year of Achievement`;
                if(dominantEmotion === 'love') title = `The Year of Connection`;
                
                return {
                    year,
                    title,
                    dominantEmotion,
                    moments: yearMoments,
                };
            });
    }, [standardMoments]);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} -mt-20 overflow-x-hidden pb-32 selection:bg-indigo-500/20`}>
            <PageHeader 
                title="Neural Insights" 
                variant="immersive"
                onBack={() => onNavigate(Page.Home)}
            />
            
            {/* 1. CINEMATIC HERO */}
            <section className="relative h-[60vh] min-h-[500px] w-full flex flex-col justify-center items-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
                        alt="" 
                        className="w-full h-full object-cover opacity-10 blur-sm scale-110" 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/80 via-transparent to-[#050811]' : 'from-white/20 via-transparent to-[#FDFBF7]'}`}></div>
                </div>
                
                <div className="relative z-10 px-6 animate-fade-in-up">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-3xl">
                        <BrainCircuit className="w-10 h-10 text-indigo-400 animate-pulse" />
                    </div>
                    <h1 className="text-6xl md:text-[8rem] font-bold font-brand mb-8 drop-shadow-3xl tracking-tighter leading-[0.85]">
                        Legacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-400">Cartography.</span>
                    </h1>
                    <p className={`text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed italic font-serif ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                        "Viewing the underlying emotional architecture of your shared existence."
                    </p>
                </div>
            </section>

            <div className="relative z-20 -mt-24 container mx-auto px-6 space-y-12 max-w-7xl">
                
                {/* 2. THE NEURAL FLOW FABRIC */}
                <div className={`p-10 md:p-16 rounded-[4rem] border backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#0A0C14]/90 border-white/5' : 'bg-white border-white shadow-slate-200'}`}>
                    
                    {/* Integrated Legend Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-2">Neural Pulse Monitoring</p>
                            <h2 className="text-4xl font-bold font-brand tracking-tight">Emotional Fabric.</h2>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {/* Explicitly cast entries to handle potential unknown inference */}
                            {(Object.entries(emotionConfig) as [string, typeof emotionConfig[string]][]).map(([key, { color, name, icon: Icon }]) => (
                                <button 
                                    key={key} 
                                    onMouseEnter={() => setHoveredThread(key)} 
                                    onMouseLeave={() => setHoveredThread(null)}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-500 border
                                        ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-stone-100'} 
                                        ${hoveredThread === key ? `bg-white/10 border-white/20 scale-105 shadow-2xl` : 'opacity-40 grayscale-[0.5]'}
                                    `}
                                >
                                    <Icon size={14} className={color} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${hoveredThread === key ? 'text-white' : 'text-slate-500'}`}>{name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* The Chart Matrix */}
                    {lifeFabricData ? (
                        <div className="relative w-full aspect-[21/9] min-h-[350px] animate-fade-in group/chart">
                            <svg viewBox={`0 0 ${lifeFabricData.width} ${lifeFabricData.height}`} className="w-full h-full overflow-visible">
                                <defs>
                                    <pattern id="archival-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                                    </pattern>
                                    {Object.entries(emotionConfig).map(([key, { hex }]) => (
                                        <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor={hex} stopOpacity="0" />
                                            <stop offset="50%" stopColor={hex} stopOpacity="0.4" />
                                            <stop offset="100%" stopColor={hex} stopOpacity="0" />
                                        </linearGradient>
                                    ))}
                                </defs>

                                {/* Background Archival Grid */}
                                <rect width="100%" height="100%" fill="url(#archival-grid)" />

                                {/* Horizontal Pulse Lines */}
                                {[...Array(5)].map((_, i) => (
                                    <line 
                                        key={i} 
                                        x1={lifeFabricData.padding.left} 
                                        y1={lifeFabricData.padding.top + (i * (lifeFabricData.height - 120) / 4)} 
                                        x2={lifeFabricData.width - lifeFabricData.padding.right} 
                                        y2={lifeFabricData.padding.top + (i * (lifeFabricData.height - 120) / 4)} 
                                        stroke="rgba(255,255,255,0.05)" 
                                        strokeWidth="1" 
                                        strokeDasharray="4 4"
                                    />
                                ))}

                                {/* Explicitly cast entries to handle potential unknown inference for pts map */}
                                {(Object.entries(lifeFabricData.threads) as [string, {x:number, y:number}[]][]).map(([emotion, pts]) => {
                                    const isActive = hoveredThread === emotion;
                                    const isDimmed = hoveredThread && !isActive;
                                    const config = emotionConfig[emotion];
                                    
                                    return (
                                        <g key={emotion} className="transition-all duration-700">
                                            {/* Glow Area Under Path */}
                                            <path 
                                                d={lifeFabricData.line(pts)} 
                                                fill="none" 
                                                stroke={`url(#grad-${emotion})`}
                                                strokeWidth={isActive ? 60 : 0}
                                                opacity={isActive ? 0.3 : 0}
                                                className="transition-all duration-1000"
                                            />
                                            {/* Primary Path */}
                                            <path 
                                                d={lifeFabricData.line(pts)} 
                                                fill="none" 
                                                stroke={config.hex} 
                                                strokeWidth={isActive ? 5 : 2} 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                opacity={isDimmed ? 0.05 : 0.6}
                                                strokeDasharray={isLoaded ? "0" : "1000"}
                                                strokeDashoffset={isLoaded ? "0" : "1000"}
                                                className="transition-all duration-1000 ease-in-out"
                                                style={{ filter: isActive ? `drop-shadow(0 0 15px ${config.hex})` : 'none' }}
                                            />
                                            {/* Year Intersections */}
                                            {pts.map((p, pi) => (
                                                <circle 
                                                    key={pi} 
                                                    cx={p.x} 
                                                    cy={p.y} 
                                                    r={isActive ? 6 : 3} 
                                                    fill={isActive ? config.hex : 'rgba(255,255,255,0.1)'} 
                                                    opacity={isDimmed ? 0.05 : 0.8}
                                                    className="transition-all duration-500"
                                                />
                                            ))}
                                        </g>
                                    );
                                })}
                            </svg>
                            
                            <div className="flex justify-between absolute bottom-[-40px] left-0 right-0 px-20 border-t border-white/5 pt-6">
                                {lifeFabricData.years.map(year => (
                                    <span key={year} className="text-[11px] font-black font-mono text-slate-700 uppercase tracking-[0.4em]">{year}</span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-[21/9] flex flex-col items-center justify-center text-center opacity-30 border-2 border-dashed border-white/5 rounded-[3rem] bg-black/10">
                            <BrainCircuit className="w-16 h-16 mb-4" />
                            <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting broader temporal data</p>
                        </div>
                    )}
                </div>

                {/* 3. DYNAMICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className={`p-12 rounded-[3.5rem] border ${isDark ? 'bg-[#0B101B] border-white/5' : 'bg-white border-stone-100'} shadow-2xl`}>
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                <Users size={28} />
                            </div>
                            <h3 className="font-bold font-brand text-2xl tracking-tight">Inner Circle</h3>
                        </div>
                        <div className="space-y-2">
                             {/* Fixed "unknown" error by ensuring InsightMetrics results are explicitly cast as defined arrays for mapping */}
                             {(insights.topPeople as [string, number][]).length > 0 ? (insights.topPeople as [string, number][]).map(([name, count]) => (
                                <ProgressBar key={name} label={name} count={count} max={maxPeople} color="rgba(99, 102, 241, 0.8)" />
                             )) : (
                                <p className="text-xs text-slate-600 italic">No recurring nodes detected.</p>
                             )}
                        </div>
                    </div>

                    <div className={`p-12 rounded-[3.5rem] border ${isDark ? 'bg-[#0B101B] border-white/5' : 'bg-white border-stone-100'} shadow-2xl`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-indigo-500/20 shadow-inner">
                                <MapPin size={28} />
                            </div>
                            <h3 className="font-bold font-brand text-2xl tracking-tight">Geospatial Gravity</h3>
                        </div>
                        <div className="space-y-2">
                             {/* Fixed "unknown" error by ensuring InsightMetrics results are explicitly cast as defined arrays for mapping */}
                             {(insights.topLocations as [string, number][]).length > 0 ? (insights.topLocations as [string, number][]).map(([name, count]) => (
                                <ProgressBar key={name} label={name} count={count} max={maxLocations} color="rgba(16, 185, 129, 0.8)" />
                             )) : (
                                <p className="text-xs text-slate-600 italic">No spatial clustering detected.</p>
                             )}
                        </div>
                    </div>

                    <div className={`p-12 rounded-[3.5rem] border ${isDark ? 'bg-[#0B101B] border-white/5' : 'bg-white border-stone-100'} shadow-2xl`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-indigo-500/20 shadow-inner">
                                <Tag size={28} />
                            </div>
                            <h3 className="font-bold font-brand text-2xl tracking-tight">Thematics</h3>
                        </div>
                        <div className="space-y-2">
                             {/* Fixed "unknown" error by ensuring InsightMetrics results are explicitly cast as defined arrays for mapping */}
                             {(insights.topActivities as [string, number][]).length > 0 ? (insights.topActivities as [string, number][]).map(([name, count]) => (
                                <ProgressBar key={name} label={name} count={count} max={maxActivities} color="rgba(245, 158, 11, 0.8)" />
                             )) : (
                                <p className="text-xs text-slate-600 italic">No thematic pillars identified.</p>
                             )}
                        </div>
                    </div>
                </div>

                {/* 4. æterny'S SYNTHETIC REVIEW */}
                <div className={`relative p-16 md:p-24 rounded-[4rem] border text-center overflow-hidden transition-all group ${isDark ? 'bg-[#0A0C14] border-white/5' : 'bg-white border-stone-200'} shadow-3xl`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-500"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white/[0.03] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-3xl border border-white/5 group-hover:scale-110 transition-transform duration-1000">
                            <Bot className="w-12 h-12 text-cyan-400 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-50/60 mb-6">Synthetic Intelligence Observation</p>
                        <h3 className="text-4xl md:text-5xl font-bold font-brand mb-10 tracking-tighter">Your Story is a Resonance of Purpose.</h3>
                        <p className={`text-2xl md:text-4xl leading-relaxed max-w-5xl mx-auto italic font-serif ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            "Scanning the timestream, I see a life defined by high emotional intensity and frequent transitions. Your house pulse currently vibrates with 'Exploration', driven by your spatial movement through Europe. However, your 'Serenity' threads are thickening as the archive matures. You are weaving a legacy not just of action, but of deep, quiet integration."
                        </p>
                        
                        <div className="mt-16 flex items-center justify-center gap-12 opacity-30 grayscale hover:opacity-40 transition-all duration-700">
                             <div className="flex items-center gap-2"><Globe size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Global Arc</span></div>
                             <div className="flex items-center gap-2"><Users size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Kindred Flow</span></div>
                             <div className="flex items-center gap-2"><Timer size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Temporal Density</span></div>
                        </div>
                    </div>
                </div>

            </div>
            
            <style>{`
                @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                @keyframes pulse-glow { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
                .animate-vocal-wave { animation: vocal-wave 0.8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default DataInsightPage;