
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createDemoStoryFromImages, rewriteStory } from '../services/geminiService';
import { Moment, Page, UserTier } from '../types';
import { 
    UploadCloud, X, MapPin, Users, RotateCw, 
    Loader2, ImageIcon, Bot, Database, Sparkles, 
    ArrowRight, CheckCircle2, ChevronLeft, ChevronRight,
    FileText, Waves, ShieldCheck, AlertTriangle, Cloud, Zap,
    Plus
} from 'lucide-react';
import GoogleIcon from './icons/GoogleIcon';
import CloudImportModal, { CloudProvider } from './CloudImportModal';
import { ASSETS } from '../data/assets';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { PresenceGlow } from './AeternyFab';
import PageHeader from './PageHeader';
import { formatArchivalDate } from '../utils/dateUtils';

interface CreatePageProps {
    onCreateMoment: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
    onCreateAndEditMoment: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
    onNavigate: (page: Page) => void;
    userTier: UserTier;
}

interface SelectedFile {
    id: string;
    file: File;
    preview: string;
    status: 'uploading' | 'analyzing' | 'complete';
    isHeader: boolean;
}

interface GeneratedContent {
    title: string;
    story: string;
    tags: {
        location: string[];
        people: string[];
        activities: string[];
    };
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const CreatePage: React.FC<CreatePageProps> = ({ onCreateMoment, onCreateAndEditMoment, onNavigate, userTier }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);
    const [promptInput, setPromptInput] = useState('');
    const [cloudModal, setCloudModal] = useState<{ isOpen: boolean; provider: CloudProvider }>({ isOpen: false, provider: 'google' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tierConfig = useMemo(() => {
        switch (userTier) {
            case 'lægacy': return { limit: 500, label: 'Unlimited Artifacts' };
            case 'fæmily': return { limit: 50, label: '50 Artifacts' };
            case 'essæntial': return { limit: 20, label: '20 Artifacts' };
            default: return { limit: 5, label: '5 Artifacts' };
        }
    }, [userTier]);

    const photoCountExceeded = selectedFiles.length > tierConfig.limit;

    const processFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const newFilesPromises = fileArray.map(async (file): Promise<SelectedFile> => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            preview: await fileToDataUrl(file),
            status: 'uploading',
            isHeader: false,
        }));
        
        const newFiles = await Promise.all(newFilesPromises);

