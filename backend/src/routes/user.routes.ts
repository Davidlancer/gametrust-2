import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { authenticate } from '../modules/auth/auth.middleware';

const router = Router();

// GET /api/user/me - Get current user profile
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    // Mock response - in real app, get user from req.user
    const response: ApiResponse = {
      success: true,
      data: {
        id: "64e3a1b2c4d5e6f7g8h9i0j1",
        username: "john_doe",
        email: "john@example.com",
        role: "buyer",
        firstName: "John",
        lastName: "Doe",
        avatar: null,
        bio: "Gaming enthusiast",
        country: "US",
        isEmailVerified: true,
        memberSince: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// PUT /api/user/me - Update current user profile
router.put('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const { username, email, firstName, lastName, bio, country } = req.body;
    
    // Mock response - in real app, update user in database
    const response: ApiResponse = {
      success: true,
      message: "Profile updated successfully",
      data: {
        id: "64e3a1b2c4d5e6f7g8h9i0j1",
        username: username || "john_doe",
        email: email || "john@example.com",
        firstName: firstName || "John",
        lastName: lastName || "Doe",
        bio: bio || "Gaming enthusiast",
        country: country || "US",
        updatedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating user profile:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to update profile'
    };
    res.status(500).json(response);
  }
});

// DELETE /api/user/me - Delete current user account
router.delete('/me', authenticate, async (req: Request, res: Response) => {
  try {
    // Mock response - in real app, delete user from database
    const response: ApiResponse = {
      success: true,
      message: "Account deleted successfully"
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting user account:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to delete account'
    };
    res.status(500).json(response);
  }
});

// GET /api/user/:sellerId - Get seller profile
router.get('/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Mock response for now - replace with actual database query
    const response: ApiResponse = {
      success: true,
      data: {
        id: sellerId,
        username: 'sample_seller',
        email: 'seller@example.com',
        avatar: null,
        bio: 'Sample seller bio',
        country: 'US',
        rating: 4.5,
        totalReviews: 10,
        totalSales: 25,
        successfulSales: 23,
        isVerified: true,
        verificationLevel: 'verified',
        memberSince: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        favoriteGames: ['Game 1', 'Game 2'],
        gamingPlatforms: ['PC', 'Console'],
        activeListings: [],
        recentReviews: []
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

export { router as userRoutes };