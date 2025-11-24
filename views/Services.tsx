

import React, { useState, useRef, useEffect } from 'react';
import { SERVICES } from '../constants';
import { Service } from '../types';
import { DynamicIcon } from '../components/Icons';

interface ServicesProps {
  onBack: () => void;
  onBook: (service: Service, date: string, time: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onBack, onBook }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Refs for auto-scroll
  const dateSectionRef = useRef<HTMLDivElement>(null);
  const timeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedService && dateSectionRef.current) {
        setTimeout(() => dateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDate && timeSectionRef.current) {
        setTimeout(() => timeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, [selectedDate]);

  // Mock future dates
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  // Mock time slots
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:30'];

  const trustBadges = [
      { icon: 'Shield', label: 'Garantie 6 mois', desc: 'Sur réparations' },
      { icon: 'Cpu', label: 'Experts Certifiés', desc: 'SonuMarket Pro' },
      { icon: 'RefreshCw', label: 'Pièces d\'origine', desc: 'Partenaires' },
  ];

  const getServiceIcon = (id: string) => {
      switch(id) {
          case 'cleaning': return 'RefreshCw';
          case 'diag': return 'Search';
          case 'assembly': return 'Cpu';
          case 'redaction': return 'FileText';
          default: return 'Settings';
      }
  };

  return (
    <div className="bg-background min-h-screen pb-48 animate-in fade-in">
      
      {/* Header & Hero */}
      <div className="bg-dark text-white rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 px-6 pt-4 pb-8">
             <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                    <DynamicIcon name="ChevronLeft" size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold">L'Atelier SonuMarket</h1>
             </div>
             
             <div className="mb-6">
                 <h2 className="text-2xl font-bold mb-2">Expertise & Qualité</h2>
                 <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                     Confiez votre matériel à nos experts. Diagnostic précis, réparation rapide et transparente.
                 </p>
             </div>

             {/* Trust Badges */}
             <div className="flex justify-between gap-2">
                 {trustBadges.map((badge, idx) => (
                     <div key={idx} className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center text-center border border-white/5">
                         <DynamicIcon name={badge.icon} size={20} className="text-secondary mb-2" />
                         <span className="text-[10px] font-bold block uppercase tracking-wide text-gray-200">{badge.label}</span>
                         <span className="text-[9px] text-gray-400">{badge.desc}</span>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      <div className="p-6 space-y-8 -mt-2">
         {/* Step 1: Service Selection */}
         <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold text-dark">Nos Prestations</h3>
                {selectedService && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        Étape 1 validée
                    </span>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {SERVICES.map(service => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                        <button
                            key={service.id}
                            onClick={() => { setSelectedService(service); setSelectedDate(''); setSelectedTime(''); }}
                            className={`group relative w-full text-left p-5 rounded-2xl border transition-all duration-300 overflow-hidden
                                ${isSelected 
                                    ? 'bg-white border-primary shadow-lg shadow-green-500/10 ring-1 ring-primary' 
                                    : 'bg-white border-transparent shadow-sm hover:shadow-md'}`}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-0 bg-primary text-white p-1.5 rounded-bl-xl rounded-tr-xl">
                                    <DynamicIcon name="Check" size={14} strokeWidth={3} />
                                </div>
                            )}
                            
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                    ${isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary group-hover:bg-primary/5'}`}>
                                    <DynamicIcon name={getServiceIcon(service.id)} size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-base ${isSelected ? 'text-primary' : 'text-dark'}`}>{service.name}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-3 pr-4">{service.description}</p>
                                    
                                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                                            <DynamicIcon name="Clock" size={14} />
                                            {service.duration} min environ
                                        </div>
                                        <span className={`font-bold text-base ${isSelected ? 'text-dark' : 'text-gray-700'}`}>
                                            {service.price.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-400">XAF</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
         </section>

         {/* Step 2: Date Selection */}
         {selectedService && (
             <section ref={dateSectionRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Disponibilités</h3>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar scroll-smooth">
                    {dates.map((date, idx) => {
                        const isSelected = selectedDate === date.toISOString();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(date.toISOString())}
                                className={`flex flex-col items-center justify-center min-w-[72px] h-[88px] rounded-2xl border transition-all duration-200 snap-center
                                    ${isSelected 
                                        ? 'bg-dark text-white border-dark shadow-lg scale-105' 
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                            >
                                <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-gray-400' : isWeekend ? 'text-red-400' : 'text-gray-400'}`}>
                                    {date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')}
                                </span>
                                <span className="text-2xl font-bold mb-1">{date.getDate()}</span>
                                <span className="text-[10px] capitalize">{date.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                            </button>
                        )
                    })}
                </div>
             </section>
         )}

         {/* Step 3: Time Selection */}
         {selectedDate && (
            <section ref={timeSectionRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <h3 className="text-sm font-bold text-dark mb-4 px-1">Créneaux du {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border
                                ${selectedTime === time 
                                    ? 'bg-primary text-white border-primary shadow-md shadow-green-500/20' 
                                    : 'bg-white text-dark border-gray-100 hover:border-gray-300'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </section>
         )}
      </div>

      {/* Confirmation Footer */}
      {selectedTime && selectedService && (
          <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 p-5 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-end mb-4 text-sm">
                  <div>
                      <span className="text-gray-500 block text-xs mb-1">Total à régler sur place</span>
                      <span className="font-bold text-2xl text-dark">{selectedService.price.toLocaleString('fr-FR')} <span className="text-sm text-gray-500 font-normal">XAF</span></span>
                  </div>
                  <div className="text-right">
                      <span className="block font-bold text-dark">{selectedTime}</span>
                      <span className="text-gray-500 text-xs">{new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
              </div>
              <button 
                onClick={() => onBook(selectedService, selectedDate, selectedTime)}
                className="w-full bg-secondary text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                  Confirmer le rendez-vous
                  <DynamicIcon name="ArrowRight" size={20} />
              </button>
          </div>
      )}
    </div>
  );
};

export default Services;