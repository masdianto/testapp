import React from 'react';
import SadFaceIcon from './icons/SadFaceIcon';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-6">
      <SadFaceIcon className="w-32 h-32 text-orange-500 opacity-70 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Profil Tidak Ditemukan</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Maaf, kami tidak dapat menemukan profil anggota yang Anda cari.
      </p>
      <p className="text-gray-500 dark:text-gray-500">Mungkin tautan tersebut salah atau anggota tersebut telah dihapus.</p>
      <a
        href="/"
        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        Kembali ke Aplikasi Utama
      </a>
    </div>
  );
};

export default NotFoundPage;