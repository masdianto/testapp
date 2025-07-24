import React, { useState } from 'react';
import { Member, RoleDefinition, SectionDefinition } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import LockClosedIcon from '../icons/LockClosedIcon';
import RoleModal from './RoleModal';

interface AdminRolesPageProps {
  members: Member[];
  roles: RoleDefinition[];
  sections: SectionDefinition[];
  onUpdateRole: (memberId: string, role: string, seksi: string) => void;
  onSaveRole: (role: RoleDefinition) => Promise<boolean>;
  onDeleteRole: (roleId: string, roleName: string) => Promise<void>;
  isLoading: boolean;
}

type ActiveTab = 'assignment' | 'management';

const AdminRolesPage: React.FC<AdminRolesPageProps> = ({ members, roles, sections, onUpdateRole, onSaveRole, onDeleteRole, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assignment');
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleDefinition | null>(null);

  const handleRoleChange = (memberId: string, newRoleValue: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const roleDef = roles.find(r => r.name === newRoleValue);
    if (!roleDef) return;

    let newSeksi = member.seksi;
    const systemSections = ['Pimpinan', 'Sekretariat', 'Keuangan'];
    
    if (systemSections.includes(newRoleValue)) {
        newSeksi = newRoleValue;
    } else if (systemSections.includes(member.seksi)) {
        newSeksi = 'Umum';
    }
    
    onUpdateRole(memberId, newRoleValue, newSeksi);
  };

  const handleSeksiChange = (memberId: string, newSeksiValue: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    onUpdateRole(memberId, member.role, newSeksiValue);
  };
  
  const isSectionDisabled = (role: string) => {
    return ['Pimpinan', 'Sekretaris', 'Bendahara'].includes(role);
  };

  const availableSections = sections.filter(s => !s.isSystem || ['Pimpinan', 'Sekretariat', 'Keuangan'].includes(s.name));

  const handleAddRole = () => {
    setRoleToEdit(null);
    setRoleModalOpen(true);
  };

  const handleEditRole = (role: RoleDefinition) => {
    setRoleToEdit(role);
    setRoleModalOpen(true);
  };

  const handleSaveAndClose = async (role: RoleDefinition) => {
    const success = await onSaveRole(role);
    if (success) {
      setRoleModalOpen(false);
    }
    return success;
  };

  const TabButton: React.FC<{tabId: ActiveTab, children: React.ReactNode}> = ({ tabId, children }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === tabId ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
      {children}
    </button>
  )

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
                    <div>{member.role}</div>
                    <div className="text-xs text-gray-500">{member.seksi}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    disabled={member.role === 'Pimpinan'}
                    className="text-sm font-semibold rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                    </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select
                    value={member.seksi}
                    onChange={(e) => handleSeksiChange(member.id, e.target.value)}
                    disabled={isSectionDisabled(member.role)}
                    className="text-sm font-semibold rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {isSectionDisabled(member.role) ? (
                        <option value={member.seksi}>{member.seksi}</option>
                    ) : (
                        availableSections.map(seksi => <option key={seksi.id} value={seksi.name}>{seksi.name}</option>)
                    )}
                    </select>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );

  const renderRoleManagement = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">Daftar Role Tersedia</h3>
            <button
                onClick={handleAddRole}
                className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Tambah Role</span>
            </button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {roles.map(role => (
                <li key={role.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {role.isSystem && <span title="Peran sistem tidak dapat diubah"><LockClosedIcon className="w-5 h-5 text-gray-400" /></span>}
                        <span className="font-medium text-gray-800 dark:text-gray-200">{role.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleEditRole(role)}
                            disabled={role.isSystem}
                            className="p-2 text-gray-500 hover:text-yellow-600 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                        >
                            <EditIcon className="w-5 h-5"/>
                        </button>
                         <button 
                            onClick={() => onDeleteRole(role.id, role.name)}
                            disabled={role.isSystem}
                            className="p-2 text-gray-500 hover:text-red-600 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                        >
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
        <div className="flex justify-center p-1 space-x-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <TabButton tabId="assignment">Penetapan Peran Anggota</TabButton>
            <TabButton tabId="management">Kelola Daftar Role</TabButton>
        </div>
        
        {activeTab === 'assignment' ? renderRoleAssignment() : renderRoleManagement()}
    </div>
    <RoleModal 
        isOpen={isRoleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleSaveAndClose}
        roleToEdit={roleToEdit}
        isLoading={isLoading}
    />
    </>
  );
};

export default AdminRolesPage;