import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Page, UserTier } from '../types';
import { 
    Archive, Sparkles, Shield, TrendingDown, 
    UploadCloud, CheckCircle, Search, ArrowRight,
    Zap, HardDrive, Trash2, LayoutGrid, Clock, ChevronRight, X, RotateCw,
    Scan, Cpu, BrainCircuit, FileText, ImageIcon,
    Users, Globe, Layers, Tag, Bot, History,
    ShieldAlert, Filter, Target, BarChart3, AlertCircle,
    Film, Volume2, Activity, Play, PlayCircle, Info, Landmark, Crown
} from 'lucide-react';
import PageHeader from './PageHeader';
import BrandLogo from './BrandLogo';
import { ASSETS } from '../data/assets';

interface ArchivistLandingPageProps {
    onNavigate: (page: Page) => void;
    onStartOptimization: () => void;
}

interface DemoItem {
    id: number;
    image: string;
    type: 'person' | 'landscape' | 'object' | 'junk' | 'document' | 'video';
    tag: string;
    isDuplicate?: boolean;
    isJunk?: boolean;
    rating: number;
    metrics: {
        blurHash: string;
        aestheticScore: number;
        rejectionReason?: string;
        duration?: string;
        audioDetected?: boolean;
        motionStability?: string;
    }
}

