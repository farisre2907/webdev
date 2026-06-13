import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Heart, Share2, Plus, Minus, Info, ClipboardList } from 'lucide-react';

interface ProductDetailProps {
  productId: string;
  setTab: (tab: string, params?: any) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, setTab }) => {
  const { products, categories, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'size'>('desc');
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4 text-center">
        <h3 className="font-bold text-lg text-slate-800">Produk tidak ditemukan</h3>
        <button onClick={() => setTab('catalog')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // Pre-configured galleries for products or backup using the main image
  const gallery = product.images || [product.image];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  const category = categories.find(c => c.id === product.categoryId);
  const isOutOfStock = product.stock <= 0;

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAddedMessage(`Berhasil menambahkan ${quantity} item ke keranjang belanja.`);
    setTimeout(() => setAddedMessage(null), 4000);
  };

  return (
    <div className="bg-slate-55 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="product-detail-page">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <button 
          onClick={() => setTab('catalog')} 
          className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-semibold mb-6 transition"
        >
          <ChevronLeft size={16} />
          <span>Kembali ke Katalog Produk</span>
        </button>

        {/* Success Alert Banner */}
        {addedMessage && (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-2xl mb-6 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <ShieldCheck className="text-emerald-500 animate-bounce" size={18} />
              <span>{addedMessage}</span>
            </div>
            <button 
              onClick={() => setTab('cart')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
            >
              Lihat Keranjang
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left: Product Images Group */}
          <div className="space-y-4">
            {/* Active Display */}
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center relative">
              <img src={selectedImage} alt={product.productName} className="w-full h-full object-cover" />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm font-mono tracking-wider shadow">STOK HABIS</span>
                </div>
              )}
            </div>

            {/* Thumbnails Gallery */}
            {gallery.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1" id="product-gallery">
                {gallery.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImage === img ? 'border-indigo-600 shadow-sm' : 'border-slate-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail view" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Buy controls */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Header segment */}
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2">
                <Info size={10} className="text-indigo-600" />
                <span>Kategori: {category?.categoryName || 'Sertifikasi'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.productName}
              </h1>
              <p className="font-mono text-xs text-slate-400 mt-1">ID PRODUK: {product.id}</p>
              
              {/* Product Pricing and Stock availability */}
              <div className="mt-4 bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100 shadow-inner">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">HARGA RESMI NETT</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-950">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono text-right">KETERSEDIAAN</span>
                  <span className={`text-xs sm:text-sm font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.stock > 0 ? `Tersedia (${product.stock} pcs)` : 'Habis Terjual'}
                  </span>
                </div>
              </div>
            </div>

            {/* Features Info Box */}
            <div className="border border-slate-100 rounded-2xl p-4 space-y-3.5 bg-slate-50/50">
              {/* Tabs list */}
              <div className="flex border-b border-slate-100 text-xs font-semibold pb-1.5 space-x-4">
                <button 
                  onClick={() => setActiveTab('desc')}
                  className={`pb-1 transition cursor-pointer ${activeTab === 'desc' ? 'text-indigo-600 border-b-2 border-indigo-605 border-indigo-600' : 'text-slate-400'}`}
                >
                  Deskripsi
                </button>
                <button 
                  onClick={() => setActiveTab('spec')}
                  className={`pb-1 transition cursor-pointer ${activeTab === 'spec' ? 'text-indigo-600 border-b-2 border-indigo-605 border-indigo-600' : 'text-slate-400'}`}
                >
                  Spesifikasi
                </button>
                <button 
                  onClick={() => setActiveTab('size')}
                  className={`pb-1 transition cursor-pointer ${activeTab === 'size' ? 'text-indigo-600 border-b-2 border-indigo-605 border-indigo-600' : 'text-slate-400'}`}
                >
                  Panduan Ukuran
                </button>
              </div>

              {/* Tab render details */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[80px]">
                {activeTab === 'desc' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'spec' && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Bahan Dasar: Premium Soft Cotton / Heavy canvas / Poly-fused Acrylic</li>
                    <li>Metode Cetak: High-density plastisol paint / Gold Embroidery thread</li>
                    <li>Sertifikasi: Original Campus Licensed Merchandise</li>
                    <li>Aman dicuci di mesin cuci dengan suhu air dingin</li>
                  </ul>
                )}
                {activeTab === 'size' && (
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 text-xs text-left">Tabel Ukuran Umum (Kaos/Hoodie):</p>
                    <p className="font-mono text-[11px] text-left">
                      - S : Lebar Dada 48cm, Panjang Badan 68cm <br />
                      - M : Lebar Dada 50cm, Panjang Badan 71cm <br />
                      - L : Lebar Dada 52cm, Panjang Badan 73cm <br />
                      - XL : Lebar Dada 54cm, Panjang Badan 75cm
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cart adding Interface controls */}
            {!isOutOfStock && (
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-700">Jumlah Pembelian:</span>
                  
                  {/* Plus / Minus Counter */}
                  <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-1 bg-white">
                    <button 
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="p-1.5 hover:bg-slate-50 text-slate-500 rounded-lg disabled:opacity-40 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-mono font-bold text-slate-800">{quantity}</span>
                    <button 
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock}
                      className="p-1.5 hover:bg-slate-50 text-slate-500 rounded-lg disabled:opacity-40 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal preview dynamic */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>Subtotal ({quantity} barang):</span>
                  <span className="font-bold text-sm text-slate-700">Rp {(product.price * quantity).toLocaleString('id-ID')}</span>
                </div>

                {/* Submit Action */}
                <div className="flex space-x-3">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-505 hover:shadow-indigo-500/10 transition flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
                    id="add-to-cart-button"
                  >
                    <ShoppingCart size={18} />
                    <span>Masukkan ke Keranjang</span>
                  </button>
                </div>
              </div>
            )}

            {/* Return policies trust banner */}
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="text-emerald-500 flex items-center space-x-0.5 font-semibold">
                <ShieldCheck size={14} />
                <span>100% Produk Original Kampus</span>
              </span>
              <span>•</span>
              <span>Dapat ditukar jika ada cacat produksi</span>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};
