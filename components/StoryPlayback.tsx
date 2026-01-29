
import React, { useState, useMemo } from 'react';
import { Moment } from '../types';
// Added missing Calendar icon to lucide-react imports
import { X, Play, Share2, Download, Trash2, Edit3, Check, Maximize2, MapPin, Users, Heart, Sparkles, ImageIcon, Calendar } from 'lucide-react';
import LivingSlideshowPlayer from './LivingSlideshowPlayer';
import { useTheme } from '../contexts/ThemeContext';
import { formatArchivalDate } from '../utils/dateUtils';

interface StoryPlaybackProps {
    moment: Moment;
    onClose: () => void;
    onUpdate: (moment: Moment) => void;
    onDelete: () => void;
}

const StoryPlayback: React.FC<StoryPlaybackProps> = ({ moment, onClose, onUpdate, onDelete }) => {
    const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStory, setEditedStory] = useState(moment.description);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const allImages = useMemo(() => {
        return [moment.image, ...(moment.images || [])].filter(Boolean) as string[];
    }, [moment]);

    const handleSave = () => {
        onUpdate({ ...moment, description: editedStory });
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col animate-fade-in overflow-hidden">
            {/* Background Layer */}
            <div className={`absolute inset-0 ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-500`} />
            
            {/* Minimalist Professional Header */}
            <header className="relative z-10 h-20 px-8 flex justify-between items-center border-b border-white/5 bg-black/5 backdrop-blur-3xl shadow-sm">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white" aria-label="Close">
                        <X size={24} />
                    </button>
                    <div className="hidden sm:block border-l border-white/10 pl-6 h-10 flex flex-col justify-center">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-0.5">Archival Timeline</h2>
                        <p className={`text-base font-bold font-brand tracking-tighter leading-none ${isDark ? 'text-white' : 'text-stone-900'}`}>{moment.title}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSlideshowOpen(true)} 
                        className="bg-white text-black font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-[1.03] active:scale-95 transition-all"
                    >
                        <Play size={16} fill="black" /> Play Reflections
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-2"></div>
                    <button className="p-2.5 text-slate-500 hover:text-white transition-colors" title="Share Access"><Share2 size={20} /></button>
                    <button onClick={onDelete} className="p-2.5 text-slate-500 hover:text-red-400 transition-colors" title="Remove Archive"><Trash2 size={20} /></button>
                </div>
            </header>

            <main className="relative z-10 flex-grow overflow-y-auto custom-scrollbar overscroll-contain">
                <div className="container mx-auto px-6 py-20 max-w-6xl">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                        
                        {/* Narrative Content Column */}
                        <div className="lg:col-span-7 space-y-16">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={14} className="text-cyan-400" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">æterny Synthesis</h3>
                                    </div>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">Edit Fragment</button>
                                    ) : (
                                        <button onClick={handleSave} className="text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-1.5 hover:text-green-300"><Check size={12}/> Save Changes</button>
                                    )}
                                </div>
                                
                                {isEditing ? (
                                    <textarea 
                                        value={editedStory}
                                        onChange={(e) => setEditedStory(e.target.value)}
                                        className={`w-full h-[500px] bg-white/5 border border-white/10 rounded-[2rem] p-10 text-xl font-serif italic leading-relaxed outline-none focus:border-cyan-500/50 shadow-inner ${isDark ? 'text-white' : 'text-stone-900'}`}
                                        spellCheck={false}
                                    />
                                ) : (
                                    <div className={`space-y-10 text-2xl md:text-3xl font-serif italic leading-relaxed tracking-tight ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>
                                        {moment.description.split('\n').filter(p => p.trim()).map((p, i) => (
                                            <p key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>{p}</p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 gap-8 pt-16 border-t border-white/5">
                                {moment.location && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/20 shadow-lg">
                                            <MapPin size={22}/>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Spatial Context</p>
                                            <p className={`text-lg font-bold font-brand tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>{moment.location}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20 shadow-lg">
                                        <Calendar size={22}/>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Temporal Node</p>
                                        <p className={`text-lg font-bold font-brand tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>{formatArchivalDate(moment.date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Immersive Gallery Column */}
                        <div className="lg:col-span-5 sticky top-10 space-y-12">
                            <button 
                                onClick={() => setIsSlideshowOpen(true)}
                                className="group relative aspect-[4/5] w-full rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.4)] border border-white/10 bg-slate-900 transition-all duration-700 hover:scale-[1.01] hover:shadow-cyan-900/10"
                            >
                                <img src={moment.image || moment.images?.[0]} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Cover Artifact" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                                    <div className="bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/30 shadow-2xl">
                                        <Maximize2 className="text-white w-10 h-10 drop-shadow-lg" />
                                    </div>
                                </div>
                                {moment.favorite && (
                                    <div className="absolute top-8 right-8 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-900/20">
                                        <Heart size={24} fill="currentColor" />
                                    </div>
                                )}
                            </button>

                            {/* Secondary Artifact Grid */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Captured Memories</h3>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tabular-nums">{allImages.length} items</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {allImages.slice(0, 6).map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setIsSlideshowOpen(true)}
                                            className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:scale-[1.05] transition-transform shadow-lg group"
                                        >
                                            <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={`Memory ${i+1}`} />
                                        </button>
                                    ))}
                                    {allImages.length > 6 && (
                                        <button 
                                            onClick={() => setIsSlideshowOpen(true)}
                                            className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
                                        >
                                            <span className="text-xl font-bold group-hover:scale-110 transition-transform">+{allImages.length - 6}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FULL SCREEN CINEMATIC LAYER */}
            {isSlideshowOpen && (
                <LivingSlideshowPlayer 
                    moment={moment}
                    aeternyVoice="Sarah"
                    aeternyStyle="Warm & Empathetic"
                    onClose={() => setIsSlideshowOpen(false)}
                />
            )}
        </div>
    );
};

export default StoryPlayback;
