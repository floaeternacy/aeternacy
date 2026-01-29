import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Page } from '../types';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import AeternyAvatarDisplay from './AeternyAvatarDisplay';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourGuideProps {
    isOpen: boolean;
    onClose: () => void;
    currentPage: Page;
    aeternyAvatar: string | null;
}

const TOUR_STEPS: Partial<Record<Page, TourStep[]>> = {
    [Page.Home]: [
        { targetId: 'home-hero', title: 'Your Dashboard', content: "Welcome to your personal command center. Here you can see an overview of your timestream and daily prompts.", position: 'bottom' },
        { targetId: 'home-widgets', title: 'Smart Widgets', content: "These widgets change daily. Record a memory, answer a question, or revisit a moment from the past.", position: 'top' },
        { targetId: 'home-customize', title: 'Make it Yours', content: "You can rearrange or add widgets to suit your preservation style.", position: 'top' },
    ],
    // Fix: Changed Page.Moments to Page.Chronicle
    [Page.Chronicle]: [
        { targetId: 'moments-header', title: 'The Collection', content: "This is where all your memories live. Scroll through time or search for specific moments.", position: 'bottom' },
        { targetId: 'moments-controls', title: 'View & Filter', content: "Switch between Grid and Timeline views, or use Smart Filters to find memories by emotion or location.", position: 'bottom' },
        { targetId: 'moments-create', title: 'Curate Journeys', content: "Select multiple moments to weave them into a 'Journæy'—a curated album with a narrative arc.", position: 'top' },
    ],
    [Page.Create]: [
        { targetId: 'create-upload', title: 'Upload Area', content: "Drag and drop your photos here. You can upload up to 10 images for a single moment.", position: 'right' },
        { targetId: 'create-smart-options', title: 'Smart Options', content: "Or import directly from your cloud accounts to save time.", position: 'top' },
        { targetId: 'create-studio', title: 'The Studio', content: "Once uploaded, æterny will analyze your photos and write a beautiful story draft right here.", position: 'left' },
    ],
    [Page.FamilySpace]: [
        { targetId: 'family-hero', title: 'Shared Heritage', content: "A dedicated space for your family's collective history. Moments shared here are visible to all invited members.", position: 'bottom' },
        { targetId: 'family-content', title: 'Collaborative Feed', content: "See recent contributions, AI curation suggestions, and activity from your family members.", position: 'top' },
        { targetId: 'family-tree', title: 'Family Tree', content: "Visualize your lineage and manage member roles. Add grandparents, children, and siblings.", position: 'top' },
        { targetId: 'family-circles', title: 'Memory Circles', content: "Create private subgroups like 'Parents' or 'Siblings' for more focused sharing.", position: 'top' },
    ]
};

