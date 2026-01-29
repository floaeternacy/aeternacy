import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { 
    ArrowLeft, Clock, User, Tag, ChevronRight, X, BookOpen, 
    Share2, ArrowUpRight, ArrowRight, Mail, Sparkles, 
    Bot, Bookmark, History, Landmark, ShieldCheck, 
    Waves, Quote, Fingerprint
} from 'lucide-react';
import { fetchPexelsImages } from '../services/pexelsService';
import { useTheme } from '../contexts/ThemeContext';
import BrandLogo from './BrandLogo';
import { getOptimizedUrl } from '../services/cloudinaryService';
import { ASSETS } from '../data/assets';

interface ArticlesPageProps {
  onNavigate: (page: Page) => void;
}

interface Article {
    id: string;
    title: string;
    subtitle: string;
    author: string;
    readTime: string;
    category: string;
    image: string;
    content: React.ReactNode;
    featured?: boolean;
    date: string;
    archivalId: string;
}

const ArticleContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="prose prose-2xl prose-invert max-w-none 
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-serif prose-p:text-xl md:prose-p:text-2xl prose-p:mb-10
        prose-headings:font-brand prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tighter
        prose-h3:text-3xl md:prose-h3:text-4xl prose-h3:mt-20 prose-h3:mb-8
        prose-strong:text-cyan-400 prose-strong:font-black
        prose-blockquote:border-l-0 prose-blockquote:bg-white/[0.02] prose-blockquote:p-12 prose-blockquote:rounded-[2.5rem] prose-blockquote:border prose-blockquote:border-white/5 prose-blockquote:italic prose-blockquote:text-white prose-blockquote:my-16
        prose-li:text-slate-300 prose-li:marker:text-cyan-500">
        {children}
    </div>
);

