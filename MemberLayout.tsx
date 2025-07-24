import React, { useState } from 'react';
import { Member, News, TaskReport, EmergencyDirective, RoleDefinition, SectionDefinition, Complaint, SPPD, SPPDReport, JabatanDefinition, ReimbursementRequest } from '../types';
import BottomNavBar from './BottomNavBar';
import MemberHomePage from './member/MemberHomePage';
import MemberCardPage from './member/MemberCardPage';
import MemberProfilePage from './member/MemberProfilePage';
import MemberNotificationsPage from './member/MemberNotificationsPage';
import MemberChatPage from './member/MemberChatPage';
import BellIcon from './icons/BellIcon';
import FinancePage from './member/FinancePage';
import AboutPage from './member/AboutPage';
import DirectivesManagementPage from './member/DirectivesManagementPage';
import MemberModal from './MemberModal';
import { useToast } from '../contexts/ToastContext';
import PimpinanComplaintsPage from './pimpinan/PimpinanComplaintsPage';
import RoleSelectionModal from './RoleSelectionModal';
import ForwardComplaintModal from './operator/ForwardComplaintModal';
import MemberComplaintsPage from './member/MemberComplaintsPage';
import ComplaintReportModal from './member/ComplaintReportModal';
import SppdPage from './member/sppd/SppdPage';
import SppdModal from './member/sppd/SppdModal';
import SppdDetailModal from './member/sppd/SppdDetailModal';
import SppdReportModal from './member/sppd/SppdReportModal';
import PimpinanDashboardPage from './pimpinan/PimpinanDashboardPage';
import ReimbursementPage from './member/reimbursement/ReimbursementPage';
import PimpinanReimbursementPage from './pimpinan/PimpinanReimbursementPage';
import ReimbursementModal from './member/reimbursement/ReimbursementModal';

interface MemberLayoutProps {
  member: Member;
  allMembers: Member[];
  news: News[];
  complaints: Complaint[];
  directives: EmergencyDirective[];
  taskReports: TaskReport[];
  roles: RoleDefinition[];
  sections: SectionDefinition[];
  jabatans: JabatanDefinition[];
  sppds: SPPD[];
  sppdReports: SPPDReport[];
  reimbursementRequests: ReimbursementRequest[];
  onLogout: () => void;
  onSaveMember: (member: Member) => Promise<boolean>;
  onAcknowledgeTask: (directiveId: string) => void;
  onSaveTaskReport: (directiveId: string, reportText: string, reportImageUrl?: string) => Promise<void>;
  onSaveDirective: (directive: EmergencyDirective) => Promise<void>;
  onDeleteDirective: (id: string, title: string) => Promise<void>;
  isLoading: boolean;
  isSimulating: boolean;
  onEndSimulation: () => void;
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => Promise<boolean>;
  onSaveSppd: (sppd: SPPD) => Promise<boolean>;
  onUpdateSppd: (sppdId: string, updates: Partial<SPPD>) => Promise<boolean>;
  onSaveSppdReport: (report: Omit<SPPDReport, 'id' | 'dikirimTanggal'>) => Promise<boolean>;
  onSaveReimbursementRequest: (requestData: Omit<ReimbursementRequest, 'id' | 'requesterId' | 'requesterName' | 'date' | 'status'>) => Promise<boolean>;
  onUpdateReimbursementRequest: (requestId: string, updates: Partial<ReimbursementRequest>) => Promise<boolean>;
  // Pimpinan specific props (optional)
  onStartSimulation?: (member: Member) => void;
}

type MemberPage = 'home' | 'card' | 'chat' | 'profile' | 'notifications' | 'finance' | 'about' | 'directives' | 'complaints_management' | 'pimpinan_complaints' | 'sppd' | 'reimbursement';

