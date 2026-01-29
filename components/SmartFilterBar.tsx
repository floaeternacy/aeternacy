
import React, { useState } from 'react';
import { Search, X, Heart, ChevronDown } from 'lucide-react';
import { Moment } from '../types';

interface SmartFilterBarProps {
    filters: {
        emotion?: string[];
        people?: string[];
        location?: string;
        search: string;
        onlyFavorites?: boolean;
    };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    moments: Moment[];
}

const SmartFilterBar: React.FC<SmartFilterBarProps> = ({ filters, setFilters, moments }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<'emotion' | 'people' | null>(null);

    const allEmotions = Array.from(new Set(moments.map(m => m.emotion).filter(Boolean))) as string[];
    const allPeople = Array.from(new Set(moments.flatMap(m => m.people || [])));

    const toggleEmotion = (emotion: string) => {
        const current = filters.emotion || [];
        const next = current.includes(emotion) 
            ? current.filter(e => e !== emotion)
            : [...current, emotion];
        setFilters({ ...filters, emotion: next });
    };

    const hasActiveFilters = !!(filters.emotion?.length || filters.people?.length || filters.search || filters.onlyFavorites);

    return (
        <div className="relative w-full flex items-center gap-3">
            <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search by vibe, person, or place..."
                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-600 font-medium"
                />
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {/* FAVORITE TOGGLE: Neutralized active state */}
                <button 
                    onClick={() => setFilters({ ...filters, onlyFavorites: !filters.onlyFavorites })}
                    title="Toggle Favorites"
                    className={`p-3 rounded-2xl border transition-all duration-300 ${filters.onlyFavorites ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                >
                    <Heart size={18} className={filters.onlyFavorites ? 'fill-current' : ''} />
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(isMenuOpen === 'emotion' ? null : 'emotion')}
                        className={`flex items-center gap-2 px-4 h-11 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all
                            ${filters.emotion?.length ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}
                        `}
                    >
                        Vibe
                        <ChevronDown size={12} className={`transition-transform duration-300 ${isMenuOpen === 'emotion' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isMenuOpen === 'emotion' && (
                        <div className="absolute top-full right-0 mt-3 w-48 bg-[#0B101B]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 shadow-3xl animate-fade-in-up z-[100]">
                            <p className="text-[8px] font-black uppercase text-slate-500 mb-3 tracking-widest px-2">Emotional Spectrum</p>
                            <div className="flex flex-col gap-1">
                                {allEmotions.map(e => (
                                    <button 
                                        key={e}
                                        onClick={() => toggleEmotion(e)}
                                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${filters.emotion?.includes(e) ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="capitalize">{e}</span>
                                        {filters.emotion?.includes(e) && <X size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(isMenuOpen === 'people' ? null : 'people')}
                        className={`flex items-center gap-2 px-4 h-11 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all
                            ${filters.people?.length ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}
                        `}
                    >
                        Circle
                        <ChevronDown size={12} className={`transition-transform duration-300 ${isMenuOpen === 'people' ? 'rotate-180' : ''}`} />
                    </button>

                    {isMenuOpen === 'people' && (
                        <div className="absolute top-full right-0 mt-3 w-56 bg-[#0B101B]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 shadow-3xl animate-fade-in-up z-[100]">
                            <p className="text-[8px] font-black uppercase text-slate-500 mb-3 tracking-widest px-2">Social Nodes</p>
                            <div className="grid grid-cols-1 gap-1">
                                {allPeople.map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => {
                                            const current = filters.people || [];
                                            const next = current.includes(p) ? current.filter(x => x !== p) : [...current, p];
                                            setFilters({ ...filters, people: next });
                                        }}
                                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${filters.people?.includes(p) ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span>{p}</span>
                                        {filters.people?.includes(p) && <X size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RESET BUTTON: Moved into the flex group to maintain layout stability */}
                <div className={`transition-all duration-500 overflow-hidden flex items-center ${hasActiveFilters ? 'w-10 opacity-100 ml-1' : 'w-0 opacity-0'}`}>
                    <button 
                        onClick={() => setFilters({ search: '', emotion: [], people: [], onlyFavorites: false })}
                        className="p-2.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Reset Scope"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmartFilterBar;
