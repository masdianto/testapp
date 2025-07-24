import React from 'react';
import { Complaint, SectionDefinition } from '../../types';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import ArrowUturnRightIcon from '../icons/ArrowUturnRightIcon';
import { getComplaintStatusClass, formatDateRelative } from '../../utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import DocumentArrowDownIcon from '../icons/DocumentArrowDownIcon';

interface PimpinanComplaintsPageProps {
  complaints: Complaint[];
  sections: SectionDefinition[];
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  onDispose: (complaint: Complaint) => void;
}

const ComplaintCard: React.FC<{ complaint: Complaint, children: React.ReactNode }> = ({ complaint, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3">
        <div>
            <div className="flex justify-between items-start">
            <span className="font-bold text-gray-800 dark:text-gray-200">{complaint.namaPelapor}</span>
            <span className="text-xs font-semibold text-primary">{complaint.jenisLaporan}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{complaint.lokasiKejadian}</p>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{complaint.content}</p>
        {children}
    </div>
);

const PimpinanComplaintsPage: React.FC<PimpinanComplaintsPageProps> = ({ complaints, sections, onUpdateComplaint, onDispose }) => {

    const complaintsToDispose = complaints.filter(c => c.currentOwner === 'pimpinan' && c.status === 'Menunggu Disposisi Pimpinan');
    const complaintsToClose = complaints.filter(c => c.status === 'Laporan Selesai');

    const handleCloseComplaint = (complaintId: string) => {
        onUpdateComplaint(complaintId, { status: 'Ditutup' });
    };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
          Manajemen Pengaduan
        </h1>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-6">
        <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Menunggu Disposisi Anda</h2>
             {complaintsToDispose.length > 0 ? (
                <div className="space-y-3">
                {complaintsToDispose.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint}>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(complaint.timestamp)}</p>
                            <button
                                onClick={() => onDispose(complaint)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600"
                            >
                                Disposisi
                                <ArrowUturnRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </ComplaintCard>
                ))}
                </div>
            ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Tidak ada pengaduan yang perlu disposisi.</p>
            )}
        </div>
        <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Laporan Selesai</h2>
             {complaintsToClose.length > 0 ? (
                <div className="space-y-3">
                {complaintsToClose.map((complaint) => {
                     const disposedToSeksi = sections.find(s => s.id === complaint.dispositionNotes);
                     return (
                        <ComplaintCard key={complaint.id} complaint={complaint}>
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Laporan Penyelesaian dari Seksi {disposedToSeksi?.name}</h4>
                                <p className="text-sm italic bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">"{complaint.completionReport?.notes}"</p>
                                {complaint.completionReport?.attachmentUrl && (
                                     <a
                                        href={complaint.completionReport.attachmentUrl}
                                        download={complaint.completionReport.attachmentName}
                                        className="inline-flex items-center gap-2 w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                        title={`Unduh ${complaint.completionReport.attachmentName}`}
                                    >
                                        <DocumentArrowDownIcon className="w-4 h-4 flex-shrink-0 text-primary" />
                                        <span className="truncate">{complaint.completionReport.attachmentName}</span>
                                    </a>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Dilaporkan: {formatDateRelative(complaint.completionReport?.timestamp || '')}
                                </p>
                                <button
                                    onClick={() => handleCloseComplaint(complaint.id)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                                >
                                    Tutup Laporan
                                    <CheckCircleIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </ComplaintCard>
                    )
                })}
                </div>
            ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Tidak ada laporan yang selesai.</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default PimpinanComplaintsPage;