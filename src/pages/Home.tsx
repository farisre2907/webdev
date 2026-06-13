import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShoppingBag, BadgeAlert, Star, TrendingUp, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  setTab: (tab: string, params?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ setTab }) => {
  const { products, categories } = useApp();

  // Highlight 3 featured items
  const featured = products.slice(0, 3);
  // Best sellers
  const bestSellers = products.slice(4, 7);
  // New arrivals
  const newArrivals = products.slice(2, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="home-page">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white min-h-[500px] flex items-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono shadow-sm">
              <Sparkles size={14} className="animate-spin text-indigo-400" />
              <span>KOLEKSI TERBARU SUDAH MENDARAT</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Tunjukkan Identitas <br />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-white bg-clip-text text-transparent">
                Kampus Kebanggaanmu!
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Koleksi merchandise resmi premium dari kemeja, kaos, hoodie, topi hingga gantungan kunci yang nyaman dan berkelas untuk menunjang gaya hidup akademismu sehari-hari.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setTab('catalog')} 
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Mulai Belanja</span>
                <ShoppingBag className="ml-2" size={16} />
              </button>
              <button 
                onClick={() => setTab('catalog', { categoryId: 'CAT-202' })} 
                className="inline-flex items-center justify-center bg-transparent border-2 border-slate-700 hover:border-slate-500 text-white font-medium px-6 py-3 rounded-xl text-sm hover:bg-slate-800/50 transition-all duration-150 cursor-pointer"
              >
                <span>Lihat Koleksi Hoodie</span>
                <ArrowRight className="ml-2" size={16} />
              </button>
            </div>

            {/* Micro Benefits Banner */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={18} className="text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium font-sans">Bahan Premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={18} className="text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium font-sans">Desain Eksklusif</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={18} className="text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium font-sans">Banyak Promo</span>
              </div>
            </div>
            
          </motion.div>

          {/* Visual Showcase (Featured item card overlap) */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-end relative"
          >
            <div className="relative w-[400px] h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 z-10">
              <img 
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80" 
                alt="Highlight Merch" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent flex flex-col justify-end p-6">
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max mb-2">HOT DEAL</span>
                <h3 className="text-xl font-bold text-white mb-1">Signature Varsity Hoodie</h3>
                <p className="text-slate-300 text-xs mb-3 font-medium">Heavyweight fleece jacket with high-density embroidered crest.</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-400 font-bold text-lg">Rp 245.000</span>
                  <button 
                    onClick={() => setTab('product-detail', { productId: 'PRD-103' })}
                    className="bg-white/10 hover:bg-white/20 text-white hover:text-indigo-400 p-2 rounded-lg transition"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
            {/* Background geometric design elements */}
            <div className="absolute top-10 right-20 w-[380px] h-[380px] border-2 border-indigo-500/30 rounded-2xl -rotate-6 z-0 pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-indigo-550/20 rounded-2xl shadow-lg transform -translate-y-1/2 -rotate-12 blur-xs"></div>
          </motion.div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-12 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Kategori Merchandise</h2>
              <p className="text-sm text-slate-500 font-medium">Pilih kategori produk kampus yang ingin kamu jelajahi</p>
            </div>
            <button onClick={() => setTab('catalog')} className="mt-4 md:mt-0 text-indigo-600 font-semibold hover:text-indigo-700 text-sm flex items-center space-x-1 transition cursor-pointer">
              <span>Semua Kategori</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              return (
                <div 
                  key={cat.id}
                  onClick={() => setTab('catalog', { categoryId: cat.id })}
                  className="bg-slate-50 hover:bg-indigo-50/30 rounded-2xl p-6 text-center border border-slate-100 hover:border-indigo-200 cursor-pointer shadow-xs hover:shadow-xs transition-all duration-200 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-slate-900 group-hover:bg-indigo-600 group-hover:text-white font-bold text-white flex items-center justify-center text-lg mx-auto mb-3 transition">
                    {cat.categoryName.charAt(0)}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-indigo-600 transition">{cat.categoryName}</h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="text-indigo-650 text-indigo-650 text-indigo-600 animate-pulse" size={20} />
            <h2 className="text-2xl font-bold text-slate-900">Produk Unggulan</h2>
          </div>
          <p className="text-sm text-slate-500 mb-8 -mt-1 font-medium">Paling direkomendasikan dan disukai oleh mahasiswa kampus</p>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full group"
              >
                <div className="relative pt-[80%] overflow-hidden bg-slate-50">
                  <img 
                    src={product.image} 
                    alt={product.productName} 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-305 transition-all"
                  />
                  <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs font-mono">
                    UNGGULAN
                  </span>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider font-mono">
                      {categories.find(c => c.id === product.categoryId)?.categoryName || 'General'}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 mt-1 line-clamp-1">
                      {product.productName}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">Harga Produk</p>
                      <p className="font-bold text-base text-slate-900">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button 
                      onClick={() => setTab('product-detail', { productId: product.id })}
                      className="bg-slate-900 text-white hover:bg-indigo-650 hover:bg-indigo-600 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Detail Produk
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-indigo-400" size={20} />
            <h2 className="text-2xl font-bold tracking-tight">Paling Laris (Best Sellers)</h2>
          </div>
          <p className="text-sm text-slate-400 mb-10">Daftar produk dengan tingkat penjualan tertinggi minggu ini</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((product) => (
              <div 
                key={product.id}
                className="bg-slate-800/20 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-sm flex h-32 hover:bg-slate-800/40 transition group duration-200"
              >
                <div className="w-1/3 aspect-square relative shrink-0">
                  <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">LARIS</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition">{product.productName}</h3>
                    <p className="text-indigo-400 text-xs font-bold font-mono mt-0.5">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Sisa Stok: {product.stock}</span>
                    <button 
                      onClick={() => setTab('product-detail', { productId: product.id })}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 transition cursor-pointer"
                    >
                      <span>Beli</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Sparkles className="text-indigo-600" size={20} />
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Koleksi Terbaru</h2>
              </div>
              <p className="text-sm text-slate-500 font-medium">Koleksi original yang baru saja diterbitkan di platform store</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <div 
                key={product.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative pt-[70%] overflow-hidden bg-slate-100 rounded-xl mb-4">
                    <img src={product.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">NEW</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1 leading-snug truncate">{product.productName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{product.description}</p>
                </div>
                <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Rp {product.price.toLocaleString('id-ID')}</span>
                  <button 
                    onClick={() => setTab('product-detail', { productId: product.id })}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:bg-indigo-50 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
