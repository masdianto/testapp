import React from 'react';
import PlusIcon from './icons/PlusIcon';
import UsersIcon from './icons/UsersIcon';
import DownloadIcon from './icons/DownloadIcon';
import IdCardIcon from './icons/IdCardIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import DesktopComputerIcon from './icons/DesktopComputerIcon';
import NewspaperIcon from './icons/NewspaperIcon';
import ChatBubbleLeftEllipsisIcon from './icons/ChatBubbleLeftEllipsisIcon';
import UserGroupIcon from './icons/UserGroupIcon';

type Page = 'list' | 'generate' | 'settings' | 'admin_news' | 'admin_complaints' | 'admin_roles';
type Theme = 'light' | 'dark' | 'system';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onAddMember: () => void;
  onExportData: () => void;
  currentTheme: Theme;
  onSetTheme: (theme: Theme) => void;
}

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex-grow">{description}</p>
        <div className="mt-6 space-y-3">
            {children}
        </div>
    </div>
);

const ActionButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-all"
    >
      {icon}
      <span>{label}</span>
    </button>
);

const ThemeButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
     <button 
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center gap-2 p-3 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-primary/20 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-500/10'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onAddMember, onExportData, currentTheme, onSetTheme }) => {
    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Manajemen Anggota */}
            <SettingsCard title="Manajemen Anggota" description="Tambah, lihat, dan kelola seluruh daftar anggota yang ada di dalam sistem.">
                 <ActionButton label="Tambah Anggota Baru" icon={<PlusIcon className="w-5 h-5"/>} onClick={onAddMember} />
                 <ActionButton label="Lihat Daftar Anggota" icon={<UsersIcon className="w-5 h-5"/>} onClick={() => onNavigate('list')} />
            </SettingsCard>

            {/* Manajemen Konten Publik */}
            <SettingsCard title="Manajemen Konten Publik" description="Kelola berita dan pengaduan yang ditampilkan di halaman publik.">
                 <ActionButton label="Kelola Berita" icon={<NewspaperIcon className="w-5 h-5"/>} onClick={() => onNavigate('admin_news')} />
                 <ActionButton label="Kelola Pengaduan" icon={<ChatBubbleLeftEllipsisIcon className="w-5 h-5"/>} onClick={() => onNavigate('admin_complaints')} />
            </SettingsCard>
            
            {/* Struktur Organisasi */}
             <SettingsCard title="Struktur Organisasi" description="Atur peran, seksi/divisi, dan penetapan jabatan untuk setiap anggota.">
                <ActionButton label="Kelola Struktur Organisasi" icon={<UserGroupIcon className="w-5 h-5"/>} onClick={() => onNavigate('admin_roles')} />
             </SettingsCard>


             {/* Alat */}
             <SettingsCard title="Alat & Utilitas" description="Akses fitur-fitur seperti pembuatan kartu, ekspor data, dan penyesuaian tema.">
                  <ActionButton label="Generate Kartu Anggota" icon={<IdCardIcon className="w-5 h-5"/>} onClick={() => onNavigate('generate')} />
                  <ActionButton label="Export Seluruh Data (JSON)" icon={<DownloadIcon className="w-5 h-5"/>} onClick={onExportData} />
             </SettingsCard>

             {/* Tampilan & Tema */}
            <SettingsCard title="Tampilan & Tema" description="Sesuaikan tampilan aplikasi dengan preferensi visual Anda.">
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-gray-900/50 p-2">
                    <ThemeButton label="Terang" icon={<SunIcon className="w-6 h-6"/>} isActive={currentTheme === 'light'} onClick={() => onSetTheme('light')} />
                    <ThemeButton label="Gelap" icon={<MoonIcon className="w-6 h-6"/>} isActive={currentTheme === 'dark'} onClick={() => onSetTheme('dark')} />
                    <ThemeButton label="Sistem" icon={<DesktopComputerIcon className="w-6 h-6"/>} isActive={currentTheme === 'system'} onClick={() => onSetTheme('system')} />
                </div>
            </SettingsCard>
        </div>
    );
};

export default SettingsPage;