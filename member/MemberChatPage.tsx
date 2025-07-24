import React, { useState, useMemo } from 'react';
import { Member } from '../../types';
import ChatConversationPage from './ChatConversationPage';
import UserIcon from '../icons/UserIcon';

interface MemberChatPageProps {
  loggedInMember: Member;
  allMembers: Member[];
}

type ConversationTarget = {
  id: string;
  namaLengkap: string;
  fotoUrl: string;
  isGroup?: boolean;
};

const MemberChatPage: React.FC<MemberChatPageProps> = ({ loggedInMember, allMembers }) => {
  const [activeTab, setActiveTab] = useState<'pribadi' | 'grup'>('pribadi');
  const [conversationTarget, setConversationTarget] = useState<ConversationTarget | null>(null);

  const privateChats = useMemo(() => 
    allMembers.filter(member => member.id !== loggedInMember.id), 
    [allMembers, loggedInMember.id]
  );

  const groupChats: ConversationTarget[] = [
    {
      id: 'grup-utama',
      namaLengkap: 'Grup Utama',
      fotoUrl: '', // No specific photo for group yet
      isGroup: true,
    }
  ];

  const handleSelectConversation = (target: ConversationTarget) => {
    setConversationTarget(target);
  };
  
  if (conversationTarget) {
    return <ChatConversationPage target={conversationTarget} onBack={() => setConversationTarget(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Pesan</h1>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
          <button 
            onClick={() => setActiveTab('pribadi')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'pribadi' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
          >
            Pribadi
          </button>
          <button 
            onClick={() => setActiveTab('grup')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'grup' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
          >
            Grup
          </button>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto">
        {activeTab === 'pribadi' && (
          <div>
            {privateChats.map(member => (
              <ChatItem key={member.id} target={member} onSelect={handleSelectConversation} message="Klik untuk memulai percakapan..." />
            ))}
          </div>
        )}
        {activeTab === 'grup' && (
          <div>
             {groupChats.map(group => (
                <ChatItem key={group.id} target={group} onSelect={handleSelectConversation} message="Selamat datang di grup utama!" />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatItem: React.FC<{ target: ConversationTarget, onSelect: (target: ConversationTarget) => void, message: string }> = ({ target, onSelect, message }) => (
    <button onClick={() => onSelect(target)} className="w-full text-left flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
        <div className="relative w-12 h-12 flex-shrink-0">
             {target.fotoUrl ? (
                <img src={target.fotoUrl} alt={target.namaLengkap} className="w-full h-full rounded-full object-cover" />
            ) : (
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary" />
                </div>
            )}
        </div>
        <div className="flex-grow overflow-hidden">
            <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{target.namaLengkap}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{message}</p>
        </div>
    </button>
);

export default MemberChatPage;