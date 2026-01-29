import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { ArrowLeft, ShieldCheck, Globe, Scale, Lock, HeartHandshake, History, FileText, Fingerprint, Eye, Landmark, Compass, Award, Download, BrainCircuit } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useTheme } from '../contexts/ThemeContext';
import PageHeader from './PageHeader';

interface LegalPageProps {
  onNavigate: (page: Page) => void;
}

const CharterArticle: React.FC<{ 
    number: string; 
    title: string; 
    content: string; 
    icon: React.ElementType 
}> = ({ number, title, content, icon: Icon }) => (
    <div className="group border-t border-white/5 pt-12 pb-16 transition-all hover:bg-white/[0.01]">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/3">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                        <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Directive {number}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-brand text-white leading-tight pr-4 tracking-tighter">
                    {title}
                </h3>
            </div>
            <div className="md:w-2/3">
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-serif opacity-90 group-hover:opacity-100 transition-opacity">
                    {content}
                </p>
            </div>
        </div>
    </div>
);

const LegalPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
    const { theme } = useTheme();
    const [scrolled, setScrolled] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrolled(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-cyan-500/30 font-sans">
            <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-600 to-blue-500 z-[100] transition-all duration-150" style={{ width: `${scrolled}%` }}></div>

            <PageHeader 
                title="Sovereignty Charter" 
                onBack={() => onNavigate(Page.Landing)}
                backLabel="LANDING"
                backVariant="breadcrumb"
                className="fixed top-0 left-0 right-0 z-50"
            />

            <main className="container mx-auto px-6 pt-48 pb-32 max-w-6xl">
                <div className="mb-32 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <Award size={14} className="animate-pulse" /> The Centennial Protocol
                    </div>
                    <h1 className="text-6xl md:text-9xl font-brand font-bold text-white mb-8 tracking-tighter leading-[0.85]">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Charter</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-slate-400 max-w-3xl mx-auto font-serif italic leading-relaxed opacity-80">
                        "Memory is the DNA of human identity. We exist to ensure that your essence survives the technical and temporal entropy of the 21st century."
                    </p>
                </div>

                <div className="space-y-0">
                    <CharterArticle 
                        number="01"
                        title="Absolute Digital Sovereignty"
                        icon={Globe}
                        content="æternacy™ operates as a custodian, never an owner. Under international data protection standards (including GDPR, CCPA, and LGPD), you retain absolute IP rights. We explicitly renounce any claim to sub-license or 'train' global AI models using your artifacts. Your vault is a private silo, cryptographically severed from the public web."
                    />

                    <CharterArticle 
                        number="02"
                        title="Zero-Training Mandate & Private RAG"
                        icon={BrainCircuit}
                        content="We distinguish between 'Training' and 'Retrieval.' Global neural weights are never modified by user data. Instead, æterny utilizes Isolated Retrieval-Augmented Generation (RAG). Each user possesses a private Vector Silo. This mathematical index exists only within your vault, enabling personalized intelligence that remains 100% ephemeral to the base model. If you delete your vault, the index is purged instantly."
                    />

                    <CharterArticle 
                        number="03"
                        title="Endowment Escrow Protection"
                        icon={HeartHandshake}
                        content="The Foundational Endowment (€1,999) is not a service fee; it is an infrastructure pre-payment. 40% of these funds are legally ring-fenced in the æternacy™ Global Sustainability Fund, an independent trust designed to pre-fund the underlying storage and compute costs for the full 10-year term."
                    />

                    <CharterArticle 
                        number="04"
                        title="Architectural Independence"
                        icon={Lock}
                        content="Our platform is designed for 'Graceful Decoupling.' Every artifact is stored with standard, open-source metadata. In a sunset event, we guarantee a 12-month window for the export of a 'Sovereign Timeline'—an offline package requiring zero æternacy infrastructure to run."
                    />
                </div>
            </main>
        </div>
    );
};

export default LegalPage;