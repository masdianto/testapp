import React from 'react';

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-3.5-3.5 1.41-1.41L10 13.17l4.59-4.58L16 10l-6 6z" clipRule="evenodd" />
    </svg>
);

export default ShieldCheckIcon;
