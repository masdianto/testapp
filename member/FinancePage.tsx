import React from 'react';
import { Member } from '../../types';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';

interface FinancePageProps {
  member: Member;
}

const FinancePage: React.FC<FinancePageProps> = ({ member }) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full text-center text-gray-800 dark:text-gray-200">
        <ShieldCheckIcon className="w-24 h-24 text-primary opacity-50 mb-4" />
        <h1 className="text-2xl font-bold">Akses Keuangan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
            Halaman ini hanya dapat diakses oleh Pimpinan dan Bendahara.
        </p>
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full max-w-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Anda login sebagai:</p>
            <p className="font-bold text-lg text-primary">{member.namaLengkap}</p>
            <p className="font-semibold text-md text-gray-700 dark:text-gray-300">({member.role})</p>
        </div>
        <p className="text-xs text-gray-500 mt-8">
            Konten keuangan seperti laporan, anggaran, dan data transaksi akan ditampilkan di sini.
        </p>
    </div>
  );
};

export default FinancePage;