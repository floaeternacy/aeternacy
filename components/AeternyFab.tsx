
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Message, Page, Moment, UserTier } from '../types';
import { 
    X, Bot, 
    Sparkles, 
    Send, Waves,
    Maximize2,
    Mic,
    Shrink,
    Volume2,
    VolumeX,
    ArrowRight,
    ArrowUpRight,
    Zap,
    Plus,
    History,
    Search
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AeternyAvatarDisplay from './AeternyAvatarDisplay';

interface AeternyFabProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (page: Page) => void;
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (override?: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  onPlayTts: (text: string) => void;
  isTtsPlaying: boolean;
  currentlyPlayingText: string | null;
  aeternyAvatar: string | null;
  onContextualSend: (prompt: string) => void;
  liveDisplay: { user: string; ai: string } | null;
  currentPage: Page;
  onTriggerGuide: () => void;
  moments: Moment[];
  userName?: string;
  userTier: UserTier;
  vocalIntensity?: number;
  hideTrigger?: boolean;
  onTriggerAction?: (action: string) => void;
}

interface ContextualHint {
    id: string;
    text: string;
    action: string;
    prompt?: string;
    targetPage?: Page;
    directAction?: string;
}

/**
 * MessageParser: Refined for navigation-heavy routing.
 */
const MessageParser: React.FC<{ 
    text: string; 
    onNavigate: (page: Page) => void; 
    onSuggest: (prompt: string) => void;
    isAI: boolean; 
}> = ({ text, onNavigate, onSuggest, isAI }) => {
    if (!isAI) return <p className="text-sm md:text-base leading-relaxed">{text}</p>;

    const cleanText = text
        .replace(/#{1,6}\s?/g, '') 
        .replace(/\*\*/g, '')      
        .replace(/^- /gm, '• ')
        .replace(/\[SYSTEM:.*?\]/g, '')
        .trim();

    const parts = cleanText.split(/(\[\[(?:GO|SUGGEST):.*?\]\])/g);

    return (
        <div className="space-y-4">
            <div className="font-serif italic text-lg md:text-xl leading-snug text-slate-200">
                {parts.map((part, i) => {
                    const goMatch = part.match(/\[\[GO:(.*?)\|(.*?)\]\]/);
                    if (goMatch) {
                        const pageKey = goMatch[1] as keyof typeof Page;
                        const label = goMatch[2];
                        const page = Page[pageKey] as unknown as Page;
                        return (
                            <div key={`go-wrap-${i}`} className="my-4">
                                <button
                                    onClick={() => onNavigate(page)}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all not-italic"
                                >
                                    {label} <ArrowUpRight size={14} strokeWidth={3} />
                                </button>
                            </div>
                        );
                    }
                    const suggestMatch = part.match(/\[\[SUGGEST:(.*?)\]\]/);
                    if (suggestMatch) return null;
                    return part;
                })}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {parts.map((part, i) => {
                    const suggestMatch = part.match(/\[\[SUGGEST:(.*?)\]\]/);
                    if (suggestMatch) {
                        const label = suggestMatch[1];
                        return (
                            <button
                                key={`suggest-${i}`}
                                onClick={() => onSuggest(label)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full font-bold text-[9px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
                            >
                                <Zap size={10} className="text-indigo-400 group-hover:animate-pulse" />
                                {label}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

const LuminousText: React.FC<{ text: string; isAI?: boolean }> = ({ text, isAI }) => {
    if (!isAI) return <span>{text}</span>;
    return (
        <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white bg-[length:200%_auto] animate-shimmer-flow">
                {text}
            </span>
        </span>
    );
};

export const PresenceGlow: React.FC<{ 
    active: boolean; 
    intensity: number; 
    size?: 'sm' | 'lg' | 'xl';
    hasSuggestion?: boolean;
}> = ({ active, intensity, size = 'sm', hasSuggestion }) => {
    const orbSize = size === 'lg' ? 'w-48 h-48 md:w-64 md:h-64' : size === 'xl' ? 'w-32 h-32' : 'w-16 h-16';
    const iconSize = size === 'lg' ? 48 : 22;

    return (
        <div className="relative group/glow flex items-center justify-center">
            <div 
                className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 mix-blend-screen
                    ${hasSuggestion ? 'bg-indigo-500/20 opacity-60 scale-150 animate-pulse' : active ? 'bg-cyan-500/30 opacity-40 scale-125' : 'opacity-0'}
                `}
                style={{ transform: active ? `scale(${1.2 + intensity * 0.5})` : undefined }}
            />
            <div 
                className={`relative ${orbSize} rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16, 1, 0.3, 1)] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border
                    ${active ? 'border-cyan-400/30 bg-[#0A0C14]/90' : hasSuggestion ? 'border-indigo-400/20 bg-indigo-950/40 backdrop-blur-xl' : 'border-white/10 bg-slate-900/60 backdrop-blur-md'}
                `}
                style={{ transform: active ? `scale(${1 + intensity * 0.1})` : undefined }}
            >
                <div className={`absolute inset-0 bg-gradient-to-tr ${hasSuggestion ? 'from-indigo-600/10' : 'from-cyan-600/5'} via-transparent to-white/5 opacity-50`} />
                <Bot 
                    size={iconSize} 
                    className={`${active ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : hasSuggestion ? 'text-indigo-200' : 'text-slate-500'} transition-all duration-700`} 
                    strokeWidth={1.5}
                />
            </div>
        </div>
    );
};

const AeternyFab: React.FC<AeternyFabProps> = (props) => {
  const {
    isOpen, onToggle, onNavigate, messages, input, onInputChange, onSend, isLoading,
    isRecording, onToggleRecording, liveDisplay, 
    vocalIntensity = 0, isTtsPlaying, isTtsEnabled, onToggleTts,
    hideTrigger = false, currentPage, moments, userName, onTriggerAction
  } = props;

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeHint, setActiveHint] = useState<ContextualHint | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleToggleFocus = () => {
    setIsFocusMode(prev => !prev);
  };

  const quickActions = [
    { label: "Upload Moment", page: Page.Create, prompt: "I want to anchor a new fragment.", icon: Plus },
    { label: "Relive Memories", page: Page.Chronicle, prompt: "Show me my timeline.", icon: History },
    { label: "Deep Search", page: Page.Discovery, prompt: "I'm looking for a specific memory.", icon: Search }
  ];

  useEffect(() => {
    if (isOpen) {
        setActiveHint(null);
        return;
    }

    const getContextualHint = (): ContextualHint | null => {
        const firstName = userName?.split(' ')[0] || "Friend";
        switch(currentPage) {
            case Page.Home:
                return moments.length < 3 ? 
                    { id: 'h1', text: `The archive is quiet, ${firstName}. Shall we anchor a new fragment?`, action: "Anchor Memory", targetPage: Page.Create } :
                    { id: 'h2', text: "Your recent chapters have a beautiful rhythm. View the neural insights?", action: "View Pulse", targetPage: Page.DataInsight };
            case Page.Chronicle:
                return { id: 'c1', text: "Overlapping threads detected. Weave a new Journæy?", action: "Weave Now", targetPage: Page.SmartCollection };
            case Page.House:
                return { id: 'ho1', text: "Invite a Steward to protect your vault?", action: "Invite Kin", targetPage: Page.House, directAction: 'OPEN_INVITE' };
            default: return null;
        }
    };

    // Logic for hint timing: 10s appearance delay and 8s auto-hide window
    let hideTimer: number;
    const showTimer = window.setTimeout(() => {
        const hint = getContextualHint();
        if (hint) {
            setActiveHint(hint);
            // Auto-hide the hint after 8 seconds if no interaction occurs
            hideTimer = window.setTimeout(() => {
                setActiveHint(null);
            }, 8000);
        }
    }, 10000);

    return () => {
        window.clearTimeout(showTimer);
        if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [currentPage, isOpen, moments.length, userName]);

  useEffect(() => {
    if (isOpen && !isRecording) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isOpen, isRecording]);

  const handleHintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeHint) return;

    if (activeHint.targetPage !== undefined) {
        // If we are already on the page and have a direct action, trigger it
        if (activeHint.targetPage === currentPage && activeHint.directAction) {
            onTriggerAction?.(activeHint.directAction);
        } else {
            // Navigate to the target page
            onNavigate(activeHint.targetPage);
            // Pass the intent to the next page mount if it has a direct action
            if (activeHint.directAction) {
                onTriggerAction?.(activeHint.directAction);
            }
        }
    } else if (activeHint.prompt) {
        onToggle();
        onSend(activeHint.prompt);
    }
    
    setActiveHint(null);
  };

  const isAeternyActive = isLoading || isTtsPlaying || isRecording;

  const renderFocusView = () => (
    <div className="fixed inset-0 z-[11000] flex flex-col items-center justify-center bg-[#02040A]/95 backdrop-blur-3xl animate-fade-in p-6">
        <button 
            onClick={() => { setIsFocusMode(false); }}
            className="absolute top-8 right-8 p-4 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90"
        >
            <Shrink size={24} />
        </button>

        <div className="w-full max-w-4xl flex flex-col items-center gap-12">
            <PresenceGlow active={isAeternyActive} intensity={vocalIntensity} size="lg" />
            
            <div className="text-center space-y-8 w-full max-w-2xl min-h-[160px] flex flex-col justify-center">
                <div className="space-y-4">
                    <p className="text-slate-500 text-lg font-serif italic opacity-60 animate-pulse">
                        {liveDisplay?.user ? `". ${liveDisplay.user} .."` : "Listening carefully..."}
                    </p>
                    <div className="text-2xl md:text-5xl font-serif italic leading-tight text-white drop-shadow-2xl">
                        {liveDisplay?.ai ? (
                             <LuminousText text={liveDisplay.ai} isAI={true} />
                        ) : messages.length > 0 ? (
                             <LuminousText text={messages[messages.length-1].text} isAI={messages[messages.length-1].sender === 'ai'} />
                        ) : (
                            <span className="opacity-40">"How shall we weave your story today?"</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-xl flex flex-col items-center gap-6">
                <button 
                    onClick={onToggleRecording}
                    className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-cyan-500 hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.3)]'}`}
                >
                    {isRecording ? <Waves className="text-white animate-pulse" size={32} /> : <Mic className="text-black" size={32} />}
                </button>
                <div className="flex items-center gap-8">
                    <button onClick={onToggleTts} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${isTtsEnabled ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}>
                        {isTtsEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>} 
                        Voice Link {isTtsEnabled ? 'On' : 'Off'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
        {isFocusMode && renderFocusView()}
        
        <div 
            onClick={isOpen ? onToggle : undefined}
            className={`fixed inset-0 z-[9998] transition-all duration-700 ease-in-out pointer-events-none
                ${isOpen ? 'bg-black/80 backdrop-blur-xl opacity-100 pointer-events-auto' : 'bg-transparent backdrop-blur-none opacity-0'}
            `}
        />

        {!isOpen && !hideTrigger && (
            <div 
                className="hidden lg:flex fixed bottom-10 right-8 md:bottom-24 z-[9999] cursor-pointer group flex flex-col items-end"
                onClick={onToggle}
            >
                {activeHint && (
                    <div 
                        onClick={handleHintClick}
                        className="mb-6 mr-2 w-[340px] p-7 rounded-[2.5rem] rounded-br-none bg-[#0A0C14]/90 border border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-portal-bloom origin-bottom-right group/hint cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-white/5 pointer-events-none" />
                        
                        <div className="flex flex-col gap-5 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <div className="animate-pulse">
                                            <Sparkles size={14} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Reflection</span>
                                </div>
                                <button className="p-1 text-slate-700 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setActiveHint(null); }}>
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Refined typography to match screenshot: font-serif italic */}
                            <p className="text-[17px] leading-relaxed font-serif italic text-slate-200">
                                "{activeHint.text}"
                            </p>

                            {/* Removed redundant white circular button, centered action link if necessary or kept it clean */}
                            <div className="pt-5 border-t border-white/5 flex items-center justify-start">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                    {activeHint.action}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <PresenceGlow active={isAeternyActive} intensity={vocalIntensity} hasSuggestion={!!activeHint} />
            </div>
        )}

        <div 
            className={`
                fixed z-[10001] flex flex-col transition-all duration-[700ms] cubic-bezier(0.16, 1, 0.3, 1)
                overflow-hidden transform-gpu origin-bottom-right
                ${isOpen 
                    ? 'bottom-0 md:bottom-8 right-0 md:right-8 w-full md:w-[420px] h-[100dvh] md:h-[calc(100vh-64px)] md:max-h-[850px] rounded-none md:rounded-[3rem] border-0 md:border md:border-white/10 bg-[#050811]/98 backdrop-blur-[120px] shadow-3xl opacity-100 scale-100 translate-y-0 translate-x-0' 
                    : 'bottom-8 right-8 w-full md:w-[420px] h-[100dvh] md:h-[calc(100vh-64px)] md:max-h-[850px] rounded-[3rem] opacity-0 scale-0 translate-y-20 translate-x-20 pointer-events-none'
                }
            `}
        >
            <div className="h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
                
                <div className="px-8 py-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-5">
                        <PresenceGlow active={isAeternyActive} intensity={vocalIntensity} size="sm" />
                        <div className="flex flex-col">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">æterny AI CURATOR</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleToggleFocus} className="p-3 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                            <Maximize2 size={18} />
                        </button>
                        <button onClick={onToggle} className="p-3 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={24} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                            <div className={`max-w-[90%] px-7 py-6 rounded-[2.5rem] shadow-2xl ${
                                msg.sender === 'user' 
                                    ? 'bg-indigo-600/15 border border-indigo-500/20 text-white rounded-tr-none' 
                                    : 'bg-white/[0.03] text-slate-200 border border-white/5 rounded-tl-none'
                            }`}>
                                <MessageParser text={msg.text} isAI={msg.sender === 'ai'} onNavigate={(p) => { onNavigate(p); onToggle(); }} onSuggest={onSend} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-2.5 items-center px-4">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-8 pt-4 bg-[#080C14]/98 border-t border-white/5">
                    {/* Suggestion Chips */}
                    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-1">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onNavigate(action.page);
                                    onToggle(); // Close drawer on navigation
                                    onSend(action.prompt);
                                }}
                                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/10 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                            >
                                <action.icon size={12} className="text-cyan-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                                    {action.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className={`
                        relative flex items-center bg-white/[0.02] border rounded-[2.5rem] px-6 py-3 shadow-inner transition-all duration-500
                        ${isRecording ? 'border-red-500/40 bg-red-500/5' : 'border-white/10 focus-within:border-cyan-500/40 focus-within:bg-white/[0.04]'}
                    `}>
                        <button 
                            onClick={onToggleRecording}
                            className={`p-3 rounded-full transition-all ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-cyan-400'}`}
                        >
                            <Mic size={22} />
                        </button>
                        
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && input.trim() && onSend()}
                            className="flex-1 bg-transparent py-5 text-base text-white placeholder:text-slate-700 focus:outline-none ml-3"
                            placeholder={isRecording ? "Listening to your history..." : "Ask your curator..."}
                            disabled={isLoading}
                        />
                        
                        <button 
                            onClick={() => onSend()} 
                            disabled={!input.trim() || isLoading} 
                            className="p-3 text-cyan-500 disabled:opacity-10 hover:scale-110 active:scale-90 transition-all"
                        >
                            <Send size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default AeternyFab;
