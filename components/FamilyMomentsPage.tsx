
import React, { useState, useMemo } from 'react';
import { Moment, Page, UserTier } from '../types';
import { 
    Plus, Search, Users, User, ArrowLeft, Heart, 
    MoreVertical, Share2, Filter, Grid, List, 
    Calendar, MapPin, Sparkles, UserPlus, UploadCloud, ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface FamilyMomentsPageProps {
    moments: Moment[];
    onSelectMoment: (moment: Moment) => void;
    onUpdateMoment: (moment: Moment) => void;
    userTier: UserTier;
    onNavigate: (page: Page) => void;
}

const FamilyMomentCard: React.FC<{ 
    moment: Moment; 
    onClick: () => void;
    onFavorite: (e: React.MouseEvent) => void;
    isDark: boolean;
}> = ({ moment, onClick, onFavorite, isDark }) => {
    const contributor = moment.createdBy || "Family";
    const initials = contributor.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2).toUpperCase();

    return (
        <div 
            onClick={onClick}
            className={`group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-sm hover:shadow-2xl active:scale-[0.98] animate-fade-in-up
                ${isDark ? 'bg-[#0a0a0a] border border-white/5' : 'bg-white border border-stone-100'}
            `}
        >
            <img 
                src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 600)} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110 brightness-[0.9] group-hover:brightness-100" 
                alt={moment.title} 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                <button 
                    onClick={onFavorite}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300
                        ${moment.favorite 
                            ? 'bg-cyan-500 text-white shadow-lg' 
                            : 'bg-black/30 text-white/70 opacity-0 group-hover:opacity-100 hover:text-white'}
                    `}
                >
                    <Heart size={14} fill={moment.favorite ? "currentColor" : "none"} />
                </button>

                <div className="w-8 h-8 rounded-full bg-indigo-600/90 backdrop-blur-md flex items-center justify-center border border-indigo-400/30 shadow-lg" title={`Shared by ${contributor}`}>
                    <span className="text-[10px] font-black text-white tracking-tighter">{initials}</span>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                <p className="text-[10px] font-normal text-white/60 mb-1 tracking-wider uppercase">
                    {moment.date}
                </p>
                <h3 className="text-[18px] font-medium text-white tracking-tight leading-tight line-clamp-2">
                    {moment.title}
                </h3>
            </div>
        </div>
    );
};

const FamilyMomentsPage: React.FC<FamilyMomentsPageProps> = ({ 
    moments, onSelectMoment, onUpdateMoment, userTier, onNavigate 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const members = useMemo(() => {
        // Fix: Explicitly type unique as string array by using a type predicate in filter to resolve unknown split error
        const unique = Array.from(new Set(moments.map(m => m.createdBy).filter((m): m is string => Boolean(m))));
        return unique.map((m: string) => ({
            name: m,
            initials: m.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }));
    }, [moments]);

    const filteredMoments = useMemo(() => {
        return moments.filter(m => {
            const matchesSearch = !searchQuery || 
                m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesMember = !selectedMember || m.createdBy === selectedMember;
            
            return matchesSearch && matchesMember;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [moments, selectedMember, searchQuery]);

    return (
        <div className={`min-h-screen transition-colors duration-1000 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#FAFAFA]'}`}>
            
            <header className={`sticky top-0 z-50 pt-12 pb-8 px-6 md:px-12 border-b transition-all duration-500 backdrop-blur-3xl ${isDark ? 'bg-[#0a0a0a]/80 border-white/5' : 'bg-white/80 border-stone-200'}`}>
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                        <div className="space-y-4">
                            <button onClick={() => onNavigate(Page.House)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Back to House
                            </button>
                            <h1 className="text-4xl md:text-6xl font-brand font-bold text-white tracking-tighter leading-none">
                                Collective <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-400">Archive.</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="DEEP SEARCH FRAGMENTS..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[12px] text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] tracking-wide placeholder:text-white/20"
                                />
                            </div>
                            <button onClick={() => onNavigate(Page.Create)} className="h-11 px-6 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2">
                                <Plus size={14} /> Contribute
                            </button>
                        </div>
                    </div>

                    {/* Member Filter Strip */}
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                        <button 
                            onClick={() => setSelectedMember(null)}
                            className={`px-5 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${!selectedMember ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'}
                            `}
                        >
                            All Contributors
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-2"></div>
                        {members.map(m => (
                            <button 
                                key={m.name}
                                onClick={() => setSelectedMember(m.name)}
                                className={`flex items-center gap-3 px-4 h-10 rounded-full transition-all border whitespace-nowrap
                                    ${selectedMember === m.name ? 'bg-white/10 border-indigo-500 text-white' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/10 hover:text-white'}
                                `}
                            >
                                <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-[8px] font-black text-indigo-400 border border-indigo-500/30">
                                    {m.initials}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">{m.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 md:px-12 max-w-[1440px] py-16">
                {filteredMoments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                        {filteredMoments.map((moment) => (
                            <FamilyMomentCard 
                                key={moment.id} 
                                moment={moment} 
                                isDark={isDark} 
                                onClick={() => onSelectMoment(moment)}
                                onFavorite={(e) => {
                                    e.stopPropagation();
                                    onUpdateMoment({ ...moment, favorite: !moment.favorite });
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center text-center animate-fade-in">
                        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-8">
                            <Filter size={32} className="text-white/10" />
                        </div>
                        <h3 className="text-2xl font-brand font-bold text-white mb-2">Refine your search.</h3>
                        <p className="text-white/40 text-sm max-w-sm mx-auto mb-10 leading-relaxed italic font-serif">
                            "The specific frequency you are searching for is currently absent from this house context."
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FamilyMomentsPage;
