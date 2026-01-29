
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Moment, Page, UserTier, TokenState, MusicTrack, StoryStyle, AeternyVoice, AeternyStyle } from '../types';
import { 
    Save, Film, Wand2, 
    Calendar, MapPin, Users, 
    Sparkles, Music, Mic, History, Book, Smile, Check, Loader2,
    Layout, ArrowRight, Bot, Fingerprint, Waves, Volume2, User,
    X, Plus, Tag, Hash, ImageIcon, Clock, ChevronRight, Search, Filter,
    Star, StarOff, Clapperboard, PlayCircle, Zap, Activity, Database, Sparkle,
    GripVertical, Trash2, BookOpen
} from 'lucide-react';
import { imageUrlToPayload, generateAeternyStory, generateVideo, rewriteStoryWithStyle } from '../services/geminiService';
import MusicSelectorModal from './MusicSelectorModal';
import MagicEditModal from './MagicEditModal';
import PageHeader from './PageHeader';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { TOKEN_COSTS } from '../services/costCatalog';

interface CuratePageProps {
    moments: Moment[];
    onUpdateMoment: (moment: Moment) => void;
    initialMoment: Moment | null;
    onNavigate: (page: Page) => void;
    userTier: UserTier;
    tokenState: TokenState;
    triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string | React.ReactNode, title?: string) => void;
    showToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

type EditorTab = 'story' | 'details' | 'ai';

const CuratePage: React.FC<CuratePageProps> = (props) => {
    const { onUpdateMoment, onNavigate, showToast, triggerConfirmation, userTier, moments, tokenState } = props;
    const initialMoment = props.initialMoment;
    
    const [selectedMoment, setSelectedMoment] = useState<Moment | null>(initialMoment);
    const [activeTab, setActiveTab] = useState<EditorTab>('story');
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isRegeneratingStory, setIsRegeneratingStory] = useState(false);
    const [isAwakeningVideo, setIsAwakeningVideo] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
    const [isMagicEditModalOpen, setIsMagicEditModalOpen] = useState(false);
    const [isKeySelected, setIsKeySelected] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsKeySelected(hasKey);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                setIsKeySelected(true);
            } catch (e) {
                console.error("Key selection cancelled", e);
            }
        }
    };

    const allImages = useMemo(() => {
        if (!selectedMoment) return [];
        const raw = [selectedMoment.image, ...(selectedMoment.images || [])].filter((img): img is string => !!img);
        return Array.from(new Set(raw));
    }, [selectedMoment]);

    const currentMedia = allImages[activeMediaIndex];

    const filteredMoments = useMemo(() => {
        return moments.filter(m => 
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [moments, searchQuery]);

    useEffect(() => {
        if (initialMoment) {
            setSelectedMoment(initialMoment);
        }
    }, [initialMoment]);

    const handleUpdateField = (field: keyof Moment, value: any) => {
        if (!selectedMoment) return;
        setSelectedMoment({ ...selectedMoment, [field]: value });
        setIsDirty(true);
    };

    const handleSetPrimary = (imgUrl: string) => {
        handleUpdateField('image', imgUrl);
        showToast("Primary artifact updated.", "success");
    };

    const handleItemDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleItemDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleItemDrop = (index: number) => {
        if (draggedItemIndex === null || !selectedMoment) return;
        const items = [...allImages];
        const draggedItem = items[draggedItemIndex];
        items.splice(draggedItemIndex, 1);
        items.splice(index, 0, draggedItem);
        
        // Sync back to moment structure
        setSelectedMoment({
            ...selectedMoment,
            image: items[0],
            images: items.slice(1)
        });
        
        setIsDirty(true);
        setDraggedItemIndex(null);
        setActiveMediaIndex(index);
    };

    const removeArtifact = (index: number) => {
        if (!selectedMoment) return;
        const items = [...allImages];
        items.splice(index, 1);
        
        if (items.length === 0) {
            showToast("Cannot remove the last artifact.", "error");
            return;
        }

        setSelectedMoment({
            ...selectedMoment,
            image: items[0],
            images: items.slice(1)
        });
        setIsDirty(true);
        if (activeMediaIndex >= items.length) {
            setActiveMediaIndex(items.length - 1);
        }
    };

    const handleAwakenLivingImage = async () => {
        if (!selectedMoment || !currentMedia) return;

        if (!isKeySelected && window.aistudio) {
            await handleSelectKey();
        }

        const executeAwakening = async () => {
            setIsAwakeningVideo(true);
            try {
                const payload = await imageUrlToPayload(currentMedia);
                const videoUrl = await generateVideo(
                    `Grounded Realism Protocol. Animate the subtle rhythms of this memory: ${selectedMoment.title}`, 
                    payload
                );
                handleUpdateField('video', videoUrl);
                showToast("Image successfully awakened.", "success");
            } catch (e: any) {
                console.error("Awakening failed", e);
                const message = e.message || (typeof e === 'string' ? e : JSON.stringify(e));
                
                if (message.includes("PERMISSION_DENIED") || message.includes("403") || message.includes("Requested entity was not found")) {
                    setIsKeySelected(false);
                    showToast("Institutional Link Required. Please authorize your vault sync.", "error");
                    await handleSelectKey();
                } else {
                    showToast("Memory sync interrupted. Please try again.", "error");
                }
            } finally {
                setIsAwakeningVideo(false);
            }
        };

        const remaining = tokenState.livingMomentsQuota.total - tokenState.livingMomentsQuota.used;
        if (remaining <= 0) {
            showToast("Monthly Living Moments exhausted. Upgrade or wait for next month.", "error");
            return;
        }

        triggerConfirmation(
            TOKEN_COSTS.AI_VIDEO_REFLECTION, 
            'AWAKEN_VIDEO', 
            executeAwakening, 
            `Bring this moment to life? You have ${remaining} Monthly Living Moments remaining.`,
            "Awaken Living Moment"
        );
    };

    const handleSave = () => {
        if (selectedMoment) {
            onUpdateMoment(selectedMoment);
            setIsDirty(false);
            showToast("Archive updated.", "success");
        }
    };

    const handleBack = () => {
        if (!selectedMoment) {
            onNavigate(Page.Studio);
            return;
        }

        if (isDirty) {
            if (window.confirm("You have unsaved refinements. Abandon changes?")) {
                setSelectedMoment(null);
                setIsDirty(false);
            }
        } else {
            setSelectedMoment(null);
        }
    };

    const handleApplyStyle = async (style: StoryStyle) => {
        if (!selectedMoment) return;
        if (style === selectedMoment.storyStyle) return;
        
        const executeRegeneration = async () => {
            setIsRegeneratingStory(true);
            try {
                const payloads = await Promise.all(allImages.slice(0, 5).map(async (url) => await imageUrlToPayload(url)));
                const result = await rewriteStoryWithStyle(selectedMoment.description, payloads, style);
                const updated = { ...selectedMoment, title: result.title, description: result.story, storyStyle: style };
                setSelectedMoment(updated);
                setIsDirty(true);
                showToast(`Tone shifted to ${style}.`, "success");
            } catch (e) {
                console.error("Failed to switch style", e);
                showToast("Neural link failed. Please try again.", "error");
            } finally {
                setIsRegeneratingStory(false);
            }
        };

        triggerConfirmation(TOKEN_COSTS.STORY_REWRITE, 'REGENERATE_STYLE', executeRegeneration, `Switch story style to "${style}"? This will use compute energy.`, "Transform Narrative Tone");
    };

    const styleInfo = [
        { id: 'nostalgic', label: 'Nostalgic', icon: History, color: 'text-amber-400', desc: 'Warm and thoughtful.' },
        { id: 'poetic', label: 'Poetic', icon: Sparkle, color: 'text-purple-400', desc: 'Artistic and deep.' },
        { id: 'journal', label: 'Documentary', icon: BookOpen, color: 'text-cyan-400', desc: 'Precise record.' },
        { id: 'lighthearted', label: 'Light', icon: Smile, color: 'text-emerald-400', desc: 'Casual and fun.' },
    ];

    if (!selectedMoment) {
        return (
            <div className="h-[100dvh] w-full bg-[#050811] flex flex-col overflow-hidden text-slate-200 animate-fade-in fixed inset-0 z-[100]">
                <PageHeader 
                    title="Curation Studio"
                    onBack={() => onNavigate(Page.Studio)}
                    backLabel="STUDIO"
                />
                
                <main className="flex-grow overflow-y-auto custom-scrollbar pt-32 pb-40 px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
                            <div className="max-w-xl">
                                <h1 className="text-4xl md:text-6xl font-bold font-brand tracking-tighter leading-none mb-4">Select a <span className="text-cyan-400">Chapter.</span></h1>
                                <p className="text-lg text-slate-500 font-serif italic">"Choose a Moment from your archive to refine its narrative resonance."</p>
                            </div>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                <input 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search archive..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        {filteredMoments.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredMoments.map((m) => (
                                    <button 
                                        key={m.id}
                                        onClick={() => setSelectedMoment(m)}
                                        className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40"
                                    >
                                        <img src={getOptimizedUrl(m.image || m.images?.[0] || '', 600)} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <p className="text-[8px] font-black uppercase text-cyan-400 tracking-widest mb-1">{m.date}</p>
                                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 tracking-tight">{m.title}</h3>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                            <div className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                Curation <ChevronRight size={14} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-40 flex flex-col items-center text-center opacity-20">
                                <Filter size={64} className="mb-6" />
                                <p className="text-xl font-bold font-brand">No Moments found.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    const livingMomentsRemaining = tokenState.livingMomentsQuota.total - tokenState.livingMomentsQuota.used;

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col overflow-hidden text-slate-200 animate-fade-in fixed inset-0 z-[100]">
            <PageHeader 
                title="Refining Moment"
                onBack={handleBack}
                backLabel={initialMoment ? "CHRONICLE" : "BACK"}
                actions={
                    <button 
                        onClick={handleSave} 
                        className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${isDirty ? 'bg-white text-black shadow-2xl shadow-white/20' : 'bg-white/5 text-slate-500'}`}
                    >
                        {isDirty ? 'Save Changes' : 'All Changes Saved'}
                    </button>
                }
            />

            <div className={`flex-grow flex flex-col lg:flex-row overflow-hidden relative mt-16 md:mt-20`}>
                {/* PREVIEW AREA: Left Pane */}
                <div className="relative bg-black h-[40%] lg:h-full lg:flex-1 group">
                    <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden relative">
                        {selectedMoment.video && activeMediaIndex === 0 ? (
                            <video src={selectedMoment.video} autoPlay loop muted playsInline className="max-w-full max-h-full object-contain" />
                        ) : (
                            <img src={currentMedia} alt="Preview" className="max-w-full max-h-full object-contain animate-fade-in" />
                        )}
                        
                        {/* Interactive Overlay for current active image */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none z-30">
                            <div className="flex gap-2">
                                {allImages.length > 1 && allImages.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${activeMediaIndex === i ? 'w-6 bg-cyan-400' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>
                            
                            <div className="flex flex-col gap-3 pointer-events-auto items-end">
                                {!selectedMoment.video && activeMediaIndex === 0 && (
                                    <button 
                                        onClick={handleAwakenLivingImage}
                                        disabled={isAwakeningVideo}
                                        className="bg-indigo-600 border border-indigo-400/50 text-white px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl group/awaken"
                                    >
                                        {isAwakeningVideo ? (
                                            <><Loader2 size={16} className="animate-spin" /> Awakening...</>
                                        ) : (
                                            <><Sparkles size={16} className="group-hover/awaken:scale-110 transition-transform" /> Awaken Frame</>
                                        )}
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsMagicEditModalOpen(true)}
                                    className="bg-white text-stone-950 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-2xl"
                                >
                                    <Wand2 size={16} /> Magic Refine
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EDITOR PANEL: Right Pane */}
                <div className="bg-slate-900 lg:border-l border-white/5 flex flex-col h-[60%] lg:h-full w-full lg:w-[32rem] shadow-2xl z-10">
                    <div className="flex border-b border-white/5 bg-slate-900 flex-shrink-0">
                        <button onClick={() => setActiveTab('story')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'story' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Narrative</button>
                        <button onClick={() => setActiveTab('details')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'details' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Auditory</button>
                        <button onClick={() => setActiveTab('ai')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'ai' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Energy</button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 custom-scrollbar overscroll-contain relative">
                        {isRegeneratingStory && (
                            <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Deep Memory Sync...</p>
                            </div>
                        )}

                        {activeTab === 'story' && (
                            <div className="space-y-12 animate-fade-in pb-12">
                                <section className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 block">Heading</label>
                                        <input 
                                            value={selectedMoment.title} 
                                            onChange={e => handleUpdateField('title', e.target.value)} 
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-2xl font-bold text-white outline-none focus:border-cyan-500/50 transition-all font-brand tracking-tighter" 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 block">The woven story</label>
                                        <textarea 
                                            value={selectedMoment.description} 
                                            onChange={e => handleUpdateField('description', e.target.value)} 
                                            className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-base text-slate-300 leading-relaxed font-serif italic outline-none resize-none focus:border-cyan-500/50 transition-all" 
                                        />
                                    </div>

                                    {/* Tone Transformer Section */}
                                    <div className="pt-4 border-t border-white/5">
                                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                            <Sparkles size={14} className="text-amber-400"/> Transform Persona
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {styleInfo.map(style => (
                                                <button
                                                    key={style.id}
                                                    onClick={() => handleApplyStyle(style.id as StoryStyle)}
                                                    className={`p-4 rounded-2xl border text-left transition-all group flex flex-col gap-2 ${selectedMoment.storyStyle === style.id || (!selectedMoment.storyStyle && style.id === 'nostalgic') ? 'bg-amber-500/10 border-amber-500/40' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <style.icon size={16} className={style.color} />
                                                        { (selectedMoment.storyStyle === style.id || (!selectedMoment.storyStyle && style.id === 'nostalgic')) && <Check size={12} className="text-amber-500" /> }
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{style.label}</span>
                                                        <span className="text-[8px] text-slate-500 uppercase tracking-tighter">{style.desc}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section className="pt-8 border-t border-white/5 space-y-8">
                                    <div>
                                        <div className="flex items-center justify-between mb-4 px-1">
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Inventory</h3>
                                                <p className="text-[9px] text-slate-600 mt-1 uppercase">Select to preview • Drag to reorder</p>
                                            </div>
                                            <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{allImages.length} Artifacts</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-4 gap-3">
                                            {allImages.map((img, idx) => {
                                                const isActive = activeMediaIndex === idx;
                                                const isPrimary = img === selectedMoment.image;
                                                
                                                return (
                                                    <div 
                                                        key={idx}
                                                        draggable
                                                        onDragStart={() => handleItemDragStart(idx)}
                                                        onDragOver={handleItemDragOver}
                                                        onDrop={() => handleItemDrop(idx)}
                                                        onClick={() => setActiveMediaIndex(idx)}
                                                        className={`relative aspect-square group cursor-pointer transition-all duration-500 
                                                            ${draggedItemIndex === idx ? 'opacity-20 scale-90' : 'opacity-100'}
                                                            ${isActive ? 'z-10 scale-[1.05]' : 'hover:scale-[1.02]'}
                                                        `}
                                                    >
                                                        <div className={`w-full h-full rounded-2xl overflow-hidden border-2 transition-all 
                                                            ${isActive ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/10 opacity-60 group-hover:opacity-100 group-hover:border-white/20'}
                                                        `}>
                                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                                        </div>

                                                        {/* Icon Overlay */}
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(idx); setIsMagicEditModalOpen(true); }}
                                                                    className="p-2 rounded-xl bg-purple-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                                                                    title="Magic Refine"
                                                                >
                                                                    <Wand2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); removeArtifact(idx); }}
                                                                    className="p-2 rounded-xl bg-red-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                                                                    title="Discard"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="absolute top-2 left-2 p-1 rounded-lg bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 pointer-events-none">
                                                            <GripVertical size={10} className="text-white/60" />
                                                        </div>

                                                        {isPrimary && (
                                                            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black p-1 rounded-full shadow-lg z-20">
                                                                <Star size={10} fill="currentColor" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            <button className="aspect-square rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:text-cyan-400 group">
                                                <Plus size={18} />
                                                <span className="text-[7px] font-black uppercase">Append</span>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-12 animate-fade-in">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                        <Bot size={14} className="text-cyan-400"/> Core Synthesis Mode
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleUpdateField('useVocalSignature', false)}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col gap-2 ${!selectedMoment.useVocalSignature ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/5 bg-white/[0.02]'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <Bot size={20} className="text-cyan-400" />
                                                {!selectedMoment.useVocalSignature && <Check size={14} className="text-cyan-400" />}
                                            </div>
                                            <span className="font-bold text-white text-sm">Master Narrators</span>
                                            <p className="text-[9px] text-slate-500 leading-relaxed italic">"Platform-optimized voices with high semantic range."</p>
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleUpdateField('useVocalSignature', true)}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all flex flex-col gap-2 ${selectedMoment.useVocalSignature ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5 bg-white/[0.02]'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <Fingerprint size={20} className="text-amber-400" />
                                                {selectedMoment.useVocalSignature && <Check size={14} className="text-amber-400" />}
                                            </div>
                                            <span className="font-bold text-white text-sm">Vocal Signature</span>
                                            <p className="text-[9px] text-slate-500 leading-relaxed italic">"Use your unique authenticated frequency."</p>
                                        </button>
                                    </div>
                                </div>

                                <section className="pt-8 border-t border-white/5 pb-12">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                        <Music size={14} className="text-emerald-400"/> Soundscape
                                    </h3>
                                    {selectedMoment.music ? (
                                        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-emerald-500/30">
                                                    <img src={selectedMoment.music.albumArt} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{selectedMoment.music.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{selectedMoment.music.artist}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setIsMusicModalOpen(true)} className="p-3 rounded-full hover:bg-emerald-500/10 text-emerald-400 transition-all">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setIsMusicModalOpen(true)}
                                            className="w-full p-8 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 transition-all flex flex-col items-center gap-4 group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:text-emerald-400 transition-all shadow-xl">
                                                <Plus size={24} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Attach Musical Thread</span>
                                        </button>
                                    )}
                                </section>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="space-y-12 animate-fade-in">
                                <section>
                                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                                        <Database size={16} /> Energy Level
                                    </h3>
                                    
                                    <div className="p-8 rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Zap size={80} className="text-indigo-400" />
                                        </div>
                                        
                                        <div className="relative z-10 space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4">Monthly Living Moments</p>
                                                <div className="flex items-end justify-between mb-4">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-bold font-brand text-white">{livingMomentsRemaining}</span>
                                                        <span className="text-slate-600 font-bold uppercase text-[10px]">/ {tokenState.livingMomentsQuota.total}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Resets in 12 days</p>
                                                    </div>
                                                </div>
                                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 shadow-[0_0_15px_rgba(129,140,248,0.5)] transition-all duration-1000 rounded-full" 
                                                        style={{ width: `${(livingMomentsRemaining / tokenState.livingMomentsQuota.total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Energy Tier</p>
                                                    <p className="text-xs font-bold text-white uppercase tracking-tight">{userTier}</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Status</p>
                                                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-tight">Balanced</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => onNavigate(Page.Subscription)}
                                                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3"
                                            >
                                                Expand Energy Level <ArrowRight size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MusicSelectorModal isOpen={isMusicModalOpen} onClose={() => setIsMusicModalOpen(false)} onSelect={(t) => handleUpdateField('music', t)} />
            <MagicEditModal isOpen={isMagicEditModalOpen} onClose={() => setIsMagicEditModalOpen(false)} originalImage={currentMedia} onApply={(newImg) => handleUpdateField('image', newImg)} triggerConfirmation={triggerConfirmation} />
        </div>
    );
};

export default CuratePage;
