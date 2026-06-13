import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, ClipboardList, ShoppingBag, Landmark } from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentSuccessProps {
  orderId: string;
  setTab: (tab: string, params?: any) => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ orderId, setTab }) => {
  const { orders } = useApp();

  const order = orders.find(o => o.id === orderId);

  const trackerJump = () => {
    // Navigate to Order History, focusing on the newly placed order!
    setTab('order-history', { focusOrderId: orderId });
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4" id="payment-success-page">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center space-y-6">
        
        {/* Animated Checkmark Visual */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-50 shadow"
          >
            <Check size={40} className="stroke-[3.5]" />
          </motion.div>
        </div>

        {/* Messaging block */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Pembayaran Berhasil!</h1>
          <p className="text-slate-500 text-sm">Terima kasih atas pembelian Anda. Pembayaran otomatis QRIS Anda telah sah diterima oleh sistem Unpad Merch Hub.</p>
        </div>

        {/* Mini details card with receipt appearance */}
        {order && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 font-mono text-xs text-slate-600">
            <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
              <span className="font-bold">STATUS PEMBAYARAN</span>
              <span className="text-emerald-600 font-extrabold">PAID / SUKSES</span>
            </div>
            <div className="flex justify-between">
              <span>NOMOR INVOICE</span>
              <span className="font-bold text-slate-800">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>WAKTU TRANSAKSI</span>
              <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>METODE PEMBAYARAN</span>
              <span>QRIS MUTASI BANK</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm">
              <span className="font-bold text-slate-800">TOTAL BELANJA</span>
              <span className="font-black text-indigo-650 text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button 
            onClick={trackerJump}
            className="w-full bg-indigo-605 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
            id="track-order-button"
          >
            <ClipboardList size={18} className="text-white/85" />
            <span>Lacak Status Pengiriman (Otomatis)</span>
          </button>

          <button 
            onClick={() => setTab('catalog')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
          >
            <ShoppingBag size={18} />
            <span>Belanja Merch Lainnya</span>
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-sans mt-2">
          *Notifikasi pembaruan status pengantaran akan kami kirimkan secara real-time pada menu lonceng di pojok kanan atas.
        </div>

      </div>
    </div>
  );
};
