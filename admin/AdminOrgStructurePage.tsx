import React, { useState } from 'react';
import { Member, RoleDefinition, SectionDefinition, JabatanDefinition } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import LockClosedIcon from '../icons/LockClosedIcon';
import RoleModal from './RoleModal';
import SectionModal from './SectionModal';
import JabatanModal from './JabatanModal';

interface AdminOrgStructurePageProps {
  members: Member[];
  roles: RoleDefinition[];
  sections: SectionDefinition[];
  jabatans: JabatanDefinition[];
  onUpdateMemberAssignment: (memberId: string, assignment: { role: string; seksi: string; jabatan: string; }) => void;
  onSaveRole: (role: RoleDefinition) => Promise<boolean>;
  onDeleteRole: (roleId: string, roleName: string) => Promise<void>;
  onSaveSection: (section: SectionDefinition) => Promise<boolean>;
  onDeleteSection: (sectionId: string, sectionName: string) => Promise<void>;
  onSaveJabatan: (jabatan: JabatanDefinition) => Promise<boolean>;
  onDeleteJabatan: (jabatanId: string, jabatanName: string) => Promise<void>;
  isLoading: boolean;
}

type ActiveTab = 'assignment' | 'role_management' | 'section_management' | 'jabatan_management';

const AdminOrgStructurePage: React.FC<AdminOrgStructurePageProps> = ({ 
    members, 
    roles, 
    sections, 
    jabatans,
    onUpdateMemberAssignment, 
    onSaveRole, 
    onDeleteRole, 
    onSaveSection, 
    onDeleteSection, 
    onSaveJabatan,
    onDeleteJabatan,
    isLoading 
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assignment');
  
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleDefinition | null>(null);

  const [isSectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<SectionDefinition | null>(null);

  const [isJabatanModalOpen, setJabatanModalOpen] = useState(false);
  const [jabatanToEdit, setJabatanToEdit] = useState<JabatanDefinition | null>(null);
  
  const handleAssignmentChange = (memberId: string, updates: { role?: string; seksi?: string; jabatan?: string }) => {
    const member = members.find(m => m.id === memberId)!;
    let newRole = updates.role ?? member.role;
    let newSeksi = updates.seksi ?? member.seksi;
    const newJabatan = updates.jabatan ?? member.jabatan;

    const systemSectionsMap: { [key: string]: string } = {
        'Pimpinan': 'Pimpinan',
        'Sekretaris': 'Sekretariat',
        'Bendahara': 'Keuangan'
    };
    
    if (updates.role) { // If role was changed, seksi might need to be auto-updated
        if (systemSectionsMap[newRole]) {
            newSeksi = systemSectionsMap[newRole];
        } else if (Object.values(systemSectionsMap).includes(member.seksi)) {
            // If user was in a system seksi but is no longer a system role, move to 'Umum'
            newSeksi = sections.find(s => s.id === 'umum')?.name || 'Umum';
        }
    }
    
    onUpdateMemberAssignment(memberId, { role: newRole, seksi: newSeksi, jabatan: newJabatan });
  };
  
  const isSectionDisabled = (role: string) => ['Pimpinan', 'Sekretaris', 'Bendahara'].includes(role);

  const availableSections = sections.filter(s => !s.isSystem);

  // Modal Handlers
  const handleAddRole = () => { setRoleToEdit(null); setRoleModalOpen(true); };
  const handleEditRole = (role: RoleDefinition) => { setRoleToEdit(role); setRoleModalOpen(true); };
  const handleSaveAndCloseRoleModal = async (role: RoleDefinition) => {
    const success = await onSaveRole(role);
    if (success) setRoleModalOpen(false);
    return success;
  };

  const handleAddSection = () => { setSectionToEdit(null); setSectionModalOpen(true); };
  const handleEditSection = (section: SectionDefinition) => { setSectionToEdit(section); setSectionModalOpen(true); };
  const handleSaveAndCloseSectionModal = async (section: SectionDefinition) => {
    const success = await onSaveSection(section);
    if (success) setSectionModalOpen(false);
    return success;
  };

  const handleAddJabatan = () => { setJabatanToEdit(null); setJabatanModalOpen(true); };
  const handleEditJabatan = (jabatan: JabatanDefinition) => { setJabatanToEdit(jabatan); setJabatanModalOpen(true); };
  const handleSaveAndCloseJabatanModal = async (jabatan: JabatanDefinition) => {
    const success = await onSaveJabatan(jabatan);
    if (success) setJabatanModalOpen(false);
    return success;
  };
  
  const TabButton: React.FC<{tabId: ActiveTab, children: React.ReactNode}> = ({ tabId, children }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`py-2 px-4 text-sm font-semibold rounded-md transition-colors w-full ${activeTab === tabId ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
      {children}
    </button>
  );

  const renderRoleAssignment = () => (
     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Anggota</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jabatan Saat Ini</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ubah Peran</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ubah Seksi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ubah Jabatan</th>
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {members.map((member) => (
                <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                        <img className="h-10 w-10 rounded-full object-cover" src={member.fotoUrl} alt={member.namaLengkap} />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.namaLengkap}</div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div>{member.jabatan}</div>
                    <div className="text-xs text-gray-500">{member.role} / {member.seksi}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select
                        value={member.role}
                        onChange={(e) => handleAssignmentChange(member.id, { role: e.target.value })}
                        disabled={member.role === 'Admin'}
                        className="text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                    </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select
                        value={member.seksi}
                        onChange={(e) => handleAssignmentChange(member.id, { seksi: e.target.value })}
                        disabled={isSectionDisabled(member.role)}
                        className="text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSectionDisabled(member.role) ? (
                            <option value={member.seksi}>{member.seksi}</option>
                        ) : (
                            availableSections.map(seksi => <option key={seksi.id} value={seksi.name}>{seksi.name}</option>)
                        )}
                    </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select
                        value={member.jabatan}
                        onChange={(e) => handleAssignmentChange(member.id, { jabatan: e.target.value })}
                        className="text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {jabatans.map(j => <option key={j.id} value={j.name}>{j.name}</option>)}
                    </select>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );

  const renderManagementList = <T extends {id: string, name: string, isSystem?: boolean}>(
      title: string, 
      items: T[], 
      onAdd: () => void, 
      onEdit: (item: T) => void, 
      onDelete: (id: string, name: string) => void,
      addLabel: string
    ) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button onClick={onAdd} className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600">
                <PlusIcon className="w-5 h-5" />
                <span>{addLabel}</span>
            </button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map(item => (
                <li key={item.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {item.isSystem && <span title="Item sistem tidak dapat diubah"><LockClosedIcon className="w-5 h-5 text-gray-400" /></span>}
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(item)} disabled={item.isSystem} className="p-2 text-gray-500 hover:text-yellow-600 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed">
                            <EditIcon className="w-5 h-5"/>
                        </button>
                         <button onClick={() => onDelete(item.id, item.name)} disabled={item.isSystem} className="p-2 text-gray-500 hover:text-red-600 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );

  return (
    <>
    <div className="animate-fade-in space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 justify-center p-1 space-x-2 bg-gray-100 dark:bg-gray-900 rounded-lg max-w-3xl mx-auto">
            <TabButton tabId="assignment">Penetapan Jabatan</TabButton>
            <TabButton tabId="role_management">Manajemen Peran</TabButton>
            <TabButton tabId="section_management">Manajemen Seksi</TabButton>
            <TabButton tabId="jabatan_management">Manajemen Jabatan</TabButton>
        </div>
        
        {activeTab === 'assignment' && renderRoleAssignment()}
        {activeTab === 'role_management' && renderManagementList('Daftar Peran Tersedia', roles, handleAddRole, handleEditRole, onDeleteRole, 'Tambah Peran')}
        {activeTab === 'section_management' && renderManagementList('Daftar Seksi/Divisi', sections, handleAddSection, handleEditSection, onDeleteSection, 'Tambah Seksi')}
        {activeTab === 'jabatan_management' && renderManagementList('Daftar Jabatan Tersedia', jabatans, handleAddJabatan, handleEditJabatan, onDeleteJabatan, 'Tambah Jabatan')}
    </div>
    <RoleModal 
        isOpen={isRoleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleSaveAndCloseRoleModal}
        roleToEdit={roleToEdit}
        isLoading={isLoading}
    />
    <SectionModal 
        isOpen={isSectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        onSave={handleSaveAndCloseSectionModal}
        sectionToEdit={sectionToEdit}
        isLoading={isLoading}
    />
     <JabatanModal 
        isOpen={isJabatanModalOpen}
        onClose={() => setJabatanModalOpen(false)}
        onSave={handleSaveAndCloseJabatanModal}
        jabatanToEdit={jabatanToEdit}
        isLoading={isLoading}
    />
    </>
  );
};

export default AdminOrgStructurePage;