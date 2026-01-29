
import React, { useState, useEffect, useRef } from 'react';
import { 
    UploadCloud, ArrowRight, CheckCircle, Loader2, Sparkles, 
    ShieldCheck, Download, HardDrive, UserPlus, Bot, Edit3, 
    RotateCcw, Check, X, ImageIcon, Calendar
} from 'lucide-react';
import AeternyAvatarDisplay from './AeternyAvatarDisplay';
import { createDemoStoryFromImages } from '../services/geminiService';
import { Moment, UserTier } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface OnboardingPageProps {
    onComplete: (moment: Omit<Moment, 'id' | 'pinned'>) => void;
    aeternyAvatar: string | null;
    userTier: UserTier;
}

const TypewriterText: React.FC<{ text: string; delay?: number; onComplete?: () => void }> = ({ text, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        const startTimeout = setTimeout(() => {
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, index + 1));
                index++;
                if (index === text.length) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, 30); // Speed of typing
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [text, delay, onComplete]);

    return <span>{displayedText}</span>;
};

const processImageFile = async (file: File): Promise<{ data: string; mimeType: string }> => {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    if (supportedTypes.includes(file.type)) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
                data: (reader.result as string).split(',')[1],
                mimeType: file.type
            });
            reader.onerror = error => reject(error);
        });
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context unavailable'));
                ctx.drawImage(img, 0, 0);
                const jpegUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve({ 
                    data: jpegUrl.split(',')[1], 
                    mimeType: 'image/jpeg' 
                });
            };
            img.onerror = () => reject(new Error('Failed to load image for conversion'));
            img.src = event.target?.result as string;
        };
        reader.onerror = error => reject(error);
    });
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, aeternyAvatar, userTier }) => {
    const [step, setStep] = useState<'intro' | 'upload' | 'processing' | 'review' | 'trust' | 'sovereignty'>('intro');
    const [dialogue, setDialogue] = useState<string>("Hello. I am æterny.");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStory, setEditedStory] = useState('');
    
    // Trust Setup State
    const [stewardName, setStewardName] = useState('');
    const [stewardEmail, setStewardEmail] = useState('');

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sequence the intro
    useEffect(() => {
        if (step === 'intro') {
            setTimeout(() => {
                setDialogue("I exist to ensure your most precious stories outlive time.");
            }, 2500);
            setTimeout(() => {
                setDialogue("To begin your legacy, simply share one memory that matters to you. I will handle the rest.");
                setTimeout(() => setStep('upload'), 3000);
            }, 6000);
        }
    }, [step]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(await fileToDataUrl(file));
            setStep('processing');
            processAndGenerate(file);
        }
    };

    const processAndGenerate = async (file: File) => {
        try {
            setDialogue("Observing the details...");
            await new Promise(r => setTimeout(r, 1500)); 
            
            setDialogue("Weaving the narrative...");
            const imagePayload = await processImageFile(file);
            const result = await createDemoStoryFromImages([imagePayload], undefined, 'nostalgic', true);
            
            setGeneratedContent(result);
            setEditedStory(result.story);
            setDialogue("Here is the start of your journey.");
            setStep('review');
        } catch (error) {
            console.error("Onboarding generation error", error);
            setDialogue("I had a momentary lapse connecting to the archives. Please try again.");
            setStep('upload');
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleRedo = () => {
        if (!selectedFile) return;
        setStep('processing');
        processAndGenerate(selectedFile);
    };

    const handleMomentConfirmed = () => {
        if (userTier === 'lægacy') {
            setDialogue("As a Lægacy member, you have access to the Trust protocol.");
            setStep('trust');
        } else {
            setDialogue("One final thing before we begin.");
            setStep('sovereignty');
        }
    };

    const handleTrustSetup = (e: React.FormEvent) => {
        e.preventDefault();
        setDialogue("Protocol active. Your steward has been notified.");
        setTimeout(() => setStep('sovereignty'), 2000);
    };

    const handleSkipTrust = () => {
        setDialogue("Understood. We can set up the Protocol later.");
        setStep('sovereignty');
    };

    const handleFinish = () => {
        if (!generatedContent || !previewUrl) return;
        
        const newMoment: Omit<Moment, 'id' | 'pinned'> = {
            type: 'standard',
            aiTier: 'diamond',
            image: previewUrl,
            images: [previewUrl],
            title: generatedContent.title,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            description: editedStory,
            location: generatedContent.tags.location[0] || undefined,
            people: generatedContent.tags.people,
            activities: generatedContent.tags.activities,
            photoCount: 1
        };
        
        onComplete(newMoment);
    };

    const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-[#FDFBF7]';
    const textColor = theme === 'dark' ? 'text-white' : 'text-[#2D2A26]';
    const subTextColor = theme === 'dark' ? 'text-slate-400' : 'text-stone-500';
    const cardBg = theme === 'dark' ? 'bg-slate-800 border-white/10' : 'bg-white border-stone-200 shadow-xl';
    const inputBg = theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-stone-50 border-stone-300 text-stone-900';

    return (
        <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center p-6 transition-colors duration-500 overflow-y-auto`}>
            
            {/* Avatar & Dialogue Container */}
            <div className={`max-w-xl w-full flex flex-col items-center text-center space-y-8 ${step === 'review' ? 'mb-6' : 'mb-12'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 ${step === 'processing' ? 'scale-110 shadow-[0_0_40px_rgba(6,182,212,0.4)]' : 'shadow-xl'}`}>
                    <div className="relative w-full h-full">
                        <div className={`absolute inset-0 rounded-full border-2 border-cyan-500/30 ${step === 'processing' ? 'animate-ping' : ''}`}></div>
                        <AeternyAvatarDisplay avatar={aeternyAvatar} className="w-full h-full rounded-full ring-2 ring-white/10" />
                    </div>
                </div>
                
                <h1 className={`text-xl md:text-2xl font-brand font-bold leading-relaxed min-h-[3rem] ${textColor}`}>
                    "<TypewriterText text={dialogue} key={dialogue} />"
                </h1>
            </div>

            {/* Interaction Area */}
            <div className={`w-full ${step === 'review' ? 'max-w-3xl' : 'max-w-md'} animate-fade-in-up`}>
                
                {step === 'upload' && (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer group relative aspect-square rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'border-slate-700 hover:border-cyan-500/50 hover:bg-slate-900' : 'border-stone-300 hover:border-cyan-500/50 hover:bg-stone-50'}`}
                    >
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-cyan-400" />
                        </div>
                        <p className={`font-brand font-bold ${textColor}`}>Select a Memory</p>
                        <p className={`text-sm mt-2 ${subTextColor}`}>Share a photo to begin your story</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileSelect} 
                        />
                    </div>
                )}

                {step === 'processing' && previewUrl && (
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <img src={previewUrl} alt="Processing" className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center flex-col bg-black/40">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                            <Bot className="w-8 h-8 text-white animate-pulse" />
                            <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] mt-4">Weaving Neural Narrative</p>
                        </div>
                    </div>
                )}

                {step === 'review' && generatedContent && previewUrl && (
                    <div className="space-y-6 animate-fade-in">
                        <div className={`${cardBg} rounded-[2.5rem] overflow-hidden border shadow-3xl flex flex-col md:flex-row transition-all duration-500`}>
                            {/* Visual Side */}
                            <div className="w-full md:w-2/5 aspect-[4/5] relative overflow-hidden bg-slate-900 border-b md:border-b-0 md:border-r border-white/10">
                                <img src={previewUrl} alt="Generated" className="w-full h-full object-cover animate-ken-burns-slow" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[8px] font-black uppercase text-cyan-400 tracking-widest px-2 py-0.5 bg-cyan-400/10 rounded-full border border-cyan-400/20">Initial Memory</span>
                                    </div>
                                    <h2 className="text-white font-bold text-2xl font-brand tracking-tighter leading-tight">{generatedContent.title}</h2>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5"><Calendar size={10}/> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-2">
                                            <Bot size={14} className="text-cyan-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">æterny Synthesis</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => setIsEditing(!isEditing)} className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 ${isEditing ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}>
                                                {isEditing ? <><Check size={12}/> Done</> : <><Edit3 size={12}/> Edit</>}
                                            </button>
                                            <button onClick={handleRedo} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                                <RotateCcw size={12}/> Redo
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {isEditing ? (
                                        <textarea 
                                            autoFocus
                                            value={editedStory}
                                            onChange={e => setEditedStory(e.target.value)}
                                            className="w-full h-64 bg-black/20 rounded-2xl p-4 text-slate-200 font-serif italic text-lg leading-relaxed border border-cyan-500/30 outline-none focus:ring-0"
                                        />
                                    ) : (
                                        <div className={`text-slate-300 font-serif italic text-lg md:text-xl leading-relaxed animate-fade-in max-h-[300px] overflow-y-auto custom-scrollbar pr-4`}>
                                            "{editedStory}"
                                        </div>
                                    )}
                                </div>

                                <div className="pt-8">
                                    <button 
                                        onClick={handleMomentConfirmed}
                                        className="w-full bg-white hover:bg-cyan-50 text-slate-950 font-black py-5 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                                    >
                                        <CheckCircle size={18} />
                                        {userTier === 'lægacy' ? 'Continue to Legacy Setup' : 'Save to Timeline'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'trust' && (
                    <div className={`${cardBg} rounded-[2.5rem] p-10 border shadow-2xl animate-fade-in`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-brand font-bold ${textColor}`}>Legacy Protocol</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Security Guarantee</p>
                            </div>
                        </div>
                        <p className={`${subTextColor} text-base mb-8 leading-relaxed font-serif italic`}>
                            "Your story is an inheritance. Appoint a <strong>Steward</strong>—someone you trust to carry your story forward if you are ever offline."
                        </p>
                        
                        <form onSubmit={handleTrustSetup} className="space-y-5">
                            <div>
                                <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ml-1 ${subTextColor}`}>Successor Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={stewardName}
                                    onChange={(e) => setStewardName(e.target.value)}
                                    placeholder="e.g. Sarah Doe"
                                    className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${inputBg}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ml-1 ${subTextColor}`}>Verified Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={stewardEmail}
                                    onChange={(e) => setStewardEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${inputBg}`}
                                />
                            </div>
                            
                            <div className="pt-6 flex flex-col gap-4">
                                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-4 rounded-xl shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest transition-all transform hover:scale-[1.02]">
                                    <UserPlus className="w-4 h-4" /> Appoint Successor
                                </button>
                                <button type="button" onClick={handleSkipTrust} className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors ${subTextColor}`}>
                                    Setup later in settings
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'sovereignty' && (
                    <div className={`${cardBg} rounded-[2.5rem] p-12 border shadow-2xl animate-fade-in text-center`}>
                        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/5">
                            <HardDrive className={`w-10 h-10 ${isDark ? 'text-cyan-400' : 'text-slate-700'}`} />
                        </div>
                        <h2 className={`text-3xl font-brand font-bold mb-4 ${textColor}`}>Sovereignty Guaranteed.</h2>
                        <p className={`${subTextColor} leading-relaxed mb-10 font-serif text-lg`}>
                            "This vault is your property. Every story, original photo, and neural metadata can be exported at any moment."
                        </p>
                        
                        <div className={`p-6 rounded-2xl border mb-12 flex items-center justify-between text-left ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200 shadow-inner'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    <Download className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold font-brand ${textColor}`}>Secure Export</p>
                                    <p className={`text-[10px] uppercase font-black tracking-widest text-slate-500`}>Absolute Data Ownership</p>
                                </div>
                            </div>
                            <div className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${theme === 'dark' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-green-600/30 text-green-700 bg-green-50'}`}>
                                Verified
                            </div>
                        </div>

                        <button 
                            onClick={handleFinish}
                            className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-cyan-900/40 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] text-xs uppercase tracking-[0.2em]"
                        >
                            Enter The Chronicle <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OnboardingPage;
