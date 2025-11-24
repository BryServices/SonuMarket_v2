



import { Category, Product, Service, Notification, CVTemplate, RedactionOption, Order } from './types';

export const CATEGORIES: Category[] = [
  { id: 'gaming', name: 'PC Gaming', iconName: 'Gamepad2' },
  { id: 'laptop', name: 'Laptops', iconName: 'Laptop' },
  { id: 'components', name: 'Composants', iconName: 'Cpu' },
  { id: 'peripherals', name: 'Périphér.', iconName: 'Keyboard' },
  { id: 'services', name: 'Services', iconName: 'Wrench' },
];

export const SERVICES: Service[] = [
  { id: 'install', name: 'Installation Windows + Pilotes', duration: 60, price: 15000, description: 'Installation propre, mises à jour et optimisation.' },
  { id: 'assembly', name: 'Montage PC Complet', duration: 120, price: 35000, description: 'Assemblage expert, cable management soigné.' },
  { id: 'cleaning', name: 'Nettoyage & Dépoussiérage', duration: 45, price: 10000, description: 'Nettoyage interne complet et changement pâte thermique.' },
  { id: 'diag', name: 'Diagnostic Panne', duration: 30, price: 5000, description: 'Identification précise du problème matériel ou logiciel.' },
  { id: 'redaction', name: 'Assistance Rédaction & Admin', duration: 60, price: 5000, description: 'Aide à la rédaction de CV, lettres ou personnalisation de contrats.' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Commande expédiée', message: 'Votre commande #CMD-2025-001 est en route avec Express Union.', date: 'Il y a 2h', read: false, type: 'order' },
  { id: '2', title: 'Promo Flash 🔥', message: '-20% sur tous les périphériques Logitech ce week-end !', date: 'Hier', read: false, type: 'promo' },
  { id: '3', title: 'Bienvenue chez SonuMarket', message: 'Complétez votre profil pour gagner 500 points fidélité.', date: 'Il y a 2j', read: true, type: 'info' },
  { id: '4', title: 'Rappel Rendez-vous', message: 'Votre diagnostic est prévu demain à 14h.', date: 'Il y a 3j', read: true, type: 'info' }
];

export const CV_TEMPLATES: CVTemplate[] = [
    { id: 'cv-modern', name: 'Le Pro', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80', price: 2000, style: 'Modern' },
    { id: 'cv-classic', name: 'L\'Exécutif', image: 'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&w=400&q=80', price: 1500, style: 'Classic' },
    { id: 'cv-creative', name: 'Le Créatif', image: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?auto=format&fit=crop&w=400&q=80', price: 2500, style: 'Creative' },
];

export const REDACTION_OPTIONS: RedactionOption[] = [
    { id: 'correction', title: 'Correction & Relecture', description: 'Correction orthographe, grammaire et style.', basePrice: 2000, icon: 'Check' },
    { id: 'letter', title: 'Lettre Administrative', description: 'Rédaction ou mise en forme de courriers.', basePrice: 3000, icon: 'FileText' },
    { id: 'report', title: 'Mise en page Rapport', description: 'Word, PowerPoint. Prix par page.', basePrice: 5000, icon: 'FileSpreadsheet' },
    { id: 'contract', title: 'Personnalisation Contrat', description: 'Adaptation de modèles juridiques.', basePrice: 10000, icon: 'Briefcase' },
];

export const DIGITAL_PRODUCTS: Product[] = [
    {
        id: 'doc-1',
        name: 'Pack Contrats Commerciaux',
        price: 15000,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        category: 'Administratif',
        type: 'digital',
        fileType: 'docx',
        reviews: 45,
        description: 'Un ensemble complet de modèles de contrats conformes aux normes OHADA pour sécuriser vos relations d\'affaires. Idéal pour freelances et PME.',
        specs: { 'Format': 'Word (.docx)', 'Pages': '12 modèles', 'Langue': 'Français' },
        digitalContents: [
            'Contrat de prestation de services.docx',
            'Contrat de vente de marchandises.docx',
            'Accord de confidentialité (NDA).docx',
            'Contrat de partenariat commercial.docx',
            'Lettre de mise en demeure.docx',
            'Statuts SARL simplifiés.docx'
        ]
    },
    {
        id: 'doc-2',
        name: 'Modèle Business Plan Excel',
        price: 10000,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        category: 'Finance',
        type: 'digital',
        fileType: 'xlsx',
        reviews: 120,
        description: 'Tableaux financiers automatisés pour construire votre prévisionnel sur 3 ans. Les formules sont déjà intégrées, il suffit de remplir vos hypothèses.',
        specs: { 'Format': 'Excel (.xlsx)', 'Automatisé': 'Oui', 'Niveau': 'Intermédiaire' },
        digitalContents: [
            '00_Guide_Utilisation.pdf',
            '01_Plan_Tresorerie_Mensuel.xlsx',
            '02_Compte_De_Resultat_Previsionnel.xlsx',
            '03_Bilan_Previsionnel.xlsx',
            '04_Tableau_Amortissements.xlsx',
            '05_Calcul_BFR.xlsx'
        ]
    },
    {
        id: 'doc-3',
        name: 'Pack CV & Lettre Motivation',
        price: 5000,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
        category: 'Carrière',
        type: 'digital',
        fileType: 'docx',
        reviews: 230,
        description: 'Maximisez vos chances avec ces 5 designs modernes et professionnels. Faciles à modifier sur Word ou Canva.',
        specs: { 'Format': 'Word / Canva', 'Design': 'Moderne', 'Modifiable': '100%' },
        digitalContents: [
            'CV_Design_Minimaliste.docx',
            'CV_Design_Creatif.docx',
            'CV_Design_Executif.docx',
            'Lettre_Motivation_Spontanee.docx',
            'Lettre_Motivation_Reponse_Annonce.docx',
            'Bonus_Liste_Verbes_Action.pdf'
        ]
    },
    {
        id: 'doc-4',
        name: 'Guide Création Entreprise',
        price: 2000,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1507842217153-e21f40667276?auto=format&fit=crop&w=800&q=80',
        category: 'Administratif',
        type: 'digital',
        fileType: 'pdf',
        reviews: 89,
        description: 'Ebook complet détaillant toutes les étapes administratives et fiscales pour créer son entreprise au Cameroun et en zone CEMAC.',
        specs: { 'Format': 'PDF', 'Pages': '45 pages', 'Mise à jour': '2024' },
        digitalContents: [
            'Ebook_Creation_Entreprise_2025.pdf',
            'Checklist_Documents_Banque.pdf',
            'Annuaire_Centres_Impots.pdf'
        ]
    }
];

export const PRODUCTS: Product[] = [
  // --- Produits Standards ---
  {
    id: '1',
    name: 'NVIDIA RTX 4080 Founders Edition',
    price: 850000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    category: 'Composants',
    type: 'gpu',
    isNew: true,
    reviews: 124,
    description: 'La carte graphique GeForce RTX® 4080 offre les performances et les fonctionnalités ultra-recherchées par les joueurs passionnés et les créateurs. Donnez vie à vos jeux et projets créatifs avec le ray tracing et les graphismes optimisés par l\'IA.',
    specs: { 'Cœurs CUDA': '9728', 'VRAM': '16 Go GDDR6X', 'Architecture': 'Ada Lovelace', 'Fréquence Boost': '2.51 GHz' }
  },
  {
    id: '2',
    name: 'MacBook Pro 14" M3 Max',
    price: 2100000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    category: 'Laptops',
    discount: 10,
    reviews: 89,
    description: 'Le MacBook Pro 14 pouces avec puce M3 Max offre des performances extrêmes pour les flux de travail les plus exigeants, avec une autonomie encore améliorée.',
    specs: { 'Puce': 'Apple M3 Max', 'RAM': '36 Go', 'SSD': '1 To', 'Écran': 'Liquid Retina XDR' }
  },
  {
    id: 'periph-1',
    name: 'Logitech MX Master 3S',
    price: 65000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    category: 'Périphériques',
    type: 'other',
    reviews: 250,
    description: 'La souris de productivité ultime, repensée. Clics silencieux, défilement électromagnétique MagSpeed, capteur 8K DPI fonctionnant sur le verre.',
    specs: { 'DPI': '8000', 'Connexion': 'Bluetooth / Bolt', 'Autonomie': '70 jours', 'Recharge': 'USB-C' }
  },
  ...DIGITAL_PRODUCTS // Include digital products in the main list if needed for search
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 'CMD-2025-001',
        date: '2025-05-14',
        total: 2165000,
        status: 'shipped',
        items: [
            { ...PRODUCTS[1], quantity: 1, selectedVariant: 'Space Grey' }, // MacBook
            { ...PRODUCTS[2], quantity: 1 } // Mouse
        ]
    },
    {
        id: 'CMD-2025-002',
        date: '2025-05-10',
        total: 15000,
        status: 'delivered',
        items: [
            { ...DIGITAL_PRODUCTS[0], quantity: 1 } // Pack Contrats
        ]
    },
    {
        id: 'CMD-2025-003',
        date: '2025-04-22',
        total: 850000,
        status: 'processing',
        items: [
            { ...PRODUCTS[0], quantity: 1 } // GPU
        ]
    }
];