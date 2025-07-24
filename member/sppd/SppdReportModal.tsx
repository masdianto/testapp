import React, { useState, useRef } from 'react';
import XIcon from '../../icons/XIcon';
import SpinnerIcon from '../../icons/SpinnerIcon';
import UploadIcon from '../../icons/UploadIcon';
import DocumentIcon from '../../icons/DocumentIcon';
import { SPPDReport } from '../../../types';

interface SppdReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Omit<SPPDReport, 'id' | 'sppdId' | 'memberId' | 'dikirimTanggal'>) => Promise<boolean>;
  isLoading: boolean;
}

type ReportData = Omit<SPPDReport, 'id' | 'sppdId' | 'memberId' | 'dikirimTanggal'>;

const SppdReportModal: React.FC<SppdReportModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [reportData, setReportData] = useState<ReportData>({
      hasilKegiatan: '',
      kendala: '',
      saran: '',
      lampiranUrl: undefined,
      lampiranName: undefined,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setReportData(prev => ({...prev, [name]: value}));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportData(prev => ({
          ...prev,
          lampiranUrl: reader.result as string,
          lampiranName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveAttachment = () => {
    setReportData(prev => ({...prev, lampiranUrl: undefined, lampiranName: undefined}));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData.hasilKegiatan.trim()) return;
    onSave(reportData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan Hasil Perjalanan Dinas</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="hasilKegiatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hasil Kegiatan</label>
              <textarea name="hasilKegiatan" id="hasilKegiatan" value={reportData.hasilKegiatan} onChange={handleChange} required rows={5} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
             <div>
              <label htmlFor="kendala" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kendala yang Dihadapi</label>
              <textarea name="kendala" id="kendala" value={reportData.kendala} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
             <div>
              <label htmlFor="saran" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Saran/Rekomendasi</label>
              <textarea name="saran" id="saran" value={reportData.saran} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="attachment-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lampiran (Opsional)</label>
              {!reportData.lampiranName ? (
                <label
                  htmlFor="attachment-upload"
                  className="mt-1 group cursor-pointer flex justify-center w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary dark:hover:border-orange-400"
                >
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pilih file</p>
                    <input id="attachment-upload" name="attachment-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} />
                  </div>
                </label>
              ) : (
                <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <DocumentIcon className="h-6 w-6 text-primary flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{reportData.lampiranName}</p>
                  </div>
                  <button type="button" onClick={handleRemoveAttachment} className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md text-sm">
              Batal
            </button>
            <button type="submit" disabled={isLoading || !reportData.hasilKegiatan.trim()} className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium disabled:bg-orange-400 flex items-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SppdReportModal;
