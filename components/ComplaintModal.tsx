import React, { useState } from 'react';
import XIcon from './icons/XIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { Complaint } from '../types';

type ComplaintFormData = Omit<Complaint, 'id' | 'status' | 'timestamp' | 'currentOwner' | 'dispositionNotes' | 'completionReport'>;

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ComplaintFormData) => void;
  isLoading: boolean;
}

const JENIS_LAPORAN_OPTIONS: Complaint['jenisLaporan'][] = [
  'Laporan Kejadian Bencana',
  'Permintaan Evakuasi',
  'Permintaan Logistik & Bantuan',
  'Laporan Kerusakan Infrastruktur',
  'Informasi & Edukasi',
  'Lainnya',
];

const initialFormState: ComplaintFormData = {
  namaPelapor: '',
  telepon: '',
  email: '',
  jenisLaporan: 'Laporan Kejadian Bencana',
  lokasiKejadian: '',
  content: '',
};



const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState<ComplaintFormData>(initialFormState);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    if (isLoading) return;
    setFormData(initialFormState);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Buat Pengaduan / Laporan
          </h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="namaPelapor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama Pelapor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaPelapor"
                name="namaPelapor"
                value={formData.namaPelapor}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="jenisLaporan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Jenis Laporan
              </label>
              <select
                id="jenisLaporan"
                name="jenisLaporan"
                value={formData.jenisLaporan}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {JENIS_LAPORAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nomor Telepon (Opsional)
              </label>
              <input
                type="tel"
                id="telepon"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email (Opsional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="lokasiKejadian" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lokasi Kejadian (Opsional)
              </label>
              <input
                type="text"
                id="lokasiKejadian"
                name="lokasiKejadian"
                value={formData.lokasiKejadian}
                onChange={handleChange}
                placeholder="Contoh: Depan Balai Desa Sukamaju"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Isi Laporan Rinci <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={5}
                value={formData.content}
                onChange={handleChange}
                placeholder="Jelaskan laporan atau pengaduan Anda secara rinci di sini..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Pengaduan Anda akan ditinjau oleh operator kami. Terima kasih atas kontribusi Anda.
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.namaPelapor.trim() || !formData.content.trim()}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <SpinnerIcon className="w-5 h-5" /> : null}
              {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;