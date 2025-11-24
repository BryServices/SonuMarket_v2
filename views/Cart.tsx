
import React from 'react';
import { CartItem, ViewState } from '../types';
import { DynamicIcon } from '../components/Icons';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, onBack }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 5000; // Livraison offerte au dessus de 500k XAF
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <DynamicIcon name="ShoppingCart" size={40} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Découvrez nos configurations laptops et composants de pointe.</p>
        <button onClick={onBack} className="bg-dark text-white px-8 py-3 rounded-2xl font-medium hover:bg-gray-800 transition-colors">
            Commencer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-48 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 shadow-sm">
        <h1 className="text-xl font-bold text-dark flex-1">Mon Panier <span className="text-sm font-normal text-gray-500">({items.length})</span></h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-20 h-20 bg-gray-50 rounded-xl shrink-0 overflow-hidden">
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <h3 className="font-semibold text-dark text-sm line-clamp-2 leading-tight pr-2">{item.name}</h3>
                   <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                       <DynamicIcon name="Trash2" size={18} />
                   </button>
                </div>
                <div className="flex justify-between items-end mt-2">
                   <span className="font-bold text-dark">{item.price.toLocaleString('fr-FR')} XAF</span>
                   <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-3">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-primary disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                          <DynamicIcon name="Minus" size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-primary"
                      >
                          <DynamicIcon name="Plus" size={14} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="font-bold text-dark mb-2">Résumé de la commande</h3>
            <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString('fr-FR')} XAF</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Offerte</span> : `${shipping.toLocaleString('fr-FR')} XAF`}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3 mt-2 flex justify-between items-center">
                <span className="font-bold text-dark text-lg">Total</span>
                <span className="font-bold text-primary text-xl">{total.toLocaleString('fr-FR')} XAF</span>
            </div>
            
            {/* Mock Payment Info */}
            <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 mt-4">
                <DynamicIcon name="CreditCard" className="text-primary" size={20} />
                <div className="flex-1">
                    <p className="text-xs text-blue-800 font-semibold">Paiement sécurisé</p>
                    <p className="text-[10px] text-blue-600">Mobile Money, Carte Bancaire ou Espèces à la livraison</p>
                </div>
                <DynamicIcon name="Check" size={16} className="text-blue-600" />
            </div>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 p-4 pb-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <button 
            onClick={onCheckout}
            className="w-full bg-secondary hover:bg-orange-600 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3"
         >
            Valider la commande
            <DynamicIcon name="ArrowRight" size={20} />
         </button>
      </div>
    </div>
  );
};

export default Cart;
