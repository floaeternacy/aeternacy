
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Page, Moment, UserTier, TokenState } from '../types';
import { 
  UploadCloud, X, Loader2, CheckCircle2, 
  Sparkles, ImageIcon, ShieldCheck, Database, 
  FileText, ArrowRight, Mic, Waves, Bot, History,
  Plus, Cloud, Smartphone, Instagram, HardDrive,
  Trash2, GripVertical, Check, Settings2,
  Wand2, Globe, ArrowLeft, Star, Info,
  ChevronRight, Zap,
  Landmark, MapPin, Users,
  Activity, Cpu, BrainCircuit,
  Share2,
  Camera
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { generateAeternyStory, imageUrlToPayload } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { ASSETS } from '../data/assets';
import { PresenceGlow } from './AeternyFab';
import GoogleIcon from './icons/GoogleIcon';
import PageHeader from './PageHeader';
import { formatArchivalDate } from '../utils/dateUtils';

interface UploadPageProps {
  onNavigate: (page: Page) => void;
  onCreateMoment: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
  userTier: UserTier;
  tokenState: TokenState;
}

interface StagedArtifact {
    id: string;
    file?: File;
    preview: string;
    type: 'image' | 'video' | 'audio';
    status: 'staged' | 'uploading' | 'synced';
    source: 'local' | 'cloud' | 'voice';
    isHeader: boolean;
}

const ThoughtStream: React.FC<{ active: boolean }> = ({ active }) => {
    const thoughts = [
        "Analyzing visual composition...",
        "Identifying emotional peaks...",
        "Extracting spatial metadata...",
        "Drafting narrative...",
        "Synchronizing with house vault..."
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % thoughts.length);
        }, 1200);
        return () => clearInterval(interval);
    }, [active, thoughts.length]);

    return (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em]">
                <Activity size={10} className="animate-pulse" /> media analysis active
            </div>
            <p className="text-sm md:text-lg font-serif italic text-slate-300 transition-all duration-700 h-6">
                "{thoughts[currentIndex]}"
            </p>
        </div>
    );
};

