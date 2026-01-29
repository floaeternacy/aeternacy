import { PexelsPhoto } from '../types';
import { cld } from '../data/assets';

/**
 * æternacy™ Streaming Service
 * Primary: Cloudinary (dpprbngqz)
 * Secondary: Static Fallback Registry
 * 
 * DEPRECATED - CLEANUP CANDIDATE:
 * As of v1.0, all UI assets have been moved to institutional Cloudinary storage.
 * This service remains as a fallback for dynamic content discovery only.
 */

const CLOUDINARY_FALLBACKS = [
  cld('aeternacy/ui/placeholder_1'),
  cld('aeternacy/ui/placeholder_2'),
  cld('aeternacy/ui/placeholder_3'),
  cld('aeternacy/landing/hero_1'),
  cld('aeternacy/landing/hero_2'),
  cld('aeternacy/home/mountain'),
  cld('aeternacy/family/laughter'),
];

const getFallbackImages = (query: string, perPage: number, orientation: string, page: number): PexelsPhoto[] => {
    const hash = query.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const startIndex = Math.abs(hash % CLOUDINARY_FALLBACKS.length);

    return Array.from({ length: perPage }, (_, i) => {
        const url = CLOUDINARY_FALLBACKS[(startIndex + i + page - 1) % CLOUDINARY_FALLBACKS.length];
        return {
            id: i,
            alt: query,
            width: 1920,
            height: 1080,
            url: "https://aeternacy.com",
            photographer: "æternacy Cloud",
            photographer_url: "https://aeternacy.com",
            photographer_id: 0,
            avg_color: "#050811",
            src: {
                large2x: url,
                large: url,
                portrait: url,
                original: url,
                medium: url,
                small: url,
                landscape: url,
                tiny: url,
            },
            liked: false
        } as PexelsPhoto;
    });
};

export async function fetchPexelsImages(query: string, perPage: number = 1, orientation: 'landscape' | 'portrait' | 'square' = 'landscape', page: number = 1): Promise<PexelsPhoto[]> {
    return getFallbackImages(query, perPage, orientation, page);
}
