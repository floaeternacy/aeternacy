
import React, { useState } from 'react';
import { Page, UserTier, Language, CreditState } from '../types';
import { 
    Home, LogOut, 
    Bot, Menu, X, Layout,
    Moon, UserCircle2, TrendingUp, Library, Lock,
    Compass, Plus, Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import TokenIcon from './icons/TokenIcon';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    language: Language;
    userTier: UserTier;
    profilePic: string | null;
    userName: string;
    onToggleDreamMode: () => void;
    isDreamMode: boolean;
    onToggleAeterny: () => void;
    momentsCount: number;
    creditState: CreditState;
}

interface NavItemProps {
    page?: Page;
    icon: any;
    label: string;
    currentPage?: Page;
    onNavigate?: (page: Page) => void;
    onClick?: () => void;
    isExpanded: boolean;
    isDark: boolean;
    isActive?: boolean;
    special?: boolean;
    locked?: boolean;
    lockMessage?: string;
    activeColorClass?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
    page, icon: Icon, label, currentPage, onNavigate, onClick, 
    isExpanded, isDark, isActive: forcedActive, special, 
    locked, lockMessage, activeColorClass = 'text-cyan-400'
}) => {
    const isActive = forcedActive || (page !== undefined && currentPage === page);
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (locked) return;
        if (onClick) {
            onClick();
        } else if (onNavigate && page !== undefined) {
            onNavigate(page);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`flex items-center transition-all duration-300 group relative rounded-xl border border-transparent
                ${isExpanded 
                    ? 'w-full h-11 justify-start px-4 gap-4' 
                    : 'flex-col md:w-full md:h-11 md:justify-center px-2 py-2 md:px-0 gap-0'}
                ${isActive 
                    ? `bg-white/5 ${activeColorClass} shadow-inner` 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'}
                ${special ? 'text-cyan-400' : ''}
                ${locked ? 'cursor-not-allowed opacity-40 grayscale' : ''}
            `}
        >
            <div className={`shrink-0 transition-all duration-300 relative
                ${isActive ? `scale-110 ${activeColorClass} drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]` : 'group-hover:scale-105'}
            `}>
                <Icon size={20} />
            </div>
            
            <span className={`hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ease-out
                ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'}`}>
                {label}
            </span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ 
    currentPage, 
    onNavigate, 
    onLogout, 
    userTier, 
    profilePic, 
    userName,
    onToggleDreamMode,
    isDreamMode,
    onToggleAeterny,
    creditState
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { page: Page.Create, icon: Plus, label: "Capture" },
        { page: Page.Home, icon: Compass, label: "Home" },
        { page: Page.Chronicle, icon: Library, label: "Chronicle" },
        { page: Page.House, icon: Home, label: "The House" },
    ];

    const tierConfig: Record<UserTier, { label: string, color: string }> = {
        'free': { label: 'Trial', color: 'text-slate-400' },
        'essæntial': { label: 'Essential', color: 'text-cyan-400' },
        'fæmily': { label: 'Family', color: 'text-indigo-400' },
        'fæmily_plus': { label: 'Family Plus', color: 'text-purple-400' },
        'lægacy': { label: 'Lægacy', color: 'text-[#B87D4B]' }
    };

    const currentTier = tierConfig[userTier] || tierConfig.essæntial;

    return (
        <aside 
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`hidden md:flex fixed inset-y-0 left-0 z-[9999] flex-col transition-[width,background-color] duration-500 ease-[cubic-bezier(0.2,0,0,1)]
                ${isDark ? 'bg-[#050811] border-r border-white/5' : 'bg-white border-r border-stone-200'} 
                ${isExpanded ? 'w-64 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : 'w-20'}
            `}
        >
            <div className={`h-24 flex items-center overflow-hidden flex-shrink-0 cursor-pointer px-3`} onClick={() => onNavigate(Page.Home)}>
                <div className={`w-full flex items-center transition-all duration-500 ${isExpanded ? 'justify-start px-4' : 'justify-center px-0'}`}>
                    <div className="shrink-0 flex items-center">
                        <span className={`font-brand font-bold text-[1.65rem] tracking-tighter ${isDark ? 'text-white' : 'text-stone-900'}`}>æ</span>
                        <div className={`transition-all duration-500 ease-out overflow-hidden flex items-center ${isExpanded ? 'max-w-xs opacity-100 ml-0' : 'max-w-0 opacity-0 pointer-events-none'}`}>
                            <span className={`font-brand font-bold text-[1.65rem] tracking-tighter relative ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                ternacy
                                <sup className="text-[0.35em] font-medium absolute -top-1 -right-4 opacity-60">™</sup>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 space-y-2 scrollbar-hide">
                {navItems.map((item) => (
                    <NavItem 
                        key={item.page}
                        {...item}
                        currentPage={currentPage}
                        onNavigate={onNavigate}
                        isExpanded={isExpanded}
                        isDark={isDark}
                    />
                ))}
                <NavItem 
                    page={Page.DataInsight} 
                    icon={TrendingUp} 
                    label="Insights" 
                    currentPage={currentPage} 
                    onNavigate={onNavigate} 
                    isExpanded={isExpanded} 
                    isDark={isDark} 
                />
            </div>

            <div className={`mt-auto p-4 border-t transition-colors duration-500 ${isDark ? 'border-white/5 bg-black/20' : 'border-stone-200 bg-stone-50'}`}>
                
                <div className="mb-2">
                    <NavItem 
                        icon={Moon}
                        label="Dreamscape"
                        onClick={onToggleDreamMode}
                        isActive={isDreamMode}
                        isExpanded={isExpanded}
                        isDark={isDark}
                    />
                </div>

                <div 
                    onClick={() => onNavigate(Page.Profile)}
                    className={`flex items-center mb-4 cursor-pointer group/profile transition-all duration-500 h-11 px-1 rounded-xl hover:bg-white/5 ${isExpanded ? 'gap-4' : 'justify-center'}`}
                >
                    <div className="shrink-0 w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover/profile:ring-cyan-500/50 transition-all shadow-2xl">
                        {profilePic ? (
                            <img src={profilePic} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                                <UserCircle2 size={18} />
                            </div>
                        )}
                    </div>
                    <div className={`min-w-0 flex-1 transition-all duration-500 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'}`}>
                        <p className="text-[10px] font-bold text-white truncate leading-none mb-1">{userName}</p>
                        <p className={`text-[8px] font-black uppercase tracking-widest ${currentTier.color}`}>{currentTier.label}</p>
                    </div>
                </div>

                <NavItem 
                    icon={LogOut}
                    label="Log Out"
                    onClick={onLogout}
                    isExpanded={isExpanded}
                    isDark={isDark}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
