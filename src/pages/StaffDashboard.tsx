import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, Order, OrderStatus, User } from '../types';
import { 
  Briefcase, Plus, Edit2, Trash2, Eye, TrendingUp, ShoppingCart, 
  Users, BarChart3, Tag, Package, ClipboardList, Search, 
  Check, X, AlertCircle, Calendar, RefreshCcw, DollarSign, ArrowUpRight 
} from 'lucide-react';

interface StaffDashboardProps {
  setTab: (tab: string, params?: any) => void;
  initialSubTab?: string;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ setTab, initialSubTab = 'summary' }) => {
  const { 
    products, categories, orders, users, 
    addProduct, editProduct, deleteProduct,
    addCategory, editCategory, deleteCategory,
    updateOrderStatus
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  // States for CRUD Products
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productCatId, setProductCatId] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0);
  const [productImage, setProductImage] = useState('');
  const [productDesc, setProductDesc] = useState('');

  // States for CRUD Categories
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Search/Filter states inside Staff
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('ALL');

  // Revenue computations
  const customers = useMemo(() => users.filter(u => u.role === 'customer'), [users]);
  const paidOrders = useMemo(() => orders.filter(o => o.paymentStatus === 'Paid'), [orders]);
  
  const totalRevenue = useMemo(() => {
    return paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [paidOrders]);

  const bestSellingProduct = useMemo(() => {
    const counts: { [key: string]: number } = {};
    paidOrders.forEach(o => {
      o.items.forEach(it => {
        counts[it.productId] = (counts[it.productId] || 0) + it.quantity;
      });
    });
    
    let bestProductId = '';
    let maxQty = 0;
    Object.keys(counts).forEach(pid => {
      if (counts[pid] > maxQty) {
        maxQty = counts[pid];
        bestProductId = pid;
      }
    });

    const prdObj = products.find(p => p.id === bestProductId);
    return prdObj ? `${prdObj.productName} (${maxQty} Terjual)` : 'Belum Ada Transaksi';
  }, [paidOrders, products]);

  // Daily, Weekly, Monthly Revenue (simulated dynamically)
  const revenueStats = useMemo(() => {
    const daily = totalRevenue * 0.15; // 15% estimated
    const weekly = totalRevenue * 0.45; // 45% estimated
    const monthly = totalRevenue; // Total is monthly in this context
    return { daily, weekly, monthly };
  }, [totalRevenue]);

  // Chart data points
  const recentOrdersForChart = useMemo(() => {
    return orders.slice(0, 6).reverse();
  }, [orders]);

  // Handlers for Products CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductName('');
    setProductCatId(categories[0]?.id || '');
    setProductPrice(50000);
    setProductStock(30);
    setProductImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80');
    setProductDesc('');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductName(p.productName);
    setProductCatId(p.categoryId);
    setProductPrice(p.price);
    setProductStock(p.stock);
    setProductImage(p.image);
    setProductDesc(p.description);
    setShowProductModal(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productCatId || productPrice <= 0) return;

    if (editingProduct) {
      editProduct(editingProduct.id, {
        productName,
        categoryId: productCatId,
        price: Number(productPrice),
        stock: Number(productStock),
        image: productImage,
        description: productDesc
      });
    } else {
      addProduct({
        productName,
        categoryId: productCatId,
        price: Number(productPrice),
        stock: Number(productStock),
        image: productImage,
        description: productDesc,
        images: [productImage]
      });
    }
    setShowProductModal(false);
  };

  // Handlers for Categories CRUD
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setShowCatModal(true);
  };

  const handleOpenEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCatName(c.categoryName);
    setCatDesc(c.description);
    setShowCatModal(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    if (editingCategory) {
      editCategory(editingCategory.id, catName, catDesc);
    } else {
      addCategory(catName, catDesc);
    }
    setShowCatModal(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen grid grid-cols-1 md:grid-cols-12" id="staff-workspace">
      
       {/* LEFT ELEMENT: Staff Sidebar navigation */}
      <aside className="md:col-span-3 bg-slate-900 text-white p-6 space-y-8 flex flex-col justify-between shadow-lg">
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-indigo-400 font-bold block text-sm font-mono tracking-wider">PANEL STAFF</span>
            <h2 className="text-lg font-black tracking-tight text-white leading-tight">Unpad Merch Hub</h2>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">EST. 2026 • CONSOLE WORKSPACE</p>
          </div>

          <nav className="space-y-1 text-xs sm:text-sm font-semibold text-left">
            <button 
              onClick={() => setActiveSubTab('summary')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition cursor-pointer ${
                activeSubTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BarChart3 size={18} />
              <span>Ringkasan & Diagram</span>
            </button>

            <button 
              onClick={() => setActiveSubTab('categories')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition cursor-pointer ${
                activeSubTab === 'categories' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
              id="staff-categories-tab"
            >
              <Tag size={18} />
              <span>Kelola Kategori</span>
            </button>

            <button 
              onClick={() => setActiveSubTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition cursor-pointer ${
                activeSubTab === 'products' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
              id="staff-products-tab"
            >
              <Package size={18} />
              <span>Kelola Produk Merch</span>
            </button>

            <button 
              onClick={() => setActiveSubTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl relative transition cursor-pointer ${
                activeSubTab === 'orders' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
              id="staff-orders-tab"
            >
              <ClipboardList size={18} />
              <span>Antrean Pesanan</span>
              {orders.filter(o => o.orderStatus === 'Processing').length > 0 && (
                <span className="absolute right-3 bg-indigo-500 border border-indigo-400 text-white font-mono font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                  {orders.filter(o => o.orderStatus === 'Processing').length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveSubTab('customers')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition cursor-pointer ${
                activeSubTab === 'customers' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users size={18} />
              <span>Daftar Pelanggan</span>
            </button>

            <button 
              onClick={() => setActiveSubTab('revenue')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition cursor-pointer ${
                activeSubTab === 'revenue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <DollarSign size={18} />
              <span>Laporan Keuangan</span>
            </button>
          </nav>
        </div>

        {/* Bottom Exit back to storefront */}
        <div className="border-t border-slate-800 pt-4 space-y-2 text-left">
          <p className="text-[10px] text-slate-500 font-mono">Simulasi Platform Aktif</p>
          <button 
            onClick={() => setTab('home')}
            className="w-full bg-slate-850 bg-slate-800 hover:bg-indigo-950 hover:text-white text-indigo-400 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Kembali ke Toko Depan
          </button>
        </div>
      </aside>

      {/* RIGHT ELEMENT: Working Window pane depending on Active Tab */}
      <main className="md:col-span-9 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* SUBTAB 1: Summary Dashboard of Stats & charts */}
        {activeSubTab === 'summary' && (
          <div className="space-y-6 text-left">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Ikhtisar Bisnis Kampus</h1>
              <p className="text-sm text-slate-500">Monitor kemajuan data inventaris, volume transaksi, dan penyerahan merchandise.</p>
            </div>

            {/* Dashboard Cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1: Total Products */}
              <div className="bg-white rounded-2xl border border-slate-205 border-slate-200/60 p-5 shadow-xs flex items-center space-x-4">
                <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Package size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">TOTAL PRODUK</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{products.length}</span>
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs flex items-center space-x-4">
                <div className="p-3.5 bg-blue-100 text-blue-500 rounded-xl">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">TOTAL PESANAN</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{orders.length}</span>
                </div>
              </div>

              {/* Card 3: Total Customers */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs flex items-center space-x-4">
                <div className="p-3.5 bg-emerald-100 text-emerald-500 rounded-xl">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">TOTAL CUSTOMER</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{customers.length}</span>
                </div>
              </div>

              {/* Card 4: Total Revenue */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs flex items-center space-x-4">
                <div className="p-3.5 bg-rose-100 text-rose-500 rounded-xl">
                  <DollarSign size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">TOTAL KEUANGAN</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 font-mono truncate">Rp {totalRevenue.toLocaleString('id-ID')}</span>
                </div>
              </div>

            </div>

            {/* Dashboard Statistics Charts block */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-base flex items-center space-x-2">
                <TrendingUp size={16} className="text-indigo-600" />
                <span>Statistik Grafik Penjualan (Aesthetic Simulated Chart)</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Chart Segment A: Revenue Chart */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-400 font-mono tracking-wider">A. REVENUE GROWTH (OMSET MINGGUAN)</h4>
                  <div className="bg-slate-50 border border-slate-100 h-60 rounded-2xl p-4 flex items-end justify-between relative shadow-inner">
                    
                    {/* Fake Y Axis guides */}
                    <div className="absolute left-3 right-3 top-3 bottom-8 flex flex-col justify-between border-l border-dashed border-slate-200 pointer-events-none text-[9px] text-slate-400 font-mono pl-1">
                      <span>Rp 1.000.000</span>
                      <span>Rp 500.000</span>
                      <span>Rp 250.000</span>
                    </div>

                    {/* Chart Bars (Dynamic depending on actual revenue) */}
                    <div className="relative w-full h-full flex items-end justify-around pl-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 sm:w-10 bg-slate-350 bg-slate-400 rounded-t-md hover:bg-indigo-400 transition-colors cursor-pointer" style={{ height: '40px' }}></div>
                        <span className="text-[9px] font-mono text-slate-400 mt-2">Minggu 1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 sm:w-10 bg-slate-400 rounded-t-md hover:bg-indigo-400 transition-colors cursor-pointer" style={{ height: '70px' }}></div>
                        <span className="text-[9px] font-mono text-slate-400 mt-2">Minggu 2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 sm:w-10 bg-slate-400 rounded-t-md hover:bg-indigo-400 transition-colors cursor-pointer" style={{ height: '110px' }}></div>
                        <span className="text-[9px] font-mono text-slate-400 mt-2">Minggu 3</span>
                      </div>
                      <div className="flex flex-col items-center">
                        {/* Highlights real current week revenue */}
                        <div className="w-8 sm:w-10 bg-indigo-600 rounded-t-md hover:bg-indigo-500 transition-all cursor-pointer shadow-md" style={{ height: `${Math.max(50, Math.min(180, (totalRevenue / 1000000) * 150))}px` }}></div>
                        <span className="text-[9px] font-semibold font-mono text-indigo-600 mt-2">Minggu 4</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Chart Segment B: Orders Chart */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-400 font-mono tracking-wider">B. RECENT TRANSACTIONS VOLUMES (KUOTA ANTRIEAN)</h4>
                  <div className="bg-slate-50 border border-slate-100 h-60 rounded-2xl p-6 flex flex-col justify-between shadow-inner">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs border-b border-slate-200/60 pb-2 font-mono">
                        <span className="font-bold">STATUS ANTREAN</span>
                        <span className="text-indigo-600 font-extrabold">{orders.length} TOTAL INVOICES</span>
                      </div>
                      
                      {/* Interactive breakdown graph rows */}
                      <div className="space-y-2.5 pt-2">
                        {['Processing', 'Ready for Pickup', 'Completed', 'Cancelled'].map(st => {
                          const count = orders.filter(o => o.orderStatus === st).length;
                          const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                          
                          return (
                            <div key={st} className="space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600 font-sans">
                                <span className="font-semibold">{st}</span>
                                <span className="font-bold font-mono">{count} order ({Math.ceil(pct)}%)</span>
                              </div>
                              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-900 rounded-full" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Product Sales summary section */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 text-left space-y-2">
                <h4 className="font-bold text-xs text-slate-500 font-mono tracking-wider">C. PRODUCT SALES SUMMARY (PRODUK TERLARIS)</h4>
                <div className="flex justify-between items-center bg-white border border-slate-150 rounded-xl p-4 shadow-xs">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{bestSellingProduct}</p>
                    <p className="text-[10px] text-slate-400">Total transaksi selesai dengan konfirmasi pembayaran otomatis QRIS.</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px] px-2.5 py-1 rounded-lg">LIVE RECORD</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 2: Category CRUD Section */}
        {activeSubTab === 'categories' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kategori Merchandise Kampus</h1>
                <p className="text-sm text-slate-500">Buat, modifikasi, dan atur penamaan segmentasi merch official.</p>
              </div>
              <button 
                onClick={handleOpenAddCategory}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition self-start flex items-center space-x-1 cursor-pointer shadow-sm"
                id="add-category-button"
              >
                <Plus size={14} />
                <span>Kategori Baru</span>
              </button>
            </div>

            {/* Category Cards layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-mono uppercase">{cat.id}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Produk: {products.filter(p => p.categoryId === cat.id).length} pcs</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{cat.categoryName}</h3>
                    <p className="text-xs text-slate-500 leading-normal">{cat.description || 'Tidak ada deskripsi rinci.'}</p>
                  </div>

                  <div className="border-t border-slate-50 pt-3.5 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 hover:bg-orange-50 text-orange-600 rounded-lg transition"
                      id={`edit-category-${cat.id}`}
                    >
                      <Plus size={14} className="rotate-45" /> {/* Just look alike Edit mark */}
                      <span className="text-xs font-semibold ml-0.5">Ubah</span>
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                      id={`delete-category-${cat.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: Product CRUD Section */}
        {activeSubTab === 'products' && (
          <div className="space-y-6 text-left" id="staff-products-workspace">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Perbendaharaan Merchandise</h1>
                <p className="text-sm text-slate-500">Kelola rincian gambar, deskripsi penawaran, penyesuaian harga serta stok.</p>
              </div>
              <button 
                onClick={handleOpenAddProduct}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition self-start flex items-center space-x-1 cursor-pointer shadow-sm"
                id="add-merch-product-button"
              >
                <Plus size={14} />
                <span>Merchandise Baru</span>
              </button>
            </div>

            {/* Search filter input inside workspace */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Cari nama produk merch..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden"
              />
            </div>

            {/* List layout grid of products */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs divide-y divide-slate-100">
              {products
                .filter(p => p.productName.toLowerCase().includes(staffSearchQuery.toLowerCase()))
                .map((p) => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  
                  return (
                    <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-slate-50/50 transition duration-150">
                      <div className="flex items-center space-x-4 min-w-0">
                        <img src={p.image} className="h-12 w-12 object-cover rounded-xl border border-slate-100 shrink-0" alt="" />
                        <div className="min-w-0">
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded font-mono uppercase leading-none inline-block mb-1">{p.id}</span>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{p.productName}</h3>
                          <p className="text-xs text-slate-500 line-clamp-1 font-sans">{cat?.categoryName || 'Sertifikasi'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto self-stretch">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-400 font-mono leading-none">HARGA RESMI</p>
                          <p className="font-bold text-xs sm:text-sm text-slate-900 font-mono mt-0.5">Rp {p.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-400 font-mono leading-none">NOMINAL STOK</p>
                          <p className={`font-bold text-xs sm:text-sm mt-0.5 ${p.stock <= 5 ? 'text-amber-500 animate-pulse' : 'text-slate-800'}`}>{p.stock} pcs</p>
                        </div>

                        {/* Interactive Edit buttons */}
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                            title="Edit"
                            id={`edit-product-${p.id}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                            title="Hapus"
                            id={`delete-product-${p.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SUBTAB 4: Order Management (Live queue tracker) */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6 text-left">
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Antrean Pengiriman & Pickup</h1>
              <p className="text-sm text-slate-500">Monitor pembayaran masukan dan mutasikan status pengantaran pelanggan Anda.</p>
            </div>

            {/* Quick status tabs filter */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {['ALL', 'Pending Payment', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'].map(flt => (
                <button 
                  key={flt}
                  onClick={() => setOrderFilter(flt)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    orderFilter === flt 
                      ? 'bg-slate-900 text-white border-slate-950' 
                      : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                  }`}
                >
                  {flt === 'ALL' ? 'Semua Status' : flt}
                </button>
              ))}
            </div>

            {/* Order queue cards lists */}
            <div className="space-y-4">
              {orders
                .filter(o => orderFilter === 'ALL' || o.orderStatus === orderFilter)
                .map((ord) => {
                  const targetClient = users.find(u => u.id === ord.userId);
                  
                  return (
                    <div key={ord.id} className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id={`staff-order-row-${ord.id}`}>
                      
                      {/* Left: Client & info */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-900 font-mono text-sm">#{ord.id}</span>
                          <span className="text-slate-350">•</span>
                          <span className="text-slate-500 text-xs">{new Date(ord.createdAt).toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">Pemesan: {targetClient?.fullName || 'Siswa Tamu'}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{targetClient?.email}</p>
                        </div>
                        
                        {/* Items count summaries */}
                        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-150 text-[11px] text-slate-600 font-mono">
                          {ord.items.map((it, idx) => {
                            const p = products.find(prd => prd.id === it.productId);
                            return (
                              <div key={idx} className="truncate select-none">
                                - {p?.productName} ({it.quantity}X)
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Mutation status controls triggers */}
                      <div className="flex flex-col items-end gap-3 self-stretch md:self-center shrink-0">
                        <div className="flex items-baseline space-x-3 w-full justify-between md:justify-end">
                          <span className="text-xs text-slate-400">Total Tagihan:</span>
                          <strong className="text-indigo-600 font-extrabold font-mono text-sm">Rp {ord.totalAmount.toLocaleString('id-ID')}</strong>
                        </div>

                        {/* Interactive dynamic Status action buttons based on Page 6 flow rules */}
                        {ord.orderStatus === 'Pending Payment' && (
                          <div className="text-[11px] font-bold text-slate-400 bg-slate-50 p-2 rounded-xl text-center">
                            Menunggu Konfirmasi Simulasi QRIS Pembeli
                          </div>
                        )}

                        {ord.orderStatus === 'Processing' && (
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => updateOrderStatus(ord.id, 'Ready for Pickup')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow transition"
                              id={`mark-ready-${ord.id}`}
                            >
                              <Check size={12} />
                              <span>Set Siap Diambil</span>
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(ord.id, 'Cancelled')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition"
                              id={`mark-cancel-${ord.id}`}
                            >
                              <X size={12} />
                              <span>Batalkan</span>
                            </button>
                          </div>
                        )}

                        {ord.orderStatus === 'Ready for Pickup' && (
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'Completed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow transition"
                            id={`mark-complete-${ord.id}`}
                          >
                            <Check size={14} className="stroke-[3]" />
                            <span>Konfirmasi Pengambilan Selesai</span>
                          </button>
                        )}

                        {['Completed', 'Cancelled'].includes(ord.orderStatus) && (
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                            Mutasi Pesanan Selesai ({ord.orderStatus})
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SUBTAB 5: Customer Directory */}
        {activeSubTab === 'customers' && (
          <div className="space-y-6 text-left">
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Katalog Pelanggan Terdaftar</h1>
              <p className="text-sm text-slate-500">Lihat total profil mahasiswa dan staf resmi yang berbelanja.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs divide-y divide-slate-100">
              {customers.map((c) => {
                const clientOrders = orders.filter(o => o.userId === c.id);
                const clientTotalPaid = clientOrders
                  .filter(o => o.paymentStatus === 'Paid')
                  .reduce((sum, o) => sum + o.totalAmount, 0);

                return (
                  <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-900 text-indigo-400 font-black flex items-center justify-center text-sm shadow">
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded font-mono uppercase">{c.id}</span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{c.fullName}</h3>
                        <p className="text-xs text-slate-400 font-mono">{c.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-6 text-left sm:text-right text-xs sm:text-sm self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">TOTAL ORDER</span>
                        <span className="font-bold text-slate-800 font-mono">{clientOrders.length} kali</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">TOTAL MUTASI BELANJA</span>
                        <span className="font-bold text-emerald-600 font-mono">Rp {clientTotalPaid.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 6: Detailed Revenue Reports panel */}
        {activeSubTab === 'revenue' && (
          <div className="space-y-6 text-left">
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Laporan Omset & Pendapatan</h1>
              <p className="text-sm text-slate-500">Tinjau mutasi keuangan harian, mingguan, bulanan dari pembayaran tervalidasi.</p>
            </div>

            {/* Simulated report blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
                <p className="text-[10px] text-slate-400 font-mono block mb-1">D. OMSET HARIAN (ESTIMASI 15%)</p>
                <p className="font-black text-slate-900 text-lg sm:text-xl font-mono">Rp {revenueStats.daily.toLocaleString('id-ID')}</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Record hari ini</span>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
                <p className="text-[10px] text-slate-400 font-mono block mb-1">E. OMSET MINGGUAN (ESTIMASI 45%)</p>
                <p className="font-black text-slate-900 text-lg sm:text-xl font-mono">Rp {revenueStats.weekly.toLocaleString('id-ID')}</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Record 7 hari terakhir</span>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
                <p className="text-[10px] text-slate-400 font-mono block mb-1">F. OMSET BULANAN (ESTIMASI 100%)</p>
                <p className="font-black text-slate-900 text-lg sm:text-xl font-mono">Rp {revenueStats.monthly.toLocaleString('id-ID')}</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Sesuai buku kas aktif</span>
              </div>
              <div className="bg-slate-900 border border-slate-950 text-white rounded-2xl p-5 shadow-md">
                <p className="text-[10px] text-indigo-400 font-mono block mb-1">G. TOTAL AKUMULASI OMSET</p>
                <p className="font-black text-white text-lg sm:text-xl font-mono">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Valid Net Revenue Kampus</span>
              </div>
            </div>

            {/* Additional report info metrics */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-base flex items-center space-x-1.5">
                <Calendar size={16} className="text-indigo-600" />
                <span>Rincian Buku Kas Ledger Kampus</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-mono text-[10px] text-slate-400 block mb-1">MUTASI TRANSAKSI</p>
                  <p className="font-bold text-slate-900 text-base">{paidOrders.length} kali bayar</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-mono text-[10px] text-slate-400 block mb-1">PRODUK PRIMADONA</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{bestSellingProduct}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-mono text-[10px] text-slate-400 block mb-1">JUMLAH KEPALA CUSTOMERS</p>
                  <p className="font-bold text-slate-900 text-base">{customers.length} Mahasiswa/Staf</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* CRUD PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">{editingProduct ? 'Modifikasi Detail Merchandise' : 'Tambah Official Merchandise Baru'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white transition"><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs sm:text-sm">
              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">NAMA MERCHANDISE KAMPUS</label>
                <input 
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Contoh: Official Cap Unmer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden"
                  id="product-crud-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">PILIH KATEGORI</label>
                  <select 
                    value={productCatId}
                    onChange={(e) => setProductCatId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">NOMINAL STOK BARANG</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={productStock}
                    onChange={(e) => setProductStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">HARGA PRODUK (IDR)</label>
                  <input 
                    type="number"
                    required
                    min={500}
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-hidden font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[10px] block mb-1">URL IMAGES / FOTO PRODUK</label>
                  <input 
                    type="text"
                    required
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 text-xs truncate focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">DESKRIPSI PENAWARAN PRODUK</label>
                <textarea 
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  rows={3}
                  placeholder="Keterangan tebal kain, kenyamanan bahan dll..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-850 transition">Batalkan</button>
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl transition" id="save-product-crud">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">{editingCategory ? 'Modifikasi Kategori' : 'Tambah Kategori Baru'}</h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-white transition"><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="p-6 space-y-4 font-sans text-xs sm:text-sm">
              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">NAMA KATEGORI</label>
                <input 
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Contoh: Keychains"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden font-bold"
                  id="category-crud-name"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px] block mb-1">DESKRIPSI SINGKAT</label>
                <textarea 
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={2}
                  placeholder="Deskripsi singkat jenis kategori..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowCatModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-850 transition">Batalkan</button>
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl transition" id="save-category-crud">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
