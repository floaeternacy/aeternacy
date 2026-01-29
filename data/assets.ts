/**
 * æternacy™ Asset Registry
 * Integrated with Cloudinary for performance with Unsplash/Pexels Fallbacks.
 */

const CLOUD_NAME = "dpprbngqz";
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Helper to generate raw Cloudinary URLs
export const cld = (publicId: string) => `${BASE_URL}/${publicId}`;

// Stable Fallbacks for critical UI paths
const FALLBACKS = {
  FAMILY: "https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg?auto=compress&cs=tinysrgb&w=1200",
  NATURE: "https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1200",
  HISTORY: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
  STARS: "https://images.unsplash.com/photo-1506318137071-a8e063b4bc3c?q=80&w=1200&auto=format&fit=crop",
  LIBRARY: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
  PERSON_OLD: "https://images.unsplash.com/photo-1533512930330-4ac257c86793?q=80&w=800&auto=format&fit=crop",
  PERSON_YOUNG: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop"
};

export const ASSETS = {
  LANDING: {
    HERO_SLIDES: [
      { 
        url: cld('aeternacy/landing/hero_1'), 
        fallback: "https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1920"
      },
      { 
        url: cld('aeternacy/landing/hero_2'), 
        fallback: "https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg?auto=compress&cs=tinysrgb&w=1920"
      },
      { 
        url: cld('aeternacy/landing/hero_3'), 
        fallback: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1920"
      },
    ]
  },
  HOME: {
    HERO_SLIDES: [
        cld('aeternacy/home/forest'),
        cld('aeternacy/home/stream'),
        cld('aeternacy/home/mountain'),
        cld('aeternacy/home/reflection'),
    ]
  },
  FAMILY: {
    HERO_SLIDES: [
      "https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg?auto=compress&cs=tinysrgb&w=1920", // Laughter/Multi-gen
      "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=1920",  // Heritage/Ancestors
      "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1920", // Gathering/Dinner
      "https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&cs=tinysrgb&w=1920", // Adventure/Continuity
      "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1920", // Intimate Home Moment
    ],
    DEMO: {
      KITCHEN: cld('aeternacy/family/kitchen'), 
      TABLET: cld('aeternacy/family/tablet'), 
    }
  },
  LEGACY: {
    HERO: cld('aeternacy/legacy/starry_night'),
    BACKGROUNDS: [
      cld('aeternacy/legacy/vault'),
      cld('aeternacy/legacy/voice'),
      cld('aeternacy/legacy/messages'),
      cld('aeternacy/legacy/curation'),
    ],
    CONST_HERO: cld('aeternacy/legacy/constellations'),
    HANDS: cld('aeternacy/legacy/hands_photos'),
  },
  SHOP: {
    MAGAZINE_COVER: cld('aeternacy/shop/magazine_cover'),
    MAGAZINE_FEATURE: cld('aeternacy/shop/magazine_feature'),
    PHOTOBOOK_BG: cld('aeternacy/shop/photobook_bg'),
    PHOTOBOOK_MOCK: cld('aeternacy/shop/photobook_mock'),
    JOURNAL_BG: cld('aeternacy/shop/journal_bg'),
    BULK_UPLOAD: "https://images.unsplash.com/photo-1516900441530-91436440268f?q=80&w=1200&auto=format&fit=crop",
    VR_HERO: cld('aeternacy/shop/vr_lab'),
    AVATAR_DEMO: cld('aeternacy/shop/avatar_demo'),
  },
  AVATARS: {
    GRANDMOTHER: FALLBACKS.PERSON_OLD,
    GRANDFATHER: "https://images.pexels.com/photos/14720996/pexels-photo-14720996.jpeg?auto=compress&cs=tinysrgb&w=800",
    WOMAN: FALLBACKS.PERSON_YOUNG,
    MAN: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  UI: {
    PHOTO_OF_DAY: cld('aeternacy/ui/daily_artifact'),
    ABOUT_HERO: cld('aeternacy/monument_valley_flo'),
    FOUNDER: cld('aeternacy/flo_portrait'),
    PLACEHOLDERS: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
    ]
  }
};