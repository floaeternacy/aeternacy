
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Moment, AeternyVoice, AeternyStyle, UserTier, Page, House } from '../types';
import Slideshow from './Slideshow';
import { 
    ChevronLeft, Edit3, Trash2, 
    X, MapPin, Users, ImageIcon, Maximize2,
    MoreVertical, Share2, Play, Layout, Heart, FileEdit, Sparkles, Plus, Calendar
} from 'lucide-react';
import FragmentDetailOverlay from './FragmentDetailOverlay';
import LivingSlideshowPlayer from './LivingSlideshowPlayer';
import { useTheme } from '../contexts/ThemeContext';
import { getOptimizedUrl } from '../services/cloudinaryService';
import PageHeader from './PageHeader';
import ShareModal from './ShareModal';

interface MomentDetailPageProps {
    moment: Moment;
    moments: Moment[]; 
    onBack: () => void;
    onNavigate: (page: Page) => void;
    onUpdateMoment: (moment: Moment) => void;
    aeternyVoice: AeternyVoice;
    aeternyStyle: AeternyStyle;
    onEditMoment: (moment: Moment) => void;
    onDeleteMoment: (id: number) => void;
    userTier: UserTier;
    triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string, title?: string) => void;
    autoPlay?: boolean;
    onAutoPlayStarted?: () => void;
    onSelectMoment: (moment: Moment) => void; 
    setIsReliveActive?: (active: boolean) => void;
    houses?: House[]; // Added houses to props
}

