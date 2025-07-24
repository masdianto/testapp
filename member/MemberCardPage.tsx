import React, { useState } from 'react';
import { Member } from '../../types';
import IdCard from '../IdCard';
import FlipIcon from '../icons/FlipIcon';
import XIcon from '../icons/XIcon';

interface MemberCardPageProps {
  member: Member;
}

const MemberCardPage: React.FC<MemberCardPageProps> = ({ member }) => {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  const profileUrl = `${window.location.href.split('#')[0]}#/member/${member.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(profileUrl)}&qzone=1&margin=0&color=000000&bgcolor=ffffff`;

  return (
    <div className="p-4 flex flex-col items-center justify-center h-full gap-4 text-gray-800 dark:text-gray-200">
        <h1 className="text-xl font-bold">Kartu Anggota Digital</h1>
      
        <div className="flex-grow flex items-center justify-center w-full" style={{ perspective: '1000px' }}>
            <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100">
                <IdCard 
                    member={member}
                    orientation="vertical"
                    side={side}
                    primaryColor="#FF6B00"
                    textColor="light"
                    backgroundStyle="guilloche"
                />
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button
              onClick={() => setSide(s => s === 'front' ? 'back' : 'front')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FlipIcon className="h-5 w-5" />
              Balik
            </button>
            <button
              onClick={() => setIsQrZoomed(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600"
            >
              Tampilkan QR
            </button>
        </div>

        {isQrZoomed && (
            <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center backdrop-blur-sm" onClick={() => setIsQrZoomed(false)}>
                <div className="bg-white p-6 rounded-lg shadow-xl relative animate-fade-in" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setIsQrZoomed(false)} className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-1 shadow-lg"><XIcon className="w-6 h-6" /></button>
                    <img src={qrCodeUrl} alt="QR Code Anggota" className="w-64 h-64 rounded-md" />
                    <p className="mt-4 text-center text-gray-600 font-semibold">Pindai untuk melihat profil</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default MemberCardPage;