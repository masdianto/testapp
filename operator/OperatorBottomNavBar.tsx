import React from 'react';
import UserIcon from '../icons/UserIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import ClipboardDocumentListIcon from '../icons/ClipboardDocumentListIcon';

type OperatorPage = 'news' | 'complaints' | 'profile' | 'directives';

interface OperatorBottomNavBarProps {
  activePage: OperatorPage;
  onNavigate: (page: OperatorPage) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
      isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
    }`}
  >
    {icon}
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

const OperatorBottomNavBar: React.FC<OperatorBottomNavBarProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="absolute bottom-0 left-0 w-full h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 grid grid-cols-4 z-30">
      <NavItem
        label="Berita"
        icon={<NewspaperIcon className="w-6 h-6" />}
        isActive={activePage === 'news'}
        onClick={() => onNavigate('news')}
      />
      <NavItem
        label="Pengaduan"
        icon={<ChatBubbleLeftEllipsisIcon className="w-6 h-6" />}
        isActive={activePage === 'complaints'}
        onClick={() => onNavigate('complaints')}
      />
       <NavItem
        label="Perintah"
        icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
        isActive={activePage === 'directives'}
        onClick={() => onNavigate('directives')}
      />
      <NavItem
        label="Profil"
        icon={<UserIcon className="w-6 h-6" />}
        isActive={activePage === 'profile'}
        onClick={() => onNavigate('profile')}
      />
    </nav>
  );
};

export default OperatorBottomNavBar;