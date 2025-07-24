import React from 'react';
import { Member, MemberStatus } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';

interface PimpinanMembersPageProps {
  members: Member[];
  onAdd: () => void;
  onEdit: (member: Member) => void;
  onDelete: (id: string, name: string) => void;
}

const PimpinanMembersPage: React.FC<PimpinanMembersPageProps> = ({ members, onAdd, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Manajemen Anggota
        </h1>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {members.map(member => (
          <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex items-center gap-4">
            <img src={member.fotoUrl} alt={member.namaLengkap} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <p className="font-bold text-gray-900 dark:text-white truncate">{member.namaLengkap}</p>
              <p className="text-sm text-primary dark:text-orange-400 truncate">{member.jabatan}</p>
              <p className={`text-xs font-semibold ${member.status === MemberStatus.AKTIF ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{member.status}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-1">
              <button onClick={() => onEdit(member)} className="p-1.5 rounded-full text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400">
                <EditIcon className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(member.id, member.namaLengkap)} className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PimpinanMembersPage;
