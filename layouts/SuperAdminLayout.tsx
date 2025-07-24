import React, { useState, useCallback, useMemo } from 'react';
import { Member, News, Complaint, RoleDefinition, SectionDefinition, JabatanDefinition } from '../../types';
import SuperAdminHeader from '../SuperAdminHeader';
import MemberCard from '../MemberCard';
import MemberModal from '../MemberModal';
import UserIcon from '../icons/UserIcon';
import GenerateCardPage from '../GenerateCardPage';
import ProfilePage from '../ProfilePage';
import SettingsPage from '../SettingsPage';
import AdminNewsPage from '../admin/AdminNewsPage';
import AdminComplaintsPage from '../admin/AdminComplaintsPage';
import AdminOrgStructurePage from '../admin/AdminOrgStructurePage';
import RoleSelectionModal from '../RoleSelectionModal';
import { useToast } from '../../contexts/ToastContext';
import ForwardComplaintModal from '../operator/ForwardComplaintModal';

type Page = 'list' | 'generate' | 'profile' | 'settings' | 'admin_news' | 'admin_complaints' | 'admin_roles';

interface SuperAdminLayoutProps {
    user: Member;
    members: Member[];
    news: News[];
    complaints: Complaint[];
    roles: RoleDefinition[];
    sections: SectionDefinition[];
    jabatans: JabatanDefinition[];
    onLogout: () => void;
    onSaveMember: (member: Member) => Promise<boolean>;
    onDeleteMember: (id: string, name: string) => Promise<boolean>;
    onSaveNews: (newsItem: News) => Promise<void>;
    onDeleteNews: (id: string, title: string) => Promise<void>;
    onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => Promise<boolean>;
    onUpdateMemberAssignment: (memberId: string, assignment: { role: string; seksi: string; jabatan: string; }) => void;
    onSaveRole: (role: RoleDefinition) => Promise<boolean>;
    onDeleteRole: (roleId: string, roleName: string) => Promise<void>;
    onSaveSection: (section: SectionDefinition) => Promise<boolean>;
    onDeleteSection: (sectionId: string, sectionName: string) => Promise<void>;
    onSaveJabatan: (jabatan: JabatanDefinition) => Promise<boolean>;
    onDeleteJabatan: (jabatanId: string, jabatanName: string) => Promise<void>;
    onExportData: () => void;
    currentTheme: 'light' | 'dark' | 'system';
    onSetTheme: (theme: 'light' | 'dark' | 'system') => void;
    isLoading: boolean;
    onStartSimulation: (member: Member) => void;
}


