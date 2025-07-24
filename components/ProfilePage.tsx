import React from 'react';
import { Member, MemberStatus } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import MailIcon from './icons/MailIcon';
import PhoneIcon from './icons/PhoneIcon';
import IdentificationIcon from './icons/IdentificationIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import CalendarIcon from './icons/CalendarIcon';
import UserIcon from './icons/UserIcon';

interface ProfilePageProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string, name: string) => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <li className="flex items-start py-3">
    <span className="text-primary dark:text-orange-400">{icon}</span>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-md text-gray-900 dark:text-gray-200">{value || '-'}</p>
    </div>
  </li>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ member, onEdit, onDelete }) => {
    const statusColor = member.status === MemberStatus.AKTIF 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto animate-fade-in">
            <div className="grid md:grid-cols-12">
                {/* Left Column */}
                <div className="md:col-span-4 bg-gray-50 dark:bg-gray-800/50 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                    <div className="p-1.5 rounded-full bg-gradient-to-br from-primary via-orange-400 to-red-500 shadow-lg transition-transform duration-300 hover:scale-105">
                        <img 
                            src={member.fotoUrl} 
                            alt={member.namaLengkap} 
                            className="w-40 h-40 rounded-full object-cover border-4 border-gray-50 dark:border-gray-800/50" 
                        />
                    </div>
                    <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">{member.namaLengkap}</h2>
                    <p className="text-primary dark:text-orange-400 font-semibold text-lg mt-1">{member.jabatan}</p>
                    <span className={`mt-3 px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
                        {member.status}
                    </span>
                    <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
                        <button 
                            onClick={() => onEdit(member)} 
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                        >
                            <EditIcon className="h-4 w-4" /> Edit Profil
                        </button>
                        <button 
                            onClick={() => onDelete(member.id, member.namaLengkap)} 
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                        >
                            <TrashIcon className="h-4 w-4" /> Hapus Anggota
                        </button>
                    </div>
                </div>
                
                {/* Right Column */}
                <div className="md:col-span-8 p-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                            Informasi Kontak & Pribadi
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <DetailItem icon={<IdentificationIcon className="w-6 h-6"/>} label="Nomor ID" value={member.nomorId} />
                            <DetailItem icon={<MailIcon className="w-6 h-6"/>} label="Email" value={<a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>} />
                            <DetailItem icon={<PhoneIcon className="w-6 h-6"/>} label="Telepon" value={<a href={`tel:${member.telepon}`} className="hover:underline">{member.telepon}</a>} />
                            <DetailItem icon={<UserIcon className="w-6 h-6"/>} label="Jenis Kelamin" value={member.jenisKelamin} />
                            <DetailItem icon={<CalendarIcon className="w-6 h-6"/>} label="Tanggal Lahir" value={new Date(member.tanggalLahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} />
                            <DetailItem icon={<CalendarIcon className="w-6 h-6"/>} label="Tanggal Bergabung" value={new Date(member.tanggalBergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} />
                             <li className="flex items-start py-3 sm:col-span-2">
                                <span className="text-primary dark:text-orange-400"><LocationMarkerIcon className="w-6 h-6"/></span>
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alamat</p>
                                  <p className="text-md text-gray-900 dark:text-gray-200">{member.alamat || '-'}</p>
                                </div>
                              </li>
                        </ul>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                            Bio Singkat
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                            {member.bio || 'Tidak ada bio.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;