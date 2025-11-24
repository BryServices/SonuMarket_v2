
import React, { useState } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { DynamicIcon } from '../components/Icons';

interface PCBuilderProps {
  onAddToCart: (products: Product[]) => void;
  onBack: () => void;
}

type PartType = 'chassis' | 'cpu-mobile' | 'ram-mobile' | 'storage' | 'os';

const STEPS: { id: PartType; label: string; icon: string; desc: string }[] = [
  { id: 'chassis', label: 'Châssis & Écran', icon: 'Laptop', desc: 'La base de votre portable' },
  { id: 'cpu-mobile', label: 'Processeur', icon: 'Cpu', desc: 'La puissance de calcul' },
  { id: 'ram-mobile', label: 'Mémoire RAM', icon: 'Grid', desc: 'Pour le multitâche' },
  { id: 'storage', label: 'Stockage SSD', icon: 'Package', desc: 'Espace disque rapide' },
  { id: 'os', label: 'Logiciel', icon: 'Settings', desc: 'Système d\'exploitation' },
];

const PCBuilder: React.FC<PCBuilderProps> = ({ onAddToCart, onBack }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selection, setSelection] = useState<Record<PartType, Product | null>>({
    chassis: null,
    'cpu-mobile': null,
    'ram-mobile': null,
    storage: null,
    os: null
  });

  const handleSelect = (product: Product) => {
    setSelection(prev => {
      const newSelection = { ...prev, [STEPS[currentStep].id]: product };
      return newSelection;
    });
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const getStepProducts = (type: PartType) => {
    return PRODUCTS.filter(p => p.type === type);
  };

  const totalPrice = (Object.values(selection) as (Product | null)[]).reduce((sum, item) => sum + (item?.price || 0), 0);
  const isComplete = Object.values(selection).filter(Boolean).length === STEPS.length;

  return (
    <div className="pb-48 bg-background min-h-screen animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-dark">Configurateur Laptop</h1>
          <p className="text-xs text-gray-500">
             {isComplete ? 'Configuration prête' : `Étape ${currentStep + 1}/${STEPS.length}`}
          </p>
        </div>
        <div className="text-right">
            <span className="block text-xs text-gray-500">Total estimé</span>
            <span className="font-bold text-primary">{totalPrice.toLocaleString('fr-FR')} XAF</span>
        </div>
      </div>

      <div className="p-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-6 px-2">
          {STEPS.map((step, idx) => (
            <button 
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex flex-col items-center gap-1 w-12 ${idx === currentStep ? 'opacity-100' : selection[step.id] ? 'opacity-100' : 'opacity-40'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 
                ${idx === currentStep ? 'bg-primary text-white ring-4 ring-primary/20' : 
                  selection[step.id] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {selection[step.id] ? <DynamicIcon name="Check" size={14} /> : idx + 1}
              </div>
              <span className="text-[10px] font-medium truncate w-full text-center">{step.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="mb-4">
            <h2 className="text-xl font-bold text-dark">{STEPS[currentStep].label}</h2>
            <p className="text-sm text-gray-500">{STEPS[currentStep].desc}</p>
        </div>

        <div className="space-y-3">
          {getStepProducts(STEPS[currentStep].id).map((product) => (
            <div 
              key={product.id}
              onClick={() => handleSelect(product)}
              className={`bg-white p-3 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-center
                ${selection[STEPS[currentStep].id]?.id === product.id ? 'border-primary shadow-md' : 'border-transparent shadow-sm hover:border-gray-200'}`}
            >
              {product.image && <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl bg-gray-50" />}
              <div className="flex-1">
                <h3 className="font-semibold text-dark text-sm">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                   <DynamicIcon name="Star" size={12} className="text-yellow-400" fill="currentColor"/>
                   <span className="text-xs text-gray-500">{product.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                    <span key={k} className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-600">{k}: {v}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between self-stretch py-1">
                 <span className="font-bold text-dark text-sm whitespace-nowrap">{product.price > 0 ? `${product.price.toLocaleString('fr-FR')} XAF` : 'Inclus'}</span>
                 {selection[STEPS[currentStep].id]?.id === product.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white mt-2">
                       <DynamicIcon name="Check" size={14} />
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 p-4 z-30">
        <div className="flex gap-3">
            <button 
                onClick={() => setSelection({ chassis: null, 'cpu-mobile': null, 'ram-mobile': null, storage: null, os: null })}
                className="px-4 py-3 rounded-xl bg-gray-100 text-dark font-medium hover:bg-gray-200 transition-colors"
            >
                <DynamicIcon name="RefreshCw" size={20} />
            </button>
            <button 
                disabled={!isComplete}
                onClick={() => onAddToCart(Object.values(selection).filter(Boolean) as Product[])}
                className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                    ${isComplete ? 'bg-secondary hover:bg-orange-600 shadow-orange-500/30' : 'bg-gray-300 cursor-not-allowed'}`}
            >
                {isComplete ? 'Commander ce Laptop' : `Continuer (${Object.values(selection).filter(Boolean).length}/5)`}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;