const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
    user,
    members,
    news,
    complaints,
    roles,
    sections,
    jabatans,
    onLogout,
    onSaveMember,
    onDeleteMember,
    onSaveNews,
    onDeleteNews,
    onUpdateComplaint,
    onUpdateMemberAssignment,
    onSaveRole,
    onDeleteRole,
    onSaveSection,
    onDeleteSection,
    onSaveJabatan,
    onDeleteJabatan,
    onExportData,
    currentTheme,
    onSetTheme,
    isLoading,
    onStartSimulation
}) => {
    const [currentPage, setCurrentPage] = useState<Page>('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
    const [viewingMemberId, setViewingMemberId] = useState<string | null>(null);
    const [isRoleSelectionModalOpen, setRoleSelectionModalOpen] = useState(false);
    const [complaintToForward, setComplaintToForward] = useState<Complaint | null>(null);

    const toast = useToast();

    const isFixedPage = ['generate', 'settings', 'admin_news', 'admin_complaints', 'admin_roles'].includes(currentPage);

    const handleAddMember = useCallback(() => {
        setMemberToEdit(null);
        setIsModalOpen(true);
    }, []);

    const handleEditMember = useCallback((member: Member) => {
        setMemberToEdit(member);
        setIsModalOpen(true);
    }, []);

    const handleSaveAndCloseModal = async (editedMember: Member): Promise<boolean> => {
        const success = await onSaveMember(editedMember);
        if (success) {
            setIsModalOpen(false);
            setMemberToEdit(null);
        }
        return success;
    };
    
    const handleDeleteAndCloseProfile = async (id: string, name: string) => {
        const success = await onDeleteMember(id, name);
        if(success && viewingMemberId === id) {
             setCurrentPage('list');
             setViewingMemberId(null);
        }
    }

    const handleNavigate = useCallback((page: Page) => {
        setCurrentPage(page);
        setViewingMemberId(null);
    }, []);

    const handleViewProfile = useCallback((id: string) => {
        setViewingMemberId(id);
        setCurrentPage('profile');
    }, []);
    
    const handleOpenRoleSelectionModal = useCallback(() => {
        if (members.length > 0) {
          setRoleSelectionModalOpen(true);
        } else {
          toast.error('Tidak ada anggota untuk disimulasikan. Tambah anggota terlebih dahulu.');
        }
    }, [members, toast]);

    const handleSelectRoleForSimulation = (selectedMember: Member) => {
       onStartSimulation(selectedMember);
       setRoleSelectionModalOpen(false);
    };

    const memberForProfile = useMemo(
        () => members.find(m => m.id === viewingMemberId),
        [members, viewingMemberId]
    );

    const handleForwardAndCloseModal = async (seksiId: string, notes: string) => {
        if (complaintToForward) {
            const success = await onUpdateComplaint(complaintToForward.id, {
                status: 'Didisposisikan ke Seksi',
                currentOwner: seksiId,
                dispositionNotes: notes
            });
             if (success) {
                setComplaintToForward(null);
            }
            return success;
        }
        return false;
    }

    const renderAdminPage = () => {
        switch (currentPage) {
        case 'settings':
            return <SettingsPage onNavigate={handleNavigate} onAddMember={handleAddMember} onExportData={onExportData} currentTheme={currentTheme} onSetTheme={onSetTheme} />;
        case 'generate':
            return <GenerateCardPage members={members} />;
        case 'admin_news':
            return <AdminNewsPage news={news} onSave={onSaveNews} onDelete={onDeleteNews} isLoading={isLoading} />;
        case 'admin_complaints':
            return <AdminComplaintsPage complaints={complaints} sections={sections} onUpdateComplaint={onUpdateComplaint} onForward={setComplaintToForward} />;
        case 'admin_roles':
            return <AdminOrgStructurePage members={members} roles={roles} sections={sections} jabatans={jabatans} onUpdateMemberAssignment={onUpdateMemberAssignment} onSaveRole={onSaveRole} onDeleteRole={onDeleteRole} onSaveSection={onSaveSection} onDeleteSection={onDeleteSection} onSaveJabatan={onSaveJabatan} onDeleteJabatan={onDeleteJabatan} isLoading={isLoading} />;
        case 'profile':
            if (!memberForProfile) {
            setCurrentPage('list');
            return null;
            }
            return <ProfilePage member={memberForProfile} onEdit={handleEditMember} onDelete={handleDeleteAndCloseProfile} />;
        case 'list':
        default:
            return members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map(member => (
                <MemberCard key={member.id} member={member} onEdit={handleEditMember} onDelete={onDeleteMember} onSelect={handleViewProfile} />
                ))}
            </div>
            ) : (
            <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <UserIcon className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Belum Ada Anggota</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Mulai dengan menambahkan anggota baru.</p>
                <div className="mt-6">
                <button type="button" onClick={handleAddMember} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Tambah Anggota Pertama
                </button>
                </div>
            </div>
            );
        }
    };

    return (
        <div className={`${isFixedPage ? 'h-screen flex flex-col' : 'min-h-screen'} text-gray-800 dark:text-gray-200`}>
            <SuperAdminHeader 
                onAddMember={handleAddMember}
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onOpenRoleSelectionModal={handleOpenRoleSelectionModal}
                onLogout={onLogout}
                hasMembers={members.length > 0}
            />
            <main className={`container mx-auto p-4 sm:p-6 lg:p-8 ${isFixedPage ? 'flex-1 overflow-auto' : ''}`}>
                {renderAdminPage()}
            </main>
            <MemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAndCloseModal}
                memberToEdit={memberToEdit}
                loggedInUser={user}
                roles={roles}
                sections={sections}
                jabatans={jabatans}
                isLoading={isLoading}
            />
             {isRoleSelectionModalOpen && (
                <RoleSelectionModal
                    members={members}
                    onSelect={handleSelectRoleForSimulation}
                    onClose={() => setRoleSelectionModalOpen(false)}
                />
            )}
            {complaintToForward && (
                <ForwardComplaintModal
                    isOpen={!!complaintToForward}
                    onClose={() => setComplaintToForward(null)}
                    onForward={handleForwardAndCloseModal}
                    sections={sections}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default SuperAdminLayout;