import React, { useEffect } from 'react';
import { X, Info, CheckCircle, AlertTriangle, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export type ToastMessage = {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
};

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

const icons = {
  info: <Info className="w-4 h-4 text-sky-400" />,
  success: <Bot className="w-4 h-4 text-cyan-400" />,
  error: <AlertTriangle className="w-4 h-4 text-red-400" />,
};

const ringColors = {
  info: 'border-sky-500/30 shadow-sky-900/20',
  success: 'border-cyan-500/30 shadow-cyan-900/20',
  error: 'border-red-500/30 shadow-red-900/20',
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div 
        className={`fixed top-20 right-4 md:top-24 md:right-8 z-[10001] w-full max-w-[320px] transition-all duration-500 pointer-events-auto`}
    >
        <div 
            className={`
                relative flex items-start gap-4 p-5 rounded-[1.8rem] border backdrop-blur-2xl shadow-2xl animate-toast-pop-in origin-top-right
                ${isDark ? 'bg-[#0B101B]/95 border-white/10' : 'bg-white/95 border-stone-200'}
                ${ringColors[toast.type]}
            `}
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-stone-50'}`}>
                {icons[toast.type]}
            </div>
            
            <div className="flex-1 pt-1">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${toast.type === 'success' ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {toast.type === 'success' ? 'æterny Insight' : 'Vault System'}
                </p>
                <p className={`text-[13px] leading-relaxed font-medium ${isDark ? 'text-slate-200' : 'text-stone-800'}`}>
                    {toast.message}
                </p>
            </div>

            <button 
                onClick={onDismiss} 
                className="p-1 text-slate-500 hover:text-white transition-colors"
                aria-label="Dismiss notification"
            >
                <X size={14} />
            </button>
        </div>

        <style>{`
            @keyframes toast-pop-in {
                0% { 
                    opacity: 0; 
                    transform: scale(0.8) translate(20px, -20px); 
                }
                100% { 
                    opacity: 1; 
                    transform: scale(1) translate(0, 0); 
                }
            }
            .animate-toast-pop-in {
                animation: toast-pop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>
    </div>
  );
};

export default Toast;