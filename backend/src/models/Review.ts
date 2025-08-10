import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isHelpful: number;
  isReported: boolean;
  reportReason?: string;
  adminResponse?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  isHelpful: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    trim: true
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ buyer: 1 });
reviewSchema.index({ seller: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVisible: 1 });
reviewSchema.index({ createdAt: -1 });

// Ensure one review per buyer per product
reviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);