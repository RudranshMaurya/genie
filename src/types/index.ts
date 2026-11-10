export type WishStatus =
  | 'WISH RECEIVED'
  | 'MAGIC IN PROGRESS'
  | 'COMING SOON'
  | 'WISH GRANTED'
  | 'ON HOLD'
  | 'UNDER CONSIDERATION';

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
  completedAt?: string;
  expectedCompletionAt?: string; // ISO string date / datetime
  status: WishStatus;
  adminResponse?: string;
  priority?: 'normal' | 'high' | 'special';
  userUid?: string;
  userName?: string;
}

export interface GenieMessage {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  active: boolean;
  author?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export const WISH_CATEGORIES = [
  'Places I want to visit',
  'Things I want',
  'Experiences',
  'Food and surprises',
  'Dates and memories',
  'Little requests',
  'Dreams and adventures',
  'Something else',
] as const;

export type WishCategory = typeof WISH_CATEGORIES[number];
