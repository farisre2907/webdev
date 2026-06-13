import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, TerminalSquare } from 'lucide-react';

interface CartProps {
  setTab: (tab: string, params?: any) => void;
}

export const Cart: React.FC<CartProps> = ({ setTab }) => {
  const { cart, products, updateCartQuantity, removeFromCart, categories } = useApp();

  // Find detailed fields for cart items
  const cartDetails = cart.map(item => {
    const p = products.find(prd => prd.id === item.productId);
    return {
      ...item,
      product: p
    };
  }).filter(item => item.product !== undefined);

  const totalPrice = cartDetails.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const handleCheckoutClick = () => {
    setTab('checkout');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="cart-page">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Keranjang Belanja</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola dan tinjau item merchandise sebelum masuk ke menu checkout.</p>
        </div>

        {cartDetails.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <ShoppingBag size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-800">Keranjang Anda masih kosong</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Pilih merchandise kesayanganmu dari katalog ketersediaan produk kami sekarang.</p>
            <button 
              onClick={() => setTab('catalog')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-sm"
              id="start-shopping-empty-cart"
            >
              Jelajahi Katalog Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartDetails.map((item) => {
                const p = item.product!;
                const category = categories.find(c => c.id === p.categoryId);
                
                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center space-x-4 hover:border-indigo-200 transition duration-150"
                    id={`cart-item-${p.id}`}
                  >
                    {/* Thumbnail picture */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                      <img src={p.image} alt={p.productName} className="h-full w-full object-cover" />
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">{category?.categoryName || 'Merchandise'}</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate tracking-tight">{p.productName}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-mono">ID: {p.id}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-indigo-600 font-mono">Rp {p.price.toLocaleString('id-ID')}</span>
                        <span className="text-[11px] text-slate-400 font-mono">Stok: {p.stock} pcs</span>
                      </div>
                    </div>

                    {/* Right: Quantity Adjusters + Delete Button */}
                    <div className="flex flex-col items-end justify-between space-y-4 shrink-0">
                      {/* Trash button */}
                      <button 
                        onClick={() => removeFromCart(p.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg hover:text-rose-600 transition"
                        title="Hapus barang"
                        id={`remove-cart-item-${p.id}`}
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Plus minus counter */}
                      <div className="flex items-center space-x-0.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                        <button 
                          onClick={() => updateCartQuantity(p.id, item.quantity - 1)}
                          className="p-1 hover:bg-white text-slate-500 hover:text-slate-800 rounded transition"
                          id={`decrease-qty-${p.id}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(p.id, item.quantity + 1)}
                          className="p-1 hover:bg-white text-slate-500 hover:text-slate-800 rounded"
                          id={`increase-qty-${p.id}`}
                          disabled={item.quantity >= p.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Right Column: Checkout Summary box */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">Ringkasan Sesi</h3>
              
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Jumlah Barang</span>
                  <span className="font-bold text-slate-800 font-mono">{cart.reduce((s, i) => s + i.quantity, 0)} item</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN (0%/Siswa)</span>
                  <span className="font-bold text-slate-800 font-mono">Rp 0</span>
                </div>
                <div className="flex justify-between">
                  <span>Asuransi Layanan</span>
                  <span className="text-emerald-500 font-bold font-mono">Gratis</span>
                </div>
                <div className="border-t border-slate-100 my-2 pt-3 flex justify-between text-base">
                  <span className="font-bold text-slate-950">Total Harga</span>
                  <span className="font-extrabold text-indigo-605 text-indigo-600 font-mono">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Action buttons */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm mt-4 cursor-pointer"
                id="checkout-button"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => setTab('catalog')}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-800 font-semibold transition mt-2 block"
              >
                Kembali Belanja
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
