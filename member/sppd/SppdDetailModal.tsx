import React, { useState } from 'react';
import { SPPD, Member, SPPDReport } from '../../../types';
import XIcon from '../../icons/XIcon';
import PaperAirplaneIcon from '../../icons/PaperAirplaneIcon';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import { getSppdStatusClass } from '../../../utils';
import SpinnerIcon from '../../icons/SpinnerIcon';

interface SppdDetailModalProps {
  sppd: SPPD;
  onClose: () => void;
  loggedInUser: Member;
  allMembers: Member[];
  sppdReports: SPPDReport[];
  onUpdateSppd: (sppdId: string, updates: Partial<SPPD>) => Promise<boolean>;
  onReport: () => void;
  isLoading: boolean;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-1">{label}</dt>
        <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2">{value}</dd>
    </div>
);

const SppdDetailModal: React.FC<SppdDetailModalProps> = ({ sppd, onClose, loggedInUser, allMembers, sppdReports, onUpdateSppd, onReport, isLoading }) => {
    const [rejectionNotes, setRejectionNotes] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    const isPimpinan = loggedInUser.role === 'Pimpinan';
    const isPenerimaTugas = sppd.penerimaTugasIds.includes(loggedInUser.id);
    
    const penerimaTugas = allMembers.filter(m => sppd.penerimaTugasIds.includes(m.id));
    const pembuat = allMembers.find(m => m.id === sppd.pembuatId);

    const reports = sppdReports.filter(r => r.sppdId === sppd.id);

    const handleApprove = () => {
        onUpdateSppd(sppd.id, { status: 'Disetujui', penyetujuId: loggedInUser.id });
    };

    const handleReject = () => {
        if (!rejectionNotes) return;
        onUpdateSppd(sppd.id, { status: 'Ditolak', penyetujuId: loggedInUser.id, catatanPenolakan: rejectionNotes }).then((success) => {
            if (success) {
                setShowRejectionInput(false);
            }
        });
    };
    
    const handleComplete = () => {
        onUpdateSppd(sppd.id, { status: 'Selesai' });
    }

    const renderFooter = () => {
        if (isPimpinan) {
            if (sppd.status === 'Menunggu Persetujuan') {
                return (
                    <div className="w-full flex flex-col sm:flex-row justify-end gap-3">
                        <button onClick={() => setShowRejectionInput(true)} disabled={isLoading} className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Tolak</button>
                        <button onClick={handleApprove} disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                            Setujui
                        </button>
                    </div>
                );
            }
            if (sppd.status === 'Laporan Diterima') {
                 return (
                    <button onClick={handleComplete} disabled={isLoading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 flex items-center justify-center gap-2">
                        {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Tinjauan Selesai'}
                    </button>
                 )
            }
        }

        if (isPenerimaTugas && sppd.status === 'Disetujui' && !reports.find(r => r.memberId === loggedInUser.id)) {
            return (
                 <button onClick={onReport} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600">
                    Lapor Hasil Perjalanan
                </button>
            )
        }

        return <button onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Tutup</button>;
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-full">
                    <PaperAirplaneIcon className="w-6 h-6 text-primary" />
                </span>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detail Surat Perintah Perjalanan Dinas</h2>
                    <span className={`px-2 py-0.5 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSppdStatusClass(sppd.status)}`}>{sppd.status}</span>
                </div>
            </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-5 w-5" />
          </button>
        </header>
        <main className="overflow-y-auto p-6 space-y-6">
            <dl className="space-y-4">
                <DetailRow label="Nomor Surat" value={sppd.nomorSurat} />
                <DetailRow label="Dasar Hukum" value={sppd.dasarHukum} />
                <DetailRow label="Maksud Perjalanan" value={sppd.untuk} />
                <DetailRow label="Tujuan" value={sppd.tujuan} />
                <DetailRow label="Tanggal" value={`${new Date(sppd.tanggalBerangkat).toLocaleDateString('id-ID')} - ${new Date(sppd.tanggalKembali).toLocaleDateString('id-ID')}`} />
                <DetailRow label="Dibuat oleh" value={pembuat?.namaLengkap || 'N/A'} />
            </dl>
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Penerima Tugas</h3>
                <ul className="mt-2 space-y-2">
                    {penerimaTugas.map(p => (
                        <li key={p.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <img src={p.fotoUrl} alt={p.namaLengkap} className="w-8 h-8 rounded-full object-cover"/>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{p.namaLengkap}</span>
                        </li>
                    ))}
                </ul>
            </div>
             {sppd.status === 'Ditolak' && sppd.catatanPenolakan && (
                <div>
                     <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Catatan Penolakan</h3>
                     <p className="text-sm p-2 bg-red-50 dark:bg-red-900/30 rounded-md mt-1 text-red-700 dark:text-red-300">{sppd.catatanPenolakan}</p>
                </div>
            )}
            {reports.length > 0 && (
                 <div>
                     <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Laporan Hasil Perjalanan</h3>
                     <div className="mt-2 space-y-4">
                        {reports.map(report => {
                            const pelapor = allMembers.find(m => m.id === report.memberId);
                            return (
                                <div key={report.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Laporan dari: {pelapor?.namaLengkap}</p>
                                    <h4 className="font-semibold mt-2">Hasil Kegiatan:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{report.hasilKegiatan}</p>
                                </div>
                            )
                        })}
                     </div>
                 </div>
            )}
        </main>
        <footer className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {showRejectionInput ? (
                <div className="space-y-2">
                    <textarea value={rejectionNotes} onChange={e => setRejectionNotes(e.target.value)} placeholder="Tulis alasan penolakan..." rows={2} className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowRejectionInput(false)} className="text-sm font-semibold text-gray-600 dark:text-gray-300 px-3 py-1">Batal</button>
                        <button onClick={handleReject} disabled={isLoading || !rejectionNotes} className="px-3 py-1 bg-danger text-white rounded-md text-sm font-semibold disabled:opacity-50">Kirim Penolakan</button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-end">
                    {renderFooter()}
                </div>
            )}
        </footer>
      </div>
    </div>
  );
};

export default SppdDetailModal;