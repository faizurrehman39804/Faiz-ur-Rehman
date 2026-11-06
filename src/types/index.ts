export type UserRole = 'owner' | 'manager' | 'agent' | 'accountant';
export type Language = 'en' | 'ur';

export type PropertyType = 
  | 'plot' 
  | 'house' 
  | 'flat' 
  | 'shop' 
  | 'commercial_plot' 
  | 'agricultural' 
  | 'rental';

export type PropertyStatus = 'available' | 'hold' | 'booked' | 'sold';
export type LeadStatus = 'new' | 'contacted' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost';
export type PriorityLevel = 'hot' | 'warm' | 'cold';
export type TaskPriority = 'high' | 'medium' | 'low';
export type DealStage = 'token' | 'agreement' | 'payments' | 'transfer' | 'closed';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'JazzCash' | 'Easypaisa';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  requirement: string;
  propertyType: PropertyType;
  location: string;
  budgetPkr: number;
  source: 'WhatsApp' | 'Walk-in' | 'Facebook' | 'Zameen' | 'Referral' | 'Website';
  status: LeadStatus;
  agentId: string;
  agentName: string;
  priority: PriorityLevel;
  nextFollowUp: string;
  notes: string;
  createdAt: string;
  timeline: { date: string; action: string; user: string }[];
}

export interface Property {
  id: string;
  title: string;
  location: string;
  society: string;
  type: PropertyType;
  sizeMarla: number;
  pricePkr: number;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  purpose: 'sale' | 'rent';
  rentMonthlyPkr?: number;
  isPublished: boolean;
  agentId: string;
  agentName: string;
  ownerName: string;
  ownerPhone: string;
  daysOnMarket: number;
  features: string[];
  documents: { title: string; verified: boolean; type: string }[];
}

export interface Plot {
  id: string;
  plotNumber: string;
  block: string;
  society: string;
  sizeMarla: number;
  pricePkr: number;
  status: PropertyStatus;
  isCorner: boolean;
  isParkFacing: boolean;
  bookedBy?: string;
}

export interface Society {
  id: string;
  name: string;
  location: string;
  totalPlots: number;
  soldPlots: number;
  bookedPlots: number;
  availablePlots: number;
  blocks: {
    name: string;
    plots: Plot[];
  }[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  cnicMasked: string;
  type: 'buyer' | 'seller' | 'investor' | 'tenant';
  kyc: {
    cnicVerified: boolean;
    photoVerified: boolean;
    sourceOfFundsVerified: boolean;
  };
  linkedLeadsCount: number;
  dealsCount: number;
  totalVolumePkr: number;
  notes: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  dealNumber: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
  agreedPricePkr: number;
  tokenPkr: number;
  stage: DealStage;
  agentName: string;
  commissionPkr: number;
  commissionSplit: {
    agentPercent: number;
    companyPercent: number;
  };
  commissionStatus: 'pending' | 'approved' | 'paid';
  date: string;
}

export interface InstallmentItem {
  installmentNumber: number;
  dueDate: string;
  amountPkr: number;
  status: PaymentStatus;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  receiptNumber?: string;
}

export interface InstallmentPlan {
  id: string;
  dealId: string;
  clientName: string;
  clientPhone: string;
  propertyTitle: string;
  totalPricePkr: number;
  advancePkr: number;
  installmentsCount: number;
  frequency: 'monthly' | 'quarterly';
  startDate: string;
  installments: InstallmentItem[];
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  clientName: string;
  clientCnic: string;
  propertyTitle: string;
  amountPkr: number;
  amountInWords: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  receivedBy: string;
  notes: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  isVoided?: boolean;
  voidReason?: string;
}

export interface RentalLease {
  id: string;
  propertyTitle: string;
  location: string;
  tenantName: string;
  tenantPhone: string;
  monthlyRentPkr: number;
  securityDepositPkr: number;
  leaseStart: string;
  leaseEnd: string;
  rentDueDay: number;
  status: 'active' | 'renewal_pending' | 'vacant';
  lastPaymentDate: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  assignee: string;
  linkedEntity?: string;
}

export interface SiteVisit {
  id: string;
  clientName: string;
  clientPhone: string;
  propertyTitle: string;
  location: string;
  date: string;
  time: string;
  agentName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'office' | 'chai_refreshment' | 'fuel_travel' | 'marketing' | 'advance';
  amountPkr: number;
  date: string;
  paidBy: string;
}

export interface WishlistItem {
  id: string;
  text: string;
  category: 'feature' | 'pain_point' | 'customization' | 'pricing';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  activeDealsCount: number;
  monthlyTargetPkr: number;
  achievedPkr: number;
}

export interface DealerSettings {
  dealerName: string;
  tagline: string;
  area: string;
  city: string;
  phone: string;
  email: string;
  address: string;
  primaryColor: string; // hex
  currency: 'PKR';
  areaUnit: 'marla' | 'kanal' | 'sqft';
  lastBackup: string;
  is2FAEnabled: boolean;
  websitePublishedIds: string[];
}
