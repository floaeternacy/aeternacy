import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Page, UserTier } from '../types';
import { 
    ArrowLeft, ArrowRight, Headset, Book, Mic, Video, Coffee, Feather, Play, 
    CheckCircle, Lock, Sparkles, Headphones, Star, Calendar, StopCircle, Save, 
    X, BrainCircuit, MicOff, Send, Bot, Infinity, Waves, Info, 
    Lightbulb, History, Cpu, FileText, Zap,
    ShieldCheck, Loader2, CheckCircle2,
    MapPin, User, Heart, Milestone, Fingerprint, Landmark, Plus, Users
} from 'lucide-react';
import { TOKEN_COSTS } from '../services/costCatalog';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/audio';
import { useTheme } from '../contexts/ThemeContext';
import PageHeader from './PageHeader';

interface BiograferPageProps {
  onBack: () => void;
  onNavigate?: (page: Page) => void;
  triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string) => void;
  userTier: UserTier;
}

interface MemoryNode {
    id: string;
    text: string;
    type: 'person' | 'place' | 'emotion' | 'event';
}

interface Chapter {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    promptContext: string; 
    icon: React.ElementType;
    status: 'completed' | 'current' | 'locked';
    progress: number;
    tierRequired?: UserTier;
    tags?: string[];
}

const lifeChapters: Chapter[] = [
    { 
        id: 'roots', 
        title: 'Roots & Origins', 
        subtitle: 'Volume I',
        description: 'Your grandparents, family lore, and the world before you arrived.', 
        promptContext: "Focus on family history, grandparents, and ancestry.",
        icon: Feather, 
        status: 'completed',
        progress: 100,
        tierRequired: 'free',
        tags: ['Ancestry', 'Heritage']
    },
    { 
        id: 'childhood', 
        title: 'Early Years', 
        subtitle: 'Volume II',
        description: 'The street you grew up on, and your first home.', 
        promptContext: "Focus on early childhood memories between ages 0-10.",
        icon: Sparkles, 
        status: 'current',
        progress: 35,
        tierRequired: 'lægacy',
        tags: ['Sensory', 'Innocence']
    },
    { 
        id: 'youth', 
        title: 'Coming of Age', 
        subtitle: 'Volume III',
        description: 'First loves, rebellion, and Defining moments.', 
        promptContext: "Focus on adolescence, school, and independence.",
        icon: Play, 
        status: 'locked',
        progress: 0,
        tierRequired: 'lægacy',
        tags: ['Discovery', 'Independence']
    }
];

const WaveVisualizer = ({ active }: { active: boolean }) => (
    <div className="flex items-center justify-center gap-1.5 h-10 w-24 sm:w-full sm:max-w-xs mx-auto">
        {[...Array(12)].map((_, i) => (
            <div 
                key={i} 
                className={`w-1 rounded-full bg-cyan-500/40 transition-all duration-300 ${active ? 'animate-vocal-wave' : 'h-1.5'}`} 
                style={{ 
                    animationDelay: `${i * 0.05}s`,
                    height: active ? `${20 + Math.random() * 80}%` : '4px'
                }} 
            />
        ))}
    </div>
);

