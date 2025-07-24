import React from 'react';
import UserIcon from '../icons/UserIcon';
import ClipboardDocumentListIcon from '../icons/ClipboardDocumentListIcon';

type BendaharaPage = 'dashboard' | 'profile';

interface BendaharaBottomNavBarProps {
  activePage: BendaharaPage;
  onNavigate: (page: BendaharaPage) => void;
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

const BendaharaBottomNavBar: React.FC<BendaharaBottomNavBarProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="absolute bottom-0 left-0 w-full h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 z-30">
      <NavItem
        label="Dasbor"
        icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
        isActive={activePage === 'dashboard'}
        onClick={() => onNavigate('dashboard')}
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

export default BendaharaBottomNavBar;