const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [activeArticle, setActiveArticle] = useState<Article | null>(null);
    const [readingProgress, setReadingProgress] = useState(0);
    const [email, setEmail] = useState('');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(progress);
    };

    useEffect(() => {
        const loadContent = async () => {
            const articlesData: Article[] = [
                {
                    id: 'psychology-memory',
                    archivalId: 'RE-001',
                    title: "The Architecture of Remembrance",
                    subtitle: "Why we forget, and why a digital vault acts as a second hippocampus for the human mind.",
                    author: "Dr. Elena Vance",
                    readTime: "6 min read",
                    category: "Psychology",
                    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
                    date: "OCT 12, 2026",
                    featured: true,
                    content: (
                        <ArticleContent>
                            <p className="first-letter:text-7xl first-letter:font-black first-letter:text-white first-letter:float-left first-letter:mr-4 first-letter:mt-1 first-letter:font-brand">
                                Human memory is not a video recorder. It is a reconstruction—a fragile, biological act of storytelling that degrades every time we access it. Neuroscientists call this the "Forgetting Curve," a phenomenon where nearly 70% of new information is lost within 24 hours without reinforcement.
                            </p>
                            <p>For centuries, we relied on oral traditions, then written journals, and finally, photography to arrest this decay. But in the digital age, we face a paradox: we have more data, but less <strong>meaning</strong>.</p>
                            <h3>The Digital Hippocampus</h3>
                            <p>æternacy represents a shift in how we approach this biological limitation. By moving beyond static storage—clouds full of unsorted JPEGs—to <strong>active curation</strong>, we are essentially building an external hippocampus.</p>
                            <blockquote>"We do not remember days, we remember moments. The enrichment of these moments with context—voice, emotion, location—creates a cognitive anchor that resists the erosion of time."</blockquote>
                            <p>When you record a voice note attached to a photo in the Biografær, you are engaging in <em>dual-coding</em>. You are storing the visual and the auditory, weaving a stronger neural pathway. The AI doesn't just store the file; it analyzes the sentiment, connects it to related memories, and presents it back to you, reinforcing the neural trace.</p>
                        </ArticleContent>
                    )
                },
                {
                    id: 'future-ancestry',
                    archivalId: 'TE-042',
                    title: "Beyond the Static Image: The Rise of Living Ancestry",
                    subtitle: "How spatial computing and AI are transforming the way future generations will meet us.",
                    author: "Flo",
                    readTime: "5 min read",
                    category: "Future Tech",
                    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bc3c?q=80&w=2000&auto=format&fit=crop",
                    date: "NOV 04, 2026",
                    content: (
                        <ArticleContent>
                            <p>Imagine standing in your childhood living room. The sun is streaming through the window exactly as it did in 1995. You turn around, and there is your grandfather, sitting in his favorite chair, telling you the story of how he met your grandmother. You aren't watching a video; you are <em>there</em>.</p>
                            <p>This is the promise of the <strong>Hypermemory Lab</strong> and the future of ancestry.</p>
                            <h3>From 2D to Presence</h3>
                            <p>For the last century, our legacy has been trapped in two dimensions. Photographs and flat video. But with the advent of Gaussian Splatting and spatial computing (VR/AR), we are crossing a threshold. We are moving from <em>viewing</em> history to <em>inhabiting</em> it.</p>
                        </ArticleContent>
                    )
                },
                {
                    id: 'stewardship-guide',
                    archivalId: 'GU-012',
                    title: "The Ethics of Stewardship",
                    subtitle: "What it means to hold the keys to another person's digital soul.",
                    author: "Marcus Thorne",
                    readTime: "8 min read",
                    category: "Governance",
                    image: "https://images.unsplash.com/photo-1533512930330-4ac257c86793?q=80&w=2000&auto=format&fit=crop",
                    date: "NOV 12, 2026",
                    content: (
                        <ArticleContent>
                            <p>Appointing a Steward is the final act of legacy planning. It is a transition of trust from the living to the future. But what are the responsibilities of the Steward? At æternacy, we believe stewardship is a sacred curation.</p>
                        </ArticleContent>
                    )
                }
            ];
            setArticles(articlesData);
        };
        loadContent();
    }, []);

    const featured = articles.find(a => a.featured);
    const standard = articles.filter(a => !a.featured);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} text-white font-sans overflow-x-hidden selection:bg-cyan-500/30`}>
            
            {/* INSTITUTIONAL NAVIGATION */}
            <nav className="fixed top-0 left-0 right-0 z-[100] p-6 md:p-10 flex justify-between items-center transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-[#050811] to-transparent h-32 pointer-events-none opacity-80" />
                <button 
                    onClick={() => onNavigate(Page.Landing)}
                    className="relative flex items-center gap-4 group z-10"
                >
                    <BrandLogo className="text-2xl" showTrademark={false} />
                    <span className="h-4 w-px bg-white/20 hidden md:block"></span>
                    <span className="font-serif italic text-xl text-slate-400 hidden md:block group-hover:text-white transition-colors">Journal</span>
                </button>

                <button 
                    onClick={() => onNavigate(Page.Home)}
                    className="relative z-10 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                    Return to Portal
                </button>
            </nav>

            <main>
                {/* CINEMATIC FEATURED HERO */}
                {featured && (
                    <section 
                        className="relative h-[95vh] w-full flex flex-col justify-end overflow-hidden group cursor-pointer"
                        onClick={() => setActiveArticle(featured)}
                    >
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={getOptimizedUrl(featured.image, 1920)} 
                                className="w-full h-full object-cover brightness-[0.6] transition-transform duration-[15s] ease-linear group-hover:scale-110" 
                                alt="" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/20 to-transparent" />
                        </div>

                        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-24 md:pb-32">
                            <div className="max-w-5xl animate-fade-in-up">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="px-4 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-sm">Featured Narrative</div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                        <Clock size={14} className="text-cyan-500" /> {featured.readTime}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hidden sm:block">Archive ID: {featured.archivalId}</span>
                                </div>
                                <h1 className="text-6xl md:text-[8rem] font-brand font-bold text-white leading-[0.88] tracking-tighter mb-10 drop-shadow-3xl">
                                    {featured.title}
                                </h1>
                                <p className="text-xl md:text-3xl text-slate-300 font-serif italic max-w-3xl leading-relaxed opacity-90 mb-12">
                                    "{featured.subtitle}"
                                </p>
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white group-hover:translate-x-2 transition-transform duration-500">
                                    Enter Reflection <ArrowRight size={20} className="text-cyan-400" />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* INSTITUTIONAL ARTICLE GRID */}
                <section className="container mx-auto px-6 md:px-12 py-32 md:py-48 max-w-[1400px]">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-white/5 pb-12 gap-8">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-4">The Ledger</h2>
                            <h3 className="text-4xl md:text-7xl font-brand font-bold text-white tracking-tighter">Journal of the Centennial.</h3>
                        </div>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                            <button className="text-white border-b-2 border-cyan-500 pb-1">All Records</button>
                            <button className="hover:text-white transition-colors pb-1">Psychology</button>
                            <button className="hover:text-white transition-colors pb-1">Future Tech</button>
                            <button className="hover:text-white transition-colors pb-1">Governance</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                        {standard.map((article, idx) => (
                            <article 
                                key={article.id}
                                className="group cursor-pointer flex flex-col h-full animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.15}s` }}
                                onClick={() => setActiveArticle(article)}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-10 bg-slate-900 shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                                    <img src={getOptimizedUrl(article.image, 800)} className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-80" />
                                    <div className="absolute top-6 left-6">
                                        <div className="bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                                            {article.category}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-2">{article.date}</p>
                                        <h4 className="text-2xl md:text-3xl font-brand font-bold text-white tracking-tighter leading-none group-hover:text-cyan-100 transition-colors">
                                            {article.title}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex-grow space-y-4 px-2">
                                    <p className="text-slate-400 font-serif italic text-lg leading-relaxed line-clamp-3">
                                        "{article.subtitle}"
                                    </p>
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                                                {article.author.charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{article.author}</span>
                                        </div>
                                        <ArrowUpRight size={18} className="text-slate-700 group-hover:text-cyan-400 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* THE DISPATCH (Newsletter) */}
                <section className="py-40 bg-[#02040A] border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-950/10 rounded-full blur-[160px] pointer-events-none" />
                    
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                            <div className="lg:col-span-7 space-y-10">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                                    <Waves size={14} className="text-cyan-500 animate-pulse" /> The Weekly Dispatch
                                </div>
                                <h2 className="text-5xl md:text-[6.5rem] font-brand font-bold text-white tracking-tighter leading-[0.9]">
                                    Join the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">Continuity.</span>
                                </h2>
                                <p className="text-xl md:text-3xl text-slate-400 font-serif italic leading-relaxed max-w-2xl">
                                    "Insights on memory science, archival philosophy, and the future of human legacy. Secured in your inbox every Sunday morning."
                                </p>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-3xl">
                                    <div className="space-y-8">
                                        <div className="relative">
                                            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
                                            <input 
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Vault ID / Email Address"
                                                className="w-full bg-transparent border-b-2 border-white/10 py-6 pl-12 text-xl md:text-2xl text-white placeholder:text-slate-800 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
                                            />
                                        </div>
                                        <button 
                                            className="w-full h-20 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                                        >
                                            Establish Sync <ArrowRight size={20} />
                                        </button>
                                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                                            Centennial Outreach v14.2 • GDPR Sovereign
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#050811] py-24 border-t border-white/5">
                <div className="container mx-auto px-6 text-center space-y-10">
                    <BrandLogo className="text-2xl opacity-20 grayscale mx-auto" showTrademark={false} />
                    <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                        <button onClick={() => onNavigate(Page.About)} className="hover:text-white transition-colors">Origins</button>
                        <button onClick={() => onNavigate(Page.TrustCenter)} className="hover:text-white transition-colors">Security</button>
                        <button onClick={() => onNavigate(Page.Legal)} className="hover:text-white transition-colors">Charter</button>
                    </div>
                    <p className="text-[9px] font-bold text-slate-800 uppercase tracking-[0.6em]">EST. 2026 • DIGITAL ARCHIVAL INSTITUTION</p>
                </div>
            </footer>

            {/* HIGH-END ARTICLE READER OVERLAY */}
            {activeArticle && (
                <div 
                    className="fixed inset-0 z-[200] bg-[#050811] overflow-y-auto animate-fade-in custom-scrollbar"
                    onScroll={handleScroll}
                >
                    {/* Pulsing Progress Bar */}
                    <div 
                        className="fixed top-0 left-0 h-1 bg-cyan-500 z-[210] transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                        style={{ width: `${readingProgress}%` }}
                    />

                    {/* Minimalist Reader Toolbar */}
                    <nav className="sticky top-0 left-0 right-0 z-[205] h-20 px-6 md:px-10 flex justify-between items-center bg-[#050811]/90 backdrop-blur-2xl border-b border-white/5">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => setActiveArticle(null)}
                                className="p-3 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hidden sm:block">
                                Journal: {activeArticle.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="text-slate-500 hover:text-white transition-colors"><Share2 size={20} /></button>
                            <button className="text-slate-500 hover:text-white transition-colors"><Bookmark size={20} /></button>
                        </div>
                    </nav>

                    {/* Article Content Stage */}
                    <div className="container mx-auto px-6 py-20 md:py-32 max-w-4xl">
                        <header className="mb-24 text-center space-y-10 animate-fade-in-up">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                <History size={14} /> Publication Record: {activeArticle.date}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-brand font-bold text-white tracking-tighter leading-[0.9]">
                                {activeArticle.title}
                            </h1>
                            <p className="text-2xl md:text-4xl text-slate-400 font-serif italic leading-relaxed max-w-3xl mx-auto">
                                "{activeArticle.subtitle}"
                            </p>
                            
                            <div className="flex items-center justify-center gap-6 pt-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 font-black text-lg border border-white/10 shadow-inner">
                                    {activeArticle.author.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Author</p>
                                    <p className="text-base font-bold text-white uppercase">{activeArticle.author}</p>
                                </div>
                                <div className="h-10 w-px bg-white/5 mx-2"></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Duration</p>
                                    <p className="text-base font-bold text-white uppercase">{activeArticle.readTime}</p>
                                </div>
                            </div>
                        </header>

                        <div className="relative mb-24 rounded-[3.5rem] overflow-hidden shadow-3xl border border-white/5">
                            <img src={getOptimizedUrl(activeArticle.image, 1600)} className="w-full h-auto aspect-video object-cover" alt="" />
                            <div className="absolute inset-0 shadow-inner pointer-events-none" />
                        </div>

                        <article className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            {activeArticle.content}
                        </article>

                        <div className="mt-40 pt-20 border-t border-white/5 text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mb-10">End of Record</h4>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                                <button 
                                    onClick={() => setActiveArticle(null)}
                                    className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-cyan-50 shadow-2xl transition-all active:scale-95"
                                >
                                    Browse Ledger
                                </button>
                                <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-3">
                                    <Fingerprint size={16} className="text-cyan-400" /> Verify Authenticity
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticlesPage;