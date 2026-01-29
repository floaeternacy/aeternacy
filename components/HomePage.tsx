
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Page, Moment, Journey, Language } from '../types';
import { 
    UploadCloud, Play, 
    Bot, ArrowRight, Sparkles, History, MapPin, Clock, Calendar, Heart, Users, Plus, Layers,
    ChevronRight, Layout, ImageIcon, BarChart3, Database, Globe, ShieldCheck, ChevronLeft,
    TrendingUp, Activity
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface HomePageProps {
    onNavigate: (page: Page) => void;
    moments: Moment[];
    journeys?: Journey[];
    onSelectMoment: (moment: Moment, autoPlay?: boolean) => void;
    onSelectJourney: (journey: Journey) => void;
    onEditMoment?: (moment: Moment) => void;
    language: Language;
    onToggleFab: () => void;
    openAssistantWithPrompt: (prompt: string) => void;
    lastPage: Page | null;
    onToggleDreamMode: () => void;
}

const HERO_TAGS = [
    "Latest Chapter",
    "One Year Ago",
    "Family Legacy",
    "Summer Resonance",
    "Treasured Fragment",
    "Temporal Echo",
    "Archived Memory",
    "Heritage Peak"
];

const HeirloomCard: React.FC<{ 
    children: React.ReactNode, 
    onClick: () => void,
    isDark: boolean,
    isWoven?: boolean,
    className?: string
}> = ({ children, onClick, isDark, isWoven, className = "" }) => (
    <button 
        onClick={onClick} 
        className={`group relative text-left flex flex-col rounded-[2.5rem] transition-all duration-700 hover:-translate-y-2 transform-gpu animate-fade-in-up
            ${isDark ? 'bg-[#0B101B] shadow-2xl hover:shadow-cyan-950/20' : 'bg-white shadow-md hover:shadow-xl'}
            border border-white/5 isolate ${className}
        `}
        style={{ 
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            backfaceVisibility: 'hidden'
        }}
    >
        <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] ${isWoven ? 'physical-stack-1' : ''}`}>
            {children}
        </div>
    </button>
);

const DashboardStoryCard: React.FC<{ 
    moment: Moment, 
    onClick: () => void,
    isDark: boolean,
    className?: string,
    isFlashback?: boolean
}> = ({ moment, onClick, isDark, isFlashback, className = "w-[270px] sm:w-[310px] md:w-[338px] flex-shrink-0" }) => (
    <HeirloomCard onClick={onClick} isDark={isDark} isWoven={true} className={className}>
        <img 
            src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 800)} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110 transform-gpu will-change-transform" 
            alt="" 
            style={{ backfaceVisibility: 'hidden' }}
        />
        <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-t ${isFlashback ? 'from-emerald-950/90 via-emerald-950/20' : 'from-black via-black/20'} to-transparent z-10 pointer-events-none transition-opacity duration-700 opacity-80 group-hover:opacity-100 transform-gpu`}></div>
        
        <div className="absolute bottom-10 left-10 right-10 z-20">
            <div className="flex items-center gap-2 mb-4 transition-all duration-700 transform group-hover:opacity-0 group-hover:-translate-y-2">
                <span className={`h-px w-6 ${isFlashback ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isFlashback ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {isFlashback ? 'Temporal Bridge' : moment.date}
                </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold font-brand text-white mb-6 transform transition-transform duration-700 group-hover:-translate-y-4">
                {moment.title}
            </h3>

            <div className="overflow-hidden mb-6 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">
                <p className="text-xs md:text-sm text-slate-300 font-serif italic leading-relaxed line-clamp-3">
                    "{moment.description}"
                </p>
            </div>
            
            <div className="flex items-center gap-6 transition-all duration-700 transform group-hover:opacity-0 group-hover:translate-y-2">
                {moment.location && (
                    <div className="flex items-center gap-2">
                        <MapPin size={12} className={isFlashback ? 'text-emerald-400' : 'text-cyan-400'} />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[80px]">{moment.location.split(',')[0]}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <ImageIcon size={12} className={isFlashback ? 'text-emerald-400' : 'text-cyan-400'} />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {moment.photoCount || 1} {isFlashback ? 'fragments rediscovered' : 'moments'}
                    </span>
                </div>
            </div>
        </div>
    </HeirloomCard>
);

const InsightCard: React.FC<{ 
    moments: Moment[], 
    isDark: boolean,
    onNavigate: (page: Page) => void
}> = ({ moments, isDark, onNavigate }) => {
    const emotion = moments[0]?.emotion || 'reflection';
    return (
        <HeirloomCard onClick={() => onNavigate(Page.DataInsight)} isDark={isDark} isWoven={false} className="w-[270px] sm:w-[310px] md:w-[338px] flex-shrink-0 bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border-indigo-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.1),_transparent)] pointer-events-none" />
            <div className="p-10 h-full flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                        <Activity size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-brand text-white tracking-tighter leading-tight">Neural Pulse</h3>
                        <p className="text-sm text-slate-400 font-serif italic mt-2">"Your archive is currently leaning towards {emotion}."</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Archive Strength</span>
                            <span className="text-xl font-bold text-indigo-400 font-mono">{moments.length * 12}</span>
                        </div>
                        <TrendingUp size={16} className="text-indigo-500 mb-1" />
                    </div>
                    <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] flex items-center gap-2">
                        Relive Insights <ArrowRight size={10} />
                    </p>
                </div>
            </div>
        </HeirloomCard>
    );
};

const DashboardJourneyCard: React.FC<{
    journey: Journey,
    onClick: () => void,
    isDark: boolean
}> = ({ journey, onClick, isDark }) => (
    <HeirloomCard onClick={onClick} isDark={isDark} isWoven={true} className="w-[270px] sm:w-[310px] md:w-[338px] flex-shrink-0">
        <img 
            src={getOptimizedUrl(journey.coverImage || '', 800)} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110 opacity-70 group-hover:opacity-100 transform-gpu will-change-transform" 
            alt="" 
            style={{ backfaceVisibility: 'hidden' }}
        />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-indigo-950 via-indigo-950/20 to-transparent z-10 pointer-events-none transition-opacity duration-700 opacity-80 group-hover:opacity-100 transform-gpu"></div>
        
        <div className="absolute bottom-10 left-10 right-10 z-20">
            <div className="flex items-center gap-2 mb-4 transition-all duration-700 group-hover:opacity-0 group-hover:-translate-y-2">
                <span className="h-px w-6 bg-indigo-400"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Woven Journey</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold font-brand tracking-tighter leading-[1.1] text-white mb-6 transform transition-transform duration-700 group-hover:-translate-y-4">
                {journey.title}
            </h3>

            <div className="overflow-hidden mb-6 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">
                <p className="text-xs md:text-sm text-slate-300 font-serif italic leading-relaxed line-clamp-3">
                    "{journey.description}"
                </p>
            </div>

            <div className="flex items-center gap-2 transition-all duration-700 group-hover:opacity-0 group-hover:translate-y-2">
                <History size={12} className="text-indigo-400" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{journey.momentIds.length} chapters established</span>
            </div>
        </div>
    </HeirloomCard>
);

const ScrollSection: React.FC<{ 
    children: React.ReactNode,
    isDark: boolean
}> = ({ children, isDark }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
    }, []);

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [children, checkScroll]);

    const scroll = (direction: 'right') => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.7;
        scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    };

    return (
        <div className="relative group/section">
            <div className={`absolute top-1/2 -right-4 -translate-y-1/2 z-40 transition-all duration-500 hidden md:block ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button 
                    onClick={() => scroll('right')}
                    className="w-14 h-14 bg-[#050811]/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white shadow-3xl hover:bg-white hover:text-black transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={24} strokeWidth={2.5} />
                </button>
            </div>

            <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-8 pt-8 pb-10 no-scrollbar snap-x snap-mandatory"
            >
                {children}
            </div>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ onNavigate, moments, journeys = [], onSelectMoment, onSelectJourney, onEditMoment }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);
    const [prevHeroSlide, setPrevHeroSlide] = useState(-1);

    const latestMoments = useMemo(() => moments.slice(0, 5), [moments]);

    const momentsWithTags = useMemo(() => {
        return latestMoments.map((moment, idx) => {
            const tagIndex = (idx + moment.id) % HERO_TAGS.length;
            return {
                ...moment,
                heroTag: HERO_TAGS[tagIndex]
            };
        });
    }, [latestMoments]);

    const flashbackMoment = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return moments.find(m => {
            const mYear = new Date(m.date).getFullYear();
            return !isNaN(mYear) && mYear < currentYear;
        });
    }, [moments]);
    
    useEffect(() => {
        if (latestMoments.length <= 1) return;
        const timer = setInterval(() => {
            setPrevHeroSlide(activeHeroSlide);
            setActiveHeroSlide(prev => (prev + 1) % latestMoments.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [latestMoments.length, activeHeroSlide]);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-1000`}>
            <main className="w-full pb-40">
                <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
                    {momentsWithTags.map((moment, index) => {
                        const isActive = index === activeHeroSlide;
                        return (
                            <div 
                                key={moment.id} 
                                className={`absolute inset-0 transition-opacity duration-[2500ms] ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <img 
                                    src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 1920)} 
                                    className={`absolute inset-0 w-full h-full object-cover brightness-[0.7] 
                                        ${(index === activeHeroSlide || index === prevHeroSlide) ? 'animate-ken-burns-slow' : ''}`} 
                                    alt="" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050811] z-10"></div>
                                
                                <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-24 pointer-events-none">
                                    <div className={`max-w-5xl mr-auto text-left transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 mb-6">
                                            <Sparkles size={12} strokeWidth={1.5} className="text-cyan-400" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">
                                                {moment.heroTag}
                                            </span>
                                        </div>
                                        
                                        <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-brand font-bold text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-3xl max-w-4xl">
                                            {moment.title}
                                        </h1>

                                        <p className="text-lg md:text-2xl text-white/70 font-serif italic mb-12 max-w-2xl leading-relaxed drop-shadow-lg">
                                            "{moment.description.substring(0, 140)}..."
                                        </p>
                                        
                                        <div className="flex flex-col sm:flex-row items-center justify-start gap-6 mb-12 pointer-events-auto">
                                            <button 
                                                onClick={() => onSelectMoment(moment, true)} 
                                                className="w-full sm:w-auto bg-white text-stone-950 font-black px-12 py-5 rounded-full text-xs md:text-sm uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center justify-center active:scale-95 group"
                                            >
                                                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform mr-2" /> Relive
                                            </button>
                                            
                                            <button 
                                                onClick={() => onEditMoment ? onEditMoment(moment) : onSelectMoment(moment)} 
                                                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black px-10 py-5 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                            >
                                                <Layout size={18} /> Studio
                                            </button>

                                            <button 
                                                onClick={() => onNavigate(Page.Create)}
                                                className="w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-full transition-all flex items-center justify-center active:scale-95 group shadow-2xl"
                                                aria-label="Add Moment"
                                            >
                                                <Plus size={24} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <div className="container mx-auto px-6 max-w-7xl pt-24 space-y-40">
                    <section className="relative group/section">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-12">
                            <div className="flex items-center gap-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.6em] text-slate-400">Moments</h2>
                                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-600 opacity-60 hidden sm:inline">• The discrete pulses of a life lived.</span>
                            </div>
                            <button 
                                onClick={() => onNavigate(Page.Chronicle)} 
                                className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 transition-all group text-white/50 hover:text-white"
                            >
                                Open Chronicle <ArrowRight size={14} className="group-hover:translate-x-1 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>

                        <ScrollSection isDark={isDark}>
                            <InsightCard moments={moments} isDark={isDark} onNavigate={onNavigate} />
                            {flashbackMoment && (
                                <div className="snap-start">
                                    <DashboardStoryCard 
                                        moment={flashbackMoment} 
                                        isDark={isDark} 
                                        isFlashback={true}
                                        onClick={() => onSelectMoment(flashbackMoment)} 
                                    />
                                </div>
                            )}
                            {moments.map((moment) => (
                                <div key={moment.id} className="snap-start">
                                    <DashboardStoryCard moment={moment} isDark={isDark} onClick={() => onSelectMoment(moment)} />
                                </div>
                            ))}
                        </ScrollSection>
                    </section>

                    <section className="relative group/section">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-12">
                            <div className="flex items-center gap-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.6em] text-indigo-400">Journeys</h2>
                                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-600 opacity-60 hidden sm:inline">• The architecture of your shared evolution</span>
                            </div>
                            <button 
                                onClick={() => onNavigate(Page.SmartCollection)} 
                                className="text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 transition-all group text-indigo-400/80 hover:text-indigo-400"
                            >
                                Weave New <Plus size={14} className="group-hover:translate-x-1 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>

                        <ScrollSection isDark={isDark}>
                            {journeys?.map((j) => (
                                <div key={j.id} className="snap-start">
                                    <DashboardJourneyCard journey={j} isDark={isDark} onClick={() => onSelectJourney(j)} />
                                </div>
                            ))}
                        </ScrollSection>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
