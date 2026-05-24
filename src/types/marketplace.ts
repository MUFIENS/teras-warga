import { Database } from './database.types';
import { Address } from 'viem';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type MarketItem = Database['public']['Tables']['market_items']['Row'];

export interface SellerProfile extends Profile {
  // Extending the base profile with specific seller trust metrics we might calculate
  total_sales?: number;
  rating?: number;
  crypto_wallet: string | null;
}

export interface MarketReview {
  id: string;
  item_id: string;
  reviewer_id: string;
  rating: number; // 1 to 5
  comment: string | null;
  created_at: string;
  reviewer: {
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
}

export type PaymentMethod = 'fiat' | 'crypto';
export type OrderStatus = 'pending' | 'verifying' | 'completed' | 'cancelled' | 'disputed';

export interface MarketOrder {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  payment_method: PaymentMethod;
  payment_amount: number;
  payment_currency: string;
  status: OrderStatus;
  fiat_proof_url?: string | null;
  crypto_tx_hash?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductItem extends MarketItem {
  seller: SellerProfile;
  reviews?: MarketReview[];
}

export enum Web3PaymentStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  PREPARING = 'PREPARING',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  MINING = 'MINING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
