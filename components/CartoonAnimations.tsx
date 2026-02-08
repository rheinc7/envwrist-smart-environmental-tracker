
import React from 'react';

const UsagiBase: React.FC<{ expression?: 'happy' | 'neutral' | 'worried' }> = ({ expression = 'neutral' }) => (
  <g transform="translate(0, 10)">
    {/* Ears */}
    <rect x="38" y="0" width="8" height="25" rx="4" fill="white" stroke="#333" stroke-width="1.5" />
    <rect x="54" y="0" width="8" height="25" rx="4" fill="white" stroke="#333" stroke-width="1.5" />
    {/* Body */}
    <ellipse cx="50" cy="55" rx="18" ry="15" fill="white" stroke="#333" stroke-width="1.5" />
    {/* Head */}
    <circle cx="50" cy="35" r="18" fill="white" stroke="#333" stroke-width="1.5" />
    {/* Face */}
    <circle cx="44" cy="35" r="1.5" fill="#333" />
    <circle cx="56" cy="35" r="1.5" fill="#333" />
    
    {expression === 'happy' && (
      <path d="M48 40 Q50 43 52 40" stroke="#333" fill="none" stroke-width="1.5" stroke-linecap="round" />
    )}
    {expression === 'neutral' && (
      <path d="M48 40 L52 40 M50 38 L50 42" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
    )}
    {expression === 'worried' && (
      <path d="M48 42 Q50 39 52 42" stroke="#333" fill="none" stroke-width="1.5" stroke-linecap="round" />
    )}
    {/* Blush */}
    <circle cx="40" cy="38" r="2" fill="#FFB6C1" opacity="0.6" />
    <circle cx="60" cy="38" r="2" fill="#FFB6C1" opacity="0.6" />
  </g>
);

export const SunnyAnimation: React.FC = () => (
  <div className="relative w-48 h-48 flex items-center justify-center">
    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Happy Sun */}
      <g className="animate-rotate-slow origin-center" transform="translate(70, 20) scale(0.6)">
        <circle cx="0" cy="0" r="20" fill="#FBBF24" />
        {[...Array(8)].map((_, i) => (
          <rect
            key={i}
            x="-3" y="-35" width="6" height="10" rx="3"
            fill="#FBBF24"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
      <UsagiBase expression="happy" />
    </svg>
  </div>
);

export const CloudyAnimation: React.FC = () => (
  <div className="relative w-48 h-48 animate-float">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g opacity="0.8">
        <path d="M20,30 Q20,15 35,15 Q40,5 55,5 Q75,5 75,25 Q85,25 85,35 Q85,45 75,45 L20,45 Q10,45 10,35 Z" fill="#E2E8F0" className="animate-float" />
        <path d="M40,35 Q40,25 55,25 Q60,15 75,15 Q90,15 90,30 Q100,30 100,40 Q100,50 90,50 L40,50 Q30,50 30,40 Z" fill="white" style={{ animationDelay: '0.5s' }} className="animate-float" />
      </g>
      <UsagiBase expression="neutral" />
    </svg>
  </div>
);

export const RainyAnimation: React.FC = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Rain Cloud */}
      <path d="M30,25 Q30,10 50,10 Q55,0 70,0 Q85,0 85,20 Q95,20 95,30 Q95,40 85,40 L30,40 Q20,40 20,30 Z" fill="#94A3B8" className="animate-float" />
      
      {/* Rain Drops */}
      <g className="rain-drops">
        {[...Array(6)].map((_, i) => (
          <rect
            key={i}
            x={25 + i * 12}
            y="45"
            width="1.5"
            height="6"
            rx="1"
            fill="#60A5FA"
            className="animate-bounce"
            style={{ animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}
          />
        ))}
      </g>

      <UsagiBase expression="neutral" />
      
      {/* Umbrella */}
      <g transform="translate(60, 35) rotate(-10)">
        <path d="M-15,0 A15,15 0 0,1 15,0 Z" fill="#FF6B6B" stroke="#333" stroke-width="1.5" />
        <line x1="0" y1="0" x2="0" y2="25" stroke="#333" stroke-width="1.5" />
        <path d="M0,25 Q3,25 3,22" fill="none" stroke="#333" stroke-width="1.5" />
      </g>
    </svg>
  </div>
);

export const ThunderAnimation: React.FC = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Dark Cloud */}
      <path d="M30,25 Q30,10 50,10 Q55,0 70,0 Q85,0 85,20 Q95,20 95,30 Q95,40 85,40 L30,40 Q20,40 20,30 Z" fill="#475569" className="animate-pulse" />
      
      {/* Lightning */}
      <path d="M55 45 L45 60 L55 60 L45 80" fill="none" stroke="#FBBF24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="animate-pulse" />
      
      <UsagiBase expression="worried" />
      
      {/* Shock lines */}
      <g stroke="#333" stroke-width="1" opacity="0.6">
        <line x1="30" y1="30" x2="25" y2="25" />
        <line x1="70" y1="30" x2="75" y2="25" />
      </g>
    </svg>
  </div>
);
