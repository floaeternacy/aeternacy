
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Moment, Page, UserTier, Journey } from '../types';
import TimelineView from './TimelineView';
import GridView from './GridView';
import WorldMapPage from './WorldMapPage';
import { 
    LayoutGrid, History, Map as MapIcon, ZoomIn, ZoomOut, 
    Plus, Wand2, CheckCircle2, X, SlidersHorizontal, 
    Heart, ChevronDown, Check, Tag, Users, Sparkles, Activity,
    Search, ImageIcon, Mic, Layers, ArrowRight, Bot, Calendar, Clock,
    BookOpen, Lock, ArrowUpAZ, ArrowDownAZ, FileText, Loader
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ShareModal from './ShareModal';
import { mergeMomentsIntoJourney } from '../services/geminiService';
import { TOKEN_COSTS } from '../services/costCatalog';

interface MomentsPageProps {
    moments: Moment[];
    journeys: Journey[];
    onNavigate: (page: Page) => void;
    onUpdateMoment: (moment: Moment) => void;
    onCreateJourney?: (moments: Moment[], title: string, story: string) => void;
    onUpdateItem?: (item: Moment | Journey) => void;
    onDeleteMoment: (id: number) => void;
    userTier: UserTier;
    triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string, title?: string) => void;
    onSelectMoment: (moment: Moment) => void;
    onSelectJourney: (journey: Journey) => void;
    newMomentId?: number | null;
}

type ViewMode = 'story' | 'grid' | 'atlas';
type MediaTypeFilter = 'all' | 'moments' | 'journeys';
type SortOption = 'newest' | 'oldest' | 'title';

