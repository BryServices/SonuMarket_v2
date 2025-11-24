
import React, { useState, useRef } from 'react';
import { REDACTION_OPTIONS } from '../constants';
import { RedactionOption } from '../types';
import { DynamicIcon } from '../components/Icons';

interface RedactionServiceProps {
  onBack: () => void;
}

// Steps: 0=Option, 1=Instructions, 2=Upload, 3=Payment, 4=Success
type Step = 0 | 1 | 2 | 3 | 4;

const RedactionService: React.FC<RedactionServiceProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>(0);
  const [selectedOption, setSelectedOption] = useState<RedactionOption | null>(null);
  const [instructions, setInstructions] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
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
      case 0: // Option Selection
        return (
          <div className="space-y-4 px-1">
            <h2 className="text-xl font-bold text-dark mb-2">De quoi avez-vous besoin ?</h2>
            <div className="grid grid-cols-1 gap-4">
              {REDACTION_OPTIONS.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-sm text-left flex gap-4 items-center
                    ${selectedOption?.id === opt.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedOption?.id === opt.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <DynamicIcon name={opt.icon} size={24} />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-bold text-sm text-dark">{opt.title}</h3>
                      <p className="text-xs text-gray-500">{opt.description}</p>
                      <span className="text-xs text-primary font-bold mt-1 block">À partir de {opt.basePrice.toLocaleString('fr-FR')} XAF</span>
                  </div>
                  {selectedOption?.id === opt.id && (
                    <div className="bg-primary text-white p-1 rounded-full">
                      <DynamicIcon name="Check" size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // Instructions
        return (
          <div className="space-y-5 animate-in slide-in-from-right">
             <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
                <DynamicIcon name="MessageCircle" className="text-primary mt-1" size={20} />
                <div>
                   <h3 className="text-sm font-bold text-dark">Vos Consignes</h3>
                   <p className="text-xs text-gray-600 mt-1">Expliquez ce que vous attendez du rédacteur (ton, destinataire, éléments clés à inclure...).</p>
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Instructions détaillées</label>
                <textarea 
                   className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-primary transition-colors min-h-[200px] text-sm"
                   placeholder="Ex: J'aimerais corriger ce rapport de stage. Il faut vérifier l'orthographe et améliorer la mise en page..."
                   value={instructions}
                   onChange={e => setInstructions(e.target.value)}
                />
             </div>
          </div>
        );

      case 2: // Upload Content
        return (
          <div className="flex flex-col items-center justify-center py-8 animate-in fade-in space-y-6">
             <div className="text-center max-w-xs">
                 <h3 className="font-bold text-dark mb-1">Joindre votre contenu</h3>
                 <p className="text-xs text-gray-500">
                    Transmettez-nous vos brouillons, documents Word, PDF ou même des photos de vos notes manuscrites.
                 </p>
             </div>

             <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-xs aspect-square rounded-3xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                    ${attachedFile ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-primary hover:bg-gray-50'}`}
             >
                {attachedFile ? (
                    <div className="flex flex-col items-center animate-in zoom-in">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                            <DynamicIcon name="FileText" size={32} className="text-green-600" />
                        </div>
                        <span className="font-bold text-dark text-sm px-4 truncate max-w-full">{attachedFile.name}</span>
                        <span className="text-xs text-green-600 mt-1">Fichier reçu !</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setAttachedFile(null); }}
                            className="mt-4 text-xs text-red-400 font-bold hover:text-red-600 bg-white px-3 py-1 rounded-full shadow-sm"
                        >
                            Changer
                        </button>
                    </div>
                ) : (
                    <>
                        <DynamicIcon name="Download" size={48} className="text-gray-300 mb-4 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-gray-400 group-hover:text-primary">Cliquez pour ajouter</span>
                        <span className="text-[10px] text-gray-300 mt-1">PDF, Word, Images acceptés</span>
                    </>
                )}
             </div>
             <input 
                ref={fileInputRef}
                type="file" 
                accept=".doc,.docx,.pdf,image/*,.txt" 
                className="hidden"
                onChange={handleFileUpload}
             />
             
             <div className="bg-yellow-50 p-4 rounded-xl flex gap-3 text-xs text-yellow-800">
                <DynamicIcon name="Star" size={16} className="shrink-0" fill="currentColor" />
                <p>Nos rédacteurs garantissent une confidentialité totale de vos documents.</p>
             </div>
          </div>
        );

      case 3: // Payment
        return (
            <div className="animate-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-6 text-center">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Estimation</span>
                    <div className="text-4xl font-extrabold text-dark mt-2 mb-1">
                        {selectedOption?.basePrice.toLocaleString('fr-FR')} <span className="text-lg text-gray-400 font-medium">XAF</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-xs font-bold">
                        <DynamicIcon name="Wrench" size={12} /> {selectedOption?.title}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 italic">Le prix final peut varier selon la complexité après étude du dossier.</p>
                </div>

                <h3 className="font-bold text-dark mb-4 px-2">Paiement de l'acompte</h3>
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
        
      case 4: // Success
        return (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <DynamicIcon name="Check" size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Demande Envoyée !</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Un rédacteur va analyser vos documents ({attachedFile?.name}) et vous contacter dans les 30 minutes.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-xs mb-8">
                     <div className="flex justify-between text-sm mb-2">
                         <span className="text-gray-500">Service</span>
                         <span className="font-bold text-dark">{selectedOption?.title}</span>
                     </div>
                     <div className="flex justify-between text-sm mb-2">
                         <span className="text-gray-500">Statut</span>
                         <span className="font-bold text-primary">En attente rédacteur</span>
                     </div>
                     <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Ref. Dossier</span>
                         <span className="font-mono text-dark">#RED-2025-889</span>
                     </div>
                </div>

                <button onClick={onBack} className="w-full bg-dark text-white h-14 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    <DynamicIcon name="Home" size={20} />
                    Retour à l'accueil
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
            <h1 className="text-lg font-bold text-dark">Service Rédaction</h1>
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
                disabled={(step === 0 && !selectedOption) || (step === 2 && !attachedFile) || isProcessing}
                className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                    ${isProcessing 
                        ? 'bg-gray-100 text-gray-400 cursor-wait' 
                        : (step === 0 && !selectedOption) || (step === 2 && !attachedFile) 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-blue-700 shadow-blue-500/30'}`}
            >
                {isProcessing ? (
                   <>
                     <DynamicIcon name="RefreshCw" className="animate-spin" /> Traitement...
                   </>
                ) : step === 3 ? (
                   <>Payer l'acompte <DynamicIcon name="Check" /></>
                ) : (
                   <>Continuer <DynamicIcon name="ArrowRight" /></>
                )}
            </button>
        </div>
      )}
    </div>
  );
};

export default RedactionService;
