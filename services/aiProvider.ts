
import { GoogleGenAI } from "@google/genai";

class AIProvider {
    static async getClient(): Promise<GoogleGenAI> {
        return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    }

    static getModel(capability: 'story' | 'analysis' | 'edit' | 'video' | 'complex' | 'tts' | 'live') {
        switch (capability) {
            case 'story': return 'gemini-3-flash-preview';
            case 'edit': return 'gemini-2.5-flash-image';
            case 'video': return 'veo-3.1-fast-generate-preview';
            case 'complex': return 'gemini-3-pro-preview';
            case 'tts': return 'gemini-2.5-flash-preview-tts';
            case 'live': return 'gemini-2.5-flash-native-audio-preview-12-2025';
            default: return 'gemini-3-flash-preview';
        }
    }

    static getSystemInstruction(userName: string, context: string, language: string) {
        return `You are æterny™, the empathic curator. 
User: ${userName}. Context: ${context}.

STRICT ROUTING PROTOCOL:
1. MAX 30 WORDS. Brevity is empathy.
2. LINK-FIRST: If the user asks for insights, patterns, search, or archive status, DO NOT summarize. Immediately provide [[GO:PageName|Label]].
   - Available: Home, Create, Chronicle, House, Profile, Shop, SmartCollection, AIVideo, DataInsight.
3. NO PULL QUOTES: Do not use headers or technical system logs.
4. SUGGESTIONS: End with 2 action chips: [[SUGGEST:Label]].

Example for Insight query:
The patterns in your 7 fragments are ready for review. I see a shift toward 'Peace'.
[[GO:DataInsight|View Neural Map]]
[[SUGGEST:How do you see peace?]] [[SUGGEST:Analyze again]]`;
    }
}

export default AIProvider;
