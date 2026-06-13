import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Mail, Lock, KeyRound } from 'lucide-react';

interface ProfileProps {
  setTab: (tab: string, params?: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ setTab }) => {
  const { currentUser, updateProfile } = useApp();
  
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('*********');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    updateProfile(fullName, email);
    setSuccessMessage("Profil akun Anda berhasil dimutasi dan disimpan!");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    setSuccessMessage("Kata sandi berhasil diamankan! (Disimpan dalam sesi simulasi)");
    setNewPassword('');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4 text-center">
        <h3 className="font-bold text-lg text-slate-800">Silakan login untuk mengakses halaman profil</h3>
        <button onClick={() => setTab('login')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
          Masuk Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-55 min-h-screen py-12 px-4 sm:px-6 lg:px-8" id="profile-page">
      <div className="max-w-2xl mx-auto">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Akun Pelanggan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data profil pribadi, alamat rujukan, dan otentikasi login kampus Anda.</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-xl mb-6 text-xs sm:text-sm shadow-xs animate-fade-in flex items-center space-x-2">
            <ShieldCheck className="text-emerald-500 animate-pulse" size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Section 1: Edit Profile details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3.5 mb-5">
              <User size={20} className="text-indigo-600" />
              <span>Detail Profil Personal</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">NAMA LENGKAP MAHASISWA / STAF</label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">E-MAIL INSTITUSI RESMI</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
                  id="save-profile-button"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Change Password simulation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs animate-fade-in">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3.5 mb-5">
              <Lock size={20} className="text-indigo-600" />
              <span>Ganti Kata Sandi (Keamanan)</span>
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">KATA SANDI SEKARANG</label>
                  <input 
                    type="password"
                    disabled
                    value={password}
                    className="w-full bg-slate-100 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">KATA SANDI BARU</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                    id="new-password-input"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
                  id="change-password-button"
                >
                  Ubah Kata Sandi
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
