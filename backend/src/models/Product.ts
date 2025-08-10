import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  condition: 'new' | 'used' | 'refurbished';
  platform?: string; // Gaming platform (PS5, Xbox, PC, etc.)
  genre?: string; // Game genre
  seller: mongoose.Types.ObjectId;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  downloadLink?: string; // For digital products
  gameKey?: string; // For game keys
  specifications?: {
    [key: string]: string;
  };
  shipping?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    slug: string;
  };
  stats: {
    views: number;
    likes: number;
    purchases: number;
    rating: number;
    reviewCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'games',
      'consoles',
      'accessories',
      'merchandise',
      'digital-content',
      'collectibles',
      'pc-components',
      'mobile-games'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    type: String,
    required: true
  }],
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new'
  },
  platform: {
    type: String,
    enum: [
      'PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch',
      'PC', 'Mobile', 'VR', 'Retro', 'Multi-platform'
    ]
  },
  genre: {
    type: String,
    enum: [
      'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing',
      'Simulation', 'Puzzle', 'Fighting', 'Shooter', 'Horror',
      'Platformer', 'MMO', 'Indie', 'Casual'
    ]
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  downloadLink: {
    type: String,
    trim: true
  },
  gameKey: {
    type: String,
    trim: true
  },
  specifications: {
    type: Map,
    of: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      min: 0
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    }
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ platform: 1, genre: 1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'stats.rating': -1 });

// Generate slug from title before saving
productSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.seo?.slug) {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    if (!this.seo) this.seo = { slug: '', metaTitle: '', metaDescription: '' };
    this.seo.slug = `${slug}-${Date.now()}`;
  }
  next();
});

// Update seller stats when product is purchased
productSchema.methods.updatePurchaseStats = function() {
  this.stats.purchases += 1;
  return this.save();
};

export const Product = mongoose.model<IProduct>('Product', productSchema);