import React, { useEffect, useState } from 'react';
import { readStored } from '../utils/storage';

interface SchoolLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = "w-16 h-16",
  size = 64,
  showText = false
}) => {
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(() =>
    readStored<string | null>('wisdom_school_logo', null)
  );

  useEffect(() => {
    const refreshLogo = () => setUploadedLogo(readStored<string | null>('wisdom_school_logo', null));
    window.addEventListener('wisdom-logo-updated', refreshLogo);
    return () => window.removeEventListener('wisdom-logo-updated', refreshLogo);
  }, []);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {uploadedLogo ? (
        <img
          src={uploadedLogo}
          alt="Wisdom Nursery and Primary School logo"
          className="w-full h-full object-contain rounded-full drop-shadow-md"
        />
      ) : (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f2b5c" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f2b5c" />
          </linearGradient>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Laurel Wreath Left */}
        <g fill="#15803d">
          <ellipse cx="44" cy="52" rx="7" ry="14" transform="rotate(-35 44 52)" />
          <ellipse cx="32" cy="72" rx="7" ry="14" transform="rotate(-20 32 72)" />
          <ellipse cx="28" cy="96" rx="7" ry="14" transform="rotate(0 28 96)" />
          <ellipse cx="32" cy="120" rx="7" ry="14" transform="rotate(20 32 120)" />
          <ellipse cx="44" cy="142" rx="7" ry="14" transform="rotate(40 44 142)" />
          <ellipse cx="64" cy="158" rx="6" ry="12" transform="rotate(55 64 158)" />
          <path d="M 30 100 C 28 65 55 40 70 30" stroke="#166534" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* Laurel Wreath Right */}
        <g fill="#15803d">
          <ellipse cx="156" cy="52" rx="7" ry="14" transform="rotate(35 156 52)" />
          <ellipse cx="168" cy="72" rx="7" ry="14" transform="rotate(20 168 72)" />
          <ellipse cx="172" cy="96" rx="7" ry="14" transform="rotate(0 172 96)" />
          <ellipse cx="168" cy="120" rx="7" ry="14" transform="rotate(-20 168 120)" />
          <ellipse cx="156" cy="142" rx="7" ry="14" transform="rotate(-40 156 142)" />
          <ellipse cx="136" cy="158" rx="6" ry="12" transform="rotate(-55 136 158)" />
          <path d="M 170 100 C 172 65 145 40 130 30" stroke="#166534" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* Shield Outer Gold Border */}
        <path
          d="M 100 24 Q 146 24 150 64 C 150 114 116 144 100 154 C 84 144 50 114 50 64 Q 54 24 100 24 Z"
          fill="url(#goldBorder)"
        />

        {/* Shield Inner Blue */}
        <path
          d="M 100 30 Q 140 30 144 66 C 144 110 114 138 100 147 C 86 138 56 110 56 66 Q 60 30 100 30 Z"
          fill="url(#shieldGrad)"
        />

        {/* Sun Rising and Rays */}
        <circle cx="100" cy="80" r="28" fill="url(#sunGrad)" />
        {/* Sun Rays */}
        <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
          <line x1="100" y1="46" x2="100" y2="38" />
          <line x1="124" y1="56" x2="130" y2="50" />
          <line x1="134" y1="80" x2="142" y2="80" />
          <line x1="76" y1="56" x2="70" y2="50" />
          <line x1="66" y1="80" x2="58" y2="80" />
          <line x1="83" y1="49" x2="78" y2="42" />
          <line x1="117" y1="49" x2="122" y2="42" />
        </g>

        {/* Open Book */}
        <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))">
          {/* Left Page */}
          <path
            d="M 100 96 C 88 90 74 90 64 94 L 64 116 C 74 112 88 112 100 118 Z"
            fill="#ffffff"
          />
          {/* Right Page */}
          <path
            d="M 100 96 C 112 90 126 90 136 94 L 136 116 C 126 112 112 112 100 118 Z"
            fill="#ffffff"
          />
          {/* Page lines */}
          <path d="M 68 100 C 76 97 86 97 96 100" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
          <path d="M 68 105 C 76 102 86 102 96 105" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
          <path d="M 68 110 C 76 107 86 107 96 110" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
          
          <path d="M 104 100 C 114 97 124 97 132 100" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
          <path d="M 104 105 C 114 102 124 102 132 105" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
          <path d="M 104 110 C 114 107 124 107 132 110" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />

          {/* Book Spine */}
          <path d="M 100 95 L 100 119" stroke="#0369a1" strokeWidth="2" />
        </g>

        {/* Shield Banner "WISDOM" */}
        <path
          d="M 66 122 L 134 122 L 126 138 L 74 138 Z"
          fill="#0c4a6e"
          stroke="#38bdf8"
          strokeWidth="1"
        />
        <text
          x="100"
          y="134"
          fill="#ffffff"
          fontSize="11"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
          letterSpacing="1"
        >
          WISDOM
        </text>

        {/* Bottom Ribbon "LEARN • GROW • SUCCEED" */}
        <g>
          {/* Ribbon Ends */}
          <path d="M 28 174 L 14 162 L 28 150 L 38 157 L 38 170 Z" fill="#0f172a" />
          <path d="M 172 174 L 186 162 L 172 150 L 162 157 L 162 170 Z" fill="#0f172a" />

          {/* Main Ribbon Body */}
          <path
            d="M 30 166 Q 100 180 170 166 L 166 150 Q 100 164 34 150 Z"
            fill="url(#ribbonGrad)"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="163"
            fill="#ffffff"
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="0.8"
          >
            LEARN • GROW • SUCCEED
          </text>
        </g>
        </svg>
      )}
      {showText && (
        <div className="ml-3 text-left">
          <div className="font-serif font-black text-xl tracking-wider text-blue-950">WISDOM</div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nursery & Primary School</div>
        </div>
      )}
    </div>
  );
};
