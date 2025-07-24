import React from 'react';

const BpbdLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Logo BNPB"
  >
    <defs>
      <path id="arcTop" d="M 15,50 a 35,35 0 1,1 70,0" />
      <path id="arcBottom" d="M 10,50 a 40,40 0 0,0 80,0" />
    </defs>
    <circle cx="50" cy="50" r="50" fill="#d92d27" />
    <circle cx="50" cy="50" r="42" fill="white" />
    <circle cx="50" cy="50" r="34" fill="#f58220" />
    <polygon points="50,28 72,66 28,66" fill="#004a8f" />
    <text fill="white" style={{ fontSize: '9.5px', fontWeight: 'bold', letterSpacing: '0.08em' }}>
      <textPath href="#arcTop" startOffset="50%" textAnchor="middle">BADAN NASIONAL</textPath>
    </text>
    <text fill="#d92d27" style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.01em' }}>
      <textPath href="#arcBottom" startOffset="50%" textAnchor="middle">PENANGGULANGAN BENCANA</textPath>
    </text>
  </svg>
);

export default BpbdLogo;