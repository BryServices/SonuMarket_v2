import React, { useState, useEffect } from 'react';
import Home from './views/Home';
import ProductDetail from './views/ProductDetail';
import Profile from './views/Profile';
import BottomNav from './components/BottomNav';
import PCBuilder from './views/PCBuilder';
import Cart from './views/Cart';
import Auth from './views/Auth';
import Services from './views/Services';
import Catalog from './views/Catalog';
import DigitalStore from './views/DigitalStore';
import CVBuilder from './views/CVBuilder';
import RedactionService from './views/RedactionService';
import { Product, ViewState, CartItem } from './types';
import { DynamicIcon } from './components/Icons';

// Simple Toast Component
const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-full shadow-lg z-[60] animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
      <DynamicIcon name="Check" size={16} className="text-green-400" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Persist Cart
  useEffect(() => {
    const savedCart = localStorage.getItem('technova_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('technova_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('technova_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const addToCart = (product: Product | Product[]) => {
    if (Array.isArray(product)) {
        // Add multiple items (PC Builder legacy support or Bundles)
        setCart(prev => {
            const newCart = [...prev];
            product.forEach(p => {
                const existing = newCart.find(item => item.id === p.id);
                if (existing) existing.quantity += 1;
                else newCart.push({ ...p, quantity: 1 });
            });
            return newCart;
        });
        showToast(`${product.length} articles ajoutés`);
    } else {
        // Add single item
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        showToast(product.type === 'digital' ? "Document ajouté au panier" : "Ajouté au panier");
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
        return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleLogin = (userData: any) => {
      setUser(userData);
      localStorage.setItem('technova_user', JSON.stringify(userData));
      setCurrentView(ViewState.PROFILE);
      showToast(`Bienvenue ${userData.name}`);
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('technova_user');
      setCurrentView(ViewState.AUTH);
      showToast("Déconnecté");
  };

  const handleUpdateUser = (updatedData: any) => {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('technova_user', JSON.stringify(newUser));
      showToast("Profil mis à jour");
  };

  const handleCategorySelect = (categoryId: string) => {
      setSelectedCategory(categoryId);
      setCurrentView(ViewState.CATEGORIES);
  };

  // Navigation Logic
  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
          onShowToast={showToast}
        />
      );
    }

    switch (currentView) {
      case ViewState.HOME:
        return <Home onProductClick={setSelectedProduct} onChangeView={setCurrentView} onCategorySelect={handleCategorySelect} />;
      case ViewState.CATEGORIES:
          return <Catalog initialCategory={selectedCategory} onProductClick={setSelectedProduct} onBack={() => setCurrentView(ViewState.HOME)} onAddToCart={addToCart} />;
      case ViewState.DIGITAL_STORE:
          return <DigitalStore 
              onAddToCart={addToCart}
              onProductClick={setSelectedProduct} 
              onBack={() => setCurrentView(ViewState.HOME)} 
              onOpenRedaction={() => setCurrentView(ViewState.REDACTION_SERVICE)}
              onOpenCVBuilder={() => setCurrentView(ViewState.CV_BUILDER)}
          />;
      case ViewState.CV_BUILDER:
          return <CVBuilder onBack={() => setCurrentView(ViewState.DIGITAL_STORE)} />;
      case ViewState.REDACTION_SERVICE:
          return <RedactionService onBack={() => setCurrentView(ViewState.DIGITAL_STORE)} />;
      case ViewState.CART:
        return <Cart items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={() => showToast("Checkout Medusa initialisé...")} onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.SERVICES:
        return <Services onBack={() => setCurrentView(ViewState.HOME)} onBook={(s, d, t) => { showToast(`RDV confirmé : ${s.name} le ${new Date(d).toLocaleDateString()} à ${t}`); setCurrentView(ViewState.PROFILE); }} />;
      case ViewState.PROFILE:
        return user ? <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} onAddToCart={(p) => addToCart(p)} /> : <Auth onLogin={handleLogin} />;
      case ViewState.AUTH:
        return <Auth onLogin={handleLogin} />;
      case ViewState.PC_BUILDER:
          // Fallback if needed, though replaced in UI
          return <PCBuilder onAddToCart={(items) => { addToCart(items); setCurrentView(ViewState.CART); }} onBack={() => setCurrentView(ViewState.HOME)} />;
      default:
        return <Home onProductClick={setSelectedProduct} onChangeView={setCurrentView} onCategorySelect={handleCategorySelect} />;
    }
  };

  return (
    <div className="font-sans text-dark bg-background min-h-screen selection:bg-primary/20">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      
      {renderContent()}
      
      <BottomNav currentView={currentView} onChangeView={(view) => {
          setSelectedProduct(null); // Ensure we exit product detail when using nav
          setCurrentView(view);
      }} cartCount={cart.reduce((a,b) => a + b.quantity, 0)} />
    </div>
  );
};

export default App;