const StarIcon: React.FC<{ size: number, className: string }> = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const SortingDemo: React.FC = () => {
    const [phase, setPhase] = useState(0); 
    const [isVisible, setIsVisible] = useState(false);
    const [activeAnalysisCard, setActiveAnalysisCard] = useState<DemoItem | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const items: DemoItem[] = useMemo(() => [
        { id: 1, image: "https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'person', tag: 'Family', rating: 5, metrics: { blurHash: "OK", aestheticScore: 9.4 } },
        { id: 2, image: "https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'landscape', tag: 'Nature', rating: 5, metrics: { blurHash: "OK", aestheticScore: 8.9 } },
        { id: 13, image: "https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'video', tag: 'Roadtrip.mp4', rating: 5, metrics: { blurHash: "OK", aestheticScore: 9.2, duration: "0:42", audioDetected: true, motionStability: "High" } },
        { id: 3, image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=400&auto=format&fit=crop", type: 'document', tag: 'Receipt', isJunk: true, rating: 1, metrics: { blurHash: "SCAN_ONLY", aestheticScore: 1.2, rejectionReason: "Non-Hærloom Document" } },
        { id: 4, image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'person', tag: 'Alex', rating: 4, metrics: { blurHash: "OK", aestheticScore: 8.1 } },
        { id: 14, image: "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'video', tag: 'Candlelight.mov', rating: 4, metrics: { blurHash: "DARK", aestheticScore: 7.4, duration: "0:15", audioDetected: false, motionStability: "Tripod" } },
        { id: 6, image: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=400&auto=format&fit=crop", type: 'junk', tag: 'Screenshot', isJunk: true, rating: 1, metrics: { blurHash: "JUNK", aestheticScore: 0.8, rejectionReason: "System Screenshot" } },
        { id: 7, image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'object', tag: 'Cuisine', rating: 5, metrics: { blurHash: "OK", aestheticScore: 9.1 } },
        { id: 15, image: "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'video', tag: 'Speech.mp4', rating: 5, metrics: { blurHash: "OK", aestheticScore: 8.8, duration: "2:30", audioDetected: true, motionStability: "Handheld" } },
        { id: 10, image: "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=400", type: 'landscape', tag: 'Alps', rating: 5, metrics: { blurHash: "OK", aestheticScore: 9.2 } },
        { id: 11, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop", type: 'person', tag: 'Sarah', rating: 4, metrics: { blurHash: "OK", aestheticScore: 8.5 } },
        { id: 12, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop", type: 'person', tag: 'Sarah (Dup)', isDuplicate: true, rating: 3, metrics: { blurHash: "OK", aestheticScore: 7.9, rejectionReason: "Similar Content Grouping" } },
    ], []);

    const startAnimation = useCallback(() => {
        setPhase(0);
        setActiveAnalysisCard(null);
        
        setTimeout(() => {
            setPhase(1); 
            setActiveAnalysisCard(items[2]);
        }, 1500); 

        setTimeout(() => {
            setPhase(2); 
            setActiveAnalysisCard(items[6]);
        }, 3500); 

        setTimeout(() => {
            setPhase(3); 
            setActiveAnalysisCard(items[8]);
        }, 5500); 

        setTimeout(() => {
            setPhase(4); 
            setActiveAnalysisCard(null);
        }, 8000); 
    }, [items]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    startAnimation();
                }
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isVisible, startAnimation]);

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col gap-6 relative">
            <div className="flex justify-between items-center bg-[#0B101B]/80 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-teal-500/20 shadow-2xl relative z-40">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-md animate-pulse" />
                        <BrainCircuit size={20} className="text-teal-400 relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                            {phase === 0 && "Ingesting Life Library..."}
                            {phase === 1 && "Mapping Temporal Fragments..."}
                            {phase === 2 && "Filtering Digital Entropy..."}
                            {phase === 3 && "Scoring Aural & Visual Peaks..."}
                            {phase >= 4 && "Archive Timeline Purified"}
                        </span>
                        <div className="h-1 w-32 bg-white/5 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-teal-500 transition-all duration-1000" 
                                style={{ width: `${(phase / 4) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-teal-400 font-bold bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/20">
                    {phase === 0 && "Inbound Processing"}
                    {phase === 1 && "Frames Sampled"}
                    {phase === 2 && "Entropy Nullified"}
                    {phase >= 3 && "Peaks Identified"}
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 flex-grow p-4 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner relative overflow-hidden">
                {activeAnalysisCard && phase < 4 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[50] w-72 animate-fade-in pointer-events-none">
                        <div className="bg-[#0B101B] border border-teal-500/30 rounded-2xl p-5 shadow-3xl backdrop-blur-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                                    {activeAnalysisCard.type === 'video' ? <Film size={16}/> : <BarChart3 size={16} />}
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
                                    {activeAnalysisCard.type === 'video' ? 'Deep Frame Scan' : 'Aesthetic Index'}
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {activeAnalysisCard.type === 'video' ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Temporal Density</span>
                                            <span className="text-[9px] font-mono font-bold text-teal-400">{activeAnalysisCard.metrics.duration}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Aural Layer</span>
                                            <span className="text-[9px] font-mono font-bold text-teal-400">ACTIVE</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Clarity Score</span>
                                            <span className="text-[9px] font-mono font-bold text-teal-400">98.2%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Emotional Rank</span>
                                            <span className="text-[9px] font-mono font-bold text-white">HI-PEAK</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {phase < 4 && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-[scan_3s_ease-in-out_infinite] z-30" />
                )}

                {items.map((item) => {
                    const isRemoved = phase >= 2 && (item.isDuplicate || item.isJunk || item.metrics.blurHash === 'FAIL');
                    const showTag = phase >= 1;
                    const isKeeper = phase >= 4 && !isRemoved;
                    const isBeingAnalyzed = activeAnalysisCard?.id === item.id && phase < 4;
                    const isVideo = item.type === 'video';
                    
                    return (
                        <div 
                            key={item.id} 
                            className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] bg-slate-900 border
                                ${isBeingAnalyzed ? 'border-teal-400 ring-2 ring-teal-400/20 z-10 scale-[1.03]' : 'border-white/5'}
                                ${isRemoved ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                                ${isKeeper ? 'ring-2 ring-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.3)] z-10 scale-105' : ''}
                            `}
                        >
                            <img src={item.image} className={`w-full h-full object-cover transition-all duration-700 ${phase >= 1 && isRemoved ? 'grayscale' : ''}`} alt="" />
                            {isVideo && !isRemoved && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <PlayCircle size={24} className="text-white/80" />
                                </div>
                            )}
                            {phase === 2 && (item.isDuplicate || item.isJunk || item.metrics.blurHash === 'FAIL') && (
                                <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center animate-pulse z-20">
                                    <Trash2 size={16} className="text-white drop-shadow-md mb-1" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {phase === 4 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050811]/60 backdrop-blur-md animate-fade-in z-[60] p-8 text-center">
                        <div className="bg-teal-500 text-white px-10 py-6 rounded-[2.5rem] shadow-3xl flex flex-col items-center gap-4 transform hover:scale-105 transition-transform cursor-pointer" onClick={startAnimation}>
                            <TrendingDown size={40} strokeWidth={3} />
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-1">Archive Purified</h4>
                                <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">80% Digital Noise Removed</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`@keyframes scan { 0% { top: 0%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
        </div>
    );
};

const ArchivistLandingPage: React.FC<ArchivistLandingPageProps> = ({ onNavigate, onStartOptimization }) => {
    return (
        <div className="min-h-screen bg-[#050811] text-white selection:bg-cyan-500/30">
            {/* Fix: Removed unsupported 'subtitle' prop from PageHeader */}
            <PageHeader title="Archive Rescue™" onBack={() => onNavigate(Page.Landing)} />

            <main className="pt-24 pb-40">
                {/* HERO SECTION */}
                <section className="relative py-24 md:py-40 px-6 overflow-hidden">
                    <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="text-left animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] border border-teal-500/20 mb-10">
                                <Sparkles size={14} className="animate-pulse" /> neural reclamation active
                            </div>
                            <h1 className="text-5xl md:text-8xl font-brand font-bold text-white tracking-tighter leading-[0.9] mb-10">
                                Chaos to <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">
                                    Masterpiece.
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 font-serif italic mb-12 leading-relaxed max-w-xl">
                                "Hand your digital fragments to æterny. We identify action peaks, transcribe hidden oral histories, and stabilize your family's story into a centennial vault."
                            </p>
                            <button 
                                onClick={onStartOptimization}
                                className="h-16 px-12 bg-teal-500 hover:bg-teal-400 text-white font-black rounded-2xl text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-teal-900/40 flex items-center gap-4"
                            >
                                Initiate Archive Rescue™ <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="w-full aspect-[4/5] relative">
                             <SortingDemo />
                        </div>
                    </div>
                </section>

                {/* MISSION TIER SECTION */}
                <section className="py-40 px-6 bg-black/40">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-24 space-y-6">
                            <h2 className="text-4xl md:text-8xl font-brand font-bold tracking-tighter text-white">Rescue Missions.</h2>
                            <p className="text-slate-400 font-serif italic text-xl max-w-2xl mx-auto">"Select the scale of your life's reclamation. Each mission includes bit-perfect original preservation and deep neural indexing."</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
                            {[
                                { 
                                    name: "The Personal Epoch", 
                                    capacity: "100 GB", 
                                    price: "€149", 
                                    desc: "One life. One decade of primary device history reclaimed.",
                                    features: ["Personal Timeline Stabilization", "Action-Peak Extraction", "Oral History Transcribed"]
                                },
                                { 
                                    name: "The Household Foundation", 
                                    capacity: "500 GB", 
                                    price: "€349", 
                                    popular: true,
                                    desc: "The nuclear family. Merging multi-device archives into a single house.",
                                    features: ["Multi-Perspective Weaving", "Kinship Neural Mapping", "Bit-Perfect Original Vault"]
                                },
                                { 
                                    name: "The Dynasty Ingestion", 
                                    capacity: "2 TB", 
                                    price: "€799", 
                                    desc: "Multi-generational legacy. Hard drive rescues and lifetime archives.",
                                    features: ["Massive Media Reclamation", "Centennial Succession Setup", "Full Vocal Signature Priming"]
                                }
                            ].map((plan, i) => (
                                <div key={i} className={`relative p-10 md:p-12 rounded-[3.5rem] border transition-all duration-700 flex flex-col ${plan.popular ? 'bg-white/[0.04] border-teal-500/50 shadow-2xl scale-105 z-10' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-black px-8 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-xl border border-teal-400/30">
                                            Foundational Choice
                                        </div>
                                    )}
                                    <div className="mb-12 text-left">
                                        <h4 className="text-2xl font-brand font-bold text-white mb-2">{plan.name}</h4>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-6xl font-brand font-bold text-white tracking-tighter">{plan.price}</span>
                                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ mission</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-6 text-teal-400 font-mono text-sm font-bold">
                                            <HardDrive size={16} /> {plan.capacity} Vault Boundary
                                        </div>
                                        <p className="text-sm text-slate-400 font-serif italic leading-relaxed">"{plan.desc}"</p>
                                    </div>
                                    <ul className="space-y-6 mb-16 flex-grow text-left">
                                        {plan.features.map((feat, fi) => (
                                            <li key={fi} className="flex items-center gap-4 group/feat">
                                                <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
                                                    <CheckCircle size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={onStartOptimization}
                                        className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl ${plan.popular ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-900/40' : 'bg-white text-black hover:bg-slate-100'}`}
                                    >
                                        Initiate Ingestion
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ArchivistLandingPage;