const MomentDetailPage: React.FC<MomentDetailPageProps> = ({ 
    moment, moments, onBack, onNavigate, onUpdateMoment, aeternyVoice, aeternyStyle, onEditMoment, onDeleteMoment, userTier, triggerConfirmation,
    autoPlay = false, onAutoPlayStarted, onSelectMoment, setIsReliveActive, houses = []
}) => {
    const [selectedFragmentIndex, setSelectedFragmentIndex] = useState<number | null>(null);
    const [isLivingSlideshowOpen, setIsLivingSlideshowOpen] = useState(autoPlay);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { theme } = useTheme();

    const menuRef = useRef<HTMLDivElement>(null);

    const rawImages = useMemo(() => {
        const raw = [moment.image, ...(moment.images || [])].filter((img): img is string => !!img);
        return Array.from(new Set(raw));
    }, [moment.image, moment.images]);

    const heroImages = useMemo(() => rawImages.map(url => getOptimizedUrl(url, 1920)), [rawImages]);

    const suggestedMoments = useMemo(() => {
        const sorted = [...moments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const currentIndex = sorted.findIndex(m => m.id === moment.id);
        
        let results: Moment[] = [];
        const after = sorted.slice(0, currentIndex).reverse().slice(0, 5);
        results = [...after];
        
        if (results.length < 5) {
            const before = sorted.slice(currentIndex + 1, currentIndex + 1 + (5 - results.length));
            results = [...results, ...before];
        }

        const thematic = sorted.find(m => m.id !== moment.id && m.emotion === moment.emotion && !results.find(r => r.id === m.id));
        if (thematic) {
            results.pop(); 
            results.push(thematic);
        }

        return results;
    }, [moments, moment.id, moment.emotion]);

    useEffect(() => {
        if (autoPlay && onAutoPlayStarted) {
            onAutoPlayStarted();
        }
    }, [autoPlay, onAutoPlayStarted]);

    useEffect(() => {
        if (setIsReliveActive) {
            setIsReliveActive(isLivingSlideshowOpen);
        }
    }, [isLivingSlideshowOpen, setIsReliveActive]);

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
        onUpdateMoment({ ...moment, favorite: !moment.favorite });
    };

    const handleDelete = () => {
        if (window.confirm('Delete this memory? This action cannot be undone.')) {
            onDeleteMoment(moment.id);
            onBack();
        }
    };

    const handleNavigateToNext = (m: Moment) => {
        setIsLivingSlideshowOpen(false);
        onSelectMoment(m);
    };

    const bgClass = theme === 'dark' ? 'bg-[#050811]' : 'bg-[#FDFBF7]';
    const textClass = theme === 'dark' ? 'text-white' : 'text-[#2D2A26]';
    const proseClass = theme === 'dark' ? 'prose-p:text-slate-300' : 'prose-p:text-[#4A4744] prose-headings:text-[#2D2A26]';

    return (
        <div className={`min-h-screen ${bgClass} ${textClass} animate-fade-in transition-colors duration-500 overflow-x-hidden relative pb-40`}>
            
            <PageHeader 
                onBack={onBack}
                backLabel="CHRONICLE"
                backVariant="breadcrumb"
                variant="immersive"
                actions={
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleToggleFavorite}
                            className="flex items-center justify-center transition-all active:scale-90 text-white group"
                            aria-label="Toggle favorite"
                        >
                            <Heart 
                                size={22} 
                                strokeWidth={2}
                                fill={moment.favorite ? 'white' : 'none'} 
                                className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all"
                            />
                        </button>

                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`flex items-center justify-center transition-all active:scale-95 text-white`}
                            >
                                <MoreVertical size={24} className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-[#0B101B]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 shadow-3xl animate-fade-in-up origin-top-right overflow-hidden">
                                    <div className="flex flex-col gap-1">
                                        <button 
                                            onClick={() => { setIsMenuOpen(false); onEditMoment(moment); }}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.08] transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20"><Layout size={16}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-white leading-none">Studio</p>
                                                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-black">Manage Assets</p>
                                            </div>
                                        </button>

                                        <div className="h-px bg-white/5 my-2 mx-4" />

                                        <button 
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.08] transition-all text-left group"
                                            onClick={() => { setIsMenuOpen(false); setIsShareModalOpen(true); }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"><Share2 size={16}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-200 leading-none">Share Fragment</p>
                                                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-black">Manifest Externally</p>
                                            </div>
                                        </button>
                                        
                                        <button 
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400"><Trash2 size={16}/></div>
                                            <span className="text-xs font-bold text-red-400/80 group-hover:text-red-400">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }
            />

            <main className="pt-0">
                <section className="h-[85vh] w-full relative bg-black flex flex-col justify-center items-center text-white pt-32 md:pt-40 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {moment.video ? (
                            <video key={moment.video} src={moment.video} autoPlay loop muted playsInline className="w-full h-full object-cover brightness-[0.6] scale-105" />
                        ) : (
                            <Slideshow images={heroImages.slice(0, 5)} isPlaying={true} interval={6000} />
                        )}
                    </div>
                    
                    <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-[#050811] via-[#050811]/30' : 'from-[#FDFBF7] via-[#FDFBF7]/30'} to-transparent z-[1]`}></div>
                    
                    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-2xl px-5 py-2 rounded-full border border-white/20 mb-10 shadow-2xl">
                             <Calendar size={14} className="text-cyan-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">{moment.date}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-[7.5rem] font-bold font-brand tracking-tighter leading-[0.9] drop-shadow-3xl mb-12 px-4">
                            {moment.title}
                        </h1>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                            <button 
                                onClick={() => setIsLivingSlideshowOpen(true)} 
                                className="w-full sm:w-auto bg-white text-stone-950 font-black px-12 py-5 rounded-full text-xs md:text-sm uppercase tracking-[0.25em] transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 active:scale-95 group"
                            >
                                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> 
                                <span>Relive</span>
                            </button>
                            <button 
                                onClick={() => onEditMoment(moment)}
                                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black px-10 py-5 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Layout size={18} /> Studio
                            </button>
                        </div>
                    </div>
                </section>

                <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32">
                    <div className="relative mb-32">
                        <div className={`prose prose-2xl ${theme === 'dark' ? 'prose-invert' : ''} ${proseClass} max-w-none transition-all duration-700`}>
                            {moment.description.split('\n').filter(p => p.trim() !== '').map((p, i) => (
                                <p key={i} className="font-serif italic text-2xl md:text-4xl leading-relaxed text-center mb-16 last:mb-0 text-slate-300 drop-shadow-sm">
                                    {p}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-40">
                        <div className="flex items-center gap-6 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 shadow-2xl transition-all hover:bg-white/[0.04]">
                            <div className="w-14 h-14 rounded-[1.2rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner">
                                <MapPin size={28} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-1">Spatial Context</p>
                                <p className="text-2xl font-bold font-brand tracking-tighter">{moment.location || 'Unknown Realm'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 shadow-2xl transition-all hover:bg-white/[0.04]">
                            <div className="w-14 h-14 rounded-[1.2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                <Users size={28} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-1">With</p>
                                <p className="text-2xl font-bold font-brand tracking-tighter line-clamp-1">
                                    {moment.people && moment.people.length > 0 ? moment.people.join(', ') : 'Solo Reflection'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Inventory</span>
                                <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{rawImages.length} captured</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {rawImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedFragmentIndex(idx)}
                                    className="group relative aspect-square rounded-[2.2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:z-10"
                                >
                                    <img src={getOptimizedUrl(img, 600)} className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110 group-hover:rotate-1" alt={`Fragment ${idx + 1}`} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                                        <div className="bg-white/10 backdrop-blur-2xl p-4 rounded-full border border-white/20">
                                            <Maximize2 className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => onNavigate(Page.Create)}
                                className="aspect-square rounded-[2.2rem] border-2 border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-cyan-400 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                    <Plus size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Add more memories</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            
            {selectedFragmentIndex !== null && (
                <FragmentDetailOverlay 
                    images={rawImages} 
                    initialIndex={selectedFragmentIndex} 
                    onClose={() => setSelectedFragmentIndex(null)}
                    momentMetadata={{
                        location: moment.location,
                        date: moment.date,
                        people: moment.people
                    }}
                />
            )}
            
            {isLivingSlideshowOpen && (
                <LivingSlideshowPlayer
                    moment={moment}
                    suggestedMoments={suggestedMoments}
                    onNavigateToNext={handleNavigateToNext}
                    aeternyVoice={aeternyVoice}
                    aeternyStyle={aeternyStyle}
                    onClose={() => setIsLivingSlideshowOpen(false)}
                />
            )}

            {isShareModalOpen && (
                <ShareModal 
                    item={moment} 
                    onClose={() => setIsShareModalOpen(false)} 
                    onUpdateItem={onUpdateMoment}
                    userTier={userTier}
                    houses={houses}
                />
            )}
        </div>
    );
};

export default MomentDetailPage;
