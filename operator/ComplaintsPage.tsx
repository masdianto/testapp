import React from 'react';
import { Complaint } from '../../types';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import ArrowUturnRightIcon from '../icons/ArrowUturnRightIcon';
import { getComplaintStatusClass, formatDateRelative } from '../../utils';

interface ComplaintsPageProps {
  complaints: Complaint[];
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
}

const ComplaintsPage: React.FC<ComplaintsPageProps> = ({ complaints, onUpdateComplaint }) => {
  const operatorComplaints = complaints.filter(c => c.currentOwner === 'operator' && c.status === 'Baru');

  const handleForward = (complaintId: string) => {
    onUpdateComplaint(complaintId, { 
        status: 'Menunggu Diproses Sekretaris',
        currentOwner: 'sekretaris' 
    });
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
          Pengaduan Masuk
        </h1>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {operatorComplaints.length > 0 ? (
          operatorComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{complaint.namaPelapor}</span>
                    <span className="text-xs font-semibold text-primary">{complaint.jenisLaporan}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{complaint.lokasiKejadian}</p>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{complaint.content}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(complaint.timestamp)}</p>
                  <button
                      onClick={() => handleForward(complaint.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600"
                  >
                      Teruskan ke Sekretaris
                      <ArrowUturnRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>Tidak ada pengaduan baru yang perlu diproses.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplaintsPage;