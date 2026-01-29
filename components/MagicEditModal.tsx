
import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Wand2, Loader2, RefreshCw, Check, ArrowRight, Sparkles, Sun, Contrast, Droplet, Aperture, Eraser, Palette, Sliders } from 'lucide-react';
import { imageUrlToPayload, editImage } from '../services/geminiService';
import { TOKEN_COSTS } from '../services/costCatalog';

interface MagicEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalImage: string;
    onApply: (newImage: string) => void;
    triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string) => void;
}

const adjustmentOptions = [
    { label: "Fix Lighting", icon: Sun, prompt: "Fix the lighting and exposure balance to look natural and professional" },
    { label: "Boost Contrast", icon: Contrast, prompt: "Increase contrast and dynamic range for a dramatic look" },
    { label: "Make Vivid", icon: Droplet, prompt: "Increase saturation and vibrancy to make colors pop" },
    { label: "B&W Noir", icon: Aperture, prompt: "Convert to high-contrast artistic black and white" },
];

const filterOptions = [
    "Golden Hour Glow",
    "Vintage Film Look",
    "Cyberpunk Neon",
    "Soft Watercolor",
    "Studio Portrait",
    "Cinematic Teal & Orange"
];

const smartRemovals = [
    "Remove people in background",
    "Remove text / watermarks",
    "Clean up messy background"
];

const MagicEditModal: React.FC<MagicEditModalProps> = ({ isOpen, onClose, originalImage, onApply, triggerConfirmation }) => {
    const [prompt, setPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const executeGeneration = useCallback(async (customPrompt?: string) => {
        const activePrompt = customPrompt || prompt;
        if (!activePrompt.trim()) return;
        
        setIsProcessing(true);
        setError(null);
        setEditedImage(null);

        try {
            const { data, mimeType } = await imageUrlToPayload(originalImage);
            const result = await editImage(data, mimeType, activePrompt);
            setEditedImage(result);
            console.log(`TELEMETRY: token_spend_ok, feature: MAGIC_EDIT, cost: ${TOKEN_COSTS.MAGIC_EDIT}`);
        } catch (err: any) {
            console.error("Magic Edit failed:", err);
            setError(err.message || "Failed to edit image.");
        } finally {
            setIsProcessing(false);
        }
    }, [originalImage, prompt]);

    const handleGenerateClick = () => {
        if (!prompt.trim()) return;
        triggerConfirmation(TOKEN_COSTS.MAGIC_EDIT, 'MAGIC_EDIT', () => executeGeneration(), "Use generative AI to edit this image?");
    };

    const handleQuickAction = (newPrompt: string) => {
        setPrompt(newPrompt);
        // Automatically trigger generation for quick actions to fulfill the "magic" expectation
        triggerConfirmation(TOKEN_COSTS.MAGIC_EDIT, 'MAGIC_EDIT', () => executeGeneration(newPrompt), `Apply "${newPrompt}" enhancement?`);
    };

    const handleApply = () => {
        if (editedImage) {
            onApply(editedImage);
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/90 z-[130] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 w-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[100dvh]" onClick={e => e.stopPropagation()}>
                
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950 flex-shrink-0">
                    <h2 className="text-xl font-bold font-brand text-white flex items-center gap-3">
                        <Wand2 className="w-5 h-5 text-purple-400" />
                        Magic Edit
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
                    <div className="bg-black relative flex items-center justify-center p-4 lg:p-8 h-[40%] lg:h-full lg:flex-1 transition-all">
                        <div className="relative h-full w-full flex items-center justify-center gap-4">
                            {editedImage ? (
                                <div className="grid grid-cols-2 gap-4 w-full h-full">
                                    <div className="relative group rounded-xl overflow-hidden border border-white/10">
                                        <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white z-10 uppercase tracking-widest">Original</div>
                                        <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="relative group rounded-xl overflow-hidden border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                                        <div className="absolute top-3 left-3 bg-purple-600/80 px-2 py-1 rounded text-[10px] font-bold text-white z-10 uppercase tracking-widest">æterny Edit</div>
                                        <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative h-full w-full flex items-center justify-center">
                                    <img src={originalImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                                            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                                            <p className="text-white font-medium uppercase tracking-widest text-xs">Applying magic...</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-[60%] lg:h-full z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none">
                        <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar overscroll-contain">
                            
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Manual Instruction</label>
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your change (e.g., 'Make it look like a oil painting')..." 
                                    className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm placeholder-slate-600 focus:ring-2 focus:ring-purple-500/40 focus:border-transparent outline-none resize-none transition-all"
                                    disabled={isProcessing}
                                />
                                <button 
                                    onClick={handleGenerateClick}
                                    disabled={!prompt.trim() || isProcessing}
                                    className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4"/>}
                                    <span className="uppercase tracking-widest text-xs">{editedImage ? 'Refine' : 'Generate'}</span>
                                    <span className="text-white/60 text-[10px] font-normal">({TOKEN_COSTS.MAGIC_EDIT} Tk)</span>
                                </button>
                                {error && (
                                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-[10px] leading-relaxed">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Sliders className="w-3 h-3" /> Quick Enhancements
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {adjustmentOptions.map((opt) => (
                                        <button
                                            key={opt.label}
                                            onClick={() => handleQuickAction(opt.prompt)}
                                            disabled={isProcessing}
                                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 border border-white/5 hover:bg-slate-700 hover:border-purple-500/30 transition-all group"
                                        >
                                            <opt.icon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Eraser className="w-3 h-3" /> Smart Cleanup
                                </label>
                                <div className="space-y-2">
                                    {smartRemovals.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleQuickAction(opt)}
                                            disabled={isProcessing}
                                            className="w-full text-left px-4 py-2.5 rounded-lg bg-slate-800 border border-white/5 hover:bg-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Palette className="w-3 h-3" /> Artistic Filters
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleQuickAction(`Apply style: ${opt}`)}
                                            disabled={isProcessing}
                                            className="px-3 py-1.5 rounded-full bg-slate-800 border border-white/5 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {editedImage && (
                            <div className="p-6 border-t border-white/10 bg-slate-950 flex gap-3 flex-shrink-0">
                                <button onClick={() => setEditedImage(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                    <RefreshCw className="w-4 h-4"/> Reset
                                </button>
                                <button onClick={handleApply} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                    <Check className="w-4 h-4"/> Apply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MagicEditModal;
