import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, User, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  setTab: (tab: string, params?: any) => void;
}

export const Register: React.FC<RegisterProps> = ({ setTab }) => {
  const { register } = useApp();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'customer' | 'staff'>('customer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setErrorMessage("Harap isi seluruh formulir pendaftaran.");
      return;
    }

    const success = register(fullName, email, role);
    if (success) {
      if (role === 'staff') {
        setTab('staff-dashboard');
      } else {
        setTab('home');
      }
    } else {
      setErrorMessage("Email tersebut sudah terdaftar di sistem. Silakan login.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4" id="register-page">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent font-bold text-lg tracking-tight">Daftar Pelanggan Baru</span>
          <p className="text-slate-400 text-xs mt-1">Daftar dalam 10 detik untuk berbelanja merchandise kampus.</p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs sm:text-sm text-left animate-fade-in shadow-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-slate-400 font-mono text-[10px] block mb-1">NAMA LENGKAP MAHASISWA / STAF</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Faris Rifqy"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition font-medium"
                  id="register-fullname-input"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-mono text-[10px] block mb-1">E-MAIL INSTITUSI RESMI</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.unmer.ac.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                  id="register-email-input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] block">PERAN PENGENAL</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition flex items-center justify-center space-x-1 ${
                  role === 'customer' ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs' : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="reg-role" 
                    className="sr-only" 
                    checked={role === 'customer'} 
                    onChange={() => setRole('customer')} 
                  />
                  <span>Customer (Pelanggan)</span>
                </label>

                <label className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition flex items-center justify-center space-x-1 ${
                  role === 'staff' ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs' : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="reg-role" 
                    className="sr-only" 
                    checked={role === 'staff'} 
                    onChange={() => setRole('staff')} 
                  />
                  <span>Staff Toko (Admin)</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-1.5 text-xs sm:text-sm shadow cursor-pointer font-sans"
              id="register-submit-button"
            >
              <UserPlus size={16} />
              <span>Registrasi Sekarang</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => setTab('login')}
              className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 transition font-semibold"
            >
              <ArrowLeft size={12} />
              <span>Kembali ke Halaman Login</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
