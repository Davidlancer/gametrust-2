import express, { Request, Response } from 'express';
import { authenticate } from '../modules/auth/auth.middleware';
import { ApiResponse } from '../types';

const router = express.Router();

// GET /api/listing/:id - Get single listing
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response
    const mockListing = {
      id,
      title: "Epic Gaming Account - Level 85",
      description: "High-level gaming account with rare items and achievements",
      price: 299.99,
      currency: "USD",
      accountLevel: 85,
      platform: "PC",
      accountEmail: "account@example.com",
      status: "ACTIVE",
      images: ["image1.jpg", "image2.jpg"],
      proofImages: ["proof1.jpg"],
      seller: {
        id: "seller123",
        username: "pro_seller",
        profile: {
          displayName: "Pro Seller",
          avatar: "avatar.jpg",
          rating: 4.8,
          totalSales: 150
        }
      },
      game: {
        id: "game123",
        name: "Epic Game",
        slug: "epic-game",
        imageUrl: "game.jpg"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response: ApiResponse = {
      success: true,
      message: 'Listing retrieved successfully',
      data: mockListing
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve listing'
    };
    res.status(500).json(response);
  }
});

// GET /api/listing/related - Get related listings
router.get('/related', async (req: Request, res: Response) => {
  try {
    const { gameId, excludeId } = req.query;
    
    // Mock response
    const mockRelatedListings = [
      {
        id: "related1",
        title: "Similar Gaming Account",
        price: 199.99,
        currency: "USD",
        images: ["related1.jpg"],
        game: {
          name: "Epic Game",
          imageUrl: "game.jpg"
        }
      },
      {
        id: "related2",
        title: "Another Great Account",
        price: 349.99,
        currency: "USD",
        images: ["related2.jpg"],
        game: {
          name: "Epic Game",
          imageUrl: "game.jpg"
        }
      }
    ];

    const response: ApiResponse = {
      success: true,
      message: 'Related listings retrieved successfully',
      data: mockRelatedListings
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve related listings'
    };
    res.status(500).json(response);
  }
});

// GET /api/listing - Get all listings with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { game, minPrice, maxPrice, platform, sort, page = 1, limit = 20 } = req.query;
    
    // Mock response
    const mockListings = [
      {
        id: "listing1",
        title: "Premium Gaming Account",
        description: "High-level account with premium features",
        price: 299.99,
        currency: "USD",
        accountLevel: 85,
        platform: "PC",
        status: "ACTIVE",
        images: ["listing1.jpg"],
        seller: {
          username: "seller1",
          profile: {
            displayName: "Seller One",
            rating: 4.8
          }
        },
        game: {
          name: "Epic Game",
          imageUrl: "game.jpg"
        },
        createdAt: new Date().toISOString()
      },
      {
        id: "listing2",
        title: "Advanced Gaming Account",
        description: "Account with rare achievements",
        price: 199.99,
        currency: "USD",
        accountLevel: 70,
        platform: "Console",
        status: "ACTIVE",
        images: ["listing2.jpg"],
        seller: {
          username: "seller2",
          profile: {
            displayName: "Seller Two",
            rating: 4.5
          }
        },
        game: {
          name: "Another Game",
          imageUrl: "game2.jpg"
        },
        createdAt: new Date().toISOString()
      }
    ];

    const response: ApiResponse = {
      success: true,
      message: 'Listings retrieved successfully',
      data: {
        listings: mockListings,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: 50,
          totalPages: 3
        }
      }
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve listings'
    };
    res.status(500).json(response);
  }
});

// POST /api/listing - Create new listing
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const listingData = req.body;
    
    // Mock response
    const mockNewListing = {
      id: "new_listing_123",
      ...listingData,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response: ApiResponse = {
      success: true,
      message: 'Listing created successfully',
      data: mockNewListing
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to create listing'
    };
    res.status(500).json(response);
  }
});

export default router;