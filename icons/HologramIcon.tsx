import React from 'react';
import BpbdLogo from './BpdbLogo';

const HologramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Security Hologram"
  >
    <defs>
      <linearGradient id="hologramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 0.7 }} />
        <stop offset="20%" style={{ stopColor: '#00ffff', stopOpacity: 0.7 }} />
        <stop offset="40%" style={{ stopColor: '#ffff00', stopOpacity: 0.7 }} />
        <stop offset="60%" style={{ stopColor: '#00ff00', stopOpacity: 0.7 }} />
        <stop offset="80%" style={{ stopColor: '#ff0000', stopOpacity: 0.7 }} />
        <stop offset="100%" style={{ stopColor: '#ff00ff', stopOpacity: 0.7 }} />
      </linearGradient>
      <mask id="hologramMask">
         <rect width="100" height="100" fill="white" />
         <g transform="scale(0.9) translate(5.5, 5.5)">
           <BpbdLogo />
         </g>
      </mask>
    </defs>

    <rect 
      width="100" 
      height="100" 
      rx="15"
      fill="url(#hologramGradient)" 
      mask="url(#hologramMask)"
      style={{ mixBlendMode: 'screen' }}
    />
  </svg>
);

export default HologramIcon;