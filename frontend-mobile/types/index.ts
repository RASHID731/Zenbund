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
  userName?: string;
  userProfilePicture?: string;
  // Populated relationships (not available in backend response)
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
  // Populated relationships (not available in backend response)
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
  // Populated relationships (not available in backend response)
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
  // Populated relationships (not available in backend response)
  user?: User;
  thread?: Thread;
  parent?: Comment;
  replies?: Comment[];
}

export interface Chat {
  id: number;
  user1Id: number;
  user2Id: number;
  user1Name?: string;
  user1ProfilePicture?: string;
  user2Name?: string;
  user2ProfilePicture?: string;
  createdAt: string;
  updatedAt: string;
  // Populated relationships (not available in backend response)
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
  // Populated relationships (not available in backend response)
  sender?: User;
  chat?: Chat;
}

export interface Wishlist {
  id: number;
  userId: number;
  offerId: number;
  addedAt: string;
  // Populated relationships (not available in backend response)
  user?: User;
  offer?: Offer;
}

// Pagination types
export interface PagedOffersResponse {
  offers: Offer[];
  currentPage: number;
  pageSize: number;
  totalOffers: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type SortOption = 'mostRecent' | 'priceLowToHigh' | 'priceHighToLow' | 'mostWishlisted';

export interface OfferFilters {
  minPrice?: number;
  maxPrice?: number;
  sortBy: SortOption;
}
