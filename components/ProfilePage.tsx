
import React, { useState } from 'react';
import { 
    User, CreditCard, Mic, Lock, 
    Zap, ShieldCheck, ArrowRight,
    Timer, Users, Building2,
    UserCircle, CheckCircle2, History,
    Settings, Volume2, Sparkles, Globe,
    ChevronRight, Plus
} from 'lucide-react';
import { Page, UserTier, CreditState, AeternyVoice } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from './PageHeader';
import TokenIcon from './icons/TokenIcon';

type SettingsTab = 'identity' | 'credits' | 'voice' | 'vision';

const TABS: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'credits', label: 'Credits', icon: Zap },
    { id: 'voice', label: 'Voice Profile', icon: Mic },
    { id: 'vision', label: 'Legacy Vision', icon: History },
];

const TIER_DATA: Record<UserTier, { label: string; color: string; bg: string; icon: any; desc: string }> = {
    'free': { label: 'Trial', color: 'text-slate-400', bg: 'bg-slate-400/10', icon: Timer, desc: 'Evaluation access' },
    'essæntial': { label: 'Essential', color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: User, desc: 'Personal vault' },
    'fæmily': { label: 'Family', color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: Users, desc: 'Shared house' },
    'fæmily_plus': { label: 'Family Plus', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Building2, desc: 'Dynasty archive' },
    'lægacy': { label: 'Lægacy', color: 'text-[#B87D4B]', bg: 'bg-[#B87D4B]/10', icon: ShieldCheck, desc: 'Permanent protection' },
};

