import React from 'react';
import BpbdLogo from '../icons/BpdbLogo';

const AboutPage: React.FC = () => {
  return (
    <div className="p-6 text-gray-800 dark:text-gray-200">
      <header className="flex flex-col items-center text-center">
        <BpbdLogo className="w-24 h-24" />
        <h1 className="text-2xl font-bold mt-4">Tentang Kami</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Badan Nasional Penanggulangan Bencana</p>
      </header>

      <div className="mt-8 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="font-bold text-lg text-primary">Visi</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Menjadi lembaga penanggulangan bencana yang tangguh dan terpercaya dalam melindungi masyarakat dari ancaman bencana.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="font-bold text-lg text-primary">Misi</h2>
          <ul className="mt-2 text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
            <li>Meningkatkan kesiapsiagaan dan kapasitas masyarakat dalam menghadapi bencana.</li>
            <li>Mengoptimalkan sistem peringatan dini dan mitigasi risiko bencana.</li>
            <li>Memberikan respon cepat dan efektif pada saat tanggap darurat.</li>
            <li>Melaksanakan pemulihan pasca-bencana yang berkelanjutan dan berbasis komunitas.</li>
          </ul>
        </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="font-bold text-lg text-primary">Tujuan Aplikasi</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Aplikasi ini dirancang untuk memodernisasi dan menyederhanakan manajemen anggota. Fitur utamanya termasuk pembuatan kartu anggota digital, penyampaian perintah darurat, dan komunikasi terpusat untuk memastikan koordinasi yang efektif di lapangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
