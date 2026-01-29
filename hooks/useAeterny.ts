
import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, AeternyVoice, AeternyStyle, Language, Page, Moment, UserTier } from '../types';
import { createAeternyAgent, continueAeternyChat, textToSpeech } from '../services/geminiService';
import AIProvider from '../services/aiProvider';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { encode, decode, decodeAudioData } from '../utils/audio';

export const useAeterny = (
  user: any, 
  currentPage: Page, 
  moments: Moment[], 
  userTier: UserTier, 
  language: Language,
  aeternyVoice: AeternyVoice,
  aeternyStyle: AeternyStyle
) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello. I am æterny. My neural links are open. How shall we weave your story today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [currentlyPlayingText, setCurrentlyPlayingText] = useState<string | null>(null);
  const [liveDisplay, setLiveDisplay] = useState<{ user: string; ai: string } | null>(null);
  const [vocalIntensity, setVocalIntensity] = useState(0); // For the pulsating glow

  const chatSession = useRef<any>(null);
  const liveClientPromise = useRef<Promise<any> | null>(null);
  const audioCtxIn = useRef<AudioContext | null>(null);
  const audioCtxOut = useRef<AudioContext | null>(null);
  const audioStream = useRef<MediaStream | null>(null);
  const activeSources = useRef<Set<AudioBufferSourceNode>>(new Set());
  const audioNextTime = useRef<number>(0);
  
  const currentTranscriptionUser = useRef('');
  const currentTranscriptionAi = useRef('');

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopLiveRecording = useCallback(async () => {
    setIsRecording(false);
    setVocalIntensity(0);
    audioStream.current?.getTracks().forEach(t => t.stop());
    
    activeSources.current.forEach(s => {
        try { s.stop(); } catch(e) {}
    });
    activeSources.current.clear();

    if (audioCtxIn.current && audioCtxIn.current.state !== 'closed') {
        await audioCtxIn.current.close().catch(() => {});
    }
    if (audioCtxOut.current && audioCtxOut.current.state !== 'closed') {
        await audioCtxOut.current.close().catch(() => {});
    }
    
    if (liveClientPromise.current) {
        try {
            const session = await liveClientPromise.current;
            session.close();
        } catch (e) {}
    }
    
    liveClientPromise.current = null;
    audioStream.current = null;
    audioCtxIn.current = null;
    audioCtxOut.current = null;
    
    setLiveDisplay(null);
    currentTranscriptionUser.current = '';
    currentTranscriptionAi.current = '';
  }, []);

  const startLiveRecording = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.current = stream;
      
      const ctxIn = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioCtxIn.current = ctxIn;
      
      const ctxOut = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioCtxOut.current = ctxOut;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = ctxIn.createMediaStreamSource(stream);
            const scriptProcessor = ctxIn.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(ctxIn.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            if (m.serverContent?.interrupted) {
                activeSources.current.forEach(s => {
                    try { s.stop(); } catch(e) {}
                });
                activeSources.current.clear();
                audioNextTime.current = 0;
                setVocalIntensity(0);
            }

            if (m.serverContent?.inputTranscription) {
                currentTranscriptionUser.current += m.serverContent.inputTranscription.text;
                setLiveDisplay({ user: currentTranscriptionUser.current, ai: currentTranscriptionAi.current });
            }
            if (m.serverContent?.outputTranscription) {
                currentTranscriptionAi.current += m.serverContent.outputTranscription.text;
                setLiveDisplay({ user: currentTranscriptionUser.current, ai: currentTranscriptionAi.current });
            }

            if (m.serverContent?.turnComplete) {
                if (currentTranscriptionAi.current) {
                    setMessages(prev => [...prev, 
                        { sender: 'user', text: currentTranscriptionUser.current || '(Voice input)' },
                        { sender: 'ai', text: currentTranscriptionAi.current }
                    ]);
                }
                currentTranscriptionUser.current = '';
                currentTranscriptionAi.current = '';
            }

            const base64 = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64) {
              const ctxOut = audioCtxOut.current!;
              audioNextTime.current = Math.max(audioNextTime.current, ctxOut.currentTime);
              const buffer = await decodeAudioData(decode(base64), ctxOut, 24000, 1);
              const s = ctxOut.createBufferSource();
              s.buffer = buffer;
              s.connect(ctxOut.destination);
              s.start(audioNextTime.current);
              
              // Visual Sync
              setVocalIntensity(1);
              s.onended = () => {
                activeSources.current.delete(s);
                if (activeSources.current.size === 0) setVocalIntensity(0);
              };

              audioNextTime.current += buffer.duration;
              activeSources.current.add(s);
            }
          },
          onerror: (e) => stopLiveRecording(),
          onclose: () => stopLiveRecording()
        },
        config: { 
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            },
            systemInstruction: AIProvider.getSystemInstruction(user?.displayName || "Traveler", "Natural Voice Resonance Mode", language)
        }
      });
      liveClientPromise.current = sessionPromise;
    } catch (e) {
      stopLiveRecording();
    }
  };

  const playTts = useCallback(async (text: string) => {
    if (!text || isTtsPlaying || isRecording) return;
    try {
      setIsTtsPlaying(true);
      setCurrentlyPlayingText(text);
      if (!audioCtxOut.current || audioCtxOut.current.state === 'closed') {
          audioCtxOut.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioCtxOut.current;
      if (ctx.state === 'suspended') await ctx.resume();
      const buffer = await textToSpeech(text, ctx, aeternyVoice);
      if (!buffer) {
        setIsTtsPlaying(false);
        setCurrentlyPlayingText(null);
        return;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        setIsTtsPlaying(false);
        setCurrentlyPlayingText(null);
        activeSources.current.delete(source);
      };
      activeSources.current.add(source);
      source.start(0);
    } catch (error) {
      setIsTtsPlaying(false);
      setCurrentlyPlayingText(null);
    }
  }, [aeternyVoice, isTtsPlaying, isRecording]);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      const userName = user.displayName || "Traveler";
      const context = `Location: ${Page[currentPage]}. Archives: ${moments.length} artifacts.`;
      try {
        chatSession.current = await createAeternyAgent(userName, context, language);
      } catch (e) {}
    };
    init();
  }, [user, currentPage, moments.length, language]);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend || !textToSend.trim() || !chatSession.current) return;
    if (typeof overrideText !== 'string') setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setIsLoading(true);
    try {
      const response = await continueAeternyChat(chatSession.current, textToSend);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'ai', text: "My apologies, a neural ripple occurred." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return {
    messages, input, setInput, sendMessage, isLoading, isRecording,
    toggleRecording: () => isRecording ? stopLiveRecording() : startLiveRecording(),
    isTtsEnabled, toggleTts: () => setIsTtsEnabled(!isTtsEnabled),
    isTtsPlaying, currentlyPlayingText, liveDisplay, vocalIntensity,
    playTts
  };
};
