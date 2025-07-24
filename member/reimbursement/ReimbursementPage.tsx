import React from 'react';
import { Member, ReimbursementRequest } from '../../../types';
import PlusIcon from '../../icons/PlusIcon';
import ReceiptPercentIcon from '../../icons/ReceiptPercentIcon';
import { formatCurrency, formatDateRelative } from '../../../utils';

interface ReimbursementPageProps {
  member: Member;
  reimbursementRequests: ReimbursementRequest[];
  onAdd: () => void;
}

const getStatusClass = (status: ReimbursementRequest['status']) => {
  switch (status) {
    case 'Menunggu Persetujuan':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Disetujui':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Ditolak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Dibayar':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReimbursementPage: React.FC<ReimbursementPageProps> = ({ member, reimbursementRequests, onAdd }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <ReceiptPercentIcon className="w-6 h-6" />
          Pengajuan Reimbursement
        </h1>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Ajukan</span>
        </button>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {reimbursementRequests.length > 0 ? (
          reimbursementRequests.map(req => (
            <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{req.description}</p>
                <p className="font-bold text-lg text-primary">{formatCurrency(req.amount)}</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kategori: {req.category}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>
                  {req.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(req.date)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>Anda belum memiliki pengajuan reimbursement.</p>
            <p className="text-sm">Klik tombol "Ajukan" untuk membuat pengajuan baru.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReimbursementPage;
