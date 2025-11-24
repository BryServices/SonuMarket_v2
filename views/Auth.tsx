import React, { useState } from 'react';
import { DynamicIcon } from '../components/Icons';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  // Step 1: PHONE, Step 2: OTP
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
        setError('Numéro de téléphone invalide');
        return;
    }
    setError(null);
    setIsLoading(true);
    
    // Simulate SMS sending API
    setTimeout(() => {
        setIsLoading(false);
        setStep(2);
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
        setError('Le code doit contenir 4 chiffres');
        return;
    }
    
    setIsLoading(true);
    // Simulate OTP Verification
    setTimeout(() => {
        setIsLoading(false);
        // Mock User Data based on phone
        onLogin({
            id: `user-${phone}`,
            name: `Utilisateur ${phone.slice(-4)}`, // Fallback name
            email: `${phone}@sonumarket.cg`, // Placeholder email
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80'
        });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in">
      <div className="w-full max-w-sm">
        
        {/* Logo & Header */}
        <div className="text-center mb-10">
            {/* Logo Placeholder - Simulating the 'S' logo with colors */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
                 <div className="absolute top-0 left-0 w-full h-2/3 bg-primary rounded-t-3xl rounded-br-3xl shadow-lg z-10"></div>
                 <div className="absolute bottom-0 right-0 w-full h-2/3 bg-secondary rounded-b-3xl rounded-tl-3xl shadow-lg"></div>
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                     <span className="text-4xl font-extrabold text-white">S</span>
                 </div>
            </div>

            <h1 className="text-2xl font-bold text-dark mb-2">
                {step === 1 ? 'Bienvenue sur SonuMarket' : 'Vérification'}
            </h1>
            <p className="text-gray-500 text-sm">
                {step === 1 
                    ? 'Entrez votre numéro pour continuer.' 
                    : `Code envoyé au +242 ${phone}`}
            </p>
        </div>

        {/* Step 1: Phone Input */}
        {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6 animate-in slide-in-from-right duration-300">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Numéro de téléphone</label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl h-14 px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <div className="flex items-center gap-2 border-r border-gray-300 pr-3 mr-3">
                            <img src="https://flagcdn.com/w40/cg.png" alt="Congo Flag" className="w-6 rounded-sm shadow-sm" />
                            <span className="font-bold text-dark">+242</span>
                        </div>
                        <input 
                            autoFocus
                            type="tel" 
                            value={phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, ''); 
                                setPhone(val);
                                setError(null);
                            }}
                            className="bg-transparent border-none outline-none w-full text-lg font-medium text-dark placeholder-gray-400" 
                            placeholder="06 123 4567" 
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1"><DynamicIcon name="X" size={12}/> {error}</p>}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || phone.length === 0}
                    className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <DynamicIcon name="RefreshCw" className="animate-spin" /> : 'Recevoir le code'}
                </button>
                
                <p className="text-center text-xs text-gray-400 px-4">
                    En continuant, vous acceptez nos conditions générales d'utilisation.
                </p>
            </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-4">Code de validation</label>
                    <div className="relative w-full">
                         <input 
                            autoFocus
                            type="text" 
                            maxLength={4}
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value.replace(/\D/g, ''));
                                setError(null);
                            }}
                            className="w-full h-16 bg-gray-50 border border-gray-200 rounded-2xl text-center text-3xl font-bold tracking-[1rem] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark"
                            placeholder="----"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><DynamicIcon name="X" size={12}/> {error}</p>}
                    
                    <div className="mt-2 p-2 bg-green-50 text-primary text-xs rounded-lg animate-pulse">
                        💡 Code de test : <strong>1234</strong>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        type="submit" 
                        disabled={isLoading || otp.length !== 4}
                        className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <DynamicIcon name="RefreshCw" className="animate-spin" /> : 'Valider'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => { setStep(1); setOtp(''); setError(null); }}
                        className="w-full py-3 text-gray-500 text-sm font-medium hover:text-dark transition-colors"
                    >
                        Modifier le numéro
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default Auth;