
import React, { useState, useMemo } from 'react';
import { Page, UserTier } from '../types';
import { 
    Check, X, HardDrive, Sparkles, Users, Shield, 
    ChevronDown, Trash2, ArrowRight, Zap, Info, Landmark, Hourglass, ShieldCheck,
    Film, BrainCircuit, ShieldAlert, History, Globe, Lock, ImageIcon, CheckCircle2,
    User, Crown, Compass, Mic, BookOpen, CreditCard, Loader2
} from 'lucide-react';
import PageHeader from './PageHeader';
import BrandLogo from './BrandLogo';
import TokenIcon from './icons/TokenIcon';
import { TOKEN_PACKS, TokenPack } from '../services/billingService';

interface SubscriptionPageProps {
  onNavigate: (page: Page) => void;
  currentUserTier: UserTier;
  onSubscribe: (tier: UserTier) => void;
  onPurchaseTokens?: (amount: number) => void;
}

const COMPARISON_FEATURES = [
  { label: 'Photos & Videos', essential: '2,000', family: '8,000', plus: '15,000', legacy: 'Unlimited' },
  { label: 'Cloud Storage', essential: '75 GB', family: '300 GB', plus: '500 GB', legacy: 'Unlimited' },
  { label: 'Memory Energy', essential: '500 / mo', family: '2,500 / mo', plus: '10,000 / mo', legacy: '250,000 Base' },
  { label: 'House Members', essential: '1', family: '6', plus: '12', legacy: 'Unlimited' },
  { label: 'Collaborative Space', essential: '—', family: 'Full', plus: 'Full', legacy: 'Full' },
  { label: 'Priority Processing', essential: '—', family: '—', plus: 'Yes', legacy: 'Instant' },
  { label: 'Succession Framework', essential: 'Basic', family: 'Advanced', plus: 'Advanced', legacy: 'Legal Charter' },
];

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onNavigate, currentUserTier, onSubscribe, onPurchaseTokens }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isPurchasingToken, setIsPurchasingToken] = useState<TokenPack | null>(null);

  const tiers = useMemo(() => {
    const isYearly = billingCycle === 'yearly';
    return [
      {
        id: 'essæntial',
        name: 'ESSÆNTIAL',
        price: isYearly ? '7.49' : '8.99',
        totalYearly: '89.90',
        savings: '17.98',
        description: '"Securing the personal archive of a single individual."',
        cta: 'SELECT PLAN',
        features: [
          { text: '2,000 Artifact capacity', icon: ImageIcon },
          { text: '75 GB Secure Storage', icon: ShieldCheck },
          { text: '500 Memory Energy / mo', icon: TokenIcon, subtext: '2 Living Moments included' },
          { text: 'Personal Archive Access', icon: Users },
          { text: 'Permanent Vault Guarantee', icon: Shield }
        ],
        accent: 'border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)] hover:border-cyan-500/40',
        color: 'text-cyan-400',
        iconColor: 'text-cyan-400',
        popular: false
      },
      {
        id: 'fæmily',
        name: 'FÆMILY',
        price: isYearly ? '12.49' : '14.99',
        totalYearly: '149.90',
        savings: '29.98',
        description: '"Found your digital house and connect your kin."',
        cta: 'SELECT PLAN',
        popular: true,
        features: [
          { text: '8,000 Artifact capacity', icon: ImageIcon },
          { text: '300 GB Base Storage', icon: ShieldCheck },
          { text: '2,500 Memory Energy / mo', icon: TokenIcon, subtext: '10 Living Moments included' },
          { text: '6 Family Member Seats', icon: Users },
          { text: 'Full Family Home Access', icon: Landmark }
        ],
        accent: 'border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.15)] hover:border-indigo-500/60',
        color: 'text-indigo-400',
        iconColor: 'text-indigo-400',
      },
      {
        id: 'fæmily_plus',
        name: 'FÆMILY PLUS',
        price: isYearly ? '18.33' : '21.99',
        totalYearly: '219.90',
        savings: '43.98',
        description: '"The expansive framework for a growing dynasty."',
        cta: 'SELECT PLAN',
        features: [
          { text: '15,000 Artifact capacity', icon: ImageIcon },
          { text: '500 GB Secure Storage', icon: ShieldCheck },
          { text: '10,000 Memory Energy / mo', icon: TokenIcon, subtext: '25 Living Moments included' },
          { text: '12 Family Seats', icon: Users },
          { text: 'Vocal Signature Cloning', icon: Mic }
        ],
        accent: 'border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)] hover:border-purple-500/50',
        color: 'text-purple-400',
        iconColor: 'text-purple-400',
        popular: false
      },
      {
        id: 'lægacy',
        name: 'LÆGACY',
        price: isYearly ? '41.58' : '49.90',
        totalYearly: '499',
        savings: '99.80',
        description: '"Sovereign vaults for lineages that measure time in centuries."',
        cta: 'EXPLORE THE VISION',
        comingSoon: true,
        features: [
          { text: 'Unlimited Capacity', icon: ImageIcon },
          { text: 'Unlimited Secure Storage', icon: ShieldCheck },
          { text: '250,000 Base Energy Units', icon: TokenIcon },
          { text: 'Legal Succession Protocol', icon: ShieldCheck },
          { text: 'Annual Hardcover Book', icon: BookOpen }
        ],
        accent: 'border-[#B87D4B]/40 shadow-[0_0_60px_rgba(184,125,75,0.15)] hover:border-[#B87D4B]/60 shadow-[#B87D4B]/10',
        color: 'text-[#B87D4B]',
        iconColor: 'text-[#B87D4B]',
        popular: false
      }
    ];
  }, [billingCycle]);

  const handlePackPurchase = async (packId: TokenPack) => {
    if (!onPurchaseTokens) return;
    setIsPurchasingToken(packId);
    await new Promise(r => setTimeout(r, 1500)); // Simulated processing
    onPurchaseTokens(TOKEN_PACKS[packId].amount);
    setIsPurchasingToken(null);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white pt-24 pb-40 selection:bg-cyan-500/30 font-sans">
      <PageHeader 
        title="Archive Endowment" 
        onBack={() => onNavigate(Page.Landing)} 
      />

      <div className="container mx-auto px-6 max-w-7xl">
        <header className="text-center mb-16 animate-fade-in pt-12">
          <h1 className="text-5xl md:text-[6rem] font-bold font-brand tracking-tighter mb-8 leading-none">
            Found your <span className="text-cyan-400">Legacy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Archiving a life requires commitment and architectural stability. Select the foundation for your history."
          </p>
        </header>

        <div className="flex justify-center mb-20 animate-fade-in">
            <div className="bg-[#111111] p-1.5 rounded-full flex items-center border border-white/10 shadow-2xl">
                <button 
                    onClick={() => setBillingCycle('monthly')} 
                    className={`h-11 px-8 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${billingCycle === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    MONTHLY
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')} 
                    className={`h-11 px-8 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 ${billingCycle === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    YEARLY <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm ${billingCycle === 'yearly' ? 'bg-cyan-500 text-black' : 'bg-cyan-500/10 text-cyan-400'}`}>2 MONTHS FREE</span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 items-stretch">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              onClick={() => tier.id === 'lægacy' ? onNavigate(Page.LegacyTeaser) : onSubscribe(tier.id as UserTier)}
              className={`relative flex flex-col p-10 rounded-[3rem] bg-white/[0.02] border backdrop-blur-xl transition-all duration-700 hover:bg-white/[0.04] group cursor-pointer
                ${tier.accent} ${tier.popular || tier.comingSoon ? 'scale-105 z-10' : 'scale-100'}
              `}
            >
              {(tier.popular || tier.comingSoon) && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl ${
                    tier.comingSoon ? 'bg-[#B87D4B]' : 'bg-[#5d5fff]'
                }`}>
                  {tier.comingSoon ? 'COMING SOON' : 'MOST PREFERRED'}
                </div>
              )}

              <div className="mb-12">
                <h3 className={`text-[11px] font-black uppercase tracking-[0.4em] mb-4 ${tier.color}`}>{tier.name}</h3>
                <div className="flex flex-col mb-8 h-24 justify-center">
                  {billingCycle === 'monthly' ? (
                    <div className="flex items-baseline gap-1 animate-fade-in">
                      <span className="text-5xl font-brand font-bold text-white tracking-tighter">€{tier.price}</span>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2"> / MO</span>
                    </div>
                  ) : (
                    <div className="space-y-1 animate-fade-in">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-brand font-bold text-white tracking-tighter">€{tier.totalYearly}</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2"> / YEAR</span>
                      </div>
                      <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                        SAVE €{tier.savings} / YEAR
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm md:text-base text-slate-300 font-serif italic leading-relaxed min-h-[5rem]">{tier.description}</p>
              </div>

              <ul className="space-y-6 mb-16 flex-grow">
                {tier.features.map((feature: any, i: number) => (
                  <li key={i} className="flex flex-col gap-1 group/item">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border border-white/10 transition-colors bg-white/5`}>
                        <feature.icon size={12} className={tier.iconColor} />
                      </div>
                      <span className={`text-[11px] font-bold tracking-wide text-slate-300`}>
                        {feature.text}
                      </span>
                    </div>
                    {feature.subtext && (
                        <p className="text-[10px] text-slate-500 ml-9 leading-tight font-medium">
                            {feature.subtext}
                        </p>
                    )}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all transform group-hover:scale-[1.02] active:scale-95 shadow-2xl
                  ${tier.comingSoon 
                    ? 'bg-[#B87D4B] text-black border border-[#B87D4B]/30 hover:bg-[#A66C3E]' 
                    : tier.popular 
                        ? 'bg-[#484be7] text-white hover:bg-[#3b3ec5]' 
                        : 'bg-white text-black hover:bg-slate-100'}
                `}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* --- MEMORY ENERGY REFILLS (UPSELL SECTION) --- */}
        <section id="refills" className="mb-40 animate-fade-in-up">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner mb-6">
                    <Zap size={32} />
                </div>
                <h2 className="text-4xl font-bold font-brand tracking-tighter text-white">Memory Energy Refills</h2>
                <p className="text-slate-400 mt-4 max-w-xl mx-auto font-serif italic">"Manifest Living Frames, Vocal Signatures, and Journæy Weaving on demand. Your reservoir, your rules."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(Object.keys(TOKEN_PACKS) as TokenPack[]).map(packId => {
                    const pack = TOKEN_PACKS[packId];
                    const isProcessing = isPurchasingToken === packId;
                    return (
                        <div key={packId} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:bg-white/[0.04] hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <TokenIcon className="w-12 h-12 text-amber-500 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold font-brand text-white mb-2">{pack.amount.toLocaleString()} <span className="text-slate-600">Tk</span></h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">{packId} Reservoir Pack</p>
                            <button 
                                onClick={() => handlePackPurchase(packId)}
                                disabled={!!isPurchasingToken}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                                {pack.price} — Refill
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>

        <section className="mb-40 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-12">
            <ShieldCheck size={24} className="text-cyan-400" />
            <h2 className="text-2xl font-bold font-brand tracking-tight">Full Framework Comparison</h2>
          </div>
          <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">FEATURE</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-cyan-400">ESSÆNTIAL</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-indigo-400">FÆMILY</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-purple-400">FÆMILY PLUS</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-[#B87D4B]">LÆGACY</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-8 text-sm font-bold text-slate-300">{row.label}</td>
                    <td className="p-8 text-sm text-slate-300 font-medium">{row.essential}</td>
                    <td className="p-8 text-sm text-slate-300 font-medium">{row.family}</td>
                    <td className="p-8 text-sm text-slate-300 font-medium">{row.plus}</td>
                    <td className="p-8 text-sm text-[#B87D4B] font-medium">{row.legacy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="animate-fade-in-up">
            <div className="p-16 md:p-24 rounded-[4rem] border border-white/10 bg-white/[0.01] text-center shadow-3xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-brand text-white mb-6 tracking-tight">Data Sovereignty</h2>
                    <p className="text-base md:text-xl text-slate-400 leading-relaxed font-serif italic mb-12">
                        All plans include end-to-end encryption and ISO 27001 compliance. Your Energy is used only for specialized creation tasks, ensuring a stable and premium experience that protects your digital legacy.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                        <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-50">256-BIT AES SEALED</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-50">GDPR SOVEREIGN</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-50">PRIVATE STORAGE SILOS</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default SubscriptionPage;
