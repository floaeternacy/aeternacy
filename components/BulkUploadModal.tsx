import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Loader2, CheckCircle2, Cloud, HardDrive, Smartphone, Zap, AlertTriangle, ChevronRight, Lock, BrainCircuit, ShieldCheck } from 'lucide-react';
import GoogleIcon from './icons/GoogleIcon';

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState<'source' | 'uploading' | 'processing'>('source');
    const [progress, setProgress] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const totalCount = 52847;

    useEffect(() => {
        if (step === 'uploading') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep('processing'), 500);
                        return 100;
                    }
                    const next = prev + 1;
                    setUploadedCount(Math.floor((next / 100) * totalCount));
                    return next;
                });
            }, 80);
            return () => clearInterval(interval);
        }

        if (step === 'processing') {
            const timer = setTimeout(() => {
                onComplete();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [step, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#050811]/95 backdrop-blur-2xl z-[10000] flex items-center justify-center p-6 animate-fade-in">
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="w-full max-w-2xl relative animate-fade-in-up">
                <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden flex flex-col min-h-[400px]">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                <Zap size={20} className={step === 'source' ? '' : 'animate-pulse'} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Archive Rescue™ Ritual</h2>
                        </div>
                        <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={24}/></button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow p-10">
                        {step === 'source' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold font-brand text-white mb-2 tracking-tight">Connect Your Archive</h3>
                                    <p className="text-slate-400 font-serif italic text-lg leading-relaxed">"Select the collection of photos and videos you wish to rescue from digital entropy."</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button 
                                        onClick={() => setStep('uploading')}
                                        className="w-full h-20 px-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg"><GoogleIcon className="w-8 h-8" /></div>
                                            <div className="text-left">
                                                <p className="font-bold text-white text-lg">Google Photos</p>
                                                <p className="text-xs text-slate-500">Direct neural link to your photo & video library</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
                                    </button>

                                    <button className="w-full h-20 px-8 rounded-3xl bg-black/20 border border-white/5 opacity-40 cursor-not-allowed flex items-center justify-between group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500"><Smartphone size={28} /></div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-400 text-lg">iCloud Archive</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Coming Soon</p>
                                            </div>
                                        </div>
                                        <Lock size={16} className="text-slate-800" />
                                    </button>

                                    <button 
                                        onClick={() => setStep('uploading')}
                                        className="w-full h-20 px-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><UploadCloud size={28} /></div>
                                            <div className="text-left">
                                                <p className="font-bold text-white text-lg">Local Hard Drive</p>
                                                <p className="text-xs text-slate-500">Manual ingestion from multi-format archives</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'uploading' && (
                            <div className="flex flex-col items-center justify-center h-full py-12 animate-fade-in text-center">
                                <div className="relative mb-12">
                                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"></div>
                                    <div className="w-40 h-40 rounded-full border-2 border-cyan-500/20 flex items-center justify-center relative z-10">
                                        <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
                                        <p className="text-4xl font-brand font-bold text-white">{progress}%</p>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold font-brand text-white mb-2">Rescuing Fragments</h3>
                                <p className="text-slate-400 font-mono text-sm tracking-widest mb-10">
                                    {uploadedCount.toLocaleString()} / {totalCount.toLocaleString()} photos & videos
                                </p>
                                <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Secure Institutional Transfer</p>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="flex flex-col items-center justify-center h-full py-12 animate-fade-in text-center">
                                <div className="relative mb-12">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                                    <BrainCircuit size={80} className="text-indigo-400 animate-pulse relative z-10" />
                                </div>
                                <h3 className="text-3xl font-bold font-brand text-white mb-4 tracking-tight">Neural Mapping Active</h3>
                                <p className="text-slate-400 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
                                    "I am identifying action peaks in your videos and transcribing spoken legacy to anchor your timeline."
                                </p>
                                <div className="mt-12 flex gap-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-center gap-3">
                        <ShieldCheck size={16} className="text-cyan-500/40" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Centennial Infrastructure Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkUploadModal;