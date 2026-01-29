import React from 'react';
import { Page, UserTier } from '../types';
import { 
  ArrowLeft, BookOpen, FilePenLine, BookImage, ExternalLink, 
  Sparkles, ArrowRight, Printer, Palette, Library, QrCode
} from 'lucide-react';
import PageHeader from './PageHeader';

interface ShopPageProps {
  onNavigate: (page: Page) => void;
  userTier: UserTier;
}

interface ProductCardProps {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    onNavigate: (page: Page) => void;
    isComingSoon?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, subtitle, description, image, onNavigate, isComingSoon }) => {
    return (
        <div className={`group relative w-full h-[520px] rounded-[3rem] overflow-hidden border border-white/5 bg-[#0B101B] shadow-2xl transition-all duration-700 hover:border-cyan-500/20 ${isComingSoon ? 'opacity-70 grayscale' : 'hover:-translate-y-2'}`}>
            <div className="absolute inset-0 z-0">
                <img src={image} className="w-full h-full object-cover opacity-30 transition-transform duration-[8s] group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 p-12 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {isComingSoon ? 'Waiting Room' : 'Atelier Open'}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-3">{subtitle}</p>
                        <h3 className="text-4xl font-bold font-brand tracking-tighter text-white">{title}</h3>
                    </div>
                    <p className="text-xl text-slate-400 font-serif italic leading-relaxed max-w-sm">"{description}"</p>
                    
                    <button 
                        onClick={() => !isComingSoon && onNavigate(Page.SmartCollection)}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all transform active:scale-95 shadow-2xl
                            ${isComingSoon ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white text-black hover:bg-cyan-50 group-hover:shadow-white/5'}
                        `}
                    >
                        {isComingSoon ? 'Coming Soon' : 'Begin Bespoke Design'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, userTier }) => {
  return (
    <div className="min-h-screen bg-[#050811] pt-12 pb-40 animate-fade-in">
      <PageHeader title="Hærloom Wing" onBack={() => onNavigate(Page.Studio)} />
      
      <div className="container mx-auto px-6 max-w-7xl pt-12">
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                <Printer size={14} className="text-amber-500" /> Physical Manifestation
            </div>
            <h1 className="text-5xl md:text-[6.5rem] font-brand font-bold text-white tracking-tighter leading-[0.88]">
                The Hærloom <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Series.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-serif italic leading-relaxed">
                "Digital is for retrieval. Physical is for reverence. Transform your timeline into tangible artifacts designed to outlive the hardware they were born on."
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductCard 
                title="Archive Magæzine"
                subtitle="Quarterly Digest"
                description="Bespoke softcover issues curated by æterny. A living subscription to your house's recent evolution."
                image="https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                onNavigate={onNavigate}
            />
            <ProductCard 
                title="Dynasty Bound"
                subtitle="Museum Photobook"
                description="The definitive yearly volume. 200gsm archival paper, layflat binding, and embedded interactive QR Bridge™ anchors."
                image="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                onNavigate={onNavigate}
            />
            <ProductCard 
                title="The Daily Mirror"
                subtitle="Guided Journal"
                description="A physical journal pre-filled with your curated highlights and AI-generated prompts for the coming year."
                image="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                onNavigate={onNavigate}
                isComingSoon={true}
            />
            <ProductCard 
                title="Canvas Spines"
                subtitle="Wall Artifacts"
                description="High-fidelity large scale prints of your most evocative moments. Professional color-grading included."
                image="https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                onNavigate={onNavigate}
                isComingSoon={true}
            />
        </div>

        {/* The QR Bridge Detail */}
        <section className="mt-40 p-12 md:p-24 rounded-[4rem] bg-indigo-950/20 border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-8 space-y-10">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                        <QrCode size={14} className="animate-pulse" /> Interactive Print
                    </div>
                    <h2 className="text-4xl md:text-6xl font-brand font-bold text-white tracking-tighter leading-tight">Every page has <br/> a Voice.</h2>
                    <p className="text-xl text-slate-300 font-serif italic leading-relaxed">
                        "Your physical hærlooms are embedded with Neural Anchors. Scan any page to instantly hear your original voice recordings or watch the cinematic AI reflections associated with that moment."
                    </p>
                </div>
                <div className="lg:col-span-4 flex justify-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 bg-black/60 rounded-[3rem] border border-white/10 p-6 shadow-3xl flex items-center justify-center relative rotate-3 group-hover:rotate-0 transition-transform duration-700">
                        <QrCode size={120} className="text-white opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-16 h-1 bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Founding Special */}
        <div className="mt-40 p-16 rounded-[4rem] border border-white/5 bg-white/[0.01] text-center max-w-4xl mx-auto shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 opacity-30"></div>
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl font-brand font-bold mb-6 text-white tracking-tight">Lægacy Founders Benefit.</h2>
            <p className="text-slate-400 font-serif italic text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                "Legacy members receive one complimentary museum-quality hardcover book every year and unlimited digital magazine access."
            </p>
            <button onClick={() => onNavigate(Page.Subscription)} className="px-12 py-5 bg-amber-600 hover:bg-amber-400 text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl transform hover:scale-[1.02] active:scale-95">Upgrade to Lægacy Plan</button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;