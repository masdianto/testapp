import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EmergencyDirective, Member, RoleDefinition, SectionDefinition } from '../../types';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import UploadIcon from '../icons/UploadIcon';
import DocumentIcon from '../icons/DocumentIcon';


interface DirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (directive: EmergencyDirective) => Promise<void>;
  directiveToEdit: EmergencyDirective | null;
  allMembers: Member[];
  isLoading: boolean;
  loggedInUser: Member;
  roles: RoleDefinition[];
  sections: SectionDefinition[];
}

const DirectiveModal: React.FC<DirectiveModalProps> = ({ isOpen, onClose, onSave, directiveToEdit, allMembers, isLoading, loggedInUser, roles, sections }) => {
  const getInitialState = useCallback((): Omit<EmergencyDirective, 'date'> => {
    return directiveToEdit || {
      id: '',
      createdBy: '',
      title: '',
      urgency: 'Sedang',
      status: 'Baru',
      description: '',
      assignedTo: 'all',
      attachmentUrl: undefined,
      attachmentName: undefined,
    };
  }, [directiveToEdit]);

  const [directive, setDirective] = useState<Omit<EmergencyDirective, 'date'>>(getInitialState);
  const [isAssigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDirective(getInitialState());
    }
  }, [isOpen, getInitialState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAssigneeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const assignableMembers = useMemo(() => {
    if (!loggedInUser) return [];

    const otherMembers = allMembers.filter(m => m.id !== loggedInUser.id);

    switch (loggedInUser.role) {
      case 'Pimpinan':
        return otherMembers;
      
      case 'Kepala Seksi':
        return otherMembers.filter(
          m => m.seksi === loggedInUser.seksi && m.role === 'Anggota'
        );
      
      case 'Sekretaris':
        return otherMembers.filter(m => m.seksi === 'Sekretariat');
      
      case 'Bendahara':
        return otherMembers.filter(m => m.seksi === 'Keuangan');

      default:
        return [];
    }
  }, [allMembers, loggedInUser]);

  const helperText = useMemo(() => {
    if (!loggedInUser) return null;
    switch (loggedInUser.role) {
        case 'Pimpinan':
            return null;
        case 'Kepala Seksi':
            return `Hanya Anggota dari seksi Anda (${loggedInUser.seksi}) yang dapat dipilih.`;
        case 'Sekretaris':
             return `Hanya anggota dari seksi Sekretariat yang dapat dipilih.`;
        case 'Bendahara':
             return `Hanya anggota dari seksi Keuangan yang dapat dipilih.`;
        default:
            return "Anda tidak memiliki wewenang untuk menugaskan anggota lain.";
    }
  },[loggedInUser]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDirective(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setDirective(prev => ({ 
          ...prev, 
          attachmentUrl: reader.result as string,
          attachmentName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setDirective(prev => ({
      ...prev,
      attachmentUrl: undefined,
      attachmentName: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleAssigneeChange = (memberId: string) => {
    setDirective(prev => {
        const currentAssignedTo = Array.isArray(prev.assignedTo) ? prev.assignedTo : [];
        const newAssignedTo = currentAssignedTo.includes(memberId)
            ? currentAssignedTo.filter(id => id !== memberId)
            : [...currentAssignedTo, memberId];
        return { ...prev, assignedTo: newAssignedTo };
    });
  };
  
  const handleSelectAllAssignees = (select: boolean) => {
    setDirective(prev => ({
        ...prev,
        assignedTo: select ? assignableMembers.map(m => m.id) : [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(directive as EmergencyDirective);
  };

  if (!isOpen) return null;

  const assignedCount = Array.isArray(directive.assignedTo) ? directive.assignedTo.length : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {directiveToEdit ? 'Edit Perintah' : 'Buat Perintah Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Perintah</label>
              <input type="text" name="title" id="title" value={directive.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urgensi</label>
                    <select name="urgency" id="urgency" value={directive.urgency} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="Tinggi">Tinggi</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Rendah">Rendah</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select name="status" id="status" value={directive.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="Baru">Baru</option>
                        <option value="Dikerjakan">Dikerjakan</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
              <textarea name="description" id="description" value={directive.description} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            
            <div ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ditugaskan Kepada</label>
                 <div className="relative mt-1 grid grid-cols-2 gap-2">
                     <button type="button" onClick={() => setDirective(d => ({...d, assignedTo: 'all'}))} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors border ${directive.assignedTo === 'all' ? 'bg-primary/20 border-primary text-primary' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}>Semua Anggota</button>
                     <button type="button" onClick={() => { setDirective(d => ({...d, assignedTo: Array.isArray(d.assignedTo) ? d.assignedTo : []})); setAssigneeDropdownOpen(true); }} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors border ${Array.isArray(directive.assignedTo) ? 'bg-primary/20 border-primary text-primary' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}>Pilih Anggota ({assignedCount})</button>
                     {Array.isArray(directive.assignedTo) && isAssigneeDropdownOpen && (
                         <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 flex flex-col max-h-60">
                             <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                                <button type="button" onClick={() => handleSelectAllAssignees(true)} className="text-xs font-semibold text-primary hover:underline">Pilih Semua</button>
                                <button type="button" onClick={() => handleSelectAllAssignees(false)} className="text-xs font-semibold text-gray-500 hover:underline">Kosongkan</button>
                             </div>
                             <ul className="flex-grow overflow-y-auto">
                                {assignableMembers.length > 0 ? assignableMembers.map(member => (
                                    <li key={member.id}>
                                        <label className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={directive.assignedTo.includes(member.id)}
                                                onChange={() => handleAssigneeChange(member.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <img src={member.fotoUrl} alt={member.namaLengkap} className="w-8 h-8 rounded-full object-cover" />
                                            <span className="text-sm text-gray-800 dark:text-gray-200">{member.namaLengkap}</span>
                                        </label>
                                    </li>
                                )) : (
                                    <p className="text-center text-sm text-gray-500 p-4">Tidak ada anggota yang bisa ditugaskan.</p>
                                )}
                             </ul>
                             {helperText && (
                                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">{helperText}</p>
                                </div>
                             )}
                         </div>
                     )}
                 </div>
            </div>

            <div>
              <label htmlFor="attachment-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lampiran Surat (Opsional)</label>
              {!directive.attachmentName ? (
                <label
                  htmlFor="attachment-upload"
                  className="mt-1 group cursor-pointer flex justify-center w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary dark:hover:border-orange-400 transition-colors"
                >
                  <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary dark:group-hover:text-orange-400 transition-colors" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <span className="relative font-semibold text-primary dark:text-orange-400">
                        <span>Pilih file untuk diupload</span>
                        <input id="attachment-upload" name="attachment-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} />
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOCX, PNG, JPG</p>
                  </div>
                </label>
              ) : (
                <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <DocumentIcon className="h-6 w-6 text-primary flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{directive.attachmentName}</p>
                  </div>
                  <button type="button" onClick={handleRemoveAttachment} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectiveModal;