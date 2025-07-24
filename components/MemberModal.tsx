import React, { useState, useEffect, useCallback } from 'react';
import { Member, MemberStatus, RoleDefinition, SectionDefinition, JabatanDefinition } from '../types';
import XIcon from './icons/XIcon';
import UserIcon from './icons/UserIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => Promise<boolean>; // Returns a boolean to indicate success
  memberToEdit: Member | null;
  loggedInUser: Member | null;
  roles: RoleDefinition[];
  sections: SectionDefinition[];
  jabatans: JabatanDefinition[];
  isLoading: boolean;
}

const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, onSave, memberToEdit, loggedInUser, roles, sections, jabatans, isLoading }) => {
  const getInitialState = useCallback((): Member => {
    return memberToEdit || {
      id: '',
      namaLengkap: '',
      nomorId: '',
      tanggalLahir: '',
      jenisKelamin: 'Laki-laki',
      alamat: '',
      telepon: '',
      email: '',
      jabatan: jabatans[0]?.name || '',
      tanggalBergabung: new Date().toISOString().split('T')[0],
      status: MemberStatus.AKTIF,
      bio: '',
      fotoUrl: '',
      role: 'Anggota',
      seksi: 'Umum',
    };
  }, [memberToEdit, jabatans]);

  const [member, setMember] = useState<Member>(getInitialState);

  useEffect(() => {
    if (isOpen) {
      setMember(getInitialState());
    }
  }, [isOpen, getInitialState]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setMember(prev => ({ ...prev, fotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave({ ...member, id: member.id || crypto.randomUUID() });
    if(success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Pimpinan can edit roles. When adding a new user from admin page, loggedInUser is null, so fields are also visible.
  const canEditRoles = !loggedInUser || loggedInUser.role === 'Pimpinan' || loggedInUser.role === 'Admin';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl m-4 w-full max-w-2xl max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {memberToEdit ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto Anggota</label>
              <div className="mt-2 flex items-center gap-4">
                <span className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {member.fotoUrl ? (
                    <img src={member.fotoUrl} alt="Foto Anggota" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-full w-full text-gray-300 dark:text-gray-500" />
                  )}
                </span>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <span>Ganti Foto</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <input type="text" name="namaLengkap" id="namaLengkap" value={member.namaLengkap} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
              <select name="jabatan" id="jabatan" value={member.jabatan} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {jabatans.map(j => <option key={j.id} value={j.name}>{j.name}</option>)}
              </select>
            </div>
            {canEditRoles && (
              <>
                 <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peran (Role)</label>
                  <select name="role" id="role" value={member.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                 <div>
                  <label htmlFor="seksi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seksi / Divisi</label>
                  <select name="seksi" id="seksi" value={member.seksi} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {sections.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" value={member.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telepon</label>
              <input type="tel" name="telepon" id="telepon" value={member.telepon} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="nomorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor ID (KTP/Lainnya)</label>
              <input type="text" name="nomorId" id="nomorId" value={member.nomorId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
             <div>
              <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
              <select name="jenisKelamin" id="jenisKelamin" value={member.jenisKelamin} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
            <div>
              <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
              <input type="date" name="tanggalLahir" id="tanggalLahir" value={member.tanggalLahir} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="tanggalBergabung" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Bergabung</label>
              <input type="date" name="tanggalBergabung" id="tanggalBergabung" value={member.tanggalBergabung} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</label>
              <textarea name="alamat" id="alamat" value={member.alamat} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio Singkat</label>
              <textarea name="bio" id="bio" value={member.bio} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
             <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Keanggotaan</label>
              <select name="status" id="status" value={member.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value={MemberStatus.AKTIF}>Aktif</option>
                <option value={MemberStatus.TIDAK_AKTIF}>Tidak Aktif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;