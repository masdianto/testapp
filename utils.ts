import { Complaint, EmergencyDirective, TaskReport, SPPD } from "./types";

/**
 * Formats an ISO date string into a relative time string (e.g., "5 menit yang lalu").
 * @param isoDateString The date in ISO format.
 * @returns A human-readable relative time string.
 */
export const formatDateRelative = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  if (seconds < 10) return `beberapa detik yang lalu`;
  if (seconds < 60) return `${seconds} detik yang lalu`;
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari yang lalu`;
  if (weeks < 5) return `${weeks} minggu yang lalu`;
  if (months < 12) return `${months} bulan yang lalu`;
  return `${years} tahun yang lalu`;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};


export const getUrgencyClass = (urgency: EmergencyDirective['urgency']) => {
  switch (urgency) {
    case 'Tinggi':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Sedang':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Rendah':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getDirectiveStatusClass = (status: EmergencyDirective['status']) => {
  switch (status) {
    case 'Baru':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Dikerjakan':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Selesai':
      return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getComplaintStatusClass = (status: Complaint['status']) => {
  switch (status) {
    case 'Baru':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Menunggu Diproses Sekretaris':
    case 'Menunggu Disposisi Pimpinan':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    case 'Didisposisikan ke Seksi':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Dikerjakan oleh Seksi':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Laporan Selesai':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'Ditutup':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getSppdStatusClass = (status: SPPD['status']) => {
  switch (status) {
    case 'Menunggu Persetujuan':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Disetujui':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Ditolak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Laporan Diterima':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'Selesai':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Diarsipkan':
      return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getTaskReportStatusClass = (status: TaskReport['status'] | 'Perlu Dilihat') => {
    switch(status) {
        case 'Dilihat': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Dilaporkan': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Perlu Dilihat':
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
}