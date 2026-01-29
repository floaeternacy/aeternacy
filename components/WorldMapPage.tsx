import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Page, UserTier, Moment } from '../types';
import { MapPin, Globe, Compass, Sparkles, BrainCircuit, Users, History, ArrowRight, X, Loader2, Search, Info, Maximize, Navigation2, Plus, Minus, Landmark, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from './PageHeader';
import { neuralMapSearch } from '../services/geminiService';
import { TOKEN_COSTS } from '../services/costCatalog';

declare const L: any; // Global Leaflet from CDN

interface WorldMapPageProps {
    moments: Moment[];
    onNavigate: (page: Page) => void;
    userTier: UserTier;
    triggerConfirmation: (cost: number, featureKey: string, onConfirm: () => Promise<any>, message?: string) => void;
    onSelectMoment: (moment: Moment) => void;
}

const WorldMapPage: React.FC<WorldMapPageProps> = ({ moments, onNavigate, userTier, triggerConfirmation, onSelectMoment }) => {
    const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
    const [mapQuery, setMapQuery] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [aiInsight, setAiInsight] = useState<{ text: string; sources: any[] } | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const clusterGroupRef = useRef<any>(null);

    const mapMoments = useMemo(() => {
        return moments.filter(m => (m.lat !== undefined && m.lng !== undefined && !isNaN(m.lat) && !isNaN(m.lng)));
    }, [moments]);

    const isLægacy = userTier === 'lægacy';
    const hasMapsAccess = userTier !== 'free';

    const findRichestRegion = () => {
        if (mapMoments.length === 0) return { center: [20, 0], zoom: 2 };
        const densityMap: Record<string, Moment[]> = {};
        mapMoments.forEach(m => {
            const key = `${Math.round(m.lat! / 5) * 5},${Math.round(m.lng! / 5) * 5}`;
            if (!densityMap[key]) densityMap[key] = [];
            densityMap[key].push(m);
        });
        const richestKey = Object.keys(densityMap).reduce((a, b) => 
            densityMap[a].length > densityMap[b].length ? a : b
        );
        const cluster = densityMap[richestKey];
        const avgLat = cluster.reduce((sum, m) => sum + m.lat!, 0) / cluster.length;
        const avgLng = cluster.reduce((sum, m) => sum + m.lng!, 0) / cluster.length;
        return { center: [avgLat, avgLng], zoom: 5 };
    };

    const navigateToMoment = (moment: Moment) => {
        if (mapRef.current) {
            setSelectedMoment(moment);
            setIsSidebarOpen(true);
            mapRef.current.setView([moment.lat, moment.lng], 14, { animate: true });
        }
    };

    const handleNext = () => {
        if (!selectedMoment) return;
        const currentIndex = mapMoments.findIndex(m => m.id === selectedMoment.id);
        const nextIndex = (currentIndex + 1) % mapMoments.length;
        navigateToMoment(mapMoments[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedMoment) return;
        const currentIndex = mapMoments.findIndex(m => m.id === selectedMoment.id);
        const prevIndex = (currentIndex - 1 + mapMoments.length) % mapMoments.length;
        navigateToMoment(mapMoments[prevIndex]);
    };

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || !hasMapsAccess) return;

        if (mapRef.current) {
            mapRef.current.remove();
        }

        const startLocation = findRichestRegion();

        const map = L.map(mapContainerRef.current, {
            center: startLocation.center,
            zoom: startLocation.zoom,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
        });

        // Use a dark themed tile set that matches Aeternacy better
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        mapRef.current = map;

        const clusterGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 40,
            iconCreateFunction: (cluster: any) => {
                const count = cluster.getChildCount();
                return L.divIcon({
                    html: `<div class="photo-cluster"><span class="cluster-count">${count}</span></div>`,
                    className: 'custom-cluster-icon',
                    iconSize: [32, 32]
                });
            }
        });

        clusterGroupRef.current = clusterGroup;

        mapMoments.forEach(m => {
            const thumb = m.image || (m.images && m.images[0]);
            const color = m.isLegacy ? '#f59e0b' : '#06b6d4';
            
            const photoIcon = L.divIcon({
                className: 'custom-photo-pin-container',
                html: `<div class="photo-pin-minimal" style="color: ${color}">
                        <img src="${thumb}" />
                       </div>`,
                iconSize: [44, 44], 
                iconAnchor: [22, 22] 
            });

            if (m.lat !== undefined && m.lng !== undefined) {
                const marker = L.marker([m.lat, m.lng], { icon: photoIcon });
                marker.on('click', (e: any) => {
                    setSelectedMoment(m);
                    setIsSidebarOpen(true);
                    map.setView([m.lat, m.lng], 14, { animate: true });
                    L.DomEvent.stopPropagation(e);
                });
                clusterGroup.addLayer(marker);
            }
        });

        map.addLayer(clusterGroup);
        
        // Initial invalidate
        setTimeout(() => map.invalidateSize(), 500);

        // ResizeObserver to handle layout shifts
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [mapMoments, hasMapsAccess]);

    const handleNeuralInquiry = () => {
        if (!isLægacy) {
            onNavigate(Page.Subscription);
            return;
        }
        const execute = async () => {
            setIsAiLoading(true);
            try {
                const contextualQuery = `Local history for ${selectedMoment?.location}. Question: ${mapQuery}.`;
                const result = await neuralMapSearch(contextualQuery, selectedMoment?.lat, selectedMoment?.lng);
                setAiInsight(result);
            } finally {
                setIsAiLoading(false);
            }
        };
        triggerConfirmation(TOKEN_COSTS.AI_INSIGHT * 5, 'LOCATION_RESEARCH', execute, `Research history of ${selectedMoment?.location}?`);
    };

    const resetView = () => {
        if (clusterGroupRef.current && mapRef.current) {
            try {
                const bounds = clusterGroupRef.current.getBounds();
                if (bounds && typeof bounds.isValid === 'function' && bounds.isValid()) {
                    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                } else {
                    mapRef.current.setView([20, 0], 3);
                }
            } catch (e) {
                mapRef.current.setView([20, 0], 3);
            }
            setSelectedMoment(null);
            setIsSidebarOpen(false);
            setAiInsight(null);
        }
    };

    if (!hasMapsAccess) {
        return (
            <div className="h-full w-full bg-[#050811] text-white flex flex-col items-center justify-center p-6 text-center">
                <Globe size={48} className="text-cyan-400 mb-8" />
                <h1 className="text-4xl font-bold font-brand mb-6 tracking-tighter">Memory Atlas Locked.</h1>
                <p className="text-xl text-slate-400 max-w-xl mx-auto mb-12 font-serif italic">"Unlock the geospatial dimensions of your legacy."</p>
                <button onClick={() => onNavigate(Page.Subscription)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-10 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-2xl">Found My Dynasty</button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-[#050811] flex flex-col overflow-hidden animate-fade-in">
            {/* The Parent (MomentsPage) handles the PageHeader for Atlas mode */}
            
            <div className="flex-grow relative h-full overflow-hidden">
                <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ background: '#050811' }}>
                    {/* Leaflet injects here */}
                </div>

                {/* Floating Map Controls */}
                <div className="absolute left-6 bottom-10 z-20 flex flex-col gap-3">
                    <div className="flex flex-col rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
                        <button onClick={() => mapRef.current?.zoomIn()} className="p-3.5 text-slate-400 hover:text-white transition-all border-b border-white/5 active:scale-90"><Plus size={16} /></button>
                        <button onClick={() => mapRef.current?.zoomOut()} className="p-3.5 text-slate-400 hover:text-white transition-all active:scale-90"><Minus size={16} /></button>
                    </div>
                    <button onClick={resetView} className="p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white shadow-2xl active:scale-95 transition-all">
                        <Maximize size={18} />
                    </button>
                </div>

                {/* Selected Moment Sidebar */}
                {isSidebarOpen && selectedMoment && (
                    <div ref={sidebarRef} className="absolute right-0 top-0 bottom-0 w-full md:w-96 lg:w-[420px] border-l border-white/5 bg-[#080B18]/95 backdrop-blur-3xl p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <button onClick={handlePrev} className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><ChevronLeft size={20}/></button>
                                <button onClick={handleNext} className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><ChevronRight size={20}/></button>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><X size={20}/></button>
                        </div>

                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden ring-1 ring-white/10 shadow-3xl">
                            <img src={selectedMoment.image || selectedMoment.images?.[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                                    <MapPin size={12} className="text-cyan-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">{selectedMoment.location}</span>
                            </div>
                            <h3 className="text-3xl font-bold font-brand text-white tracking-tighter leading-tight">{selectedMoment.title}</h3>
                            <p className="text-base text-slate-400 leading-relaxed font-serif italic opacity-80">"{selectedMoment.description}"</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={() => onSelectMoment(selectedMoment)} className="w-full py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-95">Open Studio</button>
                            <button onClick={() => {}} className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest transition-all">View Fragments</button>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <Landmark size={20} className="text-amber-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-200">Neural Context</h4>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search size={14} className="text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                                </div>
                                <input 
                                    value={mapQuery} 
                                    onChange={(e) => setMapQuery(e.target.value)} 
                                    onKeyPress={(e) => e.key === 'Enter' && handleNeuralInquiry()}
                                    placeholder="Inquire about this location..." 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-xs text-white outline-none focus:border-amber-500/50 shadow-inner transition-all" 
                                />
                                <button 
                                    onClick={handleNeuralInquiry} 
                                    disabled={isAiLoading || !mapQuery.trim()} 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-all disabled:opacity-30 active:scale-90 shadow-lg"
                                >
                                    {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                                </button>
                            </div>
                            
                            {aiInsight ? (
                                <div className="p-6 bg-amber-950/20 border border-amber-500/20 rounded-[2rem] animate-fade-in-up">
                                    <p className="text-sm text-amber-50/90 leading-relaxed font-serif italic">
                                        "{aiInsight.text}"
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center gap-2 opacity-60">
                                    <BrainCircuit size={24} className="text-slate-700" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">æterny is listening</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorldMapPage;