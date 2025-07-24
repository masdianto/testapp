import React, { useState } from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import BpbdLogo from './icons/BpdbLogo';
import EnvelopeIcon from './icons/EnvelopeIcon';
import KeyIcon from './icons/KeyIcon';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (email: string, password?: string) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593068298335-b64d187515e3?q=80&w=1200&auto=format&fit=crop')" }}
      ></div>
       <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900"></div>

      <div 
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-8 m-4 text-white animate-fade-in-down"
      >
        <div className="text-center mb-8">
            <BpbdLogo className="w-24 h-24 mx-auto" />
            <h1 className="text-3xl font-bold mt-4">Selamat Datang Kembali</h1>
            <p className="text-white/70">Silakan masuk untuk mengakses dasbor Anda.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                    <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-white/50"
                    placeholder="Alamat Email"
                    required
                    autoComplete="email"
                />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Kata Sandi</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                    <KeyIcon className="h-5 w-5" />
                </span>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata Sandi (disimulasikan)"
                    className="w-full pl-10 pr-3 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-white/50"
                />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
            >
              {isLoading && <SpinnerIcon className="w-5 h-5" />}
              {isLoading ? 'Masuk...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
            <button onClick={onClose} className="text-sm text-white/60 hover:text-white hover:underline">
                &larr; Kembali ke Halaman Publik
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;