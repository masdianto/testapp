import React from 'react';
import { Complaint, SectionDefinition } from '../../types';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import ArrowUturnRightIcon from '../icons/ArrowUturnRightIcon';
import { getComplaintStatusClass, formatDateRelative } from '../../utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface AdminComplaintsPageProps {
  complaints: Complaint[];
  sections: SectionDefinition[];
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  onForward: (complaint: Complaint) => void;
}

const AdminComplaintsPage: React.FC<AdminComplaintsPageProps> = ({ complaints, sections, onUpdateComplaint, onForward }) => {

  const handleCloseComplaint = (complaintId: string) => {
    onUpdateComplaint(complaintId, { status: 'Ditutup' });
  };
  
  return (
    <div className="animate-fade-in">
      {complaints.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pelapor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Isi Laporan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pemilik Tugas
                  </th>
                   <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {complaints.map((complaint) => {
                  const ownerSeksi = sections.find(s => s.id === complaint.currentOwner);
                  const ownerName = ownerSeksi ? `Seksi ${ownerSeksi.name}` : complaint.currentOwner.charAt(0).toUpperCase() + complaint.currentOwner.slice(1);
                  
                  return (
                    <tr key={complaint.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{complaint.namaPelapor}</div>
                        <div className="text-sm text-gray-500">{complaint.telepon || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                        <div className="font-semibold">{complaint.jenisLaporan}</div>
                        <div className="text-gray-500">{complaint.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDateRelative(complaint.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getComplaintStatusClass(complaint.status)}`}>
                            {complaint.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {complaint.status === 'Laporan Selesai' ? (
                            <button
                                onClick={() => handleCloseComplaint(complaint.id)}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                title="Tutup Laporan"
                            >
                                <CheckCircleIcon className="w-6 h-6" />
                            </button>
                        ) : complaint.currentOwner === 'pimpinan' ? (
                            <button
                                onClick={() => onForward(complaint)}
                                className="text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Disposisikan Laporan"
                            >
                                <ArrowUturnRightIcon className="w-5 h-5" />
                            </button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <ChatBubbleLeftEllipsisIcon className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Tidak Ada Pengaduan</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Belum ada laporan pengaduan yang masuk dari halaman publik.</p>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;