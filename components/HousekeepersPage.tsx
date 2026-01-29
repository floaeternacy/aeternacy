import React, { useState } from 'react';
import { Page, HouseMember, MemberRole } from '../types';
import { 
    Users, Shield, Landmark, User, Star, ArrowLeft, 
    X, Check, Zap, Lock, Download, Trash2, 
    Sparkles, MoreHorizontal, Settings, Activity,
    ShieldCheck, Fingerprint, Eye, EyeOff, Save,
    Compass, History, Globe, Plus, ChevronRight,
    BrainCircuit, BarChart3, Database
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import PageHeader from './PageHeader';

interface HousekeepersPageProps {
    onNavigate: (page: Page) => void;
    members: HouseMember[];
    onUpdateMember: (member: HouseMember) => void;
}

const ROLE_DATA: Record<MemberRole, { label: string; color: string; bg: string; icon: any; desc: string }> = {
    'Custodian': {
        label: 'Custodian', color: 'text-amber-500', bg: 'bg-amber-500/10',
        icon: Landmark, desc: 'Absolute vault authority and legal ownership.'
    },
    'House Keeper': {
        label: 'House Keeper', color: 'text-cyan-400', bg: 'bg-cyan-400/10',
        icon: ShieldCheck, desc: 'High-level administration and curation rights.'
    },
    'Kin': {
        label: 'Kin', color: 'text-indigo-400', bg: 'bg-indigo-400/10',
        icon: Users, desc: 'Standard contribution and viewing access.'
    },
    'Steward': {
        label: 'Steward', color: 'text-purple-400', bg: 'bg-purple-400/10',
        icon: History, desc: 'Designated successor for legacy inheritance.'
    }
};

const HousekeepersPage: React.FC<HousekeepersPageProps> = ({ onNavigate, members, onUpdateMember }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedMember, setSelectedMember] = useState<HouseMember | null>(null);

    const handleTogglePermission = (member: HouseMember, permission: keyof NonNullable<HouseMember['permissions']>) => {
        if (!member.permissions) return;
        const updated = {
            ...member,
            permissions: {
                ...member.permissions,
                [permission]: !member.permissions[permission]
            }
        };
        onUpdateMember(updated);
        setSelectedMember(updated);
    };

    const handleRoleChange = (member: HouseMember, newRole: MemberRole) => {
        const updated = { ...member, role: newRole };
        onUpdateMember(updated);
        setSelectedMember(updated);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} pt-32 pb-40`}>
            <PageHeader 
                title="Housekeepers Registry" 
                backLabel="HOUSE"
                onBack={() => onNavigate(Page.House)} 
            />

            <div className="container mx-auto px-6 max-w-7xl animate-fade-in mt-12">
                
                <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-8">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-8xl font-bold font-brand tracking-tighter leading-[0.9] mb-10">
                            The Registry of <br/> <span className="text-indigo-400">Guardians.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-serif italic leading-relaxed">
                            "Inheritance is more than data. Manage the roles and access rights of your kin to ensure the sequence of your house remains unbroken."
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {members.map((member) => {
                        const role = ROLE_DATA[member.role] || ROLE_DATA['Kin'];
                        return (
                            <button 
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className={`p-10 rounded-[3rem] border text-left transition-all duration-700 flex flex-col group relative overflow-hidden h-[480px]
                                    ${isDark ? 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10' : 'bg-white border-stone-200 shadow-xl hover:-translate-y-2'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className="relative">
                                        <div className={`absolute -inset-4 bg-gradient-to-tr ${member.role === 'Custodian' ? 'from-amber-500/20' : 'from-indigo-500/20'} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
                                        <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl relative">
                                            <img src={member.image} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className={`px-5 py-2 rounded-full ${role.bg} ${role.color} text-[10px] font-black uppercase tracking-widest border border-current shadow-inner`}>
                                        {role.label}
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <h3 className="text-3xl font-bold font-brand tracking-tighter text-white">{member.name}</h3>
                                    <p className="text-base text-slate-500 font-serif italic leading-relaxed">"{member.narrativeFocus || 'Kin Member'}"</p>
                                    
                                    <div className="flex flex-wrap gap-2 pt-6">
                                        {member.interests?.slice(0, 3).map(int => (
                                            <span key={int} className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">{int}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto flex justify-between items-end relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-3">Narrative Contribution</span>
                                        <div className="flex items-center gap-4">
                                            <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${member.contributionWeight}%` }} />
                                            </div>
                                            <span className="text-xs font-mono text-indigo-400 font-bold">{member.contributionWeight}%</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-all border border-white/5 group-hover:scale-110 active:scale-95">
                                        <Settings size={20} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    <button className="p-10 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-700 min-h-[480px]">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-3xl ring-1 ring-white/5">
                            <Plus size={40} className="text-slate-500 group-hover:text-indigo-400" />
                        </div>
                        <h4 className="text-2xl font-bold font-brand text-slate-400">Invite Kin</h4>
                        <p className="text-sm text-slate-600 mt-2 max-w-[200px] font-serif italic">Expand your lineage's archival coverage.</p>
                    </button>
                </div>
            </div>

            {/* MEMBER SOVEREIGNTY MATRIX OVERLAY */}
            {selectedMember && (
                <div 
                    className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in"
                    onClick={() => setSelectedMember(null)}
                >
                    <div 
                        className={`w-full max-w-5xl bg-[#0A0C14] border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-3xl overflow-y-auto max-h-[92vh] custom-scrollbar animate-fade-in-up relative`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedMember(null)} className="absolute top-10 right-10 p-4 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={32}/></button>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                            <div className="lg:col-span-4 text-center lg:text-left space-y-10">
                                <div className="relative inline-block">
                                    <div className="absolute -inset-6 bg-indigo-500/20 rounded-[4rem] blur-3xl animate-pulse"></div>
                                    <div className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-[3.5rem] overflow-hidden border-4 border-[#0A0C14] shadow-3xl mx-auto lg:mx-0">
                                        <img src={selectedMember.image} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-5xl font-bold font-brand text-white tracking-tighter leading-none mb-3">{selectedMember.name}</h2>
                                    <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.3em]">{selectedMember.role}</p>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-white/5">
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
                                        <div className="text-left">
                                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Archive Completion</p>
                                            <p className="text-2xl font-bold text-white font-mono">{selectedMember.contributionWeight}%</p>
                                        </div>
                                        <BarChart3 className="text-indigo-500 w-6 h-6" />
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
                                        <div className="text-left">
                                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Voice Linkage</p>
                                            <p className="text-base font-bold text-white uppercase tracking-tight">{selectedMember.vocalSignature ? 'Authenticated' : 'Offline'}</p>
                                        </div>
                                        <Fingerprint className={`${selectedMember.vocalSignature ? 'text-cyan-400' : 'text-slate-800'} w-6 h-6`} />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">
                                {/* Role Selection */}
                                <section>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-600 mb-8 flex items-center gap-4">
                                        <Landmark size={14} className="text-amber-500" /> Sovereignty Assignment
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {(Object.keys(ROLE_DATA) as MemberRole[]).map((r) => {
                                            const active = selectedMember.role === r;
                                            const roleInfo = ROLE_DATA[r];
                                            return (
                                                <button 
                                                    key={r}
                                                    onClick={() => handleRoleChange(selectedMember, r)}
                                                    className={`p-6 rounded-[2rem] border text-left transition-all group ${active ? 'bg-indigo-500/10 border-indigo-500/50 shadow-inner' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                                >
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className={`text-base font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{roleInfo.label}</span>
                                                        {active && <Check size={18} className="text-indigo-400" strokeWidth={3} />}
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed italic pr-4">"{roleInfo.desc}"</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Permission Matrix */}
                                <section>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-600 mb-8 flex items-center gap-4">
                                        <Lock size={14} className="text-cyan-500" /> Access Permissions
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'canUseAi', label: 'AI Synthesis Authority', icon: Sparkles, desc: 'Allow use of monthly compute energy for weaving and video reflections.' },
                                            { id: 'canSeePrivate', label: 'Private Archive Visibility', icon: Eye, desc: 'Access memories not yet merged into the collective house storyline.' },
                                            { id: 'canExport', label: 'Sovereign Export Rights', icon: Download, desc: 'Legal authority to download complete high-resolution legacy datasets.' },
                                            { id: 'canManageMembers', label: 'Registry Governance', icon: Settings, desc: 'Administrative ability to invite kin or modify membership roles.' }
                                        ].map((perm) => {
                                            const isChecked = selectedMember.permissions?.[perm.id as keyof NonNullable<HouseMember['permissions']>] || false;
                                            return (
                                                <div 
                                                    key={perm.id}
                                                    className="flex items-center justify-between p-7 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isChecked ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-900 border-white/5 text-slate-700'}`}>
                                                            <perm.icon size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-white leading-none mb-1.5">{perm.label}</p>
                                                            <p className="text-xs text-slate-500 italic font-serif">"{perm.desc}"</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleTogglePermission(selectedMember, perm.id as any)}
                                                        className={`relative w-14 h-7 rounded-full transition-all duration-500 ${isChecked ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                                    >
                                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-lg ${isChecked ? 'left-8' : 'left-1'}`} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
                                    <button 
                                        onClick={() => setSelectedMember(null)}
                                        className="flex-1 py-6 bg-white text-stone-950 font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-3xl transition-all transform hover:scale-[1.01] active:scale-95"
                                    >
                                        Synchronize Registry
                                    </button>
                                    <button className="px-10 py-6 bg-red-500/10 text-red-500 font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-red-500/20 transition-all active:scale-95">
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HousekeepersPage;