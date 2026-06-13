import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ChevronDown, ChevronUp, PackageCheck, Truck, ClipboardList, Clock, CheckCircle2, XCircle, Gift } from 'lucide-react';

interface OrderHistoryProps {
  setTab: (tab: string, params?: any) => void;
  focusOrderId?: string;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ setTab, focusOrderId }) => {
  const { orders, products, currentUser } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(focusOrderId || null);

  // Filter orders related to active customer only
  const myOrders = orders.filter(o => o.userId === (currentUser?.id || ''));

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Payment': return 'bg-indigo-50 text-indigo-705 text-indigo-700 border-indigo-200';
      case 'Processing': return 'bg-cyan-50 text-cyan-800 border-cyan-200 animate-pulse';
      case 'Ready for Pickup': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Live progress step generation
  const getProgressSteps = (orderStatus: string) => {
    const steps = [
      { key: 'created', label: 'Pesanan Dibuat', desc: 'Nota belanja berhasil dicatat', done: true },
      { key: 'payment', label: 'Pembayaran Lunas', desc: 'Simulasi QRIS berhasil tervalidasi', done: orderStatus !== 'Pending Payment' },
      { key: 'prep', label: 'Disiapkan Staff', desc: 'Barang sedang dipacking oleh Staff', done: ['Processing', 'Ready for Pickup', 'Completed'].includes(orderStatus) },
      { key: 'pickup', label: 'Siap Diambil/Dikirim', desc: 'Siap di Gedung Kemahasiswaan', done: ['Ready for Pickup', 'Completed'].includes(orderStatus) },
      { key: 'completed', label: 'Selesai', desc: 'Barang diserahkan ke tangan Anda', done: orderStatus === 'Completed' }
    ];
    
    // Adjust steps if cancelled
    if (orderStatus === 'Cancelled') {
      return [
        { key: 'created', label: 'Pesanan Dibuat', desc: 'Nota belanja dicatat', done: true },
        { key: 'cancelled', label: 'Pesanan Dibatalkan', desc: 'Pengembalian / pembatalan diajukan', done: true, isError: true }
      ];
    }
    
    return steps;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="order-history-page">
      <div className="max-w-4xl mx-auto">
        
        {/* Head Banner */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Status & Riwayat Pesanan</h1>
            <p className="text-slate-500 text-sm mt-1">Lacak status pembeli Anda secara real-time dan tinjau riwayat cetak invoice lama.</p>
          </div>
          <button 
            onClick={() => setTab('catalog')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition self-start cursor-pointer shadow-sm"
          >
            Beli Merchandise Baru
          </button>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <ClipboardList size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-800">Anda belum memiliki riwayat pembelian</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Mulai belanja produk merch kampus Anda sekarang juga.</p>
            <button onClick={() => setTab('catalog')} className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs">
              Mulai Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const steps = getProgressSteps(order.orderStatus);
              const activeStepIndex = steps.filter(s => s.done).length - 1;

              return (
                <div 
                  key={order.id}
                  className={`bg-white rounded-3xl border transition-all duration-150 ${
                    isExpanded ? 'border-indigo-500 shadow-md ring-1 ring-indigo-405 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-100 shadow-xs'
                  }`}
                  id={`order-card-${order.id}`}
                >
                  
                  {/* Card Front face Header clickable */}
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-mono text-sm sm:text-base">#{order.id}</span>
                        <span className="text-slate-400 text-xs">|</span>
                        <span className="text-slate-500 text-xs font-mono">{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>Total Belanja:</span>
                        <strong className="text-indigo-600 font-extrabold font-mono">Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
                        <span>({order.items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className={`px-3 py-1 text-xs rounded-full font-bold border ${getOrderStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Tracker and Content section */}
                  {isExpanded && (
                    <div className="border-t border-slate-50 p-6 bg-slate-50/30 rounded-b-3xl space-y-8 animate-fade-in text-left">
                      
                      {/* Interactive shipment tracking graphics */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xs text-slate-400 font-mono tracking-wider uppercase">PELACAKAN PENGIRIMAN OTOMATIS</h4>
                        
                        <div className="relative pl-6 sm:pl-0 grid grid-cols-1 sm:grid-cols-5 gap-6">
                          
                          {/* Desktop horizontal path element */}
                          <div className="hidden sm:block absolute top-[11px] left-8 right-8 h-1 bg-slate-200 z-0">
                            <div 
                              className="h-full bg-indigo-600 transition-all duration-500"
                              style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
                            ></div>
                          </div>

                          {steps.map((st, sidx) => {
                            const isDone = st.done;
                            const isCurrent = sidx === activeStepIndex;
                            
                            return (
                              <div key={st.key} className="relative flex sm:flex-col items-start sm:items-center text-left sm:text-center z-10 gap-3 sm:gap-2">
                                
                                {/* Vertical dotted connector for mobile only */}
                                {sidx < steps.length - 1 && (
                                  <div className="absolute top-6 left-3 w-0.5 bottom-0 bg-slate-200 sm:hidden z-0"></div>
                                )}

                                {/* Dot circle indicator */}
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors border-2 ${
                                  st.isError 
                                    ? 'bg-rose-500 text-white border-rose-600'
                                    : isDone 
                                      ? 'bg-indigo-605 bg-indigo-650 bg-indigo-600 text-white border-indigo-600' 
                                      : 'bg-white text-slate-300 border-slate-200'
                                }`}>
                                  {st.isError ? '!' : sidx + 1}
                                </div>

                                <div className="space-y-0.5">
                                  <h5 className={`font-bold text-xs ${isCurrent ? 'text-indigo-600 font-black' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {st.label}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 leading-normal max-w-[130px] sm:mx-auto">
                                    {st.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items summaries listing inside order */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h4 className="font-bold text-xs text-slate-400 font-mono tracking-wider uppercase">MAKLUMAT BARANG BELANJAAN</h4>
                        
                        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-xs">
                          {order.items.map((it) => {
                            const prd = products.find(p => p.id === it.productId);
                            return (
                              <div key={it.id} className="p-4 flex items-center justify-between gap-4 text-xs sm:text-sm">
                                <div className="flex items-center space-x-3 min-w-0">
                                  <img src={prd?.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-slate-100" />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate tracking-tight">{prd?.productName || 'Merchandise Unlisted'}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">Kuantitas: {it.quantity} x Rp {it.price.toLocaleString('id-ID')}</p>
                                  </div>
                                </div>
                                <span className="font-bold font-mono text-slate-800 shrink-0">
                                  Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Direct Support Contact / Pickup instruction guide */}
                      {order.orderStatus === 'Ready for Pickup' && (
                        <div className="bg-indigo-50 border border-indigo-150 p-4.5 rounded-2xl text-xs text-indigo-850 flex items-start space-x-2.5 animate-pulse">
                          <Gift className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                          <div>
                            <p className="font-bold text-indigo-900 text-sm">Pesanan Siap Diambil!</p>
                            <p className="mt-1 leading-normal text-slate-600">Terima kasih atas pembayaran Anda! Pesanan ini siap Anda bawa pulang. Harap kunjungi <strong>Gedung Kemahasiswaan Lt.1, Universitas Merdeka</strong> dan tunjukkan nomor invoice <strong>#{order.id}</strong> kepada kasir penjaga.</p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
