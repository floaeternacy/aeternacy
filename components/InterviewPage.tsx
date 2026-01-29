
import React, { useState, useRef, useEffect } from 'react';
import { AeternyVoice, AeternyStyle, UserTier, Moment } from '../types';
import { ArrowRight, X, Bot } from 'lucide-react';
import { startGenericAeternyChat, continueAeternyChat } from '../services/geminiService';
import { PresenceGlow } from './AeternyFab';

interface InterviewPageProps {
    onComplete: (momentId?: number) => void;
    aeternyAvatar: string | null;
    aeternyVoice: AeternyVoice;
    setAeternyVoice: (voice: AeternyVoice) => void;
    aeternyStyle: AeternyStyle;
    setAeternyStyle: (style: AeternyStyle) => void;
    onCreateFirstMoment: (momentData: Omit<Moment, 'id' | 'pinned'>) => Moment;
    showToast: (message: string, type: 'info' | 'success' | 'error') => void;
    userTier: UserTier;
}

const InterviewPage: React.FC<InterviewPageProps> = ({ 
    onComplete, 
    onCreateFirstMoment, 
    showToast, 
    userTier 
}) => {
    const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            setIsInitializing(true);
            try {
                const { chat, initialMessage } = await startGenericAeternyChat("Warm & Empathetic", userTier);
                chatRef.current = chat;
                setMessages([{ sender: 'ai', text: initialMessage || "Hello. I am æterny, your personal companion. I am here to help you weave the threads of your life. Tell me, what is a memory that makes you feel exactly like who you are?" }]);
            } catch (err) {
                console.error("Failed to initialize æterny session", err);
                setMessages([{ sender: 'ai', text: "Hello. I am æterny. My neural links are stabilizing. Tell me, what is a memory that defines you?" }]);
            } finally {
                setIsInitializing(false);
            }
        };
        initChat();
    }, [userTier]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await continueAeternyChat(chatRef.current, userMsg);
            setMessages(prev => [...prev, { sender: 'ai', text: response }]);
            
            // Auto-complete onboarding after a meaningful exchange
            if (messages.length >= 6) {
                 setTimeout(() => {
                     onCreateFirstMoment({
                         type: 'standard',
                         aiTier: 'diamond',
                         title: 'Foundational Dialogue',
                         date: new Date().toLocaleDateString(),
                         description: "Our opening dialogue, establishing the pillars of my digital legacy through empathic exchange.",
                         photoCount: 0,
                         people: ['Me', 'æterny'],
                         activities: ['Legacy Founding']
                     });
                     showToast("Initial chapter established.", "success");
                     onComplete();
                 }, 4000);
            }
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: "My apologies, a neural ripple occurred. Could you repeat that?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-[#020617] overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-transparent to-[#050811] z-10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050811_100%)] z-10"></div>
            </div>

            <div className="relative z-20 w-full max-w-4xl flex flex-col items-center">
                {/* Standardized Exit Artifact */}
                <button 
                    onClick={() => onComplete()} 
                    className="absolute top-0 right-0 p-6 text-slate-500 hover:text-white transition-all transform hover:rotate-90"
                    aria-label="Exit Wizard"
                >
                    <X size={28} />
                </button>

                <div className="mb-16">
                    <PresenceGlow active={!isInitializing} intensity={isLoading ? 0.8 : 0.2} size="lg" />
                </div>

                <div className="w-full max-w-2xl text-center space-y-12">
                    <div className="min-h-[140px] flex items-center justify-center">
                        {isInitializing ? (
                            <p className="text-cyan-500 font-black uppercase tracking-[0.6em] animate-pulse text-xs">Connecting...</p>
                        ) : (
                            <p className="text-2xl md:text-5xl font-serif italic leading-tight text-white drop-shadow-2xl animate-fade-in px-4">
                                "{messages[messages.length-1]?.text || '...'}"
                            </p>
                        )}
                    </div>

                    <div className={`relative w-full transition-all duration-1000 ${isInitializing ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] px-8 py-2 shadow-3xl">
                            <input 
                                className="flex-1 bg-transparent py-6 text-xl text-white placeholder-slate-700 outline-none focus:ring-0"
                                placeholder="Speak into the archive..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                disabled={isLoading || isInitializing}
                                autoFocus
                            />
                            <button onClick={handleSend} className={`p-5 rounded-2xl transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-800 text-slate-600'}`}>
                                <ArrowRight size={28} />
                            </button>
                        </div>
                        <p className="mt-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">æternacy™ sovereign link active</p>
                    </div>
                </div>
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
};

export default InterviewPage;
