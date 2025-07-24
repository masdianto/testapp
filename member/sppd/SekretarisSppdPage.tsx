import React, { useState, useMemo } from 'react';
import { Member, SPPD } from '../../../types';
import PlusIcon from '../../icons/PlusIcon';
import PaperAirplaneIcon from '../../icons/PaperAirplaneIcon';
import { getSppdStatusClass, formatDateRelative } from '../../../utils';

interface SekretarisSppdPageProps {
  member: Member;
  sppds: SPPD[];
  onAdd: () => void;
  onView: (sppd: SPPD) => void;
  onUpdateSppd: (sppdId: string, updates: Partial<SPPD>) => Promise<boolean>;
}

type SppdTab = 'active' | 'ready_to_archive' | 'archived';

const SekretarisSppdPage: React.FC<SekretarisSppdPageProps> = ({ member, sppds, onAdd, onView, onUpdateSppd }) => {
  const [activeTab, setActiveTab] = useState<SppdTab>('active');

  const mySppds = useMemo(() =>
    sppds
      .filter(s => s.pembuatId === member.id)
      .sort((a, b) => new Date(b.dibuatTanggal).getTime() - new Date(a.dibuatTanggal).getTime()),
    [sppds, member.id]
  );
  
  const handleArchive = (sppdId: string) => {
    onUpdateSppd(sppdId, { status: 'Diarsipkan' });
  };
  
  const tabs: {id: SppdTab, label: string, data: SPPD[]}[] = [
      { id: 'active', label: 'Aktif', data: mySppds.filter(s => !['Selesai', 'Diarsipkan'].includes(s.status)) },
      { id: 'ready_to_archive', label: 'Siap Arsip', data: mySppds.filter(s => s.status === 'Selesai') },
      { id: 'archived', label: 'Diarsipkan', data: mySppds.filter(s => s.status === 'Diarsipkan') },
  ];
  
  const currentTabData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex-col p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <PaperAirplaneIcon className="w-6 h-6" />
                Manajemen SPPD
            </h1>
            <button
            onClick={onAdd}
            className="inline-flex items-center gap-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                <PlusIcon className="w-4 h-4" />
                <span>Buat SPPD</span>
            </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors relative ${activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              {tab.label}
              {tab.id === 'ready_to_archive' && tab.data.length > 0 && (
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
            <div key={sppd.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <button
                onClick={() => onView(sppd)}
                className="w-full text-left p-4 flex flex-col gap-3"
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
                {sppd.status === 'Selesai' && (
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
                        <button onClick={() => handleArchive(sppd.id)} className="w-full text-center text-sm font-semibold text-primary hover:underline">
                            Arsipkan
                        </button>
                    </div>
                )}
            </div>
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

export default SekretarisSppdPage;