        setSelectedFiles(prevFiles => {
            const combined = [...prevFiles, ...newFiles];
            if (!combined.some(f => f.isHeader) && combined.length > 0) {
                combined[0].isHeader = true;
            }
            return combined;
        });
        setGeneratedContent(null);
    }, []);

    const handleGenerateStory = useCallback(async () => {
        if (!selectedFiles.length || isGenerating || photoCountExceeded) return;
        setIsGenerating(true);
        try {
            const contextFiles = selectedFiles.slice(0, 5);
            const imagePayloads = await Promise.all(
                contextFiles.map(async (sf) => ({
                    data: await fileToBase64(sf.file),
                    mimeType: sf.file.type
                }))
            );
            const result = await createDemoStoryFromImages(imagePayloads);
            setGeneratedContent(result);
        } catch (error) {
            console.error("Generation error", error);
        } finally {
            setIsGenerating(false);
        }
    }, [selectedFiles, isGenerating, photoCountExceeded]);

    useEffect(() => {
        if (selectedFiles.length > 0 && selectedFiles.every(f => f.status === 'uploading')) {
            const timer = setTimeout(() => {
                setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'complete' })));
            }, 1200);
            return () => clearTimeout(timer);
        }
        
        if (selectedFiles.length > 0 && selectedFiles.every(f => f.status === 'complete') && !generatedContent && !isGenerating) {
            handleGenerateStory();
        }
    }, [selectedFiles, generatedContent, isGenerating, handleGenerateStory]);

    const handleRemoveFile = (idToRemove: string) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== idToRemove));
        if (selectedFiles.length <= 1) setGeneratedContent(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(e.target.files);
        e.target.value = '';
    };

    const handleSaveMoment = (callback: (moment: Omit<Moment, 'id' | 'pinned'>) => void) => {
        if (!generatedContent || !selectedFiles.length || photoCountExceeded) return;
        const headerImage = selectedFiles.find(f => f.isHeader) || selectedFiles[0];
        callback({
            type: 'standard',
            aiTier: 'diamond',
            image: headerImage.preview,
            images: selectedFiles.map(f => f.preview),
            title: generatedContent.title,
            date: formatArchivalDate(new Date()),
            description: generatedContent.story,
            location: generatedContent.tags.location[0],
            people: generatedContent.tags.people,
            activities: generatedContent.tags.activities,
            photoCount: selectedFiles.length,
            emotion: 'joy'
        });
    };

    const handleRewrite = async () => {
        if (!generatedContent || !promptInput.trim() || isRewriting) return;
        setIsRewriting(true);
        try {
            const result = await rewriteStory(generatedContent.story, promptInput);
            setGeneratedContent({ ...generatedContent, story: result });
            setPromptInput('');
        } finally {
            setIsRewriting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050811] text-slate-200 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/20">
            
            {/* IMMERSIVE ATMOSPHERE */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                    src={getOptimizedUrl(ASSETS.UI.PLACEHOLDERS[6], 1920)} 
                    className="w-full h-full object-cover opacity-10 blur-xl scale-110 animate-ken-burns-slow grayscale" 
                    alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-transparent to-[#050811]"></div>
                {isGenerating && (
                    <div className="absolute inset-0 bg-cyan-900/10 animate-pulse duration-[3s]"></div>
                )}
            </div>

            <PageHeader 
                title="Archive Ingress" 
                onBack={() => onNavigate(Page.Home)}
                actions={
                    <div className="flex items-center gap-6 animate-fade-in mr-10">
                        <div className="text-right hidden sm:block">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">Archive Health</p>
                            <span className={`text-[10px] font-mono font-bold ${photoCountExceeded ? 'text-red-400' : 'text-cyan-400'}`}>
                                {selectedFiles.length} / {tierConfig.limit} Artifacts
                            </span>
                        </div>
                    </div>
                }
            />

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center container mx-auto px-4 pt-32 pb-48">
                
                {/* STAGE 1: THE INGRESS PORTAL */}
                {!selectedFiles.length && (
                    <div className="w-full max-w-4xl text-center animate-fade-in-up">
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-8xl font-bold font-brand text-white tracking-tighter leading-none mb-8">
                                Anchor your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">History.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-500 font-serif italic leading-relaxed max-w-2xl mx-auto">
                                "Every fragment shared is a neural anchor in the permanent fabric of your lineage."
                            </p>
                        </div>

                        <div 
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
                            className={`relative min-h-[420px] flex flex-col items-center justify-center border-2 border-dashed rounded-[4rem] transition-all duration-1000 p-12 group overflow-hidden
                                ${isDragging ? 'border-cyan-500 bg-cyan-500/5 scale-[1.01] shadow-[0_0_80px_rgba(6,182,212,0.15)]' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]'}
                            `}
                        >
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                            
                            <div className="mb-12">
                                <PresenceGlow active={isDragging} intensity={isDragging ? 1 : 0.2} size="lg" />
                            </div>

                            <div className="relative z-10 space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold font-brand text-white tracking-tight">Portal Interface Ready.</h2>
                                    <p className="text-slate-600 font-serif italic text-sm">Drag artifacts into the light, or browse your vaults.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-14 bg-white text-stone-950 font-black px-10 rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <ImageIcon size={18} /> Open Local Vault
                                    </button>
                                    <button 
                                        onClick={() => setCloudModal({ isOpen: true, provider: 'google' })}
                                        className="h-14 bg-white/5 border border-white/10 text-white font-black px-10 rounded-2xl text-[10px] uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 hover:bg-white/10"
                                    >
                                        <GoogleIcon className="w-5 h-5" /> Google Photos
                                    </button>
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} multiple className="hidden" accept="image/*" onChange={handleFileSelect} />
                        </div>

                        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:opacity-60 transition-all duration-700">
                             <div className="flex items-center gap-3"><ShieldCheck size={16}/> <span className="text-[9px] font-black uppercase tracking-widest">Sovereign Encryption</span></div>
                             <div className="flex items-center gap-3"><Cloud size={16}/> <span className="text-[9px] font-black uppercase tracking-widest">Bit-Perfect Storage</span></div>
                             <div className="flex items-center gap-3"><Database size={16}/> <span className="text-[9px] font-black uppercase tracking-widest">Neural Indexing</span></div>
                        </div>
                    </div>
                )}

                {/* STAGE 2: THE WEAVE (Processing / Review) */}
                {selectedFiles.length > 0 && (
                    <div className="w-full max-w-6xl animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            
                            {/* Left: Artifact Inspection */}
                            <div className="lg:col-span-6 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Threads for Synthesis</h3>
                                    <button onClick={() => setSelectedFiles([])} className="text-[9px] font-bold text-red-400/60 hover:text-red-400 uppercase tracking-widest flex items-center gap-2 transition-all">
                                        <X size={12}/> Clear Portal
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {selectedFiles.map(f => (
                                        <div key={f.id} className="aspect-square rounded-2xl overflow-hidden relative group bg-slate-900 border border-white/5 shadow-2xl">
                                            <img src={f.preview} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => handleRemoveFile(f.id)} className="p-2 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 transition-all"><X size={12}/></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-cyan-400"
                                    >
                                        <Plus size={20} />
                                        <span className="text-[8px] font-black uppercase">Append</span>
                                    </button>
                                </div>

                                {isGenerating ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-12">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse"></div>
                                            <Loader2 size={64} className="text-cyan-400 animate-spin relative z-10" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold font-brand text-white tracking-tight animate-pulse">Synthesizing Narrative...</h3>
                                            <p className="text-slate-500 font-serif italic text-lg leading-relaxed max-w-sm">"I am listening to the texture of your imagery, identifying the peaks of emotion."</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-3xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 shadow-inner"><ShieldCheck size={24}/></div>
                                            <div>
                                                <h4 className="font-bold text-white tracking-tight">Bit-Perfect Vaulting</h4>
                                                <p className="text-xs text-slate-500 italic font-serif">"Your original assets are being secured in an encrypted silo."</p>
                                            </div>
                                        </div>
                                        <div className="bg-amber-600/10 border border-amber-500/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-8 group cursor-pointer hover:bg-amber-600/15 transition-all" onClick={() => onNavigate(Page.BulkUpload)}>
                                            <div className="flex items-center gap-6">
                                                <Database size={32} className="text-amber-500" />
                                                <div className="text-left">
                                                    <h4 className="font-bold text-white">Archive Rescue™</h4>
                                                    <p className="text-xs text-slate-400">Looking to ingest 10,000+ scattered fragments at once?</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: The Manifest Card */}
                            <div className="lg:col-span-6 lg:sticky lg:top-32">
                                {generatedContent ? (
                                    <div className="animate-fade-in-up">
                                        <div className="bg-[#0B101B] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden flex flex-col relative group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                                                <Bot size={120} className="text-cyan-400" />
                                            </div>
                                            
                                            <div className="p-10 md:p-14 space-y-10">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">The Heading</span>
                                                        <Sparkles size={16} className="text-cyan-500/40" />
                                                    </div>
                                                    <input 
                                                        value={generatedContent.title}
                                                        onChange={e => setGeneratedContent({ ...generatedContent, title: e.target.value })}
                                                        className="w-full bg-transparent text-3xl md:text-5xl font-bold text-white outline-none border-none p-0 focus:ring-0 font-brand tracking-tighter leading-none"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">The Woven Narrative</span>
                                                    <textarea 
                                                        value={generatedContent.story}
                                                        onChange={e => setGeneratedContent({ ...generatedContent, story: e.target.value })}
                                                        className="w-full bg-transparent text-slate-300 text-lg md:text-xl leading-relaxed font-serif italic outline-none border-none p-0 focus:ring-0 min-h-[160px] resize-none custom-scrollbar"
                                                    />
                                                </div>

                                                <div className="flex flex-wrap gap-2 pt-4">
                                                    {generatedContent.tags.location.map(t => (
                                                        <span key={t} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border border-white/5"><MapPin size={12} className="text-cyan-400" /> {t}</span>
                                                    ))}
                                                    {generatedContent.tags.people.map(t => (
                                                        <span key={t} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border border-white/5"><Users size={12} className="text-indigo-500" /> {t}</span>
                                                    ))}
                                                </div>

                                                {/* In-Card Tool: Aesthetic Shift */}
                                                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-4 group/ai">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                                                        <RotateCw className={`w-5 h-5 ${isRewriting ? 'animate-spin' : 'group-hover/ai:rotate-180 transition-transform duration-700'}`} />
                                                    </div>
                                                    <input 
                                                        value={promptInput}
                                                        onChange={(e) => setPromptInput(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleRewrite()}
                                                        placeholder="Ask æterny to shift the tone..."
                                                        className="bg-transparent text-sm font-bold text-white placeholder-slate-700 outline-none flex-grow"
                                                    />
                                                    <button onClick={handleRewrite} disabled={!promptInput.trim() || isRewriting} className="text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-200 tracking-widest disabled:opacity-30">Rewrite</button>
                                                </div>
                                            </div>

                                            <div className="p-10 md:p-14 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row gap-4">
                                                <button 
                                                    onClick={() => handleSaveMoment(onCreateMoment)}
                                                    disabled={isGenerating || photoCountExceeded}
                                                    className="flex-1 h-16 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-30"
                                                >
                                                    <CheckCircle2 size={18} /> Seal Archive
                                                </button>
                                                <button 
                                                    onClick={() => handleSaveMoment(onCreateAndEditMoment)}
                                                    disabled={isGenerating || photoCountExceeded}
                                                    className="flex-1 h-16 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-cyan-900/40 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-30"
                                                >
                                                    <Sparkles size={18} /> The Studio
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {photoCountExceeded && (
                                            <div className="mt-8 p-6 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-start gap-4 animate-fade-in shadow-xl">
                                                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-bold text-white mb-1">Capacity Exceeded</p>
                                                    <p className="text-[10px] text-red-400 leading-relaxed font-medium">Your current plan supports {tierConfig.limit} fragments per chapter. Upgrade to secure the entire session.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/10 rounded-[3rem] bg-black/20">
                                        <Bot size={64} className="mb-6" />
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Manifesting Narrative Interface</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <CloudImportModal 
                isOpen={cloudModal.isOpen} 
                onClose={() => setCloudModal(p => ({ ...p, isOpen: false }))} 
                provider={cloudModal.provider}
                onImport={(files) => processFiles(files)}
            />
        </div>
    );
};

export default CreatePage;
