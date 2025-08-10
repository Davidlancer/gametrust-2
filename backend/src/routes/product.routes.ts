import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { authenticate } from '../modules/auth/auth.middleware';

const router = Router();

// GET /api/products - Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { featured, limit } = req.query;
    
    // Mock featured listings data
    const allProducts = [
      {
        id: "64e3a1b2c4d5e6f7g8h9i0j1",
        title: "Legendary Fortnite Account",
        price: 299.99,
        description: "Rare skins, 500+ wins, Battle Pass items",
        images: ["https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400"],
        sellerId: "64e3a1b2c4d5e6f7g8h9i0j2",
        category: "Gaming Account",
        condition: "Excellent",
        game: "Fortnite",
        level: 250,
        rating: 4.8,
        views: 1250,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "64e3a1b2c4d5e6f7g8h9i0j3",
        title: "Valorant Radiant Account",
        price: 599.99,
        description: "Radiant rank, all agents unlocked, premium skins",
        images: ["https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400"],
        sellerId: "64e3a1b2c4d5e6f7g8h9i0j4",
        category: "Gaming Account",
        condition: "Perfect",
        game: "Valorant",
        level: 180,
        rating: 4.9,
        views: 890,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "64e3a1b2c4d5e6f7g8h9i0j5",
        title: "League of Legends Diamond",
        price: 199.99,
        description: "Diamond rank, 150+ champions, rare skins",
        images: ["https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=400"],
        sellerId: "64e3a1b2c4d5e6f7g8h9i0j6",
        category: "Gaming Account",
        condition: "Great",
        game: "League of Legends",
        level: 120,
        rating: 4.7,
        views: 650,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    let products = allProducts;
    
    // Filter by featured if requested
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit as string);
      if (!isNaN(limitNum)) {
        products = products.slice(0, limitNum);
      }
    }

    const response: ApiResponse = {
      success: true,
      data: products // Return array directly, not nested in products object
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      data: [] // Always return empty array on error
    };
    res.status(500).json(response);
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response - in real app, fetch from database by ID
    const response: ApiResponse = {
      success: true,
      data: {
        id: id,
        title: "PS5",
        price: 499.99,
        description: "Brand new PlayStation 5 console with controller",
        images: ["/ps5.jpg", "/ps5-controller.jpg"],
        sellerId: "64e3a1b2c4d5e6f7g8h9i0j2",
        category: "Gaming Console",
        condition: "New",
        specifications: {
          brand: "Sony",
          model: "PlayStation 5",
          storage: "825GB SSD",
          color: "White"
        },
        seller: {
          username: "gaming_seller",
          rating: 4.8,
          totalSales: 150
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching product:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Product not found'
    };
    res.status(404).json(response);
  }
});

// POST /api/products - Create new product (requires authentication)
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, price, description, images, category, condition, specifications } = req.body;
    
    // Basic validation
    if (!title || !price || !description) {
      const response: ApiResponse = {
        success: false,
        message: 'Title, price, and description are required'
      };
      res.status(400).json(response);
      return;
    }
    
    // Mock response - in real app, save to database
    const response: ApiResponse = {
      success: true,
      message: "Product created successfully",
      data: {
        id: "64e3a1b2c4d5e6f7g8h9i0j5",
        title: title,
        price: price,
        description: description,
        images: images || [],
        category: category || "Uncategorized",
        condition: condition || "Used",
        specifications: specifications || {},
        sellerId: "current_user_id", // In real app, get from req.user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating product:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to create product'
    };
    res.status(500).json(response);
  }
});

// PUT /api/products/:id - Update product (requires authentication)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, price, description, images, category, condition, specifications } = req.body;
    
    // Mock response - in real app, update in database
    const response: ApiResponse = {
      success: true,
      message: "Product updated successfully",
      data: {
        id: id,
        title: title || "Xbox Series X - Updated",
        price: price || 479.99,
        description: description || "Updated description",
        images: images || ["/xbox.jpg"],
        category: category || "Gaming Console",
        condition: condition || "Like New",
        specifications: specifications || {},
        sellerId: "current_user_id", // In real app, verify ownership
        updatedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating product:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to update product'
    };
    res.status(500).json(response);
  }
});

// DELETE /api/products/:id - Delete product (requires authentication)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response - in real app, delete from database
    const response: ApiResponse = {
      success: true,
      message: "Product deleted successfully",
      data: {
        deletedProductId: id,
        deletedAt: new Date().toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to delete product'
    };
    res.status(500).json(response);
  }
});

export default router;