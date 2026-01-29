
import React, { useState, useEffect } from 'react';
import { Moment, Page, Language } from '../types';
import { Mic, X, ArrowLeft, Waves, Loader2, Shield, Lock, History, Volume2, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { formatArchivalDate } from '../utils/dateUtils';

interface RecordPageProps {
    onCreateMoment: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
    onNavigate: (page: Page) => void;
    language: Language;
}

const WaveformVisualizer = ({ active }: { active: boolean }) => (
    <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-sm mx-auto">
        {[...Array(24)].map((_, i) => (
            <div 
                key={i} 
                className={`w-1 rounded-full bg-cyan-400/60 transition-all duration-300 ${active ? 'animate-vocal-wave' : 'h-1.5'}`} 
                style={{ 
                    animationDelay: `${i * 0.05}s`,
                    height: active ? `${30 + Math.random() * 70}%` : '4px'
                }} 
            />
        ))}
    </div>
);

const RecordPage: React.FC<RecordPageProps> = ({ onCreateMoment, onNavigate, language }) => {
    const [status, setStatus] = useState<'idle' | 'recording' | 'processing'>('idle');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleStart = () => setStatus('recording');

    const handleStop = () => {
        setStatus('processing');
        setTimeout(() => {
            onCreateMoment({
                title: "Voice Reflection",
                description: "A captured vocal memory, securely archived and preserved in the family vault. Transcribed and analyzed for emotional resonance.",
                date: formatArchivalDate(new Date()),
                type: 'standard',
                aiTier: 'diamond',
                photoCount: 0,
                emotion: 'reflection'
            });
            onNavigate(Page.Chronicle);
        }, 3500);
    };

    return (
        <div className={`relative w-full h-screen ${isDark ? 'bg-[#02040A]' : 'bg-[#FDFBF7]'} flex flex-col overflow-hidden selection:bg-cyan-500/20`}>
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)]`} />
                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
                {status === 'recording' && (
                    <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                )}
            </div>

            {/* HEADER */}
            <header className="relative z-50 w-full p-8 md:p-12 flex justify-between items-center">
                <button 
                    onClick={() => onNavigate(Page.Home)} 
                    className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cancel</span>
                </button>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'recording' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : 'bg-slate-700'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        {status === 'recording' ? 'Live Capture' : status === 'processing' ? 'Archiving' : 'Studio Ready'}
                    </span>
                </div>
            </header>

            {/* MAIN STAGE */}
            <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-6 text-center">
                
                {/* INSTRUCTIONS */}
                <div className={`mb-16 space-y-6 transition-all duration-1000 ${status === 'processing' ? 'opacity-0 scale-95' : 'opacity-100'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em]">
                        <Volume2 size={12} /> Voice studio
                    </div>
                    <h1 className={`text-4xl md:text-7xl font-bold font-brand tracking-tighter leading-none ${isDark ? 'text-white' : 'text-stone-900'}`}>
                        {status === 'idle' ? 'Speak your Story.' : 'Capture Active.'}
                    </h1>
                    <p className="text-slate-500 font-serif italic text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                        {status === 'idle' 
                            ? "Your voice is the most authentic bridge to the future. Record a thought, a story, or a simple message."
                            : "Speak naturally. I am listening to the emotion and meaning behind your words."}
                    </p>
                </div>

                {/* CENTRAL INTERACTIVE ORB */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mb-12">
                    {/* Background Glows */}
                    <div className={`absolute inset-0 bg-cyan-500/20 rounded-full blur-[100px] transition-all duration-1000 ${status === 'recording' ? 'opacity-60 scale-125' : 'opacity-0 scale-50'}`} />
                    
                    {/* Pulsing Rings */}
                    <div className={`absolute inset-0 border border-white/5 rounded-full transition-all duration-1000 ${status === 'recording' ? 'scale-110 border-cyan-500/20' : 'scale-90'}`} />
                    <div className={`absolute inset-8 border border-white/5 rounded-full transition-all duration-1000 ${status === 'recording' ? 'scale-105 border-cyan-500/10' : 'scale-95'}`} />

                    <button 
                        onClick={status === 'recording' ? handleStop : status === 'idle' ? handleStart : undefined}
                        disabled={status === 'processing'}
                        className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-3xl group
                            ${status === 'recording' ? 'bg-[#0A0C14] border-cyan-500/50 scale-105' : 'bg-slate-900 border-white/10 hover:border-white/30 hover:scale-105 active:scale-95'}
                            ${status === 'processing' ? 'cursor-not-allowed opacity-50' : ''}
                            border
                        `}
                    >
                        {status === 'idle' && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                    <Mic size={32} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Tap to Begin</span>
                            </div>
                        )}
                        
                        {status === 'recording' && (
                            <div className="flex flex-col items-center gap-4 animate-fade-in">
                                <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse">
                                    <Waves size={32} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Save Reflection</span>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="flex flex-col items-center gap-4 animate-fade-in">
                                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" strokeWidth={1.5} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Archiving...</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* VISUALIZER & STATUS FOOTER */}
                <div className={`space-y-8 transition-all duration-700 ${status === 'recording' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <WaveformVisualizer active={status === 'recording'} />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 animate-pulse">Establishing permanent link...</p>
                </div>

                {status === 'processing' && (
                    <div className="animate-fade-in space-y-6">
                        <p className="text-2xl md:text-3xl font-serif italic text-white/90 leading-tight px-12">
                            "I am weaving your voice into the family chronicle..."
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Neural Synthesis Active</span>
                        </div>
                    </div>
                )}
            </main>

            {/* FOOTER BADGES */}
            <footer className={`relative z-50 p-12 flex flex-col items-center gap-6 flex-shrink-0 transition-opacity duration-1000 ${status !== 'idle' ? 'opacity-20' : 'opacity-60'}`}>
                <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                    <div className="flex items-center gap-2.5">
                        <Shield size={14} className="text-cyan-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Secure Vault</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Lock size={14} className="text-indigo-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">End-to-End Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <History size={14} className="text-amber-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Generational History</span>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes vocal-wave {
                    0%, 100% { transform: scaleY(1); opacity: 0.5; }
                    50% { transform: scaleY(2.5); opacity: 1; }
                }
                .animate-vocal-wave {
                    animation: vocal-wave 0.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default RecordPage;
