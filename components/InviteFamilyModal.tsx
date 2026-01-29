import React, { useState } from 'react';
import { X, Mail, Plus, Trash2, Send, Users, Shield, Crown, AlertCircle, Loader2 } from 'lucide-react';

interface InviteFamilyModalProps {
    onClose: () => void;
}

interface InviteEntry {
    email: string;
    giveAdmin: boolean;
}

const InviteFamilyModal: React.FC<InviteFamilyModalProps> = ({ onClose }) => {
    const [invites, setInvites] = useState<InviteEntry[]>([{ email: '', giveAdmin: false }]);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleAddEmail = () => {
        if (invites.length < 5) {
            setInvites([...invites, { email: '', giveAdmin: false }]);
        }
    };
    
    const handleRemoveEmail = (index: number) => setInvites(invites.filter((_, i) => i !== index));
    
    const handleEmailChange = (index: number, value: string) => {
        const newInvites = [...invites];
        newInvites[index].email = value;
        setInvites(newInvites);
    };

    const handleToggleAdmin = (index: number) => {
        const newInvites = [...invites];
        newInvites[index].giveAdmin = !newInvites[index].giveAdmin;
        setInvites(newInvites);
    };

    const handleSend = async () => {
        setIsSending(true);
        // Simulate high-security transmission
        await new Promise(r => setTimeout(r, 2000));
        setIsSending(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200000] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-[#0A0C14] border border-indigo-500/30 rounded-[3rem] p-10 md:p-16 max-w-2xl w-full relative shadow-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-indigo-600 to-amber-600"></div>
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-brand font-bold text-white tracking-tight">Expand the House</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Legitimacy Protocol Active</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                <p className="text-lg text-slate-400 mb-10 leading-relaxed font-serif italic pr-8">
                    "Invite up to 5 additional members to your shared vault. You may designate specific kin as fellow Keepers."
                </p>

                <div className="space-y-4 mb-10 max-h-[320px] overflow-y-auto custom-scrollbar pr-4">
                    {invites.map((invite, index) => (
                        <div key={index} className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 animate-fade-in-up group hover:border-white/10 transition-all">
                            <div className="flex gap-4">
                                <div className="relative flex-grow">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input 
                                        type="email"
                                        value={invite.email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        placeholder="family@example.com"
                                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                                    />
                                </div>
                                {invites.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveEmail(index)}
                                        className="p-4 text-slate-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${invite.giveAdmin ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-600'}`}>
                                        <Crown size={14} fill={invite.giveAdmin ? "currentColor" : "none"} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">House Keeper Status</p>
                                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Full administrative permissions</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleToggleAdmin(index)}
                                    className={`relative w-12 h-6 rounded-full transition-all ${invite.giveAdmin ? 'bg-amber-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${invite.giveAdmin ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {invites.length < 5 && (
                        <button 
                            onClick={handleAddEmail}
                            className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-all group"
                        >
                            <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
                            <span>Add another invitation</span>
                        </button>
                    )}
                </div>

                <div className="space-y-2 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Personal Greeting</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Help me weave our shared family legacy..."
                        rows={2}
                        className="w-full p-6 bg-white/[0.02] border border-white/10 rounded-[2rem] text-white text-sm outline-none focus:border-indigo-500/50 transition-all font-serif italic shadow-inner"
                    />
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all"
                    >
                        Dismiss
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={isSending || !invites[0].email}
                        className="flex-[1.5] py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30"
                    >
                        {isSending ? (
                            <> <Loader2 size={18} className="animate-spin" /> Transmitting...</>
                        ) : (
                            <> <Send size={18} /> Seal & Transmit </>
                        )}
                    </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                    <Shield size={10} className="text-cyan-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">End-to-End Encrypted Invitation Pipeline</span>
                </div>
            </div>
        </div>
    );
};

export default InviteFamilyModal;