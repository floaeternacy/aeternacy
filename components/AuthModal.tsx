
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, ArrowRight, Mail, Lock, Fingerprint, ShieldCheck, UserCircle2, Loader2, AlertCircle, Sparkles, Eye, EyeOff, Globe, Check } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { UserTier } from '../types';
import GoogleIcon from './icons/GoogleIcon';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (isNewUser: boolean) => void;
  intendedTier?: UserTier;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess, intendedTier }) => {
  const [isLogin, setIsLogin] = useState(intendedTier ? false : true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginAsGuest, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        onAuthSuccess(false);
      } else {
        await signup(email, password);
        onAuthSuccess(true);
      }
    } catch (err: any) {
      let msg = 'Connection failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential') msg = 'Incorrect email or password.';
      else if (err.message) msg = err.message;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
      onAuthSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onAuthSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center animate-fade-in"
    >
      {/* BACKGROUND: Full-viewport gradient and deeper, more neutral archival photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#02040a] via-[#050b1a] to-[#02040a]">
          <div className="absolute inset-0 opacity-30 grayscale scale-105 pointer-events-none transition-all duration-[3s]">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover blur-[4px]" 
                alt="" 
              />
          </div>
          {/* Ambient light effects (cyan/deep blue glow) */}
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[160px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div 
        className="w-full max-w-xl relative animate-fade-in-up p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MAIN CARD (Glassmorphism) */}
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all group z-50"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* HEADER */}
            <div className="flex flex-col items-center text-center mb-10">
                {/* Updated to full brand logo instead of icon only */}
                <BrandLogo size="text-4xl" className="text-white mb-8" showTrademark={true} />
                
                <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-3 tracking-tight leading-none">
                    {isLogin ? 'The Archive Awaits' : 'Foundation of a Dynasty'}
                </h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
                    {isLogin ? 'Access your secured life-story archive' : 'Begin the centennial preservation of your legacy'}
                </p>
            </div>
            
            {error && (
                <div className="mb-8 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold flex items-center gap-4 animate-fade-in">
                    <AlertCircle size={18} className="text-red-400 shrink-0" />
                    {error}
                </div>
            )}
            
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email input with floating label */}
                <div className="relative group">
                    <input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="peer w-full bg-white/5 border border-white/10 px-6 pt-7 pb-3 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-cyan-400/50 transition-all shadow-inner"
                        required
                    />
                    <label 
                        htmlFor="email"
                        className="absolute left-6 top-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all 
                        peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-placeholder-shown:top-5 peer-placeholder-shown:text-slate-400
                        peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-cyan-400"
                    >
                        Vault ID / Email Address
                    </label>
                </div>

                {/* Password input with floating label and eye icon */}
                <div className="relative group">
                    <input 
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="peer w-full bg-white/5 border border-white/10 px-6 pt-7 pb-3 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-cyan-400/50 transition-all shadow-inner"
                        required
                    />
                    <label 
                        htmlFor="password"
                        className="absolute left-6 top-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all 
                        peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-placeholder-shown:top-5 peer-placeholder-shown:text-slate-400
                        peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-cyan-400"
                    >
                        Access Key / Password
                    </label>
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors pt-2"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* OPTIONS ROW */}
                <div className="flex items-center justify-between px-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/20 bg-white/5 transition-all group-hover:border-cyan-400">
                            <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                            <Check size={12} className="text-cyan-400 scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Remember access</span>
                    </label>
                    <button type="button" className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:underline underline-offset-4">
                        Forgot key?
                    </button>
                </div>
                
                {/* PRIMARY CTA */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black font-black py-5 rounded-full transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] disabled:opacity-50 mt-4 hover:bg-slate-100"
                >
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : (isLogin ? 'SIGN IN' : 'ESTABLISH VAULT')}
                </button>
            </form>

            {/* DIVIDER: Clean lines without background */}
            <div className="relative my-10 flex items-center gap-4">
                <div className="flex-1 border-t border-white/10" />
                <span className="shrink-0 text-[8px] text-slate-600 uppercase font-black tracking-[0.4em] bg-transparent">OR CONTINUE WITH</span>
                <div className="flex-1 border-t border-white/10" />
            </div>

            {/* SOCIAL LOGIN */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                    <GoogleIcon className="w-4 h-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">Google</span>
                </button>

                <button 
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                    <Eye className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">Visitor</span>
                </button>
            </div>

            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center hover:text-white transition-colors"
            >
                {isLogin ? "Don't have a vault yet? Establish one →" : "Already an archivist? Sign in →"}
            </button>

            {/* TRUST BADGES */}
            <div className="mt-12 flex justify-center items-center gap-8 opacity-20 grayscale hover:opacity-40 transition-all">
                <div className="flex items-center gap-1.5">
                    <Lock size={12} className="text-cyan-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Vault Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-indigo-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest">EU Hosted</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest">GDPR Compliant</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
