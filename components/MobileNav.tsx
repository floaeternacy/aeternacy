
import React from 'react';
import { Page } from '../types';
import { Menu, Compass, Library, Home, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { PresenceGlow } from './AeternyFab';

interface MobileNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onToggleMenu?: () => void;
    onToggleAeterny: () => void;
    aeternyActive: boolean;
    vocalIntensity: number;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
    currentPage, 
    onNavigate, 
    onToggleMenu, 
    onToggleAeterny,
    aeternyActive,
    vocalIntensity
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const navItems = [
        { page: Page.Create, icon: Plus, label: 'Capture' },
        { page: Page.Home, icon: Compass, label: 'Home' },
        { page: Page.Chronicle, icon: Library, label: 'Chronicle' },
        { page: Page.House, icon: Home, label: 'House' },
    ];

    return (
        <div className="fixed bottom-8 left-0 right-0 z-[9999] px-6 md:hidden pointer-events-none flex justify-center items-center gap-3">
            {/* Primary Navigation Pill */}
            <div className={`
                flex items-center bg-[#0A0C14]/85 backdrop-blur-3xl border border-white/10 
                rounded-[2.5rem] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] pointer-events-auto
            `}>
                {/* Mobile Menu Trigger */}
                <button 
                    onClick={onToggleMenu}
                    className="p-3.5 text-slate-500 hover:text-white transition-all active:scale-90"
                    aria-label="Open Menu"
                >
                    <Menu size={20} />
                </button>

                {/* Aesthetic Divider */}
                <div className="w-px h-6 bg-white/10 mx-1"></div>

                {/* Dynamic Navigation Nodes */}
                <div className="flex items-center gap-1 pr-2">
                    {navItems.map((item) => {
                        const isActive = currentPage === item.page;
                        return (
                            <button
                                key={item.page}
                                onClick={() => onNavigate(item.page)}
                                className={`relative p-3.5 rounded-2xl transition-all duration-500 group
                                    ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}
                                `}
                            >
                                <item.icon 
                                    size={20} 
                                    className={`transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'group-active:scale-90'}`} 
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* æterny Satellite Trigger */}
            <button 
                onClick={onToggleAeterny}
                className="pointer-events-auto transition-transform duration-500 hover:scale-110 active:scale-95 shadow-2xl rounded-full"
            >
                <PresenceGlow active={aeternyActive} intensity={vocalIntensity} />
            </button>
        </div>
    );
};

export default MobileNav;
