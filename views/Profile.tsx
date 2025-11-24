


import React, { useState, useEffect, useRef } from 'react';
import { DynamicIcon } from '../components/Icons';
import { MOCK_ORDERS, PRODUCTS } from '../constants';
import { Order, Address, PaymentMethod, WarrantyItem, Appointment, User, Product } from '../types';

// Données fictives pour les garanties
const MOCK_WARRANTIES: WarrantyItem[] = [
    {
        id: 'w-001',
        productName: 'NVIDIA RTX 4080 Founders Edition',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
        serialNumber: 'SN-4080-X99-2025',
        purchaseDate: '2025-04-22',
        expirationDate: '2027-04-22',
        status: 'active',
        coverage: 'Constructeur (2 ans)'
    },
    {
        id: 'w-002',
        productName: 'MacBook Pro 14" M3 Max',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        serialNumber: 'C02-M3MAX-9988',
        purchaseDate: '2025-05-14',
        expirationDate: '2026-05-14',
        status: 'active',
        coverage: 'Apple Care+ (1 an)'
    },
    {
        id: 'w-003',
        productName: 'Écran Dell UltraSharp U27',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        serialNumber: 'DEL-27-2022-X1',
        purchaseDate: '2023-01-10',
        expirationDate: '2025-01-10',
        status: 'expired',
        coverage: 'Standard'
    }
];

// Données fictives pour les rendez-vous (Services & Documents)
const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'apt-1',
        type: 'service',
        title: 'Diagnostic Panne PC',
        date: '2025-05-20',
        time: '14:00',
        status: 'confirmed',
        description: 'Problème écran bleu aléatoire',
        location: 'Atelier SonuMarket',
        provider: 'Technicien Marc'
    },
    {
        id: 'apt-2',
        type: 'document',
        title: 'Rédaction CV - Le Pro',
        date: '2025-05-18',
        status: 'processing',
        description: 'Optimisation et mise en forme',
        provider: 'Rédactrice Sarah',
        location: 'En ligne'
    },
    {
        id: 'apt-3',
        type: 'service',
        title: 'Nettoyage complet',
        date: '2025-05-25',
        time: '10:00',
        status: 'pending',
        description: 'Dépoussiérage annuel',
        location: 'Atelier SonuMarket'
    }
];

interface ProfileProps {
    user?: User;
    onLogout: () => void;
    onUpdateUser: (userData: any) => void;
    onAddToCart: (product: Product) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, onAddToCart }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showWarranties, setShowWarranties] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  
  // Appointment Filter State
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'service' | 'document'>('all');

  // Payment State
  const [showPayments, setShowPayments] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState<Partial<PaymentMethod>>({
      type: 'momo',
      provider: 'MTN',
      number: '',
      holderName: ''
  });
  
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Edit Form State
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      avatar: ''
  });
  
  // Address Form State
  const [addressData, setAddressData] = useState<Partial<Address>>({
      label: '', street: '', city: ''
  });

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(true);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (user) {
          setFormData({
              name: user.name || '',
              email: user.email || '',
              phone: user.id.includes('user-') ? user.id.replace('user-', '') : '',
              avatar: user.avatar || ''
          });
      }
  }, [user]);

  // Merge user data with mock if empty for demo purposes
  const userWarranties = (user?.warranties && user.warranties.length > 0) ? user.warranties : MOCK_WARRANTIES;
  const userAppointments = (user?.appointments && user.appointments.length > 0) ? user.appointments : MOCK_APPOINTMENTS;
  // Initialize mock wishlist with a couple of products if empty for demo
  const userWishlist = (user?.wishlist && user.wishlist.length > 0) ? user.wishlist : [PRODUCTS[0], PRODUCTS[2]];
  
  const filteredAppointments = userAppointments.filter((apt: Appointment) => {
      if (appointmentFilter === 'all') return true;
      return apt.type === appointmentFilter;
  });

  const menuItems = [
    { icon: 'Package', label: 'Historique de commandes', action: () => setShowOrders(true) },
    { icon: 'MapPin', label: 'Adresses de livraison', action: () => setShowAddresses(true) },
    { icon: 'CreditCard', label: 'Moyens de paiement', action: () => setShowPayments(true) },
    { icon: 'Shield', label: 'Historique & Garanties', action: () => setShowWarranties(true) },
    { icon: 'CalendarCheck', label: 'Mes Rendez-vous', badge: userAppointments.filter((a: Appointment) => a.status !== 'completed' && a.status !== 'cancelled').length > 0 ? userAppointments.filter((a: Appointment) => a.status !== 'completed' && a.status !== 'cancelled').length.toString() : undefined, action: () => setShowAppointments(true) },
    { icon: 'Heart', label: 'Liste d\'envies', badge: userWishlist.length > 0 ? userWishlist.length.toString() : undefined, action: () => setShowWishlist(true) },
  ];

  const handleSaveSettings = () => {
      onUpdateUser({
          ...user,
          name: formData.name,
          email: formData.email,
          avatar: formData.avatar
      });
      setShowSettings(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, avatar: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  // Address Handlers
  const handleSaveAddress = () => {
      if (!addressData.label || !addressData.street || !addressData.city) return;

      const newAddress: Address = {
          id: addressData.id || Date.now().toString(),
          label: addressData.label || 'Maison',
          street: addressData.street || '',
          city: addressData.city || ''
      };

      let currentAddresses = user?.addresses || [];
      if (addressData.id) {
          currentAddresses = currentAddresses.map((a: Address) => a.id === addressData.id ? newAddress : a);
      } else {
          currentAddresses = [...currentAddresses, newAddress];
      }

      onUpdateUser({ ...user, addresses: currentAddresses });
      setShowAddressForm(false);
      setAddressData({ label: '', street: '', city: '' });
  };

  const handleEditAddress = (addr: Address) => {
      setAddressData(addr);
      setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
      if (window.confirm("Supprimer cette adresse ?")) {
          const currentAddresses = user?.addresses || [];
          const newAddresses = currentAddresses.filter((a: Address) => a.id !== id);
          onUpdateUser({ ...user, addresses: newAddresses });
      }
  };

  const handleNewAddress = () => {
      setAddressData({ label: 'Maison', street: '', city: 'Brazzaville' });
      setShowAddressForm(true);
  };

  // Payment Handlers
  const handleNewPayment = () => {
      setPaymentFormData({ type: 'momo', provider: 'MTN', number: '', holderName: user?.name });
      setShowPaymentForm(true);
  };

  const handleDeletePayment = (id: string) => {
      if (window.confirm("Supprimer ce moyen de paiement ?")) {
          const currentMethods = user?.paymentMethods || [];
          const newMethods = currentMethods.filter((p: PaymentMethod) => p.id !== id);
          onUpdateUser({ ...user, paymentMethods: newMethods });
      }
  };

  const handleSavePayment = () => {
      if (!paymentFormData.number || !paymentFormData.holderName) return;
      
      const newMethod: PaymentMethod = {
          id: Date.now().toString(),
          type: paymentFormData.type || 'momo',
          provider: paymentFormData.provider || 'MTN',
          number: paymentFormData.number || '',
          holderName: paymentFormData.holderName || '',
          expiry: paymentFormData.expiry
      };

      const currentMethods = user?.paymentMethods || [];
      onUpdateUser({ ...user, paymentMethods: [...currentMethods, newMethod] });
      setShowPaymentForm(false);
  };

  // Wishlist Handlers
  const handleRemoveFromWishlist = (productId: string) => {
      const currentWishlist = user?.wishlist || userWishlist; // Use current user wishlist or fallback to mock if saving to user is needed
      
      let newWishlist;
      if (user?.wishlist) {
          newWishlist = user.wishlist.filter(p => p.id !== productId);
          onUpdateUser({ ...user, wishlist: newWishlist });
      } else {
         newWishlist = userWishlist.filter(p => p.id !== productId);
         onUpdateUser({ ...user, wishlist: newWishlist });
      }
  };

  // Helpers for Status Colors
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'delivered': case 'completed': return 'bg-green-100 text-green-700';
          case 'shipped': case 'confirmed': return 'bg-blue-100 text-blue-700';
          case 'processing': return 'bg-orange-100 text-orange-700';
          case 'cancelled': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'delivered': return 'Livré';
          case 'shipped': return 'Expédié';
          case 'processing': return 'En cours';
          case 'pending': return 'En attente';
          case 'confirmed': return 'Confirmé';
          case 'completed': return 'Terminé';
          case 'cancelled': return 'Annulé';
          default: return status;
      }
  };

  const getWarrantyProgress = (start: string, end: string) => {
      const startDate = new Date(start).getTime();
      const endDate = new Date(end).getTime();
      const now = Date.now();
      if (now > endDate) return 100;
      if (now < startDate) return 0;
      const total = endDate - startDate;
      const elapsed = now - startDate;
      return Math.round((elapsed / total) * 100);
  };

  const getWarrantyBadge = (status: string) => {
      switch(status) {
          case 'active': return { label: 'Active', color: 'bg-green-500 text-white' };
          case 'expiring': return { label: 'Bientôt expirée', color: 'bg-orange-500 text-white' };
          case 'expired': return { label: 'Expirée', color: 'bg-gray-300 text-gray-600' };
          default: return { label: 'Inconnue', color: 'bg-gray-200 text-gray-500' };
      }
  };

  if (!user) return null;

  return (
    <div className="pb-24 bg-background min-h-screen relative">
      
      {/* Settings Overlay */}
      {showSettings && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10">
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Paramètres</h2>
                  <button onClick={handleSaveSettings} className="text-primary font-bold text-sm">
                      Enregistrer
                  </button>
              </div>
              <div className="p-6 space-y-8">
                  <section>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Profil Public</h3>
                      <div className="space-y-4">
                          <div className="flex flex-col items-center mb-6">
                              <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden relative group cursor-pointer border-4 border-white shadow-md">
                                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover transition-opacity group-hover:opacity-80" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DynamicIcon name="Camera" className="text-white" size={32} />
                                  </div>
                              </div>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                              <button onClick={() => fileInputRef.current?.click()} className="mt-3 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                                  Modifier la photo
                              </button>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-dark mb-1">Nom complet</label>
                              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none transition-colors" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-dark mb-1">Email</label>
                              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none transition-colors" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 mb-1">Téléphone (Non modifiable)</label>
                              <input type="text" value={formData.phone} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500" />
                          </div>
                      </div>
                  </section>
                  <section>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Préférences</h3>
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                          <div className="p-4 flex items-center justify-between border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                      <DynamicIcon name="Bell" size={16} />
                                  </div>
                                  <span className="font-medium text-dark text-sm">Notifications Push</span>
                              </div>
                              <div onClick={() => setNotifEnabled(!notifEnabled)} className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${notifEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                              </div>
                          </div>
                          <div className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-secondary">
                                      <DynamicIcon name="MessageCircle" size={16} />
                                  </div>
                                  <span className="font-medium text-dark text-sm">Emails promotionnels</span>
                              </div>
                              <div onClick={() => setPromoEnabled(!promoEnabled)} className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${promoEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${promoEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                              </div>
                          </div>
                      </div>
                  </section>
                  <button onClick={onLogout} className="w-full py-4 text-red-500 font-bold bg-white border border-red-100 hover:bg-red-50 rounded-2xl transition-colors">
                      Déconnexion
                  </button>
              </div>
          </div>
      )}

      {/* Wishlist Overlay */}
      {showWishlist && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                  <button onClick={() => setShowWishlist(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Liste d'envies</h2>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 font-bold text-xs">
                      {userWishlist.length}
                  </div>
              </div>
              <div className="p-6">
                  {userWishlist.length > 0 ? (
                      <div className="space-y-4">
                          {userWishlist.map((item: Product) => (
                              <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 animate-in fade-in">
                                  <div className="w-20 h-20 bg-gray-50 rounded-xl shrink-0 overflow-hidden">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between">
                                      <div>
                                          <h4 className="font-bold text-dark text-sm line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                          <span className="text-xs text-gray-500">{item.category}</span>
                                      </div>
                                      <div className="flex justify-between items-end mt-2">
                                          <span className="font-bold text-primary">{item.price.toLocaleString('fr-FR')} XAF</span>
                                          <div className="flex gap-2">
                                              <button 
                                                  onClick={() => handleRemoveFromWishlist(item.id)}
                                                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                              >
                                                  <DynamicIcon name="Trash2" size={16} />
                                              </button>
                                              <button 
                                                  onClick={() => onAddToCart(item)}
                                                  className="w-8 h-8 rounded-lg bg-dark text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
                                              >
                                                  <DynamicIcon name="ShoppingCart" size={16} />
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-20 opacity-60">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                              <DynamicIcon name="Heart" size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-dark mb-1">Votre liste est vide</h3>
                          <p className="text-sm text-gray-500 mb-6">Enregistrez vos produits préférés pour les retrouver plus tard.</p>
                          <button onClick={() => setShowWishlist(false)} className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-dark hover:bg-gray-50">
                              Découvrir les produits
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Orders Overlay */}
      {showOrders && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                  <button onClick={() => setShowOrders(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Mes Commandes</h2>
              </div>
              <div className="p-4 space-y-4">
                  {MOCK_ORDERS.map((order) => {
                      const isExpanded = expandedOrder === order.id;
                      return (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                            <div onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="p-4 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-dark text-sm">{order.id}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-primary text-sm">{order.total.toLocaleString('fr-FR')} XAF</span>
                                    <div className="flex items-center justify-end gap-1 mt-1 text-gray-400">
                                        <span className="text-[10px]">{order.items.length} article(s)</span>
                                        <DynamicIcon name="ChevronLeft" size={14} className={`transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'rotate-180'}`} />
                                    </div>
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-gray-100">
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-dark truncate">{item.name}</h4>
                                                <p className="text-[10px] text-gray-500">{item.quantity} x {item.price.toLocaleString('fr-FR')} XAF</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                      );
                  })}
              </div>
          </div>
      )}

      {/* Appointments Overlay */}
      {showAppointments && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                  <button onClick={() => setShowAppointments(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Mes Rendez-vous</h2>
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-dark hover:bg-gray-200">
                      <DynamicIcon name="Search" size={18} />
                  </button>
              </div>

              <div className="p-6 space-y-6">
                  {/* Filter Tabs */}
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setAppointmentFilter('all')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${appointmentFilter === 'all' ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        Tous
                      </button>
                      <button 
                        onClick={() => setAppointmentFilter('service')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${appointmentFilter === 'service' ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        Services IT
                      </button>
                      <button 
                        onClick={() => setAppointmentFilter('document')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${appointmentFilter === 'document' ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        Documents
                      </button>
                  </div>

                  <div className="space-y-4">
                      {filteredAppointments.length > 0 ? (
                          filteredAppointments.map((apt: Appointment) => {
                              const isService = apt.type === 'service';
                              const dateObj = new Date(apt.date);
                              
                              return (
                                  <div key={apt.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                      <div className="flex justify-between items-start">
                                          <div className="flex gap-3">
                                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isService ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                  <DynamicIcon name={isService ? 'Wrench' : 'FileText'} size={24} />
                                              </div>
                                              <div>
                                                  <h4 className="font-bold text-dark text-sm">{apt.title}</h4>
                                                  <p className="text-xs text-gray-500 line-clamp-1">{apt.description}</p>
                                                  <div className="flex items-center gap-2 mt-1">
                                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(apt.status)}`}>
                                                          {getStatusLabel(apt.status)}
                                                      </span>
                                                      {apt.provider && (
                                                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                                              <DynamicIcon name="User" size={10} /> {apt.provider}
                                                          </span>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>

                                      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                                          <div className="flex items-center gap-2 text-gray-600">
                                              <DynamicIcon name="CalendarCheck" size={16} />
                                              <div className="flex flex-col">
                                                  <span className="text-xs font-bold">{dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                  {apt.time && <span className="text-[10px] text-gray-500">{apt.time}</span>}
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-2 text-gray-500">
                                              <DynamicIcon name="MapPin" size={16} />
                                              <span className="text-xs font-medium">{apt.location || 'En ligne'}</span>
                                          </div>
                                      </div>

                                      <div className="flex gap-2 mt-1">
                                          <button className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-bold text-dark hover:bg-gray-50">
                                              Détails
                                          </button>
                                          {apt.status === 'pending' && (
                                              <button className="flex-1 py-2 rounded-lg border border-red-100 text-xs font-bold text-red-500 hover:bg-red-50">
                                                  Annuler
                                              </button>
                                          )}
                                          {apt.status === 'confirmed' && isService && (
                                              <button className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-green-700">
                                                  Itinéraire
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              );
                          })
                      ) : (
                          <div className="text-center py-10 opacity-60">
                              <DynamicIcon name="CalendarCheck" size={40} className="mx-auto mb-2 text-gray-300"/>
                              <p className="text-sm text-gray-500">Aucun rendez-vous {appointmentFilter !== 'all' ? (appointmentFilter === 'service' ? 'technique' : 'administratif') : ''} trouvé.</p>
                          </div>
                      )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-2xl text-xs text-blue-800 leading-relaxed">
                      <p className="flex gap-2">
                          <DynamicIcon name="Info" size={16} className="shrink-0" />
                          Pour les rendez-vous "Service IT", merci de vous présenter 10 minutes à l'avance. Pour les documents, vous recevrez une notification dès que le travail commence.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Warranties Overlay */}
      {showWarranties && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                  <button onClick={() => setShowWarranties(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Historique & Garanties</h2>
              </div>
              <div className="p-6 space-y-6">
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="block text-2xl font-bold text-dark">{userWarranties.filter((w: WarrantyItem) => w.status === 'active').length}</span>
                          <span className="text-xs text-gray-500">Garanties Actives</span>
                          <div className="h-1 w-full bg-green-100 mt-2 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 w-3/4"></div>
                          </div>
                      </div>
                      <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="block text-2xl font-bold text-dark">{userWarranties.length}</span>
                          <span className="text-xs text-gray-500">Appareils Total</span>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-bold text-dark mb-4 text-sm uppercase tracking-wider text-gray-400">Vos Appareils</h3>
                      <div className="space-y-4">
                          {userWarranties.map((warranty: WarrantyItem) => {
                              const progress = getWarrantyProgress(warranty.purchaseDate, warranty.expirationDate);
                              const badge = getWarrantyBadge(warranty.status);
                              return (
                                <div key={warranty.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl shrink-0 p-2">
                                            <img src={warranty.image} alt={warranty.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-dark text-sm truncate leading-tight">{warranty.productName}</h4>
                                            <p className="text-xs text-gray-500 mt-1">S/N: {warranty.serialNumber}</p>
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold mt-2 ${badge.color}`}>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                {badge.label}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                                        <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                                            <span>Acheté le {new Date(warranty.purchaseDate).toLocaleDateString('fr-FR')}</span>
                                            <span>Expire le {new Date(warranty.expirationDate).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${warranty.status === 'expired' ? 'bg-gray-400' : progress > 80 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                        <div className="text-right mt-1">
                                            <span className="text-[10px] text-primary font-bold">{warranty.coverage}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 text-xs font-bold text-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Facture</button>
                                        <button className="flex-1 py-2 text-xs font-bold text-white bg-dark rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"><DynamicIcon name="Wrench" size={12} /> Support</button>
                                    </div>
                                </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Addresses Overlay */}
      {showAddresses && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                  <button onClick={() => { setShowAddresses(false); setShowAddressForm(false); }} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Adresses de livraison</h2>
                  {!showAddressForm && (
                      <button onClick={handleNewAddress} className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-sm hover:bg-green-700">
                          <DynamicIcon name="Plus" size={20} />
                      </button>
                  )}
              </div>
              <div className="p-6">
                  {showAddressForm ? (
                      <div className="space-y-4 animate-in slide-in-from-right">
                          <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{addressData.id ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</h3>
                          <div>
                              <label className="block text-xs font-bold text-dark mb-1">Libellé (ex: Maison)</label>
                              <input type="text" value={addressData.label} onChange={e => setAddressData({...addressData, label: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" placeholder="Maison, Bureau..." />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-dark mb-1">Ville</label>
                              <input type="text" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-dark mb-1">Quartier / Rue</label>
                              <input type="text" value={addressData.street} onChange={e => setAddressData({...addressData, street: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" />
                          </div>
                          <div className="pt-4 flex gap-3">
                              <button onClick={() => setShowAddressForm(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Annuler</button>
                              <button onClick={handleSaveAddress} className="flex-1 py-3 text-white font-bold bg-primary rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20">Enregistrer</button>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {user?.addresses && user.addresses.length > 0 ? (
                              user.addresses.map((addr: Address) => (
                                  <div key={addr.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
                                      <div className="flex gap-3">
                                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-secondary shrink-0">
                                              <DynamicIcon name="MapPin" size={20} />
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-dark text-sm">{addr.label}</h4>
                                              <p className="text-xs text-gray-500 mt-0.5">{addr.street}, {addr.city}</p>
                                          </div>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={() => handleEditAddress(addr)} className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-lg transition-colors"><DynamicIcon name="Settings" size={16} /></button>
                                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><DynamicIcon name="Trash2" size={16} /></button>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-10 opacity-60">
                                  <DynamicIcon name="MapPin" size={40} className="mx-auto mb-2 text-gray-300"/>
                                  <p className="text-sm text-gray-500">Aucune adresse enregistrée.</p>
                                  <button onClick={handleNewAddress} className="mt-4 text-primary font-bold text-sm hover:underline">Ajouter une adresse</button>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Payment Methods Overlay */}
      {showPayments && (
          <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 z-10 shadow-sm">
                  <button onClick={() => { setShowPayments(false); setShowPaymentForm(false); }} className="p-2 hover:bg-gray-100 rounded-full">
                      <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
                  </button>
                  <h2 className="text-lg font-bold text-dark flex-1">Moyens de paiement</h2>
                  {!showPaymentForm && (
                      <button onClick={handleNewPayment} className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-sm hover:bg-green-700">
                          <DynamicIcon name="Plus" size={20} />
                      </button>
                  )}
              </div>
              <div className="p-6">
                  {showPaymentForm ? (
                      <div className="space-y-4 animate-in slide-in-from-right">
                          <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Ajouter un moyen de paiement</h3>
                          <div className="flex gap-2 mb-4">
                              <button onClick={() => setPaymentFormData({...paymentFormData, type: 'momo', provider: 'MTN'})} className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${paymentFormData.type === 'momo' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-400'}`}>
                                  <DynamicIcon name="Smartphone" size={20} />
                                  <span className="text-xs font-bold">Mobile Money</span>
                              </button>
                              <button onClick={() => setPaymentFormData({...paymentFormData, type: 'card', provider: 'Visa'})} className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${paymentFormData.type === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-400'}`}>
                                  <DynamicIcon name="CreditCard" size={20} />
                                  <span className="text-xs font-bold">Carte Bancaire</span>
                              </button>
                          </div>
                          {paymentFormData.type === 'momo' ? (
                              <>
                                  <div>
                                      <label className="block text-xs font-bold text-dark mb-1">Opérateur</label>
                                      <div className="flex gap-3">
                                          <button onClick={() => setPaymentFormData({...paymentFormData, provider: 'MTN'})} className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${paymentFormData.provider === 'MTN' ? 'border-yellow-400 bg-yellow-50 text-dark' : 'border-gray-100 text-gray-500'}`}>MTN</button>
                                          <button onClick={() => setPaymentFormData({...paymentFormData, provider: 'Airtel'})} className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${paymentFormData.provider === 'Airtel' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 text-gray-500'}`}>Airtel</button>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-dark mb-1">Numéro de téléphone</label>
                                      <input type="tel" value={paymentFormData.number} onChange={e => setPaymentFormData({...paymentFormData, number: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" placeholder="06 123 4567" />
                                  </div>
                              </>
                          ) : (
                              <>
                                  <div>
                                      <label className="block text-xs font-bold text-dark mb-1">Numéro de carte</label>
                                      <input type="text" value={paymentFormData.number} onChange={e => setPaymentFormData({...paymentFormData, number: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" placeholder="0000 0000 0000 0000" />
                                  </div>
                                  <div className="flex gap-3">
                                      <div className="flex-1">
                                          <label className="block text-xs font-bold text-dark mb-1">Expiration</label>
                                          <input type="text" value={paymentFormData.expiry || ''} onChange={e => setPaymentFormData({...paymentFormData, expiry: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" placeholder="MM/AA" />
                                      </div>
                                      <div className="flex-1">
                                          <label className="block text-xs font-bold text-dark mb-1">CVV</label>
                                          <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" placeholder="123" />
                                      </div>
                                  </div>
                              </>
                          )}
                          <div>
                              <label className="block text-xs font-bold text-dark mb-1">Titulaire</label>
                              <input type="text" value={paymentFormData.holderName} onChange={e => setPaymentFormData({...paymentFormData, holderName: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-primary outline-none" />
                          </div>
                          <div className="pt-4 flex gap-3">
                              <button onClick={() => setShowPaymentForm(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Annuler</button>
                              <button onClick={handleSavePayment} className="flex-1 py-3 text-white font-bold bg-primary rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20">Ajouter</button>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {user?.paymentMethods && user.paymentMethods.length > 0 ? (
                              user.paymentMethods.map((method: PaymentMethod) => (
                                  <div key={method.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-sm ${method.provider === 'MTN' ? 'bg-yellow-400' : method.provider === 'Airtel' ? 'bg-red-500' : 'bg-dark'}`}>
                                              {method.type === 'card' ? <DynamicIcon name="CreditCard" size={20} /> : method.provider.substring(0,3)}
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-dark text-sm">{method.provider} {method.type === 'card' ? 'Visa' : 'Money'}</h4>
                                              <p className="text-xs text-gray-500 mt-0.5">{method.type === 'card' ? `•••• ${method.number.slice(-4)}` : method.number}</p>
                                          </div>
                                      </div>
                                      <button onClick={() => handleDeletePayment(method.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><DynamicIcon name="Trash2" size={18} /></button>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-10 opacity-60">
                                  <DynamicIcon name="CreditCard" size={40} className="mx-auto mb-2 text-gray-300"/>
                                  <p className="text-sm text-gray-500">Aucun moyen de paiement.</p>
                                  <button onClick={handleNewPayment} className="mt-4 text-primary font-bold text-sm hover:underline">Ajouter maintenant</button>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Main Profile View */}
      <div className="px-6 pt-12 animate-in fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 p-1 mb-4 relative group cursor-pointer" onClick={() => setShowSettings(true)}>
              <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white" />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <DynamicIcon name="Settings" size={14} className="text-white" />
              </div>
          </div>
          <h2 className="text-xl font-bold text-dark">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-primary text-xs font-bold rounded-full">Membre SonuMarket Elite</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
                <span className="block text-2xl font-bold text-dark">{MOCK_ORDERS.length}</span>
                <span className="text-xs text-gray-500">Commandes 2025</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm">
                <span className="block text-2xl font-bold text-dark">124 pts</span>
                <span className="text-xs text-gray-500">Fidélité</span>
            </div>
        </div>
        <div className="space-y-3">
          {menuItems.map((item, index) => (
              <button key={index} onClick={item.action} className="w-full bg-white p-3 pr-5 rounded-3xl border border-gray-100 flex items-center justify-between hover:border-primary/30 hover:shadow-md hover:translate-x-1 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                          <DynamicIcon name={item.icon} size={22} />
                      </div>
                      <div className="flex flex-col items-start">
                          <span className="font-bold text-dark text-sm group-hover:text-primary transition-colors">{item.label}</span>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      {item.badge && <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full">{item.badge}</span>}
                      <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                        <DynamicIcon name="ChevronLeft" size={18} className="rotate-180 text-gray-300 group-hover:text-primary" />
                      </div>
                  </div>
              </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
