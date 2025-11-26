// Core types for the Zenbund app
// Based on backend data schema

export interface User {
  id: number;
  email: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  university: string;
  major: string;
  year?: string;
  instagramLink?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
}

export type OfferStatus = 'available' | 'sold';

export interface Offer {
  id: number;
  userId: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  pickupLocation: string;
  imageUrls: string[];
  status: OfferStatus;
  wishlistCount: number;
  createdAt: string;
  updatedAt: string;
  // Populated relationships
  user?: User;
  category?: Category;
}

export interface Thread {
  id: number;
  emoji: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  // Populated relationships
  members?: User[];
  comments?: Comment[];
}

export interface ThreadMember {
  id: number;
  userId: number;
  threadId: number;
  postAnonymously: boolean;
  joinedAt: string;
  // Convenience fields from backend response
  threadName?: string;
  threadEmoji?: string;
  // Populated relationships
  user?: User;
  thread?: Thread;
}

export interface Comment {
  id: number;
  threadId: number;
  userId: number;
  parentCommentId?: number;
  text: string;
  isAnonymous: boolean;
  likes: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  // Populated relationships
  user?: User;
  thread?: Thread;
  parent?: Comment;
  replies?: Comment[];
}

export interface Chat {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  updatedAt: string;
  // Populated relationships
  user1?: User;
  user2?: User;
  messages?: Message[];
  lastMessage?: Message;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  text: string;
  createdAt: string;
  // Populated relationships
  sender?: User;
  chat?: Chat;
}

export interface Wishlist {
  id: number;
  userId: number;
  offerId: number;
  addedAt: string;
  // Populated relationships
  user?: User;
  offer?: Offer;
}

// Category mapping helpers (temporary until backend provides categories)
export const CATEGORY_MAP: Record<number, { name: string; emoji: string }> = {
  1: { name: 'Dorm', emoji: '🏠' },
  2: { name: 'Fashion', emoji: '👕' },
  3: { name: 'School', emoji: '📚' },
  4: { name: 'Electronics', emoji: '💻' },
  5: { name: 'Gaming', emoji: '🎮' },
  6: { name: 'Other', emoji: '📦' },
};

export const CATEGORY_NAME_TO_ID: Record<string, number> = {
  'Dorm': 1,
  'Fashion': 2,
  'School': 3,
  'Electronics': 4,
  'Gaming': 5,
  'Other': 6,
  'Mathematics': 3, // Map to School
  'Furniture': 1, // Map to Dorm
  'Clothing': 2, // Map to Fashion
};
