import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Journey, Moment, Page, UserTier, AeternyVoice, AeternyStyle } from '../types';
import { 
    ChevronLeft, Play, History, Heart, Share2, 
    MoreVertical, Trash2, Layout, Layers, Calendar, 
    ArrowRight, Sparkles 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getOptimizedUrl } from '../services/cloudinaryService';
import Slideshow from './Slideshow';
import LivingSlideshowPlayer from './LivingSlideshowPlayer';
import PageHeader from './PageHeader';

interface JourneyDetailPageProps {
    journey: Journey;
    moments: Moment[];
    onBack: () => void;
    onNavigate: (page: Page) => void;
    onSelectMoment: (moment: Moment) => void;
    onUpdateJourney: (journey: Journey) => void;
    userTier: UserTier;
    aeternyVoice: AeternyVoice;
    aeternyStyle: AeternyStyle;
    setIsReliveActive?: (active: boolean) => void; // Added for global UI control
}

const JourneyDetailPage: React.FC<JourneyDetailPageProps> = ({ 
    journey, moments, onBack, onNavigate, onSelectMoment, 
    onUpdateJourney, userTier, aeternyVoice, aeternyStyle, setIsReliveActive 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLivingSlideshowOpen, setIsLivingSlideshowOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const journeyMoments = useMemo(() => {
        return journey.momentIds
            .map(id => moments.find(m => m.id === id))
            .filter((m): m is Moment => !!m)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [journey.momentIds, moments]);

    const heroImages = useMemo(() => {
        const imgs = journeyMoments.map(m => m.image || m.images?.[0]).filter(Boolean) as string[];
        if (imgs.length === 0) return [journey.coverImage];
        return Array.from(new Set([journey.coverImage, ...imgs])).map(url => getOptimizedUrl(url, 1920));
    }, [journeyMoments, journey.coverImage]);

    // Create a composite moment for the LivingSlideshowPlayer that represents the whole journey
    const compositeJourneyMoment = useMemo(() => {
        return {
            id: journey.id,
            title: journey.title,
            description: journey.description,
            date: "Full Journey",
            images: journeyMoments.flatMap(m => [m.image, ...(m.images || [])]).filter(Boolean) as string[],
            image: journey.coverImage,
            type: 'collection',
            aiTier: 'diamond',
            photoCount: journeyMoments.length,
            pinned: false
        } as Moment;
    }, [journey, journeyMoments]);

    // Lift the state to App.tsx when opening relive
    useEffect(() => {
        if (setIsReliveActive) {
            setIsReliveActive(isLivingSlideshowOpen);
        }
    }, [isLivingSlideshowOpen, setIsReliveActive]);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleFavorite = () => {
        onUpdateJourney({ ...journey, favorite: !journey.favorite });
    };

    const handleDelete = () => {
        if (window.confirm('Remove this journey from your archive? The component memories will remain.')) {
            onBack();
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} animate-fade-in transition-colors duration-500 overflow-x-hidden relative pb-40`}>
            
            <PageHeader 
                onBack={onBack}
                backLabel="CHRONICLE"
                backVariant="breadcrumb"
                variant="immersive"
                actions={
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={handleToggleFavorite}
                            className="flex items-center justify-center transition-all active:scale-90 text-white group"
                            aria-label="Toggle favorite"
                        >
                            <Heart 
                                size={24} 
                                strokeWidth={2}
                                fill={journey.favorite ? 'white' : 'none'} 
                                className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all"
                            />
                        </button>

                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-center transition-all active:scale-95 text-white"
                                aria-label="Open menu"
                            >
                                <MoreVertical size={24} className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-[#0B101B]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 shadow-3xl animate-fade-in-up origin-top-right overflow-hidden">
                                    <div className="flex flex-col gap-1">
                                        <button 
                                            onClick={() => { setIsMenuOpen(false); onNavigate(Page.SmartCollection); }}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.08] transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20"><Layout size={16}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-white leading-none">Studio</p>
                                                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-black">Refine Weave</p>
                                            </div>
                                        </button>

                                        <div className="h-px bg-white/5 my-2 mx-4" />

                                        <button 
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.08] transition-all text-left group"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"><Share2 size={16}/></div>
                                            <span className="text-xs font-bold text-slate-200">Share Journey</span>
                                        </button>
                                        
                                        <button 
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400"><Trash2 size={16}/></div>
                                            <span className="text-xs font-bold text-red-400/80 group-hover:text-red-400">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }
            />

            <main>
                {/* Cinematic Hero */}
                <section className="h-[75vh] w-full relative bg-black flex flex-col justify-center items-center text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Slideshow images={heroImages} isPlaying={true} interval={6000} />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#050811] via-[#050811]/20' : 'from-[#FDFBF7] via-[#FDFBF7]/20'} to-transparent z-[1]`}></div>
                    
                    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 bg-indigo-500/20 backdrop-blur-2xl px-6 py-2 rounded-full border border-indigo-400/20 mb-8">
                             <Layers size={14} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">Woven Journæy Archive</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-bold font-brand tracking-tighter leading-[0.9] drop-shadow-3xl mb-12 px-4">
                            {journey.title}
                        </h1>
                        
                        <div className="flex justify-center">
                            <button 
                                onClick={() => setIsLivingSlideshowOpen(true)}
                                className="bg-white text-stone-950 font-black px-12 py-5 rounded-full text-xs md:text-sm uppercase tracking-[0.25em] transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 active:scale-95 group"
                            >
                                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> 
                                <span>Relive the Story</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32">
                    <div className="relative mb-32">
                        <div className={`text-center space-y-12`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400 mb-6 flex items-center justify-center gap-4">
                                <span className="h-px w-12 bg-indigo-400/20"></span>
                                æterny Curated Narrative
                                <span className="h-px w-12 bg-indigo-400/20"></span>
                            </p>
                            <div className={`font-serif italic text-2xl md:text-4xl leading-relaxed ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>
                                "{journey.description}"
                            </div>
                        </div>
                    </div>

                    {/* Chapter Timeline */}
                    <div className="space-y-12">
                        <div className="flex items-end justify-between border-b border-white/5 pb-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">The Components</h3>
                                <h4 className="text-3xl font-brand font-bold text-white">Woven Chapters.</h4>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{journeyMoments.length} Fragments</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {journeyMoments.map((moment, idx) => (
                                <button 
                                    key={moment.id}
                                    onClick={() => onSelectMoment(moment)}
                                    className={`group text-left rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 
                                        ${isDark ? 'bg-[#0B101B] border border-white/5' : 'bg-white shadow-lg border border-stone-100'}
                                    `}
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 600)} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6">
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-1">{moment.date}</p>
                                            <h5 className="text-xl font-bold text-white font-brand tracking-tight">{moment.title}</h5>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-black/20 group-hover:bg-black/40 transition-colors">
                                        <p className={`text-xs leading-relaxed line-clamp-2 italic font-serif ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                                            "{moment.description}"
                                        </p>
                                        <div className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                                            Relive Chapter <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {isLivingSlideshowOpen && (
                <LivingSlideshowPlayer
                    moment={compositeJourneyMoment}
                    aeternyVoice={aeternyVoice}
                    aeternyStyle={aeternyStyle}
                    onClose={() => setIsLivingSlideshowOpen(false)}
                />
            )}
        </div>
    );
};

export default JourneyDetailPage;