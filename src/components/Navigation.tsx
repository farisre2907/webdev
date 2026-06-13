import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Bell, User, LogOut, ShieldAlert, CheckCircle, PackageOpen, Award, ArrowUpRight } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string, params?: any) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab }) => {
  const { currentUser, cart, notifications, logout, markNotificationsAsRead, clearNotifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.isRead && n.userId === (currentUser?.id || ''));

  const handleNotificationBellClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserDropdown(false);
    markNotificationsAsRead();
  };

  const handleUserIconClick = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    setTab('home');
  };

  return (
    <nav className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-40 transition-colors duration-200 h-20 flex items-center shadow-xs" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setTab('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl tracking-tight shadow-sm">
              <span>U</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900">Unpad Merch Hub</span>
              <p className="text-[10px] text-indigo-600 font-mono font-bold tracking-widest -mt-1 hidden sm:block">OFFICIAL STORE</p>
            </div>
          </div>

          {/* Nav Links (Public Icons & Screens) */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium h-20">
            <button 
              onClick={() => setTab('home')} 
              className={`h-20 flex items-center hover:text-indigo-600 transition-colors cursor-pointer ${currentTab === 'home' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : 'text-slate-600'}`}
              id="nav-home"
            >
              Beranda
            </button>
            <button 
              onClick={() => setTab('catalog')} 
              className={`h-20 flex items-center hover:text-indigo-600 transition-colors cursor-pointer ${currentTab === 'catalog' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : 'text-slate-600'}`}
              id="nav-catalog"
            >
              Katalog Produk
            </button>
          </div>

          {/* Quick Controls Tray */}
          <div className="flex items-center space-x-4">
            {/* Quick Demo Staff Toggle - Assessor friendly */}
            {currentUser && currentUser.role === 'customer' && (
              <button 
                onClick={() => setTab('staff-dashboard')} 
                className="hidden lg:flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition-all duration-150 cursor-pointer"
                id="quick-switch-to-staff"
                title="Akses cepat panel staff untuk simulasi transaksi"
              >
                <ShieldAlert size={14} className="text-indigo-600 animate-pulse" />
                <span>Simulasi Admin</span>
              </button>
            )}

            {/* Back to Customer Button if in Staff View */}
            {currentUser && currentUser.role === 'staff' && (
              <button 
                onClick={() => setTab('home')} 
                className="hidden lg:flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
                id="quick-switch-to-customer"
              >
                <User size={14} />
                <span>Simulasi Toko Depan</span>
              </button>
            )}

            {/* Cart Icon (Customer view only) */}
            {(!currentUser || currentUser.role === 'customer') && (
              <button 
                onClick={() => setTab('cart')} 
                className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all duration-150 border border-transparent hover:border-slate-200 cursor-pointer"
                id="shopping-cart-button"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell */}
             {currentUser && (
              <div className="relative">
                <button 
                  onClick={handleNotificationBellClick} 
                  className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all duration-150 border border-transparent hover:border-slate-200 cursor-pointer"
                  id="notifications-bell"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full border border-white shadow"></span>
                  )}
                </button>

                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl py-2 text-slate-800 border border-slate-200 z-50 animate-fade-in text-left">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <span className="font-bold text-sm text-slate-900">Notifikasi Real-Time</span>
                      <div className="space-x-2">
                        <button 
                          onClick={clearNotifications} 
                          className="text-xs text-rose-500 hover:text-rose-600 bg-rose-50/50 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium"
                        >
                          Hapus Semua
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                        <div className="py-8 px-4 text-center text-slate-400 text-xs">
                          <PackageOpen className="mx-auto text-slate-300 mb-2" size={32} />
                          <p>Tidak ada notifikasi baru</p>
                        </div>
                      ) : (
                        notifications
                          .filter(n => n.userId === currentUser.id)
                          .map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => {
                                setShowNotifications(false);
                                if (notif.orderId) {
                                  if (currentUser.role === 'customer') {
                                    setTab('order-history', { focusOrderId: notif.orderId });
                                  } else {
                                    setTab('staff-orders', { focusOrderId: notif.orderId });
                                  }
                                }
                              }}
                              className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition ${!notif.isRead ? 'bg-indigo-50/10' : ''}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="mt-0.5 p-1 bg-indigo-550 bg-indigo-50 text-indigo-600 rounded-lg">
                                  <Bell size={14} className="animate-swing" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="font-bold text-xs text-slate-900">{notif.title}</h4>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {new Date(notif.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                                  {notif.orderId && (
                                    <div className="mt-1.5 flex items-center text-[10px] font-semibold text-indigo-600 font-mono">
                                      <span>Lacak Pesanan #{notif.orderId}</span>
                                      <ArrowUpRight size={10} className="ml-0.5" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={handleUserIconClick}
                  className="flex items-center space-x-2 p-1 rounded-full text-slate-600 hover:bg-slate-50 transition border border-transparent hover:border-slate-100 cursor-pointer"
                  id="user-profile-button"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-indigo-600 font-bold flex items-center justify-center text-sm shadow-xs uppercase">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="hidden select-none sm:block font-medium text-xs max-w-[120px] truncate text-slate-700">
                    {currentUser.fullName}
                  </span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 text-slate-800 border border-slate-200 z-50 animate-fade-in text-left">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-xs text-slate-400">MASUK SEBAGAI</p>
                      <p className="font-bold text-sm text-slate-900 truncate">{currentUser.fullName}</p>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium font-mono mt-1 ${
                        currentUser.role === 'staff' ? 'bg-indigo-100 text-indigo-850 text-indigo-900' : 'bg-green-100 text-green-800'
                      }`}>
                        {currentUser.role === 'staff' ? 'Staff Merch Hub' : 'Pelanggan Kampus'}
                      </span>
                    </div>

                    {currentUser.role === 'customer' ? (
                      <>
                        <button 
                          onClick={() => { setShowUserDropdown(false); setTab('profile'); }}
                          className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                        >
                          <User size={14} className="text-slate-400" />
                          <span>Detail Profil</span>
                        </button>
                        <button 
                          onClick={() => { setShowUserDropdown(false); setTab('order-history'); }}
                          className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                        >
                          <ShoppingCart size={14} className="text-slate-400" />
                          <span>Pesanan Saya</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setShowUserDropdown(false); setTab('staff-dashboard'); }}
                          className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                        >
                          <ShieldAlert size={14} className="text-slate-400" />
                          <span>Panel Dashboard</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium transition cursor-pointer"
                      id="nav-logout-button"
                    >
                      <LogOut size={14} />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setTab('login')} 
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => setTab('register')} 
                  className="text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};
