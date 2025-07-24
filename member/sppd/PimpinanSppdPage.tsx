import React, { useState, useMemo } from 'react';
import { Member, SPPD } from '../../../types';
import PaperAirplaneIcon from '../../icons/PaperAirplaneIcon';
import { getSppdStatusClass, formatDateRelative } from '../../../utils';

interface PimpinanSppdPageProps {
  sppds: SPPD[];
  onView: (sppd: SPPD) => void;
}

type SppdTab = 'approval' | 'report' | 'history';

const PimpinanSppdPage: React.FC<PimpinanSppdPageProps> = ({ sppds, onView }) => {
  const [activeTab, setActiveTab] = useState<SppdTab>('approval');

  const tabs: { id: SppdTab; label: string; data: SPPD[] }[] = [
    {
      id: 'approval',
      label: 'Perlu Persetujuan',
      data: useMemo(() => sppds.filter(s => s.status === 'Menunggu Persetujuan'), [sppds]),
    },
    {
      id: 'report',
      label: 'Laporan Masuk',
      data: useMemo(() => sppds.filter(s => s.status === 'Laporan Diterima'), [sppds]),
    },
    {
      id: 'history',
      label: 'Riwayat',
      data: useMemo(() => sppds.filter(s => ['Disetujui', 'Ditolak', 'Selesai'].includes(s.status)), [sppds]),
    },
  ];

  const currentTabData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex-col p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <PaperAirplaneIcon className="w-6 h-6" />
          Manajemen SPPD
        </h1>
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors relative ${activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              {tab.label}
              {tab.data.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {tab.data.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {currentTabData.length > 0 ? (
          currentTabData.map(sppd => (
            <button
              key={sppd.id}
              onClick={() => onView(sppd)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-md text-gray-900 dark:text-white">{sppd.untuk}</h2>
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getSppdStatusClass(sppd.status)}`}>
                    {sppd.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{sppd.tujuan}</p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <span>{sppd.nomorSurat}</span>
                <span>{formatDateRelative(sppd.dibuatTanggal)}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>Tidak ada data SPPD di tab ini.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PimpinanSppdPage;
