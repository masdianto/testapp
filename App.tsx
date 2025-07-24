import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Member, News, Complaint, TaskReport, EmergencyDirective, RoleDefinition, SectionDefinition, SPPD, SPPDReport, JabatanDefinition, FinancialTransaction, ReimbursementRequest } from './types';
import { INITIAL_MEMBERS, INITIAL_NEWS, INITIAL_COMPLAINTS, INITIAL_DIRECTIVES, INITIAL_ROLES, INITIAL_SECTIONS, INITIAL_SPPDS, INITIAL_SPPD_REPORTS, INITIAL_JABATAN, INITIAL_FINANCIAL_TRANSACTIONS, INITIAL_REIMBURSEMENT_REQUESTS } from './constants';
import ContactInfoPage from './components/ContactInfoPage';
import NotFoundPage from './components/NotFoundPage';
import MemberLayout from './components/MemberLayout';
import OperatorLayout from './components/operator/OperatorLayout';
import ComplaintModal from './components/ComplaintModal';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ConfirmProvider, useConfirm } from './contexts/ConfirmContext';
import LoginModal from './components/LoginModal';
import PublicLayout from './components/layouts/PublicLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import BendaharaLayout from './components/bendahara/BendaharaLayout';


// Custom hook for persisting state to localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const App: React.FC = () => (
    <ToastProvider>
        <ConfirmProvider>
            <AppContent />
        </ConfirmProvider>
    </ToastProvider>
);

