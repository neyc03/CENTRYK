import React from 'react';

interface CentryxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const CentryxLogo: React.FC<CentryxLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Modernized 2026 Metallic Hexagon Shield Icon with Electric Blue Checkmark & Glow */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(45,212,191,0.3)]">
          <defs>
            {/* Metallic Hexagon Gradient */}
            <linearGradient id="metallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Glowing Border Gradient */}
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Electric Checkmark Gradient */}
            <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Outer Glowing Hexagon */}
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="url(#metallicGrad)" stroke="url(#borderGrad)" strokeWidth="3" />

          {/* Inner Hexagon Layer */}
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="#0A1525" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

          {/* Electric Checkmark (Modernized) */}
          <path d="M35 50 L46 62 L67 36" fill="none" stroke="url(#checkGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Modernized Centryx Typography */}
      {showText && (
        <span className={`${textSize} font-extrabold tracking-tight text-white font-sans`}>
          Centryx
        </span>
      )}
    </div>
  );
};
