
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Shield, X, Check, Settings, Fingerprint, Lock } from 'lucide-react';

// --- Types ---

interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    float: boolean;
    functional: boolean;
}

interface CookieContextType {
    consent: ConsentState;
    hasResponded: boolean;
    updateConsent: (newConsent: ConsentState) => void;
    acceptAll: () => void;
    rejectAll: () => void;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

// --- Context ---

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookieConsent = () => {
    const context = useContext(CookieContext);
    if (!context) throw new Error('useCookieConsent must be used within a CookieProvider');
    return context;
};

// --- Provider Component ---

export const CookieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [consent, setConsent] = useState<ConsentState>({
        necessary: true,
        analytics: false,
        marketing: false,
        float: false,
        functional: false
    });
    const [hasResponded, setHasResponded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem('aeternacy-cookie-consent');
        if (storedConsent) {
            try {
                const parsed = JSON.parse(storedConsent);
                setConsent({ ...parsed, necessary: true });
                setHasResponded(true);
            } catch (e) {
                console.error("Cookie parse error", e);
            }
        }
    }, []);

    const saveConsent = (newConsent: ConsentState) => {
        setConsent(newConsent);
        setHasResponded(true);
        localStorage.setItem('aeternacy-cookie-consent', JSON.stringify(newConsent));
    };

    const acceptAll = () => {
        const allTrue = { necessary: true, analytics: true, marketing: true, float: true, functional: true };
        saveConsent(allTrue);
        setIsModalOpen(false);
    };

    const rejectAll = () => {
        const allFalse = { necessary: true, analytics: false, marketing: false, float: false, functional: false };
        saveConsent(allFalse);
        setIsModalOpen(false);
    };

    return (
        <CookieContext.Provider value={{ 
            consent, hasResponded, updateConsent: saveConsent, acceptAll, rejectAll, 
            isModalOpen, openModal: () => setIsModalOpen(true), closeModal: () => setIsModalOpen(false) 
        }}>
            {children}
            <CookieSettingsModal />
        </CookieContext.Provider>
    );
};

// --- UI Components ---

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
    <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-10 flex-shrink-0 items-center rounded-full transition-all duration-300 ease-in-out ${
            checked ? 'bg-cyan-500' : 'bg-slate-800'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                checked ? 'translate-x-5' : 'translate-x-1'
            }`}
        />
    </button>
);

export const CookieArtifact: React.FC = () => {
    const { hasResponded, isModalOpen, acceptAll, openModal } = useCookieConsent();

    if (hasResponded || isModalOpen) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[10001] animate-fade-in-up">
            <div className="relative group max-w-full md:max-w-md w-full">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                
                <div className="relative bg-[#0A0C14]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner">
                            <Shield size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white leading-none mb-1">Vault Security</h2>
                            <p className="text-[11px] text-slate-400 font-medium leading-tight">We use essential cookies to secure your legacy data.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        <button 
                            onClick={openModal}
                            className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                            Options
                        </button>
                        <button 
                            onClick={acceptAll}
                            className="flex-[1.5] sm:flex-none px-6 py-2.5 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CookieSettingsModal: React.FC = () => {
    const { isModalOpen, closeModal, consent, updateConsent, acceptAll, rejectAll } = useCookieConsent();
    const [tempConsent, setTempConsent] = useState<ConsentState>(consent);

    useEffect(() => {
        if (isModalOpen) setTempConsent(consent);
    }, [isModalOpen, consent]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in" onClick={closeModal}>
            <div 
                className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#080C14] shadow-[0_60px_150px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-canvas-expand"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 pb-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold font-brand text-white tracking-tighter">Privacy Protocol</h2>
                        <p className="text-xs text-slate-500 mt-1 font-serif italic">Manage your digital footprint and archival synchronization.</p>
                    </div>
                    <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/5 text-slate-500 transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-8 pb-8 space-y-3 custom-scrollbar">
                    {[
                        { id: 'necessary', label: 'Security & Integrity', desc: 'Required for archival synchronization and secure sessions.', disabled: true },
                        { id: 'functional', label: 'Persona Continuity', desc: 'Remembers your curator preferences and voice profiles.' },
                        { id: 'analytics', label: 'Evolution Metrics', desc: 'Anonymized data to refine our neural models.' },
                        { id: 'marketing', label: 'Platform Outreach', desc: 'Used for essential platform news and milestone updates.' }
                    ].map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all group">
                            <div className="pr-4">
                                <p className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{cat.label}</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{cat.desc}</p>
                            </div>
                            <Toggle 
                                checked={tempConsent[cat.id as keyof ConsentState]} 
                                onChange={(val) => setTempConsent(prev => ({ ...prev, [cat.id]: val }))}
                                disabled={cat.disabled}
                            />
                        </div>
                    ))}
                </div>

                <div className="p-8 pt-4 bg-black/40 border-t border-white/5 flex flex-col gap-3">
                    <button 
                        onClick={() => { updateConsent(tempConsent); closeModal(); }}
                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                        Save Configuration
                    </button>
                    <button 
                        onClick={rejectAll}
                        className="w-full py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
                    >
                        Reject Optional
                    </button>
                </div>
            </div>
        </div>
    );
};
