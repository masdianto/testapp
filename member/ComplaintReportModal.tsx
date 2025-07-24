import React, { useState, useRef } from 'react';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import UploadIcon from '../icons/UploadIcon';
import DocumentIcon from '../icons/DocumentIcon';

interface ComplaintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string, attachmentUrl?: string, attachmentName?: string) => Promise<void>;
  isLoading: boolean;
}

const ComplaintReportModal: React.FC<ComplaintReportModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          url: reader.result as string,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onSave(notes, attachment?.url, attachment?.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Laporan Penyelesaian</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laporan Penyelesaian</label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jelaskan bagaimana tugas telah diselesaikan..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="attachment-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lampiran Foto/Dokumen (Opsional)</label>
              {!attachment ? (
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
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{attachment.name}</p>
                  </div>
                  <button type="button" onClick={handleRemoveAttachment} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !notes.trim()}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintReportModal;