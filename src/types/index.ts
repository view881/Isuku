export type Language = 'en' | 'rw' | 'fr';

export type UserRole = 'owner' | 'admin' | 'sales_manager' | 'sales_agent';

export interface ProductVariant {
  size: string; // e.g., '500 ml', '1 L', '5 L', '20 L'
  sku: string;
  priceRwf: number; // in Rwandan Francs (RWF)
  wholesalePriceRwf: number;
  wholesaleMinQty: number; // minimum quantity to trigger wholesale price
  stockQuantity: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // 'dishwashing' | 'handwashing' | 'laundry' | 'multipurpose' | 'floor' | 'commercial'
  shortDescription: string;
  fullDescription: string;
  usageInstructions: string;
  ingredients: string[];
  safetyInstructions: string;
  features: string[];
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
}

export interface CartItem {
  productId: string;
  productSlug: string;
  name: string;
  category: string;
  size: string;
  sku: string;
  unitPriceRwf: number;
  quantity: number;
  image: string;
}

export type CustomerType = 
  | 'household'
  | 'retailer'
  | 'hotel'
  | 'school'
  | 'hospital'
  | 'restaurant'
  | 'cleaning_company'
  | 'wholesaler';

export type PaymentMethod = 
  | 'cash_on_delivery'
  | 'momo_mtn'
  | 'airtel_money'
  | 'bank_transfer';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type FulfillmentStatus = 
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  sku: string;
  unitPriceRwf: number;
  quantity: number;
  subtotalRwf: number;
}

export interface OrderEvent {
  status: FulfillmentStatus;
  note: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ISP-2026-1042
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    organizationName?: string;
    customerType: CustomerType;
    district: string; // e.g. Gasabo, Kicukiro, Nyarugenge, or Upcountry
    deliveryAddress: string;
  };
  items: OrderItem[];
  subtotalRwf: number;
  discountRwf: number;
  discountCodeApplied?: string;
  deliveryFeeRwf: number;
  taxRwf: number; // 18% VAT included or specified
  totalRwf: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customerNotes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderEvent[];
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  organization?: string;
  phone: string;
  email?: string;
  customerType: CustomerType;
  estimatedVolume?: string; // e.g., '100 Liters / Month'
  interestProduct?: string;
  source: 'ai_chatbot' | 'wholesale_form' | 'contact_form' | 'landing_page';
  status: LeadStatus;
  assignedTo?: string;
  followUpDate?: string;
  notes: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProducts?: {
    id: string;
    name: string;
    slug: string;
    size: string;
    priceRwf: number;
    image: string;
  }[];
  quoteDetails?: {
    items: { name: string; size: string; qty: number; unitPrice: number; total: number }[];
    subtotal: number;
    savings: number;
    finalTotal: number;
  };
  suggestedActions?: string[];
  isEscalated?: boolean;
}

export interface Conversation {
  id: string;
  visitorId: string;
  customerName?: string;
  customerPhone?: string;
  customerType?: CustomerType;
  messages: ChatMessage[];
  status: 'active' | 'escalated' | 'resolved';
  leadCaptured: boolean;
  leadId?: string;
  lastActive: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderRwf: number;
  description: string;
  active: boolean;
}

export interface WebsiteContent {
  announcementText: string;
  announcementActive: boolean;
  freeDeliveryThresholdRwf: number;
  heroHeadline: string;
  heroSubheadline: string;
  companyName: string;
  companyAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  businessHours: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
