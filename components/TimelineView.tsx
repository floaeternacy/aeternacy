
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Moment, Page } from '../types';
import { Search, Clock, Calendar, Sparkles, Filter, ChevronDown, ImageIcon, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import StoryChapter from './StoryChapter';
import StoryPlayback from './StoryPlayback';

interface TimelineViewProps {
    moments: Moment[];
    onNavigate?: (page: Page) => void;
    onUpdateMoment?: (moment: Moment) => void;
    onDeleteMoment?: (id: number) => void;
    onPinToggle?: (id: any) => void;
    onSelectMoment?: (moment: Moment) => void;
    onShare?: (moment: Moment) => void;
    onFavorite?: (moment: Moment) => void;
    isSelectionMode?: boolean;
    selectedIds?: Set<number>;
    onToggleSelect?: (id: number) => void;
    newMomentId?: number | null;
    deletingMomentId?: number | null;
}

const TimelineView: React.FC<TimelineViewProps> = ({ 
    moments, onNavigate, onUpdateMoment, onDeleteMoment,
    onFavorite, onShare, isSelectionMode, selectedIds, onToggleSelect, newMomentId
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [searchQuery, setSearchQuery] = useState('');
    const [activePlayback, setActivePlayback] = useState<Moment | null>(null);
    const [activeYear, setActiveYear] = useState<number | null>(null);
    
    const yearRefs = useRef<{ [key: number]: HTMLElement | null }>({});

    const sortedMoments = useMemo(() => {
        return [...moments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [moments]);

    const filteredMoments = useMemo(() => {
        if (!searchQuery) return sortedMoments;
        const q = searchQuery.toLowerCase();
        return sortedMoments.filter(m => 
            m.title.toLowerCase().includes(q) || 
            m.description.toLowerCase().includes(q) ||
            m.location?.toLowerCase().includes(q)
        );
    }, [sortedMoments, searchQuery]);

    const momentsByYear = useMemo(() => {
        const groups: { [year: number]: Moment[] } = {};
        filteredMoments.forEach(m => {
            const year = new Date(m.date).getFullYear().toString();
            const yearNum = parseInt(year, 10);
            if (!isNaN(yearNum)) {
                if (!groups[yearNum]) groups[yearNum] = [];
                groups[yearNum].push(m);
            }
        });
        return groups;
    }, [filteredMoments]);

    const years = useMemo(() => {
        return Object.keys(momentsByYear)
            .map(Number)
            .sort((a, b) => b - a);
    }, [momentsByYear]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const year = Number(entry.target.getAttribute('data-year'));
                        setActiveYear(year);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
        );

        (Object.values(yearRefs.current) as (HTMLElement | null)[]).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [filteredMoments, years]);

    const scrollToYear = (year: number) => {
        yearRefs.current[year]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} flex flex-col md:flex-row transition-colors duration-500`}>
            
            <aside className="hidden md:flex fixed left-20 top-0 bottom-0 w-24 flex-col items-center py-32 z-40 pointer-events-none">
                <div className="relative h-full flex flex-col items-center">
                    <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-40"></div>
                    
                    <div className="flex flex-col gap-12 relative pointer-events-auto">
                        {years.map(year => {
                            const isActive = activeYear === year;
                            const count = momentsByYear[year].length;
                            const preview = momentsByYear[year][0]?.image || momentsByYear[year][0]?.images?.[0];

                            return (
                                <button
                                    key={year}
                                    onClick={() => scrollToYear(year)}
                                    className="group relative flex flex-col items-center"
                                    title={`${count} memories from ${year}`}
                                >
                                    <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shadow-2xl">
                                        {count} Chapters in {year}
                                    </div>

                                    <span className={`text-[10px] font-black tracking-widest mb-3 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                        {year}
                                    </span>

                                    <div className={`relative w-8 h-8 rounded-xl overflow-hidden border-2 transition-all duration-500 shadow-xl
                                        ${isActive 
                                            ? 'border-cyan-500 scale-125 ring-4 ring-cyan-500/10' 
                                            : 'border-white/5 grayscale group-hover:grayscale-0 group-hover:border-white/20'
                                        }
                                    `}>
                                        <img src={preview} className="w-full h-full object-cover" alt="" />
                                        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 text-[8px] font-black text-white ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {count}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        <button
                            onClick={() => onNavigate?.(Page.Create)}
                            className="group relative flex flex-col items-center mt-6"
                            title="Weave New Chapter"
                        >
                            <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shadow-2xl">
                                Archive Fragments
                            </div>
                            <div className={`w-8 h-8 rounded-xl border-2 border-dashed border-cyan-500/40 bg-cyan-500/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-500 group-active:scale-95`}>
                                <Plus size={16} className="text-cyan-400" />
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-grow">
                <div className={`sticky top-0 z-50 px-6 py-6 transition-all duration-500 backdrop-blur-3xl border-b ${isDark ? 'bg-[#050811]/80 border-white/5' : 'bg-white/80 border-stone-200 shadow-sm'}`}>
                    <div className="max-w-4xl mx-auto flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-grow group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 transition-colors group-focus-within:text-cyan-400" />
                                <input 
                                    type="text"
                                    placeholder="Find a specific moment in time..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full py-4 pl-12 pr-4 rounded-[1.5rem] border-2 transition-all text-sm outline-none font-medium ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-cyan-500/30' : 'bg-stone-50 border-stone-100 text-stone-900 focus:border-cyan-500/30'}`}
                                />
                            </div>
                        </div>

                        <div className="md:hidden flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest snap-start transition-all ${!activeYear ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                            >
                                Latest
                            </button>
                            {years.map(year => (
                                <button 
                                    key={year}
                                    onClick={() => scrollToYear(year)}
                                    className={`flex-shrink-0 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest snap-start transition-all flex items-center gap-2 ${activeYear === year ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-white/5 text-slate-500'}`}
                                >
                                    {year}
                                    <span className="opacity-40 text-[8px]">{momentsByYear[year].length}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-20 space-y-32">
                    {years.length > 0 ? (
                        years.map((year) => (
                            <section 
                                key={year} 
                                data-year={year}
                                ref={(el) => { yearRefs.current[year] = el; }}
                                className="space-y-16 pt-16 scroll-mt-24"
                            >
                                <div className="flex items-center gap-8 opacity-40">
                                    <div className="h-px bg-slate-800 flex-grow"></div>
                                    <h3 className="text-5xl font-brand font-bold text-white tracking-tighter">{year}</h3>
                                    <div className="h-px bg-slate-800 flex-grow"></div>
                                </div>

                                <div className="space-y-24">
                                    {momentsByYear[year].map((chapter, idx) => (
                                        <StoryChapter 
                                            key={chapter.id} 
                                            moment={chapter} 
                                            onOpen={() => setActivePlayback(chapter)}
                                            index={idx}
                                            isSelectionMode={isSelectionMode}
                                            isSelected={selectedIds?.has(chapter.id)}
                                            onToggleSelect={onToggleSelect}
                                            onFavorite={onFavorite}
                                            onShare={onShare}
                                            isNew={chapter.id === newMomentId}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="py-40 text-center animate-fade-in flex flex-col items-center">
                            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                                <Clock className="w-10 h-10 text-slate-700" />
                            </div>
                            <h3 className="text-2xl font-brand font-bold text-slate-400">The Chronicle is silent.</h3>
                            <p className="text-slate-600 mt-2 max-w-xs mx-auto italic">No artifacts match your current search parameters.</p>
                            <button onClick={() => setSearchQuery('')} className="mt-8 text-cyan-400 font-bold text-xs uppercase tracking-widest hover:text-cyan-300 transition-colors border-b border-cyan-400/20 pb-1">Reset Search</button>
                        </div>
                    )}
                </div>
            </main>

            {activePlayback && (
                <StoryPlayback 
                    moment={activePlayback} 
                    onClose={() => setActivePlayback(null)} 
                    onUpdate={onUpdateMoment || (() => {})}
                    onDelete={() => {
                        if (onDeleteMoment) onDeleteMoment(activePlayback.id);
                        setActivePlayback(null);
                    }}
                />
            )}
        </div>
    );
};

export default TimelineView;
