
import React, { useState } from 'react';

interface TooltipProps {
    text: string;
    description: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, description, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            {isVisible && (
                <div className="absolute z-[1000] bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#0B101B] border border-white/10 rounded-2xl shadow-3xl animate-fade-in-up backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-1">{text}</p>
                    <p className="text-xs text-slate-400 font-serif italic leading-relaxed">{description}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0B101B]"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
