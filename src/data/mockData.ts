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

// Mock transaction data for review eligibility
export const mockTransactions = [
  {
    id: 'txn_001',
    buyerId: 'buyer_123',
    sellerId: '1',
    listingId: '1',
    status: 'completed',
    escrowReleased: true,
    completedAt: '2024-01-15T10:30:00Z',
    hasReviewed: false
  },
  {
    id: 'txn_002',
    buyerId: 'buyer_456',
    sellerId: '1',
    listingId: '2',
    status: 'completed',
    escrowReleased: true,
    completedAt: '2024-01-10T14:20:00Z',
    hasReviewed: true
  }
];

// Mock current user data
export const mockCurrentUser = {
  id: 'buyer_123',
  username: 'CurrentUser_2024',
  isAuthenticated: true
};

// Enhanced review data with more details
export const mockReviews = [
  {
    id: 'rev_001',
    buyerId: 'buyer_456',
    buyerUsername: 'GamerX_2024',
    sellerId: '1',
    transactionId: 'txn_002',
    rating: 5,
    comment: 'Amazing seller! Account was exactly as described. Fast delivery and great communication throughout.',
    accountPurchased: 'Legendary CODM Account',
    createdAt: '2024-01-16T10:30:00Z',
    verified: true
  },
  {
    id: 'rev_002',
    buyerId: 'buyer_789',
    buyerUsername: 'PUBGPro_99',
    sellerId: '1',
    transactionId: 'txn_003',
    rating: 5,
    comment: 'Very professional. Account works perfectly and all features were as promised. Highly recommend!',
    accountPurchased: 'Conqueror PUBG Account',
    createdAt: '2024-01-12T16:45:00Z',
    verified: true
  },
  {
    id: 'rev_003',
    buyerId: 'buyer_101',
    buyerUsername: 'FireFighter_X',
    sellerId: '1',
    transactionId: 'txn_004',
    rating: 4,
    comment: 'Good account, minor delay in delivery but seller communicated well. Overall satisfied.',
    accountPurchased: 'Grandmaster Free Fire',
    createdAt: '2024-01-08T09:15:00Z',
    verified: true
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

// Enhanced transaction data for wallet functionality
export const mockWalletTransactions = [
  {
    id: 'txn_wallet_001',
    type: 'purchase',
    amount: -70000,
    status: 'completed',
    date: '2024-01-20T10:30:00Z',
    relatedListing: {
      title: 'CODM Maxed-Out Account',
      listingId: 'listing_324'
    },
    counterparty: {
      username: 'GhostSniper007',
      userId: 'user_098'
    },
    reference: 'PUR_001324'
  },
  {
    id: 'txn_wallet_002',
    type: 'sale',
    amount: 45000,
    status: 'completed',
    date: '2024-01-19T14:15:00Z',
    relatedListing: {
      title: 'PUBG Mobile Conqueror Account',
      listingId: 'listing_225'
    },
    counterparty: {
      username: 'BattleRoyaleFan',
      userId: 'user_156'
    },
    reference: 'SAL_002225'
  },
  {
    id: 'txn_wallet_003',
    type: 'escrow_hold',
    amount: -28500,
    status: 'pending',
    date: '2024-01-18T16:45:00Z',
    relatedListing: {
      title: 'Free Fire Grandmaster Bundle',
      listingId: 'listing_187'
    },
    counterparty: {
      username: 'FireStormX',
      userId: 'user_203'
    },
    reference: 'ESC_003187'
  },
  {
    id: 'txn_wallet_004',
    type: 'withdrawal',
    amount: -30000,
    status: 'completed',
    date: '2024-01-17T11:20:00Z',
    relatedListing: null,
    counterparty: null,
    reference: 'WTH_004001',
    bankDetails: 'GTBank ****1234'
  },
  {
    id: 'txn_wallet_005',
    type: 'refund',
    amount: 22000,
    status: 'completed',
    date: '2024-01-16T09:30:00Z',
    relatedListing: {
      title: 'Valorant Immortal Account',
      listingId: 'listing_098'
    },
    counterparty: {
      username: 'TacticalShooter',
      userId: 'user_087'
    },
    reference: 'REF_005098'
  },
  {
    id: 'txn_wallet_006',
    type: 'sale',
    amount: 15000,
    status: 'completed',
    date: '2024-01-15T13:45:00Z',
    relatedListing: {
      title: 'Mobile Legends Epic Account',
      listingId: 'listing_156'
    },
    counterparty: {
      username: 'MLBBPro',
      userId: 'user_234'
    },
    reference: 'SAL_006156'
  },
  {
    id: 'txn_wallet_007',
    type: 'purchase',
    amount: -35000,
    status: 'in_escrow',
    date: '2024-01-14T08:15:00Z',
    relatedListing: {
      title: 'Clash of Clans Max TH15',
      listingId: 'listing_289'
    },
    counterparty: {
      username: 'ClanWarrior',
      userId: 'user_145'
    },
    reference: 'PUR_007289'
  },
  {
    id: 'txn_wallet_008',
    type: 'withdrawal',
    amount: -25000,
    status: 'failed',
    date: '2024-01-13T15:30:00Z',
    relatedListing: null,
    counterparty: null,
    reference: 'WTH_008002',
    bankDetails: 'Access Bank ****5678'
  }
];

// Mock reported sellers data
export const mockReportedSellers = [
  {
    id: 'report_001',
    reporterId: 'buyer_123',
    sellerId: '2',
    reason: 'scam',
    comment: 'Account was different from listing description.',
    timestamp: new Date('2024-01-20T10:30:00Z'),
    status: 'pending' // pending, reviewed, resolved
  },
  {
    id: 'report_002',
    reporterId: 'buyer_456',
    sellerId: '3',
    reason: 'abusive',
    comment: 'Seller was rude and threatening in messages.',
    timestamp: new Date('2024-01-19T15:45:00Z'),
    status: 'reviewed'
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