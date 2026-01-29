import React, { useMemo } from 'react';
import { Moment, Page } from '../types';
import { ArrowLeft, Users, Sparkles, Calendar, Quote, ChevronRight, Heart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import PageHeader from './PageHeader';

interface FamilyStorylinePageProps {
  moments: Moment[];
  onBack: () => void;
  onSelectMoment: (moment: Moment) => void;
}

const FamilyStorylinePage: React.FC<FamilyStorylinePageProps> = ({ moments, onBack, onSelectMoment }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const storylineMoments = useMemo(() => {
    // Filter for shared family moments and sort chronologically
    return [...moments]
      .filter(m => m.type === 'standard' || m.type === 'focus' || m.type === 'fæmilyStoryline')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [moments]);

  // Simulated AI Connective Tissue
  const getConnectiveText = (index: number) => {
    const texts = [
      "The foundation of our house was built on these early days...",
      "As time flowed, a new chapter of adventure began to emerge.",
      "The seasons changed, but the bonds only grew stronger through shared trials.",
      "A moment of profound reflection that would ripple through the generations.",
      "And so, the legacy continues, written by each of us every single day."
    ];
    return texts[index % texts.length];
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} -mt-20 pt-20 pb-40`}>
      
      <PageHeader 
        title="Bloodline Spine" 
        onBack={onBack}
        backLabel="HOUSE"
        backVariant="breadcrumb"
        variant="immersive"
      />

      {/* Narrative Header */}
      <div className="relative py-24 overflow-hidden pt-48">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 ring-1 ring-indigo-500/30 rotate-12">
                <Heart className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold font-brand tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-500">Bloodline</span> Spine
            </h1>
            <p className={`text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed italic font-serif ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
              "A family is more than a list of names; it is a continuous conversation across time."
            </p>
          </div>
        </div>
      </div>
      
      {/* The Storyline Thread */}
      <div className="container mx-auto px-6 max-w-5xl relative">
        {/* The Vertical Spine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px border-l border-dashed border-indigo-500/30 hidden md:block"></div>

        <div className="space-y-32 relative">
          {storylineMoments.map((moment, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={moment.id} className="relative">
                {/* Connector Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-10 w-4 h-4 rounded-full bg-indigo-500 ring-8 ring-indigo-500/10 z-10 hidden md:block"></div>

                {/* AI Interstitial Reflection */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-xs text-center hidden md:block">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/40 mb-1">æterny reflection</p>
                   <p className={`text-xs italic font-medium leading-relaxed ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                    {getConnectiveText(index)}
                   </p>
                </div>

                <div className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Image Part */}
                  <div className="w-full md:w-1/2">
                    <button 
                        onClick={() => onSelectMoment(moment)}
                        className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden group relative shadow-2xl ring-1 ring-white/10"
                    >
                        <img src={moment.image || moment.images?.[0]} alt={moment.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                View Detail <ChevronRight size={14}/>
                            </span>
                        </div>
                    </button>
                  </div>

                  {/* Text Part */}
                  <div className={`w-full md:w-1/2 space-y-4 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                            {new Date(moment.date).getFullYear()}
                        </span>
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                            {moment.date}
                        </span>
                    </div>
                    
                    <h3 className={`text-3xl md:text-4xl font-bold font-brand tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {moment.title}
                    </h3>
                    
                    <p className={`text-lg leading-relaxed font-serif ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                        {moment.description}
                    </p>

                    {moment.people && moment.people.length > 0 && (
                        <div className={`flex flex-wrap gap-2 pt-4 ${isEven ? 'justify-start' : 'justify-end'}`}>
                            {moment.people?.map(p => (
                                <span key={p} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-white/5 text-slate-400' : 'bg-stone-100 text-stone-500'}`}>
                                    <Users size={10} className="text-indigo-400" /> {p}
                                </span>
                            ))}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* End of Story Marker */}
        <div className="mt-40 text-center relative z-10">
            <div className="w-px h-24 bg-gradient-to-b from-indigo-500/30 to-transparent mx-auto mb-8 hidden md:block"></div>
            <div className="inline-block p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40">
                <Sparkles className="w-8 h-8 mx-auto mb-4" />
                <h4 className="text-xl font-bold font-brand mb-2">To be continued...</h4>
                <p className="text-indigo-100 text-sm opacity-80">Capture today, preserve forever.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyStorylinePage;