import React from 'react';

const FlipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M5.222 9.222a8.984 8.984 0 0113.556 0M19 20v-5h-5m-.222-4.222a8.984 8.984 0 01-13.556 0" />
    </svg>
);

export default FlipIcon;