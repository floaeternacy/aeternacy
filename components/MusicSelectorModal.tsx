
import React, { useState } from 'react';
import { X, Search, Music, Play, Check } from 'lucide-react';
import SpotifyIcon from './icons/SpotifyIcon';
import { MusicTrack } from '../types';

interface MusicSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (track: MusicTrack) => void;
}

const mockTracks: MusicTrack[] = [
    { id: '1', name: 'Golden Hour', artist: 'JVKE', albumArt: 'https://i.scdn.co/image/ab67616d0000b2734415494d682577c3d7023023', url: 'spotify:track:1' },
    { id: '2', name: 'A Sky Full of Stars', artist: 'Coldplay', albumArt: 'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b9131299bd1a8f', url: 'spotify:track:2' },
    { id: '3', name: 'Dreams', artist: 'Fleetwood Mac', albumArt: 'https://i.scdn.co/image/ab67616d0000b27393433a752243d54020a8383f', url: 'spotify:track:3' },
    { id: '4', name: 'Good Days', artist: 'SZA', albumArt: 'https://i.scdn.co/image/ab67616d0000b27387478df72c3d59e3594b2938', url: 'spotify:track:4' },
    { id: '5', name: 'Here Comes The Sun', artist: 'The Beatles', albumArt: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25', url: 'spotify:track:5' },
    { id: '6', name: 'Night Trouble', artist: 'Petit Biscuit', albumArt: 'https://i.scdn.co/image/ab67616d0000b273398939023471032b904494c9', url: 'spotify:track:6' },
];

const MusicSelectorModal: React.FC<MusicSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [step, setStep] = useState<'connect' | 'search'>('connect');
    const [searchQuery, setSearchQuery] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    if (!isOpen) return null;

    const handleConnect = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setStep('search');
        }, 1500);
    };

    const filteredTracks = mockTracks.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[600px]" onClick={e => e.stopPropagation()}>
                
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
                    <h2 className="text-xl font-bold font-brand text-white flex items-center gap-3">
                        <Music className="w-5 h-5 text-cyan-400" />
                        Add Soundscape
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto">
                    {step === 'connect' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 mb-4">
                                <SpotifyIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Connect to Music</h3>
                            <p className="text-slate-400 max-w-xs">
                                Link your Spotify account to attach the songs that defined this moment.
                            </p>
                            <button 
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                            >
                                {isConnecting ? 'Connecting...' : 'Connect Spotify'}
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search songs, artists..." 
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>
                            
                            <div className="flex-grow space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                                {filteredTracks.map(track => (
                                    <button 
                                        key={track.id} 
                                        onClick={() => onSelect(track)}
                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors group text-left"
                                    >
                                        <img src={track.albumArt} alt={track.name} className="w-12 h-12 rounded-md object-cover shadow-sm group-hover:shadow-md transition-all" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-white text-sm">{track.name}</p>
                                            <p className="text-xs text-slate-400">{track.artist}</p>
                                        </div>
                                        <div className="p-2 rounded-full bg-green-500 text-black opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                                            <Play className="w-4 h-4 fill-current" />
                                        </div>
                                    </button>
                                ))}
                                {filteredTracks.length === 0 && (
                                    <div className="text-center py-12 text-slate-500">
                                        <Music className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No tracks found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicSelectorModal;
