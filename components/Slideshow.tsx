
import React, { useState, useEffect, useMemo } from 'react';

interface SlideshowProps {
    images: string[];
    isPlaying: boolean;
    interval?: number;
    className?: string;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, isPlaying, interval = 8000, className = "" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(-1);

    // Optimize images for background display
    const optimizedImages = useMemo(() => 
        images.map(url => {
            if (url.startsWith('data:') || !url.startsWith('http')) return url;
            return `${url}${url.includes('?') ? '&' : '?'}auto=compress&cs=tinysrgb&w=1920`;
        }),
    [images]);

    useEffect(() => {
        if (isPlaying && optimizedImages.length > 1) {
            const timer = setInterval(() => {
                setPrevIndex(currentIndex);
                setCurrentIndex((prevIndex) => (prevIndex + 1) % optimizedImages.length);
            }, interval); 
            return () => clearInterval(timer);
        }
    }, [isPlaying, optimizedImages.length, interval, currentIndex]);

    if (!optimizedImages || optimizedImages.length === 0) {
        return <div className={`absolute inset-0 w-full h-full bg-stone-950 ${className}`}></div>;
    }

    return (
        <div className={`absolute inset-0 w-full h-full overflow-hidden bg-[#050811] ${className}`}>
            {optimizedImages.map((image, index) => {
                const isVisible = index === currentIndex;
                const isPrevious = index === prevIndex;
                
                if (!isVisible && !isPrevious) return null;

                return (
                     <img
                        key={image.slice(0, 100) + index}
                        src={image}
                        alt=""
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2500ms] ease-in-out transform-gpu ${
                            isVisible ? 'opacity-100 blur-0 z-10' : 'opacity-0 blur-3xl z-0'
                        } ${(isVisible || isPrevious) ? 'animate-ken-burns-slow' : ''}`}
                        style={{
                            transitionProperty: 'opacity, filter',
                            willChange: 'opacity, transform, filter',
                            backfaceVisibility: 'hidden'
                        }}
                     />
                );
            })}
        </div>
    );
};

export default Slideshow;
