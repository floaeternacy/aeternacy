
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Page, UserTier, Moment, CreditState, Language, AeternyVoice, StoryStyle, Journey, Epoch, House, HouseMember } from './types';
import { useAuth } from './contexts/AuthContext';
// Fix: Corrected relative path for ThemeContext as it is located in ./contexts/
import { useTheme } from './contexts/ThemeContext';
import { MapPin, Settings2, X, SlidersHorizontal, Eye, EyeOff, FastForward, Music, Check, Play } from 'lucide-react';
import { getOptimizedUrl } from './services/cloudinaryService';

// Core Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import MobileMenuOverlay from './components/MobileMenuOverlay';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import CheckoutOverlay from './components/CheckoutOverlay';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import MomentsPage from './components/MomentsPage';
import ProfilePage from './components/ProfilePage';
import MomentDetailPage from './components/MomentDetailPage';
import JourneyDetailPage from './components/JourneyDetailPage';
import SubscriptionPage from './components/SubscriptionPage';
import RecordPage from './components/RecordPage';
import DataInsightPage from './components/DataInsightPage';
import FamilySpacePage from './components/FamilySpacePage';
import FamilyStorylinePage from './components/FamilyStorylinePage';
import FamilyTreePage from './components/FamilyTreePage';
import FamilyInsightPage from './components/FamilyInsightPage';
import MagazinePage from './components/MagazinePage';
import PhotobookPage from './components/PhotobookPage';
import AIVideoPage from './components/AIVideoPage';
import TrustCenterPage from './components/TrustCenterPage';
import LegalPage from './components/LegalPage';
import ShopPage from './components/ShopPage';
import AeternyFab from './components/AeternyFab';
import InterviewPage from './components/InterviewPage';
import CuratePage from './components/CuratePage';
import HousePage from './components/HousePage';
import SmartCollectionPage from './components/SmartCollectionPage';
import AboutPage from './components/AboutPage';
import BulkUploadPage from './components/BulkUploadPage';
import BulkUploadReviewPage from './components/BulkUploadReviewPage';
import JournalingPage from './components/JournalingPage';
import ArticlesPage from './components/ArticlesPage';
import ArchivistLandingPage from './components/ArchivistLandingPage';
import BulkUploadModal from './components/BulkUploadModal';
import ProductDemo from './components/ProductDemo';
import FamilyMomentsPage from './components/FamilyMomentsPage';
import HousekeepersPage from './components/HousekeepersPage';
import SmartGuide from './components/SmartGuide';
import DiscoveryPage from './components/DiscoveryPage';
import StudioPage from './components/StudioPage';
import LegacySpacePage from './components/LegacySpacePage';
import LegacyTrustPage from './components/LegacyTrustPage';
import TimeCapsulePage from './components/TimeCapsulePage';
import BiograferPage from './components/BiograferPage';
import VRLabPage from './components/VRLabPage';
import BrandLogo from './components/BrandLogo';
import LegacyTeaserPage from './components/LegacyTeaserPage';

import { useAeterny } from './hooks/useAeterny';
import Toast, { ToastMessage } from './components/Toast';
import ConfirmationModal from './components/ConfirmationModal';

import { initialMoments, initialJourneys } from './data/moments';
import { demoMoments, demoJourneys } from './data/demoData';
import { ASSETS } from './data/assets';
import { HIGH_COST_THRESHOLD } from './services/costCatalog';

