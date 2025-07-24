import React, { useState } from 'react';
import { EmergencyDirective, Member, TaskReport } from '../../types';
import XIcon from '../icons/XIcon';
import ExclamationTriangleIcon from '../icons/ExclamationTriangleIcon';
import { getUrgencyClass, getDirectiveStatusClass, formatDateRelative } from '../../utils';
import UsersIcon from '../icons/UsersIcon';
import TaskReportModal from './TaskReportModal';
import DocumentCheckIcon from '../icons/DocumentCheckIcon';
import DocumentArrowDownIcon from '../icons/DocumentArrowDownIcon';

interface DirectiveDetailModalProps {
  directive: EmergencyDirective;
  allMembers: Member[];
  onClose: () => void;
  // Props ini bersifat opsional, hanya untuk anggota yang login
  loggedInMember?: Member;
  taskReports?: TaskReport[];
  onAcknowledgeTask?: (directiveId: string) => void;
  onSaveTaskReport?: (directiveId: string, reportText: string, reportImageUrl?: string) => Promise<void>;
  isLoading?: boolean;
}

const DirectiveDetailModal: React.FC<DirectiveDetailModalProps> = ({ 
    directive, 
    allMembers,
    onClose, 
    loggedInMember,
    taskReports = [],
    onAcknowledgeTask,
    onSaveTaskReport,
    isLoading = false
}) => {
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const taskReport = loggedInMember 
      ? taskReports.find(r => r.directiveId === directive.id && r.memberId === loggedInMember.id)
      : undefined;

  const handleReportSubmit = async (reportText: string, reportImageUrl?: string) => {
    if (onSaveTaskReport) {
        await onSaveTaskReport(directive.id, reportText, reportImageUrl);
        setReportModalOpen(false);
    }
  };
  
  const renderFooterButton = () => {
    // Tombol aksi hanya untuk anggota yang login
    if (!loggedInMember || !onAcknowledgeTask) return null;

    if (taskReport?.status === 'Dilaporkan') {
        return (
            <button disabled className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 disabled:opacity-70 flex items-center justify-center gap-2">
              <DocumentCheckIcon className="w-5 h-5" />
              Laporan Terkirim
            </button>
        );
    }
    if (taskReport?.status === 'Dilihat') {
        return (
            <button 
              onClick={() => setReportModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center justify-center gap-2"
            >
                <DocumentCheckIcon className="w-5 h-5" />
                Laporan Tugas
            </button>
        );
    }
    return (
        <button 
            onClick={() => onAcknowledgeTask(directive.id)}
            className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Mengerti
        </button>
    );
  }

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
        <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl m-4 w-full max-w-md flex flex-col animate-fade-in-down" 
            onClick={e => e.stopPropagation()}
        >
            <header className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <span className="p-2 bg-danger/10 rounded-full">
                        <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Detail Informasi Darurat
                    </h2>
                </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
                <XIcon className="h-5 w-5" />
            </button>
            </header>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{directive.title}</h3>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getUrgencyClass(directive.urgency)}`}>
                        Urgensi: {directive.urgency}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDirectiveStatusClass(directive.status)}`}>
                        Status: {directive.status}
                    </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Diterima: {formatDateRelative(directive.date)}</p>
                <div className="pt-2">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{directive.description}</p>
                </div>

                {directive.attachmentUrl && directive.attachmentName && (
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Lampiran</h4>
                      <a
                          href={directive.attachmentUrl}
                          download={directive.attachmentName}
                          className="inline-flex items-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          title={`Unduh ${directive.attachmentName}`}
                      >
                          <DocumentArrowDownIcon className="w-5 h-5 flex-shrink-0 text-primary" />
                          <span className="truncate">{directive.attachmentName}</span>
                      </a>
                  </div>
                )}

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Ditugaskan kepada</h4>
                    {directive.assignedTo === 'all' ? (
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg">
                            <UsersIcon className="w-6 h-6 text-gray-500" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">Semua Anggota</span>
                        </div>
                    ) : (
                        <ul className="space-y-3 max-h-32 overflow-y-auto pr-2">
                            {(directive.assignedTo as string[]).map(memberId => {
                                const assignedMember = allMembers.find(m => m.id === memberId);
                                if (!assignedMember) return null;
                                return (
                                    <li key={memberId} className="flex items-center gap-3">
                                        <img src={assignedMember.fotoUrl} alt={assignedMember.namaLengkap} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{assignedMember.namaLengkap}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            <footer className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                {loggedInMember ? renderFooterButton() : (
                    <button 
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
                    >
                        Tutup
                    </button>
                )}
            </footer>
        </div>
        </div>
        {loggedInMember && isReportModalOpen && onSaveTaskReport && (
            <TaskReportModal
                onClose={() => setReportModalOpen(false)}
                onSave={handleReportSubmit}
                isLoading={isLoading}
            />
        )}
    </>
  );
};

export default DirectiveDetailModal;
