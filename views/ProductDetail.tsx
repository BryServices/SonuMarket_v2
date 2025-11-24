
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { DynamicIcon } from '../components/Icons';
import { PRODUCTS } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, variant?: string) => void;
  onShowToast: (message: string) => void;
}

// Données simulées pour les avis
const MOCK_REVIEWS_DATA = [
  { id: 1, user: 'Jean M.', rating: 5, date: 'Il y a 2 jours', comment: 'Excellent produit, conforme à la description. Téléchargement immédiat.' },
  { id: 2, user: 'Sarah L.', rating: 4, date: 'Il y a 1 semaine', comment: 'Très utile, mais j\'aurais aimé un guide vidéo en plus.' },
  { id: 3, user: 'Marc D.', rating: 5, date: 'Il y a 2 semaines', comment: 'Indispensable pour mon travail. Je recommande à 100%.' },
];

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Question Modal State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState('');

  // Comparison State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  // Reviews & Rating Logic
  const [reviews, setReviews] = useState(MOCK_REVIEWS_DATA);
  const [currentRating, setCurrentRating] = useState(product.rating);
  const [reviewCount, setReviewCount] = useState(product.reviews);
  
  // New Review Form State
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    setIsExpanded(false);
    // Reset rating states when product changes
    setCurrentRating(product.rating);
    setReviewCount(product.reviews);
    setReviews(MOCK_REVIEWS_DATA); 
    // Reset modals
    setShowQuestionModal(false);
    setShowCompareModal(false);
  }, [product.id]);

  const isDigital = product.type === 'digital';

  // Custom labels for digital products
  const tabLabel = isDigital ? 'Contenu du Pack' : 'Fiche Technique';
  const actionButtonLabel = isDigital ? 'Acheter & Télécharger' : 'Ajouter au panier';

  const getFileIcon = (fileName: string) => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') return { icon: 'FileText', color: 'text-red-500', bg: 'bg-red-100' };
      if (ext === 'xlsx' || ext === 'xls') return { icon: 'FileSpreadsheet', color: 'text-green-600', bg: 'bg-green-100' };
      if (ext === 'docx' || ext === 'doc') return { icon: 'FileText', color: 'text-blue-600', bg: 'bg-blue-100' };
      return { icon: 'File', color: 'text-gray-500', bg: 'bg-gray-100' };
  };

  const handleShare = async () => {
    // Prevent "Invalid URL" errors in some environments (iframe, local preview)
    let urlToShare = window.location.href;
    try {
        const u = new URL(urlToShare);
        if (u.protocol === 'about:' || u.protocol === 'data:') {
             throw new Error('Invalid protocol');
        }
    } catch (e) {
        urlToShare = `https://sonumarket.app/product/${product.id}`;
    }

    const shareData = {
      title: product.name,
      text: `Découvrez ${product.name} sur SonuMarket !`,
      url: urlToShare
    };

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(urlToShare);
        onShowToast('Lien copié dans le presse-papier !');
      }
    } catch (err) {
      console.error('Erreur lors du partage :', err);
      try {
        await navigator.clipboard.writeText(urlToShare);
        onShowToast('Lien copié dans le presse-papier !');
      } catch (clipboardErr) {
        // Ignore if clipboard also fails
      }
    }
  };

  const handleSendQuestion = () => {
      if (!questionText.trim()) {
          onShowToast('Veuillez écrire votre question.');
          return;
      }
      setShowQuestionModal(false);
      setQuestionText('');
      onShowToast(isDigital ? 'Question envoyée à l\'auteur !' : 'Demande transmise au service technique !');
  };

  const handleCompare = () => {
      // Find similar products in the same category, excluding current product and digital products
      const similar = PRODUCTS.filter(p => 
          p.category === product.category && 
          p.id !== product.id && 
          p.type !== 'digital'
      ).slice(0, 2); // Limit comparison to 2 others max

      if (similar.length === 0) {
          onShowToast('Aucun produit similaire trouvé pour comparer.');
          return;
      }

      setComparisonProducts(similar);
      setShowCompareModal(true);
  };

  const handleSubmitReview = () => {
      if (userRating === 0) {
          onShowToast('Veuillez sélectionner une note.');
          return;
      }
      if (!userComment.trim()) {
          onShowToast('Veuillez écrire un commentaire.');
          return;
      }

      const newReview = {
          id: Date.now(),
          user: 'Vous',
          rating: userRating,
          date: "À l'instant",
          comment: userComment
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);

      // Calculate new weighted average
      const totalStars = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAvg = totalStars / updatedReviews.length;
      
      setCurrentRating(parseFloat(newAvg.toFixed(1)));
      setReviewCount(updatedReviews.length);
      
      setUserRating(0);
      setUserComment('');
      onShowToast('Merci pour votre avis !');
  };

  return (
    <div className="bg-background min-h-screen pb-48 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Question Modal */}
      {showQuestionModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-dark">Une question ?</h3>
                      <button onClick={() => setShowQuestionModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                          <DynamicIcon name="X" size={20} className="text-gray-500" />
                      </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-cover rounded-lg mix-blend-multiply"/>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500">Concerne :</p>
                          <p className="text-sm font-bold text-dark line-clamp-1">{product.name}</p>
                      </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                      {isDigital 
                        ? "L'équipe support vous répondra par email concernant ce pack digital." 
                        : "Nos techniciens vous répondront sous 24h ouvrées."}
                  </p>
                  <textarea 
                      autoFocus
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary text-sm min-h-[120px] mb-4"
                      placeholder={isDigital ? "Bonjour, ce modèle est-il compatible avec..." : "Bonjour, est-ce que ce composant..."}
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                  />
                  <button 
                      onClick={handleSendQuestion}
                      className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                  >
                      Envoyer ma question
                  </button>
              </div>
          </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl sticky top-0 z-10">
                      <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                          <DynamicIcon name="RefreshCw" size={20} className="text-primary"/> Comparateur
                      </h3>
                      <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                          <DynamicIcon name="X" size={24} className="text-gray-500" />
                      </button>
                  </div>
                  
                  <div className="overflow-auto flex-1 p-4">
                      <div className="flex gap-4 min-w-max">
                          {/* Column 1: Current Product */}
                          <div className="w-40 flex flex-col gap-2 shrink-0">
                              <div className="h-32 bg-gray-50 rounded-xl p-2 flex items-center justify-center border-2 border-primary/20 relative">
                                  <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">VOTRE CHOIX</span>
                                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply"/>
                              </div>
                              <h4 className="text-xs font-bold text-dark line-clamp-2 h-8">{product.name}</h4>
                              <p className="text-sm font-bold text-primary">{product.price.toLocaleString('fr-FR')} XAF</p>
                              <div className="flex items-center gap-1 mb-2">
                                  <DynamicIcon name="Star" size={10} className="text-yellow-400" fill="currentColor"/>
                                  <span className="text-xs text-gray-500">{product.rating}</span>
                              </div>
                              
                              <div className="space-y-2 mt-2">
                                  {Object.entries(product.specs).map(([key, val]) => (
                                      <div key={key} className="bg-gray-50 p-2 rounded-lg">
                                          <p className="text-[9px] text-gray-400 uppercase mb-0.5">{key}</p>
                                          <p className="text-xs font-medium text-dark line-clamp-2">{val}</p>
                                      </div>
                                  ))}
                              </div>
                              <button onClick={() => { setShowCompareModal(false); }} className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-default mt-2">
                                  Sélectionné
                              </button>
                          </div>

                          {/* Comparison Columns */}
                          {comparisonProducts.map((comp) => (
                              <div key={comp.id} className="w-40 flex flex-col gap-2 shrink-0 border-l border-gray-100 pl-4">
                                  <div className="h-32 bg-white rounded-xl p-2 flex items-center justify-center border border-gray-100">
                                      <img src={comp.image} alt={comp.name} className="w-full h-full object-contain mix-blend-multiply"/>
                                  </div>
                                  <h4 className="text-xs font-bold text-dark line-clamp-2 h-8">{comp.name}</h4>
                                  <p className="text-sm font-bold text-dark">{comp.price.toLocaleString('fr-FR')} XAF</p>
                                  <div className="flex items-center gap-1 mb-2">
                                      <DynamicIcon name="Star" size={10} className="text-yellow-400" fill="currentColor"/>
                                      <span className="text-xs text-gray-500">{comp.rating}</span>
                                  </div>

                                  <div className="space-y-2 mt-2">
                                      {Object.keys(product.specs).map((key) => (
                                          <div key={key} className="bg-white border border-gray-100 p-2 rounded-lg">
                                              <p className="text-[9px] text-gray-400 uppercase mb-0.5">{key}</p>
                                              <p className="text-xs font-medium text-dark line-clamp-2">
                                                  {comp.specs[key] || '-'}
                                              </p>
                                          </div>
                                      ))}
                                  </div>
                                  <button 
                                      onClick={() => { setShowCompareModal(false); onAddToCart(comp); }}
                                      className="w-full py-2 bg-dark text-white text-xs font-bold rounded-lg hover:bg-gray-800 mt-2"
                                  >
                                      Choisir celui-ci
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Header Actions */}
      <div className="fixed top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-dark hover:bg-white transition-all">
          <DynamicIcon name="ChevronLeft" size={24} />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button onClick={() => setIsFav(!isFav)} className={`w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm transition-all ${isFav ? 'text-red-500' : 'text-dark hover:text-red-500'}`}>
            <DynamicIcon name="Heart" size={20} fill={isFav ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-dark hover:bg-white transition-all active:scale-95"
          >
            <DynamicIcon name="Share2" size={20} />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="w-full h-[45vh] bg-white rounded-b-[3rem] shadow-sm overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        
        {/* Overlay for digital products to signify content type */}
        {isDigital && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-6">
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold border border-white/30">
                    Téléchargement Immédiat
                </span>
            </div>
        )}
      </div>

      <div className="px-6 pt-8">
        {/* Title & Rating */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
             <h1 className="text-2xl font-bold text-dark leading-tight flex-1 pr-4">{product.name}</h1>
          </div>
          <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary whitespace-nowrap">{product.price.toLocaleString('fr-FR')} XAF</span>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <DynamicIcon key={i} name="Star" size={16} fill={i < Math.floor(currentRating) ? "currentColor" : "none"} className={i >= Math.floor(currentRating) ? "text-gray-300" : ""} />
                  ))}
                </div>
                <span className="text-sm font-medium text-dark">{currentRating}</span>
                <span className="text-xs text-gray-400">({reviewCount})</span>
              </div>
          </div>
        </div>

        {/* Variants (Only for non-digital products typically, but keeping logic flexible) */}
        {!isDigital && (
            <div className="mb-6">
            <span className="text-sm font-semibold text-gray-500 mb-3 block">Options</span>
            <div className="flex gap-3">
                {['Standard', 'Premium', 'Pro'].map((variant, idx) => (
                <button
                    key={variant}
                    onClick={() => setSelectedVariant(idx)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 
                    ${selectedVariant === idx 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                    {variant}
                </button>
                ))}
            </div>
            </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex gap-3 mb-8">
             {!isDigital && (
                 <button 
                    onClick={handleCompare}
                    className="flex-1 py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
                 >
                    <DynamicIcon name="RefreshCw" size={16} /> Comparer
                 </button>
             )}
             <button 
                onClick={() => setShowQuestionModal(true)}
                className="flex-1 py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
             >
                <DynamicIcon name="MessageCircle" size={16} /> {isDigital ? 'Question pack' : 'Question technique'}
             </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'specs', label: tabLabel },
              { id: 'reviews', label: `Avis (${reviewCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-2 text-sm font-semibold mr-6 relative transition-colors
                  ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
          
          <div className="pt-4 min-h-[150px]">
            {activeTab === 'desc' && (
              <div className="animate-in fade-in duration-300">
                <p className={`text-gray-600 leading-relaxed text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
                  {product.description}
                </p>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-primary text-sm font-semibold flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>Voir moins <DynamicIcon name="Minus" size={12} /></>
                  ) : (
                    <>Voir plus <DynamicIcon name="Plus" size={12} /></>
                  )}
                </button>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="animate-in fade-in duration-300">
                {isDigital && product.digitalContents ? (
                    // Digital Product Content List
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 mb-2">Ce pack contient {product.digitalContents.length} fichiers :</p>
                        {product.digitalContents.map((file, idx) => {
                            const iconStyle = getFileIcon(file);
                            return (
                                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className={`w-10 h-10 rounded-lg ${iconStyle.bg} flex items-center justify-center shrink-0`}>
                                        <DynamicIcon name={iconStyle.icon} size={20} className={iconStyle.color} />
                                    </div>
                                    <span className="text-sm font-medium text-dark truncate">{file}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Standard Product Specs
                    <div className="space-y-2">
                        {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500 text-sm">{key}</span>
                            <span className="text-dark font-medium text-sm">{value}</span>
                        </div>
                        ))}
                    </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                
                {/* List of reviews */}
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <DynamicIcon name="User" size={14} />
                                    </div>
                                    <span className="text-sm font-bold text-dark">{review.user}</span>
                                </div>
                                <span className="text-[10px] text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <DynamicIcon key={i} name="Star" size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>

                {/* Add Review Form */}
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-dark mb-3">Donnez votre avis</h3>
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none transition-transform active:scale-90">
                                <DynamicIcon 
                                    name="Star" 
                                    size={32} 
                                    className={star <= userRating ? "text-yellow-400" : "text-gray-200"} 
                                    fill={star <= userRating ? "currentColor" : "none"} 
                                />
                            </button>
                        ))}
                    </div>
                    <textarea 
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary text-sm min-h-[100px] mb-3"
                        placeholder="Qu'avez-vous pensé de ce produit ?"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                    />
                    <button 
                        onClick={handleSubmitReview}
                        className="w-full py-3 bg-dark text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Publier mon avis
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 flex items-center gap-4">
         <button 
            onClick={() => onAddToCart(product)}
            className={`flex-1 text-white h-14 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2
                ${isDigital ? 'bg-secondary hover:bg-orange-600 shadow-orange-500/20' : 'bg-dark hover:bg-gray-800'}`}
         >
            <DynamicIcon name={isDigital ? 'Download' : 'ShoppingCart'} size={20} />
            {actionButtonLabel}
         </button>
         {!isDigital && (
             <button className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <DynamicIcon name="Wrench" size={24} />
             </button>
         )}
      </div>
    </div>
  );
};

export default ProductDetail;
