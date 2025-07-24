import React, { useState, useEffect } from 'react';
import { Member, News, EmergencyDirective } from '../../types';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import ExclamationTriangleIcon from '../icons/ExclamationTriangleIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import DirectiveDetailModal from '../member/DirectiveDetailModal';
import { getUrgencyClass, getDirectiveStatusClass, formatDateRelative } from '../../utils';
import AboutPage from '../member/AboutPage';
import BpbdLogo from '../icons/BpdbLogo';
import HomeIcon from '../icons/HomeIcon';
import UsersIcon from '../icons/UsersIcon';
import InformationCircleIcon from '../icons/InformationCircleIcon';
import ArrowRightOnRectangleIcon from '../icons/ArrowRightOnRectangleIcon';

interface PublicLayoutProps {
  members: Member[];
  news: News[];
  directives: EmergencyDirective[];
  onAddComplaint: () => void;
  onShowLogin: () => void;
}

type MobilePage = 'home' | 'members' | 'about';
const TABS: { id: MobilePage, label: string, icon: React.ReactNode }[] = [
    { id: 'home', label: 'Beranda', icon: <HomeIcon className="w-6 h-6" /> },
    { id: 'members', label: 'Anggota', icon: <UsersIcon className="w-6 h-6" /> },
    { id: 'about', label: 'Tentang', icon: <InformationCircleIcon className="w-6 h-6" /> }
];

const NavItem: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
        }`}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);


const PublicLayout: React.FC<PublicLayoutProps> = ({ members, news, directives, onAddComplaint, onShowLogin }) => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [selectedDirective, setSelectedDirective] = useState<EmergencyDirective | null>(null);
    const [activeTab, setActiveTab] = useState<MobilePage>('home');

    useEffect(() => {
        if (news.length > 1) {
            const sliderInterval = setInterval(() => {
                setCurrentNewsIndex(prevIndex => (prevIndex + 1) % news.length);
            }, 5000);
            return () => clearInterval(sliderInterval);
        }
    }, [news.length]);

    const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const publicDirectives = directives.filter(d => d.assignedTo === 'all');

    const renderNewsSlider = () => (
        sortedNews.length > 0 ? (
             <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-lg bg-gray-700">
                {sortedNews.map((newsItem, index) => (
                    <div
                        key={newsItem.id}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentNewsIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <span className="text-xs font-semibold uppercase px-2 py-1 bg-primary/80 rounded mb-2 inline-block">{newsItem.category}</span>
                            <h3 className="font-bold text-lg">{newsItem.title}</h3>
                            <p className="text-sm mt-1 text-gray-200 line-clamp-2">{newsItem.content}</p>
                        </div>
                    </div>
                ))}
                <div className="absolute bottom-2 right-4 flex gap-2">
                    {sortedNews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentNewsIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentNewsIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                            aria-label={`Pindah ke slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        ) : (
            <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">Belum ada berita yang dipublikasikan.</p>
            </div>
        )
    );

    const renderDirectivesList = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {publicDirectives.length > 0 ? publicDirectives.map((directive) => (
                    <button 
                        key={directive.id} 
                        onClick={() => setSelectedDirective(directive)}
                        className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
                    >
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-900 dark:text-white">{directive.title}</p>
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyClass(directive.urgency)}`}>
                                    {directive.urgency}
                                </span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDirectiveStatusClass(directive.status)}`}>
                                    {directive.status}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(directive.date)}</span>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                )) : (
                     <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p>Tidak ada informasi darurat publik saat ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
    
    const renderMembersList = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map(member => (
                  <li key={member.id}>
                    <a
                      href={`#/member/${member.id}`}
                      className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <img src={member.fotoUrl} alt={member.namaLengkap} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-grow overflow-hidden">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{member.namaLengkap}</p>
                        <p className="text-sm text-primary dark:text-orange-400">{member.jabatan}</p>
                      </div>
                       <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    </a>
                  </li>
                ))}
            </ul>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                     <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                                <NewspaperIcon className="w-7 h-7" /> Berita Terkini
                            </h2>
                            {renderNewsSlider()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                                <ExclamationTriangleIcon className="w-7 h-7 text-danger" /> Informasi Darurat
                            </h2>
                            {renderDirectivesList()}
                        </div>
                    </div>
                );
            case 'members':
                 return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Daftar Anggota</h2>
                        {renderMembersList()}
                    </div>
                );
            case 'about':
                return <div className="animate-fade-in"><AboutPage /></div>;
            default:
                return null;
        }
    };

  return (
    <>
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                         <BpbdLogo className="w-10 h-10" />
                         <div>
                            <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Aplikasi Organisasi</h1>
                            <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">Halaman Informasi Publik</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={onAddComplaint} title="Buat Pengaduan" className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105">
                           <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                           <span className="hidden sm:inline">Pengaduan</span>
                        </button>
                        <button onClick={onShowLogin} title="Login Anggota" className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105">
                           <ArrowRightOnRectangleIcon className="w-5 h-5" />
                           <span className="hidden sm:inline">Login</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div className="hidden md:block border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="container mx-auto -mb-px flex justify-center" aria-label="Tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500'
                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8 md:pb-8 pb-28">
            {renderTabContent()}
        </main>
        
        <div className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 z-20">
             {TABS.map(tab => (
                 <NavItem
                    key={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
              ))}
        </div>
    </div>
    
    {selectedDirective && (
        <DirectiveDetailModal
          directive={selectedDirective}
          allMembers={members}
          onClose={() => setSelectedDirective(null)}
        />
    )}
    </>
  );
};

export default PublicLayout;