const MomentsPage: React.FC<MomentsPageProps> = ({ 
    moments, 
    journeys,
    onNavigate, 
    onUpdateMoment, 
    onCreateJourney,
    onUpdateItem,
    onDeleteMoment, 
    userTier, 
    triggerConfirmation,
    onSelectMoment,
    onSelectJourney,
    newMomentId
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [zoomLevel, setZoomLevel] = useState(2);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [shareTarget, setShareTarget] = useState<Moment | null>(null);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isWeaving, setIsWeaving] = useState(false);
    
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const plusMenuRef = useRef<HTMLDivElement>(null);

    const [activeFilters, setActiveFilters] = useState<{
        emotion: string[];
        people: string[];
        time: string[];
        search: string;
        onlyFavorites: boolean;
        mediaType: MediaTypeFilter;
        sortBy: SortOption;
    }>({ 
        emotion: [], 
        people: [], 
        time: [], 
        search: '', 
        onlyFavorites: false,
        mediaType: 'all',
        sortBy: 'newest'
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setIsFilterMenuOpen(false);
            }
            if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
                setIsPlusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const allEmotions = useMemo(() => Array.from(new Set(moments.map(m => m.emotion).filter(Boolean))) as string[], [moments]);
    const allPeople = useMemo(() => Array.from(new Set(moments.flatMap(m => m.people || []))), [moments]);
    const allYears = useMemo(() => Array.from(new Set(moments.map(m => new Date(m.date).getFullYear()))).sort((a: number, b: number) => b - a), [moments]);

    const combinedArchive = useMemo(() => {
        const journeyMoments: Moment[] = journeys.map(j => ({
            id: j.id,
            type: 'collection',
            title: j.title,
            description: j.description,
            date: 'Synthesized',
            image: j.coverImage,
            photoCount: j.momentIds.length,
            pinned: j.favorite || false,
            favorite: j.favorite,
            aiTier: 'diamond'
        } as Moment));

        return [...moments, ...journeyMoments].filter(m => {
            const matchesSearch = !activeFilters.search || 
                m.title.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
                m.description.toLowerCase().includes(activeFilters.search.toLowerCase());
            
            const matchesEmotion = !activeFilters.emotion.length || 
                (m.emotion && activeFilters.emotion.includes(m.emotion));
            
            const matchesPeople = !activeFilters.people.length ||
                (m.people && m.people.some(p => activeFilters.people.includes(p)));

            const matchesTime = !activeFilters.time.length ||
                (m.date === 'Synthesized' && activeFilters.time.includes('Journeys')) ||
                activeFilters.time.includes(new Date(m.date).getFullYear().toString());
            
            const matchesFavorites = !activeFilters.onlyFavorites || m.favorite;

            const matchesType = activeFilters.mediaType === 'all' || 
                (activeFilters.mediaType === 'moments' && m.type !== 'collection') ||
                (activeFilters.mediaType === 'journeys' && m.type === 'collection');

            return matchesSearch && matchesEmotion && matchesPeople && matchesTime && matchesFavorites && matchesType;
        }).sort((a, b) => {
            if (activeFilters.sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            
            const timeA = a.date === 'Synthesized' ? Infinity : new Date(a.date).getTime();
            const timeB = b.date === 'Synthesized' ? Infinity : new Date(b.date).getTime();
            
            if (activeFilters.sortBy === 'oldest') {
                return timeA - timeB;
            }
            return timeB - timeA;
        });
    }, [moments, journeys, activeFilters]);

    const toggleFilter = (type: 'emotion' | 'people' | 'time', value: string) => {
        setActiveFilters(prev => {
            const current = prev[type];
            const next = current.includes(value) 
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: next };
        });
    };

    const handleToggleFavorite = (m: Moment) => {
        const isJourney = m.type === 'collection';
        if (isJourney) {
            const originalJourney = journeys.find(j => j.id === m.id);
            if (originalJourney && onUpdateItem) onUpdateItem({ ...originalJourney, favorite: !originalJourney.favorite });
        } else {
            onUpdateMoment({ ...m, favorite: !m.favorite });
        }
    };

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 3));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));

    const handleStartWeave = async () => {
        if (selectedIds.size < 2) return;
        
        const executeWeave = async () => {
            setIsWeaving(true);
            try {
                const selectedMoments = moments.filter(m => selectedIds.has(m.id));
                const result = await mergeMomentsIntoJourney(selectedMoments, "Archive Holder", "A Woven Narrative");
                if (onCreateJourney) {
                    onCreateJourney(selectedMoments, result.title, result.story);
                }
                setIsSelectionMode(false);
                setSelectedIds(new Set());
            } catch (e) {
                console.error("Selection weave failed", e);
            } finally {
                setIsWeaving(false);
            }
        };

        triggerConfirmation(
            TOKEN_COSTS.JOURNAEY_WEAVING, 
            'JOURNAEY_WEAVING', 
            executeWeave, 
            `Weave these ${selectedIds.size} fragments into a continuous Journæy narrative?`, 
            "Weave Journæy"
        );
    };

    const hasAnyFilters = activeFilters.emotion.length > 0 || 
                         activeFilters.people.length > 0 || 
                         activeFilters.time.length > 0 ||
                         activeFilters.onlyFavorites || 
                         activeFilters.mediaType !== 'all' ||
                         activeFilters.sortBy !== 'newest' ||
                         activeFilters.search !== '';

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-700 ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'}`}>
            <div className={`sticky top-0 z-50 px-4 md:px-8 py-4 border-b transition-all duration-500 backdrop-blur-3xl ${isDark ? 'bg-[#050811]/70 border-white/5' : 'bg-white/80 border-stone-200 shadow-sm'}`}>
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-md h-11">
                            {[
                                { id: 'grid', icon: LayoutGrid },
                                { id: 'story', icon: History },
                                { id: 'atlas', icon: MapIcon }
                            ].map((mode) => (
                                <button 
                                    key={mode.id}
                                    onClick={() => setViewMode(mode.id as ViewMode)} 
                                    className={`w-11 sm:w-12 rounded-xl transition-all duration-500 flex items-center justify-center relative
                                        ${viewMode === mode.id 
                                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-100' 
                                            : 'text-slate-500 hover:text-white hover:bg-white/5 active:scale-95'}
                                    `}
                                >
                                    <mode.icon size={18} />
                                </button>
                            ))}
                        </div>

                        {viewMode === 'grid' && (
                            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-md hidden lg:flex h-11 items-center">
                                <button 
                                    onClick={handleZoomOut} 
                                    disabled={zoomLevel === 0}
                                    className="w-10 h-full rounded-xl transition-all duration-300 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-20 active:scale-90"
                                >
                                    <ZoomOut size={16} />
                                </button>
                                <div className="w-px h-4 bg-white/10 mx-0.5"></div>
                                <button 
                                    onClick={handleZoomIn} 
                                    disabled={zoomLevel === 3}
                                    className="w-10 h-full rounded-xl transition-all duration-300 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-20 active:scale-90"
                                >
                                    <ZoomIn size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow max-w-xl relative group h-11">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none z-10">
                            {isSearchFocused || activeFilters.search ? <Bot size={20} className="text-cyan-400 animate-pulse" /> : <Search className="w-4 h-4 text-slate-500" />}
                        </div>
                        <input 
                            type="text"
                            value={activeFilters.search}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, search: e.target.value }))}
                            placeholder="Find a fragment of your life..."
                            className={`w-full h-full pl-12 pr-12 rounded-2xl border transition-all text-[11px] font-bold uppercase tracking-widest outline-none ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500/40 focus:bg-cyan-500/[0.03]' : 'bg-stone-50 border-stone-100 text-stone-900 focus:border-cyan-500/30'}`}
                        />
                    </div>

                    <div className="flex items-center gap-2 h-11">
                        <div className="relative h-11" ref={filterMenuRef}>
                            <button 
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} 
                                className={`w-11 h-11 rounded-2xl border transition-all duration-500 flex items-center justify-center relative cursor-pointer active:scale-95
                                    ${isFilterMenuOpen || hasAnyFilters 
                                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/20'}`}
                            >
                                <SlidersHorizontal size={18} />
                                {hasAnyFilters && <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></span>}
                            </button>
                            {isFilterMenuOpen && (
                                <div className="absolute top-full right-0 mt-3 w-80 bg-[#0B101B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-3xl animate-fade-in-up z-[100] max-h-[80vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Scope</h3>
                                        {hasAnyFilters && <button onClick={() => setActiveFilters({ emotion: [], people: [], time: [], search: '', onlyFavorites: false, mediaType: 'all', sortBy: 'newest' })} className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase">Reset</button>}
                                    </div>
                                    <div className="space-y-8">
                                        {/* Media Type Filter */}
                                        <div>
                                            <p className="flex items-center gap-2 text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-3"><LayoutGrid size={10} /> Media Type</p>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { id: 'all', label: 'All', icon: Layers },
                                                    { id: 'moments', label: 'Moments', icon: ImageIcon },
                                                    { id: 'journeys', label: 'Journeys', icon: BookOpen }
                                                ].map(type => (
                                                    <button 
                                                        key={type.id} 
                                                        onClick={() => setActiveFilters(prev => ({ ...prev, mediaType: type.id as MediaTypeFilter }))} 
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 ${activeFilters.mediaType === type.id ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <type.icon size={10} />
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sort Options */}
                                        <div>
                                            <p className="flex items-center gap-2 text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-3"><ArrowUpAZ size={10} /> Sequence Order</p>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { id: 'newest', label: 'Newest', icon: Clock },
                                                    { id: 'oldest', label: 'Oldest', icon: History },
                                                    { id: 'title', label: 'A-Z', icon: FileText }
                                                ].map(opt => (
                                                    <button 
                                                        key={opt.id} 
                                                        onClick={() => setActiveFilters(prev => ({ ...prev, sortBy: opt.id as SortOption }))} 
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 ${activeFilters.sortBy === opt.id ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                                                    >
                                                        <opt.icon size={10} />
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Temporal Filter */}
                                        <div>
                                            <p className="flex items-center gap-2 text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-3"><Calendar size={10} /> Temporal Arcs</p>
                                            <div className="flex flex-wrap gap-2">
                                                {allYears.map(year => (
                                                    <button 
                                                        key={year} 
                                                        onClick={() => toggleFilter('time', year.toString())} 
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${activeFilters.time.includes(year.toString()) ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                                                    >
                                                        {year}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Spectrum Filter */}
                                        <div>
                                            <p className="flex items-center gap-2 text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-3"><Sparkles size={10} /> Emotional Spectrum</p>
                                            <div className="flex flex-wrap gap-2">
                                                {allEmotions.map(emotion => (
                                                    <button 
                                                        key={emotion} 
                                                        onClick={() => toggleFilter('emotion', emotion)} 
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all capitalize ${activeFilters.emotion.includes(emotion) ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                                                    >
                                                        {emotion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Node Filter */}
                                        <div>
                                            <p className="flex items-center gap-2 text-[8px] font-black uppercase text-white/40 tracking-[0.2em] mb-3"><Users size={10} /> Social Nodes</p>
                                            <div className="flex flex-wrap gap-2">
                                                {allPeople.map(person => (
                                                    <button 
                                                        key={person} 
                                                        onClick={() => toggleFilter('people', person)} 
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${activeFilters.people.includes(person) ? 'bg-purple-500 border-purple-400 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                                                    >
                                                        {person}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <button 
                                                onClick={() => setActiveFilters(prev => ({ ...prev, onlyFavorites: !prev.onlyFavorites }))}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${activeFilters.onlyFavorites ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-slate-500 hover:bg-white/5'}`}
                                            >
                                                <span className="text-[9px] font-black uppercase tracking-widest">Starred Only</span>
                                                <Heart size={14} fill={activeFilters.onlyFavorites ? "currentColor" : "none"} className={activeFilters.onlyFavorites ? "text-rose-500" : ""} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative h-11" ref={plusMenuRef}>
                            <button 
                                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} 
                                className={`w-11 h-11 rounded-2xl border transition-all duration-500 flex items-center justify-center relative cursor-pointer active:scale-95
                                    ${isPlusMenuOpen 
                                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/20'}`}
                            >
                                <Plus size={22} className={`transition-transform duration-500 ${isPlusMenuOpen ? 'rotate-45 scale-110' : 'group-hover:rotate-90'}`} />
                            </button>
                            {isPlusMenuOpen && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-[#0B101B]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 shadow-3xl animate-fade-in-up z-[100]">
                                    <div className="flex flex-col gap-1.5">
                                        <button onClick={() => { onNavigate(Page.Create); setIsPlusMenuOpen(false); }} className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-left">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform"><ImageIcon size={20} /></div>
                                            <div><p className="text-[10px] font-black uppercase tracking-widest text-white">New Moment</p><p className="text-[9px] text-slate-500 mt-1">Upload fragments</p></div>
                                        </button>
                                        <button onClick={() => { setIsSelectionMode(true); setSelectedIds(new Set()); setIsPlusMenuOpen(false); }} className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-left">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform"><Layers size={20} /></div>
                                            <div><p className="text-[10px] font-black uppercase tracking-widest text-white">Weave Journey</p><p className="text-[9px] text-slate-500 mt-1">Synthesize archive</p></div>
                                        </button>
                                        
                                        <button disabled className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 transition-all text-left cursor-not-allowed opacity-40">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5"><Lock size={18} /></div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Print Shop</p>
                                                    <span className="bg-amber-500/20 text-amber-500 text-[7px] px-1.5 py-0.5 rounded border border-amber-500/20 font-black tracking-tighter">SOON</span>
                                                </div>
                                                <p className="text-[9px] text-slate-600 mt-1 italic">Physical artifacts after beta</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow relative overflow-hidden flex flex-col">
                {viewMode === 'atlas' ? (
                    <div className="flex-grow relative"><WorldMapPage moments={moments} onNavigate={onNavigate} userTier={userTier} triggerConfirmation={triggerConfirmation} onSelectMoment={onSelectMoment} /></div>
                ) : viewMode === 'story' ? (
                    <div className="flex-grow overflow-y-auto custom-scrollbar"><TimelineView moments={combinedArchive} onNavigate={onNavigate} onUpdateMoment={onUpdateMoment} onDeleteMoment={onDeleteMoment} isSelectionMode={isSelectionMode} selectedIds={selectedIds} onToggleSelect={(id) => { const next = new Set(selectedIds); if (next.has(id)) next.delete(id); else next.add(id); setSelectedIds(next); }} onFavorite={handleToggleFavorite} onShare={setShareTarget} newMomentId={newMomentId} /></div>
                ) : (
                    <div className="flex-grow overflow-y-auto custom-scrollbar max-w-[1800px] mx-auto px-4 md:px-8 py-10 w-full">
                        <GridView moments={combinedArchive} zoomLevel={zoomLevel} onSelectMoment={(m) => { if (isSelectionMode) { const next = new Set(selectedIds); if (next.has(m.id)) next.delete(m.id); else next.add(m.id); setSelectedIds(next); } else onSelectMoment(m); }} isSelectionMode={isSelectionMode} selectedIds={selectedIds} onToggleSelect={(id) => { const next = new Set(selectedIds); if (next.has(id)) next.delete(id); else next.add(id); setSelectedIds(next); }} onFavorite={handleToggleFavorite} onShare={setShareTarget} onNavigate={onNavigate} newMomentId={newMomentId} />
                    </div>
                )}

                {/* Selection HUD */}
                {isSelectionMode && (
                    <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6 animate-fade-in-up">
                        <div className="bg-[#0A0C14]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 md:p-4 shadow-3xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 px-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                    <Layers size={18} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm tracking-tight">{selectedIds.size} Chapters Selected</p>
                                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Weaving Pipeline Ready</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}
                                    className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleStartWeave}
                                    disabled={selectedIds.size < 2 || isWeaving}
                                    className={`px-8 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center gap-3 shadow-xl
                                        ${selectedIds.size >= 2 ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                                    `}
                                >
                                    {isWeaving ? (
                                        <><Loader size={14} className="animate-spin" /> Synthesizing...</>
                                    ) : (
                                        <><Sparkles size={14} /> Weave Journæy</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MomentsPage;
