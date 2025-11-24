
export enum ViewState {
  HOME = 'HOME',
  CATEGORIES = 'CATEGORIES',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  PROFILE = 'PROFILE',
  SERVICES = 'SERVICES',
  PC_BUILDER = 'PC_BUILDER',
  DIGITAL_STORE = 'DIGITAL_STORE',
  CV_BUILDER = 'CV_BUILDER',
  REDACTION_SERVICE = 'REDACTION_SERVICE',
  AUTH = 'AUTH'
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'info';
}

export interface CVTemplate {
  id: string;
  name: string;
  image: string;
  price: number;
  style: string;
}

export interface RedactionOption {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number; // Percentage
  description: string;
  specs: Record<string, string>;
  reviews: number;
  socket?: string; // Pour compatibilité CPU/CM
  type?: 'cpu' | 'gpu' | 'ram' | 'storage' | 'case' | 'psu' | 'motherboard' | 'cooling' | 'other' | 'chassis' | 'cpu-mobile' | 'ram-mobile' | 'os' | 'digital';
  fileType?: 'pdf' | 'docx' | 'xlsx' | 'zip'; // Pour les produits numériques
  digitalContents?: string[]; // Liste des fichiers/chapitres inclus
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: CartItem[];
}

export interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
}

export interface PaymentMethod {
  id: string;
  type: 'momo' | 'airtel' | 'card';
  provider: string; // "MTN", "Airtel", "Visa", "Mastercard"
  number: string; // Masked number or phone
  holderName: string;
  expiry?: string; // For cards
}

export interface WarrantyItem {
  id: string;
  productName: string;
  image: string;
  serialNumber: string;
  purchaseDate: string;
  expirationDate: string;
  status: 'active' | 'expiring' | 'expired';
  coverage: string; // ex: "Pièces et main d'oeuvre"
}

export interface Appointment {
  id: string;
  type: 'service' | 'document';
  title: string;
  date: string; // ISO Date
  time?: string; // Pour les services physiques
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  description: string;
  provider?: string;
  location?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    addresses?: Address[];
    paymentMethods?: PaymentMethod[];
    warranties?: WarrantyItem[];
    appointments?: Appointment[];
    wishlist?: Product[];
}