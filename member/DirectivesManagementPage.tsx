import React, { useState, useMemo } from 'react';
import { EmergencyDirective, Member, TaskReport, RoleDefinition, SectionDefinition } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import ClipboardDocumentListIcon from '../icons/ClipboardDocumentListIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import DirectiveModal from './DirectiveModal';
import { getUrgencyClass } from '../../utils';

interface DirectivesManagementPageProps {
  directives: EmergencyDirective[];
  allMembers: Member[];
  taskReports: TaskReport[];
  onSave: (directive: EmergencyDirective) => Promise<void>;
  onDelete: (id: string, title: string) => Promise<void>;
  isLoading: boolean;
  loggedInUser: Member;
  roles: RoleDefinition[];
  sections: SectionDefinition[];
}

const DirectivesManagementPage: React.FC<DirectivesManagementPageProps> = ({ directives, allMembers, taskReports, onSave, onDelete, isLoading, loggedInUser, roles, sections }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directiveToEdit, setDirectiveToEdit] = useState<EmergencyDirective | null>(null);

  const myDirectives = useMemo(() => 
    directives
        .filter(d => d.createdBy === loggedInUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [directives, loggedInUser.id]);

  const handleAddDirective = () => {
    setDirectiveToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditDirective = (directive: EmergencyDirective) => {
    setDirectiveToEdit(directive);
    setIsModalOpen(true);
  };

  const handleSaveAndClose = async (directive: EmergencyDirective) => {
    await onSave(directive);
    setIsModalOpen(false);
  };
  
  const getProgressStats = (directive: EmergencyDirective) => {
    const assignedMemberIds = directive.assignedTo === 'all' 
      ? allMembers.map(m => m.id)
      : directive.assignedTo;
    
    const assignedCount = assignedMemberIds.length;
    
    const relevantReports = taskReports.filter(r => 
      r.directiveId === directive.id && assignedMemberIds.includes(r.memberId)
    );

    const viewedCount = relevantReports.filter(r => r.status === 'Dilihat' || r.status === 'Dilaporkan').length;
    const reportedCount = relevantReports.filter(r => r.status === 'Dilaporkan').length;
    
    return { assignedCount, viewedCount, reportedCount };
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-6 h-6" />
            Manajemen Perintah
          </h1>
          <button
            onClick={handleAddDirective}
            className="inline-flex items-center gap-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Baru</span>
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-4 space-y-3">
          {myDirectives.length > 0 ? (
            myDirectives.map((directive) => {
              const { assignedCount, viewedCount, reportedCount } = getProgressStats(directive);
              return (
                <div key={directive.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col gap-3">
                  <div>
                      <div className="flex justify-between items-start">
                          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{directive.title}</h2>
                           <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              <button onClick={() => handleEditDirective(directive)} className="p-1.5 rounded-full text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400">
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button onClick={() => onDelete(directive.id, directive.title)} className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                      <span className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyClass(directive.urgency)}`}>
                        {directive.urgency}
                      </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {directive.description}
                  </p>

                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span>Progres Laporan:</span>
                      <div className="flex gap-4">
                        <span>Dilihat: <span className="font-bold text-gray-700 dark:text-gray-200">{viewedCount}/{assignedCount}</span></span>
                        <span>Dilaporkan: <span className="font-bold text-gray-700 dark:text-gray-200">{reportedCount}/{assignedCount}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>Anda belum membuat perintah apapun.</p>
              <p className="text-sm">Klik tombol "Baru" untuk membuat perintah pertama.</p>
            </div>
          )}
        </main>
      </div>

      <DirectiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAndClose}
        directiveToEdit={directiveToEdit}
        allMembers={allMembers}
        isLoading={isLoading}
        loggedInUser={loggedInUser}
        roles={roles}
        sections={sections}
      />
    </>
  );
};

export default DirectivesManagementPage;