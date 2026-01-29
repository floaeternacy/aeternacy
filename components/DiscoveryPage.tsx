import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Page, Moment, Language } from '../types';
import { 
    Search, X, Sparkles, Loader2, ArrowRight, 
    Bot, BrainCircuit, Waves, History, 
    Compass, Zap, Command, LayoutGrid, Maximize2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { semanticSearch, SearchResult } from '../services/geminiService';
import PageHeader from './PageHeader';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface DiscoveryPageProps {
    moments: Moment[];
    onNavigate: (page: Page) => void;
    onSelectMoment: (moment: Moment) => void;
    language: Language;
}

const ResonantScanAnimation: React.FC = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[scan_3s_ease-in-out_infinite] blur-sm"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-aeterny-breathe"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] animate-aeterny-breathe" style={{ animationDelay: '2s' }}></div>
    </div>
);

const DiscoveryResultCard: React.FC<{ 
    res: SearchResult & { moment: Moment }, 
    onClick: () => void,
    index: number 
}> = ({ res, onClick, index }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    return (
        <button 
            onClick={onClick}
            className="group relative text-left flex flex-col rounded-[2.5rem] border overflow-hidden transition-all duration-700 hover:-translate-y-2 animate-fade-in-up
                bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900">
                <img 
                    src={getOptimizedUrl(res.moment.image || res.moment.images?.[0] || '', 600)} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                    alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/20 to-transparent opacity-80"></div>
                
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                        <History size={10} className="text-cyan-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">{res.moment.date}</span>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold font-brand text-white tracking-tighter leading-tight line-clamp-2 mb-2 group-hover:text-cyan-200 transition-colors">
                        {res.moment.title}
                    </h3>
                </div>
            </div>
            <div className="p-6 bg-black/20 flex-grow border-t border-white/5">
                <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                        <Bot size={16} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-cyan-500/60 tracking-widest mb-1">Resonance Context</p>
                        <p className="text-xs leading-relaxed italic font-serif text-slate-400 line-clamp-3">
                            "{res.reason}"
                        </p>
                    </div>
                </div>
            </div>
        </button>
    );
};

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ moments, onNavigate, onSelectMoment, language }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<(SearchResult & { moment: Moment })[]>([]);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const history = useMemo(() => {
        const saved = localStorage.getItem('aeternacy_search_history');
        return saved ? JSON.parse(saved) : ["Summers in the 90s", "Moments with Alex", "The feeling of peace"];
    }, []);

    const suggestions = [
        { label: "Temporal Arcs", prompt: "Show me my evolution through travel", icon: History },
        { label: "Emotional Peaks", prompt: "Find my most joyful celebrations", icon: Sparkles },
        { label: "Quiet Fragments", prompt: "Solo mornings with coffee", icon: Compass }
    ];

    const handleSearch = async (searchQuery: string = query) => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        setQuery(searchQuery);
        setAiSummary(null);
        
        try {
            const searchResults = await semanticSearch(searchQuery, moments);
            const enrichedResults = searchResults
                .map(res => ({
                    ...res,
                    moment: moments.find(m => m.id === res.id) as Moment
                }))
                .filter(r => r.moment);
            
            setResults(enrichedResults);
            
            if (enrichedResults.length > 0) {
                setAiSummary(`I have unearthed ${enrichedResults.length} fragments of your legacy that resonate with "${searchQuery}". They trace a narrative of ${enrichedResults[0].moment.emotion || 'meaningful connection'}.`);
            } else {
                setAiSummary("The archives are silent on this specific query. Shall we try approaching from a different emotional angle?");
            }

            // Save History
            const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
            localStorage.setItem('aeternacy_search_history', JSON.stringify(newHistory));

        } catch (err) {
            console.error("Discovery failed:", err);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-500 overflow-x-hidden`}>
            <PageHeader 
                title="Discovery" 
                onBack={() => onNavigate(Page.Home)}
            />

            {isSearching && <ResonantScanAnimation />}

            <main className="container mx-auto px-4 md:px-6 pt-36 md:pt-44 pb-40 max-w-7xl relative z-10">
                
                {/* 1. Integrated Search Hero */}
                <div className={`w-full max-w-3xl mx-auto mb-20 transition-all duration-700 ${results.length > 0 ? 'scale-95 opacity-80' : 'scale-100 opacity-100 mt-12'}`}>
                    <div className="relative group">
                        {/* Glowing ring around input when active */}
                        <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-cyan-500/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 ${isSearching ? 'opacity-100 animate-pulse' : ''}`}></div>
                        
                        <div className={`relative flex items-center p-2 rounded-[2.5rem] border-2 transition-all duration-500 
                            ${isDark ? 'bg-[#0B101B]/80 border-white/5 backdrop-blur-3xl' : 'bg-white border-stone-200 shadow-2xl'}
                            ${isSearching ? 'border-cyan-500/40' : 'focus-within:border-cyan-500/30'}
                        `}>
                            <div className="pl-6 pr-4">
                                {isSearching ? (
                                    <Loader2 size={24} className="text-cyan-400 animate-spin" />
                                ) : (
                                    <Bot size={28} className={`transition-colors ${query ? 'text-cyan-400' : 'text-slate-500'}`} />
                                )}
                            </div>
                            
                            <input 
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Speak to æterny... Find a vibe, a person, or a dream."
                                className={`flex-grow bg-transparent border-none py-6 text-xl md:text-2xl focus:ring-0 outline-none focus:outline-none font-medium ${isDark ? 'text-white' : 'text-stone-900'} placeholder:text-slate-700`}
                            />

                            {query && (
                                <button onClick={() => { setQuery(''); setResults([]); setAiSummary(null); }} className="p-3 text-slate-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            )}

                            <button 
                                onClick={() => handleSearch()}
                                disabled={!query.trim() || isSearching}
                                className={`ml-2 p-5 rounded-full transition-all transform active:scale-95 ${query.trim() ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105' : 'bg-slate-800 text-slate-600 opacity-50'}`}
                            >
                                <ArrowRight size={24} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Suggestions Layer */}
                        {!results.length && !isSearching && (
                            <div className="mt-12 space-y-10 animate-fade-in">
                                <div className="flex flex-col items-center gap-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Discovery Modes</p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {suggestions.map((s, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSearch(s.prompt)}
                                                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                                            >
                                                <s.icon size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {history.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {history.map((h, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSearch(h)}
                                                className="px-4 py-2 rounded-full border border-dashed border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                                            >
                                                {h}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Results Canvas */}
                {(results.length > 0 || isSearching) && (
                    <div className="animate-fade-in-up">
                        {/* æterny Summary Header */}
                        <div className="max-w-4xl mx-auto mb-16 text-center">
                            {isSearching ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 animate-pulse">Scanning frequencies...</p>
                                </div>
                            ) : aiSummary && (
                                <div className="space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                        <Bot size={24} />
                                    </div>
                                    <p className={`text-xl md:text-3xl font-serif italic leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        "{aiSummary}"
                                    </p>
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
                                </div>
                            )}
                        </div>

                        {/* Results Grid - Dynamic Living Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {results.map((res, i) => (
                                <DiscoveryResultCard 
                                    key={res.id} 
                                    res={res} 
                                    index={i} 
                                    onClick={() => onSelectMoment(res.moment)} 
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Empty State / Hint */}
                {!results.length && !isSearching && moments.length > 0 && (
                    <div className="mt-40 text-center opacity-20 group">
                        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                            <BrainCircuit size={40} className="text-slate-600" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">Deep Index Active</h4>
                        <p className="text-xs text-slate-600 mt-2">æterny is currently tracking {moments.length} artifacts for your discovery.</p>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes scan {
                    0% { top: -10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default DiscoveryPage;