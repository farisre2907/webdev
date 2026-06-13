import React from 'react';
import { Mail, Phone, MapPin, Instagram, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-500 text-xs sm:text-sm border-t border-slate-200" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center font-bold font-mono shadow-xs">
                <span className="text-sm">UMH</span>
              </div>
              <span className="font-bold text-lg text-slate-900 font-sans tracking-tight">Unpad Merch Hub</span>
            </div>
            <p className="text-slate-550 text-slate-500 text-xs leading-relaxed max-w-sm">
              Satu-satunya platform resmi pembelian merchandise berkualitas tinggi untuk civitas akademika. 
              Mulai dari kaos eksklusif, hoodie premium, gantungan kunci maskot, hingga tumbler ramah lingkungan.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 border border-slate-200 transition">
                <Instagram size={15} />
              </a>
              <a href="#" className="p-2 bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 border border-slate-200 transition">
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Categories quick access */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-mono">Kategori Terpopuler</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><span className="cursor-pointer hover:text-indigo-600 transition">Kaos Kampus (T-Shirts)</span></li>
              <li><span className="cursor-pointer hover:text-indigo-600 transition">Hoodie & Sweater</span></li>
              <li><span className="cursor-pointer hover:text-indigo-600 transition">Botol & Tumbler Termal</span></li>
              <li><span className="cursor-pointer hover:text-indigo-600 transition">Paket Stiker & Pin</span></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-mono">Hubungi Kami</h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <span>Gedung Kemahasiswaan Lt.1, Universitas Merdeka, Kampus Pusat</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-indigo-600 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-indigo-600 shrink-0" />
                <span>merchhub@campus.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 my-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 space-y-2 sm:space-y-0">
          <p>© 2026 Unpad Merch Hub. All rights reserved.</p>
          <div className="flex space-x-4 text-[11px] font-medium text-slate-400">
            <span className="hover:text-indigo-600 cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-indigo-600 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-indigo-600 cursor-pointer">Bantuan Pelanggan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
