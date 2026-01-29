
import React, { memo } from 'react';
import { Moment, Page } from '../types';
import { MapPin, Check, Heart, Share2, Layers, Plus } from 'lucide-react';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { formatArchivalDate } from '../utils/dateUtils';

interface GridViewProps {
    moments: Moment[];
    onSelectMoment: (moment: Moment) => void;
    onNavigate: (page: Page) => void;
    zoomLevel: number;
    isSelectionMode?: boolean;
    selectedIds?: Set<number>;
    onToggleSelect?: (id: number) => void;
    onFavorite?: (moment: Moment) => void;
    onShare?: (moment: Moment) => void;
    newMomentId?: number | null;
}

const GridView: React.FC<GridViewProps> = ({ 
    moments, onSelectMoment, zoomLevel, 
    isSelectionMode, selectedIds, onToggleSelect,
    onFavorite, onShare, onNavigate, newMomentId
}) => {
    
    const getGridConfig = () => {
        switch(zoomLevel) {
            case 0: return { cols: 'grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16', gap: 'gap-1', rounded: 'rounded-sm' };
            case 1: return { cols: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10', gap: 'gap-2', rounded: 'rounded-lg' };
            case 2: return { cols: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5', gap: 'gap-4 md:gap-6', rounded: 'rounded-3xl' };
            case 3: return { cols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-10 md:gap-16', rounded: 'rounded-[3rem]' };
            default: return { cols: 'grid-cols-4', gap: 'gap-4', rounded: 'rounded-2xl' };
        }
    };

    const config = getGridConfig();

    return (
        <div className={`grid ${config.cols} ${config.gap} transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] pb-32`}>
            {moments.map((moment) => {
                const isSelected = selectedIds?.has(moment.id);
                const isJourney = moment.type === 'collection';
                const isNew = moment.id === newMomentId;
                
                return (
                    <div 
                        key={`${moment.id}-${moment.type}`}
                        onClick={() => onSelectMoment(moment)}
                        className={`group relative cursor-pointer transition-all duration-500 hover:z-10 
                            ${config.rounded} bg-[#050811] shadow-xl hover:shadow-2xl hover:scale-[1.01]
                            ${isSelected ? 'ring-2 ring-cyan-500 shadow-cyan-900/40' : ''}
                            ${isNew ? 'animate-new-moment-pulse' : ''}
                        `}
                        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                    >
                        <div className={`relative w-full overflow-hidden ${config.rounded} ${zoomLevel === 0 ? 'aspect-square' : zoomLevel === 1 ? 'aspect-[4/5]' : zoomLevel === 3 ? 'aspect-video' : 'aspect-square'}`}>
                            <img 
                                src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 400)} 
                                alt={moment.title}
                                loading="lazy"
                                className={`w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 ${zoomLevel === 0 ? 'filter contrast-125' : ''}`}
                            />
                            
                            <div className={`absolute inset-[-1px] bg-gradient-to-t from-[#050811]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${isSelectionMode ? 'opacity-40' : ''}`} />

                            {/* Naked Action Zone */}
                            {zoomLevel > 0 && (
                                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        {isSelectionMode ? (
                                            <div className={`pointer-events-auto w-5 h-5 rounded-full border transition-all ${isSelected ? 'bg-cyan-500 border-cyan-400 shadow-lg' : 'border-white/20 bg-black/20'}`}>
                                                {isSelected && <Check size={12} strokeWidth={4} className="text-black mx-auto mt-0.5" />}
                                            </div>
                                        ) : (
                                            <>
                                                {isJourney && (
                                                    <div className="text-purple-400 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)] transform -translate-x-1 -translate-y-1">
                                                        <Layers size={16} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                                <div className="flex gap-4 ml-auto px-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onShare?.(moment); }}
                                                        className="pointer-events-auto text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 drop-shadow-md active:scale-90"
                                                    >
                                                        <Share2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onFavorite?.(moment); }}
                                                        className={`pointer-events-auto transition-all drop-shadow-lg active:scale-90
                                                            ${moment.favorite 
                                                                ? 'text-white opacity-100 scale-110 animate-heart-beat' 
                                                                : 'text-white/60 opacity-0 group-hover:opacity-100 hover:text-white'}
                                                        `}
                                                    >
                                                        <Heart size={16} className={moment.favorite ? 'fill-current' : ''} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Standardized Metadata Footer */}
                        {zoomLevel >= 2 && (
                            <div className="p-4 backdrop-blur-md border-t border-white/5 bg-black/40">
                                <h4 className="font-bold text-xs text-white/90 font-brand tracking-tight leading-tight flex items-center justify-between gap-2 overflow-hidden">
                                    <span className="truncate">{moment.title}</span>
                                </h4>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${isJourney ? 'text-purple-400' : 'text-slate-500/80'} whitespace-nowrap`}>
                                        {isJourney ? `${moment.photoCount} Linked Chapters` : formatArchivalDate(moment.date)}
                                    </span>
                                    {moment.location && (
                                        <span className="flex items-center gap-1 text-[8px] font-bold text-slate-600 uppercase truncate">
                                            <MapPin size={8} className="shrink-0" /> {moment.location.split(',')[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

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
        </div>
    );
};

export default memo(GridView);
