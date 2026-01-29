import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export type BackVariant = 'breadcrumb' | 'sanctuary' | 'ghost';

interface PageHeaderProps {
    title?: string;
    onBack?: () => void;
    backLabel?: string;
    backVariant?: BackVariant;
    actions?: React.ReactNode;
    variant?: 'immersive' | 'utility';
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    onBack, 
    backLabel = "BACK", 
    actions, 
    variant = 'utility',
    className = ''
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDark = theme === 'dark';
    
    const bgStyle = variant === 'utility' || isScrolled
        ? isDark 
            ? 'bg-[#050811]/60 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'bg-white/80 backdrop-blur-xl border-b border-stone-200 shadow-sm'
        : 'bg-transparent border-transparent';

    return (
        <header 
            className={`fixed top-0 left-0 md:left-20 right-0 z-[70] transition-all duration-700 px-6 md:px-10 flex items-center justify-center pointer-events-none ${bgStyle} ${className} h-16 md:h-20`}
        >
            <div className="w-full flex items-center justify-between max-w-[1700px] mx-auto pointer-events-auto">
                <div className="flex items-center gap-4 md:gap-8">
                    {onBack && (
                        <button 
                            onClick={onBack} 
                            className={`flex items-center gap-2 transition-all active:scale-95 group ${isDark ? 'text-slate-500 hover:text-white' : 'text-stone-400 hover:text-stone-900'}`}
                        >
                            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.5} />
                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em]">
                                {backLabel}
                            </span>
                        </button>
                    )}

                    {(onBack && title) && (
                        <div className="h-4 w-px bg-white/10 hidden md:block opacity-40"></div>
                    )}
                    
                    <div className="flex items-baseline gap-3 md:gap-5 overflow-hidden">
                        {title && (
                            <h1 className={`font-brand font-bold text-sm md:text-lg tracking-[0.1em] uppercase leading-none truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                {title}
                            </h1>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {actions}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;