import React, { useMemo } from 'react';
import { Member } from '../types';
import UserIcon from './icons/UserIcon';
import BpbdLogo from './icons/BpdbLogo';
import GarudaIcon from './icons/GarudaIcon';
import HologramIcon from './icons/HologramIcon';

interface IdCardProps {
  member: Member;
  orientation: 'vertical' | 'horizontal';
  side: 'front' | 'back';
  primaryColor: string;
  textColor: 'light' | 'dark';
  backgroundStyle: 'gradient' | 'wave' | 'solid' | 'geometric' | 'guilloche';
  logoUrl?: string | null;
  removeLogoBg?: boolean;
}

const IdCard: React.FC<IdCardProps> = ({ member, orientation, side, primaryColor, textColor, backgroundStyle, logoUrl, removeLogoBg }) => {
  const profileUrl = useMemo(() => {
    // Definitive Fix for Serverless/Complex Hosting Environments:
    // Previous attempts failed because the hosting environment requires the *exact*, full path
    // to the running application instance. Using `window.location.origin` fails because
    // the server doesn't respond to requests for the root (`/`).
    // Therefore, we MUST use the full `href` as the base.
    
    // 1. Get the current full URL.
    const currentFullUrl = window.location.href;

    // 2. Remove any existing hash fragment to get a clean, reliable base URL.
    const baseUrl = currentFullUrl.split('#')[0];
    
    // 3. Append the new hash fragment for the public profile.
    return `${baseUrl}#/member/${member.id}`;
  }, [member.id]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}&qzone=1&margin=0&color=000000&bgcolor=ffffff`;
  const isVertical = orientation === 'vertical';

  const cardContainerClasses = `
    relative transition-transform duration-700 w-full h-full
    [transform-style:preserve-3d] 
    ${side === 'back' ? '[transform:rotateY(180deg)]' : ''}
  `;

  const cardFaceClasses = `
    absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden 
    [backface-visibility:hidden]
    font-sans flex flex-col
  `;
  
  // --- DESIGN SYSTEM & DYNAMIC STYLES ---
  const colors = {
    primary: primaryColor,
    textLight: '#FFFFFF',
    textDark: '#1F2937',
    gold: '#BFA15A',
    background: '#F4F6F9',
  };

  const mainTextColor = textColor === 'light' ? colors.textLight : colors.textDark;

  const frontBgStyle = useMemo(() => {
    const guillochePattern = `
      radial-gradient(circle at top left, ${colors.primary}1A 0.5px, transparent 1px),
      radial-gradient(circle at bottom right, ${colors.primary}1A 0.5px, transparent 1px)
    `;
    return {
      backgroundColor: colors.background,
      backgroundImage: backgroundStyle === 'guilloche' ? guillochePattern : 'none',
      backgroundSize: '15px 15px',
    };
  }, [primaryColor, backgroundStyle]);
  
  const LogoComponent = ({ className }: {className?: string}) => {
    const blendModeClass = removeLogoBg ? 'mix-blend-multiply dark:mix-blend-screen' : '';
    
    if (logoUrl) {
      return <img src={logoUrl} alt="Custom Logo" className={`${className} object-contain ${blendModeClass}`} /> 
    }
    
    return <BpbdLogo className={className} />;
  }

  // --- FRONT DESIGN ---
  const FrontFace = () => (
    <div className={`${cardFaceClasses} text-gray-800`} style={frontBgStyle}>
        <GarudaIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 text-gray-900/5 opacity-80" />
      
      {isVertical ? (
        <div className="relative h-full flex flex-col z-10">
          <header style={{ backgroundColor: colors.primary }} className="py-3 px-5 flex items-center justify-between text-white rounded-t-2xl">
            <LogoComponent className="w-14 h-14" />
            <div className="text-right">
              <h1 className="font-bold text-sm tracking-wider uppercase">KARTU TANDA ANGGOTA</h1>
              <p className="text-xs font-light tracking-widest uppercase">BADAN NASIONAL PENANGGULANGAN BENCANA</p>
            </div>
          </header>
          <main className="flex-grow flex flex-col items-center pt-8 px-4 text-center">
             <div className="relative group">
                <div className="w-48 h-48 rounded-full shadow-lg p-1 bg-white">
                    {member.fotoUrl ? <img src={member.fotoUrl} alt={member.namaLengkap} className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-full h-full text-gray-300 p-4" />}
                </div>
                <HologramIcon className="absolute bottom-1 right-1 w-14 h-14 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-5">
                <h2 className="text-2xl font-bold tracking-wide text-gray-900">{member.namaLengkap}</h2>
                <p className="text-lg font-semibold" style={{ color: colors.primary }}>{member.jabatan}</p>
            </div>
            <div className="mt-auto w-full pt-4 pb-2">
                <div className="border-t border-gray-300 w-3/4 mx-auto mb-2"></div>
                <div className="flex justify-between items-end">
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-500">ID ANGGOTA</p>
                        <p className="font-mono text-lg tracking-wider text-gray-800">{member.nomorId || 'N/A'}</p>
                    </div>
                    <div className="w-16 h-16 p-1 bg-white rounded-lg shadow-md">
                        <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                    </div>
                </div>
            </div>
          </main>
        </div>
      ) : (
         <div className="relative h-full flex p-4 gap-4 z-10">
            <div className="w-[35%] flex flex-col items-center justify-center">
                 <div className="relative group">
                    <div className="w-44 h-44 rounded-full shadow-lg p-1 bg-white">
                        {member.fotoUrl ? <img src={member.fotoUrl} alt={member.namaLengkap} className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-full h-full text-gray-300 p-4" />}
                    </div>
                     <HologramIcon className="absolute bottom-1 right-1 w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            <div className="w-[65%] flex flex-col py-2 pr-2">
              <header className="flex items-center justify-between pb-2 border-b-2" style={{borderColor: colors.gold}}>
                <div className="text-left">
                  <h1 className="font-bold text-base tracking-wider uppercase" style={{ color: colors.primary }}>KARTU TANDA ANGGOTA</h1>
                  <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">BADAN NASIONAL PENANGGULANGAN BENCANA</p>
                </div>
                <LogoComponent className="w-12 h-12" />
              </header>
              <main className="text-left my-auto">
                <h2 className="text-3xl font-bold leading-tight text-gray-900">{member.namaLengkap}</h2>
                <p className="text-2xl font-medium" style={{color: colors.primary}}>{member.jabatan}</p>
                
                <div className="mt-4 flex items-center gap-6">
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-500">ID ANGGOTA</p>
                        <p className="font-mono text-lg tracking-wider text-gray-800">{member.nomorId || 'N/A'}</p>
                    </div>
                     <div className="w-16 h-16 p-1 bg-white rounded-lg shadow-md ml-auto">
                        <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                    </div>
                </div>
              </main>
              <footer className="text-xs text-right font-semibold text-gray-400">
                Berlaku hingga: <span className="text-gray-600">Seumur Hidup</span>
              </footer>
            </div>
          </div>
      )}
    </div>
  );

  // --- BACK DESIGN ---
  const BackFace = () => (
    <div className={`${cardFaceClasses} [transform:rotateY(180deg)] bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between`}>
        <div className="w-full h-12 mt-2" style={{backgroundColor: colors.primary}}></div>
        
        <div className="text-left px-2 text-xs text-gray-500 space-y-3 my-4 flex-grow">
            <p className="font-bold text-gray-800 dark:text-gray-200 mt-4">KARTU INI ADALAH MILIK SAH DARI ANGGOTA BADAN NASIONAL PENANGGULANGAN BENCANA.</p>
            <p>Kartu ini tidak dapat dipindahtangankan. Apabila menemukan kartu ini, mohon untuk menyerahkannya ke kantor BNPB terdekat atau menghubungi pusat informasi.</p>
        </div>

        <div className="px-2">
            <p className="text-xs font-bold text-gray-500">TANDA TANGAN PEMEGANG</p>
            <div className="w-full h-10 bg-white/80 border-b-2 border-gray-400 mt-1 flex items-center justify-end px-2" style={{backgroundImage: `repeating-linear-gradient(45deg, #0001, #0001 1px, transparent 1px, transparent 5px)`}}>
            </div>
        </div>

        <div className="mt-4">
             <div className="h-8 bg-gray-300 flex items-center justify-center">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"
                    width="248" height="32" viewBox="0 0 248 32" fill="none">
                    <path d="M0 0H248V32H0V0Z" fill="white"/>
                    <path d="M12 0V32" stroke="black"/>
                    <path d="M28 0V32" stroke="black"/>
                    <path d="M32 0V32" stroke="black"/>
                    <path d="M48 0V32" stroke="black"/>
                    <path d="M52 0V32" stroke="black"/>
                    <path d="M56 0V32" stroke="black"/>
                    <path d="M64 0V32" stroke="black"/>
                    <path d="M68 0V32" stroke="black"/>
                    <path d="M80 0V32" stroke="black"/>
                    <path d="M88 0V32" stroke="black"/>
                    <path d="M92 0V32" stroke="black"/>
                    <path d="M104 0V32" stroke="black"/>
                    <path d="M112 0V32" stroke="black"/>
                    <path d="M124 0V32" stroke="black"/>
                    <path d="M128 0V32" stroke="black"/>
                    <path d="M136 0V32" stroke="black"/>
                    <path d="M152 0V32" stroke="black"/>
                    <path d="M156 0V32" stroke="black"/>
                    <path d="M168 0V32" stroke="black"/>
                    <path d="M172 0V32" stroke="black"/>
                    <path d="M176 0V32" stroke="black"/>
                    <path d="M188 0V32" stroke="black"/>
                    <path d="M192 0V32" stroke="black"/>
                    <path d="M204 0V32" stroke="black"/>
                    <path d="M216 0V32" stroke="black"/>
                    <path d="M220 0V32" stroke="black"/>
                    <path d="M232 0V32" stroke="black"/>
                    <path d="M240 0V32" stroke="black"/>
                </svg>
             </div>
        </div>

        <div className="text-center text-xs font-bold text-gray-500 mt-2">
            www.bnpb.go.id
        </div>
    </div>
  );

  return (
    <div className={`${isVertical ? 'w-[320px] h-[512px]' : 'w-[512px] h-[320px]'}`}>
      <div className={cardContainerClasses}>
        <FrontFace />
        <BackFace />
      </div>
    </div>
  );
};

export default IdCard;