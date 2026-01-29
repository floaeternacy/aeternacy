import React, { useState } from 'react';
import { Steward, StewardRole, UserTier, Page } from '../types';
import { 
    ArrowLeft, UserPlus, ShieldCheck, Mail, Video, Mic, FileText, Trash2, 
    Printer, Lock, ShieldAlert, CheckCircle2, Clock,
    AlertTriangle, ArrowRight, Save, History, Activity, Zap, Landmark,
    Loader2, Users, Sparkles
} from 'lucide-react';
import LegacyIcon from './icons/LegacyIcon';
import PageHeader from './PageHeader';

interface LegacyTrustPageProps {
  onBack: () => void;
  userTier: UserTier;
  onNavigate: (page: Page) => void;
  triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string) => void;
}

const initialStewards: Steward[] = [
  { id: '1', name: 'Jane Doe', email: 'jane.doe@eternal.me', role: 'Successor' },
  { id: '2', name: 'Alex Smith', email: 'alex.s@external.com', role: 'Guardian' },
];

const LegacyTrustPage: React.FC<LegacyTrustPageProps> = ({ onBack, userTier, onNavigate, triggerConfirmation }) => {
  const [stewards, setStewards] = useState<Steward[]>(initialStewards);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<StewardRole>('Guardian');

  // Protocol Config State
  const [inactivityWindow, setInactivityWindow] = useState(12); // months
  const [directive, setDirective] = useState<'full' | 'curated' | 'restricted'>('curated');
  const [isAutoDeleteEnabled, setIsAutoDeleteEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isLægacy = userTier === 'lægacy';

  const handleAddSteward = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newEmail) {
      const newSteward: Steward = {
        id: Date.now().toString(),
        name: newName,
        email: newEmail,
        role: newRole,
      };
      setStewards(prev => [...prev, newSteward]);
      setNewName('');
      setNewEmail('');
      setNewRole('Guardian');
      setIsAdding(false);
    }
  };

  const handleSaveProtocol = async () => {
      setIsSaving(true);
      await new Promise(r => setTimeout(r, 1500));
      setIsSaving(false);
  };

  const handleRemoveSteward = (id: string) => {
    setStewards(prev => prev.filter(steward => steward.id !== id));
  };
  
  const getRoleStyle = (role: StewardRole) => {
    switch (role) {
      case 'Successor': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Guardian': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Co-Curator': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!isLægacy) {
      return (
          <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-10 ring-1 ring-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15)]">
                  <Landmark size={48} className="text-amber-500" />
              </div>
              <h1 className="text-5xl font-bold font-brand tracking-tighter mb-6">Succession Requires <span className="text-amber-500">Lægacy.</span></h1>
              <p className="text-xl text-slate-400 max-w-xl mx-auto mb-12 font-serif italic">
                  "The automated transfer of a digital dynasty is a high-availability architectural guarantee. This protocol is reserved for foundational archive holders."
              </p>
              <div className="flex gap-4">
                  <button onClick={onBack} className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-all">Return</button>
                  <button onClick={() => onNavigate(Page.Subscription)} className="px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs shadow-2xl transition-all">Go Lægacy</button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200">
      <PageHeader 
        title="Protocol Control" 
        backLabel="STUDIO"
        onBack={onBack}
        actions={
            <button 
                onClick={handleSaveProtocol}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
            >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Sync Protocol</span>
            </button>
        }
      />
      
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-6xl animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-12">
            
            <div className="lg:col-span-8 space-y-8">
                
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-amber-500/20 p-10 relative overflow-hidden shadow-3xl">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="relative">
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                                <Activity size={32} className="animate-pulse" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_#22c55e]"></div>
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Succession Status</h2>
                            <h3 className="text-3xl font-bold font-brand text-white">Standby Protocol Active</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">Neural Pulse Window</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[6, 12, 24].map(m => (
                                        <button 
                                            key={m}
                                            onClick={() => setInactivityWindow(m)}
                                            className={`py-3 rounded-xl border font-bold text-xs transition-all ${inactivityWindow === m ? 'bg-amber-500 border-amber-400 text-black shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                                        >
                                            {m}m
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-3 italic leading-relaxed">Vault unlocks after {inactivityWindow} months of total engagement silence.</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">Archive Release Directive</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'curated', label: 'Curation Prime', desc: 'Only pinned & high-emotional artifacts.' },
                                        { id: 'full', label: 'Absolute Unlock', desc: 'Total access to every digital fragment.' },
                                        { id: 'restricted', label: 'Restricted Letter', desc: 'Only Time Capsules and pre-written letters.' }
                                    ].map(opt => (
                                        <button 
                                            key={opt.id}
                                            onClick={() => setDirective(opt.id as any)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all ${directive === opt.id ? 'bg-white/10 border-amber-500/50' : 'bg-white/2 border-white/5 text-slate-500'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-sm font-bold ${directive === opt.id ? 'text-white' : 'text-slate-400'}`}>{opt.label}</span>
                                                {directive === opt.id && <CheckCircle2 size={16} className="text-amber-500" />}
                                            </div>
                                            <p className="text-[10px] leading-relaxed opacity-60">{opt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between">
                            <div>
                                <ShieldAlert size={32} className="text-amber-500 mb-6" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Fail-Safe Directive</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-8">Choose the final state of your archive if the Protocol completes without a verified successor claiming the keys within 24 months of trigger.</p>
                                
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Deep Purge</p>
                                        <p className="text-[9px] text-slate-600">Delete entire vault on failure.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsAutoDeleteEnabled(!isAutoDeleteEnabled)}
                                        className={`w-10 h-6 rounded-full transition-all relative ${isAutoDeleteEnabled ? 'bg-red-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoDeleteEnabled ? 'left-5' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <Printer size={14} /> Download Charter PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold font-brand text-white flex items-center gap-4">
                            <Users size={24} className="text-indigo-400" /> Authorized Kinship
                        </h2>
                        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300 tracking-widest">
                            <Plus size={14} /> Add Steward
                        </button>
                    </div>

                    <div className="space-y-4">
                        {stewards.map(steward => (
                            <div key={steward.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-white/10">
                                        {steward.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{steward.name}</p>
                                        <p className="text-xs text-slate-500">{steward.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${getRoleStyle(steward.role)}`}>{steward.role}</span>
                                    <button onClick={() => handleRemoveSteward(steward.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {isAdding && (
                        <div className="mt-8 p-8 bg-black/40 rounded-[2rem] border border-cyan-500/20 animate-fade-in-up">
                             <form onSubmit={handleAddSteward} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Legal Name</label>
                                        <input value={newName} onChange={e => setNewName(e.target.value)} required className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email Destination</label>
                                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Access Tier</label>
                                    <select value={newRole} onChange={e => setNewRole(e.target.value as any)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white outline-none appearance-none">
                                        <option value="Successor">Successor (Primary Beneficiary)</option>
                                        <option value="Guardian">Guardian (View only, verification required)</option>
                                        <option value="Co-Curator">Co-Curator (Active collaboration)</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-500 hover:text-white">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl text-xs uppercase shadow-xl">Issue Access Key</button>
                                </div>
                             </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                
                <div className="bg-slate-900/80 rounded-[3rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                     <h2 className="text-xl font-bold font-brand text-white mb-6 flex items-center gap-3">
                        <History size={20} className="text-cyan-400" /> Posthumous Release
                     </h2>
                     <p className="text-sm text-slate-400 leading-relaxed mb-8">
                        The Succession Letter is the first artifact your Successor encounters. Record a final greeting to bridge the transition.
                     </p>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center gap-3 p-6 bg-white/2 border border-white/5 rounded-3xl hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all">
                            <Video className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Video</span>
                        </button>
                        <button className="flex flex-col items-center gap-3 p-6 bg-white/2 border border-white/5 rounded-3xl hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all">
                            <Mic className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Audio</span>
                        </button>
                     </div>
                     
                     <button className="w-full mt-4 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <FileText size={16} /> Write Sealed Note
                     </button>
                </div>

                <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <Lock size={14} /> Verification Protocol
                    </h4>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                            <p className="text-xs text-slate-400 leading-relaxed">Handover requires <strong>Verified Multi-Point Confirmation</strong> from at least one Successor and one Guardian.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                            <p className="text-xs text-slate-400 leading-relaxed">Successors cannot bypass the neural pulse window without a government-issued mortality record.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex items-start gap-4">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-[10px] text-amber-200/60 leading-relaxed font-medium">
                        The Legacy Protocol is a cryptographically binding charter. Once active, æternacy™ staff cannot reverse a validated succession event.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Plus = ({ size, className }: any) => <UserPlus size={size} className={className} />;

export default LegacyTrustPage;