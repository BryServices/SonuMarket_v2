
import React from 'react';
import { ViewState } from '../types';
import { DynamicIcon } from './Icons';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  cartCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, cartCount = 0 }) => {
  const navItems = [
    { view: ViewState.HOME, icon: 'Home', label: 'Accueil' },
    { view: ViewState.DIGITAL_STORE, icon: 'FileText', label: 'Docs' }, 
    { view: ViewState.CART, icon: 'ShoppingCart', label: 'Panier' },
    { view: ViewState.SERVICES, icon: 'CalendarCheck', label: 'Atelier' },
    { view: ViewState.PROFILE, icon: 'User', label: 'Compte' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 pb-6 z-50 h-[80px] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (item.view === ViewState.PROFILE && currentView === ViewState.AUTH);
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              <DynamicIcon 
                name={item.icon} 
                size={22} 
                className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} 
                fill={isActive && item.icon !== 'CalendarCheck' && item.icon !== 'FileText' ? "currentColor" : "none"}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {item.view === ViewState.CART && cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                  </span>
              )}
            </button>
          );
        })}
    </div>
  );
};

export default BottomNav;
