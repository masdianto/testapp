import React from 'react';
import { Member, MemberStatus } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string, name: string) => void;
  onSelect: (id: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete, onSelect }) => {
  const statusRingColor = member.status === MemberStatus.AKTIF ? 'ring-green-400' : 'ring-red-400';
  const statusIconBadgeColor = member.status === MemberStatus.AKTIF ? 'bg-green-500' : 'bg-red-500';

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(member);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(member.id, member.namaLengkap);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer"
      onClick={() => onSelect(member.id)}
    >
      <div className="relative flex-grow flex flex-col pt-16">
        {/* Photo Section */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`relative w-28 h-28 rounded-full p-1 bg-white dark:bg-gray-800 ring-4 ${statusRingColor} shadow-lg`}>
            <img className="w-full h-full rounded-full object-cover" src={member.fotoUrl} alt={member.namaLengkap} />
            <span title={member.status} className={`absolute bottom-0 right-1 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 ${statusIconBadgeColor}`} />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="px-6 pb-6 text-center flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.namaLengkap}</h3>
            <p className="text-primary dark:text-orange-400 font-semibold">{member.jabatan}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full flex-grow flex items-center justify-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">"{member.bio}"</p>
            </div>
        </div>
      </div>
      
      {/* Footer with buttons */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-center gap-4 rounded-b-2xl mt-auto">
        <button
          onClick={handleEditClick}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
          aria-label="Edit"
        >
          <EditIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label="Delete"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MemberCard;