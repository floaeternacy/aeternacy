
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Moment, AeternyVoice, AeternyStyle } from '../types';
import { textToSpeech } from '../services/geminiService';
import { 
    X, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, 
    Image, Loader, Subtitles, RefreshCcw, 
    ArrowRight, Bot, Sparkles, MapPin, ChevronRight, ChevronLeft,
    Settings2, SlidersHorizontal, Music, Waves, Clock, Zap,
    Maximize, Layers, MoveHorizontal
} from 'lucide-react';
import { getOptimizedUrl } from '../services/cloudinaryService';

type VisualEffect = 'ken-burns' | 'liquid-blur' | 'ethereal-fade' | 'cinematic-slide';

interface ReliveSettings {
    voice: AeternyVoice;
    speed: number;
    musicVolume: number;
    narrationVolume: number;
    showSubtitles: boolean;
    slideDuration: number;
    visualEffect: VisualEffect;
}

interface LivingSlideshowPlayerProps {
    moment: Moment;
    aeternyVoice: AeternyVoice;
    aeternyStyle: AeternyStyle;
    onClose: () => void;
    suggestedMoments?: Moment[];
    onNavigateToNext?: (moment: Moment) => void;
}

const LivingSlideshowPlayer: React.FC<LivingSlideshowPlayerProps> = ({ 
    moment, aeternyVoice: initialVoice, aeternyStyle, onClose, suggestedMoments = [], onNavigateToNext 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showUI, setShowUI] = useState(false);
    const [isSealed, setIsSealed] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    const [settings, setSettings] = useState<ReliveSettings>(() => {
        const saved = localStorage.getItem('aeternacy_relive_prefs');
        return saved ? JSON.parse(saved) : {
            voice: initialVoice,
            speed: 1.0,
            musicVolume: 0.15,
            narrationVolume: 1.0,
            showSubtitles: true,
            slideDuration: 5000,
            visualEffect: 'ken-burns'
        };
    });

    const [narrationState, setNarrationState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
    const [narrationProgress, setNarrationProgress] = useState(0);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const slideTimerRef = useRef<number | null>(null);
    const progressFrameRef = useRef<number | null>(null);
    const uiTimerRef = useRef<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const slides = useMemo(() => {
        const allImages = [moment.image, ...(moment.images || [])].filter(Boolean) as string[];
        const uniqueImages = Array.from(new Set(allImages));
        
        if (moment.video) {
            const secondaryImages = uniqueImages.filter(img => img !== moment.image);
            return [moment.video, moment.image, ...secondaryImages].filter(Boolean) as string[];
        }
        return uniqueImages;
    }, [moment]);

    const sentences = useMemo(() => {
        const text = moment.description;
        if (!text) return [];
        const matches = text.match(/[^.!?]+[.!?\s]*|\s*$/g)?.filter(s => s.trim()) || [text];
        let runningTime = 0;
        const baseWordsPerSecond = 2.3; 
        const speedMultiplier = settings.speed;

        return matches.map(sentence => {
            const wordCount = sentence.trim().split(/\s+/).length;
            const duration = (wordCount / (baseWordsPerSecond * speedMultiplier)) || 0.5;
            const startTime = runningTime;
            runningTime += duration;
            return { text: sentence.trim(), startTime, endTime: runningTime };
        });
    }, [moment.description, settings.speed]);

    const cleanup = useCallback(() => {
        if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
        if (progressFrameRef.current) cancelAnimationFrame(progressFrameRef.current);
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch (e) {}
        }
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(() => {});
        }
        audioSourceRef.current = null;
        audioContextRef.current = null;
        setNarrationState('idle');
        setNarrationProgress(0);
        setCurrentSentenceIndex(-1);
    }, []);

    const handleRestart = useCallback(() => {
        cleanup();
        setIsSealed(false);
        setCurrentIndex(0);
        setIsPlaying(true);
    }, [cleanup]);

    const handlePlayPause = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const resetUITimer = useCallback(() => {
        setShowUI(true);
        if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
        if (!showSettings) {
            uiTimerRef.current = window.setTimeout(() => setShowUI(false), 3000);
        }
    }, [showSettings]);

    const updateSetting = <K extends keyof ReliveSettings>(key: K, value: ReliveSettings[K]) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('aeternacy_relive_prefs', JSON.stringify(newSettings));
        
        if (key === 'musicVolume' && bgMusicRef.current) {
            bgMusicRef.current.volume = value as number;
        }
        
        if (key === 'voice' || key === 'speed') {
            handleRestart();
        }
    };

    const getSlideClasses = (index: number) => {
        const isActive = index === currentIndex;
        const effect = settings.visualEffect;
        
        let base = "absolute inset-0 w-full h-full transition-all ";
        
        switch (effect) {
            case 'ken-burns':
                base += "duration-[2500ms] ";
                base += isActive ? "opacity-100 scale-110 animate-parallax-manifest" : "opacity-0 scale-100";
                break;
            case 'liquid-blur':
                base += "duration-[1800ms] ";
                base += isActive ? "opacity-100 blur-0" : "opacity-0 blur-3xl scale-125";
                break;
            case 'cinematic-slide':
                base += "duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ";
                base += isActive ? "opacity-100 translate-x-0" : (index < currentIndex ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full");
                break;
            case 'ethereal-fade':
            default:
                base += "duration-[2500ms] ";
                base += isActive ? "opacity-100" : "opacity-0";
                break;
        }
        
        return base;
    };

    useEffect(() => {
        return () => {
            cleanup();
            if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
        };
    }, [cleanup]);

    useEffect(() => {
        if (isPlaying && !isSealed) {
            if (!bgMusicRef.current) {
                const musicUrl = moment.music?.url || "https://cdn.pixabay.com/audio/2022/02/22/audio_d1e67e3f2e.mp3";
                bgMusicRef.current = new Audio(musicUrl);
                bgMusicRef.current.loop = true;
                bgMusicRef.current.volume = 0; 
            }
            bgMusicRef.current.play().catch(() => {});
            
            const fadeInterval = setInterval(() => {
                if (bgMusicRef.current && bgMusicRef.current.volume < settings.musicVolume) {
                    bgMusicRef.current.volume = Math.min(bgMusicRef.current.volume + 0.01, settings.musicVolume);
                } else if (bgMusicRef.current) {
                    bgMusicRef.current.volume = settings.musicVolume;
                    clearInterval(fadeInterval);
                }
            }, 100);
            return () => clearInterval(fadeInterval);
        } else {
            bgMusicRef.current?.pause();
        }
    }, [isPlaying, isSealed, moment.music, settings.musicVolume]);

    useEffect(() => {
        const playNarration = async () => {
            if (!isPlaying || isSealed) return;

            setNarrationState('loading');
            try {
                const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                audioContextRef.current = newAudioContext;
                
                const buffer = await textToSpeech(moment.description, newAudioContext, settings.voice);
                
                if (!buffer || newAudioContext.state === 'closed') {
                    setNarrationState('idle');
                    const scheduleSlideChange = (index: number) => {
                        if (index < slides.length) {
                            slideTimerRef.current = window.setTimeout(() => {
                                setCurrentIndex(index);
                                scheduleSlideChange(index + 1);
                            }, settings.slideDuration);
                        }
                    };
                    scheduleSlideChange(1);
                    return;
                }
                
                audioBufferRef.current = buffer;
                const source = newAudioContext.createBufferSource();
                source.buffer = buffer;
                
                const gainNode = newAudioContext.createGain();
                gainNode.gain.value = settings.narrationVolume;
                source.connect(gainNode);
                gainNode.connect(newAudioContext.destination);
                
                source.start(0, 0);
                audioSourceRef.current = source;
                setNarrationState('playing');
                
                const totalDuration = buffer.duration;
                const perSlideDuration = totalDuration / slides.length;

                const scheduleSlideChange = (index: number) => {
                    if (index < slides.length) {
                        slideTimerRef.current = window.setTimeout(() => {
                            setCurrentIndex(index);
                            scheduleSlideChange(index + 1);
                        }, perSlideDuration * 1000);
                    }
                };
                scheduleSlideChange(1);
                
                source.onended = () => {
                    setTimeout(() => setIsSealed(true), 2000);
                };

                const startTime = newAudioContext.currentTime;
                const animateProgress = () => {
                    if (newAudioContext.state === 'running' && audioSourceRef.current) {
                        const elapsedTime = newAudioContext.currentTime - startTime;
                        setNarrationProgress(elapsedTime / buffer.duration);
                        const currentSentence = sentences.findIndex(s => elapsedTime >= s.startTime && elapsedTime < s.endTime);
                        setCurrentSentenceIndex(currentSentence);
                        progressFrameRef.current = requestAnimationFrame(animateProgress);
                    }
                };
                animateProgress();

            } catch (error) {
                console.error("Narration error:", error);
                setNarrationState('error');
            }
        };

        playNarration();
        return () => cleanup();
    }, [isPlaying, isSealed, settings.voice, settings.slideDuration, settings.narrationVolume, moment, slides.length, sentences, cleanup]);

    return (
        <div 
            className="fixed inset-0 bg-black z-[1000] flex items-center justify-center overflow-hidden animate-portal-bloom"
            onMouseMove={resetUITimer}
            onTouchStart={resetUITimer}
        >
            <div className="absolute inset-0 z-0">
                <img 
                    src={getOptimizedUrl(slides[currentIndex]?.includes('veo') || slides[currentIndex]?.startsWith('blob:') ? moment.image : (slides[currentIndex] || ''), 1920)} 
                    className="w-full h-full object-cover blur-[120px] opacity-40 scale-150 transition-all duration-[3000ms]" 
                    alt="" 
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className={`relative w-full h-full transition-all duration-[2s] ${isSealed ? 'scale-90 blur-xl opacity-0' : 'scale-100 opacity-100'}`}>
                {slides.map((slide, index) => {
                    // Refined isVideo check: A blob is only a video if it's explicitly assigned to moment.video
                    const isVideo = slide === moment.video || slide.includes('.mp4') || slide.includes('video/upload') || slide.includes('veo');
                    const isActive = index === currentIndex;

                    return (
                        <div key={index} className={getSlideClasses(index)}>
                            {isVideo ? (
                                <video 
                                    src={slide} 
                                    muted 
                                    loop 
                                    autoPlay={isActive && isPlaying}
                                    playsInline 
                                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]" 
                                />
                            ) : (
                                <img 
                                    src={getOptimizedUrl(slide, 1920)}
                                    alt=""
                                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
                                />
                            )}
                        </div>
                    );
                })}
                
                <div className="absolute inset-x-0 bottom-40 z-50 px-12 text-center pointer-events-none">
                    <div className="min-h-[8rem] flex items-center justify-center">
                        {settings.showSubtitles && currentSentenceIndex > -1 && sentences[currentSentenceIndex] && (
                            <p className="text-2xl md:text-5xl font-serif italic text-white animate-fade-in-up drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] px-4">
                                <span className="animate-luminous-shimmer">
                                    {sentences[currentSentenceIndex].text}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className="absolute top-0 right-0 bottom-0 w-full md:w-96 bg-black/40 backdrop-blur-3xl border-l border-white/10 z-[130] p-10 animate-fade-in shadow-2xl flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Relive Studio</h2>
                        <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                    </div>

                    <div className="space-y-8 overflow-y-auto no-scrollbar pb-10">
                        <div className="space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Zap size={12}/> Visual Flow</span>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'ken-burns', label: 'Ken Burns', icon: Maximize },
                                    { id: 'liquid-blur', label: 'Liquid Blur', icon: Sparkles },
                                    { id: 'ethereal-fade', label: 'Ethereal', icon: Layers },
                                    { id: 'cinematic-slide', label: 'Slide', icon: MoveHorizontal }
                                ].map(eff => (
                                    <button 
                                        key={eff.id}
                                        onClick={() => updateSetting('visualEffect', eff.id as VisualEffect)}
                                        className={`flex flex-col items-center gap-2 py-4 rounded-xl text-[9px] font-bold uppercase border transition-all ${settings.visualEffect === eff.id ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                                    >
                                        <eff.icon size={16} />
                                        {eff.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Bot size={12}/> Narrator</span>
                            <div className="grid grid-cols-2 gap-2">
                                {['Sarah', 'David', 'Emma', 'James'].map(v => (
                                    <button 
                                        key={v}
                                        onClick={() => updateSetting('voice', v as AeternyVoice)}
                                        className={`py-3 rounded-xl text-[10px] font-bold transition-all border ${settings.voice === v ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Clock size={12}/> Pace</span>
                                <span className="text-[10px] font-mono text-cyan-400 font-bold">{settings.speed}x</span>
                            </div>
                            <input 
                                type="range" min="0.8" max="1.5" step="0.1" 
                                value={settings.speed} 
                                onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-cyan-500"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
                                    <span className="flex items-center gap-2"><Waves size={12}/> Narration</span>
                                    <span>{Math.round(settings.narrationVolume * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={settings.narrationVolume} onChange={(e) => updateSetting('narrationVolume', parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-500" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
                                    <span className="flex items-center gap-2"><Music size={12}/> Resonance</span>
                                    <span>{Math.round(settings.musicVolume * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={settings.musicVolume} onChange={(e) => updateSetting('musicVolume', parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-500" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button 
                                onClick={() => updateSetting('showSubtitles', !settings.showSubtitles)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${settings.showSubtitles ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-600'}`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest">Luminous Subtitles</span>
                                {settings.showSubtitles ? <Subtitles size={16}/> : <X size={16}/>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSealed && (
                <div className="absolute inset-0 z-[120] flex flex-col items-center justify-center bg-black/40 animate-fade-in">
                    <div className="relative max-w-4xl w-full px-4 sm:px-8 flex flex-col items-center">
                        <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-3xl w-full animate-fade-in-up flex flex-col items-center">
                            <div className="w-full flex justify-between items-start mb-10">
                                <button onClick={handleRestart} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"><RefreshCcw size={20} /></button>
                                <div className="text-center">
                                    <h2 className="text-2xl font-brand font-bold text-white tracking-tighter mb-1">{moment.title}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Archive Chapter Sealed</p>
                                </div>
                                <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"><X size={20} /></button>
                            </div>

                            {suggestedMoments.length > 0 && (
                                <div className="w-full pt-10 border-t border-white/5 animate-fade-in">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <Bot size={14} className="text-cyan-400" />
                                            <p className="text-lg text-slate-300 font-serif italic">"The thread of your story naturally flows into..."</p>
                                        </div>
                                    </div>
                                    <div ref={carouselRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 pb-4">
                                        {suggestedMoments.map((nextM) => (
                                            <button key={nextM.id} onClick={() => onNavigateToNext?.(nextM)} className="group relative flex-shrink-0 w-64 text-left rounded-[2rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 shadow-2xl ring-1 ring-white/10 snap-center isolate">
                                                <div className="relative aspect-[4/5] w-full overflow-hidden">
                                                    <img src={getOptimizedUrl(nextM.image || nextM.images?.[0] || '', 600)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" alt="" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none"></div>
                                                    <div className="absolute bottom-6 left-6 right-6 z-20">
                                                        <div className="flex items-center gap-2 mb-2"><span className="h-px w-3 bg-cyan-400"></span><span className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400">{nextM.date}</span></div>
                                                        <h3 className="text-base font-bold font-brand tracking-tighter leading-tight text-white mb-3 line-clamp-2">{nextM.title}</h3>
                                                        <div className="flex items-center gap-3">{nextM.location && <div className="flex items-center gap-1"><MapPin size={8} className="text-cyan-400" /><span className="text-[8px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[80px]">{nextM.location.split(',')[0]}</span></div>}<div className="flex items-center gap-1"><Image size={8} className="text-cyan-400" /><span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{nextM.photoCount || 1} items</span></div></div>
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/10 backdrop-blur-[2px] z-30">
                                                        <div className="bg-white text-black px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                            <Play size={10} fill="currentColor" className="mr-2" />
                                                            Relive
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className={`absolute inset-0 z-[110] transition-opacity duration-700 pointer-events-none ${showUI && !isSealed ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-8 right-8 flex gap-4 pointer-events-auto">
                    <button onClick={() => setShowSettings(!showSettings)} className={`p-4 rounded-full transition-all hover:bg-white/10 ${showSettings ? 'text-cyan-400 rotate-90 scale-110' : 'text-white/40'}`}>
                        <Settings2 size={32} />
                    </button>
                    <button onClick={onClose} className="p-4 text-white/40 hover:text-white transition-all transform hover:rotate-90">
                        <X size={32} />
                    </button>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 flex flex-col gap-8 pointer-events-auto">
                    <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white/60 transition-all duration-300" style={{ width: `${narrationProgress * 100}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <button onClick={() => updateSetting('narrationVolume', settings.narrationVolume > 0 ? 0 : 1)} className="text-white/40 hover:text-white transition-colors">
                                {narrationState === 'loading' ? <Loader className="w-6 h-6 animate-spin" /> : settings.narrationVolume > 0 ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                            {narrationState === 'playing' && <div className="flex items-center gap-1.5"><div className="w-1 h-3 bg-cyan-400 rounded-full animate-vocal-wave"></div><div className="w-1 h-5 bg-cyan-400 rounded-full animate-vocal-wave" style={{animationDelay: '0.1s'}}></div><div className="w-1 h-2 bg-cyan-400 rounded-full animate-vocal-wave" style={{animationDelay: '0.2s'}}></div></div>}
                         </div>
                        
                        <div className="flex items-center gap-12">
                            <button onClick={() => { if (slides.length > 0) setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1)); }} className="text-white/40 hover:text-white transition-all"><SkipBack size={32} /></button>
                            <button 
                                onClick={handlePlayPause} 
                                className="w-20 h-20 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 transition-all shadow-3xl"
                            >
                                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                            </button>
                            <button onClick={() => { if (slides.length > 0) setCurrentIndex(prev => (prev + 1) % slides.length); }} className="text-white/40 hover:text-white transition-all"><SkipForward size={32} /></button>
                        </div>

                        <button onClick={() => updateSetting('showSubtitles', !settings.showSubtitles)} className={`transition-colors ${settings.showSubtitles ? 'text-cyan-400' : 'text-white/40'}`}>
                            {settings.showSubtitles ? <Subtitles size={24} /> : <X size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LivingSlideshowPlayer;
