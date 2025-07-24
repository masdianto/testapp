import React from 'react';
import { Member } from '../types';
import XIcon from './icons/XIcon';
import UsersIcon from './icons/UsersIcon';

interface RoleSelectionModalProps {
  members: Member[];
  onSelect: (member: Member) => void;
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ members, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pilih Peran Simulasi</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">Pilih anggota untuk memulai simulasi.</p>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {members.map(member => (
              <li key={member.id}>
                <button 
                  onClick={() => onSelect(member)}
                  className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <img src={member.fotoUrl} alt={member.namaLengkap} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{member.namaLengkap}</p>
                    <p className={`text-sm font-semibold ${member.role === 'Operator' ? 'text-orange-500' : 'text-primary dark:text-blue-400'}`}>{member.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.jabatan}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
