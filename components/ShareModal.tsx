
import React from 'react';
import { Moment, Journey, UserTier, House } from '../types';
import { 
  X, Users, Share2, 
  Instagram, Facebook, Link as LinkIcon, 
  Landmark, Globe, Lock,
  MessageSquare, Twitter, Clock
} from 'lucide-react';

interface ShareModalProps {
  item: Moment | Journey;
  onClose: () => void;
  onUpdateItem: (item: Moment | Journey) => void;
  userTier: UserTier;
  houses: House[];
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, houses }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4 backdrop-blur-2xl animate-fade-in" onClick={onClose}>
      <div className="bg-[#0A0C14] border border-white/10 rounded-[3rem] shadow-3xl w-full max-w-xl overflow-hidden animate-scale-in-top-right" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <Share2 size={20} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Share Moment</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={24}/></button>
        </div>

        <div className="p-10 space-y-12">
            
            {/* 1. HOUSE SHARING */}
            <section className="opacity-50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-2">
                    <Landmark size={14}/> House Distribution
                </h3>
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-4 py-10">
                    <Users size={24} className="text-slate-700" />
                    <p className="text-xs text-slate-600 font-serif italic">"Direct distribution to other Lineage Houses is currently restricted."</p>
                </div>
            </section>

            {/* 2. SOCIAL EXPORT */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                        <Globe size={14}/> External Channels
                    </h3>
                </div>

                <div className="grid grid-cols-4 gap-4 relative">
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <div className="bg-cyan-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl rotate-[-2deg]">
                            Coming Soon
                        </div>
                    </div>

                    {[
                        { id: 'instagram', icon: Instagram },
                        { id: 'facebook', icon: Facebook },
                        { id: 'twitter', icon: Twitter },
                        { id: 'more', icon: MessageSquare }
                    ].map(platform => (
                        <div 
                            key={platform.id}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5 opacity-20 grayscale"
                        >
                            <platform.icon size={24} />
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. SOVEREIGN LINK */}
            <section className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4">Sovereign Link</p>
                <div className="flex items-center gap-4 p-5 bg-black/40 border border-white/5 rounded-2xl opacity-40 grayscale cursor-not-allowed">
                    <LinkIcon size={16} className="text-slate-700" />
                    <span className="text-[11px] text-slate-600 font-mono flex-grow">https://aeternacy.me/s/pending...</span>
                    <Lock size={14} className="text-slate-800" />
                </div>
            </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/20 flex items-center justify-center gap-3 opacity-30">
            <Clock size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Institutional Update • Private Beta v1.7</span>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
