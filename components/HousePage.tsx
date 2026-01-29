
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Page, UserTier, Moment } from '../types';
import { 
    Users, ArrowRight, Plus, ChevronDown, 
    History as HistoryIcon, Bot,
    Edit3, Settings2, UserPlus, GitFork, 
    Loader2, Building2, TreeDeciduous,
    ChevronRight, Settings, Layout, Globe, Star,
    Landmark, Check, X, Camera, Crown, Play, Trash2,
    ShieldCheck,
    MoreHorizontal,
    Activity,
    Layers,
    Sparkles,
    Library
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import InviteFamilyModal from './InviteFamilyModal';
import { ASSETS } from '../data/assets';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface HousePageProps {
    onNavigate: (page: Page) => void;
    userTier: UserTier;
    moments: Moment[];
    onSelectMoment: (moment: Moment) => void;
    familyName: string;
    onFamilyNameChange: (name: string) => void;
    familyHeaderImages: string[];
    onUpdateFamilyHeader: (urls: string[]) => void;
    userName: string;
    pendingAction?: string | null;
    onActionHandled?: () => void;
}

const SharedMomentPin: React.FC<{ moment: Moment; onClick: () => void; isDark: boolean }> = ({ moment, onClick, isDark }) => {
    return (
        <button 
            onClick={onClick} 
            className={`group relative text-left flex flex-col rounded-[2.5rem] transition-all duration-700 hover:-translate-y-2 animate-fade-in-up
                ${isDark ? 'bg-[#0B101B] shadow-2xl' : 'bg-white shadow-sm hover:shadow-xl'}
            `}
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.2rem] m-1.5">
                <img 
                    src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 600)} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" 
                    alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-2">{moment.date}</p>
                    <h3 className="text-lg font-bold text-white font-brand leading-tight tracking-tight line-clamp-1">{moment.title}</h3>
                </div>
            </div>
        </button>
    );
};

