import React, { useState } from 'react';
import { Member, News, Complaint, EmergencyDirective, TaskReport, RoleDefinition, SectionDefinition, JabatanDefinition } from '../../types';
import OperatorBottomNavBar from './OperatorBottomNavBar';
import NewsManagementPage from './NewsManagementPage';
import ComplaintsPage from './ComplaintsPage';
import OperatorProfilePage from './OperatorProfilePage';
import DirectivesManagementPage from '../member/DirectivesManagementPage';
import MemberModal from '../MemberModal';
import ForwardComplaintModal from './ForwardComplaintModal';

interface OperatorLayoutProps {
  operator: Member;
  news: News[];
  complaints: Complaint[];
  directives: EmergencyDirective[];
  taskReports: TaskReport[];
  allMembers: Member[];
  roles: RoleDefinition[];
  sections: SectionDefinition[];
  jabatans: JabatanDefinition[];
  onLogout: () => void;
  onSaveMember: (member: Member) => Promise<boolean>;
  onSaveNews: (newsItem: News) => void;
  onDeleteNews: (id: string, title: string) => void;
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => Promise<boolean>;
  onSaveDirective: (directive: EmergencyDirective) => Promise<void>;
  onDeleteDirective: (id: string, title: string) => Promise<void>;
  isLoading: boolean;
  isSimulating: boolean;
  onEndSimulation: () => void;
}

type OperatorPage = 'news' | 'complaints' | 'profile' | 'directives';

const OperatorLayout: React.FC<OperatorLayoutProps> = ({
  operator,
  news,
  complaints,
  directives,
  taskReports,
  allMembers,
  roles,
  sections,
  jabatans,
  onLogout,
  onSaveMember,
  onSaveNews,
  onDeleteNews,
  onUpdateComplaint,
  onSaveDirective,
  onDeleteDirective,
  isLoading,
  isSimulating,
  onEndSimulation
}) => {
  const [activePage, setActivePage] = useState<OperatorPage>('news');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleSaveAndCloseModal = async (editedMember: Member): Promise<boolean> => {
    const success = await onSaveMember(editedMember);
    if(success) {
      setEditModalOpen(false);
    }
    return success;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'news':
        return <NewsManagementPage news={news} onSave={onSaveNews} onDelete={onDeleteNews} isLoading={isLoading} />;
      case 'complaints':
        return <ComplaintsPage complaints={complaints} onUpdateComplaint={onUpdateComplaint} />;
      case 'profile':
        return <OperatorProfilePage operator={operator} onEdit={handleEditProfile} />;
      case 'directives':
        return (
          <DirectivesManagementPage 
            directives={directives}
            allMembers={allMembers}
            taskReports={taskReports}
            onSave={onSaveDirective}
            onDelete={onDeleteDirective}
            isLoading={isLoading}
            loggedInUser={operator}
            roles={roles}
            sections={sections}
          />
        );
      default:
        return <NewsManagementPage news={news} onSave={onSaveNews} onDelete={onDeleteNews} isLoading={isLoading} />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        {isSimulating && (
            <div className="absolute top-4 w-full max-w-[400px] text-center pointer-events-none">
                <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-md text-sm font-bold shadow-lg animate-fade-in-down z-50">
                    MODE SIMULASI
                </div>
            </div>
        )}
        <div className="relative w-full max-w-[400px] h-[85vh] max-h-[844px] bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
          
          <main className="w-full flex-grow overflow-y-auto">
            {renderPage()}
          </main>
          
          <OperatorBottomNavBar activePage={activePage} onNavigate={setActivePage} />
        </div>

        <button
          onClick={isSimulating ? onEndSimulation : onLogout}
          className="absolute top-4 right-4 bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-md hover:bg-white/30 transition-colors"
        >
          {isSimulating ? 'Keluar Simulasi' : 'Logout'}
        </button>
      </div>
      <MemberModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveAndCloseModal}
          memberToEdit={operator}
          loggedInUser={operator}
          roles={roles}
          sections={sections}
          jabatans={jabatans}
          isLoading={isLoading}
      />
    </>
  );
};

export default OperatorLayout;