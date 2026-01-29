
import React, { useState, useMemo } from 'react';
import { 
    Users, Heart, Mic, Sparkles, 
    ChevronRight, ArrowLeft, Plus, 
    ShieldCheck, Activity, Landmark,
    Fingerprint, Volume2, Search,
    X, Info, Star, History,
    UserPlus, Bot, Play, Filter
} from 'lucide-react';
import PageHeader from './PageHeader';
import { useTheme } from '../contexts/ThemeContext';
import { ASSETS } from '../data/assets';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { Page } from '../types';
import InviteFamilyModal from './InviteFamilyModal';

interface FamilyTreePageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

interface MemberNode {
  id: string;
  name: string;
  role: string;
  image: string;
  generation: number; // -1: Elders, 0: Current, 1: Descendants
  bio: string;
  birthYear: string;
  lifespan: string;
  contributionCount: number;
  vocalSignature: boolean;
  dominantEmotion: 'joy' | 'love' | 'adventure' | 'peace' | 'reflection';
}

const mockFamily: MemberNode[] = [
  { id: '5', name: 'Eleanor Sterling', role: 'Ancestor', image: ASSETS.AVATARS.GRANDMOTHER, generation: -1, bio: "The family's emotional anchor and a legendary pie baker.", birthYear: "1942", lifespan: "1942 - Present", contributionCount: 156, vocalSignature: true, dominantEmotion: 'love' },
  { id: '6', name: 'Arthur Sterling', role: 'Ancestor', image: ASSETS.AVATARS.GRANDFATHER, generation: -1, bio: "A retired engineer with a passion for woodworking and jazz.", birthYear: "1938", lifespan: "1938 - 2021", contributionCount: 89, vocalSignature: true, dominantEmotion: 'peace' },
  { id: '1', name: 'John Miller', role: 'Custodian', image: ASSETS.AVATARS.MAN, generation: 0, bio: "Documenting the family legacy for future generations.", birthYear: "1975", lifespan: "1975 - Present", contributionCount: 42, vocalSignature: true, dominantEmotion: 'reflection' },
  { id: '2', name: 'Sarah Miller', role: 'Kin', image: ASSETS.AVATARS.WOMAN, generation: 0, bio: "Passionate photographer and the light of our family.", birthYear: "1978", lifespan: "1978 - Present", contributionCount: 204, vocalSignature: false, dominantEmotion: 'joy' },
  { id: '3', name: 'Alex Miller', role: 'Descendant', image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400', generation: 1, bio: "Aspiring artist and lover of nature.", birthYear: "2010", lifespan: "2010 - Present", contributionCount: 12, vocalSignature: false, dominantEmotion: 'adventure' },
];

const FamilyTreePage: React.FC<FamilyTreePageProps> = ({ onBack, onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedId, setSelectedId] = useState<string>(mockFamily[2].id); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const selectedMember = useMemo(() => 
    mockFamily.find(m => m.id === selectedId) || mockFamily[0], 
  [selectedId]);

  const generations = [-1, 0, 1];

  const handleRelivePerspective = () => {
    // Intent: Navigate to Chronicle with a filter for this member's name
    onNavigate(Page.Chronicle);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} transition-colors duration-1000 pt-20 flex flex-col overflow-hidden`}>
      
      <PageHeader 
        title="Lineage Hub" 
        onBack={onBack}
        actions={
            <div className="flex items-center gap-3">
                 <div className="relative group hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search Lineage..."
                        className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest text-white outline-none focus:border-indigo-500/50 transition-all w-48"
                    />
                </div>
                <button 
                    onClick={() => setShowInviteModal(true)}
                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl transition-all active:scale-95"
                    aria-label="Add family member"
                >
                    <UserPlus size={18} />
                </button>
            </div>
        }
      />

      <div className="flex-grow flex flex-col lg:flex-row relative">
        
        {/* Constellation Canvas - Increased pt-36 to clear fixed header safely */}
        <div className="flex-grow relative overflow-y-auto custom-scrollbar flex flex-col items-center pt-36 pb-24 px-8 scroll-smooth">
            {/* Ambient Depth Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl space-y-48">
                {generations.map(gen => (
                    <div key={gen} className="relative">
                        {/* Generation Divider Label */}
                        <div className="flex items-center gap-8 mb-16 opacity-40">
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent to-slate-800"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 whitespace-nowrap">
                                {gen === -1 ? 'The Elders' : gen === 0 ? 'Foundation' : 'The Future'}
                            </span>
                            <div className="h-px flex-grow bg-gradient-to-l from-transparent to-slate-800"></div>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                            {mockFamily.filter(m => m.generation === gen).map(member => (
                                <button 
                                    key={member.id}
                                    onClick={() => setSelectedId(member.id)}
                                    className={`group flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] 
                                        ${selectedId === member.id ? 'scale-110 z-20' : 'hover:scale-105 opacity-40 hover:opacity-100 z-10'}
                                    `}
                                >
                                    <div className="relative">
                                        {/* Dynamic Halo Glow */}
                                        <div className={`absolute -inset-6 rounded-full blur-3xl transition-all duration-1000 opacity-0 group-hover:opacity-30 ${selectedId === member.id ? 'opacity-40 scale-125' : ''} bg-indigo-500`}></div>
                                        
                                        <div className={`w-32 h-32 md:w-44 md:h-44 rounded-[3.5rem] p-1.5 border-2 transition-all duration-1000 transform-gpu
                                            ${selectedId === member.id 
                                                ? 'border-indigo-400 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                                                : 'border-white/10 group-hover:border-white/30'
                                            }
                                        `}>
                                            <div className="w-full h-full rounded-[3rem] overflow-hidden bg-slate-900 shadow-inner">
                                                <img 
                                                    src={getOptimizedUrl(member.image, 600)} 
                                                    className={`w-full h-full object-cover transition-all duration-1000 
                                                        ${selectedId === member.id ? 'scale-100 grayscale-0' : 'scale-110 grayscale group-hover:grayscale-0'}
                                                    `} 
                                                    alt={member.name} 
                                                />
                                            </div>
                                        </div>

                                        {/* Vocal Tag Overlay */}
                                        {member.vocalSignature && (
                                            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#0B101B] rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl animate-fade-in">
                                                <Mic size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`mt-8 text-center transition-all duration-700 ${selectedId === member.id ? 'translate-y-2' : ''}`}>
                                        <div className="flex items-center justify-center gap-2">
                                            <p className={`text-lg font-bold font-brand tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{member.name}</p>
                                            <span className="text-[10px] font-black text-indigo-400/80">‘{member.birthYear.slice(-2)}</span>
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500/60 mt-1.5">{member.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- DYNAMIC DYNASTY CARD --- */}
        <div className={`w-full lg:w-[480px] flex-shrink-0 border-l ${isDark ? 'bg-[#07090F]/90 border-white/5' : 'bg-white border-stone-200'} backdrop-blur-3xl p-10 md:p-14 overflow-y-auto custom-scrollbar relative z-50 shadow-[-40px_0_100px_rgba(0,0,0,0.4)]`}>
            {selectedMember ? (
                <div className="animate-fade-in space-y-12 h-full flex flex-col">
                    
                    {/* Header: Visual Profile */}
                    <div className="space-y-8">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group shadow-3xl ring-1 ring-white/10">
                            <img src={getOptimizedUrl(selectedMember.image, 800)} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C14] via-[#0A0C14]/10 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 right-10">
                                 <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white`}>
                                        {selectedMember.lifespan}
                                    </span>
                                 </div>
                                 <h3 className="text-4xl md:text-5xl font-bold font-brand text-white tracking-tighter leading-tight">{selectedMember.name}</h3>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest block mb-2">Neural Weight</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold font-brand text-white">{selectedMember.contributionCount}</span>
                                    <span className="text-[10px] text-indigo-400 font-black uppercase">Chapters</span>
                                </div>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest block mb-2">Pulse Resonance</span>
                                <div className="flex items-center gap-2">
                                    <Activity size={16} className="text-cyan-400 animate-pulse" />
                                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Hi-Fi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Qualitative Data */}
                    <div className="space-y-10 flex-grow">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                                <Bot size={14} className="text-indigo-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Archival Persona</h4>
                            </div>
                            <p className="text-xl italic font-serif text-slate-300 leading-relaxed">
                                "{selectedMember.bio}"
                            </p>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                                <Volume2 size={14} className="text-cyan-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Aural Identity</h4>
                            </div>
                            
                            {selectedMember.vocalSignature ? (
                                <button className="w-full flex items-center justify-between p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 group hover:bg-cyan-500/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
                                            <Play size={20} fill="currentColor" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">Vocal Signature Active</p>
                                            <p className="text-[9px] text-cyan-500/60 font-black uppercase tracking-tighter">Calibrated 12.04.26</p>
                                        </div>
                                    </div>
                                    <Fingerprint size={20} className="text-cyan-500/40 group-hover:text-cyan-400" />
                                </button>
                            ) : (
                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center">
                                    <p className="text-xs text-slate-600 font-serif italic">"No vocal signature established for this node."</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Footer: Action */}
                    <div className="pt-10 mt-auto border-t border-white/5 mb-24 md:mb-12">
                        <button 
                            onClick={handleRelivePerspective}
                            className="w-full h-20 bg-white text-stone-950 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group"
                        >
                            <Filter size={18} strokeWidth={3} className="text-indigo-600" />
                            Relive Perspective <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                    <div className="w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-white/10 flex items-center justify-center mb-8">
                        <History size={40} className="text-slate-800" />
                    </div>
                    <h3 className="text-2xl font-bold font-brand text-slate-600 tracking-tighter mb-4">Select a Node</h3>
                    <p className="text-sm text-slate-700 font-serif italic max-w-[240px]">"Touch a portrait in the constellation to unearth their sovereign legacy."</p>
                </div>
            )}
        </div>
      </div>
      
      {showInviteModal && <InviteFamilyModal onClose={() => setShowInviteModal(false)} />}
    </div>
  );
};

export default FamilyTreePage;
