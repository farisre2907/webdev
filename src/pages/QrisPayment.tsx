import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Loader2, Landmark, CheckCircle, Smartphone, AlertTriangle, HelpCircle } from 'lucide-react';

interface QrisPaymentProps {
  orderId: string;
  setTab: (tab: string, params?: any) => void;
}

export const QrisPayment: React.FC<QrisPaymentProps> = ({ orderId, setTab }) => {
  const { orders, simulatePayment } = useApp();
  const [isPaying, setIsPaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 Minutes countdown timer

  const order = orders.find(o => o.id === orderId);

  // Expire timer simulation
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  if (!order) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4 text-center">
        <h3 className="font-bold text-lg text-slate-800">Pesanan tidak ditemukan</h3>
        <button onClick={() => setTab('catalog')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      // Simulate real checkout with a 3-second loader as requested in Page 2
      await simulatePayment(order.id);
      setIsPaying(false);
      // Redirect to Payment Success page
      setTab('payment-success', { orderId: order.id });
    } catch (err) {
      setIsPaying(false);
      console.error("Payment simulator error", err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8" id="qris-payment-page">
      <div className="max-w-md mx-auto">
        
        {/* Main Payment Container Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden text-center relative">
          
          {/* Header Bar */}
          <div className="bg-slate-900 p-6 text-white text-center">
            <span className="inline-block bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full px-4 mb-2">QRIS SIMULATOR</span>
            <p className="text-xs text-slate-400 font-mono">GERBANG PEMBAYARAN KAMPUS OTOMATIS</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Meta status details */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">KODE INVOICE</span>
              <h1 className="text-xl font-extrabold text-slate-800 font-mono">{order.id}</h1>
              <div className="flex justify-center items-center space-x-2 text-rose-500 font-mono font-bold text-xs mt-1 bg-rose-50 py-1.5 px-3 rounded-lg w-max mx-auto">
                <span className="animate-pulse">●</span>
                <span>WAKTU PEMBAYARAN: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* QRIS Aesthetic Code Graphic Box */}
            <div className="relative aspect-square w-64 h-64 mx-auto border-2 border-slate-200 rounded-2xl p-4 bg-white shadow-inner flex flex-col justify-between items-center bg-slate-50/50">
              
              {/* Fake QRIS Grid Design Using CSS Elements */}
              <div className="absolute inset-4 grid grid-cols-5 gap-2 opacity-90">
                <div className="border-[5px] border-slate-900 rounded-xs bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="border-[5px] border-slate-900 rounded-xs bg-transparent"></div>
                
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>

                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-slate-950 p-1 flex items-center justify-center text-[10px] font-bold text-indigo-400 rounded bg-slate-900 col-span-1 border border-slate-900">CMH</div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>

                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>

                <div className="border-[5px] border-slate-900 rounded-xs bg-transparent"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-900 rounded-sm"></div>
                <div className="bg-transparent"></div>
                <div className="border-[5px] border-slate-900 rounded-xs bg-transparent"></div>
              </div>

              {/* Central scanning pointer visual flare */}
              {!isPaying && (
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-550/70 bg-indigo-500/70 shadow-[0_0_8px_rgba(79,70,229,1)] animate-bounce pointer-events-none"></div>
              )}

              {/* Interactive payment loading spinner overlap inside physical QR */}
              {isPaying && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center space-y-3 z-10 p-4 animate-all">
                  <Loader2 className="animate-spin text-indigo-600 animate-all" size={40} />
                  <p className="font-bold text-slate-800 text-sm">Menghubungi Virtual Bank...</p>
                  <p className="text-[10px] text-slate-400 animate-pulse font-mono leading-relaxed px-4">Mengonfirmasi saldo dan mendaftarkan nominal transaksi (Estimasi 3 detik)</p>
                </div>
              )}

            </div>

            {/* Total Payment description panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 justify-between items-center text-left">
              <span className="text-[9px] text-slate-400 font-mono block">TOTAL NOMINAL PEMBAYARAN</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-805 text-indigo-800 font-bold px-2 py-0.5 rounded font-sans uppercase">
                  SIMULASI QRIS
                </span>
              </div>
            </div>

            {/* Pay Now simulator Action Trigger */}
            <div className="space-y-3">
              <button 
                onClick={handlePayNow}
                disabled={isPaying || timeLeft <= 0}
                className="w-full bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
                id="pay-now-button"
              >
                <Smartphone size={18} />
                <span>BAYAR SEKARANG (SIMULASI)</span>
              </button>

              <button 
                onClick={() => setTab('cart')}
                className="text-xs text-slate-400 hover:text-slate-600 transition"
              >
                Batalkan & Kembali ke Keranjang
              </button>
            </div>

            {/* Micro instruction guides */}
            <div className="border-t border-slate-100 pt-4 text-left space-y-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                <HelpCircle size={14} className="text-indigo-600" />
                <span>Petunjuk Pembayaran Simulasi:</span>
              </h4>
              <ol className="list-decimal list-inside text-[11px] text-slate-500 space-y-1.5 leading-relaxed font-sans">
                <li>Klik tombol <strong className="text-slate-800 font-semibold">BAYAR SEKARANG</strong> di atas.</li>
                <li>Sistem akan menyimulasikan proses validasi transaksi perbankan otomatis selama 3 detik.</li>
                <li>Setelah divalidasi, dana simulasi Anda sukses terbayar dan dialihkan otomatis ke halaman status pesanan.</li>
              </ol>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
