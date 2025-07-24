import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SPPD, Member } from '../../../types';
import XIcon from '../../icons/XIcon';
import SpinnerIcon from '../../icons/SpinnerIcon';
import ChevronDownIcon from '../../icons/ChevronDownIcon';

interface SppdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sppd: SPPD) => Promise<boolean>;
  sppdToEdit: SPPD | null;
  allMembers: Member[];
  isLoading: boolean;
}

const SppdModal: React.FC<SppdModalProps> = ({ isOpen, onClose, onSave, sppdToEdit, allMembers, isLoading }) => {
  const getInitialState = useCallback((): Omit<SPPD, 'id' | 'pembuatId' | 'dibuatTanggal' | 'status'> => {
    return sppdToEdit || {
      nomorSurat: '',
      dasarHukum: '',
      untuk: '',
      tujuan: '',
      tanggalBerangkat: '',
      tanggalKembali: '',
      penerimaTugasIds: [],
    };
  }, [sppdToEdit]);

  const [sppd, setSppd] = useState(getInitialState);
  const [isAssigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSppd(getInitialState());
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSppd(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAssigneeChange = (memberId: string) => {
    setSppd(prev => {
        const currentAssignedTo = Array.isArray(prev.penerimaTugasIds) ? prev.penerimaTugasIds : [];
        const newAssignedTo = currentAssignedTo.includes(memberId)
            ? currentAssignedTo.filter(id => id !== memberId)
            : [...currentAssignedTo, memberId];
        return { ...prev, penerimaTugasIds: newAssignedTo };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sppd as SPPD);
  };

  if (!isOpen) return null;
  
  const assignedCount = Array.isArray(sppd.penerimaTugasIds) ? sppd.penerimaTugasIds.length : 0;
  const nonAdminMembers = allMembers.filter(m => m.role !== 'Admin');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {sppdToEdit ? 'Edit SPPD' : 'Buat SPPD Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="nomorSurat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Surat</label>
              <input type="text" name="nomorSurat" id="nomorSurat" value={sppd.nomorSurat} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="dasarHukum" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dasar Hukum</label>
              <input type="text" name="dasarHukum" id="dasarHukum" value={sppd.dasarHukum} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="untuk" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maksud Perjalanan Dinas</label>
              <textarea name="untuk" id="untuk" value={sppd.untuk} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="tujuan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tujuan</label>
              <input type="text" name="tujuan" id="tujuan" value={sppd.tujuan} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="tanggalBerangkat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Berangkat</label>
              <input type="date" name="tanggalBerangkat" id="tanggalBerangkat" value={sppd.tanggalBerangkat} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="tanggalKembali" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Kembali</label>
              <input type="date" name="tanggalKembali" id="tanggalKembali" value={sppd.tanggalKembali} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penerima Tugas</label>
               <div className="relative mt-1">
                 <button type="button" onClick={() => setAssigneeDropdownOpen(!isAssigneeDropdownOpen)} className="w-full text-left flex items-center justify-between p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <span>{assignedCount > 0 ? `${assignedCount} anggota terpilih` : 'Pilih anggota...'}</span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isAssigneeDropdownOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isAssigneeDropdownOpen && (
                     <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 flex flex-col max-h-60">
                         <ul className="flex-grow overflow-y-auto">
                            {nonAdminMembers.map(member => (
                                <li key={member.id}>
                                    <label className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sppd.penerimaTugasIds.includes(member.id)}
                                            onChange={() => handleAssigneeChange(member.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <img src={member.fotoUrl} alt={member.namaLengkap} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="text-sm text-gray-800 dark:text-gray-200">{member.namaLengkap}</span>
                                    </label>
                                </li>
                            ))}
                         </ul>
                     </div>
                 )}
               </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading || sppd.penerimaTugasIds.length === 0} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SppdModal;
