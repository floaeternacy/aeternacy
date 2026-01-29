import { GoogleGenAI } from "@google/genai";

export const generateSectionImage = async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `High-end commercial photography, cinematic lighting, futuristic but organic aesthetic, 8k resolution, professional color grading. Subject: ${prompt}` }] }],
        config: {
            imageConfig: {
                aspectRatio: "16:9"
            }
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Failed to generate image part");
};

export const generateCinematicVideo = async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const model = 'veo-3.1-fast-generate-preview';

    let operation = await ai.models.generateVideos({
        model,
        prompt: `Cinematic dolly shot, slow movement, ethereal atmosphere, high detail, masterpiece. ${prompt}`,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};
