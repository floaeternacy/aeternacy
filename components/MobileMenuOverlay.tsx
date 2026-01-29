
import React from 'react';
import { Page } from '../types';
import { 
    Compass, Library, UploadCloud, Mic, 
    Layout, Home, UserCircle2, Moon, LogOut, X 
} from 'lucide-react';

interface MobileMenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    onToggleDreamMode: () => void;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ 
    isOpen, onClose, onNavigate, onLogout, onToggleDreamMode 
}) => {
    if (!isOpen) return null;

    const menuItems = [
        { label: 'HOME', icon: Compass, action: () => onNavigate(Page.Home) },
        { label: 'CHRONICLE', icon: Library, action: () => onNavigate(Page.Chronicle) },
        { label: 'CAPTURE', icon: UploadCloud, action: () => onNavigate(Page.Create) },
        { label: 'VOICE', icon: Mic, action: () => onNavigate(Page.Record) },
        { label: 'STUDIO', icon: Layout, action: () => onNavigate(Page.Studio) },
        { label: 'THE HOUSE', icon: Home, action: () => onNavigate(Page.House) },
        { label: 'ACCOUNT', icon: UserCircle2, action: () => onNavigate(Page.Profile) },
        { label: 'DREAM', icon: Moon, action: onToggleDreamMode },
        { label: 'SIGN OUT', icon: LogOut, action: onLogout },
    ];

    return (
        <div className="fixed inset-0 z-[10005] flex flex-col justify-end animate-fade-in md:hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
            ></div>

            {/* Content Window */}
            <div className="relative bg-[#0A0C14] border-t border-white/10 rounded-t-[2.5rem] p-10 pt-16 shadow-[0_-20px_100px_rgba(0,0,0,0.8)] animate-fade-in-up">
                {/* Pull Handle */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/10 rounded-full"></div>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-10 p-2 text-slate-500 hover:text-white transition-all"
                >
                    <X size={24} />
                </button>

                {/* Grid Layout */}
                <div className="grid grid-cols-3 gap-y-12 gap-x-4">
                    {menuItems.map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => {
                                item.action();
                                if (item.label !== 'DREAM') onClose();
                            }}
                            className="flex flex-col items-center gap-4 group active:scale-90 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-[1.2rem] bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-white/[0.06] transition-all shadow-xl">
                                <item.icon size={28} strokeWidth={1.5} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileMenuOverlay;
