import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import PhoneIcon from '../icons/PhoneIcon';
import UserIcon from '../icons/UserIcon';

type ConversationTarget = {
  id: string;
  namaLengkap: string;
  fotoUrl: string;
  isGroup?: boolean;
};

interface ChatConversationPageProps {
  target: ConversationTarget;
  onBack: () => void;
}

const ChatConversationPage: React.FC<ChatConversationPageProps> = ({ target, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-200 dark:bg-gray-900">
      <header className="flex-shrink-0 flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <button onClick={onBack} className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        {target.fotoUrl ? (
          <img src={target.fotoUrl} alt={target.namaLengkap} className="w-10 h-10 rounded-full object-cover" />
        ) : (
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
            </div>
        )}
        <div className="flex-grow">
          <p className="font-bold text-gray-800 dark:text-gray-200">{target.namaLengkap}</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <button className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <PhoneIcon className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Chat Messages Placeholder */}
        <div className="flex justify-start">
          <div className="bg-white dark:bg-gray-700 rounded-lg rounded-bl-none p-3 max-w-[80%]">
            <p className="text-sm text-gray-800 dark:text-gray-200">Halo! Apa kabar?</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">10:00</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg rounded-br-none p-3 max-w-[80%]">
            <p className="text-sm text-gray-800 dark:text-gray-200">Baik! Kamu bagaimana?</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">10:01</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white dark:bg-gray-700 rounded-lg rounded-bl-none p-3 max-w-[80%]">
            <p className="text-sm text-gray-800 dark:text-gray-200">Ini hanya halaman percakapan statis untuk keperluan demo ya.</p>
             <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">10:02</p>
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200" 
          />
          <button className="p-3 bg-primary text-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatConversationPage;
