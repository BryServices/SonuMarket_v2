

import React, { useState, useRef } from 'react';
import { CV_TEMPLATES } from '../constants';
import { CVTemplate } from '../types';
import { DynamicIcon } from '../components/Icons';

interface CVBuilderProps {
  onBack: () => void;
}

// Steps: 0=Template, 1=Info, 2=Photo, 3=Payment, 4=Success
type Step = 0 | 1 | 2 | 3 | 4;

const CVBuilder: React.FC<CVBuilderProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    experienceYears: '',
    keySkills: '',
    summary: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel'>('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step < 4) setStep((prev) => (prev + 1) as Step);
  };

  const handleBackStep = () => {
    if (step > 0) setStep((prev) => (prev - 1) as Step);
    else onBack();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call for Payment
    setTimeout(() => {
      setIsProcessing(false);
      handleNext(); // Go to success
    }, 2500);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Template Selection
        return (
          <div className="space-y-4 px-1">
            <h2 className="text-xl font-bold text-dark mb-2">Choisissez votre style</h2>
            <div className="grid grid-cols-2 gap-4">
              {CV_TEMPLATES.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm
                    ${selectedTemplate?.id === tpl.id ? 'border-primary ring-2 ring-primary/30 scale-[1.02]' : 'border-transparent'}`}
                >
                  <img src={tpl.image} alt={tpl.name} className="w-full h-40 object-cover" />
                  <div className="p-3 bg-white">
                    <h3 className="font-bold text-sm text-dark">{tpl.name}</h3>
                    <span className="text-xs text-primary font-bold">{tpl.price.toLocaleString('fr-FR')} XAF</span>
                  </div>
                  {selectedTemplate?.id === tpl.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                      <DynamicIcon name="Check" size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Information Input
        return (
          <div className="space-y-5 animate-in slide-in-from-right">
             <div className="bg-green-50 p-4 rounded-2xl flex gap-3 items-start">
                <DynamicIcon name="MessageCircle" className="text-primary mt-1" size={20} />
                <div>
                   <h3 className="text-sm font-bold text-dark">L'Assistant SonuMarket</h3>
                   <p className="text-xs text-gray-600 mt-1">Je vais vous aider à structurer votre CV. Remplissez ces informations clés.</p>
                </div>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom complet</label>
                   <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors"
                      placeholder="Ex: Jean Dupont"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Poste visé</label>
                   <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors"
                      placeholder="Ex: Comptable Senior"
                      value={formData.jobTitle}
                      onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                        <input 
                            type="tel" 
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors"
                            placeholder="+242..."
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expérience</label>
                        <select 
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors appearance-none"
                            value={formData.experienceYears}
                            onChange={e => setFormData({...formData, experienceYears: e.target.value})}
                        >
                            <option value="">Choisir...</option>
                            <option value="0-2">Junior (0-2 ans)</option>
                            <option value="3-5">Intermédiaire (3-5 ans)</option>
                            <option value="5+">Senior (5+ ans)</option>
                        </select>
                    </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">3 Compétences clés</label>
                   <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary transition-colors"
                      placeholder="Ex: Excel, Management, Anglais"
                      value={formData.keySkills}
                      onChange={e => setFormData({...formData, keySkills: e.target.value})}
                   />
                </div>
             </div>
          </div>
        );

      case 2: // Photo Upload
        return (
          <div className="flex flex-col items-center justify-center py-8 animate-in fade-in">
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 rounded-full border-4 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all relative overflow-hidden group"
             >
                {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <DynamicIcon name="User" size={48} className="text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-bold text-gray-400">Ajouter une photo</span>
                        <span className="text-[10px] text-gray-300">Tap to upload</span>
                    </>
                )}
                
                {photoPreview && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <DynamicIcon name="RefreshCw" className="text-white" size={24} />
                    </div>
                )}
             </div>
             <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handlePhotoUpload}
             />
             
             <div className="mt-8 text-center max-w-xs">
                 <h3 className="font-bold text-dark mb-1">Photo Professionnelle</h3>
                 <p className="text-xs text-gray-500">
                    Utilisez une photo bien éclairée, sur fond neutre. Vous pouvez prendre une photo directement avec votre téléphone.
                 </p>
             </div>
          </div>
        );

      case 3: // Payment
        return (
            <div className="animate-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-6 text-center">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total à payer</span>
                    <div className="text-4xl font-extrabold text-dark mt-2 mb-1">
                        {selectedTemplate?.price.toLocaleString('fr-FR')} <span className="text-lg text-gray-400 font-medium">XAF</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-green-700 text-xs font-bold">
                        <DynamicIcon name="Check" size={12} /> Modèle {selectedTemplate?.name}
                    </div>
                </div>

                <h3 className="font-bold text-dark mb-4 px-2">Moyen de paiement</h3>
                <div className="space-y-3">
                    <button 
                        onClick={() => setPaymentMethod('momo')}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all
                        ${paymentMethod === 'momo' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white text-xs">MTN</div>
                            <span className="font-bold text-dark">Mobile Money</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'momo' ? 'border-primary' : 'border-gray-300'}`}>
                            {paymentMethod === 'momo' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                        </div>
                    </button>

                    <button 
                        onClick={() => setPaymentMethod('airtel')}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all
                        ${paymentMethod === 'airtel' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">Airtel</div>
                            <span className="font-bold text-dark">Airtel Money</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'airtel' ? 'border-red-500' : 'border-gray-300'}`}>
                            {paymentMethod === 'airtel' && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                        </div>
                    </button>
                </div>
            </div>
        );
        
      case 4: // Success / Download
        return (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <DynamicIcon name="Check" size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Paiement Réussi !</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Votre CV professionnel est prêt. Vous pouvez le télécharger dès maintenant.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-2xl w-full max-w-xs mb-8 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-lg shadow-sm overflow-hidden">
                         {selectedTemplate && <img src={selectedTemplate.image} className="w-full h-full object-cover" />}
                     </div>
                     <div className="text-left flex-1">
                         <h4 className="font-bold text-dark text-sm">CV_{formData.fullName.replace(/\s/g, '_')}.pdf</h4>
                         <span className="text-xs text-gray-400">1.2 MB</span>
                     </div>
                </div>

                <button className="w-full bg-dark text-white h-14 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    <DynamicIcon name="Download" size={20} />
                    Télécharger mon CV
                </button>
                <button onClick={onBack} className="mt-4 text-sm font-medium text-gray-500 hover:text-dark">
                    Retour à la boutique
                </button>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen pb-48 relative flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-10 sticky top-0">
         <button onClick={handleBackStep} className="p-2 hover:bg-gray-100 rounded-full">
            <DynamicIcon name="ChevronLeft" size={24} className="text-dark" />
         </button>
         <div className="flex-1">
            <h1 className="text-lg font-bold text-dark">Création CV</h1>
            {step < 4 && (
                <div className="flex gap-1 mt-1">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            )}
         </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Footer Actions (except for success screen) */}
      {step < 4 && (
        <div className="bg-white p-4 border-t border-gray-100 fixed bottom-[80px] left-0 right-0 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button 
                onClick={step === 3 ? handlePayment : handleNext}
                disabled={(step === 0 && !selectedTemplate) || (step === 1 && !formData.fullName) || isProcessing}
                className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                    ${isProcessing 
                        ? 'bg-gray-100 text-gray-400 cursor-wait' 
                        : 'bg-secondary text-white hover:bg-orange-600 shadow-orange-500/30'}`}
            >
                {isProcessing ? (
                   <>
                     <DynamicIcon name="RefreshCw" className="animate-spin" /> Traitement...
                   </>
                ) : step === 3 ? (
                   <>Payer {selectedTemplate?.price.toLocaleString()} XAF <DynamicIcon name="Check" /></>
                ) : (
                   <>Continuer <DynamicIcon name="ArrowRight" /></>
                )}
            </button>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;