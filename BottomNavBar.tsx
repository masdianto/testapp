import React from 'react';
import HomeIcon from './icons/HomeIcon';
import IdCardIcon from './icons/IdCardIcon';
import UserIcon from './icons/UserIcon';
import ChatIcon from './icons/ChatIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import UsersIcon from './icons/UsersIcon';
import NewspaperIcon from './icons/NewspaperIcon';
import ChatBubbleLeftEllipsisIcon from './icons/ChatBubbleLeftEllipsisIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import ReceiptPercentIcon from './icons/ReceiptPercentIcon';

type MemberPage = 'home' | 'card' | 'chat' | 'profile' | 'notifications' | 'finance' | 'about' | 'directives' | 'complaints_management' | 'pimpinan_complaints' | 'sppd' | 'reimbursement';

interface BottomNavBarProps {
  activePage: MemberPage;
  onNavigate: (page: MemberPage) => void;
  role: string;
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

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePage, onNavigate, role }) => {
  
  if (role === 'Pimpinan') {
    const pimpinanNavItems = [
      { page: 'home', label: 'Beranda', icon: <HomeIcon className="w-6 h-6" /> },
      { page: 'pimpinan_complaints', label: 'Pengaduan', icon: <ChatBubbleLeftEllipsisIcon className="w-6 h-6" /> },
      { page: 'directives', label: 'Perintah', icon: <ClipboardDocumentListIcon className="w-6 h-6" /> },
      { page: 'sppd', label: 'SPPD', icon: <PaperAirplaneIcon className="w-6 h-6" /> },
      { page: 'reimbursement', label: 'Reimburse', icon: <ReceiptPercentIcon className="w-6 h-6" /> },
      { page: 'profile', label: 'Profil', icon: <UserIcon className="w-6 h-6" /> },
    ];

    return (
      <nav 
        style={{ gridTemplateColumns: `repeat(${pimpinanNavItems.length}, minmax(0, 1fr))` }}
        className="absolute bottom-0 left-0 w-full h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 grid z-30">
        {pimpinanNavItems.map(item => (
          <NavItem
            key={item.page}
            label={item.label}
            icon={item.icon}
            isActive={activePage === item.page}
            onClick={() => onNavigate(item.page as MemberPage)}
          />
        ))}
      </nav>
    );
  }
  
  // Regular member navbar
  const showDirectivesTab = ['Sekretaris', 'Bendahara', 'Kepala Seksi'].includes(role);
  const showComplaintsTab = ['Sekretaris', 'Kepala Seksi'].includes(role);
  const showSppdTab = ['Sekretaris'].includes(role);
  
  const navItems = [
    { page: 'home', label: 'Beranda', icon: <HomeIcon className="w-6 h-6" /> },
    { page: 'card', label: 'Kartu Saya', icon: <IdCardIcon className="w-6 h-6" /> },
    showDirectivesTab && { page: 'directives', label: 'Perintah', icon: <ClipboardDocumentListIcon className="w-6 h-6" /> },
    showSppdTab && { page: 'sppd', label: 'SPPD', icon: <PaperAirplaneIcon className="w-6 h-6" /> },
    showComplaintsTab && { page: 'complaints_management', label: 'Pengaduan', icon: <ChatBubbleLeftEllipsisIcon className="w-6 h-6" /> },
    { page: 'reimbursement', label: 'Reimburse', icon: <ReceiptPercentIcon className="w-6 h-6" /> },
    { page: 'chat', label: 'Chat', icon: <ChatIcon className="w-6 h-6" /> },
    { page: 'profile', label: 'Profil', icon: <UserIcon className="w-6 h-6" /> },
  ].filter(Boolean) as { page: MemberPage, label: string, icon: React.ReactNode }[];

  return (
    <nav 
      style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      className="absolute bottom-0 left-0 w-full h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 grid z-30"
    >
      {navItems.map(item => (
         <NavItem
            key={item.page}
            label={item.label}
            icon={item.icon}
            isActive={activePage === item.page}
            onClick={() => onNavigate(item.page)}
          />
      ))}
    </nav>
  );
};

export default BottomNavBar;