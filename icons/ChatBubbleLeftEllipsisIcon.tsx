import React from 'react';

const ChatBubbleLeftEllipsisIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.352 0 9.75-3.694 9.75-8.25s-4.398-8.25-9.75-8.25S2.25 7.844 2.25 12.394c0 1.996.936 3.822 2.443 5.142.062.05.117.103.165.158zM12 8.25a.75.75 0 000 1.5h.75a.75.75 0 000-1.5H12zm-2.25.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm4.5.008a.75.75 0 00-.75-.75h-.008a.75.75 0 00-.75.75v.008a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008z" clipRule="evenodd" />
    </svg>
);

export default ChatBubbleLeftEllipsisIcon;