const ProfilePage: React.FC<any> = (props) => {
    const { profilePic, onNavigate, userTier, theme, aeternyVoice, setAeternyVoice, creditState } = props;
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('identity');
    const isDark = theme === 'dark';
    
    const cardClass = `rounded-[2.5rem] p-8 md:p-12 border backdrop-blur-xl transition-all duration-500 shadow-2xl ${
        isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-stone-200'
    }`;
    
    const currentTier = TIER_DATA[userTier as UserTier] || TIER_DATA['essæntial'];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811] text-white' : 'bg-[#FDFBF7] text-stone-900'} pt-24 pb-40 font-sans`}>
            <PageHeader title="Account Space" onBack={() => onNavigate(Page.Home)} />
            
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                {/* User Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in pt-8">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#050811] shadow-3xl">
                            {profilePic ? (
                                <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <UserCircle size={64} className="text-slate-600" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-grow space-y-2">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-brand font-black tracking-tighter leading-none mb-2">
                                    {user?.displayName || 'Archive Holder'}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${currentTier.color} ${currentTier.bg} px-6 py-1.5 rounded-full border border-current`}>
                                        {currentTier.label} Plan
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Globe size={12}/> EU Vault-Silo: Alpha-7
                                    </span>
                                </div>
                            </div>
                            
                            {/* Archive Endowment Entry Point */}
                            <button 
                                onClick={() => onNavigate(Page.Subscription)}
                                className="group bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 px-6 py-4 rounded-3xl transition-all flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                    <Building2 size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Archive Endowment</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Manage Subscription & Billing</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-700 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-12 p-1.5 bg-black/20 rounded-[2rem] border border-white/5 backdrop-blur-md">
                    {TABS.map((tab) => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${activeTab === tab.id ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Active Content Area */}
                <div className="animate-fade-in-up">
                    {activeTab === 'identity' && (
                        <div className={cardClass}>
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-bold font-brand flex items-center gap-3">
                                    <UserCircle size={20} className="text-cyan-400" /> Identity Details
                                </h3>
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Edit Profile</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-4">Authorized Name</label>
                                    <div className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium">
                                        {user?.displayName || 'Not Set'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-4">Vault ID (Email)</label>
                                    <div className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium truncate">
                                        {user?.email || 'guest@aeternacy.me'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-12 p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-4">
                                <ShieldCheck size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-white uppercase tracking-wide">End-to-End Sovereignty</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed italic">"Your identity is cryptographically linked to your local private key. æternacy employees cannot access your raw media files."</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'credits' && (
                        <div className={cardClass}>
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <Zap size={20} className="text-amber-500" />
                                    <h3 className="text-xl font-bold font-brand text-white">Neural Reservoir</h3>
                                </div>
                                <button 
                                    onClick={() => onNavigate(Page.Subscription)}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    Refill Rules <ArrowRight size={14} />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-12 mb-12">
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Current Energy Balance</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-5xl font-bold font-brand text-white">{creditState.balance.toLocaleString()}</span>
                                            <TokenIcon className="w-6 h-6 text-amber-500" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-amber-500 shadow-[0_0_15px_#f59e0b] rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                            {creditState.monthlyAllocation.toLocaleString()} Credits / month allocation
                                        </p>
                                        <span className="text-[9px] font-black uppercase text-slate-700">Resets in 12 days</span>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-64 flex flex-col gap-3">
                                    <button 
                                        onClick={() => onNavigate(Page.Subscription)} 
                                        className="w-full py-5 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3"
                                    >
                                        <Plus size={16} /> Refill Reservoir
                                    </button>
                                    <button 
                                        onClick={() => onNavigate(Page.Subscription)}
                                        className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Building2 size={14} className="text-cyan-400" /> Archive Endowment
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Living Frames</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold font-brand text-white">{creditState.livingMomentsQuota.total - creditState.livingMomentsQuota.used}</span>
                                        <span className="text-[10px] font-black uppercase text-slate-700">Remanining</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Cloud Storage</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold font-brand text-white">{creditState.storageUsed} <span className="text-xs">GB</span></span>
                                        <span className="text-[10px] font-black uppercase text-slate-700">of {creditState.storageLimit} GB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'voice' && (
                        <div className={cardClass}>
                            <h3 className="text-xl font-bold font-brand mb-10 flex items-center gap-3">
                                <Volume2 size={20} className="text-indigo-400" /> Narrator Settings
                            </h3>
                            
                            <div className="space-y-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] mb-6 block">Default Presence</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {(['Sarah', 'David', 'Emma', 'James'] as AeternyVoice[]).map(voice => (
                                            <button 
                                                key={voice}
                                                onClick={() => setAeternyVoice(voice)}
                                                className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 group
                                                    ${aeternyVoice === voice ? 'bg-indigo-500/10 border-indigo-500/50 shadow-inner' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}
                                                `}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${aeternyVoice === voice ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                                                    <Mic size={20} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{voice}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/5">
                                    <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 group hover:bg-indigo-900/20 transition-all cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                                <Sparkles size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white tracking-tight">Vocal Signature™</h4>
                                                <p className="text-xs text-slate-500 italic font-serif leading-relaxed">"Record and clone your own voice for authentic legacy narration."</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 flex items-center gap-2">
                                            Calibrate Profile <ArrowRight size={14}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vision' && (
                        <div className="space-y-8">
                            <div className={cardClass}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-[#B87D4B]/10 rounded-xl flex items-center justify-center text-[#B87D4B] border border-[#B87D4B]/20">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold font-brand text-white">Legacy Concept</h3>
                                        <p className="text-[10px] font-black uppercase text-[#B87D4B] tracking-widest">Future Continuity</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-lg italic font-serif leading-relaxed mb-10 max-w-2xl">
                                    "Your digital story is an inheritance. The Succession Protocol ensures that your archive transitions to your verified kin if your neural pulse ever falls silent."
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                                        <CheckCircle2 size={16} className="text-[#B87D4B]" />
                                        <p className="text-sm font-bold text-white uppercase tracking-wide">Dead Man's Switch</p>
                                        <p className="text-[11px] text-slate-500">Automated handover after engagement silence.</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                                        <CheckCircle2 size={16} className="text-[#B87D4B]" />
                                        <p className="text-sm font-bold text-white uppercase tracking-wide">Locked Capsules</p>
                                        <p className="text-[11px] text-slate-500">Seal messages for specific future years.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onNavigate(Page.LegacyTeaser)} 
                                    className="px-10 py-5 bg-[#B87D4B] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#A66C3E] transition-all flex items-center gap-4"
                                >
                                    Explore Legacy Vision <ArrowRight size={16}/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Global Account Utility */}
                <div className="mt-12 flex justify-center items-center gap-12 opacity-30 grayscale hover:opacity-50 transition-all">
                    <div className="flex items-center gap-2"><Lock size={12} className="text-cyan-400"/><span className="text-[9px] font-black uppercase tracking-widest">AES-256 Sealed</span></div>
                    <div className="flex items-center gap-2"><Globe size={12} className="text-indigo-400"/><span className="text-[9px] font-black uppercase tracking-widest">GDPR Sovereign</span></div>
                    <div className="flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-400"/><span className="text-[9px] font-black uppercase tracking-widest">Client-Side Keys</span></div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
