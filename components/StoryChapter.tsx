
import React, { useState } from 'react';
import { Moment } from '../types';
import { ImageIcon, Calendar, ChevronRight, Heart, CheckCircle2, Share2, Layers, Play, Info } from 'lucide-react';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { ASSETS } from '../data/assets';
import Tooltip from './Tooltip';
import { formatArchivalDate } from '../utils/dateUtils';

interface StoryChapterProps {
    moment: Moment;
    onOpen: () => void;
    index: number;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: number) => void;
    onFavorite?: (moment: Moment) => void;
    onShare?: (moment: Moment) => void;
    isNew?: boolean;
}

const StoryChapter: React.FC<StoryChapterProps> = ({ 
    moment, onOpen, index, isSelectionMode, isSelected, 
    onToggleSelect, onFavorite, onShare, isNew
}) => {
    const [imgError, setImgError] = useState(false);
    const coverImage = moment.image || moment.images?.[0];
    const isJourney = moment.type === 'collection';

    const handleClick = (e: React.MouseEvent) => {
        if (isSelectionMode) {
            onToggleSelect?.(moment.id);
        } else {
            onOpen();
        }
    };

    return (
        <article 
            onClick={handleClick}
            className={`group relative cursor-pointer animate-fade-in-up transition-all duration-700 
                ${isSelected ? 'scale-[1.01]' : ''}
                ${isNew ? 'animate-new-moment-pulse' : ''}
            `}
            style={{ animationDelay: `${index * 0.1}s`, WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
        >
            <div className={`relative aspect-[4/5] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-3xl bg-[#050811] transition-all duration-1000 border
                ${isSelected ? 'border-cyan-500/50 ring-4 ring-cyan-500/10' : 'border-white/5'}
                ${isNew ? 'border-indigo-500/50 ring-4 ring-indigo-500/20' : ''}
            `}>
                <img 
                    src={imgError ? ASSETS.UI.PLACEHOLDERS[index % 10] : getOptimizedUrl(coverImage || '', 1400)} 
                    alt={moment.title}
                    className={`w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 brightness-[0.8]`}
                    onError={() => setImgError(true)}
                />
                <div className={`absolute inset-[-1px] bg-gradient-to-t via-transparent to-transparent opacity-90 ${isJourney ? 'from-purple-950/40' : 'from-[#050811]/60'}`}></div>
                
                <div className="absolute top-8 left-10 right-10 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {isJourney ? (
                                <Tooltip text="Linked Chapters" description="This journey weaves multiple individual moments into a continuous narrative.">
                                    <div className="flex items-center gap-3">
                                        <Layers size={20} className="text-purple-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.6)]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-300 drop-shadow-lg flex items-center gap-2">
                                            {moment.photoCount} Chapters Woven <Info size={12} className="opacity-40" />
                                        </span>
                                    </div>
                                </Tooltip>
                            ) : (
                                <>
                                    <ImageIcon size={18} className="text-white/40" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                                        {moment.photoCount || 1} Artifacts
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pr-2">
                        {isSelectionMode ? (
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-cyan-500 border-cyan-400 shadow-2xl scale-110' : 'border-white/20 bg-black/40'}`}>
                                {isSelected && <CheckCircle2 size={18} className="text-black" strokeWidth={3} />}
                            </div>
                        ) : (
                            <div className="flex gap-6 items-center">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onShare?.(moment); }}
                                    className="text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 drop-shadow-lg active:scale-90"
                                >
                                    <Share2 size={18} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onFavorite?.(moment); }}
                                    className={`transition-all drop-shadow-lg active:scale-90
                                        ${moment.favorite 
                                            ? 'text-white scale-110 opacity-100 animate-heart-beat' 
                                            : 'text-white/60 opacity-0 group-hover:opacity-100 hover:text-white'}
                                    `}
                                >
                                    <Heart size={20} className={moment.favorite ? 'fill-current' : ''} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className={`${isJourney ? 'text-purple-400' : 'text-slate-500'} text-[9px] font-black uppercase tracking-[0.4em] drop-shadow-sm`}>
                                {isJourney ? 'Synthesized Journæy' : `Chapter ${index + 1}`}
                            </span>
                            <div className={`h-px w-6 ${isJourney ? 'bg-purple-400/30' : 'bg-white/10'}`}></div>
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar size={10}/> {formatArchivalDate(moment.date)}
                            </span>
                        </div>
                        <h2 className={`text-3xl md:text-5xl font-bold font-brand text-white leading-tight tracking-tighter drop-shadow-xl ${isJourney ? 'italic' : ''}`}>
                            {moment.title}
                        </h2>
                    </div>
                </div>

                {!isSelectionMode && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-sm bg-black/5">
                        <div className="bg-white text-black font-black px-8 py-3.5 rounded-2xl text-[9px] uppercase tracking-widest flex items-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <Play size={14} fill="currentColor" className="mr-2" />
                            Relive Full Narrative
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 px-10 hidden md:block max-w-4xl">
                <p className="text-lg text-slate-500 font-serif italic line-clamp-1 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    "{moment.description}"
                </p>
            </div>
            <style>{`
                @keyframes heart-beat {
                    0% { transform: scale(1); }
                    15% { transform: scale(1.3); }
                    30% { transform: scale(1); }
                    45% { transform: scale(1.15); }
                    60% { transform: scale(1); }
                }
                .animate-heart-beat {
                    animation: heart-beat 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </article>
    );
};

export default StoryChapter;
