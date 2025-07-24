import React, { useState } from 'react';
import { SectionDefinition } from '../../types';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';

interface ForwardComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForward: (forwardedTo: string, notes: string) => Promise<boolean>;
  sections: SectionDefinition[];
  isLoading: boolean;
}

const ForwardComplaintModal: React.FC<ForwardComplaintModalProps> = ({ isOpen, onClose, onForward, sections, isLoading }) => {
  const [forwardedTo, setForwardedTo] = useState<string>(sections.find(s => s.id === 'logistik')?.id || sections[0]?.id || '');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forwardedTo) return;
    const success = await onForward(forwardedTo, notes);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teruskan Laporan</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="forwardedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teruskan ke Seksi</label>
              <select
                id="forwardedTo"
                name="forwardedTo"
                value={forwardedTo}
                onChange={(e) => setForwardedTo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan / Instruksi (Opsional)</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan instruksi atau detail tambahan di sini..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !forwardedTo}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Meneruskan...' : 'Teruskan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForwardComplaintModal;