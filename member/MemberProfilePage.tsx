import React from 'react';
import { Member } from '../../types';
import EditIcon from '../icons/EditIcon';
import MobileIcon from '../icons/MobileIcon';

interface MemberProfilePageProps {
  member: Member;
  onEdit: (member: Member) => void;
  onOpenSimulationModal: () => void;
}

const ProfileItem: React.FC<{ label: string, value: string | undefined }> = ({ label, value }) => (
    <div className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200">{value || '-'}</p>
    </div>
);

const MemberProfilePage: React.FC<MemberProfilePageProps> = ({ member, onEdit, onOpenSimulationModal }) => {
  return (
    <div className="text-gray-800 dark:text-gray-200">
        <div className="bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center">
            <img 
                src={member.fotoUrl} 
                alt={member.namaLengkap} 
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700" 
            />
            <h1 className="text-2xl font-bold mt-4">{member.namaLengkap}</h1>
            <p className="text-primary dark:text-orange-400 font-semibold">{member.jabatan}</p>
             <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
                <button 
                    onClick={() => onEdit(member)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <EditIcon className="w-4 h-4" />
                    Edit Profil
                </button>
                 {member.role === 'Pimpinan' && (
                    <button 
                        onClick={onOpenSimulationModal}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <MobileIcon className="w-4 h-4" />
                        Simulasi Anggota
                    </button>
                )}
            </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-900">
            <ProfileItem label="Email" value={member.email} />
            <ProfileItem label="Telepon" value={member.telepon} />
            <ProfileItem label="Nomor ID" value={member.nomorId} />
            <ProfileItem label="Alamat" value={member.alamat} />
            <ProfileItem label="Tanggal Lahir" value={new Date(member.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <ProfileItem label="Tanggal Bergabung" value={new Date(member.tanggalBergabung).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <ProfileItem label="Jenis Kelamin" value={member.jenisKelamin} />
        </div>
    </div>
  );
};

export default MemberProfilePage;