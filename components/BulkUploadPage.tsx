import React, { useState, useMemo } from 'react';
import { Page, UserTier, TokenState } from '../types';
import { 
    UploadCloud, Sparkles, ShieldCheck, BrainCircuit, Loader2, 
    Zap, AlertTriangle, Crown, History, Database, ArrowRight,
    Search, Filter, HardDrive, Cpu, CheckCircle2, ChevronRight,
    Film, ImageIcon, Info, Landmark, Users, Check
} from 'lucide-react';
import { TOKEN_COSTS } from '../services/costCatalog';
import PageHeader from './PageHeader';
import TokenIcon from './icons/TokenIcon';
import { ASSETS } from '../data/assets';
import { getOptimizedUrl } from '../services/cloudinaryService';

interface BulkUploadPageProps {
  onNavigate: (page: Page) => void;
  userTier: UserTier;
  triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string | React.ReactNode, title?: string) => void;
  tokenState: TokenState;
}

const missions = [
    { 
        id: 'epoch', 
        name: 'The Personal Epoch', 
        capacity: '100 GB', 
        price: '€149', 
        costTokens: 15000,
        icon: History,
        desc: "Ideal for a decade of one person's digital history." 
    },
    { 
        id: 'foundation', 
        name: 'The Household Foundation', 
        capacity: '500 GB', 
        price: '€349', 
        costTokens: 35000,
        icon: Users,
        popular: true,
        desc: "Perfect for nuclear families with multiple device archives." 
    },
    { 
        id: 'dynasty', 
        name: 'The Dynasty Ingestion', 
        capacity: '2 TB', 
        price: '€799', 
        costTokens: 80000,
        icon: Landmark,
        desc: "Massive hard drive backups and ancestral media reclamation." 
    }
];

const BulkUploadPage: React.FC<BulkUploadPageProps> = ({ onNavigate, userTier, triggerConfirmation, tokenState }) => {
    const [step, setStep] = useState<'intro' | 'select' | 'uploading'>('intro');
    const [selectedMissionId, setSelectedMissionId] = useState<string>('foundation');

    const selectedMission = useMemo(() => 
        missions.find(m => m.id === selectedMissionId) || missions[1], 
    [selectedMissionId]);

    const isLægacy = userTier === 'lægacy';
    const canAfford = isLægacy || tokenState.balance >= selectedMission.costTokens;

    const handleBack = () => {
        if (step === 'select') setStep('intro');
        else onNavigate(Page.Curate);
    };

    const handleInitiateRescue = () => {
        const msg = (
            <div className="space-y-4">
                <p>"I am ready to initiate '{selectedMission.name}'. This mission will ingest up to {selectedMission.capacity} of raw history, transcribing every video and stabilizing the emotional peaks."</p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Neural Energy Required</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-amber-500 font-mono">{selectedMission.costTokens.toLocaleString()}</span>
                        <TokenIcon className="w-5 h-5 text-amber-500" />
                    </div>
                </div>
            </div>
        );

        triggerConfirmation(
            isLægacy ? 0 : selectedMission.costTokens, 
            'BULK_RESCUE', 
            async () => {
                setStep('uploading');
                await new Promise(r => setTimeout(r, 6000));
                onNavigate(Page.BulkUploadReview);
            }, 
            msg,
            "Initiate Archive Rescue™"
        );
    };

    if (step === 'uploading') {
        return (
            <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center text-center p-6">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center animate-spin-slow">
                        <Database className="text-cyan-400 w-12 h-12 -rotate-45" />
                    </div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white animate-spin" />
                </div>
                <h2 className="text-4xl font-bold font-brand text-white mb-4 tracking-tighter">Rescuing {selectedMission.capacity} Archive...</h2>
                <p className="text-slate-400 max-w-sm mx-auto leading-relaxed font-serif italic text-lg">
                    "I am mapping your family architecture, extracting keyframes, and transcribing spoken history."
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050811] text-slate-200 selection:bg-cyan-500/30">
            {/* Fixed: Removed invalid subtitle prop from PageHeader */}
            <PageHeader 
                title="Archive Rescue™" 
                backLabel="STUDIO"
                onBack={handleBack} 
            />

            {step === 'intro' ? (
                <main className="container mx-auto px-6 pt-40 pb-40 max-w-6xl animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <Crown size={12} className="animate-pulse" /> Masterpiece Protocol
                                </div>
                                <h1 className="text-6xl md:text-8xl font-brand font-bold text-white tracking-tighter leading-[0.85]">
                                    Chaos to <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">Dynasty.</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-400 font-serif italic leading-relaxed max-w-xl">
                                    "Hand me your hard drives and scattered folders. I will spend the next few hours turning thousands of files into a narrated, searchable legacy."
                                </p>
                            </div>
                            <button 
                                onClick={() => setStep('select')}
                                className="h-16 px-12 bg-white text-black font-black rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
                            >
                                Initiate Mission Selection <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="hidden lg:block w-96 relative">
                            <img src={getOptimizedUrl(ASSETS.SHOP.BULK_UPLOAD, 1200)} className="rounded-[3rem] border border-white/10 shadow-3xl grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-[3s]" />
                        </div>
                    </div>
                </main>
            ) : (
                <main className="container mx-auto px-6 pt-40 pb-40 max-w-5xl animate-fade-in">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-brand font-bold text-white tracking-tight">Mission Scale.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {missions.map(mission => (
                            <button 
                                key={mission.id}
                                onClick={() => setSelectedMissionId(mission.id)}
                                className={`relative p-8 rounded-[2.5rem] border text-left transition-all duration-500 flex flex-col group ${selectedMissionId === mission.id ? 'bg-white/[0.04] border-teal-500 shadow-2xl scale-[1.03]' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 ring-1 ${selectedMissionId === mission.id ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                                    <mission.icon size={28} />
                                </div>
                                <h4 className={`text-xl font-bold font-brand mb-2 ${selectedMissionId === mission.id ? 'text-white' : 'text-slate-400'}`}>{mission.name}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-serif italic mb-8">"{mission.desc}"</p>
                                
                                <div className="mt-auto space-y-4">
                                    <div className={`text-2xl font-bold font-brand ${selectedMissionId === mission.id ? 'text-white' : 'text-slate-500'}`}>{mission.price}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{mission.capacity} Vault</span>
                                        {selectedMissionId === mission.id && <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center"><Check size={14} className="text-white" strokeWidth={3} /></div>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-3xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Landmark size={20} className="text-indigo-400" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Archival Guarantee</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    "Every artifact is stored in its bit-perfect original state. Neural rescue includes action-peak detection and vocal mapping."
                                </p>
                            </div>
                            
                            <div className="w-full md:w-80 space-y-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processing Energy</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-amber-500 font-mono">{selectedMission.costTokens.toLocaleString()}</span>
                                        <TokenIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleInitiateRescue}
                                    disabled={!canAfford}
                                    className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 ${
                                        canAfford 
                                            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-900/40 transform hover:scale-[1.02]' 
                                            : 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed'
                                    }`}
                                >
                                    {canAfford ? (
                                        <> <Zap size={16} /> Initiate Reclamation </>
                                    ) : (
                                        "Insufficient Energy"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default BulkUploadPage;