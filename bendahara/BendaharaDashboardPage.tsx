import React, { useState, useMemo } from 'react';
import { FinancialTransaction, SPPD, ReimbursementRequest, Member } from '../../types';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import { formatCurrency, formatDateRelative } from '../../utils';
import WalletIcon from '../icons/WalletIcon';
import ArrowTrendingUpIcon from '../icons/ArrowTrendingUpIcon';
import ArrowTrendingDownIcon from '../icons/ArrowTrendingDownIcon';
import { getSppdStatusClass } from '../../utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface BendaharaDashboardPageProps {
  bendahara: Member;
  transactions: FinancialTransaction[];
  sppds: SPPD[];
  reimbursementRequests: ReimbursementRequest[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: FinancialTransaction) => void;
  onDeleteTransaction: (id: string, description: string) => void;
  onUpdateReimbursementRequest: (requestId: string, updates: Partial<ReimbursementRequest>) => Promise<boolean>;
}

type DashboardTab = 'summary' | 'transactions' | 'sppd' | 'reimbursement';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center gap-3">
    <div className={`p-2.5 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  </div>
);

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) return <p className="text-center text-sm text-gray-500 py-8">Tidak ada data pengeluaran.</p>;
    
    let cumulative = 0;
    const gradients = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = cumulative;
        const end = cumulative + percentage;
        cumulative = end;
        return `${item.color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div 
                className="w-24 h-24 rounded-full flex-shrink-0"
                style={{ background: `conic-gradient(${gradients})` }}
            />
            <ul className="text-xs space-y-1.5 flex-grow w-full">
                {data.map(item => (
                    <li key={item.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(item.value)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const BendaharaDashboardPage: React.FC<BendaharaDashboardPageProps> = ({ bendahara, transactions, sppds, reimbursementRequests, onAddTransaction, onEditTransaction, onDeleteTransaction, onUpdateReimbursementRequest }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('summary');
  const [searchTerm, setSearchTerm] = useState('');

  const { income, expense, balance, expenseByCategory } = useMemo(() => {
    let income = 0, expense = 0;
    const expenseByCategory: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'Pemasukan') {
        income += t.amount;
      } else {
        expense += t.amount;
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      }
    });
    return { income, expense, balance: income - expense, expenseByCategory };
  }, [transactions]);
  
  const expenseChartData = Object.entries(expenseByCategory).map(([label, value], i) => ({
      label,
      value,
      color: ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#14b8a6', '#f59e0b', '#6b7280'][i % 7]
  })).sort((a,b) => b.value - a.value);

  const filteredTransactions = useMemo(() => 
    transactions.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [transactions, searchTerm]);

  const approvedReimbursements = useMemo(() => 
    reimbursementRequests.filter(r => r.status === 'Disetujui'), 
    [reimbursementRequests]
  );

  const handlePayReimbursement = (id: string) => {
    onUpdateReimbursementRequest(id, {
        status: 'Dibayar',
        paidById: bendahara.id,
        paidDate: new Date().toISOString()
    });
  };
    
  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex-col p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Dasbor Keuangan</h1>
            <button onClick={onAddTransaction} className="p-2 bg-primary text-white rounded-full shadow-md hover:bg-orange-600">
                <PlusIcon className="w-5 h-5"/>
            </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
            <button onClick={() => setActiveTab('summary')} className={`px-2 py-1.5 text-xs font-semibold rounded-md ${activeTab === 'summary' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}>Ringkasan</button>
            <button onClick={() => setActiveTab('transactions')} className={`px-2 py-1.5 text-xs font-semibold rounded-md ${activeTab === 'transactions' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}>Transaksi</button>
            <button onClick={() => setActiveTab('sppd')} className={`px-2 py-1.5 text-xs font-semibold rounded-md ${activeTab === 'sppd' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}>SPPD</button>
            <button onClick={() => setActiveTab('reimbursement')} className={`px-2 py-1.5 text-xs font-semibold rounded-md ${activeTab === 'reimbursement' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}>Reimburse</button>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {activeTab === 'summary' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 gap-4">
                <StatCard title="Total Pemasukan" value={formatCurrency(income)} icon={<ArrowTrendingUpIcon className="w-5 h-5 text-white"/>} color="bg-green-500" />
                <StatCard title="Total Pengeluaran" value={formatCurrency(expense)} icon={<ArrowTrendingDownIcon className="w-5 h-5 text-white"/>} color="bg-red-500" />
                <StatCard title="Saldo Saat Ini" value={formatCurrency(balance)} icon={<WalletIcon className="w-5 h-5 text-white"/>} color="bg-blue-500" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Pengeluaran per Kategori</h3>
                <DonutChart data={expenseChartData} />
            </div>
          </div>
        )}
        {activeTab === 'transactions' && (
          <div className="space-y-3 animate-fade-in">
            <input type="text" placeholder="Cari transaksi..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            {filteredTransactions.map(t => (
                <div key={t.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`font-bold ${t.type === 'Pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(t.amount)}</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">{t.description}</p>
                        </div>
                         <div className="flex items-center gap-1">
                            <button onClick={() => onEditTransaction(t)} className="p-1.5 rounded-full text-gray-500 hover:text-yellow-600"><EditIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDeleteTransaction(t.id, t.description)} className="p-1.5 rounded-full text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                         </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="font-semibold text-primary">{t.category}</span>
                        <span className="text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            ))}
          </div>
        )}
        {activeTab === 'sppd' && (
            <div className="space-y-3 animate-fade-in">
                {sppds.map(s => (
                    <div key={s.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{s.untuk}</p>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getSppdStatusClass(s.status)}`}>{s.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.nomorSurat}</p>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1 text-sm">
                            <div className="flex justify-between"><span>Anggaran:</span> <span className="font-semibold">{formatCurrency(s.anggaranTotal || 0)}</span></div>
                            <div className="flex justify-between"><span>Realisasi:</span> <span className="font-semibold">{formatCurrency(s.realisasiBiaya || 0)}</span></div>
                            <div className="flex justify-between font-bold text-primary dark:text-orange-400"><span>Sisa:</span> <span>{formatCurrency((s.anggaranTotal || 0) - (s.realisasiBiaya || 0))}</span></div>
                        </div>
                    </div>
                ))}
            </div>
        )}
         {activeTab === 'reimbursement' && (
            <div className="space-y-3 animate-fade-in">
                {approvedReimbursements.length > 0 ? approvedReimbursements.map(r => (
                    <div key={r.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{r.description}</p>
                            <p className="font-bold text-lg text-primary">{formatCurrency(r.amount)}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Diajukan oleh: {r.requesterName}</p>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <a href={r.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">Lihat Bukti</a>
                            <button onClick={() => handlePayReimbursement(r.id)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                <CheckCircleIcon className="w-4 h-4" />
                                Tandai Dibayar
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>Tidak ada pengajuan reimbursement yang perlu dibayar.</p>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default BendaharaDashboardPage;