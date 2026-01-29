
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo, imageUrlToPayload } from '../services/geminiService';
// Comment: Added missing ImageIcon to lucide-react imports
import { ChevronLeft, ChevronRight, Key, AlertCircle, Zap, Database, Loader2, Sparkles, ImageIcon } from 'lucide-react';
import { Moment } from '../types';

interface LivingImagesSlideshowProps {
    images: string[];
    moment?: Moment; 
}

type VideoStatus = {
    status: 'idle' | 'generating' | 'success' | 'error' | 'needs_key';
    url?: string;
    error?: string;
}

const LivingImagesSlideshow: React.FC<LivingImagesSlideshowProps> = ({ images, moment }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videos, setVideos] = useState<Record<string, VideoStatus>>({});
    const [isKeySelected, setIsKeySelected] = useState(false);

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
                generateVideoForIndex(currentIndex);
            } catch (e) {
                console.error("Key selection failed", e);
            }
        }
    };

    const generateVideoForIndex = useCallback(async (index: number) => {
        const imageUrl = images[index];
        if (!imageUrl) return;

        // CHECK 1: Existing manifest video
        if (index === 0 && moment?.video) {
            setVideos(prev => ({ 
                ...prev, 
                [imageUrl]: { status: 'success', url: moment.video } 
            }));
            return;
        }

        // CHECK 2: Runtime Handshake
        if (!isKeySelected) {
            setVideos(prev => ({ ...prev, [imageUrl]: { status: 'needs_key' } }));
            return;
        }

        // CHECK 3: Processing Status
        if (videos[imageUrl] && (videos[imageUrl].status === 'generating' || videos[imageUrl].status === 'success')) {
            return;
        }

        setVideos(prev => ({ ...prev, [imageUrl]: { status: 'generating' } }));
        
        try {
            const imagePayload = await imageUrlToPayload(imageUrl);
            const prompt = `Grounded Realism Protocol: Subtly animate the micro-rhythms of this artifact (hair, wind, light ripples). STRICTLY maintain original composition and perspective.`;
            const videoUrl = await generateVideo(prompt, imagePayload, '16:9');
            setVideos(prev => ({ ...prev, [imageUrl]: { status: 'success', url: videoUrl } }));
        } catch (error: any) {
            console.error(`Resonance failed for ${imageUrl}`, error);
            const message = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
            
            if (message.includes("PERMISSION_DENIED") || message.includes("403") || message.includes("Requested entity was not found")) {
                setIsKeySelected(false);
                setVideos(prev => ({ ...prev, [imageUrl]: { status: 'needs_key', error: "Institutional Link Required." } }));
            } else {
                setVideos(prev => ({ ...prev, [imageUrl]: { status: 'error', error: message } }));
            }
        }
    }, [images, videos, moment, isKeySelected]);

    useEffect(() => {
        if (images.length > 0) {
            generateVideoForIndex(currentIndex);
        }
    }, [currentIndex, images, generateVideoForIndex]);

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % images.length);
    };
    
    const currentImageUrl = images[currentIndex];
    const currentVideo = videos[currentImageUrl];

    return (
         <div className="relative w-full max-w-5xl mx-auto">
            <div className="relative aspect-video w-full bg-slate-950 rounded-[2.5rem] overflow-hidden flex items-center justify-center border border-white/5 shadow-3xl">
                {!currentImageUrl && <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Artifact Buffer Empty</p>}
                
                {currentVideo?.status === 'needs_key' && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
                        <img src={currentImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20" />
                        <div className="relative z-10 flex flex-col items-center text-center p-8">
                            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl mb-8 animate-pulse">
                                <Database size={32} />
                            </div>
                            <h3 className="text-2xl font-brand font-bold text-white mb-2 tracking-tight">Institutional Link Required</h3>
                            <p className="text-sm text-slate-400 max-w-sm mb-10 font-serif italic">"High-fidelity manifestation requires a verified archival sync to provide necessary compute energy."</p>
                            <button 
                                onClick={handleSelectKey}
                                className="bg-white text-black font-black py-4 px-12 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-2xl active:scale-95"
                            >
                                Authorize Sync
                            </button>
                        </div>
                    </div>
                )}

                {currentVideo?.status === 'generating' && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
                        <img src={currentImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 grayscale" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                             <div className="relative mb-8">
                                <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-[60px] animate-pulse"></div>
                                <Loader2 size={48} className="text-white animate-spin relative z-10" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white animate-pulse">Synthesizing Resonance...</p>
                        </div>
                    </div>
                )}

                {currentVideo?.status === 'error' && (
                     <div className="relative w-full h-full flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                        <img src={currentImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
                        <div className="relative z-10 p-10 rounded-[3rem] bg-red-500/10 border border-red-500/30 backdrop-blur-xl">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
                            <h4 className="text-xl font-bold text-white mb-2 font-brand">Manifestation Interrupted</h4>
                            <p className="text-xs text-red-400/80 leading-relaxed">{currentVideo.error}</p>
                            <button onClick={() => generateVideoForIndex(currentIndex)} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Retry Ritual</button>
                        </div>
                    </div>
                )}

                {currentVideo?.status === 'success' && currentVideo.url && (
                    <video 
                        key={currentVideo.url} 
                        src={currentVideo.url} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover animate-fade-in"
                    />
                )}

                {(!currentVideo || currentVideo?.status === 'idle') && currentImageUrl && (
                    <img src={currentImageUrl} alt="" className="w-full h-full object-cover animate-fade-in" />
                )}

                {/* Navigation Pips */}
                {images.length > 1 && (
                    <div className="absolute inset-x-0 bottom-8 z-30 flex items-center justify-center gap-3 px-12">
                        <button onClick={goToPrevious} className="p-3 rounded-full bg-black/40 border border-white/10 text-white/40 hover:text-white hover:bg-black/60 transition-all active:scale-90"><ChevronLeft size={20}/></button>
                        <div className="flex gap-2 mx-6">
                            {images.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-cyan-500' : 'w-1.5 bg-white/20'}`} />
                            ))}
                        </div>
                        <button onClick={goToNext} className="p-3 rounded-full bg-black/40 border border-white/10 text-white/40 hover:text-white hover:bg-black/60 transition-all active:scale-90"><ChevronRight size={20}/></button>
                    </div>
                )}

                {/* Info HUD */}
                <div className="absolute top-6 left-6 z-30">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-2xl">
                         {currentVideo?.status === 'success' ? (
                             <>
                                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Living Frame Active</span>
                             </>
                         ) : (
                             <>
                                <ImageIcon size={14} className="text-slate-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Static Artifact {currentIndex + 1}</span>
                             </>
                         )}
                    </div>
                </div>
            </div>
            
            {/* Carousel Strip */}
            {images.length > 1 && (
                <div className="flex gap-3 justify-center mt-6 px-4 overflow-x-auto no-scrollbar pb-2">
                    {images.map((img, i) => (
                        <button 
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-500 
                                ${i === currentIndex ? 'border-cyan-500 scale-110 shadow-2xl' : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}
                            `}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LivingImagesSlideshow;
