import React, { useState, useRef } from 'react';
import { ReimbursementRequest } from '../../../types';
import XIcon from '../../icons/XIcon';
import SpinnerIcon from '../../icons/SpinnerIcon';
import UploadIcon from '../../icons/UploadIcon';
import DocumentIcon from '../../icons/DocumentIcon';

interface ReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestData: Omit<ReimbursementRequest, 'id' | 'requesterId' | 'requesterName' | 'date' | 'status'>) => Promise<boolean>;
  isLoading: boolean;
}

type FormData = Omit<ReimbursementRequest, 'id' | 'requesterId' | 'requesterName' | 'date' | 'status'>;

const ReimbursementModal: React.FC<ReimbursementModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    amount: 0,
    category: 'Operasional Harian',
    description: '',
    proofUrl: '',
    proofName: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: (e.target as HTMLInputElement).type === 'number' ? parseFloat(value) : value,
      }))
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          proofUrl: reader.result as string,
          proofName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || formData.amount <= 0 || !formData.proofUrl) return;
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Reimbursement</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700">
                        <option>Operasional Harian</option>
                        <option>SPPD</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp)</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700" />
                </div>
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi Pengeluaran</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
              <label htmlFor="attachment-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bukti Pembayaran (Struk/Invoice)</label>
                <label
                  htmlFor="attachment-upload"
                  className="mt-1 group cursor-pointer flex justify-center w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary dark:hover:border-orange-400"
                >
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.proofName || 'Pilih file'}</p>
                    <input id="attachment-upload" name="attachment-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} required />
                  </div>
                </label>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md text-sm">
              Batal
            </button>
            <button type="submit" disabled={isLoading || !formData.description.trim() || formData.amount <= 0 || !formData.proofUrl} className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium disabled:bg-orange-400 flex items-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReimbursementModal;
