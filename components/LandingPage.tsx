
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
    Play, Check, X, Menu, ChevronRight, Volume2, Quote, 
    Bot, History, Book, Smile, Loader2,
    MapPin, CloudSun, Users, Flame, TreePine,
    Layers, User, BrainCircuit,
    ArrowRight, Sparkles, ShieldCheck, Database, Clock, 
    Smartphone, Lock, Eye, ArrowUpRight, Star, Globe, 
    Clapperboard, CheckCircle2, TrendingDown, UploadCloud, Target, Landmark,
    Activity, Milestone, RotateCcw, Shield, HardDrive, Zap, CheckCircle2 as CheckCircleIcon,
    ImageIcon, Trash2, Plus, Minus, Instagram, Facebook, Twitter, Mail,
    MessageSquare, Phone, Map, ShieldAlert, FileText, ExternalLink,
    QrCode, Smartphone as SmartphoneIcon, Ghost,
    Infinity, Mic, Compass, Globe2,
    Server
} from 'lucide-react';
import { Page, UserTier, StoryStyle, Language } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import BrandLogo from './BrandLogo';
import XIcon from './icons/XIcon';
import { ASSETS } from '../data/assets';
import { textToSpeech } from '../services/geminiService';
import { CookieArtifact } from './CookieManager';
import { getOptimizedUrl } from '../services/cloudinaryService';

const LANDING_CONTENT = {
    NAV: {
        HOW_IT_WORKS: "How It Works",
        THE_MAGIC: "The Magic",
        ARCHIVIST: "Archivist",
        LOG_IN: "Log In",
        START_FREE: "Start Free"
    },
    PRICING: {
        HEADLINE: "Simple Pricing for your Family's Memories.",
        SUBLINE: "Archiving a life requires commitment and architectural stability. Select the foundation for your history.",
        BADGE: "MOST PREFERRED",
        LEGACY_BADGE: "COMING SOON"
    }
} as const;

const SmartImage: React.FC<{
    src: string;
    fallback?: string;
    alt?: string;
    className?: string;
    width?: number;
}> = ({ src, fallback, alt = "", className = "", width }) => {
    const optimizedSrc = useMemo(() => getOptimizedUrl(src, width), [src, width]);
    const [imgSrc, setImgSrc] = useState(optimizedSrc);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setImgSrc(optimizedSrc);
        setIsError(false);
    }, [optimizedSrc]);

    const handleError = () => {
        if (!isError) {
            setIsError(true);
            setImgSrc(fallback || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop");
        }
    };

    return (
        <img 
            src={imgSrc} 
            alt={alt} 
            className={className} 
            onError={handleError}
            loading="lazy"
        />
    );
};

