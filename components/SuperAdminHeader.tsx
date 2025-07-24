import React, { useState, useEffect, useRef } from 'react';
import PlusIcon from './icons/PlusIcon';
import IdCardIcon from './icons/IdCardIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import MobileIcon from './icons/MobileIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import SettingsIcon from './icons/SettingsIcon';
import ArrowRightOnRectangleIcon from './icons/ArrowRightOnRectangleIcon';

type Page = 'list' | 'generate' | 'profile' | 'settings' | 'admin_news' | 'admin_complaints' | 'admin_roles';

interface SuperAdminHeaderProps {
  onAddMember: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenRoleSelectionModal: () => void;
  onLogout: () => void;
  hasMembers: boolean;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({ onAddMember, currentPage, onNavigate, onOpenRoleSelectionModal, onLogout, hasMembers }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (currentPage) {
      case 'settings': return 'Pengaturan & Alat';
      case 'generate': return 'Generate Kartu Anggota';
      case 'profile': return 'Profil Anggota';
      case 'admin_news': return 'Manajemen Berita';
      case 'admin_complaints': return 'Manajemen Pengaduan';
      case 'admin_roles': return 'Struktur Organisasi';
      case 'list': default: return 'Dasbor Admin';
    }
  };

  const getSubtitle = () => {
    switch (currentPage) {
      case 'settings': return 'Kelola aplikasi, data, dan tampilan';
      case 'generate': return 'Pilih anggota untuk membuat kartu';
      case 'profile': return 'Detail lengkap anggota organisasi';
      case 'admin_news': return 'Kelola artikel berita dan publikasi';
      case 'admin_complaints': return 'Tinjau dan kelola laporan dari publik';
      case 'admin_roles': return 'Atur peran, seksi/divisi, dan penetapan jabatan';
      case 'list': default: return 'Manajemen Anggota, Konten, dan Sistem';
    }
  };

  const handleMenuClick = (page: 'settings') => {
    onNavigate(page);
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {getTitle()}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getSubtitle()}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {currentPage !== 'list' ? (
              <button
                onClick={() => onNavigate('list')}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Kembali ke Daftar</span>
              </button>
            ) : (
              <>
                 <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    title="Menu"
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105"
                  >
                    <SettingsIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Menu</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down">
                      <div className="py-1 divide-y dark:divide-gray-700">
                        <div className="py-1">
                          <button onClick={() => handleMenuClick('settings')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <SettingsIcon className="h-5 w-5" />
                            <span>Pengaturan & Alat</span>
                          </button>
                        </div>
                         <div className="py-1">
                          <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20">
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                 <button
                  onClick={onOpenRoleSelectionModal}
                  disabled={!hasMembers}
                  title={hasMembers ? "Simulasi Tampilan Anggota" : "Tambah anggota terlebih dahulu"}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <MobileIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Simulasi</span>
                </button>
                <button
                  onClick={() => onNavigate('generate')}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
                  title="Generate Kartu Anggota"
                >
                  <IdCardIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Kartu</span>
                </button>
                <button
                  onClick={onAddMember}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Tambah</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;