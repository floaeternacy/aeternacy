import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Page, UserTier, Moment, Journey } from '../types';
import { 
    ArrowLeft, BookOpen, Download, Sparkles, LayoutTemplate, PenLine, 
    Award, Calendar, Check, X, Loader2, ArrowRight, Printer, Palette, 
    Library, Grid, Maximize2, Share2, ChevronLeft, ChevronRight, 
    GripHorizontal, Copy, FileText, Quote, Image as ImageIcon, AlignLeft,
    QrCode, Smartphone, Link as LinkIcon, Waves
} from 'lucide-react';
import { TOKEN_COSTS } from '../services/costCatalog';
import PageHeader from './PageHeader';

interface MagazinePageProps {
  onNavigate: (page: Page) => void;
  userTier: UserTier;
  moments: Moment[];
  journeys: Journey[];
  triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string) => void;
}

const layouts = [
    { name: 'Minimalist', description: 'Clean lines, ample whitespace.', bg: 'bg-white text-slate-900', font: 'font-sans' },
    { name: 'Editorial', description: 'Classic serif typography.', bg: 'bg-slate-100 text-slate-900', font: 'font-serif' },
    { name: 'Vogue', description: 'Bold, immersive, full-bleed.', bg: 'bg-black text-white', font: 'font-brand' }
];

const sampleIssue: Journey = {
    id: -1,
    title: "The Art of Memory",
    description: "A quarterly collection of life's finest moments, curated by æterny.",
    momentIds: [],
    coverImage: "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
};

