
import React from 'react';

interface BrandLogoProps {
    className?: string;
    size?: string;
    showTrademark?: boolean;
    variant?: 'full' | 'icon';
    animated?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
    className = '', 
    size = 'text-3xl', 
    showTrademark = true,
    variant = 'full',
    animated = false
}) => {
    // The exact style definition for the brand
    // font-brand (Inter), bold weight, tight tracking to connect letters
    const baseStyle = `font-brand font-bold tracking-tighter flex items-center ${size} ${className}`;

    if (variant === 'icon') {
        return (
            <span className={baseStyle}>
                æ
            </span>
        );
    }

    return (
        <span className={baseStyle}>
            æternacy
            {showTrademark && (
                <sup className="text-[0.4em] font-light relative -top-[0.4em] ml-0.5 opacity-80">™</sup>
            )}
        </span>
    );
};

export default BrandLogo;