const FAQ_DATA = [
    {
        category: "Privacy & Sovereignty",
        question: "How does æternacy guarantee absolute privacy for my family media?",
        answer: "Privacy is built into our architecture. Unlike generic AI platforms, we use 'Isolated RAG' technology. Your personal history is stored in a private mathematical silo that never contributes to global model training. Your stories remain yours, cryptographically sealed and accessible only by you and your designated successors."
    },
    {
        category: "The Centennial Promise",
        question: "What happens to my archive in 50 or 100 years?",
        answer: "æternacy is built on a Centennial Charter. Our 'Endowment' model pre-funds storage and compute costs for decades. Furthermore, our 'Succession Protocol' automatically triggers according to your rules (e.g., after a period of inactivity), ensuring your legacy is handed over to your verified kin without technical friction."
    },
    {
        category: "Data Ownership",
        question: "Can I export my original photos and videos at any time?",
        answer: "Yes. Sovereignty is one of our core pillars. You can download your entire archive—including bit-perfect original files and AI-generated narratives—in a standardized 'Sovereign Timeline' format that can be viewed offline without any æternacy infrastructure."
    },
    {
        category: "Neural Crædits",
        question: "What are Neural Crædits and how are they consumed?",
        answer: "Neural Crædits (or Tokæn) are the compute units of our platform. They fund the specialized GPU cycles required for AI story synthesis, vocal signature calibration, and video rendering. Every plan includes a generous monthly allocation. Standard story drafting uses minimal credits, while high-intensity tasks like manifesting 'Living Frames' use more, ensuring premium resources are available for your most important memories."
    },
    {
        category: "AI Storytelling",
        question: "How does the AI storytelling actually work?",
        answer: "Our neural engine doesn't just store files; it listens to them. It identifies 'action peaks' in videos, maps emotional arcs in photos, and transcribes spoken words. It then synthesizes these fragments into a first-person narrative that captures the 'vibe' and emotion of the moment, rather than just the facts."
    },
    {
        category: "Family Collaboration",
        question: "Is there a limit to how many family members I can invite?",
        answer: "Our Fæmily plans start with 6 seats, allowing for a core household and grandparents. The Fæmily Plus tier expands this to 12. For larger lineages or dynasties, we offer bespoke architectural setups that can accommodate hundreds of collaborators across multiple branches."
    }
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-32 md:py-48 bg-[#050811] px-6 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">Inquiries</span>
                    <h2 className="text-4xl md:text-7xl font-brand font-bold text-white tracking-tighter">Your Questions, <br/> Answered.</h2>
                </div>
                
                <div className="space-y-4">
                    {FAQ_DATA.map((item, index) => (
                        <div 
                            key={index}
                            className={`rounded-3xl border transition-all duration-500 overflow-hidden ${openIndex === index ? 'bg-white/[0.03] border-white/10 shadow-2xl' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-8 flex items-center justify-between text-left group"
                            >
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500/60 block">{item.category}</span>
                                    <span className={`text-lg md:text-xl font-bold font-brand tracking-tight transition-colors ${openIndex === index ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                        {item.question}
                                    </span>
                                </div>
                                <div className={`shrink-0 ml-4 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-cyan-500 text-black rotate-180 border-cyan-400' : 'text-slate-500'}`}>
                                    {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </button>
                            <div 
                                className={`transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] overflow-hidden ${openIndex === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-8 pb-10">
                                    <p className="text-slate-400 font-serif italic text-lg leading-relaxed">
                                        "{item.answer}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ArchivistTeaser: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="bg-gradient-to-b from-[#0B1224] to-[#050811] py-24 md:py-40 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(6,182,212,0.05)_0%,_transparent_60%)] pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex-1 space-y-8 text-left animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-400 text-[10px] font-black uppercase tracking-[0.4em]">
                    <Database size={14} className="text-teal-500" /> NEURAL ARCHIVIST
                </div>
                <h2 className="text-5xl md:text-8xl font-brand font-bold text-white tracking-tighter leading-tight drop-shadow-2xl">
                    Drowning in <br/> 10,000+ Photos & Videos?
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 font-serif italic leading-relaxed max-w-2xl mx-auto">
                    "Let <span className="text-white">æterny archivist</span> optimize your chaos. We find the iconic moments so you don't have to."
                </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-3 gap-3 mb-12 w-full lg:w-[480px]">
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-cyan-500/20 transition-all duration-500 group">
                        <BrainCircuit size={28} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-white leading-tight">CLUSTERS THEMES & SECTIONS</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-cyan-500/20 transition-all duration-500 group">
                        <Sparkles size={28} className="text-teal-400 group-hover:scale-110 transition-transform" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-white leading-tight">SELECTS ICONIC FRAMES</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-cyan-500/20 transition-all duration-500 group">
                        <TrendingDown size={28} className="text-cyan-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-white leading-tight">80% STORAGE SAVED</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 w-full justify-end">
                    <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">PRICING STRATEGY</p>
                        <p className="text-lg font-bold text-white tracking-tight">From €49 for 10,000 photos & videos</p>
                    </div>
                    <button 
                        onClick={() => onNavigate(Page.Archivist)}
                        className="h-16 px-12 bg-[#00C2A0] hover:bg-[#00D9B3] text-slate-950 font-black rounded-2xl text-[11px] uppercase tracking-[0.25em] shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
                    >
                        LEARN MORE <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    </section>
);

const LegacyDistinction: React.FC<{ onScrollToPricing: () => void }> = ({ onScrollToPricing }) => {
    return (
        <section id="comparison" className="py-20 md:py-28 bg-[#050811] px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-50">The Distinction</span>
                    <h2 className="text-4xl md:text-6xl font-brand font-bold text-white tracking-tighter leading-none">Storage vs. Legacy</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="relative p-10 md:p-14 bg-slate-900/50 backdrop-blur-md flex flex-col">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                                <Ghost size={20} />
                            </div>
                            <h3 className="text-xl font-bold font-brand text-slate-400 uppercase tracking-widest">Standard Cloud</h3>
                        </div>

                        <div className="space-y-8 flex-grow">
                            <p className="text-lg text-slate-500 font-serif italic leading-relaxed">
                                "An unorganized graveyard of silent files, buried under generic utility."
                            </p>
                            
                            <ul className="space-y-4">
                                {[
                                    "Messy camera rolls full of digital clutter",
                                    "Static, silent files without narrative context",
                                    "Generic utility focused on GB pricing",
                                    "No protocol for long-term legacy transfer",
                                    "Data is used for global model training"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-500 group">
                                        <X size={16} className="shrink-0 mt-0.5 text-slate-700 group-hover:text-red-500/40 transition-colors" />
                                        <span className="text-xs font-medium tracking-wide">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="relative p-10 md:p-14 bg-[#080C14] flex flex-col group/archive">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none group-hover/archive:bg-cyan-500/10 transition-colors duration-1000" />
                        
                        <div className="relative z-10">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse">
                                    <Clock size={20} />
                                </div>
                                <h3 className="text-xl font-bold font-brand text-white uppercase tracking-widest">The Living Archive</h3>
                            </div>

                            <div className="space-y-8 flex-grow">
                                <p className="text-lg text-cyan-100 font-serif italic leading-relaxed drop-shadow-sm">
                                    "A living, woven timeline protected by high-availability neural architecture."
                                </p>
                                
                                <ul className="space-y-4">
                                    {[
                                        "Intelligently curated life chapters",
                                        "Living, breathing first-person narratives",
                                        "Dedicated personal biographer (æterny)",
                                        "Succession protocol for verified kin",
                                        "Absolute sovereignty & zero-training silos"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-300">
                                            <div className="w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/20">
                                                <Check size={10} className="text-cyan-400" strokeWidth={3} />
                                            </div>
                                            <span className="text-xs font-bold tracking-wide text-white/90">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <button 
                                    onClick={onScrollToPricing}
                                    className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                >
                                    Choose Presence Over Storage <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface HeroSlide {
    id: number;
    headline: React.ReactNode;
    subline: string;
    image: string;
    fallback: string;
}

interface LandingPageProps {
    onLogin: () => void;
    onRegister: (tier?: UserTier) => void;
    onSkipForDemo: () => void;
    onNavigate: (page: Page) => void;
    onStartDemo: () => void;
    onOpenArchivist?: () => void;
    language?: Language;
    onLanguageChange?: (lang: Language) => void;
}

interface ExperienceDemoProps {
    onStartOwnStory: () => void;
    onUploadOwnMedia: () => void;
}

const ExperienceDemo: React.FC<ExperienceDemoProps> = ({ onStartOwnStory, onUploadOwnMedia }) => {
    const [step, setStep] = useState<'chaos' | 'analyzing' | 'weaving' | 'decision' | 'cinematic'>('chaos');
    const [activeStyle, setActiveStyle] = useState<StoryStyle>('nostalgic');
    const [activeVoice, setActiveVoice] = useState<'female' | 'male'>('female');
    const [analysisPhase, setAnalysisPhase] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentSubtitle, setCurrentSubtitle] = useState(0);
    const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
    const [isCinematicFinished, setIsCinematicFinished] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    const [typedTitle, setTypedTitle] = useState("");
    const [typedText, setTypedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const demoNarratives: Record<StoryStyle, { title: string, text: string[] }> = {
        nostalgic: {
            title: "The Yosemite Solitude.",
            text: [
                "The air in the Valley tasted like ancient stone and cold pine.",
                "In that moment, between the giants of granite and the evening mist...",
                "The world felt quiet, and our presence felt permanent.",
                "It wasn't just a trip; it was an anchor point in our family history."
            ]
        },
        poetic: {
            title: "Echoes of the Granite.",
            text: [
                "Where the mountains touch the twilight, we found our haven.",
                "Every shadow cast by El Capitan is a line in our unwritten book.",
                "A symphony of silver light and velvet stillness, frozen in time.",
                "We carry the weight of these heights in our souls, forever."
            ]
        },
        journal: {
            title: "Log: El Cap Base.",
            text: [
                "September 14, 2024. 18:45. Yosemite Valley. Visibility: High.",
                "Atmospheric conditions settled at 8°C. Family reached the basin trail.",
                "Captured the transition from golden hour to the deep valley blue.",
                "A technical achievement in memory, a spiritual one in kinship."
            ]
        },
        lighthearted: {
            title: "The Great Mosquito War.",
            text: [
                "The view was 10/10. The bug situation? Easily a 2/10.",
                "Dad insisted on 'one more photo' while we were being eaten alive.",
                "But looking at this now... okay, Dad, you were right. It's stunning.",
                "Next time, we bring extra spray and twice the marshmallows!"
            ]
        }
    };

    const analysisData = [
        { icon: MapPin, label: "Environment", value: "Yosemite Valley", pos: "top-[15%] left-[10%] sm:left-[15%]" },
        { icon: CloudSun, label: "Atmosphere", value: "Clear Night / 8°C", pos: "top-[15%] right-[10%] sm:right-[20%]" },
        { icon: Database, label: "Digital Threads", value: "Analyzing 934 Items", pos: "top-[45%] left-[5%] sm:left-[10%]" },
        { icon: Sparkles, label: "Story Weight", value: "Iconic Peaks Found", pos: "top-[45%] right-[5%] sm:right-[10%]" },
        { icon: Users, label: "Kinship", value: "The Miller Family", pos: "bottom-[25%] left-[15%] sm:left-[25%]" },
        { icon: Flame, label: "Activity", value: "Valley Exploration", pos: "bottom-[20%] right-[10%] sm:right-[15%]" }
    ];

    const demoImages = [
        'https://images.unsplash.com/photo-1523978591478-c75394478-c75394478?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        'https://images.pexels.com/photos/1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-center?auto=compress&cs=tinysrgb&w=1200&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop'
    ];

    const chaosClusters = useMemo(() => [
        { x: 12, y: 20, rotate: -15, images: [demoImages[1], demoImages[2]] },
        { x: 18, y: 35, rotate: 10, images: [demoImages[3]] },
        { x: 82, y: 25, rotate: 12, images: [demoImages[0], demoImages[4]] },
        { x: 75, y: 40, rotate: -8, images: [demoImages[1]] },
        { x: 15, y: 62, rotate: 8, images: [demoImages[4], demoImages[2]] },
        { x: 22, y: 70, rotate: -12, images: [demoImages[3]] },
        { x: 88, y: 55, rotate: -18, images: [demoImages[0], demoImages[2]] },
        { x: 82, y: 55, rotate: 5, images: [demoImages[1]] },
        { x: 45, y: 15, rotate: 5, images: [demoImages[2]] },
        { x: 55, y: 72, rotate: -5, images: [demoImages[4]] }
    ], []);

    const handleStartMagic = () => {
        setStep('analyzing');
        setAnalysisPhase(0);
    };

    const cleanupAudio = useCallback(() => {
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch (e) {}
            audioSourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (step === 'analyzing') {
            const timer = setInterval(() => {
                setAnalysisPhase(prev => {
                    if (prev >= analysisData.length - 1) {
                        clearInterval(timer);
                        setTimeout(() => setStep('weaving'), 1000);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1200); 
            return () => clearInterval(timer);
        }
    }, [step]);

    useEffect(() => {
        if (step === 'weaving') {
            setTypedTitle("");
            setTypedText("");
            setIsTyping(true);
            
            const fullTitle = demoNarratives[activeStyle].title;
            const fullText = demoNarratives[activeStyle].text.join(" ");
            
            let titleIdx = 0;
            const titleInterval = setInterval(() => {
                setTypedTitle(fullTitle.slice(0, titleIdx + 1));
                titleIdx++;
                if (titleIdx === fullTitle.length) {
                    clearInterval(titleInterval);
                    let textIdx = 0;
                    const textInterval = setInterval(() => {
                        setTypedText(fullText.slice(0, textIdx + 1));
                        textIdx++;
                        if (textIdx === fullText.length) {
                            clearInterval(textInterval);
                            setIsTyping(false);
                            setTimeout(() => setStep('decision'), 2000);
                        }
                    }, 15);
                }
            }, 30);

            return () => {
                clearInterval(titleInterval);
            };
        }
    }, [activeStyle, step]);

    useEffect(() => {
        if (step !== 'cinematic' || isCinematicFinished) return;
        
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % demoImages.length);
        }, 5000);
        
        const subInterval = setInterval(() => {
            setCurrentSubtitle(prev => (prev + 1) % demoNarratives[activeStyle].text.length);
        }, 4000);
        
        return () => {
            clearInterval(slideInterval);
            clearInterval(subInterval);
        };
    }, [step, isCinematicFinished, activeStyle]);

    const handleReset = () => {
        cleanupAudio();
        setStep('chaos');
        setIsGeneratingVoice(false);
        setIsCinematicFinished(false);
        setAnalysisPhase(0);
        setCurrentSlide(0);
        setCurrentSubtitle(0);
        setTypedTitle("");
        setTypedText("");
    };

    const handleStartCinematic = async () => {
        setIsGeneratingVoice(true);
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = ctx;
        
        try {
            if (ctx.state === 'suspended') await ctx.resume();
            const textToRead = demoNarratives[activeStyle].text.join(" ");
            const buffer = await textToSpeech(textToRead, ctx, activeVoice === 'female' ? 'Sarah' : 'David');
            
            if (buffer) {
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => {
                    setIsCinematicFinished(true);
                };
                source.start();
                audioSourceRef.current = source;
            }
            setIsGeneratingVoice(false);
            setStep('cinematic');
        } catch (err) {
            console.error("Narration failed", err);
            setIsGeneratingVoice(false);
            setStep('cinematic'); 
        }
    };

    const kenBurnsAnimations = [
        'animate-[ken-burns-in_20s_linear_infinite]',
        'animate-[ken-burns-out_20s_linear_infinite]',
        'animate-[ken-burns-left_20s_linear_infinite]',
        'animate-[ken-burns-right_20s_linear_infinite]'
    ];

    const activeAnalysisImageIdx = useMemo(() => {
        if (analysisPhase < 2) return 0;
        if (analysisPhase < 4) return 2;
        return 4;
    }, [analysisPhase]);

    return (
        <div className="w-full max-w-6xl mx-auto relative group px-2 sm:px-4">
            <div className="absolute inset-0 z-0 bg-cyan-500/5 rounded-2xl md:rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="relative bg-[#050811] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[750px] flex flex-col shadow-2xl backdrop-blur-3xl">
                
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050811] via-10% via-[#050811]/95 to-transparent pointer-events-none z-40"></div>
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050811]/40 via-[#050811]/20 to-transparent pointer-events-none z-40"></div>

                <div className="px-4 sm:px-8 py-3 sm:py-6 border-b border-white/5 flex justify-between items-center bg-black/40 z-50">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <Bot size={16} className={step === 'weaving' || step === 'analyzing' ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-0.5">æterny AI Curator</p>
                            <h3 className="text-[10px] sm:text-sm font-bold text-white tracking-tight">
                                {step === 'chaos' ? 'Unsorted Photos & Videos' : step === 'analyzing' ? 'Deep Ingestion Sequence' : step === 'weaving' ? 'Narrative Weave Active' : step === 'decision' ? 'Chapter Finalized' : 'Cinema Projection'}
                            </h3>
                        </div>
                    </div>
                    {step !== 'chaos' && (
                        <button onClick={handleReset} className="p-2 text-slate-500 hover:text-white transition-all flex items-center gap-1.5 text-[7px] sm:text-[10px] font-bold uppercase tracking-widest relative z-50">
                            <RotateCcw size={10} /> <span>Reset</span>
                        </button>
                    )}
                </div>

                <div className="flex-grow relative flex items-center justify-center overflow-hidden">
                    {step === 'chaos' && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in p-4 sm:p-6 overflow-hidden">
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-30 transition-all duration-1000">
                                {chaosClusters.map((cluster, ci) => (
                                    <div key={ci} className="absolute transition-transform duration-[4s]" style={{ 
                                        left: `${cluster.x}%`, 
                                        top: `${cluster.y}%`, 
                                        transform: `translate(-50%, -50%) rotate(${cluster.rotate}deg)`,
                                        opacity: cluster.y > 60 ? 0.3 : 1
                                    }}>
                                        <div className="relative">
                                            {cluster.images.map((img, ii) => (
                                                <div key={ii} className="absolute w-20 h-28 sm:w-32 sm:h-44 rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-slate-800 transition-all duration-700" style={{ transform: `translate(${ii * 8}px, ${ii * -6}px) rotate(${ii * 5}deg)`, zIndex: ii }}>
                                                    <SmartImage src={img} className="w-full h-full object-cover grayscale opacity-50" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative z-10 w-full max-w-2xl h-full flex flex-col items-center justify-center p-4">
                                <div className="relative w-full h-48 sm:h-80 mb-12 flex items-center justify-center">
                                    {demoImages.map((img, i) => (
                                        <div 
                                            key={i} 
                                            className="absolute w-24 h-32 sm:w-52 sm:h-68 rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-1000"
                                            style={{ 
                                                transform: `translate(${(i - 2) * 25}px, ${(i % 2 ? -10 : 10)}px) rotate(${(i - 2) * 8}deg)`,
                                                zIndex: 10 + i,
                                                opacity: 0.8 + (i * 0.05)
                                            }}
                                        >
                                            <SmartImage src={img} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                        </div>
                                    ))}
                                    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
                                        <div className="bg-black/60 backdrop-blur-md px-4 sm:px-8 py-2 sm:py-4 rounded-full border border-white/20 shadow-2xl">
                                            <span className="text-[8px] sm:text-xs font-black uppercase text-white tracking-[0.5em]">934 Photos & Videos Detected</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleStartMagic} className="group relative h-14 sm:h-20 px-8 sm:px-14 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] sm:text-sm rounded-2xl shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all transform hover:scale-105 active:scale-95">
                                    <span className="relative z-10 flex items-center gap-3">INITIATE ÆTERNY CURATION</span>
                                    <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'analyzing' && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in p-2 sm:p-12 z-20">
                            <div className="relative aspect-[3/4] sm:aspect-[16/9] w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-3xl bg-slate-950">
                                
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                    {demoImages.map((img, i) => (
                                        <div 
                                            key={i} 
                                            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${i === activeAnalysisImageIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                                        >
                                            <SmartImage src={img} className="w-full h-full object-cover brightness-[0.4]" />
                                            {i === activeAnalysisImageIdx && (
                                                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_#06b6d4] animate-[scan_2s_ease-in-out_infinite] z-20"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute inset-0 bg-black/10 z-[5]"></div>
                                
                                {analysisData.map(({ icon: AnalysisIcon, label, value, pos }, idx) => (
                                    <div 
                                        key={label} 
                                        className={`absolute ${pos} flex items-center gap-1.5 sm:gap-3 bg-black/70 backdrop-blur-xl border border-cyan-500/40 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full transition-all duration-700 transform z-30 ${idx <= analysisPhase ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}
                                    >
                                        <div className="w-5 h-5 sm:w-8 h-8 rounded-md sm:rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                            <AnalysisIcon size={10} className="sm:w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[5px] sm:text-[8px] font-black uppercase text-slate-500 tracking-widest">{label}</p>
                                            <p className="text-[7px] sm:text-[10px] font-bold text-white uppercase tracking-tight">{value}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-3 z-30">
                                     <div className="flex items-center gap-1.5">
                                        <BrainCircuit size={12} className="sm:w-4 h-4 text-cyan-400 animate-pulse" />
                                        <p className="text-[7px] sm:text-[10px] font-black uppercase text-cyan-400 tracking-[0.5em] animate-pulse">Neural Sequential Analysis</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'weaving' && (
                        <div className="w-full h-full flex flex-col lg:flex-row gap-6 sm:gap-12 items-center animate-fade-in-up p-4 sm:p-12 z-20">
                            <div className="w-full lg:w-3/5 relative group/card max-w-[400px] sm:max-w-none mx-auto shrink-0">
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-3xl ring-1 ring-white/10 bg-slate-900">
                                    <SmartImage src={demoImages[0]} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col justify-end">
                                        <h2 className="text-lg sm:text-3xl md:text-5xl font-bold font-brand text-white tracking-tighter leading-tight drop-shadow-2xl mb-1.5 sm:mb-4">
                                            {typedTitle}<span className={`inline-block w-1 h-6 sm:h-12 ml-1 bg-cyan-400 ${isTyping ? 'animate-pulse' : 'hidden'}`}></span>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/5 space-y-4 sm:space-y-6 px-2 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <History size={10} className="sm:w-3.5 h-3.5 text-cyan-400" />
                                    <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Curator Synthesis</span>
                                </div>
                                <div className="min-h-[100px]">
                                    <p className="text-xs sm:text-xl lg:text-2xl font-serif italic text-white/90 leading-relaxed">
                                        "{typedText}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'decision' && (
                        <div className="flex flex-col items-center justify-center animate-fade-in text-center space-y-8 p-12 max-w-2xl mx-auto h-full z-20">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                <CheckCircle2 size={32} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-brand font-bold text-white tracking-tighter">Memories Manifested.</h3>
                                <p className="text-slate-400 font-serif italic text-lg leading-relaxed">
                                    "Your fragments have been synthesized into a living chapter. How shall we preserve it?"
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <button 
                                    onClick={onStartOwnStory} 
                                    className="h-14 bg-white text-black font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    Start Your Own Story <ArrowRight size={14} />
                                </button>
                                <button 
                                    onClick={handleStartCinematic} 
                                    disabled={isGeneratingVoice}
                                    className="h-14 bg-cyan-500 text-white font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isGeneratingVoice ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} 
                                    Experience the Story
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'cinematic' && (
                        <div className="absolute inset-0 z-[100] bg-black animate-fade-in flex flex-col items-center justify-center">
                            <div className={`absolute inset-0 overflow-hidden z-0 transition-all duration-1000 ${isCinematicFinished ? 'blur-md scale-105 opacity-50' : ''}`}>
                                {demoImages.map((img, i) => (
                                    <div key={i} className={`absolute inset-0 transition-opacity duration-[2000ms] ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`} >
                                        <SmartImage src={img} className={`w-full h-full object-cover brightness-[0.5] scale-110 ${i === currentSlide && !isCinematicFinished ? kenBurnsAnimations[i % kenBurnsAnimations.length] : ''}`} />
                                    </div>
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-20"></div>
                            </div>
                            
                            {!isCinematicFinished ? (
                                <div className="absolute inset-0 z-30 flex items-center justify-center px-6 sm:px-12 text-center pointer-events-none">
                                    <div className="max-w-4xl animate-fade-in-up" key={currentSubtitle}>
                                        <p className="px-2 sm:px-10 py-4 sm:py-6 text-white font-serif italic text-base sm:text-3xl md:text-5xl leading-tight drop-shadow-2xl">
                                            "{demoNarratives[activeStyle].text[currentSubtitle]}"
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-[150] animate-fade-in-up flex flex-col items-center gap-8 max-w-lg text-center px-6">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-2xl mb-4">
                                        <Sparkles size={40} className="animate-pulse" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-brand font-bold text-white tracking-tighter drop-shadow-2xl">Your Legacy Starts Here.</h2>
                                    <p className="text-slate-300 font-serif italic text-lg leading-relaxed drop-shadow-xl">
                                        "This was a simulation of one chapter. Preserve your entire house for the next hundred years."
                                    </p>
                                    <button 
                                        onClick={onStartOwnStory} 
                                        className="group h-14 sm:h-20 bg-white text-black font-black py-6 px-16 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-4 active:scale-95"
                                    >
                                        Start Your Story Now <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}

                            <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
                                <div className="bg-cyan-500/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <Clapperboard size={12} className="text-cyan-400" />
                                    <span className="text-[8px] font-black uppercase text-cyan-400 tracking-widest">Neural Living Frame</span>
                                </div>
                            </div>

                            <div className="absolute bottom-12 right-12 z-50 flex items-center gap-5">
                                <button onClick={handleReset} className="w-14 h-14 bg-white text-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white/10" >
                                    <X size={28} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                @keyframes vocal-wave { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(2.5); } }
                .animate-vocal-wave { animation: vocal-wave 0.8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onNavigate, onStartDemo, onOpenArchivist, language = 'en', onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevActiveSlide, setPrevActiveSlide] = useState(-1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoMenuRef = useRef<HTMLDivElement>(null);
  
  const slides: HeroSlide[] = [
    {
      id: 0,
      headline: <>Your Story, <br /> Eternalized.</>,
      subline: 'Preserve your family\'s photos & videos with AI-powered storytelling',
      image: ASSETS.LANDING.HERO_SLIDES[0].url,
      fallback: ASSETS.LANDING.HERO_SLIDES[0].fallback,
    },
    {
      id: 1,
      headline: <>10,000+ Photos & Videos. <br /> One Continuous <br /> Life Story.</>,
      subline: 'Preserve your family\'s photos & videos with AI-powered storytelling',
      image: ASSETS.LANDING.HERO_SLIDES[1].url,
      fallback: ASSETS.LANDING.HERO_SLIDES[1].fallback,
    },
    {
      id: 2,
      headline: <>Built for the <br /> Next Hundred <br /> Years.</>,
      subline: 'Preserve your family\'s photos & videos with AI-powered storytelling',
      image: ASSETS.LANDING.HERO_SLIDES[2].url,
      fallback: ASSETS.LANDING.HERO_SLIDES[2].fallback,
    }
  ];

  const pricingData = useMemo(() => {
    const isYearly = billingCycle === 'yearly';
    return [
      {
        id: 'essæntial',
        name: 'ESSÆNTIAL',
        price: isYearly ? '7.49' : '8.99',
        totalYearly: '89.90',
        savings: '17.98',
        description: '"Securing the personal archive of a single individual."',
        cta: 'SELECT PLAN',
        features: [
          { text: '2,000 Photos & Videos', icon: ImageIcon },
          { text: '75 GB Secure Storage', icon: ShieldCheck },
          { text: '50 AI Stories / month', icon: Sparkles, subtext: 'Additional stories: €0.10 each' },
          { text: 'Personal Vault', icon: Lock },
          { text: 'Permanent Guarantee', icon: Shield }
        ],
        accent: 'border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)] hover:border-cyan-500/40',
        color: 'text-cyan-400',
        iconColor: 'text-cyan-400',
        popular: false
      },
      {
        id: 'fæmily',
        name: 'FÆMILY',
        price: isYearly ? '12.49' : '14.99',
        totalYearly: '149.90',
        savings: '29.98',
        description: '"Found your digital house and connect your kin."',
        cta: 'SELECT PLAN',
        popular: true,
        features: [
          { text: '8,000 Photos & Videos', icon: ImageIcon },
          { text: '300 GB Base Storage', icon: ShieldCheck },
          { text: '200 AI Stories / month', icon: Sparkles, subtext: 'Additional stories: €0.10 each' },
          { text: '6 Family Member Seats', icon: Users },
          { text: 'Full Family Home', icon: Landmark }
        ],
        accent: 'border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.15)] hover:border-indigo-500/60',
        color: 'text-indigo-400',
        iconColor: 'text-indigo-400',
      },
      {
        id: 'fæmily_plus',
        name: 'FÆMILY PLUS',
        price: isYearly ? '18.33' : '21.99',
        totalYearly: '219.90',
        savings: '43.98',
        description: '"The expansive framework for a growing dynasty."',
        cta: 'SELECT PLAN',
        features: [
          { text: '15,000 Photos & Videos', icon: ImageIcon },
          { text: '500 GB Secure Storage', icon: ShieldCheck },
          { text: '500 AI Stories / month', icon: Sparkles, subtext: 'Additional stories: €0.10 each' },
          { text: '12 Family Seats', icon: Users },
          { text: 'Priority Processing', icon: Zap }
        ],
        accent: 'border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)] hover:border-purple-500/50',
        color: 'text-purple-400',
        iconColor: 'text-purple-400',
        popular: false
      },
      {
        id: 'lægacy',
        name: 'LÆGACY',
        price: '49.90',
        totalYearly: '499',
        savings: '99.80',
        description: '"Sovereign vaults for lineages that measure time in centuries."',
        cta: 'EXPLORE THE VISION',
        comingSoon: true,
        features: [
          { text: 'Æpoch Synthesis', icon: Infinity },
          { text: 'Vocal Signature Calibration', icon: Mic },
          { text: 'Institutional Endowments', icon: Landmark },
          { text: 'The Biographær (Guided AI)', icon: Bot },
          { text: 'Centennial Access Trust', icon: ShieldCheck }
        ],
        accent: 'border-[#B87D4B]/40 shadow-[0_0_60px_rgba(184,125,75,0.15)] hover:border-[#B87D4B]/60',
        color: 'text-[#B87D4B]',
        iconColor: 'text-[#B87D4B]',
        popular: false
      }
    ];
  }, [billingCycle]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
        setPrevActiveSlide(activeSlide);
        setActiveSlide(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length, activeSlide]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] overflow-x-hidden">
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 py-3.5 sm:py-5 ${isScrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <BrandLogo className="text-white text-[1.15rem] md:text-[2rem]" />
          
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <div className="relative" ref={infoMenuRef}>
              <button 
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="flex items-center hover:opacity-80 transition-all p-1"
                title="Infrastructure Location"
              >
                <img src="https://flagcdn.com/w40/eu.png" alt="EU" className="w-5 h-auto rounded-sm shadow-sm" />
              </button>
              {isInfoOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-[#0A0C14]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 shadow-3xl animate-fade-in-up flex flex-col gap-4 z-[110]">
                    <div className="text-left space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Hosted in Germany (EU)</p>
                        <p className="text-[11px] text-slate-400 font-serif italic leading-relaxed">
                            "æternacy is secured within a high-fidelity infrastructure in Frankfurt, adhering to the highest global privacy standards."
                        </p>
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-cyan-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GDPR COMPLIANT</span>
                    </div>
                </div>
              )}
            </div>

            <button onClick={() => scrollToSection('how-it-works')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">{LANDING_CONTENT.NAV.HOW_IT_WORKS}</button>
            <button onClick={() => scrollToSection('magic-behind-story')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">{LANDING_CONTENT.NAV.THE_MAGIC}</button>
            <button onClick={() => scrollToSection('archivist-teaser')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">{LANDING_CONTENT.NAV.ARCHIVIST}</button>
            <button onClick={onLogin} className="text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:text-cyan-400 transition-colors">{LANDING_CONTENT.NAV.LOG_IN}</button>
            <button onClick={onStartDemo} className="bg-white text-stone-950 font-bold h-11 px-6 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-stone-100 transition-all shadow-lg">{LANDING_CONTENT.NAV.START_FREE}</button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={onLogin} className="text-white font-black text-[10px] uppercase tracking-widest transition-all hover:text-cyan-400">Log In</button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"><Menu size={22} /></button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[200] bg-[#050811] flex flex-col p-8 animate-fade-in md:hidden">
              <div className="flex justify-between items-center mb-12">
                  <BrandLogo className="text-white text-[1.6rem]" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-2 hover:text-white"><X size={32} /></button>
              </div>
              <div className="flex flex-col gap-8 text-center">
                  <div className="flex justify-center gap-4 py-4 border-y border-white/5">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        <img src="https://flagcdn.com/w40/eu.png" alt="EU" className="w-5 h-auto rounded-sm" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">HOSTED IN GERMANY (EU)</span>
                    </div>
                  </div>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-2xl font-bold text-white tracking-widest uppercase">{LANDING_CONTENT.NAV.HOW_IT_WORKS}</button>
                  <button onClick={() => scrollToSection('magic-behind-story')} className="text-2xl font-bold text-white tracking-widest uppercase">{LANDING_CONTENT.NAV.THE_MAGIC}</button>
                  <button onClick={() => scrollToSection('archivist-teaser')} className="text-2xl font-bold text-white tracking-widest uppercase">{LANDING_CONTENT.NAV.ARCHIVIST}</button>
                  <button onClick={onLogin} className="text-xl font-bold text-cyan-400 tracking-widest uppercase">{LANDING_CONTENT.NAV.LOG_IN}</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); onStartDemo(); }} className="h-16 bg-white text-black font-black py-4 rounded-2xl text-sm tracking-[0.2em] uppercase">Start Your Story</button>
              </div>
          </div>
      )}

      <main className="flex-grow">
        <section className="relative min-h-screen flex items-center overflow-hidden bg-black pt-16">
          <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id} 
                    className={`absolute inset-0 transition-opacity duration-[2500ms] 
                        ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <SmartImage 
                    src={slide.image} 
                    fallback={slide.fallback} 
                    className={`w-full h-full object-cover brightness-[0.5] 
                        ${(index === activeSlide || index === prevActiveSlide) ? 'animate-ken-burns-slow' : ''}`} 
                    width={1920} 
                  />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050811] z-10" />
          </div>
          
          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center min-h-[85vh]">
            <div className="relative w-full py-20 sm:py-32">
                {slides.map((slide, index) => (
                    <div 
                      key={slide.id} 
                      className={`col-start-1 row-start-1 transition-all duration-1000 ease-in-out flex flex-col gap-8 md:gap-12 ${ index === activeSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute' }`}
                    >
                      <div className="space-y-6 md:space-y-10">
                        <h1 className="font-brand font-bold text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-white tracking-tighter leading-[1.05] md:leading-[0.88] drop-shadow-2xl"> 
                          {slide.headline} 
                        </h1>
                        <p className="font-serif italic text-xl xs:text-2xl sm:text-3xl text-white/80 leading-relaxed max-xl md:max-w-3xl drop-shadow-xl"> 
                          {slide.subline} 
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-8 pt-4">
                        <button 
                          onClick={onStartDemo} 
                          className="h-14 sm:h-16 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-[0.25em] text-[10px] md:text-xs transition-all duration-300 transform hover:bg-white/20 active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                        >
                          <Play size={16} fill="currentColor" /> START YOUR STORY
                        </button>
                        <button 
                          onClick={() => scrollToSection('pricing')} 
                          className="h-14 sm:h-16 px-8 py-4 rounded-full border border-white/30 text-white/90 font-black uppercase tracking-[0.25em] text-[10px] md:text-xs transition-all duration-300 transform hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                          SEE PLANS <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 sm:py-32 md:py-48 bg-[#050811] px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-50">How It Works</span>
                    <h2 className="text-4xl md:text-7xl font-brand font-bold text-white tracking-tighter">Three Steps to Your <br/> Eternal Story</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: UploadCloud, title: "Upload Your Archive", desc: "We handle the heavy lifting of sorting thousands of photos & videos into meaningful life chapters." },
                        { icon: Sparkles, title: "AI Weaves Your Story", desc: "Our neural engine curates, sequences, and narrates your memories into a unified masterpiece." },
                        { icon: Users, title: "Share with Family", desc: "Invite loved ones to a secure space where they can relive the collective history of your house." }
                    ].map((step, i) => (
                        <div key={i} className="group p-10 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04]">
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner"><step.icon size={32} /></div>
                                <span className="text-6xl font-brand font-bold text-white/5 group-hover:text-white/10">0{i+1}</span>
                            </div>
                            <h3 className="text-2xl font-bold font-brand text-white mb-4">{step.title}</h3>
                            <p className="text-slate-400 font-serif italic leading-relaxed">"{step.desc}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <LegacyDistinction onScrollToPricing={() => scrollToSection('pricing')} />

        <section id="magic-behind-story" className="py-24 sm:py-32 md:py-48 bg-stone-900/20 relative border-t border-white/5 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
                <div className="text-center mb-16 sm:mb-32 space-y-4 sm:space-y-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-50">The Curation Engine</h2>
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-brand font-bold text-white tracking-tighter leading-tight">Magic Behind <br className="xs:hidden" /> Your Story</h2>
                    <p className="text-base sm:text-xl md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
                        "We weave emotions and motion into narratives you can hear and feel."
                    </p>
                </div>
                <ExperienceDemo 
                    onStartOwnStory={onStartDemo}
                    onUploadOwnMedia={onOpenArchivist || (() => {})}
                />
            </div>
        </section>

        <div id="archivist-teaser">
            <ArchivistTeaser onNavigate={onNavigate} />
        </div>

        <section id="trust" className="py-24 sm:py-32 md:py-48 bg-[#050811] border-t border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-brand font-bold text-white tracking-tighter text-center mb-24">Voices of the Legacy.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { name: "Sarah M.", text: "I had 15,000 photos and videos scattered across three clouds. Archive Rescue™ saved every single one, even transcribing old family movies.", img: ASSETS.AVATARS.WOMAN },
                        { name: "David R.", text: "Seeing our family journey as a living book is priceless. The narration is hauntingly beautiful.", img: ASSETS.AVATARS.MAN },
                        { name: "Elena K.", text: "I was skeptical of AI, but æterny feels like a respectful librarian. My data stays private.", img: ASSETS.AVATARS.GRANDMOTHER }
                    ].map((t, i) => (
                        <div key={i} className="group bg-white/[0.02] border border-white/10 p-10 rounded-3xl space-y-8 hover:bg-white/[0.04] transition-all flex flex-col shadow-2xl backdrop-blur-3xl">
                            <Quote size={24} className="text-cyan-500/20" />
                            <p className="text-xl text-slate-200 font-serif italic leading-relaxed flex-grow">"{t.text}"</p>
                            <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                                <img src={t.img} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" alt={t.name} />
                                <div><span className="font-brand font-bold text-white tracking-tighter block">{t.name}</span><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified Member</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="pricing" className="py-32 md:py-48 bg-[#050811] px-6 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10 text-center">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-7xl font-brand font-bold text-white tracking-tighter mb-4">{LANDING_CONTENT.PRICING.HEADLINE}</h2>
                    <p className="text-xl text-slate-400 font-serif italic">"{LANDING_CONTENT.PRICING.SUBLINE}"</p>
                </div>

                <div className="flex justify-center mb-20 animate-fade-in">
                    <div className="bg-[#111111] p-1.5 rounded-full flex items-center border border-white/10 shadow-2xl overflow-hidden">
                        <button 
                            onClick={() => setBillingCycle('monthly')} 
                            className={`h-11 px-10 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${billingCycle === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            MONTHLY
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')} 
                            className={`h-11 px-10 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 ${billingCycle === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            YEARLY <span className="text-link-400 text-[10px] font-black tracking-widest">2 MONTHS FREE</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {pricingData.map((tier) => (
                        <div 
                            key={tier.id} 
                            onClick={() => tier.id === 'lægacy' ? onNavigate(Page.LegacyTeaser) : onNavigate(Page.Subscription)}
                            className={`group relative flex flex-col p-10 pt-16 rounded-[3rem] border transition-all duration-700 cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl
                                ${tier.accent} ${tier.popular ? 'scale-105 z-10' : 'scale-100'}
                                ${tier.id === 'lægacy' ? 'border-[#B87D4B]/30' : ''}
                            `}
                        >
                            {(tier.popular || tier.comingSoon) && (
                                <div className="absolute top-0 left-0 right-0 h-12 flex justify-center items-start pointer-events-none">
                                    <div className={`px-10 py-2.5 rounded-full text-white text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl border transform -translate-y-4 ${
                                        tier.comingSoon 
                                            ? 'bg-[#B87D4B] border-[#B87D4B]/40 shadow-[#B87D4B]/20' 
                                            : 'bg-indigo-600 border-indigo-500/40 shadow-indigo-500/30'
                                    }`}>
                                        {tier.comingSoon ? LANDING_CONTENT.PRICING.LEGACY_BADGE : LANDING_CONTENT.PRICING.BADGE}
                                    </div>
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className={`text-[11px] font-black uppercase tracking-[0.5em] mb-4 ${tier.color}`}>{tier.name}</h3>
                                <div className={`flex items-baseline mb-8 ${tier.id === 'lægacy' ? 'opacity-90' : ''}`}>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`font-brand font-bold text-white tracking-tighter ${tier.id === 'lægacy' ? 'text-4xl' : 'text-5xl'}`}>
                                            €{billingCycle === 'monthly' ? tier.price : tier.totalYearly}
                                        </span>
                                        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest ml-2">
                                            {billingCycle === 'monthly' ? '/ MO' : '/ YEAR'}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <p className="text-cyan-400 text-[9px] font-black uppercase tracking-widest mt-2">
                                            SAVE €{tier.savings} / YEAR
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 font-serif italic leading-relaxed min-h-[4rem]">
                                    {tier.description}
                                </p>
                            </div>

                            <ul className={`space-y-5 mb-10 flex-grow ${tier.id === 'lægacy' ? 'opacity-80' : ''}`}>
                                {tier.features.slice(0, 8).map((feature: any, idx) => (
                                    <li key={idx} className="flex flex-col gap-1 group/item">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border border-white/10 transition-colors bg-white/5`}>
                                                <feature.icon size={11} className={tier.iconColor} />
                                            </div>
                                            <span className={`text-[10px] font-bold tracking-wide text-slate-300 group-hover/item:text-white transition-colors`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                        {feature.subtext && (
                                            <p className="text-[10px] text-slate-500 ml-9 leading-tight font-medium">
                                                {feature.subtext}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all transform group-hover:scale-[1.02] active:scale-95 shadow-2xl
                                ${tier.comingSoon 
                                    ? 'bg-[#B87D4B] text-black border border-[#B87D4B]/30 hover:bg-[#A66C3E]' 
                                    : tier.popular 
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                                        : 'bg-white text-black hover:bg-slate-100'}
                            `}>
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20">
                    <button 
                        onClick={() => onNavigate(Page.Subscription)}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-4 mx-auto group"
                    >
                        EXPLORE FULL CAPABILITIES <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>

        <FAQSection />

      </main>

      <footer className="bg-[#02040A] text-white pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-32">
                <div className="col-span-2 space-y-8">
                    <BrandLogo className="text-3xl" showTrademark={true} />
                    <p className="text-slate-400 font-serif italic text-lg leading-relaxed max-w-xs">
                        "Preserving the essence of human stories through generational intelligence."
                    </p>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10 border border-white/5"><Instagram size={18} /></button>
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10 border border-white/5"><Facebook size={18} /></button>
                        <XIcon size={18} />
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-50">Platform</h4>
                    <ul className="space-y-4">
                        <li><button onClick={() => scrollToSection('how-it-works')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">How It Works</button></li>
                        <li><button onClick={() => scrollToSection('magic-behind-story')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">The Magic</button></li>
                        <li><button onClick={() => onNavigate(Page.Subscription)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Pricing</button></li>
                        <li><button onClick={() => onNavigate(Page.Archivist)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Archive Rescue™</button></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Knowledge</h4>
                    <ul className="space-y-4">
                        <li><button onClick={() => onNavigate(Page.About)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Our Origin</button></li>
                        <li><button onClick={() => onNavigate(Page.Articles)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">The Journal</button></li>
                        <li><button onClick={() => onNavigate(Page.TrustCenter)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Trust Center</button></li>
                        <li><button onClick={() => scrollToSection('faq')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Documentation</button></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Legal</h4>
                    <ul className="space-y-4">
                        <li><button onClick={() => onNavigate(Page.Legal)} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Charter v11.2</button></li>
                        <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy Silos</button></li>
                        <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Endowment Terms</button></li>
                        <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Exit Clauses</button></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Support</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-2 text-slate-400"><Mail size={14} /> <span className="text-sm font-bold">concierge@aeternacy.me</span></li>
                        <li className="flex items-center gap-2 text-slate-400"><MessageSquare size={14} /> <span className="text-sm font-bold">Live Support</span></li>
                        <li className="flex items-center gap-2 text-slate-400"><Globe size={14} /> <span className="text-sm font-bold">Hosted in EU</span></li>
                    </ul>
                </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-cyan-400" /> <span className="text-[9px] font-black uppercase tracking-widest">Vault Encrypted</span></div>
                    <div className="flex items-center gap-3"><Globe size={18} className="text-indigo-400" /> <span className="text-[9px] font-black uppercase tracking-widest">GDPR Sovereign</span></div>
                    <div className="flex items-center gap-3"><Lock size={18} className="text-emerald-400" /> <span className="text-[9px] font-black uppercase tracking-widest">Zero-Training Clause</span></div>
                    <div className="flex items-center gap-3"><Landmark size={18} className="text-amber-500" /> <span className="text-[9px] font-black uppercase tracking-widest">Centennial Guarantee</span></div>
                </div>

                <div className="text-center md:text-right space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">© 2026 æternacy Inc. Preservation Charter v11.2</p>
                    <p className="text-[8px] font-bold text-slate-800 uppercase tracking-[0.6em]">EST. 2026 • DIGITAL ARCHIVAL INSTITUTION</p>
                </div>
            </div>
        </div>
      </footer>
      <CookieArtifact />
    </div>
  );
};

export default LandingPage;
