import { GameAccount, Game, Testimonial, User } from '../types';

export const games: Game[] = [
  {
    id: 'codm',
    name: 'Call of Duty Mobile',
    shortName: 'CODM',
    icon: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Popular battle royale and multiplayer shooter',
    platforms: ['iOS', 'Android'],
    color: '#FF6B35'
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    shortName: 'PUBG',
    icon: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Battle royale gaming at its finest',
    platforms: ['iOS', 'Android'],
    color: '#FFB800'
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    shortName: 'FF',
    icon: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Fast-paced survival shooter',
    platforms: ['iOS', 'Android'],
    color: '#00D4FF'
  },
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'VAL',
    icon: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Tactical FPS with unique agents',
    platforms: ['PC'],
    color: '#FF4655'
  }
];

export const mockSeller: User = {
  id: '1',
  username: 'ProGamer_2024',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  rating: 4.9,
  totalSales: 127,
  joinedAt: '2023-01-15',
  isVerified: true
};

export const featuredListings: GameAccount[] = [
  {
    id: '1',
    title: 'Legendary CODM Account - All Mythic Weapons',
    game: 'Call of Duty Mobile',
    platform: 'iOS',
    level: 150,
    price: 299,
    description: 'Premium account with all mythic weapons, legendary skins, and max level progression.',
    images: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    features: ['All Mythic Weapons', 'Legendary Skins', 'Max Battle Pass', 'Rare Calling Cards'],
    linkedAccounts: [
      { platform: 'Facebook', isLinked: true, isUnlinkable: true },
      { platform: 'Google', isLinked: false, isUnlinkable: false }
    ],
    seller: mockSeller,
    isVerified: true,
    hasEscrow: true,
    createdAt: '2024-01-20',
    tags: ['mythic', 'legendary', 'maxed']
  },
  {
    id: '2',
    title: 'Conqueror PUBG Account - Season 25',
    game: 'PUBG Mobile',
    platform: 'Android',
    level: 85,
    price: 189,
    description: 'Conqueror tier account with exclusive skins and achievements.',
    images: [
      'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    features: ['Conqueror Tier', 'Exclusive Skins', 'Rare Outfits', 'Achievement Titles'],
    linkedAccounts: [
      { platform: 'Facebook', isLinked: true, isUnlinkable: false }
    ],
    seller: mockSeller,
    isVerified: true,
    hasEscrow: true,
    createdAt: '2024-01-18',
    tags: ['conqueror', 'ranked', 'skins']
  },
  {
    id: '3',
    title: 'Grandmaster Free Fire - Rare Bundles',
    game: 'Free Fire',
    platform: 'iOS',
    level: 72,
    price: 149,
    description: 'High-rank Free Fire account with exclusive bundles and diamonds.',
    images: [
      'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    ],
    features: ['Grandmaster Rank', 'Rare Bundles', '50k+ Diamonds', 'Exclusive Pets'],
    linkedAccounts: [
      { platform: 'Google', isLinked: true, isUnlinkable: true }
    ],
    seller: mockSeller,
    isVerified: true,
    hasEscrow: true,
    createdAt: '2024-01-15',
    tags: ['grandmaster', 'diamonds', 'bundles']
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    user: 'Alex_Gaming',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Bought my dream CODM account through GameTrust. The escrow system made me feel completely secure. Amazing service!',
    rating: 5,
    game: 'CODM'
  },
  {
    id: '2',
    user: 'Sarah_Pro',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Sold 3 accounts here already. The verification process is thorough and buyers trust the platform. Highly recommend!',
    rating: 5,
    game: 'PUBG'
  },
  {
    id: '3',
    user: 'Mike_FF',
    avatar: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Fast, secure, and professional. Got exactly what was advertised. This is how account trading should be done.',
    rating: 5,
    game: 'Free Fire'
  }
];