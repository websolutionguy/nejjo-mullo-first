import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UserRole = 'ADMIN' | 'INVESTOR' | 'FARMER' | 'RETAILER' | 'CONSUMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: {
    district: string;
    thana: string;
  };
  // Investor specific
  investorType?: string;
  capacityRange?: string;
  preferences?: string[];
  nidNumber?: string;
  dob?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bkashNumber?: string;
  annualIncomeRange?: string;
  sourceOfFunds?: string;
  tinNumber?: string;
  phone?: string;
  country?: string;
  city?: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  location: string;
  targetAmount: number;
  raisedAmount: number;
  investorsCount: number;
  image: string;
  category: string;
  returns: string;
  duration: string;
  highlights: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  fullDescription: string;
  rating: number;
  reviews: number;
  features: string[];
  farmerId: string;
  harvestDate?: string;
  quantity?: number;
  unit?: string;
  farmerPrice?: number;
  marketInsights?: {
    transportationCost: string;
    warehouseCost: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  customerInfo: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    deliveryMethod: 'inside' | 'outside';
  };
  paymentMethod: 'cod';
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentId: string | null;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'danger';
}