const BiograferPage: React.FC<BiograferPageProps> = ({ onBack, onNavigate, triggerConfirmation, userTier }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [view, setView] = useState<'library' | 'studio'>('library');
  const [showExitConfirm] = useState(false);
  const [showGuide] = useState(false);

  const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string, isLive?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [extractedMemories, setExtractedMemories] = useState<MemoryNode[]>([]);
  
  const liveSessionRef = useRef<any>(null);
  const audioCtxIn = useRef<AudioContext | null>(null);
  const audioCtxOut = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLægacyUser = userTier === 'lægacy';

  const isChapterLocked = useCallback((chapter: Chapter) => {
      return chapter.tierRequired === 'lægacy' && !isLægacyUser;
  }, [isLægacyUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const cleanupLiveSession = useCallback(async () => {
    setIsRecording(false);
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (audioCtxIn.current && audioCtxIn.current.state !== 'closed') {
        await audioCtxIn.current.close().catch(() => {});
        audioCtxIn.current = null;
    }
    if (audioCtxOut.current && audioCtxOut.current.state !== 'closed') {
        await audioCtxOut.current.close().catch(() => {});
        audioCtxOut.current = null;
    }
    if (liveSessionRef.current) {
        try {
            const session = await liveSessionRef.current;
            session.close();
        } catch (e) {}
        liveSessionRef.current = null;
    }
    nextStartTimeRef.current = 0;
  }, []);

  const confirmExit = async () => { 
      await cleanupLiveSession();
      setView('library'); 
      setActiveChapter(null); 
  };

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || !liveSessionRef.current) return;
    const msg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    
    liveSessionRef.current.then((session: any) => {
        session.sendRealtimeInput({
            text: msg
        });
    });
  }, [input]);

  const handleStartSession = (chapter: Chapter) => {
    const startLiveInterview = async () => {
        setActiveChapter(chapter);
        setView('studio');
        setMessages([]);
        setExtractedMemories([]);
        setIsThinking(true);
        setIsRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const ctxIn = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            await ctxIn.resume();
            audioCtxIn.current = ctxIn;

            const ctxOut = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioCtxOut.current = ctxOut;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const recordArtifactFunction = {
                name: 'record_artifact',
                parameters: {
                    type: Type.OBJECT,
                    description: 'Records a specific memory artifact.',
                    properties: {
                        text: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['person', 'place', 'event', 'emotion'] }
                    },
                    required: ['text', 'type']
                }
            };

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setIsThinking(false);
                        const source = ctxIn.createMediaStreamSource(stream);
                        const scriptProcessor = ctxIn.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                            const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                            sessionPromise.then(session => session?.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(ctxIn.destination);
                    },
                    onmessage: async (m: LiveServerMessage) => {
                        if (m.serverContent?.outputTranscription) {
                            setIsThinking(false);
                            const text = m.serverContent.outputTranscription.text;
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.sender === 'ai') return [...prev.slice(0, -1), { sender: 'ai', text: last.text + text }];
                                return [...prev, { sender: 'ai', text: text }];
                            });
                        }

                        if (m.toolCall) {
                            for (const fc of m.toolCall.functionCalls) {
                                if (fc.name === 'record_artifact') {
                                    const { text, type } = fc.args as any;
                                    setExtractedMemories(prev => [...prev, { id: Date.now().toString(), text, type }]);
                                    sessionPromise.then(s => s?.sendToolResponse({ 
                                        functionResponses: { 
                                            id: fc.id, 
                                            name: fc.name, 
                                            response: { result: "ok" } 
                                        } 
                                    }));
                                }
                            }
                        }
                        const base64Audio = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctxOut.currentTime);
                            const buffer = await decodeAudioData(decode(base64Audio), ctxOut, 24000, 1);
                            const source = ctxOut.createBufferSource();
                            source.buffer = buffer;
                            source.connect(ctxOut.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                        }
                    },
                    onerror: (e) => {
                        console.error("Live session error", e);
                        cleanupLiveSession();
                    },
                    onclose: () => cleanupLiveSession()
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    tools: [{ functionDeclarations: [recordArtifactFunction] }],
                    systemInstruction: `Persona: æterny. Interview for: ${chapter.title}. Narrative Goal: Weave an empathic first-person life story.`,
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                }
            });
            liveSessionRef.current = sessionPromise;
        } catch (e) {
            setIsRecording(false);
            setIsThinking(false);
        }
    };
    triggerConfirmation(TOKEN_COSTS.BIOGRAFER_SESSION, 'BIOGRAFER_SESSION', startLiveInterview);
  };

  if (view === 'library') {
      return (
        <div className={`min-h-screen ${isDark ? 'bg-[#050811]' : 'bg-[#FDFBF7]'} pb-24 sm:pb-40`}>
          <PageHeader title="The Biografær" backLabel="STUDIO" onBack={onBack} />
          
          <div className="container mx-auto px-4 sm:px-6 pt-36 md:pt-44 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-16 animate-fade-in-up">
                <div className="flex-1 space-y-4 sm:space-y-6">
                    <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold font-brand tracking-tighter leading-[1] sm:leading-[0.9] ${isDark ? 'text-white' : 'text-stone-900'}`}>
                        The Texture of <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Human Voice.</span>
                    </h1>
                    <p className={`text-lg sm:text-2xl font-serif italic leading-relaxed max-w-2xl ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                        "Speak your legacy, and æterny will weave it into a living autobiography."
                    </p>
                </div>

                <div className="w-full lg:w-96">
                    <div className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border relative overflow-hidden ${isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4 sm:mb-6">Daily Prompt</p>
                        <h3 className={`text-xl sm:text-2xl font-bold font-brand mb-4 ${isDark ? 'text-white' : 'text-indigo-950'}`}>What was your first favorite song?</h3>
                        <button onClick={() => handleStartSession(lifeChapters[0])} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-[9px] sm:text-[10px] uppercase tracking-widest transition-all">
                            Record reflection
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
                {lifeChapters.map((chapter) => {
                    const Icon = chapter.icon;
                    const locked = isChapterLocked(chapter);
                    return (
                        <div key={chapter.id} onClick={() => handleStartSession(chapter)} className={`group p-6 sm:p-8 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between h-[300px] sm:h-[340px] cursor-pointer relative overflow-hidden ${isDark ? 'bg-slate-900/40 border-white/5 hover:border-cyan-500/50' : 'bg-white border-stone-200 shadow-sm'}`}>
                            <div className="flex justify-between items-start z-10">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ring-1 ${locked ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan-50/10 text-cyan-400'}`}>
                                    {locked ? <Landmark size={28} /> : <Icon size={28} />}
                                </div>
                                <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500`}>{chapter.subtitle}</span>
                            </div>
                            <div className="z-10">
                                <h3 className={`text-2xl sm:text-3xl font-bold font-brand mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>{chapter.title}</h3>
                                <p className={`text-xs sm:text-sm leading-relaxed opacity-70 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>{chapter.description}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 z-10 flex items-center justify-between">
                                <div className="h-1 w-full max-w-[100px] sm:max-w-[150px] bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500" style={{ width: `${chapter.progress}%` }} />
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      );
  }

  return (
      <div className={`fixed inset-0 z-[200] flex flex-col ${isDark ? 'bg-[#020617] text-white' : 'bg-[#FDFBF7] text-stone-900'} animate-fade-in`}>
          <div className="h-20 px-4 sm:px-8 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-2xl">
              <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white">
                      <Headset size={20} />
                  </div>
                  <div className="hidden xs:block">
                      <h2 className="text-[10px] font-black uppercase text-white/40">Studio</h2>
                      <p className="text-sm sm:text-base font-bold font-brand truncate max-w-[150px]">{activeChapter?.title}</p>
                  </div>
              </div>
              <div className="flex-1 flex justify-center">
                  <WaveVisualizer active={isRecording || isThinking} />
              </div>
              <button onClick={confirmExit} className="px-4 sm:px-6 py-2 rounded-full bg-red-500/10 text-red-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                  End
              </button>
          </div>

          <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-grow flex flex-col relative max-w-4xl mx-auto w-full lg:border-x border-white/5 overflow-hidden">
                  <div className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-8 scrollbar-hide">
                      {messages.map((msg, idx) => (
                          <div key={idx} className={`flex gap-3 sm:gap-6 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center mt-1 shadow-xl ${msg.sender === 'ai' ? 'bg-slate-800' : 'bg-cyan-600 text-white'}`}>
                                  {msg.sender === 'ai' ? <Bot size={18} /> : <span className="text-[10px] font-black">Me</span>}
                              </div>
                              <div className={`max-w-[85%] sm:max-w-[75%] p-5 sm:p-6 rounded-3xl text-base sm:text-xl leading-relaxed shadow-xl ${
                                  msg.sender === 'ai' 
                                    ? 'bg-white/5 text-slate-100 rounded-tl-none font-serif italic' 
                                    : 'bg-cyan-600/90 text-white rounded-tr-none'
                              }`}>
                                  {msg.text}
                              </div>
                          </div>
                      ))}
                      <div ref={messagesEndRef} className="h-20" />
                  </div>

                  <div className="p-4 sm:p-8 bg-black/40 border-t border-white/5 pb-24 sm:pb-8">
                      <div className={`flex items-center gap-2 p-2 rounded-[2rem] border transition-all duration-500 shadow-2xl ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-stone-200'}`}>
                          <input 
                              type="text" 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && input.trim() && handleSendMessage()}
                              placeholder="Share your story..."
                              className="flex-grow bg-transparent px-4 sm:px-6 py-3 text-sm sm:text-lg focus:outline-none placeholder:text-slate-600"
                              disabled={isThinking}
                          />
                          <button onClick={handleSendMessage} className="p-3.5 sm:p-5 bg-cyan-600 text-white rounded-full transition-all">
                              <ArrowRight size={20} />
                          </button>
                      </div>
                  </div>
              </div>

              <div className={`lg:w-[400px] flex flex-col h-48 lg:h-auto border-t lg:border-t-0 lg:border-l border-white/5 ${isDark ? 'bg-slate-900/30' : 'bg-stone-50'}`}>
                  <div className="p-4 lg:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                      <h3 className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2"><BrainCircuit size={14} /> Artifacts</h3>
                      <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[8px] font-black">{extractedMemories.length}</span>
                  </div>
                  <div className="flex-grow overflow-x-auto lg:overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                      <div className="flex lg:flex-col gap-3">
                          {extractedMemories.map((node) => (
                            <div key={node.id} className="shrink-0 w-48 lg:w-full p-4 bg-slate-900/50 border border-white/10 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
                                    <Sparkles size={14} />
                                </div>
                                <p className="text-xs font-bold text-slate-200 truncate">{node.text}</p>
                            </div>
                          ))}
                          {extractedMemories.length === 0 && (
                              <p className="text-[10px] text-slate-500 italic text-center w-full lg:mt-10">Listening for anchors...</p>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default BiograferPage;