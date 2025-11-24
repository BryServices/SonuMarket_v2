
import React, { useState, useMemo } from 'react';
import { DIGITAL_PRODUCTS } from '../constants';
import { Product } from '../types';
import { DynamicIcon } from '../components/Icons';

interface DigitalStoreProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
  onOpenRedaction: () => void;
  onOpenCVBuilder: () => void;
}

const DigitalStore: React.FC<DigitalStoreProps> = ({ onAddToCart, onProductClick, onBack, onOpenRedaction, onOpenCVBuilder }) => {
  const [filter, setFilter] = useState<string>('all');

  // Filter Categories
  const categories = useMemo(() => [
    { id: 'all', label: 'Tout', count: DIGITAL_PRODUCTS.length },
    { id: 'Administratif', label: 'Administratif', count: DIGITAL_PRODUCTS.filter(p => p.category === 'Administratif').length },
    { id: 'Finance', label: 'Finance', count: DIGITAL_PRODUCTS.filter(p => p.category === 'Finance').length },
    { id: 'Carrière', label: 'Carrière', count: DIGITAL_PRODUCTS.filter(p => p.category === 'Carrière').length },
  ], []);

  const filteredProducts = useMemo(() => 
    filter === 'all' 
    ? DIGITAL_PRODUCTS 
    : DIGITAL_PRODUCTS.filter(p => p.category === filter)
  , [filter]);

  const getFileIcon = (type?: string) => {
      switch(type) {
          case 'pdf': return { name: 'FileText', color: 'text-red-500', bg: 'bg-red-100' };
          case 'xlsx': return { name: 'FileSpreadsheet', color: 'text-green-600', bg: 'bg-green-100' };
          case 'docx': return { name: 'FileText', color: 'text-blue-600', bg: 'bg-blue-100' };
          default: return { name: 'File', color: 'text-gray-500', bg: 'bg-gray-100' };
      }
  };

  return (
    <div className="pb-24 bg-background min-h-screen animate-in slide-in-from-right duration-300">
      
      {/* Header Pro avec Gradient */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pb-8 pt-6 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-start relative z-10">
             <div>
                 <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 text-sm font-medium transition-colors">
                     <DynamicIcon name="ChevronLeft" size={16} /> Retour
                 </button>
                 <span className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 block">E-Librairie</span>
                 <h1 className="text-2xl font-bold leading-tight">Documents <br/> & Outils Pro</h1>
             </div>
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                 <DynamicIcon name="Briefcase" size={24} className="text-blue-300" />
             </div>
          </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 mb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2
                        ${filter === cat.id 
                            ? 'bg-dark text-white border-dark shadow-md' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                      {cat.label}
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] min-w-[1.25rem] text-center ${filter === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {cat.count}
                      </span>
                  </button>
              ))}
          </div>
      </div>

      <div className="px-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark">
                {filter === 'all' ? 'Tous les produits' : categories.find(c => c.id === filter)?.label}
              </h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map(product => {
                  const iconStyle = getFileIcon(product.fileType);
                  return (
                    <div 
                        key={product.id} 
                        className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full animate-in fade-in group border border-transparent hover:border-gray-100"
                        onClick={() => onProductClick(product)}
                    >
                        {/* Image Section */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-50">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            {/* File Type Badge Overlay */}
                            <div className={`absolute top-2 left-2 ${iconStyle.bg} p-1.5 rounded-lg shadow-sm backdrop-blur-sm z-10`}>
                                <DynamicIcon name={iconStyle.name} size={14} className={iconStyle.color} />
                            </div>
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 z-10">
                                {product.fileType?.toUpperCase()}
                            </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="flex flex-col flex-grow">
                            <h3 className="font-bold text-dark text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-1 mb-2">
                                <DynamicIcon name="Star" size={12} className="text-yellow-400" fill="currentColor"/>
                                <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
                                <span className="text-[10px] text-gray-400 ml-1">({product.reviews})</span>
                            </div>
                            
                            <div className="mt-auto flex items-center justify-between pt-2">
                                <span className="font-bold text-primary text-sm">
                                    {product.price.toLocaleString('fr-FR')} XAF
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                                    className="w-8 h-8 bg-dark text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors shadow-sm"
                                >
                                    <DynamicIcon name="Download" size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                  );
              })}
          </div>

          {filteredProducts.length === 0 && (
             <div className="text-center py-12 opacity-60">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name="File" size={32} className="text-gray-400" />
                </div>
                <h3 className="text-dark font-bold mb-1">Aucun document</h3>
                <p className="text-sm text-gray-500">Essayez une autre catégorie.</p>
             </div>
          )}

          {/* Promo Banners */}
          <div className="mt-8 space-y-4">
              {/* CV Generator Banner */}
              <div 
                onClick={onOpenCVBuilder}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 shadow-lg shadow-blue-500/20 cursor-pointer group relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                  
                  <div className="relative z-10 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                        <DynamicIcon name="User" size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">NOUVEAU</span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-tight">Générateur de CV</h4>
                        <p className="text-blue-100 text-xs mt-1">
                            Créez un CV pro en 2 minutes.
                        </p>
                    </div>
                    <div className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                         <DynamicIcon name="ArrowRight" size={18} />
                    </div>
                  </div>
              </div>

              {/* Redaction Service Link */}
              <div 
                onClick={onOpenRedaction}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 shadow-lg shadow-emerald-500/20 cursor-pointer group relative overflow-hidden"
              >
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                        <DynamicIcon name="FileText" size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                             <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">SUR MESURE</span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-tight">Assistance Rédaction</h4>
                        <p className="text-emerald-100 text-xs mt-1 pr-2">
                            Correction, relecture & mise en page par nos experts.
                        </p>
                    </div>
                    <div className="bg-white text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                         <DynamicIcon name="ArrowRight" size={18} />
                    </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default DigitalStore;
