import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Mic, Info, MapPin, Calendar, Users, Sparkles, Download, Trash2 } from 'lucide-react';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface FragmentDetailOverlayProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
    momentMetadata: {
        location?: string;
        date?: string;
        people?: string[];
    };
}

const FragmentDetailOverlay: React.FC<FragmentDetailOverlayProps> = ({ images, initialIndex, onClose, momentMetadata }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isRecording, setIsRecording] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    const advance = useCallback((dir: 'next' | 'prev') => {
        if (dir === 'next') setCurrentIndex(prev => (prev + 1) % images.length);
        else setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') advance('next');
            if (e.key === 'ArrowLeft') advance('prev');
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [advance, onClose]);

    return (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl animate-fade-in flex flex-col md:flex-row overflow-hidden">
            {/* Action Header (Mobile only) */}
            <div className="md:hidden p-4 flex justify-between items-center border-b border-white/5">
                <button onClick={onClose} className="p-2 text-white/60 hover:text-white"><X size={24}/></button>
                <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Momænt {currentIndex + 1} / {images.length}</div>
                <div className="w-10"></div>
            </div>

            {/* Media Section */}
            <div className="flex-grow relative flex items-center justify-center bg-black p-4 md:p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={images[currentIndex]} className="w-full h-full object-cover blur-[100px] opacity-20 scale-150" alt="" />
                </div>

                {/* Navigation Controls */}
                <button 
                    onClick={() => advance('prev')}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20 group"
                >
                    <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="relative z-10 max-w-full max-h-full flex items-center justify-center transition-all duration-700">
                    <img 
                        key={currentIndex}
                        src={getOptimizedUrl(images[currentIndex], 1600)} 
                        className="max-w-full max-h-[80vh] md:max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-portal-bloom" 
                        alt="Focus view"
                    />
                </div>

                <button 
                    onClick={() => advance('next')}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20 group"
                >
                    <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Curation Sidebar */}
            <div className={`w-full md:w-[420px] bg-[#050811] border-l border-white/10 flex flex-col transition-all duration-700 ${showInfo ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Neural Meta</h2>
                            <p className="text-[8px] text-slate-600 font-bold uppercase">Object & Context Discovery</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hidden md:block p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={24}/></button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-10">
                    {/* Geospatial Context */}
                    <section>
                        <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-6">Spatial Node</h3>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:border-cyan-500/20 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
                                <MapPin size={18} />
                            </div>
                            <span className="text-sm font-bold text-white">{momentMetadata.location || 'Encrypted Location'}</span>
                        </div>
                    </section>

                    {/* Social Calibration */}
                    <section>
                        <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-6">Social Calibration</h3>
                        <div className="flex flex-wrap gap-2">
                            {momentMetadata.people?.map(p => (
                                <span key={p} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 flex items-center gap-2">
                                    <Users size={12} className="text-indigo-400" /> {p}
                                </span>
                            ))}
                            <button className="px-4 py-2 rounded-full border border-dashed border-white/10 text-[10px] font-bold text-slate-600 hover:text-indigo-400 hover:border-indigo-400/50 transition-all">
                                + Identify Person
                            </button>
                        </div>
                    </section>

                    {/* Vocal Whisper Tool */}
                    <section className="pt-6 border-t border-white/5">
                        <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-6">Vocal Whisper</h3>
                        <div className="p-8 rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 flex flex-col items-center text-center gap-6 group hover:bg-indigo-900/20 transition-all">
                            <button 
                                onClick={() => setIsRecording(!isRecording)}
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse shadow-[0_0_30px_#ef4444]' : 'bg-indigo-500 hover:scale-110 shadow-[0_0_30px_rgba(99,102,241,0.3)]'}`}
                            >
                                <Mic size={28} className="text-white" />
                            </button>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-white">{isRecording ? 'Listening to Whisper...' : 'Record Archive Note'}</p>
                                <p className="text-[10px] text-slate-500 font-serif italic">"Add a specific memory for this Momænt."</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Utility */}
                <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
                    <button className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button className="flex-1 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Trash2 size={16} /> Discard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FragmentDetailOverlay;