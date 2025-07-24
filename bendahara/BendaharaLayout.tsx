import React, { useState } from 'react';
import { Member, FinancialTransaction, SPPD, RoleDefinition, SectionDefinition, JabatanDefinition, ReimbursementRequest } from '../../types';
import BendaharaBottomNavBar from './BendaharaBottomNavBar';
import BendaharaDashboardPage from './BendaharaDashboardPage';
import OperatorProfilePage from '../operator/OperatorProfilePage';
import MemberModal from '../MemberModal';
import TransactionModal from './TransactionModal';
import { useConfirm } from '../../contexts/ConfirmContext';

interface BendaharaLayoutProps {
  bendahara: Member;
  transactions: FinancialTransaction[];
  sppds: SPPD[];
  reimbursementRequests: ReimbursementRequest[];
  roles: RoleDefinition[];
  sections: SectionDefinition[];
  jabatans: JabatanDefinition[];
  onLogout: () => void;
  onSaveMember: (member: Member) => Promise<boolean>;
  onSaveTransaction: (transaction: FinancialTransaction) => Promise<boolean>;
  onDeleteTransaction: (id: string, description: string) => void;
  onUpdateReimbursementRequest: (requestId: string, updates: Partial<ReimbursementRequest>) => Promise<boolean>;
  isLoading: boolean;
  isSimulating: boolean;
  onEndSimulation: () => void;
}

type BendaharaPage = 'dashboard' | 'profile';

const BendaharaLayout: React.FC<BendaharaLayoutProps> = ({
  bendahara,
  transactions,
  sppds,
  reimbursementRequests,
  roles,
  sections,
  jabatans,
  onLogout,
  onSaveMember,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateReimbursementRequest,
  isLoading,
  isSimulating,
  onEndSimulation
}) => {
  const [activePage, setActivePage] = useState<BendaharaPage>('dashboard');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<FinancialTransaction | null>(null);

  const handleEditProfile = () => {
    setProfileModalOpen(true);
  };

  const handleSaveProfileAndClose = async (editedMember: Member): Promise<boolean> => {
    const success = await onSaveMember(editedMember);
    if (success) {
      setProfileModalOpen(false);
    }
    return success;
  };
  
  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setTransactionModalOpen(true);
  };
  
  const handleEditTransaction = (transaction: FinancialTransaction) => {
    setTransactionToEdit(transaction);
    setTransactionModalOpen(true);
  };

  const handleSaveTransactionAndClose = async (transaction: FinancialTransaction) => {
    const success = await onSaveTransaction(transaction);
    if (success) {
        setTransactionModalOpen(false);
    }
    return success;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
            <BendaharaDashboardPage 
                bendahara={bendahara}
                transactions={transactions} 
                sppds={sppds}
                reimbursementRequests={reimbursementRequests}
                onAddTransaction={handleAddTransaction}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={onDeleteTransaction}
                onUpdateReimbursementRequest={onUpdateReimbursementRequest}
            />
        );
      case 'profile':
        return <OperatorProfilePage operator={bendahara} onEdit={handleEditProfile} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        {isSimulating && (
            <div className="absolute top-4 w-full max-w-[400px] text-center pointer-events-none">
                <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-md text-sm font-bold shadow-lg animate-fade-in-down z-50">
                    MODE SIMULASI
                </div>
            </div>
        )}
        <div className="relative w-full max-w-[400px] h-[85vh] max-h-[844px] bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
          <main className="w-full flex-grow overflow-y-auto">
            {renderPage()}
          </main>
          <BendaharaBottomNavBar activePage={activePage} onNavigate={setActivePage} />
        </div>
        <button
          onClick={isSimulating ? onEndSimulation : onLogout}
          className="absolute top-4 right-4 bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-md hover:bg-white/30 transition-colors"
        >
          {isSimulating ? 'Keluar Simulasi' : 'Logout'}
        </button>
      </div>

      {/* Modals */}
      <MemberModal
          isOpen={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onSave={handleSaveProfileAndClose}
          memberToEdit={bendahara}
          loggedInUser={bendahara}
          roles={roles}
          sections={sections}
          jabatans={jabatans}
          isLoading={isLoading}
      />
      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleSaveTransactionAndClose}
        transactionToEdit={transactionToEdit}
        isLoading={isLoading}
      />
    </>
  );
};

export default BendaharaLayout;