const MemberLayout: React.FC<MemberLayoutProps> = ({ 
    member, 
    allMembers, 
    news,
    complaints = [],
    directives, 
    taskReports,
    roles,
    sections,
    jabatans,
    sppds,
    sppdReports,
    reimbursementRequests,
    onLogout, 
    onSaveMember,
    onAcknowledgeTask,
    onSaveTaskReport,
    onSaveDirective,
    onDeleteDirective,
    isLoading,
    isSimulating,
    onEndSimulation,
    onUpdateComplaint,
    onSaveSppd,
    onUpdateSppd,
    onSaveSppdReport,
    onSaveReimbursementRequest,
    onUpdateReimbursementRequest,
    onStartSimulation
}) => {
  const isPimpinan = member.role === 'Pimpinan';
  const [activePage, setActivePage] = useState<MemberPage>(isPimpinan ? 'home' : 'home');
  const [previousPage, setPreviousPage] = useState<MemberPage>(isPimpinan ? 'home' : 'home');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const toast = useToast();

  // Pimpinan states
  const [isSimModalOpen, setSimModalOpen] = useState(false);
  const [complaintToDispose, setComplaintToDispose] = useState<Complaint | null>(null);
  
  // Kepala Seksi State
  const [complaintToReport, setComplaintToReport] = useState<Complaint | null>(null);

  // SPPD States
  const [isSppdFormModalOpen, setIsSppdFormModalOpen] = useState(false);
  const [sppdToEdit, setSppdToEdit] = useState<SPPD | null>(null);
  const [sppdToView, setSppdToView] = useState<SPPD | null>(null);
  const [sppdToReport, setSppdToReport] = useState<SPPD | null>(null);
  
  // Reimbursement States
  const [isReimbursementModalOpen, setIsReimbursementModalOpen] = useState(false);


  const handleNotificationClick = () => {
    if (activePage !== 'notifications') {
      setPreviousPage(activePage);
    }
    setActivePage('notifications');
  };
  
  const handleEditMember = (memberToEdit: Member) => {
    setMemberToEdit(memberToEdit);
    setEditModalOpen(true);
  }

  const handleSaveAndCloseModal = async (editedMember: Member): Promise<boolean> => {
    const success = await onSaveMember(editedMember);
    if(success) {
      setEditModalOpen(false);
      setMemberToEdit(null);
    }
    return success;
  }

  const handleSelectSim = (selectedMember: Member) => {
    if (onStartSimulation) {
      onStartSimulation(selectedMember);
    }
    setSimModalOpen(false);
  };

  const handleNavigate = (page: MemberPage) => {
    const authorizedRolesForFinance: string[] = ['Bendahara'];
    const authorizedRolesForDirectives: string[] = ['Sekretaris', 'Bendahara', 'Kepala Seksi', 'Pimpinan'];
    const authorizedRolesForComplaints: string[] = ['Sekretaris', 'Kepala Seksi', 'Pimpinan'];
    const authorizedRolesForSppd: string[] = ['Sekretaris', 'Pimpinan'];

    if (page === 'finance' && !authorizedRolesForFinance.includes(member.role)) {
        toast.error('Hanya Bendahara yang dapat mengakses halaman ini.');
        return;
    }
    if (page === 'directives' && !authorizedRolesForDirectives.includes(member.role)) {
        toast.error('Anda tidak memiliki wewenang untuk mengelola perintah.');
        return;
    }
     if (page === 'complaints_management' && !authorizedRolesForComplaints.includes(member.role)) {
        toast.error('Anda tidak memiliki wewenang untuk mengelola pengaduan.');
        return;
    }
    if (page === 'sppd' && !authorizedRolesForSppd.includes(member.role)) {
        toast.error('Hanya Sekretaris dan Pimpinan yang dapat mengakses halaman SPPD.');
        return;
    }
    
    // Pimpinan uses a different complaint page
    if (page === 'complaints_management' && member.role === 'Pimpinan') {
        setActivePage('pimpinan_complaints');
        return;
    }

    setActivePage(page);
  }
  
  // Pimpinan-specific handlers for modals
  const handlePimpinanDispose = async (seksiId: string, notes: string) => {
    if (complaintToDispose) {
      const success = await onUpdateComplaint(complaintToDispose.id, {
          status: 'Didisposisikan ke Seksi',
          currentOwner: seksiId,
          dispositionNotes: notes
      });
      if (success) setComplaintToDispose(null);
      return success;
    }
    return false;
  }
  
  // Kepala Seksi handler for report modal
  const handleSeksiCompleteReport = async (notes: string, attachmentUrl?: string, attachmentName?: string) => {
    if (complaintToReport) {
        const success = await onUpdateComplaint(complaintToReport.id, {
            status: 'Laporan Selesai',
            currentOwner: 'pimpinan',
            completionReport: {
                notes,
                attachmentUrl,
                attachmentName,
                timestamp: new Date().toISOString()
            }
        });
        if (success) setComplaintToReport(null);
    }
  }

  const handleSppdSaveAndClose = async (sppd: SPPD) => {
      const success = await onSaveSppd(sppd);
      if (success) {
          setIsSppdFormModalOpen(false);
          setSppdToEdit(null);
      }
      return success;
  };
  
  const handleSppdReportSaveAndClose = async (report: Omit<SPPDReport, 'id' | 'dikirimTanggal'>) => {
    const success = await onSaveSppdReport(report);
    if(success) {
      setSppdToReport(null);
      setSppdToView(null);
    }
    return success;
  }
  
  const handleSaveReimbursementAndClose = async (requestData: Omit<ReimbursementRequest, 'id' | 'requesterId' | 'requesterName' | 'date' | 'status'>) => {
    const success = await onSaveReimbursementRequest(requestData);
    if (success) {
        setIsReimbursementModalOpen(false);
    }
    return success;
  };


  const renderPage = () => {
    switch (activePage) {
      case 'home':
        if (isPimpinan) {
          return <PimpinanDashboardPage 
            members={allMembers}
            complaints={complaints}
            directives={directives}
            sppds={sppds}
            onNavigate={handleNavigate}
          />
        }
        return <MemberHomePage member={member} allMembers={allMembers} onNavigate={setActivePage} news={news} directives={directives} taskReports={taskReports} sppds={sppds} onAcknowledgeTask={onAcknowledgeTask} onSaveTaskReport={onSaveTaskReport} isLoading={isLoading} onSppdClick={setSppdToView} />;
      case 'card':
        return <MemberCardPage member={member} />;
      case 'chat':
        return <MemberChatPage loggedInMember={member} allMembers={allMembers} />;
      case 'profile':
        return <MemberProfilePage member={member} onEdit={() => handleEditMember(member)} onOpenSimulationModal={() => setSimModalOpen(true)} />;
      case 'notifications':
        return <MemberNotificationsPage onBack={() => setActivePage(previousPage)} />;
      case 'finance':
         return <FinancePage member={member} />;
      case 'about':
        return <AboutPage />;
      case 'directives':
        return <DirectivesManagementPage directives={directives} allMembers={allMembers} taskReports={taskReports} onSave={onSaveDirective} onDelete={onDeleteDirective} isLoading={isLoading} loggedInUser={member} roles={roles} sections={sections} />;
      case 'complaints_management':
        return <MemberComplaintsPage member={member} complaints={complaints} sections={sections} onUpdateComplaint={onUpdateComplaint} onReportComplete={setComplaintToReport} isLoading={isLoading} />;
      case 'sppd':
        return <SppdPage member={member} sppds={sppds} allMembers={allMembers} onAdd={() => { setSppdToEdit(null); setIsSppdFormModalOpen(true); }} onEdit={(sppd) => { setSppdToEdit(sppd); setIsSppdFormModalOpen(true); }} onView={setSppdToView} onUpdateSppd={onUpdateSppd} />;
      case 'reimbursement':
        if (isPimpinan) {
           return <PimpinanReimbursementPage
              reimbursementRequests={reimbursementRequests}
              onUpdateReimbursementRequest={onUpdateReimbursementRequest}
              allMembers={allMembers}
           />
        }
        return <ReimbursementPage 
          member={member} 
          reimbursementRequests={reimbursementRequests.filter(r => r.requesterId === member.id)} 
          onAdd={() => setIsReimbursementModalOpen(true)} 
        />;
      // Pimpinan Pages
      case 'pimpinan_complaints':
        return <PimpinanComplaintsPage complaints={complaints} sections={sections} onDispose={setComplaintToDispose} onUpdateComplaint={onUpdateComplaint} />;
      default:
        return <MemberHomePage member={member} allMembers={allMembers} onNavigate={setActivePage} news={news} directives={directives} taskReports={taskReports} sppds={sppds} onAcknowledgeTask={onAcknowledgeTask} onSaveTaskReport={onSaveTaskReport} isLoading={isLoading} onSppdClick={setSppdToView} />;
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

        <button 
          onClick={handleNotificationClick} 
          className="absolute top-4 right-4 z-30 p-2 text-gray-600 dark:text-gray-300 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 backdrop-blur-sm transition-colors"
        >
          <BellIcon className="w-6 h-6"/>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-100 dark:ring-gray-900"></span>
        </button>
        
        <main className="w-full flex-grow overflow-y-auto">
          {renderPage()}
        </main>
        
        <BottomNavBar activePage={activePage} onNavigate={handleNavigate} role={member.role} />
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
        onClose={() => { setEditModalOpen(false); setMemberToEdit(null); }}
        onSave={handleSaveAndCloseModal}
        memberToEdit={memberToEdit}
        loggedInUser={member}
        roles={roles}
        sections={sections}
        jabatans={jabatans}
        isLoading={isLoading}
      />
      {isSimModalOpen && onStartSimulation && (
        <RoleSelectionModal
            members={allMembers.filter(m => m.id !== member.id)}
            onSelect={handleSelectSim}
            onClose={() => setSimModalOpen(false)}
        />
      )}
      {complaintToDispose && (
        <ForwardComplaintModal
            isOpen={!!complaintToDispose}
            onClose={() => setComplaintToDispose(null)}
            onForward={handlePimpinanDispose}
            sections={sections}
            isLoading={isLoading}
        />
      )}
      {complaintToReport && (
        <ComplaintReportModal
            isOpen={!!complaintToReport}
            onClose={() => setComplaintToReport(null)}
            onSave={handleSeksiCompleteReport}
            isLoading={isLoading}
        />
      )}
      {isSppdFormModalOpen && (
          <SppdModal
              isOpen={isSppdFormModalOpen}
              onClose={() => { setIsSppdFormModalOpen(false); setSppdToEdit(null); }}
              onSave={handleSppdSaveAndClose}
              sppdToEdit={sppdToEdit}
              allMembers={allMembers}
              isLoading={isLoading}
          />
      )}
      {sppdToView && (
          <SppdDetailModal
              sppd={sppdToView}
              onClose={() => setSppdToView(null)}
              loggedInUser={member}
              allMembers={allMembers}
              sppdReports={sppdReports}
              onUpdateSppd={onUpdateSppd}
              onReport={() => { setSppdToReport(sppdToView); setSppdToView(null); }}
              isLoading={isLoading}
          />
      )}
      {sppdToReport && (
          <SppdReportModal
            isOpen={!!sppdToReport}
            onClose={() => setSppdToReport(null)}
            onSave={(report) => handleSppdReportSaveAndClose({ ...report, sppdId: sppdToReport.id, memberId: member.id })}
            isLoading={isLoading}
          />
      )}
      <ReimbursementModal
        isOpen={isReimbursementModalOpen}
        onClose={() => setIsReimbursementModalOpen(false)}
        onSave={handleSaveReimbursementAndClose}
        isLoading={isLoading}
      />
    </>
  );
};

export default MemberLayout;