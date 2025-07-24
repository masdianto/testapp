import React from 'react';
import { Member, ReimbursementRequest } from '../../types';
import ReceiptPercentIcon from '../icons/ReceiptPercentIcon';
import { formatCurrency, formatDateRelative } from '../../utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';

interface PimpinanReimbursementPageProps {
  reimbursementRequests: ReimbursementRequest[];
  allMembers: Member[];
  onUpdateReimbursementRequest: (requestId: string, updates: Partial<ReimbursementRequest>) => Promise<boolean>;
}

const PimpinanReimbursementPage: React.FC<PimpinanReimbursementPageProps> = ({ reimbursementRequests, onUpdateReimbursementRequest, allMembers }) => {
  
  const pendingRequests = reimbursementRequests.filter(r => r.status === 'Menunggu Persetujuan');

  const handleApproval = (id: string, isApproved: boolean) => {
    if (isApproved) {
        onUpdateReimbursementRequest(id, { status: 'Disetujui' });
    } else {
        // Here you could open a modal to ask for rejection notes
        const rejectionNotes = prompt("Masukkan alasan penolakan:");
        if (rejectionNotes) {
            onUpdateReimbursementRequest(id, { status: 'Ditolak', rejectionNotes });
        }
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <ReceiptPercentIcon className="w-6 h-6" />
          Persetujuan Reimbursement
        </h1>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {pendingRequests.length > 0 ? (
          pendingRequests.map(req => {
            const requester = allMembers.find(m => m.id === req.requesterId);
            return (
                <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{req.description}</p>
                        <p className="font-bold text-lg text-primary">{formatCurrency(req.amount)}</p>
                    </div>
                     <div className="flex items-center gap-2 mt-1">
                        {requester && <img src={requester.fotoUrl} alt={requester.namaLengkap} className="w-6 h-6 rounded-full" />}
                        <p className="text-sm text-gray-500 dark:text-gray-400">Diajukan oleh: {req.requesterName}</p>
                     </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <a href={req.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">Lihat Bukti</a>
                        <div className="flex gap-2">
                             <button onClick={() => handleApproval(req.id, false)} className="inline-flex items-center gap-1 px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                                <XCircleIcon className="w-4 h-4" /> Tolak
                            </button>
                            <button onClick={() => handleApproval(req.id, true)} className="inline-flex items-center gap-1 px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                <CheckCircleIcon className="w-4 h-4" /> Setujui
                            </button>
                        </div>
                    </div>
                </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>Tidak ada pengajuan reimbursement yang menunggu persetujuan.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PimpinanReimbursementPage;