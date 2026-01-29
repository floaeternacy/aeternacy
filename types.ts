
export enum Page {
  Landing,
  Home,
  Interview,
  Chronicle,
  Studio,      
  Record,
  MomentDetail,
  JourneyDetail,
  Profile,     
  DataInsight,
  Subscription,
  Shop,        
  BulkUpload,
  BulkUploadReview,
  AIVideo,
  About,
  SmartCollection,
  TrustCenter,
  Articles,
  Legal,
  House,
  FamilyStoryline,
  FamilyTree,
  FamilyInsight,
  FamilyMoments,
  Archivist,
  Create,
  Curate,
  FamilySpace,
  Magazine,
  Journaling,
  Photobook,
  Housekeepers,
  Discovery,
  LegacySpace,
  LegacyTrust,
  TimeCapsule,
  Biografer,
  VRLab,
  LegacyTeaser
}

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it';

export enum AuthMode {
  Login,
  Register,
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export type AiTier = 'premium' | 'standard' | 'diamond' | 'flash' | 'sparkle' | null;

export type UserTier = 'free' | 'essæntial' | 'fæmily' | 'fæmily_plus' | 'lægacy';

export type AeternyVoice = 'Sarah' | 'David' | 'Emma' | 'James' | 'UserSignature';
export type AeternyStyle = 'Neutral' | 'Warm & Empathetic';
export type StoryStyle = 'nostalgic' | 'poetic' | 'journal' | 'lighthearted';

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  albumArt?: string;
}

export type Moment = {
  id: number;
  type: 'standard' | 'focus' | 'insight' | 'collection' | 'fæmilyStoryline';
  aiTier: AiTier;
  pinned: boolean;
  favorite?: boolean;
  image?: string; 
  images?: string[]; 
  title: string;
  date: string;
  description: string;
  location?: string;
  lat?: number;
  lng?: number;
  people?: string[];
  activities?: string[];
  photoCount?: number;
  emotion?: 'joy' | 'love' | 'adventure' | 'peace' | 'reflection' | 'achievement';
  isLegacy?: boolean;
  createdBy?: string; 
  houseId?: string;   
  video?: string;
  comments?: { user: string; text: string; date: string }[];
  collaborators?: string[];
  useVocalSignature?: boolean;
  customNarrationUrl?: string;
  music?: MusicTrack;
  storyStyle?: StoryStyle;
  voice?: AeternyVoice;
  aeternyStyle?: AeternyStyle;
};

export type MemberRole = 'Custodian' | 'House Keeper' | 'Kin' | 'Steward';

export interface HouseMember {
  id: string;
  name: string;
  role: MemberRole;
  image?: string;
  initials: string;
  vocalSignature?: boolean;
  interests?: string[];
  permissions?: {
    canUseAi: boolean;
    canSeePrivate: boolean;
    canExport: boolean;
    canManageMembers: boolean;
  };
  narrativeFocus?: string; 
  contributionWeight?: number; 
}

export interface House {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  glowColor: string;
  members: HouseMember[];
  headerImages: string[];
}

export interface Journey {
  id: number;
  title: string;
  description: string;
  momentIds: number[];
  coverImage: string;
  favorite?: boolean;
  isLegacy?: boolean;
  collaborators?: string[];
}

export interface Epoch {
  id: number;
  title: string;
  description: string;
  journeyIds: number[];
  theme: string;
  dateRange: string;
  coverImage: string;
}

export interface CreditState {
  balance: number; 
  monthlyAllocation: number;
  rollover: number;
  storageUsed: number; 
  storageLimit: number; 
  freeHeaderAnimations: {
    total: number;
    used: number;
  };
  // Renamed for user-centric accessibility
  livingMomentsQuota: {
    total: number;
    used: number;
  };
}

export type TokenState = CreditState;

export interface SuggestedPhoto {
  id: string;
  url: string;
  suggestion?: 'Best Shot' | 'Duplicate' | 'Low Quality';
}

export interface SuggestedMoment {
  id: string;
  title: string;
  dateRange: string;
  photos: SuggestedPhoto[];
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export type StewardRole = 'Guardian' | 'Co-Curator' | 'Successor';

export interface Steward {
  id: string;
  name: string;
  email: string;
  role: StewardRole;
}