const HousePage: React.FC<HousePageProps> = (props) => {
    const { 
        onNavigate, moments, onSelectMoment, userTier, 
        familyName, onFamilyNameChange, familyHeaderImages, onUpdateFamilyHeader, userName,
        pendingAction, onActionHandled
    } = props;

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [isHouseMenuOpen, setIsHouseMenuOpen] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [tagline, setTagline] = useState("Where memories become legacy.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasActiveHouse, setHasActiveHouse] = useState(userTier !== 'free');
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);

    const houseMenuRef = useRef<HTMLDivElement>(null);

    // Deep-linking logic for guided intents
    useEffect(() => {
        if (pendingAction === 'OPEN_INVITE') {
            setShowInviteModal(true);
            onActionHandled?.();
        }
    }, [pendingAction, onActionHandled]);

    const members = useMemo(() => [
        { id: '1', name: userName, role: 'Custodian', initials: userName.substring(0, 2).toUpperCase(), image: ASSETS.AVATARS.MAN, isAdmin: true },
        { id: '2', name: 'Sarah Miller', role: 'Kin', initials: 'SM', image: ASSETS.AVATARS.WOMAN, isAdmin: false },
        { id: '3', name: 'Elder Eleanor', role: 'Ancestor', initials: 'EM', image: ASSETS.AVATARS.GRANDMOTHER, isAdmin: false }
    ], [userName]);

    const displayHeroImages = useMemo(() => 
        familyHeaderImages.length > 0 ? familyHeaderImages : ASSETS.FAMILY.HERO_SLIDES,
    [familyHeaderImages]);

    useEffect(() => {
        const poolSize = displayHeroImages.length;
        if (poolSize <= 1) return;
        const timer = setInterval(() => {
            setActiveHeroIndex(p => (p + 1) % poolSize);
        }, 8000);
        return () => clearInterval(timer);
    }, [displayHeroImages]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (houseMenuRef.current && !houseMenuRef.current.contains(e.target as Node)) {
                setIsHouseMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingIndex(index);
        
        // Simulating private vault processing
        await new Promise(r => setTimeout(r, 1000));
        
        try {
            const localUrl = URL.createObjectURL(file);
            const newImages = [...familyHeaderImages];
            if (index < newImages.length) {
                newImages[index] = localUrl;
            } else {
                newImages.push(localUrl);
            }
            onUpdateFamilyHeader(newImages);
        } catch (err) {
            console.error("Local processing failed", err);
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleFoundHouse = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 2000));
        setHasActiveHouse(true);
        setIsProcessing(false);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = familyHeaderImages.filter((_, i) => i !== index);
        onUpdateFamilyHeader(newImages);
    };

    const sharedMoments = useMemo(() => 
        moments.filter(m => m.isLegacy || m.collaborators?.length), 
    [moments]);

    if (!hasActiveHouse) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} animate-fade-in overflow-x-hidden`}>
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img src={ASSETS.FAMILY.HERO_SLIDES[1]} className="w-full h-full object-cover opacity-20 grayscale scale-110" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-transparent to-[#050811]"></div>
                    </div>
                    <div className="relative z-10 text-center px-8 animate-fade-in-up">
                        <div className="w-20 h-20 mx-auto mb-10 bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl">
                            {isProcessing ? <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /> : <Building2 className="w-10 h-10 text-indigo-500" />}
                        </div>
                        <h1 className="font-brand font-bold text-5xl md:text-8xl text-white tracking-tighter leading-none mb-8">
                            Your Legacy <br/><span className="text-indigo-400">Demands a Home.</span>
                        </h1>
                        {!isProcessing && (
                            <button onClick={handleFoundHouse} className="bg-white text-stone-950 font-black px-12 py-6 rounded-full text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-4">
                                <Plus size={18} strokeWidth={3} /> Start Family Space
                            </button>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-1000 overflow-x-hidden`}>
            
            <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex flex-col justify-center">
                {displayHeroImages.map((url, index) => (
                    <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-[2500ms] ${
                            index === activeHeroIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img 
                            src={getOptimizedUrl(url, 1920)} 
                            className={`absolute inset-0 w-full h-full object-cover brightness-[0.7] ${
                                index === activeHeroIndex ? 'animate-ken-burns-slow' : ''
                            }`} 
                            alt="" 
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050811] z-10"></div>
                
                <div className="absolute top-8 right-8 z-30">
                    <button 
                        onClick={() => setIsAdminPanelOpen(true)}
                        className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95 shadow-2xl"
                        title="House Settings"
                    >
                        <Settings2 size={20} />
                    </button>
                </div>

                <div className="relative z-20 px-8 md:px-24 -mt-12">
                    <div className="max-w-5xl animate-fade-in-up">
                        <div className="relative mb-6 md:mb-10" ref={houseMenuRef}>
                            <button 
                                onClick={() => setIsHouseMenuOpen(!isHouseMenuOpen)}
                                className="bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 transition-all hover:bg-white/10 active:scale-95 shadow-2xl"
                            >
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.6)]"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">House of {familyName}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isHouseMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isHouseMenuOpen && (
                                <div className="absolute top-full left-0 mt-4 w-72 bg-[#0A0C14]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-5 shadow-3xl animate-fade-in-up z-[100] text-left">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-3 px-4">Active Lineages</p>
                                            <div className="space-y-1">
                                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner"><Landmark size={14}/></div>
                                                        House {familyName}
                                                    </div>
                                                    <Check size={14} className="text-indigo-500" />
                                                </button>
                                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 text-xs font-bold text-slate-500 transition-all group">
                                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-700 group-hover:text-slate-300 transition-colors"><Building2 size={14}/></div>
                                                    House Sterling
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-[6.5rem] font-brand font-bold text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-3xl max-w-4xl">
                            Welcome to the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">{familyName}</span> Family.
                        </h1>

                        <p className="font-serif italic text-lg md:text-2xl text-white/80 max-w-2xl leading-relaxed mb-12 drop-shadow-xl">
                            "{tagline}"
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                            <button 
                                onClick={() => onNavigate(Page.FamilyStoryline)} 
                                className="w-full sm:w-auto bg-white text-stone-950 font-black px-12 py-5 rounded-full text-xs md:text-sm uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 active:scale-95"
                            >
                                <HistoryIcon size={18} strokeWidth={2.5}/> Relive Storyline
                            </button>
                            
                            <button 
                                onClick={() => onNavigate(Page.FamilyTree)} 
                                className="w-full sm:w-auto text-white font-bold text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-indigo-400 transition-colors group py-3 sm:py-0"
                            >
                                Family tree <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl relative z-20 space-y-32 -mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <button 
                        onClick={() => onNavigate(Page.FamilyMoments)}
                        className="p-10 rounded-[3rem] bg-white/[0.02] backdrop-blur-[100px] border border-white/10 group hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all duration-700 text-left flex flex-col justify-between h-64 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500/5 blur-[100px] rounded-full group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
                        <div className="relative z-10">
                             <div className="w-12 h-12 rounded-[1.2rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 ring-1 ring-cyan-500/30 mb-6 group-hover:scale-110 transition-transform">
                                <Library size={24} />
                            </div>
                            <h3 className="text-2xl font-bold font-brand text-white mb-2 tracking-tighter">Family Archive</h3>
                            <p className="text-slate-500 text-xs font-serif italic max-w-[180px]">"Deep repository of every fragment contributed."</p>
                        </div>
                        <div className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-3 group-hover:translate-x-2 transition-transform relative z-10">
                            Deep Search <ArrowRight size={14}/>
                        </div>
                    </button>

                    <button 
                        onClick={() => onNavigate(Page.Housekeepers)}
                        className="p-10 rounded-[3rem] bg-white/[0.02] backdrop-blur-[100px] border border-white/10 group hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all duration-700 text-left flex flex-col justify-between h-64 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold font-brand text-white mb-2 tracking-tighter">House Keepers</h3>
                            <div className="flex -space-x-2.5 mt-4 mb-4">
                                {members.slice(0, 4).map((member) => (
                                    <div key={member.id} className="w-9 h-9 rounded-xl border-2 border-[#0B101B] bg-slate-800 overflow-hidden shadow-lg">
                                        {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white">{member.initials}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-3 group-hover:translate-x-2 transition-transform relative z-10">
                            Manage Kin <ArrowRight size={14}/>
                        </div>
                    </button>

                    <button 
                        onClick={() => onNavigate(Page.FamilyInsight)}
                        className="p-10 rounded-[3rem] bg-white/[0.02] backdrop-blur-[100px] border border-white/10 group hover:border-purple-500/40 hover:bg-white/[0.04] transition-all duration-700 text-left flex flex-col justify-between h-64 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-all duration-1000"></div>
                        <div className="relative z-10">
                             <div className="w-12 h-12 rounded-[1.2rem] bg-purple-500/10 flex items-center justify-center text-purple-400 ring-1 ring-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-2xl font-bold font-brand text-white mb-2 tracking-tighter">Insights</h3>
                            <p className="text-slate-500 text-xs font-serif italic max-w-[180px]">"Collective neural mapping."</p>
                        </div>
                        <div className="text-purple-400 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-3 group-hover:translate-x-2 transition-transform relative z-10">
                            View Pulse <ArrowRight size={14}/>
                        </div>
                    </button>

                    <div className="p-10 rounded-[3rem] bg-white/[0.02] backdrop-blur-[100px] border border-white/5 flex flex-col justify-center h-64 relative overflow-hidden shadow-2xl group">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]"></div>
                         <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">æterny reflection</p>
                         </div>
                         <p className="text-lg italic text-slate-300 leading-relaxed font-serif relative z-10 pr-4">
                            "The house has woven 4 new legacy threads."
                         </p>
                    </div>
                </div>

                <section className="pt-12 pb-24">
                    <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-8">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Vault Peaks</h2>
                            <h3 className="text-4xl font-brand font-bold text-white">Collective Chapters.</h3>
                        </div>
                        <button onClick={() => onNavigate(Page.FamilyMoments)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-3">
                            Full Shared Archive <ArrowRight size={14}/>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {sharedMoments.length > 0 ? (
                            sharedMoments.slice(0, 4).map(m => (
                                <SharedMomentPin key={m.id} moment={m} isDark={isDark} onClick={() => onSelectMoment(m)} />
                            ))
                        ) : (
                            moments.slice(0, 4).map(m => (
                                <SharedMomentPin key={m.id} moment={m} isDark={isDark} onClick={() => onSelectMoment(m)} />
                            ))
                        )}
                    </div>
                </section>
            </div>

            <div 
                className={`fixed inset-0 z-[100000] transition-opacity duration-700 pointer-events-none ${isAdminPanelOpen ? 'opacity-100 pointer-events-auto bg-black/80 backdrop-blur-sm' : 'opacity-0'}`}
                onClick={() => setIsAdminPanelOpen(false)}
            >
                <div 
                    className={`absolute top-0 right-0 bottom-0 w-full md:w-[550px] bg-[#0A0C14] border-l border-white/10 shadow-3xl p-8 md:p-12 transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto custom-scrollbar ${isAdminPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-16">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                <Settings size={22} />
                            </div>
                            <h2 className="text-2xl font-bold font-brand text-white">House Identity</h2>
                        </div>
                        <button onClick={() => setIsAdminPanelOpen(false)} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={28}/></button>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Archive Identity</label>
                            <div className="relative group">
                                <input 
                                    value={familyName}
                                    onChange={(e) => onFamilyNameChange(e.target.value)}
                                    placeholder="Family Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl font-bold text-white outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                                />
                                <Edit3 size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Family Tagline</label>
                            <div className="relative group">
                                <textarea 
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-serif italic text-slate-400 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none shadow-inner"
                                />
                                <Edit3 size={18} className="absolute right-6 top-6 text-slate-600" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Hero Slider Artifacts (Max 5)</label>
                                <span className="text-[10px] font-mono text-indigo-400 font-bold">{familyHeaderImages.length} / 5</span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(5)].map((_, idx) => {
                                    const image = familyHeaderImages[idx];
                                    const isUploading = uploadingIndex === idx;

                                    return (
                                        <div 
                                            key={idx} 
                                            className={`relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group cursor-pointer shadow-xl bg-white/5 transition-all hover:border-indigo-500/30 ${!image ? 'border-dashed' : ''}`}
                                            onClick={() => !isUploading && document.getElementById(`house-upload-${idx}`)?.click()}
                                        >
                                            {image ? (
                                                <>
                                                    <img src={getOptimizedUrl(image, 400)} className="w-full h-full object-cover brightness-[0.7]" alt="" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                                        <Edit3 size={24} className="text-white" />
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    {isUploading ? <Loader2 size={24} className="animate-spin text-indigo-500" /> : <Camera size={24} className="text-slate-600" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 mt-2">{isUploading ? 'Securing...' : 'Add Slot'}</span>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                id={`house-upload-${idx}`} 
                                                className="hidden" 
                                                accept="image/*" 
                                                onChange={(e) => handleFileUpload(e, idx)} 
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-xs font-bold text-white mb-8 uppercase tracking-[0.2em] flex items-center justify-between">
                                Verified Keepers
                                <span className="text-[9px] text-slate-600 font-black">{members.length} / 6 Seats</span>
                            </h3>
                            <div className="space-y-3">
                                {members.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[11px] font-bold text-white border border-white/5 shadow-lg group-hover:scale-105 transition-transform">
                                                {member.image ? <img src={member.image} className="w-full h-full object-cover rounded-xl" /> : member.initials}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-white block">{member.name}</span>
                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{member.isAdmin ? 'House Keeper' : 'Kin Member'}</span>
                                            </div>
                                        </div>
                                        {member.isAdmin ? <Crown size={16} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" /> : <button className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Promote</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20">
                        <button onClick={() => setIsAdminPanelOpen(false)} className="w-full py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl shadow-3xl transition-all hover:scale-[1.01] active:scale-95">Save Identity</button>
                    </div>
                </div>
            </div>

            {showInviteModal && <InviteFamilyModal onClose={() => setShowInviteModal(false)} />}
        </div>
    );
};

export default HousePage;
