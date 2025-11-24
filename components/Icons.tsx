
import React from 'react';
import { 
  Gamepad2, 
  Laptop, 
  Cpu, 
  Keyboard, 
  Wrench, 
  Home, 
  Grid, 
  ShoppingCart, 
  CalendarCheck, 
  User,
  Heart,
  Star,
  ChevronLeft,
  Share2,
  Plus,
  Search,
  Bell,
  Trash2,
  Minus,
  Check,
  X,
  ArrowRight,
  CreditCard,
  Truck,
  MessageCircle,
  RefreshCw,
  LogOut,
  MapPin,
  Package,
  Settings,
  FileText,
  FileSpreadsheet,
  Download,
  Briefcase,
  File,
  Camera
} from 'lucide-react';

export const IconMap: Record<string, React.ElementType> = {
  Gamepad2,
  Laptop,
  Cpu,
  Keyboard,
  Wrench,
  Home,
  Grid,
  ShoppingCart,
  CalendarCheck,
  User,
  Heart,
  Star,
  ChevronLeft,
  Share2,
  Plus,
  Search,
  Bell,
  Trash2,
  Minus,
  Check,
  X,
  ArrowRight,
  CreditCard,
  Truck,
  MessageCircle,
  RefreshCw,
  LogOut,
  MapPin,
  Package,
  Settings,
  FileText,
  FileSpreadsheet,
  Download,
  Briefcase,
  File,
  Camera
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  fill?: string;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, size = 24, className = "", fill = "none" }) => {
  const IconComponent = IconMap[name] || IconMap['Grid']; // Fallback
  return <IconComponent size={size} className={className} fill={fill} />;
};
