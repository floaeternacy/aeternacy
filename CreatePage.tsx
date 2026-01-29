
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createDemoStoryFromImages, rewriteStory } from './services/geminiService';
import { Moment, Page, UserTier } from './types';
import { 
    UploadCloud, X, Star, MapPin, Users, Tag, RotateCw, 
    Loader2, BookOpen, FilePenLine, BookImage, Hand, Wand2, 
    Bike, CakeSlice, Briefcase, ChevronLeft, Database, Sparkles, 
    RotateCcw, Layers, ImageIcon 
} from 'lucide-react';
import GoogleIcon from './components/icons/GoogleIcon';
import CloudImportModal, { CloudProvider } from './components/CloudImportModal';
import { ASSETS } from './data/assets';

interface CreatePageProps {
    onCreateMoment: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
    onCreateAndEditMoment: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
    onNavigate: (page: Page) => void;
    userTier: UserTier;
    showGuide?: boolean;
    onCloseGuide?: () => void;
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

const CreatePage: React.FC<CreatePageProps> = ({ onCreateMoment, onCreateAndEditMoment, onNavigate, userTier, showGuide, onCloseGuide }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);
    const [promptInput, setPromptInput] = useState('');
    
    // Cloud Import State
    const [cloudModal, setCloudModal] = useState<{ isOpen: boolean; provider: CloudProvider }>({ isOpen: false, provider: 'google' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const imageLimit = useMemo(() => {
        switch (userTier) {
            case 'lægacy': return 20;
            case 'fæmily': return 10;
            case 'essæntial': return 10;
            case 'free': return 5;
            default: return 5;
        }
    }, [userTier]);

    const photoCountExceeded = selectedFiles.length > imageLimit;

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
            const combined = [...prevFiles, ...newFiles].slice(0, 20); 
            if (!combined.some(f => f.isHeader) && combined.length > 0) {
                combined[0].isHeader = true;
            }
            return combined;
        });
        setGeneratedContent(null);
    }, []);

    const handleGenerateStory = useCallback(async () => {
        if (!selectedFiles.length || isGenerating) return;
        setIsGenerating(true);
        try {
            const imagePayloads = await Promise.all(
                selectedFiles.map(async (sf) => ({
                    data: await fileToBase64(sf.file),
                    mimeType: sf.file.type,
                }))
            );
            const result = await createDemoStoryFromImages(imagePayloads);
            setGeneratedContent(result);
        } catch (error) {
            console.error("Generation error", error);
        } finally {
            setIsGenerating(false);
        }
    }, [selectedFiles, isGenerating]);

    useEffect(() => {
        if (selectedFiles.length > 0 && selectedFiles.every(f => f.status === 'uploading')) {
            const timer = setTimeout(() => {
                setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'complete' })));
            }, 1000);
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
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            description: generatedContent.story,
            location: generatedContent.tags.location[0],
            people: generatedContent.tags.people,
            activities: generatedContent.tags.activities,
            photoCount: selectedFiles.length
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
        <div className="h-screen bg-[#050811] text-slate-200 flex flex-col overflow-hidden">
            
            {/* Header: Fixed and compact */}
            <div className="h-14 px-6 flex items-center border-b border-white/5 bg-[#0B101B] flex-shrink-0 z-50">
                <button onClick={() => onNavigate(Page.Home)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mr-8">
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </button>
                <h1 className="text-md font-bold font-brand text-white tracking-tight uppercase tracking-widest">Curation Studio</h1>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="p-2 md:p-4 max-w-[1920px] mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_420px] gap-4">
                    
                    {/* DROPZONE AREA */}
                    <div 
                        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
                        className={`min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed rounded-[1.5rem] transition-all duration-500 p-4 md:p-8
                            ${isDragging ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-white/10 bg-[#0B101B]/40 hover:bg-[#0B101B]/60'}
                        `}
                    >
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800/80 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-lg">
                            <UploadCloud className={`w-6 h-6 md:w-7 md:h-7 ${isDragging ? 'text-cyan-400 animate-bounce' : 'text-slate-500'}`} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold font-brand text-white mb-1 text-center">Drop your memories here</h2>
                        <p className="text-slate-500 mb-6 font-medium text-xs md:text-sm text-center">Drag photos or browse local files</p>
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-slate-950 font-bold py-2 px-8 rounded-xl text-xs md:text-sm hover:bg-slate-100 transition-all transform active:scale-95 shadow-md"
                        >
                            Choose Files
                        </button>
                        <input type="file" ref={fileInputRef} multiple className="hidden" accept="image/*" onChange={handleFileSelect} />

                        {/* Cloud Sources */}
                        <div className="mt-8 w-full max-w-[200px] flex flex-col items-center">
                            <div className="flex items-center gap-2 w-full mb-4">
                                <div className="h-px bg-white/5 flex-grow"></div>
                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-600">Cloud Sync</span>
                                <div className="h-px bg-white/5 flex-grow"></div>
                            </div>
                            
                            <div className="flex justify-center">
                                <button onClick={() => setCloudModal({ isOpen: true, provider: 'google' })} className="group flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform group-active:scale-95">
                                        <GoogleIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Google Photos</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* REVIEW PANEL */}
                    <div className="bg-[#0B101B]/60 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex flex-col overflow-hidden shadow-2xl h-fit min-h-[400px]">
                        
                        {/* Review Header */}
                        <div className="p-4 pb-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-xs font-bold font-brand text-white uppercase tracking-widest">æterny Review</h2>
                                <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                            </div>
                            <p className="text-slate-500 text-[10px] italic">"Mapping your story..."</p>
                        </div>

                        {/* Review Body */}
                        <div className="p-4 flex-grow">
                            {!selectedFiles.length ? (
                                <div className="h-48 md:h-64 flex flex-col items-center justify-center text-center py-10 relative overflow-hidden rounded-2xl bg-black/40 group">
                                    <img src={ASSETS.UI.PLACEHOLDERS[2]} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-all duration-700 group-hover:opacity-40" alt="" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                            <ImageIcon className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 max-w-[140px] mx-auto">Upload memories to begin neural curation.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-fade-in">
                                    {/* Selected Thumbnails Grid */}
                                    <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                                        {selectedFiles.map(f => (
                                            <div key={f.id} className="aspect-square rounded-md overflow-hidden relative group bg-slate-800 ring-1 ring-white/10 shadow-sm transition-transform hover:scale-105">
                                                <img src={f.preview} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => handleRemoveFile(f.id)}
                                                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Content View */}
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center justify-center py-6 gap-2">
                                            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                                            <p className="text-cyan-400/80 font-black uppercase tracking-[0.2em] text-[7px]">Analyzing Stream</p>
                                        </div>
                                    ) : generatedContent ? (
                                        <div className="space-y-4 animate-fade-in-up">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <input 
                                                    value={generatedContent.title}
                                                    onChange={e => setGeneratedContent({ ...generatedContent, title: e.target.value })}
                                                    className="w-full bg-transparent text-sm font-bold text-white outline-none border-none p-0 focus:ring-0 font-brand tracking-tight"
                                                />
                                                <div className="h-px bg-white/10 w-full my-2"></div>
                                                <textarea 
                                                    value={generatedContent.story}
                                                    onChange={e => setGeneratedContent({ ...generatedContent, story: e.target.value })}
                                                    className="w-full bg-transparent text-slate-300 text-[9px] md:text-[10px] leading-relaxed font-serif outline-none border-none p-0 focus:ring-0 min-h-[80px] resize-none"
                                                />
                                            </div>
                                            
                                            {/* AI Control Tool */}
                                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-2.5 flex items-center gap-2.5">
                                                <RotateCw className={`w-3 h-3 text-cyan-400 ${isRewriting ? 'animate-spin' : ''}`} />
                                                <input 
                                                    value={promptInput}
                                                    onChange={(e) => setPromptInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleRewrite()}
                                                    placeholder="Adjust tone..."
                                                    className="bg-transparent text-[9px] text-white placeholder-slate-600 outline-none flex-grow"
                                                />
                                                <button onClick={handleRewrite} disabled={!promptInput.trim() || isRewriting} className="text-[8px] font-black uppercase text-cyan-400 hover:text-cyan-200 tracking-widest disabled:opacity-30">Apply</button>
                                            </div>

                                            {/* Meta tags */}
                                            <div className="flex flex-wrap gap-1">
                                                {generatedContent.tags.location.map(t => (
                                                    <span key={t} className="px-2 py-0.5 bg-white/5 rounded-full text-[7px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={8} className="text-cyan-500" /> {t}</span>
                                                ))}
                                                {generatedContent.tags.people.map(t => (
                                                    <span key={t} className="px-2 py-0.5 bg-white/5 rounded-full text-[7px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><Users size={8} className="text-indigo-500" /> {t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Review Footer */}
                        <div className="p-4 pt-1 bg-[#0B101B]/80 border-t border-white/5 flex-shrink-0">
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => handleSaveMoment(onCreateMoment)}
                                    disabled={!generatedContent || isGenerating || photoCountExceeded}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-[9px] uppercase tracking-widest transition-all disabled:opacity-30"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => handleSaveMoment(onCreateAndEditMoment)}
                                    disabled={!generatedContent || isGenerating || photoCountExceeded}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl text-[9px] uppercase tracking-widest transition-all disabled:opacity-30 shadow-lg shadow-cyan-900/20"
                                >
                                    Open Studio
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LEGACY RESCUE BANNER - Positioned at bottom in grid flow */}
                    <div className="bg-[#0B101B] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group col-span-1 md:col-start-1">
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center ring-1 ring-amber-500/20 shadow-inner group-hover:scale-105 transition-transform">
                                <Database className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white font-brand">Legacy Rescue</h3>
                                <p className="text-slate-500 text-[9px]">Import tens of thousands at once.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onNavigate(Page.BulkUpload)}
                            className="bg-[#f59e0b] hover:bg-amber-400 text-slate-950 font-black py-2 px-6 rounded-lg text-[9px] uppercase tracking-widest transition-all shadow-lg relative z-10"
                        >
                            Open
                        </button>
                    </div>
                </div>
            </div>

            {/* Cloud Modal Integration */}
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
