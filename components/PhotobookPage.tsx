import React from 'react';
import { Page } from '../types';
import { ArrowLeft, Book, Sparkles, Truck, QrCode, Smartphone, Waves, Film } from 'lucide-react';

interface PhotobookPageProps {
  onNavigate: (page: Page) => void;
}

const PhotobookPage: React.FC<PhotobookPageProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in-up bg-slate-950 min-h-screen text-white">
      <section className="relative h-[50vh] flex items-center justify-center text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Photobook background" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="relative z-10 p-6">
          <button onClick={() => onNavigate(Page.Shop)} className="absolute top-[-4rem] left-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/20 text-white font-semibold py-2 px-4 rounded-full text-sm transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Creation Suite
          </button>
          <h1 className="text-4xl md:text-6xl font-bold font-brand tracking-tighter" style={{textShadow: '0 2px 15px rgba(0,0,0,0.5)'}}>Hærloom Photobooks</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-4 font-serif italic" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
            "Turn your digital legacy into a tangible masterpiece. museum-quality paper, handcrafted binding, and interactive neural anchors."
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-center">
            <div className="flex flex-col items-center bg-slate-900/40 p-8 rounded-3xl border border-white/5">
                <Book className="w-10 h-10 text-cyan-400 mb-4"/>
                <h3 className="text-xl font-bold text-white mb-2">Archival Quality</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Premium linen covers, 200gsm archival paper, and layflat binding designed to endure for 100 years.</p>
            </div>
            <div className="flex flex-col items-center bg-slate-900/40 p-8 rounded-3xl border border-white/5">
                <Sparkles className="w-10 h-10 text-cyan-400 mb-4"/>
                <h3 className="text-xl font-bold text-white mb-2">AI-Driven Layouts</h3>
                <p className="text-slate-400 text-sm leading-relaxed">æterny curates your artifacts into emotional arcs, intelligently suggesting the perfect pairings and pacing.</p>
            </div>
             <div className="flex flex-col items-center bg-slate-900/40 p-8 rounded-3xl border border-white/5">
                <QrCode className="w-10 h-10 text-indigo-400 mb-4"/>
                <h3 className="text-xl font-bold text-white mb-2">QR Bridge™ Technology</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Embed digital links directly on the paper. Scan a page to hear your voice or watch a memory come to life.</p>
            </div>
        </div>

        {/* --- THE QR BRIDGE FEATURE SHOWCASE --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1 relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                <div className="relative bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-3xl">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner ring-1 ring-indigo-500/30">
                            <QrCode size={24} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-brand text-white tracking-tight">The æternacy Bridge™</h2>
                     </div>
                     <p className="text-slate-300 text-lg font-serif italic leading-relaxed mb-8">
                        "We believe a photo is just the surface. With QR Bridge™, your printed book becomes a gateway to the deep data of your life."
                     </p>
                     <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Waves size={16}/></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Spoken Narration</h4>
                                <p className="text-slate-500 text-xs">Don't just read about the moment; scan to hear the original audio from your capture session.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Film size={16}/></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Living Reflections</h4>
                                <p className="text-slate-500 text-xs">Scanning a group photo can trigger an AI-generated cinematic video of that entire event.</p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col justify-center">
                 <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
                     <img src="https://images.pexels.com/photos/1906435/pexels-photo-1906435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Photobook mockup" className="w-full h-full object-cover"/>
                     <div className="absolute bottom-6 right-6 w-16 h-16 bg-white p-2 shadow-2xl rotate-3">
                        <QrCode size={48} className="text-slate-900" />
                     </div>
                 </div>
                 <p className="text-center text-slate-500 text-xs uppercase tracking-widest font-black">Interactive Preview: Hover to Scan</p>
            </div>
        </section>

        <div className="mt-20 text-center bg-indigo-950/20 rounded-[3rem] border border-indigo-500/20 p-12 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-brand text-white mb-4 tracking-tight">Your Memories, in Your Hands.</h2>
            <p className="text-slate-300 max-w-xl mx-auto my-6 font-medium">
                Physical book creation is an exclusive service for Lægacy members. Every book includes a permanent **QR Bridge™** subscription to ensure your links never break.
            </p>
            <button className="bg-amber-600 hover:bg-amber-400 text-slate-900 font-black py-4 px-12 rounded-2xl text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-xl shadow-amber-900/40">
                Upgrade to Lægacy
            </button>
        </div>
      </div>
    </div>
  );
};

export default PhotobookPage;