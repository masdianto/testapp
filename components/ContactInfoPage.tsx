import React from 'react';
import { Member, MemberStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import UsersIcon from './icons/UsersIcon';
import CalendarIcon from './icons/CalendarIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import ClockIcon from './icons/ClockIcon';

interface ContactInfoPageProps {
  member: Member;
}

const ContactInfoPage: React.FC<ContactInfoPageProps> = ({ member }) => {
  const statusColor = member.status === MemberStatus.AKTIF 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

  const calculateServiceDuration = (joinDate: string): string => {
    const start = new Date(joinDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
        years--;
        months += 12;
    }
    
    if (years === 0 && months === 0) return "Kurang dari sebulan";
    
    const yearStr = years > 0 ? `${years} tahun` : '';
    const monthStr = months > 0 ? `${months} bulan` : '';
    
    return [yearStr, monthStr].filter(Boolean).join(', ');
  };

  const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <span className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-primary dark:text-orange-400">
            {icon}
        </span>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <a href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }} className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-orange-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-4 h-4" />
                Kembali ke Halaman Publik
            </a>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                {/* Header Section */}
                <div className="relative">
                    <div className="h-40 bg-gradient-to-r from-primary to-orange-500"></div>
                    <div className="absolute top-20 left-1/2 -translate-x-1/2">
                        <img 
                            className="w-40 h-40 rounded-full object-cover border-8 border-white dark:border-gray-800 shadow-lg"
                            src={member.fotoUrl}
                            alt={member.namaLengkap}
                        />
                    </div>
                </div>
                
                {/* Main Info Section */}
                <div className="pt-24 pb-8 px-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{member.namaLengkap}</h1>
                    <p className="text-xl font-semibold text-primary dark:text-orange-400 mt-1">{member.jabatan}</p>
                    <span className={`mt-4 inline-block px-4 py-1.5 text-sm font-bold rounded-full ${statusColor}`}>
                        Status: {member.status}
                    </span>
                </div>
                
                {/* Details Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-8">
                    {/* Bio Card */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Biografi</h3>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 italic">
                            {member.bio || 'Anggota ini belum menambahkan bio.'}
                        </p>
                    </div>
                    
                    {/* Membership Details Card */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detail Keanggotaan</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                            <DetailItem icon={<BriefcaseIcon className="w-6 h-6" />} label="Peran" value={member.role} />
                            <DetailItem icon={<UsersIcon className="w-6 h-6" />} label="Seksi / Divisi" value={member.seksi} />
                            <DetailItem icon={<CalendarIcon className="w-6 h-6" />} label="Tanggal Bergabung" value={new Date(member.tanggalBergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} />
                            <DetailItem icon={<ClockIcon className="w-6 h-6" />} label="Lama Pengabdian" value={calculateServiceDuration(member.tanggalBergabung)} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-50 dark:bg-gray-800/50 p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
                    Profil Publik - Badan Nasional Penanggulangan Bencana
                </footer>
            </div>
        </div>
    </div>
  );
};

export default ContactInfoPage;