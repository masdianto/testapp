export enum MemberStatus {
  AKTIF = 'Aktif',
  TIDAK_AKTIF = 'Tidak Aktif',
}

export type RoleDefinition = {
  id: string; // e.g., 'pimpinan'
  name: string; // e.g., 'Pimpinan'
  isSystem: boolean; // Cannot be deleted/edited
};

export type SectionDefinition = {
  id: string; // e.g., 'logistik'
  name: string; // e.g., 'Logistik'
  isSystem: boolean;
};

export type JabatanDefinition = {
  id: string; 
  name: string;
};

export interface Member {
  id: string;
  namaLengkap: string;
  nomorId: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  telepon: string;
  email: string;
  jabatan: string;
  tanggalBergabung: string;
  status: MemberStatus;
  bio: string;
  fotoUrl: string;
  role: string; // e.g. 'Pimpinan', matches RoleDefinition.name
  seksi: string; // e.g. 'Logistik', matches SectionDefinition.name
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
}

export interface Complaint {
    id: string;
    namaPelapor: string;
    telepon: string;
    email: string;
    jenisLaporan: 'Laporan Kejadian Bencana' | 'Permintaan Evakuasi' | 'Permintaan Logistik & Bantuan' | 'Laporan Kerusakan Infrastruktur' | 'Informasi & Edukasi' | 'Lainnya';
    lokasiKejadian: string;
    content: string;
    status: 'Baru' | 'Menunggu Diproses Sekretaris' | 'Menunggu Disposisi Pimpinan' | 'Didisposisikan ke Seksi' | 'Dikerjakan oleh Seksi' | 'Laporan Selesai' | 'Ditutup';
    timestamp: string;
    currentOwner: string; // Role name ('Operator', 'Sekretaris', 'Pimpinan') or Section ID ('logistik')
    dispositionNotes?: string;
    completionReport?: {
        notes: string;
        attachmentUrl?: string;
        attachmentName?: string;
        timestamp: string;
    };
}


export type EmergencyDirective = {
  id: string;
  createdBy: string;
  title: string;
  urgency: 'Tinggi' | 'Sedang' | 'Rendah';
  status: 'Baru' | 'Dikerjakan' | 'Selesai';
  date: string;
  description: string;
  assignedTo: 'all' | string[];
  attachmentUrl?: string;
  attachmentName?: string;
};

export interface TaskReport {
  id: string; // memberId-directiveId
  memberId: string;
  directiveId: string;
  status: 'Dilihat' | 'Dilaporkan';
  reportText?: string;
  reportImageUrl?: string;
  reportedAt?: string;
}

export interface SPPD {
  id: string;
  nomorSurat: string;
  dasarHukum: string;
  untuk: string;
  tujuan: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  penerimaTugasIds: string[];
  pembuatId: string; // Sekretaris ID
  penyetujuId?: string; // Pimpinan ID
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak' | 'Laporan Diterima' | 'Selesai' | 'Diarsipkan';
  catatanPenolakan?: string;
  dibuatTanggal: string;
  anggaranTotal?: number;
  realisasiBiaya?: number;
}

export interface SPPDReport {
  id: string; // `${sppdId}-${memberId}`
  sppdId: string;
  memberId: string;
  hasilKegiatan: string;
  kendala: string;
  saran: string;
  lampiranUrl?: string;
  lampiranName?: string;
  dikirimTanggal: string;
}

export type FinancialTransaction = {
  id: string;
  date: string; // ISO string
  description: string;
  category: 'Gaji' | 'Donasi' | 'Transportasi' | 'Akomodasi' | 'Logistik' | 'BBM' | 'Operasional' | 'Lainnya' | 'Reimbursement';
  type: 'Pemasukan' | 'Pengeluaran';
  amount: number;
  attachmentUrl?: string;
  attachmentName?: string;
  linkedReimbursementId?: string;
};

export type ReimbursementRequest = {
  id: string;
  requesterId: string;
  requesterName: string;
  date: string; // ISO string
  amount: number;
  category: 'Operasional Harian' | 'SPPD';
  description: string;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak' | 'Dibayar';
  proofUrl: string;
  proofName: string;
  rejectionNotes?: string;
  approvedById?: string; 
  paidById?: string; 
  paidDate?: string;
};