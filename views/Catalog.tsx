
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { CATEGORIES, PRODUCTS } from '../constants';
import { DynamicIcon } from '../components/Icons';

interface CatalogProps {
  initialCategory?: string;
  onProductClick: (product: Product) => void;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ initialCategory = 'all', onProductClick, onBack, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });

  // Mapping between Category IDs (navigation) and Product Categories (data)
  // 'id_from_constants' : 'string_in_product_data'
  const categoryMapping: Record<string, string> = {
    'gaming': 'Gaming', // Assumes products might have this or we filter loosely
    'laptop': 'Laptops',
    'components': 'Composants',
    'peripherals': 'Périphériques',
    'configurateur': 'Configurateur'
  };

  const filterTabs = [
    { id: 'all', name: 'Tout' },
    ...CATEGORIES.filter(c => c.id !== 'services') // Services has its own view
  ];

  const filteredProducts = useMemo(() => {
    let products = PRODUCTS;

    // 1. Filter by Category
    if (activeCategory === 'all') {
      // Exclude 'Configurateur' parts from general view unless specified to keep catalog clean
      products = products.filter(p => p.category !== 'Configurateur');
    } else {
      const mappedCategory = categoryMapping[activeCategory] || activeCategory;
      products = products.filter(product => {
        // Loose matching for better results
        return product.category.includes(mappedCategory) || 
               (activeCategory === 'gaming' && product.description.toLowerCase().includes('gamer'));
      });
    }

    // 2. Filter by Price
    products = products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    return products;
  }, [activeCategory, priceRange]);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numVal = parseInt(value);
    setPriceRange(prev => ({ 
        ...prev, 
        [type]: isNaN(numVal) ? 0 : numVal 
    }));
  };

  return (
    <div className="pb-24 bg-background min-h-screen animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-dark">Catalogue</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
           <DynamicIcon name="Search" size={20} className="text-dark" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-gray-100 pb-2">
        <div className="flex overflow-x-auto px-4 gap-2 no-scrollbar py-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${activeCategory === tab.id 
                  ? 'bg-dark text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">{filteredProducts.length} articles trouvés</span>
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors ${showFilters ? 'text-primary' : 'text-dark'}`}
            >
                Filtrer <DynamicIcon name="Grid" size={14} />
            </button>
        </div>

        {/* Price Range Filter UI */}
        {showFilters && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-dark">Prix (XAF)</h3>
                    <button 
                        onClick={() => setPriceRange({ min: 0, max: 5000000 })}
                        className="text-xs text-primary font-bold hover:underline"
                    >
                        Réinitialiser
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Min</label>
                        <input 
                            type="number" 
                            value={priceRange.min || ''}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            className="w-full p-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium focus:border-primary outline-none"
                            placeholder="0"
                        />
                    </div>
                    <div className="text-gray-300 mt-4">-</div>
                    <div className="flex-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Max</label>
                        <input 
                            type="number" 
                            value={priceRange.max || ''}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            className="w-full p-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium focus:border-primary outline-none"
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>
        )}

        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
                <div 
                key={product.id} 
                onClick={() => onProductClick(product)}
                className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full animate-in fade-in"
                >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                    )}
                </div>
                
                <div className="flex flex-col flex-grow">
                    <h4 className="text-sm font-semibold text-dark leading-snug mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-[10px] text-gray-400 mb-2">{product.category}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-dark">{product.price.toLocaleString('fr-FR')} XAF</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                        className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                        <DynamicIcon name="Plus" size={14} />
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <DynamicIcon name="Package" size={48} className="mb-4 text-gray-300" />
                <p>Aucun produit ne correspond à ces critères</p>
                <button 
                    onClick={() => setPriceRange({ min: 0, max: 5000000 })}
                    className="mt-2 text-primary font-bold text-sm hover:underline"
                >
                    Réinitialiser les prix
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
