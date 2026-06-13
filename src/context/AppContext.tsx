import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Category, Product, CartItem, Order, OrderItem, RealTimeNotification, OrderStatus, PaymentStatus } from '../types';

interface AppContextType {
  users: User[];
  currentUser: User | null;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  notifications: RealTimeNotification[];
  login: (email: string, role: 'customer' | 'staff') => boolean;
  register: (fullName: string, email: string, role: 'customer' | 'staff') => boolean;
  logout: () => void;
  updateProfile: (fullName: string, email: string) => void;
  
  // Cart actions
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Products / Categories CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (categoryName: string, description: string) => void;
  editCategory: (id: string, categoryName: string, description: string) => void;
  deleteCategory: (id: string) => void;
  
  // Orders
  checkoutOrder: (userAddress: string) => { success: boolean; orderId: string };
  simulatePayment: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Notifications
  addNotification: (userId: string, title: string, message: string, orderId?: string) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Sample Data
const initialCategories: Category[] = [
  { id: 'CAT-201', categoryName: 'T-Shirts', description: 'Kaos katun premium berkualitas tinggi dengan desain kampus modern.', createdAt: '2026-06-01T12:00:00Z', updatedAt: '2026-06-01T12:00:00Z' },
  { id: 'CAT-202', categoryName: 'Hoodies', description: 'Jaket hoodie hangat dengan sulaman logo kampus timbul.', createdAt: '2026-06-01T12:00:00Z', updatedAt: '2026-06-01T12:00:00Z' },
  { id: 'CAT-203', categoryName: 'Tote Bags', description: 'Tas jinjing kanvas serbaguna, ramah lingkungan dan kuat.', createdAt: '2026-06-01T12:00:00Z', updatedAt: '2026-06-01T12:00:00Z' },
  { id: 'CAT-204', categoryName: 'Stickers', description: 'Stiker vinyl anti air mengkilap untuk laptop, botol minum, dll.', createdAt: '2026-06-01T12:00:00Z', updatedAt: '2026-06-01T12:00:00Z' },
  { id: 'CAT-205', categoryName: 'Tumblers', description: 'Botol minum termos stainless steel tahan panas/dingin.', createdAt: '2026-06-01T12:00:00Z', updatedAt: '2026-06-01T12:00:00Z' },
  { id: 'CAT-206', categoryName: 'Keychains', description: 'Gantungan kunci akrilik tebal dua sisi dengan desain maskot.', createdAt: '2026-06-01T12:00:00Z', updatedAt: '2026-06-01T12:00:00Z' },
];

const initialProducts: Product[] = [
  {
    id: 'PRD-101',
    categoryId: 'CAT-201',
    productName: 'Classic Campus Tee - Varsity Blue',
    description: 'Kaos katun combed 30s premium dengan sablon plastisol Varsity khas kampus. Sangat lembut, menyerap keringat, dan tahan lama untuk aktivitas perkuliahan sehari-hari.',
    price: 95000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-06-02T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-102',
    categoryId: 'CAT-201',
    productName: 'Minimalist Logo Tee - Off White',
    description: 'Kaos desain minimalis eksklusif dengan bordir micro logo kampus di bagian dada kiri. Terbuat dari katun organik supersoft berdesain trendi bagi mahasiswa modern.',
    price: 110000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T10:15:00Z',
    updatedAt: '2026-06-02T10:15:00Z',
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-103',
    categoryId: 'CAT-202',
    productName: 'Signature Hoodie - Midnight Navy',
    description: 'Hoodie pullover premium berdensitas tinggi (heavyweight cotton fleece 330gsm). Saku kanguru fungsional, tali serut tebal, dan sulaman benang emas logo besar kampus di punggung.',
    price: 245000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T10:30:00Z',
    updatedAt: '2026-06-02T10:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-104',
    categoryId: 'CAT-202',
    productName: 'Athletic Pullover - Heather Grey',
    description: 'Hoodie olahraga kasual dengan bahan katun lentur semi-fleece. Cocok untuk sesi belajar di perpustakaan ber-AC atau aktivitas luar ruang di sore hari hangat.',
    price: 220000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T10:45:00Z',
    updatedAt: '2026-06-02T10:45:00Z',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-105',
    categoryId: 'CAT-203',
    productName: 'Eco-Canvas Campus Tote Bag',
    description: 'Tote bag ramah lingkungan serbaguna dari bahan kanvas katun tebal 14oz. Menampung laptop hingga 15.6 inci, buku catatan tebal, dokumen, serta dilengkapi ritsleting dan saku rahasia di dalam.',
    price: 65000,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T11:00:00Z',
    updatedAt: '2026-06-02T11:00:00Z',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'PRD-106',
    categoryId: 'CAT-205',
    productName: 'Thermal Flask Tumbler - Onyx Black',
    description: 'Tumbler thermo premium modern berbahan stainless steel food grade SUS316. Mampu mempertahankan suhu minuman (kopi panas atau es teh) hingga 18 jam dengan penutup anti-bocor.',
    price: 135000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T11:15:00Z',
    updatedAt: '2026-06-02T11:15:00Z',
    images: ['https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'PRD-107',
    categoryId: 'CAT-204',
    productName: 'Aesthetic Vinyl Sticker Pack',
    description: 'Satu set berisi 10 stiker vinyl potong potong (die-cut) bertema kehidupan kampus, maskot menggemaskan, dan ilustrasi seni modern. Sangat rekat, anti air, anti gores, dan tidak berbekas saat dilepas.',
    price: 15000,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1572375995301-40164f1fd0bc?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T11:30:00Z',
    updatedAt: '2026-06-02T11:30:00Z',
    images: ['https://images.unsplash.com/photo-1572375995301-40164f1fd0bc?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'PRD-108',
    categoryId: 'CAT-206',
    productName: 'Double-Sided Mascot Acrylic Keychain',
    description: 'Gantungan kunci akrilik kristal ultra bening 4mm berdesain bolak-balik beresolusi tinggi. Lengkap dengan cincin logam putar kokoh untuk tas atau kunci motor kesayangan Anda.',
    price: 20000,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-06-02T11:45:00Z',
    updatedAt: '2026-06-02T11:45:00Z',
    images: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80']
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Loading
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cmh_users');
    if (saved) return JSON.parse(saved);
    const defaults: User[] = [
      { id: 'USR-001', fullName: 'Faris Rifqy', email: 'customer@campus.com', role: 'customer', createdAt: '2026-06-10T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z' },
      { id: 'USR-002', fullName: 'Ruben David', email: 'staff@campus.com', role: 'staff', createdAt: '2026-06-10T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z' },
    ];
    localStorage.setItem('cmh_users', JSON.stringify(defaults));
    return defaults;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cmh_current_user');
    // Default to the customer for a comfortable initial experience
    if (saved) return JSON.parse(saved);
    const savedUsers = localStorage.getItem('cmh_users');
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      const customer = parsed.find((u: User) => u.role === 'customer');
      if (customer) {
        localStorage.setItem('cmh_current_user', JSON.stringify(customer));
        return customer;
      }
    }
    return null;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cmh_categories');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('cmh_categories', JSON.stringify(initialCategories));
    return initialCategories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cmh_products');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('cmh_products', JSON.stringify(initialProducts));
    return initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cmh_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cmh_orders');
    if (saved) return JSON.parse(saved);
    
    // Sample previous order for demo tracking richness
    const prevOrder: Order = {
      id: 'ORD-8941',
      userId: 'USR-001',
      totalAmount: 160000,
      paymentStatus: 'Paid',
      orderStatus: 'Completed',
      createdAt: '2026-06-05T14:30:00Z',
      items: [
        { id: 'ORI-101', orderId: 'ORD-8941', productId: 'PRD-101', quantity: 1, price: 95000 },
        { id: 'ORI-102', orderId: 'ORD-8941', productId: 'PRD-105', quantity: 1, price: 65000 }
      ]
    };
    const defaults = [prevOrder];
    localStorage.setItem('cmh_orders', JSON.stringify(defaults));
    return defaults;
  });

  const [notifications, setNotifications] = useState<RealTimeNotification[]>(() => {
    const saved = localStorage.getItem('cmh_notifications');
    if (saved) return JSON.parse(saved);
    
    const defaults: RealTimeNotification[] = [
      {
        id: 'NTF-1',
        userId: 'USR-001',
        title: 'Pesanan Selesai!',
        message: 'Pesanan ORD-8941 Anda telah selesai diambil. Terima kasih telah berbelanja!',
        isRead: false,
        orderId: 'ORD-8941',
        createdAt: '2026-06-05T16:00:00Z'
      }
    ];
    localStorage.setItem('cmh_notifications', JSON.stringify(defaults));
    return defaults;
  });

  // Save states to localStorage when changed
  useEffect(() => {
    localStorage.setItem('cmh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cmh_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cmh_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cmh_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cmh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cmh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cmh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Functions
  const login = (email: string, role: 'customer' | 'staff'): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (user) {
      setCurrentUser(user);
      addNotification(user.id, `Selamat datang kembali!`, `Halo ${user.fullName}, Anda berhasil masuk sebagai ${role === 'staff' ? 'Staff Toko' : 'Pelanggan'}.`);
      return true;
    }
    return false;
  };

  const register = (fullName: string, email: string, role: 'customer' | 'staff'): boolean => {
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newUser: User = {
      id: `USR-${100 + users.length + 1}`,
      fullName,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    addNotification(newUser.id, `Registrasi Berhasil!`, `Selamat bergabung di Unpad Merch Hub, ${fullName}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const updateProfile = (fullName: string, email: string) => {
    if (!currentUser) return;
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, fullName, email, updatedAt: new Date().toISOString() };
      }
      return u;
    });
    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, fullName, email, updatedAt: new Date().toISOString() });
    addNotification(currentUser.id, "Profil Diperbarui", "Informasi akun Anda berhasil diperbarui.");
  };

  // Cart Functions
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const target = prev.find(item => item.productId === productId);
      const prd = products.find(p => p.id === productId);
      const availableStock = prd ? prd.stock : 99;

      if (target) {
        const newQty = Math.min(target.quantity + quantity, availableStock);
        return prev.map(item => item.productId === productId ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { id: `CRT-${Date.now()}`, productId, quantity: Math.min(quantity, availableStock) }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.productId !== productId);
      }
      const prd = products.find(p => p.id === productId);
      const availableStock = prd ? prd.stock : 99;
      const finalQty = Math.min(quantity, availableStock);
      return prev.map(item => item.productId === productId ? { ...item, quantity: finalQty } : item);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Admin CRUD for Products
  const addProduct = (newPrd: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `PRD-${100 + products.length + 1}`;
    const prd: Product = {
      ...newPrd,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [newPrd.image]
    };
    setProducts(prev => [prd, ...prev]);
  };

  const editProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Admin CRUD for Categories
  const addCategory = (categoryName: string, description: string) => {
    const id = `CAT-${200 + categories.length + 1}`;
    const cat: Category = {
      id,
      categoryName,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, cat]);
  };

  const editCategory = (id: string, categoryName: string, description: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, categoryName, description, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Checkout and Orders
  const checkoutOrder = (userAddress: string): { success: boolean; orderId: string } => {
    if (!currentUser || cart.length === 0) return { success: false, orderId: '' };

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Check inventory stock and subtract
    let stockAvailable = true;
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(ci => ci.productId === p.id);
      if (cartItem) {
        if (p.stock < cartItem.quantity) {
          stockAvailable = false;
        }
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    });

    if (!stockAvailable) {
      return { success: false, orderId: 'STK' }; // Stock unavailable code
    }

    // Deduct stock for real
    setProducts(updatedProducts);

    // Create order items
    let totalAmount = 0;
    const orderItems: OrderItem[] = cart.map((item, idx) => {
      const p = products.find(prd => prd.id === item.productId)!;
      totalAmount += p.price * item.quantity;
      return {
        id: `ORI-${Date.now()}-${idx}`,
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: p.price
      };
    });

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      totalAmount,
      paymentStatus: 'Pending',
      orderStatus: 'Pending Payment',
      createdAt: new Date().toISOString(),
      items: orderItems
    };

    setOrders(prev => [newOrder, ...prev]);
    // Keep cart but the flow goes: Checkout Page -> QRIS page. We clear cart after successful payment!
    return { success: true, orderId };
  };

  const simulatePayment = async (orderId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            // Send instant real-time notification
            addNotification(
              o.userId,
              'Pembayaran Diterima!',
              `Pembayaran untuk pesanan ${o.id} sebesar Rp ${o.totalAmount.toLocaleString('id-ID')} telah dikonfirmasi secara otomatis melalui QRIS.`,
              o.id
            );
            return {
              ...o,
              paymentStatus: 'Paid',
              orderStatus: 'Processing'
            };
          }
          return o;
        }));
        
        // Also notify staff
        const staffUsers = users.filter(u => u.role === 'staff');
        staffUsers.forEach(stf => {
          addNotification(
            stf.id,
            'Pesanan Baru Masuk!',
            `Pesanan baru ${orderId} siap diproses oleh Staff. Status pembayaran: PAID.`,
            orderId
          );
        });

        // Clear the customer's cart after successful payment
        setCart([]);
        resolve();
      }, 3000); // 3-second simulation delay as required in page 2
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Build readable message
        let title = '';
        let message = '';
        
        switch (status) {
          case 'Processing':
            title = 'Pesanan Sedang Diproses';
            message = `Pesanan ${orderId} Anda sekarang sedang disiapkan oleh tim Unpad Merch Hub.`;
            break;
          case 'Ready for Pickup':
            title = 'Siap Diambil! 📦';
            message = `Hore! Pesanan ${orderId} Anda telah siap untuk diambil di konter Merch Hub Kampus. Harap tunjukkan halaman detail pesanan ini kepada kasir.`;
            break;
          case 'Completed':
            title = 'Pesanan Selesai';
            message = `Terima kasih! Pesanan ${orderId} Anda telah berhasil diambil dan diselesaikan.`;
            break;
          case 'Cancelled':
            title = 'Pesanan Dibatalkan ❌';
            message = `Mohon maaf, pesanan ${orderId} Anda telah dibatalkan oleh pihak toko. Pengembalian dana akan segera diproses jika Anda sudah melakukan transfer.`;
            break;
        }

        addNotification(o.userId, title, message, orderId);
        return { ...o, orderStatus: status };
      }
      return o;
    }));
  };

  // Notifications Helpers
  const addNotification = (userId: string, title: string, message: string, orderId?: string) => {
    const newNotice: RealTimeNotification = {
      id: `NTF-${Date.now()}`,
      userId,
      title,
      message,
      isRead: false,
      orderId,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotice, ...prev]);
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.id));
  };

  return (
    <AppContext.Provider value={{
      users,
      currentUser,
      categories,
      products,
      cart,
      orders,
      notifications,
      login,
      register,
      logout,
      updateProfile,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      addProduct,
      editProduct,
      deleteProduct,
      addCategory,
      editCategory,
      deleteCategory,
      checkoutOrder,
      simulatePayment,
      updateOrderStatus,
      addNotification,
      markNotificationsAsRead,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
};