const AppContent: React.FC = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('bnpb:members', INITIAL_MEMBERS);
  const [news, setNews] = useLocalStorage<News[]>('bnpb:news', INITIAL_NEWS);
  const [complaints, setComplaints] = useLocalStorage<Complaint[]>('bnpb:complaints', INITIAL_COMPLAINTS);
  const [directives, setDirectives] = useLocalStorage<EmergencyDirective[]>('bnpb:directives', INITIAL_DIRECTIVES);
  const [taskReports, setTaskReports] = useLocalStorage<TaskReport[]>('bnpb:taskReports', []);
  const [roles, setRoles] = useLocalStorage<RoleDefinition[]>('bnpb:roles', INITIAL_ROLES);
  const [sections, setSections] = useLocalStorage<SectionDefinition[]>('bnpb:sections', INITIAL_SECTIONS);
  const [jabatans, setJabatans] = useLocalStorage<JabatanDefinition[]>('bnpb:jabatans', INITIAL_JABATAN);
  const [sppds, setSppds] = useLocalStorage<SPPD[]>('bnpb:sppds', INITIAL_SPPDS);
  const [sppdReports, setSppdReports] = useLocalStorage<SPPDReport[]>('bnpb:sppdReports', INITIAL_SPPD_REPORTS);
  const [financialTransactions, setFinancialTransactions] = useLocalStorage<FinancialTransaction[]>('bnpb:financialTransactions', INITIAL_FINANCIAL_TRANSACTIONS);
  const [reimbursementRequests, setReimbursementRequests] = useLocalStorage<ReimbursementRequest[]>('bnpb:reimbursementRequests', INITIAL_REIMBURSEMENT_REQUESTS);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('bnpb:theme', 'system');
  const [loggedInUser, setLoggedInUser] = useLocalStorage<Member | null>('bnpb:loggedInUser', null);
  const [realLoggedInUser, setRealLoggedInUser] = useLocalStorage<Member | null>('bnpb:realLoggedInUser', null);
  const isSimulating = realLoggedInUser !== null;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [publicViewId, setPublicViewId] = useState<string | null>(null);

  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    const applyTheme = () => {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    
    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/member\/([\w-]+)\/?$/);
      if (match) {
        const member = members.find(m => m.id === match[1]);
        if (member) {
            setPublicViewId(match[1]);
        } else {
            const initialMember = INITIAL_MEMBERS.find(m => m.id === match[1]);
            setPublicViewId(initialMember ? match[1] : 'not_found');
        }
      } else {
        setPublicViewId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [members]);

  const handleSaveMember = useCallback(async (member: Member) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    
    setMembers(prevMembers => {
      const isEditing = prevMembers.some(m => m.id === member.id);
      if (isEditing) {
        return prevMembers.map(m => (m.id === member.id ? member : m));
      } else {
        return [member, ...prevMembers];
      }
    });

    // If the logged in user is editing their own profile, update the session data
    if(loggedInUser?.id === member.id) {
        setLoggedInUser(member);
    }
    
    setIsLoading(false);
    toast.success(members.some(m => m.id === member.id) ? 'Data anggota berhasil diperbarui.' : 'Anggota baru berhasil ditambahkan.');
    return true; // Indicate success for closing modal
  }, [members, loggedInUser, toast, setMembers, setLoggedInUser]);
  
  const handleLogin = useCallback(async (email: string) => {
    setIsLoading(true);
    setLoginError(null);
    await new Promise(res => setTimeout(res, 500));
    
    const member = members.find(m => m.email.toLowerCase() === email.toLowerCase());
    
    if (member) {
      setLoggedInUser(member);
      setShowLoginPage(false);
      toast.success(`Selamat datang, ${member.namaLengkap}!`);
    } else {
      setLoginError('Email tidak ditemukan atau salah.');
    }
    setIsLoading(false);
  }, [members, toast, setLoggedInUser]);

  const handleLogout = useCallback(() => {
    setLoggedInUser(null);
    setRealLoggedInUser(null); // Also clear simulation state on logout
  }, [setLoggedInUser, setRealLoggedInUser]);
  
  const handleStartSimulation = useCallback((memberToSimulate: Member) => {
    if (loggedInUser) {
        setRealLoggedInUser(loggedInUser);
        setLoggedInUser(memberToSimulate);
        toast.success(`Memulai simulasi sebagai ${memberToSimulate.namaLengkap}.`);
    }
  }, [loggedInUser, setLoggedInUser, setRealLoggedInUser, toast]);

  const handleEndSimulation = useCallback(() => {
    if (realLoggedInUser) {
        setLoggedInUser(realLoggedInUser);
        setRealLoggedInUser(null);
        toast.success('Mode simulasi telah berakhir.');
    }
  }, [realLoggedInUser, setLoggedInUser, setRealLoggedInUser, toast]);


  const handleSetTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  }, [setTheme]);

  const handleExportData = useCallback(() => {
    const dataToExport = { members, news, complaints, directives, taskReports, roles, sections, sppds, sppdReports, jabatans, financialTransactions, reimbursementRequests };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `bnpb_backup_data_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    toast.success("Seluruh data aplikasi berhasil diekspor.");
  }, [members, news, complaints, directives, taskReports, roles, sections, sppds, sppdReports, jabatans, financialTransactions, reimbursementRequests, toast]);

  // News & Complaint Handlers
  const handleSaveNews = useCallback(async (newsItem: News) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = news.some(n => n.id === newsItem.id);
    setNews(prev => {
      if (isEditing) {
        return prev.map(n => n.id === newsItem.id ? newsItem : n);
      }
      return [newsItem, ...prev];
    });
    setIsLoading(false);
    toast.success(isEditing ? 'Berita berhasil diperbarui.' : 'Berita berhasil dipublikasikan.');
  }, [news, toast, setNews]);

  const handleDeleteNews = useCallback(async (id: string, title: string) => {
    const isConfirmed = await confirm.show(`Apakah Anda yakin ingin menghapus berita "${title}"?`);
    if (isConfirmed) {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 500));
      setNews(prev => prev.filter(n => n.id !== id));
      setIsLoading(false);
      toast.success(`Berita "${title}" telah dihapus.`);
    }
  }, [confirm, toast, setNews]);

  const handleAddComplaint = useCallback(async (complaintData: Omit<Complaint, 'id' | 'status' | 'timestamp' | 'currentOwner'>) => {
    if(!complaintData.namaPelapor.trim() || !complaintData.content.trim()) {
        toast.error("Nama Pelapor dan Isi Laporan tidak boleh kosong.");
        return;
    }
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
      const newComplaint: Complaint = { 
        ...complaintData,
        id: `comp-${crypto.randomUUID()}`, 
        status: 'Baru', 
        timestamp: new Date().toISOString(),
        currentOwner: 'operator'
      };
      setComplaints(prev => [newComplaint, ...prev].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setIsLoading(false);
      setIsComplaintModalOpen(false);
      toast.success('Pengaduan Anda telah terkirim. Terima kasih atas laporan Anda.');
  }, [toast, setComplaints]);

  const handleUpdateComplaint = useCallback(async (complaintId: string, updates: Partial<Complaint>) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 300));
    setComplaints(prev => prev.map(c => 
        c.id === complaintId 
        ? { ...c, ...updates } 
        : c
    ));
    setIsLoading(false);
    toast.success("Status pengaduan berhasil diperbarui.");
    return true;
  }, [setComplaints, toast]);
  
    const handleAcknowledgeTask = useCallback((directiveId: string) => {
      if (!loggedInUser) return;
      const reportId = `${loggedInUser.id}-${directiveId}`;
      if (!taskReports.some(r => r.id === reportId)) {
          const newReport: TaskReport = { id: reportId, memberId: loggedInUser.id, directiveId, status: 'Dilihat' };
          setTaskReports(prev => [...prev, newReport]);
          toast.success('Tugas telah ditandai sebagai "Dilihat".');
      }
    }, [loggedInUser, taskReports, toast, setTaskReports]);

    const handleSaveTaskReport = useCallback(async (directiveId: string, reportText: string, reportImageUrl?: string) => {
      if (!loggedInUser) return;
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 500)); 
      const reportId = `${loggedInUser.id}-${directiveId}`;
      setTaskReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Dilaporkan', reportText, reportImageUrl, reportedAt: new Date().toISOString() } : r ));
      setIsLoading(false);
      toast.success('Laporan tugas berhasil dikirim.');
    }, [loggedInUser, toast, setTaskReports]);

  const handleSaveDirective = useCallback(async (directive: EmergencyDirective) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = directives.some(d => d.id === directive.id);
    
    setDirectives(prev => {
        if (isEditing) { return prev.map(d => d.id === directive.id ? directive : d); }
        return [{...directive, id: `dir-${crypto.randomUUID()}`, createdBy: loggedInUser!.id, date: new Date().toISOString() }, ...prev];
    });

    setIsLoading(false);
    toast.success(isEditing ? 'Perintah berhasil diperbarui.' : 'Perintah baru berhasil dibuat.');
  }, [directives, loggedInUser, toast, setDirectives]);

  const handleDeleteDirective = useCallback(async (id: string, title: string) => {
    const isConfirmed = await confirm.show(`Apakah Anda yakin ingin menghapus perintah "${title}"?`);
    if (isConfirmed) {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 500));
      setDirectives(prev => prev.filter(d => d.id !== id));
      setIsLoading(false);
      toast.success(`Perintah "${title}" telah dihapus.`);
    }
  }, [confirm, toast, setDirectives]);
  
  // Handlers for Admin Role Management
   const handleDeleteMember = useCallback(async (id: string, name: string) => {
    const isConfirmed = await confirm.show(`Apakah Anda yakin ingin menghapus anggota "${name}"?`, 'Tindakan ini tidak dapat diurungkan.');
    if (isConfirmed) {
      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success(`Anggota "${name}" berhasil dihapus.`);
      return true;
    }
    return false;
  }, [confirm, toast, setMembers]);

  const handleUpdateMemberAssignment = useCallback((memberId: string, assignment: { role: string; seksi: string; jabatan: string }) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...assignment } : m));
    toast.success("Penetapan jabatan anggota berhasil diperbarui.");
  }, [setMembers, toast]);

  const handleSaveRole = useCallback(async (role: RoleDefinition) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = roles.some(r => r.id === role.id);

    setRoles(prev => {
        if (isEditing) {
            const oldRole = prev.find(r => r.id === role.id);
            if (oldRole && oldRole.name !== role.name) {
                setMembers(mems => mems.map(m => m.role === oldRole.name ? { ...m, role: role.name } : m));
            }
            return prev.map(r => r.id === role.id ? role : r);
        }
        return [...prev, role];
    });
    setIsLoading(false);
    toast.success(isEditing ? `Role "${role.name}" berhasil diperbarui.` : `Role "${role.name}" berhasil ditambahkan.`);
    return true;
  }, [roles, setRoles, setMembers, toast]);

  const handleDeleteRole = useCallback(async (roleId: string, roleName:string) => {
    if (members.some(m => m.role === roleName)) {
        toast.error(`Tidak dapat menghapus role "${roleName}" karena masih digunakan oleh anggota.`);
        return;
    }
    const isConfirmed = await confirm.show(`Apakah Anda yakin ingin menghapus role "${roleName}"?`);
    if (isConfirmed) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast.success(`Role "${roleName}" telah dihapus.`);
    }
  }, [members, confirm, toast, setRoles]);

    const handleSaveSection = useCallback(async (section: SectionDefinition) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = sections.some(s => s.id === section.id);

    setSections(prev => {
        if (isEditing) {
            const oldSection = prev.find(s => s.id === section.id);
            if (oldSection && oldSection.name !== section.name) {
                // Update members who belong to this section
                setMembers(mems => mems.map(m => m.seksi === oldSection.name ? { ...m, seksi: section.name } : m));
            }
            return prev.map(s => s.id === section.id ? section : s);
        }
        return [...prev, section];
    });
    setIsLoading(false);
    toast.success(isEditing ? `Seksi "${section.name}" berhasil diperbarui.` : `Seksi "${section.name}" berhasil ditambahkan.`);
    return true;
  }, [sections, setSections, setMembers, toast]);

  const handleDeleteSection = useCallback(async (sectionId: string, sectionName: string) => {
    if (members.some(m => m.seksi === sectionName)) {
        toast.error(`Tidak dapat menghapus seksi "${sectionName}" karena masih digunakan oleh anggota.`);
        return;
    }
    const isConfirmed = await confirm.show(`Apakah Anda yakin ingin menghapus seksi "${sectionName}"?`);
    if (isConfirmed) {
      setSections(prev => prev.filter(s => s.id !== sectionId));
      toast.success(`Seksi "${sectionName}" telah dihapus.`);
    }
  }, [members, confirm, toast, setSections]);
  
  const handleSaveJabatan = useCallback(async (jabatan: JabatanDefinition) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = jabatans.some(j => j.id === jabatan.id);

    setJabatans(prev => {
      if (isEditing) {
        const oldJabatan = prev.find(j => j.id === jabatan.id);
        if (oldJabatan && oldJabatan.name !== jabatan.name) {
          // Update members with this jabatan
          setMembers(mems => mems.map(m => m.jabatan === oldJabatan.name ? { ...m, jabatan: jabatan.name } : m));
        }
        return prev.map(j => j.id === jabatan.id ? jabatan : j);
      }
      return [...prev, jabatan];
    });
    setIsLoading(false);
    toast.success(isEditing ? `Jabatan "${jabatan.name}" berhasil diperbarui.` : `Jabatan "${jabatan.name}" berhasil ditambahkan.`);
    return true;
  }, [jabatans, setJabatans, setMembers, toast]);

  const handleDeleteJabatan = useCallback(async (jabatanId: string, jabatanName: string) => {
    if (members.some(m => m.jabatan === jabatanName)) {
      toast.error(`Tidak dapat menghapus jabatan "${jabatanName}" karena masih digunakan oleh anggota.`);
      return;
    }
    const isConfirmed = await confirm.show(`Apakah Anda yakin ingin menghapus jabatan "${jabatanName}"?`);
    if (isConfirmed) {
      setJabatans(prev => prev.filter(j => j.id !== jabatanId));
      toast.success(`Jabatan "${jabatanName}" telah dihapus.`);
    }
  }, [members, confirm, toast, setJabatans]);

  // SPPD Handlers
  const handleSaveSppd = useCallback(async (sppd: SPPD) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = sppds.some(s => s.id === sppd.id);
    
    setSppds(prev => {
        if (isEditing) { return prev.map(s => s.id === sppd.id ? sppd : s); }
        const newSppd: SPPD = {
            ...sppd,
            id: `sppd-${crypto.randomUUID()}`,
            pembuatId: loggedInUser!.id,
            dibuatTanggal: new Date().toISOString(),
            status: 'Menunggu Persetujuan'
        };
        return [newSppd, ...prev];
    });

    setIsLoading(false);
    toast.success(isEditing ? 'SPPD berhasil diperbarui.' : 'SPPD baru berhasil dibuat.');
    return true;
  }, [sppds, loggedInUser, toast, setSppds]);

  const handleUpdateSppd = useCallback(async (sppdId: string, updates: Partial<SPPD>) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 300));
    setSppds(prev => prev.map(s => 
        s.id === sppdId 
        ? { ...s, ...updates } 
        : s
    ));
    setIsLoading(false);
    toast.success("Status SPPD berhasil diperbarui.");
    return true;
  }, [setSppds, toast]);

  const handleSaveSppdReport = useCallback(async (report: Omit<SPPDReport, 'id'|'dikirimTanggal'>) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const reportId = `${report.sppdId}-${report.memberId}`;
    const newReport: SPPDReport = {
        ...report,
        id: reportId,
        dikirimTanggal: new Date().toISOString(),
    };
    
    setSppdReports(prev => {
        const isEditing = prev.some(r => r.id === reportId);
        if (isEditing) { return prev.map(r => r.id === reportId ? newReport : r); }
        return [...prev, newReport];
    });

    await handleUpdateSppd(report.sppdId, { status: 'Laporan Diterima' });

    setIsLoading(false);
    toast.success('Laporan SPPD berhasil dikirim.');
    return true;
  }, [setSppdReports, handleUpdateSppd, toast]);

  // Financial Handlers
  const handleSaveFinancialTransaction = useCallback(async (transaction: FinancialTransaction) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const isEditing = financialTransactions.some(t => t.id === transaction.id);
    
    setFinancialTransactions(prev => {
      const sorted = (arr: FinancialTransaction[]) => arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (isEditing) {
        return sorted(prev.map(t => t.id === transaction.id ? transaction : t));
      }
      return sorted([transaction, ...prev]);
    });
    
    // Update SPPD realization if needed
    if (transaction.description.includes('SPPD')) {
      const sppdMatch = sppds.find(s => transaction.description.includes(s.nomorSurat));
      if (sppdMatch) {
          await handleUpdateSppd(sppdMatch.id, { realisasiBiaya: transaction.amount });
      }
    }

    setIsLoading(false);
    toast.success(isEditing ? 'Transaksi berhasil diperbarui.' : 'Transaksi baru berhasil dicatat.');
    return true;
  }, [financialTransactions, sppds, toast, setFinancialTransactions, handleUpdateSppd]);
  
  const handleDeleteFinancialTransaction = useCallback(async (id: string, description: string) => {
    const isConfirmed = await confirm.show(`Yakin ingin menghapus transaksi "${description}"?`);
    if (isConfirmed) {
      setFinancialTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaksi telah dihapus.');
    }
  }, [confirm, toast, setFinancialTransactions]);

  // Reimbursement Handlers
  const handleSaveReimbursementRequest = useCallback(async (requestData: Omit<ReimbursementRequest, 'id' | 'requesterId' | 'requesterName' | 'date' | 'status'>) => {
      if (!loggedInUser) return false;
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 500));
      const newRequest: ReimbursementRequest = {
        ...requestData,
        id: `reimburse-${crypto.randomUUID()}`,
        requesterId: loggedInUser.id,
        requesterName: loggedInUser.namaLengkap,
        date: new Date().toISOString(),
        status: 'Menunggu Persetujuan',
      };
      setReimbursementRequests(prev => [newRequest, ...prev]);
      setIsLoading(false);
      toast.success('Pengajuan reimbursement berhasil dikirim.');
      return true;
  }, [loggedInUser, setReimbursementRequests, toast]);

  const handleUpdateReimbursementRequest = useCallback(async (requestId: string, updates: Partial<ReimbursementRequest>) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 300));
    
    let updatedRequest: ReimbursementRequest | undefined;
    setReimbursementRequests(prev => prev.map(r => {
        if (r.id === requestId) {
            updatedRequest = { ...r, ...updates };
            return updatedRequest;
        }
        return r;
    }));

    // If Bendahara pays, create a financial transaction
    if (updates.status === 'Dibayar' && loggedInUser?.role === 'Bendahara' && updatedRequest) {
        const newTransaction: FinancialTransaction = {
            id: `fin-reimburse-${updatedRequest.id}`,
            date: new Date().toISOString(),
            description: `Pembayaran reimbursement untuk ${updatedRequest.requesterName}: ${updatedRequest.description}`,
            category: 'Reimbursement',
            type: 'Pengeluaran',
            amount: updatedRequest.amount,
        };
        await handleSaveFinancialTransaction(newTransaction);
    }
    
    setIsLoading(false);
    toast.success("Status reimbursement berhasil diperbarui.");
    return true;
  }, [loggedInUser, setReimbursementRequests, handleSaveFinancialTransaction, toast]);


  // ---- RENDER LOGIC ----

  if (publicViewId) {
    let memberToShow = members.find(m => m.id === publicViewId) || INITIAL_MEMBERS.find(m => m.id === publicViewId);
    if (publicViewId === 'not_found' || !memberToShow) return <NotFoundPage />;
    return <ContactInfoPage member={memberToShow} />;
  }
  
  if (!loggedInUser) {
    if (showLoginPage) {
        return (
            <LoginModal 
                onClose={() => setShowLoginPage(false)}
                onLogin={handleLogin}
                isLoading={isLoading}
                error={loginError}
            />
        );
    }
    return (
        <>
            <PublicLayout 
                members={members} 
                news={news}
                directives={directives}
                onAddComplaint={() => setIsComplaintModalOpen(true)}
                onShowLogin={() => { setShowLoginPage(true); setLoginError(null); }}
            />
            <ComplaintModal isOpen={isComplaintModalOpen} onClose={() => setIsComplaintModalOpen(false)} onSave={handleAddComplaint} isLoading={isLoading} />
        </>
    );
  }

  // --- Logged In Views ---
  if (loggedInUser.role === 'Admin') {
    return (
      <SuperAdminLayout
        user={loggedInUser}
        members={members}
        news={news}
        complaints={complaints}
        roles={roles}
        sections={sections}
        jabatans={jabatans}
        onLogout={handleLogout}
        onSaveMember={handleSaveMember}
        onDeleteMember={handleDeleteMember}
        onSaveNews={handleSaveNews}
        onDeleteNews={handleDeleteNews}
        onUpdateComplaint={handleUpdateComplaint}
        onUpdateMemberAssignment={handleUpdateMemberAssignment}
        onSaveRole={handleSaveRole}
        onDeleteRole={handleDeleteRole}
        onSaveSection={handleSaveSection}
        onDeleteSection={handleDeleteSection}
        onSaveJabatan={handleSaveJabatan}
        onDeleteJabatan={handleDeleteJabatan}
        onExportData={handleExportData}
        currentTheme={theme}
        onSetTheme={handleSetTheme}
        isLoading={isLoading}
        onStartSimulation={handleStartSimulation}
      />
    );
  }
  
  if (loggedInUser.role === 'Bendahara') {
    return (
      <BendaharaLayout
        bendahara={loggedInUser}
        transactions={financialTransactions}
        sppds={sppds}
        reimbursementRequests={reimbursementRequests}
        onLogout={handleLogout}
        onSaveMember={handleSaveMember}
        onSaveTransaction={handleSaveFinancialTransaction}
        onDeleteTransaction={handleDeleteFinancialTransaction}
        onUpdateReimbursementRequest={handleUpdateReimbursementRequest}
        roles={roles}
        sections={sections}
        jabatans={jabatans}
        isLoading={isLoading}
        isSimulating={isSimulating}
        onEndSimulation={handleEndSimulation}
      />
    );
  }
  
  const memberLayoutProps = {
    member: loggedInUser, 
    allMembers: members,
    news: news,
    complaints: complaints,
    directives: directives,
    taskReports: taskReports,
    roles: roles,
    sections: sections,
    jabatans: jabatans,
    onLogout: handleLogout,
    onSaveMember: handleSaveMember,
    onAcknowledgeTask: handleAcknowledgeTask,
    onSaveTaskReport: handleSaveTaskReport,
    onSaveDirective: handleSaveDirective,
    onDeleteDirective: handleDeleteDirective,
    isLoading: isLoading,
    isSimulating: isSimulating,
    onEndSimulation: handleEndSimulation,
    onUpdateComplaint: handleUpdateComplaint,
    // SPPD Props
    sppds,
    sppdReports,
    onSaveSppd: handleSaveSppd,
    onUpdateSppd: handleUpdateSppd,
    onSaveSppdReport: handleSaveSppdReport,
    // Reimbursement Props
    reimbursementRequests,
    onSaveReimbursementRequest: handleSaveReimbursementRequest,
    onUpdateReimbursementRequest: handleUpdateReimbursementRequest,
  };


  if (loggedInUser.role === 'Pimpinan') {
    return (
      <MemberLayout
        {...memberLayoutProps}
        onStartSimulation={handleStartSimulation}
      />
    );
  }
  
  if (loggedInUser.role === 'Operator') {
      return (
          <OperatorLayout
              operator={loggedInUser}
              news={news}
              complaints={complaints}
              directives={directives}
              taskReports={taskReports}
              allMembers={members}
              onLogout={handleLogout}
              onSaveNews={handleSaveNews}
              onDeleteNews={handleDeleteNews}
              onUpdateComplaint={handleUpdateComplaint}
              onSaveDirective={handleSaveDirective}
              onDeleteDirective={handleDeleteDirective}
              onSaveMember={handleSaveMember}
              isLoading={isLoading}
              roles={roles}
              sections={sections}
              jabatans={jabatans}
              isSimulating={isSimulating}
              onEndSimulation={handleEndSimulation}
          />
      )
  }

  return (
      <MemberLayout 
          {...memberLayoutProps}
      />
  );
};

export default App;