const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onClose, currentPage, aeternyAvatar }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const steps = TOUR_STEPS[currentPage] || [];
    const currentStep = steps[currentStepIndex];

    const updateRect = useCallback(() => {
        if (!currentStep) return;
        const element = document.getElementById(currentStep.targetId);
        if (element) {
            const rect = element.getBoundingClientRect();
            // Basic visibility check: if strictly 0 width/height, it's likely hidden
            if (rect.width > 0 && rect.height > 0) {
                setTargetRect(rect);
            }
        } else {
            // If element is missing (e.g. dynamic content not loaded), we might want to stay on previous rect or hide
            // For now, let's keep it visible but maybe centered if element is missing?
            // setTargetRect(null); 
        }
    }, [currentStep]);

    // Initial scroll-to when step changes
    useEffect(() => {
        if (isOpen && currentStep) {
            const element = document.getElementById(currentStep.targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Multiple timeouts to catch the rect after smooth scroll settles
                setTimeout(updateRect, 100);
                setTimeout(updateRect, 400);
                setTimeout(updateRect, 800);
            } else {
                console.warn(`Tour target ${currentStep.targetId} not found`);
                // If target not found, maybe just show in center?
                setTargetRect({
                    top: window.innerHeight / 2 - 1,
                    left: window.innerWidth / 2 - 1,
                    width: 2,
                    height: 2,
                    bottom: window.innerHeight / 2 + 1,
                    right: window.innerWidth / 2 + 1,
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    toJSON: () => {}
                });
            }
        } else if (isOpen && !currentStep) {
            // No steps found for this page
            // onClose();
        }
    }, [currentStepIndex, isOpen, updateRect, currentStep, onClose]);

    // Live tracking of scroll/resize
    useEffect(() => {
        if (!isOpen) return;
        
        window.addEventListener('scroll', updateRect, { capture: true, passive: true });
        window.addEventListener('resize', updateRect);
        
        // Immediate update loop for a short while to catch animations
        const interval = setInterval(updateRect, 100);
        setTimeout(() => clearInterval(interval), 1000);

        return () => {
            window.removeEventListener('scroll', updateRect);
            window.removeEventListener('resize', updateRect);
            clearInterval(interval);
        };
    }, [isOpen, updateRect]);

    if (!isOpen || !steps.length) return null;

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    // Calculate tooltip position with viewport clamping
    const getTooltipStyle = (): React.CSSProperties => {
        const isMobile = window.innerWidth < 768;
        
        // Mobile: Fixed Bottom Sheet
        if (isMobile) {
            return {
                position: 'fixed',
                bottom: '24px',
                left: '20px',
                right: '20px',
                zIndex: 1002,
                transform: 'none',
                maxWidth: 'none',
                width: 'auto'
            };
        }

        // Desktop: Fixed positioning relative to viewport
        if (!targetRect) return { opacity: 0, pointerEvents: 'none' };

        const padding = 24; // Space between target and tooltip
        const tooltipW = 340; // Desired width
        const tooltipH = 200; // Estimated height for calculation
        
        let pos = currentStep?.position || 'bottom';
        
        const spaceTop = targetRect.top;
        const spaceBottom = window.innerHeight - targetRect.bottom;
        const spaceLeft = targetRect.left;
        const spaceRight = window.innerWidth - targetRect.right;

        // Auto-flip logic
        if (pos === 'top' && spaceTop < tooltipH + padding && spaceBottom > spaceTop) pos = 'bottom';
        if (pos === 'bottom' && spaceBottom < tooltipH + padding && spaceTop > spaceBottom) pos = 'top';
        if (pos === 'left' && spaceLeft < tooltipW + padding && spaceRight > spaceLeft) pos = 'right';
        if (pos === 'right' && spaceRight < tooltipW + padding && spaceLeft > spaceRight) pos = 'left';

        let top = 0;
        let left = 0;
        let transform = '';

        const centerX = targetRect.left + (targetRect.width / 2);
        const centerY = targetRect.top + (targetRect.height / 2);

        switch (pos) {
            case 'top':
                top = targetRect.top - padding;
                left = centerX;
                transform = 'translate(-50%, -100%)';
                break;
            case 'bottom':
                top = targetRect.bottom + padding;
                left = centerX;
                transform = 'translate(-50%, 0)';
                break;
            case 'left':
                top = centerY;
                left = targetRect.left - padding;
                transform = 'translate(100%, -50%)';
                break;
            case 'right':
                top = centerY;
                left = targetRect.right + padding;
                transform = 'translate(0, -50%)';
                break;
            default: // Center fallback
                top = centerY;
                left = centerX;
                transform = 'translate(-50%, -50%)';
        }

        // --- Boundary Clamping ---
        // We need to account for the translate(-50%) when clamping
        
        const edgePadding = 20;
        
        // Clamping Horizontal
        if (pos === 'top' || pos === 'bottom') {
            const halfW = tooltipW / 2;
            // min left center point
            const minLeft = halfW + edgePadding;
            // max left center point
            const maxLeft = window.innerWidth - halfW - edgePadding;
            
            if (left < minLeft) left = minLeft;
            if (left > maxLeft) left = maxLeft;
        } 
        else {
            // For left/right positioning, ensure width fits
            // If it pushes off screen, maybe just clamp the edge
            // Logic handled naturally by 'left' coordinate for left/right, 
            // but we might need to clamp vertically?
        }

        // Clamping Vertical
        // If element is at the very top/bottom edge, ensure tooltip stays on screen
        if (pos === 'left' || pos === 'right') {
             // Center Y clamping logic if needed, but usually translate(-50%) handles it unless target is huge
             if (top < tooltipH/2 + edgePadding) top = tooltipH/2 + edgePadding;
             if (top > window.innerHeight - tooltipH/2 - edgePadding) top = window.innerHeight - tooltipH/2 - edgePadding;
        }
        else {
             // For top/bottom, ensure it doesn't go off top/bottom
             if (top < edgePadding) top = edgePadding;
             if (top > window.innerHeight - edgePadding) top = window.innerHeight - edgePadding;
        }

        return {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            transform: transform,
            width: `${tooltipW}px`,
            zIndex: 1002,
            transition: 'all 0.1s ease-out' // Smooth tracking
        };
    };

    return createPortal(
        <div className="fixed inset-0 z-[1000] overflow-hidden pointer-events-none">
            {/* Backdrop - allows clicks to pass through to the spotlighted element if needed? 
                Usually a tour blocks interaction unless it's a 'coach mark'. 
                Here we block interaction with a backdrop. */}
            <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 pointer-events-auto"></div>

            {/* Spotlight Hole (SVG Mask) */}
            {targetRect && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 z-[1001]">
                    <defs>
                        <mask id="spotlight-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect 
                                x={targetRect.left - 8} 
                                y={targetRect.top - 8} 
                                width={targetRect.width + 16} 
                                height={targetRect.height + 16} 
                                rx="12" 
                                fill="black" 
                            />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#spotlight-mask)" />
                    {/* Glowing Border around target */}
                    <rect 
                        x={targetRect.left - 8} 
                        y={targetRect.top - 8} 
                        width={targetRect.width + 16} 
                        height={targetRect.height + 16} 
                        rx="12" 
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        className="animate-pulse"
                        strokeOpacity="0.6"
                    />
                </svg>
            )}

            {/* Tooltip Card - Pointer events auto to allow clicking buttons */}
            <div 
                className="bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 backdrop-blur-xl pointer-events-auto flex flex-col"
                style={getTooltipStyle()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30 shadow-inner flex-shrink-0">
                            <AeternyAvatarDisplay avatar={aeternyAvatar} className="w-full h-full rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg font-brand leading-tight">{currentStep?.title || "Guide"}</h3>
                            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Step {currentStepIndex + 1} of {steps.length}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto max-h-[150px] mb-6 custom-scrollbar">
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                        {currentStep?.content || "Exploring..."}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-auto">
                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-6 bg-cyan-500' : 'w-1.5 bg-slate-700'}`}></div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={handlePrev} 
                            disabled={currentStepIndex === 0}
                            className="p-2 rounded-full border border-white/10 text-slate-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            onClick={handleNext}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/20 transform hover:scale-105"
                        >
                            {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TourGuide;