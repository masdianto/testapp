import React, { useState } from 'react';
import { Member, Complaint, EmergencyDirective, SPPD, MemberStatus } from '../../types';
import UsersIcon from '../icons/UsersIcon';
import ClipboardDocumentListIcon from '../icons/ClipboardDocumentListIcon';
import ChatBubbleLeftEllipsisIcon from '../icons/ChatBubbleLeftEllipsisIcon';
import PaperAirplaneIcon from '../icons/PaperAirplaneIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';

// Props interface
interface PimpinanDashboardPageProps {
  members: Member[];
  complaints: Complaint[];
  directives: EmergencyDirective[];
  sppds: SPPD[];
  onNavigate: (page: 'pimpinan_complaints' | 'sppd') => void;
}

// Reusable components for the dashboard
const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  </div>
);

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[], title: string }> = ({ data, title }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-full flex flex-col">
          <h3 className="font-semibold text-center text-gray-900 dark:text-white mb-2">{title}</h3>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-center text-sm text-gray-500">Tidak ada data</p>
          </div>
        </div>
      );
    }
    
    let cumulative = 0;
    const gradients = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = cumulative;
        const end = cumulative + percentage;
        cumulative = end;
        return `${item.color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-center text-gray-900 dark:text-white mb-2">{title}</h3>
            <div className="flex justify-center my-2">
                <div 
                    className="w-20 h-20 rounded-full"
                    style={{ background: `conic-gradient(${gradients})` }}
                ></div>
            </div>
            <ul className="text-xs space-y-1 mt-3">
                {data.map(item => (
                    <li key={item.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                           {item.value} ({((item.value/total)*100).toFixed(0)}%)
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const PimpinanDashboardPage: React.FC<PimpinanDashboardPageProps> = ({ members, complaints, directives, sppds, onNavigate }) => {
    // Stat calculations
    const totalMembers = members.length;
    const activeDirectives = directives.filter(d => d.status !== 'Selesai').length;
    const processingComplaints = complaints.filter(c => c.status !== 'Ditutup').length;
    const sppdForApproval = sppds.filter(s => s.status === 'Menunggu Persetujuan').length;
    
    const [activePriorityTab, setActivePriorityTab] = useState<'complaints' | 'sppd'>('complaints');
    const [isDistributionOpen, setIsDistributionOpen] = useState(false);

    // Chart data calculations
    const memberStatusData = [
        { label: 'Aktif', value: members.filter(m => m.status === MemberStatus.AKTIF).length, color: '#22c55e' },
        { label: 'Tidak Aktif', value: members.filter(m => m.status === MemberStatus.TIDAK_AKTIF).length, color: '#ef4444' }
    ];

    const directiveStatusData = [
        { label: 'Baru', value: directives.filter(d => d.status === 'Baru').length, color: '#3b82f6' },
        { label: 'Dikerjakan', value: directives.filter(d => d.status === 'Dikerjakan').length, color: '#a855f7' },
        { label: 'Selesai', value: directives.filter(d => d.status === 'Selesai').length, color: '#6b7280' }
    ];

    const membersPerSectionData = members.reduce((acc, member) => {
        acc[member.seksi] = (acc[member.seksi] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const barChartData = Object.entries(membersPerSectionData)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
        
    const maxValueForBarChart = Math.max(...barChartData.map(item => item.value), 1);

    // Priority list data
    const complaintsToDispose = complaints.filter(c => c.currentOwner === 'pimpinan' && c.status === 'Menunggu Disposisi Pimpinan');
    const sppdsToApprove = sppds.filter(s => s.status === 'Menunggu Persetujuan');
    
    const renderPriorityContent = () => {
        const items = activePriorityTab === 'complaints' ? complaintsToDispose : sppdsToApprove;
        const emptyMessage = activePriorityTab === 'complaints' ? "Tidak ada pengaduan yang perlu disposisi." : "Tidak ada SPPD yang perlu persetujuan.";
        const navigationPage = activePriorityTab === 'complaints' ? 'pimpinan_complaints' : 'sppd';

        return (
            <>
                {items.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.slice(0, 3).map(item => {
                            const isComplaint = 'namaPelapor' in item;
                            return (
                                <li key={item.id} className="p-3 text-sm">
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{isComplaint ? item.jenisLaporan : item.untuk}</p>
                                    <p className="text-xs text-gray-500">{isComplaint ? `Dari: ${item.namaPelapor}` : item.nomorSurat}</p>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                )}
                <footer className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                    <button onClick={() => onNavigate(navigationPage)} className="w-full text-center text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1">
                        Lihat Semua <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </footer>
            </>
        );
    };

    return (
        <div className="p-4 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Anggota" value={totalMembers} icon={<UsersIcon className="w-6 h-6 text-white"/>} color="bg-blue-500" />
                <StatCard title="Perintah Aktif" value={activeDirectives} icon={<ClipboardDocumentListIcon className="w-6 h-6 text-white"/>} color="bg-purple-500" />
                <StatCard title="Pengaduan Proses" value={processingComplaints} icon={<ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-white"/>} color="bg-yellow-500" />
                <StatCard title="SPPD Approval" value={sppdForApproval} icon={<PaperAirplaneIcon className="w-6 h-6 text-white"/>} color="bg-green-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
                <DonutChart title="Status Anggota" data={memberStatusData} />
                <DonutChart title="Status Perintah Tugas" data={directiveStatusData} />
            </div>
            
             {/* Collapsible Bar Chart Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <button
                    onClick={() => setIsDistributionOpen(prev => !prev)}
                    className="w-full flex items-center justify-between p-4 text-left"
                    aria-expanded={isDistributionOpen}
                >
                    <h3 className="font-semibold text-gray-900 dark:text-white">Distribusi Anggota per Seksi</h3>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDistributionOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDistributionOpen && (
                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                        <div className="space-y-3 pt-4">
                            {barChartData.length > 0 ? barChartData.map(item => (
                                <div key={item.label} className="grid grid-cols-4 gap-2 items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 col-span-1 truncate">{item.label}</span>
                                    <div className="col-span-3 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                                        <div
                                            className="bg-primary h-4 rounded-full"
                                            style={{ width: `${(item.value / maxValueForBarChart) * 100}%` }}
                                        ></div>
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white mix-blend-difference">{item.value}</span>
                                    </div>
                                </div>
                            )) : <p className="text-center text-sm text-gray-500 py-4">Tidak ada data</p>}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Priority Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <header className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActivePriorityTab('complaints')}
                            className={`w-full text-center p-2 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activePriorityTab === 'complaints' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                        >
                            Pengaduan
                            {complaintsToDispose.length > 0 && (
                                <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">{complaintsToDispose.length}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setActivePriorityTab('sppd')}
                            className={`w-full text-center p-2 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activePriorityTab === 'sppd' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                        >
                            SPPD
                            {sppdsToApprove.length > 0 && (
                                <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">{sppdsToApprove.length}</span>
                            )}
                        </button>
                    </div>
                </header>
                {renderPriorityContent()}
            </div>
        </div>
    );
};

export default PimpinanDashboardPage;
