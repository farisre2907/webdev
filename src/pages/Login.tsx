import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, Key, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

interface LoginProps {
  setTab: (tab: string, params?: any) => void;
}

export const Login: React.FC<LoginProps> = ({ setTab }) => {
  const { login } = useApp();
  
  const [email, setEmail] = useState('customer@campus.com');
  const [role, setRole] = useState<'customer' | 'staff'>('customer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Harap lengkapi email institusi.");
      return;
    }

    const success = login(email, role);
    if (success) {
      if (role === 'staff') {
        setTab('staff-dashboard');
      } else {
        setTab('home');
      }
    } else {
      setErrorMessage("Alamat email atau peran pengenal salah. Coba gunakan demo klik cepat di bawah.");
    }
  };

  const handleQuickLogin = (quickEmail: string, quickRole: 'customer' | 'staff') => {
    setEmail(quickEmail);
    setRole(quickRole);
    const success = login(quickEmail, quickRole);
    if (success) {
      if (quickRole === 'staff') {
        setTab('staff-dashboard');
      } else {
        setTab('home');
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4" id="login-page">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent font-bold text-lg tracking-tight">Masuk Akun Kampus</span>
          <p className="text-slate-400 text-xs mt-1">Gunakan Single Sign On (SSO) simulasi untuk berbelanja merch.</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs sm:text-sm text-left animate-fade-in shadow-xs">
              {errorMessage}
            </div>
          )}

          {/* Role selector tabbed */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                role === 'customer' 
                  ? 'bg-white text-slate-900 shadow' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sebagai Customer
            </button>
            <button 
              type="button"
              onClick={() => setRole('staff')}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                role === 'staff' 
                  ? 'bg-white text-slate-900 shadow' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sebagai Staff Toko
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-slate-400 font-mono text-[10px] block mb-1">E-MAIL INSTITUSI RESMI</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nim@student.unmer.ac.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                  id="login-email-input"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-mono text-[10px] block mb-1">KATA SANDI SIMULASI (AUTO)</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="password"
                  disabled
                  value="ssosinglesignon"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-1.5 text-xs sm:text-sm shadow cursor-pointer"
              id="login-submit-button"
            >
              <LogIn size={16} />
              <span>Masuk Sekarang</span>
            </button>
          </form>

          {/* Quick Demo Assist section */}
          <div className="border-t border-slate-100 pt-5 space-y-3.5 text-left bg-slate-50/50 p-4 rounded-2xl">
            <h4 className="font-bold text-xs text-slate-500 font-mono uppercase flex items-center space-x-1">
              <ShieldAlert size={14} className="text-indigo-605 text-indigo-600 animate-pulse shrink-0" />
              <span>Demo Klik Cepat (Rekomendasi)</span>
            </h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickLogin('customer@campus.com', 'customer')}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold p-2.5 rounded-xl text-xs transition duration-150 text-left flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <p className="font-bold">Masuk: Customer (Faris Rifqy)</p>
                  <p className="text-[10px] text-slate-400 font-mono font-normal">customer@campus.com</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
              
              <button 
                onClick={() => handleQuickLogin('staff@campus.com', 'staff')}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold p-2.5 rounded-xl text-xs transition duration-150 text-left flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <p className="font-bold">Masuk: Staff Toko (Ruben David)</p>
                  <p className="text-[10px] text-slate-400 font-mono font-normal">staff@campus.com</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setTab('register')}
              className="text-xs text-slate-400 hover:text-slate-600 transition font-semibold"
            >
              Belum punya akun? Registrasi Pelanggan Baru
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
