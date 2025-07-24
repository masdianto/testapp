import React, { useState, useEffect, useCallback } from 'react';
import { FinancialTransaction } from '../../types';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: FinancialTransaction) => Promise<boolean>;
  transactionToEdit: FinancialTransaction | null;
  isLoading: boolean;
}

const CATEGORIES: FinancialTransaction['category'][] = ['Gaji', 'Donasi', 'Transportasi', 'Akomodasi', 'Logistik', 'BBM', 'Operasional', 'Lainnya'];
const TYPES: FinancialTransaction['type'][] = ['Pemasukan', 'Pengeluaran'];

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, transactionToEdit, isLoading }) => {
  const getInitialState = useCallback((): Omit<FinancialTransaction, 'id'> => {
    return transactionToEdit || {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Operasional',
      type: 'Pengeluaran',
      amount: 0,
    };
  }, [transactionToEdit]);

  const [transaction, setTransaction] = useState(getInitialState);

  useEffect(() => {
    if (isOpen) {
      setTransaction(getInitialState());
    }
  }, [isOpen, getInitialState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
        ...transaction,
        id: transactionToEdit ? transactionToEdit.id : `fin-${crypto.randomUUID()}`,
    } as FinancialTransaction);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {transactionToEdit ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
              <input type="text" name="description" value={transaction.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp)</label>
                <input type="number" name="amount" value={transaction.amount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700" />
              </div>
               <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                <input type="date" name="date" value={transaction.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
                    <select name="type" value={transaction.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700">
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                    <select name="category" value={transaction.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              Batal
            </button>
            <button type="submit" disabled={isLoading || !transaction.description || transaction.amount <= 0} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;