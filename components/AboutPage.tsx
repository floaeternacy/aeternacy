import React, { useState } from 'react';
import { Page } from '../types';
import { Shield, Wand2, Clock, MapPin, BrainCircuit, Rocket, Heart, Sparkles, ChevronDown, ArrowRight, Bot, ArrowLeft } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useTheme } from '../contexts/ThemeContext';
import { ASSETS } from '../data/assets';
import { getOptimizedUrl } from '../services/cloudinaryService';
import PageHeader from './PageHeader';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string; }> = ({ icon: Icon, title, description }) => (
    <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] text-center flex flex-col items-center hover:bg-white/[0.04] transition-all duration-500 group shadow-2xl">
        <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-inner">
            <Icon className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 font-brand tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed font-serif italic">"{description}"</p>
    </div>
);

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [imageError, setImageError] = useState(false);

  const handleScrollDown = () => {
    document.getElementById('founding-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} text-white animate-fade-in -mt-20 overflow-x-hidden selection:bg-cyan-500/30 relative`}>
      
      <PageHeader 
        title="Origins" 
        onBack={() => onNavigate(Page.Landing)}
        backLabel="LANDING"
        backVariant="breadcrumb"
        variant="immersive"
      />

      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
            {!imageError ? (
              <img 
                src={getOptimizedUrl(ASSETS.UI.ABOUT_HERO, 1920)} 
                alt="Monument Valley" 
                className="w-full h-full object-cover animate-ken-burns-slow scale-110 brightness-[0.7] contrast-[1.1]" 
                onError={() => {
                  console.warn("Monument Valley hero failed to load, falling back to archive.");
                  setImageError(true);
                }}
              />
            ) : (
              <img 
                src="https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1920"
                className="w-full h-full object-cover opacity-40 grayscale"
                alt="Fallback Background"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050811]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050811_90%)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 animate-fade-in-up flex flex-col items-center pt-24">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-md">
            <MapPin size={12} className="text-cyan-400" /> Monument Valley • Highway 163
          </div>
          <h1 className="text-6xl md:text-[9rem] font-bold text-white leading-[0.85] mb-8 font-brand tracking-tighter drop-shadow-3xl">
            Story is <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Everything.</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-300 max-w-3xl mx-auto font-serif italic leading-relaxed opacity-90 mb-16">
            "Without story, everything is nothing. æternacy was born at the point where I stopped running and started listening."
          </p>

          <button 
              onClick={handleScrollDown}
              className="flex flex-col items-center gap-4 group cursor-pointer animate-bounce mt-8"
          >
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">The Origin</span>
              <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
          </button>
        </div>
      </section>

      {/* 2. THE FOUNDING NARRATIVE */}
      <div id="founding-story" className="container mx-auto px-6 py-32 max-w-5xl space-y-32">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-bold font-brand text-white tracking-tighter">Florian & The Realization.</h2>
            <div className="prose prose-xl prose-invert prose-p:text-slate-400 prose-p:leading-relaxed prose-p:font-serif">
                <p>Standing in the stillness of Monument Valley, a profound moment of clarity unfolded. Florian—entrepreneur, coder, but primarily a son—realized his own "running" was away from the fragility of his family's history.</p>
                <p>It was one of those rare moments where the vastness of the horizon forced a perspective on the small, fleeting details of home. He looked at his phone: 15,000 photos. Unsorted. Silent. JPEGs that would eventually become dead data on a server. He realized that a photo without its underlying story is a hollow shell.</p>
                <p>From this realization, æternacy was manifested. Not as another "app," but as an architectural vow. A centennial commitment to ensure the stories of our families survive the digital entropy of the 21st century by giving them back their voice and meaning.</p>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-cyan-500/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-slate-900 aspect-[4/5]">
                  <img src={getOptimizedUrl(ASSETS.UI.FOUNDER, 1000)} alt="Founder" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10">
                      <p className="text-white font-bold text-2xl font-brand">Florian</p>
                      <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mt-1">Founder & Vision Lead</p>
                  </div>
              </div>
          </div>
        </section>

        {/* 3. THE RESONANT DIALOGUE */}
        <section className="bg-[#0B101B] p-10 md:p-20 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <BrainCircuit size={32} className="text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold font-brand text-white tracking-tighter">The Neural Link.</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">A Dialogue with æterny</p>
                </div>
            </div>
            <div className="px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                Confidential Exchange
            </div>
          </div>

          <div className="space-y-16 max-w-4xl mx-auto">
            {/* AI TURN */}
            <div className="flex gap-6 animate-fade-in-up">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-xl">
                    <Bot size={24} />
                </div>
                <div className="space-y-4 pt-1">
                    <p className="flex items-center gap-2 font-black uppercase tracking-widest text-[9px] text-cyan-400/60"><Sparkles size={10}/> æterny Curator</p>
                    <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
                        "Florian, that specific moment in the desert is now a cornerstone of our origin. But beyond the aesthetics, what was the driving anxiety that forced this platform into existence?"
                    </p>
                </div>
            </div>
            
            {/* FOUNDER TURN */}
            <div className="flex gap-6 flex-row-reverse animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white border border-white/10 shadow-xl overflow-hidden">
                    <img src={getOptimizedUrl(ASSETS.UI.FOUNDER, 100)} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="space-y-4 pt-1 text-right">
                    <p className="flex items-center justify-end gap-2 font-black uppercase tracking-widest text-[9px] text-slate-500">Founder Signature <Heart size={10}/></p>
                    <p className="text-lg md:text-xl leading-relaxed text-slate-300">
                        "It was my parents. Every time I visited them, I realized there was another layer of our family heritage—stories from my grandparents, the texture of a 1950s kitchen, the specific wisdom of a struggle—that was just disappearing. I looked at the 'big cloud' companies and realized their model is *selling* data, not *preserving* it. æternacy is for people who want a private silo. A vault where the AI serves the memory, not an advertising engine."
                    </p>
                </div>
            </div>

            {/* AI TURN 2 */}
            <div className="flex gap-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <Bot size={24} />
                </div>
                <div className="space-y-4 pt-1">
                    <p className="flex items-center gap-2 font-black uppercase tracking-widest text-[9px] text-cyan-400/60"><Sparkles size={10}/> æterny Curator</p>
                    <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
                        "You talk about 'Absolute Sovereignty.' How do we prove that æternacy is truly different from a storage bucket?"
                    </p>
                </div>
            </div>

            {/* FOUNDER TURN 2 */}
            <div className="flex gap-6 flex-row-reverse animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white border border-white/10">
                    <img src={getOptimizedUrl(ASSETS.UI.FOUNDER, 100)} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="space-y-4 pt-1 text-right">
                    <p className="flex items-center justify-end gap-2 font-black uppercase tracking-widest text-[9px] text-slate-500">Founder Signature <Rocket size={10}/></p>
                    <p className="text-lg md:text-xl leading-relaxed text-slate-300">
                        "Architectural intent. We use Isolated RAG. Your data is your property. We don't train global models on your children's photos or your parents' voices. The 'Endowment' model ensures that we are pre-funded for the long haul. We aren't building for the next quarter; we are building for the next century. If a user deletes their vault, the neural weights of their personal index are purged instantly. No digital ghosts."
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* 4. CORE PILLARS */}
        <section className="space-y-20">
          <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-white font-brand tracking-tighter">The Archival Vow.</h2>
              <div className="h-px w-24 bg-cyan-500/30 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
                icon={Shield}
                title="Sovereignty"
                description="Your history is not training data. We operate in private, isolated neural silos. Your stories remain yours, cryptographically sealed."
            />
             <FeatureCard
                icon={BrainCircuit}
                title="Resonance"
                description="We don't just store files; we identify emotional arcs. æterny uses generative intelligence to help you hear and see the meaning behind the media."
            />
             <FeatureCard
                icon={Clock}
                title="Continuity"
                description="Our Endowment model ensures your vault stays active for 10, 50, or 100 years, bridging the gap between generations with technical stability."
            />
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <section className="text-center py-20 bg-gradient-to-t from-white/[0.02] to-transparent rounded-[4rem] border-t border-white/5">
            <h2 className="text-3xl md:text-5xl font-bold font-brand text-white mb-10 tracking-tight">Ready to anchor your story?</h2>
            <button 
                onClick={() => onNavigate(Page.Landing)}
                className="group bg-white text-slate-950 font-black py-6 px-16 rounded-[2rem] text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-[0_20px_60px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 mx-auto active:scale-95"
            >
                Start Your Dynasty <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-slate-600 text-xs font-medium tracking-wide flex items-center justify-center gap-2 mt-20 opacity-40">
                <span>🇪🇺</span> Hosted in Germany · GDPR Compliant
            </p>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;