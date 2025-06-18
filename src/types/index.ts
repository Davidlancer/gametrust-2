// Core types for the GameTrust marketplace
export interface GameAccount {
  id: string;
  title: string;
  game: string;
  platform: string;
  level: number;
  price: number;
  description: string;
  images: string[];
  videoUrl?: string;
  features: string[];
  linkedAccounts: LinkedAccount[];
  seller: User;
  isVerified: boolean;
  hasEscrow: boolean;
  createdAt: string;
  tags: string[];
}

export interface LinkedAccount {
  platform: string;
  isLinked: boolean;
  isUnlinkable: boolean;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  totalSales: number;
  joinedAt: string;
  isVerified: boolean;
}

export interface Game {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  platforms: string[];
  color: string;
}

export interface Testimonial {
  id: string;
  user: string;
  avatar: string;
  content: string;
  rating: number;
  game: string;
}

export interface FilterOptions {
  game?: string;
  platform?: string;
  minPrice?: number;
  maxPrice?: number;
  verified?: boolean;
  escrow?: boolean;
}