const Loader2: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className || ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const DreamMode: React.FC<{ 
    moments: Moment[]; 
    onExit: () => void;
}> = ({ moments, onExit }) => {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(-1);
    const [isExiting, setIsExiting] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const controlsTimer = useRef<number | null>(null);
    
    const [settings, setSettings] = useState({
        pool: 'favorites', 
        speed: 12000,
        showTitle: true,
        showTags: true,
        music: false
    });

    const resetControlsTimer = useCallback(() => {
        setShowControls(true);
        if (controlsTimer.current) window.clearTimeout(controlsTimer.current);
        
        if (!showSettings) {
            controlsTimer.current = window.setTimeout(() => {
                setShowControls(false);
            }, 3500);
        }
    }, [showSettings]);

    useEffect(() => {
        window.addEventListener('mousemove', resetControlsTimer);
        window.addEventListener('touchstart', resetControlsTimer);
        resetControlsTimer();
        return () => {
            window.removeEventListener('mousemove', resetControlsTimer);
            window.removeEventListener('touchstart', resetControlsTimer);
            if (controlsTimer.current) window.clearTimeout(controlsTimer.current);
        };
    }, [resetControlsTimer]);

    const pool = useMemo(() => {
        let base = [...moments];
        if (settings.pool === 'favorites') {
            base = base.filter(m => m.pinned || m.favorite);
        } else if (settings.pool === 'family') {
            base = base.filter(m => m.people?.some(p => p.toLowerCase().includes('family')) || m.type === 'fæmilyStoryline');
        } else if (settings.pool === 'people') {
            base = base.filter(m => m.people && m.people.length > 0);
        }
        return base.length > 0 ? base : moments;
    }, [moments, settings.pool]);

    useEffect(() => {
        const timer = setInterval(() => {
            setPrevIndex(index);
            setIndex(prev => (prev + 1) % pool.length);
        }, settings.speed);
        return () => clearInterval(timer);
    }, [pool.length, settings.speed, index]);

    const handleExitAttempt = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.dream-settings-panel')) return;
        if ((e.target as HTMLElement).closest('.settings-trigger')) {
            e.stopPropagation();
            setShowSettings(!showSettings);
            return;
        }
        
        setIsExiting(true);
        setTimeout(onExit, 800);
    };

    return (
        <div 
            className={`fixed inset-0 z-[100000] bg-[#02040A] animate-fade-in ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'} transition-all duration-[1200ms] ease-in-out ${showControls ? 'cursor-auto' : 'cursor-none'}`}
            onClick={handleExitAttempt}
        >
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.02] bg-noise mix-blend-overlay"></div>
            <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>

            {/* High-End Crossfade Stack */}
            {pool.map((moment, i) => (
                <div 
                    key={moment.id} 
                    className={`absolute inset-0 transition-all duration-[5000ms] ease-in-out transform-gpu
                        ${i === index 
                            ? 'opacity-100 blur-0 z-10' 
                            : 'opacity-0 blur-3xl z-0 pointer-events-none'
                        }
                    `}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <img 
                        src={getOptimizedUrl(moment.image || moment.images?.[0] || '', 1920)} 
                        className={`w-full h-full object-cover brightness-[0.5] contrast-[1.1] transform-gpu will-change-transform 
                            ${(i === index || i === prevIndex) ? 'animate-ken-burns-slow' : ''}`}
                        alt=""
                    />
                </div>
            ))}

            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-12 md:p-24 overflow-hidden">
                <div className="opacity-30 transition-opacity duration-1000">
                    <span className="font-brand font-bold text-3xl text-white tracking-tighter">æ</span>
                </div>

                <div className="relative flex-grow">
                    {pool.map((moment, i) => (
                        <div 
                            key={`meta-${moment.id}`} 
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-[4000ms] ease-in-out transform-gpu
                                ${i === index 
                                    ? 'opacity-100 translate-y-0 blur-0 scale-100' 
                                    : 'opacity-0 translate-y-8 blur-2xl scale-95 pointer-events-none'
                                }
                            `}
                        >
                            {settings.showTitle && (
                                <h2 className="text-xl md:text-3xl font-brand font-bold text-white/70 tracking-tighter mb-2 drop-shadow-2xl">
                                    {moment.title}
                                </h2>
                            )}
                            {settings.showTags && (
                                <div className="flex items-center gap-4 text-white/50 text-[10px] md:text-xs font-serif italic tracking-[0.25em]">
                                    {moment.location && (
                                        <span className="flex items-center gap-2"><MapPin size={10} /> {moment.location}</span>
                                    )}
                                    <span>{moment.date}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={`absolute bottom-8 right-8 flex flex-col items-end gap-6 transition-all duration-1000 z-[60] ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                
                {showSettings && (
                    <div className="dream-settings-panel w-72 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-3xl animate-fade-in-up origin-bottom-right mb-2 pointer-events-auto">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Dreamscape</span>
                                <button onClick={(e) => { e.stopPropagation(); setShowSettings(false); }} className="text-white/20 hover:text-white transition-colors"><X size={16}/></button>
                            </div>
                            
                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><SlidersHorizontal size={12}/> Focus</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'favorites', label: 'Starred' },
                                        { id: 'all', label: 'Complete' },
                                        { id: 'family', label: 'Family' },
                                        { id: 'people', label: 'People' }
                                    ].map(opt => (
                                        <button 
                                            key={opt.id}
                                            onClick={(e) => { e.stopPropagation(); setSettings(s => ({ ...s, pool: opt.id })); }}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${settings.pool === opt.id ? 'bg-white/20 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><FastForward size={12}/> Tempo</span>
                                <div className="flex bg-black/20 p-1.5 rounded-2xl">
                                    {[
                                        { v: 18000, l: 'Slow' },
                                        { v: 12000, l: 'Med' },
                                        { v: 6000, l: 'Fast' }
                                    ].map(opt => (
                                        <button 
                                            key={opt.v}
                                            onClick={(e) => { e.stopPropagation(); setSettings(s => ({ ...s, speed: opt.v })); }}
                                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${settings.speed === opt.v ? 'bg-white/10 text-white shadow-sm' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            {opt.l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Eye size={12}/> Interface</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSettings(s => ({ ...s, showTitle: !s.showTitle })); }}
                                        className={`flex-1 py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${settings.showTitle ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-400'}`}
                                    >
                                        {settings.showTitle ? <Eye size={14}/> : <EyeOff size={14}/>}
                                        <span className="text-[8px] font-black uppercase">Title</span>
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSettings(s => ({ ...s, showTags: !s.showTags })); }}
                                        className={`flex-1 py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${settings.showTags ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-400'}`}
                                    >
                                        {settings.showTags ? <Eye size={14}/> : <EyeOff size={14}/>}
                                        <span className="text-[8px] font-black uppercase">Meta</span>
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSettings(s => ({ ...s, music: !s.music })); }}
                                className={`w-full py-4 rounded-2xl border transition-all flex items-center justify-center gap-4 ${settings.music ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}
                            >
                                <Music size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ambient Resonance</span>
                                {settings.music && <Check size={12} />}
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center bg-white/[0.03] backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl pointer-events-auto">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                        className={`settings-trigger p-3.5 rounded-full transition-all duration-700 ${showSettings ? 'text-cyan-400 bg-white/10 rotate-90 scale-110' : 'text-white/10 hover:text-white/40 hover:bg-white/5'}`}
                    >
                        <Settings2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const INITIAL_HOUSES: Record<string, House> = {
    'miller': {
        id: 'miller',
        name: 'Miller',
        tagline: 'Where memories become legacy.',
        accentColor: 'text-indigo-400',
        glowColor: 'shadow-indigo-500/20',
        headerImages: [],
        members: [
            { id: '1', name: 'John Miller', role: 'Custodian', initials: 'JM', image: ASSETS.AVATARS.MAN, vocalSignature: true, narrativeFocus: 'The Travel Chronicler', contributionWeight: 85, interests: ['Travel', 'Photography', 'Genealogy'], permissions: { canUseAi: true, canSeePrivate: true, canExport: true, canManageMembers: true } },
            { id: '2', name: 'Sarah Miller', role: 'Kin', initials: 'SM', image: ASSETS.AVATARS.WOMAN, vocalSignature: false, narrativeFocus: 'Culinary Historian', contributionWeight: 42, interests: ['Cooking', 'Ancestry'], permissions: { canUseAi: true, canSeePrivate: false, canExport: false, canManageMembers: false } },
            { id: '3', name: 'Eleanor', role: 'Steward', initials: 'EM', image: ASSETS.AVATARS.GRANDMOTHER, vocalSignature: true, narrativeFocus: 'Legacy Guardian', contributionWeight: 92, interests: ['Folklore', 'Ethics'], permissions: { canUseAi: true, canSeePrivate: true, canExport: true, canManageMembers: false } },
        ]
    }
};

const App: React.FC = () => {
    const { user, loading, logout, loginAsGuest, loginWithGoogle } = useAuth();
    // Fix: Destructure setTheme from useTheme to resolve error on line 748
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const userName = user?.displayName || 'User';

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingTier, setPendingTier] = useState<UserTier | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [isDreamMode, setIsDreamMode] = useState(false);
    const [isReliveActive, setIsReliveActive] = useState(false); 
    const [aeternyVoice, setAeternyVoice] = useState<AeternyVoice>('Sarah');
    const [defaultStoryStyle, setStoryStyle] = useState<StoryStyle>('nostalgic');
    const [newMomentId, setNewMomentId] = useState<number | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Cross-page action state (e.g. guide intents)
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    
    const [houses, setHouses] = useState<Record<string, House>>(INITIAL_HOUSES);
    const [activeHouseId, setActiveHouseId] = useState('miller');
    const activeHouse = useMemo(() => houses[activeHouseId] || houses.miller, [activeHouseId, houses]);

    const handleFamilyNameChange = (newName: string) => {
        setHouses(prev => ({
            ...prev,
            [activeHouseId]: { ...prev[activeHouseId], name: newName }
        }));
    };

    const handleUpdateFamilyHeader = (newUrls: string[]) => {
        setHouses(prev => ({
            ...prev,
            [activeHouseId]: { ...prev[activeHouseId], headerImages: newUrls }
        }));
    };

    const handleUpdateMember = (updatedMember: HouseMember) => {
        setHouses(prev => {
            const house = prev[activeHouseId];
            const updatedMembers = house.members.map(m => m.id === updatedMember.id ? updatedMember : m);
            return {
                ...prev,
                [activeHouseId]: { ...house, members: updatedMembers }
            };
        });
    };

    const [currentPage, setCurrentPage] = useState<Page>(() => {
      const saved = localStorage.getItem('aeternacy_last_page');
      return saved ? parseInt(saved, 10) : Page.Landing;
    });

    const [lastPage, setLastPage] = useState<Page | null>(null);
    const [activeMoment, setActiveMoment] = useState<Moment | null>(null);
    const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
    const [isAutoPlayPending, setIsAutoPlayPending] = useState(false);

    const [moments, setMoments] = useState<Moment[]>(initialMoments);
    const [journeys, setJourneys] = useState<Journey[]>(initialJourneys);
    const [epochs, setEpochs] = useState<Epoch[]>([]);

    useEffect(() => {
        if (!user || isDreamMode || isReliveActive || currentPage === Page.Landing || currentPage === Page.Interview) return;

        let idleTimer: number;
        const resetTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = window.setTimeout(() => setIsDreamMode(true), 120000); 
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('mousedown', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        
        resetTimer();

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('mousedown', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
            clearTimeout(idleTimer);
        };
    }, [user, isDreamMode, isReliveActive, currentPage]);

    useEffect(() => {
      localStorage.setItem('aeternacy_last_page', currentPage.toString());
    }, [currentPage]);

    const [userTier, setUserTier] = useState<UserTier>('free');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('aeternacy_lang');
        return (saved as Language) || 'en';
    });

    const handleLanguageChange = (newLang: Language) => {
        setLanguage(newLang);
        localStorage.setItem('aeternacy_lang', newLang);
    };
    
    const [creditState, setCreditState] = useState<CreditState>({ 
        balance: 100, 
        monthlyAllocation: 1000,
        rollover: 0,
        storageUsed: 0.5,
        storageLimit: 5,
        freeHeaderAnimations: { total: 5, used: 0 },
        livingMomentsQuota: { total: 10, used: 3 }
    });

    const aeterny = useAeterny(
        user, 
        currentPage, 
        moments, 
        userTier, 
        language, 
        aeternyVoice, 
        // Corrected 'Warm & Empathic' to 'Warm & Empathetic' to match AeternyStyle type definition.
        'Warm & Empathetic'
    );

    useEffect(() => {
        if (user?.isAnonymous) {
            const visitorMoments: Moment[] = [...demoMoments];
            setMoments(visitorMoments);
            setJourneys(demoJourneys);
            setUserTier('fæmily'); 
            setProfilePic('https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150');
            
            // Set dynamic tier limits
            const livingMomentsTotals = {
                'free': 0,
                'essæntial': 2,
                'fæmily': 10,
                'fæmily_plus': 25,
                'lægacy': 100
            };

            setCreditState({
                balance: 2000,
                monthlyAllocation: 2500,
                rollover: 0,
                storageUsed: 142,
                storageLimit: 2000, 
                freeHeaderAnimations: { total: 10, used: 2 },
                livingMomentsQuota: { total: livingMomentsTotals['fæmily'], used: 0 }
            });
        }
    }, [user]);

    // Added effects to keep livingMomentsQuota aligned with UserTier
    useEffect(() => {
        const livingMomentsTotals = {
            'free': 0,
            'essæntial': 2,
            'fæmily': 10,
            'fæmily_plus': 25,
            'lægacy': 100
        };
        
        setCreditState(prev => ({
            ...prev,
            livingMomentsQuota: {
                ...prev.livingMomentsQuota,
                total: livingMomentsTotals[userTier] || 2
            }
        }));
    }, [userTier]);

    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean; cost: number; featureKey: string; title: string; message?: string | React.ReactNode; onConfirm: () => Promise<any>; isLoading?: boolean;
    }>({ isOpen: false, cost: 0, featureKey: '', title: '', onConfirm: async () => {} });

    const showToast = (message: string, type: 'info' | 'success' | 'error') => setToast({ id: Date.now(), message, type });
    
    const handleNavigate = (page: Page) => { 
        setLastPage(currentPage);
        setCurrentPage(page); 
        if (page !== Page.Chronicle) {
            setNewMomentId(null);
        }
        setIsMobileMenuOpen(false);
        window.scrollTo(0, 0); 
    };

    const handleUpdateMoment = (moment: Moment) => {
        setMoments(prev => prev.map(m => m.id === moment.id ? moment : m));
        if (activeMoment?.id === moment.id) {
            setActiveMoment(moment);
        }
    };

    const handleUpdateJourney = (journey: Journey) => {
        setJourneys(prev => prev.map(j => j.id === journey.id ? journey : j));
        if (activeJourney?.id === journey.id) {
            setActiveJourney(journey);
        }
    };

    const handleUpdateItem = (item: Moment | Journey) => {
        if ('momentIds' in item) {
            handleUpdateJourney(item as Journey);
        } else {
            handleUpdateMoment(item as Moment);
        }
    };

    const handleDeleteMoment = (id: number) => {
        setMoments(prev => prev.filter(m => m.id !== id));
        if (activeMoment?.id === id) {
            setActiveMoment(null);
        }
        showToast("Memory deleted successfully", "info");
    };

    const handleRegisterClick = (tier?: UserTier) => {
        setPendingTier(tier || 'free');
        setShowAuthModal(true);
    };

    const handleAuthSuccess = (isNewUser: boolean) => {
        setShowAuthModal(false);
        // Prioritize Empathy ritual for new users to found their dynasty
        if (isNewUser) {
            handleNavigate(Page.Interview);
        } else {
            handleNavigate(Page.Home);
        }
    };

    const handleCheckoutConfirm = (tier: UserTier) => {
        setUserTier(tier);
        setShowCheckout(false);
        setPendingTier(null);
        handleNavigate(Page.Home);
        showToast(`Welcome to the ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan!`, 'success');
    };

    const handlePurchaseTokens = (amount: number) => {
        setCreditState(prev => ({
            ...prev,
            balance: prev.balance + amount
        }));
        showToast(`${amount.toLocaleString()} Memory Energy Units credited to your reservoir.`, 'success');
    };

    const handleLogout = async () => {
        await logout();
        handleNavigate(Page.Landing);
    };

    const triggerConfirmation = (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string | React.ReactNode, title?: string) => {
        const executeAction = async () => {
            try {
                await onConfirm();
                if (cost > 0) {
                    setCreditState(prev => ({ ...prev, balance: prev.balance - cost }));
                    if (cost < HIGH_COST_THRESHOLD) {
                        showToast(`Refined Archive (Used ${cost} energy units)`, 'info');
                    }
                }
                
                // Track living moments usage separately
                if (featureKey === 'AWAKEN_VIDEO') {
                    setCreditState(prev => ({
                        ...prev,
                        livingMomentsQuota: {
                            ...prev.livingMomentsQuota,
                            used: prev.livingMomentsQuota.used + 1
                        }
                    }));
                }

            } catch (e) { 
                showToast("Action failed. Please try again.", "error");
            }
        };

        if (cost >= HIGH_COST_THRESHOLD || featureKey === 'AWAKEN_VIDEO') {
            setConfirmation({
                isOpen: true, 
                cost: cost, 
                featureKey,
                onConfirm: async () => {
                    setConfirmation(p => ({ ...p, isLoading: true }));
                    await executeAction();
                    setConfirmation({ isOpen: false, cost: 0, featureKey: '', title: '', onConfirm: async () => {} });
                },
                message: message || "Use energy to bring this memory to life?",
                title: title || "Awaken this moment?"
            });
        } else {
            executeAction();
        }
    };

    const openAssistantWithPrompt = (prompt: string) => {
        aeterny.setInput(prompt);
        setIsFabOpen(true);
        aeterny.sendMessage(prompt);
    };

    const handleCreateJourney = (moms: Moment[], title: string, story: string) => {
        const id = Date.now();
        const newJourney: Journey = {
            id: id,
            title: title,
            description: story,
            momentIds: moms.map(m => m.id),
            coverImage: moms[0].image || moms[0].images?.[0] || '',
            favorite: false,
            isLegacy: false
        };
        setJourneys(prev => [newJourney, ...prev]);
        setNewMomentId(id);
        showToast("New Journæy woven into your chronicle.", "success");
    };

    const handleCreateEpoch = (jors: Journey[], title: string, story: string, theme: string) => {
        const newEpoch: Epoch = {
            id: Date.now(),
            title: title,
            description: story,
            journeyIds: jors.map(j => j.id),
            theme: theme,
            dateRange: "Various Eras",
            coverImage: jors[0].coverImage
        };
        setEpochs(prev => [newEpoch, ...prev]);
        showToast("New Æpoch founded in your history.", "success");
    };

    const handleSelectMoment = (m: Moment, autoPlay: boolean = false) => {
        setActiveMoment(m);
        setIsAutoPlayPending(autoPlay);
        handleNavigate(Page.MomentDetail);
    };

    const handleSelectJourney = (j: Journey) => {
        setActiveJourney(j);
        handleNavigate(Page.JourneyDetail);
    };

    const handleEditMomentDirect = (m: Moment) => {
        setActiveMoment(m);
        setIsAutoPlayPending(false);
        handleNavigate(Page.Curate);
    };

    const handleDemoComplete = (shouldRegister: boolean, demoData?: any) => {
        setShowDemo(false);
        if (demoData) {
            const id = Date.now();
            const newMoment: Moment = {
                id: id,
                type: 'standard',
                aiTier: 'diamond',
                pinned: true,
                title: demoData.title,
                date: new Date().toLocaleDateString(),
                description: demoData.story,
                image: demoData.images[0],
                images: demoData.images,
                location: demoData.tags.location[0],
                people: demoData.tags.people,
                activities: demoData.tags.activities,
                photoCount: demoData.images.length
            };
            setMoments(prev => [newMoment, ...prev]);
            setNewMomentId(id);
        }
        
        if (shouldRegister) {
            setShowAuthModal(true);
        } else if (!user) {
            handleNavigate(Page.Landing);
        }
    };

    const contextualMoments = useMemo(() => {
        if ([Page.House, Page.FamilyMoments, Page.FamilyStoryline].includes(currentPage)) {
            return moments.filter(m => m.houseId === activeHouseId || (!m.houseId && activeHouseId === 'miller'));
        }
        return moments;
    }, [moments, activeHouseId, currentPage]);

    const renderPage = () => {
        if (!user && ![Page.Landing, Page.About, Page.Legal, Page.Articles, Page.Subscription, Page.Archivist, Page.LegacyTeaser].includes(currentPage)) {
            return (
                <LandingPage 
                    onLogin={() => setShowAuthModal(true)} 
                    onRegister={handleRegisterClick} 
                    onSkipForDemo={async () => { await loginAsGuest(); handleNavigate(Page.Home); }} 
                    onNavigate={handleNavigate} 
                    onStartDemo={() => setShowDemo(true)} 
                    language={language}
                    onLanguageChange={handleLanguageChange}
                />
            );
        }

        switch (currentPage) {
            case Page.Landing: 
                return <LandingPage onLogin={() => setShowAuthModal(true)} onRegister={handleRegisterClick} onSkipForDemo={async () => { await loginAsGuest(); handleNavigate(Page.Home); }} onNavigate={handleNavigate} onStartDemo={() => setShowDemo(true)} onOpenArchivist={() => setShowBulkModal(true)} language={language} onLanguageChange={handleLanguageChange} />;
            case Page.About: return <AboutPage onNavigate={handleNavigate} />;
            case Page.Archivist: return <ArchivistLandingPage onNavigate={handleNavigate} onStartOptimization={() => setShowBulkModal(true)} />;
            case Page.Subscription: return <SubscriptionPage onNavigate={handleNavigate} currentUserTier={userTier} onSubscribe={(t) => { setPendingTier(t); setShowCheckout(true); }} onPurchaseTokens={handlePurchaseTokens} />;
            case Page.LegacyTeaser: return <LegacyTeaserPage onNavigate={handleNavigate} />;
            case Page.Interview: return ( <InterviewPage onComplete={() => handleNavigate(Page.Home)} aeternyAvatar={null} aeternyVoice={aeternyVoice} setAeternyVoice={setAeternyVoice} aeternyStyle="Warm & Empathetic" setAeternyStyle={() => {}} onCreateFirstMoment={(data) => { const id = Date.now(); const m = { ...data, id: id, pinned: true } as Moment; setMoments([m]); setNewMomentId(id); return m; }} showToast={showToast} userTier={userTier} /> );
            case Page.Home: return <HomePage onNavigate={handleNavigate} moments={moments} journeys={journeys} onSelectMoment={handleSelectMoment} onSelectJourney={handleSelectJourney} onEditMoment={handleEditMomentDirect} language={language} onToggleFab={() => setIsFabOpen(!isFabOpen)} openAssistantWithPrompt={prompt => openAssistantWithPrompt(prompt)} lastPage={lastPage} onToggleDreamMode={() => setIsDreamMode(!isDreamMode)} />;
            case Page.Studio: return <StudioPage onNavigate={handleNavigate} userTier={userTier} tokenState={creditState} />;
            case Page.House: return <HousePage onNavigate={handleNavigate} userTier={userTier} moments={moments} onSelectMoment={(m) => handleSelectMoment(m)} familyName={activeHouse.name} onFamilyNameChange={handleFamilyNameChange} familyHeaderImages={activeHouse.headerImages} onUpdateFamilyHeader={handleUpdateFamilyHeader} userName={userName} pendingAction={pendingAction} onActionHandled={() => setPendingAction(null)} />;
            case Page.Housekeepers: return <HousekeepersPage onNavigate={handleNavigate} members={activeHouse.members} onUpdateMember={handleUpdateMember} />;
            case Page.DataInsight: return <DataInsightPage moments={moments} onNavigate={handleNavigate} />;
            case Page.Create: return <UploadPage onCreateMoment={(m) => { const id = Date.now(); setMoments([{...m as Moment, id}, ...moments]); setNewMomentId(id); handleNavigate(Page.Chronicle); }} onNavigate={handleNavigate} userTier={userTier} tokenState={creditState} />;
            case Page.Record: return <RecordPage onCreateMoment={(m) => { const id = Date.now(); setMoments([{...m as Moment, id}, ...moments]); setNewMomentId(id); handleNavigate(Page.Chronicle); }} onNavigate={handleNavigate} language={language} />;
            case Page.Curate: return <CuratePage moments={moments} onUpdateMoment={handleUpdateMoment} initialMoment={activeMoment} onNavigate={handleNavigate} userTier={userTier} tokenState={creditState} triggerConfirmation={triggerConfirmation} showToast={showToast} />;
            case Page.SmartCollection: return <SmartCollectionPage moments={moments} journeys={journeys} onNavigate={handleNavigate} onCreateJourney={handleCreateJourney} onCreateEpoch={handleCreateEpoch} showToast={showToast} />;
            case Page.Chronicle: return <MomentsPage moments={moments} journeys={journeys} onCreateJourney={handleCreateJourney} onNavigate={handleNavigate} onUpdateMoment={handleUpdateMoment} onUpdateItem={handleUpdateItem} onDeleteMoment={handleDeleteMoment} userTier={userTier} triggerConfirmation={triggerConfirmation} onSelectMoment={handleSelectMoment} onSelectJourney={handleSelectJourney} newMomentId={newMomentId} />;
            case Page.MomentDetail: {
                const selectedMoment = activeMoment || moments[0]; 
                // Passed houses down to the Detail page to enable internal sharing
                // Corrected 'Warm & Empathic' to 'Warm & Empathetic' to match AeternyStyle type definition.
                return selectedMoment ? <MomentDetailPage moment={selectedMoment} moments={moments} onBack={() => handleNavigate(Page.Chronicle)} onNavigate={handleNavigate} onUpdateMoment={handleUpdateMoment} aeternyVoice={aeternyVoice} aeternyStyle={'Warm & Empathetic'} onEditMoment={(m) => { setActiveMoment(m); setIsAutoPlayPending(false); handleNavigate(Page.Curate); }} onDeleteMoment={handleDeleteMoment} userTier={userTier} triggerConfirmation={triggerConfirmation} autoPlay={isAutoPlayPending} onAutoPlayStarted={() => setIsAutoPlayPending(false)} onSelectMoment={handleSelectMoment} setIsReliveActive={setIsReliveActive} houses={Object.values(houses)} /> : <HomePage onNavigate={handleNavigate} moments={moments} journeys={journeys} onSelectMoment={handleSelectMoment} onSelectJourney={handleSelectJourney} onEditMoment={handleEditMomentDirect} language={language} onToggleFab={() => setIsFabOpen(!isFabOpen)} openAssistantWithPrompt={prompt => openAssistantWithPrompt(prompt)} lastPage={lastPage} onToggleDreamMode={() => setIsDreamMode(!isDreamMode)} />;
            }
            case Page.JourneyDetail: {
                // Corrected 'Warm & Empathic' to 'Warm & Empathetic' to match AeternyStyle type definition.
                return activeJourney ? <JourneyDetailPage journey={activeJourney} moments={moments} onBack={() => handleNavigate(Page.Chronicle)} onNavigate={handleNavigate} onSelectMoment={handleSelectMoment} onUpdateJourney={handleUpdateJourney} userTier={userTier} aeternyVoice={aeternyVoice} aeternyStyle={'Warm & Empathetic'} setIsReliveActive={setIsReliveActive} /> : <HomePage onNavigate={handleNavigate} moments={moments} journeys={journeys} onSelectMoment={handleSelectMoment} onSelectJourney={handleSelectJourney} onEditMoment={handleEditMomentDirect} language={language} onToggleFab={() => setIsFabOpen(!isFabOpen)} openAssistantWithPrompt={prompt => openAssistantWithPrompt(prompt)} lastPage={lastPage} onToggleDreamMode={() => setIsDreamMode(!isDreamMode)} />;
            }
            case Page.Profile: return <ProfilePage profilePic={profilePic} onNavigate={handleNavigate} userTier={userTier} setUserTier={setUserTier} creditState={creditState} showToast={showToast} language={language} setLanguage={setLanguage} triggerConfirmation={triggerConfirmation} theme={theme} setTheme={setTheme} moments={moments} aeternyVoice={aeternyVoice} setAeternyVoice={setAeternyVoice} defaultStoryStyle={defaultStoryStyle} setDefaultStoryStyle={setStoryStyle} />;
            case Page.BulkUpload: return <BulkUploadPage onNavigate={handleNavigate} userTier={userTier} triggerConfirmation={triggerConfirmation} tokenState={creditState} />;
            case Page.BulkUploadReview: return <BulkUploadReviewPage onNavigate={handleNavigate} />;
            case Page.FamilySpace: return <FamilySpacePage onNavigate={handleNavigate} userTier={userTier} moments={moments} familyName={activeHouse.name} onFamilyNameChange={()=>{}} familyHeaderImages={activeHouse.headerImages} onUpdateFamilyHeader={()=>{}} onSelectMoment={(m)=>{ handleSelectMoment(m); }} onPinToggle={()=>{}} onUpdateMoment={handleUpdateMoment} onEditMoment={()=>{}} onDeleteMoment={handleDeleteMoment} />;
            case Page.FamilyStoryline: return <FamilyStorylinePage moments={contextualMoments} onBack={() => handleNavigate(Page.House)} onSelectMoment={(m) => { handleSelectMoment(m); }} />;
            case Page.FamilyTree: return <FamilyTreePage onBack={() => handleNavigate(Page.House)} onNavigate={handleNavigate} />;
            case Page.FamilyInsight: return <FamilyInsightPage moments={contextualMoments} onNavigate={handleNavigate} familyName={activeHouse.name} />;
            case Page.FamilyMoments: return <FamilyMomentsPage moments={contextualMoments} onSelectMoment={handleSelectMoment} onUpdateMoment={handleUpdateMoment} userTier={userTier} onNavigate={handleNavigate} />;
            case Page.Magazine: return <MagazinePage onNavigate={handleNavigate} userTier={userTier} moments={moments} journeys={journeys} triggerConfirmation={triggerConfirmation} />;
            case Page.Journaling: return <JournalingPage onNavigate={handleNavigate} />;
            case Page.Photobook: return <PhotobookPage onNavigate={handleNavigate} />;
            case Page.Housekeepers: return <HousekeepersPage onNavigate={handleNavigate} members={activeHouse.members} onUpdateMember={handleUpdateMember} />;
            case Page.Discovery: return <DiscoveryPage moments={moments} onNavigate={handleNavigate} onSelectMoment={handleSelectMoment} language={language} />;
            case Page.LegacySpace: return <LegacySpacePage onNavigate={handleNavigate} userTier={userTier} profilePic={profilePic} userName={userName} moments={moments} journeys={journeys} onSelectMoment={handleSelectMoment} />;
            case Page.LegacyTrust: return <LegacyTrustPage onBack={() => handleNavigate(Page.LegacySpace)} userTier={userTier} onNavigate={handleNavigate} triggerConfirmation={triggerConfirmation} />;
            case Page.TimeCapsule: return <TimeCapsulePage moments={moments} onBack={() => handleNavigate(Page.LegacySpace)} triggerConfirmation={triggerConfirmation} />;
            case Page.Biografer: return <BiograferPage onBack={() => handleNavigate(Page.LegacySpace)} onNavigate={handleNavigate} triggerConfirmation={triggerConfirmation} userTier={userTier} />;
            case Page.VRLab: return <VRLabPage onNavigate={handleNavigate} />;
            default: return <HomePage onNavigate={handleNavigate} moments={moments} journeys={journeys} onSelectMoment={handleSelectMoment} onSelectJourney={handleSelectJourney} onEditMoment={handleEditMomentDirect} language={language} onToggleFab={() => setIsFabOpen(!isFabOpen)} openAssistantWithPrompt={prompt => openAssistantWithPrompt(prompt)} lastPage={lastPage} onToggleDreamMode={() => setIsDreamMode(!isDreamMode)} />;
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-[#050811] flex flex-col items-center justify-center">
                 <Loader2 className="w-12 h-12 text-cyan-400 mb-8" />
                 <BrandLogo className="text-white opacity-20" size="text-2xl" />
            </div>
        );
    }

    const isAppShellVisible = !!user && ![Page.Landing, Page.Interview].includes(currentPage);

    return (
        <div className="relative">
            {isDreamMode && moments.length > 0 && <DreamMode moments={moments} onExit={() => setIsDreamMode(false)} />}
            
            {!isDreamMode && !isReliveActive && isAppShellVisible && (
                <>
                    <Header onNavigate={handleNavigate} onLogout={handleLogout} currentPage={currentPage} userTier={userTier} profilePic={profilePic} spaceContext="personal" creditState={creditState} />
                    <Sidebar currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} language={language} userTier={userTier} profilePic={profilePic} userName={userName} onToggleDreamMode={() => setIsDreamMode(!isDreamMode)} isDreamMode={isDreamMode} onToggleAeterny={() => setIsFabOpen(!isFabOpen)} momentsCount={moments.length} creditState={creditState} />
                    
                    <MobileNav 
                        currentPage={currentPage} 
                        onNavigate={handleNavigate} 
                        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        onToggleAeterny={() => setIsFabOpen(!isFabOpen)}
                        aeternyActive={aeterny.isLoading || aeterny.isTtsPlaying || aeterny.isRecording}
                        vocalIntensity={aeterny.vocalIntensity}
                    />

                    <MobileMenuOverlay 
                        isOpen={isMobileMenuOpen} 
                        onClose={() => setIsMobileMenuOpen(false)} 
                        onNavigate={handleNavigate} 
                        onLogout={handleLogout}
                        onToggleDreamMode={() => { setIsDreamMode(true); setIsMobileMenuOpen(false); }}
                    />
                    
                    <AeternyFab 
                      isOpen={isFabOpen} 
                      onToggle={() => setIsFabOpen(!isFabOpen)} 
                      onNavigate={handleNavigate} 
                      messages={aeterny.messages} 
                      input={aeterny.input} 
                      onInputChange={aeterny.setInput} 
                      onSend={aeterny.sendMessage} 
                      isLoading={aeterny.isLoading} 
                      isRecording={aeterny.isRecording} 
                      onToggleRecording={aeterny.toggleRecording} 
                      isTtsEnabled={aeterny.isTtsEnabled} 
                      onToggleTts={aeterny.toggleTts} 
                      onPlayTts={aeterny.playTts} 
                      isTtsPlaying={aeterny.isTtsPlaying} 
                      currentlyPlayingText={aeterny.currentlyPlayingText} 
                      aeternyAvatar={null} 
                      onContextualSend={() => {}} 
                      liveDisplay={aeterny.liveDisplay} 
                      currentPage={currentPage} 
                      onTriggerGuide={() => setIsFabOpen(false)} 
                      moments={moments} 
                      userName={userName} 
                      vocalIntensity={aeterny.vocalIntensity} 
                      userTier={userTier}
                      onTriggerAction={(action) => setPendingAction(action)}
                    />
                </>
            )}

            <div className={`relative min-h-screen ${isAppShellVisible ? 'md:pl-20' : ''} transition-all duration-500`}>
                {renderPage()}
            </div>
            
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} intendedTier={pendingTier || undefined} />}
            {showCheckout && pendingTier && <CheckoutOverlay tier={pendingTier} onConfirm={handleCheckoutConfirm} onCancel={() => setShowCheckout(false)} />}
            {showBulkModal && <BulkUploadModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} onComplete={() => { setShowBulkModal(false); handleNavigate(Page.BulkUploadReview); }} />}
            {showDemo && <ProductDemo onClose={() => setShowDemo(false)} onComplete={handleDemoComplete} aeternyVoice={aeternyVoice} defaultStyle={defaultStoryStyle} />}
            <Toast toast={toast} onDismiss={() => setToast(null)} />
            <ConfirmationModal 
                isOpen={confirmation.isOpen} 
                onClose={() => setConfirmation(p => ({ ...p, isOpen: false }))} 
                onConfirm={confirmation.onConfirm} 
                cost={confirmation.cost} 
                currentBalance={creditState.balance}
                title={confirmation.title} 
                message={confirmation.message} 
                isLoading={confirmation.isLoading} 
            />
        </div>
    );
};

export default App;