const demoPages = [
    {
        type: 'cover',
        image: "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "The Art of Memory",
        subtitle: "Volume 01 • Autumn Collection"
    },
    {
        type: 'editorial',
        image: "https://images.pexels.com/photos/3772612/pexels-photo-3772612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "A Note on Time",
        text: "We often think of memory as a static archive, a dusty library of the past. But true memory is living. It changes as we change. This issue explores the texture of moments we choose to keep."
    },
    {
        type: 'cinematic',
        image: "https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        caption: "The silence between the waves."
    },
    {
        type: 'triptych',
        images: [
            "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/3363357/pexels-photo-3363357.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        title: "Fragments of Light"
    },
    {
        type: 'quote',
        text: "“We do not remember days, we remember moments.”",
        author: "Cesare Pavese",
        image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
];

const MagazineCover: React.FC<{ item: Moment | Journey, onClick: () => void }> = ({ item, onClick }) => {
    const image = 'momentIds' in item ? item.coverImage : (item.image || item.images?.[0]);
    const date = 'date' in item ? item.date : 'Collection';
    
    return (
        <button 
            onClick={onClick}
            className="relative aspect-[3/4] rounded-sm overflow-hidden group shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out flex-shrink-0 w-full sm:w-72 bg-white text-left"
        >
            <div className="absolute inset-0">
                <img src={image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-80"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="border-t-4 border-white/80 pt-2 w-12">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase">æternacy</p>
                </div>
                <div>
                    <h3 className="text-3xl font-brand font-bold text-white leading-none mb-2 drop-shadow-lg line-clamp-3">
                        {item.title}
                    </h3>
                    <p className="text-xs font-medium text-white/80 font-serif tracking-wide">
                        {date} • Volume 1
                    </p>
                </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                <span className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    Open Studio
                </span>
            </div>
        </button>
    );
}

const MagazinePage: React.FC<MagazinePageProps> = ({ onNavigate, userTier, moments, journeys, triggerConfirmation }) => {
  const [selectedItem, setSelectedItem] = useState<Moment | Journey | null>(null);
  const [isDesignStudioOpen, setIsDesignStudioOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(layouts[1]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<{ title?: string; foreword?: string }>({});
  const [isQrBridgeEnabled, setIsQrBridgeEnabled] = useState(true);
  
  const [issuePages, setIssuePages] = useState<any[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'reader' | 'grid'>('reader');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);

  const isLegacyUser = userTier === 'lægacy';

  useEffect(() => {
    if (!selectedItem) {
        setIssuePages([]);
        return;
    }

    if (selectedItem.id === -1) {
        setIssuePages(demoPages);
    } else {
        let pages: any[] = [];
        if ('momentIds' in selectedItem) {
            pages = selectedItem.momentIds
                .map(id => moments.find(m => m.id === id))
                .filter((m): m is Moment => !!m);
        } else {
            pages = [selectedItem];
        }
        setIssuePages(pages);
    }
    setCurrentPageIndex(0);
    setViewMode('reader');
  }, [selectedItem, moments]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!isDesignStudioOpen) return;
          if (e.key === 'ArrowRight') {
              setCurrentPageIndex(prev => Math.min(prev + 1, issuePages.length - 1));
          } else if (e.key === 'ArrowLeft') {
              setCurrentPageIndex(prev => Math.max(prev - 1, 0));
          } else if (e.key === 'Escape') {
              setIsDesignStudioOpen(false);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesignStudioOpen, issuePages.length]);

  const handleItemSelect = (item: Moment | Journey) => {
    setSelectedItem(item);
    setEnhancedContent({});
    setIsDesignStudioOpen(true);
  };
  
  const handleViewSample = () => {
      setSelectedItem(sampleIssue);
      setIsDesignStudioOpen(true);
  };
  
  const handleEnhance = async (type: 'title' | 'foreword') => {
      setIsEnhancing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (type === 'title') {
          setEnhancedContent(prev => ({ ...prev, title: `The Essence of ${selectedItem?.title}`}));
      } else {
          setEnhancedContent(prev => ({ ...prev, foreword: `In the quiet spaces between seconds, life happens. This collection explores the texture of "${selectedItem?.title}", preserving the fleeting light and lasting shadows of a memory we wish to hold forever.`}));
      }
      setIsEnhancing(false);
  };
  
  const executeDownload = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('PDF Generated! In a real app, this would download a high-res PDF with embedded QR Bridge™ links.');
  }

  const handleDownload = () => {
    if (!isLegacyUser) {
        onNavigate(Page.Subscription);
    } else {
        triggerConfirmation(TOKEN_COSTS.MAGAZINE_ISSUE, 'MAGAZINE_ISSUE', executeDownload, "Generate High-Res PDF with Interactive QR Bridge Anchors?");
    }
  }

  const handleDragStart = (index: number) => {
      setDraggedPageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedPageIndex === null || draggedPageIndex === index) return;
      const newPages = [...issuePages];
      const draggedItem = newPages[draggedPageIndex];
      newPages.splice(draggedPageIndex, 1);
      newPages.splice(index, 0, draggedItem);
      setIssuePages(newPages);
      setDraggedPageIndex(index);
  };

  const handleDragEnd = () => {
      setDraggedPageIndex(null);
  };

  const renderDemoPage = (page: any) => {
      if (!page) return <div className="w-full h-full bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300"/></div>;
      
      switch (page.type) {
          case 'editorial':
              return (
                  <div className="w-full h-full flex flex-col md:flex-row bg-[#f8f5f2] text-slate-900 relative">
                      <div className="md:w-1/2 p-12 flex flex-col justify-center relative">
                          <div className="w-16 h-16 bg-black mb-8"></div>
                          <h2 className="text-4xl font-serif font-bold mb-6 leading-tight">{page.title}</h2>
                          <p className="font-serif text-lg leading-relaxed text-slate-700">
                              <span className="text-6xl float-left mr-3 mt-[-10px] font-brand font-bold">W</span>
                              {page.text}
                          </p>
                          <div className="mt-12 text-xs font-bold uppercase tracking-widest text-slate-400">Page 0{currentPageIndex + 1}</div>
                      </div>
                      <div className="md:w-1/2 h-full">
                          <img src={page.image} className="w-full h-full object-cover" alt="Editorial" />
                      </div>
                      {isQrBridgeEnabled && (
                        <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1 group/qr">
                             <div className="w-12 h-12 bg-white p-1 shadow-md border border-slate-200">
                                <QrCode size={40} className="text-slate-900" />
                             </div>
                             <span className="text-[6px] font-black uppercase text-slate-400 tracking-tighter">Scan to Hear Voice</span>
                        </div>
                      )}
                  </div>
              );
          case 'cinematic':
              return (
                  <div className="w-full h-full relative">
                      <img src={page.image} className="w-full h-full object-cover" alt="Cinematic" />
                      <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white font-serif italic text-xl text-center opacity-90">{page.caption}</p>
                      </div>
                      {isQrBridgeEnabled && (
                        <div className="absolute top-6 right-6 flex flex-col items-center gap-1">
                             <div className="w-10 h-10 bg-white/20 backdrop-blur-md p-1 border border-white/20">
                                <QrCode size={32} className="text-white" />
                             </div>
                             <span className="text-[6px] font-black uppercase text-white/60 tracking-tighter">Watch Living Frame</span>
                        </div>
                      )}
                  </div>
              );
          case 'triptych':
              return (
                  <div className="w-full h-full bg-white p-8 flex flex-col items-center justify-center">
                      <h2 className="text-2xl font-brand font-bold uppercase tracking-[0.2em] mb-8 text-slate-900">{page.title}</h2>
                      <div className="grid grid-cols-3 gap-4 h-[70%] w-full max-w-2xl">
                          {page.images.map((img: string, i: number) => (
                              <div key={i} className="h-full w-full overflow-hidden">
                                  <img src={img} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" alt={`Detail ${i}`} />
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'quote':
              return (
                  <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                      <img src={page.image} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" alt="Background" />
                      <div className="relative z-10 max-w-lg text-center p-8 border-y-2 border-white/20">
                          <p className="text-3xl md:text-4xl font-serif text-white leading-relaxed mb-6">{page.text}</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">— {page.author}</p>
                      </div>
                  </div>
              );
          case 'cover':
          default:
              return (
                <div className={`relative w-full h-full ${selectedLayout.bg}`}>
                    <img src={page.image || (page.images && page.images[0])} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay" />
                    <div className={`absolute inset-0 p-12 flex flex-col items-center text-center justify-between`}>
                        <div className="w-full z-10">
                            <p className={`text-xs font-bold tracking-[0.4em] uppercase mb-4 ${selectedLayout.name === 'Vogue' ? 'text-white' : 'text-current'}`}>æternacy collection</p>
                            <h1 className={`${selectedLayout.font} text-6xl md:text-7xl font-bold leading-[0.9] tracking-tight ${selectedLayout.name === 'Vogue' ? 'text-white' : 'text-current'}`}>
                                {enhancedContent.title || page.title}
                            </h1>
                        </div>
                        <div className="z-10 max-w-sm">
                            <div className={`h-1 w-12 mb-6 mx-auto ${selectedLayout.name === 'Vogue' ? 'bg-white' : 'bg-current'}`}></div>
                            <p className={`text-sm font-serif leading-relaxed ${selectedLayout.name === 'Vogue' ? 'text-white/90' : 'text-current opacity-80'}`}>
                                {enhancedContent.foreword || page.description || page.subtitle || "A curated collection of memories."}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-6 ${selectedLayout.name === 'Vogue' ? 'text-white/60' : 'text-current opacity-50'}`}>
                                Volume 01 • {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
              );
      }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white animate-fade-in">
      <PageHeader 
        title="Magazine Studio" 
        onBack={() => onNavigate(Page.Home)}
      />
      
      <div className="container mx-auto px-6 pt-28 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                  <h1 className="text-4xl md:text-5xl font-bold font-brand text-white flex items-center gap-4">
                      The Mægazine Studio <BookOpen className="w-8 h-8 text-amber-400" />
                  </h1>
                  <p className="text-slate-400 mt-2 max-w-xl leading-relaxed">
                      Transform your digital timeline into tangible artifacts. Design bespoke issues or subscribe to the curated Archive Series.
                  </p>
              </div>
              
              <div className="flex gap-6 bg-slate-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                          <Printer className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Print Service</p>
                          <p className="font-bold text-white text-sm">Global Shipping</p>
                      </div>
                  </div>
                  <div className="w-px bg-white/10"></div>
                   <div className="text-center px-2">
                        <p className="text-2xl font-bold font-mono text-cyan-400">{journeys.length + moments.filter(m=>m.pinned).length}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Drafts</p>
                    </div>
              </div>
          </div>

          <div className="space-y-24">
            {/* --- THE QR BRIDGE SECTION --- */}
            <section className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-500/20 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden group">
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 mb-8">
                        <Sparkles size={12} className="animate-pulse" /> The æternacy Bridge™
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-brand text-white mb-6 tracking-tighter">Physical Pages, Living Voices.</h2>
                    <p className="text-lg md:text-xl text-slate-300 font-serif italic leading-relaxed mb-10">
                        "A magazine that speaks back. Every printed page is embedded with a Neural Anchor—a unique QR code that links directly to your voice narrations and AI video reflections."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner"><Smartphone size={20}/></div>
                            <h4 className="font-bold text-white text-sm">Scan to Experience</h4>
                            <p className="text-slate-500 text-xs leading-relaxed">Loved ones scan the margin to instantly watch the Living Slideshow for that moment.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner"><Waves size={20}/></div>
                            <h4 className="font-bold text-white text-sm">Vocal Continuity</h4>
                            <p className="text-slate-500 text-xs leading-relaxed">Let them hear your original voice recordings while they browse the physical paper.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner"><LinkIcon size={20}/></div>
                            <h4 className="font-bold text-white text-sm">Join the Story</h4>
                            <p className="text-slate-500 text-xs leading-relaxed">Links stay active for 100 years, ensured by our decentralized archival protocol.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-brand text-white flex items-center gap-3">
                        <LayoutTemplate className="w-6 h-6 text-cyan-400" /> Start a New Issue
                    </h2>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-12 snap-x scrollbar-hide px-4 -mx-4">
                    {journeys.slice(0, 3).map(journey => (
                        <div key={`journey-${journey.id}`} className="snap-center">
                            <MagazineCover item={journey} onClick={() => handleItemSelect(journey)} />
                        </div>
                    ))}
                    {moments.filter(m => m.pinned).slice(0, 5).map(moment => (
                        <div key={`moment-${moment.id}`} className="snap-center">
                            <MagazineCover item={moment} onClick={() => handleItemSelect(moment)} />
                        </div>
                    ))}
                    <div className="snap-center flex-shrink-0 w-72 aspect-[3/4] rounded-sm border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-pointer group" onClick={() => onNavigate(Page.SmartCollection)}>
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-cyan-500/10">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-sm">Auto-Generate Issue</p>
                    </div>
                </div>
            </section>

            <section className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 relative z-10">
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-6 w-fit">
                            <Library className="w-3 h-3" /> The Archive Series
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-brand text-white mb-6">Build Your Library, Automatically.</h2>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8">
                            Let æterny be your editor-in-chief. Every quarter, we curate your best moments into a stunning digital digest. Legacy members receive a print-ready file and one complimentary hardcover book per year.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {isLegacyUser ? (
                                <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                                    <Check className="w-5 h-5" /> Subscription Active
                                </button>
                            ) : (
                                <button onClick={() => onNavigate(Page.Subscription)} className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-8 rounded-full transition-all shadow-lg flex items-center gap-2">
                                    Upgrade to Lægacy
                                </button>
                            )}
                            <button onClick={handleViewSample} className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-semibold">
                                View Sample Issue
                            </button>
                        </div>
                    </div>
                    <div className="relative h-80 lg:h-auto flex items-center justify-center perspective-1000">
                        <div className="flex gap-2 transform rotate-y-12 rotate-x-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-64 bg-gradient-to-r from-slate-800 to-slate-700 rounded-l-sm border-l border-white/20 relative group transition-transform hover:-translate-y-4 duration-300 cursor-pointer shadow-2xl">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-slate-400 -rotate-90 whitespace-nowrap tracking-widest">VOL. 0{i} • 2024</span>
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <span className="text-[8px] font-bold text-amber-400">{i}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="w-12 h-64 border-2 border-dashed border-white/10 rounded-l-sm flex items-center justify-center">
                                <span className="text-white/20 text-xs -rotate-90 font-bold">NEXT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          </div>
      </div>

      {isDesignStudioOpen && selectedItem && createPortal(
        <div className="fixed inset-0 bg-slate-950 z-[2000] flex flex-col animate-fade-in">
            <div className="h-16 px-6 flex justify-between items-center bg-slate-900 border-b border-white/5 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsDesignStudioOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={20}/>
                    </button>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest border-l border-white/10 pl-4 hidden sm:block">Issue Editor</span>
                    <div className="flex bg-slate-800 rounded-lg p-1 ml-4">
                        <button onClick={() => setViewMode('reader')} className={`p-1.5 rounded-md transition-all ${viewMode === 'reader' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Maximize2 size={16} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Grid size={16} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsShareModalOpen(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400 hover:text-cyan-300"><Share2 size={20} /></button>
                    <button onClick={handleDownload} className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${isLegacyUser ? 'bg-white text-black hover:bg-cyan-50' : 'bg-amber-500 text-black hover:bg-amber-400'}`}>
                        {isLegacyUser ? <><Download className="w-4 h-4"/> Publish PDF</> : <><Award className="w-4 h-4"/> Upgrade to Publish</>}
                    </button>
                </div>
            </div>
            <div className="flex-grow flex overflow-hidden relative">
                <div className="flex-grow bg-[#1a1a1a] flex flex-col relative overflow-hidden group">
                    {viewMode === 'reader' && (
                        <div className="flex-grow flex items-center justify-center p-8 relative h-full">
                            <div className="absolute top-0 bottom-0 left-0 w-1/6 z-10 cursor-w-resize" onClick={() => setCurrentPageIndex(p => Math.max(p - 1, 0))}></div>
                            <div className="absolute top-0 bottom-0 right-0 w-1/6 z-10 cursor-e-resize" onClick={() => setCurrentPageIndex(p => Math.min(p + 1, issuePages.length - 1))}></div>
                            {currentPageIndex > 0 && <button onClick={() => setCurrentPageIndex(p => p - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm z-20 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"><ChevronLeft size={32} /></button>}
                            {currentPageIndex < issuePages.length - 1 && <button onClick={() => setCurrentPageIndex(p => p + 1)} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm z-20 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"><ChevronRight size={32} /></button>}
                            <div className={`relative w-full max-w-[65vh] aspect-[3/4] shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-500 overflow-hidden bg-white`}>
                                {issuePages.length > 0 && issuePages[currentPageIndex] ? (selectedItem.id === -1 ? renderDemoPage(issuePages[currentPageIndex]) : renderDemoPage({ ...issuePages[currentPageIndex], type: currentPageIndex === 0 ? 'cover' : 'editorial' })) : <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-300" /></div>}
                            </div>
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/40 backdrop-blur-md p-2 rounded-full">
                                {issuePages.map((_, idx) => <button key={idx} onClick={() => setCurrentPageIndex(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPageIndex === idx ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/60'}`} />)}
                            </div>
                        </div>
                    )}
                    {viewMode === 'grid' && (
                        <div className="flex-grow p-8 overflow-y-auto">
                            <div className="max-w-6xl mx-auto">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><GripHorizontal className="w-5 h-5 text-slate-400" />Issue Layout <span className="text-sm font-normal text-slate-500 ml-2">(Drag to Reorder)</span></h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    <div className="relative aspect-[3/4] bg-slate-800 border-2 border-amber-500/50 rounded-lg overflow-hidden flex flex-col">
                                        <div className="bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase py-1 text-center">Cover</div>
                                        <img src={'momentIds' in selectedItem ? selectedItem.coverImage : (selectedItem.image || selectedItem.images?.[0])} className="w-full h-full object-cover opacity-80" alt="Cover" />
                                        <div className="absolute inset-0 flex items-center justify-center font-brand font-bold text-xl drop-shadow-md text-center px-4">{selectedItem.title}</div>
                                    </div>
                                    {issuePages.map((page, index) => (
                                        <div key={index} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} onClick={() => { setCurrentPageIndex(index); setViewMode('reader'); }} className={`relative aspect-[3/4] bg-white rounded-lg overflow-hidden cursor-move transition-all duration-300 group hover:ring-2 hover:ring-cyan-400 ${draggedPageIndex === index ? 'opacity-0' : 'opacity-100 shadow-lg'}`}>
                                            <div className="h-full bg-slate-100">
                                                {page.type === 'editorial' && <div className="p-2 h-full flex"><div className="w-1/2 text-[4px] text-slate-400 overflow-hidden">Lorem ipsum...</div><div className="w-1/2 bg-slate-300"><img src={page.image} className="w-full h-full object-cover"/></div></div>}
                                                {page.type === 'cinematic' && <img src={page.image} className="w-full h-full object-cover" />}
                                                {page.type === 'triptych' && <div className="h-full w-full grid grid-cols-3 gap-1 p-1"><div className="bg-slate-300"></div><div className="bg-slate-300"></div><div className="bg-slate-300"></div></div>}
                                                {(page.type === 'cover' || !page.type) && <img src={page.image || (page.images && page.images[0])} className="w-full h-full object-cover"/>}
                                            </div>
                                            <div className="absolute bottom-2 right-2 text-[10px] text-slate-900 font-bold bg-white/80 px-1 rounded">{index + 1}</div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center"><GripHorizontal className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="absolute right-6 top-6 bottom-6 w-80 flex flex-col gap-4 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Palette className="w-3 h-3" /> Visual Style</h3>
                        <div className="space-y-2">
                            {layouts.map(l => (
                                <button key={l.name} onClick={() => setSelectedLayout(l)} className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center justify-between ${selectedLayout.name === l.name ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-white/5 text-slate-300 hover:border-white/20'}`}>
                                    <span className="font-bold">{l.name}</span>
                                    {selectedLayout.name === l.name && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-5 shadow-2xl pointer-events-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2"><QrCode className="w-3 h-3" /> QR Bridge™</h3>
                            <button 
                                onClick={() => setIsQrBridgeEnabled(!isQrBridgeEnabled)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isQrBridgeEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isQrBridgeEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Embed Neural Anchors in your layouts to link physical pages to digital voice and video.</p>
                    </div>

                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3" /> Editorial AI</h3>
                        <div className="space-y-3">
                            {/* Fix: Wrapped handleEnhance in an arrow function to prevent immediate execution and fix Promise assignment error */}
                            <button onClick={() => handleEnhance('title')} disabled={isEnhancing} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors border border-white/5"><span className="flex items-center gap-2">{isEnhancing ? <Loader2 className="w-3 h-3 animate-spin"/> : <PenLine className="w-3 h-3" />} Suggest Title</span></button>
                            {/* Fix: Wrapped handleEnhance in an arrow function to prevent immediate execution and fix Promise assignment error */}
                            <button onClick={() => handleEnhance('foreword')} disabled={isEnhancing} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors border border-white/5"><span className="flex items-center gap-2">{isEnhancing ? <Loader2 className="w-3 h-3 animate-spin"/> : <PenLine className="w-3 h-3" />} Write Foreword</span></button>
                        </div>
                    </div>
                    <div className="mt-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
                        <div className="flex justify-between items-center"><span className="text-slate-400 text-xs font-bold uppercase">Issue Cost</span><span className="font-mono text-cyan-400 font-bold">{TOKEN_COSTS.MAGAZINE_ISSUE.toLocaleString()} Tk</span></div>
                    </div>
                </div>
            </div>
            {isShareModalOpen && (
                <div className="absolute inset-0 bg-black/80 z-[2050] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setIsShareModalOpen(false)}>
                    <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold font-brand text-white mb-2">Share this Issue</h3>
                        <p className="text-slate-400 text-sm mb-6">Anyone with this link can view the digital magazine.</p>
                        <div className="bg-black/30 rounded-lg p-3 flex items-center gap-3 border border-white/5 mb-6">
                            <div className="p-2 bg-slate-800 rounded text-cyan-400"><FileText size={18}/></div>
                            <div className="flex-grow overflow-hidden">
                                <p className="text-xs text-slate-500 font-bold uppercase">Public Link</p>
                                <p className="text-sm text-white truncate font-mono">aeternacy.com/mag/v/{Math.abs(selectedItem.id)}</p>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white" onClick={() => alert('Link copied!')}><Copy size={18} /></button>
                        </div>
                        <div className="flex justify-end"><button onClick={() => setIsShareModalOpen(false)} className="bg-white text-slate-900 font-bold py-2 px-6 rounded-full hover:bg-slate-200 transition-colors">Done</button></div>
                    </div>
                </div>
            )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default MagazinePage;