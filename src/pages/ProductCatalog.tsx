import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, ArrowUpDown, Tag, Percent, RefreshCw, Eye } from 'lucide-react';

interface ProductCatalogProps {
  initialCategoryId?: string;
  setTab: (tab: string, params?: any) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialCategoryId = '', setTab }) => {
  const { products, categories } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(prd => {
      const matchSearch = prd.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prd.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === '' || prd.categoryId === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortOption === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortOption === 'name-asc') {
      return list.sort((a, b) => a.productName.localeCompare(b.productName));
    }
    return list; // default / latest
  }, [filteredProducts, sortOption]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortOption('default');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="product-catalog-page">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Head */}
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Katalog Produk Kampus</h1>
          <p className="text-slate-500 text-sm mt-1">Dapatkan koleksi exclusive merchandise resmi universitas dengan desain original terbaru.</p>
        </div>

        {/* Filters Top Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari kaos, hoodie, tumbler..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
              id="search-product-input"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative md:col-span-3">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Tag size={16} className="text-slate-400" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-700 focus:outline-hidden cursor-pointer"
                id="filter-category-select"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative md:col-span-3">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <ArrowUpDown size={16} className="text-slate-400" />
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-700 focus:outline-hidden cursor-pointer"
                id="sort-price-select"
              >
                <option value="default">Urutkan: Terbaru</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="name-asc">Nama: A ke Z</option>
              </select>
            </div>
          </div>

          {/* Reset button */}
          <div className="md:col-span-1 text-center font-sans">
            <button 
              onClick={handleResetFilters}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 flex items-center justify-center mx-auto transition"
              title="Reset Filter"
            >
              <RefreshCw size={16} />
            </button>
          </div>

        </div>

        {/* Catalog Main Content */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
            <SlidersHorizontal size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-slate-800">Tidak ada produk ditemukan</h3>
            <p className="text-slate-500 text-sm mt-1">Coba sesuaikan kata pencarian atau pilih kategori lain.</p>
            <button 
              onClick={handleResetFilters}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-xs font-mono text-slate-500 text-right">
              Menampilkan {sortedProducts.length} produk
            </div>
            
            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="product-grid">
              {sortedProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                
                return (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    id={`product-card-${p.id}`}
                  >
                    <div className="relative pt-[90%] overflow-hidden bg-slate-50 shrink-0">
                      <img 
                        src={p.image} 
                        alt={p.productName} 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                      />
                      
                      {/* Stock Level badging */}
                      {isOutOfStock ? (
                        <span className="absolute top-3 left-3 bg-red-605 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">HABIS</span>
                      ) : p.stock <= 5 ? (
                        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono animate-pulse">STOK MENIPIS ({p.stock})</span>
                      ) : null}

                      {/* Display Category badge on product photo */}
                      <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-lg font-medium">
                        {categories.find(c => c.id === p.categoryId)?.categoryName || 'Merch'}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition tracking-tight">
                          {p.productName}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col space-y-3">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-mono">HARGA REKOMENDASI</span>
                            <span className="font-bold text-sm sm:text-base text-slate-900">
                              Rp {p.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">Stok: {p.stock} pcs</span>
                        </div>

                        <button 
                          onClick={() => setTab('product-detail', { productId: p.id })}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                            isOutOfStock 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xs'
                          }`}
                          disabled={isOutOfStock}
                        >
                          <Eye size={14} />
                          <span>Lihat Detail</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
