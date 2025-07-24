import React from 'react';
import BellIcon from '../icons/BellIcon';
import IdCardIcon from '../icons/IdCardIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  isRead: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ icon, title, time, isRead }) => (
  <div className={`flex items-start gap-4 p-4 border-b border-gray-200 dark:border-gray-700 ${!isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
    <div className={`flex-shrink-0 p-3 rounded-full ${!isRead ? 'bg-primary/10' : 'bg-gray-200 dark:bg-gray-700'}`}>
        {icon}
    </div>
    <div className="flex-grow">
      <p className="text-gray-800 dark:text-gray-200">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{time}</p>
    </div>
    {!isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5" />}
  </div>
);

interface MemberNotificationsPageProps {
  onBack: () => void;
}

const MemberNotificationsPage: React.FC<MemberNotificationsPageProps> = ({ onBack }) => {
  return (
    <div className="text-gray-800 dark:text-gray-200">
      <header className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Notifikasi</h1>
      </header>
      
      <div>
        <NotificationItem
          icon={<BellIcon className="w-5 h-5 text-primary" />}
          title="Selamat datang di aplikasi manajemen anggota!"
          time="2 hari yang lalu"
          isRead={false}
        />
        <NotificationItem
          icon={<IdCardIcon className="w-5 h-5 text-gray-500" />}
          title="Kartu anggota digital Anda telah diperbarui."
          time="5 hari yang lalu"
          isRead={true}
        />
         <NotificationItem
          icon={<BellIcon className="w-5 h-5 text-gray-500" />}
          title="Pengumuman: Rapat bulanan akan diadakan pada tanggal 30."
          time="1 minggu yang lalu"
          isRead={true}
        />
      </div>
    </div>
  );
};

export default MemberNotificationsPage;