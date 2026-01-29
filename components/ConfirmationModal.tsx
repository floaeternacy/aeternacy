
import React from 'react';
import { X, Sparkles, Loader2, Info, ArrowRight } from 'lucide-react';
import TokenIcon from './icons/TokenIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: React.ReactNode;
  cost: number;
  currentBalance: number;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    cost, 
    currentBalance,
    isLoading 
}) => {
  if (!isOpen) return null;

  const remainingBalance = currentBalance - cost;
  const isInsufficient = remainingBalance < 0;

  return (
    <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-[#0A0C14] rounded-[3rem] border border-white/10 shadow-3xl w-full max-w-lg overflow-hidden animate-scale-in-top-right transition-all duration-700" onClick={e => e.stopPropagation()}>
        <div className="p-10 md:p-14 text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-inner">
                <TokenIcon size={40} className="text-amber-500 animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-bold font-brand text-white mb-4 tracking-tighter">{title}</h2>
            
            <div className="text-slate-400 text-sm leading-relaxed mb-8 font-serif italic px-2">
                {message || "Would you like æterny to help weave this memory for you?"}
            </div>

            {/* High Compute power explanation */}
            <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4 text-left">
                <div className="shrink-0 mt-0.5">
                    <Info size={16} className="text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                    This operation requires <strong className="text-slate-300">intensive neural compute</strong>. Manifesting Living Frames or complex weaves consumes significant reservoir energy.
                </p>
            </div>
            
            {/* ENERGY MATH HUD */}
            <div className="mb-10 p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Energy</span>
                    <span className="text-sm font-bold text-slate-300 font-mono">{currentBalance.toLocaleString()} Tk</span>
                </div>
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Operation Cost</span>
                    <span className="text-sm font-bold text-amber-500 font-mono">-{cost.toLocaleString()} Tk</span>
                </div>
                <div className="h-px bg-white/10 w-full"></div>
                <div className="flex justify-between items-center px-2 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post-Manifestation</span>
                    <span className={`text-lg font-bold font-mono ${isInsufficient ? 'text-red-500' : 'text-cyan-400'}`}>
                        {remainingBalance.toLocaleString()} Tk
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <button 
                    onClick={onConfirm} 
                    disabled={isLoading || isInsufficient}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 disabled:opacity-50
                        ${isInsufficient ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-100 shadow-white/10'}
                    `}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    {isInsufficient ? 'Insufficient Energy' : 'Confirm Manifestation'}
                </button>
                <button 
                    onClick={onClose} 
                    disabled={isLoading}
                    className="w-full py-2 text-slate-500 font-bold uppercase tracking-widest text-[11px] hover:text-white transition-colors"
                >
                    Abort Ritual
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