const UploadPage: React.FC<UploadPageProps> = ({ onNavigate, onCreateMoment, userTier, tokenState }) => {
  const [stagedItems, setStagedItems] = useState<StagedArtifact[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [generatedMoment, setGeneratedMoment] = useState<Omit<Moment, 'id' | 'pinned'> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const addLocalFiles = async (files: File[]) => {
    const newItems = await Promise.all(files.map(async (file, idx) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image' as any,
        status: 'staged' as const,
        source: 'local' as const,
        isHeader: stagedItems.length === 0 && idx === 0 
    })));
    setStagedItems(prev => [...prev, ...newItems]);
    setGeneratedMoment(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addLocalFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addLocalFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeStagedItem = (id: string) => {
    setStagedItems(prev => {
        const remaining = prev.filter(item => item.id !== id);
        if (remaining.length > 0 && !remaining.some(r => r.isHeader)) {
            remaining[0].isHeader = true;
        }
        return remaining;
    });
    setGeneratedMoment(null);
  };

  const setHeaderItem = (id: string) => {
    setStagedItems(prev => prev.map(item => ({
        ...item,
        isHeader: item.id === id
    })));
    if (generatedMoment) {
        const item = stagedItems.find(i => i.id === id);
        if (item) {
            setGeneratedMoment({
                ...generatedMoment,
                image: item.preview
            });
        }
    }
  };

  const handleItemDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleItemDrop = (index: number) => {
    if (draggedItemIndex === null) return;
    const items = [...stagedItems];
    const draggedItem = items[draggedItemIndex];
    items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);
    
    // Auto-update header status if moved to front
    const updated = items.map((it, idx) => ({
        ...it,
        isHeader: idx === 0
    }));
    
    setStagedItems(updated);
    setDraggedItemIndex(null);
    setGeneratedMoment(null);
  };

  const handleSynthesize = async () => {
    if (stagedItems.length === 0) return;
    setIsSynthesizing(true);
    
    try {
        const localUrls = stagedItems.map(item => item.preview);
        const headerItem = stagedItems.find(i => i.isHeader) || stagedItems[0];
        const primaryItems = stagedItems.slice(0, 3);
        
        const payloads = await Promise.all(primaryItems.map(async (item) => {
            const res = await fetch(item.preview);
            const blob = await res.blob();
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(blob);
            });
            return { data: base64, mimeType: blob.type };
        }));

        const result = await generateAeternyStory(payloads, { name: user?.displayName || 'Traveler' });

        // Artificial delay for cinematic reasoning experience
        await new Promise(r => setTimeout(r, 4000));

        setGeneratedMoment({
            type: 'standard',
            aiTier: 'premium',
            image: headerItem.preview,
            images: localUrls,
            title: result.title,
            date: formatArchivalDate(new Date()),
            description: result.story,
            location: result.tags.location?.[0],
            people: result.tags.people,
            activities: result.tags.activities,
            emotion: result.tags.emotion as any,
            photoCount: stagedItems.length
        });
    } catch (err) {
        console.error("Synthesis failed", err);
    } finally {
        setIsSynthesizing(false);
    }
  };

  const handleFinalSeal = async () => {
    if (!generatedMoment) return;
    setIsFinalizing(true);
    await new Promise(r => setTimeout(r, 1500));
    onCreateMoment(generatedMoment);
    setIsFinalizing(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} flex flex-col relative selection:bg-cyan-500/20`}>
      {/* ATMOSPHERIC PORTAL BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src={getOptimizedUrl(ASSETS.UI.PLACEHOLDERS[8], 1920)} 
            className="w-full h-full object-cover opacity-5 grayscale scale-110 animate-ken-burns-slow blur-2xl" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-transparent to-[#050811]"></div>
      </div>

      <PageHeader 
        title="Capture" 
        onBack={() => onNavigate(Page.Home)}
        actions={
            <div className="flex items-center gap-4 mr-4">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Archival Link Ready</span>
                </div>
            </div>
        }
      />

      <main className="relative z-10 flex-grow container mx-auto px-6 py-32 max-w-6xl">
        
        {stagedItems.length === 0 ? (
            <div className="animate-fade-in-up space-y-24">
                
                {/* TIER 1: THE PRIMARY INGRESS (UPLOAD) */}
                <section className="space-y-8">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Gate I</h2>
                        <h1 className="text-4xl md:text-6xl font-bold font-brand text-white tracking-tighter leading-none">Archive Ingress.</h1>
                    </div>

                    <div 
                        onDragOver={handleDragOver} 
                        onDragLeave={handleDragLeave} 
                        onDrop={handleDrop} 
                        className={`relative min-h-[400px] rounded-[3rem] border-2 border-dashed transition-all duration-1000 flex flex-col items-center justify-center p-12 overflow-hidden
                            ${isDragging ? 'border-cyan-500 bg-cyan-500/5 scale-[1.01] shadow-[0_0_100px_rgba(6,182,212,0.1)]' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'}
                        `}
                    >
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-800/80 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transition-transform duration-500 group-hover:scale-110 ring-1 ring-white/10">
                                <ImageIcon size={32} className="text-slate-400" />
                            </div>
                            
                            <div className="space-y-4 mb-10">
                                <h2 className="text-2xl md:text-3xl font-bold font-brand text-white tracking-tight">Stage your existing fragments.</h2>
                                <p className="text-slate-500 font-serif italic text-base max-w-lg mx-auto">
                                    "Drop photos or videos into the staging area to begin neural weaving."
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="h-14 px-10 bg-white text-stone-950 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Select Files
                                </button>
                                <p className="text-[10px] font-black uppercase text-slate-700 tracking-widest px-4">or drag them here</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TIER 2: LIVE RESONANCE (RECORD) */}
                <section className="space-y-8">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Gate II</h2>
                        <h1 className="text-4xl md:text-6xl font-bold font-brand text-white tracking-tighter leading-none">Capture Resonance.</h1>
                    </div>

                    <button 
                        onClick={() => onNavigate(Page.Record)}
                        className="w-full group relative min-h-[300px] rounded-[3rem] border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-md transition-all duration-700 hover:bg-indigo-950/20 hover:border-indigo-400/40 flex flex-col md:flex-row items-center justify-between p-12 text-left overflow-hidden shadow-2xl"
                    >
                        {/* Static Wave Background */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                            <div className="absolute top-1/2 left-0 w-full h-px bg-indigo-400 animate-pulse"></div>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                            <div className="relative">
                                <div className="absolute -inset-8 rounded-full bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/30 transition-all duration-1000 animate-pulse"></div>
                                <PresenceGlow active={true} intensity={0.3} size="lg" />
                            </div>
                            
                            <div className="space-y-4 max-w-md">
                                <h3 className="text-3xl font-bold font-brand text-white tracking-tight group-hover:text-indigo-200 transition-colors">Immediate Capture.</h3>
                                <p className="text-slate-400 font-serif italic text-lg leading-relaxed">
                                    "Speak directly into the archive. æterny will stabilize your voice and spatial node in real-time."
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-cyan-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Sensory Link Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 md:mt-0">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-3xl transform transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 group-active:scale-95">
                                <ArrowRight size={32} strokeWidth={3} />
                            </div>
                        </div>
                    </button>
                </section>

                {/* TIER 3: THE BRIDGES (SYNC) */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500">Gate III: Global Bridges</h2>
                            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest hidden sm:inline">• Automated Synchronization</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { id: 'google', label: 'Google Photos', icon: GoogleIcon, color: 'hover:bg-white/5 hover:border-white/20' },
                            { id: 'mobile', label: 'Mobile Transfer', icon: Smartphone, color: 'hover:bg-cyan-500/5 hover:border-cyan-500/20' },
                            { id: 'social', label: 'Social Import', icon: Share2, color: 'hover:bg-pink-500/5 hover:border-pink-500/20' },
                            { id: 'drive', label: 'iCloud / Drive', icon: Cloud, color: 'hover:bg-blue-500/5 hover:border-blue-500/20' }
                        ].map((bridge) => (
                            <button 
                                key={bridge.id}
                                className={`group p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] transition-all duration-500 text-center flex flex-col items-center gap-4 ${bridge.color}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:text-white transition-all shadow-inner">
                                    <bridge.icon width={22} height={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{bridge.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* TIER 4: ARCHIVE RESCUE (BULK) */}
                <section className="pt-8">
                    <button 
                        onClick={() => onNavigate(Page.BulkUpload)}
                        className="w-full relative group p-8 md:p-12 rounded-[3.5rem] bg-gradient-to-br from-amber-950/20 to-[#0A0C14] border border-amber-500/10 transition-all duration-700 hover:border-amber-500/30 overflow-hidden shadow-3xl text-left"
                    >
                        {/* Subtle Glow */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                    <HardDrive width={32} height={32} />
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                        <h4 className="text-2xl font-bold font-brand text-white tracking-tight">Archive Rescue™</h4>
                                        <span className="bg-amber-600 text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Institutional</span>
                                    </div>
                                    <p className="text-slate-400 font-serif italic text-lg">"Ingest 10,000+ scattered fragments at once."</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Reclamation Mode</p>
                                    <p className="text-xs font-bold text-amber-500">Deep Neural Recovery</p>
                                </div>
                                <div className="px-8 py-3 bg-amber-600 text-black font-black rounded-xl text-[10px] uppercase tracking-widest group-hover:bg-amber-500 transition-all">
                                    Open Portal
                                </div>
                            </div>
                        </div>
                    </button>
                    
                    <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-800">
                        æternacy™ sovereign archival protocol v14.6
                    </p>
                </section>
            </div>
        ) : (
            <div className="animate-fade-in space-y-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Artifact Grid */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Staging</span>
                                <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{stagedItems.length} Photos & Videos</span>
                            </div>
                            <button onClick={() => setStagedItems([])} className="text-[9px] font-black uppercase text-slate-600 hover:text-red-400 transition-colors flex items-center gap-2"><Trash2 size={12} /> Discard Selection</button>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {stagedItems.map((item, idx) => (
                                <div 
                                    key={item.id}
                                    draggable
                                    onDragStart={() => handleItemDragStart(idx)}
                                    onDragOver={handleItemDragOver}
                                    onDrop={() => handleItemDrop(idx)}
                                    className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border transition-all cursor-move
                                        ${item.isHeader ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'border-white/10'}
                                        ${draggedItemIndex === idx ? 'opacity-20 scale-90' : 'opacity-100'}
                                        hover:border-cyan-500/40`}
                                >
                                    <img src={item.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        {!item.isHeader && (
                                            <button onClick={(e) => { e.stopPropagation(); setHeaderItem(item.id); }} className="px-3 py-1.5 rounded-full bg-cyan-500 text-black text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 transform hover:scale-105 active:scale-95"><Star size={10} fill="currentColor" /> Cover</button>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); removeStagedItem(item.id); }} className="p-2.5 rounded-full bg-red-500 text-white shadow-2xl transform scale-75 group-hover:scale-100 transition-all active:scale-95"><X size={14} /></button>
                                    </div>
                                    <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 pointer-events-none">
                                        <GripVertical size={12} className="text-white/60" />
                                    </div>
                                    {item.isHeader && <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-cyan-500 text-black shadow-xl"><Star size={12} fill="currentColor" /></div>}
                                </div>
                            ))}
                            <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all flex flex-col items-center justify-center gap-2 text-slate-700 hover:text-slate-300 group">
                                <Plus size={20} />
                                <span className="text-[8px] font-black uppercase">Append</span>
                            </button>
                        </div>

                        {!generatedMoment && !isSynthesizing && (
                            <div className="pt-8">
                                <button 
                                    onClick={handleSynthesize}
                                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/40 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <Sparkles size={20} className="animate-pulse" /> Weave Narrative
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Synthesis Preview Card */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        {isSynthesizing ? (
                            <div className="bg-[#0B101B]/80 backdrop-blur-3xl border border-cyan-500/20 rounded-[3rem] p-16 text-center flex flex-col items-center gap-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-fade-in min-h-[500px] justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse scale-150"></div>
                                    <PresenceGlow active intensity={1} size="lg" />
                                </div>
                                <div className="space-y-8 w-full">
                                    <h3 className="text-3xl font-bold font-brand text-white tracking-tighter">Analyzing...</h3>
                                    <ThoughtStream active={isSynthesizing} />
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto">
                                        <div className="h-full bg-cyan-500 animate-[progress_4s_linear_forwards]" />
                                    </div>
                                </div>
                            </div>
                        ) : generatedMoment ? (
                            <div className="bg-[#0B101B] border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-3xl space-y-10 animate-fade-in-up">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner"><Bot size={24} /></div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white tracking-tight">Narrative Ready</h4>
                                            <p className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.4em]">Review required</p>
                                        </div>
                                    </div>
                                    <Sparkles size={18} className="text-cyan-400/40" />
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-1">Title</label>
                                        <h2 className="text-3xl font-bold font-brand text-white leading-tight">{generatedMoment.title}</h2>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-1">Story</label>
                                        <p className="text-base text-slate-300 font-serif italic leading-relaxed">"{generatedMoment.description}"</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4">
                                    <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 border border-white/5"><MapPin size={10}/> {generatedMoment.location || 'Unknown'}</span>
                                    {generatedMoment.people?.map(p => (
                                        <span key={p} className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2 border border-white/5"><Users size={10}/> {p}</span>
                                    ))}
                                </div>

                                <div className="pt-6 flex flex-col gap-4">
                                    <button 
                                        onClick={handleFinalSeal} 
                                        disabled={isFinalizing}
                                        className="w-full h-20 bg-white text-stone-950 font-black rounded-3xl text-xs uppercase tracking-[0.3em] shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                                    >
                                        {isFinalizing ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={3} />}
                                        Save Memory
                                    </button>
                                    <button onClick={() => onNavigate(Page.Curate)} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Manual Refine in Studio</button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        )}

        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
      </main>
      <style>{`
        @keyframes progress { 
            0% { width: 0%; }
            20% { width: 15%; }
            40% { width: 45%; }
            60% { width: 75%; }
            100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default UploadPage;
