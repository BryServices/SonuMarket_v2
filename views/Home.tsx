import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS, NOTIFICATIONS } from '../constants';
import { Product, ViewState, Notification } from '../types';
import { DynamicIcon } from '../components/Icons';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onChangeView: (view: ViewState) => void;
  onCategorySelect: (categoryId: string) => void;
}

const Home: React.FC<HomeProps> = ({ onProductClick, onChangeView, onCategorySelect }) => {
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Category Filter State (Local to Home)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  // Search Logic
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  // Home Page Filtering Logic based on selected Category pill
  const homeDisplayProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      // Default: Show Top Ventes (first 4 items)
      return PRODUCTS.slice(0, 4);
    }

    // Mapping category IDs to Product category strings
    const categoryMapping: Record<string, string> = {
      'gaming': 'Gaming', // Matches implied category logic or assumes Gaming PCs
      'laptop': 'Laptops',
      'components': 'Composants',
      'peripherals': 'Périphériques',
    };

    const targetCategory = categoryMapping[selectedCategory];

    if (!targetCategory) return [];

    return PRODUCTS.filter(product => {
       // Special case for "gaming" which might be a tag in description rather than just a category
       if (selectedCategory === 'gaming') {
           return product.description.toLowerCase().includes('gamer') || product.name.toLowerCase().includes('rtx');
       }
       return product.category.includes(targetCategory);
    });
  }, [selectedCategory]);

  // Notifications Logic
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Main UI Handlers
  const handleProductSelect = (product: Product) => {
    setIsSearchOpen(false);
    onProductClick(product);
  };

  const handleCategoryClick = (id: string) => {
      if (id === 'services') {
          onChangeView(ViewState.SERVICES);
      } else {
          // Toggle selection: if clicking active, go back to all, else set active
          setSelectedCategory(prev => prev === id ? 'all' : id);
      }
  };

  return (
    <div className="pb-24 bg-background min-h-screen relative">
      
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-6 py-4 bg-white shadow-sm flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-4 h-12">
               <DynamicIcon name="Search" size={20} className="text-gray-400" />
               <input 
                  autoFocus
                  type="text" 
                  placeholder="Rechercher un produit..." 
                  className="bg-transparent border-none outline-none w-full ml-3 text-dark placeholder-gray-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-gray-200">
                    <DynamicIcon name="X" size={16} className="text-gray-500" />
                 </button>
               )}
            </div>
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="font-semibold text-dark text-sm"
            >
              Annuler
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
             {searchQuery.trim() === '' ? (
               <div className="text-center mt-20 text-gray-400">
                  <DynamicIcon name="Search" size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Tapez le nom d'un produit, d'une catégorie ou une caractéristique.</p>
               </div>
             ) : filteredProducts.length > 0 ? (
               <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Résultats ({filteredProducts.length})</h3>
                 {filteredProducts.map(product => (
                   <div 
                      key={product.id} 
                      onClick={() => handleProductSelect(product)}
                      className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                   >
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-dark text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{product.category}</p>
                        <span className="text-primary font-bold text-sm mt-1 block">{product.price.toLocaleString('fr-FR')} XAF</span>
                      </div>
                      <DynamicIcon name="ChevronLeft" size={20} className="rotate-180 text-gray-300" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center mt-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name="X" size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-dark">Aucun résultat</h3>
                  <p className="text-gray-500 text-sm mt-1">Essayez avec d'autres mots-clés.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Notifications Overlay */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsNotifOpen(false)}>
           <div 
              className="absolute top-0 bottom-0 right-0 w-full max-w-sm bg-background shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
              onClick={(e) => e.stopPropagation()}
           >
              {/* Header */}
              <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <button onClick={() => setIsNotifOpen(false)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                       <DynamicIcon name="ArrowRight" size={20} className="text-dark" />
                    </button>
                    <h2 className="text-lg font-bold text-dark">Notifications</h2>
                 </div>
                 {notifications.length > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs font-semibold text-primary hover:text-green-700">
                        Tout lire
                    </button>
                 )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {notifications.length > 0 ? (
                    notifications.map(notif => (
                       <div key={notif.id} className={`p-4 rounded-2xl relative group transition-all ${notif.read ? 'bg-white' : 'bg-white border border-primary/20 shadow-sm shadow-green-500/5'}`}>
                          {!notif.read && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>}
                          <div className="flex gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'promo' ? 'bg-orange-100 text-orange-500' : notif.type === 'order' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                                <DynamicIcon name={notif.type === 'promo' ? 'Star' : notif.type === 'order' ? 'Package' : 'Bell'} size={18} />
                             </div>
                             <div className="flex-1">
                                <h4 className={`text-sm mb-1 pr-4 ${notif.read ? 'font-semibold text-gray-700' : 'font-bold text-dark'}`}>{notif.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-2">{notif.message}</p>
                                <span className="text-[10px] text-gray-400 font-medium">{notif.date}</span>
                             </div>
                             <button 
                                onClick={() => handleDeleteNotif(notif.id)}
                                className="absolute bottom-3 right-3 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                <DynamicIcon name="Trash2" size={16} />
                             </button>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                        <DynamicIcon name="Bell" size={48} className="mb-4 text-gray-300" />
                        <p className="text-gray-500 font-medium">Aucune notification</p>
                    </div>
                 )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                 <div className="p-4 bg-white border-t border-gray-100">
                    <button 
                       onClick={handleClearAll}
                       className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                    >
                       <DynamicIcon name="Trash2" size={16} />
                       Effacer tout
                    </button>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Bienvenue</span>
          <h1 className="text-xl font-bold text-dark">SonuMarket</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <DynamicIcon name="Search" size={20} className="text-dark" />
          </button>
          <button 
             onClick={() => setIsNotifOpen(true)}
             className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-dark'}`}
          >
            <DynamicIcon name="Bell" size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Promo Banner - Updated to link to Digital Store */}
        <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" 
            alt="Documents Pro" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full mb-2">
              Nouveau
            </span>
            <h2 className="text-2xl font-bold text-white mb-1 leading-tight">
              Documents & <br/> Contrats Pro
            </h2>
            <p className="text-gray-200 text-sm mb-4">Modèles validés par experts</p>
            <button 
                onClick={() => onChangeView(ViewState.DIGITAL_STORE)}
                className="bg-white text-dark px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-100 transition-colors w-fit shadow-lg"
            >
              Voir la bibliothèque
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-dark">Catégories</h3>
            <button 
              onClick={() => onCategorySelect('all')}
              className="text-primary text-sm font-medium hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex flex-col items-center min-w-[80px] group space-y-2`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm 
                    ${isActive 
                      ? 'bg-primary text-white shadow-green-500/30' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <DynamicIcon name={cat.iconName} size={24} />
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular/Filtered Products */}
        <div>
          <h3 className="text-lg font-bold text-dark mb-4">
            {selectedCategory === 'all' ? 'Top Ventes' : `Sélection : ${CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Produits'}`}
          </h3>
          
          {homeDisplayProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {homeDisplayProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => onProductClick(product)}
                  className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full animate-in fade-in"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                      <DynamicIcon name="Heart" size={16} />
                    </button>
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <h4 className="text-sm font-semibold text-dark leading-snug mb-1 line-clamp-2">{product.name}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      <DynamicIcon name="Star" size={12} className="text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-bold text-dark bg-gray-100 px-2 py-1 rounded-lg">{product.price.toLocaleString('fr-FR')} XAF</span>
                      <button className="w-8 h-8 bg-dark text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <DynamicIcon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10 opacity-60">
                <DynamicIcon name="Package" size={40} className="mx-auto mb-2 text-gray-300"/>
                <p className="text-sm text-gray-500">Aucun produit dans cette sélection.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;