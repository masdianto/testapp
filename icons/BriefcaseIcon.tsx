import React from 'react';

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.02a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-4.02m16.5 0M20.25 14.15v-4.02a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 10.13v4.019m16.5 0M20.25 14.15V10.13m0 4.02a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H8.25a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25m16.5 0h-1.5m-13.5 0h-1.5m10.5-11.25v.15a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0h-21" />
    </svg>
);

export default BriefcaseIcon;