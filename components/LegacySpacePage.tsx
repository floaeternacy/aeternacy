
import React from 'react';
import { Page, UserTier, Moment, Journey } from '../types';
import { Lock, Clock, Mic, BookMarked, ShieldCheck, Users, Wand2, BookOpen, Headphones, Brain, ArrowRight } from 'lucide-react';
import LegacyIcon from './icons/LegacyIcon';
import GridView from './GridView';
import Slideshow from './Slideshow';

interface LegacySpacePageProps {
    userTier: UserTier;
    onNavigate: (page: Page) => void;
    profilePic: string | null;
    userName: string;
    moments: Moment[];
    journeys: Journey[];
    onSelectMoment: (moment: Moment) => void;
}

const Feature: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center ring-1 ring-amber-500/20 mb-4">
            <Icon className="w-8 h-8 text-amber-300" />
        </div>
        <h3 className="text-xl font-bold text-white font-brand">{title}</h3>
        <p className="text-slate-400 mt-2 text-sm max-w-xs">{description}</p>
    </div>
);

const LegacyDashboard: React.FC<{ 
    onNavigate: (page: Page) => void; 
    profilePic: string | null; 
    userName: string;
    moments: Moment[];
    journeys: Journey[];
    onSelectMoment: (moment: Moment) => void;
    theme: string;
}> = ({ onNavigate, profilePic, userName, moments, journeys, onSelectMoment, theme }) => {
    
    const legacyMoments = moments.filter(m => m.isLegacy);
    const legacyJourneys = journeys.filter(j => j.isLegacy);
    const backgroundImages = moments.filter(m => m.pinned || m.isLegacy).map(m => m.image || m.images?.[0]).filter((img): img is string => !!img);

    const DashboardCard: React.FC<{ icon: React.ElementType, title: string, description: string, page: Page, isVision?: boolean }> = ({ icon: Icon, title, description, page, isVision = false }) => (
        <button onClick={() => onNavigate(page)} className={`p-8 rounded-2xl border text-left h-full flex flex-col transition-all transform hover:-translate-y-1 group relative overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50 border-white/5 hover:bg-slate-700/50 hover:border-amber-500/30' : 'bg-white border-stone-200 hover:shadow-xl hover:border-amber-500/50'}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ring-1 ${isVision ? 'bg-purple-500/10 ring-purple-500/20' : 'bg-amber-500/10 ring-amber-500/20'} mb-4`}>
                <Icon className={`w-6 h-6 ${isVision ? 'text-purple-300' : 'text-amber-300'}`} />
            </div>
            <h3 className={`text-xl font-bold font-brand flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                {title}
                {isVision && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Vision</span>}
            </h3>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-stone-600'} mt-2 text-sm flex-grow leading-relaxed`}>{description}</p>
            <p className={`text-sm font-semibold ${isVision ? 'text-purple-300' : 'text-amber-400'} mt-6 self-start`}>Explore &rarr;</p>
        </button>
    );
    
    const JourneyCard: React.FC<{ journey: Journey; onClick: () => void; }> = ({ journey, onClick }) => (
        <div onClick={onClick} className="relative aspect-[10/7] cursor-pointer group p-4">
            <div className="absolute inset-4 bg-slate-700/50 rounded-2xl ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:-rotate-6"></div>
            <div className="absolute inset-2 bg-slate-800/50 rounded-2xl ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-3"></div>
            <div className="relative w-full h-full bg-slate-800 rounded-2xl overflow-hidden ring-1 ring-white/10 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                <img src={journey.coverImage} alt={journey.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-bold text-white text-lg font-brand">{journey.title}</h3>
                    <p className="text-xs text-slate-400">{journey.momentIds.length} momænts</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen -mt-20">
             <div className="absolute inset-0 z-0">
                {backgroundImages.length > 0 ? (
                    <Slideshow images={backgroundImages} isPlaying={true} />
                ) : (
                    <div className="w-full h-full bg-slate-900"></div>
                )}
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-28 pb-8 animate-fade-in-up">
                <section className="relative mb-16 text-center">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute -inset-2 bg-amber-400 rounded-full blur-2xl opacity-30 animate-pulse-glow" style={{ animationDuration: '5s' }}></div>
                        {profilePic ? (
                            <img src={profilePic} alt="Your profile" className="relative w-full h-full object-cover rounded-full ring-4 ring-slate-700"/>
                        ) : (
                            <div className="relative w-full h-full bg-slate-700 rounded-full ring-4 ring-slate-600 flex items-center justify-center">
                                <Users className="w-16 h-16 text-slate-500" />
                            </div>
                        )}
                    </div>
                    <h1 className={`mt-6 text-4xl md:text-5xl font-bold font-brand ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Welcome to Your Lægacy, {userName}.</h1>
                    <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-stone-600'} max-w-2xl mx-auto`}>This is your private vault. A timeless space to curate, preserve, and reflect on your life's story.</p>
                </section>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DashboardCard icon={ShieldCheck} title="Legacy Trust" description="Appoint stewards and manage your succession protocol to ensure your story endures." page={Page.LegacyTrust} />
                    <DashboardCard icon={Clock} title="Time Capsules" description="Create time-locked messages and legacy letters for the future." page={Page.TimeCapsule} />
                    <DashboardCard icon={Mic} title="The Biografær" description="Engage in AI-guided interviews to build a rich, comprehensive life story." page={Page.Biografer} />
                    <DashboardCard icon={BookMarked} title="Creation Suite" description="Design and order physical magazines and photobooks from your moments." page={Page.Shop} />
                    <div className="md:col-span-2 lg:col-span-1">
                        <DashboardCard 
                          icon={Brain} 
                          title="VR Lab" 
                          description="Go beyond remembering. Step back in time and relive moments in hyper-realistic VR & AR." 
                          page={Page.VRLab} 
                          isVision={true}
                        />
                    </div>
                </div>
                
                 {legacyJourneys.length > 0 && (
                    <section className="mt-16">
                        <h2 className={`text-3xl font-bold font-brand mb-8 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Your Lægacy Journæys</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {legacyJourneys.map(journey => (
                                <JourneyCard key={journey.id} journey={journey} onClick={() => {}} />
                            ))}
                        </div>
                    </section>
                )}

                {legacyMoments.length > 0 && (
                    <section className="mt-16">
                        <h2 className={`text-3xl font-bold font-brand mb-8 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Your Lægacy Momænts</h2>
                        <GridView 
                            moments={legacyMoments}
                            onSelectMoment={onSelectMoment}
                            onNavigate={onNavigate}
                            zoomLevel={2}
                        />
                    </section>
                )}
            </div>
        </div>
    );
};


const LegacySpacePage: React.FC<LegacySpacePageProps> = ({ userTier, onNavigate, profilePic, userName, moments, journeys, onSelectMoment }) => {
    
    if (userTier === 'lægacy') {
        return <LegacyDashboard onNavigate={onNavigate} profilePic={profilePic} userName={userName} moments={moments} journeys={journeys} onSelectMoment={onSelectMoment} theme="dark" />;
    }

    const handleUpgrade = () => onNavigate(Page.Subscription);

    return (
        <div className="bg-slate-900 text-white animate-fade-in-up -mt-20">
            <section className="relative h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <img src="https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Constellations of moments" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="relative z-10 p-6">
                    <div className="mb-8">
                        <LegacyIcon className="w-16 h-16 mx-auto text-amber-300" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-brand text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}>Preserve Your Story for Generations.</h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-4 mb-8" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}>
                        Welcome to the Lægacy Space — where your memories live beyond time, secured in a private digital vault and woven into a timeless narrative for those who follow.
                    </p>
                    <button onClick={handleUpgrade} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20 mt-8">
                        Explore Lægacy Space
                    </button>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-slate-900">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        <Feature
                            icon={Lock}
                            title="Lægacy Vault"
                            description="A secure, encrypted repository for your life's story, safeguarded beyond a lifetime with advanced access controls (1 TB - 5 TB tiers)."
                        />
                        <Feature
                            icon={Clock}
                            title="Time Capsules"
                            description="Schedule momænts or journæys to unlock at specific future dates. Your story, shared when the time is right."
                        />
                        <Feature
                            icon={Mic}
                            title="The Biografær"
                            description="Engage in empathic AI interview sessions that are woven into a coherent life biography, told in your own voice."
                        />
                        <Feature
                            icon={BookMarked}
                            title="Creation Suite"
                            description="Transform your digital story into tangible hærlooms like museum-quality photobooks, magazines, and daily journals."
                        />
                    </div>
                </div>
            </section>
            
            <section className="relative py-32 md:py-40 text-center bg-black">
                <img src="https://images.pexels.com/photos/3184406/pexels-photo-3184406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Hands holding photos" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <p className="text-3xl md:text-4xl font-brand text-white italic leading-relaxed">
                        “We live twice — once in life, and once in memory.”
                    </p>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-gray-900/50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                         <h2 className="text-4xl font-bold font-brand text-white">The Complete Lægacy Experience</h2>
                         <p className="text-slate-400 mt-2">Includes everything in Fæmily, plus the entire suite of preservation tools.</p>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="flex gap-4"><Users className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" /><div><h4 className="font-bold text-white text-lg">Family Tree & Trust</h4><p className="text-slate-400 mt-1">Connect generations with roles. Invite family to collaborate and inherit access.</p></div></div>
                        <div className="flex gap-4"><Wand2 className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" /><div><h4 className="font-bold text-white text-lg">æterny Curation</h4><p className="text-slate-400 mt-1">AI-driven empathy mode refines your archives, generating beautifully written retrospectives.</p></div></div>
                        <div className="flex gap-4"><BookOpen className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" /><div><h4 className="font-bold text-white text-lg">Magæzine & Photobook</h4><p className="text-slate-400 mt-1">Physical extensions of your story, including quarterly digests and handcrafted books.</p></div></div>
                        <div className="flex gap-4"><Headphones className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" /><div><h4 className="font-bold text-white text-lg">Curation Concierge</h4><p className="text-slate-400 mt-1">Personalized assistance and priority support to help you curate your family's archive.</p></div></div>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-slate-900">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <h2 className="text-4xl font-bold font-brand text-white">Start Your Lægacy Today.</h2>
                     <p className="text-5xl font-brand font-bold text-white mt-4">€49 <span className="text-xl text-slate-400 font-normal">/ month</span></p>
                    <p className="text-slate-300 mt-4">Includes Vault (1 TB), unlimited Biografær sessions, and the complete creation suite.</p>
                    <button onClick={handleUpgrade} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20 mt-8">
                        Upgrade to Lægacy
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LegacySpacePage;
