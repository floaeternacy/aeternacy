
import React, { useState } from 'react';
import { Moment } from '../types';
import { CheckCircle, Loader2, Share2, ArrowLeft, Lock, Calendar, Plus, Wand2, Mail } from 'lucide-react';
import { createLegacyLetter } from '../services/geminiService';
import { TOKEN_COSTS } from '../services/costCatalog';
import PageHeader from './PageHeader';

interface TimeCapsulePageProps {
  moments: Moment[];
  onBack: () => void;
  triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string) => void;
}

type CapsuleStep = 'intro' | 'select' | 'compose' | 'schedule' | 'confirm' | 'sealed';

const TimeCapsulePage: React.FC<TimeCapsulePageProps> = ({ moments, onBack, triggerConfirmation }) => {
  const [step, setStep] = useState<CapsuleStep>('intro');
  const [selectedMomentIds, setSelectedMomentIds] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [capsuleTitle, setCapsuleTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleMoment = (id: number) => {
    setSelectedMomentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleAIDraft = async () => {
      if (selectedMomentIds.size === 0) return;
      setIsGenerating(true);
      try {
        const selectedMoments = moments.filter(m => selectedMomentIds.has(m.id));
        const draft = await createLegacyLetter(selectedMoments);
        setMessage(draft);
      } catch (err) {
        console.error("AI Draft failed", err);
      } finally {
        setIsGenerating(false);
      }
  };

  const handleSealCapsule = () => {
      const executeSeal = async () => {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API
          setStep('sealed');
          console.log("TELEMETRY: token_spend_ok, feature: TIME_CAPSULE_SEAL, cost: " + TOKEN_COSTS.TIME_CAPSULE_SEAL);
      };
      
      triggerConfirmation(TOKEN_COSTS.TIME_CAPSULE_SEAL, 'TIME_CAPSULE_SEAL', executeSeal, "Seal this Time Capsule?");
  };

  const renderContent = () => {
      switch (step) {
          case 'intro':
              return (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto animate-fade-in-up">
                      <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-8 ring-1 ring-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                          <Lock className="w-10 h-10 text-amber-400" />
                      </div>
                      <h1 className="text-5xl font-brand font-bold text-white mb-6">Send a Message to the Future</h1>
                      <p className="text-xl text-slate-300 leading-relaxed mb-10">
                          Curate a collection of memories and lock them away until a special date. A birthday, a wedding, or simply "someday".
                      </p>
                      <button 
                          onClick={() => setStep('select')}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-amber-500/20 transition-transform transform hover:scale-105 flex items-center gap-3"
                      >
                          <Plus className="w-6 h-6" /> Create New Capsule
                      </button>
                  </div>
              );

          case 'select':
              return (
                  <div className="max-w-5xl mx-auto animate-fade-in">
                      <div className="text-center mb-10">
                          <h2 className="text-3xl font-brand font-bold text-white mb-2">Step 1: Choose Memories</h2>
                          <p className="text-slate-400">Select the moments you want to include in this capsule.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-24">
                          {moments.map(moment => (
                              <button 
                                  key={moment.id} 
                                  onClick={() => handleToggleMoment(moment.id)}
                                  className={`aspect-square rounded-xl overflow-hidden group relative text-left transition-all duration-300 ${selectedMomentIds.has(moment.id) ? 'ring-4 ring-amber-500 scale-95' : 'hover:scale-105'}`}
                              >
                                  <img src={moment.image || moment.images?.[0]} alt={moment.title} className="w-full h-full object-cover" />
                                  <div className={`absolute inset-0 bg-black transition-opacity ${selectedMomentIds.has(moment.id) ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}></div>
                                  {selectedMomentIds.has(moment.id) && (
                                      <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                          <CheckCircle className="w-4 h-4 text-white" />
                                      </div>
                                  )}
                              </button>
                          ))}
                      </div>
                      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
                          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 pr-2 flex items-center gap-4 shadow-2xl">
                              <span className="text-white font-bold">{selectedMomentIds.size} selected</span>
                              <button 
                                  onClick={() => setStep('compose')}
                                  disabled={selectedMomentIds.size === 0}
                                  className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Next
                              </button>
                          </div>
                      </div>
                  </div>
              );

          case 'compose':
              return (
                  <div className="max-w-2xl mx-auto animate-fade-in">
                      <div className="text-center mb-8">
                          <h2 className="text-3xl font-brand font-bold text-white mb-2">Step 2: Add a Note</h2>
                          <p className="text-slate-400">Write a message to your future self or a loved one.</p>
                      </div>
                      <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
                          <textarea 
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Dear future me..."
                              className="w-full h-64 bg-transparent text-lg text-slate-200 resize-none outline-none font-serif leading-relaxed placeholder:text-slate-600"
                          />
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                              <button 
                                  onClick={handleAIDraft}
                                  disabled={isGenerating}
                                  className="flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4" />}
                                  Draft with æterny
                              </button>
                              <span className="text-xs text-slate-500">{message.length} chars</span>
                          </div>
                      </div>
                      <div className="mt-8 flex justify-center gap-4">
                          <button onClick={() => setStep('select')} className="text-slate-400 hover:text-white px-6 py-3 font-semibold">Back</button>
                          <button 
                              onClick={() => setStep('schedule')}
                              disabled={!message.trim()}
                              className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
                          >
                              Next
                          </button>
                      </div>
                  </div>
              );

          case 'schedule':
              return (
                  <div className="max-w-md mx-auto animate-fade-in text-center">
                      <h2 className="text-3xl font-brand font-bold text-white mb-2">Step 3: Set the Date</h2>
                      <p className="text-slate-400 mb-8">When should this capsule unlock?</p>
                      
                      <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/10 mb-8">
                          <div className="mb-6">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-left">Capsule Title</label>
                              <input 
                                  type="text" 
                                  value={capsuleTitle} 
                                  onChange={(e) => setCapsuleTitle(e.target.value)}
                                  placeholder="e.g. 18th Birthday"
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-bold text-lg outline-none focus:border-amber-500"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-left">Unlock Date</label>
                              <input 
                                  type="date" 
                                  value={unlockDate}
                                  onChange={(e) => setUnlockDate(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-lg outline-none focus:border-amber-500 appearance-none"
                              />
                          </div>
                      </div>

                      <div className="flex justify-center gap-4">
                          <button onClick={() => setStep('compose')} className="text-slate-400 hover:text-white px-6 py-3 font-semibold">Back</button>
                          <button 
                              onClick={() => setStep('confirm')}
                              disabled={!unlockDate || !capsuleTitle}
                              className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
                          >
                              Review
                          </button>
                      </div>
                  </div>
              );

          case 'confirm':
              return (
                  <div className="max-w-lg mx-auto animate-fade-in">
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                          
                          <div className="text-center mb-8">
                              <Lock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                              <h2 className="text-2xl font-brand font-bold text-white mb-1">{capsuleTitle}</h2>
                              <p className="text-amber-200/80 font-mono text-sm">Unlocks: {new Date(unlockDate).toLocaleDateString()}</p>
                          </div>

                          <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-white/5">
                                  <span className="text-slate-400 text-sm">Contains</span>
                                  <span className="text-white font-bold">{selectedMomentIds.size} Momænts</span>
                              </div>
                              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                  <span className="text-slate-400 text-sm">Note Length</span>
                                  <span className="text-white font-bold">{message.length} characters</span>
                              </div>
                          </div>

                          <button 
                              onClick={handleSealCapsule}
                              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
                          >
                              Seal Capsule ({TOKEN_COSTS.TIME_CAPSULE_SEAL} Tk)
                          </button>
                          <button onClick={() => setStep('schedule')} className="w-full text-center text-slate-500 hover:text-white text-sm mt-4">Make Changes</button>
                      </div>
                  </div>
              );

          case 'sealed':
              return (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto animate-scale-in-top-right">
                      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/40">
                          <CheckCircle className="w-12 h-12 text-green-400" />
                      </div>
                      <h2 className="text-4xl font-brand font-bold text-white mb-4">Capsule Sealed</h2>
                      <p className="text-slate-300 mb-8">
                          Your time capsule is now secure in the Legacy Vault. It will remain encrypted until {new Date(unlockDate).toLocaleDateString()}.
                      </p>
                      <button 
                          onClick={() => {
                              setStep('intro');
                              setSelectedMomentIds(new Set());
                              setMessage('');
                              setUnlockDate('');
                              setCapsuleTitle('');
                          }}
                          className="bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-8 rounded-full transition-colors"
                      >
                          Done
                      </button>
                  </div>
              );
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white -mt-20">
      <PageHeader 
        title={step === 'intro' ? "Time Capsules" : "New Capsule"} 
        onBack={step === 'intro' ? onBack : () => setStep('intro')} 
        variant="utility"
      />
      <div className="container mx-auto px-6 pt-24 pb-12">
          {renderContent()}
      </div>
    </div>
  );
};

export default TimeCapsulePage;
