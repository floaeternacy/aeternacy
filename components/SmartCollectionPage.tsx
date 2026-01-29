import React, { useState, useMemo } from 'react';
import { Moment, Journey, Epoch, Page } from '../types';
import { 
    Wand2, Check, X, 
    Sparkles, Layers, ArrowRight, 
    Loader2, Milestone, User, MapPin, Heart, Compass, Clock, Lock,
    Bot, Coffee, Car, Users as UsersIcon, Wind, Sunrise, Fingerprint,
    ImageIcon, Zap, Camera, Mountain
} from 'lucide-react';
import PageHeader from './PageHeader';
import { useTheme } from '../contexts/ThemeContext';
import { mergeMomentsIntoJourney, mergeJourneysIntoEpoch } from '../services/geminiService';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface SmartCollectionPageProps {
    moments: Moment[];
    journeys: Journey[];
    onNavigate: (page: Page) => void;
    onCreateJourney: (moments: Moment[], title: string, story: string) => void;
    onCreateEpoch: (journeys: Journey[], title: string, story: string, theme: string) => void;
    showToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

type SynthesisLevel = 'journey' | 'epoch';

interface JourneySeed {
    id: string;
    title: string;
    type: 'thematic' | 'activity' | 'person' | 'legacy';
    description: string;
    icon: React.ElementType;
    color: string;
    accentGlow: string;
    previews: string[];
    momentCount: number;
}

const SmartCollectionPage: React.FC<SmartCollectionPageProps> = ({ moments, journeys, onNavigate, onCreateJourney, onCreateEpoch, showToast }) => {
    const [level, setLevel] = useState<SynthesisLevel>('journey');
    const [selectedMoments, setSelectedMoments] = useState<Set<number>>(new Set());
    const [isWeaving, setIsWeaving] = useState(false);
    const [weavingTargetId, setWeavingTargetId] = useState<string | null>(null);
    const [customTitle, setCustomTitle] = useState('');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Thematic Suggestions with visual previews
    const journeySeeds: JourneySeed[] = useMemo(() => [
        {
            id: 'seed-alex',
            title: "The Alex Arc",
            type: 'person',
            description: "A chronological study of growth and shared laughter with Alex.",
            icon: User,
            color: "text-indigo-400",
            accentGlow: "shadow-indigo-500/20",
            previews: [
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
            ],
            momentCount: 5
        },
        {
            id: 'seed-adventure',
            title: "Echoes of Adventure",
            type: 'thematic',
            description: "Weaving together your most high-energy outdoor fragments.",
            icon: Compass,
            color: "text-cyan-400",
            accentGlow: "shadow-cyan-500/20",
            previews: [
                "https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=400"
            ],
            momentCount: 8
        },
        {
            id: 'seed-home',
            title: "Silent Foundations",
            type: 'thematic',
            description: "A study of quiet mornings and the soul of your home.",
            icon: Sunrise,
            color: "text-amber-400",
            accentGlow: "shadow-amber-500/20",
            previews: [
                "https://images.pexels.com/photos/3772612/pexels-photo-3772612.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400"
            ],
            momentCount: 6
        },
        {
            id: 'seed-culinary',
            title: "Culinary Heritage",
            type: 'activity',
            description: "Connecting the threads of family dinners and kitchen rituals.",
            icon: Coffee,
            color: "text-emerald-400",
            accentGlow: "shadow-emerald-500/20",
            previews: [
                "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400"
            ],
            momentCount: 4
        },
        {
            id: 'seed-road',
            title: "The Long Road",
            type: 'activity',
            description: "Tracing the sequence of movement and transition across lands.",
            icon: Car,
            color: "text-teal-400",
            accentGlow: "shadow-teal-500/20",
            previews: [
                "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/1703314/pexels-photo-1703314.jpeg?auto=compress&cs=tinysrgb&w=400"
            ],
            momentCount: 12
        },
        {
            id: 'seed-kin',
            title: "Kindred Resonance",
            type: 'legacy',
            description: "The intergenerational bond captured in simple presence.",
            icon: Fingerprint,
            color: "text-purple-400",
            accentGlow: "shadow-purple-500/20",
            previews: [
                "https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg?auto=compress&cs=tinysrgb&w=400",
                "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=400"
            ],
            momentCount: 7
        }
    ], []);

    const handleManifestSeed = async (seed: JourneySeed) => {
        setWeavingTargetId(seed.id);
        setIsWeaving(true);
        
        try {
            // Pick moments that roughly match the seed type
            let targets: Moment[] = [];
            if (seed.type === 'person') {
                targets = moments.filter(m => m.people?.some(p => seed.title.includes(p)));
            } else if (seed.type === 'thematic') {
                targets = moments.filter(m => m.emotion === 'adventure' || m.emotion === 'peace');
            }
            
            // Fallback: pick the most recent ones if no match
            if (targets.length < 2) {
                targets = moments.slice(0, 4);
            }

            if (targets.length < 2) {
                showToast("Insufficient fragments in your vault to manifest this thread. Add more memories first.", "error");
                return;
            }

            // TODO BACKEND: Gemini AI Story Generation API - Weaving the journey components into a single narrative.
            const result = await mergeMomentsIntoJourney(targets, "User", seed.title);
            // TODO BACKEND: Firebase/Firestore Data Persistence - onCreateJourney persists the new journey to Firestore.
            onCreateJourney(targets, result.title, result.story);
            onNavigate(Page.Home);
        } catch (e) {
            console.error(e);
            showToast("The neural weaving failed. Please try a different thread.", "error");
        } finally {
            setIsWeaving(false);
            setWeavingTargetId(null);
        }
    };

    const handleManualWeave = async () => {
        if (selectedMoments.size < 2) {
            showToast("Please select at least 2 fragments to weave.", "info");
            return;
        }
        setIsWeaving(true);
        setWeavingTargetId('manual');
        try {
            const momsToMerge = moments.filter(m => selectedMoments.has(m.id));
            const title = customTitle || "A Unified Journæy";
            // TODO BACKEND: Gemini AI Story Generation API - Merging manually selected fragments.
            const result = await mergeMomentsIntoJourney(momsToMerge, "User", title);
            // TODO BACKEND: Firebase/Firestore Data Persistence - Persisting the manual weave.
            onCreateJourney(momsToMerge, result.title, result.story);
            onNavigate(Page.Home);
        } catch (e) {
            console.error(e);
            showToast("Synthesis failed. Check your connection to the archives.", "error");
        } finally {
            setIsWeaving(false);
            setWeavingTargetId(null);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-500 pb-60`}>
            <PageHeader 
                title="Synthesis Studio" 
                onBack={() => onNavigate(Page.Home)}
            />

            <div className="container mx-auto px-4 sm:px-6 pt-32 md:pt-44 max-w-7xl animate-fade-in">
                
                {/* --- HEADER BLOCK --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                            <Sparkles size={12} className="animate-pulse" /> neural synthesis unit
                        </div>
                        <h1 className="text-5xl md:text-[6.5rem] font-bold font-brand tracking-tighter leading-[0.88] text-white">
                            Manifest <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                Continuity.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic text-slate-400 leading-relaxed max-w-2xl">
                            "The Studio listens for the patterns you missed. Manifest a suggested thread or manually weave your own chapters into a legacy."
                        </p>
                    </div>

                    <div className="bg-white/5 p-1.5 rounded-[2rem] border border-white/10 flex items-center backdrop-blur-xl shrink-0 h-fit">
                        <button 
                            onClick={() => setLevel('journey')}
                            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${level === 'journey' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Layers size={14} /> Momænts → Journæy
                        </button>
                        <div className="relative group">
                            <button 
                                disabled
                                className="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 cursor-not-allowed"
                            >
                                <Milestone size={14} /> Journæys → Æpoch
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[8px] border border-indigo-500/20">SOON</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- AETERNY JOURNEY SEEDS --- */}
                <section className="mb-40 space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold font-brand text-white">Journæy Seeds</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">Ready to manifest with one click</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {journeySeeds.map((seed) => (
                            <div 
                                key={seed.id}
                                className={`group relative p-10 rounded-[3rem] bg-[#0A0C14] border border-white/5 flex flex-col transition-all duration-700 hover:border-indigo-500/40 hover:bg-white/[0.03] shadow-2xl h-[520px] overflow-hidden`}
                            >
                                <div className="relative z-10 flex justify-between items-start mb-10">
                                    <div className={`w-14 h-14 rounded-2xl ${seed.color} bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                                        <seed.icon size={28} />
                                    </div>
                                    <div className="flex -space-x-4">
                                        {seed.previews.map((url, i) => (
                                            <div key={i} className="w-12 h-12 rounded-xl border-2 border-[#0A0C14] overflow-hidden shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                                <img src={url} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative z-10 space-y-4 flex-grow">
                                    <h4 className="text-3xl font-bold font-brand text-white tracking-tight">{seed.title}</h4>
                                    <p className="text-base text-slate-400 font-serif italic leading-relaxed">"{seed.description}"</p>
                                    <div className="pt-6 flex items-center gap-3">
                                        <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                            {seed.momentCount} fragments found
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-10">
                                    <button 
                                        onClick={() => handleManifestSeed(seed)}
                                        disabled={isWeaving}
                                        className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl transition-all transform group-hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {(weavingTargetId === seed.id) ? (
                                            <><Loader2 size={16} className="animate-spin" /> Synthesizing...</>
                                        ) : (
                                            <><Wand2 size={16} /> Weave Journæy</>
                                        )}
                                    </button>
                                </div>

                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Sparkles size={120} className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MANUAL CURATION SECTION --- */}
                <div id="manual-weave" className="bg-[#0B101B] border border-white/5 rounded-[4rem] p-8 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start md:items-end mb-20 gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-bold font-brand text-white mb-6 tracking-tighter">Manual Synthesis</h2>
                            <p className="text-lg text-slate-400 font-serif italic leading-relaxed">
                                "Select the specific discrete chapters you wish to thread together. I will establish the narrative flow and bridge the temporal gaps."
                            </p>
                        </div>
                        <div className="w-full md:w-96 space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Custom Journæy Heading</label>
                            <div className="relative group">
                                <input 
                                    type="text"
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    placeholder="e.g. Echoes of the Alps"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg font-bold outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                                />
                                <Sparkles size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {moments.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-20">
                            {moments.map((m) => {
                                const isSelected = selectedMoments.has(m.id);
                                return (
                                    <button 
                                        key={m.id}
                                        onClick={() => {
                                            const next = new Set(selectedMoments);
                                            if (next.has(m.id)) next.delete(m.id);
                                            else next.add(m.id);
                                            setSelectedMoments(next);
                                        }}
                                        className={`relative aspect-[4/5] rounded-3xl overflow-hidden group transition-all duration-700 ${isSelected ? 'ring-4 ring-indigo-500 scale-[1.03] shadow-3xl z-10' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                                    >
                                        <img src={getOptimizedUrl(m.image || m.images?.[0] || '', 400)} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 text-left">
                                            <p className="text-white text-[10px] font-bold truncate leading-tight">{m.title}</p>
                                        </div>
                                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isSelected ? 'bg-indigo-500 border-indigo-400' : 'bg-black/20 border-white/20'}`}>
                                            {isSelected ? <Check size={16} strokeWidth={4} /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                             <ImageIcon size={64} className="mx-auto mb-6" />
                             <p className="font-brand font-bold text-xl uppercase tracking-widest">Archive Vault Empty</p>
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 gap-8">
                        <div className="text-center md:text-left flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                <Layers size={28} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-brand text-white tracking-tight">
                                    <span className="text-indigo-400">{selectedMoments.size}</span> Fragments chosen.
                                </p>
                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">Neural Link on Standby</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleManualWeave}
                            disabled={selectedMoments.size < 2 || isWeaving}
                            className={`w-full md:w-auto px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-full shadow-2xl transition-all disabled:opacity-30 flex items-center justify-center gap-4 ${((selectedMoments.size >= 2) && !isWeaving) ? 'shadow-indigo-900/40 hover:scale-105 active:scale-95' : ''}`}
                        >
                            {(isWeaving && weavingTargetId === 'manual') ? (
                                <><Loader2 size={18} className="animate-spin" /> Weaving...</>
                            ) : (
                                <><Sparkles size={18} /> Initiate Manual Weave</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartCollectionPage;