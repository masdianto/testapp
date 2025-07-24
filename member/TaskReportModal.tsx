import React, { useState } from 'react';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import UploadIcon from '../icons/UploadIcon';

interface TaskReportModalProps {
  onClose: () => void;
  onSave: (reportText: string, reportImageUrl?: string) => Promise<void>;
  isLoading: boolean;
}

const TaskReportModal: React.FC<TaskReportModalProps> = ({ onClose, onSave, isLoading }) => {
  const [reportText, setReportText] = useState('');
  const [reportImage, setReportImage] = useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    onSave(reportText, reportImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex justify-center items-center backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl m-4 w-full max-w-lg flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Laporan Tugas</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="reportText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laporan Kegiatan</label>
              <textarea
                id="reportText"
                name="reportText"
                rows={5}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Jelaskan kegiatan yang telah Anda lakukan secara rinci..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bukti Foto (Opsional)</label>
              <div className="mt-2 flex items-center gap-4">
                 <label
                    htmlFor="image-upload"
                    className="flex-grow cursor-pointer flex items-center justify-center gap-2 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <UploadIcon className="w-5 h-5"/>
                    <span>{reportImage ? 'Ganti Foto' : 'Pilih Foto'}</span>
                    <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                {reportImage && <img src={reportImage} alt="Preview" className="w-20 h-20 rounded-md object-cover" />}
              </div>
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
              disabled={isLoading || !reportText.trim()}
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

export default TaskReportModal;