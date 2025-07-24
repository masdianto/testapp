import React from 'react';
import { Member } from '../../types';
import EditIcon from '../icons/EditIcon';

interface OperatorProfilePageProps {
  operator: Member;
  onEdit: (member: Member) => void;
}

const ProfileItem: React.FC<{ label: string, value: string | undefined }> = ({ label, value }) => (
    <div className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200">{value || '-'}</p>
    </div>
);

const OperatorProfilePage: React.FC<OperatorProfilePageProps> = ({ operator, onEdit }) => {
  return (
    <div className="text-gray-800 dark:text-gray-200">
        <div className="bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center">
            <img 
                src={operator.fotoUrl} 
                alt={operator.namaLengkap} 
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700" 
            />
            <h1 className="text-2xl font-bold mt-4">{operator.namaLengkap}</h1>
            <p className="text-primary dark:text-blue-400 font-semibold">{operator.jabatan}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">({operator.role})</p>
            <button 
                onClick={() => onEdit(operator)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                <EditIcon className="w-4 h-4" />
                Edit Profil
            </button>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-900">
            <ProfileItem label="Email" value={operator.email} />
            <ProfileItem label="Telepon" value={operator.telepon} />
            <ProfileItem label="Nomor ID" value={operator.nomorId} />
            <ProfileItem label="Alamat" value={operator.alamat} />
            <ProfileItem label="Tanggal Bergabung" value={new Date(operator.tanggalBergabung).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
        </div>
    </div>
  );
};

export default OperatorProfilePage;