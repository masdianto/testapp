import React, { useState, useEffect } from 'react';
import { RoleDefinition } from '../../types';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: RoleDefinition) => Promise<boolean>;
  roleToEdit: RoleDefinition | null;
  isLoading: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, roleToEdit, isLoading }) => {
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRoleName(roleToEdit ? roleToEdit.name : '');
    }
  }, [isOpen, roleToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    const roleData: RoleDefinition = {
      id: roleToEdit ? roleToEdit.id : roleName.toLowerCase().replace(/\s+/g, '-'),
      name: roleName.trim(),
      isSystem: false,
    };
    const success = await onSave(roleData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {roleToEdit ? 'Edit Nama Role' : 'Tambah Role Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Role</label>
            <input 
              type="text" 
              name="roleName" 
              id="roleName" 
              value={roleName} 
              onChange={(e) => setRoleName(e.target.value)} 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Koordinator Lapangan"
            />
             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Peran sistem tidak dapat diubah. Anda hanya dapat menambah atau mengubah peran kustom.
             </p>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading || !roleName.trim()} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;