
import React, { useState, useMemo, useEffect } from 'react';
import { Page, UserTier, Moment, Journey, AeternyStyle, TokenState } from '../types';
// Comment: Added missing icons to lucide-react imports
import { 
    ArrowLeft, Check, Film, Loader2, Wand2, MonitorSmartphone, 
    Clapperboard, Sparkles, X, Save, ChevronLeft, Info, 
    AlertCircle, ExternalLink, Key, Zap, Database, Activity, Waves,
    Cpu, Plus, AlertTriangle, RotateCw, Volume2, ArrowRight, ShieldCheck
} from 'lucide-react';
import { generateVideoScript, generateVideo, imageUrlToPayload } from '../services/geminiService';
import { TOKEN_COSTS } from '../services/costCatalog';
import PageHeader from './PageHeader';
import TokenIcon from './icons/TokenIcon';
import { useTheme } from '../contexts/ThemeContext';
// Comment: Added missing getOptimizedUrl import
import { getOptimizedUrl } from '../services/cloudinaryService';

interface AIVideoPageProps {
  onNavigate: (page: Page) => void;
  userTier: UserTier;
  moments: Moment[];
  journeys: Journey[];
  onItemUpdate: (item: Moment | Journey) => void;
  aeternyStyle: AeternyStyle;
  triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string, title?: string) => void;
  tokenState: TokenState;
}

type VideoStyle = 'Natural Resonance' | 'Archival' | 'Atmospheric' | 'Subtle Flow';
type AspectRatio = '16:9' | '9:16';
type PageState = 'select' | 'configure' | 'generating' | 'review';

const AIVideoPage: React.FC<AIVideoPageProps> = (props) => {
    const { onNavigate, userTier, moments, journeys, onItemUpdate, aeternyStyle, triggerConfirmation, tokenState } = props;
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [pageState, setPageState] = useState<PageState>('select');
    const [selectedItem, setSelectedItem] = useState<Moment | Journey | null>(null);
    
    const [videoStyle, setVideoStyle] = useState<VideoStyle>('Natural Resonance');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [withNarration, setWithNarration] = useState(true);

    const [script, setScript] = useState('');
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);

    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [isKeySelected, setIsKeySelected] = useState(false);

    const videoCost = TOKEN_COSTS.AI_VIDEO_REFLECTION;
    const canAfford = tokenState.balance >= videoCost;

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsKeySelected(hasKey);
            }
        };
        checkApiKey();
    }, []);

    const handleBack = () => {
        if (pageState !== 'select') {
            setPageState('select');
            setSelectedItem(null);
            setGeneratedVideoUrl(null);
        } else {
            onNavigate(Page.Studio);
        }
    };

    const handleSelectKey = async () => {
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                setIsKeySelected(true);
                setGenerationError(null);
            } catch (e) {
                console.error("Key selection cancelled", e);
            }
        }
    };

    const handleGenerateScript = async () => {
        if (!selectedItem) return;
        setIsGeneratingScript(true);
        try {
            const generated = await generateVideoScript(selectedItem, aeternyStyle);
            setScript(generated);
        } catch (error) {
            console.error(error);
            setScript("Neural synthesis failed. Please try again.");
        } finally {
            setIsGeneratingScript(false);
        }
    };

    const handleStartGeneration = async () => {
        if (!selectedItem) return;

        // CRITICAL: Veo models require a paid API key from the user context
        if (!isKeySelected && window.aistudio) {
            await handleSelectKey();
        }
        
        setPageState('generating');
        setGenerationError(null);
        
        try {
            const firstMomentId = 'momentIds' in selectedItem ? selectedItem.momentIds[0] : selectedItem.id;
            const moment = moments.find(m => m.id === firstMomentId);
            if (!moment || (!moment.image && !moment.images?.[0])) {
                throw new Error("No artifact found for generation.");
            }
            
            const imagePayload = await imageUrlToPayload(moment.image || moment.images![0]);
            let prompt = `Enhanced realistic animation. Style: ${videoStyle}. Title: ${selectedItem.title}.`;
            if (withNarration && script) {
                prompt += ` Narrate: "${script}"`;
            }

            const url = await generateVideo(prompt, imagePayload, aspectRatio);
            setGeneratedVideoUrl(url);
            setPageState('review');
        } catch (error: any) {
            console.error("Video Generation Error:", error);
            const message = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            
            if (message.includes("PERMISSION_DENIED") || message.includes("403") || message.includes("Requested entity was not found")) {
                setIsKeySelected(false);
                setGenerationError("Neural Link Failed: Archival infrastructure link is offline. Please re-authorize the institutional key.");
                setPageState('configure');
            } else {
                setGenerationError(message);
                setPageState('configure');
            }
        }
    };
    
    const handleTriggerGeneration = () => {
        if (!canAfford) {
            alert("Insufficient Neural Energy. Please refill your reservoir to manifest high-compute Living Frames.");
            return;
        }

        if (!isKeySelected) {
            handleSelectKey();
            return;
        }

        triggerConfirmation(
            videoCost, 
            'AI_VIDEO_REFLECTION', 
            handleStartGeneration, 
            "Deduct 500 crædits to render this high-fidelity Living Frame? This operation requires established archival infrastructure.", 
            "Begin Neural Manifestation"
        );
    };

    const handleSaveVideo = () => {
        if (selectedItem && generatedVideoUrl && !('momentIds' in selectedItem)) {
            const updatedMoment = { ...selectedItem, video: generatedVideoUrl };
            onItemUpdate(updatedMoment);
            onNavigate(Page.MomentDetail);
        } else {
            resetState();
        }
    };
    
    const resetState = () => {
        setPageState('select');
        setSelectedItem(null);
        setScript('');
        setGeneratedVideoUrl(null);
        setGenerationError(null);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} text-white`}>
            <PageHeader 
                title="Cinema Studio" 
                backLabel="STUDIO"
                onBack={handleBack}
            />

            <main className="container mx-auto px-6 pt-32 pb-40 max-w-7xl animate-fade-in-up">
                
                {/* --- COMPUTE STATUS HUD --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#0B101B] border border-white/5 p-6 rounded-3xl shadow-2xl flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <TokenIcon size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Energy Reservoir</p>
                            <p className="text-2xl font-bold font-brand text-white">{tokenState.balance.toLocaleString()} <span className="text-xs text-slate-600">Tk</span></p>
                        </div>
                    </div>
                    <div className="bg-[#0B101B] border border-white/5 p-6 rounded-3xl shadow-2xl flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isKeySelected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            <Database size={24} className={isKeySelected ? '' : 'animate-pulse'} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Neural Infrastructure</p>
                            <p className={`text-sm font-bold uppercase tracking-tight ${isKeySelected ? 'text-green-400' : 'text-red-400'}`}>
                                {isKeySelected ? 'Linked & Active' : 'Offline / Restricted'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#0B101B] border border-white/5 p-6 rounded-3xl shadow-2xl flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Manifestation Quality</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">VEO 3.1 PREVIEW</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-3xl overflow-hidden min-h-[60vh] flex flex-col relative">
                    
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    {pageState === 'select' && (
                        <div className="space-y-12 relative z-10">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-5xl font-brand font-bold text-white mb-4 tracking-tighter">Manifest a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Living Frame.</span></h2>
                                <p className="text-slate-500 font-serif italic text-lg leading-relaxed">"Choose a chapter of your timeline to manifest into a cinematic AI reflection. This process converts static history into active memory."</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {moments.filter(m => m.image).map(m => (
                                    <button key={m.id} onClick={() => { setSelectedItem(m); setPageState('configure'); }} className="aspect-[4/5] relative group rounded-3xl overflow-hidden shadow-xl border border-white/5 bg-slate-900 transition-all hover:border-cyan-500/40 hover:-translate-y-1">
                                        <img src={getOptimizedUrl(m.image || m.images?.[0] || '', 400)} alt={m.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60"></div>
                                        <p className="absolute bottom-4 left-4 right-4 font-bold text-[10px] text-white uppercase tracking-widest line-clamp-1">{m.title}</p>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"><Plus size={20}/></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {pageState === 'configure' && selectedItem && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 animate-fade-in relative z-10">
                            <div className="space-y-8">
                                <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950 group relative">
                                    <img src={'momentIds' in selectedItem ? selectedItem.coverImage : (selectedItem.image || selectedItem.images?.[0])} alt="" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"/>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="p-5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white animate-pulse"><Wand2 size={32} /></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.4em] bg-cyan-500/10 px-3 py-1 rounded-lg">Target Chapter</span>
                                    </div>
                                    <h4 className="text-3xl font-bold font-brand text-white tracking-tight">{selectedItem.title}</h4>
                                    <p className="text-slate-500 text-base italic font-serif leading-relaxed line-clamp-3">"{selectedItem.description}"</p>
                                </div>
                                
                                {generationError && (
                                    <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-300 animate-fade-in">
                                        <div className="flex items-start gap-4 mb-4">
                                            <AlertTriangle size={24} className="text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-sm">Neural Link Error</p>
                                                <p className="text-xs mt-1 opacity-70 leading-relaxed">{generationError}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleSelectKey}
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3"
                                        >
                                            <RotateCw size={14}/> Re-establish Archival Link
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.5em] flex items-center gap-2">
                                        <Activity size={14} className="text-indigo-400" /> Temporal Resonance Style
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(['Natural Resonance', 'Archival', 'Atmospheric', 'Subtle Flow'] as VideoStyle[]).map(style => (
                                            <button 
                                                key={style} 
                                                onClick={() => setVideoStyle(style)} 
                                                className={`p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex flex-col gap-2 
                                                    ${videoStyle === style ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl shadow-indigo-900/10' : 'bg-white/[0.02] border-white/5 text-slate-500 hover:text-slate-300'}`}
                                            >
                                                <span>{style}</span>
                                                {videoStyle === style && <div className="h-0.5 w-6 bg-indigo-400 rounded-full"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.5em] flex items-center gap-2">
                                        <Volume2 size={14} className="text-cyan-400" /> Archival Narration
                                    </h3>
                                    <div className={`p-6 rounded-[2rem] border transition-all ${withNarration ? 'bg-cyan-500/10 border-cyan-500/40 shadow-inner' : 'bg-white/[0.02] border-white/5'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <Sparkles size={20} className={withNarration ? 'text-cyan-400' : 'text-slate-700'} />
                                                <span className={`text-sm font-bold ${withNarration ? 'text-white' : 'text-slate-600'}`}>Embed Vocal Synthesis</span>
                                            </div>
                                            <button onClick={() => setWithNarration(!withNarration)} className={`relative h-6 w-12 items-center rounded-full transition-all ${withNarration ? 'bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'bg-slate-800'}`}>
                                                <div className={`h-4 w-4 transform rounded-full bg-white transition-all ${withNarration ? 'translate-x-7' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        {withNarration && (
                                            <div className="mt-6 animate-fade-in-up space-y-4">
                                                <textarea 
                                                    value={script} 
                                                    onChange={e => setScript(e.target.value)} 
                                                    placeholder="Awaiting neural synthesis..." 
                                                    className="w-full h-32 p-5 bg-black/40 border border-white/5 rounded-2xl text-base font-serif italic text-slate-300 outline-none focus:border-cyan-500/30 custom-scrollbar resize-none shadow-inner" 
                                                />
                                                {!script && !isGeneratingScript && (
                                                    <button onClick={handleGenerateScript} className="text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-200 tracking-widest flex items-center gap-2">
                                                        Generate Synthesis <ArrowRight size={12}/>
                                                    </button>
                                                )}
                                                {isGeneratingScript && (
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 tracking-widest animate-pulse">
                                                        <Loader2 size={12} className="animate-spin"/> Thinking...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6">
                                    <div className="flex justify-between items-end px-2">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Manifestation Fee</p>
                                            <div className="flex items-center gap-2 text-amber-500">
                                                <span className="text-3xl font-bold font-brand">{videoCost}</span>
                                                <TokenIcon size={20} />
                                            </div>
                                        </div>
                                        {!isKeySelected && (
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-[8px] font-black uppercase text-amber-500/60 animate-pulse tracking-widest">Link Required</span>
                                                <button 
                                                    onClick={handleSelectKey}
                                                    className="bg-amber-600 hover:bg-amber-500 text-white font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 active:scale-95 flex items-center gap-2"
                                                >
                                                    <Database size={14} /> Establish Sync
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {isKeySelected && (
                                        <button 
                                            onClick={handleTriggerGeneration} 
                                            disabled={!canAfford}
                                            className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all transform shadow-2xl flex items-center justify-center gap-4
                                                ${canAfford ? 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-white/5' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                                            `}
                                        >
                                            <Zap size={20} fill="currentColor" className="animate-pulse" /> 
                                            Manifest Living Frame
                                        </button>
                                    )}
                                    <p className="text-[9px] text-slate-600 text-center uppercase tracking-[0.4em] font-bold">Neural rendering uses high-performance parallel compute.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {pageState === 'generating' && (
                        <div className="flex-grow flex flex-col items-center justify-center text-center py-24 relative z-10">
                            <div className="relative mb-16">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
                                <Loader2 className="w-20 h-20 text-cyan-400 animate-spin relative z-10" strokeWidth={1.5} />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                     <Film size={28} className="text-white animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-brand font-bold text-white mb-6 tracking-tighter">Manifesting Resonance...</h2>
                            <p className="text-slate-400 max-w-sm mx-auto leading-relaxed font-serif italic text-xl mb-12">"I am enhancing the temporal rhythms and identifying the sub-visual peaks of your history."</p>
                            
                            <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-cyan-500 animate-[progress_15s_linear_infinite]" />
                            </div>
                            <div className="flex gap-4 items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500/60">
                                <Activity size={14} className="animate-pulse" /> High Availability Sync Active <Activity size={14} className="animate-pulse" />
                            </div>
                        </div>
                    )}

                    {pageState === 'review' && generatedVideoUrl && (
                        <div className="flex flex-col items-center animate-fade-in relative z-10 py-10">
                            <div className="w-full max-w-5xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-black mb-12 relative">
                                <video src={generatedVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                                <div className="absolute top-8 left-8">
                                    <div className="px-4 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase text-cyan-400 tracking-widest shadow-2xl">
                                        Render Complete
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-6 w-full max-w-lg">
                                <button onClick={resetState} className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">Discard</button>
                                <button onClick={handleSaveVideo} className="flex-[2] py-5 bg-white text-black hover:bg-cyan-50 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                                    <ShieldCheck size={20} /> Seal to Archive
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes progress { from { width: 0%; } to { width: 100%; } }
                @keyframes vocal-wave { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(2.5); } }
                .animate-vocal-wave { animation: vocal-wave 0.8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default AIVideoPage;
