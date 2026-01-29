
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize2, Download } from 'lucide-react';

interface LightboxGalleryProps {
    images: string[];
    onClose: () => void;
    initialIndex?: number;
}

const LightboxGallery: React.FC<LightboxGalleryProps> = ({ images, onClose, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const uiTimeoutRef = useRef<number | null>(null);

    const advanceSlide = useCallback((forward = true) => {
        if (forward) {
            setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
        } else {
            setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
        }
    }, [images.length]);

    const resetUITimer = useCallback(() => {
        setShowUI(true);
        if (uiTimeoutRef.current) window.clearTimeout(uiTimeoutRef.current);
        if (isPlaying) {
            uiTimeoutRef.current = window.setTimeout(() => setShowUI(false), 3000);
        }
    }, [isPlaying]);

    useEffect(() => {
        let timer: number;
        if (isPlaying && images.length > 1) {
            timer = window.setInterval(() => {
                advanceSlide();
            }, 5000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isPlaying, advanceSlide, images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            resetUITimer();
            if (e.key === 'ArrowLeft') advanceSlide(false);
            if (e.key === 'ArrowRight') advanceSlide(true);
            if (e.key === 'Escape') onClose();
            if (e.key === ' ') {
                e.preventDefault();
                setIsPlaying(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, advanceSlide, resetUITimer]);

    if (!images || images.length === 0) return null;

    return (
        <div 
            className="fixed inset-0 bg-black z-[1000] backdrop-blur-3xl animate-fade-in flex flex-col items-center justify-center overflow-hidden"
            onMouseMove={resetUITimer}
            onClick={resetUITimer}
        >
            {/* Background Layer: Blurred ambient color */}
            <div className="absolute inset-0 z-0">
                <img src={images[currentIndex]} className="w-full h-full object-cover blur-[100px] opacity-30 scale-150" alt="" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Header UI */}
            <div className={`absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center transition-opacity duration-700 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Artifact {currentIndex + 1} / {images.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"><Download size={20}/></button>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all transform hover:rotate-90">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 z-10">
                {/* Large Hit Area Navigation */}
                <button 
                    onClick={(e) => { e.stopPropagation(); advanceSlide(false); }}
                    className={`absolute left-0 top-0 bottom-0 w-24 md:w-32 flex items-center justify-center group z-20 transition-opacity duration-700 ${showUI ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Previous Artifact"
                >
                    <div className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0">
                        <ChevronLeft size={32} />
                    </div>
                </button>

                <div className="relative max-w-full max-h-full flex items-center justify-center transition-all duration-700">
                    {images.map((image, index) => (
                         <img 
                            key={index}
                            src={image} 
                            alt={`View ${index + 1}`} 
                            className={`max-w-[95vw] max-h-[85vh] object-contain rounded-lg absolute transition-all duration-700 ease-in-out ${
                                index === currentIndex 
                                ? 'opacity-100 scale-100 z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]' 
                                : 'opacity-0 scale-95 z-0'
                            }`} 
                        />
                    ))}
                </div>

                <button 
                    onClick={(e) => { e.stopPropagation(); advanceSlide(true); }}
                    className={`absolute right-0 top-0 bottom-0 w-24 md:w-32 flex items-center justify-center group z-20 transition-opacity duration-700 ${showUI ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Next Artifact"
                >
                    <div className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <ChevronRight size={32} />
                    </div>
                </button>
            </div>

            {/* Bottom Strip Navigation */}
            <div className={`absolute bottom-0 left-0 right-0 p-8 z-50 flex flex-col items-center gap-6 bg-gradient-to-t from-black to-transparent transition-all duration-700 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-white text-black rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-90">
                        {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
                    </button>
                </div>
                
                <div className="flex gap-2.5 max-w-[90vw] overflow-x-auto p-2 no-scrollbar">
                    {images.map((img, index) => (
                        <button 
                            key={index} 
                            onClick={() => { setIsPlaying(false); setCurrentIndex(index); }}
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-500 border-2 ${
                                currentIndex === index 
                                ? 'border-cyan-500 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                                : 'border-transparent opacity-40 hover:opacity-80'
                            }`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LightboxGallery;
