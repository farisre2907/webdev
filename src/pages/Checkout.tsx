import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ClipboardCheck, ArrowLeft, Mail, User, MapPin, Loader2, Landmark } from 'lucide-react';

interface CheckoutProps {
  setTab: (tab: string, params?: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ setTab }) => {
  const { cart, products, currentUser, checkoutOrder } = useApp();
  
  const [address, setAddress] = useState('Fakultas Teknik, Gedung B Lantai 2, Universitas Merdeka');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>('pickup');
  const [phoneNumber, setPhoneNumber] = useState('+62 812-3456-7890');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4 text-center">
        <h3 className="font-bold text-lg text-slate-800">Keranjang Belanja Kosong</h3>
        <button onClick={() => setTab('catalog')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
          Jelajahi Produk
        </button>
      </div>
    );
  }

  const cartDetails = cart.map(item => {
    const p = products.find(prd => prd.id === item.productId);
    return {
      ...item,
      product: p
    };
  }).filter(item => item.product !== undefined);

  const subtotal = cartDetails.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'shipping' ? 10000 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!currentUser) {
      setErrorMessage("Harap masuk akun Terlebih Dahulu untuk melakukan checkout.");
      setTimeout(() => setTab('login'), 2000);
      return;
    }

    if (!address && deliveryMethod === 'shipping') {
      setErrorMessage("Harap masukkan alamat pengantaran fakultas untuk pengiriman.");
      return;
    }

    setIsPlacing(true);
    setErrorMessage(null);

    // Simulate database write
    setTimeout(() => {
      const fullAddr = deliveryMethod === 'pickup' ? `AMBIL DI KONTER KAMPUS (Kontak: ${phoneNumber})` : `${address} (Kontak: ${phoneNumber})`;
      const result = checkoutOrder(fullAddr);

      setIsPlacing(false);
      if (result.success) {
        // Switch to QRIS Payment Page with new OrderId!
        setTab('qris-payment', { orderId: result.orderId });
      } else {
        if (result.orderId === 'STK') {
          setErrorMessage("Mohon maaf, stok produk bermasalah atau habis terpesan oleh pembeli lain.");
        } else {
          setErrorMessage("Gagal membuat pesanan baru. Silakan coba lagi.");
        }
      }
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="checkout-page">
      <div className="max-w-4xl mx-auto">
        
        {/* Back control */}
        <button 
          onClick={() => setTab('cart')} 
          className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-semibold mb-6 transition"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Keranjang</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Konfirmasi Checkout</h1>
          <p className="text-slate-500 text-sm mt-1">Lengkapi data diri pelanggan dan ringkasan pengantaran produk merchandise.</p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 text-xs sm:text-sm shadow-xs animate-fade-in">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Client Data and Delivery options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Box 1: Customer Information */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <User size={18} className="text-indigo-600" />
                <span>Informasi Akun Pelanggan</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">NAMA LENGKAP</label>
                  <div className="bg-slate-50 rounded-xl px-4 py-2.5 text-slate-800 font-medium">
                    {currentUser?.fullName || 'Tamu / Belum Login'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">EMAIL KAMPUS</label>
                  <div className="bg-slate-50 rounded-xl px-4 py-2.5 text-slate-800 font-medium">
                    {currentUser?.email || 'guest@campus.com'}
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Fulfillment Method */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin size={18} className="text-indigo-600" />
                <span>Metode Penyerahan Barang</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Option 1: Pickup */}
                <div 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left ${
                    deliveryMethod === 'pickup' 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-slate-105 border-slate-205 border-slate-200 bg-white'
                  }`}
                  id="checkout-option-pickup"
                >
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">Ambil di Konter</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Ambil gratis langsung di Kantor Merch Hub Gedung Kemahasiswaan Kampus.</p>
                  <span className="inline-block mt-3 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">GRATIS BIAYA</span>
                </div>

                {/* Option 2: Delivery to Faculty */}
                <div 
                  onClick={() => setDeliveryMethod('shipping')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left ${
                    deliveryMethod === 'shipping' 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-slate-105 border-slate-205 border-slate-200 bg-white'
                  }`}
                  id="checkout-option-shipping"
                >
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">Antar ke Fakultas</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Kurir internal kami akan mengantar merch ke depan ruang kuliah fakultas Anda.</p>
                  <span className="inline-block mt-3 bg-slate-100 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">IDR 10.000</span>
                </div>
              </div>

              {/* Dynamic input field depending on choice */}
              <div className="space-y-3 pt-3">
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">NOMOR STR/WHATSAPP BISA DIHUBUNGI</label>
                  <input 
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition animate-all"
                  />
                </div>

                {deliveryMethod === 'shipping' && (
                  <div className="animate-fade-in">
                    <label className="text-slate-400 font-mono text-[10px] block mb-1">ALAMAT DETAIL PENYERAHAN / FAKULTAS</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition animate-all"
                      placeholder="Contoh: Gedung C, Ruang Dosen Psikologi Lt.1, Universitas Merdeka..."
                    />
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Checkout Items and order placement action */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ClipboardCheck size={18} className="text-indigo-600 text-left" />
                <span>Ringkasan Pesanan Merch</span>
              </h2>

              {/* Items listing (micro cards) */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {cartDetails.map((item) => {
                  const p = item.product!;
                  return (
                    <div key={item.id} className="flex space-x-2.5 items-center">
                      <img src={p.image} className="h-10 w-10 shrink-0 object-cover rounded-md border border-slate-100" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{p.productName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.quantity} x Rp {p.price.toLocaleString('id-ID')}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-800 font-mono">Rp {(p.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Belanja</span>
                  <span className="font-bold font-mono text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan/Kurir</span>
                  <span className="font-bold font-mono text-slate-800">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-slate-100 my-2 pt-3 flex justify-between text-base">
                  <span className="font-bold text-slate-950">Total Pembayaran</span>
                  <span className="font-black text-indigo-600 font-mono">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Submit Checkout button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm mt-4 disabled:opacity-75 cursor-pointer"
                id="place-order-button"
              >
                {isPlacing ? (
                  <>
                    <Loader2 className="animate-spin text-white/80" size={18} />
                    <span>Memproses Pesanan...</span>
                  </>
                ) : (
                  <>
                    <Landmark size={18} className="text-white/80" />
                    <span>Lanjut ke Pembayaran QRIS</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Simulasi aman QRIS Bank Nasional Indonesia.</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
