import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Member } from '../types';
import IdCard from './IdCard';
import PrintIcon from './icons/PrintIcon';
import UserIcon from './icons/UserIcon';
import FlipIcon from './icons/FlipIcon';
import PaletteIcon from './icons/PaletteIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface GenerateCardPageProps {
  members: Member[];
}

type CustomizationOptions = {
    primaryColor: string;
    textColor: 'light' | 'dark';
    backgroundStyle: 'gradient' | 'wave' | 'solid' | 'geometric' | 'guilloche';
};

const BNPB_DEFAULTS: CustomizationOptions = {
  primaryColor: '#FF6B00',
  textColor: 'light',
  backgroundStyle: 'guilloche',
};

const GenerateCardPage: React.FC<GenerateCardPageProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(members[0] || null);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [side, setSide] = useState<'front' | 'back'>('front');
  
  const [customization, setCustomization] = useState<CustomizationOptions>(BNPB_DEFAULTS);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [isLogoBgRemovalActive, setIsLogoBgRemovalActive] = useState(false);

  const [isMemberListOpen, setIsMemberListOpen] = useState(false);
  const memberListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberListRef.current && !memberListRef.current.contains(event.target as Node)) {
        setIsMemberListOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setIsMemberListOpen(false);
  };

  const handleCustomizationChange = <K extends keyof CustomizationOptions>(key: K, value: CustomizationOptions[K]) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };
  
  const handleResetStyles = () => {
    setCustomization(BNPB_DEFAULTS);
    setCustomLogoUrl(null);
    setIsLogoBgRemovalActive(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = useMemo(() => 
    members.filter(m =>
      m.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [members, searchTerm]
  );
  
  useEffect(() => {
    setSide('front');
  }, [selectedMember, orientation]);

  const handlePrint = () => {
    const printableArea = document.getElementById('card-preview-wrapper');
    if (printableArea) {
      const originalId = printableArea.id;
      printableArea.id = 'printable-area';
      window.print();
      printableArea.id = originalId;
    }
  };
  
  const backgroundStyleOptions: { key: CustomizationOptions['backgroundStyle'], label: string }[] = [
    { key: 'guilloche', label: 'Guilloché' },
    { key: 'gradient', label: 'Gradasi' },
    { key: 'wave', label: 'Gelombang' },
    { key: 'solid', label: 'Polos' },
    { key: 'geometric', label: 'Geometris' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Left Panel: Controls */}
      <aside className="w-full md:w-1/3 xl:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col p-4 space-y-6">
        {/* Member Selection */}
        <div className="relative" ref={memberListRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anggota Terpilih</label>
          <button
            onClick={() => setIsMemberListOpen(!isMemberListOpen)}
            className="w-full text-left flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-haspopup="listbox"
            aria-expanded={isMemberListOpen}
          >
            {selectedMember ? (
              <>
                <img src={selectedMember.fotoUrl} alt={selectedMember.namaLengkap} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold truncate text-gray-900 dark:text-gray-100">{selectedMember.namaLengkap}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{selectedMember.jabatan}</p>
                </div>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Pilih seorang anggota</span>
            )}
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${isMemberListOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMemberListOpen && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Cari anggota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <ul className="flex-grow overflow-y-auto max-h-72">
                {filteredMembers.length > 0 ? filteredMembers.map(member => (
                  <li key={member.id}>
                    <button
                      onClick={() => handleSelectMember(member)}
                      className={`w-full text-left p-3 flex items-center gap-3 transition-colors duration-200 ${selectedMember?.id === member.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                    >
                      <img src={member.fotoUrl} alt={member.namaLengkap} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className={`font-semibold ${selectedMember?.id === member.id ? 'text-primary dark:text-orange-300' : 'text-gray-800 dark:text-gray-200'}`}>{member.namaLengkap}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.jabatan}</p>
                      </div>
                    </button>
                  </li>
                )) : (
                  <p className="text-center p-4 text-gray-500 dark:text-gray-400">Anggota tidak ditemukan.</p>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Customization Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
            className="w-full flex items-center justify-between p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <PaletteIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">Kustomisasi Desain</span>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isCustomizationOpen ? 'rotate-180' : ''}`} />
          </button>
          {isCustomizationOpen && (
            <div className="mt-4 space-y-4 animate-fade-in">
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Kustom</label>
                  <div className="flex items-center gap-2">
                      <label
                          htmlFor="logo-upload"
                          className="flex-grow cursor-pointer text-center px-4 py-2 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                          <span>Upload Logo</span>
                          <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                      {customLogoUrl && (
                          <button onClick={() => setCustomLogoUrl(null)} className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                              Hapus
                          </button>
                      )}
                  </div>
                   {customLogoUrl && (
                    <div className="mt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                            <input 
                                type="checkbox"
                                checked={isLogoBgRemovalActive}
                                onChange={(e) => setIsLogoBgRemovalActive(e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600 text-primary shadow-sm focus:ring-primary dark:bg-gray-900 dark:checked:bg-primary"
                            />
                            <span>Hapus Latar Belakang Logo</span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">Eksperimental, baik untuk latar belakang putih/hitam.</p>
                    </div>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warna Utama</label>
                <div className="relative mt-1">
                  <input type="color" value={customization.primaryColor} onChange={e => handleCustomizationChange('primaryColor', e.target.value)} className="p-0 w-full h-10 block bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-pointer rounded-md" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-gray-500">{customization.primaryColor}</span>
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warna Teks</label>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1 mt-1">
                  <button onClick={() => handleCustomizationChange('textColor', 'light')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${customization.textColor === 'light' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}>Terang</button>
                  <button onClick={() => handleCustomizationChange('textColor', 'dark')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${customization.textColor === 'dark' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}>Gelap</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gaya Latar</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    {backgroundStyleOptions.map(opt => (
                        <button key={opt.key} onClick={() => handleCustomizationChange('backgroundStyle', opt.key)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors border ${customization.backgroundStyle === opt.key ? 'bg-primary/20 border-primary text-primary' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}>{opt.label}</button>
                    ))}
                </div>
              </div>
              <button onClick={handleResetStyles} className="w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  Kembalikan Default
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Right Panel: Card Preview */}
      <main className="w-full md:w-2/3 xl:w-3/4 flex flex-col items-center justify-center gap-6 p-4">
        {selectedMember ? (
          <>
            {/* Controls */}
            <div className="w-full max-w-sm">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-center mb-2">Orientasi Kartu</span>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                  <button onClick={() => setOrientation('vertical')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${orientation === 'vertical' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}>
                    Vertikal
                  </button>
                  <button onClick={() => setOrientation('horizontal')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${orientation === 'horizontal' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}>
                    Horizontal
                  </button>
                </div>
              </div>
            
            {/* Card Preview with 3D perspective */}
            <div id="card-preview-wrapper" className="flex-grow flex items-center justify-center" style={{ perspective: '1500px' }}>
              <IdCard 
                member={selectedMember} 
                orientation={orientation} 
                side={side} 
                logoUrl={customLogoUrl}
                removeLogoBg={isLogoBgRemovalActive}
                {...customization} 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                  onClick={() => setSide(s => s === 'front' ? 'back' : 'front')}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
              >
                  <FlipIcon className="h-5 w-5" />
                  Balik Kartu
              </button>
              <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105"
              >
                  <PrintIcon className="h-5 w-5" />
                  Cetak Kartu
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col justify-center h-full">
            <UserIcon className="mx-auto h-32 w-32 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-2xl font-semibold">Pilih Anggota</h3>
            <p>Pilih seorang anggota dari daftar untuk melihat pratinjau kartu mereka.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerateCardPage;