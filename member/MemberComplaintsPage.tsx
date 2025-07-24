import React from 'react';
import { Complaint, Member, SectionDefinition } from '../../types';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import ArrowUturnRightIcon from '../icons/ArrowUturnRightIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import DocumentCheckIcon from '../icons/DocumentCheckIcon';
import { formatDateRelative } from '../../utils';

interface MemberComplaintsPageProps {
  member: Member;
  complaints: Complaint[];
  sections: SectionDefinition[];
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  onReportComplete: (complaint: Complaint) => void;
  isLoading: boolean;
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


const MemberComplaintsPage: React.FC<MemberComplaintsPageProps> = ({ member, complaints, onUpdateComplaint, onReportComplete }) => {
  
  let relevantComplaints: Complaint[] = [];
  let pageTitle = "Manajemen Pengaduan";
  let emptyMessage = "Tidak ada pengaduan yang relevan untuk Anda saat ini.";

  if (member.role === 'Sekretaris') {
    pageTitle = "Pengaduan untuk Sekretaris";
    relevantComplaints = complaints.filter(c => c.currentOwner === 'sekretaris');
    emptyMessage = "Tidak ada pengaduan yang perlu diproses."
  } else if (member.role === 'Kepala Seksi') {
    pageTitle = `Disposisi untuk Seksi ${member.seksi}`;
    relevantComplaints = complaints.filter(c => c.currentOwner === member.seksi);
    emptyMessage = "Tidak ada disposisi untuk seksi Anda."
  }

  const handleForwardToPimpinan = (complaintId: string) => {
    onUpdateComplaint(complaintId, { 
        status: 'Menunggu Disposisi Pimpinan',
        currentOwner: 'pimpinan' 
    });
  }

  const handleAcknowledge = (complaintId: string) => {
    onUpdateComplaint(complaintId, { status: 'Dikerjakan oleh Seksi' });
  }

  const renderActionForComplaint = (complaint: Complaint) => {
    if (member.role === 'Sekretaris') {
        return (
             <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(complaint.timestamp)}</p>
                <button
                    onClick={() => handleForwardToPimpinan(complaint.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600"
                >
                    Teruskan ke Pimpinan
                    <ArrowUturnRightIcon className="w-4 h-4" />
                </button>
            </div>
        );
    }

    if (member.role === 'Kepala Seksi') {
        return (
            <>
            {complaint.dispositionNotes && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Instruksi dari Pimpinan:</p>
                    <p className="text-sm italic bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md mt-1">"{complaint.dispositionNotes}"</p>
                </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(complaint.timestamp)}</p>
                {complaint.status === 'Didisposisikan ke Seksi' && (
                     <button
                        onClick={() => handleAcknowledge(complaint.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                        Terima Disposisi
                        <CheckCircleIcon className="w-4 h-4" />
                    </button>
                )}
                {complaint.status === 'Dikerjakan oleh Seksi' && (
                     <button
                        onClick={() => onReportComplete(complaint)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Lapor Selesai
                        <DocumentCheckIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
            </>
        );
    }

    return null;
  }
  
  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
          {pageTitle}
        </h1>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {relevantComplaints.length > 0 ? (
          relevantComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint}>
                {renderActionForComplaint(complaint)}
            </ComplaintCard>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>{emptyMessage}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemberComplaintsPage;