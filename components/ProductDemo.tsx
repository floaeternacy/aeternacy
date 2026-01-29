
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
    UploadCloud, X, Loader2, Sparkles, Play, CheckCircle, 
    MapPin, Users, Wand2, ArrowRight, Volume2, 
    Bot, Database, Cpu, Waves, History, Book, Smile, Check,
    CloudSun, Flame, ShieldCheck, Landmark
} from 'lucide-react';
import { createDemoStoryFromImages, textToSpeech, generateTitleSuggestions } from '../services/geminiService';
import { AeternyVoice, StoryStyle } from '../types';

interface GeneratedData {
    title: string;
    story: string;
    tags: {
        location: string[];
        people: string[];
        activities: string[];
        atmosphere?: string;
    };
    style?: StoryStyle;
}

interface ProductDemoProps {
    onClose: () => void;
    onComplete: (shouldRegister: boolean, demoData?: GeneratedData & { images: string[] }) => void;
    aeternyVoice: AeternyVoice;
    defaultStyle: StoryStyle;
}

interface SelectedFile {
    id: string;
    file: File;
    preview: string;
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

const processingSteps = [
    { id: 'analyze', text: 'Scanning visual rhythms...' },
    { id: 'story', text: 'Synthesizing narrative threads...' },
    { id: 'narration', text: 'Calibrating vocal resonance...' }
];

const BACKGROUND_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/02/22/audio_d1e67e3f2e.mp3";

type DemoStep = 'intro' | 'upload' | 'naming' | 'processing' | 'reveal' | 'conversion';

const ProductDemo: React.FC<ProductDemoProps> = ({ onClose, onComplete, aeternyVoice, defaultStyle }) => {
    const [step, setStep] = useState<DemoStep>('intro');
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [memoryName, setMemoryName] = useState('');
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const [isSuggestingTitles, setIsSuggestingTitles] = useState(false);
    const [activeStyle, setActiveStyle] = useState<StoryStyle>(defaultStyle);
    
    const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
    const [narration, setNarration] = useState<{ buffer: AudioBuffer; context: AudioContext } | null>(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [narrativeProgress, setNarrativeProgress] = useState(0);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
    
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const slideTimerRef = useRef<number | null>(null);
    const progressFrameRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (step === 'intro') {
            const timer = setTimeout(() => setStep('upload'), 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    useEffect(() => {
        if (step === 'reveal' || step === 'conversion') {
            if (!bgMusicRef.current) {
                bgMusicRef.current = new Audio(BACKGROUND_MUSIC_URL);
                bgMusicRef.current.loop = true;
                bgMusicRef.current.volume = 0.15;
            }
            bgMusicRef.current.play().catch(() => {});
        }
        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, [step]);

    const sentences = useMemo(() => {
        const text = generatedData?.story;
        if (!text || !narration) return [];
        
        const matches = text.match(/[^.!?]+[.!?\s]*/g)?.filter(s => s.trim()) || [text];
        const totalDuration = narration.buffer.duration;
        const totalWords = text.trim().split(/\s+/).length;
        
        let runningTime = 0;
        return matches.map(sentence => {
            const wordCount = sentence.trim().split(/\s+/).length;
            const duration = (wordCount / totalWords) * totalDuration;
            const startTime = runningTime;
            runningTime += duration;
            return { text: sentence.trim(), startTime, endTime: runningTime };
        });
    }, [generatedData?.story, narration]);

    const cleanupAudio = useCallback(() => {
        if (progressFrameRef.current) cancelAnimationFrame(progressFrameRef.current);
        if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch(e) {}
            audioSourceRef.current = null;
        }
        setCurrentSentenceIndex(-1);
    }, []);

    const processFiles = useCallback(async (fileList: FileList) => {
        const acceptedFiles = Array.from(fileList).slice(0, 5);
        if (acceptedFiles.length === 0) return;

        const newFiles = await Promise.all(acceptedFiles.map(async (file): Promise<SelectedFile> => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            preview: await fileToDataUrl(file),
        })));
        
        setSelectedFiles(newFiles);
        setError(null);
    }, []);

    const handleStartMagic = async (forcedName?: string, styleToUse: StoryStyle = activeStyle) => {
        cleanupAudio();
        const activeName = forcedName || memoryName;
        if (!activeName) return;

        if (step !== 'processing' && step !== 'reveal') setStep('processing');
        else setIsRegenerating(true);
        
        try {
            setCurrentStepIdx(0);
            const payloads = await Promise.all(selectedFiles.map(async (sf) => ({
                data: await fileToBase64(sf.file),
                mimeType: sf.file.type
            })));
            
            setCurrentStepIdx(1);
            const storyData = await createDemoStoryFromImages(payloads, activeName, styleToUse, true);
            setGeneratedData({ ...storyData, style: styleToUse });
            
            for(let i=0; i<=100; i+=10) {
                setNarrativeProgress(i);
                await new Promise(r => setTimeout(r, 20));
            }

            setCurrentStepIdx(2);
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await textToSpeech(storyData.story, audioContext, aeternyVoice);
            setNarration({ buffer: audioBuffer!, context: audioContext });
            
            setIsRegenerating(false);
            setStep('reveal');
            startReveal(audioBuffer!, audioContext);
        } catch (err) {
            setError("My neural connection dipped. Shall we try that again?");
            setStep('upload');
            setIsRegenerating(false);
        }
    };

    const startReveal = (buffer: AudioBuffer, context: AudioContext) => {
        setIsPlaying(true);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
        audioSourceRef.current = source;

        const slideDur = buffer.duration / selectedFiles.length;
        const advance = (idx: number) => {
            if (idx < selectedFiles.length) {
                setCurrentSlideIndex(idx);
                slideTimerRef.current = window.setTimeout(() => advance(idx + 1), slideDur * 1000);
            }
        };
        advance(0);

        const startTime = context.currentTime;
        const animateSubtitles = () => {
            if (context.state === 'running' && audioSourceRef.current) {
                const elapsed = context.currentTime - startTime;
                const curSent = sentences.findIndex(sen => elapsed >= sen.startTime && elapsed < sen.endTime);
                setCurrentSentenceIndex(curSent);
                progressFrameRef.current = requestAnimationFrame(animateSubtitles);
            }
        };
        animateSubtitles();

        source.onended = () => {
            cleanupAudio();
            setIsPlaying(false);
            setStep('conversion');
        };
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(e.target.files);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    };

    const handleRemoveFile = (id: string) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleNextToNaming = async () => {
        if (selectedFiles.length >= 2) {
            setStep('naming');
            setIsSuggestingTitles(true);
            try {
                const payloads = await Promise.all(selectedFiles.map(async (sf) => ({
                    data: await fileToBase64(sf.file),
                    mimeType: sf.file.type
                })));
                const suggestions = await generateTitleSuggestions(payloads);
                setTitleSuggestions(suggestions);
            } catch (err) {
                setTitleSuggestions(["A New Chapter", "A Moment in Time", "Treasured Memory"]);
            } finally {
                setIsSuggestingTitles(false);
            }
        } else {
            setError('Please offer at least two artifacts to weave a narrative.');
        }
    };

    const renderIntro = () => (
        <div className="text-center animate-fade-in flex flex-col items-center max-w-2xl px-6">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-aeterny-breathe"></div>
                <div className="w-24 h-24 bg-[#0B101B] rounded-full flex items-center justify-center border border-cyan-500/30 relative z-10 shadow-2xl">
                    <Bot className="w-10 h-10 text-cyan-400" />
                </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-brand text-white mb-6 tracking-tighter">Welcome to the Archive.</h1>
            <p className="text-xl md:text-2xl text-slate-300 font-serif italic leading-relaxed">
                "I am æterny, your Chronicler. Every life is a sequence of sacred peaks—moments that define who we are. Before we establish your permanent vault, let me demonstrate how we rescue a single story from the silence of your phone."
            </p>
            <div className="mt-12 flex gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
        </div>
    );

    const renderUpload = () => (
        <div className="w-full max-w-4xl text-center animate-fade-in-up px-6">
            <h1 className="text-4xl md:text-7xl font-bold text-white font-brand mb-4 tracking-tighter">Seed the Story.</h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium mb-4 italic">A single image is the fragment of a dynasty.</p>
            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-12 leading-relaxed">
                "Choose 2-5 artifacts from a recent chapter—a dinner, a sunrise, or a quiet Sunday. I will analyze the texture, the light, and the hidden rhythms to draft your first legacy entry."
            </p>
            
            <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative min-h-[400px] rounded-[4rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center p-12 overflow-hidden ${
                    isDragging ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02]' : 'border-white/10 bg-black/40 hover:bg-white/[0.03]'
                }`}
            >
                {selectedFiles.length === 0 ? (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-800/80 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transition-transform duration-500 group-hover:scale-110 ring-1 ring-white/10">
                            <UploadCloud className="w-10 h-10 ${isDragging ? 'text-cyan-400 animate-bounce' : 'text-slate-500'}" />
                        </div>
                        <p className="text-white text-xl font-bold font-brand tracking-tight">Offer Fragments</p>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-10 bg-white text-black font-black py-4 px-12 rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                        >
                            Open Local Vault
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
                            {selectedFiles.map(f => (
                                <div key={f.id} className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                                    <img src={f.preview} className="w-full h-full object-cover" />
                                    <button onClick={() => handleRemoveFile(f.id)} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                                        <X size={12}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={handleNextToNaming}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 px-16 rounded-full text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-4 mx-auto"
                        >
                            Initiate Synthesis <ArrowRight size={16} />
                        </button>
                    </div>
                )}
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            {error && <p className="mt-6 text-red-400 font-bold text-sm">{error}</p>}
        </div>
    );

    const renderNaming = () => (
        <div className="w-full max-w-xl text-center animate-fade-in-up px-6">
            <h1 className="text-3xl md:text-6xl font-bold font-brand text-white mb-6 tracking-tighter">Anchor the Narrative.</h1>
            <p className="text-slate-400 text-base mb-12 italic font-serif leading-relaxed">
                "A title is an anchor for future kin. I have analyzed the metadata and visual cues—select a resonant heading or define the era yourself."
            </p>
            <div className="bg-[#0B101B]/80 backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                
                {isSuggestingTitles ? (
                    <div className="flex flex-col items-center py-16 gap-6">
                        <div className="relative">
                             <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                             <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] animate-pulse">finding the perfect frequency...</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500/60 mb-2">Neural Suggestions</p>
                        <div className="grid grid-cols-1 gap-4">
                            {titleSuggestions.map((title, i) => (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        setMemoryName(title);
                                        handleStartMagic(title);
                                    }}
                                    className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-left transition-all hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:scale-[1.02] active:scale-95 flex items-center justify-between"
                                >
                                    <span className="text-base sm:text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{title}</span>
                                    <Sparkles size={16} className="text-cyan-500/0 group-hover:text-cyan-500/100 transition-all transform group-hover:rotate-12" />
                                </button>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <input 
                                type="text"
                                value={memoryName}
                                onChange={(e) => setMemoryName(e.target.value)}
                                placeholder="Or enter a custom anchor..."
                                className="w-full bg-transparent text-center text-white text-lg font-bold outline-none border-b border-white/10 pb-2 focus:border-cyan-500 transition-colors"
                            />
                            {memoryName && !titleSuggestions.includes(memoryName) && (
                                <button onClick={() => handleStartMagic()} className="mt-4 text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 mx-auto hover:text-white transition-colors">
                                    Use This Anchor <ArrowRight size={12}/>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderProcessing = () => (
        <div className="w-full max-w-2xl animate-fade-in px-6">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Loader2 size={32} className="animate-spin" />
                </div>
                <h1 className="text-3xl font-brand font-bold text-white mb-2">Weaving your Story.</h1>
                <p className="text-slate-500 font-serif italic text-sm">"I am mapping the emotional peaks across your shared artifacts."</p>
            </div>
            <div className="space-y-4">
                {processingSteps.map((s, idx) => {
                    const isDone = idx < currentStepIdx;
                    const isActive = idx === currentStepIdx;
                    return (
                        <div key={s.id} className={`flex items-center gap-6 p-6 rounded-3xl border transition-all duration-700 ${isActive ? 'bg-white/5 border-cyan-500/30 shadow-lg' : 'border-white/5 opacity-30'}`}>
                            <div className="flex-shrink-0">
                                {isDone ? <CheckCircle className="text-green-500 w-6 h-6" /> : isActive ? <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div> : <div className="w-6 h-6 rounded-full border-2 border-slate-700" />}
                            </div>
                            <div className="flex-grow">
                                <p className={`text-base font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>{s.text}</p>
                                {isActive && s.id === 'story' && (
                                    <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${narrativeProgress}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderReveal = () => (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 md:p-12 z-[1050] animate-fade-in">
            <div className="relative w-full h-full max-h-[90vh] rounded-[4rem] overflow-hidden shadow-3xl ring-1 ring-white/10 bg-slate-900">
                
                <div className="absolute inset-0 z-0">
                    {selectedFiles.map((file, idx) => (
                        <div 
                            key={file.id}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${idx === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img 
                                src={file.preview} 
                                className={`w-full h-full object-cover transition-transform duration-[12s] ease-linear ${idx === currentSlideIndex && isPlaying ? 'scale-110 translate-x-1 translate-y-1' : 'scale-100'}`}
                                alt="Memory" 
                            />
                        </div>
                    ))}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/40 z-[1]"></div>
                </div>
                
                {isRegenerating && (
                    <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-white font-black uppercase tracking-widest text-[10px]">Re-weaving Narrative...</p>
                    </div>
                )}

                {/* BOTTOM ALIGNED PERSISTENT CONTENT BLOCK */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 z-10 flex flex-col items-center text-center">
                    <div className="max-w-4xl w-full flex flex-col items-center gap-4">
                        
                        {/* HEADLINE: Smaller, Mixed-case (Sentence Case) */}
                        <div className="animate-fade-in-up">
                            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-brand font-bold tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                                {generatedData?.title}
                            </h2>
                        </div>

                        {/* FULL NARRATIVE TEXT: Integrated summary below the title */}
                        <div className="animate-fade-in-up delay-300 max-w-2xl px-4">
                            <p className="text-slate-200 text-sm md:text-base lg:text-lg font-serif italic leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,1)] opacity-90">
                                "{generatedData?.story}"
                            </p>
                        </div>
                        
                        {/* TAGS: Minimalist context layer at the very bottom of the block */}
                        <div className="flex flex-wrap justify-center gap-2 animate-fade-in delay-700 mt-4">
                            {generatedData?.tags.location.map(t => (
                                <span key={t} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 border border-cyan-500/20 shadow-lg">
                                    <MapPin size={10} /> {t}
                                </span>
                            ))}
                            {generatedData?.tags.people.map(t => (
                                <span key={t} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5 border border-indigo-500/20 shadow-lg">
                                    <Users size={10} /> {t}
                                </span>
                            ))}
                            {generatedData?.tags.activities.slice(0, 2).map(t => (
                                <span key={t} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5 border border-white/10">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderConversion = () => (
        <div className="w-full max-w-4xl text-center animate-fade-in-up px-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 ring-1 ring-green-500/40 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-5xl md:text-8xl font-bold font-brand text-white mb-8 tracking-tighter">Your Story is Anchored.</h1>
            <p className="text-2xl md:text-3xl text-slate-300 font-serif italic mb-16 leading-relaxed max-w-3xl mx-auto">
                "This was just one fragment of your history. Imagine your entire life preserved with this same neural fidelity for the next hundred years."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button 
                    onClick={() => onComplete(true, { ...generatedData!, images: selectedFiles.map(f => f.preview), style: activeStyle })}
                    className="group bg-white text-black font-black py-6 px-10 rounded-3xl text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-[0_20px_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4 active:scale-95"
                >
                    Found my Archive <ArrowRight size={20} strokeWidth={3} />
                </button>
                <button onClick={onClose} className="bg-white/5 border border-white/10 text-white font-black py-6 px-10 rounded-3xl text-[10px] uppercase tracking-widest transition-all hover:bg-white/10">
                    Discard and Exit
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#050811] z-[1000] overflow-y-auto flex flex-col items-center justify-center p-6">
            {/* CORRECTED Z-INDEX: Added brackets for arbitrary value to ensure it stays on top of stage renderers */}
            <button 
                onClick={onClose} 
                className="fixed top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all z-[1100] border border-white/5 pointer-events-auto"
            >
                <X size={24} />
            </button>
            
            <div className="w-full flex-grow flex flex-col items-center justify-center relative z-10">
                {step === 'intro' && renderIntro()}
                {step === 'upload' && renderUpload()}
                {step === 'naming' && renderNaming()}
                {step === 'processing' && renderProcessing()}
                {step === 'reveal' && renderReveal()}
                {step === 'conversion' && renderConversion()}
            </div>
        </div>
    );
};

export default ProductDemo;
