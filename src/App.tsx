import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { ProductCatalog } from './pages/ProductCatalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { QrisPayment } from './pages/QrisPayment';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { OrderHistory } from './pages/OrderHistory';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StaffDashboard } from './pages/StaffDashboard';

// Real-time toast icon support
import { BellRing, ShieldCheck, XCircle, UserCheck, Play } from 'lucide-react';

function StorefrontApp() {
  const [tab, setTabState] = useState<string>('home');
  const [tabParams, setTabParams] = useState<any>({});
  const { currentUser, notifications, login } = useApp();
  
  // Real-time live Toast notifications trigger logic
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; id: string } | null>(null);

  const setTab = (newTab: string, params: any = {}) => {
    setTabState(newTab);
    setTabParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Watch notifications for changes to display live toast alerts
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only show to toast if it corresponds to current active user
      if (currentUser && latest.userId === currentUser.id) {
        setActiveToast({
          id: latest.id,
          title: latest.title,
          message: latest.message
        });
        
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, currentUser]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Real-time Simulated WebSocket Push Toast */}
      {activeToast && (
        <div 
          className="fixed bottom-6 left-6 max-w-sm w-full bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-4.5 z-50 animate-bounce duration-100 flex items-start space-x-3.5"
          id="realtime-notification-toast"
        >
          <div className="p-2 bg-indigo-600 text-white rounded-xl animate-pulse">
            <BellRing size={18} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-extrabold text-xs text-indigo-400 font-mono tracking-wide">Pemberitahuan Real-Time</h4>
            <h5 className="font-bold text-sm text-white mt-0.5">{activeToast.title}</h5>
            <p className="text-xs text-slate-300 mt-1 leading-normal">{activeToast.message}</p>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-slate-500 hover:text-white text-xs inline-block ml-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Render standard storefront layout navigation only if not full staff workspace */}
      {currentUser?.role !== 'staff' || tab !== 'staff-dashboard' ? (
        <Navigation currentTab={tab} setTab={setTab} />
      ) : null}

      {/* Core routers wrapper */}
      <div className="flex-1">
        {tab === 'home' && <Home setTab={setTab} />}
        {tab === 'catalog' && (
          <ProductCatalog 
            initialCategoryId={tabParams.categoryId || ''} 
            setTab={setTab} 
          />
        )}
        {tab === 'product-detail' && (
          <ProductDetail 
            productId={tabParams.productId} 
            setTab={setTab} 
          />
        )}
        {tab === 'cart' && <Cart setTab={setTab} />}
        {tab === 'checkout' && <Checkout setTab={setTab} />}
        {tab === 'qris-payment' && (
          <QrisPayment 
            orderId={tabParams.orderId} 
            setTab={setTab} 
          />
        )}
        {tab === 'payment-success' && (
          <PaymentSuccess 
            orderId={tabParams.orderId} 
            setTab={setTab} 
          />
        )}
        {tab === 'order-history' && (
          <OrderHistory 
            focusOrderId={tabParams.focusOrderId} 
            setTab={setTab} 
          />
        )}
        {tab === 'profile' && <Profile setTab={setTab} />}
        {tab === 'login' && <Login setTab={setTab} />}
        {tab === 'register' && <Register setTab={setTab} />}
        
        {/* Staff Dashboard console layout handles its own sidebar */}
        {tab === 'staff-dashboard' && (
          <StaffDashboard 
            setTab={setTab} 
            initialSubTab={tabParams.subTab || 'summary'} 
          />
        )}
      </div>

      {/* FOOTER */}
      {currentUser?.role !== 'staff' || tab !== 'staff-dashboard' ? (
        <Footer />
      ) : null}

      {/* FLOATING DEVELOPER DEMO HELPER TRAY */}
      <div 
        className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-3 flex flex-col items-center space-y-2 max-w-[120px] transition hover:scale-105"
        id="developer-simulation-tray"
      >
        <div className="flex items-center space-x-1 font-mono text-[9px] text-indigo-400 font-bold shrink-0">
          <Play size={10} className="animate-pulse" />
          <span>SIMULATOR</span>
        </div>
        
        {currentUser?.role === 'staff' ? (
          <button 
            onClick={() => {
              login('customer@campus.com', 'customer');
              setTab('home');
            }}
            className="w-full bg-slate-800 hover:bg-indigo-600 hover:text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-slate-700 transition duration-150 cursor-pointer"
            title="Klik cepat untuk beralih mode sebagai Pelanggan"
          >
            Pelanggan
          </button>
        ) : (
          <button 
            onClick={() => {
              login('staff@campus.com', 'staff');
              setTab('staff-dashboard');
            }}
            className="w-full bg-slate-805 bg-slate-800 hover:bg-indigo-600 hover:text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-slate-700 transition duration-150 cursor-pointer"
            title="Klik cepat untuk beralih mode sebagai Staff Admin"
          >
            Staff Admin
          </button>
        )}
        
        <p className="font-sans text-[8px] text-slate-500 font-semibold select-none">Beralih Peran</p>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StorefrontApp />
    </AppProvider>
  );
}
