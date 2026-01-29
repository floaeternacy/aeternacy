
import React, { useState, useEffect } from 'react';
import { Page, UserTier, CreditState } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { ShieldCheck, Landmark, Zap } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    currentPage: Page;
    userTier: UserTier;
    profilePic: string | null;
    spaceContext: 'personal' | 'family' | 'legacy';
    creditState: CreditState;
    onToggleMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { theme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDark = theme === 'dark';

    return (
        <header className={`
            md:hidden fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between
            transition-all duration-500 ease-in-out pointer-events-none
            ${isScrolled ? 'bg-[#050811]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'bg-transparent border-transparent'}
        `}>
            <div className="flex items-center gap-4 pointer-events-auto">
                <button onClick={() => onNavigate(Page.Home)} className="active:scale-95 transition-all duration-500 flex items-center overflow-hidden">
                    <span className={`font-brand font-bold text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-stone-900'}`}>æ</span>
                </button>
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
                {/* Status indicators removed to preserve Sanctuary aesthetic */}
            </div>
        </header>
    );
};

export default Header;
